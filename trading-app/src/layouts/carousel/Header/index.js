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
import LiveCarousels from '../data/liveCarousels'
import UpcomingCarousels from '../data/upcomingCarousels'
import InfinityLiveCarousels from '../data/infinityLiveCarousels'
import StoxHeroLiveCarousels from '../data/stoxHeroLiveCarousels'
import InfinityUpcomingCarousels from '../data/infinityUpcomingCarousels'
import StoxHeroUpcomingCarousels from '../data/stoxHeroUpcomingCarousels'
import DraftCarousels from '../data/draftCarousels'
import MDTypography from '../../../components/MDTypography';
import PastCarousels from '../data/pastCarousals';
// import TradingPortfolioCard from '../data/tradingPortfolioCard'
// import InactivePortfolioCard from '../data/inactivePortfolioCard'

//data
// import UpcomingContest from '../data/UserContestCard'

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
    <Box sx={{ width: '100%', typography: 'body1' }}>
    <Box mb={1} mt={1} display="flex" justifyContent="right">
    <MDButton 
    variant="contained" 
    color="success" 
    fontSize="small"
    component={Link}
    to='/carouseldetails'
    >
        Create Carousel
    </MDButton>
    </Box>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="StoxHero Carousels" value="1" />
            <Tab label="Infinity Carousels" value="2" />
            <Tab label="All Carousels" value="3" />
            <Tab label="Draft Carousels" value="4" />
            <Tab label="Past Carousels" value="5" />
          </TabList>
        </Box>
        <TabPanel value="1">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <MDBox>
            <MDBox>
              <StoxHeroLiveCarousels/> 
            </MDBox>
            <MDBox>
              <StoxHeroUpcomingCarousels/> 
            </MDBox>
          </MDBox>
          }
          </TabPanel>
        <TabPanel value="2">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <MDBox>
            <MDBox>
              <InfinityLiveCarousels/> 
            </MDBox>
            <MDBox>
              <InfinityUpcomingCarousels/> 
            </MDBox>
          </MDBox>
          }
        </TabPanel>
        <TabPanel value="3">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <MDBox>
            <MDBox>
              <LiveCarousels/> 
            </MDBox>
            <MDBox>
              <UpcomingCarousels/> 
            </MDBox>
          </MDBox>
          }
        </TabPanel>
        <TabPanel value="4">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
            <MDBox>
              <DraftCarousels/> 
            </MDBox>
          }
        </TabPanel>

        <TabPanel value="5">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
            <MDBox>
              <PastCarousels/> 
            </MDBox>
          }
        </TabPanel>
      </TabContext>
    </Box>
  );
}