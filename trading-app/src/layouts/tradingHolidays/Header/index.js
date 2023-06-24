import React, {useState} from 'react';
import Box from '@mui/material/Box';
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
// import InactiveBatches from '../data/inactiveBatches'

//data

export default function TradingHoliday() {
  const [todaysHolidayCount, setTodaysHolidayCount] = useState(0);
  const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };

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
            <Tab label="Today's Holidays" value="1" />
            <Tab label="Upcoming Holidays" value="2" />
            <Tab label="Previous Holidays" value="3" />
          </TabList>
        </MDBox>
        <TabPanel value="1">
          {isLoading ? 
          
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <MDBox style={{minWidth:'100%'}}>
          <TodaysTradingHolidays todaysHolidayCount={todaysHolidayCount} setTodaysHolidayCount={setTodaysHolidayCount}/>
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
          <UpcomingTradingHolidays/>
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
            <PastTradingHolidays/>
          </MDBox>
          }
        </TabPanel>
      </TabContext>
    </MDBox>
  );
}