import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient';

const Home = () => {
  document.title = "Planeación | 7 AM Digital";

  const [inboxUrl, setInboxUrl] = useState("");

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
      } else {
        let url = data.inbox;
        // Si ya tiene parámetros, usa &redirect=Inbox, si no, usa ?redirect=Inbox
        if (url) {
          url += url.includes("?") ? "&redirect=Inbox" : "?redirect=Inbox";
          setInboxUrl(url);
        }
      }
    };

    fetchInboxUrl();
  }, []);

  return (
    <div className="page-content" style={{ padding: "2rem" }}>
      {inboxUrl ? (
        <div style={{ textAlign: "center" }}>
          <h4>Tu panel de Inbox</h4>
          <button
            onClick={() => window.open(inboxUrl, "_blank")}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              backgroundColor: "#0d6efd",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Abrir Inbox
          </button>
        </div>
      ) : (
        <p>Cargando enlace personalizado...</p>
      )}
    </div>
  );
};

Home.propTypes = {
  t: PropTypes.any
};

export default Home;
