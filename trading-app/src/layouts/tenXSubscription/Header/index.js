import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import {Link} from 'react-router-dom'

export default function SubscriptionList() {

  return (
   
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>
        <MDButton 
            variant="contained" 
            color="success" 
            fontSize="small"
            component={Link}
            to='/TenX Subscription Details'
            >
                Create TenX Subscription
        </MDButton>
    </MDBox>
  );
}