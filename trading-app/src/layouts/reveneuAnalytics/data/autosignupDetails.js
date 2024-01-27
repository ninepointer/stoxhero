
import { Divider, Grid, CircularProgress } from '@mui/material';
import MDTypography from "../../../components/MDTypography/index.js";
import React from 'react';
import { useState, useEffect, memo, useContext } from "react"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";
import { apiUrl } from '../../../constants/constants';
import { Card } from '@mui/material';
// import DataTable from '../../../../examples/Tables/DataTable';

function AutoSignupRevenue({ period }) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${apiUrl}revenue/signuprevenue?period=${period}`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        }
        ).then((res) => {
            setData(res.data.data);
            setLoading(false);
        })
    }, []);

    return (
        <>
            {
                loading ?
                    <Grid p={1} container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ borderRadius: 5, width: '100%', height: 'auto' }}>
                        <CircularProgress color='dark' />
                    </Grid>
                    :
                    data.length > 0 ?
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography fontSize={14} fontWeight={700} >
                                    AutoSignup Revenue
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>

                                <Card>

                                    <Grid p={1} container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ backgroundColor: 'white', borderRadius: 5, minWidth: '100%', height: 'auto' }}>

                                        <Divider style={{ width: '100%' }} />
                                        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                            <MDTypography variant='caption' fontWeight='bold'>AutoSignup Revenue Data</MDTypography>
                                        </Grid>
                                        <Divider style={{ width: '100%' }} />

                                        <Grid item xs={12} md={12} lg={1.71} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                            <MDTypography variant='caption'>Code</MDTypography>
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={1.71} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                            <MDTypography variant='caption'>Users Acquired</MDTypography>
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={1.71} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                            <MDTypography variant='caption'>Active Users</MDTypography>
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={1.71} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                            <MDTypography variant='caption'>Paid Users</MDTypography>
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={1.71} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                            <MDTypography variant='caption'>Total Revenue</MDTypography>
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={1.71} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                            <MDTypography variant='caption'>Actual Revenue</MDTypography>
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={1.71} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                            <MDTypography variant='caption'>Signup Bonus</MDTypography>
                                        </Grid>

                                        <Divider style={{ width: '100%' }} />
                                        {
                                            data.map((elem) => {
                                                return (
                                                    <>
                                                        <Grid item xs={12} md={12} lg={1.71} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                            <MDTypography variant='caption'>{elem?.campaignCode || "-"}</MDTypography>
                                                        </Grid>
                                                        <Grid item xs={12} md={12} lg={1.71} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                            <MDTypography variant='caption'>{elem?.totalUsers || 0}</MDTypography>
                                                        </Grid>
                                                        <Grid item xs={12} md={12} lg={1.71} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                            <MDTypography variant='caption'>{elem?.activeUsers || 0}</MDTypography>
                                                        </Grid>
                                                        <Grid item xs={12} md={12} lg={1.71} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                            <MDTypography variant='caption'>{elem?.paidUsers || 0}</MDTypography>
                                                        </Grid>
                                                        <Grid item xs={12} md={12} lg={1.71} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                            <MDTypography variant='caption'>{"₹" + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(elem?.totalRevenue) || 0)}</MDTypography>
                                                        </Grid>
                                                        <Grid item xs={12} md={12} lg={1.71} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                            <MDTypography variant='caption'>{"₹" + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(elem?.signUpBonus - elem?.totalRevenue) || 0)}</MDTypography>
                                                        </Grid>
                                                        <Grid item xs={12} md={12} lg={1.71} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                            <MDTypography variant='caption'>{"₹" + new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(elem?.signUpBonus) || 0)}</MDTypography>
                                                        </Grid>

                                                        <Divider style={{ width: '100%' }} />
                                                    </>
                                                )
                                            })
                                        }

                                    </Grid>

                                </Card>
                            </AccordionDetails>
                        </Accordion>
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

export default memo(AutoSignupRevenue);