import PropTypes from 'prop-types';
import React, { useState } from "react";

import { connect } from "react-redux";
import { Form, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Input, Button } from "reactstrap";

import { Link } from "react-router-dom";

// Import menuDropdown
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";

/*import logodarkImg from "../../assets/images/logo-dark.png";
import logosmImg from "../../assets/images/logo-sm.png";
import logolightImg from "../../assets/images/logo-light.png";*/
import logo7amImg from "../../assets/images/LOGO7AM.png";
import logo7amblanco from "../../assets/images/logo7amblanco.png";

//i18n
import { withTranslation } from "react-i18next";

// Redux Store
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../store/actions";

const Header = props => {
  const [search, setsearch] = useState(false);
  const [singlebtn, setSinglebtn] = useState(false);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  function tToggle() {
    var body = document.body;
    if (window.screen.width <= 992) {
      body.classList.toggle("sidebar-enable");
    } else {
      body.classList.toggle("vertical-collpsed");
      body.classList.toggle("sidebar-enable");
    }
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logo7amImg} alt="" height="48" />
                </span>
                <span className="logo-lg">
                  <img src={logo7amImg} alt="" height="48" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logo7amblanco} alt="" height="48" />
                </span>
                <span className="logo-lg">
                  <img src={logo7amblanco} alt="" height="48" />
                </span>
              </Link>
            </div>
            <button type="button" className="btn btn-sm px-4 font-size-24 header-item waves-effect"
              id="vertical-menu-btn"
              onClick={() => {
                tToggle();
              }}
              data-target="#topnav-menu-content"
            >
              <i className="mdi mdi-menu fs-4"></i>
            </button>

            <div className="d-none d-sm-block">


            </div>
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
  toggleLeftmenu: PropTypes.func
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
