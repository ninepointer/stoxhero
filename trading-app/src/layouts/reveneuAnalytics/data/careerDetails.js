


import { Divider, Grid, CircularProgress } from '@mui/material';
import MDTypography from "../../../components/MDTypography/index.js";
import React from 'react';
import { useState, useEffect, memo } from "react"
import axios from "axios";
import { apiUrl } from '../../../constants/constants';
import { downloadAffiliate } from "./downloadData.js"
import { Card, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';
import MDButton from "../../../components/MDButton";

function CareerRevenue({ period }) {

    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${apiUrl}revenue/careerrevenue?period=${period}`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        }
        ).then((res) => {
            setData(res?.data?.data);
            setLoading(false);
        })
    }, []);

    const pnlData = downloadAffiliate(data)
    const handleDownload = (csvData, nameVariable) => {
        // Create the CSV content
        const csvContent = csvData?.map((row) => {
            return row?.map((row1) => row1.join(',')).join('\n');
        });

        // Create a Blob object with the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

        // Save the file using FileSaver.js
        saveAs(blob, `${nameVariable}.csv`);
    }

    return (
        <>
            {
                loading ?
                    <Grid p={1} container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ borderRadius: 5, width: '100%', height: 'auto' }}>
                        <CircularProgress color='dark' />
                    </Grid>
                    :
                    data ?
                        <Grid p={1} container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ backgroundColor: 'white', borderRadius: 5, minWidth: '100%', height: 'auto' }}>

                            <Divider style={{ width: '100%' }} />
                            <Grid container style={{ backgroundColor: 'white', border: '1px solid white', borderRadius: 5 }}>
                                <Grid item xs={12} md={2} lg={8} pl={1} display="flex" justifyContent="flex-start" alignContent="center" alignItems="center">
                                    <MDTypography color="dark" fontSize={12} fontWeight="bold">Career Revenue Data</MDTypography>
                                </Grid>
                                <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="flex-end" alignContent="center" alignItems="center">
                                    <Tooltip title="Download CSV">
                                        <MDButton variant='contained' onClick={() => {
                                            handleDownload(pnlData, "career_revenue")
                                        }}>
                                            <DownloadIcon />
                                        </MDButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Divider style={{ width: '100%' }} />

                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                <MDTypography variant='caption' fontSize={11} >Type</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                <MDTypography variant='caption' fontSize={11}>Users Acquired</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                <MDTypography variant='caption' fontSize={11}>Active Users</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                <MDTypography variant='caption' fontSize={11}>Paid Users</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                <MDTypography variant='caption' fontSize={11}>Total Revenue</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={1.2} pl={3} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                <MDTypography variant='caption' fontSize={10}>New User Revenue</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={1.2} pl={3} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                <MDTypography variant='caption' fontSize={10}>Old User Revenue</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                <MDTypography variant='caption' fontSize={11}>Bonus Used</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                <MDTypography variant='caption' fontSize={11}>Signup Bonus</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                <MDTypography variant='caption' fontSize={11}>Actual Revenue</MDTypography>
                            </Grid>

                            <Divider style={{ width: '100%' }} />


                            {
                                data.map((elem) => {
                                    return (
                                        <>
                                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                <MDTypography variant='caption' fontSize={11}>{(elem?.type)}</MDTypography>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                <MDTypography variant='caption' fontSize={11}>{elem?.total || 0}</MDTypography>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                <MDTypography variant='caption' fontSize={11}>{elem?.active || 0}</MDTypography>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                <MDTypography variant='caption' fontSize={11}>{elem?.paid || 0}</MDTypography>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                <MDTypography variant='caption' fontSize={11}>{"₹" + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.revenue || 0)}</MDTypography>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                <MDTypography variant='caption' fontSize={10}>{"₹" + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.newRevenue || 0)}</MDTypography>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                <MDTypography variant='caption' fontSize={10}>{"₹" + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.oldRevenue || 0)}</MDTypography>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                <MDTypography variant='caption' fontSize={11}>{"₹" + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.bonusUsed || 0)}</MDTypography>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                <MDTypography variant='caption' fontSize={11}>{"₹" + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.bonus || 0)}</MDTypography>
                                            </Grid>
                                            <Grid item xs={12} md={12} lg={1.2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                <MDTypography variant='caption' fontSize={11}>{"₹" + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.actualRevenue || 0)}</MDTypography>
                                            </Grid>

                                            <Divider style={{ width: '100%' }} />
                                        </>
                                    )
                                })
                            }

                        </Grid>
                        :
                        <Grid p={1} container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ backgroundColor: 'white', borderRadius: 5, width: '100%', height: 'auto' }}>
                            <Divider style={{ width: '100%' }} />
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                <MDTypography variant='caption' fontWeight='bold'>AutoSignup Revenue Data</MDTypography>
                            </Grid>
                            <Divider style={{ width: '100%' }} />

                            <MDTypography variant='caption'>No Data</MDTypography>
                        </Grid>
            }
        </>
    );
}

export default memo(CareerRevenue);