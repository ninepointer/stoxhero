import React, {useState, useEffect} from 'react'
import axios from "axios";
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDAvatar from '../../../components/MDAvatar';
import todaysignup from '../../../assets/images/todaysignup.png'
import netpnlicon from '../../../assets/images/netpnlicon.png'

export default function LabTabs() {
  const [today, setToday] = React.useState([]);
  const [todayCount, setTodayCount] = React.useState(0);
  const [yesterday,setYesterday] = useState([]);
  const [yesterdayCount, setYesterdayCount] = React.useState(0);
  const [thisMonth, setThisMonth] = React.useState([]);
  const [thisMonthCount, setThisMonthCount] = React.useState(0);
  const [allUsers, setAllUsers] = React.useState([]);
  const [allUsersCount, setAllUsersCount] = React.useState(0);
  
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"


  useEffect(()=>{
  

    let call1 = axios.get(`${baseUrl}api/v1/newusertoday`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })

    let call2 = axios.get(`${baseUrl}api/v1/newuseryesterday`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })

    let call3 = axios.get(`${baseUrl}api/v1/newuserthismonth`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
            },
        })

    let call4 = axios.get(`${baseUrl}api/v1/allusers`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
            },
        })

    Promise.all([call1, call2, call3, call4])
    .then(([api1Response, api2Response, api3Response, api4Response]) => {
      // Process the responses here
      console.log(api1Response.data);
      console.log(api2Response.data);
      setToday(api1Response.data.data)
      setTodayCount(api1Response.data.count);
      setYesterday(api2Response.data.data);
      setYesterdayCount(api2Response.data.count);
      setThisMonth(api3Response.data.data)
      setThisMonthCount(api3Response.data.count);
      setAllUsers(api4Response.data.data)
      setAllUsersCount(api4Response.data.count);
    
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });


  },[])

  console.log(thisMonth)
  return (
   <>
    <Grid container spacing={3} mb={1}>
        
        <Grid item xs={12} md={6} lg={3}>
          <MDBox bgColor="light" borderRadius={5} p={2} display="flex" justifyContent="space-between" alignContent='center' alignItems='center'>
              <Grid container display="flex" justifyContent="space-between" alignContent='center' alignItems='center'>

                <Grid item xs={12} md={6} lg={3}>
                  <MDAvatar src={todaysignup} size="sm"/>
                </Grid>
           
                <Grid item xs={12} md={6} lg={9}>
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">New Users (Today)</MDTypography>
                  <MDBox display="flex">
                    <MDTypography fontSize={13}>{todayCount}</MDTypography>
                  </MDBox>
                </Grid>

              </Grid>
          </MDBox>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <MDBox bgColor="light" borderRadius={5} p={2} display="flex" justifyContent="space-between" alignContent='center' alignItems='center'>
              <Grid container display="flex" justifyContent="space-between" alignContent='center' alignItems='center'>

                <Grid item xs={12} md={6} lg={3}>
                  <MDAvatar src={todaysignup} size="sm"/>
                </Grid>
           
                <Grid item xs={12} md={6} lg={9}>
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">New Users (Yesterday)</MDTypography>
                  <MDBox display="flex">
                    <MDTypography fontSize={13}>{yesterdayCount}</MDTypography>
                  </MDBox>
                </Grid>

              </Grid>
          </MDBox>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <MDBox bgColor="light" borderRadius={5} p={2} display="flex" justifyContent="space-between" alignContent='center' alignItems='center'>
              <Grid container display="flex" justifyContent="space-between" alignContent='center' alignItems='center'>

                <Grid item xs={12} md={6} lg={3}>
                  <MDAvatar src={todaysignup} size="sm"/>
                </Grid>
           
                <Grid item xs={12} md={6} lg={9}>
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">New Users (This Month)</MDTypography>
                  <MDBox display="flex">
                    <MDTypography fontSize={13}>{thisMonthCount}</MDTypography>
                  </MDBox>
                </Grid>
              
              </Grid>
          </MDBox>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <MDBox bgColor="light" borderRadius={5} p={2} display="flex" justifyContent="space-between" alignContent='center' alignItems='center'>
              <Grid container display="flex" justifyContent="space-between" alignContent='center' alignItems='center'>

                <Grid item xs={12} md={6} lg={3}>
                  <MDAvatar src={todaysignup} size="sm"/>
                </Grid>
           
                <Grid item xs={12} md={6} lg={9}>
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Total Users</MDTypography>
                  <MDBox display="flex">
                    <MDTypography fontSize={13}>{allUsersCount}</MDTypography>
                  </MDBox>
                </Grid>

              </Grid>
          </MDBox>
        </Grid>
    
    </Grid>

    <MDBox bgColor='light' mt={2} borderRadius={5}>
        <MDTypography color="dark" fontWeight='bold' align='center' fontSize={13}>New User (Today)</MDTypography>
    </MDBox>
    <Grid mt={2} p={1} container style={{border:'1px solid white', borderRadius:5}}>
        <Grid item xs={12} md={2} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Full Name</MDTypography>
        </Grid>
        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="left" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold">Email Id</MDTypography>
        </Grid>
        <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold">Mobile No.</MDTypography>
        </Grid>
        <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold">Referred By/Campaign</MDTypography>
        </Grid>
        <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold">Joining Date</MDTypography>
        </Grid>
        <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold">Joining Time</MDTypography>
        </Grid>
    </Grid>

    {today?.map((elem)=>{
           
            return (
            <Grid mt={1} p={1} container style={{border:'1px solid white', borderRadius:5}}>
                <Grid item xs={12} md={2} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13} display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.first_name} {elem?.last_name}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13}>{elem?.email}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13}>{elem?.mobile}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13}>{elem?.referredBy ? (elem?.referredBy?.first_name + ' ' + elem?.referredBy?.last_name) : elem?.campaign?.campaignName}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13}>{new Date(elem?.joining_date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color='light' fontSize={13}>{(new Date(elem?.joining_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata',hour12: true, timeStyle: 'medium' }).toUpperCase())}</MDTypography>
                </Grid>
            </Grid>
            )
            })}

    <MDBox bgColor='light' mt={2} borderRadius={5}>
        <MDTypography color="dark" fontWeight='bold' align='center' fontSize={13}>New User (Yesterday)</MDTypography>
    </MDBox>
    <Grid mt={2} p={1} container style={{border:'1px solid white', borderRadius:5}}>
        <Grid item xs={12} md={2} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Full Name</MDTypography>
        </Grid>
        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="left" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold">Email Id</MDTypography>
        </Grid>
        <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold">Mobile No.</MDTypography>
        </Grid>
        <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold">Referred By</MDTypography>
        </Grid>
        <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold">Joining Date</MDTypography>
        </Grid>
        <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold">Joining Time</MDTypography>
        </Grid>
    </Grid>

    {yesterday?.map((elem)=>{
           
            return (
            <Grid mt={1} p={1} container style={{border:'1px solid white', borderRadius:5}}>
                <Grid item xs={12} md={2} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13} display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.first_name} {elem?.last_name}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13}>{elem?.email}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13}>{elem?.mobile}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13}>{elem?.referredBy ? (elem?.referredBy?.first_name + ' ' + elem?.referredBy?.last_name) : elem?.campaign?.campaignName}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13}>{new Date(elem?.joining_date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color='light' fontSize={13}>{(new Date(elem?.joining_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata',hour12: true, timeStyle: 'medium' }).toUpperCase())}</MDTypography>
                </Grid>
            </Grid>
            )
            })}

    <MDBox bgColor='light' mt={2} borderRadius={5}>
        <MDTypography color="dark" fontWeight='bold' align='center' fontSize={13}>New User (This Month)</MDTypography>
    </MDBox>
    <Grid mt={2} p={1} container style={{border:'1px solid white', borderRadius:5}}>
        <Grid item xs={12} md={2} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Full Name</MDTypography>
        </Grid>
        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="left" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold">Email Id</MDTypography>
        </Grid>
        <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold">Mobile No.</MDTypography>
        </Grid>
        <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold">Referred By</MDTypography>
        </Grid>
        <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold">Joining Date</MDTypography>
        </Grid>
        <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
        <MDTypography color="light" fontSize={13} fontWeight="bold">Joining Time</MDTypography>
        </Grid>
    </Grid>

    {thisMonth?.map((elem)=>{
           
            return (
            <Grid mt={1} p={1} container style={{border:'1px solid white', borderRadius:5}}>
                <Grid item xs={12} md={2} lg={2.5} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13} display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.first_name} {elem?.last_name}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13}>{elem?.email}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13}>{elem?.mobile}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13}>{elem?.referredBy ? (elem?.referredBy?.first_name + ' ' + elem?.referredBy?.last_name) : elem?.campaign?.campaignName}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13}>{new Date(elem?.joining_date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color='light' fontSize={13}>{(new Date(elem?.joining_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata',hour12: true, timeStyle: 'medium' }).toUpperCase())}</MDTypography>
                </Grid>
            </Grid>
            )
            })}
    </>
  );
}