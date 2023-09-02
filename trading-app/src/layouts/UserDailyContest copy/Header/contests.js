import { React, useState, useEffect, useContext } from "react";
import ReactGA from "react-ga"
// @mui material components
import Grid from "@mui/material/Grid";
import Contest from './contest'



function Header() {

  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
  }, []);

  return (
    
    <Grid container mt={1}>
        <Grid item xs={12} md={12} lg={12}>
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' minWidth='100%'>
              <Contest />
            </Grid> 
        </Grid>
    </Grid>

  );
}

export default Header;
