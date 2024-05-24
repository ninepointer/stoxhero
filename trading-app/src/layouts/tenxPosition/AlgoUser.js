
import React from "react";
import { useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { Chart } from 'chart.js/auto';
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";



// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import Header from "./Header";

// Data



// Dashboard components

// import OverallTraderPnl from "./AlgoUserComponents/overallTraderPnl";
import TraderwiseTraderPnl from "./AlgoUserComponents/TraderwiseTraderPNL";
import { socketContext } from "../../socketContext";

function AlgoUser() {

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
        // socket.on("connect", ()=>{
            socket.emit("company-ticks", true)
        // })

    }, []);


  return (

       <MDBox py={2}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <TraderwiseTraderPnl socket={socket} batches={batches} setBatches={setBatches} selectedBatch={selectedBatch} setSelectedBatch={setSelectedBatch}/>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox> 

  );
}

export default AlgoUser;