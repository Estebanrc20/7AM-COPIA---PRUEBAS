import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient';

const Home = () => {
  document.title = "Anuncios | 7 AM Digital";

  const [anunciosUrl, setAnunciosUrl] = useState("");

  useEffect(() => {
    const fetchAnunciosUrl = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ Usuario no autenticado o error:", userError);
        return;
      }

      const { data, error } = await supabase
        .from("users_data")
        .select("anuncios")
        .eq("email", user.email)
        .single();

      if (error) {
        console.error("❌ Error al consultar la tabla users_data:", error);
      } else {
        const url = data.anuncios;
        if (url) {
          setAnunciosUrl(url); // No agregamos redirect, ya está incluido en la URL
        }
      }
    };

    fetchAnunciosUrl();
  }, []);

  return (
    <div className="page-content" style={{ padding: 0, margin: 0 }}>
      {anunciosUrl ? (
        <iframe
          src={anunciosUrl}
          title="Anuncios"
          style={{
            width: "100vw",
            height: "calc(100vh - 60px)", // Ajusta según tu diseño
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
