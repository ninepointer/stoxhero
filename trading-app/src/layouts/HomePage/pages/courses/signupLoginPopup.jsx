import React, { memo, useContext, useEffect, useState } from 'react';
import MDBox from '../../../../components/MDBox';
import MDButton from '../../../../components/MDButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, TextField, CircularProgress } from '@mui/material';
import { apiUrl } from '../../../../constants/constants';
import MDTypography from '../../../../components/MDTypography';
import Payment from '../../../coursesUser/data/payment.js'



const Form = ({ data, slug, checkPaid }) => {
    const [open, setOpen] = React.useState(false);
   
    const [detail, setDetails] = useState({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        mobile_otp: "",
        enterMobile: false,
        enterOtp: false,
        otpGenerate: false,
        errorMessage: "",
        isLogin: "",
        signedUp: false
    });
    const [buttonClicked, setButtonClicked] = useState(false);

    const [buttonLoading, setButtonLoading] = useState({
        getOtp: false,
        confirmOtp: false,
        signup: false,
    })
    // useEffect(()=>{
    //     detail.isLogin && setOpen(false);
    // }, [detail.isLogin])

      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };


    async function generateOTP() {

        const {
            mobile,

        } = detail;
        
        setButtonLoading(prev => ({...prev, getOtp: true}))

        if (mobile.length !== 10) {

            if (mobile.length === 12 && mobile.startsWith('91')) {

            } else if (mobile.length === 11 && mobile.startsWith('0')) {

            }
            else {
                // setOTPGenerated(false)
                setButtonLoading(prev => ({...prev, getOtp: false}))
                setDetails(prev => ({ ...prev, errorMessage: 'Enter 10 digit mobile number' }));
                setDetails(prev => ({ ...prev, otpGenerate: false }))
                // return openSuccessSB("Invalid mobile Number", "Enter 10 digit mobile number", "Error")
            }
        }

        // setOTPGenerated(true)
        setDetails(prev => ({ ...prev, otpGenerate: true }))
        const res = await fetch(`${apiUrl}phoneloginmobile`, {
            method: "POST",
            // credentials:"include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": false
            },
            body: JSON.stringify({
                mobile: mobile,
            })
        });

        const data = await res.json();

        if (res.status === 201 || res.status === 200) {
            // setOTPGenerated(true);
            setButtonLoading(prev => ({...prev, getOtp: true}))
            setDetails(prev => ({ ...prev, otpGenerate: true }))
            // return openSuccessSB("OTP Sent", data.info, "SUCCESS");
        } else {
            // setOTPGenerated(false)
            setButtonLoading(prev => ({...prev, getOtp: true}))
            setDetails(prev => ({ ...prev, otpGenerate: false }));
            setDetails(prev => ({ ...prev, errorMessage: data.info }));
            // return openSuccessSB("Error", data.info, "Error")
        }

    }

    async function confirmOTP() {
        const {
            mobile,
            mobile_otp
         
        } = detail;
        
        setButtonLoading(prev => ({...prev, confirmOtp: true}))
      
        if (mobile.length !== 10) {

            if (mobile.length === 12 && mobile.startsWith('91')) {

            } else if (mobile.length === 11 && mobile.startsWith('0')) {

            }
            else {
                setButtonLoading(prev => ({...prev, confirmOtp: false}))
                setDetails(prev => ({...prev, errorMessage: 'Enter 10 digit mobile number'}));
                setDetails(prev => ({...prev, enterOtp: false}))
                // return openSuccessSB("Invalid mobile Number", "Enter 10 digit mobile number", "Error")
            }
        }

        // setOTPGenerated(true)
        // setDetails(prev => ({...prev, enterOtp: true}))
        const res = await fetch(`${apiUrl}verifyphoneloginmobile`, {
            method: "POST",
            // credentials:"include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": false
            },
            body: JSON.stringify({
                mobile: mobile, mobile_otp
            })
        });

        const data = await res.json();

        if (res.status === 201 || res.status === 200) {
            // setOTPGenerated(true);
            setButtonLoading(prev => ({...prev, confirmOtp: false}))
            setDetails(prev => ({...prev, enterOtp: true}))
            setDetails(prev => ({...prev, isLogin: data.login}))
            // return openSuccessSB("OTP Sent", data.info, "SUCCESS");
        } else {
            // setOTPGenerated(false)
            setButtonLoading(prev => ({...prev, confirmOtp: false}))
            setDetails(prev => ({...prev, enterOtp: false}));
            setDetails(prev => ({...prev, errorMessage: data.message}));
            // return openSuccessSB("Error", data.info, "Error")
        }

    }

    async function createUser() {
        setButtonClicked(true);
        setButtonLoading(prev => ({...prev, signup: true}))

        const {
            first_name,
            last_name,
            email,
            mobile,
            mobile_otp,
        } = detail;

        const res = await fetch(`${apiUrl}/createuserbycourse`, {
            method: "PATCH",
            // credentials:"include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": false
            },
            body: JSON.stringify({
                first_name: first_name,
                last_name: last_name,
                email: email,
                mobile: mobile,
                mobile_otp: mobile_otp,
                slug
            })
        });

        const data = await res.json();
        if (res.status === 201) {
            setButtonClicked(false);
            setButtonLoading(prev => ({...prev, signup: false}))
            setDetails(prev => ({...prev, signedUp: true}));
            setDetails(prev => ({...prev, isLogin: true}));
        } else {
            setButtonClicked(false);
            setButtonLoading(prev => ({...prev, signup: false}))
            setDetails(prev => ({...prev, signedUp: false}));
            setDetails(prev => ({...prev, errorMessage: data.message}));
        }
    }

    return (

        <>
            {/* <MDBox> */}
                <MDButton
                    variant="outlined"
                    size="small"
                    color="success"
                    onClick={() => { setOpen(true) }}
                    style={{ minWidth: "100%" }}
                >
                    Buy course
                </MDButton>
            {/* </MDBox> */}

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <MDTypography fontSize={20} fontColor='dark' fontWeight='bold' textAlign='center'>
                        {detail.isLogin === false ? 'Please fill your details' :'Please enter mobile'}
                    </MDTypography>
                </DialogTitle>
                <DialogContent sx={{ width: detail.isLogin ? "50px" : '500px', height: detail.isLogin ? "5px" : 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    {!detail.enterOtp ?
                    <>
                        <Grid item xs={12} md={12} xl={6} p={1} sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <TextField
                                required
                                disabled={detail.otpGenerate}
                                id="outlined-required"
                                label="Enter Mobile"
                                type="text"
                                fullWidth
                                onChange={(e) => { setDetails(prevState => ({ ...prevState, mobile: e.target.value })) }}
                            />
                        </Grid>

                        {detail.otpGenerate && (
                            <>
                                <Grid item xs={12} md={12} xl={6} p={1} sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Please enter the OTP"
                                        type="text"
                                        fullWidth
                                        // style={{ width: '40%' }}
                                        onChange={(e) => { setDetails(prevState => ({ ...prevState, mobile_otp: e.target.value })) }}
                                    />
                                </Grid>
                            </>
                        )}
                    </>
                    :
                    <>
                    </>}

                    {detail.isLogin ?
                        <Payment data={data} byLink={true} setOpenParent={setOpen} signedUp={detail.signedUp} checkPaid={checkPaid} />
                        :
                        detail.isLogin === false &&
                        <>
                            <Grid item xs={12} md={12} xl={6} p={1} sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="First Name"
                                    type="text"
                                    fullWidth
                                    // style={{ width: '40%' }}
                                    onChange={(e) => { setDetails(prevState => ({ ...prevState, first_name: e.target.value })) }}
                                />
                            </Grid>

                            <Grid item xs={12} md={12} xl={6} p={1} sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Last Name"
                                    type="text"
                                    fullWidth
                                    // style={{ width: '40%' }}
                                    onChange={(e) => { setDetails(prevState => ({ ...prevState, last_name: e.target.value })) }}
                                />
                            </Grid>

                            <Grid item xs={12} md={12} xl={6} p={1} sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Email"
                                    type="text"
                                    fullWidth
                                    // style={{ width: '40%' }}
                                    onChange={(e) => { setDetails(prevState => ({ ...prevState, email: e.target.value })) }}
                                />
                            </Grid>

                            <Grid item xs={12} md={12} xl={6} p={1} sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Mobile"
                                    type="text"
                                    fullWidth
                                    value={detail.mobile}
                                // style={{ width: '40%' }}
                                // onChange={(e) => { setDetails(prevState => ({ ...prevState, mobile_otp: e.target.value })) }}
                                />
                            </Grid>
                        </>
                    }

                    {detail.errorMessage &&
                        <MDTypography fontSize={11} color='error' fontWeight='bold' textAlign='center'>
                            {detail.errorMessage}
                        </MDTypography>
                    }
                </DialogContent>
                <DialogActions>
                    <MDButton variant="gradient" size='small' color='error' onClick={handleClose} autoFocus>
                        Close
                    </MDButton>
                    {detail.isLogin !== false &&
                    <MDButton
                    onClick={() => {!detail.otpGenerate ? generateOTP() : confirmOTP() }}
                    variant="gradient"
                    size='small'
                    color="warning"
                    // disabled={creating || buttonClicked}
                    // style={{ backgroundColor: '#65BA0D', color: 'white', width: '90%' }}
                >
                    
                    {!detail.otpGenerate ? 
                    
                     
                    buttonLoading.getOtp ?
                        <CircularProgress size={20} color="inherit" /> : "Generate OTP"
                      
                    
                    : 
                    
                    buttonLoading.confirmOtp ?
                    <CircularProgress size={20} color="inherit" /> : "Proceed"

                    
                    }
                </MDButton>}

                    {detail.isLogin === false &&
                        <MDButton
                            onClick={() => { createUser()}}
                            variant="gradient"
                            size='small'
                            color="warning"
                        >
                            {buttonLoading.signup ?
                                    <CircularProgress size={20} color="inherit" /> : "Proceed"
                                  }
                        </MDButton>
                    }
                </DialogActions>
            </Dialog>
        </>
    );

}

export default memo(Form);

