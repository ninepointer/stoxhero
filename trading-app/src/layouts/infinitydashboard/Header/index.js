import React, {useState, useEffect} from 'react';
import axios from "axios"
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Grid, CircularProgress, Divider, LinearProgress} from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import { Link } from "react-router-dom";
import CachedIcon from '@mui/icons-material/Cached';


export default function LabTabs({socket}) {
  const [isLoading,setIsLoading] = useState(false);
  const [isLoadingData,setIsLoadingData] = useState(false)
  const [trackEvent, setTrackEvent] = useState({});
  const [marketData, setMarketData] = useState([]);
  const [tradeData, setTradeData] = useState([]);
  const [lastLiveTradingDate, setLastLiveTradingDate] = useState("");
  const [lastMockTradingDate, setLastMockTradingDate] = useState("");
  const [tradeDataYesterday,setTradeDataYesterday] = useState([]);
  const [liveTradeData, setLiveTradeData] = useState([]);
  const [liveTradeYesterdayData, setLiveTradeYesterdayData] = useState([]);
  const [liveTradeMTDData, setLiveTradeMTDData] = useState([]);
  const [mockTradeMTDData, setMockTradeMTDData] = useState([]);
  const [liveTraderCount, setLiveTraderCount] = useState(0);
  const [notliveTraderCount, setNotLiveTraderCount] = useState(0);
  const [liveTraderCountRealTrade, setLiveTraderCountRealTrade] = useState(0);
  const [notliveTraderCountRealTrade, setNotLiveTraderCountRealTrade] = useState(0);
  let [refreshMargin, setRefreshMargin] = useState(true);
  let [refreshMockMargin, setRefreshMockMargin] = useState(true);
  const [isLoadMockMargin, setIsLoadMockMargin] = useState(false);
  const [isLoadLiveMargin, setIsLoadLiveMargin] = useState(false);

  const [marginData, setMarginData] = useState();
  const [mockMarginData, setMockMarginData] = useState();

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let totalTransactionCost = 0;
  let totalGrossPnl = 0;
  let totalRunningLots = 0;
  let totalTurnover = 0;
  let totalLots = 0;
  let totalTrades = 0;

  let liveTotalTransactionCost = 0;
  let liveTotalGrossPnl = 0;
  let liveTotalRunningLots = 0;
  let liveTotalTurnover = 0;
  let liveTotalLots = 0;
  let liveTotalTrades = 0;


  useEffect(()=>{
    setIsLoadLiveMargin(false)
    axios.get(`${baseUrl}api/v1/${"xtsMargin"}`)
      .then((res) => {
        console.log(res.data);
        setMarginData(res.data.data)
        setIsLoadLiveMargin(true)
      }).catch((err) => {
        return new Error(err);
      })
  }, [refreshMargin])

  console.log("mockMarginData", mockMarginData, isLoadMockMargin)

  useEffect(()=>{
    setIsLoadMockMargin(false)

    axios.get(`${baseUrl}api/v1/usedMargin/infinity`)
      .then((res) => {
        console.log(res.data);
        setMockMarginData(res.data.data)
        setIsLoadMockMargin(true)
      }).catch((err) => {
        return new Error(err);
      })
  }, [refreshMockMargin])

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getliveprice`)
    .then((res) => {
        //console.log("live price data", res)
        setMarketData(res.data);
        // setDetails.setMarketData(data);
    }).catch((err) => {
        return new Error(err);
    })

    socket.on('tick', (data) => {
    //   console.log("data from socket in instrument in parent in  mock", data);
      setMarketData(prevInstruments => {
        const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
        data.forEach(instrument => {
          instrumentMap.set(instrument.instrument_token, instrument);
        });
        return Array.from(instrumentMap.values());
      });
    })
  }, [])

  useEffect(()=>{
    socket.on('updatePnl', (data)=>{
      setTimeout(()=>{
        setTrackEvent(data);
      })
    })
  }, [])

  useEffect(()=>{
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/infinityTrade/mock/overallcompanypnltoday`)
    .then((res) => {
        setTradeData(res.data.data);
        setTimeout(()=>{
            setIsLoading(false)
        },500)
        
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/infinityTrade/live/overallcompanypnltoday`)
    .then((res) => {
        setLiveTradeData(res.data.data);
        setTimeout(()=>{
            setIsLoading(false)
        },500)
        
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/infinityTrade/mock/liveandtotaltradercounttoday`)
    .then((res) => {
        console.log(res.data.data)
        setNotLiveTraderCount(res.data.data[0].zeroLotsTraderCount)
        setLiveTraderCount(res.data.data[0].nonZeroLotsTraderCount)
        setTimeout(()=>{
            setIsLoading(false)
        },500)
        
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/infinityTrade/live/liveandtotaltradercounttoday`)
    .then((res) => {
        console.log(res.data.data)
        setNotLiveTraderCountRealTrade(res.data.data[0].zeroLotsTraderCount)
        setLiveTraderCountRealTrade(res.data.data[0].nonZeroLotsTraderCount)
        setTimeout(()=>{
            setIsLoading(false)
        },500)
        
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })
    
  }, [trackEvent])

  useEffect(()=>{
    setIsLoadingData(true)
    axios.get(`${baseUrl}api/v1/infinityTrade/mock/overallinfinitymockcompanypnlyesterday`)
    .then((res) => {
        setTradeDataYesterday(res.data.data);
        setLastMockTradingDate(res.data.date);
        setTimeout(()=>{
            setIsLoadingData(false)
        },500)
        
    }).catch((err) => {
        setIsLoadingData(false)
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/infinityTrade/live/overallinfinitylivecompanypnlyesterday`, {withCredentials:true})
    
    .then((res) => {
        console.log(res.data.data)
        setLiveTradeYesterdayData(res.data.data);
        setLastLiveTradingDate(res.data.date);
        setTimeout(()=>{
            setIsLoadingData(false)
        },500)
        
    }).catch((err) => {
        setIsLoadingData(false)
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/infinityTrade/live/overallinfinitylivecompanypnlMTD`)
    .then((res) => {
        console.log(res.data.data)
        setLiveTradeMTDData(res.data.data);
        setTimeout(()=>{
            setIsLoadingData(false)
        },500)
        
    }).catch((err) => {
        setIsLoadingData(false)
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/infinityTrade/mock/overallinfinitymockcompanypnlMTD`)
    .then((res) => {
        console.log(res.data.data)
        setMockTradeMTDData(res.data.data);
        setTimeout(()=>{
            setIsLoadingData(false)
        },500)
        
    }).catch((err) => {
        setIsLoadingData(false)
        return new Error(err);
    })
    
  }, [])

  useEffect(() => {
    return () => {
        socket.close();
    }
  }, [])

  console.log(tradeData)
  tradeData.map((subelem, index)=>{
    // let obj = {};
    totalRunningLots += Number(subelem.lots)
    totalTransactionCost += Number(subelem.brokerage);
    totalTurnover += Number(Math.abs(subelem.turnover));
    totalLots += Number(Math.abs(subelem.totallots))
    totalTrades += Number(subelem.trades)

    let liveDetail = marketData.filter((elem)=>{
        return elem !== undefined && (elem.instrument_token == subelem._id.instrumentToken || elem.instrument_token == subelem._id.exchangeInstrumentToken)
    })
    let updatedValue = (subelem.amount+(subelem.lots)*liveDetail[0]?.last_price);
    totalGrossPnl += updatedValue;
  })

  const totalGrossPnlcolor = totalGrossPnl >= 0 ? "success" : "error"
  const totalnetPnlcolor = (totalGrossPnl-totalTransactionCost) >= 0 ? "success" : "error"
  const totalquantitycolor = totalRunningLots >= 0 ? "success" : "error"


  liveTradeData.map((subelem, index)=>{
    // let obj = {};
    liveTotalRunningLots += Number(subelem.lots)
    liveTotalTransactionCost += Number(subelem.brokerage);
    liveTotalTurnover += Number(Math.abs(subelem.turnover));
    liveTotalLots += Number(Math.abs(subelem.totallots))
    liveTotalTrades += Number(subelem.trades)

    let liveDetail = marketData.filter((elem)=>{
        return elem !== undefined && (elem.instrument_token == subelem._id.instrumentToken || elem.instrument_token == subelem._id.exchangeInstrumentToken)
    })
    let updatedValue = (subelem.amount+(subelem.lots)*liveDetail[0]?.last_price);
    liveTotalGrossPnl += updatedValue;
  })

  const liveTotalGrossPnlcolor = liveTotalGrossPnl >= 0 ? "success" : "error"
  const liveTotalnetPnlcolor = (liveTotalGrossPnl-liveTotalTransactionCost) >= 0 ? "success" : "error"
  const liveTotalquantitycolor = liveTotalRunningLots >= 0 ? "success" : "error"
  const addInMargin = (totalGrossPnl - totalTransactionCost) >= 0 ? 0 : Math.abs(totalGrossPnl - totalTransactionCost);

  return (
    <MDBox bgColor="dark" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto' maxWidth='100%'>
        <MDBox>
            <MDTypography ml={1} mb={1} color='light' fontSize={18} fontWeight='bold'>Infinity Trading Dashboard</MDTypography>
        </MDBox>

        <Grid container lg={12}>
            <Grid item boxShadow={2} minHeight='20vH' minWidth='100%' style={{backgroundColor:'white'}} borderRadius={1}>
                {isLoading ? 
                    <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
                        <CircularProgress color='info'/>
                    </MDBox>
                :
                <>
                <Grid container>
                    <Grid item p={2} xs={12} lg={5.9}>
                        <MDTypography fontSize={16} fontWeight='bold' color='dark'>Today's (StoxHero)</MDTypography>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Gross P&L</MDTypography>
                                <MDTypography color={totalGrossPnlcolor} fontSize={12} display='flex' justifyContent='left'>{ (totalGrossPnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalGrossPnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-totalGrossPnl))}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Brokerage</MDTypography>
                                <MDTypography color='info' fontSize={12} display='flex' justifyContent='center'>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalTransactionCost)}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Net P&L</MDTypography>
                                <MDTypography color={totalnetPnlcolor} fontSize={12} display='flex' justifyContent='right'>{ (totalGrossPnl - totalTransactionCost) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalGrossPnl - totalTransactionCost)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalTransactionCost - totalGrossPnl))}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Lots</MDTypography>
                                <MDTypography color='info' fontSize={12} display='flex' justifyContent='left'>{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalLots)}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Running Lots</MDTypography>
                                <MDTypography color={totalquantitycolor} fontSize={12} display='flex' justifyContent='center'>{totalRunningLots}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Turnover</MDTypography>
                                <MDTypography color='info' fontSize={12} display='flex' justifyContent='right'>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalTurnover)}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'># of Trades</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{totalTrades}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Live/Total Traders</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{liveTraderCount}/{notliveTraderCount + liveTraderCount}</MDTypography>
                            </Grid>
                                <Grid item lg={4}>
                                    <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right' alignItems="center">
                                         Used Margin
                                    </MDTypography>
                                    <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right' alignItems="center">
                                        {( !isLoadMockMargin) ?
                                            <CircularProgress color="inherit" size={10} sx={{marginRight: "10px"}}/>
                                         :
                                         <span style={{ marginRight: '10px' }}>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(mockMarginData+addInMargin)}</span>
                                        }
                                         <CachedIcon sx={{ cursor: "pointer" }} onClick={() => { setRefreshMockMargin(!refreshMockMargin) }} />
                                    </MDTypography>
                                </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={true} lg={0.2} hidden={false}>
                        <Divider orientation='vertical' color='black'/>
                    </Grid>
                    
                    <Grid item p={2} xs={12} lg={5.9}>
                        <MDTypography fontSize={16} fontWeight='bold' color='dark'>Today's (Infinity)</MDTypography>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Gross P&L</MDTypography>
                                <MDTypography color={liveTotalGrossPnlcolor} fontSize={12} display='flex' justifyContent='left'>{ (liveTotalGrossPnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTotalGrossPnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-liveTotalGrossPnl))}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Brokerage</MDTypography>
                                <MDTypography color='info' fontSize={12} display='flex' justifyContent='center'>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTotalTransactionCost)}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Net P&L</MDTypography>
                                <MDTypography color={liveTotalnetPnlcolor} fontSize={12} display='flex' justifyContent='right'>{ (liveTotalGrossPnl - liveTotalTransactionCost) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTotalGrossPnl - liveTotalTransactionCost)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTotalTransactionCost - liveTotalGrossPnl))}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Lots</MDTypography>
                                <MDTypography color='info' fontSize={12} display='flex' justifyContent='left'>{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTotalLots)}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Running Lots</MDTypography>
                                <MDTypography color={liveTotalquantitycolor} fontSize={12} display='flex' justifyContent='center'>{liveTotalRunningLots}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Turnover</MDTypography>
                                <MDTypography color='info' fontSize={12} display='flex' justifyContent='right'>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTotalTurnover)}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'># of Trades</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{liveTotalTrades}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Live/Total Traders</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{liveTraderCountRealTrade}/{notliveTraderCountRealTrade + liveTraderCountRealTrade}</MDTypography>
                            </Grid>
                                <Grid item lg={4}>
                                    <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right' alignItems="center">
                                         Used Margin
                                    </MDTypography>
                                    <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right' alignItems="center">
                                        {( !isLoadLiveMargin) ?
                                            <CircularProgress color="inherit" size={10} sx={{marginRight: "10px"}}/>
                                         :
                                         <span style={{ marginRight: '10px' }}>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(marginData)}</span>
                                        }
                                         <CachedIcon sx={{ cursor: "pointer" }} onClick={() => { setRefreshMargin(!refreshMargin) }} />
                                    </MDTypography>
                                </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                </>
                }
            </Grid>
        </Grid>

        <Grid container lg={12} mt={2}>
            <Grid item boxShadow={2} minHeight='20vH' minWidth='100%' style={{backgroundColor:'#ECECEC'}} borderRadius={1}>
                {isLoadingData ? 
                    <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
                        <CircularProgress color='info'/>
                    </MDBox>
                :
                <>
                <Grid container>
                    <Grid item p={2} xs={12} lg={5.9}>
                        <MDTypography fontSize={16} fontWeight='bold' color='dark'>Last Trading Day (StoxHero) - {new Date(lastMockTradingDate).toLocaleDateString("en-US", {day: "numeric",month: "short",year: "numeric", weekday: "short"})}</MDTypography>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Gross P&L</MDTypography>
                                <MDTypography color="text" fontSize={12} display='flex' justifyContent='left'>{ tradeDataYesterday[0] ? (tradeDataYesterday[0]?.amount) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.amount)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-tradeDataYesterday[0]?.amount)) : "₹" + 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Brokerage</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{tradeDataYesterday[0] ? "₹"+(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.brokerage)) : "₹" + 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Net P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>{ tradeDataYesterday[0] ? (tradeDataYesterday[0]?.amount - tradeDataYesterday[0]?.brokerage) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.amount - tradeDataYesterday[0]?.brokerage)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.brokerage - tradeDataYesterday[0]?.amount)) : "₹" + 0}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Lots</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{tradeDataYesterday[0] ? (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.totalLots)) : 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Turnover</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{ tradeDataYesterday[0] ? "₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.turnover)) : "₹" + 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'># of Trades</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>{tradeDataYesterday[0] ? tradeDataYesterday[0]?.trades : 0}</MDTypography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={true} lg={0.2} hidden={false}>
                        <Divider orientation='vertical' color='black'/>
                    </Grid>
                    
                    <Grid item p={2} xs={12} lg={5.9}>
                        <MDTypography fontSize={16} fontWeight='bold' color='dark'>Last Trading Day (Infinity) - {new Date(lastLiveTradingDate).toLocaleDateString("en-US", {day: "numeric",month: "short",year: "numeric", weekday: "short"})}</MDTypography>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Gross P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{ liveTradeYesterdayData[0] ? (liveTradeYesterdayData[0]?.amount) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTradeYesterdayData[0]?.amount)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-liveTradeYesterdayData[0]?.amount)) : "₹" + 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Brokerage</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{liveTradeYesterdayData[0] ? "₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTradeYesterdayData[0]?.brokerage)) : "₹" + 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Net P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>{ liveTradeYesterdayData[0] ? (liveTradeYesterdayData[0]?.amount - liveTradeYesterdayData[0]?.brokerage) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTradeYesterdayData[0]?.amount - liveTradeYesterdayData[0]?.brokerage)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTradeYesterdayData[0]?.brokerage - liveTradeYesterdayData[0]?.amount)) : "₹" + 0}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Lots</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{liveTradeYesterdayData[0] ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTradeYesterdayData[0]?.totalLots) : 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Turnover</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{liveTradeYesterdayData[0] ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTradeYesterdayData[0]?.turnover) : "₹" + 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'># of Trades</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>{liveTradeYesterdayData[0] ? liveTradeYesterdayData[0]?.trades : 0}</MDTypography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                </>
                }
            </Grid>
        </Grid>

        <Grid container lg={12} mt={2}>
            <Grid item boxShadow={2} minHeight='20vH' minWidth='100%' style={{backgroundColor:'#ECECEC'}} borderRadius={1}>
                {isLoadingData ? 
                    <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
                        <CircularProgress color='info'/>
                    </MDBox>
                :
                <>
                <Grid container>
                    <Grid item p={2} xs={12} lg={5.9}>
                        <MDTypography fontSize={16} fontWeight='bold' color='dark'>MTD till yesterday (Mock)</MDTypography>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Gross P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{ mockTradeMTDData[0] ?  (mockTradeMTDData[0]?.amount) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(mockTradeMTDData[0]?.amount)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-mockTradeMTDData[0]?.amount)) : "₹" + 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Brokerage</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{mockTradeMTDData[0] ? "₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(mockTradeMTDData[0]?.brokerage)) : "₹" + 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Net P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>{ mockTradeMTDData[0] ? (mockTradeMTDData[0]?.amount - mockTradeMTDData[0]?.brokerage) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(mockTradeMTDData[0]?.amount - mockTradeMTDData[0]?.brokerage)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(mockTradeMTDData[0]?.brokerage - mockTradeMTDData[0]?.amount)) : "₹" + 0}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Lots</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{mockTradeMTDData[0] ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(mockTradeMTDData[0]?.totalLots) : 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Turnover</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{mockTradeMTDData[0] ? "₹"+(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(mockTradeMTDData[0]?.turnover)) : "₹" + 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'># of Trades</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>{mockTradeMTDData[0] ? mockTradeMTDData[0]?.trades : 0}</MDTypography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={true} lg={0.2} hidden={false}>
                        <Divider orientation='vertical' color='black'/>
                    </Grid>
                    
                    <Grid item p={2} xs={12} lg={5.9}>
                        <MDTypography fontSize={16} fontWeight='bold' color='dark'>MTD till yesterday (Infinity)</MDTypography>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Gross P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{ liveTradeMTDData[0] ?  (liveTradeMTDData[0]?.amount) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTradeMTDData[0]?.amount)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-liveTradeMTDData[0]?.amount)) : "₹" + 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Brokerage</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{liveTradeMTDData[0] ? "₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTradeMTDData[0]?.brokerage)) : "₹" + 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Net P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>{ liveTradeMTDData[0] ? (liveTradeMTDData[0]?.amount - liveTradeMTDData[0]?.brokerage) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTradeMTDData[0]?.amount - liveTradeMTDData[0]?.brokerage)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTradeMTDData[0]?.brokerage - liveTradeMTDData[0]?.amount)) : "₹" + 0}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Lots</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{liveTradeMTDData[0] ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTradeMTDData[0]?.totalLots) : 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Turnover</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{liveTradeMTDData[0] ? "₹"+(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTradeMTDData[0]?.turnover)) : "₹" + 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'># of Trades</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>{liveTradeMTDData[0] ? liveTradeMTDData[0]?.trades : 0}</MDTypography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                </>
                }
            </Grid>
        </Grid>

        <Grid container spacing={2} mt={1} >
            
            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"primary"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/companyposition`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Company Position(M)</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check today's mock company position here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Active Traders: <span style={{fontSize:11,fontWeight:700}}>{liveTraderCount}</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"white"}}><span style={{fontSize:11,fontWeight:700}}>Open Lots: {totalRunningLots}</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>
                
            </Grid>

            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"success"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/companyposition`,
                          }}
                          state= {{xts: true}}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Company Position(I)</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check today's infinity position here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Active Traders: <span style={{fontSize:11,fontWeight:700}}>0</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"white"}}><span style={{fontSize:11,fontWeight:700}}>Open Lots: {liveTotalRunningLots}</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>

            </Grid>

            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"warning"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/companypositionredis`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Company Position R(M)</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check today's mock(R) company position here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Active Traders: <span style={{fontSize:11,fontWeight:700}}>{liveTraderCount}</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"white"}}><span style={{fontSize:11,fontWeight:700}}>Open Lots: TBC</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>
                
            </Grid>

            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"secondary"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/companypositionredis`,
                          }}
                          state= {{xts: true}}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Company Position R(I)</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check today's infinity(R) position here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Active Traders: <span style={{fontSize:11,fontWeight:700}}>0</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"white"}}><span style={{fontSize:11,fontWeight:700}}>Open Lots: TBC</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>

            </Grid>

            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"success"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/traderposition`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Trader's Position(M)</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check today's traders position here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Active Traders: <span style={{fontSize:11,fontWeight:700}}>{liveTraderCount}</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"white"}}><span style={{fontSize:11,fontWeight:700}}>Open Lots: TBC</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>

            </Grid>

            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"secondary"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/traderposition`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Trader's Position(I)</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check today's traders position here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Active Traders: <span style={{fontSize:11,fontWeight:700}}>{liveTraderCount}</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"white"}}><span style={{fontSize:11,fontWeight:700}}>Open Lots: TBC</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>

            </Grid>

            <Grid item lg={3}>
                    <MDButton 
                        variant="contained" 
                        color={"error"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/cohortposition`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Cohort Position</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check today's cohort position here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Active Traders: <span style={{fontSize:11,fontWeight:700}}>{liveTraderCount}</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"white"}}><span style={{fontSize:11,fontWeight:700}}>Open Lots: TBC</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>
            </Grid>
         
            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"primary"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/adminreport`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Company's Report(M)</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check company side mock trades report here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Current Month's Net P&L(till yesterday): <span style={{fontSize:11,fontWeight:700}}>{ mockTradeMTDData[0] ? (mockTradeMTDData[0]?.amount - mockTradeMTDData[0]?.brokerage) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(mockTradeMTDData[0]?.amount - mockTradeMTDData[0]?.brokerage)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(mockTradeMTDData[0]?.brokerage - mockTradeMTDData[0]?.amount)) : "₹" + 0}</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>
                
            </Grid>

            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"error"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/adminreportlive`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Company's Report(I)</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check company side infinity trades report here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Current Month's Net P&L(till yesterday): <span style={{fontSize:11,fontWeight:700}}>{ liveTradeMTDData[0] ? (liveTradeMTDData[0]?.amount - liveTradeMTDData[0]?.brokerage) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTradeMTDData[0]?.amount - liveTradeMTDData[0]?.brokerage)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(liveTradeMTDData[0]?.brokerage - liveTradeMTDData[0]?.amount)) : "₹" + 0}</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>

            </Grid>

            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"warning"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/tradersReport`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Trader's Report(M)</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check trader side mock trades report here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Current Month's Net P&L(till yesterday): <span style={{fontSize:11,fontWeight:700}}>TBC</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>

            </Grid>

            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"success"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/tradersReportLive`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Trader's Report(I)</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check trader side infinity trades report here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Current Month's Net P&L(till yesterday): <span style={{fontSize:11,fontWeight:700}}>TBC</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>

            </Grid>
            
            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"error"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/infinitytrading`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Infinity Trading</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Take Infinity trades here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>My Current Month's Net P&L(till yesterday): <span style={{fontSize:11,fontWeight:700}}>TBC</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>
                
            </Grid>

            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"warning"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/analytics`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>My Analytics</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check your trading analytics here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>My Current Month's Net P&L(till yesterday): <span style={{fontSize:11,fontWeight:700}}>TBC</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>

            </Grid>

            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"success"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/funds`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>My Funds</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check your funds details here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Available Margin: <span style={{fontSize:11,fontWeight:700}}>TBC</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>

            </Grid>

            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"primary"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/myreferrals`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>My Referrals</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check your referrals here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Referral Count: <span style={{fontSize:11,fontWeight:700}}>TBC</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>

            </Grid>

            <Grid item lg={3}>

                  <MDButton
                      variant="contained"
                      color={"secondary"}
                      size="small"
                      component={Link}
                      to={{
                          pathname: `/backreportxts`,
                      }}
                  >
                      <Grid container>

                          <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                              <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, fontWeight: 'bold' }}>XTS App Trades</MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={12} mb={2} style={{ fontWeight: 1000 }}>
                              <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{ color: "white", paddingLeft: 4 }}>Check orders placed on XTS here!</MDTypography>
                              </MDBox>
                          </Grid>

                          <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                              <MDTypography fontSize={9} style={{color:"white"}}>Total Trades(this month): <span style={{fontSize:11,fontWeight:700}}>TBC</span></MDTypography>
                          </Grid>

                      </Grid>
                  </MDButton>

              </Grid>
            
        </Grid>

          <Grid container spacing={2} mt={1}>
              <Grid item lg={3} mt={1}>
                  <MDBox p={2} bgColor='text' borderRadius={5}>
                      <MDTypography color='light' fontSize={15} fontWeight='bold'>Quick Links</MDTypography>
                      <Grid container spacing={1} >
                        <Grid item fullWidth>
                                <MDButton
                                    variant="contained"
                                    color={"info"}
                                    size="small"
                                    component={Link}
                                    to={{
                                        pathname: `/brokerreports`,
                                    }}
                                >
                                    Broker Report
                                </MDButton>
                            </Grid>
                          <Grid item fullWidth>
                              <MDButton
                                  variant="contained"
                                  color={"success"}
                                  size="small"
                                  component={Link}
                                  to={{
                                      pathname: `/orders`,
                                  }}


                              >
                                  StoxHero Orders
                              </MDButton>
                          </Grid>

                          <Grid item fullWidth>
                              <MDButton
                                  variant="contained"
                                  color={"warning"}
                                  size="small"
                                  component={Link}
                                  to={{
                                      pathname: `/userorders`,
                                  }}
                              >
                                  My Orders
                              </MDButton>
                          </Grid>
                          <Grid item fullWidth>
                              <MDButton
                                  variant="contained"
                                  color={"light"}
                                  size="small"
                                  component={Link}
                                  to={{
                                      pathname: `/algobox`,
                                  }}
                              >
                                  AlgoBox
                              </MDButton>
                          </Grid>
                          <Grid item>
                              <MDButton
                                  variant="contained"
                                  color={"primary"}
                                  size="small"
                                  component={Link}
                                  to={{
                                      pathname: `/trading-accounts`,
                                  }}
                              >
                                  Trading Account
                              </MDButton>
                          </Grid>
                          <Grid item>
                              <MDButton
                                  variant="contained"
                                  color={"error"}
                                  size="small"
                                  component={Link}
                                  to={{
                                      pathname: `/instruments`,
                                  }}
                              >
                                  Instruments
                              </MDButton>
                          </Grid>
                          <Grid item>
                              <MDButton
                                  variant="contained"
                                  color={"warning"}
                                  size="small"
                                  component={Link}
                                  to={{
                                      pathname: `/setting`,
                                  }}
                              >
                                  App Settings
                              </MDButton>
                          </Grid>
                          <Grid item>
                              <MDButton
                                  variant="contained"
                                  color={"dark"}
                                  size="small"
                                  component={Link}
                                  to={{
                                      pathname: `/tradersMarginAllocation`,
                                  }}
                              >
                                  Margin Allocation
                              </MDButton>
                          </Grid>

                          <Grid item>
                              <MDButton
                                  variant="contained"
                                  color={"primary"}
                                  size="small"
                                  component={Link}
                                  to={{
                                      pathname: `/margindetails`,
                                  }}
                              >
                                  Margin Details
                              </MDButton>
                          </Grid>
                      </Grid>
                  </MDBox>

              </Grid>
              
          </Grid>

    </MDBox>
  );
}