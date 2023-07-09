import {useState, useEffect, useContext} from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
import Grid from "@mui/material/Grid";
import { userContext } from '../../../AuthContext';
import MDTypography from '../../../components/MDTypography';
import { Paper } from '@mui/material';

//data
import DAU from '../data/DAUs'
import MAU from '../data/MAUs'
import WAU from '../data/WAUs'
import DAUMAU from '../data/DAUMAU'
import WAUMAU from '../data/WAUMAU'
import DAUPlatform from '../data/DAUPlatform'
import MAUPlatform from '../data/MAUPlatform'


export default function Dashboard() {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let [dailyActiveUsersPlatform,setDailyActiveUsersPlatform] = useState([])
  let [monthlyActiveUsersPlatform,setMonthlyActiveUsersPlatform] = useState([])
  let [dailyActiveUsers,setDailyActiveUsers] = useState([])
  let [monthlyActiveUsers,setMonthlyActiveUsers] = useState([])
  let [weeklyActiveUsers,setWeeklyActiveUsers] = useState([])
  const getDetails = useContext(userContext);
  const userId = getDetails.userDetails._id
  
  useEffect(()=>{
    let call1 = axios.get((`${baseUrl}api/v1/stoxherouserdashboard/dailyactiveusers`),{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    let call2 = axios.get((`${baseUrl}api/v1/stoxherouserdashboard/monthlyactiveusers`),{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
            },
        })
    let call3 = axios.get((`${baseUrl}api/v1/stoxherouserdashboard/weeklyactiveusers`),{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
            },
        })
    let call4 = axios.get((`${baseUrl}api/v1/stoxherouserdashboard/dailyactiveusersonplatform`),{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
            },
        })
    let call5 = axios.get((`${baseUrl}api/v1/stoxherouserdashboard/monthlyactiveusersonplatform`),{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
            },
        })
    Promise.all([call1, call2, call3, call4, call5])
    .then(([api1Response, api1Response1, api1Response2, api1Response3, api1Response4]) => {
      console.log("Daily Active Users: ",api1Response.data.data)
      console.log("Monthly Active Users: ",api1Response1.data.data)
      console.log("Weekly Active Users: ",api1Response2.data.data)
      console.log("Daily Active Users Platofrm: ",api1Response3.data)
      console.log("Monthly Active Users Platofrm: ",api1Response4.data)
      setDailyActiveUsers(api1Response.data.data)
      setMonthlyActiveUsers(api1Response1.data.data)
      setWeeklyActiveUsers(api1Response2.data.data)
      setDailyActiveUsersPlatform(api1Response3.data.data)
      setMonthlyActiveUsersPlatform(api1Response4.data.data)
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
    
  },[])


  return (
   
    <MDBox bgColor="light" color="light" mt={2} mb={1} borderRadius={10} minHeight='auto'>
  
          <Grid container component={Paper} p={.5} mb={1} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={6} lg={12}>
                {/* <MDTypography>User Stickiness Metrics</MDTypography> */}
                {dailyActiveUsersPlatform && <DAUPlatform dailyActiveUsersPlatform={dailyActiveUsersPlatform}/>}
            </Grid>
          </Grid>

          <Grid container component={Paper} p={.5} mb={1} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={6} lg={12}>
                {/* <MDTypography>User Stickiness Metrics</MDTypography> */}
                {monthlyActiveUsersPlatform && <MAUPlatform monthlyActiveUsersPlatform={monthlyActiveUsersPlatform}/>}
            </Grid>
          </Grid>
          
          <Grid container component={Paper} p={.5} mb={1} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={6} lg={12}>
                {/* <MDTypography>User Stickiness Metrics</MDTypography> */}
                {dailyActiveUsers && <DAU dailyActiveUsers={dailyActiveUsers}/>}
            </Grid>
          </Grid>

          <Grid container component={Paper} p={.5} mb={1} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={6} lg={12}>
                {monthlyActiveUsers && <MAU monthlyActiveUsers={monthlyActiveUsers}/>}
            </Grid>
          </Grid>

          <Grid container component={Paper} p={.5} mb={1} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={6} lg={12}>
                {weeklyActiveUsers && <WAU weeklyActiveUsers={weeklyActiveUsers}/>}
            </Grid>
          </Grid>
           
          <Grid container spacing={1} mt={1} lg={12} style={{ height: '100%' }}>
            <Grid item xs={12} md={6} lg={12} style={{ height: '100%' }}>
              {/* <Summary style={{ height: '100%' }}/> */}
            </Grid>
            <Grid item xs={12} md={6} lg={12} style={{ height: '100%' }}>
              {/* <Performance tradingData={tradingData}/> */}
            </Grid>
          </Grid>

    </MDBox>
  );
}