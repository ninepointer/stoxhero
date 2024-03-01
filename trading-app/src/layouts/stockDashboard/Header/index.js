import React, {useState, useEffect} from 'react';
import axios from "axios"
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Grid, CircularProgress, Divider} from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import { Link } from "react-router-dom";
import DailyStockUsers from '../data/dailyStockUsers'
import ReactGA from "react-ga"

export default function LabTabs({socket}) {
  const [isLoading,setIsLoading] = useState(false);
  const [trackEvent, setTrackEvent] = useState({});
  const [marketData, setMarketData] = useState([]);
  const [dailyUsers, setDailyUsers] = useState();
  const [lastTradingDate,setLastTradingDate] = useState("");
  const [tradeData, setTradeData] = useState([]);
  const [tradeDataYesterday, setTradeDataYesterday] = useState([]);
  const [liveTraderCount, setLiveTraderCount] = useState(0);
  const [liveTraderCountYesterday, setLiveTraderCountYesterday] = useState(0);
  const [notliveTraderCount, setNotLiveTraderCount] = useState(0);
  const [notliveTraderCountYesterday, setNotLiveTraderCountYesterday] = useState(0);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  let totalTransactionCostMIS = 0;
  let totalTransactionCostCNC = 0;
  let totalGrossPnlMIS = 0;
  let totalGrossPnlCNC = 0;
  let totalRunningLotsMIS = 0;
  let totalRunningLotsCNC = 0;
  let totalTurnover = 0;
  let totalLots = 0;
  let totalTrades = 0;

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getstockliveprice`)
    .then((res) => {
        setMarketData(res.data);
    }).catch((err) => {
        return new Error(err);
    })

    socket.on('equity-ticks', (data) => {
      setMarketData(prevInstruments => {
        const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
        data.forEach(instrument => {
          instrumentMap.set(instrument.instrument_token, instrument);
        });
        return Array.from(instrumentMap.values());
      });
    })
  }, [])

  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
  }, []);

  useEffect(()=>{
    socket.on('updatePnl', (data)=>{
      setTimeout(()=>{
        setTrackEvent(data);
      })
    })
  }, [])

  useEffect(()=>{
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/stock/stockoveralltraderpnltoday`, {withCredentials: true})
    .then((res) => {
        setTradeData(res.data.data); 
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })
    axios.get(`${baseUrl}api/v1/stock/liveandtotaltradercounttoday`, {withCredentials: true})
    .then((res) => {
        setNotLiveTraderCount(res.data.data[0].zeroLotsTraderCount)
        setLiveTraderCount(res.data.data[0].nonZeroLotsTraderCount)
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/stock/dailystockusers`, {withCredentials: true})
    .then((res) => {
        setDailyUsers(res.data.data)
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/stock/stockoveralltraderpnlyesterday`, {withCredentials: true})
    .then((res) => {
        setTradeDataYesterday(res.data.data);
        setLastTradingDate(res.data.date);
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/stock/liveandtotaltradercountyesterday`, {withCredentials: true})
    .then((res) => {
        setNotLiveTraderCountYesterday(res.data.data[0].zeroLotsTraderCount)
        setLiveTraderCountYesterday(res.data.data[0].nonZeroLotsTraderCount)
        setTimeout(()=>{
            setIsLoading(false)
        },500)    
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    }) 
  }, [trackEvent])


  tradeData.map((subelem, index)=>{

    let liveDetail = marketData.filter((elem)=>{
        return (elem !== undefined && (elem.instrument_token == subelem._id.instrumentToken || elem.instrument_token == subelem._id.exchangeInstrumentToken));
    })

    if(subelem?._id?.product === "CNC"){
        totalRunningLotsCNC += Number(subelem.lots);
        totalTransactionCostCNC += Number(subelem.brokerage);
        let updatedValue = (subelem.amount+(subelem.lots)*liveDetail[0]?.last_price);
        totalGrossPnlCNC += updatedValue;
    }
    if(subelem?._id?.product === "MIS"){
        totalRunningLotsMIS += Number(subelem.lots);
        totalTransactionCostMIS += Number(subelem.brokerage);
        let updatedValue = (subelem.amount+(subelem.lots)*liveDetail[0]?.last_price);
        totalGrossPnlMIS += updatedValue;
    }
    
    
    totalTurnover += Number(Math.abs(subelem.turnover));
    totalLots += Number(Math.abs(subelem.totallots))
    totalTrades += Number(subelem.trades)




  })
  const totalGrossPnlcolorCNC = totalGrossPnlMIS >= 0 ? "#6FBF72" : "#F44335"
  const totalnetPnlcolorCNC = (totalGrossPnlCNC-totalTransactionCostCNC) >= 0 ? "#6FBF72" : "#F44335"

  const totalGrossPnlcolorMIS = totalGrossPnlMIS >= 0 ? "success" : "error"
  const totalnetPnlcolorMIS = (totalGrossPnlMIS-totalTransactionCostMIS) >= 0 ? "success" : "error"
  const totalquantitycolor = totalRunningLotsCNC >= 0 ? "#6FBF72" : "#F44335"
  const totalquantitycolorMIS = totalRunningLotsMIS >= 0 ? "success" : "error"

  return (
    <MDBox bgColor="dark" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto' maxWidth='100%'>
        <MDBox>
            <MDTypography ml={1} mb={1} color='light' fontSize={18} fontWeight='bold'>Stock Trading Dashboard</MDTypography>
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
                        <MDTypography fontSize={16} fontWeight='bold' color='dark'>Today's Stock Trading Position (Trader Side)</MDTypography>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={13} fontWeight='bold' display='flex' justifyContent='left'>Gross P&L(MIS/CNC)</MDTypography>
                                <MDTypography color={totalGrossPnlcolorMIS} fontSize={12} display='flex' justifyContent='left'>
                                { (totalGrossPnlMIS) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalGrossPnlMIS)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-totalGrossPnlMIS))}
                                     /<span style={{color: totalGrossPnlcolorCNC}} >{ (totalGrossPnlCNC) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalGrossPnlCNC)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-totalGrossPnlCNC))}</span>
                                    </MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={13} fontWeight='bold' display='flex' justifyContent='center'>Brokerage(MIS/CNC)</MDTypography>
                                <MDTypography color='info' fontSize={12} display='flex' justifyContent='center'>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalTransactionCostMIS)} /<span>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalTransactionCostCNC)}</span> </MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={13} fontWeight='bold' display='flex' justifyContent='right'>Net P&L(MIS/CNC)</MDTypography>
                                <MDTypography color={totalnetPnlcolorMIS} fontSize={12} display='flex' justifyContent='right'>
                                { (totalGrossPnlMIS - totalTransactionCostMIS) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalGrossPnlMIS - totalTransactionCostMIS)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalTransactionCostMIS - totalGrossPnlMIS))}
                                    / <span style={{color: totalnetPnlcolorCNC}}>{ (totalGrossPnlCNC - totalTransactionCostCNC) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalGrossPnlCNC - totalTransactionCostCNC)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalTransactionCostCNC - totalGrossPnlCNC))}</span>
                                    </MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container mt={1}>
                            <Grid item lg={3}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Lots</MDTypography>
                                <MDTypography color='info' fontSize={12} display='flex' justifyContent='left'>{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalLots)}</MDTypography>
                            </Grid>
                            <Grid item lg={6}>
                                <MDTypography color='text' fontSize={13} fontWeight='bold' display='flex' justifyContent='center'>Running Lots(MIS/CNC)</MDTypography>
                                <MDTypography color={totalquantitycolorMIS} fontSize={12} display='flex' justifyContent='center'>{totalRunningLotsMIS}/ <span style={{color: totalquantitycolor}}>{totalRunningLotsCNC}</span> </MDTypography>
                                {/* /<MDTypography color={totalquantitycolor} fontSize={12} display='flex' justifyContent='center'>{totalRunningLotsCNC}</MDTypography> */}
                            </Grid>
                            <Grid item lg={3}>
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
                        <MDTypography fontSize={16} fontWeight='bold' color='dark'>Last Stock Trading Day (Trader Side) - {new Date(lastTradingDate).toLocaleDateString("en-US", {day: "numeric",month: "short",year: "numeric", weekday: "short"})}</MDTypography>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={13} fontWeight='bold' display='flex' justifyContent='left'>Gross P&L(MIS/CNC)</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>
                                    {tradeDataYesterday[0] ? tradeDataYesterday[0]?.amountMIS >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.amountMIS)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-tradeDataYesterday[0]?.amountMIS)) : "₹" + 0}
                                    /<span>{tradeDataYesterday[0] ? tradeDataYesterday[0]?.amountCNC >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.amountCNC)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-tradeDataYesterday[0]?.amountCNC)) : "₹" + 0}</span>
                                    </MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={13} fontWeight='bold' display='flex' justifyContent='center'>Brokerage(MIS/CNC)</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>
                                    {tradeDataYesterday[0] ? "₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.brokerageMIS)) : "₹" + 0}
                                    /<span> {tradeDataYesterday[0] ? "₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.brokerageCNC)) : "₹" + 0}</span>
                                    </MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={13} fontWeight='bold' display='flex' justifyContent='right'>Net P&L(MIS/CNC)</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>
                                    { tradeDataYesterday[0] ? (tradeDataYesterday[0]?.amountMIS - tradeDataYesterday[0]?.brokerageMIS) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.amountMIS - tradeDataYesterday[0]?.brokerageMIS)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.brokerageMIS - tradeDataYesterday[0]?.amountMIS)) : "₹" + 0}
                                    /<span> { tradeDataYesterday[0] ? (tradeDataYesterday[0]?.amountCNC - tradeDataYesterday[0]?.brokerageCNC) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.amountCNC - tradeDataYesterday[0]?.brokerageCNC)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.brokerageCNC - tradeDataYesterday[0]?.amountCNC)) : "₹" + 0}</span>
                                    </MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container mt={1}>
                            <Grid item lg={3}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Lots</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{tradeDataYesterday[0] ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.totallots) : 0}</MDTypography>
                            </Grid>
                            <Grid item lg={6}>
                                <MDTypography color='text' fontSize={13} fontWeight='bold' display='flex' justifyContent='center'>Running Lots(MIS/CNC)</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{tradeDataYesterday?.[0]?.lotsMIS || 0}/ <span>{tradeDataYesterday?.[0]?.lotsCNC || 0}</span></MDTypography>
                            </Grid>
                            <Grid item lg={3}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Turnover</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>{tradeDataYesterday[0] ? "₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.turnover)) : "₹" + 0}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'># of Trades</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{tradeDataYesterday[0] ? tradeDataYesterday[0]?.trades : 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Live/Total Traders</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{liveTraderCountYesterday}/{notliveTraderCountYesterday}</MDTypography>
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

        <Grid style={{backgroundColor:'white',borderRadius:5}} container xs={12} md={12} lg={12} mt={1}>
            <Grid item xs={12} md={12} lg={12}>
                <MDBox p={0.5}>
                    { dailyUsers && <DailyStockUsers dailyUsers={dailyUsers}/>}
                </MDBox>
            </Grid>
        </Grid>

          <Grid spacing={2} mt={1} xs={12} md={12} lg={12} display='flex' justifyContent={'center'} alignItems='center' alignContent={'center'} gap={2}>

              <Grid item xs={12} md={6} lg={6}>
                  <MDButton
                      variant="contained"
                      color={"success"}
                      size="small"
                      component={Link}
                      to={{
                          pathname: `/stockposition`,
                      }}
                  >
                      <Grid container>

                          <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                              <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Stock Position</MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                              <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Check all trader's stock position here!</MDTypography>
                              </MDBox>
                          </Grid>

                      </Grid>
                  </MDButton>
              </Grid>

              {/* <Grid item xs={12} md={6} lg={4}>

                  <MDButton
                      variant="contained"
                      color={"primary"}
                      size="small"
                      component={Link}
                      to={{
                          pathname: `/stockreport`,
                      }}
                  >
                      <Grid container>

                          <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                              <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Stock Report</MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                              <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Check all stock trading reports here!</MDTypography>
                              </MDBox>
                          </Grid>

                      </Grid>
                  </MDButton>

              </Grid> */}

              <Grid item xs={12} md={6} lg={6}>
                  <MDButton
                      variant="contained"
                      color={"error"}
                      size="small"
                      component={Link}
                      to={{
                          pathname: `/stockorders`,
                      }}
                  >
                      <Grid container>

                          <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                              <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Orders</MDTypography>
                          </Grid>

                          <Grid item xs={12} md={6} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                              <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Check all stock trader's orders here!</MDTypography>
                              </MDBox>
                          </Grid>

                      </Grid>
                  </MDButton>
              </Grid>
          </Grid>
    </MDBox>
  );
}