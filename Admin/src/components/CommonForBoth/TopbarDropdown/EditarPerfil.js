import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Form,
  FormGroup,
  Label,
  Alert,
} from "reactstrap";
import { supabase } from "../../../supabaseClient";

const EditarPerfil = () => {
  const [nombre, setNombre] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("No se pudo obtener el usuario.");
        return;
      }

      setUserId(user.id); // UUID
      const { data, error } = await supabase
        .from("users_data")
        .select("nombre, foto_perfil")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setNombre(data.nombre);
        if (data.foto_perfil) {
          setPreview(data.foto_perfil);
        }
      } else {
        setError("No se pudo cargar los datos del perfil.");
      }
    };

    fetchUser();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!foto) {
      setError("Debes seleccionar una imagen.");
      return;
    }

    const fileExt = foto.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("perfil")
      .upload(filePath, foto, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      setError("Error al subir la imagen");
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from("perfil")
      .getPublicUrl(filePath);

    const imageUrl = publicUrl.publicUrl;

    const { error: updateError } = await supabase
      .from("users_data")
      .update({ foto_perfil: imageUrl })
      .eq("id", userId);

    if (updateError) {
      setError("No se pudo actualizar la foto de perfil");
      return;
    }

    localStorage.setItem("profilePic", imageUrl);
    setSuccess("¡Perfil actualizado correctamente!");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Card className="shadow border-0 p-4" style={{ width: "100%", maxWidth: "500px" }}>
        <CardBody>
          <h4 className="mb-4 text-center">Editar Perfil</h4>

          {success && <Alert color="success">{success}</Alert>}
          {error && <Alert color="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="nombre">Nombre</Label>
              <Input
                type="text"
                id="nombre"
                value={nombre}
                readOnly
              />
            </FormGroup>

            <FormGroup>
              <Label for="foto">Foto de perfil</Label>
              <Input
                type="file"
                id="foto"
                accept="image/*"
                onChange={handleImageChange}
              />
            </FormGroup>

            {preview && (
              <div className="mb-3 text-center">
                <img
                  src={preview}
                  alt="Vista previa"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <div className="text-center">
              <Button
                type="submit"
                style={{ backgroundColor: "#000b24", color: "#fff" }}>
                Guardar cambios
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditarPerfil;
