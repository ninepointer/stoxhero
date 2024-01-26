// import Home from './Home';
// import Swap from './Swap'

import React, {useState, useContext, useEffect} from "react"
import { Link, useLocation } from "react-router-dom";
import ReactGA from "react-ga"
import { Grid, Input, TextField } from '@mui/material'
import workshoplisting from '../../../assets/images/workshoplisting.png'
import theme from '../utils/theme/index';
import { Box } from '@mui/material';
import { ThemeProvider } from 'styled-components';
import Navbar from '../components/Navbars/Navbar';
import Footer from '../../../layouts/authentication/components/Footer'
import Internship from './Internship';
import Workshops from './Workshops';
import MDBox from "../../../components/MDBox";
import { CircularProgress } from '@mui/material';
import MDTypography from "../../../components/MDTypography";
import CareerJD from './careerJD';
import { Helmet } from 'react-helmet';

const App = (props) => {
  const [campaignCode,setCampaignCode] = useState();
  const [isLoading,setIsLoading] = useState(false);
  const location = useLocation();
  // const [clicked,setClicked] = useState(false);
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };

  useEffect(()=>{
    setCampaignCode(location.search.split('=')[1]??props.location?.search?.split('=')[1]??'');
    ReactGA.pageview(window.location.pathname)
    window.webengage.track('workshop_clicked', {
    })
  },[]);

  let text = 'Join StoxHero\'s workshops to elevate your financial expertise. Learn from industry leaders in investing and trading. Sign up now for our next session!'
  return (
    <>
    <Helmet>

 
      <title>StoxHero Workshops: Master Investing & Trading Skills</title>
      <meta name='description' content={text} />
      <meta name='keywords' content='trading workshops, investing and trading workshop, stock market workshops' />

    </Helmet>
    <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{backgroundColor:'white', minHeight:'100vH', height: 'auto', width: 'auto', minWidth:'100vW'}}>
      <ThemeProvider theme={theme}>
        <Navbar/>
        <Grid mt={10} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' container xs={12} md={12} lg={12}>
          
          <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start'>
            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start'>
              
              <Grid item xs={12} md={12} lg={12} pl={5} pr={5} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{width:'100%'}}>
                <Grid container xs={12} md={12} lg={12} style={{width:'100%'}}>
                  <Grid item xs={12} md={12} lg={12} style={{width:'100%'}}>
                    <MDBox  display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{width:'100%'}}>
                      <MDTypography variant='h1' fontSize={18} fontWeight="bold">Workshops</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} style={{width:'100%'}}>
                    <MDBox  display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{width:'100%'}}>
                      <Workshops campaignCode={campaignCode}/>
                    </MDBox>
                  </Grid>
                </Grid>
              </Grid>

            </Grid>
          </Grid>

          <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{width:'100%'}}>
            <Grid container xs={12} md={12} lg={12} pl={1} pr={1} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{width:'100%'}}>
              <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{width:'100%'}}>
                <img src={workshoplisting} style={{ maxWidth: '80%', maxHeight: '80%', width: 'auto', height: 'auto' }}/>
              </MDBox>
            </Grid>
          </Grid>
        </Grid>
        
      </ThemeProvider>
    </MDBox>
    <MDBox>
      <Footer/>
    </MDBox>
    </>
  )
}

export default App