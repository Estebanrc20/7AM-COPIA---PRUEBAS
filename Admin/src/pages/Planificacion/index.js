import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import MetricoolPanel from 'components/Metricool/MetricoolPanel';
import { supabase } from '../../supabaseClient';

const Home = () => {
  document.title = "Planificación y Analítica | 7 AM Digital";

  const [iframeUrl, setIframeUrl] = useState("");

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
      <div className="page-content" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <MetricoolPanel />
      </div>

      {/* Footer fijo */}
      {/*<footer style={{
        textAlign: "center",
        padding: "1rem",
        background: "#f8f9fa",
        color: "#333",
        position: "fixed",
        bottom: 0,
        left: 240,
        width: "calc(100% - 240px)",
        fontSize: "14px",
        zIndex: 999
      }}>
        © 2025 7AM Digital
      </footer>*/}
    </React.Fragment>
  );
};

Home.propTypes = {
  t: PropTypes.any
};

export default Home;
