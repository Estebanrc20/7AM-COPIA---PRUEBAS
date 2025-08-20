import PropTypes from "prop-types";
import React, { useEffect, useCallback, useRef } from "react";
import SimpleBar from "simplebar-react";
import MetisMenu from "metismenujs";
import withRouter from "components/Common/withRouter";
import { Link, useLocation } from "react-router-dom";
import { withTranslation } from "react-i18next";

const SidebarContent = props => {
  const location = useLocation();
  const ref = useRef();
  const path = location.pathname;

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;
      if (parent2) {
        parent2.classList.add("mm-show");
        const parent3 = parent2.parentElement;
        if (parent3) {
          parent3.classList.add("mm-active");
          parent3.childNodes[0].classList.add("mm-active");
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-show");
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show");
              parent5.childNodes[0].classList.add("mm-active");
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (let i = 0; i < items.length; ++i) {
      const item = items[i];
      const parent = item.parentElement;

      item.classList.remove("active");

      if (parent) {
        const parent2El = parent.childNodes[1];
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");
          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active");
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement;
            if (parent4) {
              parent4.classList.remove("mm-show");
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show");
                parent5.childNodes[0].classList.remove("mm-active");
              }
            }
          }
        }
      }
    }
  };

  const activeMenu = useCallback(() => {
    const pathName = location.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }

    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path, activateParentDropdown]);

  useEffect(() => {
    ref.current?.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    activeMenu();
  }, [activeMenu]);

  useEffect(() => {
    const handleLinkClick = () => {
      if (window.innerWidth < 992) {
        document.body.classList.remove("sidebar-enable");
      }

      const activeItems = document.querySelectorAll("#side-menu .mm-active, #side-menu .active, #side-menu .mm-show");
      activeItems.forEach(item => item.classList.remove("mm-active", "active", "mm-show"));

      document.querySelectorAll("#side-menu .waves-effect").forEach(el => {
        el.classList.remove("active");
      });
    };

    const menuLinks = document.querySelectorAll("#side-menu a");
    menuLinks.forEach(link => link.addEventListener("click", handleLinkClick));

    return () => {
      menuLinks.forEach(link => link.removeEventListener("click", handleLinkClick));
    };
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (!document.body.classList.contains("vertical-collpsed")) {
        setTimeout(() => {
          activeMenu();
        }, 300);
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Principal")}</li>

            <li>
              <Link to="/Home" className="waves-effect" id="menu-home">
                <i className="ti-home"></i>
                <span className="menu-text">{props.t("Home")}</span>
              </Link>
            </li>

            <li>
              <Link to="/Ideas" className="waves-effect" id="menu-ideas">
                <i className="ti-light-bulb"></i>
                <span className="menu-text">{props.t("Ideas de contenido")}</span>
              </Link>
            </li>

            <li>
              <Link
                to="/Planeacion"
                className="has-arrow waves-effect"
                id="menu-plan"
                onClick={(e) => {
                  e.preventDefault();
                  const submenu = document.getElementById("planeacionSubmenu");
                  const parentLi = e.currentTarget.parentElement;

                  if (submenu) {
                    submenu.classList.toggle("mm-show");
                    parentLi.classList.toggle("mm-active");
                  }

                  props.router.navigate("/Planeacion");
                }}
              >
                <i className="ti-bar-chart"></i>
                <span className="menu-text">{props.t("Planeación")}</span>
              </Link>

              <ul className="sub-menu" id="planeacionSubmenu" aria-expanded="false">
                <li>
                  <Link to="/Planificacion">{props.t("Planificación")}</Link>
                </li>
                <li>
                  <Link to="/Inbox">{props.t("Inbox")}</Link>
                </li>
                <li>
                  <Link to="/SmartLinks">{props.t("SmartLinks")}</Link>
                </li>
                <li>
                  <Link to="/Anuncios">{props.t("Anuncios")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/Plantillas" className="waves-effect" id="menu-plantillas">
                <i className="ti-layout"></i>
                <span className="menu-text">{props.t("Plantillas Canva")}</span>
              </Link>
            </li>

            <li>
              <Link to="/ArticulosDelBlog" className="waves-effect" id="menu-articulos">
                <i className="ti-write"></i>
                <span className="menu-text">{props.t("Articulos del blog")}</span>
              </Link>
            </li>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
  router: PropTypes.object,
};

export default withRouter(withTranslation()(SidebarContent));
