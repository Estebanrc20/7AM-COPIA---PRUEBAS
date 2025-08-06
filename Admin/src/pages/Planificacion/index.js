import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient';

const Home = () => {
  document.title = "Planificación | 7 AM Digital";

  const [planificacionUrl, setPlanificacionUrl] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlannerUrl = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ Usuario no autenticado o error:", userError);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users_data")
        .select("planificacion")
        .eq("email", user.email)
        .single();

      if (error || !data) {
        console.error("❌ Error al consultar la tabla users_data:", error);
        setNotFound(true);
      } else if (!data.planificacion) {
        console.warn("⚠️ El campo 'planificacion' está vacío para este usuario.");
        setNotFound(true);
      } else {
        let url = data.planificacion;
        url += url.includes("?") ? "&redirect=Planner" : "?redirect=Planner";
        setPlanificacionUrl(url);
      }

      setLoading(false);
    };

    fetchPlannerUrl();
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="page-content" style={{ padding: 0, margin: 0, height: "100vh", width: "100%" }}>
      {loading ? (
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
          <p style={{ fontSize: "1.2rem", color: "#363636ff" }}>
             No se encontró un iframe configurado para esta sección.
          </p>
        </div>
      ) : (
        <iframe
          src={planificacionUrl}
          title="Planificación"
          style={{
            width: "100%",
            height: "100%",
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
