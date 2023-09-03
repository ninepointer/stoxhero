import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { userContext } from '../../../AuthContext';
import moment from 'moment';


// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import {CircularProgress} from "@mui/material";
import { Grid } from "@mui/material";
import { useLocation, Link } from "react-router-dom";


export default function DailyContestOrders() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [isLoading,setIsLoading] = useState(false);
  // const [data, setData] = useState([]);
  const location = useLocation();

  let data = location?.state?.data;
  
  // useEffect(()=>{
  //     setIsLoading(true)
  //     axios.get(`${baseUrl}api/v1/marginx/trade/${marginX}/my/todayorders`, {
  //       withCredentials: true,
  //       headers: {
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //           "Access-Control-Allow-Credentials": true
  //       }
  //   })
  //     .then((res)=>{
  //         setData(res.data.data);
  //         setIsLoading(false)
  //     }).catch((err)=>{
  //         setTimeout(()=>{
  //           setIsLoading(false)
  //         },500) 
  //         return new Error(err);
  //     })
  // },[])

  return (

    <MDBox bgColor="dark" color="light" p={1} mb={1} mt={3} borderRadius={10} minWidth='100%' minHeight='auto'>
      <MDButton
          variant='outlined'
          color='warning'
          size='small'
          m={1}
          component={Link}
          to={{
              pathname: `/marginxs`,
          }}
      >
          <MDTypography color='warning' fontWeight='bold' fontSize={10}>BACK TO COMPLETED MARGINX</MDTypography>
      </MDButton>
      <Grid container mt={1}>
        <Grid container p={1} style={{border:'1px solid white', borderRadius:5}}>
              <Grid item xs={12} md={2} lg={1.5}>
                <MDTypography color="light" fontSize={13} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Contract</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Quantity</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Price</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Amount</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Type</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Order Id</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Status</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">TimeStamp</MDTypography>
              </Grid>
        </Grid>

        
            {!isLoading ?
             data?.map((elem)=>{
                // const fullName = elem?.trader?.first_name + ' ' + elem?.trader?.last_name
                const typecolor = elem?.buyOrSell === 'BUY' ? 'success' : 'error'
                return(
              
                    
                    <Grid container mt={1} p={1} style={{border:'1px solid white', borderRadius:5}}>
                        <Grid item xs={12} md={2} lg={1.5}>
                            <MDTypography color="light" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.symbol}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color={typecolor} fontSize={10} fontWeight="bold">{elem?.Quantity}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.average_price))}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={10} fontWeight="bold">₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(elem?.amount))}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color={typecolor} fontSize={10} fontWeight="bold">{elem?.buyOrSell}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.order_id}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={10} fontWeight="bold">{elem?.status}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={1.5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={10} fontWeight="bold">{moment.utc(elem?.trade_time).utcOffset('+00:00').format('DD-MMM HH:mm:ss')}</MDTypography>
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
      </Grid>
    </MDBox>
  );
}
