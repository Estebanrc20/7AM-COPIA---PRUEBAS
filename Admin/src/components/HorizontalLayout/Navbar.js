import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Row, Col, Collapse } from "reactstrap";
import { Link } from "react-router-dom";
import withRouter from "components/Common/withRouter";
import classname from "classnames";

// i18n
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";

const Navbar = (props) => {
  const [auth, setauth] = useState(false);

  useEffect(() => {
    var matchingMenuItem = null;
    var ul = document.getElementById("navigation");
    var items = ul.getElementsByTagName("a");
    removeActivation(items);
    for (var i = 0; i < items.length; ++i) {
      if (window.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      const item = items[i];
      const parent = item.parentElement;
      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent && parent.classList.contains("active")) {
        parent.classList.remove("active");
      }
    }
  };

  function activateParentDropdown(item) {
    item.classList.add("active");
    let parent = item.parentElement;
    for (let i = 0; i < 6 && parent; i++) {
      parent.classList.add("active");
      parent = parent.parentElement;
    }
  }

  return (
    <React.Fragment>
      <div className="topnav">
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={props.leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/Home">
                    <i className="ti-home me-2" />
                    {props.t("Home")} {props.menuOpen}
                  </Link>
                </li>

                {/* Autenticación con dropdown */}
                <li
                  className={classname("nav-item dropdown", {
                    show: auth,
                  })}
                  onMouseEnter={() => setauth(true)}
                  onMouseLeave={() => setauth(false)}
                >
                  <span className="nav-link dropdown-toggle" role="button">
                    <i className="ti-archive me-2"></i>
                    {props.t("Authentication")}
                  </span>

                  <div
                    className={classname(
                      "dropdown-menu mega-dropdown-menu px-2 dropdown-mega-menu-lg",
                      { show: auth }
                    )}
                  >
                    <div className="row">
                      <div className="col-lg-6">
                        <Link to="/pages-login" className="dropdown-item">
                          {props.t("Login")}
                        </Link>
                        <Link to="/pages-register" className="dropdown-item">
                          {props.t("Register")}
                        </Link>
                        <Link to="/page-recoverpw" className="dropdown-item">
                          {props.t("Recover Password")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  );
};

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStatetoProps = (state) => {
  const { leftMenu } = state.Layout;
  return { leftMenu };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
);
