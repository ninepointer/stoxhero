// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
// import ContestTradingView from "./data/tradingWindow";
// import { io } from 'socket.io-client';
// import { useEffect, useContext, useState} from "react";
// import { userContext } from "../../AuthContext";
// import ReactGA from "react-ga"
// import { useLocation } from "react-router-dom";
import DailyContestOrders from "./data/viewOrders";

function Tables() {


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
