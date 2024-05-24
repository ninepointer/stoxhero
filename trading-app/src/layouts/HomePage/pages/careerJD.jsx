import React, {useEffect, lazy, Suspense} from 'react'
import ReactGA from "react-ga"
import { useLocation } from 'react-router-dom'
import theme from '../utils/theme/index';
import { Box, Grid } from '@mui/material';
import { ThemeProvider } from 'styled-components';
import About from './About';
import Navbar from '../components/Navbars/Navbar';
import Footer from '../components/Footers/Footer';
import Internship from './Internship';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import { Link } from 'react-router-dom';
import MDBox from '../../../components/MDBox';
import CareerForm from './EICCareerForm'


const App = () => {
  const LazyLoadComponent = lazy(() => import(<CareerForm/>));
  const location = useLocation();
  const career = location?.state?.data;
  const campaignCode = location?.state?.campaignCode;
  
  useEffect(()=>{
    ReactGA.pageview(window.location.pathname)
  }, [])

  return (
    <MDBox mt={0} sx={{bgcolor:theme.palette.background.default}}>
     
        <Box p={5} mb={10} sx={{height:{xs:"800px",lg:"auto",md:"auto"},}}  >
          <Grid mt={10} container height="500px" >
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
              <MDTypography fontSize={20} color="light" style={{align:'center'}}>JOB DESCRIPTION</MDTypography>
            </Grid>
            <Grid item mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='center'>
              <MDTypography fontSize={18} color="light" style={{align:'center'}}>
                Responsibilities
              </MDTypography>
            </Grid>
            
            {career?.rolesAndResponsibilities?.map((elem)=>{
              return(
                <Grid key={elem._id} item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                  <MDTypography fontSize={15} color="light">{elem?.orderNo}. &nbsp;</MDTypography>
                  <MDTypography fontSize={15} color="light" style={{width:'70%'}}>
                    {elem?.description}
                  </MDTypography>
                </Grid>
              )
            })}

            <Grid item mt={2} mb={2} xs={12} md={12} lg={12} display='flex' justifyContent='center'>
              
              <MDButton 
                variant='outlined' 
                color='warning'
                sx={{width:"200px",height:"50px",zIndex:"1"}}
                component={Link} 
                to={{
                  pathname: `/careerform/${career?.jobTitle}`,
                }}
                state= {{data: career, campaignCode: campaignCode}}
                >
                  Apply
              </MDButton>

            </Grid>
          </Grid>
        </Box>
        
    </MDBox>
  )
}

export default App