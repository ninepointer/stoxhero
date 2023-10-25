import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import ContestCarousel from '../../../assets/images/success.png'
import MDButton from "../../../components/MDButton";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";


function OnGoingContests() {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [contest, setContest] = useState([]);
    const [ongoing, setOngoing] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true)
            let call1 = axios.get(`${baseUrl}api/v1/dailycontest/contests/onlyupcoming`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                    },
                })
            let call2 = axios.get(`${baseUrl}api/v1/dailycontest/contests/ongoing`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                    },
                })
            Promise.all([call1, call2])
            .then(([api1Response, api1Response1]) => {

                setUpcoming(api1Response.data.data)
                setOngoing(api1Response1.data.data)
                if(api1Response.data.data?.length === 0){
                    setContest(api1Response1.data.data)
                } else if(api1Response1.data.data?.length === 0){
                    setContest(api1Response.data.data)
                } else{
                    setContest(api1Response1.data.data)
                }
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
            })
            .catch((error) => {
              // Handle errors here
              console.error(error);
            });
    }, [])

    function changeDateFormat(givenDate) {

        const date = new Date(givenDate);

        // Convert the date to IST
        date.setHours(date.getHours());
        date.setMinutes(date.getMinutes());

        // Format the date as "dd Month yyyy | hh:mm AM/PM"
        const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()} | ${formatTime(date.getHours(), date.getMinutes())}`;

        console.log(formattedDate);

        // Helper function to get the month name
        function getMonthName(month) {
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            return monthNames[month];
        }

        // Helper function to format time as "hh:mm AM/PM"
        function formatTime(hours, minutes) {
            const meridiem = hours >= 12 ? "PM" : "AM";
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes.toString().padStart(2, "0");
            return `${formattedHours}:${formattedMinutes} ${meridiem}`;
        }

        return formattedDate;

    }


    return (
        <>
            {loading ?
                <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
                    <CircularProgress color="info" />
                </MDBox>
                :
                <MDBox borderRadius={5} minHeight='auto'>
                    <Grid container display='flex' justifyContent='space-between' alignItems='center'>
                        <Grid item xs={12} md={6} lg={12} m={1}>
                            <MDBox display='flex' mb={1} justifyContent='space-between' alignItems='center'>
                                <Grid container alignItems='center'>
                                    <Grid item xs={12} md={6} lg={12}>
                                        <MDTypography ml={1} fontSize={15} fontWeight="bold" >{(ongoing.length !==0) ? "Ongoing Contests" : (upcoming.length !== 0) ? "Upcoming Contests" : "Contests"}</MDTypography>
                                    </Grid>
                                </Grid>
                            </MDBox>
                            {contest.length !== 0 ?
                                contest.map((elem) => {
                                    let isContestFull = (elem.maxParticipants - elem.participants.length) === 0;
                                    return (
                                        <MDBox key={elem._id} bgColor="light" borderRadius={5} minHeight='auto' mt={0.5}>
                                            <Grid container spacing={0.1} display='flex' justifyContent='center' alignItems='center'>

                                                <Grid item xs={12} md={12} lg={12}>
                                                    <MDBox bgColor='secondary' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                                        <Grid container xs={12} md={12} lg={12}>
                                                            <Grid item xs={3} md={3} lg={12} display='flex' justifyContent='flex-start' alignItems='center'>
                                                                <Grid container xs={3} md={3} lg={12} display='flex' alignItems='center'>
                                                                    <Grid item xs={3} md={3} lg={9}>
                                                                        <MDTypography
                                                                            fontSize={12}
                                                                            fontWeight="bold"
                                                                            style={{ color: isContestFull ? "white" : 'white', animation: isContestFull ? '' : 'blinking .8s infinite' }}
                                                                        >
                                                                            {isContestFull ? "Contest Full" : "Limited Seats - Join Now!"}
                                                                        </MDTypography>
                                                                    </Grid>
                                                                    <Grid item xs={3} md={3} lg={3} display='flex' justifyContent='flex-end' alignItems='center'>
                                                                        <MDButton size='small' onClick={() => { navigate(`/contests`) }}><MDTypography fontSize={10} fontWeight='bold'>Join Now</MDTypography></MDButton>
                                                                    </Grid>
                                                                </Grid>
                                                                <style>
                                                                    {`
                                                                    @keyframes blinking {
                                                                    0% {
                                                                        opacity: 1;
                                                                    }
                                                                    50% {
                                                                        opacity: 0;
                                                                    }
                                                                    100% {
                                                                        opacity: 1;
                                                                    }
                                                                    }
                                                                `}
                                                                </style>
                                                            </Grid>

                                                            <Grid item xs={3} md={3} lg={2} display='flex' justifyContent='flex-start' alignItems='center'>
                                                                <img src={ContestCarousel} width='40px' height='40px' />
                                                            </Grid>
                                                            <Grid item xs={3} md={3} lg={10} display='flex' justifyContent='flex-start' alignItems='center'>
                                                                <MDTypography fontSize={12} color='light' fontWeight="bold">{elem?.contestName}</MDTypography>
                                                            </Grid>
                                                            <Grid item xs={3} md={3} lg={2} display='flex' justifyContent='flex-start' alignItems='center'>
                                                            </Grid>
                                                            <Grid item xs={3} md={3} lg={10} display='flex' justifyContent='flex-start' alignItems='center'>
                                                                <MDTypography fontSize={12} color='light' fontWeight="bold">Starts On: {changeDateFormat(elem?.contestStartTime)}</MDTypography>
                                                            </Grid>

                                                            {(!isContestFull && elem.entryFee !== 0) &&
                                                                <>
                                                                    <Grid item xs={3} md={3} lg={2} display='flex' justifyContent='flex-start' alignItems='center'>
                                                                    </Grid>

                                                                    <Grid item xs={3} md={3} lg={10} display='flex' justifyContent='flex-start' alignItems='center'>
                                                                        <MDTypography fontSize={12} color='light' fontWeight="bold">Spots Left: {elem?.maxParticipants - elem?.participants?.length}</MDTypography>
                                                                    </Grid>
                                                                </>
                                                            }
                                                            <Grid item xs={3} md={3} lg={2} display='flex' justifyContent='flex-start' alignItems='center'>
                                                            </Grid>
                                                            <Grid item xs={3} md={3} lg={10} display='flex' justifyContent='flex-start' alignItems='center'>
                                                                <MDTypography fontSize={12} color='light' fontWeight="bold">Payout: {elem?.payoutPercentage}% of Net P&L</MDTypography>
                                                            </Grid>
                                                            <Grid item xs={3} md={3} lg={2} display='flex' justifyContent='flex-start' alignItems='center'>
                                                            </Grid>
                                                            <Grid item xs={3} md={3} lg={10} display='flex' justifyContent='flex-start' alignItems='center'>
                                                                <MDTypography fontSize={12} color='light' fontWeight="bold">Entry Fee: ₹{elem?.entryFee}/-</MDTypography>
                                                            </Grid>
                                                        </Grid>
                                                    </MDBox>
                                                </Grid>

                                            </Grid>
                                        </MDBox>
                                    )
                                })
                                :
                                <MDBox bgColor="light" borderRadius={5} minHeight='auto' mt={0}>
                                    <Grid container spacing={0} display='flex' justifyContent='center' alignItems='center'>

                                        <Grid item xs={12} md={12} lg={12}>
                                            <MDBox bgColor='#2D2D2D' p={0} borderRadius={5} display='flex' minWidth='100%' height="200px">
                                                <Grid container xs={12} md={12} lg={12}>
                                                    <Grid item xs={3} md={3} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                        <MDTypography
                                                            fontSize={15}
                                                            color='light'
                                                            fontWeight="bold"
                                                            style={{ textAlign: 'center' }}
                                                        >
                                                            There are currently no active contests on the platform. Please stay tuned for updates.
                                                        </MDTypography>
                                                    </Grid>
                                                </Grid>
                                            </MDBox>
                                        </Grid>

                                    </Grid>
                                </MDBox>
                            }

                        </Grid>
                    </Grid>
                </MDBox>}
        </>

    )
}

export default OnGoingContests;
