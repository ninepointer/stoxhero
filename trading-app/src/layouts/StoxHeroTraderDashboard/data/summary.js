import React from "react";
import axios from "axios";
import { useEffect, useState, useContext, useRef, useReducer } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";


function Summary({summary}) {

  return (
    <MDBox bgColor="light" border='1px solid lightgrey' borderRadius={5} minHeight='auto'>
        <Grid container display='flex' justifyContent='space-between' alignItems='center'>
            <Grid item xs={12} md={6} lg={12} m={1}>
                <MDBox display='flex' mb={1} justifyContent='space-between' alignItems='center'>
                <Grid container alignItems='center'>
                    <Grid item xs={12} md={6} lg={4}>
                    <MDTypography ml={1} fontSize={15} fontWeight="bold">Returns Summary</MDTypography>
                    </Grid>
                </Grid>
                </MDBox>
                <MDBox bgColor="light" borderRadius={5} minHeight='auto'>
                    <Grid container spacing={1} display='flex' justifyContent='center' alignItems='center'>
                        <Grid item xs={12} md={4} lg={4}>
                            <MDBox bgColor='lightgrey' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='70%' fontSize={12} fontWeight="bold">Virtual Trading</MDTypography>
                                <MDTypography minWidth='30%' fontSize={12} color={summary?.virtualData?.npnl>=0?'success':'error'} fontWeight="bold" style={{textAlign:'center'}}>{((summary?.virtualData?.npnl??0)/1000000).toFixed(2)}%</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={12} md={4} lg={4}>
                            <MDBox bgColor='lightgrey' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='70%' fontSize={12} fontWeight="bold">Contest Trading</MDTypography>
                                <MDTypography minWidth='30%' fontSize={12} color={(summary?.contestReturn?.toFixed(2)>=0)?'success':'error'} 
                                fontWeight="bold" style={{textAlign:'center'}}>
                                    {(summary?.contestReturn*100)?.toFixed(2)}%</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={12} md={4} lg={4} >
                            <MDBox bgColor='lightgrey' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='70%' fontSize={12} fontWeight="bold">TenX Trading</MDTypography>
                                <MDTypography minWidth='30%' fontSize={12} color={summary?.tenxData?.npnl?'success':'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                    {(summary?.tenxReturn*100)?.toFixed(2)}%
                                </MDTypography>    
                                {/* <MDTypography minWidth='30%' fontSize={12} color={summary?.tenxData?.npnl?'success':'error'} fontWeight="bold" style={{textAlign:'center'}}>
                                    {isNaN(((summary?.tenxData?.npnl??0)/summary?.totalTenXPortfolioValue).toFixed(2))?0:((summary?.tenxData?.npnl??0)/summary?.totalTenXPortfolioValue).toFixed(2)}%</MDTypography> */}
                            </MDBox>
                        </Grid>
                       
                    </Grid>
                </MDBox>
            </Grid>

            {/* <Grid item xs={12} md={6} lg={12} ml={1} mr={1} mb={1}>
                <MDBox display='flex' mb={1} justifyContent='space-between' alignItems='center'>
                <Grid container spacing={1} alignItems='center'>
                    <Grid item xs={12} md={6} lg={4}>
                    <MDTypography ml={1} mb={1} fontSize={15} fontWeight="bold">Summary - TenX Trading</MDTypography>
                    </Grid>
                </Grid>
                </MDBox>
                <MDBox bgColor="lightgrey" borderRadius={5} minHeight='auto'>
                <Grid container spacing={1} p={1} display='flex' justifyContent='center' alignItems='center'>
                        <Grid item xs={12} md={4} lg={4}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='50%' fontSize={13} fontWeight="bold">P&L</MDTypography>
                                <MDTypography minWidth='50%' fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>+₹40,000</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={12} md={4} lg={4}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='50%' fontSize={13} fontWeight="bold">Trading Days</MDTypography>
                                <MDTypography minWidth='50%' fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>12</MDTypography>
                            </MDBox>
                        </Grid>

                        <Grid item xs={12} md={4} lg={4}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='50%' fontSize={13} fontWeight="bold">Available Margin</MDTypography>
                                <MDTypography minWidth='50%' fontSize={13} color='success' fontWeight="bold" style={{textAlign:'center'}}>₹1,000,000</MDTypography>
                            </MDBox>
                        </Grid>
                       
                    </Grid>
                </MDBox>
            </Grid> */}
        </Grid>
    </MDBox>
)
}

export default Summary;
