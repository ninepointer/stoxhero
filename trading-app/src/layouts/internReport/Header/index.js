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
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { apiUrl } from '../../../constants/constants';
import TableView from "../data/tableView"
import moment from 'moment';
import { withStyles } from '@mui/styles';


export default function LabTabs() {
  const dailPnl = "Daily P&L";
  const traderWisePnl = "Trader Wise P&L";
  const [alignment, setAlignment] = React.useState(dailPnl);
  const [textColor,setTextColor] = React.useState('info');
  const date = new Date();
  const lastMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  lastMonth.setDate(date.getDate());
  // const [startDate,setStartDate] = React.useState(dayjs(lastMonth));
  // const [endDate,setEndDate] = React.useState(dayjs(date));
  const [dateWiseData, setDateWiseData] = useState([]);
  const [batches,setBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState();
  const [userData, setUserData] = useState([]);
  const [holiday, setHoliday] = useState();
  const [dates, setDate] = useState({
    startDate: "",
    endDate: ""
  });

  const CustomTextField = withStyles({
    root: {
      '& .MuiInputBase-input': {
        color: '#ffffff', // Replace 'red' with your desired text color
        textAlign: 'center',
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: '#ffffff', // Replace 'red' with your desired text color
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#ffffff', // Replace 'red' with your desired text color
      },
    },
  })(TextField);

  useEffect(()=>{
    axios.get(`${apiUrl}internbatch`, {withCredentials: true})
    .then((res)=>{
      setBatches(res.data.data);
      setSelectedBatches(res.data.data[0])
      dates.startDate = res.data.data[0]?.batchStartDate;
      dates.endDate = res.data.data[0]?.batchEndDate;
      setDate(dates);
    }).catch(e => console.log(e));
  },[])

  let endpoint;
  if(alignment === dailPnl){
    endpoint = `internship/companypnlreport/${selectedBatches?._id}`;
  } else if(alignment === traderWisePnl){
    endpoint = `internship/traderwisecompanypnlreport/${selectedBatches?._id}`;
  } 

  const handleChangeView = (event, newAlignment) => {
    setTextColor("info");
    setAlignment(newAlignment);
  };


  useEffect(()=>{
    handleShowDetails();
  },[endpoint, selectedBatches])

  useEffect(()=>{

    if(dateWiseData[0]){
      const startDate = dateWiseData[0] ? (dateWiseData[0]?.batchStartDate)?.toString()?.split('T')[0] : ''
      // const endDate = moment(new Date().toString()).format("YYYY-MM-DD");;
    
      const batchEndDate = moment(dateWiseData[0]?.batchEndDate);
      const currentDate = moment();
      const endDate = batchEndDate.isBefore(currentDate) ? batchEndDate.format("YYYY-MM-DD") : currentDate.format("YYYY-MM-DD");

      axios.get(`${apiUrl}tradingholiday/dates/${startDate}/${endDate}`, {withCredentials: true})
        .then((res) => {
          // Check if the start date is after the end date
          console.log("holiday", res.data.data)
          setHoliday(res.data.data)
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  }, [dateWiseData])

  const handleShowDetails = async() => {
    // const from = startDate.format('YYYY-MM-DD');
    // const to = endDate.format('YYYY-MM-DD');
    if (selectedBatches) {
      const res = await axios.get(`${apiUrl}${endpoint}`, {withCredentials: true});
      // console.log(res.data.data);
      setDateWiseData(prev=>res.data.data);
      setUserData(prev=>res.data.userData);
    }
    
  }
  let totalgpnl =0 , totalnpnl =0, totalBrokerage =0, totalOrders=0, totalTradingDays =0, totalGreenDays =0, totalRedDays = 0;
  if(dateWiseData.length>0){
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

      <MDBox mb={2} style={{ border: '1px solid white', borderRadius: 5 }} display="flex" justifyContent="space-between">
        <MDTypography color="light" fontSize={15} fontWeight="bold" p={1} alignItem="center">Intern Report</MDTypography>
        <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomTextField
            select
            label=""
            value={selectedBatches?.batchName ? selectedBatches?.batchName : batches[0]?.batchName}
            minHeight="4em"
            placeholder="Select subscription"
            variant="outlined"
            InputLabelProps={{
              style: { color: '#ffffff' },
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: { width: '300px' }, // Replace '200px' with your desired width
                },
              },
            }}
            sx={{ width: "300px" }}
            onChange={(e) => { setSelectedBatches(batches.filter((item) => item.batchName == e.target.value)[0]) }}
          >
            {batches?.map((option) => (
              <MenuItem key={option.batchName} value={option.batchName} minHeight="4em">
                {option.batchName}
              </MenuItem>
            ))}
          </CustomTextField>
          <ToggleButtonGroup
            color={textColor}
            style={{ backgroundColor: "white", margin: 3 }}
            value={alignment}
            size='small'
            exclusive
            onChange={handleChangeView}
            aria-label="Platform"
          >
            <ToggleButton style={{ paddingLeft: 14, paddingRight: 14, fontSize: 10, fontWeight: 700 }} value={dailPnl}> {dailPnl}</ToggleButton>
            <ToggleButton style={{ paddingLeft: 14, paddingRight: 14, fontSize: 10, fontWeight: 700 }} value={traderWisePnl}>{traderWisePnl}</ToggleButton>
          </ToggleButtonGroup>
        </MDBox>

      </MDBox>


      <Grid mt={3} container>
        <Grid item xs={12} md={6} lg={12}>
          <MDBox bgColor="light" borderRadius={5}>

            <MDBox>
              <Grid container spacing={0} p={2} display="flex" justifyContent="space-around" alignContent="center" alignItems="center">
                <Grid item xs={12} md={6} lg={3.66} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11}>Batch Start Date:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >{changeDateFormat(selectedBatches?.batchStartDate)}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={3.66} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >Batch End Date:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >{changeDateFormat(selectedBatches?.batchEndDate)}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >Participants:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >{(selectedBatches?.participants?.length)}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={1.33} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}  p={1}>
                    <MDTypography fontSize={11} >Payout %:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" >{(selectedBatches?.payoutPercentage)}</MDTypography>
                  </MDBox>
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
                <Grid item xs={12} md={6} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">Gross:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color={totalgpnl > 0 ? "success" : "error"}>{totalgpnl >= 0 ? `₹${totalgpnl?.toFixed(2)}` : `-₹${-1 * totalgpnl?.toFixed(2)}`}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">Net:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color={totalnpnl > 0 ? "success" : "error"}>{totalnpnl >= 0 ? `₹${totalnpnl?.toFixed(2)}` : `-₹${-1 * totalnpnl?.toFixed(2)}`}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">Brokerage:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color="info">{totalBrokerage >= 0 ? `₹${totalBrokerage?.toFixed(2)}` : `-₹${Math.abs(totalBrokerage?.toFixed(2))}`}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">Orders:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color="#344767">{totalOrders}</MDTypography>
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
            <MonthLineChart traderType={alignment} monthWiseData={dateWiseData} />
          </MDBox>
        </Grid>

      </Grid>

      <Grid mt={0} container spacing={3}>
        <Grid item xs={12} md={6} lg={12} overflow='auto'>
          <MDBox p={1} borderRadius={4}>
            {(alignment === dailPnl || userData) &&
              <TableView whichTab={alignment} dateWiseData={dateWiseData} userData={userData} batches={batches} dates={dates} holiday={holiday} />}
          </MDBox>
        </Grid>

      </Grid>

    </MDBox>
  );
}