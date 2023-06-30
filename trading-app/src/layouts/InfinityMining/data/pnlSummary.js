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
                      <Grid container xs={12} md={12} lg={12} mb={1} display='flex' justifyContent='center' alignItems='center'>
                          <MDTypography fontSize={15} fontWeight='bold'> P&L Summary</MDTypography>
                      </Grid>

                      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                        
                        <MDBox style={{border:'1px solid #e91e63', backgroundColor:'#e91e63'}} borderRadius={5} p={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Period</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Gross P&L</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Net P&L</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'>Brokerage</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography color='light' fontSize={13} fontWeight='bold'># Trades</MDTypography>
                          </Grid>
                        </MDBox>
                        
                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} fontWeight='bold'>Today</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>50,000</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>50,000</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>50,000</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>123</MDTypography>
                          </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} fontWeight='bold'>Last Day</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>50,000</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>50,000</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>50,000</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>123</MDTypography>
                          </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} fontWeight='bold'>This Week</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>50,000</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>50,000</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>50,000</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>123</MDTypography>
                          </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} fontWeight='bold'>This Month</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>50,000</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>50,000</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>50,000</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>123</MDTypography>
                          </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} fontWeight='bold'>Lifetime</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>50,000</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>50,000</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>50,000</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>123</MDTypography>
                          </Grid>
                        </MDBox>
                      </Grid>
    </>
  );
}