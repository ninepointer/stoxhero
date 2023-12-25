import React from 'react'
import { useState, useEffect } from "react"
import axios from "axios";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import moment from 'moment';
// import { userContext } from "../../../AuthContext";
import MDBox from "../../../components/MDBox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "../../../components/MDTypography";
import DataTable from "../../../examples/Tables/DataTable";
import { apiUrl } from "../../../constants/constants"
import { Divider } from '@mui/material';
import MDButton from '../../../components/MDButton';
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    Typography
} from '@mui/material';

import { CircularProgress } from "@mui/material";

// avatar style
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

// action style
const actionSX = {
    mt: 0.75,
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
};

function ReferralProduct({ start, end }) {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    let [skip, setSkip] = useState(0);
    const limitSetting =5;


    useEffect(() => {
        setIsLoading(true)
        axios.get(`${apiUrl}affiliate/mytransactions?startDate=${start}&endDate=${end}&skip=${skip}&limit=${limitSetting}`, { withCredentials: true })
            .then((res) => {
                console.log(res.data)
                setData(res.data.data);
                setCount(res.data.count);
                setIsLoading(false)
            }).catch((err) => {
                //window.alert("Server Down");
                setTimeout(() => {
                    setIsLoading(false)
                }, 500)
                return new Error(err);
            })
    }, [start, end])

    function backHandler() {
        if (skip <= 0) {
            return;
        }
        setSkip(prev => prev - limitSetting);
        setData([]);
        setIsLoading(true)
        axios.get(`${apiUrl}affiliate/mytransactions?startDate=${start}&endDate=${end}&skip=${skip - limitSetting}&limit=${limitSetting}`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": false
            },
        })
            .then((res) => {
                console.log("Orders:", res.data)
                setData(res.data.data)
                setCount(res.data.count)
                setTimeout(() => {
                    setIsLoading(false)
                }, 500)
            }).catch((err) => {
                console.log(err)
                setIsLoading(false)
                return new Error(err);
            })
    }

    function nextHandler() {
        if (skip + limitSetting >= count) {
            console.log("inside skip", count, skip + limitSetting)
            return;
        }
        console.log("inside next handler")
        setSkip(prev => prev + limitSetting);
        setData([]);
        setIsLoading(true)
        axios.get(`${apiUrl}affiliate/mytransactions?startDate=${start}&endDate=${end}&skip=${skip + limitSetting}&limit=${limitSetting}`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": false
            },
        })
            .then((res) => {
                console.log("orders", res.data)
                setData(res.data.data)
                setCount(res.data.count)
                setTimeout(() => {
                    setIsLoading(false)
                }, 500)
            }).catch((err) => {
                console.log(err)
                setIsLoading(false)
                return new Error(err);
            })
    }

    function dateConvert(dateConvert) {
        const dateString = dateConvert;
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };

        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

        // get day of month and add ordinal suffix
        const dayOfMonth = date.getDate();
        const getYear = date.getFullYear();
        let suffix = "th";
        if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
            suffix = "st";
        } else if (dayOfMonth === 2 || dayOfMonth === 22) {
            suffix = "nd";
        } else if (dayOfMonth === 3 || dayOfMonth === 23) {
            suffix = "rd";
        }

        // combine date and time string with suffix
        const finalFormattedDate = `${dayOfMonth}${suffix} ${formattedDate?.split(" ")[0]} ${getYear}, ${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;

        // console.log(finalFormattedDate); // Output: "3rd April, 9:27 PM"



        return finalFormattedDate
    }

    return (
        <>

            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={1}
                                px={2}
                                variant="gradient"
                                bgColor="dark"
                                borderRadius="lg"
                                coloredShadow="dark"
                                sx={{
                                    display: 'flex',
                                    justifyContent: "space-between",
                                }}>
                                <MDTypography variant="h6" color="white" py={1}>
                                    Transactions
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={2}>
                                {!isLoading ?
                                    data?.map((elem) => {
                                        return (
                                            <>
                                                <List
                                                    component="nav"
                                                    sx={{
                                                        px: 0,
                                                        py: 0,
                                                        '& .MuiListItemButton-root': {
                                                            py: 1.5,
                                                            '& .MuiAvatar-root': avatarSX,
                                                            '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                                                        }
                                                    }}
                                                >
                                                    <ListItemButton divider>
                                                        <ListItemAvatar>
                                                            <Avatar
                                                                sx={{
                                                                    color: 'success.main',
                                                                    bgcolor: 'success.lighter'
                                                                }}
                                                            >
                                                                <CurrencyRupeeIcon />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText primary={<Typography variant="subtitle1" color='black' fontSize={12}>TransactionId #{elem?.transactionId}</Typography>} secondary={<Typography variant="subtitle1" color='black' fontSize={16} fontWeight={500}> {`Received ₹${elem?.payout?.toFixed(2)} as commission on ${elem?.buyer_first_name}'s ${elem?.product_name === "SignUp" ? elem?.product_name : elem?.product_name + " purchase."}`}</Typography>} />
                                                        <ListItemSecondaryAction>
                                                            <Stack alignItems="flex-end">
                                                                <Typography color='green' variant="subtitle1" noWrap>
                                                                    +₹{elem?.payout?.toFixed(2)}
                                                                </Typography>
                                                                <Typography fontSize={12} color="black" noWrap>
                                                                    {dateConvert(elem?.date)}
                                                                    {/* {moment.utc(elem?.date).format('DD-MM-YY HH:mm:ss')} */}
                                                                </Typography>
                                                            </Stack>
                                                        </ListItemSecondaryAction>
                                                    </ListItemButton>
                                                </List>
                                            </>
                                        )
                                    })

                                    :

                                    <Grid container display="flex" justifyContent="center" alignContent='center' alignItems="center">
                                        <Grid item display="flex" justifyContent="center" alignContent='center' alignItems="center" lg={12}>
                                            <MDBox mt={5} mb={5}>
                                                <CircularProgress color="info" />
                                            </MDBox>
                                        </Grid>
                                    </Grid>
                                }
                                                                                                    
                                {!isLoading && count !== 0 &&
                                    <MDBox mt={1} p={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                                        <MDButton variant='outlined' color='secondary' disabled={(skip + limitSetting) / limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
                                        <MDTypography color="dark" fontSize={15} fontWeight='bold'>Total Transactions: {!count ? 0 : count} | Page {(skip + limitSetting) / limitSetting} of {!count ? 1 : Math.ceil(count / limitSetting)}</MDTypography>
                                        <MDButton variant='outlined' color='secondary' disabled={Math.ceil(count / limitSetting) === (skip + limitSetting) / limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
                                    </MDBox>
                                }

                                {
                                    count == 0 &&
                                    <MDTypography color="secondary" mt={2} mb={2} fontSize={15} fontWeight='bold' display='flex' alignItems='center' alignContent='center' justifyContent='center'>No Transactions Yet!</MDTypography>
                                }
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>

        </>

    );
}

export default ReferralProduct;
