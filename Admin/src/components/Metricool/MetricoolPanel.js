import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const MetricoolPanel = () => {
  const [iframe, setIframe] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(240);

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

  useEffect(() => {
    const sidebar = document.querySelector('aside') || document.querySelector('.sidebar') || document.querySelector('#sidebar');
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        setSidebarWidth(width);
      }
    });

    if (sidebar) observer.observe(sidebar);

    return () => {
      if (sidebar) observer.unobserve(sidebar);
    };
  }, []);

  const wrapperStyle = {
    position: 'fixed',
    top: 0,
    left: `${sidebarWidth}px`,
    width: `calc(100vw - ${sidebarWidth}px)`,
    height: '100vh',
    zIndex: 1,
    backgroundColor: '#fff',
    transition: 'left 0.3s ease-in-out, width 0.3s ease-in-out'
  };

  const iframeStyle = {
    width: '100%',
    height: '100%',
    border: 'none',
    overflow: 'auto'
  };

  const messageStyle = {
    ...wrapperStyle,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '1rem'
  };

  if (loading) {
    return (
      <div style={messageStyle}>
        <h4>Cargando estadísticas personalizadas...</h4>
      </div>
    );
  }

  if (!iframe) {
    return (
      <div style={messageStyle}>
        <h4>No se encontró un iframe configurado para este usuario.</h4>
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <iframe
        src={iframe}
        style={iframeStyle}
        title="Estadísticas Metricool"
      />
    </div>
  );
};

export default MetricoolPanel;
