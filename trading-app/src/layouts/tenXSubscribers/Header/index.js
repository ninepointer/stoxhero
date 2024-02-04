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
import TenXPurchaseToday from '../data/tenXPurchaseToday';
import TenXExpiredToday from '../data/tenXExpiredToday';
import TenXExpiredYesterday from '../data/tenXExpiredYesterday';
import LiveTenXSubscribers from '../data/liveTenXSubscribers';
import ExpiredTenXSubscribers from '../data/expiredTenXSubscribers';
import moment from 'moment';
import { saveAs } from 'file-saver';
import { Grid } from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import TenXPurchasedYesterday from '../data/tenXPurchaseYesterday';

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

const downloadLiveTenXSubscribersData = () => {
return new Promise((resolve, reject) => {
    axios
    .get(`${baseUrl}api/v1/tenx/downloadlivetenxsubscribers`, {
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

const downloadExpiredTenXSubscribersData = () => {
return new Promise((resolve, reject) => {
    axios
    .get(`${baseUrl}api/v1/tenx/downloadexpiredtenxsubscribers`, {
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
      if(nameVariable === 'Live Subscribers'){
        data = await downloadLiveTenXSubscribersData();
        csvData = downloadHelper(data)
      }
      if(nameVariable === 'Expired Subscribers'){
        data = await downloadExpiredTenXSubscribersData();
        csvData = downloadHelper(data)
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
      console.error('Error downloading subscription data:', error);
    }
  }

  function downloadHelper(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [["#","Subsriber Name", "Email", "Mobile", "Signup Method", "Purchase Date", "TenX Plan", "Purchase Value", "Portfolio", "Expiry Date", "Payout", "Actual Price", "Discounted Price"]]
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem, index) => {

        return [
          index+1,
          elem?.first_name + ' ' + elem?.last_name,
          elem?.email,
          elem?.mobile,
          elem?.creationProcess ? elem?.creationProcess : '-',
          moment.utc(elem?.purchase_date).utcOffset('+05:30').format('DD-MMM HH:mm'),
          elem?.plan_name,
          elem?.purchaseValue,
          elem?.portfolio,
          elem?.expiry_date ? moment.utc(elem?.expiry_date).utcOffset('+05:30').format('DD-MMM HH:mm') : moment.utc(elem?.expiry_date).utcOffset('+05:30').add(elem?.expiryDays,'days').format('DD-MMM HH:mm'),
          elem?.payout ? elem?.payout : '-',
          elem?.plan_actual_price,
          elem?.plan_discounted_price
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
    to='/tenxdashboard'
    >
        Back to TenX Dashboard
    </MDButton>
    
    <MDButton 
    variant="outlined" 
    color="warning" 
    size="small"
    onClick={() => { handleDownload(`Live Subscribers`) }}
    >
        Download Live Subscriptions
    </MDButton>
    
    <MDButton 
    variant="outlined" 
    color="warning" 
    size="small"
    onClick={() => { handleDownload(`Expired Subscribers`) }}
    >
        Download Expired Subscriptions
    </MDButton>
    
    </MDBox>
      <TabContext value={value}>
        <MDBox sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="TenX Subscriptions Purchased (T/Y)" value="1" />
            <Tab label="All Live TenX Subscriptions" value="2" />
            <Tab label="All Expired TenX Subscriptions" value="3" />
            <Tab label="TenX Expired (T/Y)" value="4" />
          </TabList>
        </MDBox>
        <TabPanel value="1">
          {isLoading ? 
          
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <MDBox>
            <MDBox style={{minWidth:'100%'}}>
              <MDBox mb={1} display='flex' justifyContent='center'>
                <MDTypography fontSize={15} fontWeight='bold' color='light'>TenX Purchased Today</MDTypography>
              </MDBox>
              <MDBox>
                <TenXPurchaseToday/>
              </MDBox>
            </MDBox>
            <MDBox style={{minWidth:'100%'}}>
              <MDBox mb={1} display='flex' justifyContent='center'>
                <MDTypography fontSize={15} fontWeight='bold' color='light'>TenX Purchased Yesterday</MDTypography>
              </MDBox>
              <MDBox>
                <TenXPurchasedYesterday/>
              </MDBox>
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
          <MDBox style={{minWidth:'100%'}}>
            <LiveTenXSubscribers/>
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
            <ExpiredTenXSubscribers/>
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
            <MDBox style={{minWidth:'100%'}}>
              <MDBox mb={1} display='flex' justifyContent='center'>
                <MDTypography fontSize={15} fontWeight='bold' color='light'>TenX Expired Today</MDTypography>
              </MDBox>
              <MDBox>
                <TenXExpiredToday/>
              </MDBox>
            </MDBox>
            <MDBox style={{minWidth:'100%'}}>
              <MDBox mb={1} display='flex' justifyContent='center'>
                <MDTypography fontSize={15} fontWeight='bold' color='light'>TenX Expired Yesterday</MDTypography>
              </MDBox>
              <MDBox>
                <TenXExpiredYesterday/>
              </MDBox>
            </MDBox>
          </MDBox>
          }
          </TabPanel>
      </TabContext>
    </MDBox>
  );
}