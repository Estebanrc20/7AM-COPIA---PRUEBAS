import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";   // 👈 importa tu cliente
import Logo from "../assets/images/logo7amblanco.png"; 

const MobileBlocker = ({ children, authPaths }) => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 🔹 Normalizamos la ruta (quitamos "/" final si existe)
  const currentPath = location.pathname.replace(/\/$/, "");
  const isAuthPath = authPaths.includes(currentPath);

  // 🔹 Función para cerrar sesión y mandar al login
  const handleBackToLogin = async () => {
    await supabase.auth.signOut();  // 👈 cerrar sesión
    navigate("/login", { replace: true }); // 👈 ir al login limpio
  };

  if (isMobile && !isAuthPath) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "20px",
          background: "#000b24",
          color: "#fff"
        }}
      >
        {/* Logo */}
        <img 
          src={Logo}  
          alt="7AM Digital" 
          style={{ width: "210px", maxWidth: "80%", marginBottom: "30px" }}
        />

        <h2>⚠ No disponible en móvil</h2>
        <p style={{ marginBottom: "20px" }}>
          Por favor use un computador para acceder a esta seccion.</p>

        {/* Botón que lleva al login */}
        <button
          onClick={handleBackToLogin}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ffffffff",
            color: "#000b24",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500"   // 👈 aquí lo puse en negrilla
          }}
        >
          Volver al login
        </button>
      </div>
    );
  }

  return children;
};

export default MobileBlocker;
