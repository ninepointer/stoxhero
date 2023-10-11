import { React, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { userContext } from '../../../AuthContext';
import ReactGA from "react-ga"

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import VirtualTrading from "../../../assets/images/VirtualTrading.png"
import MDButton from "../../../components/MDButton";
import { CircularProgress } from "@mui/material";

// Material Dashboard 2 React base styles



function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading,setIsLoading] = useState(true);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  
  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
    capturePageView()
  }, []);
  let page = 'Paper Trading'
  let pageLink = window.location.pathname
  async function capturePageView(){
        await fetch(`${baseUrl}api/v1/pageview/${page}${pageLink}`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
    });
  }

  useEffect(() => {
    setTimeout(()=>{
        setIsLoading(false)
    },1000)
  }, []);

  return (
    
    <MDBox bgColor="white" color="dark" mt={2} mb={1} p={1} borderRadius={10} minHeight='70vH'>
    {isLoading ?
    <>
        <MDBox mt={5} mb={5} display='flex' justifyContent='center'>
            <CircularProgress color="info" />
        </MDBox>
    </>
    :
    <>
        <Grid container p={1} style={{border:'0.2px solid black', backgroundColor:'black', borderRadius:5}} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
          
          <Grid item xs={12} md={6} lg={4} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center'>
            <MDTypography color='light' fontSize={12} fontWeight='bold'>NIFTY: 19600</MDTypography>
          </Grid>
          <Grid item xs={12} md={6} lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography color='light' fontSize={12} fontWeight='bold'>BANKNIFTY: 45400</MDTypography>
          </Grid>
          <Grid item xs={12} md={6} lg={4} display='flex' justifyContent='flex-end' alignContent='center' alignItems='center'>
            <MDTypography color='light' fontSize={12} fontWeight='bold'>FINNIFTY: 19200</MDTypography>
          </Grid>
        </Grid>

        <Grid container p={1} mt={.5} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
          
            <Grid item xs={12} md={6} lg={12} container justify="center" alignItems="center">
                <img src={VirtualTrading} style={{ maxWidth: '100%' }} alt="Virtual Trading" />
            </Grid>
        
        </Grid>

        <Grid container p={1} mt={.5} xs={12} md={12} lg={12} display='flex' justifyContent='flex-end' alignContent='center' alignItems='center'>
          
            <Grid item xs={12} md={6} lg={12} container display='flex' justifyContent="center" alignItems="center">
                <MDButton 
                    variant='outlined' 
                    color='info' 
                    size='small'
                    onClick={() => { navigate('/virtualtrading') }}
                >
                    Start Trading
                </MDButton>
            </Grid>
        
        </Grid>

        <Grid container p={1} mt={.5} xs={12} md={12} lg={4} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center'>
          
            <Grid style={{backgroundColor:'black'}} minHeight={10} borderRadius={2} item xs={12} md={6} lg={12} container display='flex' justifyContent="flex-end" alignItems="center" width='100%'>
                <MDBox p={1} display='flex' justifyContent="flex-end" alignItems="center" flexDirection='column' width='100%'>
                    <MDBox display='flex' justifyContent="flex-end" alignItems="center" width='100%'>
                        <MDTypography color='light' fontSize={15} fontWeight={400}>Virtual Margin Money</MDTypography>
                    </MDBox>
                    <MDBox display='flex' justifyContent="flex-end" alignItems="center" width='100%'>
                        <MDTypography color='light' fontSize={12}>Rs. 1,000,000</MDTypography>
                    </MDBox>
                </MDBox>
            </Grid>
        
        </Grid>

    
    </>}
    </MDBox>
  );
}

export default Header;
