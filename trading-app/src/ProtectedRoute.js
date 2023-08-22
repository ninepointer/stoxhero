// ProtectedRoute.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({children }) => {
    const isAuthenticated = !!Cookies.get("jwtoken"); // Check if JWT exists in cookies
    const navigate = useNavigate();
    const location = useLocation();
    // console.log('token', Cookies.get("jwtoken"));
  
    // console.log('condition')
    if (!isAuthenticated) {
      setTimeout(() => {
        navigate('/login', { state: { from: location } });
        // console.log('navigated');
     }, 400);
      return null;
    }
  
    return children;
  };

export default ProtectedRoute;
