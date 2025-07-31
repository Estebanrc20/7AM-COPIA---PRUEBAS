import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient';

const Home = () => {
  document.title = "Planeación | 7 AM Digital";

  const [iframeUrl, setIframeUrl] = useState("");

  // Quitar scroll vertical al cargar esta vista
  useEffect(() => {
    document.body.style.overflowY = "hidden";
    document.documentElement.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "auto";
      document.documentElement.style.overflowY = "auto";
    };
  }, []);

  // Obtener URL personalizada del usuario desde Supabase
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
        .select("inbox")
        .eq("email", user.email)
        .single();

      if (error) {
        console.error("❌ Error al consultar la tabla users_data:", error);
      } else {
        console.log("✅ iframe encontrado:", data.inbox);
        setIframeUrl(data.inbox);
      }
    };

    fetchIframeUrl();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
        {iframeUrl ? (
          <iframe referrerPolicy='origin'
            src={iframeUrl}
            title="Panel de Inbox"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: "none" }}
          />
        ) : (
          <p style={{ color: "#fff", textAlign: "center", paddingTop: "2rem" }}>Cargando panel...</p>
        )}
      </div>
    </React.Fragment>
  );
};

Home.propTypes = {
  t: PropTypes.any
};

export default Home;
