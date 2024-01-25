import React from "react";
import axios from "axios";
import { useEffect, useState, useContext, useRef, useReducer } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { userContext } from "../../../AuthContext";


function Performance({tradingData, tradeType, setTradeType, timeframe, setTimeframe}) {
    const currentDate = new Date();
    const getDetails = useContext(userContext)
    // Get current month as "Jun 23, 2023"
    const currentMonth = currentDate.toLocaleString('en-us', {
        month: 'short',
        year: '2-digit'
    });
    
    // Get last month as "May 23, 2023"
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    .toLocaleString('en-us', {
        month: 'short',
        year: '2-digit'
    });
    
    // Get month before last as "Apr 23, 2023"
    const monthBeforeLast = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2)
    .toLocaleString('en-us', {
        month: 'short',
        year: '2-digit'
    });
    const timeframeArr = [currentMonth, lastMonth, monthBeforeLast, 'Lifetime'];
    const [monthYear, setMonthYear] = React.useState(currentMonth);
    const [trading, setTrading] = React.useState('Virtual Trading');
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    
    const handleChange = (event) => {
        setTrading(event.target.value);

        let tradingTypeValue;
        if(event.target.value == 'Virtual Trading'){
            tradingTypeValue = 'virtual'
        }else if(event.target.value == 'TenX Trading'){
           tradingTypeValue = 'tenX'
        }else{
            tradingTypeValue = 'contest'
        }
        window.webengage.track('performance_category_selection', {
            category: tradingTypeValue,
            timeframe: timeframe,
            user: getDetails?.userDetails?._id
        })
        setTradeType(tradingTypeValue);
    };
    
  const handleChange1 = (event) => {
    setMonthYear(event.target.value);

    let timeframeValue;
    if(event.target.value == currentMonth){
        timeframeValue = 'this month'
    }else if(event.target.value == lastMonth){
       timeframeValue = 'last month'
    }else if(event.target.value == monthBeforeLast){
        timeframeValue = 'previous to last month'
    }else{
        timeframeValue = 'lifetime'
    }
    window.webengage.track('performance_category_selection', {
        category: tradeType,
        timeframe: timeframeValue,
        user: getDetails?.userDetails?._id
    })
    setTimeframe(timeframeValue);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleOpen1 = () => {
    setOpen1(true);
  };

  return (
    <MDBox bgColor="light" border='1px solid lightgrey' borderRadius={5} minHeight='40vh'>
        <Grid container spacing={1} display='flex' justifyContent='space-between' alignItems='center'>
            <Grid item xs={12} md={12} lg={12} ml={1} mr={1} mb={1}>
                <MDBox display='flex' mb={1} justifyContent='space-between' alignItems='center'>
                <Grid container spacing={1} alignItems='center'>
                    <Grid item xs={12} md={6} lg={6}>
                    <MDTypography m={1} fontSize={13} fontWeight="bold">Performance</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3} display='flex' justifyContent='flex-end'>
                    <FormControl sx={{ m: 1, minWidth: 175 }}>
                        <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        value={trading}
                        // defaultValue="Jun 23"
                        onChange={handleChange}
                        >
                        <MenuItem value="Virtual Trading">F&O</MenuItem>
                        <MenuItem value="TenX Trading">TenX</MenuItem>
                        <MenuItem value="Contest Trading">TestZones</MenuItem>
                        </Select>
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3} display='flex' justifyContent='flex-end'>
                    <FormControl sx={{ m: 1, minWidth: 150 }}>
                        <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        open={open1}
                        onClose={handleClose1}
                        onOpen={handleOpen1}
                        value={monthYear}
                        // defaultValue={timeframeArr[0]}
                        onChange={handleChange1}
                        >
                            {timeframeArr.map((elem)=>
                                <MenuItem value={elem}>{elem}</MenuItem>
                            )}
                        
                        </Select>
                    </FormControl>
                    </Grid>
                </Grid>
                </MDBox>
                <MDBox bgColor="lightgrey" borderRadius={5} minHeight='auto'>
                    <Grid container spacing={1} p={1}>
                        
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">{tradeType== 'contest'? 
                                `Total Conests`: 
                                `Market Days`}</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color={
                                    'success'
                                } 
                                fontWeight="bold" textAlign='right'>
                                    {tradeType=='contest'?tradingData?.totalContests: tradingData?.totalMarketDays}
                                </MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">{tradeType=='contest'?`TestZones participated`:`Trading Days`}</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color={'success'} fontWeight="bold" textAlign='right'>{tradeType =='contest'?tradingData?.participatedContests:tradingData?.totalTradingDays}</MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">{tradeType=='contest'?`Positive P&L TestZones `:`Profit Days`}</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color={tradingData?.profitDays>=0?'success':'error'} fontWeight="bold" textAlign='right'>{tradingData?.profitDays}</MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">{tradeType == 'contest'?`Negative P&L TestZones `:`Loss Days`}</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='error' fontWeight="bold" textAlign='right'>{tradingData?.lossDays}</MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Profit & Loss</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color={tradingData?.totalNPNL>=0?'success':'error'} 
                                fontWeight="bold" textAlign='right'>
                                    { (tradingData?.totalNPNL?.toFixed(2)) >= 0 ? 
                                    "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).
                                    format((tradingData?.totalNPNL?.toFixed(2)))) : 
                                    "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).
                                    format(-(tradingData?.totalNPNL?.toFixed(2))))}
                                </MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Portfolio</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='success' fontWeight="bold" textAlign='right'>
                                { (tradingData?.portfolio) >= 0 ? 
                                    "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).
                                    format((tradingData?.portfolio))) : 
                                    "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).
                                    format(-(tradingData?.portfolio)))}
                                </MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Max Profit</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='success' fontWeight="bold" textAlign='right'>
                                 {tradingData?.maxProfit?`+₹${(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).
                                    format((tradingData?.maxProfit?.toFixed(2))))}`:'NA'}
                                </MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Max Loss</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='error' fontWeight="bold" textAlign='right'>
                                {tradingData?.maxLoss?`-₹${(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).
                                    format((-tradingData?.maxLoss?.toFixed(2))))}`:'NA'}
                                </MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Avg. Profit</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='success' fontWeight="bold" textAlign='right'>
                                {tradingData?.averageProfit ? `+₹${(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).
                                    format((tradingData?.averageProfit?.toFixed(2))))}`:0}
                                </MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Avg. Loss</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='error' fontWeight="bold" textAlign='right'>
                                {tradingData?.averageLoss ? `-₹${(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).
                                    format((-tradingData?.averageLoss?.toFixed(2))))}`:0}
                                    </MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Max. Win Streak</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='success' fontWeight="bold" textAlign='right'>{tradingData?.maxProfitStreak??0}</MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Max. Loss Streak</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='error' fontWeight="bold" textAlign='right'>{tradingData?.maxLossStreak??0}</MDTypography>
                            </MDBox>
                        </Grid>
                        
                    </Grid>
                </MDBox>
            </Grid>
        </Grid>
    </MDBox>
)
}

export default Performance;
