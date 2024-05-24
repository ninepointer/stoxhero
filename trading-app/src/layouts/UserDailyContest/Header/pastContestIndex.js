import { React, useState, useEffect, useContext } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import ContestHeader from './contestHeader'
import Contests from './completedContest/completed'


function Header({ children }) {


  return (
    
    <MDBox bgColor="dark" color="dark" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto'>
    
        <Grid container spacing={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
          
          <Grid item display='flex' justifyContent='center' alignContent='center' alignItems='center' minWidth='100%'>
            <ContestHeader/>
          </Grid>
          <Grid item display='flex' justifyContent='center' alignContent='center' alignItems='center' minWidth='100%'>
            <Contests/>
          </Grid>
          
        </Grid>

    </MDBox>
  );
}

export default Header;
