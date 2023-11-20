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

export default function PaidContestData() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let [skip, setSkip] = useState(0);
  const limitSetting = 10;
  const [count, setCount] = useState(0);
  const [isLoading,setIsLoading] = useState(false);

  const [paidContestData, setPaidContestData] = useState([]);

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/dailycontest/dailypaidcollegecontestdata?skip=${skip}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setPaidContestData(res.data.data)
        setCount(res.data.count)
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
    setPaidContestData([]);
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/dailycontest/dailypaidcollegecontestdata?skip=${skip-limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setPaidContestData(res.data.data)
        setCount(res.data.count)
        setTimeout(()=>{
            setIsLoading(false)
          },500)
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })
  }

  function nextHandler(){
    if(skip+limitSetting >= count){
      return;
    }
    setSkip(prev => prev+limitSetting);
    setPaidContestData([]);
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/dailycontest/dailypaidcollegecontestdata?skip=${skip+limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setPaidContestData(res.data.data)
        setCount(res.data.count)
        setTimeout(()=>{
            setIsLoading(false)
          },500)
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })
  }

  return (

    <MDBox bgColor="dark" color="light" mb={1} borderRadius={10} minWidth='100%' minHeight='auto'>
      <Grid container spacing={1}>
        <Grid container p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
          <Grid item xs={12} md={2} lg={2.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">TestZone Name</MDTypography>
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


        {!isLoading ?
          paidContestData?.map((elem) => {
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
        {!isLoading && count !== 0 &&
          <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
            <MDButton variant='outlined' color='warning' disabled={(skip + limitSetting) / limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
            <MDTypography color="light" fontSize={15} fontWeight='bold'>Total TestZones: {!count ? 0 : count} | Page {(skip + limitSetting) / limitSetting} of {!count ? 1 : Math.ceil(count / limitSetting)}</MDTypography>
            <MDButton variant='outlined' color='warning' disabled={Math.ceil(count / limitSetting) === (skip + limitSetting) / limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
          </MDBox>
        }

      </Grid>
    </MDBox>

  );
}
