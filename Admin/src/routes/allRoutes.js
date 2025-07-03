import React from "react";

// Perfil
import PerfilUsuario from "../pages/Authentication/PerfilUsuario";
import EditarPerfil from "components/CommonForBoth/TopbarDropdown/EditarPerfil";



// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";


// Dashboard
import Dashboard from "../pages/Dashboard/index";

// Planificacion
import Planificacion from "../pages/Planificacion";

// Plantillas
import Plantillas from "../pages/Plantillas";

//Ideas
import Ideas from "../pages/Ideas";

//ArticulosBlog
import ArticulosDelBlog from "../pages/ArticulosDelBlog";



const userRoutes = [
  { path: "/dashboard", component: <Dashboard /> },


  // //perfil
  { path: "/PerfilUsuario", component: <PerfilUsuario /> },
  { path: "/EditarPerfil", component: <EditarPerfil />},

  

  // Planificacion 
  { path: "/planificacion", component: <Planificacion />},

  // Plantillas
  { path: "/plantillas", component: <Plantillas />},

  // Ideas
  { path: "/ideas", component: <Ideas />},

  // ArticulosBlog
  { path: "/articulosdelblog", component: <ArticulosDelBlog/>},



  // this route should be at the end of all other routes
  { path: "/", component: <Dashboard /> },
];

const authRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },


  
];

export { userRoutes, authRoutes };
