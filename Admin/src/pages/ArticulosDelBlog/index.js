import PropTypes from 'prop-types';
import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody
} from "reactstrap";

const Home = () => {
  document.title = "Articulos del blog | 7 AM Digital";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Articulos del Blog</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">7AM Digital</li>
                </ol>
              </Col>
            </Row>
          </div>

          {/* Contenedor centrado */}
          <Row 
            className="justify-content-center align-items-center" 
            style={{ minHeight: "60vh" }}
          >
            <Col md={6} lg={4}>
              <Card 
                className="text-center shadow-lg border-0" 
                style={{ 
                  background: "linear-gradient(135deg, #5fd4cfff, #f7c1d2ff)", 
                  color: "#333", 
                  borderRadius: "1rem"
                }}
              >
                <CardBody>
                  <h3 style={{ fontWeight: "bold", letterSpacing: "1px" }}>
                    🚀 Próximamente...
                  </h3>
                  <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    Estamos preparando algo increíble para ti.
                  </p>
                </CardBody>
              </Card>
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
