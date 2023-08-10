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
import CompanyLive from '../data/companyLive'
import CompanyMock from '../data/companyMock'
import TraderLive from "../data/traderLive";
import TraderMock from "../data/traderMock";


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
    <MDBox mb={1} display="flex" justifyContent="left">
        <MDButton 
        variant="outlined" 
        color="warning" 
        size="small"
        component={Link}
        to='/infinitydashboard'
        >
            Back to Infinity Dashboard
        </MDButton>
    </MDBox>
      <TabContext value={value}>
        <MDBox sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Company-Margin(Mock)" value="1" />
            <Tab label="Company-Margin(Live)" value="2" />
            <Tab label="Trader-Margin(Mock)" value="3" />
            <Tab label="Trader-Margin(Live)" value="4" />
          </TabList>
        </MDBox>
        <TabPanel value="1">
          {isLoading ? 
          
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <MDBox style={{minWidth:'100%'}}>
           <CompanyMock/> 
          </MDBox>
   
          }
          </TabPanel>

        <TabPanel value="2">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <CompanyLive/>
          }
        </TabPanel>

        <TabPanel value="3">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
         <TraderMock/>
          }
        </TabPanel>

        <TabPanel value="4">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <TraderLive/> 
          }
        </TabPanel>
      </TabContext>
    </MDBox>
  );
}