import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
        background: "#000b24",
        color: "#fff"
      }}>
        {/* 👇 Logo personalizado (ponlo en public/logo.png o la ruta que uses) */}
        <img 
          src={Logo}  
          alt="7AM Digital" 
          style={{ width: "120px", marginBottom: "25px" }} 
        />

        <h2>⚠ No disponible en móvil</h2>
        <p style={{ marginBottom: "20px" }}>
          Esta sección solo está disponible desde un computador.  
          Por favor accede desde un PC para continuar.
        </p>

        {/* 👇 Botón que lleva al login */}
        <button
          onClick={() => navigate("/Login")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ffffffff",
            color: "#000b24",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px"
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
