import React, { useEffect, useState, useRef,useContext, useMemo, useReducer, useCallback } from "react";
// import { io } from "socket.io-client";
// @mui material components
import { Chart } from 'chart.js/auto';
// Chart.register(...registerables);
import Grid from "@mui/material/Grid";
import ReactGA from "react-ga"
import MDBox from "../../components/MDBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import InstrumentDetails from "../tradingCommonComponent/InstrumentDetails";
import OverallGrid from "../tradingCommonComponent/OverallP&L/OverallGrid";
import MarginGrid from "../tradingCommonComponent/MarginDetails/MarginGrid";
import TradableInstrument from "../tradingCommonComponent/TradableInstrument/TradableInstrument";
import StockIndex from "../tradingCommonComponent/StockIndex/StockIndex";
import { userContext } from "../../AuthContext";
import { socketContext } from "../../socketContext";
import Order from '../tradingCommonComponent/Order/Order';
import PendingOrder from '../tradingCommonComponent/Order/PendingOrder';
import ExecutedOrders from '../tradingCommonComponent/Order/ExecutedOrders';
import { paperTrader } from '../../variables';


function UserPosition() {
  const getDetails = useContext(userContext);
  const [isGetStartedClicked, setIsGetStartedClicked] = useState(false);
  const [updatePendingOrder, setUpdatePendingOrder] = useState();
  const [watchList, setWatchList] = useState([]);
  const socket = useContext(socketContext);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  
  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
    capturePageView()
  }, []);
  let page = 'VirtualTrading'
  let pageLink = window.location.pathname;

  async function capturePageView(){
        await fetch(`${baseUrl}api/v1/pageview/${page}${pageLink}`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
    });
  }
  
  useEffect(() => {
    socket.emit('userId', getDetails.userDetails._id)
    socket.emit("user-ticks", getDetails.userDetails._id)
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
      from={'paperTrade'}
      watchList={watchList}
    />;
  }, [watchList, isGetStartedClicked, handleSetIsGetStartedClicked]);

  const memoizedInstrumentDetails = useMemo(() => {
    return <InstrumentDetails
      socket={socket}
      setIsGetStartedClicked={handleSetIsGetStartedClicked}
      from={"paperTrade"}
      setWatchList={setWatchList}
    />;
  }, [setWatchList, socket, handleSetIsGetStartedClicked]);

  const memoizedOverallPnl = useMemo(() => {
    return <OverallGrid
      socket={socket}
      setIsGetStartedClicked={handleSetIsGetStartedClicked}
      from={"paperTrade"}
    />;
  }, [ handleSetIsGetStartedClicked, socket]);


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={0} mt={1}>

        {memoizedStockIndex}

        {memoizedTradableInstrument}

        <MDBox mt={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              {memoizedInstrumentDetails}
            </Grid>
          </Grid>
        </MDBox>

        <MDBox mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              {memoizedOverallPnl}
             {/* <OverallGrid socket={socket} Render={{ reRender, setReRender }} setIsGetStartedClicked={setIsGetStartedClicked}/> */}
            </Grid>
          </Grid>
        </MDBox>

        <Grid item xs={12} md={6} lg={12} mt={3}>
          <PendingOrder from={paperTrader} socket={socket} setUpdatePendingOrder={setUpdatePendingOrder} updatePendingOrder={updatePendingOrder} />
          <ExecutedOrders from={paperTrader} socket={socket} updatePendingOrder={updatePendingOrder} />
          <Order from={paperTrader} updatePendingOrder={updatePendingOrder} />
        </Grid>

        <MDBox mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <MarginGrid/>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default UserPosition;





