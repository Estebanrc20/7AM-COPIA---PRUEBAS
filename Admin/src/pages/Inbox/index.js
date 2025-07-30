import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import MetricoolPanel from 'components/Metricool/MetricoolPanel';
import { supabase } from '../../supabaseClient';

const Home = () => {
  document.title = "Planeacion | 7 AM Digital";

  const [iframeUrl, setIframeUrl] = useState("");

  // Quitar scroll vertical
  useEffect(() => {
    document.body.style.overflowY = "hidden";
    document.documentElement.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "auto";
      document.documentElement.style.overflowY = "auto";
    };
  }, []);

  useEffect(() => {
    const fetchIframeUrl = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ Usuario no autenticado o error:", userError);
        return;
      }

      console.log("✅ Usuario logueado:", user.email);

      const { data, error } = await supabase
        .from("users_data")
        .select("inbox")
        .eq("email", user.email)
        .single();

      if (error) {
        console.error("❌ Error al consultar la tabla users_data:", error);
      } else {
        console.log("✅ iframe encontrado:", data.inbox);
        setIframeUrl(data.inbox);
      }
    };

    fetchIframeUrl();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <MetricoolPanel />
      </div>

    </React.Fragment>
  );
};

Home.propTypes = {
  t: PropTypes.any
};

export default Home;
