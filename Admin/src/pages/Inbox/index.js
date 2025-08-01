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
        if (url) {
          url += url.includes("?") ? "&redirect=Inbox" : "?redirect=Inbox";
          setInboxUrl(url);
        }
      }
    };

    fetchInboxUrl();
  }, []);

  return (
    <div className="page-content" style={{ padding: 0, margin: 0 }}>
      {inboxUrl ? (
        <iframe
          src={inboxUrl}
          title="Inbox"
          style={{
            width: "100vw",
            height: "calc(100vh - 60px)", // Ajusta 60px si tienes header fijo
            border: "none",
            margin: 0,
            padding: 0,
            display: "block",
            overflow: "hidden"
          }}
        />
      ) : (
        <p style={{ padding: "2rem" }}>Cargando enlace personalizado...</p>
      )}
    </div>
  );
};

Home.propTypes = {
  t: PropTypes.any
};

export default Home;
