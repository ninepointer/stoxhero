// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import Header from "./Header";
import PastContest from "./Header/pastContestIndex";

import ReactGA from "react-ga"
import React, { useEffect, useContext, useState} from "react";

function Tables() {

  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
  }, []);
  
  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <PastContest/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
