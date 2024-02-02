import React, { useState, useEffect, useContext } from "react"
import { useMediaQuery } from '@mui/material'
import theme from '../../HomePage/utils/theme/index';
import { ThemeProvider } from 'styled-components';
// import ReactGA from "react-ga"
import FinNavbar from '../../HomePage/components/Navbars/FinNavBar';
import background from '../../../assets/images/finowledge.png'
import ReactGA from "react-ga";
import TextField from '@mui/material/TextField';
import { useNavigate, useLocation } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDSnackbar from "../../../components/MDSnackbar";
import { apiUrl } from "../../../constants/constants";
import { userContext } from '../../../AuthContext';

// Images
import MDButton from "../../../components/MDButton";

function Cover() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [resendTimer, setResendTimer] = useState(30); // Resend timer in seconds
  const [timerActive, setTimerActive] = useState(false); // Flag to check if timer is active
  const [submitClicked, setSubmitClicked] = useState(false);
  const setDetails = useContext(userContext);


  // const [resendTimer, setResendTimer] = useState(30); // Resend timer in seconds
  // const [timerActive, setTimerActive] = useState(false); // Flag to check if timer is active
  // const [mobile, setMobile] = useState('');
  const [otpGen, setOtpGen] = useState(false);
  const [resendTimerSi, setResendTimerSi] = useState(30); // Resend timer in seconds
  const [timerActiveSi, setTimerActiveSi] = useState(false);
  const [mobileOtp, setMobileOtp] = useState('');
  const [invalidDetail, setInvalidDetail] = useState();

  const queryString = location.search;
  const urlParams = new URLSearchParams(queryString);

  // Get the value of the "mobile" parameter
  const mobile = urlParams.get('mobile');

  const [formstate, setformstate] = useState({
    full_name: "",
    mobile: mobile,
    mobile_otp: "",
    parents_name: "",
    grade: "",
    school: "",
    city: ""
  });


  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
  })

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))


  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const backgroundColor = scrollPosition > 10 ? 'rgba(0, 0, 0, 0.8)' : 'transparent'
  const backdropFilter = scrollPosition > 10 ? 'blur(5px)' : 'none'

  async function signup() {
    setSubmitClicked(true)
    setformstate(formstate);

    const {
      full_name,
      mobile,
      parents_name,
      grade, school,
      city
    } = formstate;
    console.log(formstate)
    if (mobile.length !== 10) {

      if (mobile.length === 12 && mobile.startsWith('91')) {

      } else if (mobile.length === 11 && mobile.startsWith('0')) {

      }
      else {
        return openSuccessSB("Mobile number invalid", "Please Check Your Number Again")
      }
    }

    const res = await fetch(`${apiUrl}schoolsignup`, {

      method: "POST",
      // credentials:"include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": false
      },
      body: JSON.stringify({
        full_name: full_name.trim(),
        mobile: mobile,
        parents_name: parents_name.trim(),
        grade, school,
        city
      })
    });


    const data = await res.json();
    // console.log(data, res.status);
    if (res.status === 201 || res.status === 200) {
      setTimerActive(true);
      setResendTimer(30);
      setOtpGen(true)
      return openSuccessSB("OTP Sent", data.message);
    } else {
      // console.log("openInfoBS Called")
      return openSuccessSB(data.message, "You have already signed Up")
    }
  }

  const [buttonClicked, setButtonClicked] = useState(false);
  async function otpConfirmation() {
    // console.log(formstate.email_otp)
    setButtonClicked(true);
    // console.log(formstate.email_otp)
    const {
      full_name,
      mobile,
      parents_name,
      grade, school,
      city
    } = formstate;

    const res = await fetch(`${apiUrl}verifyotp`, {

      method: "PATCH",
      // credentials:"include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        mobile_otp: mobileOtp,
        full_name,
        mobile,
        parents_name,
        grade, school,
        city
      })
    });
    const data = await res.json();
    console.log("Data after account creation:", data)
    if (data.status === "Success") {
      setDetails.setUserDetail(data.data);
      setShowConfirmation(false);

      setButtonClicked(false);
      navigate('/lobby')
      return openSuccessSB("Account Created", data.message);
    } else {
      setButtonClicked(false);
      return openSuccessSB("Error", data.message);
    }

  }

  const resendOTP = async (type) => {

    setTimerActive(true);
    setResendTimer(30);

    const res = await fetch(`${apiUrl}resendotp`, {

      method: "PATCH",
      // credentials:"include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": false
      },
      body: JSON.stringify({
        mobile: mobile,
        type: type
      })
    });


    const data = await res.json();
    // console.log(data.status);
    if (res.status === 200 || res.status === 201) {
      openSuccessSB("OTP Sent", data.message);
    } else {
      openSuccessSB("Something went wrong", data.mesaage);
    }

  }

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('')
  const [icon, setIcon] = useState('')


  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (value, content) => {
    // console.log("Value: ",value)
    if (value === "OTP Sent") {
      setTitle("OTP Sent");
      setContent(content);
      setColor("success");
      setIcon("check")
    };
    if (value === "Account Created") {
      setTitle("Account Created");
      setContent(content);
      setColor("success");
      setIcon("check")
    };

    if (value === "Error") {
      setTitle("Error");
      setContent(content);
      setColor("error");
      setIcon("warning")
    };
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color={color}
      icon={icon}
      title={title}
      content={content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!formstate[name]?.includes(e.target.value)) {
      setformstate(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  async function handleOTPChange(e) {
    setMobileOtp(e.target.value);
  }

  return (
    <>
      <MDBox mt={-1} display='flex' justifyContent='center' flexDirection='column' alignContent='center' alignItems='center' style={{ minHeight: 'auto', width: 'auto', minWidth: '100vW', overflow: 'visible' }}>
        <ThemeProvider theme={theme}>
          <FinNavbar />

          <Grid
            container
            mt={0}
            xs={12}
            md={12}
            lg={12}
            display='flex'
            justifyContent='center'
            alignItems='center'
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              backgroundImage: `url(${background})`,
              backgroundSize: 'cover', // Make the background image responsive
              backgroundPosition: 'center center',
              height: '100vh',
              flexDirection: 'column',
              textAlign: 'center',
              padding: '10px',
              position: 'fixed',
              top: 0,
              left: 0,
              filter: backdropFilter,
              backgroundColor: backgroundColor,
              overflow: 'visible'
            }}
          >


            <Grid container xs={9} md={4} lg={4} display='flex' justifyContent='center' alignItems='center' style={{ backgroundColor: 'transparent', borderRadius: 10, position: 'relative', textAlign: 'center', width: '100%', height: '100vh', overflow: 'visible' }}>
              <Grid mt={3} mb={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center'>
                <MDBox display='flex' justifyContent='center' alignItems='center' style={{ overflow: 'visible' }}>
                  <MDTypography variant={isMobile ? 'h5' : 'h3'} style={{ fontFamily: 'Nunito', color: '#D5F47E' }}>Welcome to StoxHero!</MDTypography>
                </MDBox>
                <MDBox display='flex' justifyContent='center' alignItems='center' style={{ overflow: 'visible' }}>
                  <MDTypography variant='body2' style={{ fontFamily: 'Nunito', color: '#fff' }}>Fill in these details to get you started!</MDTypography>
                </MDBox>
              </Grid>
              <Grid mb={2} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                <TextField
                  required
                  // disabled={showEmailOTP}
                  id="outlined-required"
                  label="Full Name"
                  fullWidth
                  type='text'
                  name='full_name'
                onChange={handleChange}
                />
              </Grid>
              <Grid mb={2} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                <TextField
                  required
                  // disabled={showEmailOTP}
                  id="outlined-required"
                  label="Parent's Name"
                  fullWidth
                  type='text'
                  name='parents_name'
                onChange={handleChange}
                />
              </Grid>
              <Grid mb={2} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                <TextField
                  required
                  // disabled={showEmailOTP}
                  id="outlined-required"
                  label="Class/Grade"
                  fullWidth
                  type='text'
                  name='grade'
                onChange={handleChange}
                />
              </Grid>
              <Grid mb={2} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                <TextField
                  required
                  // disabled={showEmailOTP}
                  id="outlined-required"
                  label="School"
                  fullWidth
                  type='text'
                  name='school'
                onChange={handleChange}
                />
              </Grid>
              <Grid mb={2} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                <TextField
                  required
                  // disabled={showEmailOTP}
                  id="outlined-required"
                  label="City"
                  fullWidth
                  type='text'
                  name="city"
                onChange={handleChange}
                />
              </Grid>
              {/* <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center'>
                <MDBox mb={5} display='flex' justifyContent='center'>
                  <MDButton fullWidth variant='contained' size='small' color='student' style={{ marginTop: 15, color: '#000' }} onClick={() => { navigate('/lobby') }}>Proceed</MDButton>
                </MDBox>
              </Grid> */}


              {otpGen &&
                <Grid mb={1} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                  <TextField
                    required
                    // disabled={showEmailOTP}
                    id="outlined-required"
                    label="Enter OTP"
                    fullWidth
                    type='text'
                    onChange={handleOTPChange}
                  />
                </Grid>}

              {invalidDetail &&
                <Grid item xs={12} md={12} lg={12} mb={.25} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                  <MDTypography fontSize={12} variant="button" color={invalidDetail && "error"}>
                    {invalidDetail && invalidDetail}
                  </MDTypography>
                </Grid>
              }

              {!otpGen &&
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center'>
                  <MDBox mb={5} display='flex' justifyContent='center'>
                    <MDButton fullWidth variant='contained' size='small' color='student' style={{ marginTop: 15, color: '#000' }} onClick={
                      (e) => {
                        signup(e)
                      }
                    }>Proceed</MDButton>
                  </MDBox>
                </Grid>}
              {otpGen &&
                <>
                  <Grid item xs={12} md={6} lg={6} display="flex" justifyContent="center">
                    <MDButton style={{ padding: '0rem', margin: '0rem', minHeight: 20, display: 'flex', justifyContent: 'center', margin: 'auto' }} disabled={timerActiveSi} variant="text" color="#000" fullWidth onClick={() => { resendOTP('mobile') }}>
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
          {renderSuccessSB}
        </ThemeProvider>
      </MDBox>
    </>

  );
}

export default Cover;
