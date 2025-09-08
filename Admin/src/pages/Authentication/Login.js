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
        setTimeout(() => navigate("/Home"), 300);
      }

      setLoading(false);
    }
  });

  useEffect(() => {
    document.title = "Iniciar Sesión | 7AM Digital";

    const img = new Image();
    img.src = bannerBg;

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate("/Home");
      }
    };
    checkUser();
  }, [navigate]);

  const backgroundStyle = {
    backgroundImage: `url(${bannerBg})`,
    backgroundColor: "#000",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem"
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
  };

  return (
    <div style={backgroundStyle}>
      <div className="home-btn d-none d-sm-block position-absolute top-0 start-0 m-3">
        <Link to="/" className="text-light">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={4}>
            <Card style={cardStyle}>
              <div className="bg-primary text-center p-4 rounded-top">
                <h5 className="text-white font-size-20">Bienvenido de nuevo</h5>
                <p className="text-white-50 mb-0">Inicia sesión para continuar en 7AM</p>
                <div
                  onClick={() => navigate("/login")}
                  style={{ cursor: "pointer", display: "inline-block" }}
                >
                  <img src={logoSm} height="45" alt="logo" className="mt-2" />
                </div>
              </div>

              <CardBody className="p-4">
                <Form
                  className="mt-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}
                >
                  <div className="mb-3">
                    <Label htmlFor="email" className="text-white">Correo</Label>
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
                    <Label htmlFor="password" className="text-white">Contraseña</Label>
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
                      <label className="form-check-label text-white" htmlFor="remember">Recuérdame</label>
                    </div>
                    <button type="submit" className="btn btn-primary w-md" disabled={loading}>
                      {loading ? <Spinner size="sm" color="light" /> : "Iniciar Sesión"}
                    </button>
                  </div>

                  <div className="text-center mt-4">
                    <Link to="/forgot-password" className="text-white">
                      <i className="mdi mdi-lock"></i> ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </Form>
              </CardBody>
            </Card>

            <div className="mt-4 text-center text-white">
              <p>¿No tienes una cuenta? <Link to="/register" className="fw-medium text-info">Regístrate ahora</Link></p>
              <p>© {new Date().getFullYear()} 7AM Digital</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
