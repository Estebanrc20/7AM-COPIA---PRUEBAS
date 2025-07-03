import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient";

const ProfileMenu = props => {
  const [menu, setMenu] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [initial, setInitial] = useState(localStorage.getItem("userInitial") || "");
  const [bgColor, setBgColor] = useState(localStorage.getItem("userColor") || "#6C63FF");
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const generateRandomColor = () => {
    const colors = [
      "#6C63FF", "#FF6B6B", "#4DD0E1", "#81C784", "#BA68C8", "#FFD54F", "#A1887F", "#4FC3F7", "#81D4FA", 
      "#FFB74D", "#FF8A65"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const authUser = JSON.parse(localStorage.getItem("authUser"));
      if (!authUser) return;

      const email = authUser.email;

      const { data, error } = await supabase
        .from("users_data")
        .select("nombre, foto_perfil")
        .eq("email", email)
        .single();

      if (!error && data) {
        const nombre = data.nombre || "Usuario";
        const userInitial = nombre.trim().charAt(0).toUpperCase();

        let color = localStorage.getItem("userColor");
        if (!color) {
          color = generateRandomColor();
          localStorage.setItem("userColor", color);
        }

        setUsername(nombre);
        setInitial(userInitial);
        setBgColor(color);

        localStorage.setItem("username", nombre);
        localStorage.setItem("userInitial", userInitial);
        localStorage.setItem("userColor", color);

        if (data.foto_perfil) {
          setProfilePic(data.foto_perfil);
          localStorage.setItem("profilePic", data.foto_perfil);
        }
      }

      setLoading(false);
    };

    fetchUserData();
  }, [props.success]);

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("authUser");
    localStorage.removeItem("username");
    localStorage.removeItem("userInitial");
    localStorage.removeItem("userColor");
    localStorage.removeItem("profilePic");
    navigate("/login", { replace: true });
  };

  // Evitar que se vea la U mientras se carga
  if (loading && !initial) {
    return null;
  }

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item waves-effect"
          id="page-header-user-dropdown"
          tag="button"
          title={username}
        >
          {profilePic ? (
            <img
              src={profilePic}
              alt="Perfil"
              className="rounded-circle"
              style={{
                width: "36px",
                height: "36px",
                objectFit: "cover",
              }}
            />
          ) : initial ? (
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: bgColor,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "16px"
              }}
              title={username}
            >
              {initial}
            </div>
          ) : (
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#ced4da"
              }}
            />
          )}
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/PerfilUsuario">
            <i className="mdi mdi-account-circle font-size-17 align-middle me-1" />
            {props.t("Ver Perfil")}
          </DropdownItem>

          <DropdownItem tag="a" href="/EditarPerfil">
            <i className="mdi mdi-account-edit font-size-17 align-middle me-1" />
            {props.t("Editar Perfil")}
          </DropdownItem>

          <div className="dropdown-divider" />
          <DropdownItem onClick={logout} className="text-danger">
            <i className="bx bx-power-off font-size-17 align-middle me-1 text-danger" />
            <span>{props.t("Cerrar Sesión")}</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any
};

const mapStatetoProps = state => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default connect(mapStatetoProps)(withTranslation()(ProfileMenu));
