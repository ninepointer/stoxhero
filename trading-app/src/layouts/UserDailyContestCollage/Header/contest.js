import React, { useState, useEffect, useContext } from 'react';
import ReactGA from "react-ga"
import { CircularProgress, Divider, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import FreeContest from "./freeContest";
import PaidContest from "./paidContest";
import MDButton from '../../../components/MDButton';
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import SchoolIcon from '@mui/icons-material/School';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { io } from 'socket.io-client';
import { socketContext } from '../../../socketContext';
import LiveContests from '../data/liveContest';
import UpcomingContests from '../data/upcomingContests';
import CompletedContest from '../data/completedContests'
import CollegeLeaderboard from '../../contestScoreboard/Header/collegeScoreboard'
// import ContestLeaderboard from '../../contestScoreboard/Header'

export default function LabTabs() {
    const [clicked, setClicked] = useState('live')
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    // let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"


    const socket = useContext(socketContext);
    const navigate = useNavigate();
  
    useEffect(() => {
      ReactGA.pageview(window.location.pathname)
    }, []);

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
    }, [isInterested, showPay])

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

        <MDBox bgColor="dark" color="light" display='flex' justifyContent='center' flexDirection='column'  mb={1} borderRadius={10} minHeight='auto' width='100%'>

          
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
                                        Open TestZones
                                    </MDBox>
                                </MDBox>
                            </MDButton>
                        </Grid>
                        <Grid item xs={12} md={4} lg={3} display='flex' justifyContent='center'>
                            <MDButton bgColor='dark' color={clicked == "upcoming" ? "warning" : "secondary"} size='small' style={{minWidth:'100%'}}
                                onClick={()=>{handleClick("upcoming")}}
                            >
                                <MDBox display='flex' justifyContent='center' alignItems='center'>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        <RemoveRedEyeIcon/>
                                    </MDBox>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        Upcoming TestZones
                                    </MDBox>
                                </MDBox>
                            </MDButton>
                        </Grid>
                        <Grid item xs={12} md={4} lg={3} display='flex' justifyContent='center'>
                            <MDButton bgColor='dark' color={clicked == "completed" ? "warning" : "secondary"} size='small' style={{minWidth:'100%'}}
                                onClick={()=>{handleClick("completed")}}
                            >
                                <MDBox display='flex' justifyContent='center' alignItems='center'>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        <RemoveRedEyeIcon/>
                                    </MDBox>
                                    <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                        Completed TestZones
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
                                        TestZones Leaderboard
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
                                <LiveContests setClicked={setClicked}/>
                            </>
                            :
                            clicked === "upcoming" ?
                            <>
                                <UpcomingContests setClicked={setClicked}/>
                            </>
                            :
                            clicked === "completed" ?
                            <>
                                <CompletedContest/>
                            </>
                            :
                            clicked === "leaderboard" ?
                            <>
                                <CollegeLeaderboard/>
                            </>
                            :
                            // clicked === "view_contest" ?
                            // <>
                            //     {}
                            // </>
                            // :
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