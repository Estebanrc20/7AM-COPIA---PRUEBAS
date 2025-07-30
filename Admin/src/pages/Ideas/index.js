import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
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
    setEditingId(null);
    setEditedIdea({});
  };

  const handleSave = async () => {
    const { data, error } = await supabase
      .from('ideas_contenido')
      .update(editedIdea)
      .eq('id', editingId)
      .select();

    if (!error && data && data.length > 0) {
      setIdeas(prevIdeas =>
        prevIdeas.map(idea =>
          idea.id === editingId ? data[0] : idea
        )
      );
      setEditingId(null);
      setEditedIdea({});
    } else {
      console.error("Error actualizando idea:", error?.message);
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

  document.title = "Ideas | 7 AM Digital";

  return (
    <div className="page-content">
      <Container fluid>
        <Card className="mb-3" style={{ backgroundColor: '#e9f2fc', border: 'none', borderRadius: '12px' }}>
          <CardBody>
            <h5 style={{ color: '#2b2f32', fontWeight: 'bold' }}>Contenido para redes</h5>
            <p style={{ marginBottom: 0, color: '#5a5a5a' }}>
              Cada mes te entregaremos nuevas ideas de contenido generadas por nuestro algoritmo de IA,
              basadas en la información de tu negocio y tus mejores publicaciones en redes sociales.
              Si quieres editar la información de tu negocio puedes ir a la sección <strong>Mi Negocio</strong>.
            </p>
          </CardBody>
        </Card>

        <Row className="mb-3">
          <Col className="text-end">
            <Button style={{ backgroundColor: "#000b24", color: "#fff" }}>
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
                                value={editedIdea.fecha ? new Date(editedIdea.fecha).toISOString().split('T')[0] : ''}
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
                              <Input
                                value={editedIdea.formato || ''}
                                onChange={(e) => handleChange('formato', e.target.value)}
                              />
                            ) : idea.formato}
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
                              <Input
                                value={editedIdea.categoria || ''}
                                onChange={(e) => handleChange('categoria', e.target.value)}
                              />
                            ) : idea.categoria}
                          </td>
                          <td className="d-none d-md-table-cell">
                            {isEditing ? (
                              <Input
                                value={editedIdea.pilar || ''}
                                onChange={(e) => handleChange('pilar', e.target.value)}
                              />
                            ) : idea.pilar}
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
                                    {isExpanded
                                      ? idea.instrucciones
                                      : `${idea.instrucciones.substring(0, 60)}... `}
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
                                  <Button color="warning" size="sm" onClick={() => handleEdit(idea)}>
                                    Editar
                                  </Button>
                                  <Button color="danger" size="sm" onClick={() => handleDelete(idea.id)}>
                                    Eliminar
                                  </Button>
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
