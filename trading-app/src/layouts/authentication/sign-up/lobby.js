import React, {useState, useContext, useEffect} from "react"
import { useMediaQuery } from '@mui/material'
import theme from '../../HomePage/utils/theme/index'; 
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, Divider } from '@mui/material';
import { ThemeProvider } from 'styled-components';
// import ReactGA from "react-ga"
import FinNavbar from '../../HomePage/components/Navbars/FinNavBar';
import background from '../../../assets/images/finowledge.png'
import logo from '../../../assets/images/logo1.jpeg'
import strategy from '../../../assets/images/strategy.png'
import ReactGA from "react-ga";
import TextField from '@mui/material/TextField';
import { useNavigate, useLocation } from "react-router-dom";
import moment from 'moment'

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDAvatar from "../../../components/MDAvatar";


// Images
import Footer from "../components/Footer";
import MDButton from "../../../components/MDButton";

function Cover() {
  const [isLoading,setIsLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

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
      {/* <ThemeProvider theme={theme}> */}
      {/* <FinNavbar/> */}
      
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
        </Grid>

       {/* <Grid mt={10} spacing={1} item display='flex' justifyContent='center' alignItems='center' style={{zIndex:10, overflow:'visible'}}> */}
        <Grid mt={10} container xs={10} md={9} lg={9} display='flex' justifyContent='center' alignItems='center' style={{zIndex:10, overflow: 'visible' }}>
          <Grid mb={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{backgroundColor:'white', borderRadius:10}}>
            <MDBox mt={2} display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
              <MDTypography>My Profile</MDTypography>
            </MDBox>
            <MDBox display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
                <MDAvatar src={logo} size='md' alt="something here" />
            </MDBox>
            <MDBox display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
              <MDTypography variant='body2' style={{fontFamily: 'Nunito'}}>Prateek Pawan</MDTypography>
            </MDBox>
            <MDBox display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
              <MDTypography variant='caption' style={{fontFamily: 'Nunito'}}>Class: 6th</MDTypography>
            </MDBox>
            <MDBox mb={2} display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}>
              <MDTypography variant='caption' style={{fontFamily: 'Nunito'}}>Delhi Public School, R K Puram</MDTypography>
            </MDBox>
          </Grid>
        </Grid>

        <Grid container xs={10} md={9} lg={9} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{zIndex:10, overflow: 'visible' }}>
        <Grid p={.5} mb={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{backgroundColor:'#D5F47E', borderRadius:10}}>
          {/* <MDBox p={0.5} display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}> */}
            <MDTypography variant='body2' style={{fontFamily: 'Nunito'}}>My Olympiad</MDTypography>
          {/* </MDBox> */}
        </Grid>
        </Grid>

        <Grid container xs={10} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ zIndex:10, overflow: 'visible' }}>
          {/* {blogData?.map((elem) => { */}
            {/* return ( */}
              {false ?
              <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                  <Card 
                    sx={{cursor: 'pointer' }} 
                    // onClick={() => { handleOpenNewTab(elem) }}
                  >
                    <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <img src={strategy} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                      </Grid>
                      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', minHeight: 60 }}>
                        <MDTypography variant="h5" fontFamily='Segoe UI' fontWeight={400} style={{ textAlign: 'center' }}>
                          {"Big Bulls of North India"}
                        </MDTypography>
                      </MDBox>
                      {/* <Divider style={{ width: '100%' }} /> */}
                      <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDTypography variant='caption'>
                          Starts: {`${moment.utc("2024-02-11T03:50:00").utcOffset('+05:30').format('DD MMM YYYY HH:mm a')} • ${2 || 1} seats left`}
                        </MDTypography>
                      </MDBox>
                    </CardContent>
                    <CardContent>
                      <Grid mb={-2} container display='flex' justifyContent='space-between' xs={12} md={12} lg={12}>
                        <Grid item display='flex' justifyContent='space-between' xs={12} md={12} lg={12}>
                          <MDButton size="small">Invite Friends</MDButton>
                          <MDButton size="small">Register</MDButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              :
              <Grid item xs={12} md={12} lg={9} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                <MDBox p={0.5} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{minWidth:'100%', borderRadius:10,border:'1px #D5F47E solid'}}>
                  <MDTypography variant='caption' color='student' style={{textAlign:'center'}}>You have not registered in any finance olympiad yet!</MDTypography>
                </MDBox>
              </Grid>}
            {/* ) */}
          {/* })} */}
        </Grid> 

        <Grid mt={2} container xs={10} md={9} lg={9} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{zIndex:10, overflow: 'visible' }}>
        <Grid p={.5} mb={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{backgroundColor:'#D5F47E', borderRadius:10}}>
          {/* <MDBox p={0.5} display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}> */}
            <MDTypography variant='body2' style={{fontFamily: 'Nunito'}}>Upcoming Olympiad</MDTypography>
          {/* </MDBox> */}
        </Grid>
        </Grid>

        <Grid mb={2} container xs={10} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ zIndex:10, overflow: 'visible' }}>
          {/* {blogData?.map((elem) => { */}
            {/* return ( */}
            {false ?
              <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                  <Card 
                    sx={{cursor: 'pointer' }} 
                    // onClick={() => { handleOpenNewTab(elem) }}
                  >
                    <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <img src={strategy} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                      </Grid>
                      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', minHeight: 60 }}>
                        <MDTypography variant="h5" fontFamily='Segoe UI' fontWeight={400} style={{ textAlign: 'center' }}>
                          {"Big Bulls of North India"}
                        </MDTypography>
                      </MDBox>
                      {/* <Divider style={{ width: '100%' }} /> */}
                      <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDTypography variant='caption'>
                          Starts: {`${moment.utc("2024-02-11T03:50:00").utcOffset('+05:30').format('DD MMM YYYY HH:mm a')} • ${2 || 1} seats left`}
                        </MDTypography>
                      </MDBox>
                    </CardContent>
                    <CardContent>
                      <Grid mb={-2} container display='flex' justifyContent='space-between' xs={12} md={12} lg={12}>
                        <Grid item display='flex' justifyContent='space-between' xs={12} md={12} lg={12}>
                          <MDButton size="small">Invite Friends</MDButton>
                          <MDButton size="small">Register</MDButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              :
              <Grid item xs={12} md={12} lg={9} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                <MDBox p={0.5} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{minWidth:'100%', borderRadius:10,border:'1px #D5F47E solid'}}>
                  <MDTypography variant='caption' color='student' style={{textAlign:'center'}}>No upcoming finance olympiad, keep checking this space!</MDTypography>
                </MDBox>
              </Grid>}
            {/* ) */}
          {/* })} */}
        </Grid> 
      {/* </ThemeProvider> */}
      </MDBox>
    </>
      
  );
}

export default Cover;
