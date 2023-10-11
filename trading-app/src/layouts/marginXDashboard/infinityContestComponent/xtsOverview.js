import React, { useState, useEffect } from 'react';
import axios from "axios"
import MDBox from '../../../components/MDBox';
import { Grid, CircularProgress, Divider } from '@mui/material';
import MDTypography from '../../../components/MDTypography';

export default function XTSOverview({socket}) {
  
    const [isLoading,setIsLoading] = useState(false);
    const [trackEvent, setTrackEvent] = useState({});
    const [tradeData, setTradeData] = useState({});
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    useEffect(()=>{
        socket.on('updatePnl', (data)=>{
          setTimeout(()=>{
            setTrackEvent(data);
          })
        })
      }, [])

    useEffect(()=>{
        
        axios.get(`${baseUrl}api/v1/xtsOverview`, {withCredentials: true})
        .then((res) => {
            setTradeData(res.data.data); 
            setIsLoading(true)
        }).catch((err) => {
            setIsLoading(false)
            return new Error(err);
        })
      }, [trackEvent])
    
    
  
    return (

        <>
            <Grid container xs={12} md={12} lg={12} mt={1}>
                <Grid item boxShadow={2} minHeight='auto' minWidth='100%' style={{ backgroundColor: 'white' }} borderRadius={1}>
                    {!isLoading ?
                        <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
                            <CircularProgress color='info' />
                        </MDBox>
                        :
                        <>
                            <Grid container xs={12} md={12} lg={12}>
                                <Grid item p={2} xs={12} md={12} lg={12}>
                                    <MDTypography fontSize={15} fontWeight='bold' color='dark'>XTS Overview</MDTypography>
                                    <Grid container spacing={.5} xs={12} md={12} lg={12} mt={1}>
                                        <Grid item xs={4} md={4} lg={2.4}>
                                            <MDTypography color='text' fontSize={12} fontWeight='bold' display='flex' justifyContent='center'>Gross P&L</MDTypography>
                                            <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{tradeData ?? 0 ? tradeData?.netAmount >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeData?.netAmount)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-tradeData?.netAmount)) : "₹" + 0}</MDTypography>
                                        </Grid>
                                        <Grid item xs={4} md={4} lg={2.4}>
                                            <MDTypography color='text' fontSize={12} fontWeight='bold' display='flex' justifyContent='center'>Running Lots</MDTypography>
                                            <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{tradeData ?? 0 ? (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeData.quantity)) :  0}</MDTypography>
                                        </Grid>
                                        <Grid item xs={4} md={4} lg={2.4}>
                                            <MDTypography color='text' fontSize={12} fontWeight='bold' display='flex' justifyContent='center'>Total Lots</MDTypography>
                                            <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>
                                                {/* {tradeData ?? 0 ? "₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeData.quantity)) : "₹" + 0} */}
                                                TBC
                                            </MDTypography>
                                        </Grid>
                                        <Grid item xs={4} md={4} lg={2.4}>
                                            <MDTypography color='text' fontSize={12} fontWeight='bold' display='flex' justifyContent='center'>Buy Amount</MDTypography>
                                            <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{tradeData ?? 0 ? (tradeData.buyAmount) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeData.buyAmount)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeData.buyAmount)) : "₹" + 0}</MDTypography>
                                        </Grid>
                                        <Grid item xs={4} md={4} lg={2.4}>
                                            <MDTypography color='text' fontSize={12} fontWeight='bold' display='flex' justifyContent='center'>Sell Amount</MDTypography>
                                            <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{tradeData ?? 0 ? (tradeData.sellAmount) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeData.sellAmount)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeData.sellAmount)) : "₹" + 0}</MDTypography>

                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    }
                </Grid>
            </Grid>

        </>
     
  
    );
}