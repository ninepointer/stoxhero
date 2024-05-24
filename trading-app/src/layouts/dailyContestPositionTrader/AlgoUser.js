
import React from "react";
import { useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { Chart } from 'chart.js/auto';
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import TraderwiseTraderPnl from "./AlgoUserComponents/TraderwiseTraderPNL";
import { socketContext } from "../../socketContext";

function AlgoUser() {
  const socket = useContext(socketContext);

  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  
  // let socket;
  // try{
  //     socket = io.connect(`${baseUrl1}`)
  // } catch(err){
  //     throw new Error(err);
  // }

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
              <TraderwiseTraderPnl socket={socket} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox> 

  );
}

export default AlgoUser;