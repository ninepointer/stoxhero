import React, {useState, useEffect} from 'react';
import axios from "axios"
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Grid, CircularProgress, Divider} from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import { Link } from "react-router-dom";
// import CachedIcon from '@mui/icons-material/Cached';
// import LiveContest from '../data/infinityContests'

//data
import CompanySideContestDailyChart from '../data/companySideContestDailyChart'
// import DailyContestUsers from '../data/dailyContestUsers'
import DailyPaidContestUsers from '../data/dailyPaidContestUsers'
import PnlOverviewMock from '../infinityContestComponent/pnlOverviewMock';
// import PnlOverviewLive from '../infinityContestComponent/pnlOverviewLive';
// import XTSOverview from '../infinityContestComponent/xtsOverview';

export default function LabTabs({socket}) {
  const [isLoading,setIsLoading] = useState(false);
  const [allMarginXUsers, setAllMarginXUsers] = useState();
  const [completedMarginX,setCompletedMarginX] = useState();
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"


  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/marginxtrade/payoutchart`, {withCredentials: true})
    .then((res) => {
        console.log("Inside Payout chart data");
        setCompletedMarginX(res.data.data);
        console.log("Completed MarginX Res:",res.data.data)
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })
  }, [])

  useEffect(()=>{
    let call1 = axios.get((`${baseUrl}api/v1/marginx/allmarginxusers`),{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
            },
        })
    Promise.all([call1])
    .then(([api1Response]) => {
    //   setDailyContestUsers(api1Response.data.data)
      setAllMarginXUsers(api1Response.data.data)
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
    
  },[])

  return (
    <MDBox bgColor="dark" mt={2} mb={1} p={2} borderRadius={10} display='flex' flexDirection='column' justifyContent='center' alignItems='center' minHeight='auto' maxWidth='100%'>
        <MDBox display='flex' justifyContent='left'>
            <MDTypography ml={1} mb={1} color='light' fontSize={18} fontWeight='bold'>MarginX Dashboard</MDTypography>
        </MDBox>
        <PnlOverviewMock socket={socket} />
        

        <Grid container spacing={1} xs={12} md={12} lg={12} mt={0.5} mb={0.5} display='flex' justifyContent='center' alignItems='center'>

            <Grid item xs={12} md={6} lg={3}>

                <MDButton
                    variant="contained"
                    color={"success"}
                    size="small"
                    component={Link}
                    to={{
                        pathname: `/marginxdashboard/marginxposition`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>MarginX Position(Company)</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Check all trader's marginx position here!</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Active TestZones: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Completed TestZones: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                    </Grid>
                </MDButton>

            </Grid>

            <Grid item xs={12} md={6} lg={3}>

                <MDButton
                    variant="contained"
                    color={"warning"}
                    size="small"
                    component={Link}
                    to={{
                        pathname: `/marginxdashboard/marginxtraderposition`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>MarginX Position(Trader)</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Check all trader's marginx position here!</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Active TestZones: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Completed TestZones: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                    </Grid>
                </MDButton>

            </Grid>

            <Grid item xs={12} md={6} lg={3}>

                <MDButton
                    variant="contained"
                    color={"secondary"}
                    size="small"
                    component={Link}
                    to={{
                        pathname: `/marginxdashboard/marginxreport`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>MarginX Report</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Check all daily marginx reports here!</MDTypography>
                            </MDBox>
                        </Grid>

                        {/* <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Free Contests: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid> */}

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Paid MarginX: <span style={{ fontSize: 11, fontWeight: 700 }}>5</span></MDTypography>
                        </Grid>

                    </Grid>
                </MDButton>

            </Grid>

            <Grid item xs={12} md={6} lg={3}>

                <MDButton
                    variant="contained"
                    color={"primary"}
                    size="small"
                    component={Link}
                    to={{
                        pathname: `/marginxdashboard/marginxtemplate`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>MarginX Template</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Create MarginX Template here!</MDTypography>
                            </MDBox>
                        </Grid>

                        {/* <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Free Contests: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid> */}

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Paid MarginX: <span style={{ fontSize: 11, fontWeight: 700 }}>5</span></MDTypography>
                        </Grid>

                    </Grid>
                </MDButton>

            </Grid>

            <Grid item xs={12} md={6} lg={3}>

                <MDButton
                    variant="contained"
                    color={"info"}
                    size="small"
                    component={Link}
                    to={{
                        pathname: `/marginxdashboard/marginx`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>MarginX</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Create MarginX here!</MDTypography>
                            </MDBox>
                        </Grid>

                        {/* <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Free Contests: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid> */}

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Paid MarginX: <span style={{ fontSize: 11, fontWeight: 700 }}>5</span></MDTypography>
                        </Grid>

                    </Grid>
                </MDButton>

            </Grid>


           
        </Grid>

        <Grid style={{backgroundColor:'white',borderRadius:5}} container xs={12} md={12} lg={12} mt={1}>
            <Grid item xs={12} md={12} lg={12}>
                <MDBox p={1}>
                    { completedMarginX && <CompanySideContestDailyChart completedMarginX={completedMarginX}/>}
                </MDBox>
            </Grid>
        </Grid>

        <Grid style={{backgroundColor:'white',borderRadius:5}} container xs={12} md={12} lg={12} mt={1}>
            <Grid item xs={12} md={12} lg={12}>
                <MDBox p={0.5}>
                    { allMarginXUsers && <DailyPaidContestUsers allMarginXUsers={allMarginXUsers}/>}
                </MDBox>
            </Grid>
        </Grid>

        <Grid container spacing={2} xs={12} md={12} lg={12} mt={1}>
            <Grid item lg={3}>
                <MDBox p={2} bgColor='text' borderRadius={5}>
                    <MDTypography color='light' fontSize={15} fontWeight='bold'>Quick Links</MDTypography>
                    <Grid container spacing={1}>
                        <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"success"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/internshiporders`,
                                  }}
                            >
                                Virtual Trade Orders
                            </MDButton>
                        </Grid>
                        <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"dark"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/userorders`,
                                  }}
                            >
                                My Orders
                            </MDButton>
                        </Grid>
                        <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"warning"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/portfolio`,
                                  }}
                            >
                                Portfolio
                            </MDButton>
                        </Grid>
                        <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"error"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/referralprogram`,
                                  }}
                            >
                                Referral Program
                            </MDButton>
                        </Grid>
                        <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"dark"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/tutorialvideos`,
                                  }}
                            >
                                Tutorial Videos
                            </MDButton>
                        </Grid>
                    </Grid>
                </MDBox>
                
            </Grid>
        </Grid>

    </MDBox>
  );
}