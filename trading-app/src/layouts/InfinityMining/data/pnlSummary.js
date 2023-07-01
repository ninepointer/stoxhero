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

export default function PNLSUmmary({infinityMiningData, pnlSummary, isLoading}) {

  return (
                <>   
                {isLoading ? 
                //Default Loading Page
                <MDBox style={{ filter: 'blur(2px)' }}>
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
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                  </MDBox>

                  <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13} fontWeight='bold'>Last Day</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                  </MDBox>

                  <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13} fontWeight='bold'>This Week</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                  </MDBox>

                  <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13} fontWeight='bold'>This Month</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                  </MDBox>

                  <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13} fontWeight='bold'>Last Month</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>Loading</MDTypography>
                    </Grid>
                  </MDBox>

                  <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13} fontWeight='bold'>Lifetime</MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>
                          Loading
                        </MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>
                          Loading
                        </MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>
                          Loading
                        </MDTypography>
                    </Grid>
                    <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                        <MDTypography fontSize={13}>
                          Loading
                        </MDTypography>
                    </Grid>
                  </MDBox>
                </Grid>
                </MDBox>   
                :
                <MDBox>
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
                              <MDTypography fontSize={13}>-</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>-</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>-</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13}>-</MDTypography>
                          </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} fontWeight='bold'>Last Day</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={pnlSummary?.lastDay[0]?.gpnl >= 0 ? 'success' : pnlSummary?.lastDay[0]?.gpnl < 0 ? 'error' : 'text'}>
                                    {pnlSummary?.lastDay[0]?.gpnl ? 
                                            (pnlSummary.lastDay[0]?.gpnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnlSummary.lastDay[0]?.gpnl >= 0 ? pnlSummary.lastDay[0]?.gpnl : -pnlSummary.lastDay[0]?.gpnl)
                                            : '₹0'
                                    }
                              </MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={pnlSummary?.lastDay[0]?.npnl >= 0 ? 'success' : pnlSummary?.lastDay[0]?.npnl < 0 ? 'error' : 'text'}>
                                {pnlSummary?.lastDay[0]?.npnl ? 
                                        (pnlSummary.lastDay[0]?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnlSummary.lastDay[0]?.npnl >= 0 ? pnlSummary.lastDay[0]?.npnl : -pnlSummary.lastDay[0]?.npnl)
                                        : '₹0'
                                }
                              </MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={pnlSummary?.lastDay[0]?.totalbrokerage ? 'info' : 'text'}>
                                {pnlSummary?.lastDay[0]?.totalbrokerage ? 
                                        (pnlSummary.lastDay[0]?.totalbrokerage >= 0 ? '₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnlSummary.lastDay[0]?.totalbrokerage >= 0 ? pnlSummary.lastDay[0]?.totalbrokerage : -pnlSummary.lastDay[0]?.totalbrokerage)
                                        : '₹0'
                                }
                              </MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={pnlSummary?.lastDay[0]?.tradeCount ? 'info' : 'text'}>
                                {pnlSummary?.lastDay[0]?.tradeCount ? pnlSummary?.lastDay[0]?.tradeCount : '0'}
                              </MDTypography>
                          </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} fontWeight='bold'>This Week</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={pnlSummary?.thisWeek[0]?.gpnl >= 0 ? 'success' : pnlSummary?.thisWeek[0]?.gpnl < 0 ? 'error' : 'text'}>
                                    {pnlSummary?.thisWeek[0]?.gpnl ? 
                                            (pnlSummary.thisWeek[0]?.gpnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnlSummary.thisWeek[0]?.gpnl >= 0 ? pnlSummary.thisWeek[0]?.gpnl : -pnlSummary.thisWeek[0]?.gpnl)
                                            : '₹0'
                                    }
                              </MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={pnlSummary?.thisWeek[0]?.npnl >= 0 ? 'success' : pnlSummary?.thisWeek[0]?.npnl < 0 ? 'error' : 'text'}>
                                {pnlSummary?.thisWeek[0]?.npnl ? 
                                        (pnlSummary.thisWeek[0]?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnlSummary.thisWeek[0]?.npnl >= 0 ? pnlSummary.thisWeek[0]?.npnl : -pnlSummary.thisWeek[0]?.npnl)
                                        : '₹0'
                                }
                              </MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={pnlSummary?.thisWeek[0]?.totalbrokerage ? 'info' : 'text'}>
                                {pnlSummary?.thisWeek[0]?.totalbrokerage ? 
                                        (pnlSummary.thisWeek[0]?.totalbrokerage >= 0 ? '₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnlSummary.thisWeek[0]?.totalbrokerage >= 0 ? pnlSummary.thisWeek[0]?.totalbrokerage : -pnlSummary.thisWeek[0]?.totalbrokerage)
                                        : '₹0'
                                }
                              </MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={pnlSummary?.thisWeek[0]?.tradeCount ? 'info' : 'text'}>
                                {pnlSummary?.thisWeek[0]?.tradeCount ? pnlSummary?.thisWeek[0]?.tradeCount : '0'}
                              </MDTypography>
                          </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} fontWeight='bold'>This Month</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={pnlSummary?.thisMonth[0]?.gpnl >= 0 ? 'success' : pnlSummary?.thisMonth[0]?.gpnl < 0 ? 'error' : 'text'}>
                                    {pnlSummary?.thisMonth[0]?.gpnl ? 
                                            (pnlSummary.thisMonth[0]?.gpnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnlSummary.thisMonth[0]?.gpnl >= 0 ? pnlSummary.thisMonth[0]?.gpnl : -pnlSummary.thisMonth[0]?.gpnl)
                                            : '₹0'
                                    }
                              </MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={pnlSummary?.thisMonth[0]?.npnl >= 0 ? 'success' : pnlSummary?.thisMonth[0]?.npnl < 0 ? 'error' : 'text'}>
                                {pnlSummary?.thisMonth[0]?.npnl ? 
                                        (pnlSummary.thisMonth[0]?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnlSummary.thisMonth[0]?.npnl >= 0 ? pnlSummary.thisMonth[0]?.npnl : -pnlSummary.thisMonth[0]?.npnl)
                                        : '₹0'
                                }
                              </MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={pnlSummary?.thisMonth[0]?.totalbrokerage ? 'info' : 'text'}>
                                {pnlSummary?.thisMonth[0]?.totalbrokerage ? 
                                        (pnlSummary.thisMonth[0]?.totalbrokerage >= 0 ? '₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnlSummary.thisMonth[0]?.totalbrokerage >= 0 ? pnlSummary.thisMonth[0]?.totalbrokerage : -pnlSummary.thisMonth[0]?.totalbrokerage)
                                        : '₹0'
                                }
                              </MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={pnlSummary?.thisMonth[0]?.tradeCount ? 'info' : 'text'}>
                                {pnlSummary?.thisMonth[0]?.tradeCount ? pnlSummary?.thisMonth[0]?.tradeCount : '0'}
                              </MDTypography>
                          </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} fontWeight='bold'>Last Month</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={pnlSummary?.lastMonth[0]?.gpnl >= 0 ? 'success' : pnlSummary?.lastMonth[0]?.gpnl < 0 ? 'error' : 'text'}>
                                    {pnlSummary?.lastMonth[0]?.gpnl ? 
                                            (pnlSummary.lastMonth[0]?.gpnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnlSummary.lastMonth[0]?.gpnl >= 0 ? pnlSummary.lastMonth[0]?.gpnl : -pnlSummary.lastMonth[0]?.gpnl)
                                            : '₹0'
                                    }
                              </MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={pnlSummary?.lastMonth[0]?.npnl >= 0 ? 'success' : pnlSummary?.lastMonth[0]?.npnl < 0 ? 'error' : 'text'}>
                                {pnlSummary?.lastMonth[0]?.npnl ? 
                                        (pnlSummary.lastMonth[0]?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnlSummary.lastMonth[0]?.npnl >= 0 ? pnlSummary.lastMonth[0]?.npnl : -pnlSummary.lastMonth[0]?.npnl)
                                        : '₹0'
                                }
                              </MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={pnlSummary?.lastMonth[0]?.totalbrokerage ? 'info' : 'text'}>
                                {pnlSummary?.lastMonth[0]?.totalbrokerage ? 
                                        (pnlSummary.lastMonth[0]?.totalbrokerage >= 0 ? '₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnlSummary.lastMonth[0]?.totalbrokerage >= 0 ? pnlSummary.lastMonth[0]?.totalbrokerage : -pnlSummary.lastMonth[0]?.totalbrokerage)
                                        : '₹0'
                                }
                              </MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={pnlSummary?.lastMonth[0]?.tradeCount ? 'info' : 'text'}>
                                {pnlSummary?.lastMonth[0]?.tradeCount ? pnlSummary?.lastMonth[0]?.tradeCount : '0'}
                              </MDTypography>
                          </Grid>
                        </MDBox>

                        <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} fontWeight='bold'>Lifetime</MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={infinityMiningData?.totalGPNL >= 0 ? 'success' : 'error'}>
                                {infinityMiningData?.totalGPNL >= 0 ? '+₹' : '-₹'}{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(infinityMiningData?.totalGPNL >= 0 ? (infinityMiningData?.totalGPNL) : ((-infinityMiningData?.totalGPNL)))}
                              </MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color={infinityMiningData?.totalNPNL >=0 ? 'success' : 'error'}>
                                {infinityMiningData?.totalNPNL >= 0 ? '+₹' : '-₹'}{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(infinityMiningData?.totalNPNL >= 0 ? (infinityMiningData?.totalNPNL) : ((-infinityMiningData?.totalNPNL)))}
                              </MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color='info'>
                              {infinityMiningData?.totalBrokerage >= 0 ? '₹' : '-₹'}{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(infinityMiningData?.totalBrokerage >= 0 ? (infinityMiningData?.totalBrokerage) : ((-infinityMiningData?.totalNPNL)))}
                              </MDTypography>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                              <MDTypography fontSize={13} color='info'>{infinityMiningData?.totalTrades}</MDTypography>
                          </Grid>
                        </MDBox>
                      </Grid>
                </MDBox>}
    </>
  );
}