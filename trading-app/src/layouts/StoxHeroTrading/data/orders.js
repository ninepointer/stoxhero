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
import { TableContainer } from "@mui/material";


function WatchList() {

  
  return (
    <MDBox bgColor="light" border='1px solid white' borderRadius={5} minHeight='40vh'>
        <Grid container>
            <Grid item xs={12} md={6} lg={12} m={1}>
                <MDTypography fontSize={15} fontWeight="bold">Orders</MDTypography>
            </Grid>
        </Grid>
    </MDBox>
)
}

export default WatchList;
