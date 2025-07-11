import React, { useState } from "react"
import PropTypes from 'prop-types'

import { connect } from "react-redux"

import { Link } from "react-router-dom"

// Redux Store
import { showRightSidebarAction, toggleLeftmenu } from "../../store/actions"
// reactstrap
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu,DropdownItem } from "reactstrap"

// Import menuDropdown

import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"

//i18n
import { withTranslation } from "react-i18next"

// import images
/*import logodarkImg from "../../assets/images/logo-dark.png";
import logosmImg from "../../assets/images/logo-sm.png";
import logolightImg from "../../assets/images/logo-light.png";*/
import logo7AMImg from "../../assets/images/LOGO7AM.png";
import logo7amblanco from "../../assets/images/logo7amblanco.png";
const Header = props => {

  
  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="/Home" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logo7AMImg} alt="" height="48" />
                </span>
                <span className="logo-lg">
                  <img src={logo7AMImg} alt="" height="48" />
                </span>
              </Link>

              <Link to="/Home" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logo7AMImg} alt="" height="48" />
                </span>
                <span className="logo-lg">
                  <img src={logo7AMImg} alt="" height="48" />
                </span>
              </Link>
              </div>
              
            
            
            <ProfileMenu />        
            <div className="dropdown d-inline-block">
                <button
                  onClick={() => {
                    props.showRightSidebarAction(!props.showRightSidebar)
                  }}
                  type="button"
                  className="btn header-item noti-icon right-bar-toggle waves-effect"
                >
                  <i className="mdi mdi-cog-outline"></i>
                </button>
              </div>
            </div>
          </div>
      </header>
    </React.Fragment>
  )
}

Header.propTypes = {
  leftMenu: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func
}

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar, leftMenu } = state.Layout
  return { layoutType, showRightSidebar, leftMenu }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
})(withTranslation()(Header))
