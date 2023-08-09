import React, {useState, useEffect} from 'react';
import axios from "axios"
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Grid, CircularProgress, Divider} from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import { Link } from "react-router-dom";
import CachedIcon from '@mui/icons-material/Cached';

//data
import CompanySideContestDailyChart from '../data/companySideContestDailyChart'
import DailyContestUsers from '../data/dailyContestUsers'
import DailyPaidContestUsers from '../data/dailyPaidContestUsers'

export default function LabTabs({socket}) {
  const [isLoading,setIsLoading] = useState(false);
  const [trackEvent, setTrackEvent] = useState({});
  const [marketData, setMarketData] = useState([]);
  const [tradeData, setTradeData] = useState([]);
  const [dailyContestUsers, setDailyContestUsers] = useState();
  const [dailyAllContestUsers, setDailyAllContestUsers] = useState();
  const [completedContest,setCompletedContest] = useState();
  const [tradeDataYesterday, setTradeDataYesterday] = useState([]);
  const [tradeDataThisMonth, setTradeDataThisMonth] = useState([]);
  const [tradeDataLifetime, setTradeDataLifetime] = useState([]);
  const [liveTraderCount, setLiveTraderCount] = useState(0);
  const [liveTraderCountYesterday, setLiveTraderCountYesterday] = useState(0);
  const [notliveTraderCount, setNotLiveTraderCount] = useState(0);
  const [notliveTraderCountYesterday, setNotLiveTraderCountYesterday] = useState(0);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let totalTransactionCost = 0;
  let totalGrossPnl = 0;
  let totalRunningLots = 0;
  let totalTurnover = 0;
  let totalLots = 0;
  let totalTrades = 0;
  let totalAbsRunningLots = 0;

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getliveprice`)
    .then((res) => {
        setMarketData(res.data);
    }).catch((err) => {
        return new Error(err);
    })

    socket.on('tick', (data) => {
      setMarketData(prevInstruments => {
        const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
        data.forEach(instrument => {
          instrumentMap.set(instrument.instrument_token, instrument);
        });
        return Array.from(instrumentMap.values());
      });
    })

    axios.get(`${baseUrl}api/v1/dailycontest/trade/payoutchart`, {withCredentials: true})
    .then((res) => {
        console.log("Inside Payout chart data");
        setCompletedContest(res.data.data);
        console.log("Completed Contest Res:",res.data.data)
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })
  }, [])

  useEffect(()=>{
    let call1 = axios.get((`${baseUrl}api/v1/dailycontest/contest/dailyallcontestusers`),{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
            },
        })
    Promise.all([call1])
    .then(([api1Response]) => {
    //   setDailyContestUsers(api1Response.data.data)
      setDailyAllContestUsers(api1Response.data.data)
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
    
  },[])

  useEffect(()=>{
    socket.on('updatePnl', (data)=>{
      setTimeout(()=>{
        setTrackEvent(data);
      })
    })
  }, [])

  useEffect(()=>{
    console.log("Loading: ",isLoading)
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/dailycontest/trade/overalltraderpnltoday`, {withCredentials: true})
    .then((res) => {
        setTradeData(res.data.data); 
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })
    console.log("Loading: ",isLoading)
    axios.get(`${baseUrl}api/v1/dailycontest/trade/liveandtotaltradercounttoday`, {withCredentials: true})
    .then((res) => {
        setNotLiveTraderCount(res.data.data[0].zeroLotsTraderCount)
        setLiveTraderCount(res.data.data[0].nonZeroLotsTraderCount)
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/dailycontest/trade/overalltraderpnlyesterday`, {withCredentials: true})
    .then((res) => {
        setTradeDataYesterday(res?.data?.data);
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/dailycontest/trade/overalltraderpnlthismonth`, {withCredentials: true})
    .then((res) => {
        setTradeDataThisMonth(res?.data?.data[0]);
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/dailycontest/trade/overalltraderpnllifetime`, {withCredentials: true})
    .then((res) => {
        setTradeDataLifetime(res?.data?.data[0]);
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/dailycontest/trade/liveandtotaltradercountyesterday`, {withCredentials: true})
    .then((res) => {
        setNotLiveTraderCountYesterday(res?.data?.data[0]?.zeroLotsTraderCount)
        setLiveTraderCountYesterday(res?.data?.data[0]?.nonZeroLotsTraderCount)
        setTimeout(()=>{
            setIsLoading(false)
        },500)    
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    }) 

    // axios.get(`${baseUrl}api/v1/dailycontest/trade/payoutchart`)
    // .then((res) => {
    //     setCompletedContest(res?.data?.data);
    //     console.log("Completed Contest Red:",res.data)
    // }).catch((err) => {
    //     setIsLoading(false)
    //     return new Error(err);
    // })
  }, [trackEvent])

  useEffect(() => {
    return () => {
        socket.close();
    }
  }, [])

