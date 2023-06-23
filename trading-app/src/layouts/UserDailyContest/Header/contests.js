import { React, useState, useEffect, useContext } from "react";
import axios from "axios";
import { userContext } from '../../../AuthContext';
import moment from 'moment'

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";
import tradesicon from '../../../assets/images/tradesicon.png'

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
import Contest from './contest'



function Header({ children }) {


  return (
    
    <Grid container mt={1}>
        <Grid item xs={12} md={12} lg={12}>
            <Grid ml={0.75} item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' minWidth='100%'>
              <Contest/>
            </Grid> 
        </Grid>
    </Grid>

  );
}

export default Header;
