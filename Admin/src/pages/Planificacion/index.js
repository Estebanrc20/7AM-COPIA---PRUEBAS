import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button
} from "reactstrap";
import MetricoolPanel from 'components/Metricool/MetricoolPanel';
import { supabase } from '../../supabaseClient';

const Home = () => {
  document.title = "Planificación y Analítica | 7 AM Digital";

  const [iframeUrl, setIframeUrl] = useState("");

  useEffect(() => {
    const fetchIframeUrl = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ Usuario no autenticado o error:", userError);
        return;
      }

      console.log("✅ Usuario logueado:", user.email);

      const { data, error } = await supabase
        .from("users_data")
        .select("metricoolIframe")
        .eq("email", user.email)
        .single();

      if (error) {
        console.error("❌ Error al consultar la tabla users_data:", error);
      } else {
        console.log("✅ iframe encontrado:", data.metricoolIframe);
        setIframeUrl(data.metricoolIframe);
      }
    };

    fetchIframeUrl();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content" style={{ padding: 0 }}>
        <Container fluid className="p-0">
          <Row className="m-0">
            <Col xs={12} className="p-0" style={{ paddingBottom: "100px" }}>
              {/* ✅ Aquí dejamos espacio al final para que no se corte el botón */}
              <MetricoolPanel />

              {iframeUrl && (
                <div className="text-center" style={{ position: 'relative', marginTop: '1rem' }}>
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    Si no se carga automáticamente,&nbsp;
                    <strong>haz clic aquí:</strong>
                  </p>
                  <Button
                    style={{ backgroundColor: '#000b24', borderColor: '#000b24', color: 'white' }}
                    size="sm"
                    onClick={() => window.open(iframeUrl, "_blank")}
                  >
                    Ver en pantalla completa
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

Home.propTypes = {
  t: PropTypes.any
};

export default Home;
