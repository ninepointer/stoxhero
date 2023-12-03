import React, {useState, useEffect} from 'react';
import axios from "axios"
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Grid, CircularProgress, Divider} from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import { Link } from "react-router-dom";

import DailyInternshipUsers from '../data/dailyInternshipUsers'
import CollegeWiseData from '../data/collegeWiseData';
import { saveAs } from 'file-saver';
import moment from 'moment'


export default function LabTabs({socket}) {
  const [isLoading,setIsLoading] = useState(false);
  const [trackEvent, setTrackEvent] = useState({});
  const [marketData, setMarketData] = useState([]);
  const [dailyInternshipUsers, setDailyInternshipUsers] = useState();
  const [lastInternshipTradingDate,setLastInternshipTradingDate] = useState("");
  const [tradeData, setTradeData] = useState([]);
  const [tradeDataYesterday, setTradeDataYesterday] = useState([]);
  const [liveTraderCount, setLiveTraderCount] = useState(0);
  const [liveTraderCountYesterday, setLiveTraderCountYesterday] = useState(0);
  const [notliveTraderCount, setNotLiveTraderCount] = useState(0);
  const [notliveTraderCountYesterday, setNotLiveTraderCountYesterday] = useState(0);
  const [downloadReady, setDownloadReady] = useState(false);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let totalTransactionCost = 0;
  let totalGrossPnl = 0;
  let totalRunningLots = 0;
  let totalTurnover = 0;
  let totalLots = 0;
  let totalTrades = 0;
  const [downloadingInternshipData,setDownloadingInternshipData] = useState(false)
  const [tradingHolidays,setTradingHolidays] = useState(0);
  const [referrals,setReferrals] = useState(0);


  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getliveprice`)
    .then((res) => {
        setMarketData(res.data);
    }).catch((err) => {
        return new Error(err);
    })

    socket.on('tick', (data) => {
        // console.log("market socket data", data)
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
    axios.get(`${baseUrl}api/v1/internship/overallinternshippnltoday`)
    .then((res) => {
        setTradeData(res.data.data);
        setTimeout(()=>{
            setIsLoading(false)
        },500)
        
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/internship/liveandtotaltradercounttoday`)
    .then((res) => {
        setNotLiveTraderCount(res.data.data[0].zeroLotsTraderCount)
        setLiveTraderCount(res.data.data[0].nonZeroLotsTraderCount)
        setTimeout(()=>{
            setIsLoading(false)
        },500)
        
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/internship/overallinternshippnlyesterday`)
    .then((res) => {
        // console.log("Yesterday's Data:",res.data.data)
        setTradeDataYesterday(res.data.data);
        setLastInternshipTradingDate(res.data.date);
        setTimeout(()=>{
            setIsLoading(false)
        },500)
        
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/internship/dailyinternshipusers`)
    .then((res) => {
        setDailyInternshipUsers(res.data.data);   
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/internship/liveandtotaltradercountyesterday`)
    .then((res) => {
        // console.log(res.data.data)
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

function TruncatedName(name) {
const originalName = name;
const convertedName = originalName
    .toLowerCase() // Convert the entire name to lowercase
    .split(' ') // Split the name into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' '); // Join the words back together with a space

// Trim the name to a maximum of 30 characters
const truncatedName = convertedName.length > 30 ? convertedName.substring(0, 30) + '...' : convertedName;

return truncatedName;
}

async function getReferralsCount(startDate, endDate, mobile) {
    setDownloadReady(false)
    axios.get(`${baseUrl}api/v1/signup/referrals/${startDate}/${endDate}/${mobile}`, {
        withCredentials: true,
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        },
    })
    .then((res) => {
        setReferrals(res.data.data)
        setDownloadReady(true)
        console.log("Referrals in API:",res.data.data)
        return res.data.data
    })
    .catch((err) => {
        console.log(err)
        return 0;
    });
    
};

function getMarketDays(startDate, endDate) {
        axios.get(`${baseUrl}api/v1/tradingholiday/dates/${startDate}/${endDate}`, {
            withCredentials: true,
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
            },
        })
        .then((res) => {
            setTradingHolidays(res.data.data)
        })
        .catch((err) => {
            console.log(err)
        });
        console.log("tradingHolidays:",tradingHolidays)
        return tradingHolidays
    };

function getDaysBetweenDates(startDate, endDate) {
    // Convert both dates to milliseconds
    const startDateMs = new Date(startDate).getTime();
    const endDateMs = new Date(endDate).getTime();
    
    // Calculate the difference in milliseconds
    const timeDifference = endDateMs - startDateMs;
    
    // Calculate the number of days by dividing the time difference by the number of milliseconds in a day
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    
    return daysDifference;
    }

const downloadCompletedInternshipData = () => {
setDownloadingInternshipData(true)
return new Promise((resolve, reject) => {
    axios
    .get(`${baseUrl}api/v1/internship/downloadinternshipreport`, {
        withCredentials: true,
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        },
    })
    .then((res) => {
        resolve(res.data.data); // Resolve the promise with the data
        setDownloadingInternshipData(false)
    })
    .catch((err) => {
        console.log(err)
        reject(err); // Reject the promise with the error
        setDownloadingInternshipData(false)
    });
});
};

const handleDownload = async (nameVariable) => {
try {
    // Wait for downloadContestData() to complete and return data
    let data = [];
    let csvData = [];
    console.log(nameVariable)
    if(nameVariable === 'Completed'){
    data = await downloadCompletedInternshipData();
    csvData = await downloadHelper(data)
    }
    // Create the CSV content
    const csvContent = csvData?.map((row) => {
    return row?.map((row1) => row1.join(',')).join('\n');
    });

    // Create a Blob object with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

    // Save the file using FileSaver.js
    saveAs(blob, `${nameVariable}.csv`);
} catch (error) {
    console.error('Error downloading intenrship report:', error);
}
}


  async function downloadHelper(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [["#","Full Name", "Email", "Mobile", "Signup Method","Joining Date", "Batch Name", "Batch Start", "Batch End", "Margin Money", "Percentage Payout", "Expected Attendance %", "Actual Attendance %", "Expected Referral Count", "Trading Days", "Gross P&L", "Brokerage", "Net P&L", "# of Trades", "Payout"], ]
    if (data) {
      // dates = Object.keys(data)

      let csvpnlData = Object.values(data)
        const mappingPromises = csvpnlData?.map(async (elem, index) => {
        let marketDays =  getDaysBetweenDates((moment(elem?.batchStartDate).format('DD-MMM-YY')),(moment(elem?.batchEndDate).format('DD-MMM-YY'))) - getMarketDays((moment(elem?.batchStartDate).format('DD-MMM-YY')),(moment(elem?.batchEndDate).format('DD-MMM-YY')))
        let traderAttendancePercentage = ((elem?.tradingDays/marketDays)*100-5).toFixed(0)
        let payout = (traderAttendancePercentage <= elem?.attendancePercentage && elem?.netpnl > 0 && referrals >= elem.referralCount) ? ((elem?.netpnl*elem?.payoutPercentage)/100).toFixed(2) : 0
        let finalPayout = payout > 15000 ? 15000 : payout
        // let referralsCount = await getReferralsCount(elem?.batchStartDate,elem?.batchEndDate,elem?.mobile)
        // console.log("Referrals:",referralsCount,referrals);
        return [
          index+1,
          TruncatedName(elem?.first_name + ' ' + elem?.last_name),
          elem?.email,
          elem?.mobile,
          elem?.creationProcess,
          moment.utc(elem?.joining_date).utcOffset('+00:00').format('DD-MMM-YY'),
          elem?.batchName,
          moment.utc(elem?.batchStartDate).utcOffset('+00:00').format('DD-MMM-YY'),
          moment.utc(elem?.batchEndDate).utcOffset('+00:00').format('DD-MMM-YY'),
          elem?.portfolio,
          elem?.payoutPercentage,
          elem?.attendancePercentage,
          traderAttendancePercentage,
          elem?.referralCount,
        //   referralsCount,
        //   marketDays,
          elem?.tradingDays,
          parseFloat(elem?.grosspnl)?.toFixed(0),
          parseFloat(elem?.brokerage)?.toFixed(0),
          parseFloat(elem?.netpnl)?.toFixed(0),
          elem?.totalTrades,
          parseFloat(finalPayout)?.toFixed(0),
        ]
      })
      // Wait for all promises to resolve
        const results = await Promise.all(mappingPromises);
        console.log("File Inside:",csvDataFile)
        csvDataFile = [csvDataDailyPnl, ...results];
    }
    console.log("Final File:",csvDataFile)
    return csvDataFile
    
  }


  tradeData.map((subelem, index)=>{
    let obj = {};
    totalRunningLots += Number(subelem.lots)
    totalTransactionCost += Number(subelem.brokerage);
    totalTurnover += Number(Math.abs(subelem.turnover));
    totalLots += Number(Math.abs(subelem.totallots))
    totalTrades += Number(subelem.trades)

    let liveDetail = marketData.filter((elem)=>{
        return (elem !== undefined && elem.instrument_token == subelem._id.instrumentToken || elem.instrument_token == subelem._id.exchangeInstrumentToken);
    })
    let updatedValue = (subelem.amount+(subelem.lots)*liveDetail[0]?.last_price);
    totalGrossPnl += updatedValue;

  })

  const totalGrossPnlcolor = totalGrossPnl >= 0 ? "success" : "error"
  const totalnetPnlcolor = (totalGrossPnl-totalTransactionCost) >= 0 ? "success" : "error"
  const totalquantitycolor = totalRunningLots >= 0 ? "success" : "error"

  return (
    <MDBox bgColor="dark" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto' maxWidth='100%'>
        <MDBox display='flex' justifyContent='center' alignItems='center'>
            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                <Grid item xs={12} md={6} lg={6} mb={1} display='flex' justifyContent='flex-start' alignItems='center'>
                    <MDTypography ml={1} color='light' fontSize={18} fontWeight='bold'>Career Dashboard</MDTypography>
                </Grid>
                <Grid item xs={12} md={6} lg={6} mb={1} display='flex' justifyContent='flex-end' alignItems='center'>
                
                  <MDButton
                    variant='contained'
                    color='info'
                    size='small'
                    onClick={() => { handleDownload(`Completed`) }}
                  >
                    {!downloadingInternshipData ? (
                      <MDBox display='flex' justifyContent='center' alignItems='center'>
                        <MDTypography color='light' variant="text" style={{ marginTop: '0px' }}>
                          Download Completed Internship Data
                        </MDTypography>
                      </MDBox>
                    ) : (
                      <MDBox display='flex' justifyContent='center' alignItems='center'>
                        <CircularProgress size={12} thickness={4} color="primary" />
                        <MDTypography color='light' variant="text" style={{ marginTop: '0px' }}>
                          Downloading Data...
                        </MDTypography>
                      </MDBox>
                    )}
                  </MDButton>
                  
                </Grid>
            </Grid>
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
                        <MDTypography fontSize={16} fontWeight='bold' color='dark'>Today's Internship Position - All Batches (Trader Side)</MDTypography>
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
                                <MDTypography color={totalnetPnlcolor} fontSize={12} display='flex' justifyContent='right'>{ (totalGrossPnl - totalTransactionCost) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalGrossPnl - totalTransactionCost)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-totalGrossPnl + totalTransactionCost))}</MDTypography>
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
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Used Margin</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>To Be Configured</MDTypography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={true} lg={0.2} hidden={false}>
                        <Divider orientation='vertical' color='black'/>
                    </Grid>

                    <Grid item p={2} xs={12} lg={5.9}>
                        <MDTypography fontSize={16} fontWeight='bold' color='dark'>Last Trading Day - All Batches (Trader Side) - {new Date(lastInternshipTradingDate).toLocaleDateString("en-US", {day: "numeric",month: "short",year: "numeric", weekday: "short"})}</MDTypography>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Gross P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{ tradeDataYesterday[0] ? (tradeDataYesterday[0]?.amount) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.amount)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-tradeDataYesterday[0]?.amount)) : "₹" + 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Brokerage</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{tradeDataYesterday[0] ? "₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.brokerage)) : "₹" + 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Net P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>{ tradeDataYesterday[0] ? (tradeDataYesterday[0]?.amount - tradeDataYesterday[0]?.brokerage) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.amount - tradeDataYesterday[0]?.brokerage)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.brokerage - tradeDataYesterday[0]?.amount)) : "₹" + 0}</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Total Lots</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>{tradeDataYesterday[0] ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(tradeDataYesterday[0]?.totallots) : 0}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Running Lots</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>{tradeDataYesterday[0]?.lots}</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
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
                    { dailyInternshipUsers && <DailyInternshipUsers dailyInternshipUsers={dailyInternshipUsers}/>}
                </MDBox>
            </Grid>
        </Grid>

        {/* <Grid style={{borderRadius:5}} container xs={12} md={12} lg={12} mt={1}>
            <Grid item xs={12} md={12} lg={12}>
                <MDBox p={0.5}>
                    <CollegeWiseData />
                </MDBox>
            </Grid>
        </Grid> */}

        <Grid container spacing={2} mt={1}>
            
            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"warning"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/internposition`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Intern Position</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check today's internship trades position here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Active Traders: <span style={{fontSize:11,fontWeight:700}}>10</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Active Batches: <span style={{fontSize:11,fontWeight:700}}>2</span></MDTypography>
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
                            pathname: `/internshipbatch`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Internship Batches</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check all internship batches here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Active Batches: <span style={{fontSize:11,fontWeight:700}}>10</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Completed Batches: <span style={{fontSize:11,fontWeight:700}}>10</span></MDTypography>
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
                            pathname: `/college`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>College List</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check all college list here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Total Colleges: <span style={{fontSize:11,fontWeight:700}}>10</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Total Zones: <span style={{fontSize:11,fontWeight:700}}>5</span></MDTypography>
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
                            pathname: `/careerlist`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Careers</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check all career openings here!</MDTypography>
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
                        color={"primary"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/internreport`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Internship Report</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check interns pnl report here!</MDTypography>
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
                            pathname: `/internshipleaderboard`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Internship Leader Board</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check internship leaderboard here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Green Traders: <span style={{fontSize:11,fontWeight:700}}>0</span></MDTypography>
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
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Internship Certificates</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check IC of candidates here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}># of Certificated Issued: <span style={{fontSize:11,fontWeight:700}}>0</span></MDTypography>
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
                                  <MDTypography fontSize={15} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Queries</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check queries form candidates here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Active Queries: <span style={{fontSize:11,fontWeight:700}}>0</span></MDTypography>
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
                                    pathname: `/internshiporders`,
                                  }}
                            >
                                Internship Orders
                            </MDButton>
                        </Grid>
                        <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"light"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/campaigns`,
                                  }}
                            >
                                Campaigns
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
                                color={"error"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/tradingholiday`,
                                  }}
                            >
                                Trading Holiday
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