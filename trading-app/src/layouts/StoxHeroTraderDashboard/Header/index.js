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
import Carousel from '../data/carousel'
import Performance from '../data/performance'
import Summary from '../data/summary'
import OptionChain from '../data/optionChain';
import VirtualTrading from '../data/virtualTrading'


export default function Dashboard() {

  return (
   
    <MDBox bgColor="light" color="light" mt={2} mb={1} borderRadius={10} minHeight='auto'>
        <Grid container spacing={1} display='flex' justifyContent='center' flexDirection='row' lg={12} style={{ height: '100%'}}>
        <Grid item lg={8.5} style={{ display: 'flex', height: '100%' }}>
          <Grid container spacing={1} lg={12} style={{ height: '100%' }}>
            <Grid item xs={12} md={6} lg={12} style={{ height: '100%' }}>
              <Summary style={{ height: '100%' }}/>
            </Grid>
            <Grid item xs={12} md={6} lg={12} style={{ height: '100%' }}>
              <Performance/>
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item lg={3.5} style={{ display: 'flex', height: '100%', width: '100%' }}>
          <Grid container spacing={1} lg={12} style={{ height: '100%', width: '100%'}}>
            <Grid item xs={12} md={6} lg={12} style={{ height: '100%'}}>
              <OptionChain style={{ height: '100%', width:'100%' }}/>
            </Grid>
            <Grid item xs={12} md={6} lg={12} style={{ height: '100%'}}>
              <OptionChain style={{ height: '100%', width:'100%' }}/>
            </Grid>
            <Grid item xs={12} md={6} lg={12} style={{ height: '100%'}}>
              <OptionChain style={{ height: '100%', width:'100%' }}/>
            </Grid>
          </Grid>
        </Grid>

      </Grid>



    </MDBox>
  );
}