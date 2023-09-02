import { React, useState, useEffect, useContext, useCallback, useMemo } from "react";

import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

// Images
// import MDButton from "../../../components/MDButton";
// import MDTypography from "../../../components/MDTypography";
import OptionChain from "./optionChain";
// import { NetPnlContext } from "../../../PnlContext";
import TradableInstrument from '../../tradingCommonComponent/TradableInstrument/TradableInstrument';
import WatchList from "../../tradingCommonComponent/InstrumentDetails/index"
import OverallPnl from '../../tradingCommonComponent/OverallP&L/OverallGrid'
import { marginX } from '../../../variables';
// import DailyContestMargin from '../../tradingCommonComponent/MarginDetails/DailyContestMargin';
import StockIndexDailyContest from "../../tradingCommonComponent/StockIndex/StockIndexDailyContest";
// import Leaderboard from '../data/dailyContestLeaderboard'
// import DailyContestMyRank from '../data/dailyContestMyRank'
import {useNavigate} from "react-router-dom"
import PnlAndMarginData from "./pnlAndMarginData";
import Order from "../../tradingCommonComponent/orders/Order";


function Header({ socket, data }) {
    const [isGetStartedClicked, setIsGetStartedClicked] = useState(false);
    const [watchList, setWatchList] = useState([]);
    const navigate = useNavigate();
    const marginxId = "64f2c081250ef784218c57b2";
    let endTime = "2023-09-02T04:56:03.136+00:00";
    // const marginxId = data?.data;
    // let endTime = data?.endTime;
    useEffect(() => {
        socket.on("serverTime", (time) => {
            const serverTimeString = new Date(time).toISOString().slice(0, 19); // Extract relevant parts
            const endTimeString = new Date(endTime).toISOString().slice(0, 19); // Extract relevant parts
            // console.log("time is", serverTimeString, serverTimeString === endTimeString, endTimeString);
            if (serverTimeString === endTimeString) {
                navigate(`/contests/result`, {
                    state: { marginxId: marginxId}
                })
            }
        });
    }, []);
    
    const handleSetIsGetStartedClicked = useCallback((value) => {
        setIsGetStartedClicked(value);
      }, []);

      const memoizedStockIndex = useMemo(() => {
        return <StockIndexDailyContest socket={socket} />;
      }, [socket]);

    const memoizedTradableInstrument = useMemo(() => {
        return <TradableInstrument
          socket={socket}
          isGetStartedClicked={isGetStartedClicked}
          setIsGetStartedClicked={handleSetIsGetStartedClicked}
          from={marginX}
          moduleData={data}
          watchList={watchList}
        />;
      }, [watchList, data, socket, isGetStartedClicked, handleSetIsGetStartedClicked]);
    
      const memoizedInstrumentDetails = useMemo(() => {
        return <WatchList
          socket={socket}
          isGetStartedClicked={isGetStartedClicked}
          setIsGetStartedClicked={handleSetIsGetStartedClicked}
          from={marginX}
          subscriptionId={marginxId}
          moduleData={data}
          setWatchList={setWatchList}
        />;
      }, [setWatchList, data, marginxId, socket, handleSetIsGetStartedClicked, isGetStartedClicked]);
    
      const memoizedOverallPnl = useMemo(() => {
        return <OverallPnl
          socket={socket}
          isGetStartedClicked={isGetStartedClicked}
          setIsGetStartedClicked={handleSetIsGetStartedClicked}
          from={marginX}
          subscriptionId={marginxId}
          moduleData={data}
        />;
      }, [data, marginxId, handleSetIsGetStartedClicked, isGetStartedClicked, socket]);
    
      const memoizedOrder = useMemo(() => {
        return <Order
          from={marginX}
          id={marginxId}
          moduleData={data}
        />;
      }, [data, marginxId]);


    return (
        <>
            <MDBox color="dark" mt={2} mb={1} borderRadius={10} minHeight='80vH'>
                <MDBox bgColor="lightgrey" display='flex' p={1} borderRadius={10}>
                    <MDBox width='100%' minHeight='auto' display='flex' justifyContent='center'>
                        <PnlAndMarginData marginxId={marginxId} />
                    </MDBox>
                </MDBox>

                <MDBox bgColor="lightgrey" display='flex' p={1} mt={1} borderRadius={10}>
                    <MDBox width='100%' minHeight='auto' display='flex' justifyContent='center'>
                        <Grid container spacing={1} xs={12} md={12} lg={12}>
                            <Grid item xs={12} md={6} lg={3}>
                                <OptionChain socket={socket} data={data}/>
                            </Grid>
                            {memoizedStockIndex}
                        </Grid>
                    </MDBox>
                </MDBox>

                <Grid container  p={1} mt={1} sx={{ backgroundColor: '#D3D3D3' }} borderRadius={3}>
                    <Grid item xs={12} md={6} lg={12} mb={-2} >
                        {memoizedTradableInstrument}
                    </Grid>
                </Grid>

                <Grid container p={1} mt={1} sx={{ backgroundColor: '#D3D3D3' }} borderRadius={3}>
                    <Grid item xs={12} md={6} lg={12} >
                        {memoizedInstrumentDetails}
                    </Grid>
                </Grid>

                <Grid container p={1} mt={1} sx={{ backgroundColor: '#D3D3D3' }} borderRadius={3}>
                    <Grid item xs={12} md={6} lg={12} >
                        {memoizedOverallPnl}
                    </Grid>
                </Grid>

                <Grid container p={1} mt={1} sx={{ backgroundColor: '#D3D3D3' }} borderRadius={3}>
                    <Grid item xs={12} md={6} lg={12} >
                        {memoizedOrder}
                    </Grid>
                </Grid>
            </MDBox>
        </>
    );
}

export default Header;
