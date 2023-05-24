import React, {useContext, useEffect, useState} from 'react';
import { CircularProgress, Grid } from '@mui/material';
import axios from 'axios';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import stock from "../../../assets/images/analyticspnl.png";
import { apiUrl } from '../../../constants/constants';
import { NetPnlContext } from '../../../PnlContext';

export default function PNLMetrics({traderType, endpoint}) {

  const [overview, setOverview] = React.useState({});
  const todayPnl = useContext(NetPnlContext); 
  const[isLoading,setIsLoading] = useState(true)

  console.log("todayPnl", todayPnl)

  const getOverview = async()=>{
    const res = await axios.get(`${apiUrl}analytics/${endpoint}/myoverview`, {withCredentials: true});
   
    setOverview(prev=>res.data.data[0]);
    setTimeout(()=>setIsLoading(false),2000)
  }

  useEffect(()=>{
    getOverview();
  },[endpoint])

  console.log("overview", overview)

  return (
    
    
   
    <Grid container spacing={3} display="flex" justifyContent="space-between">
        
            <Grid item xs={12} md={6} lg={3}>
              
            <MDButton variant="contained" color="light" size="small" style={{minWidth:"100%"}}>
                    <Grid  container spacing={1} display="flex" justifyContent="center" alignContent="center" alignItem="center">
                        <Grid item xs={12} md={6} lg={12}  display="flex" alignContent="center" alignItems="center">
                            <MDAvatar src={stock} size="sm" display="flex" justifyContent="left"/>
                            <MDBox ml={2} display="flex" flexDirection="column">
                              <MDTypography fontSize={15} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Today</MDTypography>

                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Gross P&L : {overview ? overview?.grossPNLDaily >= 0 ? "₹"+ overview?.grossPNLDaily?.toFixed(2) : "-₹"+ (-overview?.grossPNLDaily?.toFixed(2)) : "+₹0.00"}</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Brokerage: {overview ? overview?.brokerageSumDaily >= 0 ? "₹"+ overview?.brokerageSumDaily?.toFixed(2) : "-₹"+ (-overview?.brokerageSumDaily?.toFixed(2)) : "+₹0.00"}</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Net P&L: {overview ? overview?.netPNLDaily >= 0 ? "₹"+ overview?.netPNLDaily?.toFixed(2) : "-₹"+ (-overview?.netPNLDaily?.toFixed(2)) : "+₹0.00"}</MDTypography>

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
                              {/* <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Gross P&L :₹{overview ? overview?.grossPNLMonthly?.toFixed(2)}</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Brokerage: ₹{overview ? overview?.brokerageSumMonthly?.toFixed(2)}</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Net P&L: ₹{overview ? overview?.netPNLMonthly?.toFixed(2)}</MDTypography> */}

                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Gross P&L : {overview ? overview?.grossPNLMonthly >= 0 ? "₹"+ overview?.grossPNLMonthly?.toFixed(2) : "-₹"+ (-overview?.grossPNLMonthly?.toFixed(2)) : "+₹0.00"}</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Brokerage: {overview ? overview?.brokerageSumMonthly >= 0 ? "₹"+ overview?.brokerageSumMonthly?.toFixed(2) : "-₹"+ (-overview?.brokerageSumMonthly?.toFixed(2)) : "+₹0.00"}</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Net P&L: {overview ? overview?.netPNLMonthly >= 0 ? "₹"+ overview?.netPNLMonthly?.toFixed(2) : "-₹"+ (-overview?.netPNLMonthly?.toFixed(2)) : "+₹0.00"}</MDTypography>

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
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Gross P&L : {overview ? overview?.grossPNLYearly >= 0 ? "₹"+ overview?.grossPNLYearly?.toFixed(2) : "-₹"+ (-overview?.grossPNLYearly?.toFixed(2)) : "+₹0.00"}</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Brokerage: {overview ? overview?.brokerageSumYearly >= 0 ? "₹"+ overview?.brokerageSumYearly?.toFixed(2) : "-₹"+ (-overview?.brokerageSumYearly?.toFixed(2)) : "+₹0.00"}</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Net P&L: {overview ? overview?.netPNLYearly >= 0 ? "₹"+ overview?.netPNLYearly?.toFixed(2) : "-₹"+ (-overview?.netPNLYearly?.toFixed(2)) : "+₹0.00"}</MDTypography>
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
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Gross P&L : {overview ? overview?.grossPNLLifetime >= 0 ? "₹"+ overview?.grossPNLLifetime?.toFixed(2) : "-₹"+ (-overview?.grossPNLLifetime?.toFixed(2)) : "+₹0.00"}</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Brokerage: {overview ? overview?.brokerageSumLifetime >= 0 ? "₹"+ overview?.brokerageSumLifetime?.toFixed(2) : "-₹"+ (-overview?.brokerageSumLifetime?.toFixed(2)) : "+₹0.00"}</MDTypography>
                              <MDTypography fontSize={10} fontWeight="bold" display="flex" justifyContent="left" style={{color:"black"}}>Net P&L: {overview ? overview?.netPNLLifetime >= 0 ? "₹"+ overview?.netPNLLifetime?.toFixed(2) : "-₹"+ (-overview?.netPNLLifetime?.toFixed(2)) : "+₹0.00"}</MDTypography>
                            </MDBox>
                        </Grid>
                    </Grid>
            </MDButton>   
            </Grid>        
    </Grid>

        
  );
}