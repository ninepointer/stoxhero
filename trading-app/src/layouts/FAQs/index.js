// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import FAQs from "./faqs";
import React, { useEffect, useContext, useState} from "react";
import ReactGA from "react-ga"

function Tables() {

  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
  }, []);
  
  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <FAQs/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
