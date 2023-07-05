import React, { useState, useEffect } from 'react'
import MDBox from '../../../components/MDBox'
import MDTypography from '../../../components/MDTypography'
import MDButton from '../../../components/MDButton'
import { Divider, Grid } from '@mui/material'
import axios from "axios";
import {Link} from 'react-router-dom'
import subscription from '../../../assets/images/subscription.png'

export default function ActiveTenXSubscriptions() {
    const [tenX,setTenX] = useState([])
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    async function getTenXActiveSubs (){
        const res = await fetch(`${baseUrl}api/v1/tenX/inactive`, {
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
       {tenX?.length > 0 ?
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
                                <MDTypography style={{border:'1px solid #1A73E8', backgroundColor:'#1A73E8', color:'white'}}  p={1} borderRadius={2} fontSize={15} fontWeight='bold'>Offer Price : {elem?.discounted_price != 0 ? elem?.discounted_price : 'FREE'}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="center">
                                <MDTypography fontSize={13} fontWeight='bold'>Validity : {elem?.validity} TRADING {elem?.validityPeriod?.toUpperCase()}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="center">
                                <MDTypography fontSize={13} fontWeight='bold'>Trading Margin : ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.portfolio?.portfolioValue)}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} mt={2} mb={2} display="flex" justifyContent="center">
                                <MDButton 
                                    variant='outlined' 
                                    color='info' 
                                    size='small'
                                    component={Link}
                                    to='/TenX Subscription Details'
                                    state= {{data:elem._id}}
                                >
                                    View Details
                                </MDButton>
                            </Grid>
                        </Grid>

                    </MDBox>
                </Grid>
                )
            })
            }
       </Grid>
       :
        <MDBox style={{border:'1px solid white', borderRadius:5, minHeight:'20vh'}} mt={2}>
            <Grid container>
            <Grid item xs={12} md={6} lg={12}>
                <MDBox style={{minHeight:"20vh"}} display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
                <img src={subscription} width={50} height={50}/>
                <MDTypography color="light" fontSize={15}>No Inactive Subscription(s)!</MDTypography>
                </MDBox>
            </Grid>
            </Grid>
        </MDBox>
        }
    </MDBox>
  )
}

// export default ActiveTenXSubscriptions