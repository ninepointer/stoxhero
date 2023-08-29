import { React, useState, useEffect, useContext, useCallback, useMemo } from "react";

import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

// Images
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import OptionChain from "./optionChain";
import { NetPnlContext } from "../../../PnlContext";
import TradableInstrument from '../../tradingCommonComponent/TradableInstrument/TradableInstrument';
import WatchList from "../../tradingCommonComponent/InstrumentDetails/index"
import OverallPnl from '../../tradingCommonComponent/OverallP&L/OverallGrid'
import { dailyContest } from '../../../variables';
import DailyContestMargin from '../../tradingCommonComponent/MarginDetails/DailyContestMargin';
import StockIndexDailyContest from "../../tradingCommonComponent/StockIndex/StockIndexDailyContest";
import Leaderboard from '../data/dailyContestLeaderboard'
import DailyContestMyRank from '../data/dailyContestMyRank'
import {useNavigate} from "react-router-dom"
import PnlAndMarginData from "./pnlAndMarginData";


function Header({ socket, data }) {
    const [isGetStartedClicked, setIsGetStartedClicked] = useState(false);
    const [watchList, setWatchList] = useState([]);
    const navigate = useNavigate();
    let contestId = data?.data;
    let endTime = data?.endTime;
    useEffect(() => {
        socket.on("serverTime", (time) => {
            const serverTimeString = new Date(time).toISOString().slice(0, 19); // Extract relevant parts
            const endTimeString = new Date(endTime).toISOString().slice(0, 19); // Extract relevant parts
            // console.log("time is", serverTimeString, serverTimeString === endTimeString, endTimeString);
            if (serverTimeString === endTimeString) {
                navigate(`/contests/result`, {
                    state: { contestId: contestId}
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

      const memoizedLeaderboard = useMemo(() => {
        return <Leaderboard socket={socket} name={data?.name} />;
      }, [socket, data?.name]);

      const memoizedDailyContestMyRank = useMemo(() => {
        return <DailyContestMyRank socket={socket} />;
      }, [socket]);

    const memoizedTradableInstrument = useMemo(() => {
        return <TradableInstrument
          socket={socket}
          isGetStartedClicked={isGetStartedClicked}
          setIsGetStartedClicked={handleSetIsGetStartedClicked}
          from={dailyContest}
          contestData={data}
          watchList={watchList}
        />;
      }, [watchList, data, socket, isGetStartedClicked, handleSetIsGetStartedClicked]);
    
      const memoizedInstrumentDetails = useMemo(() => {
        return <WatchList
          socket={socket}
          isGetStartedClicked={isGetStartedClicked}
          setIsGetStartedClicked={handleSetIsGetStartedClicked}
          from={dailyContest}
          subscriptionId={contestId}
          contestData={data}
          setWatchList={setWatchList}
        />;
      }, [setWatchList, data, contestId, socket, handleSetIsGetStartedClicked, isGetStartedClicked]);
    
      const memoizedOverallPnl = useMemo(() => {
        return <OverallPnl
          socket={socket}
          isGetStartedClicked={isGetStartedClicked}
          setIsGetStartedClicked={handleSetIsGetStartedClicked}
          from={dailyContest}
          subscriptionId={contestId}
        //   setAvailbleMargin={setAvailbleMargin}
          contestData={data}
        />;
      }, [data, contestId, handleSetIsGetStartedClicked, isGetStartedClicked, socket]);
    

    return (
        <>
            <MDBox color="dark" mt={2} mb={1} borderRadius={10} minHeight='80vH'>
                <MDBox bgColor="lightgrey" display='flex' p={1} borderRadius={10}>
                    <MDBox width='100%' minHeight='auto' display='flex' justifyContent='center'>
                        <PnlAndMarginData contestId={contestId} />
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

                <Grid container spacing={0.5} p={0} mt={0.5} sx={{ display: 'flex', flexDirection: 'row' }}>
                    
                    <Grid item xs={12} md={12} lg={8} >
                        <MDBox sx={{ backgroundColor: '#1A73E8', height: '100%' }} borderRadius={3}>
                            {memoizedLeaderboard}
                        </MDBox>
                    </Grid>
                    
                    <Grid item xs={12} md={12} lg={4} >
                        <MDBox sx={{ backgroundColor: '#1A73E8', height: '100%' }} borderRadius={3}>
                            {memoizedDailyContestMyRank}
                        </MDBox>
                    </Grid>
                    
                </Grid>

                <Grid container p={1} mt={1} sx={{ backgroundColor: '#D3D3D3' }} borderRadius={3}>
                    <Grid item xs={12} md={6} lg={12} >
                        {memoizedOverallPnl}
                    </Grid>
                </Grid>
            </MDBox>
        </>
    );
}

export default Header;
