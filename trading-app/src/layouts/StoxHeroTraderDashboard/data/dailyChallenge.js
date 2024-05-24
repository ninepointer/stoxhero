import React from "react";
import axios from "axios";
import { useEffect, useState, useContext, useRef, useReducer } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import DailyChallengeCard from '../data/dailyChallengeCard'


function Summary({summary}) {

  return (
    <MDBox bgColor="light" border='1px solid lightgrey' borderRadius={5} minHeight='auto'>
        <Grid container display='flex' justifyContent='space-between' alignItems='center'>
            <Grid item xs={12} md={6} lg={12} p={1}>
                <MDBox display='flex' mb={1} justifyContent='space-between' alignItems='center'>
                <Grid container alignItems='center'>
                    <Grid item xs={12} md={6} lg={4}>
                    <MDTypography ml={1} fontSize={15} fontWeight="bold">Upcoming Challenge</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={12} mt={.5} display='flex' justifyContent='center'>
                        <DailyChallengeCard/>
                    </Grid>
                </Grid>
                </MDBox>
            </Grid>
        </Grid>
    </MDBox>
)
}

export default Summary;
