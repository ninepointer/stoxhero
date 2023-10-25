import React, { useState, useEffect, useContext } from 'react';
import ReactGA from "react-ga"
import { CircularProgress, Divider, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import axios from "axios";
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { io } from 'socket.io-client';
import { socketContext } from '../../../socketContext';
import LiveBattles from '../data/liveBattles';
import UpcomingBattles from '../data/upcomingBattles';
import CompletedBattles from '../data/completedBattles'
// import BattleLeaderboard from '../../contestScoreboard/Header/marginXLeaderBoard'

export default function LabTabs() {
    const [clicked, setClicked] = useState('live')

    useEffect(() => {
        ReactGA.pageview(window.location.pathname)
    }, []);

    const [isLoading, setIsLoading] = useState(false);

    const handleClick = (e) => {
        console.log(e)
        setClicked(e)
    };

    return (

        <MDBox bgColor="dark" color="light" display='flex' justifyContent='center' flexDirection='column' mb={1} borderRadius={10} minHeight='auto' width='100%'>


            <MDBox mt={0} mb={1} p={0.5} minWidth='100%' bgColor='light' minHeight='auto' display='flex' justifyContent='center' borderRadius={7}>

                <Grid container spacing={1} xs={12} md={12} lg={12} minWidth='100%'>
                    <Grid item xs={12} md={4} lg={3} display='flex' justifyContent='center'>
                        <MDButton bgColor='dark' color={clicked == "live" ? "warning" : "secondary"} size='small' style={{ minWidth: '100%' }}
                            onClick={() => { handleClick("live") }}
                        >
                            <MDBox display='flex' justifyContent='center' alignItems='center'>
                                <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                    <RemoveRedEyeIcon />
                                </MDBox>
                                <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                    Live Battles
                                </MDBox>
                            </MDBox>
                        </MDButton>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3} display='flex' justifyContent='center'>
                        <MDButton bgColor='dark' color={clicked == "upcoming" ? "warning" : "secondary"} size='small' style={{ minWidth: '100%' }}
                            onClick={() => { handleClick("upcoming") }}
                        >
                            <MDBox display='flex' justifyContent='center' alignItems='center'>
                                <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                    <RemoveRedEyeIcon />
                                </MDBox>
                                <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                    Upcoming Battles
                                </MDBox>
                            </MDBox>
                        </MDButton>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3} display='flex' justifyContent='center'>
                        <MDButton bgColor='dark' color={clicked == "completed" ? "warning" : "secondary"} size='small' style={{ minWidth: '100%' }}
                            onClick={() => { handleClick("completed") }}
                        >
                            <MDBox display='flex' justifyContent='center' alignItems='center'>
                                <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                    <RemoveRedEyeIcon />
                                </MDBox>
                                <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                    Completed Battles
                                </MDBox>
                            </MDBox>
                        </MDButton>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3} display='flex' justifyContent='center'>
                        <MDButton bgColor='dark' color={clicked == "leaderboard" ? "warning" : "secondary"} size='small' style={{ minWidth: '100%' }}
                            onClick={() => { handleClick("leaderboard") }}
                        >
                            <MDBox display='flex' justifyContent='center' alignItems='center'>
                                <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                    <SportsScoreIcon />
                                </MDBox>
                                <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                    Battle Leaderboard
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
                    <MDBox>
                        <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                            <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center'>
                                {clicked === "live" ?
                                    <>
                                        <LiveBattles setClicked={setClicked} />
                                    </>
                                    :
                                    clicked === "upcoming" ?
                                        <>
                                            <UpcomingBattles setClicked={setClicked} />
                                        </>
                                        :
                                        clicked === "completed" ?
                                            <>
                                                <CompletedBattles setClicked={setClicked}/>
                                            </>
                                            :
                                            clicked === "leaderboard" ?
                                                <>
                                                    {/* <BattleLeaderboard/> */}
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