
import React, {useState, useEffect} from 'react'
import axios from "axios";
import {apiUrl} from "../../../constants/constants.js"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Divider, Grid } from '@mui/material';
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import { Link} from "react-router-dom";
import moment from 'moment'


const PublishedBlogs = ({totalTestZoneRevenue}) => {

let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

    return (
    <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{minWidth: '100%',height: 'auto'}}>
        <Card sx={{ minWidth: '100%', cursor:'pointer', borderRadius:1 }} >
            <CardActionArea>
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                    <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                        <Grid mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                            <MDTypography variant="h6" fontFamily='Segoe UI' fontWeight={400} style={{textAlign:'center'}}>
                                Total TestZone Revenue
                            </MDTypography>
                        </Grid>
                            <Divider style={{width:'100%'}}/>
                        <Grid mb={-1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                            <MDTypography variant='h6'>
                                ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalTestZoneRevenue)}
                            </MDTypography>
                        </Grid>
                    </CardContent>
                </Grid>
            </CardActionArea>
        </Card>
    </Grid>

)}



export default PublishedBlogs;