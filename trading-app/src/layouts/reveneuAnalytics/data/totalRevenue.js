
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


const PublishedBlogs = ({overallRevenue,period}) => {

let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    return (
    <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{minWidth: '100%',height: 'auto'}}>
        
        <Grid item xs={12} md={12} lg={3}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%',minHeight:160, height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Revenue {period}
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue?.totalGMV)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={3}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%',minHeight:160, height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Orders {period}
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue?.totalGMV)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={3}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%',minHeight:160, height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    New Users {period}
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue?.totalGMV)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={3}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%',minHeight:160, height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Old Users {period}
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                    {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue?.totalGMV)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={3}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%',minHeight:160}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                            <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Revenue by Product
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h7'>
                                   TestZone:
                                </MDTypography>
                                <MDTypography variant='h7'>
                                ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue?.totalRevenue)}
                                </MDTypography>
                            </Grid>
                            <Grid xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h7'>
                                   TenX:
                                </MDTypography>
                                <MDTypography variant='h7'>
                                ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue?.totalRevenue)}
                                </MDTypography>
                            </Grid>
                            <Grid xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h7'>
                                   MarginX: 
                                </MDTypography>
                                <MDTypography variant='h7'>
                                ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue?.totalRevenue)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={3}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%',minHeight:160}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                            <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Orders by Product
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h7'>
                                   TestZone:
                                </MDTypography>
                                <MDTypography variant='h7'>
                                   {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue?.totalRevenue)}
                                </MDTypography>
                            </Grid>
                            <Grid xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h7'>
                                   TenX:
                                </MDTypography>
                                <MDTypography variant='h7'>
                                   {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue?.totalRevenue)}
                                </MDTypography>
                            </Grid>
                            <Grid xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h7'>
                                   MarginX: 
                                </MDTypography>
                                <MDTypography variant='h7'>
                                   {new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue?.totalRevenue)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={3}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%',minHeight:160, height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Revenue from New Users
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue?.totalGMV)}
                                </MDTypography>
                            </Grid>
                        </CardContent>
                    </Grid>
                </CardActionArea>
            </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={3}>
            <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
                <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%',minHeight:160, height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                                <MDTypography variant="h7" fontWeight="bold" fontFamily='Segoe UI' style={{textAlign:'center'}}>
                                    Revenue from Old Users
                                </MDTypography>
                            </Grid>
                                <Divider style={{width:'100%'}}/>
                            <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                                <MDTypography variant='h6'>
                                ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(overallRevenue?.totalGMV)}
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