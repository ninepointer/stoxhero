import React from "react";
import axios from "axios";
import { useEffect, useState, useContext, useRef, useReducer } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import ContestCarousel from '../../../assets/images/success.png'
import MDButton from "../../../components/MDButton";


function OnGoingContests() {

  return (
    <MDBox bgColor="light" border='1px solid lightgrey' borderRadius={5} minHeight='auto'>
        <Grid container display='flex' justifyContent='space-between' alignItems='center'>
            <Grid item xs={12} md={6} lg={12} m={1}>
                <MDBox display='flex' mb={1} justifyContent='space-between' alignItems='center'>
                <Grid container alignItems='center'>
                    <Grid item xs={12} md={6} lg={12}>
                    <MDTypography ml={1} fontSize={15} fontWeight="bold">Ongoing Contests</MDTypography>
                    </Grid>
                </Grid>
                </MDBox>
                <MDBox bgColor="light" borderRadius={5} minHeight='auto'>
                    <Grid container spacing={1} display='flex' justifyContent='center' alignItems='center'>
                        
                        <Grid item xs={12} md={12} lg={12}>
                            <MDBox bgColor='primary' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <Grid container xs={12} md={12} lg={12}>
                                    <Grid item xs={3} md={3} lg={3} display='flex' justifyContent='flex-start' alignItems='center'>
                                        <img src={ContestCarousel} width='40px' height='40px' />
                                    </Grid>
                                    <Grid item xs={3} md={3} lg={9} display='flex' justifyContent='flex-start' alignItems='center'>
                                        <MDTypography fontSize={15} color='light' fontWeight="bold">Monday Marvels Trading</MDTypography>
                                    </Grid>
                                    <Grid item xs={3} md={3} lg={3} display='flex' justifyContent='flex-start' alignItems='center'>
                                        {/* <MDBox style={{backgroundColor:'orange',padding:2}}><MDTypography fontSize={12} color='light' fontWeight="bold">Filling fast</MDTypography></MDBox> */}
                                    </Grid>
                                    <Grid item xs={3} md={3} lg={9} display='flex' justifyContent='flex-start' alignItems='center'>
                                        <MDTypography fontSize={15} color='light' fontWeight="bold">Monday Marvels Trading</MDTypography>
                                    </Grid>
                                    <Grid item xs={3} md={3} lg={3} display='flex' justifyContent='flex-start' alignItems='center'>
                                        {/* <MDBox style={{backgroundColor:'orange',padding:2}}><MDTypography fontSize={12} color='light' fontWeight="bold">Filling fast</MDTypography></MDBox> */}
                                    </Grid>
                                    <Grid item xs={3} md={3} lg={9} display='flex' justifyContent='flex-start' alignItems='center'>
                                        <MDTypography fontSize={15} color='light' fontWeight="bold">Monday Marvels Trading</MDTypography>
                                    </Grid>
                                    <Grid item xs={3} md={3} lg={3} display='flex' justifyContent='center' alignItems='center'>
                                        {/* <MDButton size='small'>Join</MDButton> */}
                                    </Grid>
                                    <Grid item xs={3} md={3} lg={4.5} display='flex' justifyContent='center' alignItems='center'>
                                        <MDButton size='small'>Join</MDButton>
                                    </Grid>
                                    <Grid item xs={3} md={3} lg={4.5} display='flex' justifyContent='center' alignItems='center'>
                                        <MDButton size='small'>Join</MDButton>
                                    </Grid>
                                </Grid>
                            </MDBox>
                        </Grid>

                    </Grid>
                </MDBox>
            </Grid>
        </Grid>
    </MDBox>
)
}

export default OnGoingContests;
