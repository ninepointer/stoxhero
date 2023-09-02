import { React, useState, useEffect, useContext } from "react";
import axios from "axios";
import { userContext } from '../../../AuthContext';
import moment from 'moment'

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";
import realtrading from '../../../assets/images/realtrading.png'
import WinnerImage from '../../../assets/images/cup-image.png'

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
    <Grid xs={12} md={12} lg={12} mt={2} container spacing={1} display='flex' flexDirection='row' alignItems='start'>
    
    <Grid xs={12} md={12} lg={8} item>

        <Grid item xs={12} md={12} lg={12} borderRadius={3}>
            <MDBox p={1} style={{ backgroundColor: "white", minWidth:'100%', borderRadius:'5px 5px 0px 0px' }} color={"#252525"} size="small">
                <Grid container display='flex' justifyContent='space-between' alignItems='center' minWidth='100%'>
                    <MDBox bgColor='white' minWidth='100%'>
                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                <MDBox p={1} display='flex' justifyContent='flex-start' alignItems='center'>
                                    <img src={realtrading} width='100px' height='100px'/>
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                <MDBox p={1} display='flex' justifyContent='flex-start' alignItems='center'>
                                    <MDTypography color='white' fontSize={15} fontWeight='bold' style={{padding:4,backgroundColor:'#1A73E8', borderRadius:3, textAlign: 'center'}}>
                                        Introducing MarginX: Your Gateway to Realistic Trading
                                    </MDTypography>
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{ textAlign: 'center' }}>
                                        We've designed this innovative trading experience to bridge the gap between learning and real-world trading, allowing you to get as close to the market as possible.
                                    </MDTypography>
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{padding:4,backgroundColor:'lightgrey', borderRadius:3}}>
                                        What is MarginX?
                                    </MDTypography>
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{ textAlign: 'center' }}>
                                        In MarginX, you won't just learn about trading; you'll experience it. MarginX is designed to bridge the gap between learning and real-world trading, allowing you to get as close to the market as possible & also continue to make real profit using virtual currency. Your success in MarginX depends on your ability to make informed decisions, manage risk, and seize opportunities – just like in the real trading world. 
                                    </MDTypography>
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{padding:4,backgroundColor:'lightgrey', borderRadius:3}}>
                                        Here's how it works:
                                    </MDTypography>
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{ textAlign: 'center' }}>
                                        Profit on Your Investment: Just like real options trading, you'll make a profit on the amount you've invested. Let's say you've invested Rs. 100. If you grow your trading capital by 10%, your real profit will also be 10% of your invested amount, which is Rs. 10. So your final amount will be Rs. 100 (your invested amount) + Rs. 10 (profit earned), making the total Rs. 110.
                                    </MDTypography>
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{padding:4,backgroundColor:'lightgrey', borderRadius:3, textAlign: 'center'}}>
                                        Safety Net: If you end up with the same capital, your entire invested amount is safe.
                                    </MDTypography>
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{ textAlign: 'center' }}>
                                        Proportional Loss: If your capital reduces by 10%, your real loss will also be in the same proportion, i.e., Rs. 10. So your final amount will be Rs. 100 (your invested amount) - Rs. 10 (loss made), making the total Rs. 90.
                                    </MDTypography>
                                </MDBox>
                            </Grid>

                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{padding:4,backgroundColor:'lightgrey', borderRadius:3}}>
                                        When will I receive my profit in my wallet?
                                    </MDTypography>
                                </MDBox>
                            </Grid>

                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{ textAlign: 'center' }}>
                                        You recieve the payout in your wallet as soon as the market closes for that day i.e after 3:30 PM
                                    </MDTypography>
                                </MDBox>
                            </Grid>
                        </Grid>
                    </MDBox>
                    
                </Grid>
            </MDBox>
        </Grid>

    </Grid>

    <Grid xs={12} md={12} lg={4} item>

         <Grid item xs={12} md={12} lg={12} borderRadius={3}>
            <MDBox p={1} style={{ backgroundColor: "white", minWidth:'100%', borderRadius:'5px 5px 0px 0px' }} color={"#252525"} size="small">
                <Grid container display='flex' justifyContent='space-between' alignItems='center' minWidth='100%'>
                    <MDBox bgColor='white' minWidth='100%'>
                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' border='2px solid grey'>
                                <MDBox bgColor='orange' p={0.5} display='flex' justifyContent='center' alignItems='center' minWidth='100%'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold'>MarginX Details</MDTypography>
                                </MDBox>
                            </Grid>
                        </Grid>
                    </MDBox>
                    <MDBox bgColor='white' minWidth='100%'>
                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold'>MarginX Name</MDTypography>
                                </MDBox>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold'>MarginX - Beginner</MDTypography>
                                </MDBox>
                            </Grid>
                        </Grid>
                    </MDBox>
                    <MDBox bgColor='white' minWidth='100%'>
                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold'>Start Time</MDTypography>
                                </MDBox>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold'>-</MDTypography>
                                </MDBox>
                            </Grid>
                        </Grid>
                    </MDBox>
                    <MDBox bgColor='white' minWidth='100%'>
                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold'>End Time</MDTypography>
                                </MDBox>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold'>-</MDTypography>
                                </MDBox>
                            </Grid>
                        </Grid>
                    </MDBox>
                    <MDBox bgColor='white' minWidth='100%'>
                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold'>Total Seats</MDTypography>
                                </MDBox>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold'>100</MDTypography>
                                </MDBox>
                            </Grid>
                        </Grid>
                    </MDBox>
                    <MDBox bgColor='white' minWidth='100%'>
                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold'>Available Seats</MDTypography>
                                </MDBox>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold'>10</MDTypography>
                                </MDBox>
                            </Grid>
                        </Grid>
                    </MDBox>
                    <MDBox bgColor='white' minWidth='100%'>
                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold'>Portfolio Value</MDTypography>
                                </MDBox>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold'>100,000</MDTypography>
                                </MDBox>
                            </Grid>
                        </Grid>
                    </MDBox>
                    <MDBox bgColor='white' minWidth='100%'>
                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold'>Investment</MDTypography>
                                </MDBox>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                    <MDTypography color='black' fontSize={15} fontWeight='bold'>10</MDTypography>
                                </MDBox>
                            </Grid>
                        </Grid>
                    </MDBox>
                    <MDBox bgColor='white' minWidth='100%'>
                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                            <Grid item xs={6} md={6} lg={12} display='flex' justifyContent='center' minWidth='100%'>
                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center' minWidth='100%'>
                                    <MDButton size='small' variant='contained' color='warning' style={{minWidth:'100%'}}>Share with friends!</MDButton>
                                </MDBox>
                            </Grid>
                            <Grid item xs={6} md={6} lg={12} display='flex' justifyContent='center' minWidth='100%'>
                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center' minWidth='100%'>
                                    <MDButton size='small' variant='contained' color='success' style={{minWidth:'100%'}}>Buy</MDButton>
                                </MDBox>
                            </Grid>
                        </Grid>
                    </MDBox>
                </Grid>
            </MDBox>
        </Grid>

    </Grid>

    </Grid>

  );
}

export default Header;
