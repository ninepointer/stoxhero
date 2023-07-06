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
import logo from '../../../assets/images/logo1.jpeg'
import Profit from '../../../assets/images/profit.png'
import Tcost from '../../../assets/images/tcost.png'
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Divider } from "@mui/material";



function Leaderboard() {


    return (
        <>
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
                                                            <MDTypography fontSize={15} color='light' fontWeight='bold'>My Rank</MDTypography>
                                                        </Grid>
                                                        <Grid item lg={4} display='flex' justifyContent='right' alignItems='center'>
                                                            <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold' style={{cursor:'pointer'}}><MDButton variant='text' size='small'><TwitterIcon/></MDButton></MDTypography></MDBox>
                                                            <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold' style={{cursor:'pointer'}}><MDButton variant='text' size='small'><FacebookIcon/></MDButton></MDTypography></MDBox>
                                                            <MDBox><MDTypography fontSize={15} color='light' fontWeight='bold' style={{cursor:'pointer'}}><MDButton variant='text' size='small'><WhatsAppIcon/></MDButton></MDTypography></MDBox>
                                                        </Grid>
                
                                            </Grid>
                                  
                                    <Divider style={{backgroundColor:'white'}}/>
                                </Grid>

                            </Grid>

                            <Grid item lg={12}>
                                
                                <Grid item lg={12}>
                                            <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                <Grid item lg={2} display='flex' justifyContent='center' alignItems='center'>
                                                    <MDTypography fontSize={25} color='light' fontWeight='bold'>#1</MDTypography>
                                                </Grid>
                                            </Grid>
                                    <Divider style={{backgroundColor:'white'}}/>
                                </Grid>

                            </Grid>

                            <Grid item lg={12}>
                                
                                <Grid item lg={12} display='flex' justifyContent='center'>
                                            <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                <Grid item lg={4} display='flex' justifyContent='right' alignItems='center'>
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
                                                <Grid item lg={8} ml={1} display='flex' justifyContent='left'>
                                                    <MDTypography fontSize={20} color='light' fontWeight='bold'>Prateek Pawan</MDTypography>
                                                </Grid>
                                            </Grid>
                                    <Divider style={{backgroundColor:'white'}}/>
                                </Grid>
                                <Divider style={{backgroundColor:'white'}}/>
                            </Grid>

                            <Grid item lg={12} mt={-1} mb={1.5}>
                                
                                <Grid item lg={12} display='flex' justifyContent='center' alignItems='center'>
                                            <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                <Grid item lg={12} display='flex' justifyContent='center' alignItems='center'>
                                                    <MDTypography fontSize={25} color='light' fontWeight='bold'>Net P&L: +2,22,000</MDTypography>
                                                </Grid>
                                            </Grid>
                                    {/* <Divider style={{backgroundColor:'white'}}/> */}
                                </Grid>

                            </Grid>

                        </Grid>

                    </MDBox>
                </MDBox>
            </MDBox>
        </>
    );
}

export default Leaderboard;
