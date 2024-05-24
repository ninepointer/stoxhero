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
import BrokerReports from '../data/brokerReportsData'
import MDTypography from '../../../components/MDTypography';
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
    to='/brokerreportdetails'
    >
        Upload Report
    </MDButton>
    </Box>
      <BrokerReports/>
    </Box>
  );
}