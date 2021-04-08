import React from "react";
import { Route, Redirect } from "react-router-dom";

const Routeguard = ({ component: Component, ...rest }) => {
  let authStatus = localStorage.getItem("authStatus");

  return (
    <Route
      {...rest}
      render={(props) => {
        if (authStatus === "true") {
          return <Component {...props} />;
        } else {
          return <Redirect to="/login" />;
        }
      }}
    />
  );
};

export default Routeguard;
