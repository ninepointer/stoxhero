import React, { useState, useEffect } from 'react';
import axios from "axios"
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import { Grid, CircularProgress, Divider } from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import CachedIcon from '@mui/icons-material/Cached';
import WinnerImage from '../../../assets/images/cup-image.png'

import { Link } from "react-router-dom";
import MismatchDetails from '../infinityContestComponent/mismatchReport';


export default function LabTabs({socket}) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [isLoading, setIsLoading] = useState(false)
    const [liveContest, setLiveContest] = useState([]);
    const [marginData, setMarginData] = useState();
    const [isLoadLiveMargin, setIsLoadLiveMargin] = useState(false);
    let [refreshMargin, setRefreshMargin] = useState(true);
    const [trackEvent, setTrackEvent] = useState({});
    const [marketData, setMarketData] = useState([]);
    const [tradeData, setTradeData] = useState([]);
    const [traderData, setTraderData] = useState([]);
    
    useEffect(() => {
        let call1 = axios.get(`${baseUrl}api/v1/dailycontest/livecontest`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        })
        Promise.all([call1])
            .then(([api1Response]) => {
                // Process the responses here
                setLiveContest(api1Response.data.data)
            })
            .catch((error) => {
                // Handle errors here
                console.error(error);
            });
    }, [])

    useEffect(() => {
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
    }, [])
  
    useEffect(()=>{
      socket.on('updatePnl', (data)=>{
        setTimeout(()=>{
          setTrackEvent(data);
        })
      })
    }, [])
  
    useEffect(()=>{
      
      axios.get(`${baseUrl}api/v1/dailycontest/live/overallAllContestPnlCompany`, {withCredentials: true})
      .then((res) => {
          setTradeData(res?.data?.data[0]?.pnl); 
          setTraderData(res?.data?.data[0]?.traderInfo);
          setIsLoading(true)
      }).catch((err) => {
          setIsLoading(false)
          return new Error(err);
      })
    }, [trackEvent])
  
  
    return (
        <MDBox bgColor="dark" color="light" display='flex' justifyContent='center' flexDirection='column'  mb={0.5} borderRadius={10} minHeight='auto' width='100%'>
            <Grid item xs={12} md={12} lg={12} p={0.5} boxShadow={2} minHeight='auto' minWidth='100%' style={{ backgroundColor: 'lightgrey', minWidth:'100%' }} borderRadius={1} display='flex' justifyContent='center'>
                {!isLoading ?
                    <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
                        <CircularProgress color='info' />
                    </MDBox>
                    :
                    <>
                        {liveContest.length != 0 ?
                        <MDBox display='flex' justifyContent='center' flexDirection='column' >
                            <MDBox bgColor='light' borderRadius={5} display='flex' justifyContent='center' mb={1}>
                                <MDTypography color='dark' fontSize={15} fontWeight='bold'>Infinity Contests - Company Side Details</MDTypography>
                            </MDBox>
                            {/* <MismatchDetails socket={socket} /> */}
                            {liveContest.map((elem) => {
                                let totalTransactionCost = 0;
                                let totalGrossPnl = 0;
                                let totalRunningLots = 0;
                                let totalLots = 0;
                                let totalAbsLots = 0;

                                let contestTradeData = tradeData.filter((subelem)=>{
                                    return elem?._id?.toString() === subelem?._id?.contest?.toString();
                                })

                                let contestTraderData = traderData.filter((subelem)=>{
                                    return elem?._id?.toString() === subelem?.contestId?.toString();
                                })

                                // console.log("contestTraderData", contestTradeData)


                                contestTradeData.map((subelem, index)=>{
                                    let obj = {};
                                    totalRunningLots += Number(subelem.lots)
                                    totalTransactionCost += Number(subelem.brokerage);
                                    totalLots += Number(Math.abs(subelem.totallots))
                                    totalAbsLots += Number(Math.abs(subelem.lots))

                                    let liveDetail = marketData.filter((elem)=>{
                                        return (elem !== undefined && (elem.instrument_token == subelem._id.instrumentToken || elem.instrument_token == subelem._id.exchangeInstrumentToken));
                                    })
                                    // console.log("liveDetail", liveDetail)
                                    let updatedValue = (subelem.amount+(subelem.lots)*liveDetail[0]?.last_price);
                                    totalGrossPnl += updatedValue;
                                
                                })
                                
                                const totalnetPnlcolor = (totalGrossPnl-totalTransactionCost) >= 0 ? "success" : "error"
                              
                                return (
                                    <MDBox display='flex' justifyContent='center' mb={1}>
                                        <Grid container spacing={1} xs={6} md={6} lg={12} display='flex' justifyContent='center'>
                                            <Grid item xs={12} md={6} lg={12}>

                                                <MDButton
                                                    variant="contained"
                                                    color={totalnetPnlcolor}
                                                    size="small"
                                                    component={Link}
                                                    to={{
                                                        pathname: `/contestdashboard/infinitycontest`,
                                                    }}
                                                    state={{ elem: elem }}
                                                >
                                                    <Grid container xs={12} md={12} lg={12}>

                                                        <Grid item xs={6} md={6} lg={4} mt={1} display="flex" justifyContent="left">
                                                            <MDTypography fontSize={12} style={{ color: "white", paddingLeft: 2, paddingRight: 2, fontWeight: 'bold', border: '1px solid white', borderRadius: 5 }}>{elem?.contestName}</MDTypography>
                                                        </Grid>

                                                        <Grid item xs={6} md={6} lg={4} mt={1} display="flex" justifyContent="center">
                                                            <MDTypography fontSize={12} style={{ color: "white", paddingLeft: 2, paddingRight: 2, fontWeight: 'bold', border: '1px solid white', borderRadius: 5 }}>{`Current Status: ${elem?.currentLiveStatus}`}</MDTypography>
                                                        </Grid>

                                                        <Grid item xs={6} md={6} lg={4} mt={1} display="flex" justifyContent="right">
                                                            <MDTypography fontSize={12} style={{ color: "white", paddingLeft: 2, paddingRight: 2, fontWeight: 'bold', border: '1px solid white', borderRadius: 5 }}>{`Type: ${elem?.contestFor}`}</MDTypography>
                                                        </Grid>

                                                        <Grid item xs={6} md={6} lg={12} display="flex" justifyContent="center">
                                                            <Divider style={{ backgroundColor: 'white', height: '2px', minWidth: '100%' }} />
                                                        </Grid>

                                                        <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="left">
                                                            <MDTypography fontSize={12} style={{ color: "white" }}>Entry: <span style={{ fontSize: 12, fontWeight: 700 }}>₹{elem?.entryFee}</span></MDTypography>
                                                        </Grid>

                                                        <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="center">
                                                            <MDTypography fontSize={12} style={{ color: "white" }}>Portfolio: <span style={{ fontSize: 12, fontWeight: 700 }}>₹{elem?.portfolio?.portfolioValue}</span></MDTypography>
                                                        </Grid>

                                                        <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="right">
                                                            <MDTypography fontSize={12} style={{ color: "white" }}>% Payout: <span style={{ fontSize: 12, fontWeight: 700 }}>{elem?.payoutPercentage} %</span></MDTypography>
                                                        </Grid>

                                                        <Grid item xs={6} md={6} lg={12} display="flex" justifyContent="center">
                                                            <Divider style={{ backgroundColor: 'white', height: '2px', minWidth: '100%' }} />
                                                        </Grid>

                                                        <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="left">
                                                            <MDTypography fontSize={12} style={{ color: "white" }}>Gross: <span style={{ fontSize: 12, fontWeight: 700 }}>{ (totalGrossPnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalGrossPnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-totalGrossPnl))}</span></MDTypography>
                                                        </Grid>

                                                        <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="center">
                                                            <MDTypography fontSize={12} style={{ color: "white" }}>Net: <span style={{ fontSize: 12, fontWeight: 700 }}>{ (totalGrossPnl - totalTransactionCost) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalGrossPnl - totalTransactionCost)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalTransactionCost - totalGrossPnl))}</span></MDTypography>
                                                        </Grid>

                                                        <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="right">
                                                            <MDTypography fontSize={12} style={{ color: "white" }}>Brokerage: <span style={{ fontSize: 12, fontWeight: 700 }}>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalTransactionCost)}</span></MDTypography>
                                                        </Grid>

                                                        <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="left">
                                                            <MDTypography fontSize={12} style={{ color: "white" }}>(+) Traders: <span style={{ fontSize: 12, fontWeight: 700 }}>{contestTraderData[0]?.positiveTraderCount}</span></MDTypography>
                                                        </Grid>

                                                        <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="center">
                                                            <MDTypography fontSize={12} style={{ color: "white" }}>(-) Traders: <span style={{ fontSize: 12, fontWeight: 700 }}>{contestTraderData[0]?.negativeTraderCount}</span></MDTypography>
                                                        </Grid>

                                                        <Grid item xs={6} md={6} lg={4} mb={1} display="flex" justifyContent="right">
                                                            <MDTypography fontSize={12} style={{ color: "white" }}>Total Traders: <span style={{ fontSize: 12, fontWeight: 700 }}>{contestTraderData[0]?.negativeTraderCount + contestTraderData[0]?.positiveTraderCount}</span></MDTypography>
                                                        </Grid>

                                                        <Grid item xs={6} md={6} lg={6} mt={0.5} mb={1} display="flex" justifyContent="left">
                                                            <Grid container spacing={.5} xs={6} md={6} lg={12}>
                                                                <Grid item xs={6} md={6} lg={4}>
                                                                    <MDBox style={{ backgroundColor: elem?.isNifty ? "yellow" : "white", border: '1px solid white', borderRadius: 3, padding: '2px' }}><MDTypography fontSize={10} fontWeight='bold' color='dark'>NIFTY</MDTypography></MDBox>
                                                                </Grid>
                                                                <Grid item xs={6} md={6} lg={4}>
                                                                    <MDBox style={{ backgroundColor: elem?.isBankNifty ? "yellow" : "white" , border: '1px solid white', borderRadius: 3, padding: '2px' }}><MDTypography fontSize={10} fontWeight='bold' color='dark'>BANKNIFTY</MDTypography></MDBox>
                                                                </Grid>
                                                                <Grid item xs={6} md={6} lg={4}>
                                                                    <MDBox style={{ backgroundColor: elem?.isFinNifty ? "yellow" : "white" , border: '1px solid white', borderRadius: 3, padding: '2px' }}><MDTypography fontSize={10} fontWeight='bold' color='dark'>FINNIFTY</MDTypography></MDBox>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>

                                                        <Grid item xs={6} md={6} lg={6} mt={0.5} mb={1} display="flex" justifyContent="flex-end">
                                                            <Grid container spacing={.5} xs={6} md={6} lg={12} display="flex" justifyContent="flex-end">
                                                                <Grid item xs={6} md={6} lg={4}>
                                                                    <MDBox style={{ backgroundColor: 'white', border: '1px solid white', borderRadius: 3, padding: '2px' }}><MDTypography fontSize={10} fontWeight='bold' color='dark'>{`Abs. Running Lots: ${totalAbsLots}`}</MDTypography></MDBox>
                                                                </Grid>
                                                                <Grid item xs={6} md={6} lg={4}>
                                                                    <MDBox style={{ backgroundColor: 'white', border: '1px solid white', borderRadius: 3, padding: '2px' }}><MDTypography fontSize={10} fontWeight='bold' color='dark'>{`Running Lots: ${totalRunningLots}`}</MDTypography></MDBox>
                                                                </Grid>

                                                                <Grid item xs={6} md={6} lg={4}>
                                                                    <MDBox style={{ backgroundColor: 'white', border: '1px solid white', borderRadius: 3, padding: '2px' }}><MDTypography fontSize={10} fontWeight='bold' color='dark'>Margin: <span style={{ marginRight: '10px' }}>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(marginData)}</span></MDTypography></MDBox>
                                                                </Grid>

                                                                {/* <Grid item xs={6} md={6} lg={4}>
                                                                    <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right' alignItems="center">
                                                                        Margin
                                                                    </MDTypography>
                                                                    <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right' alignItems="center">
                                                                        {(!isLoadLiveMargin) ?
                                                                            <CircularProgress color="inherit" size={10} sx={{ marginRight: "10px" }} />
                                                                            :
                                                                            <span style={{ marginRight: '10px' }}>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(marginData)}</span>
                                                                        }
                                                                        <CachedIcon sx={{ cursor: "pointer" }} onClick={() => { setRefreshMargin(!refreshMargin) }} />
                                                                    </MDTypography>
                                                                </Grid> */}
                                                            </Grid>
                                                        </Grid>

                                                    </Grid>
                                                </MDButton>

                                            </Grid>

                                        </Grid>
                                    </MDBox>
                                )
                            })}

                        </MDBox>
                        :
                        <MDBox style={{minHeight:"10vh", minWidth:'100%'}} border='1px solid white' borderRadius={5} display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
                            <img src={WinnerImage} width={50} height={50}/>
                            <MDTypography color="dark" fontSize={15}>No Live TestZone(s)</MDTypography>
                        </MDBox>
                        }
                    </>
                }
            </Grid>
        </MDBox>

    );
}