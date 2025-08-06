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

  useEffect(() => {
    // Prevenir scroll vertical del body
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      {inboxUrl ? (
        <iframe
          src={inboxUrl}
          title="Inbox"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
            margin: 0,
            padding: 0,
            zIndex: 1,
          }}
        />
      ) : (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <p>Cargando enlace personalizado...</p>
        </div>
      )}
    </>
  );
};

Home.propTypes = {
  t: PropTypes.any
};

export default Home;
