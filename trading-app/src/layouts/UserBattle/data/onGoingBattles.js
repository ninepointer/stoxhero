import { React, useState, useEffect, useContext } from "react";
import axios from "axios";
import { userContext } from '../../../AuthContext';
import Grid from "@mui/material/Grid";
import ShareIcon from '@mui/icons-material/Share';
import ReactGA from "react-ga";
import moment from 'moment-timezone';

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

// Images
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import ContestCarousel from '../../../assets/images/target.png'
import WinnerImage from '../../../assets/images/cup-image.png'
import BattleCard from "../../../assets/images/battlecard.jpg"
import BattleIcon from "../../../assets/images/swords.png"
import Gift from "../../../assets/images/gift.png"


import Timer from '../timer'
import ProgressBar from "../progressBar";
import { HiUserGroup } from 'react-icons/hi';

import { Box, CircularProgress, Divider, Tooltip, Typography } from "@mui/material";
import MDSnackbar from "../../../components/MDSnackbar";
import { Link } from "react-router-dom";
import{apiUrl} from "../../../constants/constants"
import Payment from "./payments";

function Header({ contest, showPay, setShowPay, isInterested, setIsInterested }) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [timeDifference, setTimeDifference] = useState([]);
    const getDetails = useContext(userContext);
    const [serverTime, setServerTime] = useState();
    const [loading, setIsLoading] = useState(true);
    const [battles, setBattles] = useState([]);

    useEffect(() => {
        ReactGA.pageview(window.location.pathname)
      }, []);
    
    const getBattles = async() => {
        try{
            const res = await axios.get(`${apiUrl}battles/ongoing`, {withCredentials:true});
            console.log(res.data.data);
            setBattles(res.data.data);
        }catch(e){
            console.log(e);
        }
    }  
    useEffect(()=>{
        getBattles();
    },[]);  
    const handleCopy = async (id) => {
        let text = 'https://stoxhero.com/contest'
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        openSuccessSB('success', 'Link Copied', 'Share it with your friends');
        const res = await fetch(`${baseUrl}api/v1/dailycontest/contest/${id}/share`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
            })
        });
    };

    useEffect(() => {
        if (serverTime) {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        }
    }, [serverTime])

    useEffect(() => {
        axios.get(`${baseUrl}api/v1/servertime`)
            .then((res) => {
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
    const formatIndianNumber = num => (num.toString().length <= 3 ? num : num.toString().slice(0, num.toString().length - 3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ',' + num.toString().slice(num.toString().length - 3));

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
    const openSuccessSB = (value, title, content) => {
        if (value === "error") {
            messageObj.color = 'error'
            messageObj.icon = 'error'
            messageObj.title = "Error";
            messageObj.content = content;
        };

        if (value === "success") {
            messageObj.color = 'success'
            messageObj.icon = 'check'
            messageObj.title = title;
            messageObj.content = content;
        };

        setMessageObj(messageObj);
        setSuccessSB(true);
    }
    const closeSuccessSB = () => setSuccessSB(false);

    const renderSuccessSB = (
        <MDSnackbar
            color={messageObj.color}
            icon={messageObj.icon}
            title={messageObj.title}
            content={messageObj.content}
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite="info"
            sx={{ borderLeft: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRight: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRadius: "15px", width: "auto" }}
        />
    );

    return (
        <>
            <MDBox p={0.5} width='100%' display='flex' justifyContent='center'>
                <Grid container spacing={1} display='flex' justifyContent='center' alignItems='center' xs={12} md={12} lg={12}>
                {battles?.map((battle)=>{
                    return(
                        <Grid item xs={12} md={6} lg={4} key={battle?._id}>
                        <MDBox bgColor='light' borderRadius={5} display='flex' justifyContent='center'>
                            <Grid container p={1} spacing={1} xs={12} md={6} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                <Grid item xs={2} md={3} lg={2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                    <img src={BattleIcon} width='35px' height='35px' />
                                </Grid>
                                <Grid item xs={10} md={3} lg={10} display='flex' justifyContent='flex-end' flexDirection='column' alignContent='center' alignItems='center'>
                                    <MDBox width='100%'>
                                        <MDBox display='flex' justifyContent='flex-end'><MDTypography fontSize={18} fontWeight='bold'>{battle?.battleName}</MDTypography></MDBox>
                                        <MDBox display='flex' justifyContent='flex-end'><MDTypography fontSize={10} fontWeight='bold'>Starts: {moment(battle?.battleStartTime).tz('Asia/Kolkata').format('DD MMM YYYY | hh:mm A')}</MDTypography></MDBox>
                                        <MDBox display='flex' justifyContent='flex-end'><MDTypography fontSize={10} fontWeight='bold'>Ends: {moment(battle?.battleEndTime).tz('Asia/Kolkata').format('DD MMM YYYY | hh:mm A')}</MDTypography></MDBox>
                                    </MDBox>
                                </Grid>
                                <Grid item xs={2} md={3} lg={2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                    {/* <img src={BattleIcon} width='35px' height='35px' /> */}
                                </Grid>
                                <Grid item xs={10} md={3} lg={10} display='flex' justifyContent='flex-end' alignContent='center' flexDirection='column' alignItems='center'>
                                    <MDBox width='100%' display='flex' flexDirection='column'>
                                        <MDBox display='flex' justifyContent='flex-end' alignItems='center'>
                                            {battle?.isNifty && <MDTypography mr={0.25} fontSize={10} style={{backgroundColor: '#fb8c00' ,padding: '1px 1px 0px 1px', border: "1px solid #fb8c00", borderRadius: '2px', alignItems: 'center', color:'white' }} fontWeight='bold' color='dark'>NIFTY</MDTypography>}
                                            {battle?.isBankNifty && <MDTypography mr={0.25} fontSize={10} style={{backgroundColor: '#fb8c00' , padding: '1px 1px 0px 1px', border: "1px solid #fb8c00", borderRadius: '2px', alignItems: 'center', color:'white' }} fontWeight='bold' color='dark'>BANKNIFTY</MDTypography>}
                                            {battle?.isFinNifty && <MDTypography fontSize={10} style={{backgroundColor: '#fb8c00' , padding: '1px 1px 0px 1px', border: "1px solid #fb8c00", borderRadius: '2px', alignItems: 'center', color:'white' }} fontWeight='bold' color='dark'>FINNIFTY</MDTypography>}
                                        </MDBox>
                                    </MDBox>
                                </Grid>
                                <Grid mt={1} item xs={12} md={3} lg={12} display='flex' justifyContent='flex-end' alignContent='center' flexDirection='column' alignItems='center'>
                                    <MDBox width='100%' display='flex' flexDirection='column'>
                                        <MDBox display='flex' justifyContent='center' alignItems='center'>
                                            <img src={Gift} width='65px' height='65px' />
                                        </MDBox>
                                    </MDBox>
                                </Grid>
                                <Grid mt={1} item xs={12} md={3} lg={12} display='flex' justifyContent='flex-end' alignContent='center' flexDirection='column' alignItems='center'>
                                    <MDBox display='flex' justifyContent='center' width='100%'>       
                                        <MDTypography fontSize={15} fontWeight='bold'>Reward Pool Worth ₹{formatIndianNumber(battle?.rewards?.reduce((acc,curr)=>acc+curr.prizeValue,0))}/-</MDTypography>
                                    </MDBox>
                                </Grid>
                                <Grid item mt={0.5} xs={12} md={12} lg={12} display="flex" justifyContent="space-between" alignItems="center" alignContent="center">
                                    <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
                                        <MDBox color={"#DBB670"}><MDTypography fontSize={10} style={{ backgroundColor: 'black', color: "black", padding: '2px 2px 1px 2px', border: '1px solid black', borderRadius: '2px', alignItems: 'center', color:'white' }} fontWeight='bold' color='light'>Entry Fee : ₹{battle?.entryFee}</MDTypography></MDBox>
                                    </MDBox>

                                    <MDBox color="light" fontSize={10} display="flex" justifyContent="center" alignItems='center'>
                                        <MDBox color={"#DBB670"}><MDTypography fontSize={10} style={{ backgroundColor: 'black', color: "black", padding: '2px 2px 1px 2px', border: '1px solid black', borderRadius: '2px', alignItems: 'center', color:'white' }} fontWeight='bold' color='light'>Portfolio: ₹{battle?.portfolio?.portfolioValue}</MDTypography></MDBox>
                                    </MDBox>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                    <MDBox display='flex' justifyContent='center' sx={{ width: '100%' }}>
                                        <ProgressBar />
                                    </MDBox>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} mt={0.5}>
                                    <MDBox display="flex" justifyContent="space-between">
                                        <MDBox color="light" fontSize={10}>
                                            <MDBox color={"dark"} style={{ marginLeft: 3, marginTop: 3, fontWeight: 700 }}>REWARD TYPE: {battle?.rewardType}</MDBox>
                                        </MDBox>
                                        <MDBox color="light" fontSize={10}>
                                            <MDBox color={"dark"} style={{ marginLeft: 3, marginTop: 3, fontWeight: 700 }}>MIN. PARTICIPANTS:{battle?.minParticipants}</MDBox>
                                        </MDBox>
                                    </MDBox>
                                </Grid>
                                <Grid item xs={12} md={3} lg={12} display='flex' justifyContent='space-between' alignContent='center' flexDirection='row' alignItems='center'>
                                    <MDBox>
                                        <Payment elem={battle} />
                                        {/* <MDButton size='small' color='success'>Book Now</MDButton> */}
                                    </MDBox>
                                    <MDBox><MDButton size='small' color='success'>View Details</MDButton></MDBox>
                                </Grid>
                                
                            </Grid>
                            
                        </MDBox>
                    </Grid>
                    )
                })}
                {battles?.length == 0 && 
                    <MDBox>
                        <Grid container spacing={1} mt ={2} display='flex' justifyContent='center' alignItems='center' xs={12} md={12} lg={12}>
                            <MDBox sx={{border:'1px solid white', width: '70vw', height:'40vh', display:'flex', justifyContent:'center', alignItems:'center', borderRadius:'12px'}}>
                                <MDTypography color='white'>No ongoing Battles.</MDTypography>
                            </MDBox>
                        </Grid>
                    </MDBox>
                 }
                </Grid>
                {renderSuccessSB}
            </MDBox>
        </>
    );
}

export default Header;













