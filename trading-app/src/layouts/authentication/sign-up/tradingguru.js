import React, {useState, useContext, useEffect} from "react"
import { useMediaQuery } from '@mui/material'
import theme from '../../HomePage/utils/theme/index'; 
import { ThemeProvider } from 'styled-components';
import { useNavigate, useLocation } from "react-router-dom";
// import ReactGA from "react-ga"
import axios from "axios";
import playstore from '../../../assets/images/playstore.png'
import Navbar from '../../HomePage/components/Navbars/Navbar';
import FinNavbar from '../../HomePage/components/Navbars/FinNavBar';
import background from '../../../assets/images/finowledge.png'
import courses from '../../../assets/images/courses.png'
import oneonone from '../../../assets/images/oneonone.png'
import workshops from '../../../assets/images/workshops.png'
import logo from '../../../assets/images/home_fin_kid.png'
import ReactGA from "react-ga";


// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";


// Images
import MDButton from "../../../components/MDButton";
import { Helmet } from "react-helmet";
const words = ["FININFLUENCER", "TEACHER", "INSTITUTE"];

function Cover() {
  // const [isLoading,setIsLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(()=>{
    ReactGA.pageview(window.location.pathname)
  })

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % words.length);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const backgroundColor = scrollPosition > 10 ? 'rgba(0, 0, 0, 0.8)' : 'transparent'
  const backdropFilter = scrollPosition > 10 ? 'blur(5px)' : 'none'

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  // Get the value of the "mobile" parameter
  const campaignCode = urlParams.get('campaignCode');


  return (
    <>
      <MDBox display='flex' justifyContent='center' flexDirection='column' alignContent='flex-start' alignItems='flex-start' style={{ minHeight:'auto', width: 'auto', minWidth:'100vW', overflow: 'visible', backgroundColor: '#FBFFFA', height: '100vh',}}>
      <ThemeProvider theme={theme}>
      <FinNavbar/>

          <Helmet>
            <title>{"Become a Trading Guru with StoxHero - Your Ultimate Destination for Trading Education"}</title>
            <meta name='description' content="Unlock the secrets of successful trading with StoxHero. Our platform offers comprehensive resources and expert guidance from our trading gurus to help you become a successful trader. Explore our courses, tools, and community to enhance your trading skills and achieve your financial goals."/>
            <meta name='keywords' content="Trading education, Trading courses, Trading strategies, Stock market analysis, Financial education, Trading tools, Trading community, Investment techniques, Market insights, Trading mentorship" />
          </Helmet>

      
      {/* <Grid
          container
          mt={0}
          xs={12}
          md={12}
          lg={12}
          display='flex'
          justifyContent='center'
          alignItems='center'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            backgroundColor: '#FBFFFA',
            backgroundSize: 'cover', // Make the background image responsive
            backgroundPosition: 'center center',
            height: '100vh',
            flexDirection: 'column',
            textAlign: 'center',
            padding: '10px',
            position: 'fixed',
            top: 0,
            left: 0,
            filter: backdropFilter,
            overflow: 'visible'
          }}
        > */}

       
        <Grid container mt={20} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='flex-start' style={{ position: 'relative', textAlign: 'center', width: '100%', height: '100vh', overflow: 'visible', backgroundColor: '#FBFFFA', }}>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
            <MDBox>
              <MDBox display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center'>
                <MDTypography variant={isMobile ? "h3" : "h3"} sx={{ color: '#000', minWidth:'100px' }} style={{fontFamily: 'Work Sans , sans-serif'}}>Are your a Stock Market</MDTypography>
                <MDTypography variant={isMobile ? "h3" : "h3"} sx={{ color: '#8343F6', minWidth:'100px' }} style={{fontFamily: 'Work Sans , sans-serif'}}>{words[index]}?</MDTypography>
                <MDTypography variant={isMobile ? "h3" : "h3"} sx={{ color: '#000', minWidth:'100px' }} style={{fontFamily: 'Work Sans , sans-serif'}}>Monetize your Expertise</MDTypography>
              </MDBox>
              <MDBox mt={2} display='flex' justifyContent='center' flexDirection='row' alignItems='center' alignContent='center' style={{minWidth:'100%'}}>
                <MDBox display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center'>
                  <MDButton variant='outlined' color='success' onClick={(e) => { window.open('https://calendly.com/stoxhero/tradingguru', '_blank') }}>Book a free Demo</MDButton>
                </MDBox>
              </MDBox>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={12} lg={12} mt={isMobile ? 3 : 0} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
              <Grid item container xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                <MDBox display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center'>
                  <MDBox><img src={courses} alt="Courses" width='100px'/></MDBox>
                  <MDBox><MDTypography variant='body1' style={{fontFamily: 'Work Sans , sans-serif'}}>Sell Courses</MDTypography></MDBox>
                </MDBox>
              </Grid>
              <Grid item container xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                <MDBox display='flex' justifyContent='center' alignItems='center' flexDirection='column' alignContent='center'>
                  <MDBox><img src={oneonone} alt="One-On-One" width='100px'/></MDBox>
                  <MDBox><MDTypography variant='body1' style={{fontFamily: 'Work Sans , sans-serif'}}>Book One-on-One Sessions</MDTypography></MDBox>
                </MDBox>
              </Grid>
              <Grid item container xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                <MDBox display='flex' justifyContent='center' alignItems='center' flexDirection='column' alignContent='center'>
                  <MDBox><img src={workshops} alt="Workshops" width='100px'/></MDBox>
                  <MDBox><MDTypography variant='body1' style={{fontFamily: 'Work Sans , sans-serif'}}>Conduct Workshops</MDTypography></MDBox>
                </MDBox>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      {/* </Grid> */}

      </ThemeProvider>
      </MDBox>
    </>
      
  );
}

export default Cover;
