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

export default function TraderMetrics({infinityMiningData, isLoading}) {

  const expectedNpnl = infinityMiningData ? ((infinityMiningData.lossDays/infinityMiningData.totalTradingDays)*(infinityMiningData.averageLoss) + (infinityMiningData.profitDays/infinityMiningData.totalTradingDays)*(infinityMiningData.averageProfit)) : 0
  const expectedNpnlColor = expectedNpnl >= 0 ? 'success' : 'error'
  console.log(expectedNpnl)
  return (
    <> 
    {isLoading ?
      <MDBox style={{ filter: 'blur(2px)' }}>     
      <Grid container spacing={0.5} xs={12} md={12} lg={12}>
                        
                        <Grid item xs={12} md={12} lg={12} mt={-2} display='flex' justifyContent='center' alignItems='center'>
                          <MDTypography fontSize={15} fontWeight='bold'>Trader Metrics [L: Lifetime, W:Weekday]</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                          <Grid container xs={12} md={6} lg={12}>
                          <MDBox style={{border:'1px solid grey'}} borderRadius={5} display='flex' justifyContent='center' width='100%'>
                            <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                                <MDTypography color='light' fontSize={13} fontWeight='bold'>Exp/Avg Daily NP&L(L)</MDTypography>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                                <MDTypography ml={5} fontSize={13} fontWeight='bold'>
                                  Loading
                                </MDTypography>
                            </Grid>
                          </MDBox>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                          <Grid container xs={12} md={6} lg={12}>
                          <MDBox style={{border:'1px solid grey'}} borderRadius={5} display='flex' justifyContent='center' width='100%'>
                            <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                                <MDTypography color='light' fontSize={13} fontWeight='bold'>Exp/Avg Daily NP&L(W)</MDTypography>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                                <MDTypography ml={5} fontSize={13} fontWeight='bold'>Loading</MDTypography>
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
                                <MDTypography ml={5} fontSize={13} fontWeight='bold'>Loading</MDTypography>
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
                                <MDTypography ml={5} fontSize={13} fontWeight='bold'>Loading</MDTypography>
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
                              <MDTypography ml={5} fontSize={13} fontWeight='bold'>
                                Loading
                              </MDTypography>
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
                              <MDTypography ml={5} fontSize={13} fontWeight='bold'>
                                Loading
                              </MDTypography>
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
                              <MDTypography ml={5} fontSize={13} fontWeight='bold'>
                                Loading
                              </MDTypography>
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
                              <MDTypography ml={5} fontSize={13} fontWeight='bold'>
                                Loading
                              </MDTypography>
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
                              <MDTypography ml={5} fontSize={13} fontWeight='bold'>
                                Loading
                              </MDTypography>
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
                              <MDTypography ml={5} fontSize={13} fontWeight='bold'>
                               Loading
                              </MDTypography>
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
                              <MDTypography ml={5} fontSize={13} fontWeight='bold'>
                                Loading
                              </MDTypography>
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
                              <MDTypography ml={5} fontSize={13} fontWeight='bold'>Loading</MDTypography>
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
                              <MDTypography ml={5} fontSize={13} fontWeight='bold'>
                                Loading
                              </MDTypography>
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
                              <MDTypography ml={5} fontSize={13} fontWeight='bold'>Loading</MDTypography>
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
                              <MDTypography ml={5} fontSize={13} fontWeight='bold'>
                               Loading
                              </MDTypography>
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
                              <MDTypography ml={5} fontSize={13} fontWeight='bold'>
                                Loading
                              </MDTypography>
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
                              <MDTypography ml={5} fontSize={13} fontWeight='bold'>Loading</MDTypography>
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
                              <MDTypography ml={5} fontSize={13} fontWeight='bold'>Loading</MDTypography>
                          </Grid>
                        </MDBox>
                        </Grid>
                        </Grid>

      </Grid>   
      </MDBox>
      :
      <MDBox>     
      <Grid container spacing={0.5} xs={12} md={12} lg={12}>
                        
                        <Grid item xs={12} md={12} lg={12} mt={-2} display='flex' justifyContent='center' alignItems='center'>
                          <MDTypography fontSize={15} fontWeight='bold'>Trader Metrics [L: Lifetime, W:Weekday]</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                          <Grid container xs={12} md={6} lg={12}>
                          <MDBox style={{border:'1px solid grey'}} borderRadius={5} display='flex' justifyContent='center' width='100%'>
                            <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                                <MDTypography color='light' fontSize={13} fontWeight='bold'>Exp/Avg Daily NP&L(L)</MDTypography>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                                <MDTypography ml={5} color={expectedNpnlColor} fontSize={13} fontWeight='bold'>
                                  {expectedNpnl >= 0 ? '+₹' : '-₹'}{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(expectedNpnl >= 0 ? (expectedNpnl) : ((-expectedNpnl)))}
                                </MDTypography>
                            </Grid>
                          </MDBox>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='space-between' alignItems='center'>
                          <Grid container xs={12} md={6} lg={12}>
                          <MDBox style={{border:'1px solid grey'}} borderRadius={5} display='flex' justifyContent='center' width='100%'>
                            <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                                <MDTypography color='light' fontSize={13} fontWeight='bold'>Exp/Avg Daily NP&L(W)</MDTypography>
                            </Grid>
                            <Grid item xs={6} md={6} lg={6} p={0.5} display='flex' justifyContent='left'>
                                <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>Coming Soon</MDTypography>
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
                                <MDTypography ml={5} color='info' fontSize={13} fontWeight='bold'>{Math.abs(infinityMiningData?.averageProfit/infinityMiningData?.averageLoss)?.toFixed(2)}</MDTypography>
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
                                <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>Coming Soon</MDTypography>
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
                              <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>
                                {infinityMiningData?.profitDays} ({((infinityMiningData?.profitDays/(infinityMiningData?.profitDays + infinityMiningData?.lossDays))*100)?.toFixed(2) + '%'})
                              </MDTypography>
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
                              <MDTypography ml={5} color='error' fontSize={13} fontWeight='bold'>
                                {infinityMiningData?.lossDays} ({((infinityMiningData?.lossDays/(infinityMiningData?.profitDays + infinityMiningData?.lossDays))*100)?.toFixed(2) + '%'})
                              </MDTypography>
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
                              <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>
                                +₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((infinityMiningData?.averageProfit))}
                              </MDTypography>
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
                              <MDTypography ml={5} color='error' fontSize={13} fontWeight='bold'>
                                -₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((-infinityMiningData?.averageLoss))}
                              </MDTypography>
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
                              <MDTypography ml={5} color='info' fontSize={13} fontWeight='bold'>
                                {infinityMiningData?.totalTradingDays} ({((infinityMiningData?.totalTradingDays/infinityMiningData?.totalMarketDays)*100)?.toFixed(2) + '%)'}
                              </MDTypography>
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
                              <MDTypography ml={5} color='info' fontSize={13} fontWeight='bold'>
                                {infinityMiningData?.totalMarketDays}
                              </MDTypography>
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
                              <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>
                                +₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((infinityMiningData?.maxProfit))}
                              </MDTypography>
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
                              <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>Coming Soon</MDTypography>
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
                              <MDTypography ml={5} color='error' fontSize={13} fontWeight='bold'>
                                -₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((-infinityMiningData?.maxLoss))}
                              </MDTypography>
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
                              <MDTypography ml={5} color='error' fontSize={13} fontWeight='bold'>Coming Soon</MDTypography>
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
                              <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>
                                {infinityMiningData?.maxProfitStreak}
                              </MDTypography>
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
                              <MDTypography ml={5} color='error' fontSize={13} fontWeight='bold'>
                                {infinityMiningData?.maxLossStreak}
                              </MDTypography>
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
                              <MDTypography ml={5} color='info' fontSize={13} fontWeight='bold'>Coming Soon</MDTypography>
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
                              <MDTypography ml={5} color='info' fontSize={13} fontWeight='bold'>Coming Soon</MDTypography>
                          </Grid>
                        </MDBox>
                        </Grid>
                        </Grid>

      </Grid>   
      </MDBox>}           
    </>
  );
}