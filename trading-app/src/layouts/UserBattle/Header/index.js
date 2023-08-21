import { React, useState, useEffect, useContext } from "react";
import axios from "axios";
import { userContext } from '../../../AuthContext';
import ReactGA from "react-ga"

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

// Images
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import {InfinityTraderRole, tenxTrader} from "../../../variables";
import ContestCup from '../../../assets/images/candlestick-chart.png'
import { Divider } from "@mui/material";
import Background from "../../../assets/images/backgroundmatt.jpg"
import BattleIcon from "../../../assets/images/battleicon.png"
import BattleHeader from "../Header/battleHeader"
import Battles from "../Header/battles"




function Header({ children }) {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
  }, []);

  return (
    
    <MDBox bgColor='dark' color="dark" mt={2} mb={1} p={1} borderRadius={10} display='flex' justifyContent='center' minHeight='auto'
    // sx={{
    //     backgroundImage: `url(${Background})`,
    //   }}
    >
    <MDBox>
        <Grid container display='flex' justifyContent='center' alignContent='center' alignItems='center'>
          
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' minWidth='100%'>
            <BattleHeader/>
          </Grid>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' minWidth='100%'>
            <Battles/>
          </Grid> 
        </Grid>
    </MDBox>
    </MDBox>
  );
}

export default Header;
