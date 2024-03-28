import {useState, useEffect, useContext} from 'react';
import axios from "axios";
import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, CardContent, CardMedia, Divider, FormControl, Grid, InputLabel, Select } from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import MDBox from '../../../components/MDBox';
// import logo from '../../../assets/images/logo1.jpeg'
// import affiliate from '../../../assets/images/affiliate.jpg'

import { userContext } from '../../../AuthContext';
import { apiUrl } from '../../../constants/constants';
// import { Influencer, adminRole} from "../../../variables"
import DayWiseRevenueChart from './daywiseRevenueChart'
import AnimationNumber from './animationNumber'
import moment from 'moment';

export default function InfluencerRevenueData({normalUserRevenue, setNormalUserRevenue, influencerUserRevenue, setInfluencerUserRevenue}) {
  const [totalChartData,setTotalChartData] = useState([]);
  const [normalUserChartData,setNormalUserChartData] = useState([]);
  const [influencerUserChartData,setInfluencerUserChartData] = useState([]);

  useEffect(()=>{
    userDataFunc();
    revenueLast60DaysData();
  }, [])

  async function userDataFunc(){
    const data = await axios.get(`${apiUrl}influencer/revenuedata`, {withCredentials: true});
    setNormalUserRevenue(data?.data?.normalUser);
    setInfluencerUserRevenue(data?.data?.influencerUser)
  }

  async function revenueLast60DaysData(){
    const data = await axios.get(`${apiUrl}influencer/last60daysrevenuedata`, {withCredentials: true});
    setTotalChartData(data?.data?.data?.[0]?.total?.map((elem)=>{
      return {date:moment(new Date(elem?._id)).format('DD MMM'),data:elem?.earnings}
    }));
    setNormalUserChartData(data?.data?.data?.[0]?.normalUser?.map((elem)=>{
      return {date:moment(new Date(elem?._id)).format('DD MMM'),data:elem?.earnings}
    }));
    setInfluencerUserChartData(data?.data?.data?.[0]?.influencerUser?.map((elem)=>{
      return {date:moment(new Date(elem?._id)).format('DD MMM'),data:elem?.earnings}
    }));
  }



  return (
    <Card sx={{ minWidth: '100%', minHeight: '410px', maxWidth: '100%', maxHeight: 'auto', alignContent: 'center', alignItems: 'center' }}>
      <CardContent style={{ mt: -1, width: '100%' }} display='flex' justifyContent='center'>
        <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <MDTypography style={{ textAlign: 'center' }}>
             <AnimationNumber count={(influencerUserRevenue?.lifetimeEarnings + normalUserRevenue?.lifetimeEarnings)}/>
            </MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <MDTypography fontSize={10} fontWeight="bold" color="text.secondary" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px', backgroundColor: 'lightgrey' }}>
              Earning
            </MDTypography>
          </Grid>

          <Grid mt={2} container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center' flexDirection='column'>
              <MDBox>
                <MDTypography fontSize={13} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 0px 5px', borderRadius: '3px' }}>
                  Today's Earning
                </MDTypography>
                <MDTypography fontSize={18} fontWeig
                ht="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '0px 5px 2.5px 5px', borderRadius: '3px' }}>
                  {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((influencerUserRevenue?.todayEarning + normalUserRevenue?.todayEarning) || 0))}
                </MDTypography>
              </MDBox>

              <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' >
                <MDTypography fontSize={10} fontWeight="bold" color="#316494" style={{ textAlign: 'center', padding: '0px 5px 0px 5px', borderRadius: '3px' }}>
                Your Users Earning :
                </MDTypography>
                <MDTypography fontSize={15} fontWeight="bold" color="#316494" style={{ textAlign: 'center', padding: '0px 5px 0px 5px', borderRadius: '3px' }}>
                  {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(influencerUserRevenue?.todayEarning || 0))}
                </MDTypography>
              </MDBox>

              <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' >
                <MDTypography fontSize={10} fontWeight="bold" color="#316494" style={{ textAlign: 'center', padding: '0px 5px 0px 5px', borderRadius: '3px' }}>
                StoxHero Users Earning :
                </MDTypography>
                <MDTypography fontSize={15} fontWeight="bold" color="#316494" style={{ textAlign: 'center', padding: '0px 5px 0px 5px', borderRadius: '3px' }}>
                  {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(normalUserRevenue?.todayEarning || 0))}
                </MDTypography>
              </MDBox>

            </Grid>
            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center' flexDirection='column'>
              <MDBox>
                <MDTypography fontSize={13} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 0px 5px', borderRadius: '3px' }}>
                  This Week's Earning
                </MDTypography>
                <MDTypography fontSize={18} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '0px 5px 2.5px 5px', borderRadius: '3px' }}>
                  {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((influencerUserRevenue?.thisWeekEarning + normalUserRevenue?.thisWeekEarning) || 0))}
                </MDTypography>
              </MDBox>

              <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' >
                <MDTypography fontSize={10} fontWeight="bold" color="#316494" style={{ textAlign: 'center', padding: '0px 5px 0px 5px', borderRadius: '3px' }}>
                Your Users Earning :
                </MDTypography>
                <MDTypography fontSize={15} fontWeight="bold" color="#316494" style={{ textAlign: 'center', padding: '0px 5px 0px 5px', borderRadius: '3px' }}>
                  {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(influencerUserRevenue?.thisWeekEarning || 0))}
                </MDTypography>
              </MDBox>

              <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' >
                <MDTypography fontSize={10} fontWeight="bold" color="#316494" style={{ textAlign: 'center', padding: '0px 5px 0px 5px', borderRadius: '3px' }}>
                StoxHero Users Earning :
                </MDTypography>
                <MDTypography fontSize={15} fontWeight="bold" color="#316494" style={{ textAlign: 'center', padding: '0px 5px 0px 5px', borderRadius: '3px' }}>
                  {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(normalUserRevenue?.thisWeekEarning || 0))}
                </MDTypography>
              </MDBox>

            </Grid>
            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center' flexDirection='column'>
              <MDBox>
                <MDTypography fontSize={13} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 0px 5px', borderRadius: '3px' }}>
                  This Month's Earning
                </MDTypography>
                <MDTypography fontSize={18} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '0px 5px 2.5px 5px', borderRadius: '3px' }}>
                  {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((influencerUserRevenue?.thisMonthEarning + normalUserRevenue?.thisMonthEarning) || 0))}
                </MDTypography>
              </MDBox>

              <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' >
                <MDTypography fontSize={10} fontWeight="bold" color="#316494" style={{ textAlign: 'center', padding: '0px 5px 0px 5px', borderRadius: '3px' }}>
                Your Users Earning :
                </MDTypography>
                <MDTypography fontSize={15} fontWeight="bold" color="#316494" style={{ textAlign: 'center', padding: '0px 5px 0px 5px', borderRadius: '3px' }}>
                  {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(influencerUserRevenue?.thisMonthEarning || 0))}
                </MDTypography>
              </MDBox>

              <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' >
                <MDTypography fontSize={10} fontWeight="bold" color="#316494" style={{ textAlign: 'center', padding: '0px 5px 0px 5px', borderRadius: '3px' }}>
                StoxHero Users Earning :
                </MDTypography>
                <MDTypography fontSize={15} fontWeight="bold" color="#316494" style={{ textAlign: 'center', padding: '0px 5px 0px 5px', borderRadius: '3px' }}>
                  {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(normalUserRevenue?.thisMonthEarning || 0))}
                </MDTypography>
              </MDBox>

            </Grid>
            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center' flexDirection='column'>
              <MDBox>
                <MDTypography fontSize={13} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 0px 5px', borderRadius: '3px' }}>
                  Lifetime Earnings
                </MDTypography>
                <MDTypography fontSize={18} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '0px 5px 2.5px 5px', borderRadius: '3px' }}>
                  {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((influencerUserRevenue?.lifetimeEarnings + normalUserRevenue?.lifetimeEarnings) || 0))}
                </MDTypography>
              </MDBox>

              <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' >
                <MDTypography fontSize={10} fontWeight="bold" color="#316494" style={{ textAlign: 'center', padding: '0px 5px 0px 5px', borderRadius: '3px' }}>
                Your Users Earning :
                </MDTypography>
                <MDTypography fontSize={15} fontWeight="bold" color="#316494" style={{ textAlign: 'center', padding: '0px 5px 0px 5px', borderRadius: '3px' }}>
                  {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(influencerUserRevenue?.lifetimeEarnings || 0))}
                </MDTypography>
              </MDBox>

              <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' >
                <MDTypography fontSize={10} fontWeight="bold" color="#316494" style={{ textAlign: 'center', padding: '0px 5px 0px 5px', borderRadius: '3px' }}>
                StoxHero Users Earning :
                </MDTypography>
                <MDTypography fontSize={15} fontWeight="bold" color="#316494" style={{ textAlign: 'center', padding: '0px 5px 0px 5px', borderRadius: '3px' }}>
                  {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(normalUserRevenue?.lifetimeEarnings || 0))}
                </MDTypography>
              </MDBox>

            </Grid>
          </Grid>

          <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <Grid mt={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <DayWiseRevenueChart data={totalChartData} />
            </Grid>
            <Grid mt={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <MDTypography fontSize={15} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px' }}>
                Last 60 days total earnings
              </MDTypography>
            </Grid>
          </Grid>

          <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <Grid mt={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <DayWiseRevenueChart data={influencerUserChartData} />
            </Grid>
            <Grid mt={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <MDTypography fontSize={15} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px' }}>
                Last 60 days your users earnings
              </MDTypography>
            </Grid>
          </Grid>

          <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <Grid mt={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <DayWiseRevenueChart data={normalUserChartData} />
            </Grid>
            <Grid mt={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <MDTypography fontSize={15} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px' }}>
                Last 60 days stoxhero users earnings
              </MDTypography>
            </Grid>
          </Grid>
        </Grid>

      </CardContent>
    </Card>
  );
}