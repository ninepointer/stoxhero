import React from 'react';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import {Link} from 'react-router-dom'
import { Grid } from '@mui/material';
import moment from 'moment';
import Logo from '../../../assets/images/default-profile.png'

//data
import LiveMockInfinityDailyData from '../data/liveMockInfinityDailyChart'

export default function InfinityData({bothSideTradeData,isLoading}) {
    let dates = []
    let stoxHeroNpnl = []
    let infinityNpnl = []
    dates = Object.keys(bothSideTradeData)
    let pnlValues = Object.values(bothSideTradeData)
    stoxHeroNpnl = pnlValues?.map((elem)=>{
      return elem?.stoxHero?.npnl
    })
    infinityNpnl = pnlValues?.map((elem)=>{
      return elem?.infinity?.npnl
    })

  return (
    <>  
    {isLoading ? 
        <MDBox style={{ filter: 'blur(2px)' }}>
            <Grid container xs={12} md={12} lg={12} mt={1} mb={1} display='flex' justifyContent='center' alignItems='center'>
                <MDTypography fontSize={15} fontWeight='bold'>Date Wise Data for 21-Jan-2023 to 01-Mar-2023</MDTypography>
            </Grid>

            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            
            <MDBox style={{border:'1px solid #e91e63', backgroundColor:'#e91e63'}} borderRadius={5} p={0.5} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Date</MDTypography>
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
            <MDBox>
            <Grid container xs={12} md={12} lg={12} mt={1} mb={1} display='flex' justifyContent='center' alignItems='center'>
                <MDTypography fontSize={15} fontWeight='bold'>Date Wise Both Side Data</MDTypography>
            </Grid>

            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            
            <MDBox style={{border:'1px solid #e91e63', backgroundColor:'#e91e63'}} borderRadius={5} p={0.5} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color='light' fontSize={13} fontWeight='bold'>Date</MDTypography>
                </Grid>
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
            
            {pnlValues?.map((elem,index)=>{
                const difference = elem?.infinity?.numTrades!==0 ? elem?.stoxHero?.npnl-elem?.infinity?.npnl : '-'
                const tradeDate = new Date(dates[index])
                const utcDateString = tradeDate.toLocaleString("en-US", { timeZone: "UTC" });
                console.log(utcDateString)
                
                return(
                <>
                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography 
                        color={moment.utc(utcDateString).utcOffset('+00:00').format('dddd') === 'Thursday' ? 'error' : moment.utc(utcDateString).utcOffset('+00:00').format('dddd') === 'Wednesday' ? 'warning' : 'text'}  
                        fontSize={13} 
                        fontWeight='bold'
                    >
                        {moment.utc(utcDateString).utcOffset('+00:00').format('DD-MMM-YY')}
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography 
                        color={moment.utc(utcDateString).utcOffset('+00:00').format('dddd') === 'Thursday' ? 'error' : moment.utc(utcDateString).utcOffset('+00:00').format('dddd') === 'Wednesday' ? 'warning' : 'text'} 
                        fontSize={13} 
                        fontWeight='bold'
                    >
                        {moment.utc(utcDateString).utcOffset('+00:00').format('dddd')}
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={elem?.stoxHero?.gpnl >= 0 ? 'success' : elem?.stoxHero?.gpnl < 0 ? 'error' : 'text'}>
                        {elem?.stoxHero?.gpnl ? 
                                (elem?.stoxHero?.gpnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.stoxHero?.gpnl >= 0 ? elem?.stoxHero?.gpnl : -elem?.stoxHero?.gpnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={elem?.infinity?.gpnl >= 0 ? 'success' : elem?.infinity?.gpnl < 0 ? 'error' : 'text'}>
                        {elem?.infinity?.gpnl ? 
                                (elem?.infinity?.gpnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.infinity?.gpnl >= 0 ? elem?.infinity?.gpnl : -elem?.infinity?.gpnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography fontSize={13} color={elem?.stoxHero?.npnl >= 0 ? 'success' : elem?.stoxHero?.npnl < 0 ? 'error' : 'text'}>
                        {elem?.stoxHero?.npnl ? 
                                (elem?.stoxHero?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.stoxHero?.npnl >= 0 ? elem?.stoxHero?.npnl : -elem?.stoxHero?.npnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                <MDTypography fontSize={13} color={elem?.infinity?.npnl >= 0 ? 'success' : elem?.infinity?.npnl < 0 ? 'error' : 'text'}>
                        {elem?.infinity?.npnl ? 
                                (elem?.infinity?.npnl >= 0 ? '+₹' : '-₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.infinity?.npnl >= 0 ? elem?.infinity?.npnl : -elem?.infinity?.npnl)
                                : '₹0'
                        }
                    </MDTypography>
                </Grid>
                <Grid item xs={2.4} md={2.4} lg={2.4} display='flex' justifyContent='center'>
                    <MDTypography color={difference > 0 ? 'success' : difference < 0 ? 'error' : 'text'} fontSize={13} fontWeight='bold'>
                        {(difference > 0 ? '+₹' : difference < 0 ? '-₹' : '₹') + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(difference > 0 ? difference : difference < 0 ? -difference : 0)}
                    </MDTypography>
                </Grid>
            </MDBox>
            </Grid>
            </>)
            }) }

            
            </MDBox> }        
    </>
  );
}