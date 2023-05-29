import React, {useState, useEffect} from 'react';
import axios from "axios"
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Grid, CircularProgress, Divider} from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import MDAvatar from '../../../components/MDAvatar';
import man from '../../../assets/images/man.png'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Link, useLocation } from "react-router-dom";
import RunningPNLChart from '../data/runningpnlchart'
import data from "../data";
 
//data

export default function LabTabs({socket}) {
//   const { columns, rows } = data();
//   const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);
  const [trackEvent, setTrackEvent] = useState({});
//   const [liveDetail, setLiveDetail] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [tradeData, setTradeData] = useState([]);
  const [liveTradeData, setLiveTradeData] = useState([]);
  const [liveTraderCount, setLiveTraderCount] = useState(0);
  const [notliveTraderCount, setNotLiveTraderCount] = useState(0);
  const [liveTraderCountRealTrade, setLiveTraderCountRealTrade] = useState(0);
  const [notliveTraderCountRealTrade, setNotLiveTraderCountRealTrade] = useState(0);

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
//   let liveDetailsArr = [];
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

//   const handleChange = (event, newValue) => {
//     setIsLoading(true)
//     setValue(newValue);
//     setTimeout(() => {
//       setIsLoading(false)
//     }, 500);
//   };

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
      console.log("in the pnl event", data)
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


  useEffect(() => {
    return () => {
        socket.close();
    }
  }, [])

  console.log(tradeData)
  tradeData.map((subelem, index)=>{
    let obj = {};
    totalRunningLots += Number(subelem.lots)
    totalTransactionCost += Number(subelem.brokerage);
    totalTurnover += Number(Math.abs(subelem.amount));
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
    let obj = {};
    liveTotalRunningLots += Number(subelem.lots)
    liveTotalTransactionCost += Number(subelem.brokerage);
    liveTotalTurnover += Number(Math.abs(subelem.amount));
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
                                <MDTypography color='info' fontSize={12} display='flex' justifyContent='left'>{totalLots}</MDTypography>
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
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Used Margin</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>To Be Configured</MDTypography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={true} lg={0.2} hidden={false}>
                        <Divider orientation='vertical' color='black'/>
                    </Grid>
                    
                    <Grid item p={2} xs={12} lg={5.9}>
                        <MDTypography fontSize={16} fontWeight='bold' color='dark'>Today's (XTS)</MDTypography>
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
                                <MDTypography color='info' fontSize={12} display='flex' justifyContent='left'>{liveTotalLots}</MDTypography>
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
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Used Margin</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>To Be Configured</MDTypography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                </>
                }
            </Grid>
        </Grid>

        <Grid container spacing={2} mt={1} height='15vH'>
            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"warning"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/companyposition`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={20} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>StoxHero Position</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check today's company position here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Active Traders: <span style={{fontSize:11,fontWeight:700}}>{liveTraderCount}</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"white"}}><span style={{fontSize:11,fontWeight:700}}>Company Side</span></MDTypography>
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
                                  <MDTypography fontSize={20} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>XTS Position</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check today's XTS position here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Active Traders: <span style={{fontSize:11,fontWeight:700}}>0</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"white"}}><span style={{fontSize:11,fontWeight:700}}>Company Side</span></MDTypography>
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
                            pathname: `/traderposition`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={20} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Trader's Position</MDTypography>
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
                                  <MDTypography fontSize={9} style={{color:"white"}}><span style={{fontSize:11,fontWeight:700}}>Trader Side</span></MDTypography>
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
                                  <MDTypography fontSize={20} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Cohort Position</MDTypography>
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
                                  <MDTypography fontSize={9} style={{color:"white"}}><span style={{fontSize:11,fontWeight:700}}>Trader Side</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>
            </Grid>
        </Grid>

        <Grid container spacing={2} mt={1} height='15vH'>
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
                                  <MDTypography fontSize={18} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Company's Report(M)</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check company side mock trades report here!</MDTypography>
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
                        color={"error"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/adminreportlive`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={18} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Company's Report(L)</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check company side live trades report here!</MDTypography>
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
                        color={"warning"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/tradersReport`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={18} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Trader's Report(M)</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check trader side mock trades report here!</MDTypography>
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
                            pathname: `/tradersReportLive`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={18} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Trader's Report(L)</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check trader side live trades report here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Current Month's P&L: <span style={{fontSize:11,fontWeight:700}}>10,000,000</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>

            </Grid>
            
        </Grid>

        <Grid container spacing={2} mt={1} height='15vH'>
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
                                  <MDTypography fontSize={18} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Infinity Trading</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Take Infinity trades here!</MDTypography>
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
                        color={"warning"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/analytics`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={18} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Analytics</MDTypography>
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
                            pathname: `/funds`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={18} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Funds</MDTypography>
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
                                  <MDTypography fontSize={18} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Referrals</MDTypography>
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

            </Grid>
            
        </Grid>

        <Grid container spacing={2} mt={1}>
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
                                    pathname: `/orders`,
                                  }}
                            >
                                SroxHero Orders
                            </MDButton>
                        </Grid>
                        <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"warning"} 
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
                                color={"light"} 
                                size="small" 
                                component = {Link}
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
                                component = {Link}
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
                                component = {Link}
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
                                component = {Link}
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
                                component = {Link}
                                to={{
                                    pathname: `/tradersMarginAllocation`,
                                  }}
                            >
                                Margin Allocation
                            </MDButton>
                        </Grid>
                    </Grid>
                </MDBox>
                
            </Grid>
        </Grid>

    </MDBox>
  );
}