import React from 'react';
import axios from "axios";
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Link} from 'react-router-dom'
import FreeContestData from '../data/freeContestData';
import PaidContestData from '../data/paidContestData';
import FreeCollegeContestData from '../data/freeCollegeContestData';
import PaidCollegeContestData from '../data/paidCollegeContestData';
import moment from 'moment';
import { saveAs } from 'file-saver';
import { Grid } from '@mui/material';
import MDTypography from '../../../components/MDTypography';

export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };

  const [contestData, setContestData] = useState([]);

const downloadContestData = () => {
    return new Promise((resolve, reject) => {
      console.log("Download Contest Data Called");
      axios
        .get(`${baseUrl}api/v1/dailycontest/downloadcontestdata`, {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
        })
        .then((res) => {
          console.log(res.data.data);
          resolve(res.data.data); // Resolve the promise with the data
        })
        .catch((err) => {
          reject(err); // Reject the promise with the error
        });
    });
  };

const downloadPaidContestUserData = () => {
return new Promise((resolve, reject) => {
    console.log("Download Contest Data Called");
    axios
    .get(`${baseUrl}api/v1/dailycontest/downloadpaidcontestuserdata`, {
        withCredentials: true,
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        },
    })
    .then((res) => {
        console.log(res.data.data);
        resolve(res.data.data); // Resolve the promise with the data
    })
    .catch((err) => {
        reject(err); // Reject the promise with the error
    });
});
};

const downloadFreeContestUserData = () => {
return new Promise((resolve, reject) => {
    axios
    .get(`${baseUrl}api/v1/dailycontest/downloadfreecontestuserdata`, {
        withCredentials: true,
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        },
    })
    .then((res) => {
        resolve(res.data.data); // Resolve the promise with the data
    })
    .catch((err) => {
        reject(err); // Reject the promise with the error
    });
});
};

  const handleDownload = async (nameVariable) => {
    try {
      // Wait for downloadContestData() to complete and return data
      let data = [];
      let csvData = [];
      if(nameVariable === 'Daily Contest Data'){
        data = await downloadContestData();
        csvData = downloadHelper(data)
      }
      if(nameVariable === 'Paid Contest User Data'){
        data = await downloadPaidContestUserData();
        csvData = downloadHelperUser(data)
      }
      if(nameVariable === 'Free Contest User Data'){
        data = await downloadFreeContestUserData();
        csvData = downloadHelperUser(data)
      }
      // Create the CSV content
      const csvContent = csvData?.map((row) => {
        return row?.map((row1) => row1.join(',')).join('\n');
      });
  
      // Create a Blob object with the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  
      // Save the file using FileSaver.js
      saveAs(blob, `${nameVariable}.csv`);
    } catch (error) {
      console.error('Error downloading contest data:', error);
    }
  }

  function downloadHelper(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [["#","Contest Name", "Start Time", "End Time", "Contest For", "Type", "Entry", "% Payout", "Portfolio", "Max Participants", "Actual Participants", "Total Payout", "Profitable Traders", "Loss Making Traders", "POTL", "Average Payout", "Contest Status"]]
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem, index) => {

        return [
          index+1,
          elem?.contestName,
          moment.utc(elem?.contestStartTime).utcOffset('+05:30').format('DD-MMM HH:mm'),
          moment.utc(elem?.contestEndTime).utcOffset('+05:30').format('DD-MMM HH:mm'),
          elem?.contestFor,
          elem?.type,
          elem?.entryFee?.toFixed(0),
          elem?.payoutPercentage?.toFixed(2),
          elem?.portfolioValue?.toFixed(0),
          elem?.maxParticipants?.toFixed(0),
          elem?.participantsCount?.toFixed(0),
          elem?.totalPayout?.toFixed(0),
          elem?.proftitableTraders?.toFixed(0),
          elem?.lossMakingTraders?.toFixed(0),
          elem?.percentageLossMakingTraders?.toFixed(0),
          elem?.averagePayout?.toFixed(0),
          elem?.contestStatus,
        ]
      })
    }

    return [[...csvDataDailyPnl, ...csvDataFile]]
  }

  function downloadHelperUser(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [["#","Full Name", "Joining Date", "Email", "Mobile", "TestZone Participated", "TestZone Won", "Strike Rate(%)", "Revenue", "Payout", "Days Since Last TestZone", "Last TestZone Date"]]
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem, index) => {

        return [
          index+1,
          elem?.first_name + ' ' + elem?.last_name,
          moment.utc(elem?.joining_date).utcOffset('+05:30').format('DD-MMM-YY'),
          elem?.email,
          elem?.mobile,
          elem?.count?.toFixed(0),
          elem?.wins?.toFixed(0),
          elem?.strikeRate?.toFixed(0),
          elem?.revenue?.toFixed(0),
          elem?.payout?.toFixed(0),
          elem?.daysSinceLastContest?.toFixed(0),
          moment.utc(elem?.lastContestDate).utcOffset('+05:30').format('DD-MMM-YY'),
        ]
      })
    }

    return [[...csvDataDailyPnl, ...csvDataFile]]
  }


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
        Back to TestZone Dashboard
    </MDButton>
    
    <MDButton 
    variant="outlined" 
    color="warning" 
    size="small"
    onClick={() => { handleDownload(`Daily Contest Data`) }}
    >
        Download TestZone Data
    </MDButton>
    
    <MDButton 
    variant="outlined" 
    color="warning" 
    size="small"
    onClick={() => { handleDownload(`Paid Contest User Data`) }}
    >
        Download Paid User Data
    </MDButton>
    
    <MDButton 
    variant="outlined" 
    color="warning" 
    size="small"
    onClick={() => { handleDownload(`Free Contest User Data`) }}
    >
        Download Free User Data
    </MDButton>
    
    </MDBox>
    {/* <MDBox mb={2} bgColor='light' borderRadius={5} display="flex" justifyContent="space-between">
        <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
          <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center'>
            <MDTypography fontSize={15} fontWeight='bold'>Paid Users(Lifetime)</MDTypography>
          </Grid>
          <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center'>
            <MDTypography fontSize={15} fontWeight='bold'>Revenue Paid Users(Lifetime)</MDTypography>
          </Grid>
          <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center'>
            <MDTypography fontSize={15} fontWeight='bold'>Payout Paid Users(Lifetime)</MDTypography>
          </Grid>
          <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center'>
            <MDTypography fontSize={15} fontWeight='bold'>Paid Users(Lifetime)</MDTypography>
          </Grid>
          <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center'>
            <MDTypography fontSize={15} fontWeight='bold'>Revenue Paid Users(Lifetime)</MDTypography>
          </Grid>
          <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center'>
            <MDTypography fontSize={15} fontWeight='bold'>Payout Paid Users(Lifetime)</MDTypography>
          </Grid>
        </Grid>
    </MDBox> */}
      <TabContext value={value}>
        <MDBox sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Paid TestZone Data" value="1" />
            <Tab label="Free TestZone Data" value="2" />
            <Tab label="Free College TestZone" value="3" />
            <Tab label="Paid College TestZone" value="4" />
          </TabList>
        </MDBox>
        <TabPanel value="1">
          {isLoading ? 
          
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <MDBox style={{minWidth:'100%'}}>
            <PaidContestData/>
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
            <FreeContestData/>
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
             <FreeCollegeContestData/>
          </MDBox>
          }
        </TabPanel>
        <TabPanel value="4">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <MDBox style={{minWidth:'100%'}}>
            <PaidCollegeContestData/>
          </MDBox>
          }
        </TabPanel>
      </TabContext>
    </MDBox>
  );
}