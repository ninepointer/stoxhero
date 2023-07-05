import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { Grid, MenuItem, TextField } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MonthLineChart from '../data/MonthLineChart'
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { apiUrl } from '../../../constants/constants';
import TableView from "../data/tableView"

export default function LabTabs() {
  // const dailPnl = "Daily P&L";
  // const traderWisePnl = "Trader Wise P&L";
  // const [alignment, setAlignment] = React.useState(dailPnl);
  // const [textColor,setTextColor] = React.useState('info');
  const date = new Date();
  const lastMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  lastMonth.setDate(date.getDate());
  // const [startDate,setStartDate] = React.useState(dayjs(lastMonth));
  // const [endDate,setEndDate] = React.useState(dayjs(date));
  const [dateWiseData, setDateWiseData] = useState([]);
  const [subscriptions,setSubscription] = useState([]);
  const [selectedSubscription, setselectedSubscription] = useState();

  useEffect(()=>{
    axios.get(`${apiUrl}dailycontest/contests`, {withCredentials: true})
    .then((res)=>{
      setSubscription(res.data.data);
      setselectedSubscription(res.data.data[0]?._id)
    }).catch(e => console.log(e));
  },[])

  // let endpoint ;
  // if(alignment === dailPnl){
  //   endpoint = `tenX/${selectedSubscription}/trade/companypnlreport`;
  // } else if(alignment === traderWisePnl){
  //   endpoint = `tenX/${selectedSubscription}/trade/traderwisecompanypnlreport`;
  // } 



  useEffect(()=>{
    handleShowDetails();
  },[ selectedSubscription])

  const handleShowDetails = async() => {
    // const from = startDate.format('YYYY-MM-DD');
    // const to = endDate.format('YYYY-MM-DD');

    if (selectedSubscription) {
      const res = await axios.get(`${apiUrl}dailycontest/trade/${selectedSubscription}/traderwisecompanypnlreport`, { withCredentials: true });
      console.log(res.data.data);
      setDateWiseData(prev => res.data.data);
    }
    
  }


  let totalgpnl =0 , totalnpnl =0, totalBrokerage =0, totalOrders=0, totalTradingDays =0, totalGreenDays =0, totalRedDays = 0;
  if(dateWiseData.length>0){
    // console.log('datewise',dateWiseData);
    for(let item of dateWiseData ){
      totalgpnl += item.gpnl;
      totalnpnl += item.npnl;
      totalBrokerage += item.brokerage;
      totalOrders += item.noOfTrade;

      totalTradingDays =1;
    }

    if(totalnpnl >= 0){
      totalGreenDays += 1;
    }
    else{
      totalRedDays+=1;
    }
  }

  function changeDateFormat(givenDate) {

    const date = new Date(givenDate);

    // Convert the date to IST
    date.setHours(date.getHours());
    date.setMinutes(date.getMinutes());

    // Format the date as "dd Month yyyy | hh:mm AM/PM"
    const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()} | ${formatTime(date.getHours(), date.getMinutes())}`;

    console.log(formattedDate);

    // Helper function to get the month name
    function getMonthName(month) {
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return monthNames[month];
    }

    // Helper function to format time as "hh:mm AM/PM"
    function formatTime(hours, minutes) {
      const meridiem = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, "0");
      return `${formattedHours}:${formattedMinutes} ${meridiem}`;
    }

    return formattedDate;

  }

  return (
   
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>
    
    <MDBox mb={2} style={{border:'1px solid white', borderRadius:5}} display="flex" justifyContent="space-between">
      <MDTypography color="light" fontSize={15} fontWeight="bold" p={1} alignItem="center">Daily Contest Report</MDTypography>
        <MDBox sx={{ display: 'flex', alignItems: 'center'}}>
          <TextField
            select
            label=""
            value={`${subscriptions[0]?.contestName} - ${changeDateFormat(subscriptions[0]?.contestStartTime)}`}
            minHeight="4em"
            placeholder="Select Contest" 
            variant="outlined"
            sx={{  width: "200px" }}
            onChange={(e) => { setselectedSubscription(subscriptions.filter((item) => item.contestName == (e.target.value).split(" - ")[0])[0]._id) }}
          >
            {subscriptions?.map((option) => (
              <MenuItem key={`${option?.contestName} - ${changeDateFormat(option?.contestStartTime)}`} value={`${option?.contestName} - ${changeDateFormat(option?.contestStartTime)}`} minHeight="4em">
                {`${option?.contestName} - ${changeDateFormat(option?.contestStartTime)}`}
              </MenuItem>
            ))}
          </TextField>
        </MDBox>

    </MDBox>
        <Grid mt={3} container>
          <Grid item xs={12} md={6} lg={12}>
              <MDBox bgColor="light" borderRadius={5}>

              {/* <MDBox>
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
                </MDBox> */}

              </MDBox>
          </Grid>
        </Grid>

        <Grid mt={3} container>
          <Grid item xs={12} md={6} lg={12}>
              <MDBox bgColor="light" borderRadius={5}>

              <MDBox>
                    <Grid container spacing={0} p={2} display="flex" justifyContent="space-around" alignContent="center" alignItems="center">

                    {/* <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center"> */}
                    <Grid item xs={12} md={6} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                      <MDTypography fontSize={13} fontWeight="bold">Gross:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" color={totalgpnl>0?"success":"error"}>{totalgpnl >=0 ?`₹${totalgpnl?.toFixed(2)}`:`-₹${-1* totalgpnl?.toFixed(2)}`}</MDTypography>
                      </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                      <MDTypography fontSize={13} fontWeight="bold">Net:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" color={totalnpnl>0?"success":"error"}>{totalnpnl >=0 ?`₹${totalnpnl?.toFixed(2)}`:`-₹${-1*totalnpnl?.toFixed(2)}`}</MDTypography>
                      </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                      <MDTypography fontSize={13} fontWeight="bold">Brokerage:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" color="info">{totalBrokerage >=0 ?`₹${totalBrokerage?.toFixed(2)}`:`-₹${Math.abs(totalBrokerage?.toFixed(2))}`}</MDTypography>
                      </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                      <MDTypography fontSize={13} fontWeight="bold">Orders:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" color="#344767">{totalOrders }</MDTypography>
                      </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6} lg={1.7} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                      <MDTypography fontSize={13} fontWeight="bold">Trade Days:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" color="#344767">{totalTradingDays}</MDTypography>
                      </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                      <MDTypography fontSize={13} fontWeight="bold">Green D:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" color="success">{totalGreenDays}</MDTypography>
                      </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6} lg={1.3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                      <MDTypography fontSize={13} fontWeight="bold">Red D:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" color="error">{totalRedDays}</MDTypography>
                      </MDBox>
                    </Grid>
                    {/* </MDBox> */}

                    </Grid>
                </MDBox>

              </MDBox>
          </Grid>
        </Grid>

      <Grid mt={3} container>
        <Grid item xs={12} md={6} lg={12} overflow='auto'>
          <MDBox p={1} bgColor="light" borderRadius={4}>
            <MonthLineChart monthWiseData={dateWiseData} />
          </MDBox>
        </Grid>

      </Grid>

      <Grid mt={0} container spacing={3}>
        <Grid item xs={12} md={6} lg={12} overflow='auto'>
          <MDBox p={1}  borderRadius={4}>
            <TableView dateWiseData={dateWiseData} />
          </MDBox>
        </Grid>

      </Grid>

    </MDBox>
  );
}