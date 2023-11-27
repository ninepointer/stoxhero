import React, { useContext, useEffect, useState } from 'react';
import MDBox from '../../../components/MDBox';
// import MDButton from '../../../components/MDButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Title from '../../HomePage/components/Title'
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from '@mui/material/Button';
// import { Typography } from '@mui/material';
// import paymentQr from '../../../assets/images/paymentQr.jpeg';
import MDTypography from '../../../components/MDTypography';
import { CircularProgress, Grid } from '@mui/material';
import { AiOutlineEye } from 'react-icons/ai';
// import { userContext } from '../../../AuthContext';
// import { useNavigate } from 'react-router-dom';
// import ReactGA from "react-ga"
import { collegeWiseActiveUser, collegeWiseInactiveUser } from './download';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';






export default function RewardPool({ reward }) {
    const [open, setOpen] = React.useState(false);
    const [activeUser, setActiveUser] = useState([]);
    const [inactiveUser, setInactiveUser] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"


    // useEffect(() => {

    //     // console.log("id && college", id , college)
    //     if(id && college && open){
    //         axios.get(`${baseUrl}api/v1/internbatch/batchandcollegewise/${id}/${college}`, {
    //             withCredentials: true,
    //             headers: {
    //                 Accept: "application/json",
    //                 "Content-Type": "application/json",
    //                 "Access-Control-Allow-Credentials": true
    //             },
    //         })
    //         .then((res) => {
    //             setInactiveUser(res.data.inactive);
    //             setActiveUser(res.data.active);
    //             setIsLoading(false);
    //         }).catch((err) => {
    //             console.log("Fail to fetch data of user", err);
    //         })
    //     }

    // }, [id, college, open])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // let collegeActiveUser = collegeWiseActiveUser(activeUser);
    // let collegeInactiveUser =  collegeWiseInactiveUser(inactiveUser);

    // const handleDownload = (csvData, nameVariable) => {
    //     // Create the CSV content
    //     // const csvContent = csvData.map(row => row.join(',')).join('\n');
    //     const csvContent = csvData?.map((row) => {
    //       return row?.map((row1) => row1.join(',')).join('\n');
    //     });
    //     // const csvContent = 'Date,Weekday,Gross P&L(S) Gross P&L(I) Net P&L(S) Net P&L(I) Net P&L Diff(S-I)\nValue 1,Value 2,Value 3\nValue 4, Value 5, Value 6';
    
    //     // Create a Blob object with the CSV content
    //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    
    //     // Save the file using FileSaver.js
    //     saveAs(blob, `${nameVariable}.csv`);
    //   }

    return (

        <>
            <MDBox>
                <AiOutlineEye style={{ cursor: "pointer", color: "white" }} onClick={handleClickOpen} />
            </MDBox>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    {activeUser.length > 0 &&
                    <Grid container spacing={1} mt={2}>
                        <Grid item xs={12} md={2} lg={12} mb={1} style={{ backgroundColor: "#344767", borderRadius: 5 }} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            {/* <MDTypography color="white" fontSize={13} fontWeight="bold">{`College Wise Active User Info (${activeUser.length})`}</MDTypography> */}
                            <Grid item xs={12} md={2} lg={12} mb={1} style={{ backgroundColor: "white", borderRadius: 5 }} display="flex" justifyContent="center" alignContent="center" alignItems="center" pr={1} mr={1}>
                                {/* <MDTypography ></MDTypography> */}
                                <MDTypography color="dark" fontSize={13} fontWeight="bold">{`College Wise Active User Info (${activeUser.length})`}</MDTypography>
                                {/* <MDTypography style={{cursor: "pointer"}} onClick={() => { handleDownload(collegeActiveUser, "collegeActiveUser") }}><DownloadIcon /> </MDTypography> */}
                            </Grid>
                        </Grid>
                        <Grid container p={1} style={{ border: '1px solid #344767', borderRadius: 5 }}>
                            <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                <MDTypography color="dark" fontSize={9} fontWeight="bold">NAME</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                <MDTypography color="dark" fontSize={9} fontWeight="bold">EMAIL</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                <MDTypography color="dark" fontSize={9} fontWeight="bold">MOBILE</MDTypography>
                            </Grid>
                            {/* <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                <MDTypography color="dark" fontSize={9} fontWeight="bold">TRADING DAYS</MDTypography>
                            </Grid> */}
                        </Grid>


                        {!isLoading ?
                            activeUser?.map((elem) => {
                                return (
                                    <Grid container mt={1} p={1} style={{ border: '1px solid #344767', borderRadius: 5 }}>
                                        <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                            <MDTypography color="dark" fontSize={10} fontWeight="bold">{elem?.first_name+" "+elem?.last_name}</MDTypography>
                                        </Grid>
                                        <Grid item xs={12} md={2} lg={4}>
                                            <MDTypography color="dark" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.email}</MDTypography>
                                        </Grid>
                                        <Grid item xs={12} md={2} lg={4}>
                                            <MDTypography color="dark" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.mobile}</MDTypography>
                                        </Grid>
                                        {/* <Grid item xs={12} md={2} lg={3}>
                                            <MDTypography color="dark" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.tradingDays}</MDTypography>
                                        </Grid> */}
                                    </Grid>
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

                    </Grid>}

                    {inactiveUser.length > 0 &&
                    <Grid container spacing={1} mt={2}>
                        <Grid item xs={12} md={2} lg={12} mb={1} style={{ backgroundColor: "#344767", borderRadius: 5 }} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            {/* <MDTypography color="white" fontSize={13} fontWeight="bold">{`College Wise Inactive User Info (${inactiveUser.length})`}</MDTypography> */}

                            <Grid item xs={12} md={2} lg={12} mb={1} style={{ backgroundColor: "white", borderRadius: 5 }} display="flex" justifyContent="space-between" alignContent="center" alignItems="center" pr={1} mr={1}>
                                <MDTypography ></MDTypography>
                                <MDTypography color="dark" fontSize={13} fontWeight="bold">{`College Wise Inactive User Info (${inactiveUser.length})`}</MDTypography>
                                <MDTypography style={{cursor: "pointer"}} onClick={() => { handleDownload(collegeInactiveUser, "collegeInactiveUser") }}><DownloadIcon /> </MDTypography>
                            </Grid>
                        </Grid>
                        <Grid container p={1} style={{ border: '1px solid #344767', borderRadius: 5 }}>
                            <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                <MDTypography color="dark" fontSize={9} fontWeight="bold">NAME</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                <MDTypography color="dark" fontSize={9} fontWeight="bold">EMAIL</MDTypography>
                            </Grid>
                            <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                <MDTypography color="dark" fontSize={9} fontWeight="bold">MOBILE</MDTypography>
                            </Grid>
                        </Grid>


                        {!isLoading ?
                            inactiveUser?.map((elem) => {
                                return (
                                    <Grid container mt={1} p={1} style={{ border: '1px solid #344767', borderRadius: 5 }}>
                                        <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                            <MDTypography color="dark" fontSize={10} fontWeight="bold">{elem?.first_name+" "+elem?.last_name}</MDTypography>
                                        </Grid>
                                        <Grid item xs={12} md={2} lg={4}>
                                            <MDTypography color="dark" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.email}</MDTypography>
                                        </Grid>
                                        <Grid item xs={12} md={2} lg={4}>
                                            <MDTypography color="dark" fontSize={10} fontWeight="bold" display="flex" justifyContent="center" alignContent="center" alignItems="center">{elem?.mobile}</MDTypography>
                                        </Grid>
                                    </Grid>
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

                    </Grid>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );

}
