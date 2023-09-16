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
import PnlOverviewMock from '../data/pnlOverviewMock';

export default function LabTabs({socket}) {
  const [isLoading,setIsLoading] = useState(false);
//   const [trackEvent, setTrackEvent] = useState({});
//   const [marketData, setMarketData] = useState([]);
//   const [tradeData, setTradeData] = useState([]);
  const [dailyContestUsers, setDailyContestUsers] = useState();
  const [completedContest,setCompletedContest] = useState();
//   const [tradeDataYesterday, setTradeDataYesterday] = useState([]);
//   const [tradeDataThisMonth, setTradeDataThisMonth] = useState([]);
//   const [tradeDataLifetime, setTradeDataLifetime] = useState([]);
//   const [liveTraderCount, setLiveTraderCount] = useState(0);
//   const [liveTraderCountYesterday, setLiveTraderCountYesterday] = useState(0);
//   const [notliveTraderCount, setNotLiveTraderCount] = useState(0);
//   const [notliveTraderCountYesterday, setNotLiveTraderCountYesterday] = useState(0);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
//   let totalTransactionCost = 0;
//   let totalGrossPnl = 0;
//   let totalRunningLots = 0;
//   let totalTurnover = 0;
//   let totalLots = 0;
//   let totalTrades = 0;

  useEffect(()=>{
    // axios.get(`${baseUrl}api/v1/getliveprice`)
    // .then((res) => {
    //     setMarketData(res.data);
    // }).catch((err) => {
    //     return new Error(err);
    // })

    // socket.on('tick', (data) => {
    //   setMarketData(prevInstruments => {
    //     const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
    //     data.forEach(instrument => {
    //       instrumentMap.set(instrument.instrument_token, instrument);
    //     });
    //     return Array.from(instrumentMap.values());
    //   });
    // })

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
    let call1 = axios.get((`${baseUrl}api/v1/dailycontest/contest/dailycontestusers`),{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    Promise.all([call1])
    .then(([api1Response]) => {
      setDailyContestUsers(api1Response.data.data)
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
    
  },[])

//   useEffect(()=>{
//     socket.on('updatePnl', (data)=>{
//       setTimeout(()=>{
//         setTrackEvent(data);
//       })
//     })
//   }, [])

//   useEffect(()=>{
//     console.log("Loading: ",isLoading)
//     setIsLoading(true)
//     axios.get(`${baseUrl}api/v1/dailycontest/trade/overalltraderpnltoday`, {withCredentials: true})
//     .then((res) => {
//         setTradeData(res.data.data); 
//     }).catch((err) => {
//         setIsLoading(false)
//         return new Error(err);
//     })
//     console.log("Loading: ",isLoading)
//     axios.get(`${baseUrl}api/v1/dailycontest/trade/liveandtotaltradercounttoday`, {withCredentials: true})
//     .then((res) => {
//         setNotLiveTraderCount(res.data.data[0].zeroLotsTraderCount)
//         setLiveTraderCount(res.data.data[0].nonZeroLotsTraderCount)
//     }).catch((err) => {
//         setIsLoading(false)
//         return new Error(err);
//     })

//     axios.get(`${baseUrl}api/v1/dailycontest/trade/overalltraderpnlyesterday`, {withCredentials: true})
//     .then((res) => {
//         setTradeDataYesterday(res?.data?.data);
//     }).catch((err) => {
//         setIsLoading(false)
//         return new Error(err);
//     })

//     axios.get(`${baseUrl}api/v1/dailycontest/trade/overalltraderpnlthismonth`, {withCredentials: true})
//     .then((res) => {
//         setTradeDataThisMonth(res?.data?.data[0]);
//     }).catch((err) => {
//         setIsLoading(false)
//         return new Error(err);
//     })

//     axios.get(`${baseUrl}api/v1/dailycontest/trade/overalltraderpnllifetime`, {withCredentials: true})
//     .then((res) => {
//         setTradeDataLifetime(res?.data?.data[0]);
//     }).catch((err) => {
//         setIsLoading(false)
//         return new Error(err);
//     })

//     axios.get(`${baseUrl}api/v1/dailycontest/trade/liveandtotaltradercountyesterday`, {withCredentials: true})
//     .then((res) => {
//         setNotLiveTraderCountYesterday(res?.data?.data[0]?.zeroLotsTraderCount)
//         setLiveTraderCountYesterday(res?.data?.data[0]?.nonZeroLotsTraderCount)
//         setTimeout(()=>{
//             setIsLoading(false)
//         },500)    
//     }).catch((err) => {
//         setIsLoading(false)
//         return new Error(err);
//     }) 

//     // axios.get(`${baseUrl}api/v1/dailycontest/trade/payoutchart`)
//     // .then((res) => {
//     //     setCompletedContest(res?.data?.data);
//     //     console.log("Completed Contest Red:",res.data)
//     // }).catch((err) => {
//     //     setIsLoading(false)
//     //     return new Error(err);
//     // })
//   }, [trackEvent])

//   useEffect(() => {
//     return () => {
//         socket.close();
//     }
//   }, [])

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

//   tradeData.map((subelem, index)=>{
//     let obj = {};
//     totalRunningLots += Number(subelem?.lots)
//     totalTransactionCost += Number(subelem?.brokerage);
//     totalTurnover += Number(Math.abs(subelem?.turnover));
//     totalLots += Number(Math.abs(subelem?.totallots))
//     totalTrades += Number(subelem?.trades)

//     let liveDetail = marketData.filter((elem)=>{
//         return (elem !== undefined && (elem?.instrument_token == subelem?._id?.instrumentToken || elem?.instrument_token == subelem?._id?.exchangeInstrumentToken));
//     })
//     let updatedValue = (subelem?.amount+(subelem?.lots)*liveDetail[0]?.last_price);
//     totalGrossPnl += updatedValue;

//   })

//   const totalGrossPnlcolor = totalGrossPnl >= 0 ? "success" : "error"
//   const totalnetPnlcolor = (totalGrossPnl-totalTransactionCost) >= 0 ? "success" : "error"
//   const totalquantitycolor = totalRunningLots >= 0 ? "success" : "error"

  return (
    <MDBox bgColor="dark" mt={2} mb={1} p={2} borderRadius={10} display='flex' flexDirection='column' justifyContent='center' alignItems='center' minHeight='auto' maxWidth='100%'>
        <MDBox display='flex' justifyContent='left'>
            <MDTypography ml={1} mb={1} color='light' fontSize={18} fontWeight='bold'>Battle Dashboard</MDTypography>
        </MDBox>

        <PnlOverviewMock socket={socket} />

        <Grid container spacing={1} xs={12} md={12} lg={12} mt={0.5} mb={0.5} display='flex' justifyContent='center' alignItems='center'>

        <Grid item xs={12} md={6} lg={3}>

            <MDButton
                variant="contained"
                color={"info"}
                size="small"
                component={Link}
                to={{
                    pathname: `/battledashboard/battles`,
                }}
            >
                        <Grid container xs={12} md={12} lg={12}>

                                <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                                    <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Battles</MDTypography>
                                </Grid>

                                <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                                    <MDBox display="flex" flexDirection="column">
                                        <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Create battles here!</MDTypography>
                                    </MDBox>
                                </Grid>

                                <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                    <MDTypography fontSize={9} style={{ color: "white" }}>Active Battles: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                                </Grid>

                                <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                    <MDTypography fontSize={9} style={{ color: "white" }}>Completed Battles: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                                </Grid>

                            </Grid>
            </MDButton>

            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>

                <MDButton
                    variant="contained"
                    color={"success"}
                    size="small"
                    component={Link}
                    to={{
                        pathname: `/battledashboard/battleposition`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Battle Position(Trader)</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Check all trader's battle position here!</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Active Battles: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Completed Battles: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
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
                        pathname: `/battledashboard/battlereport`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Battle Report</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Check all battle reports here!</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Free Battles: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Paid Battles: <span style={{ fontSize: 11, fontWeight: 700 }}>5</span></MDTypography>
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
                        pathname: `/battledashboard/battletemplate`,
                    }}
                >
                    <Grid container xs={12} md={12} lg={12}>

                        <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={15} style={{ color: "white", paddingLeft: 4, paddingRight: 4, fontWeight: 'bold' }}>Battle Templates</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} mb={2} style={{ fontWeight: 1000 }} display="flex" alignContent="center" alignItems="center">
                            <MDBox display="flex" flexDirection="column">
                                <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{ color: "white", paddingLeft: 4, paddingRight: 4 }}>Create Battle Templates here!</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Free Battles: <span style={{ fontSize: 11, fontWeight: 700 }}>10</span></MDTypography>
                        </Grid>

                        <Grid item xs={6} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                            <MDTypography fontSize={9} style={{ color: "white" }}>Total Paid Battles: <span style={{ fontSize: 11, fontWeight: 700 }}>5</span></MDTypography>
                        </Grid>

                    </Grid>
                </MDButton>

            </Grid>

        </Grid>

        <Grid style={{backgroundColor:'white',borderRadius:5}} container xs={12} md={12} lg={12} mt={1}>
            <Grid item xs={12} md={12} lg={12}>
                <MDBox p={1}>
                    { completedContest && <CompanySideContestDailyChart completedContest={completedContest}/>}
                </MDBox>
            </Grid>
        </Grid>

        <Grid style={{backgroundColor:'white',borderRadius:5}} container xs={12} md={12} lg={12} mt={1}>
            <Grid item xs={12} md={12} lg={12}>
                <MDBox p={0.5}>
                    { dailyContestUsers && <DailyContestUsers dailyContestUsers={dailyContestUsers}/>}
                </MDBox>
            </Grid>
        </Grid>

    </MDBox>
  );
}