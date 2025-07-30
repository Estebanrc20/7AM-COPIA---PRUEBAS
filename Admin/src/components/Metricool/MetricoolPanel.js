import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const MetricoolPanel = () => {
  const [iframe, setIframe] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIframe = async () => {
      const { data, error: userError } = await supabase.auth.getUser();

      if (userError || !data?.user) {
        console.error("Error obteniendo el usuario:", userError);
        setLoading(false);
        return;
      }

      const userId = data.user.id;

      const { data: userData, error } = await supabase
        .from("users_data")
        .select("metricoolIframe")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error obteniendo el iframe:", error);
        setLoading(false);
        return;
      }

      setIframe(userData.metricoolIframe);
      setLoading(false);
    };

    fetchIframe();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '0rem', textAlign: 'center' }}>
        <h4>Cargando estadísticas personalizadas...</h4>
      </div>
    );
  }

  if (!iframe) {
    return (
      <div style={{ padding: '0rem', textAlign: 'center' }}>
        <h4>No se encontró un iframe configurado para este usuario.</h4>
      </div>
    );
  }

  return (
    <iframe
      src={iframe}
      style={{
        width: 'calc(100vw - 240px)', // ocupar solo lo visible del contenido
        height: '100vh',
        border: 'none',
        overflow: 'hidden',
        marginLeft: '240px' // compensar el sidebar
      }}
      title="Estadísticas Metricool"
    />
  );
};

export default MetricoolPanel;
