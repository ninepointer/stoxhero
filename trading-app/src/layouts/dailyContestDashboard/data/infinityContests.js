import React, {useState, useEffect} from 'react';
import axios from "axios"
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Grid, CircularProgress, Divider} from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import { Link } from "react-router-dom";
import CachedIcon from '@mui/icons-material/Cached';

//data
import CompanySideContestDailyChart from './companySideContestDailyChart'
import DailyContestUsers from './dailyContestUsers'
import DailyPaidContestUsers from './dailyPaidContestUsers'

export default function LabTabs() {
const [isLoading, setIsLoading] = useState(false)

  return (
        <MDBox minWidth='100%'>
            <Grid item xs={12} md={12} lg={12} p={1} boxShadow={2} minHeight='auto' minWidth='100%' style={{backgroundColor:'lightgrey'}} borderRadius={1} display='flex' justifyContent='center'>
                {isLoading ? 
                    <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
                        <CircularProgress color='info'/>
                    </MDBox>
                :
                <>
                <MDBox display='flex' justifyContent='center' flexDirection='column'>
                    <MDBox bgColor='light' borderRadius={5} display='flex' justifyContent='center' mb={1}>
                        <MDTypography color='dark' fontSize={15} fontWeight='bold'>Infinity Contests - Company Side Details</MDTypography>
                    </MDBox>
                    <MDBox display='flex' justifyContent='center'>
                        <Grid container spacing={1} xs={6} md={6} lg={12} display='flex' justifyContent='center'>
                            <Grid item xs={12} md={6} lg={12}>

                                <MDButton
                                    variant="contained"
                                    color={"success"}
                                    size="small"
                                    component={Link}
                                    to={{
                                        pathname: `/contestdashboard/infinitycontest`,
                                    }}
                                >
                                    <Grid container xs={12} md={12} lg={12}>

                                        <Grid item xs={6} md={6} lg={4} mt={1} display="flex" justifyContent="left">
                                            <MDTypography fontSize={12} style={{ color: "white", paddingLeft: 2, paddingRight: 2, fontWeight: 'bold', border:'1px solid white', borderRadius:5 }}>Thursday Options Champions</MDTypography>
                                        </Grid>

                                        <Grid item xs={6} md={6} lg={4} mt={1} display="flex" justifyContent="center">
                                            <MDTypography fontSize={12} style={{ color: "white", paddingLeft: 2, paddingRight: 2, fontWeight: 'bold', border:'1px solid white', borderRadius:5 }}>Current Status: Live</MDTypography>
                                        </Grid>

                                        <Grid item xs={6} md={6} lg={4} mt={1} display="flex" justifyContent="right">
                                            <MDTypography fontSize={12} style={{ color: "white", paddingLeft: 2, paddingRight: 2, fontWeight: 'bold', border:'1px solid white', borderRadius:5 }}>Type: StoxHero</MDTypography>
                                        </Grid>

                                        <Grid item xs={6} md={6} lg={12} display="flex" justifyContent="center">
                                            <Divider style={{backgroundColor: 'white', height: '2px', minWidth: '100%'}} />
                                        </Grid>

                                        <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="left">
                                            <MDTypography fontSize={12} style={{ color: "white" }}>Entry: <span style={{ fontSize: 12, fontWeight: 700 }}>₹149</span></MDTypography>
                                        </Grid>

                                        <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="center">
                                            <MDTypography fontSize={12} style={{ color: "white" }}>Portfolio: <span style={{ fontSize: 12, fontWeight: 700 }}>₹100,000</span></MDTypography>
                                        </Grid>

                                        <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="right">
                                            <MDTypography fontSize={12} style={{ color: "white" }}>% Payout: <span style={{ fontSize: 12, fontWeight: 700 }}>1 %</span></MDTypography>
                                        </Grid>

                                        <Grid item xs={6} md={6} lg={12} display="flex" justifyContent="center">
                                            <Divider style={{backgroundColor: 'white', height: '2px', minWidth: '100%'}} />
                                        </Grid>

                                        <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="left">
                                            <MDTypography fontSize={12} style={{ color: "white" }}>Gross: <span style={{ fontSize: 12, fontWeight: 700 }}>+₹10,00,000</span></MDTypography>
                                        </Grid>

                                        <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="center">
                                            <MDTypography fontSize={12} style={{ color: "white" }}>Net: <span style={{ fontSize: 12, fontWeight: 700 }}>+₹9,00,000</span></MDTypography>
                                        </Grid>

                                        <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="right">
                                            <MDTypography fontSize={12} style={{ color: "white" }}>Brokerage: <span style={{ fontSize: 12, fontWeight: 700 }}>₹10,000</span></MDTypography>
                                        </Grid>

                                        <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="left">
                                            <MDTypography fontSize={12} style={{ color: "white" }}>(+) Traders: <span style={{ fontSize: 12, fontWeight: 700 }}>5</span></MDTypography>
                                        </Grid>

                                        <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="center">
                                            <MDTypography fontSize={12} style={{ color: "white" }}>(-) Traders: <span style={{ fontSize: 12, fontWeight: 700 }}>10</span></MDTypography>
                                        </Grid>

                                        <Grid item xs={6} md={6} lg={4} mb={1} display="flex" justifyContent="right">
                                            <MDTypography fontSize={12} style={{ color: "white" }}>Total Traders: <span style={{ fontSize: 12, fontWeight: 700 }}>15</span></MDTypography>
                                        </Grid>

                                        <Grid item xs={6} md={6} lg={6} mt={0.5} mb={1} display="flex" justifyContent="left">
                                            <Grid container spacing={.5} xs={6} md={6} lg={12}>
                                                <Grid item xs={6} md={6} lg={4}>
                                                    <MDBox style={{backgroundColor:'white',border:'1px solid white', borderRadius:3, padding:'2px'}}><MDTypography fontSize={10} fontWeight='bold' color='dark'>NIFTY</MDTypography></MDBox>
                                                </Grid>
                                                <Grid item xs={6} md={6} lg={4}>
                                                    <MDBox style={{backgroundColor:'white',border:'1px solid white', borderRadius:3, padding:'2px'}}><MDTypography fontSize={10} fontWeight='bold' color='dark'>BANKNIFTY</MDTypography></MDBox>
                                                </Grid>
                                                <Grid item xs={6} md={6} lg={4}>
                                                    <MDBox style={{backgroundColor:'white',border:'1px solid white', borderRadius:3, padding:'2px'}}><MDTypography fontSize={10} fontWeight='bold' color='dark'>FINNIFTY</MDTypography></MDBox>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={6} md={6} lg={6} mt={0.5} mb={1} display="flex" justifyContent="flex-end">
                                            <Grid container spacing={.5} xs={6} md={6} lg={12} display="flex" justifyContent="flex-end">
                                                <Grid item xs={6} md={6} lg={4}>
                                                    <MDBox style={{backgroundColor:'white',border:'1px solid white', borderRadius:3, padding:'2px'}}><MDTypography fontSize={10} fontWeight='bold' color='dark'>Abs. Running Lots:1,000</MDTypography></MDBox>
                                                </Grid>
                                                <Grid item xs={6} md={6} lg={4}>
                                                    <MDBox style={{backgroundColor:'white',border:'1px solid white', borderRadius:3, padding:'2px'}}><MDTypography fontSize={10} fontWeight='bold' color='dark'>Running Lots:2,030</MDTypography></MDBox>
                                                </Grid>
                                                <Grid item xs={6} md={6} lg={4}>
                                                    <MDBox style={{backgroundColor:'white',border:'1px solid white', borderRadius:3, padding:'2px'}}><MDTypography fontSize={10} fontWeight='bold' color='dark'>Margin:10,000,000</MDTypography></MDBox>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                </MDButton>

                            </Grid>

                            {/* <Grid item xs={12} md={6} lg={6}>

                                    <MDButton
                                        variant="contained"
                                        color={"error"}
                                        size="small"
                                        component={Link}
                                        to={{
                                            pathname: `/contestdashboard/dailycontestposition`,
                                        }}
                                    >
                                <Grid container xs={12} md={12} lg={12}>

                                    <Grid item xs={6} md={6} lg={4} mt={1} display="flex" justifyContent="left">
                                        <MDTypography fontSize={12} style={{ color: "white", paddingLeft: 2, paddingRight: 2, fontWeight: 'bold', border:'1px solid white', borderRadius:5 }}>Thursday Options Heroes</MDTypography>
                                    </Grid>

                                    <Grid item xs={6} md={6} lg={4} mt={1} display="flex" justifyContent="center">
                                        <MDTypography fontSize={12} style={{ color: "white", paddingLeft: 2, paddingRight: 2, fontWeight: 'bold', border:'1px solid white', borderRadius:5 }}>Current Status: Live</MDTypography>
                                    </Grid>

                                    <Grid item xs={6} md={6} lg={4} mt={1} display="flex" justifyContent="right">
                                        <MDTypography fontSize={12} style={{ color: "white", paddingLeft: 2, paddingRight: 2, fontWeight: 'bold', border:'1px solid white', borderRadius:5 }}>Type: StoxHero</MDTypography>
                                    </Grid>

                                    <Grid item xs={6} md={6} lg={12} display="flex" justifyContent="center">
                                        <Divider style={{backgroundColor: 'white', height: '2px', minWidth: '100%'}} />
                                    </Grid>

                                    <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="left">
                                        <MDTypography fontSize={12} style={{ color: "white" }}>Entry: <span style={{ fontSize: 12, fontWeight: 700 }}>₹149</span></MDTypography>
                                    </Grid>

                                    <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="center">
                                        <MDTypography fontSize={12} style={{ color: "white" }}>Portfolio: <span style={{ fontSize: 12, fontWeight: 700 }}>₹100,000</span></MDTypography>
                                    </Grid>

                                    <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="right">
                                        <MDTypography fontSize={12} style={{ color: "white" }}>% Payout: <span style={{ fontSize: 12, fontWeight: 700 }}>1 %</span></MDTypography>
                                    </Grid>

                                    <Grid item xs={6} md={6} lg={12} display="flex" justifyContent="center">
                                        <Divider style={{backgroundColor: 'white', height: '2px', minWidth: '100%'}} />
                                    </Grid>

                                    <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="left">
                                        <MDTypography fontSize={12} style={{ color: "white" }}>Gross: <span style={{ fontSize: 12, fontWeight: 700 }}>-₹10,00,000</span></MDTypography>
                                    </Grid>

                                    <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="center">
                                        <MDTypography fontSize={12} style={{ color: "white" }}>Net: <span style={{ fontSize: 12, fontWeight: 700 }}>-₹9,00,000</span></MDTypography>
                                    </Grid>

                                    <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="right">
                                        <MDTypography fontSize={12} style={{ color: "white" }}>Margin: <span style={{ fontSize: 12, fontWeight: 700 }}>₹10,590,000</span></MDTypography>
                                    </Grid>

                                    <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="left">
                                        <MDTypography fontSize={12} style={{ color: "white" }}>(+) Traders: <span style={{ fontSize: 12, fontWeight: 700 }}>5</span></MDTypography>
                                    </Grid>

                                    <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="center">
                                        <MDTypography fontSize={12} style={{ color: "white" }}>(-) Traders: <span style={{ fontSize: 12, fontWeight: 700 }}>10</span></MDTypography>
                                    </Grid>

                                    <Grid item xs={6} md={6} lg={4} mb={1} display="flex" justifyContent="right">
                                        <MDTypography fontSize={12} style={{ color: "white" }}>Total Traders: <span style={{ fontSize: 12, fontWeight: 700 }}>15</span></MDTypography>
                                    </Grid>

                                </Grid>
                            </MDButton>

                            </Grid> */}
                        </Grid>
                    </MDBox>
                </MDBox>
                
                </>
                }
            </Grid>
        </MDBox>

  );
}