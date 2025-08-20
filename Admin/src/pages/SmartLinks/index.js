import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient';

const Home = () => {
  document.title = "SmartLinks | 7 AM Digital";

  const [smartlinksUrl, setSmartlinksUrl] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  // Detectar si es móvil o tablet
  useEffect(() => {
    const checkDevice = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    const fetchSmartlinkUrl = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ Usuario no autenticado o error:", userError);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users_data")
        .select("smartlinks")
        .eq("email", user.email)
        .single();

      if (error || !data) {
        console.error("❌ Error al consultar la tabla users_data:", error);
        setNotFound(true);
      } else if (!data.smartlinks) {
        console.warn("⚠️ El campo 'smartlinks' está vacío para este usuario.");
        setNotFound(true);
      } else {
        let url = data.smartlinks;
        url += url.includes("?") ? "&redirect=smartlink" : "?redirect=smartlink";
        setSmartlinksUrl(url);
      }

      setLoading(false);
    };

    fetchSmartlinkUrl();
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
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
      {isMobileOrTablet ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h2>⚠ No disponible en móvil</h2>
          <p>Por favor use un computador para acceder a esta sección.</p>
        </div>
      ) : loading ? (
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
          src={smartlinksUrl}
          title="SmartLinks"
          style={{
            width: "90%",
            height: "calc(100vh + 60px)",  // +60px extra
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
