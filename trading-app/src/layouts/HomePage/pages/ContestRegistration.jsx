import React, {useEffect, useState, useContext} from 'react'
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
import logo from '../../../assets/images/fulllogo.png'
import playstore from '../../../assets/images/playstore.png'
import careerpage from '../../../assets/images/contestregistration.png'
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
import {apiUrl} from '../../../constants/constants';
import { userContext } from "../../../AuthContext";
import {Autocomplete} from '@mui/material';
import moment from 'moment';
import { Helmet } from 'react-helmet';

function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

const CareerForm = () => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const [submitted,setSubmitted] = useState(false)
  const [saving,setSaving] = useState(false)
  const [creating,setCreating] = useState(false)
  const [otpGenerated,setOTPGenerated] = useState(false);
  const [contestDetails,setContestDetails] = useState(false);
  const location = useLocation();
  const [colleges,setColleges] = useState([]);
  const contest = location?.state?.data;
  let campaignCode = location?.state?.campaignCode;
  const params = new URLSearchParams(location?.search);
  const referrerCode = params.get('referral');
  campaignCode = params.get('campaigncode');
  const getDetails = useContext(userContext);


  const [detail, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    college: "",
    collegeName: "",
    course: "",
    passingoutyear: "",
    priorTradingExperience: "",
    linkedInProfileLink: "",
    source: "",
    contest: contest?._id || contestDetails?._id,
    campaignCode: campaignCode,
    mobile_otp: "",
    referrerCode: referrerCode
  })

  const [file, setFile] = useState(null);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

  const getContestDetails = async (name, date) => {
    try {
        const res = await axios.get(`${apiUrl}dailycontest/findbyname?name=${name}&date=${date}`);
        setContestDetails(res?.data?.data);
        setDetails((prev)=>({...prev, contest: res?.data?.data?._id}));
    } catch (e) {
        console.log(e);
    }
};
  
  useEffect(()=>{
    if(!contest){
        const url = location?.pathname?.split('/');
        const name = decodeURIComponent(url[2]);
        const date = url[3];
        getContestDetails(name,date);
    }
    ReactGA.pageview(window.location.pathname)
    axios.get(`${apiUrl}college/collegeList`)
    .then((res)=>{
      setColleges(res?.data?.data);
    }).catch((err)=>{
        return new Error(err)
    }) 
  },[])

  const [buttonClicked, setButtonClicked] = useState(false);
  async function confirmOTP(){
    setDetails(prevState => ({...prevState, mobile_otp: detail.mobile_otp}));
    setButtonClicked(true);
    const { 
      firstName,
      lastName,
      email,
      mobile,
      dob,
      gender,
      college,
      collegeName,
      course,
      passingoutyear,
      linkedInProfileLink,
      source,
      contest,
      referrerCode,
      campaignCode,
      mobile_otp,
    } = detail;
    if(!mobile_otp || !mobile){
      return openSuccessSB("Form Incomplete", "Please fill all the required fields", "Error");
    }
    const res = await fetch(`${baseUrl}api/v1/dailycontest/confirmotp`, {
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
        gender:gender,
        college: college,
        collegeName: collegeName,
        course: course,
        passingoutyear: passingoutyear,
        linkedInProfileLink:linkedInProfileLink,
        source:source,
        contest:contest,
        dob:dob,  
        campaignCode:campaignCode,
        mobile_otp: mobile_otp,
        referrerCode
      })
  });

  const data = await res.json();

    if(res.status === 201){ 
        setSubmitted(true);
        setCreating(false);
        setButtonClicked(false);
        return openSuccessSB("TestZone Registration Completed",data.message,"SUCCESS");  
    }else{
      setButtonClicked(false);
      return openSuccessSB("Error",data.message,"Error")
    }
  }

  async function generateOTP(){

    const { 
      firstName,
      lastName,
      email,
      mobile,
      dob,
      gender,
      college,
      collegeName,
      course,
      passingoutyear,
      linkedInProfileLink,
      source,
      contest,
      referrerCode,
      campaignCode,
    } = detail;
    
      if(!firstName || !lastName || !email || !mobile || !dob || !college || !passingoutyear || !course || !gender || !collegeName || !source){
        return openSuccessSB("Form Incomplete", "Please fill all the required fields", "Error"); 
      }
      if(mobile.length !== 10){
        
        if(mobile.length === 12 && mobile.startsWith('91')){
          
        }else if(mobile.length === 11 && mobile.startsWith('0')){
          
        }
        else{
          setOTPGenerated(false)
          return openSuccessSB("Invalid Mobile Number","Enter 10 digit mobile number","Error")
        }
      }
      
    setOTPGenerated(true)
    const res = await fetch(`${baseUrl}api/v1/dailycontest/generateotp`, {
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
        gender:gender,
        college:college,
        collegeName: collegeName,
        course:course,
        passingoutyear:passingoutyear,
        linkedInProfileLink:linkedInProfileLink,
        source:source,
        contest:contest,
        dob:dob,  
        campaignCode:campaignCode,
        referrerCode
      })
  });

  const data = await res.json();

    if(res.status === 201 || res.status === 200){ 
        setOTPGenerated(true);
        return openSuccessSB("OTP Sent",data.message,"SUCCESS");  
    }else{
        setOTPGenerated(false)
        return openSuccessSB("Error",data.message,"Error")
    }

  }

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        setOptions([...colleges]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

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

  const [checkUserExist, setCheckUserExist] = useState(true);
  async function handleMobile(e){
    setDetails(prevState => ({...prevState, mobile: e.target.value}))
    if((e.target.value).length >= 10){
      axios.get(`${apiUrl}user/exist/${e.target.value}`)
      .then((res)=>{
        setCheckUserExist(res?.data?.data);
      }).catch((err)=>{
          return new Error(err)
      }) 
    }
  }

  // console.log(contest?.contestStartTime, contestDetails?.contestStartTime, contest, contestDetails)

  return (
   
    <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{backgroundColor:'white', minHeight:'100vH', height: 'auto', width: 'auto', minWidth:'100vW'}}>
    <ThemeProvider theme={theme}>
    <Navbar/>
    <Grid mt={10} display='flex' justifyContent='center' alignContent='center' alignItems='center' container xs={12} md={12} lg={12}>
      
      <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
        <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
          
          {/* <Grid item xs={12} md={12} lg={12} p={2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <img src={logo} style={{ maxWidth: '40%', maxHeight: '20%', width: 'auto', height: 'auto' }}/>
          </Grid> */}

          <Grid item xs={12} md={12} lg={12} pl={5} pr={5} pb={2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDBox component="form" role="form" borderRadius={10}
                style={{
                  backgroundColor: 'white',
                  // height: '100vh',
                  width: '100%',
                  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' // Add box shadow
                }}
                display='flex' justifyContent='center' alignContent='center' alignItems='center'
              >
                <Grid container xs={12} md={12} xl={12} pt={1} pb={1} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'90%'}}>
                  <Grid item xs={12} md={12} xl={12} pl={2} pr={2} mb={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                    <MDTypography fontSize={15} fontColor='dark' fontWeight='bold' sx={{ textAlign: 'center' }}>
                      🚀 Announcing {contest ? contest?.contestName : contestDetails?.contestName} College Trading TestZone 🚀
                      🚀 Announcing {contest ? contest?.contestName : contestDetails?.contestName} College Trading TestZone 🚀
                    </MDTypography>
                  </Grid>

                  <Grid item xs={12} md={12} xl={12} pl={2} pr={2} mb={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                    <MDTypography fontSize={13} fontColor='dark' fontWeight='bold' sx={{ textAlign: 'center' }}>
                    💰 Your Gateway to Stock Market Success! 💰
                    </MDTypography>
                  </Grid>

                  <Grid item xs={12} md={12} xl={6} pl={2} pr={2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                    <MDTypography fontSize={12} fontColor='dark' fontWeight='bold'>
                      🕒 Start: {moment.utc(contest ? contest?.contestStartTime : contestDetails?.contestStartTime).utcOffset('+05:30').format('DD-MMM hh:mm a')}
                    </MDTypography>
                  </Grid>

                  <Grid item xs={12} md={12} xl={6} pl={2} pr={2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                    <MDTypography fontSize={12} fontColor='dark' fontWeight='bold'>
                      💰 Virtual Margin Money: ₹{(contest ? contest?.portfolio?.portfolioValue : contestDetails?.portfolio?.portfolioValue)?.toLocaleString()}
                    </MDTypography>
                  </Grid>

                  <Grid item xs={12} md={12} xl={6} pl={2} pr={2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                    <MDTypography fontSize={12} fontColor='dark' fontWeight='bold'>
                      🕒 End: {moment.utc(contest ? contest?.contestEndTime : contestDetails?.contestEndTime).utcOffset('+05:30').format('DD-MMM-YY hh:mm a')}
                    </MDTypography>
                  </Grid>

                  <Grid item xs={12} md={12} xl={6} pl={2} pr={2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                    <MDTypography fontSize={12} fontColor='dark' fontWeight='bold'>
                      🏆 Reward : {contest ? contest?.payoutPercentage : contestDetails?.payoutPercentage}% of Net P&L
                    </MDTypography>
                  </Grid>

                  <Grid item xs={12} md={12} xl={12} pl={2} pr={2} mt={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                    <MDTypography fontSize={12} fontColor='dark' fontWeight='bold' sx={{ textAlign: 'center' }}>
                        Rewards will be based on your net Profit and Loss during the TestZone period. So, bigger the P&L, the bigger you can earn!
                    </MDTypography>
                  </Grid>       
                  
                </Grid>
            </MDBox>
          </Grid>
          
          <Grid item xs={12} md={12} lg={12} pl={5} pr={5} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
            <MDBox  display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>

            <MDBox component="form" role="form" borderRadius={10}
              style={{
                backgroundColor: 'white',
                // height: '100vh',
                width: '100%',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' // Add box shadow
              }}
              display='flex' justifyContent='center' alignContent='center' alignItems='center'
            >

                {(!submitted) ? 
                <Grid container pt={1} pb={1} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'90%'}}>
                    
                    <Grid item xs={12} md={12} xl={12} mt={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <MDTypography fontSize={15} fontColor='dark' fontWeight='bold'>
                        Fill in your details to register!
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} xl={6} p={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
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

                    <Grid item xs={12} md={6} xl={6} p={1}>
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

                    <Grid item xs={12} md={6} xl={6} p={1}>
                      <TextField
                        required
                        disabled={otpGenerated}
                        id="outlined-required"
                        label="Email"
                        type="email"
                        fullWidth
                        onChange={(e)=>{setDetails(prevState => ({...prevState, email: e.target.value}))}}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} xl={6} p={1}>
                      <TextField
                        required
                        disabled={otpGenerated}
                        id="outlined-required"
                        label="Mobile(OTP will be sent on this number)"
                        type="text"
                        fullWidth
                        onChange={(e)=>{handleMobile(e)}}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} xl={6} p={1}>
                      <FormControl sx={{width: "100%" }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Gender *</InputLabel>
                        <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
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

                    <Grid item xs={12} md={6} xl={6} mt={-1} p={1}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            label="Date of Birth *"
                            disabled={otpGenerated}
                            onChange={(e)=>{setDetails(prevState => ({...prevState, dob: dayjs(e)}))}}
                            sx={{ width: '100%' }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} md={6} xl={6} p={1}>
                      <FormControl sx={{width: "100%" }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Course *</InputLabel>
                        <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        disabled={otpGenerated}
                        onChange={(e)=>{setDetails(prevState => ({...prevState, course: e.target.value}))}}
                        label="Course"
                        sx={{ minHeight:43 }}
                        >
                        <MenuItem value="Bachelor of Technology">Bachelor of Technology(BTech)</MenuItem>
                        <MenuItem value="Bachelor of Commerce">Bachelor of Commerce(BCom)</MenuItem>
                        <MenuItem value="Bachelor of Science">Bachelor of Science(BSc)</MenuItem>
                        <MenuItem value="Bachelor of Computer Application">Bachelor of Computer Application</MenuItem>
                        <MenuItem value="Bachelor of Architecture">Bachelor of Architecture(BA)</MenuItem>
                        <MenuItem value="Bachelor of Education">Bachelor of Education(BEd)</MenuItem>
                        <MenuItem value="Bachelor of Business Administration">Bachelor of Business Administration(BBA)</MenuItem>
                        <MenuItem value="Bachelor of Arts">Bachelor of Arts(BA)</MenuItem>
                        <MenuItem value="Corporate">Corporate</MenuItem>
                        <MenuItem value="Hotel Management">Hotel Management(HM)</MenuItem>
                        <MenuItem value="MBBS">Bachelor of Medicine, Bachelor of Surgery(MBBS)</MenuItem>
                        <MenuItem value="Master of Business Administration">Master of Business Administration(MBA)</MenuItem>
                        <MenuItem value="Master of Technology">Master of Technology(MTech)</MenuItem>
                        <MenuItem value="Master of Arts">Master of Science(MSc)</MenuItem>
                        <MenuItem value="School">School</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6} xl={6} p={1}>
                      <TextField
                          // required
                          disabled={otpGenerated}
                          id="outlined-required"
                          label="Year of Passing Out *"
                          type="text"
                          fullWidth
                          onChange={(e)=>{setDetails(prevState => ({...prevState, passingoutyear: e.target.value}))}}
                        />
                    </Grid>

                    <Grid item xs={12} md={12} xl={6} p={1}>
                    <Autocomplete
                        id="asynchronous-demo"
                        sx={{ width: '100%', height: '100%' }}
                        open={open}
                        onOpen={() => {
                          setOpen(true);
                        }}
                        onClose={() => {
                          setOpen(false);
                        }}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        getOptionLabel={(option) => option.collegeName}
                        options={options}
                        loading={loading}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="College Name *"
                            InputProps={{
                              ...params.InputProps,
                              style: { height: '43px', alignItems:'center', alignContent:'center' }, // Adjust the height as needed
                              endAdornment: (
                                <React.Fragment>
                                  {loading ? <CircularProgress color="inherit" size={15} /> : null}
                                  {/* {params.InputProps.endAdornment} */}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                        disabled={otpGenerated}
                        onChange={(e, selectedOption) => {
                          if (selectedOption) {
                            setDetails(prevState => ({ ...prevState, college: selectedOption._id }));
                            setDetails(prevState => ({ ...prevState, collegeName: selectedOption.collegeName }));
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={12} lg={6} p={1}>
                      <TextField
                        // required
                        disabled={otpGenerated}
                        id="outlined-required"
                        label="LinkedIn Profile Link"
                        type="text"
                        fullWidth
                        onChange={(e)=>{setDetails(prevState => ({...prevState, linkedInProfileLink: e.target.value}))}}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} xl={6} p={1}>
                      <FormControl sx={{width: "100%" }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Trading Exp *</InputLabel>
                        <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
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

                    <Grid item xs={12} md={6} xl={6} p={1}>
                      <FormControl sx={{width: "100%" }}>
                        <InputLabel id="demo-simple-select-autowidth-label">From where did you hear about us ? *</InputLabel>
                        <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
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

                    {!otpGenerated && 
                    <Grid item xs={12} md={12} lg={12} p={1}>
                    <MDBox mb={1} display="flex" justifyContent="space-around">
                      <MDButton 
                        onClick={generateOTP} 
                        variant="gradient" 
                        style={{backgroundColor:'#65BA0D', color:'white',width:'90%'}}
                      >
                        <MDTypography fontSize={13} fontWeight='bold' color='white'>Get Mobile OTP</MDTypography>
                      </MDButton>
                    </MDBox>
                    </Grid>
                    }


                    {!checkUserExist &&
                      <Grid item xs={12} md={12} lg={12} p={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                        <MDTypography fontSize={15} fontWeight='bold'>Looks like you haven't signed up yet 😀</MDTypography>
                      </Grid>}


                    {otpGenerated && 
                    <Grid item xs={12} md={6} lg={12} p={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <TextField
                          required
                          id="outlined-required"
                          label="Please enter the OTP"
                          type="text"
                          fullWidth
                          style={{width:'40%'}}
                          onChange={(e)=>{setDetails(prevState => ({...prevState, mobile_otp: e.target.value}))}}
                        />
                    </Grid>
                   }

                    {otpGenerated && 
                    <Grid item xs={12} md={6} lg={12} p={1}>
                    <MDBox mb={1} display="flex" justifyContent="space-around">
                      <MDButton 
                        onClick={()=>{confirmOTP()}} 
                        variant="gradient" 
                        // color="#65BA0D"
                        disabled={creating || buttonClicked} 
                        // style={{width:'90%'}}
                        style={{backgroundColor:'#65BA0D', color:'white',width:'90%'}}
                      >
                      {creating ? 
                        <CircularProgress size={20} color="inherit" /> : "Register & Apply"
                      }
                      </MDButton>
                    </MDBox>
                    </Grid>
                    }
                    
                </Grid>
                :
                <Grid container pt={1} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'90%'}}>
                  <Grid item pt={2} pl={5} pr={5} xs={12} md={12} lg={12} display="flex" justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{textAlign: 'center'}}>
                    <MDTypography>Thank you for showing interest in our College TestZone.</MDTypography>
                    <MDTypography mt={1} fontSize={20} fontWeight='bold'>Explore the world of Virtual Options Trading and real cash earning by downloading StoxHero App!</MDTypography>
                  </Grid>

                  <Grid item xs={12} md={12} lg={12} p={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                    <MDButton component="a" href="https://play.google.com/store/apps/details?id=com.stoxhero.app" target="_blank">
                      <img src={playstore} style={{ maxWidth: '40%', maxHeight: '20%', width: 'auto', height: 'auto' }}/>
                    </MDButton>
                  </Grid>
                </Grid>
               }
            </MDBox>
            </MDBox>
          </Grid>

        </Grid>
      </Grid>

      
      <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
        <Grid container xs={12} md={12} lg={12} pl={1} pr={1} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
          <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
            <img src={careerpage} style={{ maxWidth: '80%', maxHeight: '80%', width: 'auto', height: 'auto' }}/>
          </MDBox>
        </Grid>
      </Grid>

    </Grid>
    </ThemeProvider>
    {renderSuccessSB}
  </MDBox>
  )
}

export default CareerForm


//6UOWyIuWrBj5QdME6zzOA6p1qsLByKL1