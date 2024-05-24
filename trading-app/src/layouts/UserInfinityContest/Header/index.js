import React, {useState, memo} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import {Grid} from '@mui/material';

//data
import UpcomingContest from '../data/UserContestCard'
import MyContestCard from '../data/MyContestCard'
import MyContestHistoryCard from '../data/MyContestHistoryCard'
import { useNavigate } from 'react-router-dom';

function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };

  function history(){
    navigate("/battlestreet/history");
  }

  return (
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10}>

        <Grid container >
              <Grid item xs={12} md={6} lg={12} mb={2}>
                <MDTypography mb={2} color="light" fontWeight="bold" style={{textDecoration: "underline"}}>Upcoming Battles</MDTypography>
                <UpcomingContest/>
              </Grid>
        
              <Grid item xs={12} md={6} lg={12}>
                <MDTypography mb={2} color="light" fontWeight="bold" style={{textDecoration: "underline"}}>My Battles</MDTypography>
                <MyContestCard/>
              </Grid>
        </Grid>

    </MDBox>
  );
}
export default memo(LabTabs);