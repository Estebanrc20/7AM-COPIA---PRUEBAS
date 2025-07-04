import React, { useEffect, useState } from "react";
import {
  Row, Col, CardBody, Card, Container, Label, Form, FormFeedback, Input, Spinner
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { supabase } from "../../supabaseClient";
import logoSm from "../../assets/images/logo7amblanco.png";
import bannerBg from "../../assets/images/Banner1.png";

const Login = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validation = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Correo inválido").required("Por favor, introduce tu correo"),
      password: Yup.string().required("Por favor, introduce tu contraseña"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setErrorMsg(error.message);
        localStorage.removeItem("authUser");
      } else {
        localStorage.setItem("authUser", JSON.stringify(data.session?.user || data.user));
        setTimeout(() => navigate("/dashboard"), 300);
      }

      setLoading(false);
    }
  });

  useEffect(() => {
    document.title = "Iniciar Sesión | 7AM Digital";
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate]);

  // ✅ Ajuste del fondo para eliminar franjas arriba/abajo
  const backgroundStyle = {
  backgroundImage: `url(${bannerBg})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover", // <-- clave aquí
  backgroundPosition: "center center", // <-- aseguras que se centre bien
  minHeight: "100vh",
  width: "100%",
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
              <i className="fas fa-home h2" />
            </Link>
          </div>
          <div className="account-pages my-5 pt-sm-5">
            <Container>
              <Row className="justify-content-center">
                <Col md={8} lg={6} xl={4}>
                  <Card className="overflow-hidden">
                    <div className="bg-primary">
                      <div className="text-primary text-center p-4">
                        <h5 className="text-white font-size-20">Bienvenido de nuevo</h5>
                        <p className="text-white-50">Inicia sesión para continuar en 7AM</p>
                        <Link to="/">
                          <img src={logoSm} height="45" alt="logo" />
                        </Link>
                      </div>
                    </div>

                    <CardBody className="p-4">
                      <div className="p-3">
                        <Form
                          className="mt-4"
                          onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                          }}
                        >
                          <div className="mb-3">
                            <Label htmlFor="email">Correo</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="Ingresa tu correo"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.email}
                              invalid={validation.touched.email && !!validation.errors.email}
                            />
                            <FormFeedback>{validation.errors.email}</FormFeedback>
                          </div>

                          <div className="mb-3">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              placeholder="Ingresa tu contraseña"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.password}
                              invalid={validation.touched.password && !!validation.errors.password}
                            />
                            <FormFeedback>{validation.errors.password}</FormFeedback>
                          </div>

                          {errorMsg && (
                            <div className="text-danger mb-3">
                              <strong>Error:</strong> {errorMsg}
                            </div>
                          )}

                          <div className="mb-3 d-flex justify-content-between align-items-center">
                            <div className="form-check">
                              <input type="checkbox" className="form-check-input" id="remember" />
                              <label className="form-check-label" htmlFor="remember">Recuérdame</label>
                            </div>
                            <button type="submit" className="btn btn-primary w-md" disabled={loading}>
                              {loading ? <Spinner size="sm" color="light" /> : "Iniciar Sesión"}
                            </button>
                          </div>

                          <div className="text-center mt-4">
                            <Link to="/forgot-password">
                              <i className="mdi mdi-lock"></i> ¿Olvidaste tu contraseña?
                            </Link>
                          </div>
                        </Form>
                      </div>
                    </CardBody>
                  </Card>

                  <div className="mt-5 text-center text-white">
                    <p>¿No tienes una cuenta? <Link to="/register" className="fw-medium text-info">Regístrate ahora</Link></p>
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

export default Login;
