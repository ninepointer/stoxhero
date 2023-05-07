import React, { useState, useEffect } from 'react'
import MDBox from '../../../components/MDBox'
import MDTypography from '../../../components/MDTypography'
import MDButton from '../../../components/MDButton'
import { Divider, Grid } from '@mui/material'
import axios from "axios";

export default function ActiveTenXSubscriptions() {
    const [tenX,setTenX] = useState([])
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    // React.useEffect(()=>{
    //     axios.get(`${baseUrl}api/v1/tenX/active`)
    //     .then((res)=>{
    //       console.log(res?.data?.data)
    //       setTenX(res?.data?.data);
    //     }).catch((err)=>{
    //         return new Error(err)
    //     })
    // })

    async function getTenXActiveSubs (){
        const res = await fetch(`${baseUrl}api/v1/tenX/active`, {
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
        setTenX(data?.data);
        console.log(data?.data)
      }

      useEffect(()=>{
        getTenXActiveSubs()
        .then();
      },[])
    

  return (
    <MDBox>
       <Grid container spacing={3}>
            {tenX?.map((elem)=>{
                return(
                <Grid item xs={12} md={6} lg={3}>
                    <MDBox bgColor='light' elevation={3} p={1} borderRadius={5}>
                        <Grid container>
                            <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="center">
                                <MDTypography fontSize={18} fontWeight='bold'>{elem?.plan_name?.toUpperCase()}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} mt={-1} display="flex" justifyContent="center" style={{width: '100%'}}>
                                <Divider style={{backgroundColor: '#1A73E8', height: '4px', width: '80%'}} />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="center">
                                <MDTypography fontSize={15} fontWeight='bold'>Actual Price : ₹{elem?.actual_price}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} mt={1} mb={1} display="flex" justifyContent="center">
                                <MDTypography style={{border:'1px solid #1A73E8', backgroundColor:'#1A73E8', color:'white'}}  p={1} borderRadius={5} fontSize={15} fontWeight='bold'>Offer Price : ₹{elem?.discounted_price}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="center">
                                <MDTypography fontSize={15} fontWeight='bold'>Validity : {elem?.validity} TRADING {elem?.validityPeriod?.toUpperCase()}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="center">
                                <MDTypography fontSize={15} fontWeight='bold'>Trading Margin : ₹{elem?.portfolio?.portfolioValue}</MDTypography>
                            </Grid>
                        </Grid>

                    </MDBox>
                </Grid>
                )
            })
            }
       </Grid>
    </MDBox>
  )
}

// export default ActiveTenXSubscriptions