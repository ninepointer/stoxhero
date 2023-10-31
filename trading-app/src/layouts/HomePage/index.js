import Home from './pages/Home';
import Swap from './pages/Swap'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import theme from './utils/theme/index';
import { ThemeProvider } from 'styled-components';
import About from './pages/About';
import Navbar from './components/Navbars/Navbar';
import Footer from './components/Footers/Footer';
import Careers from './pages/Career';
import { Box } from '@mui/material';
import Contact from './pages/Contact';
import MDBox from '../../components/MDBox';

const App = () => {
  console.log(theme)
  console.log(theme.background)
  console.log(theme.background.default)
  return (
    <MDBox height='auto'>
      <ThemeProvider theme={theme}>
        <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/swap" element={<Swap/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/careers" element={<Careers/>}/>
        <Route path="/contact" element={<Contact/>} />
      </Routes>
      <Footer/>
      </ThemeProvider>
    </MDBox>
  )
}

export default App