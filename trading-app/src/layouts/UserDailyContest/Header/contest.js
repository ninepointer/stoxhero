import React, { useState, useEffect } from 'react';
// import ReactGA from "react-ga"
import { CircularProgress, Divider, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
// import MyPortfolio from '../data/Portfolios'
// import TenXPortfolio from '../data/TenXPortfolio'
import MDTypography from '../../../components/MDTypography';
// import axios from "axios";
// import { useContext } from 'react';
// import {userContext} from '../../../AuthContext'
import FreeContest from "./freeContest";
import PaidContest from "./paidContest";
import MDButton from '../../../components/MDButton';
import { Link } from "react-router-dom"
import axios from "axios";

export default function LabTabs() {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    const [isLoading, setIsLoading] = useState(false);
    const [showPay, setShowPay] = useState(true);
    const [isInterested, setIsInterested] = useState(false);
    const [contest, setContest] = useState([]);

    useEffect(() => {
        setIsLoading(true)
        axios.get(`${baseUrl}api/v1/dailycontest/contests/upcoming`, {
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
    }, [isInterested, showPay])

    return (

        <MDBox bgColor="dark" color="light"  mb={1} p={2} borderRadius={10} minHeight='auto'>

            {isLoading ?
                <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
                    <CircularProgress color='info' />
                </MDBox>
                :
                <>
                    <MDBox mt={-1} p={0.5} mb={1} width='100%' bgColor='light' minHeight='auto' display='flex' borderRadius={7}>
                        <MDButton bgColor='dark' color={"warning"} size='small'
                            component={Link}
                            to={{
                                pathname: `/completedcontests`,
                            }}
                        >
                            {"View Past Contest"}
                        </MDButton>
                    </MDBox>
                    <Grid container >
                        <Grid item xs={12} md={6} lg={12}>
                            <MDTypography color="light" fontWeight="bold" style={{ textDecoration: "underline" }}>Premium Contest(s)</MDTypography>
                            <PaidContest contest={contest} isInterested={isInterested} setIsInterested={setIsInterested} showPay={showPay} setShowPay={setShowPay}/>
                        </Grid>

                        <Divider style={{ backgroundColor: 'light' }}/>

                        <Grid item xs={12} md={6} lg={12}>
                            <MDTypography  color="light" fontWeight="bold" mt={1} style={{ textDecoration: "underline" }}>Free Contest(s)</MDTypography>
                            <MDBox style={{ minWidth: '100%' }}>
                                <FreeContest contest={contest} isInterested={isInterested} setIsInterested={setIsInterested} showPay={showPay} setShowPay={setShowPay} />
                            </MDBox>
                        </Grid>
                    </Grid>
                </>
            }
        </MDBox>

    );
}