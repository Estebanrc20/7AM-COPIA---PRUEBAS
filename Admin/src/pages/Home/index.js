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
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const Home = () => {
  const [userName, setUserName] = useState("");
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const navigate = useNavigate();

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

  document.title = "Home | 7 AM Digital";

  const getButtonStyle = (hover) => ({
    backgroundColor: "#000b24",
    borderColor: "#6C63FF",
    color: "#fff",
    borderRadius: "0.5rem",
    padding: "8px 20px",
    marginTop: "1rem",
    transition: "all 0.3s ease-in-out",
    cursor: "pointer"
  });

  const cardStyle = {
    backgroundColor: "#f8f9fa",
    border: "1px solid #dee2e6",
    borderRadius: "1.2rem",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const cardHoverStyle = {
    transform: "scale(1.03)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)"
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <div className="page-title-box mb-4">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Home</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">7AM Digital</li>
                </ol>
              </Col>
            </Row>
          </div>

          {/* Card principal */}
          <Row className="justify-content-center mb-5 mt-2">
            <Col md={10} lg={8}>
              <Card
                className="text-center shadow py-4 px-3"
                style={cardStyle}
              >
                <CardBody>
                  <h2 className="fw-bold mb-3" style={{ color: "#343a40" }}>
                    👋 Bienvenido,{" "}
                    <span style={{ color: "#6C63FF", textTransform: "capitalize" }}>
                      {userName}
                    </span>
                  </h2>
                  <p className="lead text-muted mb-0">
                    KIT 7AM: La forma más fácil de gestionar tus redes con IA.
                    <br />
                    ¿Te cuesta mantener tus redes sociales activas y con contenido de calidad?
                    Con KIT 7AM tienes todo lo que necesitas para crecer en digital de manera simple y automática:
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Cards de opciones */}
          <Row>
            {[
              {
                title: "Ideas de contenido con IA",
                text: "Deja de perder tiempo pensando qué publicar. Cada mes recibirás un cronograma completo de ideas de contenido, generado automáticamente con IA y adaptado a tu negocio.💡Publicaciones listas para inspirar, atraer y conectar con tu audiencia.",
                buttonText: "Ir ahora",
                action: () => navigate("/Ideas")
              },
              {
                title: "Planificador con IA para copys",
                text: "No más bloqueos creativos. Nuestro planificador inteligente no solo organiza tus publicaciones, también incluye un creador de copys con IA para que cada post tenga el texto perfecto: llamativo, profesional y pensado para convertir.📅Planifica, redacta y programa en un solo lugar.",
                buttonText: "Ir ahora",
                action: () => navigate("/Planificacion")
              },
              {
                title: "Plantillas premium en Canva",
                text: "Diseñar contenido nunca fue tan fácil. Accede a una biblioteca exclusiva de plantillas premium en Canva, listas para personalizar con tu logo, colores y estilo.🚀Crea diseños profesionales en minutos, sin necesidad de ser diseñador.",
                buttonText: "Ir ahora",
                action: () => navigate("/Plantillas")
              }
            ].map((card, index) => (
              <Col md={4} className="mb-4" key={index}>
                <Card
                  className="text-center h-100"
                  style={{
                    ...cardStyle,
                    ...(hoveredBtn === `card-${index}` ? cardHoverStyle : {})
                  }}
                  onMouseEnter={() => setHoveredBtn(`card-${index}`)}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  <CardBody>
                    <h5 style={{ color: "#000b24" }} className="fw-bold">
                      {card.title}
                    </h5>
                    <p className="fw-semibold">{card.subtitle}</p>
                    <p>{card.text}</p>
                    <Button
                      style={getButtonStyle(hoveredBtn === index)}
                      onMouseEnter={() => setHoveredBtn(index)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      onClick={card.action || undefined}
                    >
                      {card.buttonText}
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            ))}
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
