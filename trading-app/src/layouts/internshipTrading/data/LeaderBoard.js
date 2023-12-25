import React, { useState, useEffect } from 'react';
import axios from "axios";
import ReactGA from "react-ga"
import {
    Paper,
    Avatar,
    Box,
    Divider,
    CircularProgress,
} from '@mui/material';

import { Grid } from '@mui/material'
import MDTypography from '../../../components/MDTypography';
import MDBox from '../../../components/MDBox';
import MDAvatar from '../../../components/MDAvatar';
import logo from '../../../assets/images/logo1.jpeg'
import { apiUrl } from '../../../constants/constants';

const LeaderBoard = ({id}) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    function convertName(name) {
        // const name = 'SARTHAK SINGHAL';

        const cname = name
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return cname;
    };

    useEffect(() => {
        setIsLoading(true)
        let call1 = axios.get(`${apiUrl}internship/leaderboard/${id}`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        })
        Promise.all([call1])
            .then(([api1Response]) => {
                setData(api1Response.data.data);
                ReactGA.pageview(window.location.pathname)
                setTimeout(() => {
                    setIsLoading(false)
                }, 1500)
            })
            .catch((error) => {
                // Handle errors here
                console.error(error);
                setIsLoading(true)
            });
    }, [])

    return (
        <Box mt={0} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <MDBox p={1} bgColor='success' width='100%' display='flex' justifyContent='center' alignItems='center' sx={{ borderTopLeftRadius: "5px", borderTopRightRadius: "5px"}}>
                <MDBox>
                    <Avatar
                        src={logo}
                        alt="StoxHero"
                    />
                </MDBox>
                <MDBox ml={1}>
                    <MDTypography color='light' fontWeight='bold'>
                        Leaderboard
                    </MDTypography>
                </MDBox>
            </MDBox>
            {isLoading ?
                <MDBox mt={10} minHeight='30vH'>
                    <CircularProgress color='info' />
                </MDBox>
                :
                <Box sx={{ maxWidth: '100%', width: '100%', margin: '0 auto' }} component={Paper}>
                    <Grid container mt={1} display='flex' justifyContent='center'>
                        <Grid item xs={12} md={6} lg={2.4} mt={1} display='flex' justifyContent='center'>
                            <MDTypography fontSize={15} fontWeight='bold' color='dark'>Rank</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={6} lg={2.4} mt={1} display='flex' justifyContent='left'>
                            <MDBox display='flex' justifyContent='center' alignItems='center' width='100%'>
                                <MDBox display='flex' justifyContent='center' alignItems='center' width='100%'>
                                    <MDTypography fontSize={15} fontWeight='bold' color='dark'>Trader</MDTypography>
                                </MDBox>
                            </MDBox>
                        </Grid>
                        {/* <Grid item xs={12} md={6} lg={1.5} mt={1} display='flex' justifyContent='center'>
                            <MDTypography fontSize={15} fontWeight='bold' color='dark'>Gross P&L</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={6} lg={1.5} mt={1} display='flex' justifyContent='center'>
                            <MDTypography fontSize={15} fontWeight='bold' color='dark'>Brokerage</MDTypography>
                        </Grid> */}
                        <Grid item xs={12} md={6} lg={2.4} mt={1} display='flex' justifyContent='center'>
                            <MDTypography fontSize={15} fontWeight='bold' color='dark'>Net P&L</MDTypography>
                        </Grid>
                        {/* <Grid item xs={12} md={6} lg={2.4} mt={1} display='flex' justifyContent='center'>
                            <MDTypography fontSize={15} fontWeight='bold' color='dark'># Referrals</MDTypography>
                        </Grid> */}
                        <Grid item xs={12} md={6} lg={2.4} mt={1} display='flex' justifyContent='center'>
                            <MDTypography fontSize={15} fontWeight='bold' color='dark'>Portfolio Value</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={6} lg={2.4} mt={1} display='flex' justifyContent='center'>
                            <MDTypography fontSize={15} fontWeight='bold' color='dark'>Return</MDTypography>
                        </Grid>
                    </Grid>
                    <Divider style={{ backgroundColor: 'grey' }} />
                    

                    {data.map((trader, index) => {
                        const gpnlColor = trader?.gpnl >= 0 ? "success" : "error";
                        const npnlColor = trader?.npnl >= 0 ? "success" : "error";
                        return (
                            <>
                                <Grid container mb={1} display='flex' justifyContent='center' alignItems='center' sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                                    <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={15} color='dark'>
                                            {index + 1}
                                        </MDTypography>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center' width='100%'>
                                        <MDBox display='flex' justifyContent='flex-start' alignItems='center' alignContent='center' width='100%' gap={1}>
                                            <MDBox display='flex' justifyContent='flex-start' alignItems='center' ml={1}>
                                                <Avatar
                                                    src={trader?.profileImage ? trader?.profileImage : logo}
                                                    alt={trader?.name}
                                                />
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='flex-start' alignItems='center'>
                                                <MDTypography fontSize={15} color='dark'>
                                                    {convertName(trader.name)}
                                                </MDTypography></MDBox>
                                        </MDBox>
                                    </Grid>
                                    {/* <Grid item xs={12} md={6} lg={1.5} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={15} color={gpnlColor}>
                                            {(trader?.gpnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(trader?.gpnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-trader?.gpnl))}
                                        </MDTypography>
                                    </Grid> */}
                                    {/* <Grid item xs={12} md={6} lg={1.5} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={15} color='dark'>
                                            ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(trader?.brokerage)}
                                        </MDTypography>
                                    </Grid> */}
                                    <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={15} color={npnlColor}>
                                            {(trader?.npnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(trader?.npnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-trader?.npnl))}
                                        </MDTypography>
                                    </Grid>
                                    {/* <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={15} color='dark'>
                                            {(trader?.referralCount)}
                                        </MDTypography>
                                    </Grid> */}
                                    <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={15} color='dark'>
                                        {"₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(trader?.portfolioValue))}
                                        </MDTypography>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={2.4} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={15} color={npnlColor}>
                                            {(trader?.return?.toFixed(2))}%
                                        </MDTypography>
                                    </Grid>
                                </Grid>
                                <Divider style={{ backgroundColor: 'grey' }} />
                            </>
                        )
                    })}
                </Box>
            }

        </Box>
    );
};

export default LeaderBoard;
