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



function Header({ children }) {


  return (
    
    <Grid container>
        <Grid item xs={12} md={12} lg={12}>
            <MDBox bgColor='light' minHeight='auto' borderRadius={3}>
            <Grid container p={2} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' width='100%'>
                <Grid item xs={12} md={12} lg={2} textAlign='center'>
                    <img src={ContestCup} width='110px' height='110px'/>
                </Grid>
                <Grid item xs={12} md={12} lg={10} display='flex' justifyContent='center' flexDirection='column' alignItems='center'>
                    <MDTypography color='dark' fontSize={20} fontWeight='bold' textAlign='center'>
                        Welcome StoxHeroes!
                    </MDTypography>
                    <MDTypography color='dark' fontSize={15} textAlign='center'>
                        Start your trading journey by participating in virtual Futures & Options contest
                        and win real cash rewards as per your portfolio value.
                    </MDTypography>
                    <MDTypography color='dark' fontSize={15} textAlign='center'>
                        अपनी ट्रेडिंग यात्रा शुरू करें वर्चुअल फ्यूचर्स और ऑप्शन कॉन्टेस्ट में हिस्सा लेकर और अपने पोर्टफोलियो की 
                        मान्यता के हिसाब से वास्तविक नकदी रिवार्ड्स जीतें।
                    </MDTypography>
                    
                </Grid>
            </Grid>
            </MDBox>
        </Grid>
    </Grid>

  );
}

export default Header;
