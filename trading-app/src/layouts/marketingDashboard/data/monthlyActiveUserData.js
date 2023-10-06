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
import moment, { max } from 'moment';

export default function LiveTenXSubscribers({monthNumber, yearNumber}) {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let [page, setPage] = useState(1);
  const perPage = 10;
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [paidUserCount, setPaidUserCount] = useState(0);
  const [isLoading,setIsLoading] = useState(false);

  const [monthActiveUser, setMonthActiveUser] = useState([]);
  const [monthPaidUser, setMonthPaidUser] = useState([]);

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/stoxherouserdashboard/marketingfunnelactiveusers/${monthNumber}/${yearNumber}?page=${page}&perPage=${perPage}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setMonthActiveUser(res.data.activeUserData)
        setActiveUserCount(res.data.activeUserCount)
        setMonthPaidUser(res.data.paidUserData)
        setPaidUserCount(res.data.paidUserCount)
        setTimeout(()=>{
            setIsLoading(false)
          },500)
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })
  },[])

  function backHandler(){
    if(page <= 0){
        return;
    }
    setPage(prev => prev-1);
    setMonthActiveUser([])
    setMonthPaidUser([])
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/stoxherouserdashboard/marketingfunnelactiveusers/${monthNumber}/${yearNumber}?page=${page-1}&perPage=${perPage}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setMonthActiveUser(res.data.activeUserData)
        setActiveUserCount(res.data.activeUserCount)
        setMonthPaidUser(res.data.paidUserData)
        setPaidUserCount(res.data.paidUserCount)
        setTimeout(()=>{
            setIsLoading(false)
          },500)
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })
  }

  function nextHandler(){
    if(page+perPage >= activeUserCount){
      return;
    }
    setPage(prev => prev+1);
    setMonthActiveUser([])
    setMonthPaidUser([])
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/stoxherouserdashboard/marketingfunnelactiveusers/${monthNumber}/${yearNumber}?page=${page+1}&perPage=${perPage}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setMonthActiveUser(res.data.activeUserData)
        setActiveUserCount(res.data.activeUserCount)
        setMonthPaidUser(res.data.paidUserData)
        setPaidUserCount(res.data.paidUserCount)
        setTimeout(()=>{
            setIsLoading(false)
          },500)
    }).catch((err) => {
        setIsLoading(false)
        return new Error(err);
    })
  }

  function TruncatedName(name) {
    const originalName = name;
    const convertedName = originalName
      .toLowerCase() // Convert the entire name to lowercase
      .split(' ') // Split the name into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back together with a space
  
    // Trim the name to a maximum of 30 characters
    const truncatedName = convertedName.length > 30 ? convertedName.substring(0, 30) + '...' : convertedName;
  
    return truncatedName;
  }

  console.log(monthActiveUser.length, activeUserCount)

  return (

    <MDBox bgColor="dark" color="light" mb={1} borderRadius={10} minWidth='100%' minHeight='auto'>
      <Grid container spacing={1}>
        <Grid container p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
          <Grid item xs={12} md={2} lg={0.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">#</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Subscriber Name</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Email</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={2.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Mobile</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Signup Method</MDTypography>
          </Grid>
        </Grid>


        {!isLoading ?
          monthActiveUser?.map((elem,index) => {
    
            return (

              <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
                <Grid item xs={12} md={2} lg={0.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{((index+1) + ((page-1)*perPage))}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{TruncatedName(elem?.first_name + ' ' + elem?.last_name)}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.email}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={2.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.mobile}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color={"light"} fontSize={10} fontWeight="bold">{elem?.creationProcess}</MDTypography>
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
        {!isLoading && activeUserCount !== 0 &&
          <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
            <MDButton variant='outlined' color='warning' disabled={(page) === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
            <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Active Users: {!activeUserCount ? 0 : activeUserCount} | Page {(page)} of {!activeUserCount ? 1 : Math.ceil(activeUserCount / perPage)}</MDTypography>
            <MDButton variant='outlined' color='warning' disabled={Math.ceil(activeUserCount / perPage) === (page) ? true : !activeUserCount ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
          </MDBox>
        }

      </Grid>
    </MDBox>

  );
}
