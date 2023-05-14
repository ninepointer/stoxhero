import React, {useEffect, useState, useCallback, useMemo, useContext} from 'react';
import axios from "axios";
import { CircularProgress, Grid, Divider } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDAvatar from '../../../components/MDAvatar';
import upicon from '../../../assets/images/arrow.png'
import downicon from '../../../assets/images/down.png'
import marginicon from '../../../assets/images/marginicon.png'
import netpnlicon from '../../../assets/images/netpnlicon.png'


import TradableInstrument from '../../tradingCommonComponent/TradableInstrument/TradableInstrument';
import WatchList from "../../tradingCommonComponent/InstrumentDetails/index"
import StockIndex from '../../tradingCommonComponent/StockIndex/StockIndexInfinity';
import OverallPnl from '../../tradingCommonComponent/OverallP&L/OverallGrid'
import { NetPnlContext } from '../../../PnlContext';
import InfinityMargin from '../../tradingCommonComponent/MarginDetails/infinityMargin';
import { tenxTrader } from '../../../variables';

export default function TenXTrading({socket}) {
  const [isGetStartedClicked, setIsGetStartedClicked] = useState(false);
  const [yesterdayData, setyesterdayData] = useState({});
  const pnl = useContext(NetPnlContext);
  const gpnlcolor = pnl.infinityNetPnl >= 0 ? "success" : "error"


  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  useEffect(() => {
    console.log("fund details in useeffect")
    axios.get(`${baseUrl}api/v1/infinityTrade/myOpening`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      }}
      ).then((res)=>{
        console.log("fund details", res.data.data)
        setyesterdayData(res.data.data);
      })
      
  }, []);

  const memoizedStockIndex = useMemo(() => {
    return <StockIndex socket={socket} />;
  }, [socket]);

  const handleSetIsGetStartedClicked = useCallback((value) => {
    setIsGetStartedClicked(value);
  }, []);


  const memoizedTradableInstrument = useMemo(() => {
    return <TradableInstrument
      isGetStartedClicked={isGetStartedClicked}
      setIsGetStartedClicked={handleSetIsGetStartedClicked}
      from={tenxTrader}
    />;
  }, [ isGetStartedClicked, handleSetIsGetStartedClicked]);

  const memoizedInstrumentDetails = useMemo(() => {
    return <WatchList
      socket={socket}
      isGetStartedClicked={isGetStartedClicked}
      setIsGetStartedClicked={handleSetIsGetStartedClicked}
      from={tenxTrader}
    />;
  }, [socket, handleSetIsGetStartedClicked, isGetStartedClicked]);

  const memoizedOverallPnl = useMemo(() => {
    return <OverallPnl
      isGetStartedClicked={isGetStartedClicked}
      setIsGetStartedClicked={handleSetIsGetStartedClicked}
      from={tenxTrader}
    />;
  }, [handleSetIsGetStartedClicked, isGetStartedClicked]);

  let yesterdaylifetimenetpnl = yesterdayData?.npnl ? Number((yesterdayData?.npnl)?.toFixed(0)) : 0;
  let openingBalance = yesterdayData?.totalCredit ? (yesterdayData?.totalCredit + yesterdaylifetimenetpnl) : 0;
  let fundChangePer = openingBalance ? ((openingBalance+pnl.infinityNetPnl - openingBalance)*100/openingBalance) : 0;

  console.log("fundDetail", fundChangePer, openingBalance)
  return (
    <>
    <MDBox bgColor="dark" color="light" mt={2} mb={0} p={2} borderRadius={10} >
      <Grid container spacing={3} mb={2}>
        
        {memoizedStockIndex}

        <Grid item xs={12} md={6} lg={3}>
          <MDBox bgColor="light" borderRadius={5} p={2} display="flex" justifyContent="space-between">
              <Grid container display="flex" justifyContent="space-around">

                <Grid item xs={12} md={6} lg={2.5}>
                  <MDAvatar src={marginicon} size="sm"/>
                </Grid>
           
                <Grid item xs={12} md={6} lg={5}>
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Margin</MDTypography>
                  <MDBox display="flex">
                    <MDTypography fontSize={10}>{(openingBalance+pnl.infinityNetPnl) >= 0.00 ? "₹" + ((openingBalance+pnl.infinityNetPnl).toFixed(0)): "₹" + ((-(openingBalance+pnl.infinityNetPnl)).toFixed(0))}</MDTypography>
                    <MDAvatar src={openingBalance+pnl.infinityNetPnl - openingBalance+pnl.infinityNetPnl >= 0 ? upicon : downicon} style={{width:15, height:15}} display="flex" justifyContent="left"/>
                  </MDBox>
                </Grid>
              
                <Grid item xs={12} md={6} lg={4.5}>
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="right">₹{openingBalance?.toFixed(0)}</MDTypography>
                  <MDBox display="flex" justifyContent="right">
                    <MDTypography fontSize={10} display="flex" justifyContent="right">{fundChangePer.toFixed(2)}%</MDTypography>
                    <MDAvatar src={fundChangePer >= 0 ? upicon : downicon} style={{width:15, height:15}} display="flex" justifyContent="right"/>
                  </MDBox>   
                </Grid>
              </Grid>
          </MDBox>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <MDBox bgColor="light" borderRadius={5} p={2} display="flex" justifyContent="space-between">
              <Grid container display="flex" justifyContent="space-around">

                <Grid item xs={12} md={6} lg={2.5}>
                  <MDAvatar src={netpnlicon} size="sm"/>
                </Grid>
           
                <Grid item xs={12} md={6} lg={5}>
                  <MDTypography fontSize={11} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">NET P&L</MDTypography>
                  <MDBox display="flex">
                    <MDTypography fontSize={10}>Today</MDTypography>
                    {/* <MDAvatar src={downicon} style={{width:15, height:15}} display="flex" justifyContent="left"/> */}
                  </MDBox>
                </Grid>
              
                <Grid item xs={12} md={6} lg={4.5}>
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="right" color={gpnlcolor}>{pnl.infinityNetPnl >= 0.00 ? "+₹" + (pnl.infinityNetPnl.toFixed(2)): "-₹" + ((-pnl.infinityNetPnl).toFixed(2))}</MDTypography>
                </Grid>
              </Grid>
            
          </MDBox>
        </Grid>

      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={12}>
          {/* <TradableInstrument/> */}
          {memoizedTradableInstrument}
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={12}>
          {/* <WatchList/> */}
          {memoizedInstrumentDetails}
        </Grid>
        {/* <Grid item xs={12} md={6} lg={3}>
          <BuySell/>
        </Grid> */}
        <Grid item xs={12} md={6} lg={12}>
          {/* <OverallPnl/> */}
          {memoizedOverallPnl}
        </Grid>
        <Grid item xs={12} md={6} lg={12}>
          <InfinityMargin />
        </Grid>
      </Grid>

    </MDBox>
    </>
  );
}