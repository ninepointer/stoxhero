import { Box, Container, Grid, Stack, Button, Typography,Tooltip } from '@mui/material'
import MDButton from '../../../components/MDButton'
import MDBox from '../../../components/MDBox'
import MDTypography from '../../../components/MDTypography'
import MDAvatar from '../../../components/MDAvatar'
import Title from '../components/Title/index'
import React from 'react'
import theme from '../utils/theme/index'
import ServiceCard from '../components/Cards/ServiceCard'
import { Link } from 'react-router-dom';
import Logo from "../../../assets/images/logo1.jpeg"
import jobs from "../../../assets/images/jobs.png"


const Internship = () => {
    return (
        <Box p={5}>
            <Grid container flexDirection="column"  spacing={4}>
            
            <Grid item xs={12} md={20} lg={15}>
              <MDBox style={{borderRadius:4}}>
              <Tooltip title="Click me!">
              <MDButton variant="contained" color="light" size="small" style={{minWidth:'100%'}}
              component={Link} 
              to={{
                pathname: `/jobdescription`,
              }}
            //   state= {{data:e._id, isDummy: true, isFromUpcomming: true}}
              >
                  
                  {/* <Grid container spacing={3}> */}
                    {/* <Grid  container spacing={1} display="flex" justifyContent="center" alignContent="center" alignItem="center"> */}
                        <Grid item  xs={12} md={20} lg={12} mb={1} display="flex" alignContent="center" alignItems="center">
                            <MDAvatar src={jobs} size="xl" display="flex" justifyContent="left"/>
                            <MDBox ml={2} display="flex" flexDirection="column">
                            <MDTypography fontSize={20} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Derivaties Trader (Intern)</MDTypography>
                            {/* <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"white"}}></MDTypography> */}
                            <MDTypography fontSize={15} fontWeight="bold" display="flex" justifyContent="center" style={{color:"black"}}>Apply Now</MDTypography>
                            </MDBox>
                        </Grid>  
                    {/* </Grid> */}

                  {/* </Grid> */}

              </MDButton>
              </Tooltip>
              </MDBox>
            </Grid>

            <Grid item xs={12} md={20} lg={15}>
              <MDBox style={{borderRadius:4}}>
              <Tooltip title="Click me!">
              <MDButton variant="contained" color="light" size="small" style={{minWidth:'100%'}} 
              component={Link} 
            //   to={{
            //     pathname: `/battlestreet/${e.contestName}`,
            //   }}
            //   state= {{data:e._id, isDummy: true, isFromUpcomming: true}}
              >
                  
                  {/* <Grid container spacing={3}> */}
                    {/* <Grid  container spacing={1} display="flex" justifyContent="center" alignContent="center" alignItem="center"> */}
                        <Grid item xs={12} md={6} lg={12} mb={1} display="flex" alignContent="center" alignItems="center">
                            <MDAvatar src={jobs} size="xl" display="flex" justifyContent="left"/>
                            <MDBox ml={2} display="flex" flexDirection="column">
                            <MDTypography fontSize={20} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Marketing/Sales (Intern)</MDTypography>
                            {/* <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"white"}}>Index:</MDTypography> */}
                            <MDTypography fontSize={15} fontWeight="bold" display="flex" justifyContent="center" style={{color:"black"}}>Apply Now</MDTypography>
                            </MDBox>
                        </Grid>  
                    {/* </Grid> */}

                  {/* </Grid> */}

              </MDButton>
              </Tooltip>
              </MDBox>
            </Grid>

            <Grid item xs={12} md={20} lg={15}>
              <MDBox style={{borderRadius:4}}>
              <Tooltip title="Click me!">
              <MDButton variant="contained" color="light" size="small" style={{minWidth:'100%'}} 
              component={Link} 
            //   to={{
            //     pathname: `/battlestreet/${e.contestName}`,
            //   }}
            //   state= {{data:e._id, isDummy: true, isFromUpcomming: true}}
              >
                  
                  {/* <Grid container spacing={3}> */}
                    {/* <Grid  container spacing={1} display="flex" justifyContent="center" alignContent="center" alignItem="center"> */}
                        <Grid item xs={12} md={6} lg={20} mb={1} display="flex" alignContent="center" alignItems="center">
                            <MDAvatar src={jobs} size="xl" display="flex" justifyContent="left"/>
                            <MDBox ml={2} display="flex" flexDirection="column">
                            <MDTypography fontSize={20} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Campus Ambassador</MDTypography>
                            {/* <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"white"}}>Index:</MDTypography> */}
                            <MDTypography fontSize={15} fontWeight="bold" display="flex" justifyContent="center" style={{color:"black"}}>Apply Now</MDTypography>
                            </MDBox>
                        </Grid>  
                    {/* </Grid> */}

                  {/* </Grid> */}

              </MDButton>
              </Tooltip>
              </MDBox>
            </Grid>

            </Grid>

        </Box>
    )
}

export default Internship