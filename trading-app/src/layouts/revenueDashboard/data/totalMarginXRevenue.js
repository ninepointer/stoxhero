
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


const PublishedBlogs = ({totalMarginXRevenue}) => {
    console.log("Total MarginX Revenue:",totalMarginXRevenue)
    return (
    <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{minWidth: '100%',height: 'auto'}}>
        
        <Grid item xs={12} md={12} lg={6}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Lifetime MarginX <br/> GMV
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalMarginXRevenue?.totalGMV)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={6}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                            <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Lifetime MarginX <br/> Revenue
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalMarginXRevenue?.totalRevenue)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={6}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Lifetime MarginX <br/> Orders(Paid)
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalMarginXRevenue?.totalOrder)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={6}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Lifetime MarginX <br/>  Discounts
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalMarginXRevenue?.totalDiscountAmount)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={6}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Lifetime MarginX <br/> ARPU
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalMarginXRevenue?.arpu)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={6}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Lifetime MarginX <br/> AOV
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalMarginXRevenue?.aov)}
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