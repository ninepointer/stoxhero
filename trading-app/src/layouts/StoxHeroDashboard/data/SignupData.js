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



export default function Dashboard({signupData, rollingActiveUsers, overallTradeInformation}) {


  return (
    
            <Grid container spacing={.5} p={0.5} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                
                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                New Accounts(Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={signupData[0]?.todayUsers[0]?.count > signupData[0]?.yesterdayUsers[0]?.count ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(signupData[0]?.todayUsers[0]?.count ? signupData[0]?.todayUsers[0]?.count : 0)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={signupData[0]?.todayUsers[0]?.count > signupData[0]?.yesterdayUsers[0]?.count ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(signupData[0]?.todayUsers[0]?.count??0-signupData[0]?.yesterdayUsers[0]?.count??0))/(signupData[0]?.yesterdayUsers[0]?.count??0 ? signupData[0]?.yesterdayUsers[0]?.count??0 : signupData[0]?.todayUsers[0]?.count??0)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{signupData[0]?.todayUsers[0]?.count??0 > signupData[0]?.yesterdayUsers[0]?.count??0 ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                New Accounts(Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={signupData[0]?.thisWeekUsers[0]?.count??0 > signupData[0]?.lastWeekUsers[0]?.count??0 ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(signupData[0]?.thisWeekUsers[0]?.count??0)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={signupData[0]?.thisWeekUsers[0]?.count??0 > signupData[0]?.lastWeekUsers[0]?.count??0 ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(signupData[0]?.thisWeekUsers[0]?.count??0-signupData[0]?.lastWeekUsers[0]?.count??0))/(signupData[0]?.lastWeekUsers[0]?.count??0)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{signupData[0]?.thisWeekUsers[0]?.count??0 > signupData[0]?.lastWeekUsers[0]?.count??0 ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last week</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                New Accounts(Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={signupData[0]?.thisMonthUsers[0]?.count??0 > signupData[0]?.lastMonthUsers[0]?.count??0 ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(signupData[0]?.thisMonthUsers[0]?.count??0)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={signupData[0]?.thisMonthUsers[0]?.count??0 > signupData[0]?.lastMonthUsers[0]?.count??0 ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs((signupData[0]?.thisMonthUsers[0]?.count??0)-(signupData[0]?.lastMonthUsers[0]?.count??0)))/(signupData[0]?.lastMonthUsers[0]?.count??0)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{signupData[0]?.thisMonthUsers[0]?.count??0 > signupData[0]?.lastMonthUsers[0]?.count??0 ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last month</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                New Accounts(Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={signupData[0]?.thisYearUsers[0]?.count??0 > signupData[0]?.lastYearUsers[0]?.count??0 ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                            {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(signupData[0]?.thisYearUsers[0]?.count??0)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={signupData[0]?.thisYearUsers[0]?.count??0 > signupData[0]?.lastYearUsers[0]?.count??0 ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs((signupData[0]?.thisYearUsers[0]?.count??0)-(signupData[0].lastYearUsers[0].count??0)))/(signupData[0]?.lastYearUsers[0]?.count??0)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{signupData[0].thisYearUsers[0].count > signupData[0]?.lastYearUsers[0]?.count??0 ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total Accounts
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                            {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(signupData[0]?.lifetimeUsers[0]?.count)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>10%</span>&nbsp; */}
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ArrowUpwardIcon alignItems='center'/></span>&nbsp; */}
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>and growing</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                DAUs(Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={rollingActiveUsers?.uniqueUsersCountToday > rollingActiveUsers?.uniqueUsersCountYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(rollingActiveUsers?.uniqueUsersCountToday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={rollingActiveUsers?.uniqueUsersCountToday > rollingActiveUsers?.uniqueUsersCountYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(rollingActiveUsers?.uniqueUsersCountToday-rollingActiveUsers?.uniqueUsersCountYesterday))/(rollingActiveUsers?.uniqueUsersCountYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{rollingActiveUsers?.uniqueUsersCountToday > rollingActiveUsers?.uniqueUsersCountYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                WAUs(Rolling 7 Days)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={rollingActiveUsers?.uniqueUsersPast7DaysBasedOnToday > rollingActiveUsers?.uniqueUsersPast7DaysBasedOnYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(rollingActiveUsers?.uniqueUsersPast7DaysBasedOnToday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={rollingActiveUsers?.uniqueUsersPast7DaysBasedOnToday > rollingActiveUsers?.uniqueUsersPast7DaysBasedOnYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(rollingActiveUsers?.uniqueUsersPast7DaysBasedOnToday-rollingActiveUsers?.uniqueUsersPast7DaysBasedOnYesterday))/(rollingActiveUsers?.uniqueUsersPast7DaysBasedOnYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{rollingActiveUsers?.uniqueUsersPast7DaysBasedOnToday > rollingActiveUsers?.uniqueUsersPast7DaysBasedOnYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                MAUs(Rolling 30 Days)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={rollingActiveUsers?.uniqueUsersPast30DaysBasedOnToday > rollingActiveUsers?.uniqueUsersPast30DaysBasedOnYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(rollingActiveUsers?.uniqueUsersPast30DaysBasedOnToday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={rollingActiveUsers?.uniqueUsersPast30DaysBasedOnToday > rollingActiveUsers?.uniqueUsersPast30DaysBasedOnYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(rollingActiveUsers?.uniqueUsersPast30DaysBasedOnToday-rollingActiveUsers?.uniqueUsersPast30DaysBasedOnYesterday))/(rollingActiveUsers?.uniqueUsersPast30DaysBasedOnYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{rollingActiveUsers?.uniqueUsersPast30DaysBasedOnToday > rollingActiveUsers?.uniqueUsersPast30DaysBasedOnYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                DAU/MAU(Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={(rollingActiveUsers?.uniqueUsersCountToday/rollingActiveUsers?.uniqueUsersPast30DaysBasedOnToday) > (rollingActiveUsers?.uniqueUsersCountYesterday/rollingActiveUsers?.uniqueUsersPast30DaysBasedOnYesterday) ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                {((rollingActiveUsers?.uniqueUsersCountToday/rollingActiveUsers?.uniqueUsersPast30DaysBasedOnToday)*100).toFixed(0)}%
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={(rollingActiveUsers?.uniqueUsersCountToday/rollingActiveUsers?.uniqueUsersPast30DaysBasedOnToday) > (rollingActiveUsers?.uniqueUsersCountYesterday/rollingActiveUsers?.uniqueUsersPast30DaysBasedOnYesterday) ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs((rollingActiveUsers?.uniqueUsersCountToday/rollingActiveUsers?.uniqueUsersPast30DaysBasedOnToday)-(rollingActiveUsers?.uniqueUsersCountYesterday/rollingActiveUsers?.uniqueUsersPast30DaysBasedOnYesterday))/((rollingActiveUsers?.uniqueUsersCountYesterday/rollingActiveUsers?.uniqueUsersPast30DaysBasedOnYesterday))*100)).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{(rollingActiveUsers?.uniqueUsersCountToday/rollingActiveUsers?.uniqueUsersPast30DaysBasedOnToday) > (rollingActiveUsers?.uniqueUsersCountYesterday/rollingActiveUsers?.uniqueUsersPast30DaysBasedOnYesterday) ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                DAU/WAU(Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={(rollingActiveUsers?.uniqueUsersCountToday/rollingActiveUsers?.uniqueUsersPast7DaysBasedOnToday) > (rollingActiveUsers?.uniqueUsersCountYesterday/rollingActiveUsers?.uniqueUsersPast7DaysBasedOnYesterday) ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                {((rollingActiveUsers?.uniqueUsersCountToday/rollingActiveUsers?.uniqueUsersPast7DaysBasedOnToday)*100).toFixed(0)}%
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={(rollingActiveUsers?.uniqueUsersCountToday/rollingActiveUsers?.uniqueUsersPast7DaysBasedOnToday) > (rollingActiveUsers?.uniqueUsersCountYesterday/rollingActiveUsers?.uniqueUsersPast7DaysBasedOnYesterday) ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs((rollingActiveUsers?.uniqueUsersCountToday/rollingActiveUsers?.uniqueUsersPast7DaysBasedOnToday)-(rollingActiveUsers?.uniqueUsersCountYesterday/rollingActiveUsers?.uniqueUsersPast7DaysBasedOnYesterday))/((rollingActiveUsers?.uniqueUsersCountYesterday/rollingActiveUsers?.uniqueUsersPast7DaysBasedOnYesterday))*100)).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{(rollingActiveUsers?.uniqueUsersCountToday/rollingActiveUsers?.uniqueUsersPast7DaysBasedOnToday) > (rollingActiveUsers?.uniqueUsersCountYesterday/rollingActiveUsers?.uniqueUsersPast7DaysBasedOnYesterday) ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Trades(Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallTradeInformation.tradesToday > overallTradeInformation.tradesYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                            {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallTradeInformation.tradesToday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallTradeInformation.tradesToday > overallTradeInformation.tradesYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallTradeInformation.tradesToday-overallTradeInformation.tradesYesterday))/(overallTradeInformation.tradesYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallTradeInformation.tradesToday > overallTradeInformation.tradesYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Trades(Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallTradeInformation.tradesThisWeek > overallTradeInformation.tradesLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                            {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallTradeInformation.tradesThisWeek)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallTradeInformation.tradesThisWeek > overallTradeInformation.tradesLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallTradeInformation.tradesThisWeek-overallTradeInformation.tradesLastWeek))/(overallTradeInformation.tradesLastWeek)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallTradeInformation.tradesThisWeek > overallTradeInformation.tradesLastWeek ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last week</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Trades(Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallTradeInformation.tradesThisMonth > overallTradeInformation.tradesLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                            {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallTradeInformation.tradesThisMonth)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallTradeInformation.tradesThisMonth > overallTradeInformation.tradesLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallTradeInformation.tradesThisMonth-overallTradeInformation.tradesLastMonth))/(overallTradeInformation.tradesLastMonth)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallTradeInformation.tradesThisMonth > overallTradeInformation.tradesLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last month</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Trades(Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallTradeInformation.tradesThisYear > overallTradeInformation.tradesLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallTradeInformation.tradesThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallTradeInformation.tradesThisYear > overallTradeInformation.tradesLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallTradeInformation.tradesThisYear-overallTradeInformation.tradesLastYear))/(overallTradeInformation.tradesLastYear === 0 ? overallTradeInformation.tradesThisYear : overallTradeInformation.tradesLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallTradeInformation.tradesThisYear > overallTradeInformation.tradesLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total Trades
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallTradeInformation.totalTrades)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallTradeInformation.totalTrades-overallTradeInformation.tradesLastMonth))/(overallTradeInformation.tradesLastMonth)*100).toFixed(0)}%</span>&nbsp; */}
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallTradeInformation.totalTrades > overallTradeInformation.tradesLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp; */}
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>and growing</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Options Turnover(Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallTradeInformation.turnoverToday > overallTradeInformation.turnoverYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallTradeInformation.turnoverToday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallTradeInformation.turnoverToday > overallTradeInformation.turnoverYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallTradeInformation.turnoverToday-overallTradeInformation.turnoverYesterday))/(overallTradeInformation.turnoverYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallTradeInformation.turnoverToday > overallTradeInformation.turnoverYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Options Turnover(Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallTradeInformation.turnoverThisWeek > overallTradeInformation.turnoverLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallTradeInformation.turnoverThisWeek)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallTradeInformation.turnoverThisWeek > overallTradeInformation.turnoverLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallTradeInformation.turnoverThisWeek-overallTradeInformation.turnoverLastWeek))/(overallTradeInformation.turnoverLastWeek)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallTradeInformation.turnoverThisWeek > overallTradeInformation.turnoverLastWeek ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last week</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Options Turnover(Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallTradeInformation.turnoverThisMonth > overallTradeInformation.turnoverLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallTradeInformation.turnoverThisMonth)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallTradeInformation.turnoverThisMonth > overallTradeInformation.turnoverLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallTradeInformation.turnoverThisMonth-overallTradeInformation.turnoverLastMonth))/(overallTradeInformation.turnoverLastMonth)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallTradeInformation.turnoverThisMonth > overallTradeInformation.turnoverLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last month</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Options Turnover(Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallTradeInformation.turnoverThisYear > overallTradeInformation.turnoverLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallTradeInformation.turnoverThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallTradeInformation.turnoverThisYear > overallTradeInformation.turnoverLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallTradeInformation.turnoverThisYear-overallTradeInformation.turnoverLastYear))/(overallTradeInformation.turnoverLastYear === 0 ? overallTradeInformation.turnoverThisYear : overallTradeInformation.turnoverLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallTradeInformation.turnoverThisYear > overallTradeInformation.turnoverLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total Options Turnover
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallTradeInformation.totalTurnover)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallTradeInformation.turnoverThisYear-overallTradeInformation.turnoverLastYear))/(overallTradeInformation.turnoverLastYear === 0 ? overallTradeInformation.turnoverThisYear : overallTradeInformation.turnoverLastYear)*100).toFixed(0)}%</span>&nbsp; */}
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallTradeInformation.turnoverThisYear > overallTradeInformation.turnoverLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp; */}
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>and growing</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

             </Grid>
       
  );
}