import React from "react";

// Perfil
import PerfilUsuario from "../pages/Authentication/PerfilUsuario";
import EditarPerfil from "components/CommonForBoth/TopbarDropdown/EditarPerfil";



// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import ResetPasswordPage from "pages/Authentication/ResetPassword";


// Home
import Home from "../pages/Home/index";

// Planeacion
import Planeacion from "../pages/Planeacion";

// Inbox
import Inbox from "../pages/Inbox";

// Planificacion
import Planificacion from "../pages/Planificacion";

// SmartLinks
import SmartLinks from "../pages/SmartLinks";

// Anuncios
import Anuncios from "../pages/Anuncios";

// Plantillas
import Plantillas from "../pages/Plantillas";

//Ideas
import Ideas from "../pages/Ideas";

//ArticulosBlog
import ArticulosDelBlog from "../pages/ArticulosDelBlog";
import { components } from "react-select";



const userRoutes = [
  { path: "/Home", component: <Home/> },


  // //perfil
  { path: "/PerfilUsuario", component: <PerfilUsuario /> },
  { path: "/EditarPerfil", component: <EditarPerfil />},

  

  // Planeacion
  { path: "/planeacion", component: <Planeacion />},
  
  // Inbox
  { path: "/inbox", component: <Inbox />},

  // Planificacion
  { path: "/planificacion", component: <Planificacion />},

  // SmartLinks
  { path: "/smartlinks", component: <SmartLinks />},

  // Anuncios
  { path: "/anuncios", component: <Anuncios />},

  // Plantillas
  { path: "/plantillas", component: <Plantillas />},

  // Ideas
  { path: "/ideas", component: <Ideas />},

  // ArticulosBlog
  { path: "/articulosdelblog", component: <ArticulosDelBlog/>},



  // this route should be at the end of all other routes
  { path: "/", component: <Home /> },
];

const authRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
  { path: "/resetpassword", component: <ResetPasswordPage />},


  
];

export { userRoutes, authRoutes };
