import React, {useState, useEffect} from 'react'
import axios from "axios";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Link} from 'react-router-dom'
import TodaysTradingHolidays from '../data/todaysHolidays';
import UpcomingTradingHolidays from '../data/upcomingHolidays';
import PastTradingHolidays from '../data/pastHolidays';


export default function TradingHoliday() {
  const [todaysHolidayCount, setTodaysHolidayCount] = useState(0);
  const [pastHolidayCount, setPastHolidayCount] = useState(0);
  const [upcomingHolidayCount, setUpcomingHolidayCount] = useState(0);
  const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);
  const [todaysHolidays,setTodaysHolidays] = useState([]);
  const [pastHolidays,setPastHolidays] = useState([]);
  const [upcomingHolidays,setUpcomingHolidays] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"


  useEffect(()=>{
    let call1 = axios.get(`${baseUrl}api/v1/tradingholiday/today`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    let call2 = axios.get(`${baseUrl}api/v1/tradingholiday/upcoming`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
    let call3 = axios.get(`${baseUrl}api/v1/tradingholiday/past`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
    Promise.all([call1,call2,call3])
    .then(([api1Response1, api1Response2, api1Response3]) => {
      setTodaysHolidays(api1Response1.data.data)
      setTodaysHolidayCount(api1Response1.data.results)
      setUpcomingHolidays(api1Response2.data.data)
      setUpcomingHolidayCount(api1Response2.data.results)
      setPastHolidays(api1Response3.data.data)
      setPastHolidayCount(api1Response3.data.results)
    })
    .catch((error) => {
      // Handle errors here
    });
  },[todaysHolidayCount])

  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };

  const labeltoday = `Today's Holidays (${todaysHolidayCount})`
  const labelupcoming = `Upcoming Holidays (${upcomingHolidayCount})`
  const labelpast = `Past Holidays (${pastHolidayCount})`

  return (
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto'>
    <MDBox mb={1} display="flex" justifyContent="space-between">
    <MDButton 
    variant="outlined" 
    color="warning" 
    size="small"
    component={Link}
    to='/careerdashboard'
    >
        Back to Career Dashboard
    </MDButton>
    <MDButton 
    variant="contained" 
    color="success" 
    size="small"
    component={Link}
    to='/holidaydetails'
    >
        Create Holiday
    </MDButton>
    </MDBox>
      <TabContext value={value}>
        <MDBox sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label={labeltoday} value="1" />
            <Tab label={labelupcoming} value="2" />
            <Tab label={labelpast} value="3" />
          </TabList>
        </MDBox>
          <TabPanel value="1">
            {isLoading ? 
              <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
                <CircularProgress color="info" />
              </MDBox>
              : 
              <MDBox style={{minWidth:'100%'}}>
              <TodaysTradingHolidays todaysHolidays={todaysHolidays}/>
              </MDBox>
            }
          </TabPanel>
          <TabPanel value="2">
            {isLoading ? 
              <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
                <CircularProgress color="info" />
              </MDBox>
              : 
              <MDBox style={{minWidth:'100%'}}>
              <UpcomingTradingHolidays upcomingHolidays={upcomingHolidays}/>
              </MDBox>
            }
          </TabPanel>
          <TabPanel value="3">
            {isLoading ? 
              <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
                <CircularProgress color="info" />
              </MDBox>
              : 
              <MDBox style={{minWidth:'100%'}}>
                <PastTradingHolidays pastHolidays={pastHolidays}/>
              </MDBox>
            }
          </TabPanel>
      </TabContext>
    </MDBox>
  );
}