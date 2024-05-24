import React from 'react'
import { useState, useEffect, useContext } from "react"
import moment from 'moment';
import { saveAs } from 'file-saver';
// import { userContext } from "../../../AuthContext";
import MDBox from "../../../components/MDBox";
import Grid from "@mui/material/Grid";
import logo from "../../../assets/images/logo1.jpeg";
import axios from 'axios';
import { apiUrl } from '../../../constants/constants';
import MDTypography from "../../../components/MDTypography";
import MDAvatar from '../../../components/MDAvatar';
import {
    Tooltip,
    Box, List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography
} from '@mui/material';

import { CircularProgress } from "@mui/material";
import {downloadTotalList} from './download';
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

function RecentJoinee({data}) {
    const [isLoading, setIsLoading] = useState(false);

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

    const handleDownload = async (nameVariable) => {
        setIsLoading(true);
        const data = await axios.get(`${apiUrl}school/dash/newjoineefulllist`, {withCredentials: true})
        
        const csvData = downloadTotalList(data?.data?.data);

        // Create the CSV content
        const csvContent = csvData?.map((row) => {
            return row?.map((row1) => row1.join(',')).join('\n');
        });

        setIsLoading(false);
        // Create a Blob object with the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

        // Save the file using FileSaver.js
        saveAs(blob, `${nameVariable}.csv`);
    }

    return (
        <>

            <MDBox >
                <Box 
                    sx={{
                        overflowY: 'auto',
                        backgroundColor: '#ffffff',
                        height: 380, // Set maxHeight to your desired value
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
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                        // coloredShadow: "#FF8282"
                    }}
                >
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={12} lg={12}>
                                <MDBox
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
                                        backgroundColor: '#FF8282'
                                    }}>
                                    <MDTypography variant="h6" color="white" py={1}>
                                        Recent Joinee
                                    </MDTypography>
                                    <Tooltip title="Download Full List">
                                        {isLoading ?
                                            <CircularProgress color="light" size={24} />
                                            :
                                            <DownloadIcon sx={{ color: '#ffffff', cursor: 'pointer' }} onClick={() => { handleDownload('newjoinee_full_list') }} />
                                        }
                                    </Tooltip>
                                </MDBox>
                                <MDBox pt={2}>
                                    {
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
                                                                    src={elem?.image || logo}
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

                                                           
                                                        </ListItemButton>
                                                    </List>
                                                </>
                                            )
                                        })
                                    }

                                    {
                                        data.length == 0 &&
                                        <MDTypography color="secondary" mt={2} mb={2} fontSize={15} fontWeight='bold' display='flex' alignItems='center' alignContent='center' justifyContent='center'>No Students Yet!</MDTypography>
                                    }
                                </MDBox>
                        </Grid>
                    </Grid>
                </Box>

            </MDBox>

        </>

    );
}

export default RecentJoinee;
