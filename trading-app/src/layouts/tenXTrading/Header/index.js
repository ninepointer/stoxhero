import { React, useEffect } from "react";
// import axios from "axios";
// import { userContext } from '../../../AuthContext';
import ReactGA from "react-ga"

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

import TenXHeader from './TenXHeader'
import TenX from './TenX'
import { TbCapture } from "react-icons/tb";


function Header() {
  
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  
  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
    capturePageView()
  }, []);
  let page = 'TenXTrading'
  let pageLink = 'tenxtrading'
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
            <TenXHeader/>
          </Grid>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' minWidth='100%'>
            <TenX/>
          </Grid>
          
        </Grid>

    </MDBox>
  );
}

export default Header;