//   const [mockMarginData, setMockMarginData] = useState();
//   const [isLoadMockMargin, setIsLoadMockMargin] = useState(false);
//   let [refreshMockMargin, setRefreshMockMargin] = useState(true);

//   useEffect(()=>{
//     setIsLoadMockMargin(false)
//     axios.get(`${baseUrl}api/v1/usedMargin/dailycontest`)
//       .then((res) => {
//         console.log(res.data);
//         setMockMarginData(res.data.data)
//         setIsLoadMockMargin(true)
//       }).catch((err) => {
//         return new Error(err);
//       })
//   }, [refreshMockMargin])

  tradeData.map((subelem, index)=>{
    let obj = {};
    totalRunningLots += Number(subelem?.lots)
    totalAbsRunningLots += Math.abs(Number(subelem?.lots))
    totalTransactionCost += Number(subelem?.brokerage);
    totalTurnover += Number(Math.abs(subelem?.turnover));
    totalLots += Number(Math.abs(subelem?.totallots))
    totalTrades += Number(subelem?.trades)

    let liveDetail = marketData.filter((elem)=>{
        return (elem !== undefined && (elem?.instrument_token == subelem?._id?.instrumentToken || elem?.instrument_token == subelem?._id?.exchangeInstrumentToken));
    })
    let updatedValue = (subelem?.amount+(subelem?.lots)*liveDetail[0]?.last_price);
    totalGrossPnl += updatedValue;

  })

  const totalGrossPnlcolor = totalGrossPnl >= 0 ? "success" : "error"
  const totalnetPnlcolor = (totalGrossPnl-totalTransactionCost) >= 0 ? "success" : "error"
  const totalquantitycolor = totalRunningLots >= 0 ? "success" : "error"

  return (
    <MDBox bgColor="dark" mt={2} mb={1} p={2} borderRadius={10} display='flex' flexDirection='column' justifyContent='center' alignItems='center' minHeight='auto' maxWidth='100%'>
        <MDBox display='flex' justifyContent='left'>
            <MDTypography ml={1} mb={1} color='light' fontSize={18} fontWeight='bold'>Contest Dashboard</MDTypography>
        </MDBox>

        <Grid container xs={12} md={12} lg={12}>
            <Grid item boxShadow={2} minHeight='20vH' minWidth='100%' style={{backgroundColor:'white'}} borderRadius={1}>
                {isLoading ? 
                    <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
                        <CircularProgress color='info'/>
                    </MDBox>
                :
                <>
                <Grid container xs={12} md={12} lg={12}>
                    <Grid item p={2} xs={12} md={12} lg={5.9}>
                        <MDTypography fontSize={16} fontWeight='bold' color='dark'>Today's Contest Position (Company Side)</MDTypography>
                        <Grid container spacing={.5} xs={12} md={12} lg={12} mt={1}>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Gross P&L</MDTypography>
                                <MDTypography color={totalGrossPnlcolor} fontSize={12} display='flex' justifyContent='left'>{ (totalGrossPnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalGrossPnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-totalGrossPnl))}</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Brokerage</MDTypography>
                                <MDTypography color='info' fontSize={12} display='flex' justifyContent='center'>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalTransactionCost)}</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Net P&L</MDTypography>
                                <MDTypography color={totalnetPnlcolor} fontSize={12} display='flex' justifyContent='right'>{ (totalGrossPnl - totalTransactionCost) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalGrossPnl - totalTransactionCost)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalTransactionCost - totalGrossPnl))}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={.5} xs={12} md={12} lg={12} mt={1}>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Lots</MDTypography>
                                <MDTypography color='info' fontSize={12} display='flex' justifyContent='left'>{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalLots)}</MDTypography>
                            </Grid>
                            <Grid item  xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Running Lots</MDTypography>
                                <MDTypography color={totalquantitycolor} fontSize={12} display='flex' justifyContent='center'>{totalRunningLots}</MDTypography>
                            </Grid>
                            <Grid item  xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Abs. Running Lots</MDTypography>
                                <MDTypography color='info' fontSize={12} display='flex' justifyContent='right'>{totalAbsRunningLots}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={.5} xs={12} md={12} lg={12} mt={1}>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'># of Trades</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{totalTrades}</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Live/Total Traders</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{liveTraderCount}/{notliveTraderCount + liveTraderCount}</MDTypography>
                            </Grid>
                            <Grid item  xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Turnover</MDTypography>
                                <MDTypography color='info' fontSize={12} display='flex' justifyContent='right'>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalTurnover)}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={.5} xs={12} md={12} lg={12} mt={1}>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Purchase</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>NA</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Total Revenue</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>NA</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Total Payout</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>NA</MDTypography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={true} lg={0.2} hidden={false}>
                        <Divider orientation='vertical' color='black'/>
                    </Grid>

                    <Grid item p={2} xs={12} md={12} lg={5.9}>
                        <MDTypography fontSize={16} fontWeight='bold' color='dark'>Last Trading Day Contest Position (Company Side)</MDTypography>
                        <Grid container spacing={.5} xs={12} md={12} lg={12} mt={1}>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Gross P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{tradeDataYesterday[0] ?? 0 ? tradeDataYesterday[0]?.amount >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.amount)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-tradeDataYesterday[0]?.amount)) : "₹" + 0}</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Brokerage</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{tradeDataYesterday[0] ?? 0 ? "₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.brokerage)) : "₹" + 0}</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Net P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>{ tradeDataYesterday[0] ?? 0 ? (tradeDataYesterday[0]?.amount - tradeDataYesterday[0]?.brokerage) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.amount - tradeDataYesterday[0]?.brokerage)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.brokerage - tradeDataYesterday[0]?.amount)) : "₹" + 0}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={.5} xs={12} md={12} lg={12} mt={1}>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Lots</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{tradeDataYesterday[0] ?? 0 ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.totallots) : 0}</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Running Lots</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{tradeDataYesterday[0] ?? 0 ? tradeDataYesterday[0]?.lots : 0}</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Turnover</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>{tradeDataYesterday[0] ?? 0 ? "₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.turnover)) : "₹" + 0}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={.5} xs={12} md={12} lg={12} mt={1}>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'># of Trades</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{tradeDataYesterday[0] ?? 0 ? tradeDataYesterday[0]?.trades : 0}</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Live/Total Traders</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{liveTraderCountYesterday}/{notliveTraderCountYesterday}</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Used Margin</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>To Be Configured</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={.5} xs={12} md={12} lg={12} mt={1}>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Purchase</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>NA</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Total Revenue</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>NA</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Total Payout</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>NA</MDTypography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                </>
                }
            </Grid>
        </Grid>

        <Grid container xs={12} md={12} lg={12} mt={1}>
            <Grid item boxShadow={2} minHeight='20vH' minWidth='100%' style={{backgroundColor:'white'}} borderRadius={1}>
                {isLoading ? 
                    <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
                        <CircularProgress color='info'/>
                    </MDBox>
                :
                <>
                <Grid container xs={12} md={12} lg={12}>
                    <Grid item p={2} xs={12} md={12} lg={5.9}>
                        <MDTypography fontSize={16} fontWeight='bold' color='dark'>MTD till Yesterday Contest Position (Company Side)</MDTypography>
                        <Grid container spacing={.5} xs={12} md={12} lg={12} mt={1}>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Gross P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{ (tradeDataThisMonth?.gpnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataThisMonth?.gpnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-tradeDataThisMonth?.gpnl))}</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Brokerage</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataThisMonth?.brokerage)}</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Net P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>{ (tradeDataThisMonth?.gpnl - tradeDataThisMonth?.brokerage) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataThisMonth?.gpnl - tradeDataThisMonth?.brokerage)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataThisMonth?.brokerage - tradeDataThisMonth?.gpnl))}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={.5} xs={12} md={12} lg={12} mt={1}>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Lots</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataThisMonth?.lotUsed)}</MDTypography>
                            </Grid>
                            <Grid item  xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'># of Trades</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{tradeDataThisMonth?.trades}</MDTypography>
                            </Grid>
                            <Grid item  xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Turnover</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataThisMonth?.turnover)}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={.5} xs={12} md={12} lg={12} mt={1}>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Contests</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>NA</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Free Contests</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>NA</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Paid Contests</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>NA</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={.5} xs={12} md={12} lg={12} mt={1}>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Purchase</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>NA</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Total Revenue</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>NA</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Total Payout</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>NA</MDTypography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={true} lg={0.2} hidden={false}>
                        <Divider orientation='vertical' color='black'/>
                    </Grid>

                    <Grid item p={2} xs={12} md={12} lg={5.9}>
                        <MDTypography fontSize={16} fontWeight='bold' color='dark'>Lifetime till Yesterday Contest Position (Company Side)</MDTypography>
                        <Grid container spacing={.5} xs={12} md={12} lg={12} mt={1}>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Gross P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{ (tradeDataLifetime?.gpnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataLifetime?.gpnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-tradeDataLifetime?.gpnl))}</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Brokerage</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataLifetime?.brokerage)}</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Net P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>{ (tradeDataLifetime?.gpnl - tradeDataLifetime?.brokerage) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataLifetime?.gpnl - tradeDataLifetime?.brokerage)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataLifetime?.brokerage - tradeDataLifetime?.gpnl))}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={.5} xs={12} md={12} lg={12} mt={1}>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Lots</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataLifetime?.lotUsed)}</MDTypography>
                            </Grid>
                            <Grid item  xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'># of Trades</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{tradeDataLifetime?.trades}</MDTypography>
                            </Grid>
                            <Grid item  xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Turnover</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataLifetime?.turnover)}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={.5} xs={12} md={12} lg={12} mt={1}>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Contests</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>NA</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Free Contests</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>NA</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Paid Contests</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>NA</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={.5} xs={12} md={12} lg={12} mt={1}>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Purchase</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>NA</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Total Revenue</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>NA</MDTypography>
                            </Grid>
                            <Grid item xs={4} md={4} lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Total Payout</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>NA</MDTypography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                </>
                }
            </Grid>
        </Grid>

        <Grid container spacing={1} xs={12} md={12} lg={12} mt={0.5} mb={0.5} display='flex' justifyContent='center' alignItems='center'>

            <Grid item xs={12} md={6} lg={3}>

                <MDButton
                    variant="contained"
                    color={"success"}
                    size="small"
                    component={Link}
                    to={{
                        pathname: `/contestdashboard/dailycontestposition`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Contest Position(Company)</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Check all trader's contest position here!</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Active Contests: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Completed Contests: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                    </Grid>
                </MDButton>

            </Grid>

            <Grid item xs={12} md={6} lg={3}>

                <MDButton
                    variant="contained"
                    color={"warning"}
                    size="small"
                    component={Link}
                    to={{
                        pathname: `/contestdashboard/dailycontestpositiontrader`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Contest Position(Trader)</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Check all trader's contest position here!</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Active Contests: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Completed Contests: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                    </Grid>
                </MDButton>

            </Grid>

            <Grid item xs={12} md={6} lg={3}>

                <MDButton
                    variant="contained"
                    color={"secondary"}
                    size="small"
                    component={Link}
                    to={{
                        pathname: `/contestdashboard/dailycontestreport`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Contest Report</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Check all daily contest reports here!</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Free Contests: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Paid Contests: <span style={{ fontSize: 11, fontWeight: 700 }}>5</span></MDTypography>
                        </Grid>

                    </Grid>
                </MDButton>

            </Grid>

            <Grid item xs={12} md={6} lg={3}>

                <MDButton
                    variant="contained"
                    color={"primary"}
                    size="small"
                    component={Link}
                    to={{
                        pathname: `/contestdashboard/dailycontest`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Daily Contest</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Create Daily Contest here!</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Free Contests: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Paid Contests: <span style={{ fontSize: 11, fontWeight: 700 }}>5</span></MDTypography>
                        </Grid>

                    </Grid>
                </MDButton>

            </Grid>

            {/* <Grid item xs={12} md={6} lg={3}>
                <MDButton 
                    variant="contained" 
                    color={"error"} 
                    size="small" 
                    component = {Link}
                    to={{
                        pathname: `/careerlist`,
                        }}
                    >
                        <Grid container>
                            
                            <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Queries</MDTypography>
                            </Grid>
                            
                            <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check all virtual trader's queries here!</MDTypography>
                                </MDBox>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                <MDTypography fontSize={9} style={{color:"white"}}>Active Postings: <span style={{fontSize:11,fontWeight:700}}>4</span></MDTypography>
                            </Grid>
    
                            <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                <MDTypography fontSize={9} style={{color:"white"}}>Total Postings: <span style={{fontSize:11,fontWeight:700}}>10</span></MDTypography>
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
                        pathname: `/wallet`,
                        }}
                    >
                        <Grid container>
                            
                            <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>My Wallet</MDTypography>
                            </Grid>
                            
                            <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                <MDBox display='flex' justifyContent='left'>
                                <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check your wallet transacrions here!</MDTypography>
                                </MDBox>
                            </Grid>

                            <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                <MDTypography fontSize={9} style={{color:"white"}}>Current Month's P&L: <span style={{fontSize:11,fontWeight:700}}>10,000,000</span></MDTypography>
                            </Grid>
    
                        </Grid>
                </MDButton>
            
        </Grid> */}

            {/* <Grid item lg={3}>
                
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
                                <MDTypography fontSize={9} style={{color:"white"}}>Current Month's P&L: <span style={{fontSize:11,fontWeight:700}}>10,000,000</span></MDTypography>
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
                        pathname: `/myportfolio`,
                        }}
                    >
                        <Grid container>
                            
                            <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>My Portfolio</MDTypography>
                            </Grid>
                            
                            <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                <MDBox display='flex' justifyContent='left'>
                                <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check your funds details here!</MDTypography>
                                </MDBox>
                            </Grid>

                            <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                <MDTypography fontSize={9} style={{color:"white"}}>Current Month's P&L: <span style={{fontSize:11,fontWeight:700}}>10,000,000</span></MDTypography>
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
                                <MDTypography fontSize={9} style={{color:"white"}}>Current Month's P&L: <span style={{fontSize:11,fontWeight:700}}>10,000,000</span></MDTypography>
                            </Grid>
    
                        </Grid>
                </MDButton>

        </Grid> */}

        </Grid>

        <Grid style={{backgroundColor:'white',borderRadius:5}} container xs={12} md={12} lg={12} mt={1}>
            <Grid item xs={12} md={12} lg={12}>
                <MDBox p={1}>
                    { completedContest && <CompanySideContestDailyChart completedContest={completedContest}/>}
                </MDBox>
            </Grid>
        </Grid>

        {/* <Grid style={{backgroundColor:'white',borderRadius:5}} container xs={12} md={12} lg={12} mt={1}>
            <Grid item xs={12} md={12} lg={12}>
                <MDBox p={0.5}>
                    { dailyContestUsers && <DailyContestUsers dailyContestUsers={dailyContestUsers}/>}
                </MDBox>
            </Grid>
        </Grid> */}

        <Grid style={{backgroundColor:'white',borderRadius:5}} container xs={12} md={12} lg={12} mt={1}>
            <Grid item xs={12} md={12} lg={12}>
                <MDBox p={0.5}>
                    { dailyAllContestUsers && <DailyPaidContestUsers dailyAllContestUsers={dailyAllContestUsers}/>}
                </MDBox>
            </Grid>
        </Grid>

        <Grid container spacing={2} xs={12} md={12} lg={12} mt={1}>
            <Grid item lg={3}>
                <MDBox p={2} bgColor='text' borderRadius={5}>
                    <MDTypography color='light' fontSize={15} fontWeight='bold'>Quick Links</MDTypography>
                    <Grid container spacing={1}>
                        <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"success"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/internshiporders`,
                                  }}
                            >
                                Virtual Trade Orders
                            </MDButton>
                        </Grid>
                        <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"dark"} 
                                size="small" 
                                component = {Link}
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
                                color={"warning"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/portfolio`,
                                  }}
                            >
                                Portfolio
                            </MDButton>
                        </Grid>
                        <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"error"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/referralprogram`,
                                  }}
                            >
                                Referral Program
                            </MDButton>
                        </Grid>
                        <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"dark"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/tutorialvideos`,
                                  }}
                            >
                                Tutorial Videos
                            </MDButton>
                        </Grid>
                    </Grid>
                </MDBox>
                
            </Grid>
        </Grid>

    </MDBox>
  );
}