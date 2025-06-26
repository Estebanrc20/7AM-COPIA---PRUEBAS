import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody
} from "reactstrap";
import { supabase } from "../../supabaseClient";

const Dashboard = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      const { data, error } = await supabase
        .from("users_data")
        .select("nombre")
        .eq("email", user.email)
        .single();

      if (!error && data) {
        setUserName(data.nombre);
      }
    };

    fetchUserName();
  }, []);

  document.title = "Dashboard | 7 AM Digital";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>

          {/* Título y subtítulo */}
          <div className="page-title-box mb-4">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Dashboard</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">7AM Digital</li>
                </ol>
              </Col>
            </Row>
          </div>

          {/* Card de bienvenida (con más espacio) */}
          <Row className="justify-content-center mb-5 mt-2">
            <Col md={10} lg={8}>
              <Card
                className="text-center shadow rounded-4 py-4 px-3"
                style={{
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6"
                }}
              >
                <CardBody>
                  <h2 className="fw-bold mb-3" style={{ color: "#343a40" }}>
                    👋 Bienvenido,{" "}
                    <span style={{ color: "#6C63FF", textTransform: "capitalize" }}>
                      {userName}
                    </span>
                  </h2>
                  <p className="lead text-muted mb-0">
                    Automatiza tus procesos de marketing y concéntrate en vender.
                    <br />
                    Deja que nuestros agentes IA tomen el control del contenido de tus canales digitales.
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Tarjetas con diseño más llamativo */}
          <Row>
            {/* Tarjeta 1 */}
            <Col md={4} className="mb-4">
              <Card
                className="text-center h-100"
                style={{
                  backgroundColor: "#ffffff",
                  border: "2px solid #6C63FF20",
                  borderRadius: "1.2rem",
                  boxShadow: "0 6px 16px rgba(108, 99, 255, 0.08)"
                }}
              >
                <CardBody>
                  <h5 className="text-primary fw-bold">CONTENIDO REDES SOCIALES</h5>
                  <p className="fw-semibold">Haz crecer tus redes</p>
                  <p>Publica contenido organizado sobre temas relacionados con tu negocio y las tendencias.</p>
                </CardBody>
              </Card>
            </Col>

            {/* Tarjeta 2 */}
            <Col md={4} className="mb-4">
              <Card
                className="text-center h-100"
                style={{
                  backgroundColor: "#ffffff",
                  border: "2px solid #6C63FF20",
                  borderRadius: "1.2rem",
                  boxShadow: "0 6px 16px rgba(108, 99, 255, 0.08)"
                }}
              >
                <CardBody>
                  <h5 className="text-primary fw-bold">BLOG WEB CON AJUSTES SEO</h5>
                  <p className="fw-semibold">Aprovecha tu sitio web</p>
                  <p>Artículos pensados para mejorar tu visibilidad y atraer clientes potenciales.</p>
                </CardBody>
              </Card>
            </Col>

            {/* Tarjeta 3 */}
            <Col md={4} className="mb-4">
              <Card
                className="text-center h-100"
                style={{
                  backgroundColor: "#ffffff",
                  border: "2px solid #6C63FF20",
                  borderRadius: "1.2rem",
                  boxShadow: "0 6px 16px rgba(108, 99, 255, 0.08)"
                }}
              >
                <CardBody>
                  <h5 className="text-primary fw-bold">WHATSAPP ENVÍOS MASIVOS</h5>
                  <p className="fw-semibold">Marketing por WhatsApp</p>
                  <p>Mensajes directos para atraer clientes y promocionar tus servicios o productos.</p>
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
