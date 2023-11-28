import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { userContext } from '../../../AuthContext';
//

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import {CircularProgress} from "@mui/material";
import { Grid } from "@mui/material";
import moment from 'moment';

export default function FreeContestData() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let [skip, setSkip] = useState(0);
  let [userskip, setUserSkip] = useState(0);
  const limitSetting = 10;
  const userlimitSetting = 10;
  const [count, setCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [isLoading,setIsLoading] = useState(false);
  const [isDataLoading,setIsDataLoading] = useState(false);
  const [isUserLoading,setIsUserLoading] = useState(false);
  const [freeContestData, setFreeContestData] = useState([]);
  const [freeContestUserData, setFreeContestUserData] = useState([]);

  useEffect(()=>{
  let call1 = axios.get(`${baseUrl}api/v1/dailycontest/dailyfreecontestdata?skip=${skip}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    let call2 = axios.get(`${baseUrl}api/v1/dailycontest/freecontestuserdata?skip=${userskip}&limit=${userlimitSetting}`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    Promise.all([call1, call2])
    .then(([apiResponse1,apiResponse2]) => {
        setFreeContestData(apiResponse1.data.data)
        setFreeContestUserData(apiResponse2.data.data)
        setCount(apiResponse1.data.count)
        setUserCount(apiResponse2.data.count)
        setTimeout(()=>{
            setIsLoading(false)
          },500)
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })
  },[])

  function backHandler(){
    if(skip <= 0){
        return;
    }
    setSkip(prev => prev-limitSetting);
    setFreeContestData([]);
    setIsDataLoading(true)
    axios.get(`${baseUrl}api/v1/dailycontest/dailyfreecontestdata?skip=${skip-limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setFreeContestData(res.data.data)
        setCount(res.data.count)
        setTimeout(()=>{
            setIsDataLoading(false)
          },500)
    }).catch((err) => {
        setIsDataLoading(false)
        return new Error(err);
    })
  }

  function nextHandler(){
    if(skip+limitSetting >= count){
      return;
    }
    setSkip(prev => prev+limitSetting);
    setFreeContestData([]);
    setIsDataLoading(true)
    axios.get(`${baseUrl}api/v1/dailycontest/dailyfreecontestdata?skip=${skip+limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setFreeContestData(res.data.data)
        setCount(res.data.count)
        setTimeout(()=>{
            setIsDataLoading(false)
          },500)
    }).catch((err) => {
        setIsDataLoading(false)
        return new Error(err);
    })
  }

  function backHandlerUser(){
    if(userskip <= 0){
        return;
    }
    setUserSkip(prev => prev-userlimitSetting);
    setFreeContestUserData([]);
    setIsUserLoading(true)
    axios.get(`${baseUrl}api/v1/dailycontest/freecontestuserdata?skip=${userskip-userlimitSetting}&limit=${userlimitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setFreeContestUserData(res.data.data)
        setUserCount(res.data.count)
        setTimeout(()=>{
            setIsUserLoading(false)
          },5000)
    }).catch((err) => {
        setIsUserLoading(false)
        return new Error(err);
    })
  }

  function nextHandlerUser(){
    if(userskip+userlimitSetting >= userCount){
      return;
    }
    setUserSkip(prev => prev+userlimitSetting);
    setFreeContestUserData([]);
    setIsUserLoading(true)
    axios.get(`${baseUrl}api/v1/dailycontest/freecontestuserdata?skip=${userskip+userlimitSetting}&limit=${userlimitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setFreeContestUserData(res.data.data)
        setUserCount(res.data.count)
        setTimeout(()=>{
            setIsUserLoading(false)
          },5000)
    }).catch((err) => {
        setIsUserLoading(false)
        return new Error(err);
    })
  }

  return (

    <MDBox bgColor="dark" color="light" mb={1} borderRadius={10} minWidth='100%' minHeight='auto'>
      <Grid container spacing={1}>
        <Grid container p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
          <Grid item xs={12} md={2} lg={2.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Contest Name</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.25} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Start Time</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.25} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">End Time</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Type</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Entry</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">% Payout</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Portfolio</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Max Part.</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Act. Part.</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Total Payout</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">POTL</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Avg. Payout</MDTypography>
          </Grid>
        </Grid>


        {(!isLoading || !isDataLoading) ?
          freeContestData?.map((elem) => {
            // const fullName = elem?.trader?.first_name + ' ' + elem?.trader?.last_name
            const typecolor = elem?.transaction_type === 'Buy' ? 'success' : 'error'
            return (


              <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
                <Grid item xs={12} md={2} lg={2.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.contestName}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.25} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color={"light"} fontSize={10} fontWeight="bold">{moment.utc(elem?.contestStartTime).utcOffset('+05:30').format('DD-MMM hh:mm a')}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.25} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                 <MDTypography color={"light"} fontSize={10} fontWeight="bold">{moment.utc(elem?.contestEndTime).utcOffset('+05:30').format('DD-MMM hh:mm a')}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color={"light"} fontSize={10} fontWeight="bold">{elem?.type}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.entryFee)}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(elem?.payoutPercentage)}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.portfolioValue)}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.maxParticipants)}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.participantsCount)}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(elem?.totalPayout)}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.percentageLossMakingTraders)}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.averagePayout)}</MDTypography>
                </Grid>
              </Grid>


            )
          })
          :
          <Grid container display="flex" justifyContent="center" alignContent='center' alignItems="center">
            <Grid item display="flex" justifyContent="center" alignContent='center' alignItems="center" lg={12}>
              <MDBox mt={5} mb={5}>
                <CircularProgress color="info" />
              </MDBox>
            </Grid>
          </Grid>
        }
        {(!isLoading || !isDataLoading) && count !== 0 &&
          <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
            <MDButton variant='outlined' color='warning' disabled={(skip + limitSetting) / limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
            <MDTypography color="light" fontSize={15} fontWeight='bold'>Total TestZones: {!count ? 0 : count} | Page {(skip + limitSetting) / limitSetting} of {!count ? 1 : Math.ceil(count / limitSetting)}</MDTypography>
            <MDButton variant='outlined' color='warning' disabled={Math.ceil(count / limitSetting) === (skip + limitSetting) / limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
          </MDBox>
        }

      </Grid>

      <Grid mt={1} container spacing={1}>
        <Grid container p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
          <Grid item xs={12} md={2} lg={1.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Full Name</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Joinign Date</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Email</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Mobile</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">TestZone Part.</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Revenue</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Payout</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">DSLCP</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">LCD</MDTypography>
          </Grid>
        </Grid>


        {(!isLoading || !isUserLoading) ?
          freeContestUserData?.map((elem) => {
            // const fullName = elem?.trader?.first_name + ' ' + elem?.trader?.last_name
            const typecolor = elem?.transaction_type === 'Buy' ? 'success' : 'error'
            return (


              <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
                <Grid item xs={12} md={2} lg={1.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.first_name + ' ' + elem?.last_name}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={0.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color={"light"} fontSize={10} fontWeight="bold">{moment.utc(elem?.joining_date).utcOffset('+05:30').format('DD-MMM-YY')}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                 <MDTypography color={"light"} fontSize={10} fontWeight="bold">{elem?.email}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color={"light"} fontSize={10} fontWeight="bold">{elem?.mobile}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.count}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.revenue)}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.payout)}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.daysSinceLastContest)}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color={"light"} fontSize={10} fontWeight="bold">{moment.utc(elem?.lastContestDate).utcOffset('+05:30').format('DD-MMM-YY')}</MDTypography>
                </Grid>
              </Grid>
            )
          })
          :
          <Grid container display="flex" justifyContent="center" alignContent='center' alignItems="center">
            <Grid item display="flex" justifyContent="center" alignContent='center' alignItems="center" lg={12}>
              <MDBox mt={5} mb={5}>
                <CircularProgress color="info" />
              </MDBox>
            </Grid>
          </Grid>
        }
        {(!isLoading || !isUserLoading) && userCount !== 0 &&
          <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
            <MDButton variant='outlined' color='warning' disabled={(userskip + userlimitSetting) / userlimitSetting === 1 ? true : false} size="small" onClick={backHandlerUser}>Back</MDButton>
            <MDTypography color="light" fontSize={15} fontWeight='bold'>Total TestZone Participants: {!userCount ? 0 : userCount} | Page {(userskip + userlimitSetting) / userlimitSetting} of {!userCount ? 1 : Math.ceil(userCount / userlimitSetting)}</MDTypography>
            <MDButton variant='outlined' color='warning' disabled={Math.ceil(userCount / userlimitSetting) === (userskip + userlimitSetting) / userlimitSetting ? true : !userCount ? true : false} size="small" onClick={nextHandlerUser}>Next</MDButton>
          </MDBox>
        }

      </Grid>
    </MDBox>

  );
}
