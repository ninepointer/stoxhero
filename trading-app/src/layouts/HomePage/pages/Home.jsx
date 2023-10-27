import React, { useEffect, useState } from 'react'
import ReactGA from "react-ga"
import theme from '../utils/theme/index';
import Navbar from '../components/Navbars/Navbar'
import Footer from '../components/Footers/Footer'
import Section1 from '../containers/Section1'
import Section2 from '../containers/Section2'
import Section3 from '../containers/Section3'
import Section4 from '../containers/Section4'
import Section5 from '../containers/Section5'
import Section6 from '../containers/Section6'
import Section7 from '../containers/Section7'
import Section8 from '../containers/Section8'
import Section9 from '../containers/Section9'
import Section10 from '../containers/Section10'
import Section11 from '../containers/Section11'
import { Box } from '@mui/material'
import { ThemeProvider } from 'styled-components';
import axios from 'axios';
import { apiUrl } from '../../../constants/constants';

const Home = () => {
  const [data, setData] = useState();
  console.log('home page');
  const getMetrics = async()=>{
    const res = await axios.get(`${apiUrl}appmetrics`);
    setData(res.data.data);
  }
  useEffect(()=>{
    getMetrics();
    ReactGA.pageview(window.location.pathname)
  },[])

  return (
    <div>
      <ThemeProvider theme={theme}>
      <Navbar/>
      <Section1/>
      <Section2 data ={data}/>
      <Box sx={{ height:{sx:"4000px"},width:"100%", bgcolor:"#06070A", position: "relative" }}>
      
      <Section4/>
      <Section6/>
      <Section7/>
      {/* <Section5/>
      <Section8/>
      <Section9/>
      <Section10/>
      <Section11/> */}
      
      {/* Footer */}
      <Footer/>
      </Box>
      </ThemeProvider>

    </div>
  )
}

export default Home