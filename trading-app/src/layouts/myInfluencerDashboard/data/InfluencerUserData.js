import {useState, useEffect, useContext} from 'react';
import axios from "axios";
import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, CardContent, CardMedia, Divider, FormControl, Grid, InputLabel, Select } from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import logo from '../../../assets/images/logo1.jpeg'
import affiliate from '../../../assets/images/affiliate.jpg'

import { userContext } from '../../../AuthContext';
import { apiUrl } from '../../../constants/constants';
import { userRole, adminRole} from "../../../variables"
import DayWiseCount from './daywisecount'
import AnimationNumber from './animationNumber'
import moment from 'moment';

export default function InfluencerUserData({userData, setUserData}) {
  let [chartData,setChartData] = useState([])
  const getDetails = useContext(userContext);
  const userDetails = getDetails.userDetails

  useEffect(()=>{
    userDataFunc();
    userLast60DaysData();
  }, [])

  async function userDataFunc(){
    const data = await axios.get(`${apiUrl}influencer/userdata`, {withCredentials: true});
    setUserData(data?.data?.data);
  }

  async function userLast60DaysData(){
    const data = await axios.get(`${apiUrl}influencer/last60daysuserdata`, {withCredentials: true});
    setChartData(data?.data?.data?.map((elem)=>{
      return {joiningDate:moment(new Date(elem?._id)).format('DD MMM'),count:elem?.count}
    }));
  }

  console.log("userData", userData)


  return (
    <Card sx={{ minWidth: '100%', minHeight: '410px', maxWidth: '100%', maxHeight: 'auto', alignContent: 'center', alignItems: 'center' }}>
      <CardMedia
        component="img"
        alt="signup"
        height={userDetails?.role?.roleName === userRole ? "80" : "150"}
        image={userDetails?.role?.roleName === userRole ?
          (userDetails?.profilePhoto?.url || logo) :
          affiliate
        }
      />
      <CardContent style={{ mt: -1, width: '100%' }} display='flex' justifyContent='center'>
        <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
          {userDetails?.role?.roleName === userRole &&
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
              <MDTypography variant="h6" fontSize={15} gutterBottom style={{ textAlign: 'center' }}>
                {userDetails?.first_name + " " + userDetails?.last_name}
              </MDTypography>
            </Grid>}
          
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <MDTypography style={{ textAlign: 'center' }}>
             <AnimationNumber count={userData?.lifetimeCount}/>
            </MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <MDTypography fontSize={10} fontWeight="bold" color="text.secondary" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px', backgroundColor: 'lightgrey' }}>
              Traders
            </MDTypography>
          </Grid>

          <Grid mt={2} container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center' flexDirection='column'>
              <MDTypography fontSize={10} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px' }}>
                Today's Signups
              </MDTypography>
              <MDTypography fontSize={15} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px' }}>
                {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(userData?.todayCount || 0))}
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center' flexDirection='column'>
              <MDTypography fontSize={10} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px' }}>
                This Week's Signups
              </MDTypography>
              <MDTypography fontSize={15} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px' }}>
                {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(userData?.thisWeekCount || 0))}
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center' flexDirection='column'>
              <MDTypography fontSize={10} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px' }}>
                This Month's Signups
              </MDTypography>
              <MDTypography fontSize={15} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px' }}>
                {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(userData?.thisMonthCount || 0))}
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center' flexDirection='column'>
              <MDTypography fontSize={10} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px' }}>
                Lifetime Signups
              </MDTypography>
              <MDTypography fontSize={15} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px' }}>
                {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(userData?.lifetimeCount || 0))}
              </MDTypography>
            </Grid>
          </Grid>

          <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
            <Grid mt={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <DayWiseCount data={chartData}/>
            </Grid>
            <Grid mt={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <MDTypography fontSize={15} fontWeight="bold" color="info" gutterBottom style={{ textAlign: 'center', padding: '2.5px 5px 2.5px 5px', borderRadius: '3px' }}>
                Last 60 days signups
              </MDTypography>
            </Grid>
          </Grid>
        </Grid>

      </CardContent>
    </Card>
  );
}