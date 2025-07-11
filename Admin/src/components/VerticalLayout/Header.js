import PropTypes from 'prop-types';
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";
import logo7amImg from "../../assets/images/LOGO7AM.png";
import logo7amblanco from "../../assets/images/logo7amblanco.png";
import { withTranslation } from "react-i18next";

import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../store/actions";

const Header = props => {
  function tToggle() {
  if (window.innerWidth < 0) {
    document.body.classList.toggle("sidebar-open"); // Modo móvil
  } else {
    document.body.classList.toggle("sidebar-collapsed"); // Modo escritorio
  }
}

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm logo-icon">
                  <img src={logo7amImg} alt="logo" height="48" />
                </span>
                <span className="logo-lg logo-text">
                  <img src={logo7amImg} alt="logo" height="48" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm logo-icon">
                  <img src={logo7amblanco} alt="logo" height="48" />
                </span>
                <span className="logo-lg logo-text">
                  <img src={logo7amblanco} alt="logo" height="48" />
                </span>
              </Link>
            </div>
            <button
              type="button"
              className="btn btn-sm px-4 font-size-24 header-item waves-effect"
              id="vertical-menu-btn"
              onClick={tToggle}
              data-target="#topnav-menu-content"
            >
              <i className="mdi mdi-menu fs-4"></i>
            </button>
          </div>

          <ProfileMenu />
        </div>
      </header>
    </React.Fragment>
  );
};

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
};

const mapStatetoProps = state => {
  const {
    layoutType,
    showRightSidebar,
    leftMenu,
    leftSideBarType,
  } = state.Layout;
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header));
