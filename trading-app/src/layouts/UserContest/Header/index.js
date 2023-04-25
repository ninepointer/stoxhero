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
    navigate("/battleground/history");
  }

  return (
    // <Box mt={2} sx={{ width: '100%', typography: 'body1' }}>
    //   <TabContext value={value}>
    //     <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
    //       <TabList onChange={handleChange} aria-label="lab API tabs example">
    //         <Tab label="Upcoming Battles" value="1" />
    //         <Tab label="My Battles" value="2" />
    //         <Tab label="History" value="3" onClick={history}/>
    //       </TabList>
    //     </Box>
    //     <TabPanel value="1">
    //       {isLoading ? 
    //       <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
    //         <CircularProgress color="info" />
    //       </MDBox>
    //       : 
    //       <UpcomingContest />
    //       }
    //     </TabPanel>
    //     <TabPanel value="2">
    //       {isLoading ? 
    //       <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
    //         <CircularProgress color="info" />
    //       </MDBox>
    //       : 
    //       <MyContestCard />
    //       }
    //     </TabPanel>
    //     {/* <TabPanel value="3">
    //       {isLoading ? 
    //       <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
    //         <CircularProgress color="info" />
    //       </MDBox>
    //       : 

    //       navigate("/battleground/history")
    //       }
    //     </TabPanel> */}
    //   </TabContext>
    // </Box>
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