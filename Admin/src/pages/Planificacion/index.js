import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient';

const Home = () => {
  document.title = "Planificacion | 7 AM Digital";

  const [planificacionUrl, setPlanificacionUrl] = useState("");

  useEffect(() => {
    const fetchPlannerUrl = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ Usuario no autenticado o error:", userError);
        return;
      }

      const { data, error } = await supabase
        .from("users_data")
        .select("planificacion")
        .eq("email", user.email)
        .single();

      if (error) {
        console.error("❌ Error al consultar la tabla users_data:", error);
      } else {
        let url = data.planificacion;
        if (url) {
          url += url.includes("?") ? "&redirect=Planner" : "?redirect=Planner";
          setPlanificacionUrl(url);
        }
      }
    };

    fetchPlannerUrl();
  }, []);

  return (
    <div className="page-content" style={{ padding: 0, margin: 0 }}>
      {planificacionUrl ? (
        <iframe
          src={planificacionUrl}
          title="Planificacion"
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
