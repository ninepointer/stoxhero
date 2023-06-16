import React, {useState, useContext, useEffect} from "react"
import { Link, useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import theme from '../utils/theme/index';
import { Box } from '@mui/material';
import { ThemeProvider } from 'styled-components';
import Navbar from '../components/Navbars/Navbar';
import Footer from '../components/Footers/Footer';
import Workshops from './Workshops';


const App = (props) => {
  const [campaignCode,setCampaignCode] = useState();
  // const [isLoading,setIsLoading] = useState(false);
  const location = useLocation();
  useEffect(()=>{
    setCampaignCode(location.search.split('=')[1]??props.location?.search?.split('=')[1]??'');
    ReactGA.pageview(window.location.pathname)
  },[]);

  console.log("location", location)
  return (
    <ThemeProvider theme={theme}>
    <div  style={{background:"#06070A"}}>
      <Navbar/>
    <Box mb={10} pt={10} sx={{bgcolor:"white",minHeight:"60vh",display:"flex",justifyContent:"center",alignItems:"center",}}>
      <Workshops campaignCode={campaignCode}/>
    </Box>

    <Footer/>
    </div>
    </ThemeProvider>
  )
}

export default App