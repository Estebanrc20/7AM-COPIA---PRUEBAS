import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const MetricoolPanel = () => {
  const [iframe, setIframe] = useState('');
  const [loading, setLoading] = useState(true);
  const [leftPadding, setLeftPadding] = useState(240); // menú abierto

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

  // Verifica si el menú está colapsado según una clase en el body o layout
  useEffect(() => {
    const checkSidebarState = () => {
      const isCollapsed =
        document.body.classList.contains('collapsed') ||
        document.body.classList.contains('sidebar-mini') ||
        document.querySelector('aside')?.offsetWidth < 100;

      setLeftPadding(isCollapsed ? 70 : 240);
    };

    checkSidebarState();

    const resizeObserver = new ResizeObserver(() => checkSidebarState());
    const sidebar = document.querySelector('aside');

    if (sidebar) {
      resizeObserver.observe(sidebar);
    }

    const interval = setInterval(checkSidebarState, 500); // respaldo

    return () => {
      if (sidebar) resizeObserver.disconnect();
      clearInterval(interval);
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
    textAlign: 'center',
    transition: 'left 0.3s ease'
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
      ...commonStyle,
      padding: 0,
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
