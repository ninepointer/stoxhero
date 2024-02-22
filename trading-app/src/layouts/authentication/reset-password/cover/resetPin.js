// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import React, { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import completeIcon from '../../../../assets/images/complete.png'

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDInput from "../../../../components/MDInput";
import MDButton from "../../../../components/MDButton";
import MDAlert from "../../../../components/MDAlert";
import OtpInput from 'react-otp-input';
import MDSnackbar from "../../../../components/MDSnackbar";

// Authentication layout components
import CoverLayout from "../../../../layouts/authentication/components/CoverLayout";

// Images
import bgImage from "../../../../assets/images/finowledge.png";
import { Typography } from "@mui/material";
// import { textAlign } from "@mui/system";

function Cover() {

  const navigate = useNavigate();
  const [resendTimer, setResendTimer] = useState(30); // Resend timer in seconds
  const [timerActive, setTimerActive] = useState(false); // Flag to check if timer is active
  const [onGenerate, setOnGenerate] = useState(false);
  const [onReset, setOnReset] = useState(false);
  const [responseMessage, setResponseMessage] = useState({ message: null, type: null });
  const [isVisible, setIsVisible] = useState(false);
  const [editable, setEditable] = useState(true);
  const [passwordResetDone, setPasswordResetDone] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const [title, setTitle] = useState('')
  const [infoSB, setInfoSB] = useState(false);
  const [formstate, setformstate] = useState({
    mobile: "",
    pin: "",
    confirm_pin: "",
    resetPinOtp: "",
  });

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"


  useEffect(() => {
    let countdownTimer = null;
    // console.log("useeffect called")
    // console.log(timerActive,resendTimer)
    // If the timer is active, decrement the resendTimer every second
    if (timerActive && resendTimer > 0) {
      countdownTimer = setTimeout(() => {
        setResendTimer(prevTime => prevTime - 1);
      }, 1000);
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


  const resendOTP = async () => {
    setOnGenerate(true)
    if (!formstate.mobile) {
      return;
    }
    setIsVisible(true);
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
    setTimerActive(true);
    // console.log("Active timer set to true")
    setResendTimer(30);

    const res = await fetch(`${baseUrl}api/v1/resetpinotp`, {

      method: "POST",
      // credentials:"include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": false
      },
      body: JSON.stringify({
        mobile: formstate.mobile,
      })

    });

    const data = await res.json();
    // console.log(res.status);
    if (res.status === 200 || res.status === 201) {
      setResponseMessage({ message: data.message, type: 'success' });
      openSuccessSB('OTP Sent', data.message);
      setEditable(false);
    } else {
      setResponseMessage({ message: data.message, type: 'error' });
      openInfoSB('Something went wrong', data.message);
      // console.log("Invalid Entry");
    }

  }

  const resetPassword = async () => {
    setOnReset(true)
    if ((!formstate.confirm_pin || !formstate.pin) || (formstate.confirm_pin != formstate.pin)) {
      return
    }
    setTimerActive(true);
    // console.log("Active timer set to true")
    setResendTimer(30);

    const res = await fetch(`${baseUrl}api/v1/studentresetpin`, {

      method: "PATCH",
      // credentials:"include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": false
      },
      body: JSON.stringify({
        mobile: formstate.mobile,
        pin: formstate.pin,
        confirm_pin: formstate.confirm_pin,
        resetPinOtp: formstate.resetPinOtp,
      })
    });

    const data = await res.json();
    // console.log(data);
    if (res.status === 200 || res.status === 201) {
      setResponseMessage({ message: data.message, type: 'success' })
      openSuccessSB('Password Reset', data.message);
      setPasswordResetDone(true);
      // console.log("Error:",data.message);
    } else {
      setResponseMessage({ message: data.message, type: 'error' });
      openInfoSB('error', data.message);
      // console.log("entry succesfull");
    }

  }

  async function logInButton(e) {
    e.preventDefault();
    navigate("/enter-mobile");
  }

  const [content, setContent] = useState('')
  const openSuccessSB = (value, content) => {
    // console.log("Value: ",value)
    setTitle(value);
    setContent(content);
    setSuccessSB(true);
  };
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={title}
      content={content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="#353535"
    />
  );

  const openInfoSB = (title, content) => {
    setTitle(title)
    setContent(content)
    setInfoSB(true);
  }
  const closeInfoSB = () => setInfoSB(false);

  const renderInfoSB = (
    <MDSnackbar
      icon="notifications"
      title={title}
      content={content}
      open={infoSB}
      onClose={closeInfoSB}
      close={closeInfoSB}
    />
  );



  return (
    <CoverLayout coverHeight="30vh" image={bgImage}>
      <Grid container spacing={2} display="flex" justifyContent="space-around">
        <Grid item xs={12} md={6} lg={12} mb={3}>
          <Card
          // style={{width:"50%", margin: "0 auto"}}
          >
            <MDBox
              variant="gradient"
              // backgroundColor="#353535"
              // bgColor="info"
              style={{ backgroundColor: "#353535" }}
              borderRadius="lg"
              coloredShadow="success"
              mx={2}
              mt={-3}
              py={2}
              mb={1}
              textAlign="center"
            >
              <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
                Reset Pin
              </MDTypography>
              <MDTypography display="block" variant="button" color="white" my={1}>
                You will receive an otp within 60 seconds
              </MDTypography>
            </MDBox>
            {passwordResetDone ?
              <MDBox display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Typography style={{ fontSize: 20, textAlign: "center" }} mt={4} mb={5}><img height="40" width="40" src={completeIcon} /><MDBox>Password Reset Process Completed.</MDBox></Typography>
                <MDBox mb={4}>
                  <MDButton style={{ textAlign: "center", backgroundColor: "#353535", color: "#FFFFFF" }} variant="gradient" onClick={logInButton}>Login</MDButton>
                </MDBox>
              </MDBox>
              :
              <MDBox pt={2} pb={3} px={3} display="flex" justifyContent="space-around">
                <Grid item xs={12} md={6} lg={12} mb={1}>
                  <MDBox component="form" role="form">
                    < MDBox mb={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                      <MDInput disabled={!editable} type="mobile" label="Mobile" variant="standard" fullWidth onChange={(e) => { formstate.mobile = e.target.value }} />
                      {onGenerate && !formstate.mobile && <Typography style={{ color: "red", fontSize: 15 }}>Please enter your mobile</Typography>}
                    </MDBox>

                    <MDBox mt={1} mb={1}>
                      <MDButton style={{backgroundColor: '#353535', color: '#ffffff'}} variant="gradient"  fullWidth onClick={resendOTP}>
                        generate otp
                      </MDButton>
                    </MDBox>

                    {!editable &&
                      <>
                        <MDBox display="flex" flexDirection="column" mt={2} mb={0} alignItems='center' width='100%' >

                          <OtpInput
                            value={formstate.resetPinOtp}
                            onChange={(e) => { setformstate(prevState => ({ ...prevState, resetPinOtp: e })) }}
                            // onChange={(e)=>{console.log(e)}}
                            numInputs={6}
                            renderSeparator={<span>-</span>}
                            renderInput={(props) => <input {...props} />}
                            inputStyle={{ width: 40, height: 45 }}
                            style={{ display: 'flex', justifyContent: 'center', margin: 'auto' }}
                          />
                          <MDButton disabled={timerActive} mb={2} variant="text" style={{color: '#353535'}} fullWidth onClick={resendOTP}>
                            {timerActive ? `Resend OTP in ${resendTimer} seconds` : 'Resend OTP'}
                          </MDButton>
                        </MDBox>


                        < MDBox mb={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                          <MDInput type="text" label="New Password*" variant="standard" fullWidth onChange={(e) => { formstate.pin = e.target.value }} />
                          {(onReset && (formstate.confirm_pin) || (formstate.pin != formstate.confirm_pin)) && <Typography style={{ color: "red", fontSize: 15 }}>Password match failed</Typography>}
                        </MDBox>

                        < MDBox mb={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                          <MDInput type="text" label="Confirm Password*" variant="standard" fullWidth onChange={(e) => { formstate.confirm_pin = e.target.value }} />
                          {(onReset && (formstate.pin) || (formstate.pin != formstate.confirm_pin)) && <Typography style={{ color: "red", fontSize: 15 }}>Password match failed</Typography>}
                        </MDBox>

                        <MDBox mt={2} mb={1}>
                          <MDButton variant="gradient" style={{backgroundColor: '#353535', color: '#ffffff'}} fullWidth onClick={resetPassword}>
                            reset
                          </MDButton>
                        </MDBox>
                      </>
                    }
                  </MDBox>
                </Grid>
              </MDBox>
            }
          </Card>
        </Grid>
      </Grid>
      {renderSuccessSB}
      {renderInfoSB}
    </CoverLayout>
  );
}

export default Cover;
