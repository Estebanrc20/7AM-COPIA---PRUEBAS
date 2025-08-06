import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient';

const Home = () => {
  document.title = "Inbox | 7 AM Digital";

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

  // Elimina scroll vertical innecesario del body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="page-content" style={{ padding: 0, margin: 0, height: "100vh", width: "100%" }}>
      {inboxUrl ? (
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
