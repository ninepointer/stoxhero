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
import ContestCup from '../../../assets/images/indeximage.png'
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
            <MDBox bgColor='black' minHeight='auto' borderRadius={3} display='flex' justifyContent='center'>
            <Grid container spacing={1} p={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' width='100%'>
                <Grid item xs={12} md={12} lg={4} textAlign='center' display='flex' justifyContent='center' alignContent='center'>
                <MDBox bgColor='light' style={{border:'2px solid lightgrey'}} elevation={3} p={1} borderRadius={8}>
                        <Grid container p={.5}>

                            <Grid item xs={12} md={12} lg={6} mb={1} display="flex" justifyContent="flex-start">
                                <MDTypography fontSize={15} color='info' fontWeight='bold'>Predit & Win</MDTypography>
                            </Grid>

                            <Grid item xs={12} md={12} lg={6} mb={1} display="flex" justifyContent="flex-end">
                                <MDTypography style={{border:'1px solid lightgrey', borderRadius:8}} pl={1} pr={1} fontSize={15} color='warning' fontWeight='bold'>NIFTY - LTP</MDTypography>
                            </Grid>
            
                            <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="center">
                                <Grid container xs={12} md={12} lg={12} mr={1} ml={1} display="flex" justifyContent="center">
                                    <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center'>
                                        <img width='75px' src={ContestCup} />
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center'>
                                        <MDBox display='flex' flexDirection='column'>
                                        <MDBox><MDTypography fontSize={15} color='success' fontWeight='bold'>Reward</MDTypography></MDBox>
                                        <MDBox><MDTypography fontSize={15} color='success' fontWeight='bold'>1.5X</MDTypography></MDBox>
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center'>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="flex-end">
                                                <MDTypography style={{border:'1px solid #1A73E8', color:'black', width:'60%', display:'flex', justifyContent:'center',  alignItems:'center'}} p={0.5} fontSize={10} borderRadius={2} fontWeight='bold'>Entry: ₹10</MDTypography>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="flex-end">
                                                <MDTypography style={{border:'1px solid #1A73E8', color:'black', width:'60%', display:'flex', justifyContent:'center',  alignItems:'center'}} p={0.5} fontSize={10} borderRadius={2} fontWeight='bold'>Entry: ₹10</MDTypography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} md={12} lg={12} mt={-2} display="flex" justifyContent="center" style={{width: '100%'}}>
                                <Divider style={{backgroundColor: 'grey', height: '2px', width: '95%'}} />
                            </Grid>

                            <MDBox display='flex' justifyContent='space-around' alignItems='center' width='100%' ml={1} mr={1}>
                            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='space-around' alignItems='center'>
                            <Grid item xs={3} md={3} lg={4} display="flex" justifyContent="center">
                                <MDTypography fontSize={12} borderRadius={2} fontWeight='bold'>Start : 9:45 AM</MDTypography>
                            </Grid>
                            <Grid item xs={3} md={3} lg={4} display="flex" justifyContent="center">
                                <MDTypography fontSize={12} borderRadius={2} fontWeight='bold'>Live</MDTypography>
                            </Grid>
                            <Grid item xs={3} md={3} lg={4} display="flex" justifyContent="center">
                                <MDTypography fontSize={12} borderRadius={2} fontWeight='bold'>Ends : 3:20 PM</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={5.5} mt={0.5} display="flex" justifyContent="center">
                                <MDButton 
                                    variant='contained' 
                                    color='success' 
                                    size='small'
                                    // component={Link}
                                    to='/TenX Subscription Details'
                                    // state= {{data:elem._id}}
                                    sx={{fontSize:10, fontWeignt:'bold', margin:0, minWidth:'100%'}}
                                >
                                    Bullish
                                </MDButton>
                            </Grid>
                            <Grid item xs={12} md={12} lg={5.5} mt={0.5} display="flex" justifyContent="center">
                                <MDButton 
                                    variant='contained' 
                                    color='error' 
                                    size='small'
                                    // component={Link}
                                    to='/TenX Subscription Details'
                                    // state= {{data:elem._id}}
                                    sx={{fontSize:10, fontWeignt:'bold', margin:0, minWidth:'100%'}}
                                >
                                    Bearish
                                </MDButton>
                            </Grid>
                            </Grid>
                            </MDBox>
                        </Grid>

                    </MDBox>
                </Grid>
                
            </Grid>
            </MDBox>
        </Grid>
    </Grid>

  );
}

export default Header;
