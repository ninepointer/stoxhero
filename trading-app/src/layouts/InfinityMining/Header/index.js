import React, {useState, useEffect} from 'react';
import MDBox from '../../../components/MDBox';
import axios from 'axios';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import {Link} from 'react-router-dom'
import { CircularProgress, Grid, LinearProgress, Tooltip } from '@mui/material';
import Logo from '../../../assets/images/default-profile.png'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material';
import moment from 'moment';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';
import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor';

//data
import LiveMockInfinityDailyData from '../data/liveMockInfinityDailyChart'
import PNLSummary from '../data/pnlSummary'
import TraderMetrics from '../data/traderMetrics'
import TraderDetails from '../data/traderDetails';
import LiveMockInfinityTableData from '../data/liveMockInfinityDailyDataTable'
import LiveMockInfinityWeekDayChart from '../data/liveMockInfinityWeekDayChart'
import LiveMockDataScreenshot from '../data/liveMockDataScreenshot'
import LiveMockInfinityWeekdayDataTable from '../data/liveMockInfinityWeekdayDataTable'

const CustomAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-clearIndicator {
    color: white;
  }
`;


export default function InfinityMining() {
  const [sideSelectedOption, setSideSelectedOption] = useState(sides[0]);
  const [traderSelectedOption, setTraderSelectedOption] = useState();
  const [infinityMiningData, setInfinityMiningData] = useState();
  const [traderId,setTraderId] = useState();
  const [infinityTraders,setInfinityTraders] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [pnlSummary, setPNLSummary] = useState();
  const [bothSideTradeData, setBothSideTradeData] = useState();
  const [bothSideWeeklyTradeData, setBothSideWeeklyTradeData] = useState();
  const [showDownloadButton, setShowDownloadButton] = useState(true);
  const [showDownloadButton1, setShowDownloadButton1] = useState(true);
  const [showDownloadButton2, setShowDownloadButton2] = useState(true);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const handleDownload = (csvData) => {
    // Create the CSV content
    // const csvContent = csvData.map(row => row.join(',')).join('\n');
    const csvContent = csvData?.map((row) => {
      return row?.map((row1) => row1.join(',')).join('\n');
    });
    // const csvContent = 'Date,Weekday,Gross P&L(S) Gross P&L(I) Net P&L(S) Net P&L(I) Net P&L Diff(S-I)\nValue 1,Value 2,Value 3\nValue 4, Value 5, Value 6';

    // Create a Blob object with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

    // Save the file using FileSaver.js
    saveAs(blob, `${traderId?.first_name + ' ' + traderId?.last_name}.csv`);
  }

  const captureScreenshot = (id) => {
    const screenshotElement = document.getElementById(id);
    setTimeout(()=>{
      setShowDownloadButton(false)
      html2canvas(screenshotElement)
      .then((canvas) => {
        const link = document.createElement('a');
        link.download = `${traderId?.first_name + ' ' + traderId?.last_name}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setShowDownloadButton(true)
      })
      .catch((error) => {
        console.error('Error capturing screenshot:', error);
        setShowDownloadButton(true)
      });
    },500)
    
  };
  
  useEffect(()=>{
    console.log("Inside Use Effect")
    setIsLoading(true)
    let call2 = axios.get((`${baseUrl}api/v1/infinityTraders`),{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
    Promise.all([call2])
    .then(([api1Response2]) => {
      // Process the responses here
      console.log(api1Response2.data.data);
      setTraderSelectedOption(traderSelectedOption ? traderSelectedOption : api1Response2.data.data[0]);
      setTraderId(traderSelectedOption ? traderSelectedOption : api1Response2.data.data[0]);
      setInfinityTraders(api1Response2.data.data)
      InfinityMining(traderId)
    })
    .catch((error) => {
      // Handle errors here
      setIsLoading(false)
      console.error(error);
    });  
  },[traderId])

  async function InfinityMining(traderId){
    console.log("Infinity Mining Function Called")
    let call1 = await axios.get((`${baseUrl}api/v1/infinitymining/traderstats/${traderId?._id}`),{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
    let call3 = await axios.get((`${baseUrl}api/v1/infinitymining/tradertradesoverview/${traderId?._id}`),{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
    let call4 = await axios.get((`${baseUrl}api/v1/infinitymining/bothtradesdata/${traderId?._id}`),{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
    let call5 = await axios.get((`${baseUrl}api/v1/infinitymining/bothtradesdataweek/${traderId?._id}`),{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
    Promise.all([call1, call3, call4, call5])
    .then(([api1Response1, api1Response3, api1Response4,api1Response5]) => {
      // Process the responses here
      console.log("Infinity Mining Data:",api1Response1.data.data);
      console.log("PNL Summary:",api1Response3.data.data)
      setInfinityMiningData(api1Response1.data.data)
      setPNLSummary(api1Response3.data.data);
      setBothSideTradeData(api1Response4.data.data)
      setBothSideWeeklyTradeData(api1Response5.data.data);
      setIsLoading(false)
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
      setIsLoading(false)
    }); 
  }

  console.log(traderSelectedOption)

  let startDate
  let endDate
  if(bothSideTradeData){
  const dates = Object.keys(bothSideTradeData)
  let arrayLength = dates?.length
  startDate = moment.utc(new Date(dates[0])?.toLocaleString("en-US", { timeZone: "UTC" })).utcOffset('+00:00').format('DD-MMM-YY')
  endDate = moment.utc(new Date(dates[arrayLength-1])?.toLocaleString("en-US", { timeZone: "UTC" })).utcOffset('+00:00').format('DD-MMM-YY')
  }

  let dates = []
  let stoxHeroNpnl = []
  let csvDataFile = [[]]
  let csvData = [['Date','Weekday', 'Gross P&L(S)', 'Gross P&L(I)', 'Net P&L(S)', 'Net P&L(I)', 'Net P&L Diff(S-I)']]

  if(bothSideTradeData){
  dates = Object.keys(bothSideTradeData)
  let csvpnlData = Object.values(bothSideTradeData)
  csvDataFile = csvpnlData?.map((elem)=>{
     
  return [elem?.stoxHero?._id,
      moment.utc(new Date(elem?.stoxHero?._id)).utcOffset('+00:00').format('dddd'),
      elem?.stoxHero?.gpnl,
      elem?.infinity?.gpnl,
      elem?.stoxHero?.npnl,
      elem?.infinity?.npnl,
      elem?.stoxHero?.npnl-elem?.infinity?.npnl]
  })
  }

  csvData = [[...csvData,...csvDataFile]]
  console.log("CSV PNL Data: ",csvData)

  let weekday = []
  let stoxHeroNpnl1 = []
  let csvDataFile1 = [[]]
  let csvData1 = [['Weekday','Gross P&L(S)','Gross P&L(I)','Net P&L(S)','Net P&L(I)', 'Net P&L Diff(S-I)']]

  if(bothSideWeeklyTradeData){
    weekday = Object.keys(bothSideWeeklyTradeData)
    let csvpnlData1 = Object.values(bothSideWeeklyTradeData)
    csvDataFile1 = csvpnlData1?.map((elem)=>{
       
    return [
        elem?.stoxHero?._id,
        elem?.stoxHero?.gpnl,
        elem?.infinity?.gpnl,
        elem?.stoxHero?.npnl,
        elem?.infinity?.npnl,
        elem?.stoxHero?.npnl-elem?.infinity?.npnl]
    })
    }

  csvData1 = [[...csvData1,...csvDataFile1]]
  console.log("CSV PNL Data Weekday: ",csvData1)
  
  let csvDataFile2 = [[]]
  let csvData2 = [['Period','Gross P&L','Net P&L','Brokerage', 'Trades']]

  const handleSideOptionChange = (event, newValue) => {
    console.log("Side Selection:",newValue)
    setSideSelectedOption(newValue);
  };

  const handleTraderOptionChange = (event, newValue) => {
    console.log("Trader Selection:",newValue)
    setTraderSelectedOption(newValue);
    setTraderId(newValue);
  };

  return (
    <>
    {infinityTraders && 
      <MDBox>
       
       <MDBox bgColor="primary" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='10vh'>
         
          <Grid container lg={12}>
              <Grid item lg={4}>
                  <CustomAutocomplete
                    id="country-select-demo"
                    sx={{ 
                      width: 300,
                      '& .MuiAutocomplete-clearIndicator': {
                        color: 'white',
                      },
                     }}
                    options={infinityTraders}
                    value={traderSelectedOption}
                    onChange={handleTraderOptionChange}
                    autoHighlight
                    getOptionLabel={(option) => option.first_name + ' ' + option.last_name + ' - ' + option.cohort}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <img
                          loading="lazy"
                          width="20"
                          src={option.profilePhoto?.url || Logo}
                          srcSet={option.profilePhoto?.url || Logo}
                          alt=""
                        />
                        {option.first_name + ' ' + option.last_name + ' - ' + option.cohort}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Choose a Trader"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password', // disable autocomplete and autofill
                          style: { color: 'white' }, // set text color to white
                        }}
                        InputLabelProps={{
                          style: { color: 'white' }, // set label color to white
                        }}
                      />
                    )}
                  />
              </Grid>

              <Grid item lg={4}>
                  <CustomAutocomplete
                    id="country-select-demo"
                    disabled
                    sx={{ 
                      width: 300,
                      '& .MuiAutocomplete-clearIndicator': {
                        color: 'white',
                      },
                     }}
                    options={sides}
                    value={sideSelectedOption}
                    onChange={handleSideOptionChange}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <img
                          loading="lazy"
                          width="20"
                          src={option.image}
                          srcSet={option.image}
                          alt=""
                        />
                        {option.label}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Choose Side"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password', // disable autocomplete and autofill
                          style: { color: 'white' }, // set text color to white
                        }}
                        InputLabelProps={{
                          style: { color: 'white' }, // set label color to white
                        }}
                      />
                    )}
                  />
              </Grid>
          </Grid>
          
      </MDBox>

      {isLoading &&
      <MDBox
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999}}
      >
       <CircularProgress/>
      </MDBox>
      } 
      <MDBox style={{backgroundColor:'white'}} color="light" mt={1} mb={1} p={0} borderRadius={0} minHeight='80vH'>
          <Grid container spacing={0}>
            
            <Grid item xs={12} md={8} lg={4}>
              
              <Grid item xs={12} md={8} lg={12} style={{backgroundColor:'white'}} width='100%'>
                {(traderId && bothSideTradeData && !isLoading) && <TraderDetails traderId = {traderId} isLoading={isLoading}/>}   
              </Grid>

            </Grid>

            <Grid item xs={12} md={8} lg={8}>
              <MDBox id='screenshot-component2' bgColor="light" color="light" mb={1} p={0} borderRadius={0} minHeight='auto'>
              <Grid item xs={12} md={12} lg={12} p={2} display='flex' justifyContent='center' flexDirection='column' style={{backgroundColor:'white', width:'100%'}}>
                  <MDBox mt={-1.5} display='flex' justifyContent='space-between' alignItems='center'>
                    <MDBox ml={2}>
                      <MDTypography fontSize={15} fontWeight='bold' style={{textAlign:'center'}}>
                        {traderId?.first_name} {traderId?.last_name}'s PNL Summary (Period - {startDate} to {endDate})
                      </MDTypography>
                    </MDBox>
                    <MDBox mr={1} mb={0.5}>
                      {showDownloadButton && <Tooltip title="Screenshot"><MDButton variant='contained' onClick={()=>{captureScreenshot('screenshot-component2')}}><ScreenshotMonitorIcon/></MDButton></Tooltip>}
                    </MDBox>
                  </MDBox>
                {(infinityMiningData && !isLoading) && <PNLSummary infinityMiningData={infinityMiningData} pnlSummary={pnlSummary} isLoading={isLoading}/>}
              </Grid>
              </MDBox>

              <Grid item xs={12} md={8} lg={12} p={2} style={{backgroundColor:'white', width:'100%'}}>
                {(infinityMiningData && !isLoading) && <TraderMetrics infinityMiningData={infinityMiningData} isLoading={isLoading}/>}
              </Grid>

            </Grid>
            
          </Grid>
          
      </MDBox>

      <MDBox bgColor="light" color="light" mt={1} mb={1} p={0} borderRadius={0} minHeight='auto'>

          <Grid item xs={12} md={8} lg={12} mt={1} style={{minHeight:'auto'}}>
              <Grid container width='100%'>
                <Grid item lg={12} style={{backgroundColor:'white', width:'100%'}}>
                   {(bothSideWeeklyTradeData && !isLoading) && 
                   <>
                   <MDBox mb={0.5} mt={1}>
                    <MDTypography fontSize={15} fontWeight='bold' style={{textAlign:'center'}}>
                      {traderId?.first_name} {traderId?.last_name}'s Average Net P&L Weekday Wise (Period - {startDate} to {endDate})
                    </MDTypography>
                   </MDBox>
                   <LiveMockInfinityWeekDayChart bothSideWeeklyTradeData={bothSideWeeklyTradeData} isLoading={isLoading}/>
                   </>
                   }
                </Grid>
              </Grid>
          </Grid>

      </MDBox>

      <MDBox id='screenshot-component1' bgColor="light" color="light" mt={1} mb={1} p={0} borderRadius={0} minHeight='auto'>

          <Grid item xs={12} md={8} lg={12} mt={1} style={{minHeight:'auto'}}>
              <Grid container width='100%'>
                <Grid item lg={12} style={{backgroundColor:'white', width:'100%'}}>
                   {(bothSideWeeklyTradeData && !isLoading) && 
                   <>
                   <MDBox mb={1} mt={1.5} display='flex' justifyContent='space-between' alignItems='center'>
                      <MDBox ml={2}>
                        <MDTypography fontSize={15} fontWeight='bold' style={{textAlign:'center'}}>
                          {traderId?.first_name} {traderId?.last_name}'s Weekday Cumm. P&L StoxHero Vs Infinity(Period - {startDate} to {endDate})
                        </MDTypography>
                      </MDBox>
                      <MDBox mr={1}>
                        {showDownloadButton && <Tooltip title="Screenshot"><MDButton variant='contained' onClick={()=>{captureScreenshot('screenshot-component1')}}><ScreenshotMonitorIcon/></MDButton></Tooltip>}
                        {showDownloadButton && <Tooltip title="Download CSV"><MDButton variant='contained' onClick={()=>{handleDownload(csvData1)}}><DownloadIcon/></MDButton></Tooltip>}
                      </MDBox>
                    </MDBox>
                   <LiveMockInfinityWeekdayDataTable bothSideWeeklyTradeData={bothSideWeeklyTradeData} isLoading={isLoading}/>
                   </>
                   }
                </Grid>
              </Grid>
          </Grid>

      </MDBox>

      <MDBox bgColor="light" color="light" mt={1} mb={1} p={0} borderRadius={0} minHeight='auto'>

          <Grid item xs={12} md={8} lg={12} mt={1} style={{minHeight:'auto'}}>
              <Grid container width='100%'>
                <Grid item lg={12} style={{backgroundColor:'white', width:'100%'}}>
                   {(bothSideTradeData && !isLoading) && 
                   <>
                    <MDBox mb={1} mt={0.5} display='flex' justifyContent='space-between' alignItems='center'>
                      
                        <MDTypography fontSize={15} fontWeight='bold' style={{textAlign:'center'}}>
                          {traderId?.first_name} {traderId?.last_name}'s Daily Net P&L StoxHero Vs Infinity (Period - {startDate} to {endDate})
                        </MDTypography>
                    
                    </MDBox>
                   <LiveMockInfinityDailyData bothSideTradeData={bothSideTradeData} isLoading={isLoading}/>
                   </>
                   }
                </Grid>
              </Grid>
          </Grid>

      </MDBox>

      <MDBox id='screenshot-component' bgColor="light" color="light" mt={1} mb={1} p={0} borderRadius={0} minHeight='auto'>
    
          <Grid item xs={12} md={8} lg={12} mt={1} style={{minHeight:'auto'}}>
              <Grid container width='100%'>
                <Grid item lg={12} p={1} style={{backgroundColor:'white', width:'100%'}}>
                    {(bothSideTradeData && !isLoading) && 
                    <>
                    <MDBox mb={1} mt={0.5} display='flex' justifyContent='space-between' alignItems='center'>
                      <MDBox ml={1}>
                        <MDTypography fontSize={15} fontWeight='bold' style={{textAlign:'center'}}>
                          {traderId?.first_name} {traderId?.last_name}'s Daily Net P&L (Period - {startDate} to {endDate})
                        </MDTypography>
                      </MDBox>
                      <MDBox mr={1}>
                        {showDownloadButton && <Tooltip title="Screenshot"><MDButton variant='contained'  onClick={()=>{captureScreenshot('screenshot-component')}}><ScreenshotMonitorIcon/></MDButton></Tooltip>}
                        {showDownloadButton && <Tooltip title="Download CSV"><MDButton variant='contained' onClick={()=>{handleDownload(csvData)}}><DownloadIcon/></MDButton></Tooltip>}
                      </MDBox>
                    </MDBox>
                    <LiveMockInfinityTableData bothSideTradeData={bothSideTradeData} isLoading={isLoading}/>
                    </>
                    }
                </Grid>
              </Grid>
          </Grid>

      </MDBox>

    </MDBox>}
    </>
  );
}

const sides = [
  {  
    label: 'Trader Side',
  },
  {
    label: 'Company Side', 
  }
];