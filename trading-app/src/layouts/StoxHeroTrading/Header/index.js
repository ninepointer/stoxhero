import React, {useEffect, useState, useCallback, useMemo, useContext} from 'react';
import axios from "axios";
import { CircularProgress, Grid, Divider } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDAvatar from '../../../components/MDAvatar';
import MDButton from '../../../components/MDButton'
import {Link} from 'react-router-dom'
import niftyicon from '../../../assets/images/nifty50icon.png'
import bankniftyicon from '../../../assets/images/bankniftyicon.png'
import upicon from '../../../assets/images/arrow.png'
import downicon from '../../../assets/images/down.png'
import marginicon from '../../../assets/images/marginicon.png'
import netpnlicon from '../../../assets/images/netpnlicon.png'


import TradableInstrument from '../data/TradableInstruments';
// import WatchList from '../data/WatchList';
import BuySell from '../data/BuySell'
// import MyPosition from '../data/MyPosition'
import Orders from '../data/orders'
import WatchList from "../../tradingCommonComponent/InstrumentDetails/index"
import { userContext } from '../../../AuthContext';
import { io } from 'socket.io-client';
import StockIndex from '../../tradingCommonComponent/StockIndex/StockIndex';
import OverallPnl from '../../tradingCommonComponent/OverallP&L/OverallGrid'

