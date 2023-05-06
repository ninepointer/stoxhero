import Home from './Home';
import Swap from './Swap'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import theme from '../utils/theme/index';
import { Box, Grid } from '@mui/material';
import { ThemeProvider } from 'styled-components';
import About from './About';
import Navbar from '../components/Navbars/Navbar';
import Footer from '../components/Footers/Footer';
import Internship from './Internship';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import { Link } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Navbar/>
        <Box p={5} sx={{bgcolor:theme.palette.background.default, marginTop:'65px'}}>
          <Grid container>
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
              <MDTypography fontSize={20} color="light" style={{align:'center'}}>JOB DESCRIPTION</MDTypography>
            </Grid>
            <Grid item mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='center'>
              <MDTypography fontSize={18} color="light" style={{align:'center'}}>
                Responsibilities for a Derivatives Trader
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
              <MDTypography fontSize={15} color="light">1. &nbsp;</MDTypography>
              <MDTypography fontSize={15} color="light" style={{width:'70%'}}>
                Execution of Derivative trades in various product markets according to specific Derivative Program guidelines (Nifty and BankNifty Index Options), but with an emphasis on StoxHero's equity derivative trades
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
              <MDTypography fontSize={15} color="light">2. &nbsp;</MDTypography>
              <MDTypography fontSize={15} color="light" style={{width:'70%',textDecoration:'no-wrap'}}>
                Build up strong expertise in Capital Markets dynamics, financial derivative Instruments, their valuation and trade execution aspects
              </MDTypography>
            </Grid>
            <Grid item mt={2} xs={12} md={12} lg={12} display='flex' justifyContent='center'>
              <MDButton 
                variant='outlined' 
                color='warning'
                component={Link} 
                to={{
                  pathname: `/apply`,
                }}
                >
                  Apply
              </MDButton>
            </Grid>
          </Grid>
        </Box>
        <Footer/>
      </ThemeProvider>
    </div>
  )
}

export default App