import { React, useState, useEffect, useContext, useCallback, useMemo } from "react";
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

// Images
import MDButton from "../../../components/MDButton";
import MDAvatar from "../../../components/MDAvatar";
import MDTypography from "../../../components/MDTypography";
// import AMargin from '../../../assets/images/amargin.png'
import DefaultProfilePic from "../../../assets/images/default-profile.png";

import logo from '../../../assets/images/logo1.jpeg'
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { CircularProgress, Divider } from "@mui/material";
import { userContext } from "../../../AuthContext";
import axios from "axios";
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';



function Leaderboard({ socket, name, id, data}) {

    const [leaderboard, setLeaderboard] = useState([]);
    const [myRank, setMyRankData] = useState();
    const [myPnl, setMyPnl] = useState();
    const getDetails = useContext(userContext);
    // const [reward, setReward] = useState([]);
    // let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    console.log('received data',data);

    const [loading, setIsLoading] = useState(true);

    useEffect(() => {
        socket?.on(`contest-leaderboardData${id}`, (data) => {

            console.log("leaderboard", data)
            setLeaderboard(data);
            setIsLoading(false);
        })

        socket?.on(`contest-myrank${getDetails.userDetails?._id}${id}`, (data) => {

            console.log("leaderboard rank", data)
            setMyRankData((prev) => (data !== null ? data : prev));
            setIsLoading(false);

        })

    }, [])

    useEffect(()=>{
        leaderboard.map((elem, index)=>{
            if(myRank === index+1){
                setMyPnl(elem?.npnl);
            }
        })
    }, [leaderboard, myRank])

    let myReward;
    if(data?.allData?.payoutType === "Percentage"){
        let payoutCap;
        if(data?.allData?.entryFee > 0){
            payoutCap = data?.allData?.entryFee * data?.allData?.payoutCapPercentage/100;
        } else{
            payoutCap = data?.allData?.portfolio?.portfolioValue * data?.allData?.payoutCapPercentage/100;
        }
        myReward = Math.min(payoutCap, (myPnl*data?.allData?.payoutPercentage/100>0?myPnl*data?.allData?.payoutPercentage/100:0)) ;
    } else{
        const rewards = data?.allData?.rewards;
        for(let elem of rewards){
            if(Number(myRank) >= Number(elem.rankStart) && Number(myRank) <= Number(elem.rankEnd)){
                myReward = elem.prize;
            }else{
                myReward = "+₹" + "0.00";
            }
        }
    }

    console.log("data?.allData", data?.allData)


    return (
        <>
            {loading ?
                <MDBox display="flex" flexDirection='column' justifyContent="center" alignItems="center">
                    <MDBox ml={1} display="flex" justifyContent="center" alignItems="center"><CircularProgress color="black" /></MDBox>
                    <MDBox display="flex" justifyContent="center" alignItems="center"><MDTypography fontSize={15} fontWeight='bold' color='black'>Loading Contest Leaderboard</MDTypography></MDBox>
                </MDBox>
                :
                <MDBox color="black" mt={0} mb={0} borderRadius={10} minHeight='auto'>
                    <MDBox display='flex' p={0} borderRadius={10}>
                        <MDBox width='100%' minHeight='auto' display='flex' justifyContent='center'>

                            <Grid container spacing={0.5} xs={12} md={12} lg={12}>


                                <Grid item xs={12} lg={12} mt={2}>

                                    <Grid item xs={12} lg={12}>

                                        <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                            <Grid item xs={12} lg={2} display='flex' justifyContent='center' alignItems='center'>
                                                <MDAvatar
                                                    src={logo}
                                                    alt="Profile"
                                                    size="sm"
                                                    sx={({ borders: { borderWidth }, palette: { white } }) => ({
                                                        border: `${borderWidth[2]} solid ${white.main}`,
                                                        cursor: "pointer",
                                                        position: "relative",
                                                        ml: 0,

                                                        "&:hover, &:focus": {
                                                            zIndex: "10",
                                                        },
                                                    })}
                                                />
                                            </Grid>
                                            <Grid item xs={12} lg={12} display='flex' justifyContent='left' alignItems='center'>
                                                <MDTypography fontSize={15} color='black' fontWeight='bold'>StoxHero {name} Contest Leaderboard</MDTypography>
                                            </Grid>
                                            <Grid item xs={12} lg={4} display='flex' justifyContent='right' alignItems='center' gap={1} mr={1}>
                                                <MDBox><MDTypography fontSize={15} color='#000000' backgroundColor='#000000' fontWeight='bold' style={{ cursor: 'pointer', borderRadius: "5px" }}><MDButton variant='text' size='small' onClick={() => window.open('https://instagram.com/stoxhero_official?igshid=MzRlODBiNWFlZA==', '_blank')}><InstagramIcon /></MDButton></MDTypography></MDBox>
                                                <MDBox><MDTypography fontSize={15} color='#000000' backgroundColor='#000000' fontWeight='bold' style={{ cursor: 'pointer', borderRadius: "5px" }}><MDButton variant='text' size='small' onClick={() => window.open('https://www.facebook.com/profile.php?id=100091564856087&mibextid=ZbWKwL', '_blank')}><FacebookIcon /></MDButton></MDTypography></MDBox>
                                                <MDBox><MDTypography fontSize={15} color='#000000' backgroundColor='#000000' fontWeight='bold' style={{ cursor: 'pointer', borderRadius: "5px" }}><MDButton variant='text' size='small' onClick={() => window.open('https://chat.whatsapp.com/CbRHo9BP3SO5fIHI2nM6jq', '_blank')}><WhatsAppIcon /></MDButton></MDTypography></MDBox>
                                                <MDBox><MDTypography fontSize={15} color='#000000' backgroundColor='#000000' fontWeight='bold' style={{ cursor: 'pointer', borderRadius: "5px" }}><MDButton variant='text' size='small' onClick={() => window.open('https://t.me/stoxhero_official', '_blank')}><TelegramIcon /></MDButton></MDTypography></MDBox>

                                            </Grid>

                                        </Grid>

                                        <Divider style={{ backgroundColor: 'black' }} />
                                    </Grid>

                                </Grid>

                                {leaderboard?.length !== 0 ?
                                    <Grid item xs={12} lg={12} mb={-2}>

                                        <Grid container xs={12} lg={12} pb={0.5} pt={0.5} display='flex' justifyContent='center' alignItems='center' >

                                            <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                                <MDBox><MDTypography fontSize={15} color='black' fontWeight='bold'>Rank</MDTypography></MDBox>
                                            </Grid>

                                            <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                                <MDBox><MDTypography fontSize={15} color='black' fontWeight='bold'>Image</MDTypography></MDBox>
                                            </Grid>

                                            <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                                <MDBox><MDTypography fontSize={15} color='black' fontWeight='bold'>Name</MDTypography></MDBox>
                                            </Grid>

                                            <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                                <MDBox><MDTypography fontSize={15} color='black' fontWeight='bold'>Net P&L</MDTypography></MDBox>
                                            </Grid>

                                            <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                                <MDBox><MDTypography fontSize={15} color='black' fontWeight='bold'>Reward</MDTypography></MDBox>
                                            </Grid>

                                        </Grid>

                                        <Divider style={{ backgroundColor: 'black' }} />

                                        <Grid container xs={12} lg={12} pb={2} pt={2} display='flex' justifyContent='center' alignItems='center' style={{ backgroundColor: '#524632' }}>

                                            <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                                <MDBox><MDTypography fontSize={25} color='light' fontWeight='bold'>{myRank ? `#${myRank}` : `-`}</MDTypography></MDBox>
                                            </Grid>

                                            <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>

                                                {/* <MDBox display='flex' justifyContent='flex-start'><img src={AMargin} width='40px' height='40px' /></MDBox> */}
                                                <MDAvatar
                                                    src={getDetails?.userDetails?.profilePhoto?.url ? getDetails?.userDetails?.profilePhoto?.url : DefaultProfilePic}
                                                    alt="Profile"
                                                    size="sm"
                                                    sx={({ borders: { borderWidth }, palette: { white } }) => ({
                                                        border: `${borderWidth[2]} solid ${white.main}`,
                                                        cursor: "pointer",
                                                        position: "relative",
                                                        ml: 0,

                                                        "&:hover, &:focus": {
                                                            zIndex: "10",
                                                        },
                                                    })}
                                                />

                                            </Grid>

                                            <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                                <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold'>You</MDTypography></MDBox>
                                            </Grid>

                                            <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                                <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold'>{myPnl ? (myPnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(myPnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-myPnl))  : "-"}</MDTypography></MDBox>
                                            </Grid>

                                            <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                                <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold'>{myReward ? (myReward) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(myReward)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(-myReward)) : myRank ? "+₹0.00" : "-"}</MDTypography></MDBox>
                                            </Grid>

                                        </Grid>

                                        <Divider style={{ backgroundColor: 'grey' }} />

                                        {leaderboard?.map((elem, index) => {

                                            // let myReward = elem?.npnl * data?.allData?.payoutPercentage/100>0?elem?.npnl * data?.allData?.payoutPercentage/100:0;

                                            let myReward;
                                            if(data?.allData?.payoutType === "Percentage"){
                                                let payoutCap;
                                                if(data?.allData?.entryFee > 0){
                                                    payoutCap = data?.allData?.entryFee * data?.allData?.payoutCapPercentage/100;
                                                } else{
                                                    payoutCap = data?.allData?.portfolio?.portfolioValue * data?.allData?.payoutCapPercentage/100;
                                                }
                                                myReward = Math.min(payoutCap, (elem?.npnl * data?.allData?.payoutPercentage/100>0?elem?.npnl * data?.allData?.payoutPercentage/100:0));
                                            } else{
                                                const rewards = data?.allData?.rewards;
                                                for(let subelem of rewards){
                                                    if(Number(index+1) >= Number(subelem.rankStart) && Number(index+1) <= Number(subelem.rankEnd)){
                                                        myReward = subelem.prize;
                                                    }
                                                }
                                            }
                                            return (
                                                <div key={elem?.name}>
                                                    <Grid container xs={12} lg={12} display='flex' justifyContent='center' alignItems='center' border={(myRank == index + 1) && "1px solid black"}>

                                                        <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                                            <MDBox><MDTypography fontSize={25} color='black' fontWeight='bold'>#{index + 1}</MDTypography></MDBox>
                                                        </Grid>

                                                        <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>

                                                            {/* <MDBox display='flex' justifyContent='flex-start'><img src={AMargin} width='40px' height='40px' /></MDBox> */}
                                                            <MDAvatar
                                                                src={elem?.photo ? elem?.photo : DefaultProfilePic}
                                                                alt="Profile"
                                                                size="sm"
                                                                sx={({ borders: { borderWidth }, palette: { white } }) => ({
                                                                    border: `${borderWidth[2]} solid ${white.main}`,
                                                                    cursor: "pointer",
                                                                    position: "relative",
                                                                    ml: 0,

                                                                    "&:hover, &:focus": {
                                                                        zIndex: "10",
                                                                    },
                                                                })}
                                                            />

                                                        </Grid>

                                                        <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                                            <MDBox><MDTypography fontSize={15} color='black' fontWeight='bold'>{elem?.userName}</MDTypography></MDBox>
                                                        </Grid>

                                                        <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                                            <MDBox><MDTypography fontSize={15} color='black' fontWeight='bold'>{(elem?.npnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(elem?.npnl))) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(elem?.npnl)))}</MDTypography></MDBox>
                                                        </Grid>

                                                        <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                                            <MDBox><MDTypography fontSize={15} color='black' fontWeight='bold'>{(myReward) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(myReward))) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(myReward)))}</MDTypography></MDBox>
                                                        </Grid>

                                                    </Grid>

                                                    <Divider style={{ backgroundColor: 'white' }} />
                                                </div>
                                            )
                                        })}

                                    </Grid>

                                    :

                                    <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center'>
                                        <MDBox mb={2}><MDTypography fontSize={15} color='black' fontWeight='bold' style={{ cursor: 'pointer' }}>The Contest Leaderboard will be displayed here!</MDTypography></MDBox>
                                    </Grid>

                                }

                            </Grid>

                        </MDBox>
                    </MDBox>
                </MDBox>
            }
        </>
    );
}

export default Leaderboard;
