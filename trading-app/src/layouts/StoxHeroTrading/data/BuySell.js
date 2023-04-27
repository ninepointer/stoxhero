import React from "react";
import axios from "axios";
import { useEffect, useState, useContext, useRef, useReducer } from "react";
// @mui material components
import { Chart } from 'chart.js/auto';
// Chart.register(...registerables);
import Grid from "@mui/material/Grid";
// import Input from "@mui/material/Input";

// Material Dashboard 2 React components

// import MDButton from "../";
import MDButton from "../../../components/MDButton";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import TextField from '@mui/material/TextField';
import { RxCross2 } from 'react-icons/rx';
import { AiOutlineSearch } from 'react-icons/ai';

import uniqid from "uniqid"
import MDTypography from "../../../components/MDTypography";


function WatchList() {

  
  return (
    <MDBox bgColor="light" border='1px solid white' borderRadius={5} minHeight='40vh'>
        <Grid container p={2}>
            <Grid item xs={12} md={6} lg={12} mb={1} display='flex' justifyContent="flex-start" flexDirection='column'>
                <MDTypography fontSize={13} fontWeight="bold">NIFTY23APR17800</MDTypography>
                <MDTypography fontSize={10} fontWeight="bold">₹206.00 (+10.08%)</MDTypography>
            </Grid>
            <Grid item xs={12} md={6} lg={12} display="flex" justifyContent="left">
                <MDTypography color='info' fontSize={10} fontWeight="bold" mr={2} p={0.25} border='1px solid black' borderRadius={1}>Intraday</MDTypography>
                <MDTypography color='warning' fontSize={10} fontWeight="bold" mr={2} p={0.25} border='1px solid black' borderRadius={1}>Market</MDTypography>
            </Grid>
            
        </Grid>
    </MDBox>
)
}

export default WatchList;
