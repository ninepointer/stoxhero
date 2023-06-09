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
import Workshops from './Workshops';
import MDBox from "../../../components/MDBox";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress } from '@mui/material';
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
    <TabContext value={value}>
    <Box mb={10} sx={{bgcolor:"white",minHeight:"60vh",display:"flex", flexDirection: 'column', justifyContent:"center",alignItems:"center",}}>
        <MDBox sx={{ borderBottom: 1, borderColor: 'divider', marginTop:'80px', width:'100%', paddingLeft:'20%', paddingRight:'20%', paddingBottom:'0', marginBottom:'0'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Jobs" value="1" />
            <Tab label="Workshops" value="2" />
          </TabList>
        </MDBox>
        <TabPanel value="1">
          {isLoading ? 
          
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
          <Internship campaignCode={campaignCode}/>
          }
          </TabPanel>
        <TabPanel value="2">
          {isLoading ? 
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="info" />
          </MDBox>
          : 
        //   <TradingPortfolioCard/>
        <Workshops campaignCode={campaignCode}/>
          }
        </TabPanel>
    </Box>
      </TabContext>

    <Footer/>
    </div>
    </ThemeProvider>
  )
}

export default App