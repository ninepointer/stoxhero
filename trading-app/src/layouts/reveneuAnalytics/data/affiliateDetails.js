
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

let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    return (
    <Grid p={1} container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{backgroundColor:'white', borderRadius:5 ,minWidth: '100%',height: 'auto'}}>
        
        <Divider style={{width:'100%'}}/>
        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption' fontWeight='bold'>Affiliate Revenue Data</MDTypography>
        </Grid>
        <Divider style={{width:'100%'}}/>

        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>FullName</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>Code</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>Users Acquired</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>Active Users</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>Paid Users</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>Total Revenue</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>Actual Revenue</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>Signup Bonus</MDTypography>
        </Grid>

        <Divider style={{width:'100%'}}/>

        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>Prateek Pawan</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>STOXHEROPP</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>100</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>20</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>2</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>₹10,000</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>₹8,000</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>₹2,000</MDTypography>
        </Grid>

        <Divider style={{width:'100%'}}/>

        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>Prateek Pawan</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>STOXHEROPP</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>100</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>20</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>2</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>₹10,000</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>₹8,000</MDTypography>
        </Grid>
        <Grid item xs={12} md={12} lg={1.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography variant='caption'>₹2,000</MDTypography>
        </Grid>

        <Divider style={{width:'100%'}}/>
        
    </Grid>

)}



export default PublishedBlogs;