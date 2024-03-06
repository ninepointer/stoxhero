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
import TestZonePayment from '../../../UserDailyContest/data/payment.js'
import theme from "../../utils/theme/index";
import { useMediaQuery } from '@mui/material'



const Form = ({ data, slug, checkPaid, testzone, referrerCode }) => {
    const [open, setOpen] = React.useState(false);
    const [showPay, setShowPay] = React.useState(false);
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
    const [resendTimer, setResendTimer] = useState(30); // Resend timer in seconds
    const [timerActive, setTimerActive] = useState(false); // Flag to check if timer is active
    const [timeoutId, setTimeoutId] = useState(null);

    const confirmOtpUrl = testzone ? `dailycontest/featured/confirmotp` : `verifyphoneloginmobile`;
    const createUserUrl = testzone ? `dailycontest/featured/createuser` : `createuserbycourse`
    const [buttonClicked, setButtonClicked] = useState(false);
    const dailycontestId = data?._id;
    const [buttonLoading, setButtonLoading] = useState({
        getOtp: false,
        confirmOtp: false,
        signup: false,
    })
    
      const handleClose = () => {
        setOpen(false);
      };

      const ResendTimerSi = (seconds) => {
        let remainingTime = seconds;
    
        const timer = setInterval(() => {
          // Display the remaining time
          // console.log(Remaining time: ${remainingTime} seconds);
    
          // Decrease the remaining time by 1 second
          setResendTimer(remainingTime--);
          
    
          // Check if the timer has reached 0
          if (remainingTime === 0) {
            // Stop the timer
            clearInterval(timer);
            setTimerActive(false);
            console.log("Timer has ended!");
          }
        }, 1000); // Update every second (1000 milliseconds)
      };
    
      const resendOTP = async (type) => {
    
        setTimerActive(true);
        ResendTimerSi(30)
    
        const res = await fetch(`${apiUrl}resendotp`, {
    
          method: "PATCH",
          // credentials:"include",
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Credentials": false
          },
          body: JSON.stringify({
            mobile: detail.mobile,
            type: type
          })
        });
    
    
        const data = await res.json();
        // console.log(data.status);
        if (res.status === 200 || res.status === 201) {
        //   openSuccessSB("OTP Sent", data.message);
        } else {
        //   openSuccessSB("Something went wrong", data.mesaage);
        }
    
      }

    async function generateOTP() {

        const {
            mobile,

        } = detail;
        
        setButtonLoading(prev => ({...prev, getOtp: true}));
        setDetails(prev => ({ ...prev, errorMessage: '' }));

        if (mobile.length !== 10) {

            if (mobile.length === 12 && mobile.startsWith('91')) {

            } else if (mobile.length === 11 && mobile.startsWith('0')) {

            }
            else {
                // setOTPGenerated(false)
                setButtonLoading(prev => ({...prev, getOtp: false}))
                setDetails(prev => ({ ...prev, errorMessage: 'Enter 10 digit mobile number' }));
                setDetails(prev => ({ ...prev, otpGenerate: false }))
                return setDetails(prev => ({ ...prev, errorMessage: 'Enter 10 digit mobile number' }));
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
        setButtonLoading(prev => ({...prev, getOtp: false}))
        setButtonLoading(prev => ({...prev, confirmOtp: true}))
        setDetails(prev => ({ ...prev, errorMessage: '' }));
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
        const res = await fetch(`${apiUrl}${confirmOtpUrl}`, {
            method: "POST",
            // credentials:"include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": false
            },
            body: JSON.stringify({
                mobile: mobile, mobile_otp,
                dailycontestId: dailycontestId
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
        // setButtonLoading(prev => ({...prev, signup: true}))
        setDetails(prev => ({ ...prev, errorMessage: '' }));
        const {
            first_name,
            last_name,
            email,
            mobile,
            mobile_otp,
        } = detail;

        const res = await fetch(`${apiUrl}${createUserUrl}`, {
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
                slug, dailycontestId: dailycontestId,
                referrerCode: referrerCode
            })
        });

        const data = await res.json();
        if (res.status === 201) {
            setButtonClicked(false);
            // setButtonLoading(prev => ({...prev, signup: false}))
            // setDetails(prev => ({...prev, signedUp: true}));
            // setDetails(prev => ({...prev, isLogin: true}));
        } else {
            setButtonClicked(false);
            // setButtonLoading(prev => ({...prev, signup: false}))
            // setDetails(prev => ({...prev, signedUp: false}));
            setDetails(prev => ({...prev, errorMessage: data.message}));
        }
    }

    async function signUpProceed() {
        setButtonClicked(false);
        setButtonLoading(prev => ({ ...prev, signup: false }))
        setDetails(prev => ({ ...prev, signedUp: true }));
        setDetails(prev => ({ ...prev, isLogin: true }));
    }

    const isMobile = useMediaQuery(theme.breakpoints.down("lg"))


    return (

        <>
            {testzone ?
                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                    <MDButton
                        variant='contained'
                        color='success'
                        size={isMobile ? 'small' : 'large'}
                        onClick={() => { setOpen(true) }}>
                      Register Now
                    </MDButton>

                </MDBox>
                :
                <MDButton
                    variant="outlined"
                    size="small"
                    color="success"
                    onClick={() => { setOpen(true) }}
                    style={{ minWidth: "100%" }}
                >
                    Buy course
                </MDButton>}

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <MDTypography fontSize={20} fontColor='dark' fontWeight='bold' textAlign='center'>
                        {detail.isLogin === false ? 'Please fill your details' : 'Please enter mobile'}
                    </MDTypography>
                </DialogTitle>
                <DialogContent sx={{ width: detail.isLogin ? "1px" : '500px', height: detail.isLogin ? "1px" : 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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

                        testzone ?
                            <TestZonePayment signedUp={detail.signedUp} elem={data} showPay={showPay} createUser={createUser}
                                setShowPay={setShowPay} byLink={true} setOpenParent={setOpen} referrerCode={referrerCode} />
                            :
                            <Payment data={data} byLink={true} setOpenParent={setOpen} signedUp={detail.signedUp} checkPaid={checkPaid}
                             referrerCode={referrerCode} createUser={createUser}/>

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

                    {buttonLoading.getOtp &&
                        <MDTypography fontSize={12} color='dark' fontWeight='bold' textAlign='center' sx={{ cursor: 'pointer' }} onClick={timerActive ? () => { } : () => { resendOTP('mobile') }}>
                            {timerActive ? (`Resend Mobile OTP in ${resendTimer} seconds`)?.toUpperCase() : ('Resend Mobile OTP')?.toUpperCase()}
                        </MDTypography>}

                
                </DialogContent>
                <DialogActions>
                    <MDButton variant="gradient" size='small' color='error' onClick={handleClose} autoFocus>
                        Close
                    </MDButton>
                    {detail.isLogin !== false &&
                        <MDButton
                            onClick={() => { !detail.otpGenerate ? generateOTP() : confirmOTP() }}
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
                            onClick={() => { signUpProceed() }}
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

