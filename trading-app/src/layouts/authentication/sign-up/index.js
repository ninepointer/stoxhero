import React, {useState, useContext, useEffect} from "react"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import ReactGA from "react-ga"

// react-router-dom components
import { Link, useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import MDSnackbar from "../../../components/MDSnackbar";
import TextField from '@mui/material/TextField';

// Authentication layout components
import BasicLayout from "../components/BasicLayoutSignup";

// Images
import bgImage from "../../../assets/images/trading.jpg";
import bgImage1 from "../../../assets/images/bgBanner1.jpg";
import bgImage2 from "../../../assets/images/bgBanner2.jpg";
import backgroundImage from "../../../layouts/HomePage/assets/images/section1/backgroud.jpg";
import { InputAdornment } from "@mui/material";
import axios from 'axios';
import { adminRole, InfinityTraderRole, userRole } from '../../../variables';
import { userContext } from '../../../AuthContext';



function Cover(props) {
  const navigate = useNavigate();
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [resendTimer, setResendTimer] = useState(30); // Resend timer in seconds
  const [timerActive, setTimerActive] = useState(false); // Flag to check if timer is active
  const [submitClicked, setSubmitClicked] = useState(false);
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const setDetails = useContext(userContext);


  const [formstate, setformstate] = useState({
    first_name:"", 
    last_name:"",
    email:"",
    mobile:"",
    dob:"",
    gender:"",
    trading_exp:"",
    city:"",
    state:"",
    country:"",
    employeed:false,
    purpose_of_joining:"",
    terms_and_conditions:false,
    trading_account:"",
    referrerCode:"",
    pincode:"",
    email_otp: "",
    mobile_otp:"",
  });
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  
  useEffect(()=>{
    setformstate(prevState => ({...prevState, referrerCode: location.search?.split('=')[1]??props.location?.search?.split('=')[1]??''}));
    ReactGA.pageview(window.location.pathname)
  },[]);

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

    const userDetail = async ()=>{
      try{
          const res = await axios.get(`${baseUrl}api/v1/loginDetail`, {
              withCredentials: true,
              headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Credentials": true
              },
          });
                   
          setDetails.setUserDetail(res.data);
          
          //console.log("this is data of particular user", res.data);
  
          if(!res.status === 200){
              throw new Error(res.error);
          }
          return res.data;
      } catch(err){
          //console.log("Fail to fetch data of user");
          //console.log(err);
      }
    }  
  async function formSubmit() {
    setSubmitClicked(true)
    setformstate(formstate);

    const { 
      first_name, 
      last_name, 
      email, 
      mobile, 
      dob, 
      gender, 
      trading_exp, 
      city, state, 
      country, 
      purpose_of_joining, 
      employeed, 
      terms_and_conditions, 
      trading_account,
      referrerCode,
      pincode,
    } = formstate;

    if(mobile.length !== 10){

      if(mobile.length === 12 && mobile.startsWith('91')){
        
      }else if(mobile.length === 11 && mobile.startsWith('0')){

      } 
      else{
        return openInfoSB("Mobile number invalid","Please Check Your Number Again")
      }
    }



    const res = await fetch(`${baseUrl}api/v1/signup`, {
      
        method: "POST",
        // credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": false
        },
        body: JSON.stringify({
          first_name:first_name.trim(), 
          last_name:last_name.trim(),
          email:email.trim(), 
          mobile:mobile, 
          dob:dob, 
          gender:gender, 
          trading_exp:trading_exp, 
          city:city,
          state:state,
          country:country,
          employeed:employeed,
          purpose_of_joining:purpose_of_joining,
          terms_and_conditions:terms_and_conditions,
          trading_account:trading_account,
          referrerCode:referrerCode,
          pincode:pincode,
        })
    });
 

    const data = await res.json();
    // console.log(data, res.status);
    if(res.status === 201 || res.status === 200){ 
        // window.alert(data.message);
        setShowEmailOTP(true);
        setTimerActive(true);
        setResendTimer(30); 
        return openSuccessSB("OTP Sent",data.message);  
    }else{
        // console.log("openInfoBS Called")
        return openInfoSB(data.message,"You have already signed Up")
    }
}

  async function otpConfirmation() {
    // console.log(formstate.email_otp)
    validatePassword();

    const res = await fetch(`${baseUrl}api/v1/verifyotp`, {

      method: "PATCH",
      // credentials:"include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        first_name: formstate.first_name,
        last_name: formstate.last_name,
        mobile: formstate.mobile,
        email: formstate.email,
        // email_otp:formstate.email_otp,
        mobile_otp: formstate.mobile_otp,
        referrerCode: formstate.referrerCode,
        password: formstate.password
      })
    });


    const data = await res.json();
    if (data.status === "Success") {
      setDetails.setUserDetail(data.data);
      setShowConfirmation(false);
      const userData = await userDetail();
      if(userData?.role?.roleName === adminRole){
        const from = location.state?.from || "/tenxdashboard";
        navigate(from);
      }
      else if(userData?.role?.roleName === "data"){
        const from = location.state?.from || "/analytics";
        navigate(from);
      } 
      else if(userData?.role?.roleName === userRole){
        const from = location.state?.from || "/stoxherodashboard";
        navigate(from);
      }
      else if(userData?.role?.roleName === InfinityTraderRole){
        navigate("/infinitytrading");
      }
      return openSuccessSB("Account Created", data.message);
    } else {
      return openInfoSB("Error", data.message);
    }

  }

  const resendOTP = async (type) => {
  
      setTimerActive(true);
      setResendTimer(30);
    
    const res = await fetch(`${baseUrl}api/v1/resendotp`, {
      
      method: "PATCH",
      // credentials:"include",
      headers: {
          "content-type" : "application/json",
          "Access-Control-Allow-Credentials": false
      },
      body: JSON.stringify({
        email:formstate.email, 
        mobile: formstate.mobile,
        type: type
      })
  });


  const data = await res.json();
  // console.log(data.status);
  if(res.status === 200 || res.status === 201){ 
        openSuccessSB("OTP Sent",data.message);
  }else{
        openInfoSB("Something went wrong",data.mesaage);
  }

  }

  const [title,setTitle] = useState('')
  const [content,setContent] = useState('')
  const [color,setColor] = useState('')
  const [icon,setIcon] = useState('')
  
 
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
  // console.log("Title, Content, Time: ",title,content,time)


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


  const [infoSB, setInfoSB] = useState(false);
  const openInfoSB = (title,content) => {
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

  const validatePassword = async ()=>{
    const {password, confirmPassword} = formstate;
    if(password.toString().length < 6){
      openSuccessSB("Error", "Password must be atleast six characters long.");
      return;
    }
    if(password !== confirmPassword){
      openSuccessSB("Error", "Password and Confirm password is not matching");
      return;
    }
  }

  function handleTogglePasswordVisibility() {
    setShowPassword(!showPassword);
  }


  return (

    <BasicLayout image={bgImage1}>
      <Card minWidth="100%">
        <MDBox
          variant="gradient"
          bgColor="dark"
          borderRadius="lg"
          coloredShadow="info"
          mx={1}
          mt={-5}
          p={2} 
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today to learn and earn from Stock Market
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your details to get started
          </MDTypography>
        </MDBox>
        
        <MDBox pt={4} pb={3} px={3}>

          <MDBox component="form" role="form">
            {showConfirmation && (
              <>
                <Grid container spacing={2} mt={0.5} mb={2}>

                  <Grid item xs={12} md={12} xl={12}>
                    <TextField
                      required
                      disabled={showEmailOTP}
                      id="outlined-required"
                      label="First Name"
                      fullWidth
                      onChange={(e) => { formstate.first_name = e.target.value }}
                    />
                  </Grid>

                  <Grid item xs={12} md={12} xl={12}>
                    <TextField
                      required
                      disabled={showEmailOTP}
                      id="outlined-required"
                      label="Last Name"
                      fullWidth
                      onChange={(e) => { formstate.last_name = e.target.value }}
                    />
                  </Grid>

                  <Grid item xs={12} md={12} xl={12}>
                    <TextField
                      required
                      disabled={showEmailOTP}
                      id="outlined-required"
                      label="Email"
                      type="email"
                      fullWidth
                      onChange={(e) => { formstate.email = e.target.value }}
                    />
                  </Grid>

                  <Grid item xs={12} md={12} xl={12}>
                    <TextField
                      required
                      disabled={showEmailOTP}
                      id="outlined-required"
                      label="Mobile No."
                      fullWidth
                      onChange={(e) => { formstate.mobile = e.target.value }}
                    />
                  </Grid>

                </Grid>
              </>
            )}

            {!showEmailOTP && (
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="dark" fullWidth onClick={formSubmit} >
                  Submit
                </MDButton>
              </MDBox>)}


            {showEmailOTP && showConfirmation && (
              <>
                <MDBox mt={2}>
                  <MDTypography fontSize={15}>Enter the referral code (if you have)</MDTypography>
                </MDBox>
                <MDBox display="flex" justifyContent="space-between">

                  <Grid container spacing={2} mt={0.25}>

                    <Grid item xs={12} md={12} xl={12}>
                      <TextField
                        // required
                        disabled={formstate.referrerCode}
                        type="text"
                        id="outlined-required"
                        label={formstate.referrerCode ? '' : "Referrer Code"}
                        fullWidth
                        value={formstate.referrerCode}
                        // onChange={(e)=>{console.log(e.target.value) ;formstate.referrerCode = e.target.value}}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setformstate((prevState) => ({
                            ...prevState,
                            referrerCode: newValue
                          }));
                        }}
                      />
                    </Grid>

                    {/* <Grid item xs={12} md={12} xl={12} width="100%" display="flex" justifyContent="center">
                  <MDBox display='block'>
                  <MDTypography fontSize={14} mb={1}>Email OTP</MDTypography>
                  <OtpInput
                    value={formstate.email_otp}
                    onChange={(e)=>{setformstate(prevState => ({...prevState, email_otp: e}))}}
                    // onChange={(e)=>{console.log(e)}}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                    inputStyle={{width:40, height:40}}
                  /> 
                    </MDBox>
                  </Grid>

                  <Grid item xs={12} md={6} xl={12} mt={-1}>
                  <MDButton style={{padding:'0rem', margin:'0rem', minHeight:20, width: '30%', display: 'flex', justifyContent: 'center', margin: 'auto'}} disabled={timerActive} variant="text" color="info" fullWidth onClick={()=>{resendOTP('email')}}>
                    {timerActive ? `Resend Email OTP in ${resendTimer} seconds` : 'Resend Email OTP'}
                    </MDButton>
                  </Grid> */}
                    <Grid item xs={12} md={12} xl={12} width="100%" display="flex" justifyContent="center">
                      <MDBox mt={-2}>

                        <MDTypography fontSize={14} mt={1}>Mobile OTP</MDTypography>

                        <TextField
                        sx={{width: "100%"}}
                          value={formstate.mobile_otp}
                          onChange={(e) => { setformstate(prevState => ({ ...prevState, mobile_otp: e.target.value })) }}
                        />

                        <MDTypography fontSize={14} mt={1}>Enter Password</MDTypography>
                        <TextField
                          type={showPassword ? "text" : "password"} 
                          value={formstate.password}
                          onChange={(e) => { setformstate(prevState => ({ ...prevState, password: e.target.value })) }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end" sx={{cursor:"pointer"}}>
                                <div onClick={handleTogglePasswordVisibility} >
                                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </div>
                              </InputAdornment>
                            )
                          }}
                          sx={{width: "100%"}}
                        />

                        <MDTypography fontSize={14} mt={1}>Enter Confirm Password</MDTypography>
                        <TextField
                        sx={{width: "100%"}}
                          value={formstate.confirmPassword}
                          onChange={(e) => {setformstate(prevState => ({ ...prevState, confirmPassword: e.target.value })) }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} xl={12} mt={-1} display="flex" justifyContent="flex-start">
                      <MDButton style={{ padding: '0rem', margin: '0rem', minHeight: 20, width: '40%', display: 'flex', justifyContent: 'center', margin: 'auto' }} disabled={timerActive} variant="text" color="dark" fullWidth onClick={() => { resendOTP('mobile') }}>
                        {timerActive ? `Resend Mobile OTP in ${resendTimer} seconds` : 'Resend Mobile OTP'}
                      </MDButton>
                    </Grid>


                  </Grid>

                </MDBox>

                <MDBox mt={2.5} mb={1} display="flex" justifyContent="space-around">
                  <MDButton variant="gradient" color="dark" fullWidth onClick={otpConfirmation}>
                    Confirm
                  </MDButton>
                </MDBox>
              </>
            )}

            {showConfirmation && <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/login"
                  variant="button"
                  color="dark"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>}
          </MDBox>
        </MDBox>
        

        {!showConfirmation && (
          <>
        <MDTypography fontSize={15} display="flex" flexDirection="column" variant="text" p={3} fontWeight="medium" textAlign="center" color="secondary" mt={5}>
            <span>Your account has been created and your userid and password has been sent to your email id.</span>
            <span>Please <Link to='/login'>Login</Link> to your account using the userid and password.</span>
        </MDTypography>
        <MDTypography
                  component={Link}
                  to="/"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                  sx={{textAlign:"center", margin:10}}
                >
                  Back to Home Page
                </MDTypography>
                </>
        )}
        {renderSuccessSB}
        {renderInfoSB}
      </Card>
    </BasicLayout>
  );
}

export default Cover;
