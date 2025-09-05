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
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";

import * as Yup from "yup";
import { useFormik } from "formik";
import { connect, useDispatch } from "react-redux";
import withRouter from 'components/Common/withRouter';
import Breadcrumb from "../../components/Common/Breadcrumb";
import { editProfile, resetProfileFlag } from "../../store/actions";
import { supabase } from "../../supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const PerfilUsuario = props => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const [name, setName] = useState("");
  const [initial, setInitial] = useState("");
  const [bgColor, setBgColor] = useState("#6C63FF");
  const [profilePic, setProfilePic] = useState("");
  const [modalFotoOpen, setModalFotoOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [userData, setUserData] = useState({
    sector: "",
    descripcion_empresa: "",
    propuesta_valor: "",
    portafolio_comercial: "",
    segmentacion_audiencia: "",
    sitioWeb: "",
  });

  const [originalValues, setOriginalValues] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const generateRandomColor = () => {
    const colors = ["#6C63FF", "#FF6B6B", "#4DD0E1", "#81C784", "#BA68C8", "#FFD54F", "#A1887F", "#4FC3F7", "#81D4FA", "#FFB74D", "#FF8A65"];
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
      setNewEmail(userEmail);

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

        const newUserData = {
          sector: data.sector || "",
          descripcion_empresa: data.descripcion_empresa || "",
          propuesta_valor: data.propuesta_valor || "",
          portafolio_comercial: data.portafolio_comercial || "",
          segmentacion_audiencia: data.segmentacion_audiencia || "",
          sitioWeb: data.sitioWeb || "",
        };

        setUserData(newUserData);
        setOriginalValues({ ...newUserData });
      }

      setLoading(false);
    };

    fetchUser();

    setTimeout(() => {
      props.resetProfileFlag();
    }, 3000);
  }, [props.success]);

  // Guardar nuevo correo
  const handleSaveEmail = async () => {
    if (!newEmail || newEmail === email) {
      setIsEditingEmail(false);
      return;
    }
    // ✅ Detectar entorno para redireccionamiento
    let redirectTo;
    const hostname = window.location.hostname;

    if (hostname === "portal.7am.com.co") {
      redirectTo = "https://portal.7am.com.co/login";
    } else if (hostname === "proyecto7-am-copia-pruebas.vercel.app") {
      redirectTo = "https://7-am-copia-pruebas.vercel.app/login";
    } else {
      redirectTo = "http://localhost:3000/login";
    }

    try {
    // ✅ Actualizar en Authentication con emailRedirectTo
    const { error: authError } = await supabase.auth.updateUser(
      { email: newEmail },
      { emailRedirectTo: redirectTo }
    );

      if (authError) {
        console.error("Error actualizando en Auth:", authError.message);
        setUpdateError("Error al actualizar correo en Authentication: " + authError.message);
        return;
      }

      // Actualizar en tabla users_data
      const { error: tableError } = await supabase
        .from("users_data")
        .update({ email: newEmail })
        .eq("email", email);

      if (tableError) {
        console.error("Error actualizando en users_data:", tableError.message);
        setUpdateError("Error al actualizar correo en tabla: " + tableError.message);
        return;
      }

      // Actualizar estado y localStorage
      setEmail(newEmail);
      const authUser = JSON.parse(localStorage.getItem("authUser"));
      if (authUser) {
        authUser.email = newEmail;
        localStorage.setItem("authUser", JSON.stringify(authUser));
      }

      setIsEditingEmail(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);

    } catch (err) {
      console.error("Error inesperado:", err);
      setUpdateError("Error inesperado: " + err.message);
    }
  };

  // Manejar selección de imagen en el modal
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Subir imagen
  const handleSaveImage = async () => {
    if (!selectedFile || !email) return;

    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${email}.${fileExt}`;
    const filePath = `perfil/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("perfil")
      .upload(filePath, selectedFile, { upsert: true });

    if (uploadError) {
      console.error("Error al subir la imagen:", uploadError.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("perfil").getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("users_data")
      .update({ foto_perfil: publicUrl })
      .eq("email", email);

    if (!updateError) {
      setProfilePic(publicUrl);
      localStorage.setItem("profilePic", publicUrl);
      setModalFotoOpen(false);
      setSelectedFile(null);
      setPreviewImage(null);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: { ...userData },
    validationSchema: Yup.object({
      sitioWeb: Yup.string().url("Debe ser una URL válida").nullable()
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const { error } = await supabase
        .from("users_data")
        .update({ ...values })
        .eq("email", email);

      setSubmitting(false);

      if (!error) {
        setUserData(values);
        setOriginalValues(values);
        setUpdateSuccess(true);
        setIsEditing(false);
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
            <Card>
              <CardBody>
                <div className="d-flex">
                  <div className="mx-3 position-relative" style={{ width: 90, height: 90 }}>
                    {profilePic ? (
                      <img
                        src={profilePic}
                        alt="foto"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover"
                        }}
                      />
                    ) : (
                      <div style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        backgroundColor: bgColor,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: 32
                      }}>
                        {initial}
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        width: 35,
                        height: 35,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "transform 0.3s ease, background-color 0.3s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      onClick={() => setModalFotoOpen(true)}
                      title="Cambiar foto"
                    >
                      <FontAwesomeIcon icon={faPen} color="#fff" />
                    </div>
                  </div>
                  <div className="align-self-center flex-1">
                    <h5>{name}</h5>
                    <div className="d-flex align-items-center">
                      {isEditingEmail ? (
                        <>
                          <Input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            style={{ maxWidth: 250 }}
                          />
                          <Button
                            style={{ backgroundColor: "#000b24", color: "#fff" }}
                            size="sm"
                            className="ms-2"
                            onClick={handleSaveEmail}
                          >
                            Guardar
                          </Button>
                          <Button
                            color="secondary"
                            size="sm"
                            className="ms-2"
                            onClick={() => {
                              setIsEditingEmail(false);
                              setNewEmail(email);
                            }}
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="mb-1 text-muted">{email}</p>
                          <FontAwesomeIcon
                            icon={faPen}
                            style={{ cursor: "pointer", marginLeft: 8 }}
                            onClick={() => setIsEditingEmail(true)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="card-title">Editar información del perfil</h4>
          <Button
            style={{ backgroundColor: "#000b24", color: "#fff" }}
            onClick={() => {
              if (isEditing) {
                validation.setValues(originalValues);
              }
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
        </div>

        <Card>
          <CardBody>
            <Form onSubmit={(e) => { e.preventDefault(); validation.handleSubmit(); return false; }}>
              {Object.entries(userData).map(([key]) => (
                <FormGroup key={key}>
                  <Label>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
                  <Input
                    type={key === "sitioWeb" ? "text" : "textarea"}
                    name={key}
                    value={validation.values[key]}
                    onChange={validation.handleChange}
                    disabled={!isEditing}
                    invalid={!!(validation.touched[key] && validation.errors[key])}
                  />
                  <FormFeedback>{validation.errors[key]}</FormFeedback>
                </FormGroup>
              ))}

              {updateSuccess && <Alert color="success">Datos actualizados</Alert>}
              {updateError && <Alert color="danger">{updateError}</Alert>}

              {isEditing && (
                <div className="text-center mt-4">
                  <Button
                    type="submit"
                    style={{ backgroundColor: "#000b24", color: "#fff" }}
                    disabled={validation.isSubmitting}
                  >
                    {validation.isSubmitting ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </div>
              )}
            </Form>
          </CardBody>
        </Card>

        {/* Modal para subir foto */}
        <Modal isOpen={modalFotoOpen} toggle={() => setModalFotoOpen(!modalFotoOpen)}>
          <ModalHeader toggle={() => setModalFotoOpen(false)}>Cambiar foto de perfil</ModalHeader>
          <ModalBody className="text-center">
            {previewImage ? (
              <img
                src={previewImage}
                alt="preview"
                style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", marginBottom: 20 }}
              />
            ) : (
              <img
                src={profilePic}
                alt="foto actual"
                style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", marginBottom: 20 }}
              />
            )}
            <Input type="file" accept="image/*" onChange={handleFileChange} className="mb-3" />
            <Button
              style={{ backgroundColor: "#000b24", color: "#fff" }}
              onClick={handleSaveImage}
              disabled={!selectedFile}
            >
              Guardar cambios
            </Button>
          </ModalBody>
        </Modal>
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
