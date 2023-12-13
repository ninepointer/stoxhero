// ProtectedRoute.js
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({children }) => {
    const isAuthenticated = !!Cookies.get("jwtoken"); // Check if JWT exists in cookies
    const navigate = useNavigate();
    const location = useLocation();
    
    if (!isAuthenticated) {
      setTimeout(() => {
        navigate('/', { state: { from: location } });
     }, 400);
      return null;
    }
  
    return children;
  };

export default ProtectedRoute;
