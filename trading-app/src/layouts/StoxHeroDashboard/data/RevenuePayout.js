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
const withdrawalData = {
    totalRevenue: overallRevenue?.lastYearsWithdrawals + overallRevenue?.thisYearsWithdrawals,
    revenueToday: overallRevenue?.todaysWithdrawals,
    revenueYesterday: overallRevenue?.yesterdaysWithdrawals,
    revenueThisWeek: overallRevenue?.thisWeeksWithdrawals,
    revenueLastWeek: overallRevenue?.lastWeeksWithdrawals,
    revenueThisMonth: overallRevenue?.thisMonthsWithdrawals,
    revenueLastMonth: overallRevenue?.lastMonthsWithdrawals,
    revenueThisYear: overallRevenue?.thisYearsWithdrawals,
    revenueLastYear: overallRevenue?.lastYearsWithdrawals
  };
  
//   Object.entries(overallRevenue).forEach(([title, details]) => {
//     if (title.includes("Withdrawal") && !title.includes("Refund")) {
//       console.log('title', title, details);  
//       withdrawalData.totalRevenue += Math.abs(details.totalRevenue);
//       withdrawalData.revenueToday += Math.abs(details.revenueToday);
//       withdrawalData.revenueYesterday += Math.abs(details.revenueYesterday);
//       withdrawalData.revenueThisWeek += Math.abs(details.revenueThisWeek);
//       withdrawalData.revenueLastWeek += Math.abs(details.revenueLastWeek);
//       withdrawalData.revenueThisMonth += Math.abs(details.revenueThisMonth);
//       withdrawalData.revenueLastMonth += Math.abs(details.revenueLastMonth);
//       withdrawalData.revenueThisYear += Math.abs(details.revenueThisYear);
//       withdrawalData.revenueLastYear += Math.abs(details.revenueLastYear);
//     }
//   });
  
  console.log(withdrawalData);

  const purchaseToday = Math.abs(overallRevenue["TestZone Fee"].revenueToday + overallRevenue["Bought TenX Trading Subscription"].revenueToday + overallRevenue["MarginX Fee"].revenueToday + overallRevenue["Battle Fee"].revenueToday)
  const purchaseYesterday = Math.abs(overallRevenue["TestZone Fee"].revenueYesterday + overallRevenue["Bought TenX Trading Subscription"].revenueYesterday + overallRevenue["MarginX Fee"].revenueYesterday + overallRevenue["Battle Fee"].revenueYesterday)
  const purchaseThisWeek = Math.abs(overallRevenue["TestZone Fee"].revenueThisWeek + overallRevenue["Bought TenX Trading Subscription"].revenueThisWeek + overallRevenue["MarginX Fee"].revenueThisWeek + overallRevenue["Battle Fee"].revenueThisWeek)
  const purchaseLastWeek = Math.abs(overallRevenue["TestZone Fee"].revenueLastWeek + overallRevenue["Bought TenX Trading Subscription"].revenueLastWeek + overallRevenue["MarginX Fee"].revenueLastWeek + overallRevenue["Battle Fee"].revenueLastWeek)
  const purchaseThisMonth = Math.abs(overallRevenue["TestZone Fee"].revenueThisMonth + overallRevenue["Bought TenX Trading Subscription"].revenueThisMonth + overallRevenue["MarginX Fee"].revenueThisMonth + overallRevenue["Battle Fee"].revenueThisMonth)
  const purchaseLastMonth = Math.abs(overallRevenue["TestZone Fee"].revenueLastMonth + overallRevenue["Bought TenX Trading Subscription"].revenueLastMonth + overallRevenue["MarginX Fee"].revenueLastMonth + overallRevenue["Battle Fee"].revenueLastMonth)
  const purchaseThisYear = Math.abs(overallRevenue["TestZone Fee"].revenueThisYear + overallRevenue["Bought TenX Trading Subscription"].revenueThisYear + overallRevenue["MarginX Fee"].revenueThisYear + overallRevenue["Battle Fee"].revenueThisYear)
  const purchaseLastYear = Math.abs(overallRevenue["TestZone Fee"].revenueLastYear + overallRevenue["Bought TenX Trading Subscription"].revenueLastYear + overallRevenue["MarginX Fee"].revenueLastYear + overallRevenue["Battle Fee"].revenueLastYear)
  const totalPurchase = Math.abs(overallRevenue["TestZone Fee"].totalRevenue + overallRevenue["Bought TenX Trading Subscription"].totalRevenue + overallRevenue["MarginX Fee"].totalRevenue + overallRevenue["Battle Fee"].totalRevenue)

  const contestpurchaseToday = Math.abs(overallRevenue["TestZone Fee"].revenueToday)
  const contestpurchaseYesterday = Math.abs(overallRevenue["TestZone Fee"].revenueYesterday)
  const contestpurchaseThisWeek = Math.abs(overallRevenue["TestZone Fee"].revenueThisWeek)
  const contestpurchaseLastWeek = Math.abs(overallRevenue["TestZone Fee"].revenueLastWeek)
  const contestpurchaseThisMonth = Math.abs(overallRevenue["TestZone Fee"].revenueThisMonth)
  const contestpurchaseLastMonth = Math.abs(overallRevenue["TestZone Fee"].revenueLastMonth)
  const contestpurchaseThisYear = Math.abs(overallRevenue["TestZone Fee"].revenueThisYear)
  const contestpurchaseLastYear = Math.abs(overallRevenue["TestZone Fee"].revenueLastYear)
  const contesttotalPurchase = Math.abs(overallRevenue["TestZone Fee"].totalRevenue)

  const marginXpurchaseToday = Math.abs(overallRevenue["MarginX Fee"].revenueToday)
  const marginXpurchaseYesterday = Math.abs(overallRevenue["MarginX Fee"].revenueYesterday)
  const marginXpurchaseThisWeek = Math.abs(overallRevenue["MarginX Fee"].revenueThisWeek)
  const marginXpurchaseLastWeek = Math.abs(overallRevenue["MarginX Fee"].revenueLastWeek)
  const marginXpurchaseThisMonth = Math.abs(overallRevenue["MarginX Fee"].revenueThisMonth)
  const marginXpurchaseLastMonth = Math.abs(overallRevenue["MarginX Fee"].revenueLastMonth)
  const marginXpurchaseThisYear = Math.abs(overallRevenue["MarginX Fee"].revenueThisYear)
  const marginXpurchaseLastYear = Math.abs(overallRevenue["MarginX Fee"].revenueLastYear)
  const marginXtotalPurchase = Math.abs(overallRevenue["MarginX Fee"].totalRevenue)

  const battlepurchaseToday = Math.abs(overallRevenue["Battle Fee"].revenueToday)
  const battlepurchaseYesterday = Math.abs(overallRevenue["Battle Fee"].revenueYesterday)
  const battlepurchaseThisWeek = Math.abs(overallRevenue["Battle Fee"].revenueThisWeek)
  const battlepurchaseLastWeek = Math.abs(overallRevenue["Battle Fee"].revenueLastWeek)
  const battlepurchaseThisMonth = Math.abs(overallRevenue["Battle Fee"].revenueThisMonth)
  const battlepurchaseLastMonth = Math.abs(overallRevenue["Battle Fee"].revenueLastMonth)
  const battlepurchaseThisYear = Math.abs(overallRevenue["Battle Fee"].revenueThisYear)
  const battlepurchaseLastYear = Math.abs(overallRevenue["Battle Fee"].revenueLastYear)
  const battletotalPurchase = Math.abs(overallRevenue["Battle Fee"].totalRevenue)

  const tenxpurchaseToday = Math.abs(overallRevenue["Bought TenX Trading Subscription"].revenueToday)
  const tenxpurchaseYesterday = Math.abs(overallRevenue["Bought TenX Trading Subscription"].revenueYesterday)
  const tenxpurchaseThisWeek = Math.abs(overallRevenue["Bought TenX Trading Subscription"].revenueThisWeek)
  const tenxpurchaseLastWeek = Math.abs(overallRevenue["Bought TenX Trading Subscription"].revenueLastWeek)
  const tenxpurchaseThisMonth = Math.abs(overallRevenue["Bought TenX Trading Subscription"].revenueThisMonth)
  const tenxpurchaseLastMonth = Math.abs(overallRevenue["Bought TenX Trading Subscription"].revenueLastMonth)
  const tenxpurchaseThisYear = Math.abs(overallRevenue["Bought TenX Trading Subscription"].revenueThisYear)
  const tenxpurchaseLastYear = Math.abs(overallRevenue["Bought TenX Trading Subscription"].revenueLastYear)
  const tenxtotalPurchase = Math.abs(overallRevenue["Bought TenX Trading Subscription"].totalRevenue)

  return (
    
            <Grid container spacing={.5} p={0.5} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Purchase (Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={purchaseToday > purchaseYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(purchaseToday)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(purchaseYesterday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={purchaseToday > purchaseYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((purchaseToday-purchaseYesterday)/(purchaseYesterday === 0 ? purchaseToday : purchaseYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{purchaseToday > purchaseYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Purchase (Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={purchaseThisWeek > purchaseLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(purchaseThisWeek)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(purchaseLastWeek)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={purchaseThisWeek > purchaseLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(purchaseThisWeek-purchaseLastWeek))/(purchaseLastWeek)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{purchaseThisWeek > purchaseLastWeek ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last week</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Purchase (Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={purchaseThisMonth > purchaseLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(purchaseThisMonth)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(purchaseLastMonth)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={purchaseThisMonth > purchaseLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(purchaseThisMonth-purchaseLastMonth))/(purchaseLastMonth === 0 ? purchaseThisMonth : purchaseLastMonth)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{purchaseThisMonth > purchaseLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last month</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Purchase (Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={purchaseThisYear > purchaseLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(purchaseThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={purchaseThisYear > purchaseLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(purchaseThisYear-purchaseLastYear))/(purchaseLastYear === 0 ? purchaseThisYear : purchaseLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{purchaseThisYear > purchaseLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total Purchase
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalPurchase)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(revenueThisMonth-revenueLastMonth))/(revenueLastMonth === 0 ? revenueThisMonth : revenueLastMonth)*100).toFixed(0)}%</span>&nbsp; */}
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{revenueThisMonth > revenueLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp; */}
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>and growing</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                TestZone Fee (Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={contestpurchaseToday > contestpurchaseYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(contestpurchaseToday)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(contestpurchaseYesterday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={contestpurchaseToday > contestpurchaseYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((contestpurchaseToday-contestpurchaseYesterday)/(contestpurchaseYesterday === 0 ? contestpurchaseToday : contestpurchaseYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{contestpurchaseToday > contestpurchaseYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                TestZone Fee (Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={contestpurchaseThisWeek > contestpurchaseLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(contestpurchaseThisWeek)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(contestpurchaseLastWeek)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={contestpurchaseThisWeek > contestpurchaseLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(contestpurchaseThisWeek-contestpurchaseLastWeek))/(contestpurchaseLastWeek)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{contestpurchaseThisWeek > contestpurchaseLastWeek ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last week</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                TestZone Fee (Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={contestpurchaseThisMonth > contestpurchaseLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(contestpurchaseThisMonth)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(contestpurchaseLastMonth)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={contestpurchaseThisMonth > contestpurchaseLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(contestpurchaseThisMonth-contestpurchaseLastMonth))/(contestpurchaseLastMonth === 0 ? contestpurchaseThisMonth : contestpurchaseLastMonth)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{contestpurchaseThisMonth > contestpurchaseLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last month</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                TestZone Fee (Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={contestpurchaseThisYear > contestpurchaseLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(contestpurchaseThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={contestpurchaseThisYear > contestpurchaseLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(contestpurchaseThisYear-contestpurchaseLastYear))/(contestpurchaseLastYear === 0 ? contestpurchaseThisYear : contestpurchaseLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{contestpurchaseThisYear > contestpurchaseLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total TestZone Fee
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(contesttotalPurchase)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(revenueThisMonth-revenueLastMonth))/(revenueLastMonth === 0 ? revenueThisMonth : revenueLastMonth)*100).toFixed(0)}%</span>&nbsp; */}
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{revenueThisMonth > revenueLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp; */}
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>and growing</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                TenX Fee (Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={tenxpurchaseToday > tenxpurchaseYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tenxpurchaseToday)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tenxpurchaseYesterday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={tenxpurchaseToday > tenxpurchaseYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((tenxpurchaseToday-tenxpurchaseYesterday)/(tenxpurchaseYesterday === 0 ? tenxpurchaseToday : tenxpurchaseYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{tenxpurchaseToday > tenxpurchaseYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                TenX Fee (Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={tenxpurchaseThisWeek > tenxpurchaseLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tenxpurchaseThisWeek)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tenxpurchaseLastWeek)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={tenxpurchaseThisWeek > tenxpurchaseLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(tenxpurchaseThisWeek-tenxpurchaseLastWeek))/(tenxpurchaseLastWeek)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{tenxpurchaseThisWeek > tenxpurchaseLastWeek ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last week</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                TenX Fee (Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={tenxpurchaseThisMonth > tenxpurchaseLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tenxpurchaseThisMonth)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tenxpurchaseLastMonth)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={tenxpurchaseThisMonth > tenxpurchaseLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(tenxpurchaseThisMonth-tenxpurchaseLastMonth))/(tenxpurchaseLastMonth === 0 ? tenxpurchaseThisMonth : tenxpurchaseLastMonth)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{tenxpurchaseThisMonth > tenxpurchaseLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last month</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                TenX Fee (Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={tenxpurchaseThisYear > tenxpurchaseLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tenxpurchaseThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={tenxpurchaseThisYear > tenxpurchaseLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(tenxpurchaseThisYear-tenxpurchaseLastYear))/(tenxpurchaseLastYear === 0 ? tenxpurchaseThisYear : tenxpurchaseLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{tenxpurchaseThisYear > tenxpurchaseLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total TenX Fee
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tenxtotalPurchase)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(revenueThisMonth-revenueLastMonth))/(revenueLastMonth === 0 ? revenueThisMonth : revenueLastMonth)*100).toFixed(0)}%</span>&nbsp; */}
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{revenueThisMonth > revenueLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp; */}
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>and growing</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>
                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                MarginX Fee (Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={marginXpurchaseToday > marginXpurchaseYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(marginXpurchaseToday)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(marginXpurchaseYesterday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={marginXpurchaseToday > marginXpurchaseYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((marginXpurchaseToday-marginXpurchaseYesterday)/(marginXpurchaseYesterday === 0 ? marginXpurchaseToday : marginXpurchaseYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{marginXpurchaseToday > marginXpurchaseYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                MarginX Fee (Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={marginXpurchaseThisWeek > marginXpurchaseLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(marginXpurchaseThisWeek)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(marginXpurchaseLastWeek)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={marginXpurchaseThisWeek > marginXpurchaseLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(marginXpurchaseThisWeek-marginXpurchaseLastWeek))/(marginXpurchaseLastWeek)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{marginXpurchaseThisWeek > marginXpurchaseLastWeek ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last week</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                MarginX Fee (Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={marginXpurchaseThisMonth > marginXpurchaseLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(marginXpurchaseThisMonth)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(marginXpurchaseLastMonth)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={marginXpurchaseThisMonth > marginXpurchaseLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(marginXpurchaseThisMonth-marginXpurchaseLastMonth))/(marginXpurchaseLastMonth === 0 ? marginXpurchaseThisMonth : marginXpurchaseLastMonth)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{marginXpurchaseThisMonth > marginXpurchaseLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last month</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                MarginX Fee (Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={marginXpurchaseThisYear > marginXpurchaseLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(marginXpurchaseThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={marginXpurchaseThisYear > marginXpurchaseLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(marginXpurchaseThisYear-marginXpurchaseLastYear))/(marginXpurchaseLastYear === 0 ? marginXpurchaseThisYear : marginXpurchaseLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{marginXpurchaseThisYear > marginXpurchaseLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total MarginX Fee
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(marginXtotalPurchase)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(revenueThisMonth-revenueLastMonth))/(revenueLastMonth === 0 ? revenueThisMonth : revenueLastMonth)*100).toFixed(0)}%</span>&nbsp; */}
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{revenueThisMonth > revenueLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp; */}
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>and growing</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>
                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Battle Fee (Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={battlepurchaseToday > battlepurchaseYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(battlepurchaseToday)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(battlepurchaseYesterday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={battlepurchaseToday > battlepurchaseYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((battlepurchaseToday-battlepurchaseYesterday)/(battlepurchaseYesterday === 0 ? battlepurchaseToday : battlepurchaseYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{battlepurchaseToday > battlepurchaseYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Battle Fee (Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={battlepurchaseThisWeek > battlepurchaseLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(battlepurchaseThisWeek)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(battlepurchaseLastWeek)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={battlepurchaseThisWeek > battlepurchaseLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(battlepurchaseThisWeek-battlepurchaseLastWeek))/(battlepurchaseLastWeek)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{battlepurchaseThisWeek > battlepurchaseLastWeek ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last week</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Battle Fee (Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={battlepurchaseThisMonth > battlepurchaseLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(battlepurchaseThisMonth)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(battlepurchaseLastMonth)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={battlepurchaseThisMonth > battlepurchaseLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(battlepurchaseThisMonth-battlepurchaseLastMonth))/(battlepurchaseLastMonth === 0 ? battlepurchaseThisMonth : battlepurchaseLastMonth)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{battlepurchaseThisMonth > battlepurchaseLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last month</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Battle Fee (Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={battlepurchaseThisYear > battlepurchaseLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(battlepurchaseThisYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={battlepurchaseThisYear > battlepurchaseLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(battlepurchaseThisYear-battlepurchaseLastYear))/(battlepurchaseLastYear === 0 ? battlepurchaseThisYear : battlepurchaseLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{battlepurchaseThisYear > battlepurchaseLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total Battle Fee
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(battletotalPurchase)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(revenueThisMonth-revenueLastMonth))/(revenueLastMonth === 0 ? revenueThisMonth : revenueLastMonth)*100).toFixed(0)}%</span>&nbsp; */}
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{revenueThisMonth > revenueLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp; */}
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>and growing</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>
                
                {/*  */}
                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Wallet Credit (Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue["Amount Credit"]?.revenueToday > overallRevenue["Amount Credit"]?.revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Amount Credit"].revenueToday)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Amount Credit"].revenueYesterday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Amount Credit"].revenueToday > overallRevenue["Amount Credit"].revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Amount Credit"].revenueToday-overallRevenue["Amount Credit"].revenueYesterday))/(overallRevenue["Amount Credit"].revenueYesterday === 0 ? overallRevenue["Amount Credit"].revenueToday : overallRevenue["Amount Credit"].revenueYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Amount Credit"].revenueToday > overallRevenue["Amount Credit"].revenueYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Wallet Credit (Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue["Amount Credit"].revenueThisWeek > overallRevenue["Amount Credit"].revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Amount Credit"].revenueThisWeek)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Amount Credit"].revenueLastWeek)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Amount Credit"].revenueThisWeek > overallRevenue["Amount Credit"].revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Amount Credit"].revenueThisWeek-overallRevenue["Amount Credit"].revenueLastWeek))/(overallRevenue["Amount Credit"].revenueLastWeek === 0 ? overallRevenue["Amount Credit"].revenueThisWeek : overallRevenue["Amount Credit"].revenueLastWeek)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Amount Credit"].revenueThisWeek > overallRevenue["Amount Credit"].revenueLastWeek ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from week</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Wallet Credit (Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue["Amount Credit"].revenueThisMonth > overallRevenue["Amount Credit"].revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Amount Credit"].revenueThisMonth)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Amount Credit"].revenueLastMonth)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Amount Credit"].revenueThisMonth > overallRevenue["Amount Credit"].revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Amount Credit"].revenueThisMonth-overallRevenue["Amount Credit"].revenueLastMonth))/(overallRevenue["Amount Credit"].revenueLastMonth === 0 ? overallRevenue["Amount Credit"].revenueThisMonth : overallRevenue["Amount Credit"].revenueLastMonth)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Amount Credit"].revenueThisMonth > overallRevenue["Amount Credit"].revenueLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last month</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Wallet Credit (Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue["Amount Credit"].revenueThisYear > overallRevenue["Amount Credit"].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Amount Credit"].revenueThisYear)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Amount Credit"].revenueLastYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Amount Credit"].revenueThisYear > overallRevenue["Amount Credit"].revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Amount Credit"].revenueThisYear-overallRevenue["Amount Credit"].revenueLastYear))/(overallRevenue["Amount Credit"].revenueLastYear === 0 ? overallRevenue["Amount Credit"].revenueThisYear : overallRevenue["Amount Credit"].revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Amount Credit"].revenueThisYear > overallRevenue["Amount Credit"].revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total Wallet Credit
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Amount Credit"].totalRevenue)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Amount Credit"].revenueThisMonth-overallRevenue["Amount Credit"].revenueLastMonth))/(overallRevenue["Amount Credit"].revenueLastMonth === 0 ? overallRevenue["Amount Credit"].revenueThisMonth : overallRevenue["Amount Credit"].revenueLastMonth)*100).toFixed(0)}%</span>&nbsp; */}
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Amount Credit"].revenueThisMonth > overallRevenue["Amount Credit"].revenueLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp; */}
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>and growing</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                TestZone Payout (Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue["TestZone Credit"]?.revenueToday > overallRevenue["TestZone Credit"]?.revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TestZone Credit"]?.revenueToday)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TestZone Credit"]?.revenueYesterday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["TestZone Credit"]?.revenueToday > overallRevenue["TestZone Credit"]?.revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["TestZone Credit"]?.revenueToday-overallRevenue["TestZone Credit"]?.revenueYesterday))/(overallRevenue["TestZone Credit"]?.revenueYesterday === 0 ? overallRevenue["TestZone Credit"]?.revenueToday : overallRevenue["TestZone Credit"]?.revenueYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["TestZone Credit"]?.revenueToday > overallRevenue["TestZone Credit"]?.revenueYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                TestZone Payout (Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue["TestZone Credit"]?.revenueThisWeek > overallRevenue["TestZone Credit"]?.revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TestZone Credit"]?.revenueThisWeek)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TestZone Credit"]?.revenueLastWeek)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["TestZone Credit"]?.revenueThisWeek > overallRevenue["TestZone Credit"]?.revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["TestZone Credit"]?.revenueThisWeek-overallRevenue["TestZone Credit"]?.revenueLastWeek))/(overallRevenue["TestZone Credit"]?.revenueLastWeek === 0 ? overallRevenue["TestZone Credit"]?.revenueThisWeek : overallRevenue["TestZone Credit"]?.revenueLastWeek)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["TestZone Credit"]?.revenueThisWeek > overallRevenue["TestZone Credit"]?.revenueLastWeek ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last week</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                TestZone Payout (Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue["TestZone Credit"]?.revenueThisMonth > overallRevenue["TestZone Credit"]?.revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TestZone Credit"]?.revenueThisMonth)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TestZone Credit"]?.revenueLastMonth)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["TestZone Credit"]?.revenueThisMonth > overallRevenue["TestZone Credit"]?.revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["TestZone Credit"]?.revenueThisMonth-overallRevenue["TestZone Credit"]?.revenueLastMonth))/(overallRevenue["TestZone Credit"]?.revenueLastMonth === 0 ? overallRevenue["TestZone Credit"]?.revenueThisMonth : overallRevenue["TestZone Credit"]?.revenueLastMonth)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["TestZone Credit"]?.revenueThisMonth > overallRevenue["TestZone Credit"]?.revenueLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last month</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                              TestZone Payout (Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue["TestZone Credit"]?.revenueThisYear > overallRevenue["TestZone Credit"]?.revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TestZone Credit"]?.revenueThisYear)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TestZone Credit"]?.revenueLastYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["TestZone Credit"]?.revenueThisYear > overallRevenue["TestZone Credit"]?.revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["TestZone Credit"]?.revenueThisYear-overallRevenue["TestZone Credit"]?.revenueLastYear))/(overallRevenue["TestZone Credit"]?.revenueLastYear === 0 ? overallRevenue["TestZone Credit"]?.revenueThisYear : overallRevenue["TestZone Credit"]?.revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["TestZone Credit"]?.revenueThisYear > overallRevenue["TestZone Credit"]?.revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total TestZone Payout
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TestZone Credit"]?.totalRevenue)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Contest Credit"]?.revenueThisYear-overallRevenue["Contest Credit"]?.revenueLastYear))/(overallRevenue["Contest Credit"]?.revenueLastYear === 0 ? overallRevenue["Contest Credit"]?.revenueThisYear : overallRevenue["Contest Credit"]?.revenueLastYear)*100).toFixed(0)}%</span>&nbsp; */}
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Contest Credit"]?.revenueThisYear > overallRevenue["Contest Credit"]?.revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp; */}
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>and growing</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                MarginX Payout (Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue["Marginx Credit"]?.revenueToday > overallRevenue["Marginx Credit"]?.revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Marginx Credit"]?.revenueToday)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Marginx Credit"]?.revenueYesterday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Marginx Credit"]?.revenueToday > overallRevenue["Marginx Credit"]?.revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Marginx Credit"]?.revenueToday-overallRevenue["Marginx Credit"]?.revenueYesterday))/(overallRevenue["Marginx Credit"]?.revenueYesterday === 0 ? overallRevenue["Marginx Credit"]?.revenueToday : overallRevenue["Marginx Credit"]?.revenueYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Marginx Credit"]?.revenueToday > overallRevenue["Marginx Credit"]?.revenueYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                MarginX Payout (Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue["Marginx Credit"]?.revenueThisWeek > overallRevenue["Marginx Credit"]?.revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Marginx Credit"]?.revenueThisWeek)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Marginx Credit"]?.revenueLastWeek)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Marginx Credit"]?.revenueThisWeek > overallRevenue["Marginx Credit"]?.revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Marginx Credit"]?.revenueThisWeek-overallRevenue["Marginx Credit"]?.revenueLastWeek))/(overallRevenue["Marginx Credit"]?.revenueLastWeek === 0 ? overallRevenue["Marginx Credit"]?.revenueThisWeek : overallRevenue["Marginx Credit"]?.revenueLastWeek)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Marginx Credit"]?.revenueThisWeek > overallRevenue["Marginx Credit"]?.revenueLastWeek ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last week</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                MarginX Payout (Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue["Marginx Credit"]?.revenueThisMonth > overallRevenue["Marginx Credit"]?.revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Marginx Credit"]?.revenueThisMonth)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Marginx Credit"]?.revenueLastMonth)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Marginx Credit"]?.revenueThisMonth > overallRevenue["Marginx Credit"]?.revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Marginx Credit"]?.revenueThisMonth-overallRevenue["Marginx Credit"]?.revenueLastMonth))/(overallRevenue["Marginx Credit"]?.revenueLastMonth === 0 ? overallRevenue["Marginx Credit"]?.revenueThisMonth : overallRevenue["Marginx Credit"]?.revenueLastMonth)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Marginx Credit"]?.revenueThisMonth > overallRevenue["Marginx Credit"]?.revenueLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last month</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                MarginX Payout (Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue["Marginx Credit"]?.revenueThisYear > overallRevenue["Marginx Credit"]?.revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Marginx Credit"]?.revenueThisYear)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Marginx Credit"]?.revenueLastYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Marginx Credit"]?.revenueThisYear > overallRevenue["Marginx Credit"]?.revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Marginx Credit"]?.revenueThisYear-overallRevenue["Marginx Credit"]?.revenueLastYear))/(overallRevenue["Marginx Credit"]?.revenueLastYear === 0 ? overallRevenue["Marginx Credit"]?.revenueThisYear : overallRevenue["Marginx Credit"]?.revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Marginx Credit"]?.revenueThisYear > overallRevenue["Marginx Credit"]?.revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total MarginX Payout
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Marginx Credit"]?.totalRevenue)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["TenX Trading Payout"]?.revenueThisYear-overallRevenue["TenX Trading Payout"]?.revenueLastYear))/(overallRevenue["TenX Trading Payout"]?.revenueLastYear === 0 ? overallRevenue["TenX Trading Payout"]?.revenueThisYear : overallRevenue["TenX Trading Payout"]?.revenueLastYear)*100).toFixed(0)}%</span>&nbsp; */}
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["TenX Trading Payout"]?.revenueThisYear > overallRevenue["TenX Trading Payout"]?.revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp; */}
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>and growing</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>
                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Battle Payout (Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue["Battle Credit"]?.revenueToday > overallRevenue["Battle Credit"]?.revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Battle Credit"]?.revenueToday)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Battle Credit"]?.revenueYesterday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Battle Credit"]?.revenueToday > overallRevenue["Battle Credit"]?.revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Battle Credit"]?.revenueToday-overallRevenue["Battle Credit"]?.revenueYesterday))/(overallRevenue["Battle Credit"]?.revenueYesterday === 0 ? overallRevenue["Battle Credit"]?.revenueToday : overallRevenue["Battle Credit"]?.revenueYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Battle Credit"]?.revenueToday > overallRevenue["Battle Credit"]?.revenueYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Battle Payout (Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue["Battle Credit"]?.revenueThisWeek > overallRevenue["Battle Credit"]?.revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Battle Credit"]?.revenueThisWeek)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Battle Credit"]?.revenueLastWeek)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Battle Credit"]?.revenueThisWeek > overallRevenue["Battle Credit"]?.revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Battle Credit"]?.revenueThisWeek-overallRevenue["Battle Credit"]?.revenueLastWeek))/(overallRevenue["Battle Credit"]?.revenueLastWeek === 0 ? overallRevenue["Battle Credit"]?.revenueThisWeek : overallRevenue["Battle Credit"]?.revenueLastWeek)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Battle Credit"]?.revenueThisWeek > overallRevenue["TenX Trading Payout"]?.revenueLastWeek ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last week</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Battle Payout (Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue["Battle Credit"]?.revenueThisMonth > overallRevenue["Battle Credit"]?.revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Battle Credit"]?.revenueThisMonth)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Battle Credit"]?.revenueLastMonth)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Battle Credit"]?.revenueThisMonth > overallRevenue["Battle Credit"]?.revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Battle Credit"]?.revenueThisMonth-overallRevenue["Battle Credit"]?.revenueLastMonth))/(overallRevenue["Battle Credit"]?.revenueLastMonth === 0 ? overallRevenue["Battle Credit"]?.revenueThisMonth : overallRevenue["Battle Credit"]?.revenueLastMonth)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Battle Credit"]?.revenueThisMonth > overallRevenue["Battle Credit"]?.revenueLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last month</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Battle Payout (Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={overallRevenue["Battle Credit"]?.revenueThisYear > overallRevenue["Battle Credit"]?.revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Battle Credit"]?.revenueThisYear)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Battle Credit"]?.revenueLastYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Battle Credit"]?.revenueThisYear > overallRevenue["Battle Credit"]?.revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Battle Credit"]?.revenueThisYear-overallRevenue["Battle Credit"]?.revenueLastYear))/(overallRevenue["Battle Credit"]?.revenueLastYear === 0 ? overallRevenue["Battle Credit"]?.revenueThisYear : overallRevenue["Battle Credit"]?.revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Battle Credit"]?.revenueThisYear > overallRevenue["Battle Credit"]?.revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total Battle Payout
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Battle Credit"]?.totalRevenue)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["TenX Trading Payout"]?.revenueThisYear-overallRevenue["TenX Trading Payout"]?.revenueLastYear))/(overallRevenue["TenX Trading Payout"]?.revenueLastYear === 0 ? overallRevenue["TenX Trading Payout"]?.revenueThisYear : overallRevenue["TenX Trading Payout"]?.revenueLastYear)*100).toFixed(0)}%</span>&nbsp; */}
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["TenX Trading Payout"]?.revenueThisYear > overallRevenue["TenX Trading Payout"]?.revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp; */}
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>and growing</span>
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
                            <MDTypography fontSize={13} color={overallRevenue["TenX Trading Payout"]?.revenueToday > overallRevenue["TenX Trading Payout"]?.revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TenX Trading Payout"]?.revenueToday)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TenX Trading Payout"]?.revenueYesterday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["TenX Trading Payout"]?.revenueToday > overallRevenue["TenX Trading Payout"]?.revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["TenX Trading Payout"]?.revenueToday-overallRevenue["TenX Trading Payout"]?.revenueYesterday))/(overallRevenue["TenX Trading Payout"]?.revenueYesterday === 0 ? overallRevenue["TenX Trading Payout"]?.revenueToday : overallRevenue["TenX Trading Payout"]?.revenueYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["TenX Trading Payout"]?.revenueToday > overallRevenue["TenX Trading Payout"]?.revenueYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
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
                            <MDTypography fontSize={13} color={overallRevenue["TenX Trading Payout"]?.revenueThisWeek > overallRevenue["TenX Trading Payout"]?.revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TenX Trading Payout"]?.revenueThisWeek)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TenX Trading Payout"]?.revenueLastWeek)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["TenX Trading Payout"]?.revenueThisWeek > overallRevenue["TenX Trading Payout"]?.revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["TenX Trading Payout"]?.revenueThisWeek-overallRevenue["TenX Trading Payout"]?.revenueLastWeek))/(overallRevenue["TenX Trading Payout"]?.revenueLastWeek === 0 ? overallRevenue["TenX Trading Payout"]?.revenueThisWeek : overallRevenue["TenX Trading Payout"]?.revenueLastWeek)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["TenX Trading Payout"]?.revenueThisWeek > overallRevenue["TenX Trading Payout"]?.revenueLastWeek ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last week</span>
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
                            <MDTypography fontSize={13} color={overallRevenue["TenX Trading Payout"]?.revenueThisMonth > overallRevenue["TenX Trading Payout"]?.revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TenX Trading Payout"]?.revenueThisMonth)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TenX Trading Payout"]?.revenueLastMonth)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["TenX Trading Payout"]?.revenueThisMonth > overallRevenue["TenX Trading Payout"]?.revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["TenX Trading Payout"]?.revenueThisMonth-overallRevenue["TenX Trading Payout"]?.revenueLastMonth))/(overallRevenue["TenX Trading Payout"]?.revenueLastMonth === 0 ? overallRevenue["TenX Trading Payout"]?.revenueThisMonth : overallRevenue["TenX Trading Payout"]?.revenueLastMonth)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["TenX Trading Payout"]?.revenueThisMonth > overallRevenue["TenX Trading Payout"]?.revenueLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last month</span>
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
                            <MDTypography fontSize={13} color={overallRevenue["TenX Trading Payout"]?.revenueThisYear > overallRevenue["TenX Trading Payout"]?.revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TenX Trading Payout"]?.revenueThisYear)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TenX Trading Payout"]?.revenueLastYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["TenX Trading Payout"]?.revenueThisYear > overallRevenue["TenX Trading Payout"]?.revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["TenX Trading Payout"]?.revenueThisYear-overallRevenue["TenX Trading Payout"]?.revenueLastYear))/(overallRevenue["TenX Trading Payout"]?.revenueLastYear === 0 ? overallRevenue["TenX Trading Payout"]?.revenueThisYear : overallRevenue["TenX Trading Payout"]?.revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["TenX Trading Payout"]?.revenueThisYear > overallRevenue["TenX Trading Payout"]?.revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
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
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["TenX Trading Payout"]?.totalRevenue)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["TenX Trading Payout"]?.revenueThisYear-overallRevenue["TenX Trading Payout"]?.revenueLastYear))/(overallRevenue["TenX Trading Payout"]?.revenueLastYear === 0 ? overallRevenue["TenX Trading Payout"]?.revenueThisYear : overallRevenue["TenX Trading Payout"]?.revenueLastYear)*100).toFixed(0)}%</span>&nbsp; */}
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["TenX Trading Payout"]?.revenueThisYear > overallRevenue["TenX Trading Payout"]?.revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp; */}
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>and growing</span>
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
                            <MDTypography fontSize={13} color={overallRevenue["Internship Payout"]?.revenueToday > overallRevenue["Internship Payout"]?.revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Internship Payout"]?.revenueToday)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Internship Payout"]?.revenueYesterday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Internship Payout"]?.revenueToday > overallRevenue["Internship Payout"]?.revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{isNaN(((Math.abs((overallRevenue["Internship Payout"]?.revenueToday)-(overallRevenue["Internship Payout"]?.revenueYesterday)))/(overallRevenue["Internship Payout"]?.revenueYesterday)*100).toFixed(0)) ? 0 : ((Math.abs((overallRevenue["Internship Payout"]?.revenueToday??0)-(overallRevenue["Internship Payout"]?.revenueYesterday??0)))/(overallRevenue["Internship Payout"]?.revenueYesterday??0 === 0 ? overallRevenue["Internship Payout"]?.revenueToday??0 : overallRevenue["Internship Payout"]?.revenueYesterday??0)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Internship Payout"]?.revenueToday > overallRevenue["Internship Payout"]?.revenueYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
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
                            <MDTypography fontSize={13} color={overallRevenue["Internship Payout"]?.revenueThisWeek > overallRevenue["Internship Payout"]?.revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Internship Payout"]?.revenueThisWeek)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Internship Payout"]?.revenueLastWeek)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Internship Payout"]?.revenueThisWeek > overallRevenue["Internship Payout"]?.revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{isNaN(((Math.abs((overallRevenue["Internship Payout"]?.revenueThisWeek??0)-(overallRevenue["Internship Payout"]?.revenueLastWeek??0)))/(overallRevenue["Internship Payout"]?.revenueLastWeek??0 === 0 ? overallRevenue["Internship Payout"]?.revenueThisWeek??0 : overallRevenue["Internship Payout"]?.revenueLastWeek??0)*100).toFixed(0)) ? 0 : ((Math.abs((overallRevenue["Internship Payout"]?.revenueThisWeek??0)-(overallRevenue["Internship Payout"]?.revenueLastWeek??0)))/(overallRevenue["Internship Payout"]?.revenueLastWeek??0 === 0 ? overallRevenue["Internship Payout"]?.revenueThisWeek??0 : overallRevenue["Internship Payout"]?.revenueLastWeek??0)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Internship Payout"]?.revenueThisWeek??0 > overallRevenue["Internship Payout"]?.revenueLastWeek??0 ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last week</span>
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
                            <MDTypography fontSize={13} color={overallRevenue["Internship Payout"]?.revenueThisMonth > overallRevenue["Internship Payout"]?.revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Internship Payout"]?.revenueThisMonth)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Internship Payout"]?.revenueLastMonth)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Internship Payout"]?.revenueThisMonth > overallRevenue["Internship Payout"]?.revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Internship Payout"]?.revenueThisMonth-overallRevenue["Internship Payout"]?.revenueLastMonth))/(overallRevenue["Internship Payout"]?.revenueLastMonth === 0 ? overallRevenue["Internship Payout"]?.revenueThisMonth : overallRevenue["Internship Payout"]?.revenueLastMonth)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Internship Payout"]?.revenueThisMonth > overallRevenue["Internship Payout"]?.revenueLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last Month</span>
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
                            <MDTypography fontSize={13} color={overallRevenue["Internship Payout"]?.revenueThisYear > overallRevenue["Internship Payout"]?.revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Internship Payout"]?.revenueThisYear)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Internship Payout"]?.revenueLastYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Internship Payout"]?.revenueThisYear > overallRevenue["Internship Payout"]?.revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Internship Payout"]?.revenueThisYear-overallRevenue["Internship Payout"]?.revenueLastYear))/(overallRevenue["Internship Payout"]?.revenueLastYear === 0 ? overallRevenue["Internship Payout"]?.revenueThisYear : overallRevenue["Internship Payout"]?.revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Internship Payout"]?.revenueThisYear > overallRevenue["Internship Payout"]?.revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
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
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Internship Payout"]?.totalRevenue??0)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Internship Payout"]?.revenueThisYear-overallRevenue["Internship Payout"]?.revenueLastYear))/(overallRevenue["Internship Payout"]?.revenueLastYear === 0 ? overallRevenue["Internship Payout"]?.revenueThisYear : overallRevenue["Internship Payout"]?.revenueLastYear)*100).toFixed(0)}%</span>&nbsp; */}
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Internship Payout"]?.revenueThisYear > overallRevenue["Internship Payout"]?.revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp; */}
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>and growing</span>
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
                            <MDTypography fontSize={13} color={overallRevenue["Referral Credit"]?.revenueToday > overallRevenue["Referral Credit"]?.revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Referral Credit"]?.revenueToday)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Referral Credit"]?.revenueYesterday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Referral Credit"]?.revenueToday > overallRevenue["Referral Credit"]?.revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Referral Credit"]?.revenueToday-overallRevenue["Referral Credit"]?.revenueYesterday))/(overallRevenue["Referral Credit"]?.revenueYesterday === 0 ? overallRevenue["Referral Credit"]?.revenueToday : overallRevenue["Referral Credit"]?.revenueYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Referral Credit"]?.revenueToday > overallRevenue["Referral Credit"]?.revenueYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
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
                            <MDTypography fontSize={13} color={overallRevenue["Referral Credit"]?.revenueThisWeek > overallRevenue["Referral Credit"]?.revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Referral Credit"]?.revenueThisWeek)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Referral Credit"]?.revenueLastWeek)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Referral Credit"]?.revenueThisWeek > overallRevenue["Referral Credit"]?.revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Referral Credit"]?.revenueThisWeek-overallRevenue["Referral Credit"]?.revenueLastWeek))/(overallRevenue["Referral Credit"]?.revenueLastWeek === 0 ? overallRevenue["Referral Credit"]?.revenueThisWeek : overallRevenue["Referral Credit"]?.revenueLastWeek)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Referral Credit"]?.revenueThisWeek > overallRevenue["Referral Credit"]?.revenueLastWeek ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last week</span>
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
                            <MDTypography fontSize={13} color={overallRevenue["Referral Credit"]?.revenueThisMonth > overallRevenue["Referral Credit"]?.revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Referral Credit"]?.revenueThisMonth)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Referral Credit"]?.revenueLastMonth)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Referral Credit"]?.revenueThisMonth > overallRevenue["Referral Credit"]?.revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Referral Credit"]?.revenueThisMonth-overallRevenue["Referral Credit"]?.revenueLastMonth))/(overallRevenue["Referral Credit"]?.revenueLastMonth === 0 ? overallRevenue["Referral Credit"]?.revenueThisMonth : overallRevenue["Referral Credit"]?.revenueLastMonth)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Referral Credit"]?.revenueThisMonth > overallRevenue["Referral Credit"]?.revenueLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last month</span>
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
                            <MDTypography fontSize={13} color={overallRevenue["Referral Credit"]?.revenueThisYear > overallRevenue["Referral Credit"]?.revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Referral Credit"]?.revenueThisYear)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Referral Credit"]?.revenueLastYear)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={overallRevenue["Referral Credit"]?.revenueThisYear > overallRevenue["Referral Credit"]?.revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Referral Credit"]?.revenueThisYear-overallRevenue["Referral Credit"]?.revenueLastYear))/(overallRevenue["Referral Credit"]?.revenueLastYear === 0 ? overallRevenue["Referral Credit"]?.revenueThisYear : overallRevenue["Referral Credit"]?.revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Referral Credit"]?.revenueThisYear > overallRevenue["Referral Credit"]?.revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
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
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue["Referral Credit"]?.totalRevenue)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Referral Credit"]?.revenueThisYear-overallRevenue["Referral Credit"]?.revenueLastYear))/(overallRevenue["Referral Credit"]?.revenueLastYear === 0 ? overallRevenue["Referral Credit"]?.revenueThisYear : overallRevenue["Referral Credit"]?.revenueLastYear)*100).toFixed(0)}%</span>&nbsp; */}
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Referral Credit"]?.revenueThisYear > overallRevenue["Referral Credit"]?.revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp; */}
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>and growing</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>


                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Withdrawals (Today)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={withdrawalData?.revenueToday > withdrawalData?.revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(withdrawalData?.revenueToday)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(withdrawalData?.revenueYesterday)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={withdrawalData?.revenueToday > withdrawalData?.revenueYesterday ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((withdrawalData?.revenueToday-withdrawalData?.revenueYesterday)/(withdrawalData?.revenueYesterday === 0 ? withdrawalData?.revenueToday : withdrawalData?.revenueYesterday)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{withdrawalData?.revenueToday > withdrawalData?.revenueYesterday ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from yesterday</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Withdrawals (Week)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={withdrawalData?.revenueThisWeek > withdrawalData?.revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(withdrawalData?.revenueThisWeek)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(withdrawalData?.revenueLastWeek)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={withdrawalData?.revenueThisWeek > withdrawalData?.revenueLastWeek ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((withdrawalData?.revenueThisWeek-withdrawalData?.revenueLastWeek)/(withdrawalData?.revenueLastWeek === 0 ? withdrawalData?.revenueThisWeek : withdrawalData?.revenueLastWeek)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{withdrawalData?.revenueThisWeek > withdrawalData?.revenueLastWeek ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last week</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Withdrawals (Month)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={withdrawalData?.revenueThisMonth > withdrawalData?.revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(withdrawalData?.revenueThisMonth)} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(withdrawalData?.revenueLastMonth)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={withdrawalData?.revenueThisMonth > withdrawalData?.revenueLastMonth ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((withdrawalData?.revenueThisMonth-withdrawalData?.revenueLastMonth)/(withdrawalData?.revenueLastMonth === 0 ? withdrawalData?.revenueThisMonth : withdrawalData?.revenueLastMonth)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{withdrawalData?.revenueThisMonth > withdrawalData?.revenueLastMonth ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last month</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                              Withdrawals (Year)
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color={withdrawalData?.revenueThisYear > withdrawalData?.revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(withdrawalData?.revenueThisYear))} || ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(withdrawalData?.revenueLastYear))}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color={withdrawalData?.revenueThisYear > withdrawalData?.revenueLastYear ? 'success' : 'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((withdrawalData?.revenueThisYear-withdrawalData?.revenueLastYear)/(withdrawalData?.revenueLastYear === 0 ? withdrawalData?.revenueThisYear : withdrawalData?.revenueLastYear)*100).toFixed(0)}%</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{withdrawalData?.revenueThisYear > overallRevenue["Referral Credit"]?.revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp;
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>from last year</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={3} lg={2.4}>
                    <MDBox bgColor='light' p={1} borderRadius={5} display='flex' justifyContent='center' flexDirection='column' minWidth='100%'>
                        <MDBox>
                            <MDTypography fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>
                                Total Withdrawals
                            </MDTypography>
                        </MDBox>
                        <MDBox>
                            <MDTypography fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                             ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(withdrawalData?.totalRevenue)}
                            </MDTypography>
                            <MDTypography display='flex' justifyContent='center' alignItems='center' fontSize={10} color='success' fontWeight="bold" style={{textAlign:'center'}}>
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{((Math.abs(overallRevenue["Referral Credit"]?.revenueThisYear-overallRevenue["Referral Credit"]?.revenueLastYear))/(overallRevenue["Referral Credit"]?.revenueLastYear === 0 ? overallRevenue["Referral Credit"]?.revenueThisYear : overallRevenue["Referral Credit"]?.revenueLastYear)*100).toFixed(0)}%</span>&nbsp; */}
                                {/* <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{overallRevenue["Referral Credit"]?.revenueThisYear > overallRevenue["Referral Credit"]?.revenueLastYear ? <ArrowUpwardIcon alignItems='center'/> : <ArrowDownwardIcon alignItems='center'/>}</span>&nbsp; */}
                                <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>and growing</span>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </Grid>
          </Grid>
       
  );
}