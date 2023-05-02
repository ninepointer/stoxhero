import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {Tooltip} from '@mui/material';
import stock from "../../../assets/images/analyticspnl.png"
import PNLMetrics from '../data/PNLMetrics';
import MonthLineChart from '../data/MonthLineChart'
import DayLineChart from '../data/DayLineChart'
import BrokerageChart from '../data/BrokerageChart'
import OrdersChart from '../data/OrderChart'
import NetPNLChart from '../data/NetPNLChart'
import GrossPNLChart from '../data/GrossPNLChart'
import DateRangeComponent from '../data/dateRangeSelection'
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { apiUrl } from '../../../constants/constants';
import { userContext } from '../../../AuthContext';
import { userRole } from '../../../variables';
import { InfinityTraderRole } from '../../../variables';


export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);
  const [alignment, setAlignment] = React.useState('Paper Trading');
  const [textColor,setTextColor] = React.useState('info');
  const date = new Date();
  const lastMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  lastMonth.setDate(date.getDate());
  const [startDate,setStartDate] = React.useState(dayjs(lastMonth));
  const [endDate,setEndDate] = React.useState(dayjs(date));
  const [monthWiseData, setMonthWiseData] = useState([]);
  const [dateWiseData, setDateWiseData] = useState([]);
  const getDetails = useContext(userContext);
  const paperTrading = "Paper Trading";
  const infinityTrading = "Infinity Trading";
  const stoxheroTrading = "StoxHero Trading"
  let endpoint ;
  if(alignment === paperTrading){
    endpoint = "papertrade";
  } else if(alignment === infinityTrading){
    endpoint = "infinity"
  } else if(alignment === stoxheroTrading){
    endpoint = "stoxhero"
  }

  const handleChangeView = (event, newAlignment) => {
    // console.log("New Alignment",newAlignment)
    setTextColor("info");
    setAlignment(newAlignment);
  };
  const getMonthWiseStats = async() => {
    const res = await axios.get(`${apiUrl}analytics/${endpoint}/mymonthlypnl`,{withCredentials:true});
    // console.log('res data', res.data.data);
    setMonthWiseData(res.data.data);
  } 
  useEffect(()=>{
    getMonthWiseStats()
  },[endpoint])

  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };

  useEffect(()=>{
    handleShowDetails();
  },[endpoint])

  const handleShowDetails = async() => {
    const from = startDate.format('YYYY-MM-DD');
    const to = endDate.format('YYYY-MM-DD');
    const res = await axios.get(`${apiUrl}analytics/${endpoint}/mystats?from=${from}&to=${to}`, {withCredentials: true});
    console.log(res.data.data);
    setDateWiseData(prev=>res.data.data);
    
  }
  let totalgpnl =0 , totalnpnl =0, totalBrokerage =0, totalOrders=0, totalTradingDays =0, totalGreenDays =0, totalRedDays = 0;
  if(dateWiseData.length>0){
    console.log('datewise',dateWiseData);
    for(let item of dateWiseData ){
      totalgpnl += item.gpnl;
      totalnpnl += item.npnl;
      totalBrokerage += item.brokerage;
      totalOrders += item.noOfTrade;
      if(item.npnl>=0){
        totalGreenDays += 1;
      }
      else{
        totalRedDays+=1;
      }
      totalTradingDays +=1;
    }
  }
  console.log(totalgpnl, totalnpnl, totalBrokerage, totalOrders, totalTradingDays, totalGreenDays, totalRedDays);
  console.log("alignment", alignment)

  return (
   
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>
    
    <MDBox mb={2} style={{border:'1px solid white', borderRadius:5}} display="flex" justifyContent="space-between">
      <MDTypography color="light" fontSize={15} fontWeight="bold" p={1} alignItem="center">P&L Metrics</MDTypography>
      <ToggleButtonGroup
      color={textColor}
      style={{backgroundColor:"white",margin:3}}
      value={alignment}
      size='small'
      exclusive
      onChange={handleChangeView}
      aria-label="Platform"
      >
      <ToggleButton style={{paddingLeft:14,paddingRight:14,fontSize:10,fontWeight:700}} value={paperTrading}> {paperTrading}</ToggleButton>
      { getDetails.userDetails.role.roleName === InfinityTraderRole ?
      <ToggleButton style={{paddingLeft:14,paddingRight:14,fontSize:10,fontWeight:700}} value={infinityTrading}>{infinityTrading}</ToggleButton>
      :
      <ToggleButton style={{paddingLeft:14,paddingRight:14,fontSize:10,fontWeight:700}} value={stoxheroTrading}>{stoxheroTrading}</ToggleButton>
      }
      </ToggleButtonGroup>
    </MDBox>

        <PNLMetrics traderType={alignment} endpoint={endpoint}/>

        <Grid mt={3} container>
          <Grid item xs={12} md={6} lg={12}>
              <MDBox bgColor="light" borderRadius={5}>

              <MDBox>
                    <Grid container spacing={0} p={1} display="flex" justifyContent="space-around" alignContent="center" alignItems="center">
                    
                      <Grid item xs={12} md={6} lg={3} mt={1} mb={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                          <MDTypography color="dark" fontSize={15} fontWeight="bold">Select Date Range</MDTypography>
                      </Grid>

                    <Grid item xs={12} md={6} lg={3} mb={1}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center"  borderRadius={5}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            label="Start Date"
                            // disabled={true}
                            // defaultValue={dayjs(date)}
                            value={startDate}
                            onChange={(e)=>{setStartDate(prev=>dayjs(e))}}
                            // onChange={(e) => {setFormStatePD(prevState => ({
                            //   ...prevState,
                            //   dateField: dayjs(e)
                            // }))}}
                            sx={{ width: '100%'}}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </MDBox>
                    </Grid>
                    

                    <Grid item xs={12} md={6} lg={3} mb={1}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={4}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            label="End Date"
                            // disabled={true}
                            // defaultValue={dayjs(date)}
                            value={endDate}
                            onChange={(e)=>{setEndDate(prev=>dayjs(e))}}
                            // value={dayjs(date)}
                            // onChange={(e) => {setFormStatePD(prevState => ({
                            //   ...prevState,
                            //   dateField: dayjs(e)
                            // }))}}
                            sx={{ width: '100%' }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3} mt={1} mb={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDButton variant="contained" color="info" onClick={handleShowDetails}>Show Details</MDButton>
                    </Grid>

                    </Grid>
                </MDBox>

              </MDBox>
          </Grid>
        </Grid>

        <Grid mt={3} container>
          <Grid item xs={12} md={6} lg={12}>
              <MDBox bgColor="light" borderRadius={5}>

              <MDBox>
                    <Grid container spacing={0} p={2} display="flex" justifyContent="space-around" alignContent="center" alignItems="center">

                    {/* <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center"> */}
                    <Grid item xs={12} md={6} lg={1.7} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                      <MDTypography fontSize={13} fontWeight="bold">Gross:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" color={totalgpnl>0?"success":"error"}>{totalgpnl >=0 ?`₹${totalgpnl?.toFixed(2)}`:`-₹${-1* totalgpnl?.toFixed(2)}`}</MDTypography>
                      </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6} lg={1.7} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                      <MDTypography fontSize={13} fontWeight="bold">Net:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" color={totalnpnl>0?"success":"error"}>{totalnpnl >=0 ?`₹${totalnpnl?.toFixed(2)}`:`-₹${-1*totalnpnl?.toFixed(2)}`}</MDTypography>
                      </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6} lg={1.7} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                      <MDTypography fontSize={13} fontWeight="bold">Brokerage:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" color="info">{totalBrokerage >=0 ?`₹${totalBrokerage?.toFixed(2)}`:`-₹${Math.abs(totalBrokerage?.toFixed(2))}`}</MDTypography>
                      </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6} lg={1.7} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                      <MDTypography fontSize={13} fontWeight="bold">Orders:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" color="#344767">{totalOrders }</MDTypography>
                      </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6} lg={1.7} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                      <MDTypography fontSize={13} fontWeight="bold">Trading Days:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" color="#344767">{totalTradingDays}</MDTypography>
                      </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6} lg={1.7} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                      <MDTypography fontSize={13} fontWeight="bold">Green Days:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" color="success">{totalGreenDays}</MDTypography>
                      </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6} lg={1.7} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                      <MDTypography fontSize={13} fontWeight="bold">Red Days:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" color="error">{totalRedDays}</MDTypography>
                      </MDBox>
                    </Grid>
                    {/* </MDBox> */}

                    </Grid>
                </MDBox>

              </MDBox>
          </Grid>
        </Grid>

        <Grid mt={0} container spacing={3}>
          
          <Grid item xs={12} md={6} lg={6} overflow='auto'>
          <MDBox p={1} bgColor="light" borderRadius={4}>
            <GrossPNLChart traderType={alignment} dateWiseData = {dateWiseData}/>
          </MDBox>
          </Grid>
          
          <Grid item xs={12} md={6} lg={6} overflow='auto'>
          <MDBox p={1} bgColor="light" borderRadius={4}>
            <NetPNLChart traderType={alignment} dateWiseData ={dateWiseData}/>
          </MDBox>
          </Grid>
          
          <Grid item xs={12} md={6} lg={6} overflow='auto'>
          <MDBox p={1} bgColor="light" borderRadius={4}>
            <BrokerageChart traderType={alignment} dateWiseData={dateWiseData}/>
          </MDBox>
          </Grid>
          
          <Grid item xs={12} md={6} lg={6} overflow='auto'>
          <MDBox p={1} bgColor="light" borderRadius={4}>
            <OrdersChart traderType={alignment} dateWiseData={dateWiseData}/>
          </MDBox>
          </Grid>
          
          {/* <Grid item xs={12} md={6} lg={12} overflow='auto'>
          <MDBox p={1} bgColor="light" borderRadius={4}>
            <DayLineChart traderType={alignment}/>
          </MDBox>
          </Grid> */}

          <Grid item xs={12} md={6} lg={12} overflow='auto'>
          <MDBox p={1} bgColor="light" borderRadius={4}>
            <MonthLineChart traderType={alignment} monthWiseData ={monthWiseData}/>
          </MDBox>
          </Grid>

        </Grid>

    </MDBox>
  );
}