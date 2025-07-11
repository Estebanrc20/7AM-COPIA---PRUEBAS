import PropTypes from 'prop-types';
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Card,
  CardBody
} from "reactstrap";

const Home = props => {
  const [menu, setMenu] = useState(false);
  const toggle = () => setMenu(!menu);

  const ideas = [
    {
      fecha: "31/3/2025",
      formato: "Reel",
      idea: "Resumen del Mes",
      categoria: "Atención",
      pilar: "Inspiracional",
      instrucciones: "Crea un Reel con un resumen del mes que incluya los mejores momentos, logros e hitos alcanzados por la agencia. Agradece a la audiencia por su apoyo."
    },
    {
      fecha: "30/3/2025",
      formato: "Story",
      idea: "Tip Rapido: Mejora en Conversaciones",
      categoria: "Deseo",
      pilar: "Educativo",
      instrucciones: "Publica historias rapidas con tips y herramientas para las conversaciones en una tienda online. Anima a la audiencia a probar y comentar."
    },
    {
      fecha: "29/3/2025",
      formato: "Post",
      idea: "CTA para consultoria de Marketing",
      categoria: "Acción",
      pilar: "Comercial",
      instrucciones: "Crea un post promcionando servicios de consultoria de marketing digital, incluye un CTA contundente para agendar una llamada gratuita."
    }
  ];

  document.title = "Ideas | 7 AM Digital";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Ideas de Contenido</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">7AM Digital</li>
                </ol>
              </Col>
            </Row>
          </div>

          {/* 🔷 Tarjeta informativa */}
          <Card className="mb-4" style={{ backgroundColor: '#e9f2fc', border: 'none', borderRadius: '12px' }}>
            <CardBody>
              <h5 style={{ color: '#2b2f32', fontWeight: 'bold' }}>Contenido para redes</h5>
              <p style={{ marginBottom: 0, color: '#5a5a5a' }}>
                Cada mes te entregaremos nuevas ideas de contenido generadas por nuestro algoritmo de IA, basadas en la información de tu negocio y tus mejores publicaciones en redes sociales.
                Si quieres editar la información de tu negocio puedes ir a la sección <strong>Mi Negocio</strong>.
              </p>
            </CardBody>
          </Card>

          {/* 📊 Tabla de ideas */}
          <Card style={{ backgroundColor: '#e9f2fc', borderRadius: '12px' }}>
            <CardBody>
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th style={{ backgroundColor: '#007bff', color: '#fff' }}>Fecha</th>
                    <th style={{ backgroundColor: '#007bff', color: '#fff' }}>Formato</th>
                    <th style={{ backgroundColor: '#007bff', color: '#fff' }}>Idea</th>
                    <th style={{ backgroundColor: '#007bff', color: '#fff' }}>Categoría</th>
                    <th style={{ backgroundColor: '#007bff', color: '#fff' }}>Pilar</th>
                    <th style={{ backgroundColor: '#007bff', color: '#fff', width: '490px' }}>Instrucciones para crear contenido</th>
                  </tr>
                </thead>
                <tbody>
                  {ideas.map((idea, index) => (
                    <tr key={index}>
                      <td>{idea.fecha}</td>
                      <td>
                        <span style={{
                          backgroundColor: '#cce5ff',
                          color: '#003366',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          display: 'inline-block',
                          fontWeight: 500
                        }}>{idea.formato}</span>
                      </td>
                      <td>{idea.idea}</td>
                      <td>
                        <span style={{
                          backgroundColor: '#d4edda',
                          color: '#155724',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          display: 'inline-block',
                          fontWeight: 500
                        }}>{idea.categoria}</span>
                      </td>
                      <td>
                        <span style={{
                          backgroundColor: '#f8d7da',
                          color: '#721c24',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          display: 'inline-block',
                          fontWeight: 500
                        }}>{idea.pilar}</span>
                      </td>
                      <td>{idea.instrucciones}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>

        </Container>
      </div>
    </React.Fragment>
  );
};

Home.propTypes = {
  t: PropTypes.any
};

export default Home;
