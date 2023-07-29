import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress, Divider, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
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
    <MDBox bgColor="dark" color="light" mb={1} borderRadius={10} minHeight='60vH'>
      <Grid container lg={12}>
        <Grid item lg={4}>
        <MDBox bgColor='light' minHeight='100%'>
            hi
        </MDBox>
        </Grid>
        <Divider orientation='vertical' bgColor='light'/>
        <Grid item lg={7}>
            hi
        </Grid>
      </Grid>
    </MDBox>
  );
}