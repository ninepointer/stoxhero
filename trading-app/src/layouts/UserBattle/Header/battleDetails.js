import { React, useState, useEffect, useContext } from "react";
import axios from "axios";
import { userContext } from '../../../AuthContext';
import Grid from "@mui/material/Grid";
import ShareIcon from '@mui/icons-material/Share';
import ReactGA from "react-ga"

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDAvatar from "../../../components/MDAvatar";

// Material Dashboard 2 React base styles

// Images
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import ContestCarousel from '../../../assets/images/target.png'
import WinnerImage from '../../../assets/images/cup-image.png'
import BattleCard from "../../../assets/images/battlecard.jpg"
import BattleIcon from "../../../assets/images/swords.png"
import Gift from "../../../assets/images/gift.png"
import Regulation from "../../../assets/images/regulation.png"
import BattlePoint from "../../../assets/images/axe.png"


import Timer from '../timer'
import ProgressBar from "../progressBar";
import { HiUserGroup } from 'react-icons/hi';

import { Box, CircularProgress, Divider, Paper, Tooltip, Typography } from "@mui/material";
import MDSnackbar from "../../../components/MDSnackbar";
import { Link } from "react-router-dom";

function Header({ contest, showPay, setShowPay, isInterested, setIsInterested }) {

    useEffect(() => {
        ReactGA.pageview(window.location.pathname)
      }, []);


    return (
        <>
            <MDBox p={0.5} mt={1} width='100%' display='flex' justifyContent='center'>
                
                <Grid container spacing={1} xs={12} md={12} lg={12} width='100%' display='flex' justifyContent='center'>
                    
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                        <MDBox p={0.5} bgColor='white' borderRadius={5} width='100%' display='flex' justifyContent='center'>
                            <MDTypography fontSize={15} fontWeight='bold'>Battle Details</MDTypography>
                        </MDBox>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                        <MDBox p={0.5} bgColor='white' borderRadius={5} width='100%' display='flex' justifyContent='center'>
                            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                <Grid item xs={12} md={5.5} lg={5.5} display='flex' justifyContent='center' flexDirection='column'>
                                    <MDBox display='flex' justifyContent='center'>
                                        <MDAvatar
                                            src={BattlePoint}
                                            alt='Battle Icon'
                                            size="xl"
                                            sx={({ borders: { borderWidth }, palette: { white } }) => ({
                                            border: `${borderWidth[2]} solid ${white.main}`,
                                            cursor: "pointer",
                                            position: "relative",
                                            // ml: -1.25,

                                            "&:hover, &:focus": {
                                                zIndex: "10",
                                            },
                                            })}
                                        />
                                    </MDBox>
                                    <MDBox display='flex' justifyContent='center'>
                                        <MDTypography fontSize={15} fontWeight='bold'>Battle of Teens</MDTypography>
                                    </MDBox>
                                    <MDBox display='flex' justifyContent='center' flexDirection='column'>
                                        <MDBox mt={1} display='flex' justifyContent='center' flexDirection='row' width='100%'>
                                            <MDBox display='flex' justifyContent='center' width='33%'>
                                                <MDTypography fontSize={12} fontWeight='bold' >Reg. Start Date</MDTypography>
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='center' width='33%'>
                                                <MDTypography fontSize={12} fontWeight='bold' >Battle Start Date</MDTypography>
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='center' width='33%'>
                                                <MDTypography fontSize={12} fontWeight='bold' >Battle End Date</MDTypography>
                                            </MDBox>
                                        </MDBox>
                                        <MDBox mt={1} display='flex' justifyContent='center' flexDirection='row' width='100%'>
                                            <MDBox display='flex' justifyContent='center' width='33%'>
                                                <MDTypography fontSize={10} fontWeight='bold' >10-Aug-2023 | 09:45 AM</MDTypography>
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='center' width='33%'>
                                                <MDTypography fontSize={10} fontWeight='bold' >10-Aug-2023 | 09:45 AM</MDTypography>
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='center' width='33%'>
                                                <MDTypography fontSize={10} fontWeight='bold' >10-Aug-2023 | 09:45 AM</MDTypography>
                                            </MDBox>
                                        </MDBox>
                                    </MDBox>
                                </Grid>

                                <Grid item xs={0} md={1} lg={1} display='flex' justifyContent='center' flexDirection='column'>
                                    <Divider orientation="vertical"/>
                                </Grid>

                                <Grid item xs={12} md={5.5} lg={5.5} display='flex' justifyContent='top' flexDirection='column'>
                                    <MDBox display='flex' justifyContent='center'>
                                        <MDAvatar
                                            src={Regulation}
                                            alt='Battle Icon'
                                            size="xl"
                                            sx={({ borders: { borderWidth }, palette: { white } }) => ({
                                            border: `${borderWidth[2]} solid ${white.main}`,
                                            cursor: "pointer",
                                            position: "relative",
                                            // ml: -1.25,

                                            "&:hover, &:focus": {
                                                zIndex: "10",
                                            },
                                            })}
                                        />
                                    </MDBox>
                                    <MDBox display='flex' justifyContent='center'>
                                        <MDTypography fontSize={15} fontWeight='bold'>Battle Rules</MDTypography>
                                    </MDBox>
                                </Grid>
                            </Grid>
                        </MDBox>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                        <MDBox p={0.5} bgColor='white' borderRadius={5} width='100%' display='flex' justifyContent='center'>
                            <MDTypography fontSize={15} fontWeight='bold'>Battle Rules</MDTypography>
                        </MDBox>
                    </Grid>
                    
                </Grid>
                
            </MDBox>
        </>
    );
}

export default Header;













