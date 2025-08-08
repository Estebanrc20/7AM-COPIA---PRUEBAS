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
                    Automatiza tus procesos de marketing y concéntrate en vender.
                    <br />
                    Deja que nuestros agentes IA tomen el control del contenido de tus canales digitales.
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Cards de opciones */}
          <Row>
            {[
              {
                title: "CONTENIDO REDES SOCIALES",
                subtitle: "Haz crecer tus redes",
                text: "Publica contenido organizado sobre temas relacionados con tu negocio y las tendencias.",
                buttonText: "Ir ahora",
                action: () => navigate("/Planeacion")
              },
              {
                title: "BLOG WEB CON AJUSTES SEO",
                subtitle: "Aprovecha tu sitio web",
                text: "Artículos pensados para mejorar tu visibilidad y atraer clientes potenciales.",
                buttonText: "Proximamente..."
              },
              {
                title: "WHATSAPP ENVÍOS MASIVOS",
                subtitle: "Marketing por WhatsApp",
                text: "Mensajes directos para atraer clientes y promocionar tus servicios o productos.",
                buttonText: "Proximamente..."
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
