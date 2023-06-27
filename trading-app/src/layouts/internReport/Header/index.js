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
  const dailPnl = "Daily P&L";
  const traderWisePnl = "Trader Wise P&L";
  const [alignment, setAlignment] = React.useState(dailPnl);
  const [textColor,setTextColor] = React.useState('info');
  const date = new Date();
  const lastMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  lastMonth.setDate(date.getDate());
  const [startDate,setStartDate] = React.useState(dayjs(lastMonth));
  const [endDate,setEndDate] = React.useState(dayjs(date));
  const [dateWiseData, setDateWiseData] = useState([]);
  const [batches,setBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState();
  const [userData, setUserData] = useState([]);
  const [dates, setDate] = useState({
    startDate: "",
    endDate: ""
  });

  useEffect(()=>{
    axios.get(`${apiUrl}internbatch`, {withCredentials: true})
    .then((res)=>{
      setBatches(res.data.data);
      setSelectedBatches(res.data.data[0]?._id)
      dates.startDate = res.data.data[0]?.batchStartDate;
      dates.endDate = res.data.data[0]?.batchEndDate;
      setDate(dates);
    }).catch(e => console.log(e));
  },[])

  let endpoint ;
  if(alignment === dailPnl){
    endpoint = `internship/companypnlreport/${selectedBatches}`;
  } else if(alignment === traderWisePnl){
    endpoint = `internship/traderwisecompanypnlreport/${selectedBatches}`;
  } 

  const handleChangeView = (event, newAlignment) => {
    setTextColor("info");
    setAlignment(newAlignment);
  };


  useEffect(()=>{
    handleShowDetails();
  },[endpoint, selectedBatches])

  const handleShowDetails = async() => {
    const from = startDate.format('YYYY-MM-DD');
    const to = endDate.format('YYYY-MM-DD');
    if (selectedBatches && from && to) {
      const res = await axios.get(`${apiUrl}${endpoint}/${from}/${to}`, {withCredentials: true});
      // console.log(res.data.data);
      setDateWiseData(prev=>res.data.data);
      console.log("users", res.data)
      setUserData(prev=>res.data.userData);
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

  return (
   
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>
    
    <MDBox mb={2} style={{border:'1px solid white', borderRadius:5}} display="flex" justifyContent="space-between">
      <MDTypography color="light" fontSize={15} fontWeight="bold" p={1} alignItem="center">Intern Report</MDTypography>
        <MDBox sx={{ display: 'flex', alignItems: 'center'}}>
          <TextField
            select
            label=""
            value={batches[0]?.batchName}
            minHeight="4em"
            placeholder="Select subscription" 
            variant="outlined"
            InputLabelProps={{
              style: {
                color: 'light'
              } }}
              InputProps={{
                style: {
                  input: {
                    color: 'light' // Change the color value to the desired text color
                  }
                }
              }}
            sx={{  width: "200px" }}
            onChange={(e) => { setSelectedBatches(batches.filter((item) => item.batchName == e.target.value)[0]._id) }}
          >
            {batches?.map((option) => (
              <MenuItem key={option.batchName} value={option.batchName} minHeight="4em">
                {option.batchName}
              </MenuItem>
            ))}
          </TextField>
          <ToggleButtonGroup
      color={textColor}
      style={{backgroundColor:"white",margin:3}}
      value={alignment}
      size='small'
      exclusive
      onChange={handleChangeView}
      aria-label="Platform"
      >
        <ToggleButton style={{paddingLeft:14,paddingRight:14,fontSize:10,fontWeight:700}} value={dailPnl}> {dailPnl}</ToggleButton>
        <ToggleButton style={{paddingLeft:14,paddingRight:14,fontSize:10,fontWeight:700}} value={traderWisePnl}>{traderWisePnl}</ToggleButton>
      </ToggleButtonGroup>
        </MDBox>

    </MDBox>
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
            <MonthLineChart traderType={alignment} monthWiseData={dateWiseData} />
          </MDBox>
        </Grid>

      </Grid>

      <Grid mt={0} container spacing={3}>
        <Grid item xs={12} md={6} lg={12} overflow='auto'>
          <MDBox p={1}  borderRadius={4}>
            {(alignment === dailPnl || userData) &&
            <TableView whichTab={alignment} dateWiseData={dateWiseData} userData={userData} batches={batches} dates={dates}/>}
          </MDBox>
        </Grid>

      </Grid>

    </MDBox>
  );
}