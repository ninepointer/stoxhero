import React, { useState, useEffect, useContext } from 'react';
import ReactGA from "react-ga"
import { CircularProgress, Divider, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
// import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
// import axios from "axios";
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import { io } from 'socket.io-client';
// import { socketContext } from '../../../socketContext';
import AvailableTenXPlans from './availableTenXPlans';
import SubscribedTenXPlans from './subscribedTenXPlans';
import ExpiredTenXPlans from './expiredTenXPlans';
import TenXLeaderboard from './TenXLeaderboard'
import { userContext } from '../../../AuthContext';

export default function LabTabs() {
    const [clicked, setClicked] = useState('live')
    const getDetails = useContext(userContext);
    useEffect(() => {
      ReactGA.pageview(window.location.pathname)
    }, []);

    const [isLoading, setIsLoading] = useState(false);

    const handleClick = (e) => {
        window.webengage.track(`tenx_${e}_clicked`, {
            user: getDetails?.userDetails?._id,
        });
        setClicked(e)
      };

    return (

        <MDBox bgColor="dark" color="light" display='flex' justifyContent='center' flexDirection='column'  mb={1} mt={1} borderRadius={10} minHeight='auto' width='100%'>

          
                    <MDBox mt={0} mb={1} p={0.5} minWidth='100%' bgColor='light' minHeight='auto' display='flex' justifyContent='center' borderRadius={7}>
                        
                    <Grid container spacing={1} xs={12} md={12} lg={12} minWidth='100%'>
                        <Grid item xs={12} md={4} lg={3} display='flex' justifyContent='center'>
                            <MDButton bgColor='dark' color={clicked == "live" ? "warning" : "secondary"} size='small' style={{minWidth:'100%'}}
                                onClick={()=>{handleClick("live")}}
                            >
                                <MDBox display='flex' justifyContent='center' alignItems='center'>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        <RemoveRedEyeIcon/>
                                    </MDBox>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        Available TenX Plans
                                    </MDBox>
                                </MDBox>
                            </MDButton>
                        </Grid>
                        <Grid item xs={12} md={4} lg={3} display='flex' justifyContent='center'>
                            <MDButton bgColor='dark' color={clicked == "subscribed" ? "warning" : "secondary"} size='small' style={{minWidth:'100%'}}
                                onClick={()=>{handleClick("subscribed")}}
                            >
                                <MDBox display='flex' justifyContent='center' alignItems='center'>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        <RemoveRedEyeIcon/>
                                    </MDBox>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        Subscribed TenX Plans
                                    </MDBox>
                                </MDBox>
                            </MDButton>
                        </Grid>
                        <Grid item xs={12} md={4} lg={3} display='flex' justifyContent='center'>
                            <MDButton bgColor='dark' color={clicked == "expired" ? "warning" : "secondary"} size='small' style={{minWidth:'100%'}}
                                onClick={()=>{handleClick("expired")}}
                            >
                                <MDBox display='flex' justifyContent='center' alignItems='center'>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        <RemoveRedEyeIcon/>
                                    </MDBox>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        Expired TenX Plans
                                    </MDBox>
                                </MDBox>
                            </MDButton>
                        </Grid>
                        <Grid item xs={12} md={4} lg={3} display='flex' justifyContent='center'>
                            <MDButton bgColor='dark' color={clicked == "leaderboard" ? "warning" : "secondary"} size='small' style={{minWidth:'100%'}}
                                onClick={()=>{handleClick("leaderboard")}}
                            >
                                <MDBox display='flex' justifyContent='center' alignItems='center'>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        <SportsScoreIcon/>
                                    </MDBox>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        TenX Leaderboard
                                    </MDBox>
                                </MDBox>
                            </MDButton>
                        </Grid>
                    </Grid>
                    </MDBox>

                {isLoading ?
                <MDBox mt={10} mb={10} display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress color='light' />
                </MDBox>
                :
                <>
                <MDBox style={{width:'100%'}}>
                    <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                        <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                            {clicked === "live" ?
                            <>
                                <AvailableTenXPlans setClicked={setClicked}/>
                            </>
                            :
                            clicked === "subscribed" ?
                            <>
                                <SubscribedTenXPlans setClicked={setClicked}/>
                            </>
                            :
                            clicked === "expired" ?
                            <>
                                <ExpiredTenXPlans setClicked={setClicked}/>
                            </>
                            :
                            clicked === "leaderboard" ?
                            <>
                                <TenXLeaderboard setClicked={setClicked}/>
                            </>
                            :
                            <>
                                {/* <PastBattles/> */}
                            </>
                            }
                        </Grid>
                    </Grid>
                </MDBox>
                </>
            }
           
        </MDBox>

    );
}