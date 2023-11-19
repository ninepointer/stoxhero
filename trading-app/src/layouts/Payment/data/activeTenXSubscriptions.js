import React, { useState, useEffect } from 'react'
import MDBox from '../../../components/MDBox'
import MDTypography from '../../../components/MDTypography'
import MDButton from '../../../components/MDButton'
import { Divider, Grid } from '@mui/material'
// import axios from "axios";
// import {Link} from 'react-router-dom'
import subscription from '../../../assets/images/subscription.png'
import tradesicon from '../../../assets/images/tradesicon.png'

export default function PaymentHistory() {
    const [payment,setPayment] = useState([])
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    async function getPayment (){
        const res = await fetch(`${baseUrl}api/v1/payment`, {
          method: "GET",
          credentials:"include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
        },
      )
      let data = await res.json()
        setPayment(data?.data);
        console.log(data?.data)
    }

    useEffect(()=>{
    getPayment()
    .then();
    },[])

    function dateConvert(dateConvert){
        console.log("Date Convert",dateConvert)
        // const dateString = dateConvert;
        // const date = new Date(dateString);
        dateConvert = new Date(dateConvert)
        const options = { 
          timeZone: 'Asia/Kolkata',
          year: 'numeric', 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: 'numeric',
          second: 'numeric'
        };
        
        const formattedDate = new Intl.DateTimeFormat('en-IN', options).format(dateConvert);
        
        // get day of month and add ordinal suffix
        const dayOfMonth = dateConvert.getDate();
        let suffix = "th";
        if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
          suffix = "st";
        } else if (dayOfMonth === 2 || dayOfMonth === 22) {
          suffix = "nd";
        } else if (dayOfMonth === 3 || dayOfMonth === 23) {
          suffix = "rd";
        }
        
        // combine date and time string with suffix
        const finalFormattedDate = `${dayOfMonth}${suffix} ${formattedDate?.split(" ")[1]}, ${dateConvert.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })}`;
        
        console.log(finalFormattedDate); // Output: "3rd April, 9:27 PM"
        
     
    
      return finalFormattedDate
    }
    
  return (
    <MDBox mt={2}>
    <Grid container>
        <Grid item xs={12} md={6} lg={12}>
          <MDBox border='1px solid white' bgColor='light' borderRadius={5} mb={2} p={0.5} display='flex' justifyContent='center' alignItems='center'>
          <MDTypography color="dark" fontSize={15} fontWeight='bold'>Payment History</MDTypography>
          </MDBox>

          <MDBox display="flex" justifyContent="space-between" mb={2}>
          <Grid container spacing={2} display="flex" justifyContent="space-between">
            <Grid item xs={12} md={6} lg={6} display="flex" justifyContent="space-between">
            {/* <MDBox display="flex" justifyContent="space-between">
              <MDButton color={todayColor} size="small" style={{marginRight:4}} onClick={()=>{setView('today');setSkip(0)}}>Today's Order(s)</MDButton>
              <MDButton color={historyColor} size="small" style={{marginRight:4}} onClick={()=>{setView('history');setSkip(0)}}>All Order(s)</MDButton>
            </MDBox> */}
            </Grid>
            <Grid item xs={8} md={6} lg={6} display="flex" justifyContent="flex-end">
            {/* <MDBox display="flex" justifyContent="flex-end" alignItems='center'>
              <MDTypography style={{marginRight:10}} color="light" fontSize={15}>Filters:</MDTypography>
              <MDButton color={buyFilter ? 'warning' : 'light'} variant="outlined" size="small" style={{marginRight:10}} onClick={(e)=>{setBuyFilter(!buyFilter)}}>Buy</MDButton>
              <MDButton color={sellFilter ? 'warning' : 'light'} variant="outlined" size="small" style={{marginRight:10}} onClick={(e)=>{setSellFilter(!sellFilter)}}>Sell</MDButton>
            </MDBox> */}
            </Grid>
          </Grid>
          </MDBox>

          {payment.length === 0 ?
          <>
          <Grid item xs={12} md={6} lg={12}>
            <MDBox style={{minHeight:"20vh"}} border='1px solid white' borderRadius={5} display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
              <img src={tradesicon} width={50} height={50}/>
              <MDTypography color="light" fontSize={15}>You do not have any Paper trading orders!</MDTypography>
            </MDBox>
          </Grid>
          </>
          :
          <>
          
          <Grid mt={2} p={1} container style={{border:'1px solid white', borderRadius:5}}>
            <Grid item xs={12} md={2} lg={2}>
              <MDTypography color="light" fontSize={13} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Contract</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={13} fontWeight="bold">Order ID</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={13} fontWeight="bold">Reference No.</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={13} fontWeight="bold">Transaction ID</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={13} fontWeight="bold">Amount</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={13} fontWeight="bold">Payment Mode</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={13} fontWeight="bold">UserContest</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={13} fontWeight="bold">Subscription</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={13} fontWeight="bold">Payment Status</MDTypography>
            </Grid>
            <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
              <MDTypography color="light" fontSize={13} fontWeight="bold">Payment Time</MDTypography>
            </Grid>
          </Grid>

          {payment?.map((elem)=>{
            let buysellcolor = elem?.buyOrSell === 'BUY' ? 'success' : 'error'
            let statuscolor = elem?.status === 'COMPLETE' ? 'success' : 'error'
         
          return (
          <Grid mt={1} p={1} container style={{border:'1px solid white', borderRadius:5}}>
              <Grid item xs={12} md={2} lg={2}>
                <MDTypography color="light" fontSize={13} display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.symbol}</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13}>{elem?.Quantity}</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13}>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.average_price))}</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13}>₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.amount))}</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color={buysellcolor} fontSize={13} fontWeight="bold">{elem?.buyOrSell}</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13}>{elem?.order_id}</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color={statuscolor} fontSize={13}>{elem?.status}</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13}>{dateConvert(elem?.trade_time)}</MDTypography>
              </Grid>
          </Grid>
          )
          })}
          </>}

        </Grid>
        
    </Grid>
    </MDBox>
  )
}

// export default ActiveTenXSubscriptions