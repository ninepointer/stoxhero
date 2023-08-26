import React, { useState, useEffect } from 'react';
import axios from "axios";
import ReactGA from "react-ga"
import {
  Paper,
  Avatar,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';

import {Grid} from '@mui/material'
import MDTypography from '../../../components/MDTypography';
import MDBox from '../../../components/MDBox';
import MDAvatar from '../../../components/MDAvatar';
import logo from '../../../assets/images/logo1.jpeg'

const Scoreboard = () => {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  const [sortedTraders, setSortedTraders] = useState([]);
  const [traders, setTraders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function convertName(name){
    // const name = 'SARTHAK SINGHAL';
  
    const cname = name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  
    return cname;
  };

  useEffect(()=>{
    setIsLoading(true)
    let call1 = axios.get(`${baseUrl}api/v1/contestscoreboard/scoreboard`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    Promise.all([call1])
    .then(([api1Response]) => {
      // Process the responses here
      console.log(api1Response.data.data);
      setTraders(api1Response.data.data);
      ReactGA.pageview(window.location.pathname)
      setTimeout(()=>{
        setIsLoading(false)
      },200)
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
      setIsLoading(true)
    });
  },[])

  return (
    <Box mt={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <MDBox p={1} bgColor='primary' width='100%' display='flex' justifyContent='center' alignItems='center'>
        <MDBox>
          <Avatar
            src={logo}
            alt="StoxHero"
          />
        </MDBox>
        <MDBox ml={1}>
          <MDTypography color='light' fontWeight='bold'>
              StoxHero Contest Scoreboard
          </MDTypography>
        </MDBox>
      </MDBox>
      {isLoading ? 
       <MDBox mt={10} minHeight='30vH'>
            <CircularProgress color='info'/>
       </MDBox>
       :
        <Box sx={{ maxWidth: '100%', width: '100%', margin: '0 auto' }} component={Paper}>   
        <Grid container mt={1} display='flex' justifyContent='center'>
            <Grid item xs={12} md={6} lg={1} mt={1} display='flex' justifyContent='center'>
                <MDTypography fontSize={15} fontWeight='bold' color='dark'>Rank</MDTypography>
            </Grid>
            <Grid item xs={12} md={6} lg={3} mt={1} display='flex' justifyContent='left'>
                <MDBox display='flex' justifyContent='center' alignItems='center' width='100%'>
                    <MDBox display='flex' justifyContent='center' alignItems='center' width='100%'>
                        <MDTypography fontSize={15} fontWeight='bold' color='dark'>Trader</MDTypography>
                    </MDBox>
                </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={2} mt={1} display='flex' justifyContent='center'>
                <MDTypography fontSize={15} fontWeight='bold' color='dark'>Cash Earned</MDTypography>
            </Grid>
            <Grid item xs={12} md={6} lg={2} mt={1} display='flex' justifyContent='center'>
                <MDTypography fontSize={15} fontWeight='bold' color='dark'>Contest Participated</MDTypography>
            </Grid>
            <Grid item xs={12} md={6} lg={2} mt={1} display='flex' justifyContent='center'>
                <MDTypography fontSize={15} fontWeight='bold' color='dark'>Contest Won</MDTypography>
            </Grid>
            <Grid item xs={12} md={6} lg={2} mt={1} display='flex' justifyContent='center'>
                <MDTypography fontSize={15} fontWeight='bold' color='dark'>Strike Rate</MDTypography>
            </Grid>
            
        </Grid>
        <Divider style={{ backgroundColor: 'grey' }} />

        {traders.map((trader, index) => (
        <>
        <Grid container mb={1} display='flex' justifyContent='center' alignItems='center' sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
            <Grid item xs={12} md={6} lg={1} display='flex' justifyContent='center'>
                <MDTypography fontSize={15} color='dark'>
                    {index+1}
                </MDTypography>
            </Grid>
            <Grid item xs={12} md={6} lg={3} display='flex' justifyContent='center' width='100%'>
                <MDBox display='flex' justifyContent='flex-start' alignItems='center' width='100%'>
                <MDBox display='flex' justifyContent='flex-start' alignItems='center' ml={9} mr={1}>
                  <Avatar
                      src={trader?.traderProfilePhoto ? trader?.traderProfilePhoto : ''}
                      alt={trader?.traderFirstName}
                    />
                </MDBox>
                <MDBox display='flex' justifyContent='flex-start' alignItems='center'>
                    <MDTypography fontSize={15} color='dark'>
                        {convertName(trader.traderFirstName)} {convertName(trader.traderLastName)}
                    </MDTypography></MDBox>
                </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={2} display='flex' justifyContent='center'>
                <MDTypography fontSize={15} color='dark'>
                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(trader?.totalPayout)}
                </MDTypography>
            </Grid>
            <Grid item xs={12} md={6} lg={2} display='flex' justifyContent='center'>
                <MDTypography fontSize={15} color='dark'>{trader?.contestParticipated}</MDTypography>
            </Grid>
            <Grid item xs={12} md={6} lg={2} display='flex' justifyContent='center'>
                <MDTypography fontSize={15} color='dark'>{trader?.contestWon}</MDTypography>
            </Grid>
            <Grid item xs={12} md={6} lg={2} display='flex' justifyContent='center'>
                <MDTypography fontSize={15} color='dark'>{(trader?.strikeRate).toFixed(2)}%</MDTypography>
            </Grid>
        </Grid>
        <Divider style={{ backgroundColor: 'grey' }} />
        </>
        ))}
      </Box>
      }
      
    </Box>
  );
};

export default Scoreboard;
