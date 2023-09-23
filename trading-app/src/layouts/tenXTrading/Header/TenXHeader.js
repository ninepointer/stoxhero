import { React, useState, useEffect, useContext } from "react";
import axios from "axios";
import { userContext } from '../../../AuthContext';
import moment from 'moment'

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";
import tradesicon from '../../../assets/images/tradesicon.png'
import WinnerImage from '../../../assets/images/TenXHeader.png'

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
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';



function Header({ children }) {


  return (
    
    <Grid container>
        <Grid item xs={12} md={12} lg={12}>
            <MDBox bgColor='light' minHeight='auto' borderRadius={3}>
            <Grid container p={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' width='100%'>
                <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' textAlign='center'>
                    <img src={WinnerImage} width='110px' height='110px'/>
                </Grid>

                <Grid item xs={12} md={12} lg={10} display='flex' justifyContent='center' flexDirection='column' alignItems='center'>
                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center'>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column'>
                    <MDTypography color='dark' fontSize={20} fontWeight='bold' textAlign='center'>
                        TenX Subscription Plans!
                    </MDTypography>
                    <MDTypography color='dark' fontSize={15} textAlign='center'>
                        Your Gateway to risk-free earning opportunity from Intraday Options Trading using virtual currency but real cash reward.
                    </MDTypography>
                    </Grid>
                </Grid>
                </Grid>
            </Grid>
            </MDBox>
        </Grid>
    </Grid>

  );
}

export default Header;
