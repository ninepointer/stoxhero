// import Home from './Home';
// import Swap from './Swap'
import { Link, useLocation } from "react-router-dom";
import React, {useState, useContext, useEffect} from "react"
// import { Route, Routes } from 'react-router-dom'
import theme from '../utils/theme/index';
import { Box } from '@mui/material';
import { ThemeProvider } from 'styled-components';
// import About from './About';
import Navbar from '../components/Navbars/Navbar';
import Footer from '../components/Footers/Footer';
import Internship from './Internship';
// import JobDescription from './JobDescription';

const App = () => {
  const [campaignCode,setCampaignCode] = useState();
  const location = useLocation();
  useEffect(()=>{
    setCampaignCode(location.search.split('=')[1]??'');
  },[]);
  return (
      <ThemeProvider theme={theme}>
    <div  style={{background:"#06070A"}}>
      <Navbar/>
    <Box mb={10} sx={{bgcolor:"white",minHeight:"60vh",display:"flex",justifyContent:"center",alignItems:"center",}}>
      <Internship campaignCode={campaignCode}/>
    </Box>

    <Footer/>
    </div>
    </ThemeProvider>
  )
}

export default App