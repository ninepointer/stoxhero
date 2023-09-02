// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import Header from "./Header";

import ReactGA from "react-ga"
import React, { useEffect} from "react";

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
