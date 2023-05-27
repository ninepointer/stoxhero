import React, {useState} from 'react';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import {Grid, CircularProgress, Divider} from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import MDAvatar from '../../../components/MDAvatar';
import man from '../../../assets/images/man.png'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Link, useLocation } from "react-router-dom";
import RunningPNLChart from '../data/runningpnlchart'

//data

export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setIsLoading(true)
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  };

  return (
    <MDBox bgColor="dark" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto' maxWidth='100%'>
        {/* <MDBox minHeight='40vH' border='1px solid grey' borderRadius={4} display='flex' justifyContent='center' flexDirection='column' alignItems='center'>
            <MDAvatar src={man}></MDAvatar>
            <MDTypography fontSize={20} fontWeight='bold'>Under Construction</MDTypography>
        </MDBox> */}
        <MDBox>
            <MDTypography ml={1} mb={1} color='light' fontSize={18} fontWeight='bold'>Career Dashboard</MDTypography>
        </MDBox>

        <Grid container lg={12}>
            <Grid item boxShadow={2} minHeight='20vH' minWidth='100%' style={{backgroundColor:'white'}} borderRadius={1}>
                <Grid container>
                    <Grid item p={2} xs={12} lg={5.9}>
                        <MDTypography fontSize={16} fontWeight='bold' color='dark'>Today's Position (Internship) - All Batches</MDTypography>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Gross P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>Value</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Brokerage</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>Value</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Net P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>Value</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Open Lots</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>Value</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Running Lots</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>Value</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Turnover</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>Value</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'># of Trades</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>Value</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Attended/Total</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>Value/Value</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Used Margin</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>Value</MDTypography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={true} lg={0.2} hidden={false}>
                        <Divider orientation='vertical' color='black'/>
                    </Grid>

                    <Grid item p={2} xs={12} lg={5.9}>
                        <MDTypography fontSize={16} fontWeight='bold' color='dark'>Yesterday's Position (Internship) - All Batches</MDTypography>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Gross P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>Value</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Brokerage</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>Value</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Net P&L</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>Value</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'>Open Lots</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>Value</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Running Lots</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>Value</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Turnover</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>Value</MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container mt={1}>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='left'># of Trades</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='left'>Value</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='center'>Attended/Total</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='center'>Value/Value</MDTypography>
                            </Grid>
                            <Grid item lg={4}>
                                <MDTypography color='text' fontSize={14} fontWeight='bold' display='flex' justifyContent='right'>Used Margin</MDTypography>
                                <MDTypography color='text' fontSize={12} display='flex' justifyContent='right'>Value</MDTypography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>

        <Grid container spacing={2} mt={1}>
            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"warning"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/internposition`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={20} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Intern Position</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check today's internship trades position here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Active Traders: <span style={{fontSize:11,fontWeight:700}}>10</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Active Batches: <span style={{fontSize:11,fontWeight:700}}>2</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>
                
            </Grid>

            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"success"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/internshipbatch`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={20} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Internship Batches</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check all internship batches here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Active Batches: <span style={{fontSize:11,fontWeight:700}}>10</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Completed Batches: <span style={{fontSize:11,fontWeight:700}}>10</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>

            </Grid>

            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"primary"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/college`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={20} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>College List</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check all college list here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Total Colleges: <span style={{fontSize:11,fontWeight:700}}>10</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Total Zones: <span style={{fontSize:11,fontWeight:700}}>5</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>

            </Grid>

            <Grid item lg={3}>
                    <MDButton 
                        variant="contained" 
                        color={"error"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/careerlist`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={20} style={{color:"white",paddingLeft:4,paddingRight:4,fontWeight:'bold'}}>Careers</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}} display="flex" alignContent="center" alignItems="center">
                                  <MDBox display="flex" flexDirection="column">
                                  <MDTypography fontSize={10} display="flex" justifyContent="flex-start" style={{color:"white",paddingLeft:4,paddingRight:4}}>Check all career openings here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Active Postings: <span style={{fontSize:11,fontWeight:700}}>4</span></MDTypography>
                              </Grid>
      
                              <Grid item xs={12} md={6} lg={6} mb={1} display="flex" justifyContent="right">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Total Postings: <span style={{fontSize:11,fontWeight:700}}>10</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>
            </Grid>
        </Grid>

        <Grid container spacing={2} mt={1}>
            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"primary"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/adminreport`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={18} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Internship Report</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check interns pnl report here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Current Month's P&L: <span style={{fontSize:11,fontWeight:700}}>10,000,000</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>
                
            </Grid>

            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"error"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/adminreportlive`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={18} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Company's Report(L)</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check company side live trades report here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Current Month's P&L: <span style={{fontSize:11,fontWeight:700}}>10,000,000</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>

            </Grid>

            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"warning"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/tradersReport`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={18} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Trader's Report(M)</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check trader side mock trades report here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Current Month's P&L: <span style={{fontSize:11,fontWeight:700}}>10,000,000</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>

            </Grid>

            <Grid item lg={3}>
                    
                    <MDButton 
                        variant="contained" 
                        color={"success"} 
                        size="small" 
                        component = {Link}
                        to={{
                            pathname: `/tradersReportLive`,
                          }}
                      >
                          <Grid container>
                              
                              <Grid item xs={12} md={6} lg={12} mt={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={18} style={{color:"white",paddingLeft:4,fontWeight:'bold'}}>Trader's Report(L)</MDTypography>
                              </Grid>
                              
                              <Grid item xs={12} md={6} lg={12} mb={2} style={{fontWeight:1000}}>
                                  <MDBox display='flex' justifyContent='left'>
                                  <MDTypography fontSize={10} style={{color:"white",paddingLeft:4}}>Check trader side live trades report here!</MDTypography>
                                  </MDBox>
                              </Grid>

                              <Grid item xs={12} md={6} lg={12} mb={1} display="flex" justifyContent="left">
                                  <MDTypography fontSize={9} style={{color:"white"}}>Current Month's P&L: <span style={{fontSize:11,fontWeight:700}}>10,000,000</span></MDTypography>
                              </Grid>
      
                          </Grid>
                    </MDButton>

            </Grid>
            
        </Grid>

        <Grid container spacing={2} mt={1}>
            <Grid item lg={3}>
                <MDBox p={2} bgColor='text' borderRadius={5}>
                    <MDTypography color='light' fontSize={15} fontWeight='bold'>Quick Links</MDTypography>
                    <Grid container spacing={1}>
                        <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"success"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/internshiporders`,
                                  }}
                            >
                                Internship Orders
                            </MDButton>
                        </Grid>
                        <Grid item fullWidth>
                            <MDButton 
                                variant="contained" 
                                color={"light"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/algobox`,
                                  }}
                            >
                                AlgoBox
                            </MDButton>
                        </Grid>
                        <Grid item>
                            <MDButton 
                                variant="contained" 
                                color={"primary"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/trading-accounts`,
                                  }}
                            >
                                Trading Account
                            </MDButton>
                        </Grid>
                        <Grid item>
                            <MDButton 
                                variant="contained" 
                                color={"error"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/instruments`,
                                  }}
                            >
                                Instruments
                            </MDButton>
                        </Grid>
                        <Grid item>
                            <MDButton 
                                variant="contained" 
                                color={"warning"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/setting`,
                                  }}
                            >
                                App Settings
                            </MDButton>
                        </Grid>
                        <Grid item>
                            <MDButton 
                                variant="contained" 
                                color={"dark"} 
                                size="small" 
                                component = {Link}
                                to={{
                                    pathname: `/tradersMarginAllocation`,
                                  }}
                            >
                                Margin Allocation
                            </MDButton>
                        </Grid>
                    </Grid>
                </MDBox>
                
            </Grid>
        </Grid>

    </MDBox>
  );
}