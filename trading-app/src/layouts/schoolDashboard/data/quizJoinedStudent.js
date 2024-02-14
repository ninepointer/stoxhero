import React from 'react'
import { useState, useEffect, useContext } from "react"
import moment from 'moment';
// import { userContext } from "../../../AuthContext";
import MDBox from "../../../components/MDBox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import logo from "../../../assets/images/logo1.jpeg";

import MDButton from '../../../components/MDButton';
import MDTypography from "../../../components/MDTypography";
import MDAvatar from '../../../components/MDAvatar';
import {
    Tooltip,
    Box,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography
} from '@mui/material';

import { CircularProgress } from "@mui/material";
import { userContext } from '../../../AuthContext';
import DownloadIcon from '@mui/icons-material/Download';
// avatar style
const avatarSX = {
    width: 50,
    height: 50,
    fontSize: '1rem'
};

// action style
const actionSX = {
    // mt: 0.75,
    // ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
};

function ReferralProduct() {
    // const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const data = [
        {
            grade: '6th',
            joining_date: '2023-08-07T15:50:00.400Z',
            full_name: 'Vijay Verma',
            image: '',
            dob: '1998-10-09'
        },
        {
            grade: '6th',
            joining_date: '2023-08-07T15:50:00.400Z',
            full_name: 'Vijay Verma',
            image: '',
            dob: '1998-10-09'
        },
        {
            grade: '6th',
            joining_date: '2023-08-07T15:50:00.400Z',
            full_name: 'Vijay Verma',
            image: '',
            dob: '1998-10-09'
        },
        {
            grade: '6th',
            joining_date: '2023-08-07T15:50:00.400Z',
            full_name: 'Vijay Verma',
            image: '',
            dob: '1998-10-09'
        },
        {
            grade: '6th',
            joining_date: '2023-08-07T15:50:00.400Z',
            full_name: 'Vijay Verma',
            image: '',
            dob: '1998-10-09'
        },
        {
            grade: '6th',
            joining_date: '2023-08-07T15:50:00.400Z',
            full_name: 'Vijay Verma',
            image: '',
            dob: '1998-10-09'
        },
        {
            grade: '6th',
            joining_date: '2023-08-07T15:50:00.400Z',
            full_name: 'Vijay Verma',
            image: '',
            dob: '1998-10-09'
        }
    ]


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

            <MDBox >
                <Box 
                    sx={{
                        overflowY: 'auto',
                        maxHeight: 380, // Set maxHeight to your desired value
                        '&::-webkit-scrollbar': {
                            width: '6px', // Width of the scrollbar
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(127,127,127,0.2)', // Color of the scrollbar thumb
                            borderRadius: '3px', // Rounded corners of the scrollbar thumb
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: 'rgba(127,127,127,0.4)', // Color of the scrollbar thumb on hover
                        },
                        borderRadius: 2,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        // coloredShadow: "#FF8282"
                    }}
                // sx={{ overflow: 'auto', maxHeight: 400 }}
                >
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Card>
                                <MDBox
                                    // mx={2}
                                    // mt={-3}
                                    // py={1}
                                    px={1}
                                    variant="gradient"
                                    bgColor="#60EFB1"

                                    borderRadius="lg"
                                    coloredShadow="secondary"
                                    sx={{
                                        display: 'flex',
                                        justifyContent: "space-between",
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#51D79D'
                                    }}>
                                    <MDTypography variant="h6" color="white" py={1}>
                                        Quiz Registered
                                    </MDTypography>
                                    <Tooltip title="Download Full List">
                                        {/* <MDButton variant='contained' backgroundColor='#FF8282' color='ffffff' size='small' onClick={() => {
                                            // handleDownload(pnlData, "autosignup_revenue")
                                        }}> */}
                                            <DownloadIcon sx={{color: '#ffffff', cursor: 'pointer'}} />
                                        {/* </MDButton> */}
                                    </Tooltip>
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
                                                                <MDAvatar
                                                                    src={logo}
                                                                    alt={"Mandir"}
                                                                    size="lg"
                                                                    sx={{
                                                                        cursor: "pointer",
                                                                        borderRadius: "10px",
                                                                        height: "200px",
                                                                        width: "200px",
                                                                        ml: 0,
                                                                    }}
                                                                />
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={
                                                                    <Typography variant="subtitle1" color='black' fontSize={15}>
                                                                        {elem?.full_name}({elem?.grade})
                                                                    </Typography>
                                                                }
                                                                secondary={
                                                                    <>
                                                                        <Typography variant="subtitle1" color='black' fontSize={14} fontWeight={500}>
                                                                            {`DOB : ${moment(elem?.dob).format('DD-MM-YYYY')}`}
                                                                        </Typography>
                                                                        <Typography variant="subtitle1" color='black' fontSize={13} fontWeight={500}>
                                                                            Joining Date : {dateConvert(elem?.joining_date)}
                                                                        </Typography>
                                                                    </>
                                                                }
                                                            />

                                                            {/* <ListItemSecondaryAction>
                                                            <Stack alignItems="flex-end">
                                                                <Typography fontSize={12} color="black" noWrap>
                                                                    {dateConvert(elem?.joining_date)}
                                                                </Typography>
                                                            </Stack>
                                                        </ListItemSecondaryAction> */}
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

                                    {/* {!isLoading && count !== 0 &&
                                    <MDBox mt={1} p={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                                        <MDButton variant='outlined' color='secondary' disabled={(skip + limitSetting) / limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
                                        <MDTypography color="dark" fontSize={15} fontWeight='bold'>Total Transactions: {!count ? 0 : count} | Page {(skip + limitSetting) / limitSetting} of {!count ? 1 : Math.ceil(count / limitSetting)}</MDTypography>
                                        <MDButton variant='outlined' color='secondary' disabled={Math.ceil(count / limitSetting) === (skip + limitSetting) / limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
                                    </MDBox>
                                } */}

                                    {
                                        count == 0 &&
                                        <MDTypography color="secondary" mt={2} mb={2} fontSize={15} fontWeight='bold' display='flex' alignItems='center' alignContent='center' justifyContent='center'>No Transactions Yet!</MDTypography>
                                    }
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

            </MDBox>

        </>

    );
}

export default ReferralProduct;
