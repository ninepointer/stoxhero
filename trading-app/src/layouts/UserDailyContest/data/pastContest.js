import { React, useState, useEffect, useContext } from "react";
import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
import { userContext } from '../../../AuthContext';
// import moment from 'moment'

// prop-types is a library for typechecking of props.
// import PropTypes from "prop-types";
// import tradesicon from '../../../assets/images/tradesicon.png'

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

// Images
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
// import {InfinityTraderRole, tenxTrader} from "../../../variables";
// import ContestCup from '../../../assets/images/candlestick-chart.png'
import ContestCarousel from '../../../assets/images/target.png'
import Timer from '../timer'
import ProgressBar from "../progressBar";
import { HiUserGroup } from 'react-icons/hi';

import { CircularProgress, Divider } from "@mui/material";
import MDSnackbar from "../../../components/MDSnackbar";
import PopupMessage from "../data/popupMessage";
import PopupTrading from "../data/popupTrading";
import DailyContestOrders from "./viewOrders";
import {Link} from "react-router-dom"


function PastContest() {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [contest, setContest] = useState([]);
    const [isInterested, setIsInterested] = useState(false);
    const [timeDifference, setTimeDifference] = useState([]);
    const getDetails = useContext(userContext);
    const [serverTime, setServerTime] = useState();
    const [loading, setLoading] = useState(true);
    // const navigate = useNavigate();

    useEffect(() => {

        axios.get(`${baseUrl}api/v1/dailycontest/contests/completed`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        })
        .then((res) => {
            setContest(res.data.data);
        }).catch((err) => {
            return new Error(err);
        })
    }, [isInterested])

    useEffect(()=>{
        if(serverTime){
            setLoading(false);
        }
    }, [serverTime])

    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/servertime`)
        .then((res)=>{
            setServerTime(res.data.data);
        })
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
          axios.get(`${baseUrl}api/v1/servertime`)
            .then((res) => {
                console.log("server time", res.data.data)
              setServerTime(res.data.data);
            });
        }, 5000);
      
        return () => {
          clearInterval(interval);
        };
      }, []);

    // console.log("serverTime", serverTime)

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

    const [messageObj, setMessageObj] = useState({
        color: '',
        icon: '',
        title: '',
        content: ''
    })

    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = (value,content) => {
      if(value === "error"){
        messageObj.color = 'error'
        messageObj.icon = 'error'
        messageObj.title = "Error";
        messageObj.content = content;
      };
  
      setMessageObj(messageObj);
      setSuccessSB(true);
    }
    const closeSuccessSB = () => setSuccessSB(false);
  
    const renderSuccessSB = (
      <MDSnackbar
        color= {messageObj.color}
        icon= {messageObj.icon}
        title={messageObj.title}
        content={messageObj.content}
        open={successSB}
        onClose={closeSuccessSB}
        close={closeSuccessSB}
        bgWhite="info"
        sx={{ borderLeft: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRight: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRadius: "15px", width: "auto"}}
      />
    );

    return (
        <>
            <MDBox>
                {loading ?
                    <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
                        <CircularProgress color="light" />
                    </MDBox>
                    :
                    <Grid container spacing={2} xs={12} md={12} lg={12}>
                        {
                            contest.map((elem) => {
                                let contestOn = [];
                                if (elem.isNifty) {
                                    contestOn.push("NIFTY")
                                }
                                if (elem.isBankNifty) {
                                    contestOn.push("BANKNIFTY")
                                }
                                if (elem.isFinNifty) {
                                    contestOn.push("FINNIFTY")
                                }
                                if(elem.isAllIndex){
                                    contestOn = ['NIFTY', 'BANKNIFTY', 'FINNIFTY']
                                }

                                contestOn.push(elem.contestExpiry.toUpperCase());

                                let progressBar = elem?.participants?.length * 100 / elem?.maxParticipants
                                // let timeDifference = new Date(elem?.contestStartTime) - new Date(serverTime);
                                let checkIsInterested = elem?.interestedUsers.some(elem => elem?.userId?._id?.toString() == getDetails?.userDetails?._id?.toString())
                                
                                // let isTradingEnable = new Date(elem?.contestEndTime) - serverTime;
                                let particularContestTime = timeDifference.filter((subelem)=>{
                                    return subelem?.id?.toString() === elem?._id?.toString();
                                })

                                // console.log("timeDifference", particularContestTime[0]?.value )
                                return (
                                    <Grid item xs={12} md={12} lg={6} borderRadius={3}>
                                        <MDButton variant="contained" color="light" size="small">
                                            <Grid container display='flex' justifyContent='space-between' alignItems='center'>
                                                <Grid item xs={3} md={3} lg={3} display='flex' justifyContent='flex-start' alignItems='center'>
                                                    <img src={ContestCarousel} width='40px' height='40px' />
                                                </Grid>
                                                <Grid item xs={9} md={9} lg={9} display='flex' justifyContent='flex-end' alignItems='center'>
                                                    <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                        <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                            <MDBox display='flex' justifyContent='flex-start'><MDTypography fontSize={15} fontWeight='bold' color='dark'>{elem.contestName}</MDTypography></MDBox>
                                                        </MDBox>
                                                        <MDBox display='flex' justifyContent='flex-start' flexDirection='row' alignItems='center'>
                                                            <MDBox mr={1} display='flex' justifyContent='flex-start'><MDTypography fontSize={10} color='dark'>{`${changeDateFormat(elem.contestStartTime)} - ${changeDateFormat(elem.contestEndTime)}`}</MDTypography></MDBox>
                                                            {
                                                                contestOn.map((elem, index) => {
                                                                    return (
                                                                        <MDBox key={elem}>
                                                                            <MDBox mr={1} display='flex' justifyContent='flex-start' alignItems='center'><MDTypography fontSize={10} style={{ backgroundColor: (contestOn?.length - 1 === index) ? "#4169E1" : '#fb8c00', padding: '1px 1px 0px 1px', border: (contestOn?.length - 1 === index) ? "1px solid #4169E1" : '1px solid #fb8c00', borderRadius: '2px', alignItems: 'center' }} fontWeight='bold' color='light'>{elem}</MDTypography></MDBox>
                                                                        </MDBox>
                                                                    )
                                                                })
                                                            }
                                                        </MDBox>
                                                    </MDBox>
                                                </Grid>

                                                <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                    <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                        <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                            <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold' color='success'>Reward</MDTypography></MDBox>
                                                            <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold' color='dark'>{elem.payoutPercentage}% of the net P&L</MDTypography></MDBox>
                                                        </MDBox>
                                                    </MDBox>
                                                </Grid>

                                                <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                    <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                        <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                            Contest Completed
                                                        </MDBox>
                                                    </MDBox>
                                                </Grid>

                                                <Grid item mt={1} xs={12} md={12} lg={12} display="flex" justifyContent="space-between" alignItems="center" alignContent="center">
                                                    <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
                                                        <MDBox color="dark"><MDTypography fontSize={10} style={{ backgroundColor: 'grey', padding: '2px 2px 1px 2px', border: '1px solid grey', borderRadius: '2px', alignItems: 'center' }} fontWeight='bold' color='light'>ENTRY FEE : FREE</MDTypography></MDBox>
                                                    </MDBox>

                                                    <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
                                                        <MDBox color="dark"><MDTypography fontSize={10} style={{ backgroundColor: 'grey', padding: '2px 2px 1px 2px', border: '1px solid grey', borderRadius: '2px', alignItems: 'center' }} fontWeight='bold' color='light'>NET P&L: { "₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.portfolio?.portfolioValue)) }</MDTypography></MDBox>
                                                    </MDBox>

                                                    <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
                                                        <MDBox color="dark"><MDTypography fontSize={10} style={{ backgroundColor: 'grey', padding: '2px 2px 1px 2px', border: '1px solid grey', borderRadius: '2px', alignItems: 'center' }} fontWeight='bold' color='light'>PAYOUT: { "₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.portfolio?.portfolioValue)) }</MDTypography></MDBox>
                                                    </MDBox>

                                                    <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
                                                        <MDBox color="dark"><MDTypography fontSize={10} style={{ backgroundColor: 'grey', padding: '2px 2px 1px 2px', border: '1px solid grey', borderRadius: '2px', alignItems: 'center' }} fontWeight='bold' color='light'>PORTFOLIO: { "₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.portfolio?.portfolioValue)) }</MDTypography></MDBox>
                                                    </MDBox>
                                                </Grid>

                                                {/* <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                    <MDBox display='flex' justifyContent='center' sx={{ width: '100%' }}>
                                                        <ProgressBar progress={progressBar} />
                                                    </MDBox>
                                                </Grid> */}

                                                {/* <Grid item xs={12} md={12} lg={12} display="flex" mt={1} mb={1} justifyContent="space-between" alignItems="center" alignContent="center">
                                                    {particularContestTime[0]?.value > 0 ?
                                                        <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
                                                            <HiUserGroup color='black' /><MDBox color="dark" style={{ marginLeft: 3, marginTop: 3, fontWeight: 700 }}>{elem?.interestedUsers?.length} PEOPLE HAVE SHOWN INTEREST IN THIS CONTEST AND {elem?.maxParticipants - elem?.participants?.length} SEATS GRABBED</MDBox>
                                                        </MDBox>
                                                         :
                                                         particularContestTime[0]?.value <= 0 &&
                                                         <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
                                                             <HiUserGroup color='black' /><MDBox color="dark" style={{ marginLeft: 3, marginTop: 3, fontWeight: 700 }}>{elem?.maxParticipants - elem?.participants?.length} SEATS UP FOR GRAB</MDBox>
                                                         </MDBox>} 
                                                </Grid> */}

                                                <Grid item mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignItems='center'>
                                                    <MDBox display='flex' justifyContent='space-between' flexDirection='row' width='100%'>

                                                        
                                                        <MDBox display='flex' justifyContent='flex-start' width='50%'>
                                                        {/* {particularContestTime[0]?.value > 0 &&
                                                        <PopupMessage isInterested={checkIsInterested} setIsInterested={setIsInterested} isInterestedState={isInterested} elem={elem} data={`Thanks for showing interest in ${elem.contestName} contest. You will be notified 10 mins before the contest starts on your WhatsApp Number.`} />
                                                        } */}
                                                        {/* {checkIsInterested &&
                                                            <MDTypography color='info' fontWeight='bold' fontSize={13} mt={.5}>Thanks for expressing your interest.</MDTypography>
                                                        } */}
                                                        </MDBox>
                                                        
                                                        <MDBox mt={1} display='flex' justifyContent='flex-end' width='50%'>
                                                            <MDButton
                                                                variant='outlined'
                                                                color='warning'
                                                                size='small'
                                                            component={Link}
                                                            // disabled={timeDifference > 0}
                                                            to={{
                                                                pathname: `/contestorders/${elem.contestName}`,
                                                            }}
                                                            state={{data: elem._id}}
                                                            // onClick={() => { participateUserToContest(elem) }}
                                                            >
                                                                <MDTypography color='warning' fontWeight='bold' fontSize={10}>VIEW ORDERS</MDTypography>
                                                            </MDButton>
                                                            {/* <DailyContestOrders elem={elem} /> */}
                                                        </MDBox>
                                                    </MDBox>
                                                </Grid>


                                            </Grid>
                                        </MDButton>

                                    </Grid>
                                )
                            })
                        }
                    </Grid>}
                    {renderSuccessSB}
            </MDBox>
        </>
    );
}

export default PastContest;