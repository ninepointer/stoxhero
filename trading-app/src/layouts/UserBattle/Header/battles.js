import React, { useState, useEffect } from 'react';
import ReactGA from "react-ga"
import { CircularProgress, Divider, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
// import FreeContest from "./freeContest";
// import PaidContest from "./paidContest";
import MDButton from '../../../components/MDButton';
import { Link } from "react-router-dom"
import axios from "axios";
import SchoolIcon from '@mui/icons-material/School';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import OnGoingBattles from '../data/onGoingBattles'
import UpcomingBattles from '../data/upcomingBattles'
import PastBattles from '../data/pastBattles'

export default function LabTabs() {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [clicked, setClicked] = useState('ongoing')
    const [isLoading, setIsLoading] = useState(false);
    let [showPay, setShowPay] = useState(true);
    const [isInterested, setIsInterested] = useState(false);
    const [contest, setContest] = useState([]);

    useEffect(() => {
        setIsLoading(true)
        axios.get(`${baseUrl}api/v1/dailycontest/contests/upcoming`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        })
        .then((res) => {
            setContest(res.data.data);
            setTimeout(()=>{
                setIsLoading(false)
            },1000)
            
        }).catch((err) => {
            setIsLoading(false)
            return new Error(err);
        })
    }, [isInterested, showPay, clicked])

    let free = contest.filter((elem)=>{
        return elem?.entryFee === 0;
    })

    let paid = contest.filter((elem)=>{
        return elem?.entryFee !== 0;
    })

    const handleClick = (e) => {
        console.log(e)
        setClicked(e)
      };

    return (

        <MDBox color="light" display='flex' justifyContent='center' flexDirection='column'  mb={1} borderRadius={10} minHeight='auto' width='100%'>
            <MDBox mb={1} p={0.5} width='100%' bgColor='light' minHeight='auto' display='flex' justifyContent='center' borderRadius={7}>
                    <Grid container spacing={1} xs={12} md={12} lg={12}>
                        <Grid item xs={12} md={4} lg={2.4} display='flex' justifyContent='center'>
                            <MDButton bgColor='dark' color={clicked == "ongoing" ? "warning" : "secondary"} size='small'
                                // component={Link}
                                // to={{
                                //     pathname: `/completedcontests`,
                                // }}
                                onClick={()=>{handleClick("ongoing")}}
                            >
                                <MDBox display='flex' justifyContent='center' alignItems='center'>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        <RemoveRedEyeIcon/>
                                    </MDBox>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        OnGoing Battles
                                    </MDBox>
                                </MDBox>
                            </MDButton>
                        </Grid>
                        <Grid item xs={12} md={4} lg={2.4} display='flex' justifyContent='center'>
                            <MDButton bgColor='dark' color={clicked == "upcoming" ? "warning" : "secondary"} size='small'
                                onClick={()=>{handleClick("upcoming")}}
                            >
                                <MDBox display='flex' justifyContent='center' alignItems='center'>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        <RemoveRedEyeIcon/>
                                    </MDBox>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        Upcoming Battles
                                    </MDBox>
                                </MDBox>
                            </MDButton>
                        </Grid>
                        <Grid item xs={12} md={4} lg={2.4} display='flex' justifyContent='center'>
                            <MDButton bgColor='dark' color={clicked == "past" ? "warning" : "secondary"} size='small'
                                onClick={()=>{handleClick("past")}}
                            >
                                <MDBox display='flex' justifyContent='center' alignItems='center'>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        <RemoveRedEyeIcon/>
                                    </MDBox>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        My Past Battles
                                    </MDBox>
                                </MDBox>
                            </MDButton>
                        </Grid>
                        <Grid item xs={12} md={4} lg={2.4} display='flex' justifyContent='center'>
                            <MDButton bgColor='dark' color={clicked == "leaderboard" ? "warning" : "secondary"} size='small'
                                onClick={()=>{handleClick("leaderboard")}}
                            >
                                <MDBox display='flex' justifyContent='center' alignItems='center'>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        <SportsScoreIcon/>
                                    </MDBox>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        Battle Leaderboard
                                    </MDBox>
                                </MDBox>
                            </MDButton>
                        </Grid>
                        <Grid item xs={12} md={4} lg={2.4} display='flex' justifyContent='center'>
                            <MDButton bgColor='dark' color={clicked == "college" ? "warning" : "secondary"} size='small'
                                onClick={()=>{handleClick("college")}}
                            >
                                <MDBox display='flex' justifyContent='center' alignItems='center'>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        <SchoolIcon/>
                                    </MDBox>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        College Battles
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
                            {clicked === "ongoing" ?
                            <>
                                <OnGoingBattles/>
                            </>
                            :
                            clicked === "upcoming" ?
                            <>
                                <UpcomingBattles/>
                            </>
                            :
                            clicked === "upcoming" ?
                            <>
                                <PastBattles/>
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