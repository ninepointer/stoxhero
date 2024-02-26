import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress, Tooltip, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import { Link } from 'react-router-dom'
import Active from '../data/active';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import { apiUrl } from '../../../constants/constants';
import { saveAs } from 'file-saver';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import MDSnackbar from "../../../components/MDSnackbar";



export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const date = new Date();
  // const lastMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const [startDate, setStartDate] = React.useState(dayjs(date).startOf('day'));
  const [endDate, setEndDate] = useState(dayjs(date).endOf('day'));
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [successSB, setSuccessSB] = useState(false);
  let [showData, setShowData] = useState(false);


  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };

  function downloadFullList(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [['FULL NAME', 'MOBILE', 'EMAIL', 'TITLE', 'AMOUNT', 'TYPE', 'DESCRIPTION', 'DATE']]

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

    return [[...csvDataDailyPnl, ...csvDataFile]]
  }

  const handleDownload = async (nameVariable) => {
    setIsLoading(true);
    const data = await axios.get(`${apiUrl}userwallet/fulltransaction`, { withCredentials: true })
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

  async function handleShowDetails() {
    // setShowDetailClicked(!showDetailClicked);
    if (new Date(startDate) > new Date(endDate)) {
      return openErrorSB("Invalid Date Range", "Start Date is greater than End Date");
    }

    setShowData(!showData);
  }

  const openSuccessSB = (title, content) => {
    setTitle(title)
    setContent(content)
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);


  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={title}
      content={content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = (title, content) => {
    setTitle(title)
    setContent(content)
    setErrorSB(true);
  }
  const closeErrorSB = () => setErrorSB(false);

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title={title}
      content={content}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );


  return (
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto'>
      <MDBox mb={1} display="flex" justifyContent="space-between" alignItems='center' alignContent='center' textAlign='center'>
      {/* <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'> */}
        <Grid item xs={12} md={6} lg={3} display='flex' justifyContent='center' alignItems='center'>
          <MDButton
            // variant="outlined"
            color="light"
            size="small"
            sx={{height: '45px'}}
            component={Link}
            to='/tenxdashboard'
          >
            Back to Tenx Dashboard
          </MDButton>
        </Grid>

        <Grid item xs={12} md={6} lg={3} mb={.5} display='flex' justifyContent='center' alignItems='center'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={async (e) => {
                  setStartDate(prev => dayjs(e));
                }}
                sx={{ width: '100%', backgroundColor: "#ffffff", borderRadius: '5px' }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6} lg={3} mb={.5} display='flex' justifyContent='center' alignItems='center'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={async (e) => {
                  setEndDate(prev => dayjs(e));
                  // await handleShowDetails(startDate, dayjs(e))
                }}
                // disabled={period !== "Custom"}
                // sx={{ width: '100%', backgroundColor: "#ffffff", borderRadius: '5px' }}
                sx={{
                  width: '100%',
                  backgroundColor: "#ffffff",
                  borderRadius: '5px',
                  // height: '35px', // Adjust the height as needed
                  // overflow: 'hidden' // Prevent content overflow
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>

        {/* <Grid item xs={12} md={6} lg={1.5} display='flex' justifyContent='center' alignItems='center'> */}
          <MDButton
            color="light"
            size="small"
            sx={{height: '45px', width: '100px'}}
            onClick={handleShowDetails}>Show</MDButton>
        {/* </Grid> */}

        {/* <Grid item xs={12} md={6} lg={1.5} display='flex' justifyContent='center' alignItems='center'> */}
        <Tooltip title="Download Full List">
          <MDButton
            // variant="outlined"
            color="light"
            size="small"
            sx={{height: '45px', width: '100px'}}
          >
           
              {isLoading ?
                <CircularProgress color="dark" size={24} />
                :
                <DownloadIcon sx={{ color: 'dark', cursor: 'pointer' }} onClick={() => { handleDownload('transaction_full_list') }} />
              }
            
          </MDButton>
          </Tooltip>
      </MDBox>
      {/* </Grid> */}
      <TabContext value={value}>
        <MDBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="All Transactions" value="1" />

          </TabList>
        </MDBox>
        <TabPanel value="1">

          <MDBox style={{ minWidth: '100%' }}>
            <Active showData={showData} startDate={startDate} endDate={endDate} />
          </MDBox>

        </TabPanel>
      </TabContext>
      {renderErrorSB}
    </MDBox>
  );
}