import React, { useContext } from 'react'
import { useState, useEffect } from 'react';
import ReactGA from "react-ga";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import OtpInput from 'react-otp-input';
import MDSnackbar from "../../../components/MDSnackbar";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { InputAdornment, TextField } from '@mui/material';

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
// import MDIconButton from "../../../components/MDIn";
import MDButton from "../../../components/MDButton";


// Authentication layout components
import BasicLayout from "../components/BasicLayout";


// Images
import bgImage1 from "../../../assets/images/finowledge.png";
import { userContext } from '../../../AuthContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { schoolRole } from '../../../variables';
import { apiUrl } from '../../../constants/constants';

function SchoolLogin() {
  const [userId, setEmail] = useState(false);
  const [pass, setPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  let [invalidDetail, setInvalidDetail] = useState();
  const [messageObj, setMessageObj] = useState({
    color: '',
    icon: '',
    title: '',
    content: ''
  })

  const setDetails = useContext(userContext);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  function handleTogglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  useEffect(()=>{
    ReactGA.pageview(window.location.pathname)
  },[])

    const navigate = useNavigate();
    const location = useLocation();
    
    const userDetail = async ()=>{
      try{
          const res = await axios.get(`${apiUrl}schooldetails`, {
              withCredentials: true,
              headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Credentials": true
              },
          });
                   
          setDetails.setUserDetail(res.data?.data);
  
          if(!res.status === 200){
              throw new Error(res.error);
          }
          return res.data?.data;
      } catch(err){
          console.log(err);
      }
    }

    function handleKeyPress(event) {
      if (event.key === "Enter") {
        logInButton(event);
      }
    }

    async function logInButton(e){
        e.preventDefault();
        //console.log(userId, pass);
        
        const res = await fetch(`${apiUrl}schoollogin`, {
            method: "POST",
            credentials:"include",
            headers: {
                "content-type" : "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                userId, pass
            })
        });
        
        const data = await res.json();
        //console.log(data);
        if(data.status === 422 || data.error || !data){
            // window.alert(data.error);
            if(data.error === "deactivated"){
              setInvalidDetail(data?.message)
            } else{
              setInvalidDetail(`Email or Password is incorrect`);
            }
        }else{

            // this function is extracting data of user who is logged in
            let userData = await userDetail();

            // console.log(userData?._id?.toString(), userData?.email, `+91${userData?.mobile.slice(-10)}`);
            window.webengage.user.login(userData?._id?.toString());
            window.webengage.user.setAttribute('user_first_name', userData?.first_name);
            window.webengage.user.setAttribute('user_last_name', userData?.last_name);
            window.webengage.user.setAttribute('user_dob', userData?.dob);
            window.webengage.user.setAttribute('user_gender', userData?.gender);
            window.webengage.user.setAttribute('user_city', userData?.city);
            window.webengage.user.setAttribute('user_state', userData?.state);
            window.webengage.user.setAttribute('user_joining_date', userData?.joining_date);
            window.webengage.user.setAttribute('user_kyc_status', userData?.KYCStatus);
            window.webengage.user.setAttribute('user_role', userData?.role?.roleName);
      
            console.log(userData.role?.roleName , schoolRole)
            if(userData.role?.roleName === schoolRole){
              const from = location.state?.from || "/schooldashboard";
              console.log(from)
              navigate(from);      
            }
            
        }
    }

    async function forgotPasswordButton(e){
      e.preventDefault();
      navigate("/resetpassword");
    }


  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (value,content) => {
    // console.log("Value: ",value)
    if(value === "otp sent"){
        messageObj.color = 'info'
        messageObj.icon = 'check'
        messageObj.title = "OTP Sent";
        messageObj.content = content;

    };
    if(value === "error"){
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "Error";
      messageObj.content = content;

  }
    if(value === "resent otp"){
      messageObj.color = 'info'
      messageObj.icon = 'check'
      messageObj.title = "OTP Resent";
      messageObj.content = content;
    };

    setMessageObj(messageObj);
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color= {messageObj.color}
      icon= {messageObj.icon}
      title={messageObj.title}
      content={messageObj.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
      sx={{ borderLeft: `10px solid ${"blue"}`, borderRadius: "15px"}}
    />
  );

  return ( 
    <BasicLayout image={bgImage1}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="dark"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Welcome to StoxHero School LogIn!
          </MDTypography>
 
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="email" label="Email" onChange={handleEmailChange} fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput 
                type={showPassword ? "text" : "password"} 
                label="Password" 
                onChange={handlePasswordChange} 
                fullWidth
                onKeyPress={handleKeyPress}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{cursor:"pointer"}}>
                      <div onClick={handleTogglePasswordVisibility} >
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </div>
                    </InputAdornment>
                  )
                }}
              />
            </MDBox>

            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color={invalidDetail && "error"}>
              {invalidDetail && invalidDetail}

              </MDTypography>
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="dark" onClick={logInButton} fullWidth>
                sign in
              </MDButton>
              <MDButton variant="text" color="dark" onClick={forgotPasswordButton} fullWidth>
                forgot password?
              </MDButton>
            </MDBox>

                {renderSuccessSB}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default SchoolLogin;
