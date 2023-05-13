import React from 'react';
// import Box from '@mui/material/Box';
// import Tab from '@mui/material/Tab';
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';
// import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import {Link} from 'react-router-dom'

//data
import ActiveTenXSubscriptions from '../data/activeTenXSubscriptions';
// import InactiveTenXSubscriptions from '../data/inactiveTenXSubscriptions';
// import DraftTenXSubscriptions from '../data/draftTenXSubscriptions';

export default function PaymentHeader() {

  return (
   
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>
        
        <MDBox mb={2} display="flex" justifyContent="space-between" alignItems='center' alignContent='center'>
          <MDBox>
            <MDTypography color='light' fontWeight='bold'>Payment History</MDTypography>
          </MDBox>
          <MDButton 
              variant="contained" 
              color="success" 
              fontSize="small"
              component={Link}
              to='/Create Payment'
              >
                  Save Payment
          </MDButton>
        </MDBox>
        <MDBox>
          <ActiveTenXSubscriptions/>
        </MDBox>

        {/* <MDBox mb={2} mt={2} display="flex" justifyContent="space-between" alignItems='center' alignContent='center'>
          <MDBox>
            <MDTypography color='light' fontWeight='bold'>Draft Subscription(s)</MDTypography>
          </MDBox>
        </MDBox>
        <MDBox>
          <DraftTenXSubscriptions/>
        </MDBox>

        <MDBox mb={2} mt={2} display="flex" justifyContent="space-between" alignItems='center' alignContent='center'>
          <MDBox>
            <MDTypography color='light' fontWeight='bold'>Inactive Subscription(s)</MDTypography>
          </MDBox>
        </MDBox>
        <MDBox>
          <InactiveTenXSubscriptions/>
        </MDBox> */}
    </MDBox>
  );
}