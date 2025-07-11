import PropTypes from 'prop-types';
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu
} from "reactstrap";

const templatesData = [
  {
    id: 1,
    title: "Plantilla de Negocios",
    category: "Negocios",
    type: "Feed",
    imageUrl: require ("../../assets/images/plantilla1CANVA.png"),
    canvaLink: "https://www.canva.com/es_es/plantillas/EAFjR0cxy-s-presentacion-propuesta-de-proyecto-de-la-empresa-corporativo-moderno-azul/"
  },
  {
    id: 2,
    title: "Plantilla de Cumpleaños",
    category: "Eventos",
    type: "Feed",
    imageUrl: require ("../../assets/images/plantilla2CANVA.png"),
    canvaLink: "https://www.canva.com/templates/EAFx2rXRLZg-pink-and-purple-fun-playful-illustrative-happy-birthday-greeting-presentation/"
  },
  {
    id: 3,
    title: "Plantilla de Dia de la Madre",
    category: "Fechas Importantes",
    type: "Feed",
    imageUrl: require ("../../assets/images/plantilla3CANVA.png"),
    canvaLink: "https://www.canva.com/templates/EAFOGqv2baE-presentaci-n-dedicatoria-d-a-de-las-madres-floral-azul-y-verde/"
  },
  {
    id: 4,
    title: "Plantilla de Navidad",
    category: "Fechas Importantes",
    type: "Feed",
    imageUrl: require ("../../assets/images/plantilla4CANVA.png"),
    canvaLink: "https://www.canva.com/templates/EAGW1yVyhns-orange-and-yellow-illustration-christmas-presentation/"
  },
  {
    id:5 ,
    title: "Plantilla de Año Nuevo",
    category: "Fechas Importantes",
    type: "Feed",
    imageUrl: require ("../../assets/images/plantilla5CANVA.png"),
    canvaLink: "https://www.canva.com/templates/EAEZ2l0cQ8w-celebrations-around-the-world-pictorial-presentation-in-colorful-picture-style/"
  },

  {id:6,
    title: "Plantilla de Tarjeta de Presentación",
    category: "Marketing",
    type: "Feed",
    imageUrl: require ("../../assets/images/plantilla6CANVA.png"),
    canvaLink: "https://www.canva.com/templates/EAFzil7HTIs-green-modern-business-card/"
  },
];

//import { Link } from "react-router-dom";

// Custom Scrollbar
//import SimpleBar from "simplebar-react";

// import images
/*import plantilla1CANVA from "../../assets/images/plantilla1CANVA.png";
import servicesIcon3 from "../../assets/images/services-icon/03.png";
import servicesIcon4 from "../../assets/images/services-icon/04.png";
import user2 from "../../assets/images/users/user-2.jpg";
import user3 from "../../assets/images/users/user-3.jpg";
import user4 from "../../assets/images/users/user-4.jpg";
import user5 from "../../assets/images/users/user-5.jpg";
import user6 from "../../assets/images/users/user-6.jpg";
import smimg1 from "../../assets/images/small/img-1.jpg";
import smimg2 from "../../assets/images/small/img-2.jpg";*/

// Charts
/*import LineAreaChart from "../AllCharts/apex/lineareachart";
import RadialChart from "../AllCharts/apex/apexdonut";
import Apexdonut from "../AllCharts/apex/apexdonut1";
import SparkLine from "../AllCharts/sparkline/sparkline";
import SparkLine1 from "../AllCharts/sparkline/sparkline1";
import Salesdonut from "../AllCharts/apex/salesdonut";*/


//i18n
//import { withTranslation } from "react-i18next";

const Home = props => {
  const [menu, setMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const toggle = () => {setMenu(!menu);
  };
  const filteredTemplates = selectedCategory === "Todas"
    ? templatesData
    : templatesData.filter(template => template.category === selectedCategory);

  document.title = "Plantillas | 7 AM Digital";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Plantillas Canva</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">7AM Digital</li>
                </ol>
              </Col>
              </Row>
              </div>

              <Row className="mb-4">
            <Col md={4}>
              <Dropdown isOpen={menu} toggle={toggle}>
                <DropdownToggle caret color="info">
                  <i className="mdi mdi-filter"></i> Filtrar por Categoria: {selectedCategory}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => setSelectedCategory("Todas")}>Todas</DropdownItem>
                  <DropdownItem onClick={() => setSelectedCategory("Negocios")}>Negocios</DropdownItem>
                  <DropdownItem onClick={() => setSelectedCategory("Eventos")}>Eventos</DropdownItem>
                  <DropdownItem onClick={() => setSelectedCategory("Fechas Importantes")}>Fechas Importantes</DropdownItem>
                  <DropdownItem onClick={() => setSelectedCategory("Marketing")}>Marketing</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>

          <Row>
            {filteredTemplates.map(template => (
              <Col md={4} className="mb-4" key={template.id}>
                <Card>
                  <CardBody>
                    <img
                      src={template.imageUrl}
                      alt={template.title}
                      className="img-fluid mb-2"
                    />
                    <h6>{template.title}</h6>
                    <Button
                      color="info"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      Ver plantilla
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>

          {selectedTemplate && (
            <div className="modal-backdrop">
              <div className="modal-container">
                <div className="modal-content p-4">
                  <h5>{selectedTemplate.title}</h5>
                  <img
                    src={selectedTemplate.imageUrl}
                    alt={selectedTemplate.title}
                    className="img-fluid mb-3"
                  />
                  <Button
                    color="success"
                    onClick={() => window.open(selectedTemplate.canvaLink, "_blank")}
                  >
                    Editar en Canva
                  </Button>
                  <Button
                    color="secondary"
                    className="ms-2"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
        }
        .modal-container {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
          max-width: 600px;
          width: 100%;
        }
      `}</style>
      
    </React.Fragment>
  );
};


Home.propTypes = {
  t: PropTypes.any
};

// export default withTranslation()(Dashboard);
export default Home;


