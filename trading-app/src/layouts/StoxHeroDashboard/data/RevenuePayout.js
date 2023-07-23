import {useState, useEffect, useContext} from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
import Grid from "@mui/material/Grid";
import { userContext } from '../../../AuthContext';
import MDTypography from '../../../components/MDTypography';
import { Paper } from '@mui/material';

//icons
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

//data



export default function Dashboard({overallRevenue}) {


  return (
    
            <Grid container spacing={.5} p={0.5} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Revenue (Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueToday > overallRevenue[0].revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueToday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueToday > overallRevenue[0].revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueToday-overallRevenue[0].revenueYesterday))/(overallRevenue[0].revenueYesterday === 0 ? overallRevenue[0].revenueToday : overallRevenue[0].revenueYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueToday > overallRevenue[0].revenueYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Revenue (Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisWeek > overallRevenue[0].revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisWeek)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisWeek > overallRevenue[0].revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisWeek-overallRevenue[0].revenueLastWeek))/(overallRevenue[0].revenueLastWeek === 0 ? overallRevenue[0].revenueThisWeek : overallRevenue[0].revenueLastWeek)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisWeek > overallRevenue[0].revenueLastWeek ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from week</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Revenue (Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisMonth > overallRevenue[0].revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisMonth)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisMonth > overallRevenue[0].revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisMonth-overallRevenue[0].revenueLastMonth))/(overallRevenue[0].revenueLastMonth === 0 ? overallRevenue[0].revenueThisMonth : overallRevenue[0].revenueLastMonth)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisMonth > overallRevenue[0].revenueLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last month</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Revenue (Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total Revenue
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].totalRevenue)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisMonth-overallRevenue[0].revenueLastMonth))/(overallRevenue[0].revenueLastMonth === 0 ? overallRevenue[0].revenueThisMonth : overallRevenue[0].revenueLastMonth)*100).toFixed(0)}%</span>&nbsp; */}
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisMonth > overallRevenue[0].revenueLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp; */}
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>and growing</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Contest Payout (Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Contest Payout (Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Contest Payout (Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Contest Payout (Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total Contest Payout
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                TenX Payout (Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                TenX Payout (Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                TenX Payout (Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                TenX Payout (Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total TenX Payout
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Internship Payout (Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Internship Payout (Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Internship Payout (Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Internship Payout (Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total Internship Payout
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Referral Payout (Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Referral Payout (Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Referral Payout (Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Referral Payout (Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total Referral Payout
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue[0].revenueThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue[0].revenueThisYear-overallRevenue[0].revenueLastYear))/(overallRevenue[0].revenueLastYear === 0 ? overallRevenue[0].revenueThisYear : overallRevenue[0].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue[0].revenueThisYear > overallRevenue[0].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>
          </Grid>
       
  );
}