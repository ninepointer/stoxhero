import React, {useState} from 'react';
// import Box from '@mui/material/Box';
// import Tab from '@mui/material/Tab';
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';
// import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import Grid from "@mui/material/Grid";
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import {Link} from 'react-router-dom'
import Carousel from '../data/carouselItems'
import Performance from '../data/performance'
import Summary from '../data/summary'
import OptionChain from '../data/optionChain';
import VirtualTrading from '../data/virtualTrading'
import ten1 from '../../../assets/images/abs1.png'
import ten2 from '../../../assets/images/abs2.png'
import ten3 from '../../../assets/images/abs3.png'
import ten4 from '../../../assets/images/abs4.png'



export default function Dashboard() {

  return (
   
    <MDBox bgColor="light" color="light" mt={2} mb={1} borderRadius={10} minHeight='auto'>
  
          <Grid container spacing={1} mb={2} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={6} lg={12}>
              <Carousel items={[ten1, ten2, ten3, ten4]}/>
            </Grid>
          </Grid>
           
          <Grid container spacing={1} mt={1} lg={12} style={{ height: '100%' }}>
            <Grid item xs={12} md={6} lg={12} style={{ height: '100%' }}>
              <Summary style={{ height: '100%' }}/>
            </Grid>
            <Grid item xs={12} md={6} lg={12} style={{ height: '100%' }}>
              <Performance/>
            </Grid>
          </Grid>

    </MDBox>
  );
}