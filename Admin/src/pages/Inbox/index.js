import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient';

const Home = () => {
  document.title = "Inbox| 7 AM Digital";

  const [inboxUrl, setInboxUrl] = useState("");

  // Evita scroll vertical del body cuando se muestra el iframe
  useEffect(() => {
    document.body.style.overflowY = "hidden";
    document.documentElement.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "auto";
      document.documentElement.style.overflowY = "auto";
    };
  }, []);

  // Obtener la URL del inbox desde Supabase
  useEffect(() => {
    const fetchInboxUrl = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ Usuario no autenticado o error:", userError);
        return;
      }

      const { data, error } = await supabase
        .from("users_data")
        .select("inbox")
        .eq("email", user.email)
        .single();

      if (error) {
        console.error("❌ Error al consultar la tabla users_data:", error);
      } else if (data?.inbox) {
        let url = data.inbox;
        // Asegurar que tenga el parámetro redirect=Inbox
        if (!url.includes("redirect=Inbox")) {
          url += url.includes("?") ? "&redirect=Inbox" : "?redirect=Inbox";
        }
        setInboxUrl(url);
      }
    };

    fetchInboxUrl();
  }, []);

  return (
    <div className="page-content" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {inboxUrl ? (
        <iframe
          src={inboxUrl}
          title="Metricool Inbox"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        />
      ) : (
        <p style={{ textAlign: "center", paddingTop: "2rem" }}>Cargando panel de Inbox...</p>
      )}
    </div>
  );
};

Home.propTypes = {
  t: PropTypes.any
};

export default Home;
