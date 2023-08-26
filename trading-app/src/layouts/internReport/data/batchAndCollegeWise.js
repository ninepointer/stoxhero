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






export default function BatchAndCollegeWise({ id, college }) {
    const [open, setOpen] = React.useState(false);
    const [activeUser, setActiveUser] = useState([]);
    const [inactiveUser, setInactiveUser] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"


    useEffect(() => {

        // console.log("id && college", id , college)
        if(id && college){
            axios.get(`${baseUrl}api/v1/internbatch/batchandcollegewise/${id}/${college}`, {
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
            })
            .then((res) => {
                setInactiveUser(res.data.inactive);
                setActiveUser(res.data.active);
                setIsLoading(false);
            }).catch((err) => {
                console.log("Fail to fetch data of user", err);
            })
        }

    }, [id, college])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
                            <MDTypography color="white" fontSize={13} fontWeight="bold">{`College Wise Active User Info (${activeUser.length})`}</MDTypography>
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
                            <MDTypography color="white" fontSize={13} fontWeight="bold">{`College Wise Inactive User Info (${inactiveUser.length})`}</MDTypography>
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
