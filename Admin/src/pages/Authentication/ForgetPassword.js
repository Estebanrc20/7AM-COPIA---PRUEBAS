import React, { useEffect, useState } from "react";
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
        redirectTo,
      });

      if (error) {
        setError("Error al enviar el correo. Verifica el correo ingresado.");
      } else {
        setMessage("Se ha enviado un enlace de restablecimiento a tu correo.");
      }
    }
  });

  useEffect(() => {
    document.title = "Olvidar contraseña | 7AM Digital";

    // Precargar la imagen de fondo
    const img = new Image();
    img.src = bannerBg;
  }, []);

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
          <i className="fas fa-home h2"></i>
        </Link>
      </div>

      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={4}>
            <Card style={cardStyle}>
              <div className="bg-primary text-center p-4 rounded-top">
                <h5 className="text-white font-size-20 p-2">Olvidé mi contraseña</h5>
                <Link to="/">
                  <img src={logoSm} height="45" alt="logo" />
                </Link>
              </div>

              <CardBody className="p-4">
                {error && <Alert color="danger">{error}</Alert>}
                {message && <Alert color="success">{message}</Alert>}

                <Form onSubmit={validation.handleSubmit} className="mt-4">
                  <div className="mb-3">
                    <Label htmlFor="useremail" className="text-white">Correo electrónico</Label>
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

            <div className="mt-4 text-center text-white">
              <p>
                ¿Lo recordaste?{" "}
                <Link to="/login" className="fw-medium text-info">Inicia sesión aquí</Link>
              </p>
              <p>© {new Date().getFullYear()} 7AM Digital</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgetPasswordPage;
