import {useState, useEffect, useContext} from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
import Grid from "@mui/material/Grid";
import { userContext } from '../../../AuthContext';
import MDTypography from '../../../components/MDTypography';
import { CircularProgress, LinearProgress, Paper } from '@mui/material';
import TestZoneRevenueChart from '../data/testZoneRevenueChart'
import TestZoneRevenue from '../data/totalTestZoneRevenue'
import MarginXRevenue from '../data/totalMarginXRevenue'
import BattleRevenue from '../data/totalBattleRevenue'
import TenXRevenue from '../data/totalTenXRevenue'
import TotalRevenue from '../data/totalRevenue'

export default function Dashboard() {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let [isLoading,setIsLoading] = useState([])
  const [testZoneMonthlyRevenue,setTestZoneMonthlyRevenue] = useState([])
  const [totalTestZoneRevenue,setTotalTestZoneRevenue] = useState([])
  
  
  useEffect(()=>{
    setIsLoading(true)
    let call1 = axios.get((`${baseUrl}api/v1/revenue/gettestzonerevenue`),{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    Promise.all([call1])
    .then(([api1Response]) => {
        setTestZoneMonthlyRevenue(api1Response.data.data)
        setTotalTestZoneRevenue(api1Response.data.totalRevenue)
      setTimeout(()=>{
        setIsLoading(false)
      },500)
      
    })
    .catch((error) => {
    //   Handle errors here
      console.error(error);
    });
    
  },[])


  return (
   
    <MDBox mt={2} mb={1} borderRadius={10} minHeight='auto' display='flex' justifyContent='center' alignItems='center'>

        <Grid container spacing={1} mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} display='flex' justifyContent='center' alignItems='center' style={{maxWidth:'100%', height:'auto'}}>
                    {totalTestZoneRevenue && <TotalRevenue totalTestZoneRevenue={totalTestZoneRevenue}/>}
            </Grid>
            
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} display='flex' justifyContent='center' alignItems='center' style={{maxWidth:'100%', height:'auto'}}>
                    {totalTestZoneRevenue && <TestZoneRevenue totalTestZoneRevenue={totalTestZoneRevenue}/>}
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} display='flex' justifyContent='center' alignItems='center' style={{maxWidth:'100%', height:'auto'}}>
                    {totalTestZoneRevenue && <TenXRevenue totalTestZoneRevenue={totalTestZoneRevenue}/>}
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} display='flex' justifyContent='center' alignItems='center' style={{maxWidth:'100%', height:'auto'}}>
                    {totalTestZoneRevenue && <MarginXRevenue totalTestZoneRevenue={totalTestZoneRevenue}/>}  
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} display='flex' justifyContent='center' alignItems='center' style={{maxWidth:'100%', height:'auto'}}>
                    {totalTestZoneRevenue && <BattleRevenue totalTestZoneRevenue={totalTestZoneRevenue}/>}  
            </Grid>

            {/* <Grid item xs={12} md={12} lg={8}>
                {isLoading ?
                <MDBox display='flex' justifyContent='center' alignItems='center' flexDirection='column' minHeight={400}>
                    <MDBox display='flex' justifyContent='center' alignItems='center'>
                        <CircularProgress color='info'/>
                    </MDBox>
                    <MDBox display='flex' justifyContent='center' alignItems='center'>
                        <MDTypography fontSize={15}>Loading TestZone Revenue Data...</MDTypography>
                    </MDBox>
                </MDBox>
                :
                <MDBox>
                    {testZoneMonthlyRevenue && <TestZoneRevenueChart testZoneMonthlyRevenue={testZoneMonthlyRevenue}/>}
                </MDBox>
                }
            </Grid> */}
        </Grid>

    </MDBox>
  );
}