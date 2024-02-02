import React, {useState, useContext, useEffect} from "react"
import { useMediaQuery } from '@mui/material'
import theme from '../../HomePage/utils/theme/index'; 
import { ThemeProvider } from 'styled-components';
// import ReactGA from "react-ga"
import FinNavbar from '../../HomePage/components/Navbars/FinNavBar';
import background from '../../../assets/images/finowledge.png'
import logo from '../../../assets/images/fulllogoblack.png'
import register from '../../../assets/images/register.gif'
import ReactGA from "react-ga";
import TextField from '@mui/material/TextField';
import { useNavigate, useLocation } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";


// Images
import Footer from "../components/Footer";
import MDButton from "../../../components/MDButton";

function Cover() {
  const [isLoading,setIsLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  useEffect(()=>{
    ReactGA.pageview(window.location.pathname)
  })

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))

  const handlePlaystoreNavigate = () => {
    // Open google.com in a new tab
    // window.open(`${setting?.playstore_link}`, '_blank');
  };
  
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

  

  return (
    <>
      <MDBox mt={-1} display='flex' justifyContent='center' flexDirection='column' alignContent='center' alignItems='center' style={{ minHeight:'auto', width: 'auto', minWidth:'100vW', overflow: 'visible'}}>
      <ThemeProvider theme={theme}>
      <FinNavbar/>
      
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

       
        <Grid container xs={9} md={4} lg={4} display='flex' justifyContent='center' alignItems='center' style={{backgroundColor:'transparent', borderRadius:10, position: 'relative', textAlign: 'center', width: '100%', height: '100vh', overflow: 'visible' }}>
          <Grid mt={3} mb={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center'>
            <MDBox display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
                <MDTypography variant={isMobile ? 'h5' : 'h3'} style={{fontFamily: 'Nunito', color:'#D5F47E'}}>Welcome to StoxHero!</MDTypography>
            </MDBox>
            <MDBox display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
              <MDTypography variant='body2' style={{fontFamily: 'Nunito', color:'#fff'}}>Fill in these details to get you started!</MDTypography>
            </MDBox>
          </Grid>
          <Grid mb={2} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{backgroundColor:'white', borderRadius:5}}>    
            <TextField
                required
                // disabled={showEmailOTP}
                id="outlined-required"
                label="Full Name"
                fullWidth
                type='text'
                // onChange={handleMobileChange}
            />
          </Grid>
          <Grid mb={2} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{backgroundColor:'white', borderRadius:5}}>    
            <TextField
                required
                // disabled={showEmailOTP}
                id="outlined-required"
                label="Parent's Name"
                fullWidth
                type='text'
                // onChange={handleMobileChange}
            />
          </Grid>
          <Grid mb={2} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{backgroundColor:'white', borderRadius:5}}>    
            <TextField
                required
                // disabled={showEmailOTP}
                id="outlined-required"
                label="Class/Grade"
                fullWidth
                type='text'
                // onChange={handleMobileChange}
            />
          </Grid>
          <Grid mb={2} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{backgroundColor:'white', borderRadius:5}}>    
            <TextField
                required
                // disabled={showEmailOTP}
                id="outlined-required"
                label="School"
                fullWidth
                type='text'
                // onChange={handleMobileChange}
            />
          </Grid>
          <Grid mb={2} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{backgroundColor:'white', borderRadius:5}}>    
            <TextField
                required
                // disabled={showEmailOTP}
                id="outlined-required"
                label="City"
                fullWidth
                type='text'
                // onChange={handleMobileChange}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center'>
            <MDBox mb={5} display='flex' justifyContent='center'>
              <MDButton fullWidth variant='contained' size='small' color='student' style={{marginTop:15,color:'#000'}} onClick={() => { navigate('/lobby') }}>Proceed</MDButton>
            </MDBox>
          </Grid>
          {/* <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
            <MDBox mb={2} display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
              <img src={logo} width={700} alt="Logo" />
            </MDBox>
          </Grid> */}
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
