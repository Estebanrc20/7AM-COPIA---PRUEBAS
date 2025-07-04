import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Row, Col, Card, CardBody, Form, Label, Input, Button, Alert, FormFeedback, Spinner
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

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

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setSessionReady(true);

        // ✅ Limpiar el # de la URL
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
  };

  const overlayStyle = {
    width: "100%",
    height: "100%",
    backdropFilter: "brightness(0.7)",
    padding: "20px",
  };

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}>
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Card>
                <div className="bg-primary text-center p-4">
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

                      <Form onSubmit={validation.handleSubmit}>
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
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
