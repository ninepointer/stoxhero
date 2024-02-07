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


function Cover() {
  const [isLoading,setIsLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

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

  const backgroundColor = scrollPosition > 10 ? 'rgba(0, 0, 0, 0.8)' : 'transparent'
  const backdropFilter = scrollPosition > 10 ? 'blur(5px)' : 'none'

  function joinGroup(){
    window.open('https://chat.whatsapp.com/Bcjt7NbDTyz1odeF8RDtih', '_blank');

  }

  return (
    <>
      <MDBox mt={-1} display='flex' justifyContent='center' flexDirection='column' alignContent='center' alignItems='center' style={{ minHeight:'auto', width: 'auto', minWidth:'100vW', overflow: 'visible'}}>
      <ThemeProvider theme={theme}>
      <FinNavbar/>

          <Helmet>
            <title>{"StoxHero Finance Olympiad"}</title>
            <meta name='description' content="NFO gives schools access to a comprehensive financial syllabus, and India's pioneering Finance Examination, both meticulously crafted to cater to school children."/>
            {/* <meta name='keywords' content={blogData?.keywords} /> */}
          </Helmet>

      
      <Grid
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
            backgroundImage: `url(${background})`,
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
            backgroundColor: backgroundColor,
            overflow: 'visible'
          }}
        >

       
        <Grid container mt={15} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ position: 'relative', textAlign: 'center', width: '100%', height: '100vh', overflow: 'visible' }}>
          <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignItems='flex-start' alignContent='flex-start'>
            <MDBox mt={5} mb={isMobile ? 5 : 15} display='flex' justifyContent='center' flexDirection='column' alignItems='flex-start' alignContent='center'>
              <MDTypography variant={isMobile ? "h3" : "h1"} sx={{ color: '#fff' }} style={{fontFamily: 'Work Sans , sans-serif'}}>On a mission to train</MDTypography>
              <MDTypography variant={isMobile ? "h3" : "h1"} sx={{ color: '#D5F47E' }} style={{fontFamily: 'Work Sans , sans-serif'}}>India's next Big Bulls</MDTypography>
              <MDTypography variant={isMobile ? "body2" : "body1"} sx={{ color: '#fff' }} style={{fontFamily: 'Work Sans , sans-serif'}}>Battle & Compete with Students across</MDTypography>
              <MDTypography variant={isMobile ? "body2" : "body1"} sx={{ color: '#D5F47E' }} style={{fontFamily: 'Work Sans , sans-serif'}}>North India in Finance Olympiad</MDTypography>
              <MDBox display='flex' justifyContent='space-between'>
                <MDButton variant='contained' size='small' color='student' style={{marginTop:15,color:'#000', fontFamily: 'Work Sans , sans-serif'}} onClick={() => { navigate('/enter-mobile') }}>Register/Login</MDButton>
                <MDButton variant='outlined' style={{marginTop:15, marginLeft:10, fontFamily: 'Work Sans , sans-serif'}} onClick={()=>{navigate('/tryquiz')}}>Try Now</MDButton>
                {/* <MDButton variant='outlined' style={{color: 'green', backgroundColor: '#ffffff', marginTop:15, marginLeft:10, fontFamily: 'Work Sans , sans-serif'}} onClick={joinGroup} ><WhatsAppIcon/> </MDButton> */}
              </MDBox>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6} display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
            <MDBox mb={2} display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
              <img src={logo} width={isMobile ? 300 : 700} alt="Logo" />
            </MDBox>
          </Grid>
        </Grid>
      </Grid>

      {/* <Grid container mt={2} mb={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' xs={12} md={12} lg={12} style={{ minWidth: '100%', height: 'auto', flexGrow: 1, overflowY: 'auto', zIndex:3, overflow: 'visible' }}>
        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '95%', height: 'auto' }}>
          <Footer/>
        </Grid>
      </Grid> */}
      </ThemeProvider>
      </MDBox>
    </>
      
  );
}

export default Cover;
