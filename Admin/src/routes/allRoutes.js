import React from "react";

// Perfil
import PerfilUsuario from "../pages/Authentication/PerfilUsuario";

// Pages Calendar
import Calendario from "../pages/Calendario/index";

{/* //email
{import PublicacionSimultanea from "../pages/Planificacion/publicacionsimultanea";
import Analisis from "../pages/Planificacion/analisis";
import Gestion from "../pages/Planificacion/gestion";
import Reportes from "../pages/Planificacion/reportes"; */}


// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";


// Dashboard
import Dashboard from "../pages/Dashboard/index";
// Charts
import ChartApex from "../pages/Charts/Apexcharts";
import ChartjsChart from "../pages/Charts/ChartjsChart";
import EChart from "../pages/Charts/EChart";
import SparklineChart from "../pages/Charts/SparklineChart";

// Planificacion
import Planificacion from "../pages/Planificacion";

// Plantillas
import Plantillas from "../pages/Plantillas";

//Ideas
import Ideas from "../pages/Ideas";

//ArticulosBlog
import ArticulosDelBlog from "../pages/ArticulosDelBlog";


//Pages
import PagesStarter from "../pages/Utility/pages-starter";
import PagesMaintenance from "../pages/Utility/pages-maintenance";
import PagesComingsoon from "../pages/Utility/pages-comingsoon";
import PagesTimeline from "../pages/Utility/pages-timeline";
import PagesInvoice from "../pages/Utility/PagesInvoice";
import PagesFaqs from "../pages/Utility/pages-faqs";
import PagesPricing from "../pages/Utility/pages-pricing";
import Pages404 from "../pages/Utility/pages-404";
import Pages500 from "../pages/Utility/pages-500";
import PagesGallery from "../pages/Utility/PagesGallery";
import PagesDirectory from "../pages/Utility/PagesDirectory";
import PagesProfile from "pages/Utility/pages-profile";

const userRoutes = [
  { path: "/dashboard", component: <Dashboard /> },

  // //calendario
  { path: "/calendario", component: <Calendario /> },

  // //perfil
  { path: "/PerfilUsuario", component: <PerfilUsuario /> },

  {/*
  //Email
{ path: "/publicacionsimultanea", component: <PublicacionSimultanea/> },
  { path: "/analisis", component: <Analisis/> },
  { path: "/gestion", component: <Gestion/> },
  { path: "/reportes", component: <Reportes /> }, 
   */},
  

  // Planificacion 
  { path: "/planificacion", component: <Planificacion />},

  // Plantillas
  { path: "/plantillas", component: <Plantillas />},

  // Ideas
  { path: "/ideas", component: <Ideas />},

  // ArticulosBlog
  { path: "/articulosdelblog", component: <ArticulosDelBlog/>},

  

  //Charts
  { path: "/apex-charts", component: <ChartApex /> },
  { path: "/chartjs-charts", component: <ChartjsChart /> },
  { path: "/e-charts", component: <EChart /> },
  { path: "/sparkline-charts", component: <SparklineChart /> },

  

  //Utility
  { path: "/pages-starter", component: <PagesStarter /> },
  { path: "/pages-timeline", component: <PagesTimeline /> },
  { path: "/pages-invoice", component: <PagesInvoice /> },
  { path: "/pages-directory", component: <PagesDirectory /> },
  { path: "/pages-faqs", component: <PagesFaqs /> },
  { path: "/pages-pricing", component: <PagesPricing /> },
  { path: "/pages-gallery", component: <PagesGallery /> },
  { path: "/pages-profile", component: <PagesProfile /> },

  // this route should be at the end of all other routes
  { path: "/", component: <Dashboard /> },
];

const authRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },

  { path: "/pages-maintenance", component: <PagesMaintenance /> },
  { path: "/pages-comingsoon", component: <PagesComingsoon /> },
  { path: "/pages-404", component: <Pages404 /> },
  { path: "/pages-500", component: <Pages500 /> },

  
];

export { userRoutes, authRoutes };
