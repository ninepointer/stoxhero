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
import UpcomingContest from '../data/activeDailyContests';
import CompletedContest from '../data/completedDailyContests';
import DraftContest from '../data/draftDailyContests'
import OngoingDailyContest from '../data/ongoingDailyContest';


export default function LabTabs() {
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
    <MDBox mb={2} display="flex" justifyContent="space-between">
    <MDButton 
    variant="outlined" 
    color="warning" 
    size="small"
    component={Link}
    to='/contestdashboard'
    >
        Back to Contest Dashboard
    </MDButton>
    <MDButton 
    variant="outlined" 
    color="warning" 
    size="small"
    component={Link}
    to='/createContestMaster'
    >
        Create TestZone Master
    </MDButton>
    </MDBox>
      <TabContext value={value}>
        <MDBox sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Ongoing TestZone" value="1" />
            <Tab label="Upcoming TestZone" value="2" />
            <Tab label="Completed TestZone" value="3" />
            <Tab label="Draft TestZone" value="4" />
          </TabList>
        </MDBox>
        <TabPanel value="1">
          {isLoading ? 
          
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <MDBox style={{minWidth:'100%'}}>
          <OngoingDailyContest/>
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
          <UpcomingContest/>
          </MDBox>
   
          }
          </TabPanel>
        <TabPanel value="3">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <CompletedContest/>
          }
        </TabPanel>
        <TabPanel value="4">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <DraftContest/>
          }
        </TabPanel>
      </TabContext>
    </MDBox>
  );
}