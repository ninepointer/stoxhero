import { React, useState, useEffect, useContext } from "react";
import { userContext } from '../../../AuthContext';
import { useNavigate, useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
// import ShareIcon from '@mui/icons-material/Share';
import ReactGA from "react-ga"
import axios from "axios";
import { Link } from "react-router-dom";
import html2canvas from 'html2canvas';
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";

// Images
// import ContestCarousel from '../../../assets/images/target.png'
import WinnerImage from '../../../assets/images/roi.png'
import Timer from '../timer'
// import ProgressBar from "../progressBar";
// import { HiUserGroup } from 'react-icons/hi';
import { Tooltip } from "@mui/material";
import MDSnackbar from "../../../components/MDSnackbar";
// import PopupMessage from "../data/popupMessage";
// import PopupTrading from "../data/popupTrading";
// import Payment from "../data/payment"
// import InfoIcon from '@mui/icons-material/Info';
import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor';

function Header({ marginX }) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    // const [timeDifference, setTimeDifference] = useState([]);
    // const getDetails = useContext(userContext);
    const navigate = useNavigate();
    const [showDownloadButton, setShowDownloadButton] = useState(true);



    useEffect(() => {
        ReactGA.pageview(window.location.pathname)
    }, []);

    async function handleNavigate(id, name) {
        console.log("Details MarginX:", id, name)
        axios.get(`${baseUrl}api/v1/marginxtrade/${id}/my/allorders`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        })
            .then((res) => {
                if (res.data.count > 0) {
                    navigate(`/completedmarginxs/${name}`, {
                        state: { data: res.data.data }
                    });
                } else {
                    openSuccessSB("error", "You dont have any trade for this contest.")
                }
            }).catch((err) => {
                return new Error(err);
            })
    }

    // const handleCopy = async (id) => {
    //     let text = 'https://stoxhero.com/marginxs'
    //     const textarea = document.createElement('textarea');
    //     textarea.value = text;
    //     document.body.appendChild(textarea);
    //     textarea.select();
    //     document.execCommand('copy');
    //     document.body.removeChild(textarea);
    //     openSuccessSB('success', 'Link Copied', 'Share it with your friends');
    //     const res = await fetch(`${baseUrl}api/v1/marginx/${id}/share`, {
    //         method: "PUT",
    //         credentials: "include",
    //         headers: {
    //             "content-type": "application/json",
    //             "Access-Control-Allow-Credentials": true
    //         },
    //         body: JSON.stringify({
    //         })
    //     });
    // };

    const captureScreenshot = (id, name) => {
        const screenshotElement = document.getElementById(id);
        setTimeout(() => {
            setShowDownloadButton(false)
            html2canvas(screenshotElement)
                .then((canvas) => {
                    const link = document.createElement('a');
                    link.download = `${name}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    setShowDownloadButton(true)
                })
                .catch((error) => {
                    console.error('Error capturing screenshot:', error);
                    setShowDownloadButton(true)
                });
        }, 500)

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
            sx={{ borderLeft: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRight: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRadius: "15px", width: "auto" }}
        />
    );


    return (
        <>
            <MDBox display='flex' justifyContent='center'>

                <>
                    <Grid container spacing={1} xs={12} md={12} lg={12}>
                        {
                            marginX?.map((elem) => {
                                if (elem?.entryFee !== 0) {

                                    return (
                                        <Grid item xs={12} md={6} lg={4} borderRadius={3}>
                                            <MDBox id='screenshot-component2'>
                                                <MDBox p={1} style={{ backgroundColor: "lightgrey", minWidth: '100%', borderRadius: '5px 5px 0px 0px' }} color={"#252525"} size="small">
                                                    <Grid container display='flex' justifyContent='space-between' alignItems='center' minWidth='100%'>
                                                        <MDBox bgColor='lightgrey' minWidth='100%'>
                                                            <Grid item xs={3} md={2} lg={12} mb={1} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                                                                <Grid item xs={9} md={9} lg={9} display='flex' justifyContent='left'>
                                                                    <MDBox display='flex' justifyContent='flex-start' alignItems='center'>
                                                                        <MDTypography color='black' fontSize={15} fontWeight='bold'>{elem?.marginxName}</MDTypography>
                                                                    </MDBox>
                                                                </Grid>
                                                                <Grid item xs={3} md={3} lg={3} display='flex' justifyContent='right'>
                                                                    <MDBox display='flex' justifyContent='flex-end' alignItems='center'>
                                                                        {showDownloadButton && <MDButton
                                                                            color='info'
                                                                            // style={{padding:-2,margin:-2}} 
                                                                            size='small'
                                                                            varaint='outlined'
                                                                            onClick={() => { captureScreenshot('screenshot-component2', elem?.marginxName) }}
                                                                        >
                                                                            <Tooltip title={"Take Screenshot"} placement="top">
                                                                                <ScreenshotMonitorIcon color='blue' />
                                                                            </Tooltip>
                                                                        </MDButton>
                                                                        }
                                                                    </MDBox>
                                                                </Grid>
                                                            </Grid>


                                                            <Grid item xs={3} md={3} lg={12} ml={-0.5} display='flex' justifyContent='flex-start' alignItems='center'>
                                                                {elem?.isNifty && <MDBox><MDTypography color='white' fontSize={10} ml={0.5} mr={0.5} fontWeight='bold' style={{ backgroundColor: "green", padding: '0px 5px 0px 5px', border: "1px solid green", borderRadius: '5px 5px 5px 5px' }}>{elem?.isNifty === true ? 'NIFTY' : ''}</MDTypography></MDBox>}
                                                                {elem?.isBankNifty && <MDBox><MDTypography color='black' fontSize={10} ml={0.5} mr={0.5} fontWeight='bold' style={{ backgroundColor: "lightyellow", padding: '0px 5px 0px 5px', border: "1px solid lightyellow", borderRadius: '5px 5px 5px 5px' }}>{elem?.isBankNifty === true ? 'BANKNIFTY' : ''}</MDTypography></MDBox>}
                                                                {elem?.isFinNifty && <MDBox><MDTypography color='white' fontSize={10} ml={0.5} mr={0.5} fontWeight='bold' style={{ backgroundColor: "orange", padding: '0px 5px 0px 5px', border: "1px solid orange", borderRadius: '5px 5px 5px 5px' }}>{elem?.isFinNifty === true ? 'FINNIFTY' : ''}</MDTypography></MDBox>}
                                                                {elem?.marginxExpiry && <MDBox><MDTypography color='white' fontSize={10} ml={0.5} mr={0.5} fontWeight='bold' style={{ backgroundColor: "red", padding: '0px 5px 0px 5px', border: "1px solid red", borderRadius: '5px 5px 5px 5px' }}>{elem?.marginxExpiry}</MDTypography></MDBox>}
                                                            </Grid>
                                                        </MDBox>

                                                    </Grid>
                                                </MDBox>
                                                <MDBox p={1} style={{ backgroundColor: "white", minWidth: '100%', borderRadius: '0px 0px 5px 5px' }} color={"#252525"}>

                                                    <Grid xs={12} md={12} lg={12} pl={1} pr={1} pt={1} pb={.5} container display='flex' justifyContent='center' alignItems='center'>
                                                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-start' alignItems='center'>
                                                            <MDTypography style={{ color: 'grey' }} fontSize={12} fontWeight='bold'>Net P&L</MDTypography>
                                                        </Grid>
                                                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-end' alignItems='center'>
                                                            <MDTypography style={{ color: 'grey' }} fontSize={12} fontWeight='bold'>Net Earnings</MDTypography>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid xs={12} md={12} lg={12} pl={1} pr={1} container display='flex' justifyContent='center' alignItems='center'>
                                                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-start' alignItems='center'>
                                                            <MDTypography color='black' fontSize={10} fontWeight='bold'>{(elem?.npnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.npnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-elem?.npnl))}</MDTypography>
                                                        </Grid>
                                                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-end' alignItems='center'>
                                                            <MDTypography color='black' fontSize={10} fontWeight='bold'>{(elem?.return) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.return)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-elem?.return))}</MDTypography>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                        <img src={WinnerImage} width='60px' height='60px' />
                                                    </Grid>

                                                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                        <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                            <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                                                <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold' color='success'>Return</MDTypography></MDBox>
                                                                <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold' sx={{ color: "#DBB670" }}>% OF YOUR INVESTMENT</MDTypography></MDBox>
                                                            </MDBox>
                                                        </MDBox>
                                                    </Grid>

                                                    <Grid xs={12} md={12} lg={12} pl={1} pr={1} pt={1} pb={.5} container display='flex' justifyContent='center' alignItems='center'>
                                                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-start' alignItems='center'>
                                                            <MDTypography style={{ color: 'grey' }} fontSize={12} fontWeight='bold'>Start Time</MDTypography>
                                                        </Grid>
                                                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-end' alignItems='center'>
                                                            <MDTypography style={{ color: 'grey' }} fontSize={12} fontWeight='bold'>End Time</MDTypography>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid xs={12} md={12} lg={12} pl={1} pr={1} pb={.5} container display='flex' justifyContent='center' alignItems='center'>
                                                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-start' alignItems='center'>
                                                            <MDTypography color='black' fontSize={10} fontWeight='bold'>{changeDateFormat(elem.startTime)}</MDTypography>
                                                        </Grid>
                                                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-end' alignItems='center'>
                                                            <MDTypography color='black' fontSize={10} fontWeight='bold'>{changeDateFormat(elem.endTime)}</MDTypography>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid xs={12} md={12} lg={12} pl={1} pr={1} pt={0.5} pb={.5} container display='flex' justifyContent='center' alignItems='center'>
                                                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-start' alignItems='center'>
                                                            <MDTypography style={{ color: 'grey' }} fontSize={12} fontWeight='bold'>Investment</MDTypography>
                                                        </Grid>
                                                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-end' alignItems='center'>
                                                            <MDTypography style={{ color: 'grey' }} fontSize={12} fontWeight='bold'>Portfolio</MDTypography>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid xs={12} md={12} lg={12} pl={1} pr={1} pb={.5} container display='flex' justifyContent='center' alignItems='center'>
                                                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-start' alignItems='center'>
                                                            <MDTypography color='black' fontSize={10} fontWeight='bold'>₹{elem?.entryFee}</MDTypography>
                                                        </Grid>
                                                        <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='flex-end' alignItems='center'>
                                                            <MDTypography color='black' fontSize={10} fontWeight='bold'>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.portfolioValue)}</MDTypography>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid xs={12} md={12} lg={12} pl={1} pr={1} pb={.5} mt={0.5} mb={.5} container display='flex' justifyContent='space-around' alignItems='center'>
                                                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center' alignItems='center'>
                                                            <MDButton
                                                                style={{ minWidth: '95%', fontSize: 10 }}
                                                                size='small'
                                                                color='info'
                                                                onClick={() => {
                                                                    navigate(`/marginxs/${elem?.marginxName}/${elem?.startTime.split('T')[0]}`, {
                                                                        state: { elem: elem, date: elem?.startTime, id: elem?.marginxId, whichTab: "Completed" }
                                                                    })
                                                                }}
                                                            >
                                                                View
                                                            </MDButton>
                                                        </Grid>
                                                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center' alignItems='center'>
                                                            <MDButton style={{ minWidth: '95%', fontSize: 10 }} size='small' color='warning'>Share P&L</MDButton>
                                                        </Grid>
                                                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center' alignItems='center'>
                                                            <MDButton
                                                                style={{ minWidth: '95%', fontSize: 10 }}
                                                                size='small'
                                                                color='success'
                                                                component={Link}
                                                                onClick={() => { handleNavigate(elem?.marginxId, elem?.marginxName) }}
                                                            >
                                                                Orders
                                                            </MDButton>
                                                        </Grid>
                                                    </Grid>

                                                </MDBox>
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