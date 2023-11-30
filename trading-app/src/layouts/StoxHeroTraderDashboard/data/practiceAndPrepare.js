import React from "react";
import axios from "axios";
import { useEffect, useState, useContext, useRef, useReducer } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import MDButton from "../../../components/MDButton";
import MDAvatar from "../../../components/MDAvatar";
import stock from "../../../assets/images/analyticspnl.png";
import logo from "../../../assets/images/logo1.jpeg";
import trading from "../../../assets/images/tradingjourney.png";
import testzone from "../../../assets/images/testzone.png";
import market from "../../../assets/images/market.png";
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      justifyContent: (props) =>
        props.lg ? 'flex-start' : props.md ? 'center' : 'center',
      // Add other styling properties as needed
    },
  }));

function Summary({lastPaidContests, lastContestDate}) {
    console.log(lastPaidContests)
    const navigate = useNavigate();
    function TruncatedName(name) {
        const originalName = name;
        const convertedName = originalName
          .toLowerCase() // Convert the entire name to lowercase
          .split(' ') // Split the name into words
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
          .join(' '); // Join the words back together with a space
      
        // Trim the name to a maximum of 30 characters
        const truncatedName = convertedName.length > 20 ? convertedName.substring(0, 20) + '...' : convertedName;
      
        return truncatedName;
      }

      function formattedDate(date) {

        const formattedDate = new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
          });
      
        return formattedDate;
      }

  return (
    <MDBox bgColor="light" minHeight='auto'>
        <Grid container mt={.5} mb={.5} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={12}>
                    <Grid container spacing={1} xs={12} md={12} lg={12} sx={{ minWidth: '100%' }} display='flex' justifyContent='center' alignItems='center'>
                            <Grid item xs={12} md={3} lg={3} sx={{ minWidth: '100%' }}>
                            <Card style={{backgroundColor:'rgb(49, 92, 69)'}} sx={{ minWidth: '100%' }}>
                            <CardContent>
                            <Grid container xs={12} md={12} lg={12} mt={2} sx={{ minWidth: '100%' }} display='flex' justifyContent='center' alignItems='center'>
                                <Grid item xs={12} md={4} lg={4} p={1} style={{backgroundColor:'rgb(49, 92, 69)'}} display='flex' justifyContent='flex-start' alignItems='center' alignContent='center'>
                                    <Grid container xs={12} md={12} lg={12}>
                                    <Grid item xs={12} md={12} lg={12}>
                                    <MDTypography color='light' fontSize={15} fontWeight='bold'>
                                        Practice And Prepare for Stock Market
                                    </MDTypography>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <img src={trading} width={200}/>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                    <MDTypography color='light' fontSize={12}>
                                        Start your trading learning journey by participating in different TestZones and Virtual Trading!
                                    </MDTypography>
                                    </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12} md={4} lg={4} p={1} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                    <Card style={{background:'linear-gradient(195deg, #66BB6A, #43A047)'}} sx={{ minWidth: '100%', minHeight: '20vH' }}>
                                    <MDButton 
                                        style={{background:'linear-gradient(195deg, #66BB6A, #43A047)'}} 
                                        sx={{ minWidth: '100%', minHeight: '20vH' }}
                                        component = {Link}
                                        to={{
                                            pathname: `/testzone`,
                                        }}
                                    >
                                        <CardContent>
                                        <Grid container xs={12} md={12} lg={12} mt={2} sx={{ minWidth: '100%' }} display='flex' justifyContent='center' alignItems='center'>
                                            <Grid item xs={12} md={12} lg={12} p={1} display='flex' justifyContent='flex-start' alignItems='center' alignContent='center'>
                                                <Grid container xs={12} md={12} lg={12}>
                                                <Grid item xs={12} md={12} lg={12}>
                                                    <img src={testzone} width={100}/>
                                                </Grid>
                                                <Grid item xs={12} md={12} lg={12}>
                                                <MDTypography color='light' fontSize={15} fontWeight='bold'>
                                                    Join TestZone
                                                </MDTypography>
                                                </Grid>
                                                <Grid container xs={12} md={12} lg={12}>
                                                <MDTypography color='light' fontSize={12}>
                                                    Join different TestZones and test your F&O strategies and earn cash rewards when your strategies work.
                                                </MDTypography>
                                                </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        </CardContent>
                                    </MDButton>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={4} lg={4} p={1} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                    
                                    <Card style={{background:'linear-gradient(195deg, #66BB6A, #43A047)'}} sx={{ minWidth: '100%', minHeight: '20vH' }}>
                                    <MDButton 
                                        style={{background:'linear-gradient(195deg, #66BB6A, #43A047)'}} 
                                        sx={{ minWidth: '100%', minHeight: '20vH' }}
                                        component = {Link}
                                        to={{
                                            pathname: `/market`,
                                        }}
                                    >
                                        <CardContent>
                                        <Grid container xs={12} md={12} lg={12} mt={2} sx={{ minWidth: '100%' }} display='flex' justifyContent='center' alignItems='center'>
                                            <Grid item xs={12} md={12} lg={12} p={1} display='flex' justifyContent='flex-start' alignItems='center' alignContent='center'>
                                                <Grid container xs={12} md={12} lg={12}>
                                                <Grid item xs={12} md={12} lg={12}>
                                                    <img src={market} width={100}/>
                                                </Grid>
                                                <Grid item xs={12} md={12} lg={12}>
                                                <MDTypography color='light' fontSize={15} fontWeight='bold'>
                                                    Practice F&O
                                                </MDTypography>
                                                </Grid>
                                                <Grid container xs={12} md={12} lg={12}>
                                                <MDTypography color='light' fontSize={12}>
                                                    Practice F&O trading in a virtual environment with real-time market data with a virtual currency of ₹10,00,000
                                                </MDTypography>
                                                </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        </CardContent>
                                    </MDButton>
                                    </Card>
                                    
                                </Grid>
                            </Grid>

                            </CardContent>
                            {/* <CardActions>
                                <Grid container xs={12} md={12} lg={12} mt={-2} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                        <MDButton 
                                            size="small"
                                            variant='text'
                                            component = {Link}
                                            to={{
                                                pathname: `/testzoneprofile/${e?.userid}`,
                                            }}
                                            state={{data: e}}
                                        >
                                            Full Leaderboard
                                        </MDButton>
                                    </Grid>
                                </Grid>
                            </CardActions> */}
                            </Card>
                            </Grid>
                       
                    </Grid>
            </Grid>
        </Grid>
    </MDBox>
)
}

export default Summary;
