import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Card, CardBody, Form, Label, Input, Button,
  Alert, FormFeedback, Spinner
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";

import { supabase } from "../../supabaseClient";
import bannerBg from "../../assets/images/Banner1.png";
import logoSm from "../../assets/images/logo7amblanco.png";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);

  const validation = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es obligatoria"),
    }),
    onSubmit: async (values) => {
      setError("");
      setMessage("");

      const { error } = await supabase.auth.updateUser({ password: values.password });

      if (error) {
        setError("No se pudo cambiar la contraseña. El enlace puede haber expirado.");
      } else {
        setMessage("Contraseña cambiada exitosamente. Serás redirigido al login...");
        await supabase.auth.signOut();
        setTimeout(() => navigate("/login"), 2000);
      }
    },
  });

  useEffect(() => {
    document.title = "Restablecer contraseña | 7AM Digital";

    // Precargar fondo
    const img = new Image();
    img.src = bannerBg;

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setSessionReady(true);
        if (window.location.hash) {
          window.history.replaceState(null, null, window.location.pathname);
        }
      } else {
        setError("Este enlace no es válido o ya ha expirado.");
      }
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const backgroundStyle = {
    backgroundImage: `url(${bannerBg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
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
          <i className="fas fa-home h2"></i>
        </Link>
      </div>

      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card style={cardStyle}>
              <div className="bg-primary text-center p-4 rounded-top">
                <h5 className="text-white">Nueva contraseña</h5>
                <img src={logoSm} height="45" alt="logo" />
              </div>

              <CardBody>
                {loading ? (
                  <div className="text-center my-4">
                    <Spinner color="primary" />
                    <p className="text-muted mt-2">Verificando enlace...</p>
                  </div>
                ) : error ? (
                  <Alert color="danger">{error}</Alert>
                ) : (
                  <>
                    {message && <Alert color="success">{message}</Alert>}

                    <Form onSubmit={validation.handleSubmit} className="mt-3">
                      <div className="mb-3">
                        <Label htmlFor="password">Nueva contraseña</Label>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Escribe tu nueva contraseña"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password}
                          invalid={validation.touched.password && !!validation.errors.password}
                        />
                        {validation.touched.password && validation.errors.password && (
                          <FormFeedback>{validation.errors.password}</FormFeedback>
                        )}
                      </div>
                      <div className="text-end">
                        <Button color="primary" type="submit">
                          Cambiar contraseña
                        </Button>
                      </div>
                    </Form>
                  </>
                )}
              </CardBody>
            </Card>

            <div className="mt-4 text-center text-white">
              <p>© {new Date().getFullYear()} 7AM Digital</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPasswordPage;
