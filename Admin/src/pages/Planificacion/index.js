import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button
} from "reactstrap";
import { supabase } from '../../supabaseClient';

const Home = () => {
  document.title = "Planificación y Analítica | 7 AM Digital";

  const [iframeUrl, setIframeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const topRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState("600px");

  useEffect(() => {
    const fetchIframeUrl = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ Usuario no autenticado o error:", userError);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users_data")
        .select("metricoolIframe")
        .eq("email", user.email)
        .single();

      if (error) {
        console.error("❌ Error al consultar la tabla users_data:", error);
      } else {
        setIframeUrl(data.metricoolIframe);
      }

      setLoading(false);
    };

    fetchIframeUrl();
  }, []);

  useEffect(() => {
    // Calcula la altura disponible para el iframe
    const calculateHeight = () => {
      const topHeight = topRef.current?.offsetTop || 0;
      const padding = 120; // espacio para botones y márgenes
      const availableHeight = window.innerHeight - topHeight - padding;
      setIframeHeight(`${availableHeight}px`);
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  return (
    <React.Fragment>
      <div className="page-content" style={{ padding: 0 }} ref={topRef}>
        <Container fluid className="p-0">
          <Row className="m-0">
            <Col xs={12} className="p-0">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <h4>Cargando estadísticas personalizadas...</h4>
                </div>
              ) : !iframeUrl ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: "#ff4d4f" }}>
                  <h4>No se encontró un iframe configurado para este usuario.</h4>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div
                    style={{
                      flex: 1,
                      overflow: 'auto',
                    }}
                  >
                    <iframe
                      src={iframeUrl}
                      style={{
                        width: '100%',
                        height: iframeHeight,
                        border: 'none',
                      }}
                      title="Estadísticas Metricool"
                    />
                  </div>

                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <p style={{ fontSize: "14px", color: "#666" }}>
                      Si no se carga automáticamente,&nbsp;
                      <strong>haz clic aquí:</strong>
                    </p>
                    <Button
                      style={{
                        backgroundColor: '#000b24',
                        borderColor: '#000b24',
                        color: 'white',
                        padding: '0.5rem 1.2rem',
                        fontSize: '14px'
                      }}
                      size="sm"
                      onClick={() => window.open(iframeUrl, "_blank")}
                    >
                      Ver en pantalla completa
                    </Button>
                  </div>
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