export default function Wallet() {

  const [reRender, setReRender] = useState(true);
  const getDetails = useContext(userContext);
  const [isGetStartedClicked, setIsGetStartedClicked] = useState(false);

  let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"

  let socket;
  try {
    socket = io.connect(`${baseUrl1}`)
  } catch (err) {
    throw new Error(err);
  }

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit('userId', getDetails.userDetails._id)
      socket.emit("user-ticks", true)
    })
  }, []);

  const memoizedStockIndex = useMemo(() => {
    return <StockIndex socket={socket} />;
  }, [socket]);

  const handleSetIsGetStartedClicked = useCallback((value) => {
    setIsGetStartedClicked(value);
  }, []);

  const memoizedSetReRender = useCallback((value) => {
    setReRender(value);
  }, []);

  const memoizedTradableInstrument = useMemo(() => {
    return <TradableInstrument
      socket={socket}
      reRender={reRender}
      setReRender={memoizedSetReRender}
      isGetStartedClicked={isGetStartedClicked}
      setIsGetStartedClicked={handleSetIsGetStartedClicked}
      from={"algoTrader"}
    />;
  }, [socket, reRender, isGetStartedClicked, handleSetIsGetStartedClicked]);

  const memoizedInstrumentDetails = useMemo(() => {
    return <WatchList
      socket={socket}
      reRender={reRender}
      setReRender={setReRender}
      // setReRender={}
      // isGetStartedClicked={isGetStartedClicked}
      setIsGetStartedClicked={handleSetIsGetStartedClicked}
      from={"algoTrader"}
    />;
  }, [socket, reRender, handleSetIsGetStartedClicked]);

  const memoizedOverallPnl = useMemo(() => {
    return <OverallPnl
      socket={socket}
      reRender={reRender}
      setReRender={memoizedSetReRender}
      // setReRender={}
      // isGetStartedClicked={isGetStartedClicked}
      setIsGetStartedClicked={handleSetIsGetStartedClicked}
      from={"algoTrader"}
    />;
  }, [socket, reRender, handleSetIsGetStartedClicked]);


  return (
    <>
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>
      <Grid container spacing={3} mb={2}>
        
        <Grid item xs={12} md={6} lg={3}>
          <MDBox bgColor="light" borderRadius={5} p={2} display="flex" justifyContent="space-between">
              <Grid container display="flex" justifyContent="space-around">

                <Grid item xs={12} md={6} lg={2.5}>
                  <MDAvatar src={niftyicon} size="sm"/>
                </Grid>
           
                <Grid item xs={12} md={6} lg={5}>
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">NIFTY 50</MDTypography>
                  <MDBox display="flex">
                    <MDTypography fontSize={10}>+₹44.35</MDTypography>
                    <MDAvatar src={upicon} style={{width:15, height:15}} display="flex" justifyContent="left"/>
                  </MDBox>
                </Grid>
              
                <Grid item xs={12} md={6} lg={4.5}>
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="right">₹17813.63</MDTypography>
                  <MDBox display="flex" justifyContent="right">
                    <MDTypography fontSize={10} display="flex" justifyContent="right">(+0.25%)</MDTypography>
                    <MDAvatar src={upicon} style={{width:15, height:15}} display="flex" justifyContent="right"/>
                  </MDBox>   
                </Grid>
              </Grid>
            
          </MDBox>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <MDBox bgColor="light" borderRadius={5} p={2} display="flex" justifyContent="space-between">
              <Grid container display="flex" justifyContent="space-between">

                <Grid item xs={12} md={6} lg={2.5}>
                  <MDAvatar src={bankniftyicon} size="sm"/>
                </Grid>
           
                <Grid item xs={12} md={6} lg={5}>
                  <MDTypography fontSize={13} fontWeight="bold">NIFTY BANK</MDTypography>
                  <MDBox display="flex">
                    <MDTypography fontSize={10}>+₹105.40</MDTypography>
                    <MDAvatar src={upicon} style={{width:15, height:15}} display="flex" justifyContent="left"/>
                  </MDBox>
                </Grid>
              
                <Grid item xs={12} md={6} lg={4.5}>
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="right">₹42829.90</MDTypography>
                  <MDBox display="flex" justifyContent="right">
                    <MDTypography fontSize={10} display="flex" justifyContent="right">(+0.35%)</MDTypography>
                    <MDAvatar src={upicon} style={{width:15, height:15}} display="flex" justifyContent="right"/>
                  </MDBox>    
                </Grid>
              </Grid>
            
          </MDBox>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <MDBox bgColor="light" borderRadius={5} p={2} display="flex" justifyContent="space-between">
              <Grid container display="flex" justifyContent="space-around">

                <Grid item xs={12} md={6} lg={2.5}>
                  <MDAvatar src={marginicon} size="sm"/>
                </Grid>
           
                <Grid item xs={12} md={6} lg={5}>
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Portfolio</MDTypography>
                  <MDBox display="flex">
                    <MDTypography fontSize={10}>-₹200000.00</MDTypography>
                    <MDAvatar src={downicon} style={{width:15, height:15}} display="flex" justifyContent="left"/>
                  </MDBox>
                </Grid>
              
                <Grid item xs={12} md={6} lg={4.5}>
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="right">₹300000.00</MDTypography>
                  <MDBox display="flex" justifyContent="right">
                    <MDTypography fontSize={10} display="flex" justifyContent="right">(-40.00%)</MDTypography>
                    <MDAvatar src={downicon} style={{width:15, height:15}} display="flex" justifyContent="right"/>
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
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">NET P&L</MDTypography>
                  <MDBox display="flex">
                    <MDTypography fontSize={10}>Today</MDTypography>
                    {/* <MDAvatar src={downicon} style={{width:15, height:15}} display="flex" justifyContent="left"/> */}
                  </MDBox>
                </Grid>
              
                <Grid item xs={12} md={6} lg={4.5}>
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="right">-₹13000.00</MDTypography>
                  {/* <MDBox display="flex" justifyContent="right"> */}
                    {/* <MDTypography fontSize={10} display="flex" justifyContent="right"></MDTypography> */}
                    {/* <MDAvatar src={downicon} style={{width:15, height:15}} display="flex" justifyContent="right"/> */}
                  {/* </MDBox>    */}
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

      <Grid container spacing={3}>
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
          <Orders/>
        </Grid>
      </Grid>

    </MDBox>
    </>
  );
}