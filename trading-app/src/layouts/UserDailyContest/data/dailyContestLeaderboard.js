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

    useEffect(() => {
        socket?.on("contest-leaderboardData", (data) => {

            setLeaderboard(data);
            setIsLoading(false);
        })

        let timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

    }, [])

    return (
        <>
            {loading ?
                <MDBox display="flex" justifyContent="center" alignItems="center">
                    <MDBox display="flex" justifyContent="center" alignItems="center"><MDTypography fontSize={15} fontWeight='bold' color='light'>Loading Contest Leaderboard</MDTypography></MDBox>
                    <MDBox ml={1} display="flex" justifyContent="center" alignItems="center"><CircularProgress color="light" /></MDBox>
                </MDBox>
                :
                <MDBox color="light" mt={0} mb={0} borderRadius={10} minHeight='auto'>
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
                                            <Grid item xs={12} lg={6} display='flex' justifyContent='left' alignItems='center'>
                                                <MDTypography fontSize={15} color='light' fontWeight='bold'>StoxHero {name} Contest Leaderboard</MDTypography>
                                            </Grid>
                                            <Grid item xs={12} lg={4} display='flex' justifyContent='right' alignItems='center'>
                                                <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold' style={{ cursor: 'pointer' }}><MDButton variant='text' size='small'><TwitterIcon /></MDButton></MDTypography></MDBox>
                                                <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold' style={{ cursor: 'pointer' }}><MDButton variant='text' size='small'><FacebookIcon /></MDButton></MDTypography></MDBox>
                                                <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold' style={{ cursor: 'pointer' }}><MDButton variant='text' size='small'><WhatsAppIcon /></MDButton></MDTypography></MDBox>
                                            </Grid>

                                        </Grid>

                                        <Divider style={{ backgroundColor: 'white' }} />
                                    </Grid>

                                </Grid>

                                {leaderboard?.length >= 3 ?
                                <Grid item xs={12} lg={12} mb={-2}>

                                    {leaderboard?.map((elem, index) => {
                                        return (
                                            <div key={elem?.name}>
                                                <Grid container spacing={0.5} xs={12} lg={12} display='flex' justifyContent='center' alignItems='center'>

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

                                    </Grid>

                                    :

                                    <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center'>
                                        <MDBox mb={2}><MDTypography fontSize={15} color='light' fontWeight='bold' style={{ cursor: 'pointer' }}>The Contest Leaderboard will be displayed here!</MDTypography></MDBox>
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
