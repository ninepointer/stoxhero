import ReactGA from "react-ga"
import React, { useEffect, useContext, useState } from "react";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress, TextField, MenuItem } from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import { Link } from 'react-router-dom'
// import ActiveBatches from '../data/activeBatches';
// import CompletedBatches from '../data/completedBatches';
// import InactiveBatches from '../data/inactiveBatches'
import TodayOrder from '../data/todaysOrders'
import AllOrder from '../data/allOrders'
import { withStyles } from '@mui/styles';


export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [select, setSelected] = useState('MIS');

  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };

  const CustomTextField = withStyles({
    root: {
      '& .MuiInputBase-input': {
        color: '#ffffff', // Replace 'red' with your desired text color
        textAlign: 'center',
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: '#ffffff', // Replace 'red' with your desired text color
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#ffffff', // Replace 'red' with your desired text color
      },
    },
  })(TextField);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
  }, []);

  return (
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto'>
      <MDBox mb={1} display="flex" justifyContent="left">
        <MDButton
          variant="outlined"
          color="warning"
          size="small"
          component={Link}
          to='/stockdashboard'
        >
          Back to Stock Dashboard
        </MDButton>
      </MDBox>
      <MDBox sx={{ display: 'flex', justifyContent: 'flext-start', alignContent: 'center', gap:1, alignItems: 'center' }}>
        <MDTypography fontSize={15} color='light'>Select Product : </MDTypography>

        <CustomTextField
          select
          label=""
          value={select}
          minHeight="4em"
          placeholder="Select TestZone"
          variant="outlined"
          sx={{ width: "150px", marginBottom: "5px" }}
          onChange={(e) => { setSelected(e.target.value) }}
          InputLabelProps={{
            style: { color: '#ffffff' },
          }}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: { width: '150px' }, // Replace '200px' with your desired width
              },
            },
          }}
        >
          <MenuItem value={"MIS"} minHeight="4em">
            {"MIS"}
          </MenuItem>
          <MenuItem value={"CNC"} minHeight="4em">
            {"CNC"}
          </MenuItem>
        </CustomTextField>
      </MDBox>
      <TabContext value={value}>
        <MDBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Today's Orders" value="1" />
            <Tab label="All Orders" value="2" />
          </TabList>
        </MDBox>
        <TabPanel value="1">
          {isLoading ?

            <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
              <CircularProgress color="info" />
            </MDBox>
            :
            <MDBox style={{ minWidth: '100%' }}>
              <TodayOrder select={select} />
            </MDBox>

          }
        </TabPanel>
        <TabPanel value="2">
          {isLoading ?
            <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
              <CircularProgress color="info" />
            </MDBox>
            :
            <AllOrder select={select} />
          }
        </TabPanel>
      </TabContext>
    </MDBox>
  );
}