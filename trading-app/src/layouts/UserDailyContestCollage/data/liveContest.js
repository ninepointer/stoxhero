import React, { useState, useEffect, useContext } from 'react';
import ReactGA from "react-ga"
import { CircularProgress, Divider, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import FreeContest from "../Header/freeContest";
import PaidContest from "../Header/paidContest";
import MDButton from '../../../components/MDButton';
// import { Link } from "react-router-dom"
import axios from "axios";
// import SchoolIcon from '@mui/icons-material/School';
import WinnerImage from '../../../assets/images/cup-image.png'
// import SportsScoreIcon from '@mui/icons-material/SportsScore';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import { io } from 'socket.io-client';
import { socketContext } from '../../../socketContext';
import { userContext } from '../../../AuthContext';

export default function LabTabs({setClicked}) {
    // const [clicked, setClicked] = useState('live')
    const [isLoading, setIsLoading] = useState(false); 
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    // let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
    const socket = useContext(socketContext);
    let [showPay, setShowPay] = useState(true);
    const [isInterested, setIsInterested] = useState(false);
    const [contest, setContest] = useState([]);
    const getDetails = useContext(userContext);
    useEffect(() => {
        ReactGA.pageview(window.location.pathname);
        window.webengage.track('college_live_testzone_clicked', {
            user: getDetails?.userDetails?._id,
        })
    }, []);


    useEffect(() => {
        setIsLoading(true)
        axios.get(`${baseUrl}api/v1/dailycontest/collegecontests/userlive`, {
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
            },500)
            
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

    // const handleClick = (e) => {
    //     console.log(e)
    //     setClicked(e)
    //   };

    return (

        <MDBox bgColor="dark" color="light" display='flex' justifyContent='center' flexDirection='column'  mb={0.5} borderRadius={10} minHeight='auto' width='100%'>
            {isLoading ?
                <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
                    <CircularProgress color='info' />
                </MDBox>
                :
            <>
               {contest.length != 0 ? 
                <Grid container xs={12} md={12} lg={12} display='flex'>
                    
                    <Grid item xs={12} md={6} lg={12}>
                        {free.length !== 0 &&
                        <>
                            <MDBox>
                                <MDTypography color="light" fontSize={15} fontWeight="bold" ml={1} mb={0.5} alignItems='center'>Free TestZone(s)</MDTypography>
                            </MDBox>
                            <MDBox style={{ minWidth: '100%' }}>
                                <FreeContest socket={socket} contest={contest} isInterested={isInterested} setIsInterested={setIsInterested} showPay={showPay} setShowPay={setShowPay} />
                            </MDBox>
                        </>
                        }
                    </Grid>
                    
                    <Grid item xs={12} md={6} lg={12} mt={.5}>
                        {paid.length !== 0 &&
                        <>
                            <MDBox>
                                <MDTypography color="light" fontSize={15} ml={1} mb={0.5} fontWeight="bold">Paid TestZone(s)</MDTypography>
                            </MDBox>
                            <PaidContest socket={socket} contest={contest} isInterested={isInterested} setIsInterested={setIsInterested} showPay={showPay} setShowPay={setShowPay}/>
                        </>
                        }
                    </Grid>

                </Grid>
                :
                <MDBox style={{minHeight:"20vh"}} border='1px solid white' borderRadius={5} display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
                    <img src={WinnerImage} width={50} height={50}/>
                    <MDTypography color="light" fontSize={15} mb={1}>No Live TestZone(s)</MDTypography>
                    <MDButton color="info" size='small' fontSize={10} onClick={()=>{setClicked("upcoming")}} >Check Upcoming TestZones</MDButton>
                </MDBox>
                }
            </>
            }
        </MDBox>

    );
}