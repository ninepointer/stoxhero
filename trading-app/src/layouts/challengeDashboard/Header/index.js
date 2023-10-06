import React, {useState, useEffect} from 'react';
import axios from "axios"
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Grid, CircularProgress, Divider} from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import { Link } from "react-router-dom";

//data

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
        // console.log("Completed Contest Res:",res.data.data)
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
            <MDTypography ml={1} mb={1} color='light' fontSize={18} fontWeight='bold'>Challenge Dashboard</MDTypography>
        </MDBox>
        

        <Grid container spacing={1} xs={12} md={12} lg={12} mt={0.5} mb={0.5} display='flex' justifyContent='center' alignItems='center'>

            <Grid item xs={12} md={6} lg={3}>

            <MDButton
                variant="contained"
                color={"primary"}
                size="small"
                component={Link}
                to={{
                    pathname: `/challengedashboard/challengetemplate`,
                }}
            >
                <Grid container xs={12} md={12} lg={12}>

                    <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                        <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Challenge Template</MDTypography>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                        <MDBox display="flex" flexDirection="column">
                            <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Create Challenge Template here!</MDTypography>
                        </MDBox>
                    </Grid>

                    <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                        <MDTypography fontSize={9} style={{ color: "white" }}>Active Challenge Templates: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                    </Grid>

                    <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                        <MDTypography fontSize={9} style={{ color: "white" }}>Inactive Challenge Templates: <span style={{ fontSize: 11, fontWeight: 700 }}>5</span></MDTypography>
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
                        pathname: `/challengedashboard/challenge`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Challenges</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Check Challenges here!</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Upcoming Challenges: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Completed Challenges: <span style={{ fontSize: 11, fontWeight: 700 }}>5</span></MDTypography>
                        </Grid>

                    </Grid>
                </MDButton>

            </Grid>

            <Grid item xs={12} md={6} lg={3}>

                <MDButton
                    variant="contained"
                    color={"error"}
                    size="small"
                    component={Link}
                    to={{
                        pathname: `/challengedashboard/challengereport`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Challenge Report</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Check all challenge reports here!</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Challenges: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Challenge Templates: <span style={{ fontSize: 11, fontWeight: 700 }}>5</span></MDTypography>
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
                        pathname: `/challengedashboard/challengeleaderboard`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Challenge Leaderboard</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Check challenge leaderboard here!</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Free Challenges: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Paid Challenges: <span style={{ fontSize: 11, fontWeight: 700 }}>5</span></MDTypography>
                        </Grid>

                    </Grid>
                </MDButton>

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