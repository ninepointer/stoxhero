import React from "react";
import axios from "axios";
import { useEffect, useState, useContext, useRef, useReducer } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";


function Summary({featuredContests}) {

  return (
    <MDBox bgColor="light" border='1px solid lightgrey' borderRadius={5} minHeight='auto'>
        <Grid container display='flex' justifyContent='space-between' alignItems='center'>
            <Grid item xs={12} md={6} lg={12} m={1}>
                <MDBox display='flex' mb={1} justifyContent='space-between' alignItems='center'>
                <Grid container alignItems='center'>
                    <Grid item xs={12} md={6} lg={4}>
                    <MDTypography ml={1} fontSize={15} fontWeight="bold">Featured</MDTypography>
                    </Grid>
                </Grid>
                </MDBox>
                <MDBox bgColor="light" borderRadius={5} minHeight='auto'>
                    <Grid container spacing={1} display='flex' justifyContent='center' alignItems='center'>
                        {featuredContests?.map((item)=><Grid item xs={12} md={4} lg={4}>
                            <MDBox bgColor='lightgrey' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='70%' fontSize={12} fontWeight="bold">Virtual Trading</MDTypography>
                                <MDTypography minWidth='30%' fontSize={12} color={2000>=0?'success':'error'} fontWeight="bold" style={{textAlign:'center'}}>{((1000000??0)/10000).toFixed(2)}%</MDTypography>
                            </MDBox>
                        </Grid>)}
                       
                    </Grid>
                </MDBox>
            </Grid>
        </Grid>
    </MDBox>
)
}

export default Summary;
