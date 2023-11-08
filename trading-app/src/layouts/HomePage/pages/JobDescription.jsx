import Home from './Home';
import Swap from './Swap'
import React, {useEffect, lazy, Suspense} from 'react'
import ReactGA from "react-ga"
import { useLocation } from 'react-router-dom'
import theme from '../utils/theme/index';
import { Box, Grid } from '@mui/material';
import { ThemeProvider } from 'styled-components';
import About from './About';
import Navbar from '../components/Navbars/Navbar';
import Footer from '../../authentication/components/Footer';
import Internship from './Internship';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import { Link } from 'react-router-dom';
import MDBox from '../../../components/MDBox';
import CareerForm from './EICCareerForm'
import aboutjob from '../../../assets/images/aboutjob.png'
import roles from '../../../assets/images/roles.png'
// import MDButtonLL from 'your-md-button-library'; 


const App = () => {
  const LazyLoadComponent = lazy(() => import(<CareerForm/>));
  const location = useLocation();
  const career = location?.state?.data;
  const campaignCode = location?.state?.campaignCode;
  console.log(location?.state?.campaignCode)
  useEffect(()=>{
    ReactGA.pageview(window.location.pathname)
  }, [])

  return (
    <>
    <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{backgroundColor:'white', minHeight:'100vH', height: 'auto', width: 'auto', minWidth:'100vW'}}>
      <ThemeProvider theme={theme}>
        <Navbar/>
        <Grid mt={8} display='flex' justifyContent='center' alignContent='center' alignItems='center' container xs={12} md={12} lg={12}>
          
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDBox  display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
              <MDTypography fontSize={18} fontWeight="bold" style={{textDecoration:'underline'}}>JD : {career?.jobTitle}, {career?.jobType}</MDTypography>
            </MDBox>
          </Grid>

          <Grid item xs={12} md={12} lg={12} mt={0.5} style={{width:'100%'}}>
            <MDBox  display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
              <MDTypography fontSize={13}>👨‍💻 {career?.jobLocation === "WFH" ? "Remote" : "In-Office"} {career?.activelyRecruiting === true ? " | 👨‍💼👩‍💼 Actively recruiting" : ""}</MDTypography>
            </MDBox>
          </Grid>

          <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            
            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              
              <Grid item xs={12} md={12} lg={12} pl={5} pr={5} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
                
                <Grid container xs={12} md={12} lg={12} style={{width:'100%'}}>

                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
                      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
                        <img src={aboutjob} style={{ maxWidth: '40%', maxHeight: '40%', width: 'auto', height: 'auto' }}/>
                      </MDBox>
                  </Grid>

                  <Grid item xs={12} md={12} lg={12} mt={2} style={{width:'100%'}}>
                    <MDBox  display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
                      <MDTypography fontSize={18} fontWeight="bold" style={{textDecoration:'underline'}}>About the Job</MDTypography>
                    </MDBox>
                  </Grid>

                  <Grid item xs={12} md={12} lg={12} style={{width:'100%'}}>
                    <MDBox  display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', textAlign :'center'}}>
                      <MDTypography fontSize={15}>{career?.jobDescription}</MDTypography>
                    </MDBox>
                  </Grid>

                </Grid>

              </Grid>

            </Grid>

          </Grid>

          <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
                    <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
                      <img src={roles} style={{ maxWidth: '25%', maxHeight: '25%', width: 'auto', height: 'auto' }}/>
                    </MDBox>
                </Grid>

                <Grid item xs={12} md={12} lg={12} mt={2} display='flex' justifyContent='center'>
                  <MDTypography fontSize={18} fontWeight="bold" style={{textDecoration:'underline'}}>
                    Roles & Responsibilities
                  </MDTypography>
                </Grid>
                
                {career?.rolesAndResponsibilities?.map((elem)=>{
                  return(
                    <Grid key={elem._id} item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                      <MDTypography fontSize={15} color="dark">➡️ &nbsp;</MDTypography>
                      <MDTypography fontSize={13} color="dark" style={{width:'80%'}}>
                        {elem?.description}
                      </MDTypography>
                    </Grid>
                  )
                })}

                <Grid item mt={2} mb={2} xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                  
                  <MDButton 
                    variant='contained' 
                    style={{backgroundColor:'#65BA0D', color:'white'}}
                    sx={{width:"200px",height:"30px"}}
                    component={Link} 
                    to={{
                      pathname: `/careers/careerform/${career?.jobTitle}`,
                    }}
                    state= {{data: career, campaignCode: campaignCode}}
                    >
                      Apply
                  </MDButton>

                </Grid>
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
