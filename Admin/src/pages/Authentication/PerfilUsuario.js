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
  Input,
  FormGroup
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
  const [initial, setInitial] = useState("");
  const [bgColor, setBgColor] = useState("#6C63FF");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState({
    sector: "",
    descripcion_empresa: "",
    propuesta_valor: "",
    portafolio_comercial: "",
    segmentacion_audiencia: "",
    sitioWeb: "",
  });

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState("");

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

      const userEmail = authUser.email;
      setEmail(userEmail);

      const { data, error } = await supabase
        .from("users_data")
        .select("*")
        .eq("email", userEmail)
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

        if (data.foto_perfil) {
          setProfilePic(data.foto_perfil);
          localStorage.setItem("profilePic", data.foto_perfil);
        } else {
          localStorage.removeItem("profilePic");
          setProfilePic("");
        }

        setUserData({
          sector: data.sector || "",
          descripcion_empresa: data.descripcion_empresa || "",
          propuesta_valor: data.propuesta_valor || "",
          portafolio_comercial: data.portafolio_comercial || "",
          segmentacion_audiencia: data.segmentacion_audiencia || "",
          sitioWeb: data.sitioWeb || "",
        });
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
      username: name,
      ...userData
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Por favor, introduzca su nombre"),
      sitioWeb: Yup.string().url("Debe ser una URL válida").nullable()
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (!email) {
        console.error("No se encontró el email del usuario.");
        return;
      }

      const { error } = await supabase
        .from("users_data")
        .update({
          nombre: values.username,
          sector: values.sector || null,
          descripcion_empresa: values.descripcion_empresa || null,
          propuesta_valor: values.propuesta_valor || null,
          portafolio_comercial: values.portafolio_comercial || null,
          segmentacion_audiencia: values.segmentacion_audiencia || null,
          sitioWeb: values.sitioWeb || null,
        })
        .eq("email", email);

      setSubmitting(false);

      if (!error) {
        setName(values.username);
        setUserData({
          sector: values.sector,
          descripcion_empresa: values.descripcion_empresa,
          propuesta_valor: values.propuesta_valor,
          portafolio_comercial: values.portafolio_comercial,
          segmentacion_audiencia: values.segmentacion_audiencia,
          sitioWeb: values.sitioWeb,
        });

        const userInitial = values.username.charAt(0).toUpperCase();
        localStorage.setItem("username", values.username);
        localStorage.setItem("userInitial", userInitial);
        setInitial(userInitial);

        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        console.error("Error al actualizar en Supabase:", error.message);
        setUpdateError("No se pudieron guardar los cambios: " + error.message);
        setTimeout(() => setUpdateError(""), 5000);
      }
    }
  });

  if (loading) return null;

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="7AM Digital" breadcrumbItem="Perfil" />

        <Row>
          <Col lg="12">
            {props.error && (
              <Alert color="danger">{props.error?.message || props.error}</Alert>
            )}
            {props.success && <Alert color="success">{props.success}</Alert>}

            <Card>
              <CardBody>
                <div className="d-flex">
                  <div className="mx-3">
                    {profilePic ? (
                      <img src={profilePic} alt="foto" style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        objectFit: "cover"
                      }} />
                    ) : (
                      <div style={{
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
                      }}>{initial}</div>
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

        <h4 className="card-title mb-4">Editar información del perfil</h4>

        <Card>
          <CardBody>
            <Form onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}>
              <FormGroup>
                <Label>Nombre</Label>
                <Input
                  name="username"
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.username || ""}
                  invalid={!!(validation.touched.username && validation.errors.username)}
                />
                <FormFeedback>{validation.errors.username}</FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label>Sector</Label>
                <Input name="sector" value={validation.values.sector} onChange={validation.handleChange} />
              </FormGroup>

              <FormGroup>
                <Label>Descripción de la empresa</Label>
                <Input type="textarea" name="descripcion_empresa" value={validation.values.descripcion_empresa} onChange={validation.handleChange} />
              </FormGroup>

              <FormGroup>
                <Label>Propuesta de valor</Label>
                <Input type="textarea" name="propuesta_valor" value={validation.values.propuesta_valor} onChange={validation.handleChange} />
              </FormGroup>

              <FormGroup>
                <Label>Portafolio comercial</Label>
                <Input type="textarea" name="portafolio_comercial" value={validation.values.portafolio_comercial} onChange={validation.handleChange} />
              </FormGroup>

              <FormGroup>
                <Label>Segmentación de audiencia</Label>
                <Input type="textarea" name="segmentacion_audiencia" value={validation.values.segmentacion_audiencia} onChange={validation.handleChange} />
              </FormGroup>

              <FormGroup>
                <Label>Sitio Web</Label>
                <Input
                  type="text"
                  name="sitioWeb"
                  value={validation.values.sitioWeb}
                  onChange={validation.handleChange}
                  invalid={!!(validation.touched.sitioWeb && validation.errors.sitioWeb)}
                />
                <FormFeedback>{validation.errors.sitioWeb}</FormFeedback>
              </FormGroup>

              {updateSuccess && (
                <Alert color="success" className="mt-3">
                  Datos actualizados
                </Alert>
              )}

              {updateError && (
                <Alert color="danger" className="mt-3">
                  {updateError}
                </Alert>
              )}

              <div className="text-center mt-4">
                <Button
                  type="submit"
                  style={{ backgroundColor: "#000b24", color: "#fff" }}
                  disabled={validation.isSubmitting}>
                  {validation.isSubmitting ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </div>
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

export default withRouter(connect(mapStatetoProps, { editProfile, resetProfileFlag })(PerfilUsuario));
