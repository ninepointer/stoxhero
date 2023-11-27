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

export default function TenXPurchasedToday() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  let [skip, setSkip] = useState(0);
  const limitSetting = 10;
  const [count, setCount] = useState(0);
  const [isLoading,setIsLoading] = useState(false);

  const [tenXPurchasedToday, setTenXPurchasedToday] = useState([]);

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/tenx/tenxpurchasetoday?skip=${skip}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setTenXPurchasedToday(res.data.data)
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
    setTenXPurchasedToday([]);
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/tenx/tenxpurchasetoday?skip=${skip-limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setTenXPurchasedToday(res.data.data)
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
    setTenXPurchasedToday([]);
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/tenx/tenxpurchasetoday?skip=${skip+limitSetting}&limit=${limitSetting}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res) => {
        setTenXPurchasedToday(res.data.data)
        setCount(res.data.count)
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

  return (

    <MDBox bgColor="dark" color="light" mb={1} borderRadius={10} minWidth='100%' minHeight='auto'>
      <Grid container spacing={1}>
        <Grid container p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
          <Grid item xs={12} md={2} lg={0.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">#</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Subscriber Name</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Email</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Mobile</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Purchase Date</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Expiry Date</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">TenX Plan</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Purchase Value</MDTypography>
          </Grid>
          <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <MDTypography color="light" fontSize={10} fontWeight="bold">Portfolio</MDTypography>
          </Grid>
        </Grid>


        {!isLoading ?
          tenXPurchasedToday?.map((elem,index) => {
    
            return (

              <Grid container mt={1} p={1} style={{ border: '1px solid white', borderRadius: 5 }}>
                <Grid item xs={12} md={2} lg={0.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{(index + 1 + skip)}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{TruncatedName(elem?.first_name + ' ' + elem?.last_name)}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.email}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.mobile}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color={"light"} fontSize={10} fontWeight="bold">{moment.utc(elem?.purchase_date).utcOffset('+05:30').format('DD-MMM hh:mm a')}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color={"light"} fontSize={10} fontWeight="bold">{moment.utc(elem?.expiry_date).add(elem?.expiryDays,'days').utcOffset('+05:30').format('DD-MMM-YY')}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color={"light"} fontSize={10} fontWeight="bold">{elem?.plan_name}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.purchaseValue)}</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <MDTypography color="light" fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.portfolio)}</MDTypography>
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
            <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Subscribers: {!count ? 0 : count} | Page {(skip + limitSetting) / limitSetting} of {!count ? 1 : Math.ceil(count / limitSetting)}</MDTypography>
            <MDButton variant='outlined' color='warning' disabled={Math.ceil(count / limitSetting) === (skip + limitSetting) / limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
          </MDBox>
        }

      </Grid>
    </MDBox>

  );
}
