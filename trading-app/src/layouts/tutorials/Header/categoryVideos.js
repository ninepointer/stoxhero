// Material Dashboard 2 React example components
import ReactGA from "react-ga"
import React, { useEffect, useContext, useState} from "react";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import CategoryVideos from "../data/categoryVideos";

function Tables() {
  
  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
  }, []);

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <CategoryVideos/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
