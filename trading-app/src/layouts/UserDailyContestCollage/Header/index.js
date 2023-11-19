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
import ContestHeader from './contestHeader'
import Contests from './contests'



function Header({ children }) {
  
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  
  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
    capturePageView()
  }, []);
  let page = 'CollegeTestZone'
  let pageLink = 'collegetestzone'
  async function capturePageView(){
        console.log("Page:",page)
        await fetch(`${baseUrl}api/v1/pageview/${page}/${pageLink}`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
    });
  }

  return (
    
    <MDBox bgColor="dark" color="dark" mt={2} mb={1} p={1} borderRadius={10} minHeight='auto'>
    
        <Grid container display='flex' justifyContent='center' alignContent='center' alignItems='center'>
          
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' minWidth='100%'>
            <ContestHeader/>
          </Grid>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' minWidth='100%'>
            <Contests/>
          </Grid>
          
        </Grid>

    

    </MDBox>
  );
}

export default Header;
