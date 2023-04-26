import React, {useState} from 'react';
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import stock from "../../../assets/images/analyticspnl.png"

export default function PNLMetrics(traderType) {

  return (
   
    <Grid container spacing={3} display="flex" justifyContent="space-between">
        
            <Grid item xs={12} md={6} lg={3}>
            <MDButton variant="contained" color="light" size="small" style={{minWidth:"100%"}}>
                    <Grid  container spacing={1} display="flex" justifyContent="center" alignContent="center" alignItem="center">
                        <Grid item xs={12} md={6} lg={12}  display="flex" alignContent="center" alignItems="center">
                            <MDAvatar src={stock} size="sm" display="flex" justifyContent="left"/>
                            <MDBox ml={2} display="flex" flexDirection="column">
                              <MDTypography fontSize={15} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Today</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Gross P&L : 10000</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Brokerage: 1000</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Net P&L: 9000</MDTypography>
                            </MDBox>
                        </Grid>
                    </Grid>
            </MDButton>   
            </Grid>        

        
            <Grid item xs={12} md={6} lg={3} >
            <MDButton variant="contained" color="light" size="small" style={{minWidth:"100%"}}>
                    <Grid  container spacing={1} display="flex" justifyContent="center" alignContent="center" alignItem="center">
                        <Grid item xs={12} md={6} lg={12} display="flex" alignContent="center" alignItems="center">
                            <MDAvatar src={stock} size="sm" display="flex" justifyContent="left"/>
                            <MDBox ml={2} display="flex" flexDirection="column">
                              <MDTypography fontSize={15} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>This Month</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Gross P&L : 10000</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Brokerage: 1000</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Net P&L: 9000</MDTypography>
                            </MDBox>
                        </Grid>
                    </Grid>
            </MDButton>   
            </Grid>        

            <Grid item xs={12} md={6} lg={3} >
            <MDButton variant="contained" color="light" size="small" style={{minWidth:"100%"}}>
                    <Grid  container spacing={1} display="flex" justifyContent="center" alignContent="center" alignItem="center">
                        <Grid item xs={12} md={6} lg={12} display="flex" alignContent="center" alignItems="center">
                            <MDAvatar src={stock} size="sm" display="flex" justifyContent="left"/>
                            <MDBox ml={2} display="flex" flexDirection="column">
                              <MDTypography fontSize={15} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>This Year</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Gross P&L : 10000</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Brokerage: 1000</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Net P&L: 9000</MDTypography>
                            </MDBox>
                        </Grid>
                    </Grid>
            </MDButton>   
            </Grid>        


            <Grid item xs={12} md={6} lg={3} >
            <MDButton variant="contained" color="light" size="small" style={{minWidth:"100%"}}>
                    <Grid  container spacing={1} display="flex" justifyContent="center" alignContent="center" alignItem="center">
                        <Grid item xs={12} md={6} lg={12} display="flex" alignContent="center" alignItems="center">
                            <MDAvatar src={stock} size="sm" display="flex" justifyContent="left"/>
                            <MDBox ml={4} display="flex" flexDirection="column">
                              <MDTypography fontSize={15} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Lifetime</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Gross P&L : 10000</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Brokerage: 1000</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Net P&L: 9000</MDTypography>
                            </MDBox>
                        </Grid>
                    </Grid>
            </MDButton>   
            </Grid>        
    </Grid>
  );
}