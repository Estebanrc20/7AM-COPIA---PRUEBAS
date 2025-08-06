import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient';

const Home = () => {
  document.title = "Inbox | 7 AM Digital";

  const [inboxUrl, setInboxUrl] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInboxUrl = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ Usuario no autenticado o error:", userError);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users_data")
        .select("inbox")
        .eq("email", user.email)
        .single();

      if (error || !data) {
        console.error("❌ Error al consultar la tabla users_data:", error);
        setNotFound(true);
      } else if (!data.inbox) {
        console.warn("⚠️ El campo 'inbox' está vacío para este usuario.");
        setNotFound(true);
      } else {
        let url = data.inbox;
        url += url.includes("?") ? "&redirect=Inbox" : "?redirect=Inbox";
        setInboxUrl(url);
      }

      setLoading(false);
    };

    fetchInboxUrl();
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="page-content" style={{ padding: 0, margin: 0, height: "100vh", width: "100%" }}>
      {loading ? (
        <p style={{ padding: "2rem" }}>Cargando enlace personalizado...</p>
      ) : notFound ? (
        <div style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "2rem"
        }}>
          <h4 style={{ fontSize: "1.2rem", color: "#363636ff" }}>
            No se encontró un iframe configurado para este usuario.
          </h4>
        </div>
      ) : (
        <iframe
          src={inboxUrl}
          title="Inbox"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block"
          }}
        />
      )}
    </div>
  );
};

Home.propTypes = {
  t: PropTypes.any
};

export default Home;
