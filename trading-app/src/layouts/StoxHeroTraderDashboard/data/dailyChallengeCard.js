import React from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useContext, useRef, useReducer } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import Timer from '../data/timer'
import { Divider } from "@mui/material";
import MDButton from "../../../components/MDButton";



function Summary({summary}) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [serverTime, setServerTime] = useState();
    const [loading, setIsLoading] = useState(true);
    const [timeDifference, setTimeDifference] = useState([]);

    useEffect(() => {
        if (serverTime) {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        }
    }, [serverTime])

    useEffect(() => {
        axios.get(`${baseUrl}api/v1/servertime`)
            .then((res) => {
                setServerTime(res.data.data);
            })
    }, [])

  return (
        <Grid container spacing={1} lg={12} display='flex' justifyContent='center' alignItems='center'>
        
            <Grid item xs={12} md={4} lg={4} display='flex' justifyContent='center'>
            <MDButton 
                style={{padding:0, width:'100%'}}
                component = {Link}
                to={{
                    pathname: `/challenges`,
                  }}
            >
                <MDBox bgColor='warning' borderRadius={5} display='flex' justifyContent='center' flexDirection='column' width='100%'>
                    <MDBox p={0} borderRadius={5} display='flex' justifyContent='center' minWidth='100%'>
                        <MDTypography color='light' fontSize={15} fontWeight="bold">Target Challenge</MDTypography>
                    </MDBox>
                    <MDBox p={0.5} bgColor='text' display='flex' justifyContent='center' minWidth='100%'>
                        <MDTypography color='light' fontSize={12} fontWeight="bold">NIFTY50</MDTypography>
                    </MDBox>
                    <MDBox p={0.5} bgColor='text' display='flex' justifyContent='space-between' minWidth='100%'>
                        <MDTypography color='light' fontSize={12} fontWeight="bold">1.3k Prize Pool</MDTypography>
                        <MDTypography color='light' fontSize={12} fontWeight="bold">125 Traders</MDTypography>
                    </MDBox>
                </MDBox>
                </MDButton>
            </Grid>
            

            <Grid item xs={12} md={4} lg={4} display='flex' justifyContent='center'>
            <MDButton 
                style={{padding:0, width:'100%'}}
                component = {Link}
                to={{
                    pathname: `/challenges`,
                  }}
            >
                <MDBox bgColor='warning' borderRadius={5} display='flex' justifyContent='center' flexDirection='column' width='100%'>
                    <MDBox p={0} borderRadius={5} display='flex' justifyContent='center' minWidth='100%'>
                        <MDTypography color='light' fontSize={15} fontWeight="bold">Target Challenge</MDTypography>
                    </MDBox>
                    <MDBox p={0.5} bgColor='text' display='flex' justifyContent='center' minWidth='100%'>
                        <MDTypography color='light' fontSize={12} fontWeight="bold">BANKNIFTY</MDTypography>
                    </MDBox>
                    <MDBox p={0.5} bgColor='text' display='flex' justifyContent='space-between' minWidth='100%'>
                        <MDTypography color='light' fontSize={12} fontWeight="bold">1.3k Prize Pool</MDTypography>
                        <MDTypography color='light' fontSize={12} fontWeight="bold">125 Traders</MDTypography>
                    </MDBox>
                </MDBox>
                </MDButton>
            </Grid>

            <Grid item xs={12} md={4} lg={4} display='flex' justifyContent='center'>
            <MDButton 
                style={{padding:0, width:'100%'}}
                component = {Link}
                to={{
                    pathname: `/challenges`,
                  }}
            >
                <MDBox bgColor='warning' borderRadius={5} display='flex' justifyContent='center' flexDirection='column' width='100%'>
                    <MDBox p={0} borderRadius={5} display='flex' justifyContent='center' minWidth='100%'>
                        <MDTypography color='light' fontSize={15} fontWeight="bold">Target Challenge</MDTypography>
                    </MDBox>
                    <MDBox p={0.5} bgColor='text' display='flex' justifyContent='center' minWidth='100%'>
                        <MDTypography color='light' fontSize={12} fontWeight="bold">FINNIFTY</MDTypography>
                    </MDBox>
                    <MDBox p={0.5} bgColor='text' display='flex' justifyContent='space-between' minWidth='100%'>
                        <MDTypography color='light' fontSize={12} fontWeight="bold">1.3k Prize Pool</MDTypography>
                        <MDTypography color='light' fontSize={12} fontWeight="bold">125 Traders</MDTypography>
                    </MDBox>
                </MDBox>
                </MDButton>
            </Grid>
            
        </Grid>
)
}

export default Summary;
