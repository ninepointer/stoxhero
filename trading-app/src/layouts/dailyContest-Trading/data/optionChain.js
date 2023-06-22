import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress } from '@mui/material';
import MDBox from '../../../components/MDBox';
// import MDButton from '../../../components/MDButton';
// import {Link} from 'react-router-dom'
// import ActiveBatches from '../data/activeBatches';
// import CompletedBatches from '../data/completedBatches';
// import InactiveBatches from '../data/inactiveBatches'
// import CompanyLive from '../data/companyLive'
// import CompanyMock from '../data/companyMock'
// import TraderLive from "../data/traderLive";
import OptionChainTable from "./optionChainTable";
import MDButton from '../../../components/MDButton';
import {useLocation} from "react-router-dom";
import CircularJSON from 'circular-json';


export default function OptionChain({socket, setShowOption, showOption}) {
  const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);
  // const [showChain, setShowChain] = useState(false);
  const location = useLocation();
  // const socketData = location.state.data;
  // const socket = CircularJSON.parse(socketData);
  // console.log("location", location, socket)
  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };

  return (
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto'>
    {/* <MDBox mb={1} display="flex" justifyContent="left">
        <MDButton 
        variant="outlined" 
        color="warning" 
        size="small"
        component={Link}
        to='/infinitydashboard'
        >
            Back to Infinity Dashboard
        </MDButton>
    </MDBox> */}
      <TabContext value={value}>
        <MDBox sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Option Chain" value="1" />
            {/* <Tab label="Company-Live" value="2" />
            <Tab label="Trader-Mock" value="3" />
            <Tab label="Trader-Live" value="4" /> */}
          </TabList>
        </MDBox>
        {/* <TabPanel value="1">
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
        </TabPanel> */}

        <TabPanel value="1">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          :
          showOption ?
          <OptionChainTable socket={socket} setShowChain={setShowOption}/> 
          :
          <MDButton onClick={()=>{setShowOption(true)}}>Option Chain</MDButton>
          }
          {/* showChain, setShowChain */}
        </TabPanel>
      </TabContext>
    </MDBox>
  );
}