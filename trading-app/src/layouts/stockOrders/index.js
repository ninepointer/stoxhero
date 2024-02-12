// Material Dashboard 2 React example components
import ReactGA from "react-ga"
import { useEffect, useContext, useState} from "react";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";


// Data
// import authorsTableData from "./data/authorsTableData";
// import projectsTableData from "./data/projectsTableData";
import Header from "./Header";

function Tables() {

  useEffect(() => {
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