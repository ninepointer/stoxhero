// Material Dashboard 2 React example components
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import BattleDetails from "../data/battleDetails"

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
      <BattleDetails/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
