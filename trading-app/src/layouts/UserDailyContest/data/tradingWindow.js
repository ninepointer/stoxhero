import { React, useState, useEffect, useContext, useCallback, useMemo } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { userContext } from '../../../AuthContext';
// import moment from 'moment'

// // prop-types is a library for typechecking of props.
// import PropTypes from "prop-types";
// import tradesicon from '../../../assets/images/tradesicon.png'

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

// Images
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
// import { InfinityTraderRole, tenxTrader } from "../../../variables";
// import ContestCup from '../../../assets/images/candlestick-chart.png'
// import ContestCarousel from '../../../assets/images/target.png'
// import Timer from '../timer'
// import ProgressBar from "../progressBar";
// import { HiUserGroup } from 'react-icons/hi';
import AMargin from '../../../assets/images/amargin.png'
import Profit from '../../../assets/images/profit.png'
import Tcost from '../../../assets/images/tcost.png'
import Chain from '../../../assets/images/chain.png'
import Nifty from '../../../assets/images/niftycharticon.png'
import BNifty from '../../../assets/images/bniftycharticon.png'
import FNifty from '../../../assets/images/fniftycharticon.png'

import { Divider } from "@mui/material";
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
// import { NetPnlContext } from '../../../PnlContext';



function Header({ socket, data }) {
    const [isGetStartedClicked, setIsGetStartedClicked] = useState(false);
    const [yesterdayData, setyesterdayData] = useState({});
    const [availbaleMargin, setAvailbleMargin] = useState([]);
    const [portfolio, setPortfolio] = useState();
    // const [showOption, setShowOption] = useState(false);
    const pnl = useContext(NetPnlContext);

    // useEffect(()=>{
    //     socket.on("serverTime", (time)=>{

    //     })
    // }, [])


    let contestId = data?.data;
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
        />;
      }, [data, socket, isGetStartedClicked, handleSetIsGetStartedClicked]);
    
      const memoizedInstrumentDetails = useMemo(() => {
        return <WatchList
          socket={socket}
          isGetStartedClicked={isGetStartedClicked}
          setIsGetStartedClicked={handleSetIsGetStartedClicked}
          from={dailyContest}
          subscriptionId={contestId}
          contestData={data}
        />;
      }, [data, contestId, socket, handleSetIsGetStartedClicked, isGetStartedClicked]);
    
      const memoizedOverallPnl = useMemo(() => {
        return <OverallPnl
          socket={socket}
          isGetStartedClicked={isGetStartedClicked}
          setIsGetStartedClicked={handleSetIsGetStartedClicked}
          from={dailyContest}
          subscriptionId={contestId}
          setAvailbleMargin={setAvailbleMargin}
          contestData={data}
        />;
      }, [data, contestId, handleSetIsGetStartedClicked, isGetStartedClicked, socket]);
    
    //   console.log("yesterdayData", yesterdayData);

    return (
        <>
            <MDBox color="dark" mt={2} mb={1} borderRadius={10} minHeight='80vH'>
                <MDBox bgColor="lightgrey" display='flex' p={1} borderRadius={10}>
                    <MDBox width='100%' minHeight='auto' display='flex' justifyContent='center'>
                        <Grid container spacing={1} xs={12} md={12} lg={12}>
                            <Grid item xs={12} md={6} lg={3}>
                                <MDButton style={{ minWidth: '100%' }}>
                                    <MDBox display='flex' alignItems='center'>
                                        <MDBox display='flex' justifyContent='flex-start'><img src={AMargin} width='40px' height='40px' /></MDBox>
                                        <MDBox><MDTypography ml={1} fontSize={11} fontWeight='bold'>Portfolio:</MDTypography></MDBox>
                                        <MDBox><MDTypography ml={1} fontSize={11}>{ (yesterdayData?.totalFund) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(yesterdayData?.totalFund)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-yesterdayData?.totalFund))}</MDTypography></MDBox>
                                    </MDBox>
                                </MDButton>
                            </Grid>
                            <Grid item xs={12} md={6} lg={3}>
                                <MDButton style={{ minWidth: '100%' }}>
                                    <MDBox display='flex' alignItems='center'>
                                        <MDBox display='flex' justifyContent='flex-start'><img src={Tcost} width='40px' height='40px' /></MDBox>
                                        <MDBox><MDTypography ml={1} fontSize={11} fontWeight='bold'>Margin:</MDTypography></MDBox>
                                        <MDBox><MDTypography ml={1} fontSize={11}>{ (yesterdayData?.totalFund + pnl?.netPnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((yesterdayData?.totalFund + pnl?.netPnl))) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-(yesterdayData?.totalFund + pnl?.netPnl)))}</MDTypography></MDBox>
                                    </MDBox>
                                </MDButton>
                            </Grid>
                            <Grid item xs={12} md={6} lg={3}>
                                <MDButton style={{ minWidth: '100%' }}>
                                    <MDBox display='flex' alignItems='center'>
                                        <MDBox display='flex' justifyContent='flex-start'><img src={Profit} width='40px' height='40px' /></MDBox>
                                        <MDBox><MDTypography ml={1} fontSize={11} fontWeight='bold'>Gross Profit:</MDTypography></MDBox>
                                        <MDBox><MDTypography ml={1} fontSize={11}> { (pnl?.grossPnlAndBrokerage?.grossPnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnl?.grossPnlAndBrokerage?.grossPnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-pnl?.grossPnlAndBrokerage?.grossPnl))}</MDTypography></MDBox>
                                    </MDBox>
                                </MDButton>
                            </Grid>
                            <Grid item xs={12} md={6} lg={3}>
                                <MDButton style={{ minWidth: '100%' }}>
                                    <MDBox display='flex' alignItems='center'>
                                        <MDBox display='flex' justifyContent='flex-start'><img src={Profit} width='40px' height='40px' /></MDBox>
                                        <MDBox><MDTypography ml={1} fontSize={11} fontWeight='bold'>Net Profit:</MDTypography></MDBox>
                                        <MDBox><MDTypography ml={1} fontSize={11}>{ (pnl?.netPnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnl?.netPnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-pnl?.netPnl))}</MDTypography></MDBox>
                                    </MDBox>
                                </MDButton>
                            </Grid>
                        </Grid>
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

                <Grid container p={1} mt={1} sx={{ backgroundColor: '#D3D3D3' }} borderRadius={3}>
                    <Grid spacing={-4} item xs={12} md={6} lg={12} >
                        <DailyContestMargin contestId={contestId} availbaleMargin={availbaleMargin} setyesterdayData={setyesterdayData} />
                    </Grid>
                </Grid>
            </MDBox>
        </>
    );
}

export default Header;
