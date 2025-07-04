import React, { useEffect, useState } from "react";
import {
  Row, Col, CardBody, Card, Container, Form, FormFeedback, Label, Input, Alert
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import logoSm from "../../assets/images/logo7amblanco.png";
import bannerBg from "../../assets/images/Banner1.png"; // ✅ Importa la imagen de fondo

const Register = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const validation = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Correo inválido").required("Por favor, introduce tu correo"),
      username: Yup.string().required("Por favor, introduce tu nombre de usuario"),
      password: Yup.string().min(6, "Mínimo 6 caracteres").required("Por favor, introduce tu contraseña"),
    }),
    onSubmit: async (values) => {
      setErrorMsg("");
      const { email, password, username } = values;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        const user = data.user;

        const { error: insertError } = await supabase.from("users_data").insert([
          {
            id: user.id,
            nombre: username,
            email: email,
            metricoolIframe: ""
          }
        ]);

        if (insertError) {
          console.error("Error creando perfil en users_data:", insertError);
          setErrorMsg("Error al crear tu perfil, por favor intenta de nuevo.");
          return;
        }

        setSuccess(true);
        localStorage.setItem("authUser", JSON.stringify(user));
        setTimeout(() => navigate("/login"), 1500);
      }
    },
  });

  useEffect(() => {
    document.title = "Registro | 7AM Digital";
  }, []);

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
          <div className="account-pages my-5 pt-sm-5">
            <Container>
              <Row className="justify-content-center">
                <Col md={8} lg={6} xl={4}>
                  <Card className="overflow-hidden">
                    <div className="bg-primary">
                      <div className="text-primary text-center p-4">
                        <h5 className="text-white font-size-20">Registro Gratuito</h5>
                        <Link to="/">
                          <img src={logoSm} height="45" alt="logo" />
                        </Link>
                      </div>
                    </div>
                    <CardBody className="p-4">
                      <div className="p-3">
                        {success && (
                          <Alert color="success">
                            ¡Registro exitoso! Redirigiendo al inicio de sesión...
                          </Alert>
                        )}
                        {errorMsg && (
                          <Alert color="danger">
                            {errorMsg}
                          </Alert>
                        )}
                        <Form
                          className="mt-4"
                          onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                          }}
                        >
                          <div className="mb-3">
                            <Label htmlFor="useremail">Correo electrónico</Label>
                            <Input
                              name="email"
                              type="email"
                              id="useremail"
                              placeholder="Ingresa tu correo"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.email}
                              invalid={validation.touched.email && !!validation.errors.email}
                            />
                            <FormFeedback>{validation.errors.email}</FormFeedback>
                          </div>

                          <div className="mb-3">
                            <Label htmlFor="username">Nombre de usuario</Label>
                            <Input
                              name="username"
                              type="text"
                              id="username"
                              placeholder="Ingresa tu nombre de usuario"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.username}
                              invalid={validation.touched.username && !!validation.errors.username}
                            />
                            <FormFeedback>{validation.errors.username}</FormFeedback>
                          </div>

                          <div className="mb-3">
                            <Label htmlFor="userpassword">Contraseña</Label>
                            <Input
                              name="password"
                              type="password"
                              id="userpassword"
                              placeholder="Ingresa tu contraseña"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.password}
                              invalid={validation.touched.password && !!validation.errors.password}
                            />
                            <FormFeedback>{validation.errors.password}</FormFeedback>
                          </div>

                          <div className="mb-3 text-end">
                            <button type="submit" className="btn btn-primary w-md">
                              Registrarme
                            </button>
                          </div>

                          <div className="mt-4">
                            <p className="mb-0">
                              Al registrarte aceptas los{" "}
                              <Link to="#" className="text-primary">Términos de uso</Link>.
                            </p>
                          </div>
                        </Form>
                      </div>
                    </CardBody>
                  </Card>

                  <div className="mt-5 text-center text-white">
                    <p>
                      ¿Ya tienes una cuenta?{" "}
                      <Link to="/login" className="fw-medium text-info">
                        Iniciar sesión
                      </Link>
                    </p>
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

export default Register;
