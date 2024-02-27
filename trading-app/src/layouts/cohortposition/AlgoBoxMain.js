
import React from "react";
import axios from "axios";
import { useEffect, useContext, useMemo } from "react";
import { io } from "socket.io-client";
// @mui material components
import { Chart } from 'chart.js/auto';
// Chart.register(...registerables);
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";



// Material Dashboard 2 React example components
// import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
// import Footer from "../../examples/Footer";
// import ReportsBarChart from "../../examples/Charts/BarCharts/ReportsBarChart";
// import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";
// import ComplexStatisticsCard from "../../examples/Cards/StatisticsCards/ComplexStatisticsCard";

// // Data
// import reportsBarChartData from "./data/reportsBarChartData";
// import reportsLineChartData from "./data/reportsLineChartData";



// Dashboard components

// import Projects from "./components/Projects";
// import MismatchDetails from "./components/MismatchDetails";
// import InstrumentDetails from "./components/InstrumentDetails";
import MockOverallCompanyPNL from "./Component/MockOverallCompanyPNL";
import LiveOverallCompanyPNL from "./Component/LiveOverallCompanyPNL";
import MockTraderwiseCompanyPNL from "./Component/MockTraderwiseCompanyPNL";
import LiveTraderwiseCompanyPNL from "./Component/LiveTraderwiseCompanyPNL";
import { socketContext } from "../../socketContext";
// import OrdersOverview from "./components/OrdersOverview";

function AlgoBoxMain({batchName}) {

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
    // let socket;
    // try{
    //     socket = io.connect(`${baseUrl1}`)
    // } catch(err){
    //     throw new Error(err);
    // }

    const socket = useContext(socketContext);

  
       
      useEffect(()=>{
  
          //console.log(socket);
        //   socket.on("connect", ()=>{
              //console.log(socket.id);
              socket.emit("company-ticks",true)
        //   })

  
      }, []);
  
      const mockOverallCompanyPNL = useMemo(() => {
        return <MockOverallCompanyPNL batchName={batchName} socket={socket}/>
      }, [socket, batchName]);

      const mockTraderwiseCompanyPNL = useMemo(() => {
        return <MockTraderwiseCompanyPNL socket={socket} batchName={batchName} />
      }, [socket, batchName]);

      const liveOverallCompanyPNL = useMemo(() => {
        return <LiveOverallCompanyPNL socket={socket} batchName={batchName} />
      }, [socket, batchName]);

      const liveTraderwiseCompanyPNL = useMemo(() => {
        return <LiveTraderwiseCompanyPNL socket={socket} batchName={batchName} />
      }, [socket, batchName]);
  

  return (

    <MDBox py={3}>
        <MDBox mt={2}>
            <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
                {/* <MockOverallCompanyPNL  /> */}
                {mockOverallCompanyPNL}
                {/* <MockOverallCompanyPNL batchName={batchName} socket={socket} /> */}
            </Grid>
            </Grid>
        </MDBox>
        <MDBox mt={2}>
            <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
                {mockTraderwiseCompanyPNL}
                {/* <MockTraderwiseCompanyPNL batchName={batchName} socket={socket} /> */}
            </Grid>
            </Grid>
        </MDBox>
        <MDBox mt={2}>
            <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
                {/* <MockTraderwiseCompanyPNL /> */}
                {liveOverallCompanyPNL}
                {/* <LiveOverallCompanyPNL batchName={batchName} socket={socket} /> */}
            </Grid>
            </Grid>
        </MDBox>
        <MDBox mt={2}>
            <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
                {liveTraderwiseCompanyPNL}
                {/* <LiveTraderwiseCompanyPNL batchName={batchName} socket={socket} /> */}
            </Grid>
            </Grid>
        </MDBox>
    </MDBox>

  );
}

export default AlgoBoxMain;
