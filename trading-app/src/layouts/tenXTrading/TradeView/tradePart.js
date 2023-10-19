import React, { useState, useCallback, useMemo, useContext } from 'react';
// import axios from "axios";
import { Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
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
import TenXTMargin from '../../tradingCommonComponent/MarginDetails/TenXMargin';
import { tenxTrader } from '../../../variables';
import {useNavigate} from "react-router-dom"
import Order from '../Header/Order/Order';
import PendingOrder from '../Header/Order/PendingOrder';
import ExecutedOrders from '../Header/Order/ExecutedOrders';

export default function TenXTrading({ tradingDayData, socket, subscriptionId }) {
  const [isGetStartedClicked, setIsGetStartedClicked] = useState(false);
  const [yesterdayData, setyesterdayData] = useState({});
  const pnl = useContext(NetPnlContext);
  const gpnlcolor = pnl.netPnl >= 0 ? "success" : "error"
  const [availbaleMargin, setAvailbleMargin] = useState([]);
  const navigate = useNavigate();
  const [watchList, setWatchList] = useState([]);
  const [updatePendingOrder, setUpdatePendingOrder] = useState();



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
      subscriptionId={subscriptionId}
      watchList={watchList}
    />;
  }, [watchList, isGetStartedClicked, handleSetIsGetStartedClicked, subscriptionId]);

  const memoizedInstrumentDetails = useMemo(() => {
    return <WatchList
      socket={socket}
      isGetStartedClicked={isGetStartedClicked}
      setIsGetStartedClicked={handleSetIsGetStartedClicked}
      from={tenxTrader}
      subscriptionId={subscriptionId}
      setWatchList={setWatchList}
    />;
  }, [setWatchList, socket, handleSetIsGetStartedClicked, isGetStartedClicked, subscriptionId]);

  const memoizedOverallPnl = useMemo(() => {
    return <OverallPnl
      socket={socket}
      isGetStartedClicked={isGetStartedClicked}
      setIsGetStartedClicked={handleSetIsGetStartedClicked}
      from={tenxTrader}
      subscriptionId={subscriptionId}
      setAvailbleMargin={setAvailbleMargin}
    />;
  }, [socket, handleSetIsGetStartedClicked, isGetStartedClicked, subscriptionId]);

  // let yesterdaylifetimenetpnl = yesterdayData?.npnl ? Number((yesterdayData?.npnl)?.toFixed(0)) : 0;
  let openingBalance = yesterdayData?.openingBalance ? (yesterdayData?.openingBalance) : yesterdayData.totalFund;
  let fundChangePer = openingBalance ? ((openingBalance + pnl.netPnl - openingBalance) * 100 / openingBalance) : 0;

  // console.log("fundDetail", fundChangePer, openingBalance)
  return (
    <>
      <MDBox bgColor="dark" color="light" mt={2} mb={0} p={2} borderRadius={10} >
        <Grid container spacing={3} mb={2}>

          <Grid item xs={12} md={6} lg={3}>
            <MDButton sx={{width:'100%'}} onClick={()=>{navigate("/tenxtrading")}} bgColor="light" borderRadius={2} p={1} display="flex" justifyContent="space-between">
                Back To Subscriptions
            </MDButton>
          </Grid>

          <Grid item xs={12} md={6} lg={9}>
            <MDBox bgColor="light" borderRadius={7} p={1} display="flex" justifyContent="space-between">
              <Grid container display="flex" justifyContent="space-around">
                <MDTypography fontSize={15} fontWeight="bold">{`# of Trading Days: ${tradingDayData[0]?.totalTradingDays} || Subscription ends after ${Math.floor(tradingDayData[0]?.actualRemainingDay)} trading days`}</MDTypography>
              </Grid>

            </MDBox>
          </Grid>

        </Grid>

        <Grid container spacing={3} mb={2}>

          {memoizedStockIndex}

          <Grid item xs={12} md={6} lg={3}>
            <MDBox bgColor="light" borderRadius={5} p={2} display="flex" justifyContent="space-between">
              <Grid container display="flex" justifyContent="space-around">

                <Grid item xs={12} md={6} lg={2.5}>
                  <MDAvatar src={marginicon} size="sm" />
                </Grid>

                <Grid item xs={12} md={6} lg={5}>
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Margin</MDTypography>
                  <MDBox display="flex">
                  
                    <MDTypography fontSize={10}>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(openingBalance + pnl.netPnl)}</MDTypography>
                    <MDAvatar src={openingBalance + pnl.netPnl - openingBalance + pnl.netPnl >= 0 ? upicon : downicon} style={{ width: 15, height: 15 }} display="flex" justifyContent="left" />
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={4.5}>
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="right">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(openingBalance)}</MDTypography>
                  <MDBox display="flex" justifyContent="right">
                    <MDTypography fontSize={10} display="flex" justifyContent="right">{fundChangePer.toFixed(2)}%</MDTypography>
                    <MDAvatar src={fundChangePer >= 0 ? upicon : downicon} style={{ width: 15, height: 15 }} display="flex" justifyContent="right" />
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox bgColor="light" borderRadius={5} p={2} display="flex" justifyContent="space-between">
              <Grid container display="flex" justifyContent="space-around">

                <Grid item xs={12} md={6} lg={2.5}>
                  <MDAvatar src={netpnlicon} size="sm" />
                </Grid>

                <Grid item xs={12} md={6} lg={5}>
                  <MDTypography fontSize={11} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">NET P&L</MDTypography>
                  <MDBox display="flex">
                    <MDTypography fontSize={10}>Today</MDTypography>
                    {/* <MDAvatar src={downicon} style={{width:15, height:15}} display="flex" justifyContent="left"/> */}
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={4.5}>
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="right" color={gpnlcolor}>{ (pnl.netPnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnl.netPnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-pnl.netPnl))}</MDTypography>
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

          <Grid item xs={12} md={6} lg={12}>
            {memoizedOverallPnl}
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <PendingOrder socket={socket} subscriptionId={subscriptionId} setUpdatePendingOrder={setUpdatePendingOrder} updatePendingOrder={updatePendingOrder} />
            <ExecutedOrders socket={socket} subscriptionId={subscriptionId} updatePendingOrder={updatePendingOrder} />
            <Order subscriptionId={subscriptionId} updatePendingOrder={updatePendingOrder} />
          </Grid>

          <Grid item xs={12} md={6} lg={12} >
            <TenXTMargin availbaleMargin={availbaleMargin} subscriptionId={subscriptionId} setyesterdayData={setyesterdayData} />
          </Grid>
        </Grid>

      </MDBox>
    </>
  );
}