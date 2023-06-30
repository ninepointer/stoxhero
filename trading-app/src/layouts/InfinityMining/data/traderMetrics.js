import React from 'react';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import {Link} from 'react-router-dom'
import { Grid } from '@mui/material';
import Logo from '../../../assets/images/default-profile.png'

//data
import LiveMockInfinityDailyData from '../data/liveMockInfinityDailyChart'

export default function PaymentHeader() {

  return (
    <>      
      <Grid container spacing={0.5} xs={12} md={12} lg={12}>
                        
                        <Grid item xs={12} md={12} lg={12} mt={-2} display='flex' justifyContent='center' alignItems='center'>
                          <MDTypography fontSize={15} fontWeight='bold'> Trader Metrics</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                          <Grid container xs={12} md={6} lg={12}>
                          <MDBox style={{border:'1px solid grey'}} borderRadius={5} display='flex' justifyContent='center' width='100%'>
                            <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                                <MDTypography color='light' fontSize={13} fontWeight='bold'>Probable Avg. P&L(L)</MDTypography>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                                <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>50,000</MDTypography>
                            </Grid>
                          </MDBox>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                          <Grid container xs={12} md={6} lg={12}>
                          <MDBox style={{border:'1px solid grey'}} borderRadius={5} display='flex' justifyContent='center' width='100%'>
                            <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                                <MDTypography color='light' fontSize={13} fontWeight='bold'>Probable Avg. P&L(W)</MDTypography>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                                <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>50,000</MDTypography>
                            </Grid>
                          </MDBox>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                          <Grid container xs={12} md={6} lg={12}>
                          <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                            <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                                <MDTypography color='light' fontSize={13} fontWeight='bold'>Risk 2 Reward(L)</MDTypography>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                                <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>0.12</MDTypography>
                            </Grid>
                          </MDBox>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                          <Grid container xs={12} md={6} lg={12}>
                          <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                            <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                                <MDTypography color='light' fontSize={13} fontWeight='bold'>Risk 2 Reward(W)</MDTypography>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                                <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>1.2</MDTypography>
                            </Grid>
                          </MDBox>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                        <Grid container xs={12} md={6} lg={12}>
                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Profit Days</MDTypography>
                          </Grid>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                              <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>10</MDTypography>
                          </Grid>
                        </MDBox>
                        </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                        <Grid container xs={12} md={6} lg={12}>
                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Loss Days</MDTypography>
                          </Grid>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                              <MDTypography ml={5} color='error' fontSize={13} fontWeight='bold'>10</MDTypography>
                          </Grid>
                        </MDBox>
                        </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                        <Grid container xs={12} md={6} lg={12}>
                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Avg. Profit</MDTypography>
                          </Grid>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                              <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>10,000</MDTypography>
                          </Grid>
                        </MDBox>
                        </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                        <Grid container xs={12} md={6} lg={12}>
                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Avg. Loss</MDTypography>
                          </Grid>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                              <MDTypography ml={5} color='error' fontSize={13} fontWeight='bold'>-10,000</MDTypography>
                          </Grid>
                        </MDBox>
                        </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                        <Grid container xs={12} md={6} lg={12}>
                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Trader Trading Days</MDTypography>
                          </Grid>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                              <MDTypography ml={5} color='info' fontSize={13} fontWeight='bold'>10</MDTypography>
                          </Grid>
                        </MDBox>
                        </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                        <Grid container xs={12} md={6} lg={12}>
                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Market Trading Days</MDTypography>
                          </Grid>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                              <MDTypography ml={5} color='info' fontSize={13} fontWeight='bold'>10</MDTypography>
                          </Grid>
                        </MDBox>
                        </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                        <Grid container xs={12} md={6} lg={12}>
                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Max Profit</MDTypography>
                          </Grid>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                              <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>50,000</MDTypography>
                          </Grid>
                        </MDBox>
                        </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                        <Grid container xs={12} md={6} lg={12}>
                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Profit %</MDTypography>
                          </Grid>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                              <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>50%</MDTypography>
                          </Grid>
                        </MDBox>
                        </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                        <Grid container xs={12} md={6} lg={12}>
                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Max Loss</MDTypography>
                          </Grid>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                              <MDTypography ml={5} color='error' fontSize={13} fontWeight='bold'>50,000</MDTypography>
                          </Grid>
                        </MDBox>
                        </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                        <Grid container xs={12} md={6} lg={12}>
                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Loss %</MDTypography>
                          </Grid>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                              <MDTypography ml={5} color='error' fontSize={13} fontWeight='bold'>50%</MDTypography>
                          </Grid>
                        </MDBox>
                        </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                        <Grid container xs={12} md={6} lg={12}>
                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Max Win Streak</MDTypography>
                          </Grid>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                              <MDTypography ml={5} color='info' fontSize={13} fontWeight='bold'>10</MDTypography>
                          </Grid>
                        </MDBox>
                        </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                        <Grid container xs={12} md={6} lg={12}>
                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Max Loss Streak</MDTypography>
                          </Grid>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                              <MDTypography ml={5} color='info' fontSize={13} fontWeight='bold'>10</MDTypography>
                          </Grid>
                        </MDBox>
                        </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                        <Grid container xs={12} md={6} lg={12}>
                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Available Margin</MDTypography>
                          </Grid>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                              <MDTypography ml={5} color='info' fontSize={13} fontWeight='bold'>10,000,00</MDTypography>
                          </Grid>
                        </MDBox>
                        </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                        <Grid container xs={12} md={6} lg={12}>
                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Today's Opening Balance</MDTypography>
                          </Grid>
                          <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                              <MDTypography ml={5} color='info' fontSize={13} fontWeight='bold'>7,000,00</MDTypography>
                          </Grid>
                        </MDBox>
                        </Grid>
                        </Grid>

      </Grid>              
    </>
  );
}