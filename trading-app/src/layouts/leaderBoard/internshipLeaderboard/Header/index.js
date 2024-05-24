import React, {useState, useEffect} from 'react';
import axios from "axios"
import MDBox from '../../../../components/MDBox';
import MDButton from '../../../../components/MDButton';
import {Grid, CircularProgress, Divider, LinearProgress} from '@mui/material';
import MDTypography from '../../../../components/MDTypography';
import MDAvatar from '../../../../components/MDAvatar';
import { Link } from "react-router-dom";
import CachedIcon from '@mui/icons-material/Cached';
import StoxHeroBanner from '../../../../assets/images/banner.png'
import Trophy from '../../../../assets/images/trophy.png'
import One from '../../../../assets/images/1.png'
import Two from '../../../../assets/images/2.png'
import Three from '../../../../assets/images/3.png'
import Four from '../../../../assets/images/4.png'
import Five from '../../../../assets/images/5.png'
import image from "../../../../assets/images/ppic.png"

// import RunningPNLChart from '../data/runningpnlchart'
// import data from "../data";
 
//data

export default function LabTabs() {


  return (
    <MDBox bgColor="dark" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto' maxWidth='100%'>
        <MDBox>
            <MDTypography ml={1} mb={1} color='light' fontSize={18} fontWeight='bold'>Internship Leaderboard</MDTypography>
        </MDBox>
      
            {/* <Grid container display='flex' flexDirection='column'> */}
                
                {/* <Grid container lg={6} p={1} style={{backgroundColor:'white'}} display='flex' justifyContent='center' alignContent='center' alignItems='center'> */}
                    <MDBox>
                        <MDBox>
                            <Grid container p={1} style={{backgroundColor:'black', borderRadius:'5px 5px 0px 0px'}} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                <Grid item lg={6} xs={12} display='flex' justifyContent='flex-start'>
                                    <img src={Trophy} height='50vH' alt="Rectangular Image" />
                                </Grid>
                                <Grid item lg={6} xs={12} display='flex' justifyContent='flex-end'>
                                    <img src={StoxHeroBanner} height='50vH'  alt="Rectangular Image" />
                                </Grid>
                            </Grid>
                        </MDBox>
                                <MDBox bgColor='success'>

                                <Grid container mb={0.5} shadow='md' style={{backgroundColor:'white'}} p={0.5} display='flex' justifyContent='space-between' alignContent='center' alignItems='center'>
                                    <Grid item lg={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDAvatar src={One} size='lg' alt="something here" />
                                    </Grid>
                                    <Grid item lg={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDAvatar src={image} size='lg' alt="something here" shadow="xs" />
                                    </Grid>
                                    <Grid item lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDTypography>Prateek Pawan</MDTypography>
                                    </Grid>
                                    <Grid item lg={2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDTypography>Rs. 3,20,000</MDTypography>
                                    </Grid>
                                    <Grid item lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDTypography>NIT Rourkela</MDTypography>
                                    </Grid>
                                </Grid>

                                <Grid container bgcolor='white' p={0.5} display='flex' justifyContent='space-between' alignContent='center' alignItems='center'>
                                    <Grid item lg={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDAvatar src={Two} size='lg' alt="something here" />
                                    </Grid>
                                    <Grid item lg={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDAvatar src={image} size='lg' alt="something here" shadow="xs" />
                                    </Grid>
                                    <Grid item lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDTypography>Prateek Pawan</MDTypography>
                                    </Grid>
                                    <Grid item lg={2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDTypography>Rs. 3,20,000</MDTypography>
                                    </Grid>
                                    <Grid item lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDTypography>NIT Rourkela</MDTypography>
                                    </Grid>
                                </Grid>

                                <Grid container bgcolor='white' p={0.5} display='flex' justifyContent='space-between' alignContent='center' alignItems='center'>
                                    <Grid item lg={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDAvatar src={Three} size='lg' alt="something here" />
                                    </Grid>
                                    <Grid item lg={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDAvatar src={image} size='lg' alt="something here" shadow="xs" />
                                    </Grid>
                                    <Grid item lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDTypography>Prateek Pawan</MDTypography>
                                    </Grid>
                                    <Grid item lg={2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDTypography>Rs. 3,20,000</MDTypography>
                                    </Grid>
                                    <Grid item lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDTypography>NIT Rourkela</MDTypography>
                                    </Grid>
                                </Grid>

                                <Grid container bgcolor='white' p={0.5} display='flex' justifyContent='space-between' alignContent='center' alignItems='center'>
                                    <Grid item lg={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDAvatar src={Four} size='lg' alt="something here" />
                                    </Grid>
                                    <Grid item lg={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDAvatar src={image} size='lg' alt="something here" shadow="xs" />
                                    </Grid>
                                    <Grid item lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDTypography>Prateek Pawan</MDTypography>
                                    </Grid>
                                    <Grid item lg={2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDTypography>Rs. 3,20,000</MDTypography>
                                    </Grid>
                                    <Grid item lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDTypography>NIT Rourkela</MDTypography>
                                    </Grid>
                                </Grid>

                                <Grid container bgcolor='white' p={0.5} display='flex' justifyContent='space-between' alignContent='center' alignItems='center'>
                                    <Grid item lg={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDAvatar src={Five} size='lg' alt="something here" />
                                    </Grid>
                                    <Grid item lg={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDAvatar src={image} size='lg' alt="something here" shadow="xs" />
                                    </Grid>
                                    <Grid item lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDTypography>Prateek Pawan</MDTypography>
                                    </Grid>
                                    <Grid item lg={2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDTypography>Rs. 3,20,000</MDTypography>
                                    </Grid>
                                    <Grid item lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDTypography>NIT Rourkela</MDTypography>
                                    </Grid>
                                </Grid>
                                </MDBox>
                        </MDBox>
                {/* </Grid> */}
            {/* </Grid> */}

    </MDBox>
  );
}

