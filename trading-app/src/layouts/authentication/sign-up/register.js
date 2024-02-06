import React, { useState, useContext, useEffect } from "react"
import { useMediaQuery } from '@mui/material'
import theme from '../../HomePage/utils/theme/index';
import { ThemeProvider } from 'styled-components';
// import ReactGA from "react-ga"
import FinNavbar from '../../HomePage/components/Navbars/FinNavBar';
import background from '../../../assets/images/finowledge.png'
import logo from '../../../assets/images/fulllogo.png'
import register from '../../../assets/images/home_fin_kid.png'
import ReactGA from "react-ga";
import TextField from '@mui/material/TextField';
import { useNavigate, useLocation } from "react-router-dom";
import MDSnackbar from "../../../components/MDSnackbar";

// @mui material components
import Grid from "@mui/material/Grid";
import { makeStyles } from '@mui/material/styles';
import styled from 'styled-components';

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import { apiUrl } from "../../../constants/constants";
import axios from 'axios';
import { userContext } from "../../../AuthContext";

function Cover() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();
  // const [showConfirmation, setShowConfirmation] = useState(true);
  const [resendTimer, setResendTimer] = useState(30); // Resend timer in seconds
  const [timerActive, setTimerActive] = useState(false); // Flag to check if timer is active
  const [mobile, setMobile] = useState('');
  const [otpGen, setOtpGen] = useState(false);
  const [resendTimerSi, setResendTimerSi] = useState(30); // Resend timer in seconds
  const [timerActiveSi, setTimerActiveSi] = useState(false);
  const [mobileOtp, setMobileOtp] = useState('');
  const [invalidDetail, setInvalidDetail] = useState();
  const setDetails = useContext(userContext);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    let countdownTimer = null;
    // If the timer is active, decrement the resendTimer every second
    if (timerActive && resendTimer > 0) {
      countdownTimer = setTimeout(() => {
        setResendTimer(prevTime => prevTime - 1);
      }, 500);
    }

    // If the timer reaches 0, stop the countdown and set the timerActive flag to false
    if (resendTimer === 0) {
      clearTimeout(countdownTimer);
      setTimerActive(false);
    }

    // Cleanup function to clear the timeout when the component unmounts
    return () => {
      clearTimeout(countdownTimer);
    };
  }, [resendTimer, timerActive]);


  const backgroundColor = scrollPosition > 10 ? 'rgba(0, 0, 0, 0.8)' : 'transparent'
  const backdropFilter = scrollPosition > 10 ? 'blur(5px)' : 'none'

  async function getOtpForLogin(e) {
    e.preventDefault();
    try {
      if (mobile.length < 10) {
        return setInvalidDetail(`Please enter a valid mobile number`);
      }
      const res = await fetch(`${apiUrl}schoollogin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          mobile
        })
      });
      const data = await res.json();
      console.log("Error on otp verification:", data, data.message, data.error)
      if (data.status === 422 || data.error || !data) {
        if (data.error === "deactivated") {
          setInvalidDetail(data?.message)
        } else {
          setInvalidDetail(`Mobile number incorrect`);
        }

      } else {
        if (res.status == 200 || res.status == 201) {
          openSuccessSBSI("otp sent", data.message);
          setInvalidDetail('')
          setOtpGen(true);
        }
        else {
          setInvalidDetail(data.message)
          openSuccessSBSI("error", data.message);
          navigate(`/registrationinfo?mobile=${mobile}`)
        }
      }
    } catch (e) {
      console.log(e)
    }

  }

  async function handleMobileChange(e) {
    setMobile(e.target.value);
  }

  async function handleOTPChange(e) {
    setMobileOtp(e.target.value);
  }

  async function otpConfirmation(e) {
    e.preventDefault();
    try {
      if (mobile.length < 10) {
        return setInvalidDetail(`Mobile number incorrect`);
      }
      const res = await fetch(`${apiUrl}verifyphonelogin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          mobile, mobile_otp: mobileOtp
        })
      });
      const data = await res.json();
      console.log(data)
      if (data.status === 'error' || data.error || !data) {
        setInvalidDetail(data.message);
        openSuccessSBSI("error", data.message);

      } else {
        const userData = await axios.get(`${apiUrl}loginDetail`, {withCredentials: true});
        setDetails.setUserDetail(userData.data);
        navigate("/lobby");
      }
    } catch (e) {
      console.log(e)
    }

  }

  async function resendOTP(type) {
    setTimerActiveSi(true);
    // console.log("Active timer set to true")
    setResendTimerSi(30);
    try {
      const res = await fetch(`${apiUrl}resendmobileotp`, {

        method: "POST",
        // credentials:"include",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Credentials": false
        },
        body: JSON.stringify({
          mobile: mobile,
        })
      })
      const data = await res.json();
      console.log(data);
      if (data.status === 200 || data.status === 201) {
        // openSuccessSB("OTP Sent",data.message);
      } else {
        openSuccessSBSI('resent otp', data.message)
        // openInfoSB("Something went wrong",data.mesaage);
      }
    } catch (e) {
      console.log(e)
    }
  }

  const [messageObj, setMessageObj] = useState({
    color: '',
    icon: '',
    title: '',
    content: ''
  })
  const [successSBSI, setSuccessSBSI] = useState(false);
  const openSuccessSBSI = (value, content) => {
    // console.log("Value: ",value)
    if (value === "otp sent") {
      messageObj.color = 'success'
      messageObj.icon = 'check'
      messageObj.title = "OTP Sent";
      messageObj.content = content;

    };
    if (value === "error") {
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "Error";
      messageObj.content = content;

    }
    if (value === "resent otp") {
      messageObj.color = 'success'
      messageObj.icon = 'check'
      messageObj.title = "OTP Resent";
      messageObj.content = content;
    };

    setMessageObj(messageObj);
    setSuccessSBSI(true);
  }
  const closeSuccessSBSI = () => setSuccessSBSI(false);

  const renderSuccessSBSI = (
    <MDSnackbar
      color={messageObj.color}
      icon={messageObj.icon}
      title={messageObj.title}
      content={messageObj.content}
      open={successSBSI}
      onClose={closeSuccessSBSI}
      close={closeSuccessSBSI}
      bgWhite="success"
    // sx={{ borderLeft: `10px solid ${"#65BA0D"}`, borderRadius: "15px" }}
    />
  );

  return (
    <>
      <MDBox mt={-1} display='flex' 
      // justifyContent='center'
       flexDirection='column'
        alignContent='center' alignItems='center'
         style={{ minHeight: 'auto', width: 'auto', minWidth: '100vW', overflow: 'visible' }}>
        <ThemeProvider theme={theme}>
          <FinNavbar />

          <Grid
            container
            mt={0}
            xs={12}
            md={12}
            lg={12}
            // display='flex'
            // justifyContent='center'
            // alignItems='center'
            style={{
              display: 'flex',
              // justifyContent: 'center',
              alignContent: 'center',
              backgroundImage: `url(${background})`,
              backgroundSize: 'cover', // Make the background image responsive
              backgroundPosition: 'center center',
              height: '100vh',
              flexDirection: 'column',
              textAlign: 'center',
              // padding: '10px',
              position: 'fixed',
              top: 0,
              left: 0,
              filter: backdropFilter,
              backgroundColor: backgroundColor,
              overflow: 'visible'
            }}
          >

            <Grid container xs={9} md={4} lg={4} display='flex' justifyContent='center' alignItems='center' style={{ backgroundColor: 'transparent', borderRadius: 10, position: 'relative', textAlign: 'center', width: '100%', height: '100vh', overflow: 'visible' }}>
              <Grid mt={3} item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center'>
                <MDBox mt={3} display='flex' justifyContent='center' alignItems='center' style={{ overflow: 'visible' }}>
                  <img src={logo} width={250} alt="Logo" />
                </MDBox>
                <MDBox mt={1} display='flex' justifyContent='center' alignItems='center' style={{ overflow: 'visible' }}>
                  <MDTypography variant='body1' style={{ fontFamily: 'Work Sans , sans-serif', color: '#D5F47E' }}>Online Finance Olympiad</MDTypography>
                </MDBox>
              </Grid>

              <Grid item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                <TextField
                  required
                  disabled={otpGen}
                  id="outlined-required"
                  placeholder="Enter Mobile No."
                  fullWidth
                  type='number'
                  onChange={handleMobileChange}
                />
              </Grid>
              {otpGen &&
                <Grid mb={1} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                  <TextField
                    required
                    // disabled={showEmailOTP}
                    id="outlined-required"
                    placeholder="Enter OTP"
                    fullWidth
                    type='text'
                    onChange={handleOTPChange}
                  />
                </Grid>}

              {invalidDetail &&
                <Grid item xs={12} md={12} lg={12} mb={.25} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                  <MDTypography fontSize={12} variant="button" color={invalidDetail && "error"} style={{ fontFamily: 'Work Sans , sans-serif' }}>
                    {invalidDetail && invalidDetail}
                  </MDTypography>
                </Grid>
              }

              {!otpGen &&
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center'>
                  <MDBox display='flex' justifyContent='center'>
                    <MDButton fullWidth variant='contained' size='small' color='student' style={{ color: '#000' }} onClick={
                      (e) => {
                        getOtpForLogin(e)
                      }
                    }>Proceed</MDButton>
                  </MDBox>
                </Grid>}
              {otpGen &&
                <>
                  <Grid item xs={12} md={6} lg={6} display="flex" justifyContent="center">
                    <MDButton style={{ fontFamily: 'Work Sans , sans-serif', padding: '0rem', margin: '0rem', minHeight: 20, display: 'flex', justifyContent: 'center', margin: 'auto' }} disabled={timerActiveSi} variant="text" color="#000" fullWidth onClick={() => { resendOTP('mobile') }}>
                      {timerActiveSi ? `Resend Mobile OTP in ${resendTimerSi} seconds` : 'Resend Mobile OTP'}
                    </MDButton>
                  </Grid>

                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center'>
                    <MDBox mb={5} display='flex' justifyContent='center'>
                      <MDButton fullWidth variant='contained' size='small' color='student' style={{ marginTop: 15, color: '#000' }}
                        onClick={otpConfirmation}>Confirm OTP</MDButton>
                    </MDBox>
                  </Grid>
                </>}
            </Grid>
          </Grid>
          {renderSuccessSBSI}

        </ThemeProvider>
      </MDBox>
    </>

  );
}

export default Cover;
