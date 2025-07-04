import React, { useState } from "react";
import {
  Row, Col, Alert, Card, CardBody, Container, Form, FormFeedback, Label, Input,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import logoSm from "../../assets/images/logo7amblanco.png";
import bannerBg from "../../assets/images/Banner1.png";
import { supabase } from "../../supabaseClient";

const ForgetPasswordPage = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const redirectTo =
    process.env.NODE_ENV === "production"
      ? "https://7-am-copia-pruebas.vercel.app/ResetPassword"
      : "http://localhost:3000/ResetPassword";

  const validation = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Correo inválido").required("Por favor, introduzca su correo electrónico"),
    }),
    onSubmit: async (values) => {
      setMessage("");
      setError("");

      const { data, error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo, // ✅ ahora dinámico según el entorno
      });

      if (error) {
        setError("Error al enviar el correo. Verifica el correo ingresado.");
      } else {
        setMessage("Se ha enviado un enlace de restablecimiento a tu correo.");
      }
    }
  });

  document.title = "Olvidar contraseña | 7AM Digital";

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
        <div className="account-pages my-5 pt-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={4}>
                <Card className="overflow-hidden">
                  <div className="bg-primary">
                    <div className="text-primary text-center p-4">
                      <h5 className="text-white font-size-20 p-2">Olvidé mi contraseña</h5>
                      <Link to="/">
                        <img src={logoSm} height="45" alt="logo" />
                      </Link>
                    </div>
                  </div>

                  <CardBody className="p-4">
                    {error && <Alert color="danger">{error}</Alert>}
                    {message && <Alert color="success">{message}</Alert>}

                    <Form onSubmit={validation.handleSubmit} className="mt-4">
                      <div className="mb-3">
                        <Label htmlFor="useremail">Correo electrónico</Label>
                        <Input
                          name="email"
                          placeholder="Ingresa tu correo electrónico"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email}
                          invalid={validation.touched.email && !!validation.errors.email}
                        />
                        {validation.touched.email && validation.errors.email && (
                          <FormFeedback>{validation.errors.email}</FormFeedback>
                        )}
                      </div>

                      <div className="text-end">
                        <button type="submit" className="btn btn-primary w-md">
                          Restaurar
                        </button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>

                <div className="mt-5 text-center text-white">
                  <p>¿Lo recuerdas? <Link to="/login" className="fw-medium text-info">Inicia sesión aquí</Link></p>
                  <p>© {new Date().getFullYear()} 7AM Digital</p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
