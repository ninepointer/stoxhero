import React, { useState, useEffect } from 'react';
// import ReactGA from "react-ga"
import { CircularProgress, Divider, Grid } from '@mui/material';
import MDBox from '../../../../components/MDBox';
// import MyPortfolio from '../data/Portfolios'
// import TenXPortfolio from '../data/TenXPortfolio'
import MDTypography from '../../../../components/MDTypography';
// import axios from "axios";
// import { useContext } from 'react';
// import {userContext} from '../../../../AuthContext'
import FreeContest from "./freeCompleted";
import PaidContest from "./paidCompeted";
import MDButton from '../../../../components/MDButton';
import { Link } from "react-router-dom"
import axios from "axios";

export default function LabTabs() {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    const [isLoading, setIsLoading] = useState(false);
    // const [showPay, setShowPay] = useState(true);
    // const [isInterested, setIsInterested] = useState(false);
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

        <MDBox bgColor="dark" color="light"  mb={1} p={2} borderRadius={10} minHeight='auto'>

            {isLoading ?
                <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
                    <CircularProgress color='info' />
                </MDBox>
                :
                <>
                    <MDBox mt={-1} p={0.5} mb={1} width='100%' bgColor='light' minHeight='auto' borderRadius={7} display='flex'>
                        <MDButton bgColor='dark' color={"success"} size='small'
                            component={Link}
                            to={{
                                pathname: `/testzone`,
                            }}
                        >
                            {"View Upcoming TestZones"}
                        </MDButton>
                    </MDBox>
                    <Grid container >
                        <Grid item xs={12} md={6} lg={12}>
                            <PaidContest contest={contest} />
                        </Grid>

                        <Divider style={{ backgroundColor: 'light' }} />

                        <Grid item xs={12} md={6} lg={12}>
                            <MDBox style={{ minWidth: '100%' }}>
                                <FreeContest contest={contest} />
                            </MDBox>
                        </Grid>
                    </Grid>
                </>
            }
        </MDBox>

    );
}