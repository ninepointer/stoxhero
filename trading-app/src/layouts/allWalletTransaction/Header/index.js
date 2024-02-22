import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress, Tooltip } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Link} from 'react-router-dom'
import Active from '../data/active';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import { apiUrl } from '../../../constants/constants';
import { saveAs } from 'file-saver';



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

  function downloadFullList(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [['FULL NAME','MOBILE', 'EMAIL', 'TITLE', 'AMOUNT', 'TYPE', 'DESCRIPTION', 'DATE']]
  
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem) => {
  
        return [
        `${elem?.first_name} ${elem?.last_name}`,
        elem?.mobile,
        elem?.email,
        elem?.title,
        elem?.amount,
        elem?.type,
        elem?.description,
        elem?.date,
    ]
      })
    }
  
    return [[...csvDataDailyPnl,...csvDataFile]]
}

  const handleDownload = async (nameVariable) => {
    setIsLoading(true);
    const data = await axios.get(`${apiUrl}userwallet/fulltransaction`, {withCredentials: true})
    const csvData = downloadFullList(data?.data?.data);

    // Create the CSV content
    const csvContent = csvData?.map((row) => {
        return row?.map((row1) => row1.join(',')).join('\n');
    });

    setIsLoading(false);
    // Create a Blob object with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

    // Save the file using FileSaver.js
    saveAs(blob, `${nameVariable}.csv`);
}

  return (
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto'>
      <MDBox mb={2} display="flex" justifyContent="space-between">
        <MDButton
          // variant="outlined"
          color="light"
          size="small"
          component={Link}
          to='/tenxdashboard'
        >
          Back to Tenx Dashboard
        </MDButton>

        <MDButton
          // variant="outlined"
          color="light"
          size="small"
        >
          <Tooltip title="Download Full List">
            {isLoading ?
              <CircularProgress color="dark" size={24} />
              :
              <DownloadIcon sx={{ color: 'dark', cursor: 'pointer' }} onClick={() => { handleDownload('transaction_full_list') }} />
            }
          </Tooltip>
        </MDButton>
      </MDBox>
      <TabContext value={value}>
        <MDBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="All Transactions" value="1" />

          </TabList>
        </MDBox>
        <TabPanel value="1">
        
            <MDBox style={{ minWidth: '100%' }}>
              <Active />
            </MDBox>
          
        </TabPanel>
      </TabContext>
    </MDBox>
  );
}