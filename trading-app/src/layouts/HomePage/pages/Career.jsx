// import Home from './Home';
// import Swap from './Swap'

import React, {useState, useContext, useEffect} from "react"
import { Link, useLocation } from "react-router-dom";
// import { Route, Routes } from 'react-router-dom'
import theme from '../utils/theme/index';
import { Box } from '@mui/material';
import { ThemeProvider } from 'styled-components';
// import About from './About';
import Navbar from '../components/Navbars/Navbar';
import Footer from '../components/Footers/Footer';
import Internship from './Internship';
import Workshops from './Workshops';
import MDBox from "../../../components/MDBox";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress } from '@mui/material';
import MDTypography from "../../../components/MDTypography";
// import JobDescription from './JobDescription';

const App = () => {
  const [campaignCode,setCampaignCode] = useState();
  const [isLoading,setIsLoading] = useState(false);
  const location = useLocation();
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };
  useEffect(()=>{
    setCampaignCode(location.search.split('=')[1]??'');
  },[]);
  return (
    <ThemeProvider theme={theme}>
    <div  style={{background:"#06070A"}}>
      <Navbar/>
    <Box sx={{bgcolor:'white'}}>
      <MDTypography sx={{color:'white'}}>Careers</MDTypography>
    </Box>
    <Box mb={10} pt={10} sx={{bgcolor:"white",display:"flex",justifyContent:"center",alignItems:"center",}}>
      <Internship campaignCode={campaignCode}/>
    </Box>

    <Footer/>
    </div>
    </ThemeProvider>
  )
}

export default App