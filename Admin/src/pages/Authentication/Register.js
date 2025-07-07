import React, { useEffect, useState } from "react";
import {
  Row, Col, CardBody, Card, Container, Form, FormFeedback, Label, Input, Alert
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import logoSm from "../../assets/images/logo7amblanco.png";
import bannerBg from "../../assets/images/Banner1.png";

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

    // Precargar imagen
    const img = new Image();
    img.src = bannerBg;
  }, []);

  const backgroundStyle = {
    backgroundImage: `url(${bannerBg})`,
    backgroundColor: "#000", // Fondo base mientras carga
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
                <h5 className="text-white font-size-20">Registro Gratuito</h5>
                <Link to="/">
                  <img src={logoSm} height="45" alt="logo" className="mt-2" />
                </Link>
              </div>

              <CardBody className="p-4">
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
                    <Label htmlFor="useremail" className="text-white">Correo electrónico</Label>
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
                    <Label htmlFor="username" className="text-white">Nombre de usuario</Label>
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
                    <Label htmlFor="userpassword" className="text-white">Contraseña</Label>
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
                    <p className="mb-0 text-white">
                      Al registrarte aceptas los{" "}
                      <Link to="#" className="text-primary">Términos de uso</Link>.
                    </p>
                  </div>
                </Form>
              </CardBody>
            </Card>

            <div className="mt-4 text-center text-white">
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
  );
};

export default Register;
