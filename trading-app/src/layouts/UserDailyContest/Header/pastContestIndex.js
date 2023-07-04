import { React, useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { userContext } from '../../../AuthContext';
// import moment from 'moment'

// // prop-types is a library for typechecking of props.
// import PropTypes from "prop-types";
// import tradesicon from '../../../assets/images/tradesicon.png'

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

// Images
// import MDButton from "../../../components/MDButton";
// import MDTypography from "../../../components/MDTypography";
// import {InfinityTraderRole, tenxTrader} from "../../../variables";
// import ContestCup from '../../../assets/images/candlestick-chart.png'
// import { Divider } from "@mui/material";
import ContestHeader from './contestHeader'
import Contests from './pastContest'



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
