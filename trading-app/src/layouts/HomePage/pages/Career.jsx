import Home from './Home';
import Swap from './Swap'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import theme from '../utils/theme/index';
import { Box } from '@mui/material';
import { ThemeProvider } from 'styled-components';
import About from './About';
import Navbar from '../components/Navbars/Navbar';
import Footer from '../components/Footers/Footer';
import Internship from './Internship';

const App = () => {
  return (
    <div>
    <ThemeProvider theme={theme}>
    <Navbar/>
    <Box sx={{bgcolor:theme.palette.background.default, marginTop:'65px'}}>
      <Internship/>
    </Box>
    <Footer/>
    </ThemeProvider>
    </div>
  )
}

export default App