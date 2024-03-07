
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { apiUrl } from "../../../constants/constants.js"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, CircularProgress, Divider, Grid, Box, Typography } from '@mui/material';
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox/index.js";
import MDButton from "../../../components/MDButton/index.js";
import MDTypography from "../../../components/MDTypography/index.js";
import { Link } from "react-router-dom";
import moment from 'moment'
import Payment from '../data/payment.js';
import MDSnackbar from "../../../components/MDSnackbar/index.js";
import { useMediaQuery } from "@mui/material";
import theme from "../../HomePage/utils/theme/index";


const TopicNav = ({topics}) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Get the value of the "mobile" parameter
    const courseId = urlParams.get('id');
    const [showPay, setShowPay] = useState();
    const [courses, setCourses] = useState([]);
    const [checkPaid, setCheckPaid] = useState(false);

    useEffect(() => {
        let call1 = axios.get(`${apiUrl}courses/${courseId}`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        })
        Promise.all([call1])
            .then(([api1Response]) => {
                // Process the responses here
                setCourses(api1Response.data.data)

            })
            .catch((error) => {
                // Handle errors here
                console.error(error);
            });
    }, [])

    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

    return (
        <>
            {courses ?
                 <MDBox mt={5} style={{ flexGrow: 1, height: '100vh', marginTop: '20px' }}>
                 <Grid container spacing={0}>
                   <Grid item xs={12} sm={8}>
                     <MDBox style={{ height: '100%', backgroundColor: '#f0f0f0' }}>
                       {/* Video content goes here */}
                       <MDTypography>This Is video content</MDTypography>
                     </MDBox>
                   </Grid>
                   <Grid item xs={12} sm={4}>
                     <MDBox style={{ position: 'fixed', top: 82, right: 0, height: '100%', width: '30%', backgroundColor: '#333', color: '#fff' }}>
                     <MDTypography>This Is sidenav content</MDTypography>
                     </MDBox>
                   </Grid>
                 </Grid>
               </MDBox>
                :
                <Grid container spacing={1} xs={12} md={6} lg={12}>
                    <Grid item mt={2} xs={6} md={3} lg={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress color='dark' />
                    </Grid>
                </Grid>
            }
        </>

    )
}



export default TopicNav;