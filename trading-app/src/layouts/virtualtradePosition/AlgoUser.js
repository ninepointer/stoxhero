
import React from "react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
// @mui material components
import { Chart } from 'chart.js/auto';
// Chart.register(...registerables);
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";




// Data



// Dashboard components

// import OverallTraderPnl from "./AlgoUserComponents/overallTraderPnl";
import TraderwiseTraderPnl from "./AlgoUserComponents/TraderwiseTraderPNL";

function AlgoUser() {

  // let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  let socket;
  try{
      socket = io.connect(`${baseUrl1}`)
  } catch(err){
      throw new Error(err);
  }

   
    useEffect(()=>{

        //console.log(socket);
        socket.on("connect", ()=>{
            socket.emit("company-ticks", true)
        })

    }, []);


  return (

       <MDBox py={3}>

        {/* <MDBox mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <OverallTraderPnl socket={socket} batches={batches} setBatches={setBatches} selectedBatch={selectedBatch} setSelectedBatch={setSelectedBatch}/>
            </Grid>
          </Grid>
        </MDBox> */}


        <MDBox mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <TraderwiseTraderPnl socket={socket} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox> 

  );
}

export default AlgoUser;

// todo ---> mismatch