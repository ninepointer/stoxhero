import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress, Divider, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import tradesicon from '../../../assets/images/tradesicon.png'
import {Link} from 'react-router-dom'
// import ActiveBatches from '../data/activeBatches';
// import CompletedBatches from '../data/completedBatches';


//data

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
    <MDBox bgColor="dark" color="light" mb={1} borderRadius={10} minHeight='auto'>
      <Grid container lg={12}>
          <Grid item xs={12} md={6} lg={12}>
              <MDBox style={{minHeight:"20vh"}} border='1px solid white' borderRadius={5} display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
                <img src={tradesicon} width={50} height={50}/>
                <MDTypography color="light" fontSize={15}>Coming Soon!</MDTypography>
              </MDBox>
          </Grid>
      </Grid>
    </MDBox>
  );
}