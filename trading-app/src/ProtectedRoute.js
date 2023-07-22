// ProtectedRoute.js
import React from "react";
import { Route, Redirect, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ element: Element, ...rest }) => {
    const isAuthenticated = !!Cookies.get("jwt"); // Check if JWT exists in cookies
    const navigate = useNavigate();
  
    return (
        <Route
          {...rest}
          render={props =>
            isAuthenticated ? (
              <Element {...props} />
            ) : (
              <navigate
                to={{
                  pathname: '/login',
                  state: { from: props.location },
                }}
              />
            )
          }
        />
      );
  };

export default ProtectedRoute;
