import {useState, useEffect, useContext} from 'react';
import axios from "axios";
import MDBox from '../../../../components/MDBox';
import MDButton from '../../../../components/MDButton'
import {Card, Grid} from '@mui/material';
import MDTypography from '../../../../components/MDTypography';
import MDAvatar from '../../../../components/MDAvatar'
// import { CircularProgress, LinearProgress, Paper } from '@mui/material';
// import { apiUrl } from '../../../../constants/constants';
import Prateek from '../../../../assets/images/cofounder_prateek.png'
import { SocialIcon } from 'react-social-icons'

export default function Dashboard() {
  let [isLoading,setIsLoading] = useState(false)
  const [period,setPeriod] = useState("Today")


  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };


  return (
   
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1, backgroundColor:'white' }} >
                
                    <Grid container spacing={1} p={2} xs={12} md={12} lg={12} display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                    
                        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column'>
                            <Grid container item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                                    <MDAvatar alt="Remy Sharp" src={Prateek}/>
                                </Grid>
                                <Grid item xs={12} md={12} lg={9} display='flex' justifyContent='flex-start' alignItems='center' alignContent='center'>
                                    <MDBox display='flex' justifyContent='flex-start' flexDirection='column'>
                                        <MDTypography variant='body2' fontWeight='bold'>Prateek Pawan</MDTypography>
                                        <MDTypography variant='caption'>YouTube, Instagram, Telegram</MDTypography>
                                        <MDTypography variant='caption'>Kolkata, West Bengal</MDTypography>
                                    </MDBox>
                                </Grid>
                            </Grid>
                            <Grid container item mt={2} xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start'>
                                    <MDTypography variant='body2'>Tags</MDTypography>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start'>
                                    <Grid xs={12} md={12} lg={12} container display='flex' justifyContent='flex-start' flexDirection='row'>
                                        <Grid xs={12} md={12} lg={4} item display='flex' justifyContent='flex-start'><MDTypography variant='caption'>Trading</MDTypography></Grid>
                                        <Grid xs={12} md={12} lg={4} item display='flex' justifyContent='flex-start'><MDTypography variant='caption'>Investing</MDTypography></Grid>
                                        <Grid xs={12} md={12} lg={4} item display='flex' justifyContent='flex-start'><MDTypography variant='caption'>Mutual Funds</MDTypography></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container mt={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='space-between' flexDirection='column'>
                                    <Grid xs={12} md={12} lg={12} container display='flex' justifyContent='space-between' flexDirection='row'>
                                        <Grid xs={12} md={12} lg={4} item display='flex' justifyContent='center'><SocialIcon url="https://youtube.com" style={{ width: 24, height: 24 }}/></Grid>
                                        <Grid xs={12} md={12} lg={4} item display='flex' justifyContent='center'><SocialIcon url="https://instagram.com" style={{ width: 24, height: 24 }}/></Grid>
                                        <Grid xs={12} md={12} lg={4} item display='flex' justifyContent='center'> <SocialIcon url="https://telegram.com" style={{ width: 24, height: 24 }}/></Grid>
                                    </Grid>
                                    <Grid xs={12} md={12} lg={12} container display='flex' justifyContent='space-between' flexDirection='row'>
                                        <Grid xs={12} md={12} lg={4} item display='flex' justifyContent='center'><MDTypography variant='caption' fontWeight='bold'>1.1M</MDTypography></Grid>
                                        <Grid xs={12} md={12} lg={4} item display='flex' justifyContent='center'><MDTypography variant='caption' fontWeight='bold'>1M</MDTypography></Grid>
                                        <Grid xs={12} md={12} lg={4} item display='flex' justifyContent='center'><MDTypography variant='caption' fontWeight='bold'>1.5M</MDTypography></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container mt={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='space-between' flexDirection='column'>
                                    <Grid xs={12} md={12} lg={12} container display='flex' justifyContent='space-between' flexDirection='row'>
                                        <Grid xs={12} md={12} lg={4} item display='flex' justifyContent='center'><MDTypography variant='caption' fontWeight='bold'>Signups</MDTypography></Grid>
                                        <Grid xs={12} md={12} lg={4} item display='flex' justifyContent='center'><MDTypography variant='caption' fontWeight='bold'>Active</MDTypography></Grid>
                                        <Grid xs={12} md={12} lg={4} item display='flex' justifyContent='center'><MDTypography variant='caption' fontWeight='bold'>Paid</MDTypography></Grid>
                                    </Grid>
                                    <Grid xs={12} md={12} lg={12} container display='flex' justifyContent='space-between' flexDirection='row'>
                                        <Grid xs={12} md={12} lg={4} item display='flex' justifyContent='center'><MDTypography variant='caption'>50</MDTypography></Grid>
                                        <Grid xs={12} md={12} lg={4} item display='flex' justifyContent='center'><MDTypography variant='caption'>25</MDTypography></Grid>
                                        <Grid xs={12} md={12} lg={4} item display='flex' justifyContent='center'><MDTypography variant='caption'>15</MDTypography></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>
                
                </Card>
            </Grid>


  );
}