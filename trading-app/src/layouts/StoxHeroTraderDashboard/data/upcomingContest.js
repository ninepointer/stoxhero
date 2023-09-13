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
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true)
        axios.get(`${baseUrl}api/v1/dailycontest/contests/onlyupcoming`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        })
            .then((res) => {
                setContest(res.data.data);
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)

            }).catch((err) => {
                setIsLoading(false)
                return new Error(err);
            })


            axios.get(`${baseUrl}api/v1/dailycontest/contests/ongoing`, {
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
            })
                .then((res) => {
                    setUpcoming(res.data.data);
                    if(contest.length === 0){
                        setContest(res.data.data)
                    }
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 1000)
    
                }).catch((err) => {
                    setIsLoading(false)
                    return new Error(err);
                })
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
                    <CircularProgress color="light" />
                </MDBox>
                :
                <MDBox bgColor="light" border='1px solid lightgrey' borderRadius={5} minHeight='auto'>
                    <Grid container display='flex' justifyContent='space-between' alignItems='center'>
                        <Grid item xs={12} md={6} lg={12} m={1}>
                            <MDBox display='flex' mb={1} justifyContent='space-between' alignItems='center'>
                                <Grid container alignItems='center'>
                                    <Grid item xs={12} md={6} lg={12}>
                                        <MDTypography ml={1} fontSize={15} fontWeight="bold">{contest.length === 0 ? "Ongoing Contests" : upcoming.length === 0 ? "Upcoming Contests" : "Contests"}</MDTypography>
                                    </Grid>
                                </Grid>
                            </MDBox>
                            {contest.map((elem) => {
                                return (
                                    <MDBox key={elem._id} bgColor="light" borderRadius={5} minHeight='auto' mt={2}>
                                        <Grid container xs={12} md={12} lg={12} spacing={1} display='flex' justifyContent='center' alignItems='center'>

                                            <Grid item xs={12} md={12} lg={12}>
                                                <MDBox bgColor='secondary' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                                    <Grid container xs={12} md={12} lg={12}>
                                                        <Grid item xs={3} md={3} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                            <MDTypography
                                                                fontSize={15}
                                                                color='light'
                                                                fontWeight="bold"
                                                                style={{ animation: 'blinking .8s infinite' }}
                                                            >
                                                                Limited Seats - Join Now!
                                                            </MDTypography>
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

                                                        <Grid item xs={3} md={3} lg={3} display='flex' justifyContent='flex-start' alignItems='center'>
                                                            <img src={ContestCarousel} width='40px' height='40px' />
                                                        </Grid>
                                                        <Grid item xs={3} md={3} lg={9} display='flex' justifyContent='flex-start' alignItems='center'>
                                                            <MDTypography fontSize={15} color='light' fontWeight="bold">{elem?.contestName}</MDTypography>
                                                        </Grid>
                                                        <Grid item xs={3} md={3} lg={3} display='flex' justifyContent='flex-start' alignItems='center'>
                                                        </Grid>
                                                        <Grid item xs={3} md={3} lg={9} display='flex' justifyContent='flex-start' alignItems='center'>
                                                            <MDTypography fontSize={12} color='light' fontWeight="bold">Starts On: {changeDateFormat(elem?.contestStartTime)}</MDTypography>
                                                        </Grid>

                                                        <Grid item xs={3} md={3} lg={3} display='flex' justifyContent='flex-start' alignItems='center'>
                                                        </Grid>
                                                        <Grid item xs={3} md={3} lg={9} display='flex' justifyContent='flex-start' alignItems='center'>
                                                            <MDTypography fontSize={12} color='light' fontWeight="bold">Spots Left: {elem?.maxParticipants - elem?.participants?.length}</MDTypography>
                                                            {/* <MDTypography fontSize={12} color='light' fontWeight="bold">Payout: {elem?.payoutPercentage}%</MDTypography> */}
                                                        </Grid>
                                                        <Grid item xs={3} md={3} lg={3} display='flex' justifyContent='flex-start' alignItems='center'>
                                                        </Grid>
                                                        <Grid item xs={3} md={3} lg={9} display='flex' justifyContent='flex-start' alignItems='center'>
                                                            <MDTypography fontSize={12} color='light' fontWeight="bold">Payout: {elem?.payoutPercentage}% of Net P&L</MDTypography>
                                                        </Grid>

                                                        {/* <Grid item xs={3} md={3} lg={3} display='flex' justifyContent='center' alignItems='center'>
                                                        </Grid> */}
                                                        <Grid item xs={3} md={3} lg={12} display='flex' justifyContent='flex-end' alignItems='center'>
                                                            <MDButton size='small' onClick={() => { navigate(`/contest`) }}>View</MDButton>
                                                        </Grid>
                                                    </Grid>
                                                </MDBox>
                                            </Grid>

                                        </Grid>
                                    </MDBox>
                                )
                            })}

                        </Grid>
                    </Grid>
                </MDBox>}
        </>

    )
}

export default OnGoingContests;
