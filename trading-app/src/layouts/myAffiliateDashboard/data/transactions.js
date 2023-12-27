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

function ReferralProduct({ transactions }) {
    console.log("transactions", transactions)
    const [data, setData] = useState([]);
    // const [transaction, setTransaction] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 4;

    useEffect(() => {

        // axios.get(`${apiUrl}referrals/referredproduct`, { withCredentials: true })
        //     .then((res) => {
        //         setAffiliateSummery(res?.data?.data[0]?.summery[0])
        //         setTransaction(res?.data?.data[0]?.transaction);
                const startIndex = (currentPage - 1) * perPage;
                const slicedData = transactions?.slice(startIndex, startIndex + perPage);
                setData(slicedData);
                // setData(res?.data?.data[0]?.transaction);
            // }).catch((err) => {
            //     return new Error(err);
            // });
    }, [transactions]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * perPage;
        const slicedData = transactions?.slice(startIndex, startIndex + perPage);
        setData(slicedData);
    }, [currentPage])

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    function dateConvert(dateConvert){
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
           
                <MDBox pt={3} pb={3}>
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
                                                                    <Typography color='green' variant="subtitle2" noWrap>
                                                                        {/* +₹{elem?.payout?.toFixed(2)} */}
                                                                        ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.payout)}
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
                                    }

                                    {data?.length > 0 &&
                                        <MDBox mt={1} p={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                                            <MDButton variant='outlined' color='secondary' disabled={currentPage === 1 ? true : false} size="small" onClick={handlePrevPage}>Back</MDButton>
                                            <MDTypography color="secondary" fontSize={12} fontWeight='bold'>Transactions: {transactions.length} | Page {currentPage} of {Math.ceil(transactions.length / perPage)}</MDTypography>
                                            <MDButton variant='outlined' color='secondary' disabled={Math.ceil(transactions.length / perPage) === currentPage ? true : false} size="small" onClick={handleNextPage}>Next</MDButton>
                                        </MDBox>
                                    }

                                    {
                                        !transactions?.length &&
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