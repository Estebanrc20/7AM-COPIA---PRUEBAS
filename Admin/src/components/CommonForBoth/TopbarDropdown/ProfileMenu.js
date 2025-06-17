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
import { supabase } from "../../../supabaseClient"; // Asegúrate que la ruta sea correcta
import user1 from "../../../assets/images/users/user-4.jpg";

const ProfileMenu = props => {
  const [menu, setMenu] = useState(false);
  const [username, setusername] = useState("Admin");
  const navigate = useNavigate(); // para redireccionar

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      setusername(obj.username || obj.displayName || "Usuario");
    }
  }, [props.success]);

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("authUser");
    navigate("/login", { replace: true });
  };

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
        >
          <img
            className="rounded-circle header-profile-user"
            src={user1}
            alt="Header Avatar"
          />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/PerfilUsuario">
            <i className="mdi mdi-account-circle font-size-17 align-middle me-1" />
            {props.t("Perfil")}
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
