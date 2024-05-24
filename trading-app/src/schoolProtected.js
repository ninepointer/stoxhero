import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "./AuthContext"; // Adjust the import path to where your UserContext is defined

const SchoolDetailsProtectedRoute = ({ children }) => {
    const getDetails = useContext(userContext); // Destructure userDetails from your context
    const navigate = useNavigate();

    useEffect(() => {
        if (getDetails?.userDetails?.schoolDetails?.grade != null) {
            setTimeout(()=>{
                navigate('/finowledge');
            },400)
        }
    }, [getDetails, navigate]);

    return children;
};

export default SchoolDetailsProtectedRoute;
