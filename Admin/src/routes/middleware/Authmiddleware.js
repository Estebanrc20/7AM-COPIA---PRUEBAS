import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import VerticalLayout from "components/VerticalLayout";
import HorizontalLayout from "components/HorizontalLayout";

// constants
import { layoutTypes } from "../../constants/layout";

const Authmiddleware = (props) => {
  const location = useLocation();

  const { layoutType } = useSelector(state => ({
    layoutType: state.Layout.layoutType,
  }));

  const getLayout = (layoutType) => {
    switch (layoutType) {
      case layoutTypes.HORIZONTAL:
        return HorizontalLayout;
      case layoutTypes.VERTICAL:
      default:
        return VerticalLayout;
    }
  };

  const Layout = getLayout(layoutType);

  if (!localStorage.getItem("authUser")) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return (
    <React.Fragment>
      <Layout>{props.children}</Layout>
    </React.Fragment>
  );
};

export default Authmiddleware;
