import React, {useEffect, useState} from 'react'
import MDBox from '../../../components/MDBox'
import MDButton from '../../../components/MDButton';
import ReactGA from "react-ga"
import { CircularProgress, formLabelClasses } from "@mui/material";
import { Grid, Input, TextField } from '@mui/material'
import theme from '../utils/theme/index';
import { ThemeProvider } from 'styled-components';
import Navbar from '../components/Navbars/Navbar';
import Footer from '../components/Footers/Footer';
import MDTypography from '../../../components/MDTypography';
import MDSnackbar from "../../../components/MDSnackbar";
import axios from "axios";
import {useLocation} from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const CareerForm = () => {

  const [submitted,setSubmitted] = useState(false)
  const [saving,setSaving] = useState(false)
  const [creating,setCreating] = useState(false)
  const [otpGenerated,setOTPGenerated] = useState(false);
  const location = useLocation();
  const career = location?.state?.data;
  const campaignCode = location?.state?.campaignCode;

  const [detail, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    collegeName: "",
    linkedInProfileLink: "",
    priorTradingExperience: "",
    source: "",
    career: career?._id,
    campaignCode: campaignCode,
    mobile_otp: "",
  })

  const [file, setFile] = useState(null);
  // const [uploadedData, setUploadedData] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  useEffect(()=>{
    ReactGA.pageview(window.location.pathname)
  },[])
  

  const [buttonClicked, setButtonClicked] = useState(false);

  async function confirmOTP(){

    setCreating(true);
    setDetails(prevState => ({...prevState, mobile_otp: detail.mobile_otp}));
    setButtonClicked(true);
    const { 
      firstName,
      lastName,
      email,
      mobile,
      dob,
      gender,
      collegeName,
      linkedInProfileLink,
      priorTradingExperience,
      source,
      career,
      campaignCode,
      mobile_otp,
    } = detail;
    
    const res = await fetch(`${baseUrl}api/v1/career/confirmotp`, {
      method: "POST",
      // credentials:"include",
      headers: {
          "content-type" : "application/json",
          "Access-Control-Allow-Credentials": false
      },
      body: JSON.stringify({
        firstName:firstName, 
        lastName:lastName,
        email:email, 
        mobile:mobile, 
        collegeName: collegeName,
        linkedInProfileLink: linkedInProfileLink,
        source:source,
        career:career,
        dob:dob,  
        gender:gender,
        priorTradingExperience: priorTradingExperience,
        campaignCode:campaignCode,
        mobile_otp: mobile_otp,
      })
  });

  const data = await res.json();

    if(res.status === 201){ 
        setSubmitted(true);
        setCreating(false);
        setButtonClicked(false);
        return openSuccessSB("Application Submitted",data.info,"SUCCESS");  
    }else{
        setButtonClicked(false);
        return openSuccessSB("Error",data.info,"Error")
    }

  }

  async function generateOTP(){

    // setDetails(prevState => ({...prevState, mobile_otp: detail.mobile_otp}));
    
    const { 
      firstName,
      lastName,
      email,
      mobile,
      dob,
      gender,
      collegeName,
      linkedInProfileLink,
      priorTradingExperience,
      source,
      career,
      campaignCode,
    } = detail;
    
    // if(mobile.length !== 10){
      
      //     setOTPGenerated(false)
      //     return openSuccessSB("Invalid mobile Number","Enter 10 digit mobile number","Error")
      //   }
      if(!firstName || !lastName || !email || !mobile || !dob || !gender || !collegeName || !linkedInProfileLink || !priorTradingExperience || !source){
        return openSuccessSB("Data Incomplete", "Please fill all the required fields", "Error"); 
      }
      if(mobile.length !== 10){
        
        if(mobile.length === 12 && mobile.startsWith('91')){
          
        }else if(mobile.length === 11 && mobile.startsWith('0')){
          
        }
        else{
          setOTPGenerated(false)
          return openSuccessSB("Invalid mobile Number","Enter 10 digit mobile number","Error")
        }
      }
      
    setOTPGenerated(true)
    const res = await fetch(`${baseUrl}api/v1/career/generateotp`, {
      method: "POST",
      // credentials:"include",
      headers: {
          "content-type" : "application/json",
          "Access-Control-Allow-Credentials": false
      },
      body: JSON.stringify({
        firstName:firstName, 
        lastName:lastName,
        email:email, 
        mobile:mobile, 
        collegeName: collegeName,
        linkedInProfileLink: linkedInProfileLink,
        source:source,
        career:career,
        dob:dob,  
        gender: gender,
        priorTradingExperience: priorTradingExperience,
        campaignCode:campaignCode,
      })
  });

  const data = await res.json();

    if(res.status === 201 || res.status === 200){ 
        // window.alert(data.message);
        setOTPGenerated(true);
        // setTimerActive(true);
        // setResendTimer(30); 
        return openSuccessSB("OTP Sent",data.info,"SUCCESS");  
    }else{
        // console.log("openInfoBS Called")
        setOTPGenerated(false)
        return openSuccessSB("Error",data.info,"Error")
    }

  }

  

  const [successSB, setSuccessSB] = useState(false);
  const [msgDetail, setMsgDetail] = useState({
    title: "",
    content: "",
    // successSB: false,
    color: "",
    icon: ""
  })
  const openSuccessSB = (title,content,message) => {
    msgDetail.title = title;
    msgDetail.content = content;
    if(message == "SUCCESS"){
      msgDetail.color = 'success';
      msgDetail.icon = 'check'
    } else {
      msgDetail.color = 'error';
      msgDetail.icon = 'warning'
    }
    // console.log(msgDetail)
    setMsgDetail(msgDetail)
    setSuccessSB(true);
  }

  const closeSuccessSB = () =>{
    setSuccessSB(false);
  }


  const renderSuccessSB = (
  <MDSnackbar
      color={msgDetail.color}
      icon={msgDetail.icon}
      title={msgDetail.title}
      content={msgDetail.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
  />
  );

  return (
    <div>
        <ThemeProvider theme={theme}>
        <Navbar/>
        <MDBox sx={{height:"auto"}} bgColor="light">

            {(!submitted) ? <MDBox mt={'65px'} p={4} display="flex" justifyContent='center' alignItems='center' flexDirection='column'>
                <MDBox display='flex' justifyContent='center'>
                    <MDTypography color="black">Please fill your details to apply for {career?.jobTitle}!</MDTypography>
                </MDBox>
                <Grid container spacing={2} mt={1} xs={12} md={12} lg={6} display='flex' justifyContent='center' alignItems='center'>
                    <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        required
                        disabled={otpGenerated}
                        id="outlined-required"
                        label="First Name"
                        type="text"
                        fullWidth
                        onChange={(e)=>{setDetails(prevState => ({...prevState, firstName: e.target.value}))}}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        required
                        disabled={otpGenerated}
                        id="outlined-required"
                        label="Last Name"
                        type="text"
                        fullWidth
                        onChange={(e)=>{setDetails(prevState => ({...prevState, lastName: e.target.value}))}}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        required
                        disabled={otpGenerated}
                        id="outlined-required"
                        label="Email(Account details will be shared here)"
                        type="email"
                        fullWidth
                        onChange={(e)=>{setDetails(prevState => ({...prevState, email: e.target.value}))}}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        required
                        disabled={otpGenerated}
                        id="outlined-required"
                        label="Mobile(OTP will be sent on this number)"
                        type="text"
                        fullWidth
                        onChange={(e)=>{setDetails(prevState => ({...prevState, mobile: e.target.value}))}}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        required
                        disabled={otpGenerated}
                        id="outlined-required"
                        label="College Name"
                        type="text"
                        fullWidth
                        onChange={(e)=>{setDetails(prevState => ({...prevState, collegeName: e.target.value}))}}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} xl={6} mt={-1}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            label="Date of Birth"
                            disabled={otpGenerated}
                            onChange={(e)=>{setDetails(prevState => ({...prevState, dob: dayjs(e)}))}}
                            sx={{ width: '100%' }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} md={6} xl={6}>
                      <FormControl sx={{width: "100%" }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Trading Exp *</InputLabel>
                        <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        // value={formState?.jobType}
                        // value={oldObjectId ? contestData?.status : formState?.status}
                        disabled={otpGenerated}
                        onChange={(e)=>{setDetails(prevState => ({...prevState, priorTradingExperience: e.target.value}))}}
                        label="Trading Exp."
                        sx={{ minHeight:43 }}
                        >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6} xl={6}>
                      <FormControl sx={{width: "100%" }}>
                        <InputLabel id="demo-simple-select-autowidth-label">From where did you hear about us ? *</InputLabel>
                        <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        // value={formState?.jobType}
                        // value={oldObjectId ? contestData?.status : formState?.status}
                        disabled={otpGenerated}
                        onChange={(e)=>{setDetails(prevState => ({...prevState, source: e.target.value}))}}
                        label="From where you hear about us ?"
                        sx={{ minHeight:43 }}
                        >
                        <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                        <MenuItem value="Friend">Friend</MenuItem>
                        <MenuItem value="Facebook">Facebook</MenuItem>
                        <MenuItem value="Instagram">Instagram</MenuItem>
                        <MenuItem value="Twitter">Twitter</MenuItem>
                        <MenuItem value="Google">Google</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        required
                        disabled={otpGenerated}
                        id="outlined-required"
                        label="LinkedIn Profile Link"
                        type="text"
                        fullWidth
                        onChange={(e)=>{setDetails(prevState => ({...prevState, linkedInProfileLink: e.target.value}))}}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} xl={6}>
                      <FormControl sx={{width: "100%" }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Gender *</InputLabel>
                        <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        // value={formState?.jobType}
                        // value={oldObjectId ? contestData?.status : formState?.status}
                        disabled={otpGenerated}
                        onChange={(e)=>{setDetails(prevState => ({...prevState, gender: e.target.value}))}}
                        label="Gender"
                        sx={{ minHeight:43 }}
                        >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {!otpGenerated && <Grid item xs={12} md={6} lg={12}>
                    <MDBox mb={1} display="flex" justifyContent="space-around">
                      <MDButton onClick={generateOTP} variant="gradient" color="info">
                        Submit
                      </MDButton>
                    </MDBox>
                    </Grid>}

                    
                    {otpGenerated && <Grid item xs={12} md={6} lg={4}>
                      <TextField
                          required
                          // disabled={showEmailOTP}
                          id="outlined-required"
                          label="Please enter the OTP"
                          type="text"
                          fullWidth
                          onChange={(e)=>{setDetails(prevState => ({...prevState, mobile_otp: e.target.value}))}}
                        />
                    </Grid>}

                    {otpGenerated && <Grid item xs={12} md={6} lg={12}>
                    <MDBox mb={1} display="flex" justifyContent="space-around">
                      <MDButton 
                        onClick={()=>{confirmOTP()}} 
                        variant="gradient" 
                        color="info"
                        disabled={creating || buttonClicked} 
                      >
                      {creating ? <CircularProgress size={20} color="inherit" /> : "Confirm"}
                      </MDButton>
                    </MDBox>
                    </Grid>}
                   

                </Grid>
                
            </MDBox>
            :
            <MDBox minHeight='50vH' marginTop="65px" display="flex" justifyContent='center' alignItems='center' alignContent='center'>
              <Grid container>
                <Grid item p={2} m={2} xs={12} md={12} lg={12} display="flex" justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{textAlign: 'center'}}>
                  <MDTypography>Your application has been submitted successfully, our team will get back to you soon!</MDTypography>
                  <MDTypography mt={1}>We have also created your StoxHero trading account and the login details have been sent on your email!</MDTypography>
                  <MDTypography mt={1} fontSize={20} fontWeight='bold'>Explore the world of options trading by visiting www.stoxhero.com</MDTypography>
                </Grid>
              </Grid>
            </MDBox>
            }

        </MDBox>
        <MDBox bgColor="black" sx={{marginTop:2}}>

        <Footer/>
        </MDBox>
        {renderSuccessSB}
        </ThemeProvider>
    </div>
  )
}

export default CareerForm