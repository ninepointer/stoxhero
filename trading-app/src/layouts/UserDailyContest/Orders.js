// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import { useEffect, useContext, useState} from "react";
import ReactGA from "react-ga"
import DailyContestOrders from "./data/viewOrders";

function Tables() {
  
  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
  }, []);

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
        <DailyContestOrders />
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
