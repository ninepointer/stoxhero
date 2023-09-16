import { React, useState, useEffect, useContext } from "react";
import axios from "axios";
// import { userContext } from '../../../AuthContext';
import moment from 'moment'
import { useNavigate, useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import realtrading from '../../../assets/images/realtrading.png'
// import WinnerImage from '../../../assets/images/cup-image.png'

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

// Images
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import MDSnackbar from "../../../components/MDSnackbar";
import { apiUrl } from '../../../constants/constants';
import Payment from "./payment";
import { userContext } from "../../../AuthContext";
import { CircularProgress } from "@mui/material";



function Header() {
    const location = useLocation();
    const [battleDetails, setBattleDetails] = useState({});
    const id = location?.state?.id;
    const [state, setState] = useState(location?.state?.elem)
    // let state = ;
    const [whichTab, setWhichTab] = useState(location?.state?.whichTab)
    // let whichTab = ;
    const getDetails = useContext(userContext);
    let [showPay, setShowPay] = useState(true)
    const [prizeDetail, setPrizeDetail] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    console.log("isLoading", state)
    const getBattleDetails = async (name, date) => {
        try {
            const res = await axios.get(`${apiUrl}battles/findbyname?name=${name}&date=${date}`, { withCredentials: true });
            setBattleDetails(res?.data?.data);
            setState(res?.data?.data)
            setWhichTab(res?.data?.data?.battleStatus);

            console.log("state, tab", state, whichTab)
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (!id) {
            const url = location?.pathname?.split('/');
            const name = decodeURIComponent(url[2]);
            const date = url[3];
            getBattleDetails(name, date);
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 1000)
    }, [id, location]);

    useEffect(() => {
        if(id || battleDetails?._id)
        prizeDetailFunc();
    }, [id, battleDetails]);

    async function prizeDetailFunc() {
        const res = await axios.get(`${apiUrl}battles/prizedetail/${id ? id : battleDetails?._id}`, { withCredentials: true });
        console.log(res)
        setPrizeDetail(res.data.data.prizeDistribution)

    }

    const elem = {};
    const handleCopy = async (id) => {
        let text = `https://stoxhero.com${location?.pathname}`
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        openSuccessSB('success', 'Link Copied', 'Share it with your friends');
        const res = await fetch(`${apiUrl}battles/share/${id}`, {
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
    const navigate = useNavigate();

    let isParticipated;
    if (whichTab !== "Completed") {
        isParticipated = state?.participants.some(subelem => {
            return subelem?.userId?.toString() === getDetails?.userDetails?._id?.toString()
        })
        console.log("isLoading", isParticipated, state, whichTab)
    }
    
    return (
        <Grid xs={12} md={12} lg={12} mt={2} container spacing={1} display='flex' flexDirection='row' alignItems='start'>
            {!isLoading ?
                <>
                    <Grid xs={12} md={12} lg={8} item>

                        <Grid item xs={12} md={12} lg={12} borderRadius={3}>
                            <MDBox p={1} style={{ backgroundColor: "white", minWidth: '100%', borderRadius: '5px 5px 0px 0px' }} color={"#252525"} size="small">
                                <Grid container display='flex' justifyContent='space-between' alignItems='center' minWidth='100%'>
                                    <MDBox bgColor='white' minWidth='100%'>
                                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                                <MDBox p={1} display='flex' justifyContent='flex-start' alignItems='center'>
                                                    <img src={realtrading} width='100px' height='100px' />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                                <MDBox p={1} display='flex' justifyContent='flex-start' alignItems='center'>
                                                    <MDTypography color='white' fontSize={15} fontWeight='bold' style={{ padding: 4, backgroundColor: '#1A73E8', borderRadius: 3, textAlign: 'center' }}>
                                                        Introducing Battle: Start your investment learning journey with Battles 
                                                    </MDTypography>
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{ textAlign: 'center' }}>
                                                        We've designed this innovative trading experience to bridge the gap between learning and real-world trading, allowing you to get as close to the market as possible.
                                                    </MDTypography>
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{ padding: 4, backgroundColor: 'lightgrey', borderRadius: 3 }}>
                                                        What is Battle?
                                                    </MDTypography>
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{ textAlign: 'center' }}>
                                                        In Battle, you won't just learn about trading; you'll experience it. Battle is designed to bridge the gap between learning and real-world trading, allowing you to get as close to the market as possible & also continue to make real profit using virtual currency. Your success in Battle depends on your ability to make informed decisions, manage risk, and seize opportunities – just like in the real trading world.
                                                    </MDTypography>
                                                </MDBox>
                                            </Grid>

                                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{ padding: 4, backgroundColor: 'lightgrey', borderRadius: 3 }}>
                                                        What is the Prize Pool of the Battle?
                                                    </MDTypography>
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{ textAlign: 'center' }}>
                                                        The intial prize pool is based on the minimum number of participants and it keep on increasing as more and more participants join the battle.
                                                    </MDTypography>
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{ padding: 4, backgroundColor: 'lightgrey', borderRadius: 3 }}>
                                                        Here's how it works:
                                                    </MDTypography>
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{ textAlign: 'center' }}>
                                                        Rewards on Your Investment: Based on the ranking system table displayed on the page, you will recieve a reward as per you rank in the battle.
                                                    </MDTypography>
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{ padding: 4, backgroundColor: 'lightgrey', borderRadius: 3, textAlign: 'center' }}>
                                                        Safety Net: If you end up with the top certain percentage of the participants, your will not loose the major chunk of your invested amount.
                                                    </MDTypography>
                                                </MDBox>
                                            </Grid>

                                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{ padding: 4, backgroundColor: 'lightgrey', borderRadius: 3 }}>
                                                        When will I receive my reward in my wallet?
                                                    </MDTypography>
                                                </MDBox>
                                            </Grid>

                                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                                <MDBox p={1} display='flex' justifyContent='center' alignItems='center'>
                                                    <MDTypography color='black' fontSize={15} fontWeight='bold' style={{ textAlign: 'center' }}>
                                                        You recieve the reward in your wallet as soon as the market closes for that day i.e after 3:30 PM
                                                    </MDTypography>
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </MDBox>

                                </Grid>
                            </MDBox>
                        </Grid>

                    </Grid>

                    <Grid xs={12} md={12} lg={4} item>

                        <Grid item xs={12} md={12} lg={12} borderRadius={3}>
                            <MDBox p={1} style={{ backgroundColor: "white", minWidth: '100%', borderRadius: '5px 5px 0px 0px' }} color={"#252525"} size="small">
                                <Grid container display='flex' justifyContent='space-between' alignItems='center' minWidth='100%'>
                                    <MDBox bgColor='white' minWidth='100%'>
                                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' border='2px solid grey'>
                                                <MDBox bgColor='orange' p={0.5} display='flex' justifyContent='center' alignItems='center' minWidth='100%'>
                                                    <MDTypography color='black' fontSize={15} fontWeight='bold'>Battle Details</MDTypography>
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                    <MDBox bgColor='white' minWidth='100%'>
                                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                    <MDTypography color='black' fontSize={10} fontWeight='bold'>Battle Name</MDTypography>
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                    <MDTypography color='black' fontSize={10} fontWeight='bold'>{whichTab !== "Completed" ? state?.battleName : state?.battleName}</MDTypography>
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                    <MDBox bgColor='white' minWidth='100%'>
                                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                    <MDTypography color='black' fontSize={10} fontWeight='bold'>Start Time</MDTypography>
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                    <MDTypography color='black' fontSize={10} fontWeight='bold'>{moment(state ? state?.battleStartTime : battleDetails?.battleStartTime).format('DD MMM YYYY HH:mm a').toString()}</MDTypography>
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                    <MDBox bgColor='white' minWidth='100%'>
                                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                    <MDTypography color='black' fontSize={10} fontWeight='bold'>End Time</MDTypography>
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                    <MDTypography color='black' fontSize={10} fontWeight='bold'>{moment(state ? state?.battleEndTime : battleDetails?.battleEndTime).format('DD MMM YYYY HH:mm a').toString()}</MDTypography>
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                    <MDBox bgColor='white' minWidth='100%'>
                                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                    <MDTypography color='black' fontSize={10} fontWeight='bold'>Min Participants</MDTypography>
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                    <MDTypography color='black' fontSize={10} fontWeight='bold'>{state ? state?.battleTemplate?.minParticipants : battleDetails?.battleTemplate?.minParticipants}</MDTypography>
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                    {whichTab !== "Completed" &&
                                        <MDBox bgColor='white' minWidth='100%'>
                                            <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                                                <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                    <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                        <MDTypography color='black' fontSize={10} fontWeight='bold'>Entries</MDTypography>
                                                    </MDBox>
                                                </Grid>
                                                <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                    <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                        <MDTypography color='black' fontSize={10} fontWeight='bold'>{state ? state?.participants?.length : battleDetails?.participants?.length}</MDTypography>
                                                    </MDBox>
                                                </Grid>
                                            </Grid>
                                        </MDBox>}
                                    <MDBox bgColor='white' minWidth='100%'>
                                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                    <MDTypography color='black' fontSize={10} fontWeight='bold'>Portfolio Value</MDTypography>
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                    <MDTypography color='black' fontSize={10} fontWeight='bold'>
                                                        {/* {state ? ((whichTab !== "Completed") ? state?.battleTemplate?.portfolioValue : state?.portfolioValue) : battleDetails?.battleTemplate?.portfolioValue} */}
                                                        ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((state ? ((whichTab !== "Completed") ? state?.battleTemplate?.portfolioValue : state?.portfolioValue) : battleDetails?.battleTemplate?.portfolioValue))}
                                                    </MDTypography>
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                    <MDBox bgColor='white' minWidth='100%'>
                                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                    <MDTypography color='black' fontSize={10} fontWeight='bold'>Entry Fee</MDTypography>
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                    <MDTypography color='black' fontSize={10} fontWeight='bold'>
                                                        ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((state ? ((whichTab !== "Completed") ? state?.battleTemplate?.entryFee : state?.entryFee) : battleDetails?.battleTemplate?.entryFee))}
                                                    </MDTypography>
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                    {whichTab === "Completed" &&
                                        <>
                                            <MDBox bgColor='white' minWidth='100%'>
                                                <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                        <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                            <MDTypography color='black' fontSize={10} fontWeight='bold'>Payout</MDTypography>
                                                        </MDBox>
                                                    </Grid>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                        <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                            <MDTypography color='black' fontSize={10} fontWeight='bold'>{state?.return?.toFixed(2)}</MDTypography>
                                                        </MDBox>
                                                    </Grid>
                                                </Grid>
                                            </MDBox>
                                            <MDBox bgColor='white' minWidth='100%' mb={1}>
                                                <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                        <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                            <MDTypography color='black' fontSize={10} fontWeight='bold'>Payout %</MDTypography>
                                                        </MDBox>
                                                    </Grid>
                                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center' border='2px solid grey'>
                                                        <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                            <MDTypography color='black' fontSize={10} fontWeight='bold'>{(((state?.return.toFixed(2) - state?.entryFee) / state?.entryFee) * 100).toFixed(2)}%</MDTypography>
                                                        </MDBox>
                                                    </Grid>
                                                </Grid>
                                            </MDBox>
                                        </>}


                                    {/* <MDBox> */}
                                    <MDBox bgColor='white' minWidth='100%' mt={1}>
                                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' border='2px solid grey'>
                                                <MDBox bgColor='orange' p={0.5} display='flex' justifyContent='center' alignItems='center' minWidth='100%'>
                                                    <MDTypography color='black' fontSize={10} fontWeight='bold'>Reward Table</MDTypography>
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                    <MDBox bgColor='white' minWidth='100%'>
                                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                                            <Grid item xs={6} md={6} lg={4} display='flex' justifyContent='center' border='2px solid grey'>
                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                    <MDTypography color='black' fontSize={10} fontWeight='bold'>#</MDTypography>
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={6} md={6} lg={4} display='flex' justifyContent='center' border='2px solid grey'>
                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                    <MDTypography color='black' fontSize={10} fontWeight='bold'>Reward %</MDTypography>
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={6} md={6} lg={4} display='flex' justifyContent='center' border='2px solid grey'>
                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                    <MDTypography color='black' fontSize={10} fontWeight='bold'>Reward</MDTypography>
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                    {prizeDetail.map((elem) => {
                                        return (
                                            <>
                                                <MDBox bgColor='white' minWidth='100%'>
                                                    <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                                                        <Grid item xs={6} md={6} lg={4} display='flex' justifyContent='center' border='2px solid grey'>
                                                            <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                                <MDTypography color='black' fontSize={10} fontWeight='bold'>{elem?.rank}</MDTypography>
                                                            </MDBox>
                                                        </Grid>
                                                        <Grid item xs={6} md={6} lg={4} display='flex' justifyContent='center' border='2px solid grey'>
                                                            <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                                <MDTypography color='black' fontSize={10} fontWeight='bold'>{elem?.rewardPercentage?.toFixed(2)}%</MDTypography>
                                                            </MDBox>
                                                        </Grid>
                                                        <Grid item xs={6} md={6} lg={4} display='flex' justifyContent='center' border='2px solid grey'>
                                                            <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center'>
                                                                <MDTypography color='black' fontSize={10} fontWeight='bold'>
                                                                    {/* {elem?.reward?.toFixed(2)} */}
                                                                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(elem?.reward)}
                                                                </MDTypography>
                                                            </MDBox>
                                                        </Grid>
                                                    </Grid>
                                                </MDBox>
                                            </>
                                        )
                                    })}



                                    {/* </MDBox> */}

                                    <MDBox bgColor='white' minWidth='100%'>
                                        <Grid item xs={12} md={12} lg={12} container display='flex' flexDirection='row' alignItems='center' minWidth='100%'>
                                            <Grid item xs={6} md={6} lg={12} display='flex' justifyContent='center' minWidth='100%'>
                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center' minWidth='100%'>
                                                    <MDButton size='small' variant='contained' color='warning' style={{ minWidth: '100%' }} onClick={() => { handleCopy(state ? state._id : battleDetails?._id) }}>Share with friends!</MDButton>
                                                </MDBox>
                                            </Grid>
                                            {whichTab !== "Completed" &&
                                                <>
                                                    {
                                                        isParticipated || !showPay ?
                                                            <Grid item xs={6} md={6} lg={12} display='flex' justifyContent='center' minWidth='100%'>
                                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center' minWidth='100%'>
                                                                    <MDButton
                                                                        size='small'
                                                                        variant='contained'
                                                                        color='secondary'
                                                                        style={{ minWidth: '100%' }}
                                                                        disabled={whichTab === "Upcoming"}
                                                                        onClick={() => {
                                                                            navigate(`/battles/${state?.battleName}`, {
                                                                                state: { data: state?._id, isNifty: state?.isNifty, isBank: state?.isBankNifty, isFin: state.isFinNifty, name: state?.battleName, endTime: state?.endTime, entryFee: state?.battleTemplate?.entryFee, portfolioValue: state?.battleTemplate?.portfolioValue }
                                                                            });
                                                                        }}
                                                                    >Start Trading</MDButton>
                                                                </MDBox>
                                                            </Grid> :
                                                            <Payment elem={state ? state : battleDetails} whichTab={"view"} showPay={showPay} setShowPay={setShowPay} />
                                                    }
                                                </>

                                            }
                                            <Grid item xs={6} md={6} lg={12} display='flex' justifyContent='center' minWidth='100%'>
                                                <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center' minWidth='100%'>
                                                    <MDButton
                                                        size='small'
                                                        variant='contained'
                                                        color='info'
                                                        style={{ minWidth: '100%' }}
                                                        onClick={() => { navigate('/battles') }}
                                                    >
                                                        Back to Battle Page
                                                    </MDButton>
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                    {renderSuccessSB}
                                </Grid>
                            </MDBox>
                        </Grid>
                    </Grid>
                </>
                :
                <>
                    <Grid container display="flex" justifyContent="center" alignContent='center' alignItems="center">
                        <Grid item display="flex" justifyContent="center" alignContent='center' alignItems="center" xs={12} md={12} lg={12}>
                            <MDBox mt={5} mb={5}>
                                <CircularProgress color="info" />
                            </MDBox>
                        </Grid>
                    </Grid>
                </>
            }

        </Grid>

    );
}

export default Header;
