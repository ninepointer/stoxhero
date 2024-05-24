import { useState, useEffect, useContext } from "react";
import axios from "axios";
import MDBox from "../../../components/MDBox";
import Grid from "@mui/material/Grid";
// import { userContext } from "../../../AuthContext";
import MDTypography from "../../../components/MDTypography";
import { CircularProgress, LinearProgress, Paper } from "@mui/material";

//data
import DAU from "../data/DAUs";
import MAU from "../data/MAUs";
import WAU from "../data/WAUs";
// import DAUMAU from "../data/DAUMAU";
// import WAUMAU from "../data/WAUMAU";
import DAUPlatform from "../data/DAUPlatform";
import MAUPlatform from "../data/MAUPlatform";
import WAUPlatform from "../data/WAUPlatform";
import SignUpData from "../data/SignupData";
import RevenuePayout from "../data/RevenuePayout";
import {apiUrl} from '../../../constants/constants.js'
// import DailyKPI from "../data/DailyKPI";

export default function Dashboard() {
  const [dailyActiveUsersPlatform, setDailyActiveUsersPlatform] = useState([]);
  const [monthlyActiveUsersPlatform, setMonthlyActiveUsersPlatform] = useState([]);
  const [weeklyActiveUsersPlatform, setWeeklyActiveUsersPlatform] = useState([]);
  const [dailyActiveUsers, setDailyActiveUsers] = useState([]);
  const [monthlyActiveUsers, setMonthlyActiveUsers] = useState([]);
  const [weeklyActiveUsers, setWeeklyActiveUsers] = useState([]);
  const [rollingActiveUsers, setRollingActiveUsers] = useState([]);
  const [overallRevenue, setOverallRevenue] = useState([]);
  const [overallTradeInformation, setOverallTradeInformation] = useState([]);

  const [signupData, setSignupData] = useState([]);
  const [loading, setLoading] = useState({
    dailyActiveUsersPlatform: false,
    monthlyActiveUsersPlatform: false,
    weeklyActiveUsersPlatform: false,
    dailyActiveUsers: false,
    monthlyActiveUsers: false,
    weeklyActiveUsers: false,
    overallRevenue: false,
    user: false
  })

  async function dailyActiveUsersFunc(){
    setLoading(prev => ({ ...prev, dailyActiveUsers: true }));

    try{
      const data = await axios.get(
        `${apiUrl}stoxherouserdashboard/dailyactiveusers`,
        { withCredentials: true }
      );
      setDailyActiveUsers(data?.data?.data);
      setLoading(prev => ({ ...prev, dailyActiveUsers: false }));
    } catch(err){
      setLoading(prev => ({ ...prev, dailyActiveUsers: false }));
    }
  }

  async function MonthlyActiveUsersFunc(){
    setLoading(prev => ({ ...prev, monthlyActiveUsers: true }));

    try{
      const data = await axios.get(
        `${apiUrl}stoxherouserdashboard/monthlyactiveusers`,
        { withCredentials: true }
      );
      setMonthlyActiveUsers(data?.data?.data);
      setLoading(prev => ({ ...prev, monthlyActiveUsers: false }));
    } catch(err){
      setLoading(prev => ({ ...prev, monthlyActiveUsers: false }));
    }
  }

  async function WeeklyActiveUsersFunc(){
    setLoading(prev => ({ ...prev, weeklyActiveUsers: true }));

    try{
      const data = await axios.get(
        `${apiUrl}stoxherouserdashboard/weeklyactiveusers`,
        { withCredentials: true }
      );
      setWeeklyActiveUsers(data?.data?.data);
      setLoading(prev => ({ ...prev, weeklyActiveUsers: false }));
    } catch(err){
      setLoading(prev => ({ ...prev, weeklyActiveUsers: false }));
    }
  }

  async function dailyActiveUsersPlateformFunc(){
    setLoading(prev => ({ ...prev, dailyActiveUsersPlatform: true }));

    try{
      const data = await axios.get(
        `${apiUrl}stoxherouserdashboard/dailyactiveusersonplatform`,
        { withCredentials: true }
      );
      setDailyActiveUsersPlatform(data?.data?.data);
      setLoading(prev => ({ ...prev, dailyActiveUsersPlatform: false }));
    } catch(err){
      setLoading(prev => ({ ...prev, dailyActiveUsersPlatform: false }));
    }
  }

  async function montlyActiveUsersPlateformFunc(){
    setLoading(prev => ({ ...prev, monthlyActiveUsersPlatform: true }));

    try{
      const data = await axios.get(
        `${apiUrl}stoxherouserdashboard/monthlyactiveusersonplatform`,
        { withCredentials: true }
      );
      setMonthlyActiveUsersPlatform(data?.data?.data);
      setLoading(prev => ({ ...prev, monthlyActiveUsersPlatform: false }));
    } catch(err){
      setLoading(prev => ({ ...prev, monthlyActiveUsersPlatform: false }));
    }
  }

  async function weeklyActiveUsersPlateformFunc(){
    setLoading(prev => ({ ...prev, weeklyActiveUsersPlatform: true }));

    try{
      const data = await axios.get(
        `${apiUrl}stoxherouserdashboard/weeklyactiveusersonplatform`,
        { withCredentials: true }
      );
      setWeeklyActiveUsersPlatform(data?.data?.data);
      setLoading(prev => ({ ...prev, weeklyActiveUsersPlatform: false }));
    } catch(err){
      setLoading(prev => ({ ...prev, weeklyActiveUsersPlatform: false }));
    }
  }

  async function overallRevenueFunc(){
    setLoading(prev => ({ ...prev, overallRevenue: true }));

    try{
      const data = await axios.get(
        `${apiUrl}stoxherouserdashboard/overallrevenue`,
        { withCredentials: true }
      );
      setOverallRevenue(data?.data?.data);
      setLoading(prev => ({ ...prev, overallRevenue: false }));
    } catch(err){
      setLoading(prev => ({ ...prev, overallRevenue: false }));
    }
  }

  async function userAndTradeData() {
    setLoading(prev => ({ ...prev, user: true }));
    try{
      const signupData = await axios.get(`${apiUrl}signup/users`, {withCredentials: true});
      const tradeData = await axios.get(`${apiUrl}stoxherouserdashboard/overalltradeinformation`, {withCredentials: true});
      const activeUserData = await axios.get(`${apiUrl}stoxherouserdashboard/rollingactiveusersonplatform`, {withCredentials: true});

      setRollingActiveUsers(activeUserData?.data?.data);
      setOverallTradeInformation(tradeData?.data?.data);
      setSignupData(signupData?.data?.data);

      setLoading(prev => ({ ...prev, user: false }));
    } catch(err){
      setLoading(prev => ({ ...prev, user: false }));
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await overallRevenueFunc();
      await userAndTradeData();
      dailyActiveUsersFunc();
      dailyActiveUsersPlateformFunc();
      weeklyActiveUsersPlateformFunc();
      montlyActiveUsersPlateformFunc();
      MonthlyActiveUsersFunc();
      WeeklyActiveUsersFunc();
    };
  
    fetchData();
  }, []);

  return (
    <MDBox
      bgColor="light"
      color="light"
      mt={2}
      mb={1}
      borderRadius={10}
      minHeight="auto"
    >

      <Grid
        container
        component={Paper}
        p={0.5}
        mb={1}
        lg={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={12} lg={12}>
          {loading.user ? (
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              minHeight={400}
            >
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <CircularProgress color="info" />
              </MDBox>
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <MDTypography fontSize={15}>
                  Loading Account Data...
                </MDTypography>
              </MDBox>
            </MDBox>
          ) : (
            <MDBox>
              {signupData[0] && (
                <SignUpData
                  signupData={signupData}
                  rollingActiveUsers={rollingActiveUsers}
                  overallTradeInformation={overallTradeInformation}
                />
              )}
            </MDBox>
          )}
        </Grid>
      </Grid>

      <Grid
        container
        component={Paper}
        p={0.5}
        mb={1}
        lg={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={12} lg={12}>
          {loading.overallRevenue ? (
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              minHeight={400}
            >
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <CircularProgress color="info" />
              </MDBox>
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <MDTypography fontSize={15}>
                  Loading Account Data...
                </MDTypography>
              </MDBox>
            </MDBox>
          ) : (
            <MDBox>
              {overallRevenue["Amount Credit"] && (
                <RevenuePayout overallRevenue={overallRevenue} />
              )}
            </MDBox>
          )}
        </Grid>
      </Grid>

      <Grid
        container
        component={Paper}
        p={0.5}
        mb={1}
        xs={12}
        md={12}
        lg={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={12} lg={12}>
          {loading?.dailyActiveUsersPlatform ? (
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              minHeight={400}
            >
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <CircularProgress color="info" />
              </MDBox>
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <MDTypography fontSize={15}>
                  Loading Daily Unique Active Users Platform...
                </MDTypography>
              </MDBox>
            </MDBox>
          ) : (
            <DAUPlatform dailyActiveUsersPlatform={dailyActiveUsersPlatform} />
          )}
        </Grid>
      </Grid>

      <Grid
        container
        component={Paper}
        p={0.5}
        mb={1}
        xs={12}
        md={12}
        lg={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={12} lg={12}>
          {loading?.weeklyActiveUsersPlatform ? (
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              minHeight={400}
            >
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <CircularProgress color="info" />
              </MDBox>
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <MDTypography fontSize={15}>
                  Loading Weekly Unique Active Users Platform...
                </MDTypography>
              </MDBox>
            </MDBox>
          ) : (
            <WAUPlatform
              weeklyActiveUsersPlatform={weeklyActiveUsersPlatform}
            />
          )}
        </Grid>
      </Grid>

      <Grid
        container
        component={Paper}
        p={0.5}
        mb={1}
        xs={12}
        md={12}
        lg={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={12} lg={12}>
          {loading?.monthlyActiveUsersPlatform ? (
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              minHeight={400}
            >
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <CircularProgress color="info" />
              </MDBox>
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <MDTypography fontSize={15}>
                  Loading Monthly Unique Active Users Platform...
                </MDTypography>
              </MDBox>
            </MDBox>
          ) : (
            <MAUPlatform
              monthlyActiveUsersPlatform={monthlyActiveUsersPlatform}
            />
          )}
        </Grid>
      </Grid>

      <Grid
        container
        component={Paper}
        p={0.5}
        mb={1}
        xs={12}
        md={12}
        lg={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={12} lg={12}>
          {loading?.dailyActiveUsers ? (
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              minHeight={400}
            >
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <CircularProgress color="info" />
              </MDBox>
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <MDTypography fontSize={15}>
                  Loading Daily Unique Active Users Product...
                </MDTypography>
              </MDBox>
            </MDBox>
          ) : (
            <DAU dailyActiveUsers={dailyActiveUsers} />
          )}
        </Grid>
      </Grid>

      <Grid
        container
        component={Paper}
        p={0.5}
        mb={1}
        xs={12}
        md={12}
        lg={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={12} lg={12}>
          {loading?.weeklyActiveUsers ? (
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              minHeight={400}
            >
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <CircularProgress color="info" />
              </MDBox>
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <MDTypography fontSize={15}>
                  Loading Weekly Unique Active Users Product...
                </MDTypography>
              </MDBox>
            </MDBox>
          ) : (
            <WAU weeklyActiveUsers={weeklyActiveUsers} />
          )}
        </Grid>
      </Grid>

      <Grid
        container
        component={Paper}
        p={0.5}
        mb={1}
        xs={12}
        md={12}
        lg={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={12} lg={12}>
          {loading?.monthlyActiveUsers ? (
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              minHeight={400}
            >
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <CircularProgress color="info" />
              </MDBox>
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <MDTypography fontSize={15}>
                  Loading Monthly Unique Active Users Product...
                </MDTypography>
              </MDBox>
            </MDBox>
          ) : (
            <MAU monthlyActiveUsers={monthlyActiveUsers} />
          )}
        </Grid>
      </Grid>
    </MDBox>
  );
}
