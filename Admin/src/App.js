import PropTypes from 'prop-types';
import React from "react";
import { Routes, Route } from 'react-router-dom';
import { connect } from "react-redux";

import { userRoutes, authRoutes } from "./routes/allRoutes";
import Authmiddleware from "./routes/middleware/Authmiddleware";
import NonAuthLayout from "./components/NonAuthLayout";
import MobileBlocker from "./components/MobileBlocker";

import "./assets/scss/theme.scss";

const App = () => {
  return (
    <React.Fragment>
      <MobileBlocker>   {/* 👈 Envolvemos todo en MobileBlocker */}
        <Routes>
          {authRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<NonAuthLayout>{route.component}</NonAuthLayout>}
              key={idx}
            />
          ))}

          {userRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<Authmiddleware>{route.component}</Authmiddleware>}
              key={idx}
            />
          ))}
        </Routes>
        </MobileBlocker>
    </React.Fragment>
  );
};

App.propTypes = {
  layout: PropTypes.any
};

const mapStateToProps = state => {
  return { layout: state.Layout };

};

export default connect(mapStateToProps, null)(App);