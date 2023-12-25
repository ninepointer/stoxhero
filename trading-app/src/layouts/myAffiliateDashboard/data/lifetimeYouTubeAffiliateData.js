
import React, {useState, useEffect} from 'react'
import axios from "axios";
import {apiUrl} from "../../../constants/constants.js"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Divider, Grid } from '@mui/material';
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox/index.js";
import MDTypography from "../../../components/MDTypography/index.js";
import { Link} from "react-router-dom";
import moment from 'moment'


const PublishedBlogs = ({ytaffiliateOverview, ytaffiliateReferrals}) => {

let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    return (
    <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{minWidth: '100%',height: 'auto'}}>
        
        <Grid item xs={12} md={12} lg={2}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Active/Total <br/> Affiliates
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(ytaffiliateOverview?.activeAffiliateCount)} / {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(ytaffiliateReferrals?.affiliateCount)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={2}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Total <br/> GMV
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(ytaffiliateOverview?.totalGMV)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={2}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Total <br/> Revenue
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(ytaffiliateOverview?.totalRevenue)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={2}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                            <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Total <br/> Commission
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(ytaffiliateOverview?.totalCommission)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={2}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                            <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Net <br/> Revenue
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(ytaffiliateOverview?.totalRevenue-ytaffiliateOverview?.totalCommission)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={2}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Total <br/> Orders(Paid)
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(ytaffiliateOverview?.totalOrders)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={2}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Total <br/> Discounts
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(ytaffiliateOverview?.totalDiscount)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={2}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Affiliate <br/> Network(Paid)
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(ytaffiliateOverview?.uniqueUsersCount)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={2}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Lifetime <br/> AOV
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(ytaffiliateOverview?.aov)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={2}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Lifetime <br/> ARPU
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(ytaffiliateOverview?.arpu)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={2}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Affiliate <br/> Signups
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(ytaffiliateReferrals?.referrals)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={2}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Signups <br/> Payout
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(ytaffiliateReferrals?.referralPayout)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>
    </Grid>

)}



export default PublishedBlogs;