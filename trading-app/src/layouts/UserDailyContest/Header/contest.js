import React, { useState, useEffect } from 'react';
import ReactGA from "react-ga"
import { CircularProgress, Divider, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
// import MyPortfolio from '../data/Portfolios'
// import TenXPortfolio from '../data/TenXPortfolio'
import MDTypography from '../../../components/MDTypography';
// import axios from "axios";
// import { useContext } from 'react';
// import {userContext} from '../../../AuthContext'
import FreeContest from "./freeContest";
import PaidContest from "./paidContest";
import MDButton from '../../../components/MDButton';
import { Link } from "react-router-dom"
import axios from "axios";
import SchoolIcon from '@mui/icons-material/School';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

export default function LabTabs({socket}) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

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

    return (

        <MDBox bgColor="dark" color="light" display='flex' justifyContent='center' flexDirection='column'  mb={1} borderRadius={10} minHeight='auto'>

            {isLoading ?
                <MDBox mt={10} mb={10} display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress color='light' />
                </MDBox>
                :
                <>
                    <MDBox mt={0} mb={1} p={0.5} width='100%' bgColor='light' minHeight='auto' display='flex' justifyContent='space-between' borderRadius={7}>
                        <MDButton bgColor='dark' color={"warning"} size='small'
                            component={Link}
                            to={{
                                pathname: `/completedcontests`,
                            }}
                        >
                            <MDBox display='flex' justifyContent='center' alignItems='center'>
                                <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                    <RemoveRedEyeIcon/>
                                </MDBox>
                                <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                    Past Contests
                                </MDBox>
                            </MDBox>
                        </MDButton>
                        <MDButton bgColor='dark' color={"warning"} size='small'
                            component={Link}
                            to={{
                                pathname: `/contestscoreboard`,
                            }}
                        >
                            <MDBox display='flex' justifyContent='center' alignItems='center'>
                                <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                    <SportsScoreIcon/>
                                </MDBox>
                                <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                    Contest Scoreboard
                                </MDBox>
                            </MDBox>
                        </MDButton>
                        <MDButton bgColor='dark' color={"warning"} size='small'
                            component={Link}
                            to={{
                                pathname: `/collegecontest`,
                            }}
                        >
                            <MDBox display='flex' justifyContent='center' alignItems='center'>
                                <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                    <SchoolIcon/>
                                </MDBox>
                                <MDBox display='flex' color='light' justifyContent='center' alignItems='center'>
                                    College Contest
                                </MDBox>
                            </MDBox>
                        </MDButton>
                    </MDBox>
                    <Grid container xs={12} md={12} lg={12} display='flex'>
                        <Grid item xs={12} md={6} lg={12}>
                            {paid.length !== 0 &&
                            <>
                                <MDTypography color="light" fontSize={15} ml={0.5} fontWeight="bold">Paid Contest(s)</MDTypography>
                                <PaidContest socket={socket} contest={contest} isInterested={isInterested} setIsInterested={setIsInterested} showPay={showPay} setShowPay={setShowPay}/>
                            </>
                            }
                        </Grid>

                        {/* <Divider style={{ backgroundColor: 'light' }}/> */}

                        <Grid item xs={12} md={6} lg={12}>
                            {free.length !== 0 &&
                            <>
                                <MDTypography  color="light" fontSize={15} fontWeight="bold" ml={0.5} mt={1}>Free Contest(s)</MDTypography>
                                <MDBox style={{ minWidth: '100%' }}>
                                    <FreeContest socket={socket} contest={contest} isInterested={isInterested} setIsInterested={setIsInterested} showPay={showPay} setShowPay={setShowPay} />
                                </MDBox>
                            </>
                            }
                        </Grid>
                    </Grid>
                </>
            }
        </MDBox>

    );
}