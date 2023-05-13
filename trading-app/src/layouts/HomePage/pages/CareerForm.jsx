import React, {useEffect, useState} from 'react'
import MDBox from '../../../components/MDBox'
import MDButton from '../../../components/MDButton';
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
    collegeName: "",
    priorTradingExperience: "",
    source: "",
    campaignCode: campaignCode,
    mobile_otp: "",
  })
  console.log("Career: ",career)
  const [file, setFile] = useState(null);
  // const [uploadedData, setUploadedData] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  // const handleFileChange = (event) => {
  //   setFile(event.target.files);
  // };

  // const handleUpload = async () => {
  //   setDetails(detail);
  //   setSaving(true)
  //   console.log(detail);

  //   if(!detail.firstName || !detail.lastName || !detail.email || !detail.mobile || !detail.dob || !detail.collegeName || !detail.priorTradingExperience || !detail.source){
  //     openSuccessSB("Alert", "Please fill all fields", "FAIL")
  //     setSaving(false)
  //     return;
  //   }
  
  //   try {
  //     const formData = new FormData();
  //     formData.append('firstName', detail.firstName);
  //     formData.append('lastName', detail.lastName);
  //     formData.append('email', detail.email);
  //     formData.append('mobile', detail.mobile);
  //     formData.append('dob', detail.dob);
  //     formData.append('collegeName', detail.collegeName);
  //     formData.append('priorTradingExperience', detail.priorTradingExperience);
  //     formData.append('source', detail.source);
  //     formData.append('career', career._id);
  //     formData.append('campaignCode', campaignCode);

  //     // console.log(formData, file, file.name)
  //     const { data } = await axios.post(`${baseUrl}api/v1/career/userDetail`, formData, {
  //       withCredentials: true,
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       },
  //     });
  
  //     console.log("if file uploaded before", data);
  //     openSuccessSB("Success", data.message, "SUCCESS")
  //     // alert("File upload successfully");
  //     // console.log("if file uploaded", data);
  //     setFile(null)
  //     setSubmitted(true);
  //     setSaving(false);
  //   } catch (error) {
  //     console.log(error);
  //     // alert('File upload failed');
  //     openSuccessSB("Error", "Unexpected error", "FAIL")
  //   }
  // };

  async function confirmOTP(){
    console.log("Inside confirm OTP code")
 
    setDetails(prevState => ({...prevState, mobile_otp: detail.mobile_otp}));

    const { 
      firstName,
      lastName,
      email,
      mobile,
      dob,
      collegeName,
      priorTradingExperience,
      source,
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
        source:source,
        dob:dob,  
        priorTradingExperience: priorTradingExperience,
        campaignCode:campaignCode,
        mobile_otp: mobile_otp,
      })
  });

  const data = await res.json();
    console.log(data, res.status);
    if(res.status === 400 || res.status === 200){ 
        // window.alert(data.message);
        // setOTPGenerated(true);
        // setTimerActive(true);
        // setResendTimer(30); 
        setSubmitted(true)
        return openSuccessSB("Application Submitted",data.info,"SUCCESS");  
    }else{
        // console.log("openInfoBS Called")
        return openSuccessSB("Error",data.info,"Error")
    }

  }

  async function generateOTP(){
    console.log("Inside generate OTP code")
    setOTPGenerated(true)
    setDetails(detail);

    const { 
      firstName,
      lastName,
      email,
      mobile,
      dob,
      collegeName,
      priorTradingExperience,
      source,
      campaignCode,
    } = detail;

    if(mobile.length !== 10){
        setOTPGenerated(false)
        return openSuccessSB("Invalid mobile Number","Enter 10 digit mobile number","Error")
      }
    
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
        source:source,
        dob:dob,  
        priorTradingExperience: priorTradingExperience,
        campaignCode:campaignCode,
      })
  });

  const data = await res.json();
    console.log(data, res.status);
    if(res.status === 201 || res.status === 200){ 
        // window.alert(data.message);
        setOTPGenerated(true);
        // setTimerActive(true);
        // setResendTimer(30); 
        return openSuccessSB("OTP Sent",data.info,"SUCCESS");  
    }else{
        // console.log("openInfoBS Called")
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
    console.log(msgDetail)
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
                        onChange={(e)=>{detail.firstName = e.target.value}}
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
                        onChange={(e)=>{detail.lastName = e.target.value}}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        required
                        disabled={otpGenerated}
                        id="outlined-required"
                        label="Email"
                        type="email"
                        fullWidth
                        onChange={(e)=>{detail.email = e.target.value}}
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
                        onChange={(e)=>{detail.mobile = e.target.value}}
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
                        onChange={(e)=>{detail.collegeName = e.target.value}}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} xl={6} mt={-1}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            label="Date of Birth"
                            disabled={otpGenerated}
                            onChange={(e)=>{detail.dob = dayjs(e)}}
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
                        onChange={(e)=>{detail.priorTradingExperience = e.target.value}}
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
                        <InputLabel id="demo-simple-select-autowidth-label">From where you hear about us ? *</InputLabel>
                        <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        // value={formState?.jobType}
                        // value={oldObjectId ? contestData?.status : formState?.status}
                        disabled={otpGenerated}
                        onChange={(e)=>{detail.source = e.target.value}}
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
                          onChange={(e)=>{detail.mobile_otp = e.target.value}}
                        />
                    </Grid>}

                    {otpGenerated && <Grid item xs={12} md={6} lg={12}>
                    <MDBox mb={1} display="flex" justifyContent="space-around">
                      <MDButton onClick={()=>{confirmOTP()}} variant="gradient" color="info">
                        Confirm
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
        <MDBox bgColor="black" sx={{marginTop:-2}}>

        <Footer/>
        </MDBox>
        {renderSuccessSB}
        </ThemeProvider>
    </div>
  )
}

export default CareerForm