import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const MobileBlocker = ({ children, authPaths }) => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Verificar si la ruta actual es pública (login, register, forgot-password)
  const isAuthPath = authPaths.includes(location.pathname);

  if (isMobile && !isAuthPath) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
        background: "#0b1220",
        color: "#fff"
      }}>
        <img 
          src="/logo192.png" 
          alt="7AM Digital" 
          style={{ width: "80px", marginBottom: "20px" }} 
        />
        <h2>⚠ No disponible en móvil</h2>
        <p>Por favor ingresa desde un computador para continuar.</p>
      </div>
    );
  }

  return children;
};

export default MobileBlocker;
