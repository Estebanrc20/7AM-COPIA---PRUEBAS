import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import {
  Container,
  Row,
  Col,
  Table,
  Card,
  CardBody,
  Spinner,
  Button,
  Input
} from "reactstrap";
import { supabase } from '../../supabaseClient';

const formatoOptions = ["reel", "post", "story"];
const categoriaOptions = ["atencion", "interes", "deseo", "accion"];
const pilarOptions = ["educativo", "comercial", "inspiracional", "entretenimiento", "entretenido"];

const Home = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedIdea, setEditedIdea] = useState({});
  const [expandedRowId, setExpandedRowId] = useState(null);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setLoading(true);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("No se pudo obtener el usuario autenticado");
      setIdeas([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('ideas_contenido')
      .select('*')
      .eq('user_id', user.id)
      .order('fecha', { ascending: false });

    if (error) {
      console.error("Error cargando ideas:", error.message);
      setIdeas([]);
    } else {
      setIdeas(data);
    }
    setLoading(false);
  };

  const handleEdit = (idea) => {
    setEditingId(idea.id);
    setEditedIdea({ ...idea });
  };

  const handleCancel = () => {
    if (String(editingId).startsWith("nuevo-")) {
      setIdeas(prevIdeas => prevIdeas.filter(i => i.id !== editingId));
    }
    setEditingId(null);
    setEditedIdea({});
  };

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("Usuario no autenticado.");
      return;
    }

    let data, error;

    if (String(editingId).startsWith("nuevo-")) {
      const nuevoRegistro = {
        ...editedIdea,
        user_id: user.id,
      };
      ({ data, error } = await supabase
        .from("ideas_contenido")
        .insert([nuevoRegistro])
        .select());
    } else {
      ({ data, error } = await supabase
        .from("ideas_contenido")
        .update(editedIdea)
        .eq("id", editingId)
        .select());
    }

    if (!error && data && data.length > 0) {
      setIdeas(prevIdeas => {
        const filtrado = prevIdeas.filter(i => i.id !== editingId);
        return [data[0], ...filtrado];
      });
      setEditingId(null);
      setEditedIdea({});
    } else {
      console.error("Error guardando idea:", error?.message);
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('ideas_contenido')
      .delete()
      .eq('id', id);

    if (!error) {
      setIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== id));
    } else {
      console.error("Error eliminando idea:", error.message);
    }
  };

  const handleChange = (field, value) => {
    setEditedIdea(prev => ({ ...prev, [field]: value }));
  };

  const toggleExpand = (id) => {
    setExpandedRowId(prevId => (prevId === id ? null : id));
  };

  const getBadgeStyle = (type, value) => {
    const colors = {
      formato: {
        reel: { bg: "#d1ecf1", color: "#0c5460" },
        post: { bg: "#d4edda", color: "#155724" },
        story: { bg: "#f8d7da", color: "#721c24" },
      },
      categoria: {
        atencion: { bg: "#f8d7da", color: "#721c24" },
        interes: { bg: "#03030331", color: "#383d41" },
        deseo: { bg: "#e2ce8bbe", color: "#856404" },
        accion: { bg: "#d1ecf1", color: "#0c5460" },
      },
      pilar: {
        educativo: { bg: "#d1ecf1", color: "#0c5460" },
        comercial: { bg: "#d4edda", color: "#155724" },
        inspiracional: { bg: "#fff3cd", color: "#856404" },
        entretenimiento: { bg: "#f8d7da", color: "#721c24" },
        entretenido: { bg: "#e2e3e5", color: "#383d41" },
      },
    };

    const item = colors[type]?.[value?.toLowerCase()] || { bg: "#f0f0f0", color: "#333" };
    return {
      backgroundColor: item.bg,
      color: item.color,
      padding: '4px 8px',
      borderRadius: '8px',
      fontWeight: 500,
      display: 'inline-block'
    };
  };

  const sincronizarConMetricool = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        alert("⚠️ Debes iniciar sesión antes de sincronizar tu contenido.");
        return;
      }

      // Buscar nombre en la tabla users_data
      const { data: userData, error: userDataError } = await supabase
        .from("users_data")
        .select("nombre")
        .eq("id", user.id)
        .single();

      if (userDataError) {
        alert("⚠️ No pudimos obtener tu nombre de usuario. Inténtalo nuevamente.");
        return;
      }

      const datos = {
        id: user.id,
        nombre: userData?.nombre || "Sin nombre",
      };

      const response = await fetch(
        "https://hook.us2.make.com/hmeaxnukvht36o1w3et8yuif2hc0sua0",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        }
      );

      if (response.ok) {
        alert("✅ Ahora puedes continuar en la sección de Planeación para seguir con tu proceso de contenido.");
      } else {
        alert("❌ Hubo un problema al enviar la información. Por favor, intenta nuevamente.");
      }
    } catch (err) {
      alert("❌ Ocurrió un error inesperado en la sincronización. Inténtalo otra vez.");
    }
  };


  document.title = "Ideas | 7 AM Digital";

  return (
    <div className="page-content">
      <br />
      <Container fluid>
        <Card className="mb-3" style={{ backgroundColor: '#e9f2fc', border: 'none', borderRadius: '12px' }}>
          <CardBody>
            <h5 style={{ color: '#2b2f32', fontWeight: 'bold' }}>Contenido para redes</h5>
            <p style={{ marginBottom: 0, color: '#5a5a5a' }}>
              Cada mes te entregaremos nuevas ideas de contenido generadas por nuestro algoritmo de IA,
              basadas en la información de tu negocio y tus mejores publicaciones en redes sociales.
            </p>
          </CardBody>
        </Card>

        <Row className="mb-3">
          <Col className="text-start">
            <Button
              style={{ backgroundColor: "#000b24", color: "#fff" }}
              onClick={() => {
                const hoy = new Date().toISOString().split('T')[0];
                const nuevoId = `nuevo-${Date.now()}`;
                setIdeas(prev => [{
                  id: nuevoId,
                  fecha: hoy,
                  formato: '',
                  idea: '',
                  categoria: '',
                  pilar: '',
                  instrucciones: '',
                }, ...prev]);
                setEditingId(nuevoId);
                setEditedIdea({
                  fecha: hoy,
                  formato: '',
                  idea: '',
                  categoria: '',
                  pilar: '',
                  instrucciones: ''
                });
              }}
            >
              + Agregar contenido
            </Button>
          </Col>
          <Col className="text-end">
            <Button
              style={{ backgroundColor: "#000b24", color: "#fff" }}
              onClick={sincronizarConMetricool}
            >
              Sincronizar con Metricool
            </Button>
          </Col>
        </Row>

        <Card style={{ backgroundColor: '#e9f2fc', borderRadius: '12px' }}>
          <CardBody>
            {loading ? (
              <div className="text-center">
                <Spinner color="primary" /> Cargando ideas...
              </div>
            ) : ideas.length === 0 ? (
              <div className="text-center text-muted">
                Aún no tienes ideas registradas. ¡Cuando generes contenido, aparecerá aquí!
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <Table bordered responsive="sm" className="align-middle">
                  <thead>
                    <tr>
                      <th style={{ backgroundColor: '#000b24', color: '#fff' }}>Fecha</th>
                      <th style={{ backgroundColor: '#000b24', color: '#fff' }}>Formato</th>
                      <th style={{ backgroundColor: '#000b24', color: '#fff' }}>Idea</th>
                      <th className="d-none d-md-table-cell" style={{ backgroundColor: '#000b24', color: '#fff' }}>Categoría</th>
                      <th className="d-none d-md-table-cell" style={{ backgroundColor: '#000b24', color: '#fff' }}>Pilar</th>
                      <th style={{ backgroundColor: '#000b24', color: '#fff' }}>Instrucciones</th>
                      <th style={{ backgroundColor: '#000b24', color: '#fff' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ideas.map((idea) => {
                      const isEditing = editingId === idea.id;
                      const isExpanded = expandedRowId === idea.id;

                      return (
                        <tr key={idea.id}>
                          <td>
                            {isEditing ? (
                              <Input
                                type="date"
                                value={editedIdea.fecha || ''}
                                onChange={(e) => handleChange('fecha', e.target.value)}
                              />
                            ) : idea.fecha ? new Intl.DateTimeFormat('es-CO', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              timeZone: 'UTC'
                            }).format(new Date(idea.fecha)) : 'Sin fecha'}
                          </td>
                          <td>
                            {isEditing ? (
                              <Input type="select" value={editedIdea.formato || ''} onChange={(e) => handleChange('formato', e.target.value)}>
                                <option value="">--</option>
                                {formatoOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </Input>
                            ) : (
                              <span style={getBadgeStyle('formato', idea.formato)}>{idea.formato}</span>
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <Input
                                type="textarea"
                                value={editedIdea.idea || ''}
                                onChange={(e) => handleChange('idea', e.target.value)}
                              />
                            ) : idea.idea}
                          </td>
                          <td className="d-none d-md-table-cell">
                            {isEditing ? (
                              <Input type="select" value={editedIdea.categoria || ''} onChange={(e) => handleChange('categoria', e.target.value)}>
                                <option value="">--</option>
                                {categoriaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </Input>
                            ) : (
                              <span style={getBadgeStyle('categoria', idea.categoria)}>{idea.categoria}</span>
                            )}
                          </td>
                          <td className="d-none d-md-table-cell">
                            {isEditing ? (
                              <Input type="select" value={editedIdea.pilar || ''} onChange={(e) => handleChange('pilar', e.target.value)}>
                                <option value="">--</option>
                                {pilarOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </Input>
                            ) : (
                              <span style={getBadgeStyle('pilar', idea.pilar)}>{idea.pilar}</span>
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <Input
                                type="textarea"
                                value={editedIdea.instrucciones || ''}
                                onChange={(e) => handleChange('instrucciones', e.target.value)}
                              />
                            ) : (
                              <div style={{ whiteSpace: "pre-line" }}>
                                {idea.instrucciones.length > 60 ? (
                                  <>
                                    {isExpanded ? idea.instrucciones : `${idea.instrucciones.substring(0, 60)}... `}
                                    <Button
                                      color="link"
                                      size="sm"
                                      style={{ padding: 0 }}
                                      onClick={() => toggleExpand(idea.id)}
                                    >
                                      {isExpanded ? 'Ver menos ↑' : 'Ver más ↓'}
                                    </Button>
                                  </>
                                ) : idea.instrucciones}
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="d-flex flex-column align-items-center gap-2">
                              {isEditing ? (
                                <>
                                  <Button color="success" size="sm" onClick={handleSave}>
                                    Guardar
                                  </Button>
                                  <Button color="secondary" size="sm" onClick={handleCancel}>
                                    Cancelar
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <div style={{ display: "flex", gap: "6px" }}>
                                    <Button
                                      size="sm"
                                      style={{
                                        backgroundColor: "#e3f2fd", // azul muy claro
                                        border: "none",
                                        color: "#1976d2",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "32px",
                                        height: "32px",
                                        transition: "background-color 0.3s ease" // transición suave
                                      }}
                                      onClick={() => handleEdit(idea)}
                                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#bbdefb")} // azul un poco más oscuro
                                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e3f2fd")}
                                    >
                                      <FaEdit />
                                    </Button>

                                    <Button
                                      size="sm"
                                      style={{
                                        backgroundColor: "#ffebee", // rojo muy claro
                                        border: "none",
                                        color: "#d32f2f",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "32px",
                                        height: "32px",
                                        transition: "background-color 0.3s ease" // transición suave
                                      }}
                                      onClick={() => handleDelete(idea.id)}
                                      disabled={String(idea.id).startsWith("nuevo-")}
                                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ffcdd2")} // rojo más fuerte
                                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffebee")}
                                    >
                                      <FaTrash />
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

Home.propTypes = {
  t: PropTypes.any
};

export default Home;
