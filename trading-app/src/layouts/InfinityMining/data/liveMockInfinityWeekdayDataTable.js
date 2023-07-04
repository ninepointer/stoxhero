import React from 'react';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import {Link} from 'react-router-dom'
import { Grid } from '@mui/material';
import moment from 'moment';
import Logo from '../../../assets/images/default-profile.png'
import html2canvas from 'html2canvas';

//data
import LiveMockInfinityDailyData from '../data/liveMockInfinityDailyChart'

export default function InfinityData({bothSideWeeklyTradeData,isLoading}) {    
console.log("Weekly Data:",bothSideWeeklyTradeData)
  return (
    <>  
    {isLoading ? 
            <MDBox style={{ filter: 'blur(2px)' }}>

            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            
            <MDBox style={{border:'1px solid #e91e63', backgroundColor:'#e91e63'}} borderRadius={5} p={0.5} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Weekday</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Gross P&L(S)</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Gross P&L(I)</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Net P&L(S)</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Net P&L(I)</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Net P&L Diff(S-I)</MDTypography>
                </Grid>
            </MDBox>
            
            <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>21-Jan-23</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,00,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,20,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>80,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>90,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>-10,000</MDTypography>
                </Grid>
            </MDBox>

            <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>22-Jan-23</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,00,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,20,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>80,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>90,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>-10,000</MDTypography>
                </Grid>
            </MDBox>

            <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>23-Jan-23</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,00,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,20,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>80,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>90,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>-10,000</MDTypography>
                </Grid>
            </MDBox>

            <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>24-Jan-23</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,00,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,20,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>80,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>90,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>-10,000</MDTypography>
                </Grid>
            </MDBox>

            <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>25-Jan-23</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,00,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>1,20,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>80,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>90,000</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='dark' fontSize={13} fontWeight='bold'>-10,000</MDTypography>
                </Grid>
            </MDBox>
            </Grid>
            </MDBox> 
        :    
            <MDBox id="your-mdbox-component-id" mb={1}>

            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <MDBox style={{border:'1px solid #e91e63', backgroundColor:'#e91e63'}} borderRadius={5} p={0.5} ml={1} mr={1} display='flex' justifyContent='center' width='100%'>

                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Weekday</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Gross P&L(S)</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Gross P&L(I)</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Net P&L(S)</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Net P&L(I)</MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Net P&L Diff(S-I)</MDTypography>
                </Grid>

            </MDBox>
            </Grid>

            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} ml={1} mt={0.5} mr={1} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} fontWeight='bold'>
                        Monday
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Monday?.stoxHero?.gpnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Monday?.stoxHero?.gpnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Monday?.stoxHero?.gpnl ? 
                                (bothSideWeeklyTradeData?.Monday?.stoxHero?.gpnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Monday?.stoxHero?.gpnl >= 0 ? bothSideWeeklyTradeData?.Monday?.stoxHero?.gpnl : -bothSideWeeklyTradeData?.Monday?.stoxHero?.gpnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Monday?.infinity?.gpnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Monday?.infinity?.gpnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Monday?.infinity?.gpnl ? 
                                (bothSideWeeklyTradeData?.Monday?.infinity?.gpnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Monday?.infinity?.gpnl >= 0 ? bothSideWeeklyTradeData?.Monday?.infinity?.gpnl : -bothSideWeeklyTradeData?.Monday?.stoxHero?.gpnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Monday?.stoxHero?.npnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Monday?.stoxHero?.npnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Monday?.stoxHero?.npnl ? 
                                (bothSideWeeklyTradeData?.Monday?.stoxHero?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Monday?.stoxHero?.npnl >= 0 ? bothSideWeeklyTradeData?.Monday?.stoxHero?.npnl : -bothSideWeeklyTradeData?.Monday?.stoxHero?.npnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Monday?.infinity?.npnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Monday?.infinity?.npnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Monday?.infinity?.npnl ? 
                                (bothSideWeeklyTradeData?.Monday?.infinity?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Monday?.infinity?.npnl >= 0 ? bothSideWeeklyTradeData?.Monday?.infinity?.npnl : -bothSideWeeklyTradeData?.Monday?.infinity?.npnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Monday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Monday?.infinity?.npnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Monday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Monday?.infinity?.npnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Monday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Monday?.infinity?.npnl ? 
                                (bothSideWeeklyTradeData?.Monday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Monday?.infinity?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Monday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Monday?.infinity?.npnl >= 0 ? bothSideWeeklyTradeData?.Monday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Monday?.infinity?.npnl : -(bothSideWeeklyTradeData?.Monday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Monday?.infinity?.npnl))
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
            </MDBox>
            </Grid>

            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} ml={1} mt={0.5} mr={1} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} fontWeight='bold'>
                        Tuesday
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Tuesday?.stoxHero?.gpnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Tuesday?.stoxHero?.gpnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Tuesday?.stoxHero?.gpnl ? 
                                (bothSideWeeklyTradeData?.Tuesday?.stoxHero?.gpnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Tuesday?.stoxHero?.gpnl >= 0 ? bothSideWeeklyTradeData?.Tuesday?.stoxHero?.gpnl : -bothSideWeeklyTradeData?.Tuesday?.stoxHero?.gpnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Tuesday?.infinity?.gpnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Tuesday?.infinity?.gpnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Tuesday?.infinity?.gpnl ? 
                                (bothSideWeeklyTradeData?.Tuesday?.infinity?.gpnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Tuesday?.infinity?.gpnl >= 0 ? bothSideWeeklyTradeData?.Tuesday?.infinity?.gpnl : -bothSideWeeklyTradeData?.Tuesday?.stoxHero?.gpnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Tuesday?.stoxHero?.npnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Tuesday?.stoxHero?.npnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Tuesday?.stoxHero?.npnl ? 
                                (bothSideWeeklyTradeData?.Tuesday?.stoxHero?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Tuesday?.stoxHero?.npnl >= 0 ? bothSideWeeklyTradeData?.Tuesday?.stoxHero?.npnl : -bothSideWeeklyTradeData?.Tuesday?.stoxHero?.npnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Tuesday?.infinity?.npnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Tuesday?.infinity?.npnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Tuesday?.infinity?.npnl ? 
                                (bothSideWeeklyTradeData?.Tuesday?.infinity?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Tuesday?.infinity?.npnl >= 0 ? bothSideWeeklyTradeData?.Tuesday?.infinity?.npnl : -bothSideWeeklyTradeData?.Tuesday?.infinity?.npnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Tuesday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Tuesday?.infinity?.npnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Tuesday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Tuesday?.infinity?.npnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Tuesday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Tuesday?.infinity?.npnl ? 
                                (bothSideWeeklyTradeData?.Tuesday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Tuesday?.infinity?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Tuesday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Tuesday?.infinity?.npnl >= 0 ? bothSideWeeklyTradeData?.Tuesday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Tuesday?.infinity?.npnl : -(bothSideWeeklyTradeData?.Tuesday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Tuesday?.infinity?.npnl))
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
            </MDBox>
            </Grid>

            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} ml={1} mt={0.5} mr={1} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} fontWeight='bold'>
                        Wednesday
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Wednesday?.stoxHero?.gpnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Wednesday?.stoxHero?.gpnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Wednesday?.stoxHero?.gpnl ? 
                                (bothSideWeeklyTradeData?.Wednesday?.stoxHero?.gpnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Wednesday?.stoxHero?.gpnl >= 0 ? bothSideWeeklyTradeData?.Wednesday?.stoxHero?.gpnl : -bothSideWeeklyTradeData?.Wednesday?.stoxHero?.gpnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Wednesday?.infinity?.gpnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Wednesday?.infinity?.gpnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Wednesday?.infinity?.gpnl ? 
                                (bothSideWeeklyTradeData?.Wednesday?.infinity?.gpnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Wednesday?.infinity?.gpnl >= 0 ? bothSideWeeklyTradeData?.Wednesday?.infinity?.gpnl : -bothSideWeeklyTradeData?.Wednesday?.stoxHero?.gpnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Wednesday?.stoxHero?.npnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Wednesday?.stoxHero?.npnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Wednesday?.stoxHero?.npnl ? 
                                (bothSideWeeklyTradeData?.Wednesday?.stoxHero?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Wednesday?.stoxHero?.npnl >= 0 ? bothSideWeeklyTradeData?.Wednesday?.stoxHero?.npnl : -bothSideWeeklyTradeData?.Wednesday?.stoxHero?.npnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Wednesday?.infinity?.npnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Wednesday?.infinity?.npnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Wednesday?.infinity?.npnl ? 
                                (bothSideWeeklyTradeData?.Wednesday?.infinity?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Wednesday?.infinity?.npnl >= 0 ? bothSideWeeklyTradeData?.Wednesday?.infinity?.npnl : -bothSideWeeklyTradeData?.Wednesday?.infinity?.npnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Wednesday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Wednesday?.infinity?.npnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Wednesday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Wednesday?.infinity?.npnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Wednesday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Wednesday?.infinity?.npnl ? 
                                (bothSideWeeklyTradeData?.Wednesday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Wednesday?.infinity?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Wednesday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Wednesday?.infinity?.npnl >= 0 ? bothSideWeeklyTradeData?.Wednesday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Wednesday?.infinity?.npnl : -(bothSideWeeklyTradeData?.Wednesday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Wednesday?.infinity?.npnl))
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
            </MDBox>
            </Grid>

            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} ml={1} mt={0.5} mr={1} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} fontWeight='bold'>
                        Thursday
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Thursday?.stoxHero?.gpnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Thursday?.stoxHero?.gpnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Thursday?.stoxHero?.gpnl ? 
                                (bothSideWeeklyTradeData?.Thursday?.stoxHero?.gpnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Thursday?.stoxHero?.gpnl >= 0 ? bothSideWeeklyTradeData?.Thursday?.stoxHero?.gpnl : -bothSideWeeklyTradeData?.Thursday?.stoxHero?.gpnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Thursday?.infinity?.gpnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Thursday?.infinity?.gpnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Thursday?.infinity?.gpnl ? 
                                (bothSideWeeklyTradeData?.Thursday?.infinity?.gpnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Thursday?.infinity?.gpnl >= 0 ? bothSideWeeklyTradeData?.Thursday?.infinity?.gpnl : -bothSideWeeklyTradeData?.Thursday?.stoxHero?.gpnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Thursday?.stoxHero?.npnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Thursday?.stoxHero?.npnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Thursday?.stoxHero?.npnl ? 
                                (bothSideWeeklyTradeData?.Thursday?.stoxHero?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Thursday?.stoxHero?.npnl >= 0 ? bothSideWeeklyTradeData?.Thursday?.stoxHero?.npnl : -bothSideWeeklyTradeData?.Thursday?.stoxHero?.npnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Thursday?.infinity?.npnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Thursday?.infinity?.npnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Thursday?.infinity?.npnl ? 
                                (bothSideWeeklyTradeData?.Thursday?.infinity?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Thursday?.infinity?.npnl >= 0 ? bothSideWeeklyTradeData?.Thursday?.infinity?.npnl : -bothSideWeeklyTradeData?.Thursday?.infinity?.npnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Thursday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Thursday?.infinity?.npnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Thursday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Thursday?.infinity?.npnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Thursday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Thursday?.infinity?.npnl ? 
                                (bothSideWeeklyTradeData?.Thursday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Thursday?.infinity?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Thursday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Thursday?.infinity?.npnl >= 0 ? bothSideWeeklyTradeData?.Thursday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Thursday?.infinity?.npnl : -(bothSideWeeklyTradeData?.Thursday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Thursday?.infinity?.npnl))
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
            </MDBox>
            </Grid>

            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} ml={1} mt={0.5} mr={1} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} fontWeight='bold'>
                        Friday
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Friday?.stoxHero?.gpnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Friday?.stoxHero?.gpnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Friday?.stoxHero?.gpnl ? 
                                (bothSideWeeklyTradeData?.Friday?.stoxHero?.gpnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Friday?.stoxHero?.gpnl >= 0 ? bothSideWeeklyTradeData?.Friday?.stoxHero?.gpnl : -bothSideWeeklyTradeData?.Friday?.stoxHero?.gpnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Friday?.infinity?.gpnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Friday?.infinity?.gpnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Friday?.infinity?.gpnl ? 
                                (bothSideWeeklyTradeData?.Friday?.infinity?.gpnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Friday?.infinity?.gpnl >= 0 ? bothSideWeeklyTradeData?.Friday?.infinity?.gpnl : -bothSideWeeklyTradeData?.Friday?.stoxHero?.gpnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Friday?.stoxHero?.npnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Friday?.stoxHero?.npnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Friday?.stoxHero?.npnl ? 
                                (bothSideWeeklyTradeData?.Friday?.stoxHero?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Friday?.stoxHero?.npnl >= 0 ? bothSideWeeklyTradeData?.Friday?.stoxHero?.npnl : -bothSideWeeklyTradeData?.Friday?.stoxHero?.npnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Friday?.infinity?.npnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Friday?.infinity?.npnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Friday?.infinity?.npnl ? 
                                (bothSideWeeklyTradeData?.Friday?.infinity?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Friday?.infinity?.npnl >= 0 ? bothSideWeeklyTradeData?.Friday?.infinity?.npnl : -bothSideWeeklyTradeData?.Friday?.infinity?.npnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={bothSideWeeklyTradeData?.Friday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Friday?.infinity?.npnl >= 0 ? 'success' : bothSideWeeklyTradeData?.Friday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Friday?.infinity?.npnl < 0 ? 'error' : 'text'}>
                        {bothSideWeeklyTradeData?.Friday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Friday?.infinity?.npnl ? 
                                (bothSideWeeklyTradeData?.Friday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Friday?.infinity?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(bothSideWeeklyTradeData?.Friday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Friday?.infinity?.npnl >= 0 ? bothSideWeeklyTradeData?.Friday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Friday?.infinity?.npnl : -(bothSideWeeklyTradeData?.Friday?.stoxHero?.npnl-bothSideWeeklyTradeData?.Friday?.infinity?.npnl))
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
            </MDBox>
            </Grid>

            </MDBox>
    }             
    </>
  );
}