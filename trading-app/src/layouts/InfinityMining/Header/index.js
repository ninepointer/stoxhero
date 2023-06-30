import React from 'react';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import {Link} from 'react-router-dom'
import { Grid } from '@mui/material';
import Logo from '../../../assets/images/default-profile.png'

//data

export default function PaymentHeader() {

  return (
    <MDBox>
      <MDBox bgColor="primary" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='10vh'>
          
          
      </MDBox>
      <MDBox bgColor="text" color="light" mt={1} mb={1} p={0} borderRadius={0} minHeight='100vh'>
          <Grid container spacing={0}>
            
            <Grid item xs={12} md={8} lg={4} style={{backgroundColor:'white', minHeight:'100vh'}}>
              <Grid container xs={12} md={12} lg={12} p={1} display='flex' justifyContent='center' mt={1}>
                
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
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
                      
                      <MDBox style={{border:'1px solid grey', backgroundColor:'grey'}} borderRadius={5} p={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Period</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Gross P&L</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Net P&L</MDTypography>
                        </Grid>
                      </MDBox>
                      
                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>Today</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>50,000</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>50,000</MDTypography>
                        </Grid>
                      </MDBox>

                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>Last Day</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>50,000</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>50,000</MDTypography>
                        </Grid>
                      </MDBox>

                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>This Week</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>50,000</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>50,000</MDTypography>
                        </Grid>
                      </MDBox>

                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>This Month</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>50,000</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>50,000</MDTypography>
                        </Grid>
                      </MDBox>

                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} p={0.5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13} fontWeight='bold'>Lifetime</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>50,000</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={4} display='flex' justifyContent='center'>
                            <MDTypography fontSize={13}>50,000</MDTypography>
                        </Grid>
                      </MDBox>
                    </Grid>

                    
                </Grid>

                <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center' width='100%'>
                    
                    <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                      
                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Max Profit</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='left'>
                            <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>50,000</MDTypography>
                        </Grid>
                      </MDBox>

                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Profit %</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='left'>
                            <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>50%</MDTypography>
                        </Grid>
                      </MDBox>

                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Max Loss</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='left'>
                            <MDTypography ml={5} color='error' fontSize={13} fontWeight='bold'>50,000</MDTypography>
                        </Grid>
                      </MDBox>

                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Loss %</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='left'>
                            <MDTypography ml={5} color='error' fontSize={13} fontWeight='bold'>50%</MDTypography>
                        </Grid>
                      </MDBox>

                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Profit Days</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='left'>
                            <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>10</MDTypography>
                        </Grid>
                      </MDBox>

                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Loss Days</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='left'>
                            <MDTypography ml={5} color='error' fontSize={13} fontWeight='bold'>10</MDTypography>
                        </Grid>
                      </MDBox>

                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Avg. Profit</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='left'>
                            <MDTypography ml={5} color='success' fontSize={13} fontWeight='bold'>10,000</MDTypography>
                        </Grid>
                      </MDBox>

                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Avg. Loss</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='left'>
                            <MDTypography ml={5} color='error' fontSize={13} fontWeight='bold'>-10,000</MDTypography>
                        </Grid>
                      </MDBox>

                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Trader Trading Days</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='left'>
                            <MDTypography ml={5} color='info' fontSize={13} fontWeight='bold'>10</MDTypography>
                        </Grid>
                      </MDBox>

                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Market Trading Days</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='left'>
                            <MDTypography ml={5} color='info' fontSize={13} fontWeight='bold'>10</MDTypography>
                        </Grid>
                      </MDBox>

                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Max Win Streak</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='left'>
                            <MDTypography ml={5} color='info' fontSize={13} fontWeight='bold'>10</MDTypography>
                        </Grid>
                      </MDBox>

                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Max Loss Streak</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='left'>
                            <MDTypography ml={5} color='info' fontSize={13} fontWeight='bold'>10</MDTypography>
                        </Grid>
                      </MDBox>

                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Available Margin</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='left'>
                            <MDTypography ml={5} color='info' fontSize={13} fontWeight='bold'>10,000,00</MDTypography>
                        </Grid>
                      </MDBox>

                      <MDBox style={{border:'1px solid grey'}} borderRadius={5} mt={0.5} display='flex' justifyContent='center' width='100%'>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='center' style={{backgroundColor:'grey'}}>
                            <MDTypography color='light' fontSize={13} fontWeight='bold'>Today's Opening Balance</MDTypography>
                        </Grid>
                        <Grid item xs={4} md={4} lg={6} display='flex' justifyContent='left'>
                            <MDTypography ml={5} color='info' fontSize={13} fontWeight='bold'>7,000,00</MDTypography>
                        </Grid>
                      </MDBox>
                      
                    </Grid>

                    
                </Grid>

              </Grid>
                  

            </Grid>

            <Grid item xs={12} md={8} lg={8} style={{minHeight:'100vh'}}>

            </Grid>
          </Grid>
          
      </MDBox>
    </MDBox>
  );
}