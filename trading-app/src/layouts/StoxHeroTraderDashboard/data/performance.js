import React from "react";
import axios from "axios";
import { useEffect, useState, useContext, useRef, useReducer } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


function Performance() {

  const [monthYear, setMonthYear] = React.useState('Jun 23');
  const [trading, setTrading] = React.useState('Virtual Trading');
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);

  const handleChange = (event) => {
    setTrading(event.target.value);
  };

  const handleChange1 = (event) => {
    setMonthYear(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleOpen1 = () => {
    setOpen1(true);
  };

  return (
    <MDBox bgColor="light" border='1px solid lightgrey' borderRadius={5} minHeight='40vh'>
        <Grid container spacing={1} display='flex' justifyContent='space-between' alignItems='center'>
            <Grid item xs={12} md={6} lg={12} ml={1} mr={1} mb={1}>
                <MDBox display='flex' mb={1} justifyContent='space-between' alignItems='center'>
                <Grid container spacing={0} alignItems='center'>
                    <Grid item xs={12} md={6} lg={8}>
                    <MDTypography m={1} fontSize={13} fontWeight="bold">Performance - Virtual Trading (Till Yesterday)</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} display='flex' justifyContent='flex-end'>
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                        <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        open={open1}
                        onClose={handleClose1}
                        onOpen={handleOpen1}
                        value={monthYear}
                        // defaultValue="Jun 23"
                        onChange={handleChange1}
                        >
                        <MenuItem value="Apr 23">Apr 23</MenuItem>
                        <MenuItem value="May 23">May 23</MenuItem>
                        <MenuItem value="Jun 23">Jun 23</MenuItem>
                        </Select>
                    </FormControl>
                    </Grid>
                </Grid>
                </MDBox>
                <MDBox bgColor="lightgrey" borderRadius={5} mt={2} minHeight='auto'>
                    <Grid container spacing={2} p={1}>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={1} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='50%' fontSize={13} fontWeight="bold">Realised P&L</MDTypography>
                                <MDTypography minWidth='50%' fontSize={13} color='success' fontWeight="bold">+₹40,000</MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={1} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='66.66%' fontSize={13} fontWeight="bold">Trading Days</MDTypography>
                                <MDTypography minWidth='33.33%' fontSize={13} color='success' fontWeight="bold">12</MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={1} borderRadius={5} display='flex' minWidth='100%'>
                                <MDBox display='flex' flexDirection='column' minWidth='50%'>
                                    <MDTypography fontSize={13} fontWeight="bold">Max Profit</MDTypography>
                                    <MDTypography fontSize={13} color='success' fontWeight="bold">₹67,000</MDTypography>
                                </MDBox>
                                <MDBox display='flex' flexDirection='column' minWidth='50%'>
                                    <MDTypography fontSize={13} style={{textAlign:'left'}} fontWeight="bold">Max Loss</MDTypography>
                                    <MDTypography fontSize={13} color='error' style={{textAlign:'left'}} fontWeight="bold">₹45,000</MDTypography>
                                </MDBox>
                            </MDBox>
                            <MDBox bgColor='light' p={1} mt={1} borderRadius={5} display='flex'>
                                <MDBox display='flex' flexDirection='column' minWidth='50%'>
                                    <MDTypography fontSize={13} fontWeight="bold">Profit %</MDTypography>
                                    <MDTypography fontSize={13} color='success' fontWeight="bold">100%</MDTypography>
                                </MDBox>
                                <MDBox display='flex' flexDirection='column' minWidth='50%'>
                                    <MDTypography fontSize={13} style={{textAlign:'left'}} fontWeight="bold">Loss %</MDTypography>
                                    <MDTypography fontSize={13} color='error' style={{textAlign:'left'}} fontWeight="bold">0%</MDTypography>
                                </MDBox>
                            </MDBox>
                            <MDBox bgColor='light' p={1} mt={1} borderRadius={5} display='flex'>
                                <MDBox display='flex' flexDirection='column' minWidth='50%'>
                                    <MDTypography fontSize={13} fontWeight="bold">Avg. Profit</MDTypography>
                                    <MDTypography fontSize={13} color='success' fontWeight="bold">₹23,000</MDTypography>
                                </MDBox>
                                <MDBox display='flex' flexDirection='column' minWidth='50%'>
                                    <MDTypography fontSize={13} style={{textAlign:'left'}} fontWeight="bold">Avg. Loss</MDTypography>
                                    <MDTypography fontSize={13} color='error' style={{textAlign:'left'}} fontWeight="bold">₹34,000</MDTypography>
                                </MDBox>
                            </MDBox>
                        </Grid>

                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={1} borderRadius={5} display='flex' minWidth='100%'>
                                <MDBox display='flex' flexDirection='column' minWidth='33.33%'>
                                    <MDTypography fontSize={13} fontWeight="bold">Profit Days</MDTypography>
                                    <MDTypography fontSize={13} color='success' fontWeight="bold">5</MDTypography>
                                </MDBox>
                                <MDBox display='flex' flexDirection='column' minWidth='33.33%'>
                                    <MDTypography fontSize={13} style={{textAlign:'left'}} fontWeight="bold">Loss Days</MDTypography>
                                    <MDTypography fontSize={13} color='error' style={{textAlign:'left'}} fontWeight="bold">3</MDTypography>
                                </MDBox>
                                <MDBox display='flex' flexDirection='column' minWidth='33.33%'>
                                    <MDTypography fontSize={13} style={{textAlign:'left'}} fontWeight="bold">Trading Days</MDTypography>
                                    <MDTypography fontSize={13} color='error' style={{textAlign:'left'}} fontWeight="bold">8</MDTypography>
                                </MDBox>
                            </MDBox>
                            <MDBox bgColor='light' p={1} mt={1} borderRadius={5} display='flex'>
                                <MDBox display='flex' flexDirection='column' minWidth='50%'>
                                    <MDTypography fontSize={13} fontWeight="bold">Max Win Streak</MDTypography>
                                    <MDTypography fontSize={13} color='success' fontWeight="bold">2</MDTypography>
                                </MDBox>
                                <MDBox display='flex' flexDirection='column' minWidth='50%'>
                                    <MDTypography fontSize={13} style={{textAlign:'left'}} fontWeight="bold">Max Loss Streak</MDTypography>
                                    <MDTypography fontSize={13} color='error' style={{textAlign:'left'}} fontWeight="bold">4</MDTypography>
                                </MDBox>
                            </MDBox>
                            <MDBox bgColor='light' p={1} mt={1} borderRadius={5} display='flex'>
                                <MDBox display='flex' flexDirection='column' minWidth='100%'>
                                    <MDTypography fontSize={13} fontWeight="bold">Risk Reward</MDTypography>
                                    <MDTypography fontSize={13} color='info' fontWeight="bold">Coming Soon</MDTypography>
                                </MDBox>
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>
            </Grid>
        </Grid>
    </MDBox>
)
}

export default Performance;
