import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Form,
  FormFeedback,
  Label,
  Input
} from "reactstrap";

import * as Yup from "yup";
import { useFormik } from "formik";
import { connect, useDispatch } from "react-redux";
import withRouter from 'components/Common/withRouter';
import Breadcrumb from "../../components/Common/Breadcrumb";
import { editProfile, resetProfileFlag } from "../../store/actions";
import { supabase } from "../../supabaseClient";

const PerfilUsuario = props => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [idx, setIdx] = useState(1);
  const [initial, setInitial] = useState("");
  const [bgColor, setBgColor] = useState("#6C63FF");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(true);

  const generateRandomColor = () => {
    const colors = [
      "#6C63FF", "#FF6B6B", "#4DD0E1", "#81C784", "#BA68C8", "#FFD54F", "#A1887F",
      "#4FC3F7", "#81D4FA", "#FFB74D", "#FF8A65"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const fetchUser = async () => {
      const authUser = JSON.parse(localStorage.getItem("authUser"));
      if (!authUser) {
        setLoading(false);
        return;
      }

      const email = authUser.email;
      setEmail(email);
      setIdx(authUser.uid || 1);

      const { data, error } = await supabase
        .from("users_data")
        .select("nombre, foto_perfil")
        .eq("email", email)
        .single();

      if (!error && data) {
        const nombre = data.nombre || "";
        const userInitial = nombre.charAt(0).toUpperCase();

        setName(nombre);
        setInitial(userInitial);
        localStorage.setItem("username", nombre);
        localStorage.setItem("userInitial", userInitial);

        let color = localStorage.getItem("userColor");
        if (!color) {
          color = generateRandomColor();
          localStorage.setItem("userColor", color);
        }
        setBgColor(color);

        // Si hay foto de perfil, usarla
        if (data.foto_perfil) {
          setProfilePic(data.foto_perfil);
          localStorage.setItem("profilePic", data.foto_perfil);
        } else {
          // Si no hay foto, borrar la guardada (por si se quitó)
          localStorage.removeItem("profilePic");
          setProfilePic("");
        }
      }

      setLoading(false);
    };

    fetchUser();

    const handlePicUpdate = () => {
      const nuevaFoto = localStorage.getItem("profilePic");
      setProfilePic(nuevaFoto || "");
    };

    window.addEventListener("profilePicUpdated", handlePicUpdate);

    setTimeout(() => {
      props.resetProfileFlag();
    }, 3000);

    return () => {
      window.removeEventListener("profilePicUpdated", handlePicUpdate);
    };
  }, [props.success]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: "",
      idx: idx || '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Por favor, introduzca su nombre de usuario"),
    }),
    onSubmit: async (values) => {
      const { username } = values;
      const authUser = JSON.parse(localStorage.getItem("authUser"));
      const email = authUser?.email;

      if (email) {
        const { error } = await supabase
          .from("users_data")
          .update({ nombre: username })
          .eq("email", email);

        if (!error) {
          const userInitial = username.charAt(0).toUpperCase();
          localStorage.setItem("username", username);
          localStorage.setItem("userInitial", userInitial);
          setName(username);
          setInitial(userInitial);
        }
      }
    }
  });

  document.title = "Perfil | 7AM Digital";

  if (loading) return null;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="7AM Digital" breadcrumbItem="Perfil" />

          <Row>
            <Col lg="12">
              {props.error && (
                <Alert color="danger">
                  {typeof props.error === "string"
                    ? props.error
                    : props.error.message || "Ocurrió un error"}
                </Alert>
              )}
              {props.success && (
                <Alert color="success">{props.success}</Alert>
              )}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="mx-3">
                      {profilePic ? (
                        <img
                          src={profilePic}
                          alt="foto"
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            objectFit: "cover"
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            backgroundColor: bgColor,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            fontSize: "24px"
                          }}
                        >
                          {initial}
                        </div>
                      )}
                    </div>
                    <div className="align-self-center flex-1">
                      <div className="text-muted">
                        <h5>{name}</h5>
                        <p className="mb-1">{email}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Cambiar nombre de usuario</h4>

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="form-group">
                  <Label className="form-label">Nombre de usuario</Label>
                  <Input
                    name="username"
                    className="form-control"
                    placeholder="Introduzca el nombre de usuario"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.username || ""}
                    invalid={
                      validation.touched.username && validation.errors.username ? true : false
                    }
                  />
                  {validation.touched.username && validation.errors.username ? (
                    <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                  ) : null}
                  <Input name="idx" value={idx} type="hidden" />
                </div>
                <div className="text-center mt-4">
                  <Button type="submit" color="danger">
                    Editar nombre de usuario
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

PerfilUsuario.propTypes = {
  editProfile: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any
};

const mapStatetoProps = state => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, { editProfile, resetProfileFlag })(PerfilUsuario)
);
