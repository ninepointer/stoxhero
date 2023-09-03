import { React, useEffect } from "react";
// import axios from "axios";
// import { userContext } from '../../../AuthContext';
import ReactGA from "react-ga"

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

import MarginXHeader from './marginXHeader'
import MarginXs from './marginXs'


function Header() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
  }, []);

  return (
    
    <MDBox bgColor="dark" color="dark" mt={2} mb={1} p={1} borderRadius={10} minHeight='auto'>
    
        <Grid container display='flex' justifyContent='center' alignContent='center' alignItems='center'>
          
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' minWidth='100%'>
            <MarginXHeader/>
          </Grid>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' minWidth='100%'>
            <MarginXs/>
          </Grid>
          
        </Grid>

    </MDBox>
  );
}

export default Header;