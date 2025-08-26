import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from "react";
import { supabase } from '../../supabaseClient';

const Home = () => {
  document.title = "SmartLinks | 7 AM Digital";

  const [smartlinksUrl, setSmartlinksUrl] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [iframeHeight, setIframeHeight] = useState("100vh");
  const iframeRef = useRef(null);

  // Detectar si es móvil o tablet
  useEffect(() => {
    const checkDevice = () => setIsMobileOrTablet(window.innerWidth < 1024);
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

  // Listener para recibir la altura desde el iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "setHeight") {
        setIframeHeight(event.data.height + "px");
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div
      className="page-content"
      style={{
        width: '100%',
        minHeight: "100vh",
        overflow: 'auto',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {isMobileOrTablet ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h2>⚠ No disponible en móvil</h2>
          <p>Por favor use un computador para acceder a esta sección.</p>
        </div>
      ) : loading ? (
        <p style={{ padding: "2rem" }}>Cargando enlace personalizado...</p>
      ) : notFound ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "2rem"
          }}
        >
          <h4 style={{ fontSize: "1.2rem", color: "#363636ff" }}>
            No se encontró un iframe configurado para este usuario.
          </h4>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          src={smartlinksUrl}
          title="SmartLinks"
          style={{
            width: "100%",
            height: iframeHeight, // 👈 ajusta dinámicamente
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
