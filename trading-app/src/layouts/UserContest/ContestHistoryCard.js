// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import React,{memo} from 'react'
import ReactGA from "react-ga"
import ContestHistoryTradePage from "./data/ContestHistoryTradePage";

function Tables() {


  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
        <ContestHistoryTradePage />
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default memo(Tables);
