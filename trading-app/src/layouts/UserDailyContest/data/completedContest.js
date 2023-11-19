import React, { useState, useEffect } from 'react';
// import ReactGA from "react-ga"
import { CircularProgress, Divider, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
// import MyPortfolio from '../data/Portfolios'
// import TenXPortfolio from '../data/TenXPortfolio'
import MDTypography from '../../../components/MDTypography';
import FreeContest from "../Header/completedContest/freeCompleted";
import PaidContest from "../Header/completedContest/paidCompeted";
// import MDButton from '../../../components/MDButton';
// import { Link } from "react-router-dom"
import axios from "axios";

export default function LabTabs() {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [isLoading, setIsLoading] = useState(false);
    const [contest, setContest] = useState([]);

    useEffect(() => {
        setIsLoading(true)
        axios.get(`${baseUrl}api/v1/dailycontest/contests/completed`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        })
        .then((res) => {
            setContest(res.data.data);
            setTimeout(()=>{
                setIsLoading(false)
            },1000)
            
        }).catch((err) => {
            setIsLoading(false)
            return new Error(err);
        })
    }, [])

    return (

        <MDBox bgColor="dark" color="light"  mb={1} p={0} borderRadius={10} minHeight='auto'>

            {isLoading ?
                <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
                    <CircularProgress color='info' />
                </MDBox>
                :
                <>
                <Grid container xs={12} md={12} lg={12} display='flex'>
                    <Grid item xs={12} md={6} lg={12}>
                        <MDTypography color="light" fontSize={15} ml={0.5} fontWeight="bold">Paid TestZone(s)</MDTypography>
                        <PaidContest contest={contest} />
                    </Grid>

                    <Divider style={{ backgroundColor: 'light' }} />

                    <Grid item xs={12} md={6} lg={12}>
                        <MDBox style={{ minWidth: '100%' }}>
                            <MDTypography color="light" fontSize={15} ml={0.5} fontWeight="bold">Free TestZone(s)</MDTypography>
                            <FreeContest contest={contest} />
                        </MDBox>
                    </Grid>
                </Grid>
                </>
            }
        </MDBox>

    );
}