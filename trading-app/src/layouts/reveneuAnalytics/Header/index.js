import {useState, useEffect, useContext} from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton'
import {Card, Grid} from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import { CircularProgress, LinearProgress, Paper } from '@mui/material';
import TotalRevenue from '../data/totalRevenue'
import CreationProcessChart from '../data/charts/creationProcessDonutChart'
import RevenueChannelSplit from '../data/charts/revenueSplitDonutChart'
import { saveAs } from 'file-saver';
import moment from 'moment'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AffiliateData from '../data/affiliateDetails'
import CareerData from '../data/careerDetails'
import CampaignData from '../data/campaignDetails'
import ReferralData from '../data/referralDetails'
import AutosignupData from '../data/autosignupDetails'
import { apiUrl } from '../../../constants/constants';

export default function Dashboard() {
  let [isLoading,setIsLoading] = useState(false)
  const [period,setPeriod] = useState("Today")


  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };


  return (
   
    <MDBox mt={2} mb={1} borderRadius={10} minHeight='auto' display='flex' justifyContent='center' alignItems='center' flexDirection='column'>

        {!isLoading ? 
          <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
              
              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
              
                <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1, backgroundColor:'white' }} >
                      
                          <Grid p={2} container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                            <Grid item p={1} xs={12} md={12} lg={8} display='flex' justifyContent='flex-start'>
                              <MDTypography variant="h6" style={{textAlign:'center'}}>Revenue Data</MDTypography>
                            </Grid>

                            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='flex-end' sx={{ minWidth: 120 }}>
                            <FormControl fullWidth sx={{mt:1}}>
                              <InputLabel id="demo-simple-select-label">Period</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={period}
                                label="Period"
                                sx={{minHeight:44}}
                                onChange={handlePeriodChange}
                              >
                                <MenuItem value={"Today"}>Today</MenuItem>
                                <MenuItem value={"Yesterday"}>Yesterday</MenuItem>
                                <MenuItem value={"This Month"}>This Month</MenuItem>
                                <MenuItem value={"Last Month"}>Last Month</MenuItem>
                                <MenuItem value={"Last 30 Days"}>Last 30 Days</MenuItem>
                                <MenuItem value={"Last 60 Days"}>Last 60 Days</MenuItem>
                                <MenuItem value={"Last 90 Days"}>Last 90 Days</MenuItem>
                                <MenuItem value={"Last 180 Days"}>Last 180 Days</MenuItem>
                              </Select>
                            </FormControl>
                            </Grid>

                          </Grid>
                        
                      </Card>
                    </Grid>
                </Grid>
    
              </Grid>


              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
              
                <Grid container spacing={0} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'auto'}}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                            {/* {betweenDateTotalRevenue &&  */}
                            <TotalRevenue 
                            // betweenDateRevenue={betweenDateRevenue} betweenDateTotalRevenue={betweenDateTotalRevenue} 
                            period={period}/>
                            {/* } */}
                    </Grid>
    
                </Grid>
    
              </Grid>

              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
              
                <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                    
                    <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
                      
                        <CreationProcessChart period={period}/>
                        
                    </Grid>

                    <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
                      
                        <RevenueChannelSplit period={period}/>
                        
                    </Grid>
                    
    
                </Grid>
    
              </Grid>

              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
              
                <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                    
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
                      
                        <AffiliateData period={period}/>
                        
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
                      
                        <CareerData period={period}/>
                        
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
                      
                        <CampaignData period={period}/>
                        
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
                      
                        <ReferralData period={period}/>
                        
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%', minHeight:'auto'}}>
                      
                        <AutosignupData period={period}/>
                        
                    </Grid>
                    
    
                </Grid>
    
              </Grid>
    
          </Grid>
          :
          <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{minWidth:'100%', minHeight:'380px'}}>
            <CircularProgress/>
          </Grid>
        }

    </MDBox>
  );
}