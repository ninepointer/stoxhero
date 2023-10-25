// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import MarginXDetails from "../data/marginXDetails"

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
      <MarginXDetails/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
