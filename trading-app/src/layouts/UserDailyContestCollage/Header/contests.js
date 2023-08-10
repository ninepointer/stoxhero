import { React, useEffect } from "react";
// import axios from "axios";
// import { userContext } from '../../../AuthContext';
// import moment from 'moment'

// // prop-types is a library for typechecking of props.
// import PropTypes from "prop-types";
// import tradesicon from '../../../assets/images/tradesicon.png'

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
// import MDBox from "../../../components/MDBox";

// // Material Dashboard 2 React base styles

// // Images
// import MDButton from "../../../components/MDButton";
// import MDTypography from "../../../components/MDTypography";
// import {InfinityTraderRole, tenxTrader} from "../../../variables";
// import ContestCup from '../../../assets/images/candlestick-chart.png'
// import { Divider } from "@mui/material";
import Contest from './contest'
import { io } from 'socket.io-client';



function Header() {

  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
  let socket;
  try {
    socket = io.connect(`${baseUrl1}`)
  } catch (err) {
    throw new Error(err);
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected", socket.id)
    })
  }, []);

  return (
    
    <Grid container mt={1}>
        <Grid item xs={12} md={12} lg={12}>
            <Grid ml={0.75} item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' minWidth='100%'>
              <Contest socket={socket}/>
            </Grid> 
        </Grid>
    </Grid>

  );
}

export default Header;
