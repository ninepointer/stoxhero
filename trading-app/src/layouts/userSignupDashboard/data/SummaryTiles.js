import React, {useState, useEffect} from 'react'
import axios from "axios";
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDAvatar from '../../../components/MDAvatar';
import todaysignup from '../../../assets/images/todaysignup.png'
import netpnlicon from '../../../assets/images/netpnlicon.png';
import FilteredUsers from '../data/filteredUser';
import MDButton from '../../../components/MDButton';

export default function LabTabs() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [today, setToday] = React.useState([]);
  const [todayCount, setTodayCount] = React.useState(0);
  const [yesterday,setYesterday] = useState([]);
  const [yesterdayCount, setYesterdayCount] = React.useState(0);
  const [thisMonth, setThisMonth] = React.useState([]);
  const [thisMonthCount, setThisMonthCount] = React.useState(0);
  const [allUsers, setAllUsers] = React.useState([]);
  const [allUsersCount, setAllUsersCount] = React.useState(0);
  const [referralsCountToday, setReferralsCountToday] = React.useState(0);
  const [referralsCountYesterday, setReferralsCountYesterday] = React.useState(0);
  const [referralsCountThisMonth, setReferralsCountThisMonth] = React.useState(0);
  const [referralsCountAll, setReferralsCountAll] = React.useState(0);
  const [campaignCountToday, setCampaignCountToday] = React.useState(0);
  const [campaignCountYesterday, setCampaignCountYesterday] = React.useState(0);
  const [campaignCountThisMonth, setCampaignCountThisMonth] = React.useState(0);
  const [campaignCountAll, setCampaignCountAll] = React.useState(0);
  const [beginnerCount, setBeginnerCount] = React.useState(0);
  const [intermediateCount, setIntermediateCount] = React.useState(0);
  const [proCount, setProCount] = React.useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [data,setData] = useState([]);

  const perPage = 10;

  console.log('this is data', data);
  
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"


  useEffect(()=>{
  
    setIsLoading(true);
    console.log("IsLoading: ",isLoading)
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
    
    let call5 = axios.get(`${baseUrl}api/v1/newuserreferralstoday`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
          },
      })

    let call6 = axios.get(`${baseUrl}api/v1/newuserreferralsyesterday`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
          },
      })
    
    let call7 = axios.get(`${baseUrl}api/v1/newuserreferralsthismonth`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
          },
      })

    let call8 = axios.get(`${baseUrl}api/v1/allreferralsusers`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
          },
      })

    let call9 = axios.get(`${baseUrl}api/v1/newusercampaigntoday`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
          },
      })

    let call10 = axios.get(`${baseUrl}api/v1/newusercampaignyesterday`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
          },
      })
    
    let call11 = axios.get(`${baseUrl}api/v1/newusercampaignthismonth`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
          },
      })

    let call12 = axios.get(`${baseUrl}api/v1/allcampaignusers`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
          },
      })

    let call13 = axios.get(`${baseUrl}api/v1/tenx/beginner`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
          },
      })

    let call14 = axios.get(`${baseUrl}api/v1/tenx/intermediate`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
          },
      })

    let call15 = axios.get(`${baseUrl}api/v1/tenx/pro`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
          },
      })

    Promise.all([call1, call2, call3, call4, call5, call6, call7, call8, call9, call10, call11, call12, call13, call14, call15])
    .then(([api1Response, api2Response, api3Response, api4Response, api5Response, api6Response, api7Response, api8Response, api9Response, api10Response, api11Response, api12Response, api13Response, api14Response, api15Response]) => {
      // Process the responses here
      setIsLoading(true)
      console.log(api13Response.data);
      console.log(api14Response.data);
      setToday(api1Response.data.data)
      setTodayCount(api1Response.data.count);
      // setYesterday(api2Response.data.data);
      setYesterdayCount(api2Response.data.count);
      // setThisMonth(api3Response.data.data)
      setThisMonthCount(api3Response.data.count);
      setAllUsers(api4Response.data.data)
      setAllUsersCount(api4Response.data.count);
      setReferralsCountToday(api5Response.data.count);
      setReferralsCountYesterday(api6Response.data.count);
      setReferralsCountThisMonth(api7Response.data.count);
      setReferralsCountAll(api8Response.data.count);
      setCampaignCountToday(api9Response.data.count);
      setCampaignCountYesterday(api10Response.data.count);
      setCampaignCountThisMonth(api11Response.data.count);
      setCampaignCountAll(api12Response.data.count);
      setBeginnerCount(api13Response.data.results);
      setIntermediateCount(api14Response.data.results);
      setProCount(api15Response.data.results);
      const startIndex = (currentPage - 1) * perPage;
      const slicedData = api1Response.data.data.slice(startIndex, startIndex + perPage);
      setData(slicedData);
      setIsLoading(false);
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
    
  },[])
  useEffect(()=>{
    const startIndex = (currentPage - 1) * perPage;
    const slicedData = today.slice(startIndex, startIndex + perPage);
    setData(slicedData);
  }, [currentPage])

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  // console.log(thisMonth)
  console.log("IsLoading: ",isLoading)
  console.log("Beginner: ",beginnerCount)
  console.log("Intermediate: ",intermediateCount)
  return (
    <>
    {isLoading ?
        <MDBox display="flex" justifyContent="center" alignItems="center" mt={10} mb={10}>
          <CircularProgress fontSize='xxl' color="light" />
        </MDBox>

      :
    
        <>
      <Grid container spacing={2} mb={1}>
          
          <Grid item xs={12} md={6} lg={3}>
            <MDBox bgColor="light" borderRadius={5} p={2} display="flex" justifyContent="space-between" alignContent='center' alignItems='center'>
                <Grid container display="flex" justifyContent="space-between" alignContent='center' alignItems='center'>

                  <Grid item xs={12} md={6} lg={3}>
                    <MDAvatar src={todaysignup} size="sm"/>
                  </Grid>
            
                  <Grid item xs={12} md={6} lg={9}>
                    <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">New Users (Today)</MDTypography>
                    <MDBox display="flex">
                      <MDTypography fontWeight='bold' fontSize={15}>{todayCount}</MDTypography>
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
                      <MDTypography fontWeight='bold' fontSize={15}>{yesterdayCount}</MDTypography>
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
                      <MDTypography fontWeight='bold' fontSize={15}>{thisMonthCount}</MDTypography>
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
                      <MDTypography fontWeight='bold' fontSize={15}>{allUsersCount}</MDTypography>
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
                    <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Referrals (Today)</MDTypography>
                    <MDBox display="flex">
                      <MDTypography fontWeight='bold' fontSize={15}>{referralsCountToday}</MDTypography>
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
                    <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Referrals (Yesterday)</MDTypography>
                    <MDBox display="flex">
                      <MDTypography fontWeight='bold' fontSize={15}>{referralsCountYesterday}</MDTypography>
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
                    <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Referrals (This Month)</MDTypography>
                    <MDBox display="flex">
                      <MDTypography fontWeight='bold' fontSize={15}>{referralsCountThisMonth}</MDTypography>
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
                    <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Total Referrals</MDTypography>
                    <MDBox display="flex">
                      <MDTypography fontWeight='bold' fontSize={15}>{referralsCountAll}</MDTypography>
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
                    <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Campaigns (Today)</MDTypography>
                    <MDBox display="flex">
                      <MDTypography fontWeight='bold' fontSize={15}>{campaignCountToday}</MDTypography>
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
                    <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Campaigns (Yesterday)</MDTypography>
                    <MDBox display="flex">
                      <MDTypography fontWeight='bold' fontSize={15}>{campaignCountYesterday}</MDTypography>
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
                    <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Campaigns (This Month)</MDTypography>
                    <MDBox display="flex">
                      <MDTypography fontWeight='bold' fontSize={15}>{campaignCountThisMonth}</MDTypography>
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
                    <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Campaigns (Total)</MDTypography>
                    <MDBox display="flex">
                      <MDTypography fontWeight='bold' fontSize={15}>{campaignCountAll}</MDTypography>
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
                    <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Subscription (B)</MDTypography>
                    <MDBox display="flex">
                      <MDTypography fontWeight='bold' fontSize={15}>{beginnerCount}</MDTypography>
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
                    <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Subscription (I)</MDTypography>
                    <MDBox display="flex">
                      <MDTypography fontWeight='bold' fontSize={15}>{intermediateCount}</MDTypography>
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
                    <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Subscription (P)</MDTypography>
                    <MDBox display="flex">
                      <MDTypography fontWeight='bold' fontSize={15}>{proCount}</MDTypography>
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
                    <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Subscriptions (Total)</MDTypography>
                    <MDBox display="flex">
                      <MDTypography fontWeight='bold' fontSize={15}>{beginnerCount + intermediateCount + proCount}</MDTypography>
                    </MDBox>
                  </Grid>

                </Grid>
            </MDBox>
          </Grid> 

      </Grid>
      <Grid mt={2} p={1} container style={{border:'1px solid white', borderRadius:5}}>
        <FilteredUsers/>
      </Grid>
      <MDBox bgColor='light' mt={2} borderRadius={5}>
          <MDTypography color="dark" fontWeight='bold' align='center' fontSize={13}>New User (Today)</MDTypography>
      </MDBox>
      <Grid mt={2} p={1} container style={{border:'1px solid white', borderRadius:5}}>
          <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="left" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Full Name</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={2.8} display="flex" justifyContent="left" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">Email Id</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">Mobile No.</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">Referred By/Campaign</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">SignUp Method</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.8} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">Joining Date</MDTypography>
          </Grid>
      </Grid>

      {data?.map((elem)=>{
            
              return (
              <Grid mt={1} p={1} container style={{border:'1px solid white', borderRadius:5}}>
                  <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13} display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.first_name} {elem?.last_name}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2.8} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13}>{elem?.email}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13}>{elem?.mobile}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13}>{elem?.referredBy ? (elem?.referredBy?.first_name + ' ' + elem?.referredBy?.last_name) : elem?.campaign?.campaignName}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13}>{elem?.creationProcess}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.8} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color='light' fontSize={13}>{new Date(elem?.joining_date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} {(new Date(elem?.joining_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata',hour12: true, timeStyle: 'medium' }).toUpperCase())}</MDTypography>
                  </Grid>
              </Grid>
              )
              })}
       {!isLoading && data?.length>0 &&
          <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
              <MDButton variant='outlined' color='warning' disabled={currentPage === 1 ? true : false} size="small" onClick={handlePrevPage}>Back</MDButton>
              <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Data: {today?.length} | Page {currentPage} of {Math.ceil(today?.length/perPage)}</MDTypography>
              <MDButton variant='outlined' color='warning' disabled={Math.ceil(today?.length/perPage) === currentPage ? true : false} size="small" onClick={handleNextPage}>Next</MDButton>
          </MDBox>
          }        

      {/* <MDBox bgColor='light' mt={2} borderRadius={5}>
          <MDTypography color="dark" fontWeight='bold' align='center' fontSize={13}>New User (Yesterday)</MDTypography>
      </MDBox>
      <Grid mt={2} p={1} container style={{border:'1px solid white', borderRadius:5}}>
          <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="left" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Full Name</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={2.8} display="flex" justifyContent="left" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">Email Id</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">Mobile No.</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">Referred By/Campaign</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">SignUp Method</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.8} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">Joining Date</MDTypography>
          </Grid>
      </Grid> */}

      {/* {yesterday?.map((elem)=>{
            
              return (
              <Grid mt={1} p={1} container style={{border:'1px solid white', borderRadius:5}}>
                  <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13} display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.first_name} {elem?.last_name}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2.8} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13}>{elem?.email}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13}>{elem?.mobile}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13}>{elem?.referredBy ? (elem?.referredBy?.first_name + ' ' + elem?.referredBy?.last_name) : elem?.campaign?.campaignName}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13}>{elem?.creationProcess}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.8} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color='light' fontSize={13}>{new Date(elem?.joining_date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} {(new Date(elem?.joining_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata',hour12: true, timeStyle: 'medium' }).toUpperCase())}</MDTypography>
                  </Grid>
              </Grid>
              )
              })}

      <MDBox bgColor='light' mt={2} borderRadius={5}>
          <MDTypography color="dark" fontWeight='bold' align='center' fontSize={13}>New User (This Month)</MDTypography>
      </MDBox>
      <Grid mt={2} p={1} container style={{border:'1px solid white', borderRadius:5}}>
          <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="left" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Full Name</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={2.8} display="flex" justifyContent="left" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">Email Id</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">Mobile No.</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">Referred By</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">SignUp Method</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.8} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <MDTypography color="light" fontSize={13} fontWeight="bold">Joining Date</MDTypography>
          </Grid>
      </Grid>

      {thisMonth?.map((elem)=>{
            
              return (
              <Grid mt={1} p={1} container style={{border:'1px solid white', borderRadius:5}}>
                  <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13} display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.first_name} {elem?.last_name}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2.8} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13}>{elem?.email}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13}>{elem?.mobile}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13}>{elem?.referredBy ? (elem?.referredBy?.first_name + ' ' + elem?.referredBy?.last_name) : elem?.campaign?.campaignName}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="light" fontSize={13}>{elem?.creationProcess}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={1.8} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color='light' fontSize={13}>{new Date(elem?.joining_date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} {(new Date(elem?.joining_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata',hour12: true, timeStyle: 'medium' }).toUpperCase())}</MDTypography>
                  </Grid>
              </Grid>
              )
              })} */}
      </>


      
    }
  </>
  );
}