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
import TableView from "../data/tableView";
import Autocomplete from '@mui/material/Autocomplete';
import { makeStyles } from '@mui/styles';
// import { makeStyles } from '@mui/core/styles';

const useStyles = makeStyles({
  root: {
    '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      padding: "3px",
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderWidth: '1px',
      },
    },
  },
});

export default function LabTabs() {
  const classes = useStyles();
  const companyPnlTraderwise = "Company P&L(Trader Wise)";
  const traderPnlTraderwise = "Trader P&L(Trader Wise)";
  const companyDailyPnl = "Company Daily P&L";
  const traderMetrics = "Trader Metrics";
  const [alignment, setAlignment] = React.useState(companyDailyPnl);
  const [textColor,setTextColor] = React.useState('info');
  const date = new Date();
  const lastMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  lastMonth.setDate(date.getDate());
  const [startDate,setStartDate] = React.useState(dayjs(lastMonth));
  const [endDate,setEndDate] = React.useState(dayjs(date));
  const [dateWiseData, setDateWiseData] = useState([]);
  const [cumulativeData,setCumulativeData] = useState([]);
  // const [selectedBatches, setSelectedBatches] = useState();
  const [trader, setTrader] = useState([])
  const [value, setValue] = useState(null);

// console.log("value", value)
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  useEffect(()=>{
    let abortController;
    (async () => {
      abortController = new AbortController();
      let signal = abortController.signal;

      // the signal is passed into the request(s) we want to abort using this controller
      const { data } = await axios.get(`${baseUrl}api/v1/infinityUsers`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        signal: signal
      }
      );
      // setSelectedTrader(data.data[0].name)
      setTrader(data.data);

    })();

    return () => abortController.abort();

  },[])

  let endpoint ;
  if(alignment === companyDailyPnl){
    endpoint = `infinityTrade/live/companypnlreport`;
  } else if(alignment === companyPnlTraderwise){
    if(!value){
      endpoint = `infinityTrade/live/traderwisecompanypnlreport`;
    } else{
      endpoint = `infinityTrade/live/companypnlreportsingleuser/${value?._id}`;
    }
    
  }else if(alignment === traderPnlTraderwise){
    if(!value){
      endpoint = `infinityTrade/live/traderwisetraderpnlreport`;
    } else{
      endpoint = `infinityTrade/live/traderpnlreportsingleuser/${value?._id}`;
    }
  }else if(alignment === traderMetrics){
    endpoint = `infinityTrade/live/tradermatrixpnlreport`;
  } 

  const handleChangeView = (event, newAlignment) => {
    setTextColor("info");
    setAlignment(newAlignment);
  };

  console.log("alignment", alignment, endpoint)

  useEffect(()=>{
    handleShowDetails();
  },[endpoint, value])

  const handleShowDetails = async() => {
    const from = startDate.format('YYYY-MM-DD');
    const to = endDate.format('YYYY-MM-DD');
    if (from && to) {
      const res = await axios.get(`${apiUrl}${endpoint}/${from}/${to}`, {withCredentials: true});
      // console.log(res.data.data);
      setDateWiseData(prev=>res.data.data);
      if(res?.data?.cumulative){
        setCumulativeData(res?.data?.cumulative)
      }
      
    }
    
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

  let cumulativeTotalgpnl =0 , cumulativeTotalnpnl =0, cumulativeTotalBrokerage =0, cumulativeTotalOrders=0, cumulativeTotalTradingDays =0, cumulativeTotalGreenDays =0, cumulativeTotalRedDays = 0;
  if(cumulativeData?.length>0){
    // console.log('cumulativeData',cumulativeData);
    for(let item of cumulativeData ){
      cumulativeTotalgpnl += item?.gpnl;
      cumulativeTotalnpnl += item?.npnl;
      cumulativeTotalBrokerage += item?.brokerage;
      cumulativeTotalOrders += item?.noOfTrade;
      if(item?.npnl>=0){
        cumulativeTotalGreenDays += 1;
      }
      else{
        cumulativeTotalRedDays+=1;
      }
      cumulativeTotalTradingDays +=1;
    }
    if(alignment === companyDailyPnl){
      cumulativeTotalgpnl = cumulativeData[cumulativeData.length - 1]?.gpnl;
      cumulativeTotalnpnl = cumulativeData[cumulativeData.length - 1]?.npnl;
      cumulativeTotalBrokerage = cumulativeData[cumulativeData.length - 1]?.brokerage;
      cumulativeTotalOrders = cumulativeData[cumulativeData.length - 1]?.noOfTrade;
    }
  }

  return  (

    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>

      <MDBox mb={2} style={{ border: '1px solid white', borderRadius: 5 }} display="flex" justifyContent="space-between">
        <MDTypography color="light" fontSize={15} fontWeight="bold" p={1} alignItem="center">Admin Mock Report</MDTypography>
        <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <TextField
            select
            label=""
            value={batches[0]?.batchName}
            minHeight="4em"
            placeholder="Select subscription"
            variant="outlined"
            InputLabelProps={{
              style: {
                color: 'light'
              }
            }}
            InputProps={{
              style: {
                input: {
                  color: 'light' // Change the color value to the desired text color
                }
              }
            }}
            sx={{ width: "170px" }}
            onChange={(e) => { setSelectedBatches(batches.filter((item) => item.batchName == e.target.value)[0]._id) }}
          >
            {batches?.map((option) => (
              <MenuItem key={option.batchName} value={option.batchName} minHeight="4em">
                {option.batchName}
              </MenuItem>
            ))}
          </TextField> */}
          <ToggleButtonGroup
            color={textColor}
            style={{ backgroundColor: "white", margin: 3 }}
            value={alignment}
            size='small'
            exclusive
            onChange={handleChangeView}
            aria-label="Platform"
          >
            <ToggleButton style={{ paddingLeft: 14, paddingRight: 14, fontSize: 9, fontWeight: 600 }} value={companyDailyPnl}> {companyDailyPnl}</ToggleButton>
            <ToggleButton style={{ paddingLeft: 14, paddingRight: 14, fontSize: 9, fontWeight: 600 }} value={companyPnlTraderwise}>{companyPnlTraderwise}</ToggleButton>
            <ToggleButton style={{ paddingLeft: 14, paddingRight: 14, fontSize: 9, fontWeight: 600 }} value={traderPnlTraderwise}> {traderPnlTraderwise}</ToggleButton>
            <ToggleButton style={{ paddingLeft: 14, paddingRight: 14, fontSize: 9, fontWeight: 600 }} value={traderMetrics}>{traderMetrics}</ToggleButton>
          </ToggleButtonGroup>
        </MDBox>

      </MDBox>
      <Grid mt={3} container>
        <Grid item xs={12} md={6} lg={12}>
          <MDBox bgColor="light" borderRadius={5}>

            <MDBox display="flex" justifyContent="space-around" alignContent="center" alignItems="center">
              <Grid container spacing={0} p={1} display="flex" justifyContent="space-evenly" alignContent="center" alignItems="center">

                <Grid item xs={12} md={6} lg={3} mt={1} mb={1} p={0} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox alignItem='center'>
                    <MDTypography display="flex" justifyContent="center" alignContent="center" alignItems="center" color="dark" fontSize={15} fontWeight="bold">Select User</MDTypography>

                    <Grid container spacing={0} p={0} lg={12} display="flex" justifyContent="center" alignContent="center" alignItems="center">

                      <Grid item xs={12} md={6} lg={12} mt={1} mb={1} p={0} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        {/* <MDTypography color="dark" fontSize={15} fontWeight="bold">Select User</MDTypography> */}

                        <Autocomplete
                          className={classes.root}
                          value={value}
                          onChange={(event, newValue) => {
                            if (typeof newValue === 'string') {
                              setValue({
                                title: newValue,
                              });
                            } else if (newValue && newValue.inputValue) {
                              // Create a new value from the user input
                              setValue({
                                title: newValue.inputValue,
                              });
                            } else {
                              setValue(newValue);
                            }
                          }}
                          selectOnFocus
                          clearOnBlur
                          handleHomeEndKeys
                          id="traders"
                          options={trader}
                          getOptionLabel={(option) => {
                            // Value selected with enter, right from the input
                            if (typeof option === 'string') {
                              return option;
                            }
                            // Add "xxx" option created dynamically
                            if (option.inputValue) {
                              return option.inputValue;
                            }
                            // Regular option
                            return `${option.first_name} ${option.last_name}`;
                          }}
                          renderOption={(props, option) => <li {...props}>{`${option.first_name} ${option.last_name}`}</li>}
                          sx={{ width: 170, maxHeight: 170, padding: "0px" }}
                          freeSolo
                          renderInput={(params) => (
                            <TextField {...params} label="Select" sx={{ padding: "0px" }} />
                          )}
                        />
                      </Grid>

                    </Grid>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={9} mt={1} mb={1} p={0} display="flex" justifyContent="center" alignContent="center" alignItems="center">

                  <MDBox alignItem='center'>
                    <MDTypography display="flex" justifyContent="center" alignContent="center" alignItems="center" color="dark" fontSize={15} fontWeight="bold">Select Date Range</MDTypography>

                    <Grid container spacing={0} p={1} lg={12} display="flex" alignContent="center" alignItems="center" justifyContent='space-between'>

                      <Grid item xs={12} md={6} lg={4} mb={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                              <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(e) => { setStartDate(prev => dayjs(e)) }}
                                sx={{ width: '100%' }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={6} lg={4} mb={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={4}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                              <DatePicker
                                label="End Date"
                                // disabled={true}
                                // defaultValue={dayjs(date)}
                                value={endDate}
                                onChange={(e) => { setEndDate(prev => dayjs(e)) }}
                                // value={dayjs(date)}
                                // onChange={(e) => {setFormStatePD(prevState => ({
                                //   ...prevState,
                                //   dateField: dayjs(e)
                                // }))}}
                                sx={{ width: '100%', marginLeft: "30px" }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} md={6} lg={4} mt={1} mb={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDButton variant="contained" color="info" onClick={handleShowDetails}>Show Details</MDButton>
                      </Grid>

                    </Grid>
                  </MDBox>
                </Grid>


              </Grid>
            </MDBox>

          </MDBox>
        </Grid>
      </Grid>

      <MDBox bgColor="light" sx={{ borderTopLeftRadius: 5, borderTopRightRadius: 5 }} width="170px">
        <MDTypography fontSize={13} mt={3} fontWeight="bold" bgColor="light" paddingLeft="5px" >For Selected Date Range</MDTypography>
      </MDBox>
      <Grid  container>
        <Grid item xs={12} md={6} lg={12}>
          <MDBox bgColor="light" borderRadius={5} sx={{ borderTopLeftRadius: 0}}>

            <MDBox>
              <Grid container spacing={0} p={2} display="flex" justifyContent="space-around" alignContent="center" alignItems="center">

                {/* <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center"> */}
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

              </Grid>
            </MDBox>

          </MDBox>
        </Grid>
      </Grid>

      <MDBox bgColor="light" sx={{ borderTopLeftRadius: 5, borderTopRightRadius: 5 }} width="130px">
        <MDTypography fontSize={13} mt={3} fontWeight="bold" bgColor="light" paddingLeft="25px" >Cumulative</MDTypography>
      </MDBox>
      {/* <MDTypography fontSize={13} mt={3} fontWeight="bold" color="light">Cumulative</MDTypography> */}
      <Grid container>
        <Grid item xs={12} md={6} lg={12}>
          <MDBox bgColor="light" borderRadius={5} sx={{ borderTopLeftRadius: 0}}>

            <MDBox>
              <Grid container spacing={0} p={2} display="flex" justifyContent="space-around" alignContent="center" alignItems="center">

                <Grid item xs={12} md={6} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">Gross:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color={cumulativeTotalgpnl > 0 ? "success" : "error"}>{cumulativeTotalgpnl >= 0 ? `₹${cumulativeTotalgpnl?.toFixed(2)}` : `-₹${-1 * cumulativeTotalgpnl?.toFixed(2)}`}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">Net:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color={cumulativeTotalnpnl > 0 ? "success" : "error"}>{cumulativeTotalnpnl >= 0 ? `₹${cumulativeTotalnpnl?.toFixed(2)}` : `-₹${-1 * cumulativeTotalnpnl?.toFixed(2)}`}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">Brokerage:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color="info">{cumulativeTotalBrokerage >= 0 ? `₹${cumulativeTotalBrokerage?.toFixed(2)}` : `-₹${Math.abs(cumulativeTotalBrokerage?.toFixed(2))}`}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">Orders:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color="#344767">{cumulativeTotalOrders}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={1.7} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">Trade Days:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color="#344767">{cumulativeTotalTradingDays}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">Green D:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color="success">{cumulativeTotalGreenDays}</MDTypography>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={6} lg={1.3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} border='1px solid grey' p={1}>
                    <MDTypography fontSize={13} fontWeight="bold">Red D:&nbsp;</MDTypography>
                    <MDTypography fontSize={13} fontWeight="bold" color="error">{cumulativeTotalRedDays}</MDTypography>
                  </MDBox>
                </Grid>

              </Grid>
            </MDBox>

          </MDBox>
        </Grid>
      </Grid>

      <Grid mt={3} container>
        <Grid item xs={12} md={6} lg={12} overflow='auto'>
          <MDBox p={1} bgColor="light" borderRadius={4}>
            <MonthLineChart alignment={alignment} cumulativeData={cumulativeData} monthWiseData={dateWiseData} />
          </MDBox>
        </Grid>

      </Grid>

      <Grid mt={0} container spacing={3}>
        <Grid item xs={12} md={6} lg={12} overflow='auto'>
          <MDBox p={1} borderRadius={4}>
            <TableView whichTab={alignment} cumulativeData={cumulativeData} dateWiseData={dateWiseData} />
          </MDBox>
        </Grid>

      </Grid>

    </MDBox>
  );
}