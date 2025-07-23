/*const MetricoolPanel = ({ loginToken }) => {
  const loginUrl = `https://app.metricool.com/autoin/KHDLAUEHUOLAKQCIJJXW`;

  return (
    <iframe
      src={loginUrl}
      style={{ width: '100%', height: '90vh', border: 'none'}}
      title="Metricool White Label"
    />
  );
};

export default MetricoolPanel;*/


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
    <div style={{ padding: '0rem', textAlign: 'center' }}>
      <iframe
        src={iframe}
        style={{ width: '100%', height: '80vh', border: 'none' }}
        title="Estadísticas Metricool"
      />
    </div>
  );
};

export default MetricoolPanel;
