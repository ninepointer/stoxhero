import React, { useState, useEffect } from "react"
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import { apiUrl } from "../../../constants/constants";
import axios from 'axios';


function FinowledgeUser() {
    const [skip, setSkip] = useState(0);
    const limitSetting = 10;
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        const data = await axios.get(`${apiUrl}user/finowledge?skip=${skip}&limit=${limitSetting}`, {withCredentials: true})
        setData(data?.data?.data);
        setCount(data?.data?.count);
    }

    async function backHandler() {
        if (skip <= 0) {
            return;
        }
        setSkip(prev => prev - limitSetting);
        setData([]);
        setIsLoading(true)
        await fetchData();
    }

    async function nextHandler() {
        if (skip + limitSetting >= count) {
            return;
        }
        setSkip(prev => prev + limitSetting);
        setData([]);
        setIsLoading(true)
        await fetchData();
    }

    return (
        <>
            <MDBox bgColor='light' mt={2} borderRadius={5}>
                <MDTypography color="dark" fontWeight='bold' align='center' fontSize={13}>Finowledge Users</MDTypography>
            </MDBox>
            <Grid mt={2} p={1} container xs={12} md={12} lg={12} style={{ border: '1px solid white', borderRadius: 5 }}>
                <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">Full Name</MDTypography>
                </Grid>

                <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13} fontWeight="bold">Mobile No.</MDTypography>
                </Grid>
                <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13} fontWeight="bold">City</MDTypography>
                </Grid>

                <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="light" fontSize={13} fontWeight="bold">Joining Date</MDTypography>
                </Grid>
            </Grid>

            {data?.map((elem) => {

                return (
                    <Grid mt={1} p={1} container style={{ border: '1px solid white', borderRadius: 5 }}>
                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="left" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={13} display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.full_name}</MDTypography>
                        </Grid>
                      
                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={13}>{elem?.mobile}</MDTypography>
                        </Grid>

                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color="light" fontSize={13}>{elem?.schoolDetails?.city?.name}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color='light' fontSize={13}>{new Date(elem?.joining_date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} {(new Date(elem?.joining_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true, timeStyle: 'medium' }).toUpperCase())}</MDTypography>
                        </Grid>
                    </Grid>
                )
            })}

            {!isLoading && count !== 0 &&
                <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                    <MDButton variant='outlined' color='warning' disabled={(skip + limitSetting) / limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
                    <MDTypography color="light" fontSize={15} fontWeight='bold'>Total TestZones: {!count ? 0 : count} | Page {(skip + limitSetting) / limitSetting} of {!count ? 1 : Math.ceil(count / limitSetting)}</MDTypography>
                    <MDButton variant='outlined' color='warning' disabled={Math.ceil(count / limitSetting) === (skip + limitSetting) / limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
                </MDBox>
            }
        </>

    );
}

export default FinowledgeUser;