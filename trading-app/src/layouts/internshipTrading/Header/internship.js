import React, {useEffect, useState} from 'react';
import axios from "axios";
import moment from 'moment';
import _ from 'lodash';
import { userContext } from '../../../AuthContext';
import { useContext } from 'react';
import { NetPnlContext } from '../../../PnlContext';
import { Link, useLocation } from "react-router-dom";
// import { userContext } from '../../../AuthContext';
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
// import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import MDTypography from '../../../components/MDTypography';
// import tradesicon from '../../../assets/images/tradesicon.png'
import beginner from '../../../assets/images/beginner.png'
import intermediate from '../../../assets/images/intermediate.png'
import pro from '../../../assets/images/pro.png'
import checklist from '../../../assets/images/checklist.png'

// import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialogue from './dialogueBox';
import MDButton from '../../../components/MDButton';
import { useNavigate } from 'react-router-dom';
import GaugeChartReferrals from '../data/GaugeChartReferrals'
import GaugeChartAttendance from '../data/GaugeChartAttendance'
import GaugeChartReturns from '../data/GaugeChartReturns'
import { renderContext } from '../../../renderContext';
import { marketDataContext } from '../../../MarketDataContext';
// import { myInternshipTradingDays, myOverallInternshipPnl } from '../../../../../server-side/controllers/internshipTradeController';


