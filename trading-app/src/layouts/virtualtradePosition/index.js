
import React from "react";
import ReactGA from "react-ga"
// import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
// @mui material components
// import { Chart } from 'chart.js/auto';
// // Chart.register(...registerables);
// import Grid from "@mui/material/Grid";

// // Material Dashboard 2 React components
// import MDBox from "../../components/MDBox";



// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import Header from "./Header";

// Data



// Dashboard components

// import OverallTraderPnl from "./components/overallTraderPnl";
// import TraderwiseTraderPnl from "./components/TraderwiseTraderPNL";

function TraderPosition() {

  useEffect(()=>{
    ReactGA.pageview(window.location.pathname)
  },[]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header />
      <Footer />
    </DashboardLayout>
  );
}

export default TraderPosition;

// todo ---> mismatch