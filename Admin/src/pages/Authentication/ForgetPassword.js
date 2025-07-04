import PropTypes from 'prop-types';
import React from "react";
import {
  Row, Col, Alert, Card, CardBody, Container, Form, FormFeedback, Label, Input
} from "reactstrap";

import * as Yup from "yup";
import { useFormik } from "formik";

import { connect, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import withRouter from 'components/Common/withRouter';

import { userForgetPassword } from "../../store/actions";
import logoSm from "../../assets/images/logo7amblanco.png";
import bannerBg from "../../assets/images/Banner1.png"; // ✅ Importa la imagen de fondo

const ForgetPasswordPage = props => {
  const dispatch = useDispatch();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Por favor, introduzca su correo electrónico"),
    }),
    onSubmit: (values) => {
      dispatch(userForgetPassword(values, props.history));
    }
  });

  document.title = "Olvidar contraseña | 7AM Digital";

  // ✅ Estilos de fondo e iluminación
  const backgroundStyle = {
    backgroundImage: `url(${bannerBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const overlayStyle = {
    width: "100%",
    height: "100%",
    backdropFilter: "brightness(0.7)",
    padding: "20px",
  };

  return (
    <React.Fragment>
      <div style={backgroundStyle}>
        <div style={overlayStyle}>
          <div className="home-btn d-none d-sm-block">
            <Link to="/" className="text-light">
              <i className="fas fa-home h2"></i>
            </Link>
          </div>
          <div className="account-pages my-5 pt-5">
            <Container>
              <Row className="justify-content-center">
                <Col md={8} lg={6} xl={4}>
                  <Card className="overflow-hidden">
                    <div className="bg-primary">
                      <div className="text-primary text-center p-4">
                        <h5 className="text-white font-size-20 p-2">Olvidé mi contraseña</h5>
                        <Link to="/index">
                          <img src={logoSm} height="45" alt="logo" />
                        </Link>
                      </div>
                    </div>

                    <CardBody className="p-4">
                      {props.forgetError && (
                        <Alert color="danger" className="mt-4">
                          {props.forgetError}
                        </Alert>
                      )}

                      {props.forgetSuccessMsg && (
                        <Alert color="success" className="mt-4">
                          {props.forgetSuccessMsg}
                        </Alert>
                      )}

                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        className="mt-4"
                      >
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="useremail">Correo electrónico</Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Ingresa tu correo electrónico"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={validation.touched.email && !!validation.errors.email}
                          />
                          {validation.touched.email && validation.errors.email && (
                            <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                          )}
                        </div>

                        <div className="row mb-0">
                          <div className="col-12 text-end">
                            <button className="btn btn-primary w-md waves-effect waves-light" type="submit">
                              Restaurar
                            </button>
                          </div>
                        </div>
                      </Form>
                    </CardBody>
                  </Card>

                  <div className="mt-5 text-center text-white">
                    <p>¿Lo recuerdas? <Link to="/login" className="fw-medium text-info"> Iniciar sesión aquí </Link></p>
                    <p>© {new Date().getFullYear()} 7AM Digital</p>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

ForgetPasswordPage.propTypes = {
  forgetError: PropTypes.any,
  forgetSuccessMsg: PropTypes.any,
  history: PropTypes.object,
  userForgetPassword: PropTypes.func
};

const mapStatetoProps = state => {
  const { forgetError, forgetSuccessMsg } = state.ForgetPassword;
  return { forgetError, forgetSuccessMsg };
};

export default withRouter(
  connect(mapStatetoProps, { userForgetPassword })(ForgetPasswordPage)
);
