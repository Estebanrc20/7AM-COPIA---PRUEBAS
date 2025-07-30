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
  document.title = "Anuncios| 7 AM Digital";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                {/*<h6 className="page-title">Articulos del Blog</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">7AM Digital</li>
                </ol>*/}
              </Col>
            </Row>
          </div>
          <Row>
            <Col md={12}>
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


