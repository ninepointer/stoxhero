import { React, useState, useEffect, useContext, useCallback, useMemo } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import moment from 'moment'


// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

// Images
import MDButton from "../../../components/MDButton";
import MDAvatar from "../../../components/MDAvatar";
import MDTypography from "../../../components/MDTypography";
import AMargin from '../../../assets/images/amargin.png'
import DefaultProfilePic from "../../../assets/images/default-profile.png";

import logo from '../../../assets/images/logo1.jpeg'
import Profit from '../../../assets/images/profit.png'
import Tcost from '../../../assets/images/tcost.png'
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { CircularProgress, Divider } from "@mui/material";



function Leaderboard({socket, name}) {

    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setIsLoading] = useState(true);

    useEffect(()=>{
        socket?.on("contest-leaderboardData", (data) => {

            setLeaderboard(data)
            setIsLoading(false);
          // marketDetails.setMarketData(prevInstruments => {
          //   const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
          //   data.forEach(instrument => {
          //     instrumentMap.set(instrument.instrument_token, instrument);
          //   });
          //   return Array.from(instrumentMap.values());
          // });
          console.log("this is leaderboard data", data)
        })
    
      }, [])

    return (
        <>
            {loading ?
                <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
                    <CircularProgress color="light" />
                </MDBox>
                :
                <MDBox color="light" mt={0} mb={0} borderRadius={10} minHeight='auto'>
                    <MDBox display='flex' p={0} borderRadius={10}>
                        <MDBox width='100%' minHeight='auto' display='flex' justifyContent='center'>

                            <Grid container spacing={0.5} xs={12} md={12} lg={12}>

                                <Grid item lg={12} mt={2}>

                                    <Grid item lg={12}>

                                        <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems='center'>


                                            <Grid item lg={2} display='flex' justifyContent='center' alignItems='center'>
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
                                            <Grid item lg={6} display='flex' justifyContent='left' alignItems='center'>
                                                <MDTypography fontSize={15} color='light' fontWeight='bold'>StoxHero {name} Contest Leaderboard</MDTypography>
                                            </Grid>
                                            <Grid item lg={4} display='flex' justifyContent='right' alignItems='center'>
                                                <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold' style={{ cursor: 'pointer' }}><MDButton variant='text' size='small'><TwitterIcon /></MDButton></MDTypography></MDBox>
                                                <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold' style={{ cursor: 'pointer' }}><MDButton variant='text' size='small'><FacebookIcon /></MDButton></MDTypography></MDBox>
                                                <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold' style={{ cursor: 'pointer' }}><MDButton variant='text' size='small'><WhatsAppIcon /></MDButton></MDTypography></MDBox>
                                            </Grid>

                                        </Grid>

                                        <Divider style={{ backgroundColor: 'white' }} />
                                    </Grid>

                                </Grid>

                                <Grid item lg={12} mb={1}>

                                    {leaderboard?.map((elem, index) => {
                                        return (
                                            <div key={elem?.name}>
                                                <Grid container spacing={0.5} lg={12} display='flex' justifyContent='center' alignItems='center'>

                                                    <Grid item xs={12} md={6} lg={2} display='flex' justifyContent='center'>
                                                        <MDBox><MDTypography fontSize={25} color='light' fontWeight='bold'>#{index + 1}</MDTypography></MDBox>
                                                    </Grid>

                                                    <Grid item xs={12} md={6} lg={2} display='flex' justifyContent='center'>

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

                                                    <Grid item xs={12} md={6} lg={4} display='flex' justifyContent='center'>
                                                        <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold'>{elem?.userName}</MDTypography></MDBox>
                                                    </Grid>

                                                    <Grid item xs={12} md={6} lg={4} display='flex' justifyContent='center'>
                                                        <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold'>{(elem?.npnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.npnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-elem?.npnl))}</MDTypography></MDBox>
                                                    </Grid>

                                                </Grid>

                                                <Divider style={{ backgroundColor: 'white' }} />
                                            </div>
                                        )
                                    })}


                                    {/* <Grid container spacing={0.5} lg={12} display='flex' justifyContent='center' alignItems='center'>
                            
                                    <Grid item xs={12} md={6} lg={2} display='flex' justifyContent='center'>
                                        <MDBox><MDTypography fontSize={25} color='light' fontWeight='bold'>#2</MDTypography></MDBox>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={2} display='flex' justifyContent='center'>
        
                                                <MDAvatar
                                                    src={AMargin}
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

                                    <Grid item xs={12} md={6} lg={4} display='flex' justifyContent='center'>
                                        <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold'>Anshuman Sharma</MDTypography></MDBox>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={4} display='flex' justifyContent='center'>
                                        <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold'>+₹1,10,000</MDTypography></MDBox>     
                                    </Grid>

                                </Grid>

                                <Divider style={{backgroundColor:'white'}}/>

                                <Grid container spacing={0.5} lg={12} display='flex' justifyContent='center' alignItems='center'>
                            
                                    <Grid item xs={12} md={6} lg={2} display='flex' justifyContent='center'>
                                        <MDBox><MDTypography fontSize={25} color='light' fontWeight='bold'>#3</MDTypography></MDBox>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={2} display='flex' justifyContent='center'>
        
                                                <MDAvatar
                                                    src={AMargin}
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

                                    <Grid item xs={12} md={6} lg={4} display='flex' justifyContent='center'>
                                        <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold'>Vijay Verma</MDTypography></MDBox>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={4} display='flex' justifyContent='center'>
                                        <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold'>+₹1,20,000</MDTypography></MDBox>     
                                    </Grid>

                                </Grid> */}

                                </Grid>

                            </Grid>

                        </MDBox>
                    </MDBox>
                </MDBox>
            }
        </>
    );
}

export default Leaderboard;
