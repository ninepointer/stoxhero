// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
// import { io } from 'socket.io-client';
import { useEffect, useContext} from "react";
import React from "react";
// import { userContext } from "../../AuthContext";
import ReactGA from "react-ga"


// Data
// import authorsTableData from "./data/authorsTableData";
// import projectsTableData from "./data/projectsTableData";
import Header from "./Header";
import { userContext } from "../../AuthContext";

function Tables() {
  const getDetails = useContext(userContext);
  useEffect(() => {
    window.webengage.track('internship_tab_clicked', {
      user: getDetails?.userDetails?._id,
    });
    ReactGA.pageview(window.location.pathname)
  }, []);

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <Header/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
