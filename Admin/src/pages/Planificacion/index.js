import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button
} from "reactstrap";
import MetricoolPanel from 'components/Metricool/MetricoolPanel';
import { supabase } from '../../supabaseClient';

const Dashboard = () => {
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
        .eq("email", user.email) // puedes usar .eq("id", user.id) si usas ID como clave
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
      <div className="page-content">
        <Container fluid={true}>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Estadísticas de Metricool</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">7AM Digital</li>
                </ol>
              </Col>
            </Row>
          </div>
          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  <MetricoolPanel />

                  {/* ✅ Botón debajo del iframe */}
                  {iframeUrl && (
                    <div className="text-center mt-4">
                      <p style={{ fontSize: "14px", color: "#666" }}>
                        Si no se carga automáticamente,&nbsp;
                        <strong>haz clic aquí:</strong>
                      </p>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => window.open(iframeUrl, "_blank")}
                      >
                        Ver en pantalla completa
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any
};

export default Dashboard;
