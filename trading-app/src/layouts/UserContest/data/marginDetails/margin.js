

import React, {memo, useContext} from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../../../components/MDBox";

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { NetPnlContext } from "../../../../PnlContext";
import { CircularProgress } from "@mui/material";



function UsedPortfolio({portfolioId}) {

    // let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    // const [indexData, setIndexData] = useState([]);
    // const [indexLiveData, setIndexLiveData] = useState([]);
    const pnl = useContext(NetPnlContext);
    const lightTheme = createTheme({ palette: { mode: 'light' } });
    // const gpnlcolor = pnl.netPnl >= 0 ? "success" : "error"

    const [portfolioRemainData,setPortfolioRemainData] = useState([]);
    //   const [contestPnl, setContestPnl] = useState([]);
    const [isLoading,setIsLoading] = useState(true)
    const { contestNetPnl, contestTotalRunningLots } = useContext(NetPnlContext);


    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    useEffect(()=>{
    
        axios.get(`${baseUrl}api/v1/portfolio/${portfolioId}/remainAmount`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
        })
        .then((res)=>{
            setPortfolioRemainData(res.data);
            setIsLoading(false);
            console.log("used portfolio", res.data)
        }).catch((err)=>{
            return new Error(err);
        })
    },[])

    let runningPnl = Number(contestNetPnl?.toFixed(0));
    const currentValue = portfolioRemainData?.pnl?.length && ((portfolioRemainData?.portfolio?.portfolioValue) + (portfolioRemainData?.pnl[0]?.amount - portfolioRemainData?.pnl[0]?.brokerage));
    const availableValue = currentValue + contestNetPnl;
    const usedValue =  runningPnl >= 0 ? 0 : runningPnl


    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.body2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: 40,
        lineHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

  return (
    <MDBox mb={0} mt={0}>
        {isLoading ?
        <Grid mt={12} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
            <CircularProgress color="light" />
        </Grid>
        :
        <Grid container spacing={2}>
        {[lightTheme].map((theme, index) => (
            <Grid item xs={12} key={index} >
            <ThemeProvider theme={theme}>
                <MDBox
                sx={{
                    p: 2,
                    pb:2,
                    // bgcolor: 'background.default',
                    bgcolor: 'none',
                    display: 'grid',
                    gridTemplateColumns: { md: '1fr 1fr 1fr' },
                    gap: 1,
                }}
                >

                    <Item elevation={2}>           
                        <MDBox m={0.2} style={{fontSize: "10px"}} fontWeight={700} >Opening Value:</MDBox>
                        <MDBox m={0.2} style={{fontSize: "10px"}} fontWeight={700} color={"black"}>{currentValue >= 0.00 ? "+₹" + (currentValue.toFixed(0)): "-₹" + ((-currentValue).toFixed(0))}</MDBox>
                    </Item>
                    <Item elevation={2}>           
                        <MDBox m={0.2} style={{fontSize: "10px"}} fontWeight={700} >Available Value:</MDBox>
                        <MDBox m={0.2} style={{fontSize: "10px"}} fontWeight={700} color={"black"}>{availableValue >= 0.00 ? "+₹" + (availableValue.toFixed(0)): "-₹" + ((-availableValue).toFixed(0))}</MDBox>
                    </Item>
                    <Item elevation={2}>           
                        <MDBox m={0.2} style={{fontSize: "10px"}} fontWeight={700} >Used Value:</MDBox>
                        <MDBox m={0.2} style={{fontSize: "10px"}} fontWeight={700} color={"black"}>{usedValue >= 0.00 ? "+₹" + (usedValue.toFixed(0)): "-₹" + ((-usedValue).toFixed(0))}</MDBox>
                    </Item>
                </MDBox>
            </ThemeProvider>
            </Grid>
        ))}

        </Grid>
        }
    </MDBox>
    )
}

export default memo(UsedPortfolio);
