import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import MetricoolPanel from 'components/Metricool/MetricoolPanel';
import { supabase } from '../../supabaseClient';

const Home = () => {
  document.title = "Planeacion | 7 AM Digital";

  const [iframeUrl, setIframeUrl] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile(); // Comprobación inicial
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Quitar scroll vertical
  useEffect(() => {
    document.body.style.overflowY = "hidden";
    document.documentElement.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "auto";
      document.documentElement.style.overflowY = "auto";
    };
  }, []);

  useEffect(() => {
    const fetchIframeUrl = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ Usuario no autenticado o error:", userError);
        return;
      }

      console.log("✅ Usuario logueado:", user.email);

      const { data, error } = await supabase
        .from("users_data")
        .select("metricoolIframe")
        .eq("email", user.email)
        .single();

      if (error) {
        console.error("❌ Error al consultar la tabla users_data:", error);
      } else {
        console.log("✅ iframe encontrado:", data.metricoolIframe);
        setIframeUrl(data.metricoolIframe);
      }
    };

    fetchIframeUrl();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content" style={{
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {isMobile ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>⚠ No disponible en móvil</h2>
            <p>Por favor use un computador para acceder a esta sección.</p>
          </div>
        ) : (
          <MetricoolPanel />
        )}
      </div>
    </React.Fragment>
  );
};

Home.propTypes = {
  t: PropTypes.any
};

export default Home;
