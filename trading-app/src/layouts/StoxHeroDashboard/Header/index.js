import {useState, useEffect, useContext} from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
import Grid from "@mui/material/Grid";
import { userContext } from '../../../AuthContext';
import MDTypography from '../../../components/MDTypography';
import { CircularProgress, LinearProgress, Paper } from '@mui/material';

//data
import DAU from '../data/DAUs'
import MAU from '../data/MAUs'
import WAU from '../data/WAUs'
import DAUMAU from '../data/DAUMAU'
import WAUMAU from '../data/WAUMAU'
import DAUPlatform from '../data/DAUPlatform'
import MAUPlatform from '../data/MAUPlatform'
import WAUPlatform from '../data/WAUPlatform'
import SignUpData from '../data/SignupData'
import RevenuePayout from '../data/RevenuePayout'
import DailyKPI from '../data/DailyKPI'


export default function Dashboard() {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  let [dailyActiveUsersPlatform,setDailyActiveUsersPlatform] = useState([])
  let [monthlyActiveUsersPlatform,setMonthlyActiveUsersPlatform] = useState([])
  let [weeklyActiveUsersPlatform,setWeeklyActiveUsersPlatform] = useState([])
  let [dailyActiveUsers,setDailyActiveUsers] = useState([])
  let [monthlyActiveUsers,setMonthlyActiveUsers] = useState([])
  let [weeklyActiveUsers,setWeeklyActiveUsers] = useState([])
  let [rollingActiveUsers,setRollingActiveUsers] = useState([])
  let [overallRevenue,setOverallRevenue] = useState([])
  let [overallTradeInformation,setOverallTradeInformation] = useState([])
  
  let [signupData,setSignupData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const getDetails = useContext(userContext);
  const userId = getDetails.userDetails._id
  
  useEffect(()=>{
    setIsLoading(true)
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
    let call6 = axios.get((`${baseUrl}api/v1/stoxherouserdashboard/weeklyactiveusersonplatform`),{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
          },
      })
    let call7 = axios.get((`${baseUrl}api/v1/signup/users`),{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
    let call8 = axios.get((`${baseUrl}api/v1/stoxherouserdashboard/rollingactiveusersonplatform`),{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
          },
      })
    let call9 = axios.get((`${baseUrl}api/v1/stoxherouserdashboard/overalltradeinformation`),{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
          },
      })
    let call10 = axios.get((`${baseUrl}api/v1/stoxherouserdashboard/overallrevenue`),{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
          },
      })
    Promise.all([call1, call2, call3, call4, call5, call6, call7, call8, call9, call10])
    .then(([api1Response, api1Response1, api1Response2, api1Response3, api1Response4, api1Response5, api1Response6, api1Response7, api1Response8, api1Response9]) => {
      setDailyActiveUsers(api1Response.data.data)
      setMonthlyActiveUsers(api1Response1.data.data)
      setWeeklyActiveUsers(api1Response2.data.data)
      setDailyActiveUsersPlatform(api1Response3.data.data)
      setMonthlyActiveUsersPlatform(api1Response4.data.data)
      setWeeklyActiveUsersPlatform(api1Response5.data.data)
      setRollingActiveUsers(api1Response7.data.data)
      setOverallTradeInformation(api1Response8.data.data)
      setOverallRevenue(api1Response9.data.data)
      setSignupData(api1Response6.data.data)
      setTimeout(()=>{
        setIsLoading(false)
      },500)
      
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
    
  },[])


  return (
   
    <MDBox bgColor="light" color="light" mt={2} mb={1} borderRadius={10} minHeight='auto'>

          {/* <Grid container component={Paper} p={.5} mb={1} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={12}>
                {isLoading ?
                <MDBox display='flex' justifyContent='center' alignItems='center' flexDirection='column' minHeight={400}>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <CircularProgress color='info'/>
                  </MDBox>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <MDTypography fontSize={15}>Loading Daily KPI Data...</MDTypography>
                  </MDBox>
                </MDBox>
                :
                <MDBox>
                  <DailyKPI/>
                </MDBox>
                }
            </Grid>
          </Grid> */}

          <Grid container component={Paper} p={.5} mb={1} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={12}>
                {isLoading ?
                <MDBox display='flex' justifyContent='center' alignItems='center' flexDirection='column' minHeight={400}>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <CircularProgress color='info'/>
                  </MDBox>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <MDTypography fontSize={15}>Loading Account Data...</MDTypography>
                  </MDBox>
                </MDBox>
                :
                <MDBox>
                 {signupData[0] && <SignUpData signupData={signupData} rollingActiveUsers={rollingActiveUsers} overallTradeInformation={overallTradeInformation}/>}
                </MDBox>
                }
            </Grid>
          </Grid>

          <Grid container component={Paper} p={.5} mb={1} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={12}>
                {isLoading ?
                <MDBox display='flex' justifyContent='center' alignItems='center' flexDirection='column' minHeight={400}>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <CircularProgress color='info'/>
                  </MDBox>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <MDTypography fontSize={15}>Loading Account Data...</MDTypography>
                  </MDBox>
                </MDBox>
                :
                <MDBox>
                 {overallRevenue["Amount Credit"] && <RevenuePayout overallRevenue={overallRevenue}/>}
                </MDBox>
                }
            </Grid>
          </Grid>

          <Grid container component={Paper} p={.5} mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={12}>
                {isLoading ?
                <MDBox display='flex' justifyContent='center' alignItems='center' flexDirection='column' minHeight={400}>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <CircularProgress color='info'/>
                  </MDBox>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <MDTypography fontSize={15}>Loading Daily Unique Active Users Platform...</MDTypography>
                  </MDBox>
                </MDBox>
                :
                  <DAUPlatform dailyActiveUsersPlatform={dailyActiveUsersPlatform}/>
                }
            </Grid>
          </Grid>

          <Grid container component={Paper} p={.5} mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={12}>
                {isLoading ?
                  <MDBox display='flex' justifyContent='center' alignItems='center' flexDirection='column' minHeight={400}>
                    <MDBox display='flex' justifyContent='center' alignItems='center'>
                      <CircularProgress color='info'/>
                    </MDBox>
                    <MDBox display='flex' justifyContent='center' alignItems='center'>
                      <MDTypography fontSize={15}>Loading Weekly Unique Active Users Platform...</MDTypography>
                    </MDBox>
                  </MDBox>
                : 
                  <WAUPlatform weeklyActiveUsersPlatform={weeklyActiveUsersPlatform}/>
                }
            </Grid>
          </Grid>

          <Grid container component={Paper} p={.5} mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={12}>
                {isLoading ? 
                  <MDBox display='flex' justifyContent='center' alignItems='center' flexDirection='column' minHeight={400}>
                    <MDBox display='flex' justifyContent='center' alignItems='center'>
                      <CircularProgress color='info'/>
                    </MDBox>
                    <MDBox display='flex' justifyContent='center' alignItems='center'>
                      <MDTypography fontSize={15}>Loading Monthly Unique Active Users Platform...</MDTypography>
                    </MDBox>
                  </MDBox>
                : 
                <MAUPlatform monthlyActiveUsersPlatform={monthlyActiveUsersPlatform}/>
                }
            </Grid>
          </Grid>
          
          <Grid container component={Paper} p={.5} mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={12}>
                {isLoading ?
                <MDBox display='flex' justifyContent='center' alignItems='center' flexDirection='column' minHeight={400}>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <CircularProgress color='info'/>
                  </MDBox>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <MDTypography fontSize={15}>Loading Daily Unique Active Users Product...</MDTypography>
                  </MDBox>
                </MDBox>
                :  
                  <DAU dailyActiveUsers={dailyActiveUsers}/>
                }
            </Grid>
          </Grid>

          <Grid container component={Paper} p={.5} mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={12}>
                {isLoading ? 
                <MDBox display='flex' justifyContent='center' alignItems='center' flexDirection='column' minHeight={400}>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <CircularProgress color='info'/>
                  </MDBox>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <MDTypography fontSize={15}>Loading Weekly Unique Active Users Product...</MDTypography>
                  </MDBox>
                </MDBox>
                : 
                  <WAU weeklyActiveUsers={weeklyActiveUsers}/>
                }
            </Grid>
          </Grid>

          <Grid container component={Paper} p={.5} mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={12}>
                {isLoading ?
                <MDBox display='flex' justifyContent='center' alignItems='center' flexDirection='column' minHeight={400}>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <CircularProgress color='info'/>
                  </MDBox>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <MDTypography fontSize={15}>Loading Monthly Unique Active Users Product...</MDTypography>
                  </MDBox>
                </MDBox>
              : 
                <MAU monthlyActiveUsers={monthlyActiveUsers}/>
                }
            </Grid>
          </Grid>
           
          <Grid container spacing={1} mt={1} xs={12} md={12} lg={12} style={{ height: '100%' }}>
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