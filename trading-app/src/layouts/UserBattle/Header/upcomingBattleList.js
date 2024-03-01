import { React, useState, useEffect, useContext } from "react";
import { userContext } from '../../../AuthContext';
import { useNavigate, useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
import ShareIcon from '@mui/icons-material/Share';
import ReactGA from "react-ga";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import Button from '@mui/material/Button';
import ParticipantCount from './participantCount'

// Images
import Timer from '../timer'
import ProgressBar from "../progressBar";
import { Tooltip } from "@mui/material";
import MDSnackbar from "../../../components/MDSnackbar";
import Payment from "../data/payment"
import InfoIcon from '@mui/icons-material/Info';

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

function Header({ toggleContest, setToggleContest, battle, showPay, setShowPay, socket }) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    const [timeDifference, setTimeDifference] = useState([]);
    const getDetails = useContext(userContext);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        ReactGA.pageview(window.location.pathname)
      }, []);

    const handleCopy = async (id) => {
        let text = 'https://stoxhero.com/battles'
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        openSuccessSB('success', 'Link Copied', 'Share it with your friends');
        const res = await fetch(`${baseUrl}api/v1/battles/share/${id}`, {
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

    function changeDateFormat(givenDate) {

        const date = new Date(givenDate);

        // Convert the date to IST
        date.setHours(date.getHours());
        date.setMinutes(date.getMinutes());

        // Format the date as "dd Month yyyy | hh:mm AM/PM"
        const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()} | ${formatTime(date.getHours(), date.getMinutes())}`;

        // console.log(formattedDate);

        // Helper function to get the month name
        function getMonthName(month) {
            const monthNames = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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
            sx={{ borderLeft: `2px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRight: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRadius: "15px", width: "auto" }}
        />
    );

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    // console.log("timediffrence", timeDifference)

    return (
        <>
            <MDBox display='flex' justifyContent='center'>

                <>
                    <Grid container spacing={1} xs={12} md={12} lg={12}>
                        {
                            battle?.map((elem) => {
                                if (elem?.battleTemplate?.entryFee !== 0) {
                                
                                    let actualgst = (((elem?.battleTemplate?.entryFee)*(elem?.participants?.length))*elem?.battleTemplate?.gstPercentage)/100
                                    let expectedgst = (((elem?.battleTemplate?.entryFee)*(elem?.battleTemplate?.minParticipants))*elem?.battleTemplate?.gstPercentage)/100
                                    let actualCollection = (elem?.battleTemplate?.entryFee)*(elem?.participants?.length)
                                    let expectedCollection = (elem?.battleTemplate?.entryFee)*(elem?.battleTemplate?.minParticipants)
                                    let actualPlatformCommission = ((actualCollection-actualgst)*elem?.battleTemplate?.platformCommissionPercentage)/100
                                    let expectedPlatformCommission = ((expectedCollection-expectedgst)*elem?.battleTemplate?.platformCommissionPercentage)/100
                                    let actualPrizePool = actualCollection-actualgst-actualPlatformCommission
                                    let expectedPrizePool = expectedCollection-expectedgst-expectedPlatformCommission
                                    // contestOn.push(elem.contestExpiry.toUpperCase());

                                    let progressBar = elem?.participants?.length * 100 / elem?.maxParticipants
                                    // let timeDifference = new Date(elem?.contestStartTime) - new Date(serverTime);
                                    // let checkIsInterested = elem?.interestedUsers.some(elem => elem?.userId?._id?.toString() == getDetails?.userDetails?._id?.toString())

                                    // let isTradingEnable = new Date(elem?.contestEndTime) - serverTime;
                                    let particularBattleTime = timeDifference.filter((subelem) => {
                                        return subelem?.id?.toString() === elem?._id?.toString();
                                    })

                                    let isParticipated = elem?.participants.some(subelem => {
                                        return subelem?.userId?.toString() === getDetails?.userDetails?._id?.toString()
                                    })

                                    // console.log("timeDifference",timeDifference, isParticipated,  particularContestTime, checkIsInterested)
                                    return (
                                        <Grid item xs={12} md={6} lg={6} borderRadius={3}>
                                            <MDBox p={1} style={{ backgroundColor: "lightgrey", minWidth: '100%', borderRadius: '5px 5px 0px 0px' }} color={"#252525"} size="small">
                                                <Grid container display='flex' justifyContent='space-between' alignItems='center' minWidth='100%'>
                                                    <MDBox bgColor='lightgrey' minWidth='100%'>
                                                        <Grid item xs={3} md={2} lg={12} mb={0} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                                                            <Grid item xs={5} md={5} lg={7} display='flex' justifyContent='left'>
                                                                <MDBox display='flex' justifyContent='left' flexDirection='column'>
                                                                    <MDBox display='flex' justifyContent='left'><MDTypography color='black' fontSize={15} fontWeight='bold'>{elem?.battleName}</MDTypography></MDBox>
                                                                    <MDBox display='flex' justifyContent='left'><ParticipantCount battle={elem}/></MDBox>
                                                                </MDBox>
                                                            </Grid>
                                                            <Grid item xs={4} md={5} lg={5} ml={-0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                                {elem?.isNifty && <MDBox><MDTypography color='white' fontSize={12} ml={0.5} mr={0.5} fontWeight='bold' style={{ backgroundColor: "green", padding: '0px 5px 0px 5px', border: "1px solid green", borderRadius: '5px 5px 5px 5px' }}>{elem?.isNifty === true ? 'NIFTY' : ''}</MDTypography></MDBox>}
                                                                {elem?.isBankNifty && <MDBox><MDTypography color='black' fontSize={12} ml={0.5} mr={0.5} fontWeight='bold' style={{ backgroundColor: "lightyellow", padding: '0px 5px 0px 5px', border: "1px solid lightyellow", borderRadius: '5px 5px 5px 5px' }}>{elem?.isBankNifty === true ? 'BANKNIFTY' : ''}</MDTypography></MDBox>}
                                                                {elem?.isFinNifty && <MDBox><MDTypography color='white' fontSize={12} ml={0.5} mr={0.5} fontWeight='bold' style={{ backgroundColor: "orange", padding: '0px 5px 0px 5px', border: "1px solid orange", borderRadius: '5px 5px 5px 5px' }}>{elem?.isFinNifty === true ? 'FINNIFTY' : ''}</MDTypography></MDBox>}
                                                                {elem?.battleTemplate?.battleType && <MDBox><MDTypography color='white' fontSize={12} ml={0.5} mr={0.5} fontWeight='bold' style={{ backgroundColor: "red", padding: '0px 5px 0px 5px', border: "1px solid red", borderRadius: '5px 5px 5px 5px' }}>{elem?.battleTemplate?.battleType}</MDTypography></MDBox>}
                                                            </Grid>
                                                           
                                                        </Grid>

                                                    </MDBox>

                                                </Grid>
                                            </MDBox>
                                            <MDBox p={1} style={{ backgroundColor: "white", minWidth: '100%', borderRadius: '0px 0px 5px 5px' }} color={"#252525"}>

                                                <Grid xs={12} md={12} lg={12} pl={1} pr={1} pt={1} pb={.5} container display='flex' justifyContent='center' alignItems='center'>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-start' alignItems='center'>
                                                        <MDTypography style={{ color: 'grey' }} fontSize={12} fontWeight='bold'>Min. Participants</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-end' alignItems='center'>
                                                        <MDTypography style={{ color: 'grey' }} fontSize={12} fontWeight='bold'>Time Remaining</MDTypography>
                                                    </Grid>
                                                </Grid>

                                                <Grid xs={12} md={12} lg={12} pl={1} pr={1} container display='flex' justifyContent='center' alignItems='center'>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-start' alignItems='center'>
                                                        <MDTypography color='black' fontSize={12} fontWeight='bold'>{elem?.battleTemplate?.minParticipants}</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-end' alignItems='center'>
                                                        <Timer toggleContest={toggleContest} setToggleContest={setToggleContest} socket={socket} elem={elem} date={elem?.battleStartTime} id={elem?._id} setTimeDifference={setTimeDifference} />
                                                    </Grid>
                                                </Grid>

                                                <Grid xs={12} md={12} lg={12} pl={1} pr={1} pt={1} pb={.5} container display='flex' justifyContent='center' alignItems='center'>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-start' alignItems='center'>
                                                        <MDTypography style={{ color: 'grey' }} fontSize={12} fontWeight='bold'>Entries</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-end' alignItems='center'>
                                                        <MDTypography style={{ color: 'grey' }} fontSize={12} fontWeight='bold'>Winners Percentage</MDTypography>
                                                    </Grid>
                                                </Grid>

                                                <Grid xs={12} md={12} lg={12} pl={1} pr={1} container display='flex' justifyContent='center' alignItems='center'>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-start' alignItems='center'>
                                                        <MDTypography color='black' fontSize={12} fontWeight='bold'>{elem?.participants?.length}</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-end' alignItems='center'>
                                                        <MDTypography color='black' fontSize={12} fontWeight='bold'>{elem?.battleTemplate?.winnerPercentage}%</MDTypography>
                                                    </Grid>
                                                </Grid>

                                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                    <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                        <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                            <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold' color='success'>Reward Pool</MDTypography></MDBox>
                                                            <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold' sx={{ color: "#DBB670" }}>
                                                                ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.participants.length <= elem?.battleTemplate?.minParticipants ? expectedPrizePool : actualPrizePool)}
                                                            </MDTypography></MDBox>
                                                        </MDBox>
                                                    </MDBox>
                                                </Grid>

                                                <Grid xs={12} md={12} lg={12} pl={1} pr={1} pt={0.5} pb={.5} container display='flex' justifyContent='center' alignItems='center'>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-start' alignItems='center'>
                                                        <MDTypography style={{ color: 'grey' }} fontSize={12} fontWeight='bold'>Entry Fee</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-end' alignItems='center'>
                                                        <MDTypography style={{ color: 'grey' }} fontSize={12} fontWeight='bold'>Portfolio</MDTypography>
                                                    </Grid>
                                                </Grid>

                                                <Grid xs={12} md={12} lg={12} pl={1} pr={1} pb={.5} container display='flex' justifyContent='center' alignItems='center'>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-start' alignItems='center'>
                                                        <MDTypography color='black' fontSize={12} fontWeight='bold'>₹{elem?.battleTemplate?.entryFee}</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-end' alignItems='center'>
                                                        <MDTypography color='black' fontSize={12} fontWeight='bold'>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.battleTemplate?.portfolioValue)}</MDTypography>
                                                    </Grid>
                                                </Grid>

                                                <Grid xs={12} md={12} lg={12} pl={1} pr={1} pt={1} pb={0.5} container display='flex' justifyContent='center' alignItems='center'>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-start' alignItems='center'>
                                                        <MDTypography style={{ color: 'grey' }} fontSize={12} fontWeight='bold'>Start Time</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-end' alignItems='center'>
                                                        <MDTypography style={{ color: 'grey' }} fontSize={12} fontWeight='bold'>End Time</MDTypography>
                                                    </Grid>
                                                </Grid>

                                                <Grid xs={12} md={12} lg={12} pl={1} pr={1} pb={0.5} container display='flex' justifyContent='center' alignItems='center'>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-start' alignItems='center'>
                                                        <MDTypography color='black' fontSize={12} fontWeight='bold'>{changeDateFormat(elem.battleStartTime)}</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-end' alignItems='center'>
                                                        <MDTypography color='black' fontSize={12} fontWeight='bold'>{changeDateFormat(elem?.battleEndTime)}</MDTypography>
                                                    </Grid>
                                                </Grid>

                                                <Grid xs={12} md={12} lg={12} pl={1} pr={1} pb={.5} mt={0.5} mb={.5} container display='flex' justifyContent='space-around' alignItems='center'>
                                                    <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center' alignItems='center'>
                                                        <MDButton
                                                            style={{ minWidth: '95%', fontSize: 9 }}
                                                            size='small'
                                                            color='info'
                                                            fontSize={9}
                                                            onClick={() => {
                                                                navigate(`/battles/${elem?.battleName}/${elem?.battleStartTime.split('T')[0]}`, {
                                                                    state: { elem: elem, date: elem?.battleStartTime, id: elem?._id, whichTab: "Upcoming" }
                                                                })
                                                            }}
                                                        >
                                                            View
                                                        </MDButton>
                                                    </Grid>
                                                    <Grid item xs={3} md={3} lg={4} display='flex' justifyContent='center' alignItems='center'>
                                                        <MDButton style={{ minWidth: '95%', fontSize:9 }} size='small' color='warning' onClick={() => { handleCopy(elem?._id) }}>Share</MDButton>
                                                    </Grid>
                                                    <Grid item xs={3} md={3} lg={4} display='flex' justifyContent='center' alignItems='center'>
                                                        {isParticipated ?
                                                            // <PopupTrading elem={elem} timeDifference={particularBattleTime[0]?.value} />
                                                            <MDButton
                                                                // variant='outlined'
                                                                color={"success"}
                                                                size='small'
                                                                style={{minWidth:'95%', fontSize:9}}
                                                                disabled={(particularBattleTime[0]?.value) < 0 ? false : true}
                                                                onClick={() => {
                                                                    navigate(`/battles/${elem?.battleName}`, {
                                                                        state: { data: elem?._id, isNifty: elem?.isNifty, isBank: elem?.isBankNifty, isFin: elem.isFinNifty, timeDifference: timeDifference, name: elem?.battleName, battleEndTime: elem?.battleEndTime, entryFee: elem?.battleTemplate?.entryFee, portfolioValue: elem?.battleTemplate?.portfolioValue }
                                                                    });
                                                                }}
                                                            >
                                                                Start Trading
                                                            </MDButton>
                                                            :
                                                            <Payment elem={elem} showPay={showPay} setShowPay={setShowPay} timeDifference={particularBattleTime[0]?.value} />
                                                        }
                                                    </Grid>
                                                </Grid>

                                            </MDBox>

                                        </Grid>
                                    )
                                }
                            })
                        }
                    </Grid>
                </>
                {renderSuccessSB}
            </MDBox>
        </>
    );
}

export default Header;