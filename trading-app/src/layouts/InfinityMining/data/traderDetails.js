import React from 'react';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import {Link} from 'react-router-dom'
import { Grid } from '@mui/material';
import Logo from '../../../assets/images/default-profile.png'

//data
import LiveMockInfinityDailyData from '../data/liveMockInfinityDailyChart'

export default function TraderDetails() {

  return (
     <> 
            <Grid container xs={12} md={12} lg={12} p={1} display='flex' justifyContent='center' width='100%'>
                            
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' width='100%'>
                                <MDAvatar
                                src={Logo}
                                alt="Profile"
                                size="xl"
                                sx={({ borders: { borderWidth }, palette: { white } }) => ({
                                    border: `${borderWidth[2]} solid ${white.main}`,
                                    cursor: "pointer",
                                    position: "relative",
                                    ml: -1.25,

                                    "&:hover, &:focus": {
                                    zIndex: "10",
                                    },
                                })}
                                />
                            </Grid>

                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column'>
                                <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold'>Prateek Pawan</MDTypography></MDBox>
                                <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold'>DOB: 24-Jan-1991</MDTypography></MDBox>
                                <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold'>Joining Date: 24-Jan-2023</MDTypography></MDBox>
                            </Grid>

                            <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center' width='100%'>
                                
                                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                                    
                                    <MDBox style={{border:'1px solid #e91e63', backgroundColor:'#e91e63'}} borderRadius={5} p={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={4} md={4} lg={12} display='flex' justifyContent='center'>
                                        <MDTypography color='light' fontSize={13} fontWeight='bold'>Trader Details</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Age</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>32</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Gender</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>Male</MDTypography>
                                    </Grid>
                                    </MDBox>
                                    
                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Currently Working</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>No</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Non-Working Duration</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>2 Months</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Previously Employeed</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>Yes</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Latest Salary(Monthly)</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>40,000</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Latest Degree</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>MBA</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>College Name</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>NIT Rourkela</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Family Income(Yearly)</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>4,00,000</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Staying With</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>Family/Friends</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Marital Status</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>Married</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Current Location</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>Noida, Uttar Pradesh</MDTypography>
                                    </Grid>
                                    </MDBox>

                                    <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13} fontWeight='bold'>Native Location</MDTypography>
                                    </Grid>
                                    <Grid item xs={6} md={6} lg={6} display='flex' justifyContent='center'>
                                        <MDTypography fontSize={13}>Patna, Bihar</MDTypography>
                                    </Grid>
                                    </MDBox>
                                    
                                </Grid>
                
                            </Grid>

            </Grid>
    </>
  );
}