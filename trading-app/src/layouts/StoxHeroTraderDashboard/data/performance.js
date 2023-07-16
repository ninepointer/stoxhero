import React from "react";
import axios from "axios";
import { useEffect, useState, useContext, useRef, useReducer } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


function Performance({tradingData}) {
  console.log("Trading Data:",tradingData)
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
                <Grid container spacing={1} alignItems='center'>
                    <Grid item xs={12} md={6} lg={6}>
                    <MDTypography m={1} fontSize={13} fontWeight="bold">Performance</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} display='flex' justifyContent='flex-end'>
                    <FormControl sx={{ m: 1, minWidth: 175 }}>
                        <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        value={trading}
                        // defaultValue="Jun 23"
                        onChange={handleChange}
                        >
                        <MenuItem value="Virtual Trading">Virtual Trading</MenuItem>
                        <MenuItem value="TenX Trading">TenX Trading</MenuItem>
                        <MenuItem value="Contest Trading">Contest Trading</MenuItem>
                        </Select>
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} display='flex' justifyContent='flex-end'>
                    <FormControl sx={{ m: 1, minWidth: 150 }}>
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
                        <MenuItem value="Lifetime">Lifetime</MenuItem>
                        </Select>
                    </FormControl>
                    </Grid>
                </Grid>
                </MDBox>
                <MDBox bgColor="lightgrey" borderRadius={5} minHeight='auto'>
                    <Grid container spacing={1} p={1}>
                        
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Market Days</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='success' fontWeight="bold" textAlign='right'>{tradingData?.totalMarketDays}</MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Trading Days</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='success' fontWeight="bold" textAlign='right'>{tradingData?.totalTradingDays}</MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Profit Days</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='success' fontWeight="bold" textAlign='right'>{tradingData?.profitDays}</MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Loss Days</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='success' fontWeight="bold" textAlign='right'>{tradingData?.lossDays}</MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Profit & Loss</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='success' fontWeight="bold" textAlign='right'>Coming Soon(+10%)</MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Portfolio</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='success' fontWeight="bold" textAlign='right'>Coming Soon</MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Max Profit</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='success' fontWeight="bold" textAlign='right'>Coming Soon(10%)</MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Max Loss</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='success' fontWeight="bold" textAlign='right'>Coming Soon(12%)</MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Avg. Profit</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='success' fontWeight="bold" textAlign='right'>Coming Soon</MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Avg. Loss</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='success' fontWeight="bold" textAlign='right'>Coming Soon</MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Max. Win Streak</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='success' fontWeight="bold" textAlign='right'>Coming Soon</MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <MDBox bgColor='light' p={2} borderRadius={5} display='flex' minWidth='100%'>
                                <MDTypography minWidth='45%' fontSize={13} fontWeight="bold">Max. Loss Streak</MDTypography>
                                <MDTypography minWidth='55%' fontSize={13} color='success' fontWeight="bold" textAlign='right'>Coming Soon</MDTypography>
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
