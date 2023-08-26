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
                <Grid item xs={12} md={6} lg={4}>
                    <MDBox bgColor='light' elevation={3} p={1} borderRadius={8}>
                        <Grid container>
                            <Grid item xs={12} md={12} lg={12} mt={0.5} display="flex" justifyContent="center">
                                <MDTypography fontSize={12} color='info' fontWeight='bold'>Program Name: {elem?.plan_name?.toUpperCase()}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} mt={-1.5} display="flex" justifyContent="center" style={{width: '100%'}}>
                                <Divider style={{backgroundColor: 'grey', height: '2px', width: '95%'}} />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} mt={-1} display="flex" justifyContent="center">
                            <Grid container xs={12} md={12} lg={12} mr={1} ml={1} display="flex" justifyContent="center">
                                <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center'>
                                    <img width='150px' src={subscription} />
                                </Grid>
                                <Grid item xs={12} md={12} lg={8}>
                                    <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="center">
                                        <MDTypography style={{border:'1px solid #1A73E8', color:'black', width:'90%', display:'flex', justifyContent:'center',  alignItems:'center'}} p={0.5} fontSize={12} borderRadius={2} fontWeight='bold'>Actual Price : ₹{elem?.actual_price}/-</MDTypography>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="center">
                                        <MDTypography style={{border:'1px solid #1A73E8', color:'black', width:'90%', display:'flex', justifyContent:'center',  alignItems:'center'}}  p={0.5} fontSize={12} borderRadius={2} fontWeight='bold'>Offer Price : ₹{elem?.discounted_price != 0 ? elem?.discounted_price + '/-' : 'FREE'}</MDTypography>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12} mt={1} display="flex" justifyContent="center">
                                        <MDTypography style={{border:'1px solid #1A73E8', color:'black', width:'90%', display:'flex', justifyContent:'center',  alignItems:'center'}}  p={0.5} fontSize={12} borderRadius={2} fontWeight='bold'>Validity : {elem?.validity} TRADING {elem?.validityPeriod?.toUpperCase()}</MDTypography>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12} mt={1} mb={1.5} display="flex" justifyContent="center">
                                        <MDTypography style={{border:'1px solid #1A73E8', color:'black', width:'90%', display:'flex', justifyContent:'center',  alignItems:'center'}}  p={0.5} fontSize={12} borderRadius={2} fontWeight='bold'>Portfolio : ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.portfolio?.portfolioValue)}</MDTypography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} mt={-2.5} display="flex" justifyContent="center" style={{width: '100%'}}>
                                <Divider style={{backgroundColor: 'grey', height: '2px', width: '95%'}} />
                            </Grid>
                            <MDBox display='flex' justifyContent='space-around' alignItems='center' width='100%' ml={1} mr={1}>
                            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='space-around' alignItems='center'>
                            <Grid item xs={3} md={3} lg={3} display="flex" justifyContent="center">
                                <MDTypography fontSize={12} borderRadius={2} fontWeight='bold'>Bought : {elem?.users?.length}</MDTypography>
                            </Grid>
                            <Grid item xs={3} md={3} lg={3} display="flex" justifyContent="center">
                                <MDTypography fontSize={12} borderRadius={2} fontWeight='bold'>Live : {(elem?.users?.filter(user => user.status === 'Live')).length}</MDTypography>
                            </Grid>
                            <Grid item xs={3} md={3} lg={3} display="flex" justifyContent="center">
                                <MDTypography fontSize={12} borderRadius={2} fontWeight='bold'>Expired : {(elem?.users?.filter(user => user.status === 'Expired')).length}</MDTypography>
                            </Grid>
                            <Grid item xs={3} md={3} lg={3} display="flex" justifyContent="center">
                                <MDTypography fontSize={12} borderRadius={2} fontWeight='bold'>Renewed : {(elem?.users?.filter(user => user.isRenew === true)).length}</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} mt={1.5} display="flex" justifyContent="center">
                                <MDButton 
                                    variant='outlined' 
                                    color='info' 
                                    size='small'
                                    component={Link}
                                    to='/TenX Subscription Details'
                                    state= {{data:elem._id}}
                                    sx={{fontSize:10, fontWeignt:'bold', margin:0, minWidth:'100%'}}
                                >
                                    View Subscription Details
                                </MDButton>
                            </Grid>
                            </Grid>
                            </MDBox>
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