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
import ContestPortfolioCard from '../data/contestPortfolioCard'
import TradingPortfolioCard from '../data/tradingPortfolioCard'
import InactivePortfolioCard from '../data/inactivePortfolioCard'
import TenXPortfolioCard from '../data/tenXPortfolioCard';
import InternshipPortfolioCard from '../data/internshipPortfolioCard';

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
    <Box mb={1} display="flex" justifyContent="right">
    <MDButton 
    variant="contained" 
    color="success" 
    fontSize="small"
    component={Link}
    to='/createPortfolio'
    >
        CreatePortfolio
    </MDButton>
    </Box>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Virtual Trading Portfolios" value="1" />
            <Tab label="TenX Portfolios" value="2" />
            <Tab label="Internship Portfolios" value="3" />
            <Tab label="Inactive Portfolios" value="4" />
            <Tab label="Battle Portfolios" value="5" />
          </TabList>
        </Box>
        <TabPanel value="1">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <TradingPortfolioCard/>
          }
        </TabPanel>
        <TabPanel value="2">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <TenXPortfolioCard/>
          }
        </TabPanel>
        <TabPanel value="3">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <InternshipPortfolioCard/>
          }
        </TabPanel>
        <TabPanel value="4">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <InactivePortfolioCard/>
          }
        </TabPanel>
        <TabPanel value="5">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <ContestPortfolioCard/>
          }
          </TabPanel>
      </TabContext>
    </Box>
  );
}