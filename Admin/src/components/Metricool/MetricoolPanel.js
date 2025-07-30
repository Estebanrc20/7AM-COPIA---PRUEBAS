import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const MetricoolPanel = () => {
  const [iframe, setIframe] = useState("");
  const [loading, setLoading] = useState(true);
  const [leftPadding, setLeftPadding] = useState(240); // ancho inicial del menú expandido

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

  // Detectar cambio del ancho del menú
  useEffect(() => {
    const sidebar = document.querySelector('aside') || document.querySelector('.sidebar') || document.querySelector('#sidebar');
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        setLeftPadding(newWidth);
      }
    });

    if (sidebar) observer.observe(sidebar);

    return () => {
      if (sidebar) observer.unobserve(sidebar);
    };
  }, []);

  const commonStyle = {
    position: 'absolute',
    top: 0,
    left: leftPadding,
    right: 0,
    bottom: 0,
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    textAlign: 'center'
  };

  if (loading) {
    return (
      <div style={commonStyle}>
        <h4>Cargando estadísticas personalizadas...</h4>
      </div>
    );
  }

  if (!iframe) {
    return (
      <div style={commonStyle}>
        <h4>No se encontró un iframe configurado para este usuario.</h4>
      </div>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: leftPadding,
      right: 0,
      bottom: 0,
      zIndex: 1
    }}>
      <iframe
        src={iframe}
        style={{
          width: '100%',
          height: '100%',
          border: 'none'
        }}
        title="Estadísticas Metricool"
      />
    </div>
  );
};

export default MetricoolPanel;
