import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Spinner
} from "reactstrap";
import { supabase } from "../../supabaseClient";

const Home = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("Todas");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("plantillas_canva")
        .select("id, formato, tipo, nombre, link_canva, imagen");

      if (error) {
        console.error("Error fetching templates:", error.message);
      } else {
        setTemplates(data || []);
      }
      setLoading(false);
    };

    fetchTemplates();
  }, []);

  const toggle = () => setMenu(!menu);

  const filteredTemplates =
    selectedFormat === "Todas"
      ? templates
      : templates.filter(template => template.formato.toLowerCase() === selectedFormat.toLowerCase());

  // Evita scroll de fondo cuando modal está abierto
  useEffect(() => {
    document.body.style.overflow = selectedTemplate ? "hidden" : "auto";
  }, [selectedTemplate]);

  document.title = "Plantillas | 7 AM Digital";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Plantillas editables canva</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">Cada mes renovamos las plantillas</li>
                </ol>
              </Col>
            </Row>
          </div>

          {/* Dropdown filtro */}
          <Row className="mb-4">
            <Col md={4}>
              <Dropdown isOpen={menu} toggle={toggle}>
                <DropdownToggle caret style={{ backgroundColor: "#000b24", color: "#fff" }}>
                  <i className="mdi mdi-filter"></i> Tipos: {selectedFormat}
                </DropdownToggle>
                <DropdownMenu direction="down">
                  <DropdownItem onClick={() => setSelectedFormat("Todas")}>Todas</DropdownItem>
                  <DropdownItem onClick={() => setSelectedFormat("reel")}>Reel</DropdownItem>
                  <DropdownItem onClick={() => setSelectedFormat("post")}>Post</DropdownItem>
                  <DropdownItem onClick={() => setSelectedFormat("story")}>Story</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>

          {/* Lista de plantillas */}
          {loading ? (
            <div className="text-center">
              <Spinner color="primary" />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <p>No se encontraron plantillas.</p>
          ) : (
            <Row>
              {filteredTemplates.map(template => (
                <Col md={3} className="mb-4" key={template.id}>
                  <Card className="h-100 shadow-sm">
                    <CardBody>
                      <img
                        src={template.imagen}
                        alt={template.nombre}
                        className="img-fluid mb-2"
                        style={{ height: "180px", objectFit: "cover", width: "100%" }}
                      />
                      <h6 className="mb-1">{template.nombre}</h6>
                      <p className="text-muted small mb-2">Formato: {template.formato}</p>
                      <Button
                        style={{ backgroundColor: "#000b24", color: "#fff" }}
                        onClick={() => setSelectedTemplate(template)}>
                        Ver plantilla
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Modal */}
          {selectedTemplate && (
            <div className="modal-backdrop">
              <div className="modal-container">
                <h5 className="mb-3">{selectedTemplate.nombre}</h5>
                <img
                  src={selectedTemplate.imagen}
                  alt={selectedTemplate.nombre}
                  className="img-fluid mb-3 modal-img"
                />
                <Button
                  color="success"
                  block
                  onClick={() => window.open(selectedTemplate.link_canva, "_blank")}
                >
                  Editar en Canva
                </Button>
                <Button
                  color="secondary"
                  block
                  className="mt-2"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </Container>
      </div>

      {/* Estilos del modal */}
      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
          padding: 20px;
        }
        .modal-container {
          background-color: #fff;
          border-radius: 8px;
          padding: 20px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
          text-align: center;
        }
        .modal-container .modal-img {
          max-height: 250px;
          width: auto;
          object-fit: contain;
          margin: 0 auto;
        }
        .btn-success {
          background-color: #00b894 !important;
          border-color: #00b894 !important;
        }
      `}</style>
    </React.Fragment>
  );
};

Home.propTypes = {
  t: PropTypes.any
};

export default Home;
