import { React, useState, useEffect, useContext } from "react";
import ReactGA from "react-ga"
// @mui material components
import Grid from "@mui/material/Grid";
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
    ReactGA.pageview(window.location.pathname)
  }, []);

  // useEffect(() => {
  //   ReactGA.pageview(window.location.pathname)
  // }, []);

  return (
    
    <Grid container mt={1}>
        <Grid item xs={12} md={12} lg={12}>
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' minWidth='100%'>
              <Contest socket={socket}/>
            </Grid> 
        </Grid>
    </Grid>

  );
}

export default Header;
