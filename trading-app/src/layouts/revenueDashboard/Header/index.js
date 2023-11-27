import {useState, useEffect, useContext} from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Divider, Grid } from '@mui/material';
import { userContext } from '../../../AuthContext';
import MDTypography from '../../../components/MDTypography';
import { CircularProgress, LinearProgress, Paper } from '@mui/material';
import TestZoneRevenueChart from '../data/testZoneRevenueChart'
import TenXRevenueChart from '../data/tenXRevenueChart'
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
  const [tenXMonthlyRevenue,setTenXMonthlyRevenue] = useState([])
  const [totalTenXRevenue,setTotalTenXRevenue] = useState([])
  
  
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
        setTestZoneMonthlyRevenue(api1Response.data.testZoneData)
        setTotalTestZoneRevenue(api1Response.data.totalTestZoneRevenue)
        setTenXMonthlyRevenue(api1Response.data.tenXData)
        setTotalTenXRevenue(api1Response.data.totalTenXRevenue)
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
   
    <MDBox mt={2} mb={1} borderRadius={10} minHeight='auto' display='flex' justifyContent='center' alignItems='center' flexDirection='column'>

        <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
            
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
            
              <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                    <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1, backgroundColor:'lightgrey' }} >
                      <CardActionArea>
                          <MDTypography variant="h6" style={{textAlign:'center'}}>Overall Revenue Data</MDTypography>
                      </CardActionArea>
                    </Card>
                  </Grid>
              </Grid>
  
            </Grid>

            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
            
              <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                          {totalTestZoneRevenue && <TotalRevenue totalTestZoneRevenue={totalTestZoneRevenue}/>}
                  </Grid>
  
              </Grid>
  
            </Grid>
  
            <Grid item xs={12} md={12} lg={8} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
            
              <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                  
                  <Grid item spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
                    
                      <TestZoneRevenueChart testZoneMonthlyRevenue={testZoneMonthlyRevenue}/>
                      
                  </Grid>
                  
  
              </Grid>
  
            </Grid>
  
        </Grid>

        <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
            
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
          
            <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                  <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1, backgroundColor:'lightgrey' }} >
                    <CardActionArea>
                        <MDTypography variant="h6" style={{textAlign:'center'}}>TestZone Revenue Data</MDTypography>
                    </CardActionArea>
                  </Card>
                </Grid>
            </Grid>

          </Grid>

          <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
          
            <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                        {totalTestZoneRevenue && <TotalRevenue totalTestZoneRevenue={totalTestZoneRevenue}/>}
                </Grid>

            </Grid>

          </Grid>

          <Grid item xs={12} md={12} lg={8} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
          
            <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                
                <Grid item spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
                  
                    <TestZoneRevenueChart testZoneMonthlyRevenue={testZoneMonthlyRevenue}/>
                    
                </Grid>
                

            </Grid>

          </Grid>

        </Grid>

        <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
            
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
          
            <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                  <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1, backgroundColor:'lightgrey' }} >
                    <CardActionArea>
                        <MDTypography variant="h6" style={{textAlign:'center'}}>TenX Revenue Data</MDTypography>
                    </CardActionArea>
                  </Card>
                </Grid>
            </Grid>

          </Grid>

          <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
          
            <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                        {totalTenXRevenue && <TenXRevenue totalTenXRevenue={totalTenXRevenue}/>}
                </Grid>

            </Grid>

          </Grid>

          <Grid item xs={12} md={12} lg={8} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
          
            <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                
                <Grid item spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
                  
                    <TenXRevenueChart tenXMonthlyRevenue={tenXMonthlyRevenue}/>
                    
                </Grid>
                

            </Grid>

          </Grid>

        </Grid>

        <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
            
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
          
            <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                  <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1, backgroundColor:'lightgrey' }} >
                    <CardActionArea>
                        <MDTypography variant="h6" style={{textAlign:'center'}}>MarginX Revenue Data</MDTypography>
                    </CardActionArea>
                  </Card>
                </Grid>
            </Grid>

          </Grid>
          <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
          
            <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                        {totalTestZoneRevenue && <TotalRevenue totalTestZoneRevenue={totalTestZoneRevenue}/>}
                </Grid>

            </Grid>

          </Grid>

          <Grid item xs={12} md={12} lg={8} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
          
            <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                
                <Grid item spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
                  
                    <TestZoneRevenueChart testZoneMonthlyRevenue={testZoneMonthlyRevenue}/>
                    
                </Grid>
                

            </Grid>

          </Grid>

        </Grid>

    </MDBox>
  );
}