export default function TenXSubscriptions({myInternshipTradingDays,myOverallInternshipPnl, socket}) {
  const [cashBalance, setCashBalance] = React.useState(0);
  const { netPnl, totalRunningLotss, pnlData } = useContext(NetPnlContext);
  const [myOverallIntenrshipPNL, setMyOverallInternshipPNL] = React.useState([])
  const marketDetails = useContext(marketDataContext)
  const [myTradingDays, setMyTradingDays] = React.useState(0);
  const {render, setRender} = useContext(renderContext);
  const [totalTradingDays, setTotalTradingDays] = React.useState(4);
  const getDetails = useContext(userContext);
  const [batchId,setBatchId] = useState();
  const navigate = useNavigate();
  const { updateNetPnl , setPnlData} = useContext(NetPnlContext);
  const [trackEvent, setTrackEvent] = useState({});
  const [tradeData, setTradeData] = useState([]);
  const [serverTime, setServerTime] = useState();
  const [batchEndDate, setBatchEndDate] = useState();
  const [myReferralCount, setMyReferralCount] = useState(getDetails?.userDetails?.referrals?.length);
  const portfolioValue = getDetails?.userDetails?.internshipBatch[0]?.portfolio?.portfolioValue
  let totalTransactionCost = 0;
  let totalGrossPnl = 0;
  let totalRunningLots = 0;
  // const [open, setOpen] = React.useState(false);
  // const [isLoading,setIsLoading] = useState(false);
  const [activeTenXSubs,setActiveTenXSubs] = useState([]);
  // const getDetails = React.useContext(userContext);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  function calculateWorkingDays(startDate, endDate) {
    const start = moment(startDate);
    const end = moment(endDate);
  
    // Check if the start date is after the end date
    if (start.isAfter(end)) {
      return 0;
    }
  
    let workingDays = 0;
    let currentDate = start;
  
    // Iterate over each day between the start and end dates
    while (currentDate.isSameOrBefore(end)) {
      // Check if the current day is a weekday (Monday to Friday)
      if (currentDate.isoWeekday() <= 5) {
        workingDays++;
      }
  
      // Move to the next day
      currentDate = currentDate.add(1, 'day');
    }
  
    return workingDays;
  }

  const startDate = (getDetails?.userDetails?.internshipBatch[0]?.batchStartDate).toString().split('T')[0]
  const endDate = moment(new Date().toString()).format("YYYY-MM-DD");;
  // console.log(startDate)
  // console.log(endDate)
  const workingDays = calculateWorkingDays(startDate, endDate);

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getliveprice`)
    .then((res) => {
      marketDetails.setMarketData(res.data);
    }).catch((err) => {
        return new Error(err);
    })
    socket?.on("tick-room", (data) => {

      marketDetails.setMarketData(prevInstruments => {
        const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
        data.forEach(instrument => {
          instrumentMap.set(instrument.instrument_token, instrument);
        });
        return Array.from(instrumentMap.values());
      });
    })
  }, []);

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/servertime`).then((res)=>{
      setServerTime(res.data.data);
    }).catch((e)=>{
      console.log(e);
    })
  },[])

  useEffect(()=>{

    let abortController;
    (async () => {
         abortController = new AbortController();
         let signal = abortController.signal;    

         // the signal is passed into the request(s) we want to abort using this controller
         if(batchId){
             const { data } = await axios.get(`${baseUrl}api/v1/internship/pnl/${batchId}`,{
             withCredentials: true,
             headers: {
                 Accept: "application/json",
                 "Content-Type": "application/json",
                 "Access-Control-Allow-Credentials": true
             },
             signal: signal }
             );
    
             if(data?.data?.length === 0){
              updateNetPnl(0, 0, 0, 0);
             }
             setPnlData(data.data);
             setTradeData(data.data);
         }

    })();

    return () => abortController.abort();
  }, [render, trackEvent, batchId]);

  useEffect(()=> {(async ()=>{
    const res = await axios.get(`${baseUrl}api/v1/internbatch/currentinternship`, {withCredentials:true});
    if(Object.keys(res.data.data).length !== 0){
      console.log(res.data.data._id)
      setBatchId(res.data.data._id);
      setBatchEndDate(res.data.data.batchEndDate);
    }
  })()}, []);

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/userwallet/my`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
    .then((api1Response)=>{
      
      const cashTransactions = (api1Response?.data?.data)?.transactions?.filter((transaction) => {
        return transaction.transactionType === "Cash";
      });
      const totalCashAmount = cashTransactions?.reduce((total, transaction) => {
        return total + transaction?.amount;
      }, 0);
      setCashBalance(totalCashAmount);
    })
  }, [])

  useEffect(()=>{
    if(batchId){
        axios.get(`${baseUrl}api/v1/internship/my/overallinternshippnl/${batchId}`,{
          withCredentials: true,
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
            },
          })
        .then((api1Response)=>{
          // console.log(api1Response.data.data)
          setMyOverallInternshipPNL(api1Response.data.data)  
        })
    }
  }, [batchId])

  useEffect(()=>{
    if(batchId){
        axios.get(`${baseUrl}api/v1/internship/my/tradingDays/${batchId}`,{
          withCredentials: true,
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
            },
          })
        .then((api1Response)=>{
          // console.log(api1Response.data.data)
          setMyTradingDays(api1Response.data.data.length)  
        })
    }
  }, [batchId])

  tradeData.map((subelem, index)=>{
    let obj = {};
    let liveDetail = marketDetails.marketData.filter((elem)=>{
      // //console.log("elem", elem, subelem)
      return subelem._id.instrumentToken == elem.instrument_token;
    })
    totalRunningLots += Number(subelem.lots)
    // console.log(subelem.amount,subelem.lots,liveDetail[0])
    let updatedValue = (subelem.amount+(subelem.lots)*liveDetail[0]?.last_price);
    let netupdatedValue = updatedValue - Number(subelem.brokerage);
    totalGrossPnl += updatedValue;

    totalTransactionCost += Number(subelem.brokerage);
    let lotSize = (subelem._id.symbol)?.includes("BANKNIFTY") ? 25 : 50;

    // from === paperTrader ? 
    updateNetPnl(totalGrossPnl-totalTransactionCost,totalRunningLots, totalGrossPnl, totalTransactionCost)
    
  })
  // console.log(portfolioValue, myOverallIntenrshipPNL[0]?.amount, myOverallIntenrshipPNL[0]?.brokerage, totalGrossPnl, totalTransactionCost );
  // console.log(myOverallInternshipPnl)
  let availableMargin = portfolioValue + (totalGrossPnl-totalTransactionCost) + (myOverallIntenrshipPNL.length > 0 ? (myOverallIntenrshipPNL[0]?.amount - myOverallIntenrshipPNL[0]?.brokerage) : 0)

  const batchParticipants = getDetails?.userDetails?.internshipBatch[0]?.participants
  const user_id = getDetails?.userDetails?._id

  const particpants = batchParticipants?.filter((elem)=>
      elem.user === user_id
  )
  // console.log("Participants: ",particpants)
  const college_id = particpants[0]?.college

  const card = (props)=> {

    return (
    <React.Fragment>
      <CardContent sx={{height: 'auto', flex:1 ,padding:2}} justifyContent="center">
        <MDBox mb={-3}>
        
          <MDBox bgColor={props.color} p={1} mb={2} sx={{height:"auto",boxShadow:("box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15)"),borderRadius:"10px"}}>
  
            <Grid  container spacing={1} justifyContent="center" alignItems="center">
              <Grid item xs={12} mt={1}>
                <MDBox display="flex"  pl={2}justifyContent="left" alignItems="center" flexDirection='row'>
                  <MDAvatar 
                    src={props.icon} 
                    size="small" 
                    style={{
                      border: '2px solid lightgray'
                    }}
                  />
                  <MDTypography fontSize={25} color='light' ml={1} fontWeight="bold">
                    {props.plan}
                  </MDTypography>
                </MDBox>
              </Grid>
            </Grid>
  
            <MDBox p={2} pl={3} pr={3}>
              <MDTypography mb={1} fontFamily="Lucida Sans" fontWeight="bold" variant="body2" color="light" display='flex' justifyContent='left' alignItems='center'>
                <MDAvatar 
                  src={checklist} 
                  size="xs" 
                />
                <MDTypography fontSize={12} color='light' fontWeight='bold'> {props.plan1}</MDTypography>
              </MDTypography>
  
              <MDTypography mb={1} fontFamily="Lucida Sans" fontWeight="bold" variant="body2" color="light" display='flex' justifyContent='left' alignItems='center'>
                <MDAvatar 
                    src={checklist} 
                    size="xs" 
                  />
                <MDTypography fontSize={12} color='light' fontWeight='bold'> {props.plan2}</MDTypography>
              </MDTypography>
  
              <MDTypography mb={1} fontFamily="Lucida Sans" fontWeight="bold" variant="body2" color="light" display='flex' justifyContent='left' alignItems='center'>
                <MDAvatar 
                  src={checklist} 
                  size="xs" 
                />
                <MDTypography fontSize={12} color='light' fontWeight='bold'> {props.plan3}</MDTypography>
              </MDTypography>
  
              <MDTypography mb={1} fontFamily="Lucida Sans" fontWeight="bold" variant="body2" color="light" display='flex' justifyContent='left' alignItems='center'>
                <MDAvatar 
                  src={checklist} 
                  size="xs" 
                />
                <MDTypography fontSize={12} color='light' fontWeight='bold'> {props.plan4}</MDTypography>
              </MDTypography>
              <MDTypography mb={1} fontFamily="Lucida Sans" fontWeight="bold" variant="body2" color="light" display='flex' justifyContent='left' alignItems='center'>
                <MDAvatar 
                  src={checklist} 
                  size="xs" 
                />
                <MDTypography fontSize={12} color='light' fontWeight='bold'> {props.plan5}</MDTypography>
              </MDTypography>
            </MDBox>
  
          </MDBox>
  
  
          <MDBox p={1}  borderTop="1px dotted #1A73E8" display='flex' justifyContent="space-between" alignItems='center' flexDirection='row'>
  
            <MDBox display='flex' justifyContent='center' alignItems='center'>
              <MDTypography 
                mr={1}  
                sx={{ fontSize: 18, fontWeight:'bold', textDecoration: "line-through", textDecorationColor: "gold", textDecorationThickness: "1px" }}  
                gutterBottom
                lineHeight={0}
                color='dark'
              >
                ₹{props.price}
              </MDTypography>
              <MDTypography sx={{ fontSize: 25 }} fontWeight="bold" color="dark" gutterBottom>
                ₹{props.discountPrice}
              </MDTypography>
              <MDTypography color='dark' style={{fontSize:"15px", lineHeight:4.5}}>{props.upto}</MDTypography>
            </MDBox>
            
            <Dialogue amount={props.actual_discountPrice} name={props.plan} id={props.id} walletCash={cashBalance} />


          
          </MDBox>
  
        </MDBox>
         
      </CardContent>
      
     
    </React.Fragment>
  
  )}

  

  useEffect(()=>{
  

    let call1 = axios.get(`${baseUrl}api/v1/tenx/active`,{
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
      // console.log(api1Response.data.data);
      setActiveTenXSubs(api1Response.data.data)
    
    })
    .catch((error) => {
      // Handle errors here
      // console.error(error);
    });


  },[])

  // console.log("cashBalance", cashBalance)
  // console.log("User Details: ",getDetails?.userDetails?.internshipBatch[0]?.batchName)

  return (
   
    <MDBox bgColor="dark" color="light" mt={0} mb={0} p={0} borderRadius={10} minHeight='auto' >

    <MDBox display="flex" justifyContent='center' flexDirection='column' mb={1}>
      <Grid item xs={12} md={6} lg={12}>
      <MDTypography fontSize={15} mb={1} fontWeight='bold' color="light">What is StoxHero Internship Program?</MDTypography>
      <MDBox bgColor="white" p={2} mb={1} borderRadius={5} boxShadow="0px 4px 10px rgba(0, 0, 0, 0.15)">
        <MDTypography fontSize={12} fontWeight='bold' color="dark">
            Welcome to the StoxHero Derivatives Trader Internship Program!
            At StoxHero, we believe in nurturing and developing the next generation of derivatives traders. Our internship program is designed to provide you with a comprehensive learning experience that will sharpen your skills, deepen your understanding of the financial markets, and prepare you for a successful career in derivatives trading. 
            At the successful completion of your internship, you will receive a valuable internship certificate from StoxHero. This certificate recognizes your dedication, knowledge, and practical skills gained during your internship.
            Best of luck, and let's make this internship experience remarkable together!
        </MDTypography>
      </MDBox>
      </Grid>
    </MDBox>
          
    <Grid container spacing={1} mb={1}>
      <Grid item xs={12} md={6} lg={12}>
      <MDBox bgColor="white" p={2} borderRadius={5} boxShadow="0px 4px 10px rgba(0, 0, 0, 0.15)" width='100%'>
        <MDTypography fontSize={15} fontWeight='bold' color="dark">
          Perks & Benefits of StoxHero Internship Program
        </MDTypography>
        <MDTypography fontSize = {12}>1. As part of the internship program, you will receive a stipend calculated at 1% of the net profit and loss (P&L) for the duration of your internship.</MDTypography>
        <MDTypography fontSize = {12}>2. Upon completion of your internship, you will be awarded an internship certificate from StoxHero.</MDTypography>
        <MDTypography></MDTypography>
        <MDTypography fontSize={15} fontWeight='bold' color="dark">
          Internship Completion Rules and Issuance of Internship Certificate
        </MDTypography>
        <MDTypography fontSize = {12}>1. You must accept and abide by the terms of usage and must not partake in any malpractices or manipulation.</MDTypography>
        <MDTypography fontSize = {12}>2. You must take trades on 80% of the trading days during the internship period.</MDTypography>
        <MDTypography fontSize = {12}>3. You must refer atleast 30 users to the platform using your invite link.</MDTypography>
        <MDTypography fontSize = {12}>4. You must treat the internship as an education experience.</MDTypography>
        <MDTypography fontSize = {12}>5. You are limited to taking intraday option trades and are required to close all your positions before 3:20 PM every day.</MDTypography>
        <MDTypography></MDTypography>
        
      </MDBox>   
      </Grid>           
    </Grid>

    {batchId ? 
    <Grid container spacing={1} mb={1} mt={1}>
      <Grid item minWidth='100%'>
      <MDBox bgColor='success' p={1} borderRadius={5} boxShadow="0px 4px 10px rgba(0, 0, 0, 0.15)" width='100%'>
        
            <Grid container display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                  <Grid style={{width:'100%'}} item xs={12} md={6} lg={4} display="flex" justifyContent="center">
                      <GaugeChartReferrals myReferralCount={myReferralCount}/>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} display="flex" justifyContent="center">
                      <GaugeChartReturns availableMargin={availableMargin} portfolioValue={portfolioValue}/>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} display="flex" justifyContent="center">
                      <GaugeChartAttendance myTradingDays={myTradingDays} totalTradingDays={workingDays} />
                  </Grid>
            </Grid>

            <Grid container mt={-5}>
                <Grid container display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                  <Grid item xs={12} md={6} lg={4} display="flex" justifyContent="center">
                      <MDTypography fontSize={12} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Batch: {getDetails?.userDetails?.internshipBatch[0]?.batchName}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} display="flex" justifyContent="center">
                      <MDTypography fontSize={12} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Start Date: {moment.utc(getDetails?.userDetails?.internshipBatch[0]?.batchStartDate).utcOffset('+05:30').format('DD-MMM-YY')}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} display="flex" justifyContent="center">
                      <MDTypography fontSize={12} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>End Date: {moment.utc(getDetails?.userDetails?.internshipBatch[0]?.batchEndDate).utcOffset('+05:30').format('DD-MMM-YY')}</MDTypography>
                  </Grid>
                </Grid>
                
                <Grid container display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                  <Grid item xs={12} md={6} lg={4} mt={1} display="flex" justifyContent="center">
                      <MDTypography fontSize={12} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>College: {college_id?.collegeName}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} mt={1} display="flex" justifyContent="center">
                      <MDTypography fontSize={12} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Portfolio Value: ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(portfolioValue.toFixed(0))}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} mt={1} display="flex" justifyContent="center">
                      <MDTypography fontSize={12} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Available Margin: ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(availableMargin.toFixed(0))}</MDTypography>
                  </Grid>
                </Grid>

                <Grid container display='flex' justifyContent='center' alignContent='center' alignItems='center' mb={1} mt={1}>
                  <Grid item xs={12} md={6} lg={4} display="flex" justifyContent="center">
                      <MDButton 
                        variant="contained" 
                        color="info" 
                        sx={{width: "60%", height: "20px", fontSize: "500x" , margin: '0 20%'}} 
                        onClick={()=>{navigate(`/orders`)}} size='small'
                      >
                        View Orders
                      </MDButton>
                    </Grid>
                  <Grid item xs={12} md={6} lg={4} display="flex" justifyContent="center">
                    <MDButton 
                      variant="contained" 
                      color="info" 
                      sx={{width: "60%", height: "20px", fontSize: "500x" , margin: '0 20%'}} 
                      onClick={()=>{navigate(`/internship/trade`, { state: { batchId: batchId } })}} size='small'
                      disabled={serverTime>=batchEndDate}
                    >
                      Start Trading
                    </MDButton>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} display="flex" justifyContent="center">
                    <MDButton 
                      variant="contained" 
                      color="info" 
                      sx={{width: "60%", height: "20px", fontSize: "500x" , margin: '0 20%'}} 
                      onClick={()=>{navigate(`/internship/analytics`)}} size='small'
                    >
                      View Analytics
                    </MDButton>
                  </Grid>
                </Grid>

            </Grid>
        {/* </MDButton> */}
      </MDBox> 
      </Grid>              
    </Grid>
    :
    <MDBox display='flex' alignItems='center' justifyContent='center'><MDButton onClick={()=>{window.open('/careers','_blank')}}>Apply for Internships</MDButton></MDBox>}

    </MDBox>
  );
}