import React, { useState, useEffect, useContext } from "react"
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, Typography, useMediaQuery } from '@mui/material'
import theme from '../../HomePage/utils/theme/index';
import { ThemeProvider } from 'styled-components';
// import ReactGA from "react-ga"
import FinNavbar from '../../HomePage/components/Navbars/FinNavBar';
import background from '../../../assets/images/finowledge.png'
import ReactGA from "react-ga";
import TextField from '@mui/material/TextField';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import logo from '../../../assets/images/school.png'
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
import MDAvatar from "../../../components/MDAvatar";
import { Autocomplete, Box } from "@mui/material";
import { styled } from '@mui/material';
import { Helmet } from "react-helmet";
import debounce from 'debounce'; 



const CustomAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-clearIndicator {
    color: white;
  }
`;
function Cover() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [resendTimer, setResendTimer] = useState(30); // Resend timer in seconds
  const [timerActive, setTimerActive] = useState(false); // Flag to check if timer is active
  const [submitClicked, setSubmitClicked] = useState(false);
  const setDetails = useContext(userContext);
  const [cityData, setCityData] = useState([]);
  const [gradeValue, setGradeValue] = useState();
  const [value, setValue] = useState({
    _id: '',
    name: ""
  })

  const [isFocused, setIsFocused] = useState(false);
  const [dateValue, setDateValue] = useState('');
  const [userState, setUserState] = useState('');
  const [userCity, setUserCity] = useState('');
  const [schoolsList, setSchoolsList] = useState([]);
  const [userSchool, setUserSchool] = useState('');

  const [otpGen, setOtpGen] = useState(false);
  const [mobileOtp, setMobileOtp] = useState('');
  const [invalidDetail, setInvalidDetail] = useState();

  const queryString = location.search;
  const urlParams = new URLSearchParams(queryString);

  // Get the value of the "mobile" parameter
  const mobile = urlParams.get('mobile');
  const campaignCode = urlParams.get('campaignCode')

  const [formstate, setformstate] = useState({
    full_name: "",
    mobile: mobile,
    mobile_otp: "",
    parents_name: "",
    grade: "",
    school: "",
    dob: "",
    city: {
      id: "",
      city: ""
    },
  });
  const [inputValue, setInputValue] = useState('');
  const searchSchools = async ()=>{
    const res = await axios.post(`${apiUrl}fetchschools`, {stateName:userState, cityName:userCity ,inputString: inputValue});
    console.log('setting school list', schoolsList.length);
    setSchoolsList(res.data);
  }

  const debounceGetSchools = debounce(searchSchools, 1500);
  
  const handleSchoolChange = (event, newValue) => {
    setUserSchool(newValue);
    console.log('setting list for user', newValue);
  }
  
  

  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
  },[])

  const getCities = async () => {
    try {
      const res = await axios.get(`${apiUrl}cities/bystate/${userState}`);
      if (res.data.status == 'success') {
        setCityData(res.data.data);
      }
    } catch (e) {
      console.log(e);
    }

  }

  useEffect(() => {
    getCities();
  }, [userState])

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
      city, dob
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
        student_name: full_name.trim(),
        mobile: mobile,
        parents_name: parents_name.trim(),
        grade: gradeValue, school: userSchool?._id,
        city: value?._id,
        dob: dateValue,
        state: userState
      })
    });


    const data = await res.json();
    // console.log(data, res.status);
    if (res.status === 201 || res.status === 200) {
      // setTimerActive(true);
      setResendTimer(30);
      setOtpGen(true)
      return openSuccessSB("OTP Sent", data.message);
    } else {
      // console.log("openInfoBS Called")
      return openSuccessSB('Error', data.message)
    }
  }

  const [buttonClicked, setButtonClicked] = useState(false);
  async function otpConfirmation() {
    setButtonClicked(true);
    const {
      full_name,
      mobile,
      parents_name,
      grade, school,
      city, dob
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
        student_name: full_name,
        mobile,
        parents_name,
        grade: gradeValue, school: userSchool?._id,
        city: value?._id,
        dob: dateValue, state: userState,
        referrerCode: campaignCode
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

  const ResendTimerSi = (seconds) => {
    let remainingTime = seconds;

    const timer = setInterval(() => {
      // Display the remaining time
      console.log(`Remaining time: ${remainingTime} seconds`);

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

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    if (!dateValue) {
      setIsFocused(false);
    }
  };
  const handleTypeChange = (event) => {
    setDateValue(event.target.value);
  };

  const handleStateChange = (event, newValue) => {
    console.log('event', event.target, newValue);
    setUserState(newValue);
    setSchoolsList([]);
    setUserSchool('');
    setCityData([]);
    setUserCity('');
    setValue({id:'',name:''});
  }

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

  const handleCityChange = (event, newValue) => {
    setUserCity(newValue?.name);
    setValue(newValue);
    setSchoolsList([]);
    setUserSchool('');
  };

  const handleGradeChange = (event, newValue) => {
    setGradeValue(newValue);
  };

  return (
    <>
      <MDBox mt={-1} display='flex' justifyContent='center' flexDirection='column' alignContent='center' alignItems='center' style={{ minHeight: 'auto', width: 'auto', minWidth: '100vW', overflow: 'visible' }}>
        <ThemeProvider theme={theme}>
          <FinNavbar />
          <Helmet>
            <title>{"StoxHero Finance Olympiad"}</title>
            <meta name='description' content="NFO gives schools access to a comprehensive financial syllabus, and India's pioneering Finance Examination, both meticulously crafted to cater to school children."/>
            {/* <meta name='keywords' content={blogData?.keywords} /> */}
          </Helmet>
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
                  <MDTypography variant={isMobile ? 'h5' : 'h3'} style={{fontFamily: 'Work Sans , sans-serif', color:'#D5F47E'}}>Welcome to StoxHero!</MDTypography>
                </MDBox>
                <MDBox display='flex' justifyContent='center' alignItems='center' style={{ overflow: 'visible' }}>
                  <MDTypography variant='body2' style={{fontFamily: 'Work Sans , sans-serif', color:'#D5F47E'}}>Fill in these details to get you started!</MDTypography>
                </MDBox>
              </Grid>
              <Grid mb={2} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                <TextField
                  required
                  disabled={otpGen}
                  id="outlined-required"
                  
                  fullWidth
                  placeholder="Full Name"
                  type='text'
                  name='full_name'
                onChange={handleChange}
                />
              </Grid>
              <Grid mb={2} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                <TextField
                  required
                  disabled={otpGen}
                  id="outlined-required"
                  placeholder="Parent's Name"
                  fullWidth
                  type='text'
                  name='parents_name'
                onChange={handleChange}
                />
              </Grid>

              <Grid mb={2} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                <TextField
                   required
                   id="outlined-required"
                   disabled={otpGen}
                   fullWidth
                   type={isFocused || dateValue ? 'date' : 'text'}
                   name="dob"
                   placeholder={!isFocused && !dateValue ? "Date of Birth" : ""}
                   value={dateValue}
                   onChange={handleTypeChange}
                   onFocus={handleFocus}
                   onBlur={handleBlur}
                   InputLabelProps={isFocused || dateValue ? { shrink: true } : {}}
                />
              </Grid>

              <Grid mb={2} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                <CustomAutocomplete
                  id="country-select-demo"
                  sx={{
                    width: "100%",
                    '& .MuiAutocomplete-clearIndicator': {
                      color: 'dark',
                    },
                  }}
                  options={["6th", '7th', '8th', '9th', '10th', '11th', "12th"]}
                  value={gradeValue}
                  disabled={otpGen}
                  onChange={handleGradeChange}
                  autoHighlight
                  getOptionLabel={(option) => option ? option : 'Grade'}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      {option}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Grade/Class"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                        style: { color: 'dark', height: "10px" }, // set text color to dark
                      }}
                      InputLabelProps={{
                        style: { color: 'dark' },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid mb={2} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                <CustomAutocomplete
                  id="country-select-demo"
                  sx={{
                    width: "100%",
                    '& .MuiAutocomplete-clearIndicator': {
                      color: 'dark',
                    },
                  }}
                  options={['Andaman & Nicobar', 'Andhra Pradesh', 'Arunachal Pradesh', "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi",
                            "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir","Jharkhand", "Karnataka", "Kerala", "Ladakh", 
                            "Lakshadeep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Pondicherry",
                            "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"]}
                  value={userState}
                  disabled={otpGen}
                  onChange={handleStateChange}
                  autoHighlight
                  getOptionLabel={(option) => option ? option : ''}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      {option}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search your state"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                        style: { color: 'dark', height: "10px" }, // set text color to dark
                      }}
                      InputLabelProps={{
                        style: { color: 'dark' },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid mb={2} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                <CustomAutocomplete
                  id="country-select-demo"
                  sx={{
                    width: "100%",
                    '& .MuiAutocomplete-clearIndicator': {
                      color: 'dark',
                    },
                  }}
                  options={cityData}
                  value={value}
                  disabled={otpGen}
                  onChange={handleCityChange}
                  autoHighlight
                  getOptionLabel={(option) => option ? option.name : 'City'}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      {option.name}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search your city"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                        style: { color: 'dark', height: "10px" }, // set text color to dark
                      }}
                      InputLabelProps={{
                        style: { color: 'dark' },
                      }}
                    />
                  )}
                />
              </Grid>
              
              <Grid mb={2} item xs={12} md={12} lg={8} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                <CustomAutocomplete
                  id="country-select-demo"
                  sx={{
                    width: "100%",
                    '& .MuiAutocomplete-clearIndicator': {
                      color: 'dark',
                    },
                  }}
                  options={schoolsList}
                  value={userSchool}
                  disabled={otpGen}
                  onChange={handleSchoolChange}
                  // onInputChange={debounceGetSchools}
                  onInputChange={(e)=>{setInputValue(e?.target?.value);debounceGetSchools();}}
                  autoHighlight
                  getOptionLabel={(option) => option ? option.school_name : ''}
                  renderOption={(props, option) => (
                    // <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    //   {option.schoolString}
                    // </Box>
                      <li {...props}>
                          <Grid container lg={12} xs={12} md={12} display='flex' flexDirection={'row'} justifyContent={'center'} alignContent={'center'} alignItems='center'>
                              <Grid item lg={4} xs={4} md={4} sx={{ display: 'flex', width: "100%" }}>
                                  <MDAvatar
                                      src={logo}
                                      alt={"School"}
                                      size="lg"
                                      sx={{
                                          cursor: "pointer",
                                          borderRadius: isMobile ? "5px" : "10px",
                                          height: isMobile ? "25px" : "30px",
                                          width: isMobile ? "35px" : "50px",
                                          ml: 0,
                                          border: "none"
                                      }}
                                  />
                              </Grid>
                              <Grid item lg={8} xs={8} md={8} sx={{ width: '100%', wordWrap: 'break-word' }}>
                                  <MDBox
                                      component="span"
                                      sx={{ fontWeight: option.highlight ? 'bold' : 'regular' }}
                                      style={{fontFamily: "Work Sans"}}
                                  >
                                  <Typography variant="body4" color="text.secondary" style={{fontFamily: "Work Sans"}}>
                                      {option?.school_name}<br/>
                                  </Typography>
                                  </MDBox>
                                  <Typography variant="caption" color="text.secondary" style={{fontFamily: "Work Sans"}}>
                                      {`${option?.address}`}
                                  </Typography>
                              </Grid>
                          </Grid>
                      </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search your school"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                        style: { color: 'dark', height: "10px" }, // set text color to dark
                      }}
                      InputLabelProps={{
                        style: { color: 'dark' },
                      }}
                    />
                  )}
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
                    <MDButton style={{ padding: '0rem', margin: '0rem', minHeight: 20, display: 'flex', justifyContent: 'center', margin: 'auto' }} variant="text" color="#ffffff" fullWidth onClick={timerActive ? ()=>{} : () => { resendOTP('mobile') }}>
                      {timerActive ? `Resend Mobile OTP in ${resendTimer} seconds` : 'Resend Mobile OTP'}
                    </MDButton>
                  </Grid>

                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center'>
                    <MDBox mb={5} display='flex' justifyContent='center'>
                      <MDButton fullWidth variant='contained' size='small' color='student' style={{ marginTop: 15, color: '#000' }}
                        onClick={otpConfirmation} disabled={buttonClicked}>Confirm OTP</MDButton>
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
