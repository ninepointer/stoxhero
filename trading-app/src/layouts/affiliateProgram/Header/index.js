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
// import ActiveBatches from '../data/activeBatches';
// import CompletedBatches from '../data/completedBatches';
// import InactiveBatches from '../data/inactiveBatches'
import ActiveAffiliatePrograms from '../data/ActiveAffiliatePrograms'
import DraftAffiliatePrograms from '../data/DraftAffiliatePrograms'
import ExpiredAffiliatePrograms from '../data/ExpiredAffiliatePrograms'
import InactiveAffiliatePrograms from '../data/InactiveAffiliatePrograms'

//data

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
        to='/'
        >
            Back to Home
        </MDButton>
        <MDButton 
        variant="outlined" 
        color="warning" 
        size="small"
        component={Link}
        to='/affiliateprogramdetails'
        >
            Create Affiliate Program
        </MDButton>
    </MDBox>
      <TabContext value={value}>
        <MDBox sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Active Affiliate Programs" value="1" />
            <Tab label="Inactive Affiliate Programs" value="2" />
            <Tab label="Draft Affiliate Programs" value="3" />
            <Tab label="Expired Affiliate Programs" value="4" />
          </TabList>
        </MDBox>
        <TabPanel value="1">
          {isLoading ? 
          
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <MDBox style={{minWidth:'100%'}}>
            <ActiveAffiliatePrograms />
          </MDBox>
   
          }
          </TabPanel>
        <TabPanel value="2">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <InactiveAffiliatePrograms/>
          }
        </TabPanel>
        <TabPanel value="3">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <DraftAffiliatePrograms/>
          }
        </TabPanel>
        <TabPanel value="4">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <ExpiredAffiliatePrograms/>
          }
        </TabPanel>
      </TabContext>
    </MDBox>
  );
}