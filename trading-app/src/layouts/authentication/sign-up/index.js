import React, {useState, useContext, useEffect} from "react"
import { useMediaQuery, CircularProgress } from '@mui/material'
import theme from '../../HomePage/utils/theme/index'; 
import { ThemeProvider } from 'styled-components';
import ReactGA from "react-ga"
import playstore from '../../../assets/images/playstore.png'
import Navbar from '../../HomePage/components/Navbars/Navbar';
import register from '../../../assets/images/register.png'
import virtualcurrency from '../../../assets/images/virtualcurrency.png'
import protrader from '../../../assets/images/protrader.png'
import zerorisk from '../../../assets/images/zerorisk.png'
import earningsimage from '../../../assets/images/earnings.png'
import lives from '../../../assets/images/lives.png'
import analytics from '../../../assets/images/analytics.png'
import internship from '../../../assets/images/internship.png'
import certification from '../../../assets/images/certification.png'
import MDAvatar from "../../../components/MDAvatar";
import { Helmet } from 'react-helmet';
// react-router-dom components
import { useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDButton from "../../../components/MDButton";
import MDSnackbar from "../../../components/MDSnackbar";
import TextField from '@mui/material/TextField';

// Authentication layout components
import Carousel from './carousel'
import Earnings from './earnings'
import SignUps from './signupCounter'
import Trades from './tradesCounter'
import TradeVolume from './tradeVolumeCounter'
import Withdrawals from './withdrawalsCounter'
import FNOTurnover from './optionTurnoverCounter'
import CollegeContest from './collegeContestCounter'
import TotalContest from './totalContestCounter'
import Rewards from './rewardsCounter'
import Subscription from './subscriptionsBought'
import Interns from './internCounter'
// Images
import axios from 'axios';
import { adminRole, userRole, Affiliate } from '../../../variables';
import { userContext } from '../../../AuthContext';
import Footer from "../components/Footer";
import { apiUrl } from '../../../constants/constants';



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
  const [signup, setSignup] = useState(false);
  const[mobile, setMobile] = useState('');
  const[otpGen, setOtpGen] = useState(false);
  const [resendTimerSi, setResendTimerSi] = useState(30); // Resend timer in seconds
  const [timerActiveSi, setTimerActiveSi] = useState(false);
  const [mobileOtp, setMobileOtp]=useState('');
  let [invalidDetail, setInvalidDetail] = useState();
  const [data, setData] = useState();
  const [earnings,setEarnings] = useState([]);
  const[defaultInvite, setDefaultInvite] = useState('');
  let referrerCodeString = location.search?.split('=')[1]??props.location?.search?.split('=')[1]??''
  const [messageObj, setMessageObj] = useState({
    color: '',
    icon: '',
    title: '',
    content: ''
  });
  const [buttonLoading, setButtonLoading] = useState({
    signupGetOtp: false,
    signupConfirmOtp: false,
    loginGetOtp: false,
    loginConfirmOtp: false
  })

  const getMetrics = async()=>{
    const res = await axios.get(`${apiUrl}newappmetrics`);
    // console.log("New App Metrics:",res.data.data)
    setData(res.data.data);
  }
  const getEarnings = async()=>{
    const res = await axios.get(`${apiUrl}contestscoreboard/earnings`);
    console.log('Earnings Leaderboard',res?.data?.data);
    setEarnings(res?.data?.data);
  }

  const getDefaultInvite = async() => {
    const res = await axios.get(`${apiUrl}campaign/defaultinvite`);
    console.log('defaultInvite',res.data?.data);
    setDefaultInvite(res.data.data);
  }

  const handleSUClick = () => {
    // Set the state to true when the link is clicked
    setSignup(false);
  };
  const handleSIClick = () => {
    // Set the state to true when the link is clicked
    window.webengage.track('signup_clicked', {});
    setSignup(true);
  };

  const [formstate, setformstate] = useState({
    first_name:"", 
    last_name:"",
    email:"",
    mobile:"",
    referrerCode:"",
    mobile_otp:"",
  });
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  
  useEffect(()=>{
    setformstate(prevState => ({...prevState, referrerCode: referrerCodeString}));
    getMetrics();
    getEarnings();
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
      }
    }  
  useEffect(()=>{
    getDefaultInvite();
  },[]);  


  async function formSubmit() {
    setSubmitClicked(true)
    setformstate(formstate);
    setButtonLoading(prev => ({...prev, signupGetOtp: true}))

    const {
      first_name,
      last_name,
      email,
      mobile,
      referrerCode,
    } = formstate;
    console.log(formstate)
    if (mobile.length !== 10) {

      if (mobile.length === 12 && mobile.startsWith('91')) {

      } else if (mobile.length === 11 && mobile.startsWith('0')) {

      }
      else {
        return openInfoSB("Mobile number invalid", "Please Check Your Number Again")
      }
    }

    const res = await fetch(`${baseUrl}api/v1/signup`, {

      method: "POST",
      // credentials:"include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": false
      },
      body: JSON.stringify({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email.trim(),
        mobile: mobile,
        referrerCode: referrerCode,
      })
    });


    const data = await res.json();
    // console.log(data, res.status);
    if (res.status === 201 || res.status === 200) {
      // window.alert(data.message);
      setShowEmailOTP(true);
      setTimerActive(true);
      setResendTimer(30);
      setButtonLoading(prev => ({...prev, signupGetOtp: false}))
      return openSuccessSB("OTP Sent", data.message);
    } else {
      // console.log("openInfoBS Called")
      return openInfoSB(data.message, "You have already signed Up")
    }
  }

  const [buttonClicked, setButtonClicked] = useState(false);
  async function otpConfirmation() {
    // console.log(formstate.email_otp)
    setButtonLoading(prev => ({...prev, signupConfirmOtp: true}))
    window.webengage.track('signup_confirmation_clicked', {});
    setButtonClicked(true);
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
        mobile_otp: formstate.mobile_otp,
        referrerCode: formstate.referrerCode,
      })
    });
    const data = await res.json();
    console.log("Data after account creation:", data)
    if (data.status === "Success") {
      setDetails.setUserDetail(data.data);
      setShowConfirmation(false);
      const userData = await userDetail();
      window.webengage.user.login(userData?._id?.toString());
      window.webengage.user.setAttribute('user_email', userData?.email);
      window.webengage.user.setAttribute('user_mobile', `+91${userData?.mobile.slice(-10)}`);
      window.webengage.user.setAttribute('user_first_name', userData?.first_name);
      window.webengage.user.setAttribute('user_last_name', userData?.last_name);
      window.webengage.user.setAttribute('user_dob', userData?.dob);
      window.webengage.user.setAttribute('user_gender', userData?.gender);
      window.webengage.user.setAttribute('user_city', userData?.city);
      window.webengage.user.setAttribute('user_state', userData?.state);
      window.webengage.user.setAttribute('user_joining_date', userData?.joining_date);
      window.webengage.user.setAttribute('user_kyc_status', userData?.KYCStatus);
      window.webengage.user.setAttribute('user_role', userData?.role?.roleName);

      setButtonLoading(prev => ({...prev, signupConfirmOtp: false}))
      if (userData?.role?.roleName === adminRole) {
        const from = location.state?.from || "/tenxdashboard";
        navigate(from);
      }
      else if (userData?.role?.roleName === "data") {
        const from = location.state?.from || "/analytics";
        navigate(from);
      }
      else if (userData?.role?.roleName === userRole) {
        const from = location.state?.from || "/home";
        navigate(from);
      }
      else if (userData?.role?.roleName === Affiliate) {
        const from = location.state?.from || "/home";
        navigate(from);
      } else {
        navigate('/home');
      }

      setButtonClicked(false);
      return openSuccessSB("Account Created", data.message);
    } else {
      setButtonClicked(false);
      return openInfoSB("Error", data.message);
    }

  }

  const resendOTP = async (type) => {
    setButtonClicked(false);
      setTimerActive(true);
      setResendTimer(30);
      window.webengage.track('resend_otp_signup', {});
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

  async function phoneLogin(e){
    e.preventDefault();
    setButtonLoading(prev => ({...prev, loginGetOtp: true}))
    try{
      if(mobile.length<10){
        return setInvalidDetail(`Please enter a valid mobile number`);
      }
      const res = await fetch(`${baseUrl}api/v1/phonelogin`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            mobile
        })
    });
    const data = await res.json();
    console.log("Error on otp verification:",data,data.message,data.error)
        if(data.status === 422 || data.error || !data){
            if(data.error === "deactivated"){
              setInvalidDetail(data?.message)
            } else{
              setInvalidDetail(`Mobile number incorrect`);
            }

        }else{
          if(res.status == 200 || res.status == 201){
              openSuccessSBSI("otp sent", data.message);
              setInvalidDetail('')
              setOtpGen(true);
              setButtonLoading(prev => ({...prev, loginGetOtp: false}))
            }
            else{
              setInvalidDetail(data.message)
              openSuccessSBSI("error", data.message);
            }
        }
    }catch(e){
      console.log(e)
    }

  }

  async function handleMobileChange(e){
    setMobile(e.target.value);
  }

  async function otpConfirmationSi(e){
    e.preventDefault();
    setButtonLoading(prev => ({...prev, loginConfirmOtp: true}))
    try{
        if(mobile.length<10){
          return setInvalidDetail(`Mobile number incorrect`);
        }
        const res = await fetch(`${baseUrl}api/v1/verifyphonelogin`, {
          method: "POST",
          credentials:"include",
          headers: {
              "content-type" : "application/json",
              "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify({
              mobile, mobile_otp:mobileOtp
          })
      });
      const data = await res.json();
      console.log(data)
          if(data.status === 'error' || data.error || !data){
              setInvalidDetail(data.message);
          }else{
            let userData = await userDetail();
            window.webengage.user.login(userData?._id?.toString());
            window.webengage.user.setAttribute('user_email', userData?.email);
            window.webengage.user.setAttribute('user_mobile', `+91${userData?.mobile.slice(-10)}`);
            window.webengage.user.setAttribute('user_first_name', userData?.first_name);
            window.webengage.user.setAttribute('user_last_name', userData?.last_name);
            window.webengage.user.setAttribute('user_dob', userData?.dob);
            window.webengage.user.setAttribute('user_gender', userData?.gender);
            window.webengage.user.setAttribute('user_city', userData?.city);
            window.webengage.user.setAttribute('user_state', userData?.state);
            window.webengage.user.setAttribute('user_joining_date', userData?.joining_date);
            window.webengage.user.setAttribute('user_kyc_status', userData?.KYCStatus);
            window.webengage.user.setAttribute('user_role', userData?.role?.roleName);
            setButtonLoading(prev => ({...prev, loginConfirmOtp: false}))
            if(userData?.role?.roleName === adminRole){
              const from = location.state?.from || "/tenxdashboard";
              navigate(from);
            }
            else if(userData?.role?.roleName === userRole){
              const from = location.state?.from || "/home";
                navigate(from);
            }
            else if(userData?.role?.roleName === Affiliate){
              const from = location.state?.from || "/home";
                navigate(from);
            } else{
                navigate('/home');
            }
          }
      }catch(e){
        console.log(e)
      }

  }

  async function resendOTPSi(type){
    setTimerActiveSi(true);
    // console.log("Active timer set to true")
    setResendTimerSi(30);
    window.webengage.track('resend_otp_login', {});
    try{
        const res = await fetch(`${baseUrl}api/v1/resendmobileotp`, {
          
          method: "POST",
          // credentials:"include",
          headers: {
              "content-type" : "application/json",
              "Access-Control-Allow-Credentials": false
          },
          body: JSON.stringify({
            mobile:mobile,
          })
        })
        const data = await res.json();
        console.log(data);
        if(data.status === 200 || data.status === 201){ 
            // openSuccessSB("OTP Sent",data.message);
        }else{
          openSuccessSBSI('resent otp', data.message)
            // openInfoSB("Something went wrong",data.mesaage);
        }
    }catch(e){
      console.log(e)
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

  const [successSBSI, setSuccessSBSI] = useState(false);
  const openSuccessSBSI = (value,content) => {
    // console.log("Value: ",value)
    if(value === "otp sent"){
        messageObj.color = 'success'
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
      color= {messageObj.color}
      icon= {messageObj.icon}
      title={messageObj.title}
      content={messageObj.content}
      open={successSBSI}
      onClose={closeSuccessSBSI}
      close={closeSuccessSBSI}
      bgWhite="success"
      sx={{ borderLeft: `10px solid ${"#65BA0D"}`, borderRadius: "15px"}}
    />
  );

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))

  return (
    <>
      <Helmet>

 
        <title>StoxHero - The best platform for learning stock market trading</title>
        <meta name='description' content='Experience live stock trading on real time platform using virtual money. Test strategies on F&O and enhance your trading skills without the fear of losing money. Join us' />
        <meta name='keywords' content='Best virtual trading platform,best app for paper trading,best low cost stock trading platform,trading simulation,stock market trading strategies,virtual trading platform india,best platform for trading options' />

      </Helmet>
      <MDBox mt={-1} display='flex' justifyContent='center' flexDirection='column' alignContent='center' alignItems='flex-start' style={{backgroundColor:'white', minHeight:'auto', height: 'relative', width: 'auto', minWidth:'100vW'}}>
      <ThemeProvider theme={theme}>
      <Navbar/>
      
      <Grid container mt={10} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='stretch' style={{ alignItems: 'stretch' }}>
        <Grid item xs={12} md={12} lg={8} display='flex' justifyContent='center' alignContent='center' alignItems='stretch'>
          <Grid spacing={2} container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='flex-start' alignItems='center' style={{width:'100%'}}>
          
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='flex-start' alignItems='center'>
              <MDBox component="form" role="form" borderRadius={10}
                  style={{
                    backgroundColor: 'white',
                    width: '95%',
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' // Add box shadow
                  }}
                  display='flex' justifyContent='center' alignContent='center' alignItems='center'
                >
                  <Grid container xs={12} md={12} lg={12} pt={1} pb={1} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'90%'}}>
                    <Grid item xs={12} md={12} lg={12} mt={0.5} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <MDTypography fontSize={15} style={{color:'#315c45'}} fontWeight='bold'>
                        Get ready, your stock market trading journey starts here!
                      </MDTypography>
                    </Grid>
                    
                    <Grid item xs={12} md={12} lg={12} mt={0.25} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <MDTypography fontSize={12} color='text' fontWeight='bold'>
                        Here how it starts!
                      </MDTypography>
                    </Grid>

                    <Grid item xs={4} md={4} lg={4} mt={0.25} display='flex' justifyContent='center' flexDirection='column' alignContent='center' alignItems='center'>
                      <img src={register} style={{ maxWidth: '60%', maxHeight: '60%', width: 'auto', height: 'auto' }}/>
                      <MDTypography color='text' fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>Register with StoxHero!</MDTypography>
                    </Grid>

                    <Grid item xs={4} md={4} lg={4} mt={0.25} display='flex' justifyContent='center' flexDirection='column' alignContent='center' alignItems='center'>
                      <img src={virtualcurrency} style={{ maxWidth: '60%', maxHeight: '60%', width: 'auto', height: 'auto' }}/>
                      <MDTypography color='text' fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>Get ₹10 lakh virtual currency!</MDTypography>
                    </Grid>

                    <Grid item xs={4} md={4} lg={4} mt={0.25} display='flex' justifyContent='center' flexDirection='column' alignContent='center' alignItems='center'>
                      <img src={protrader} style={{ maxWidth: '60%', maxHeight: '60%', width: 'auto', height: 'auto' }}/>
                      <MDTypography color='text' fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>Become an ace trader!</MDTypography>
                    </Grid>
                  </Grid>
              </MDBox>
            </Grid>

            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <MDBox component="form" role="form" borderRadius={10}
                  style={{
                    backgroundColor: 'white',
                    width: '95%',
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' // Add box shadow
                  }}
                  display='flex' justifyContent='center' alignContent='center' alignItems='center'
                >
                  <Grid container spacing={2} xs={12} md={12} lg={12} pt={0.5} pb={1} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'90%'}}>
                    <Grid item xs={12} md={12} lg={12} mt={0.5} mb={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <MDTypography fontSize={15} style={{color:'#315c45'}} fontWeight='bold'>
                        One platform, multiple benefits!
                      </MDTypography>
                    </Grid>

                    <Grid item xs={4} md={4} lg={4} mt={0.25} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                        <MDAvatar
                            src={zerorisk}
                            alt={"zero risk"}
                            size="lg"
                          />
                        </Grid>
                      <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                        <MDTypography color='text' fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>Zero Money Loss</MDTypography>
                      </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={4} md={4} lg={4} mt={0.25} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                        <MDAvatar
                            src={lives}
                            alt={"real-time simulation"}
                            size="lg"
                          />
                        </Grid>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                        <MDTypography color='text' fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>Real-time simulation</MDTypography>
                      </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={4} md={4} lg={4} mt={0.25} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                        <MDAvatar
                            src={analytics}
                            alt={"analytics"}
                            size="lg"
                          />
                        </Grid>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                        <MDTypography color='text' fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>Trading Analytics</MDTypography>
                      </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={4} md={4} lg={4} mt={0.25} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                        <MDAvatar
                            src={earningsimage}
                            alt={"signup"}
                            size="lg"
                          />
                        </Grid>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                        <MDTypography color='text' fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>Daily Contests</MDTypography>
                      </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={4} md={4} lg={4} mt={0.25} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                        <MDAvatar
                            src={internship}
                            alt={"internship"}
                            size="lg"
                          />
                        </Grid>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                        <MDTypography color='text' fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>Internship Opportunities</MDTypography>
                      </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={4} md={4} lg={4} mt={0.25} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                        <MDAvatar
                            src={certification}
                            alt={"certification"}
                            size="lg"
                          />
                        </Grid>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                        <MDTypography color='text' fontSize={13} fontWeight="bold" style={{textAlign:'center'}}>Trading Certifications</MDTypography>
                      </Grid>
                      </Grid>
                    </Grid>

                  </Grid>
              </MDBox>
            </Grid>

          </Grid>
        </Grid>

        <Grid item xs={12} md={12} lg={4} display='flex' flexDirection='column' justifyContent='center' alignContent='center' alignItems='center'>
          <Grid spacing={2} container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>  
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <MDBox component="form" role="form" borderRadius={10}
                  style={{
                    backgroundColor: 'white',
                    // height: '100vh',
                    width: '95%',
                    padding:20,
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' // Add box shadow
                  }}
                  display='flex' justifyContent='center' alignContent='center' alignItems='center'
                >
                  <Grid container xs={12} md={12} lg={12} pt={1} pb={1} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'90%', height:'100%'}}>

                    <Grid item xs={12} md={12} lg={12} ml={6} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%', minWidth: '100%'}}>
                        <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%', minWidth: '100%'}}>
                          <Carousel/>
                        </MDBox>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} mt={0.5} mb={1} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%', minWidth: '100%'}}>
                      <MDTypography fontSize={18} fontColor='dark' fontWeight='bold'>
                      Welcome to StoxHero!
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} mt={0.25} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%', minWidth: '100%'}}>
                      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                        {/* <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                          <MDTypography fontSize={12} color='text' fontWeight='bold'>
                            {signup ? 'Fill in the details to get started!' : ''}
                          </MDTypography>
                        </Grid> */}
                        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                          {signup ?
                            <MDTypography fontSize={12} style={{color:'#65BA0D', textAlign:'center'}} fontWeight='bold'>
                            Unlock your welcome bonus! Use code {defaultInvite?.campaignCode} & grab ₹{defaultInvite?.campaignSignupBonus?.amount} in your StoxHero wallet!
                          </MDTypography>
                          :
                          <MDBox ml={6} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%', minWidth: '100%'}}>
                            <Earnings leaderboard={earnings}/>
                          </MDBox>
                          }
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%',minWidth:'100%'}}>
                    {signup &&
                    <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%',minWidth:'100%'}}>
                        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'> 
                          {showConfirmation && 
                            
                              <MDTypography variant="button" color="text" fontSize={12} fontWeight='bold'>
                                Already have an account?{" "}
                                <MDTypography
                                  // component={Link}
                                  // to="/login"
                                  variant="button"
                                  color="dark"
                                  fontWeight="medium"
                                  textGradient
                                  fontSize={13}
                                  onClick={handleSUClick}
                                  style={{cursor:'pointer'}}
                                >
                                  Sign In
                                </MDTypography>
                              </MDTypography>
                            
                          }
                        </Grid>
                        {!showEmailOTP && <Grid item xs={12} md={12} lg={6}>
                          <TextField
                            required
                            disabled={showEmailOTP}
                            id="outlined-required"
                            label="First Name"
                            fullWidth
                            onChange={(e) => { formstate.first_name = e.target.value }}
                          />
                        </Grid>}

                        {!showEmailOTP && <Grid item xs={12} md={12} lg={6}>
                          <TextField
                            required
                            disabled={showEmailOTP}
                            id="outlined-required"
                            label="Last Name"
                            fullWidth
                            onChange={(e) => { formstate.last_name = e.target.value }}
                          />
                        </Grid>}

                        {!showEmailOTP && <Grid item xs={12} md={12} lg={6}>
                          <TextField
                            required
                            disabled={showEmailOTP}
                            id="outlined-required"
                            label="Email"
                            type="email"
                            fullWidth
                            onChange={(e) => { formstate.email = e.target.value }}
                          />
                        </Grid>}

                        {!showEmailOTP && <Grid item xs={12} md={12} lg={6}>
                          <TextField
                            required
                            disabled={showEmailOTP}
                            id="outlined-required"
                            label="Mobile No."
                            fullWidth
                            onChange={(e) => { formstate.mobile = e.target.value }}
                          />
                        </Grid>}

                        {!showEmailOTP && (
                              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                                <MDButton variant="gradient" style={{ backgroundColor: '#65BA0D', color: 'white' }} fullWidth onClick={formSubmit}>
                                  {buttonLoading.signupGetOtp ?
                                    <CircularProgress size={20} color="inherit" /> : "Get Mobile OTP"
                                  }

                                </MDButton>
                              </Grid>
                        )}

                        {showEmailOTP && showConfirmation && (
                        <>
                              <Grid item xs={12} md={12} lg={6} mb={.5} display="flex" justifyContent="center">
                                <TextField
                                  disabled={referrerCodeString}
                                  type="text"
                                  id="outlined-required"
                                  label={formstate.referrerCode ? '' : "Referrer/Invite Code"}
                                  fullWidth
                                  value={formstate.referrerCode}
                                  onChange={(e) => {
                                    const newValue = e.target.value;
                                    setformstate((prevState) => ({
                                      ...prevState,
                                      referrerCode: newValue
                                    }));
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} md={12} lg={6} mb={.5} display="flex" justifyContent="center">
                                  <TextField
                                    sx={{width: "100%"}}
                                    label='Mobile OTP'
                                    value={formstate.mobile_otp}
                                    onChange={(e) => { setformstate(prevState => ({ ...prevState, mobile_otp: e.target.value })) }}
                                  />
                              </Grid>

                              <Grid item xs={12} md={6} xl={12} display="flex" justifyContent="center">
                                <MDButton style={{ padding: '0rem', margin: '0rem', minHeight: 20, width: '80%', display: 'flex', justifyContent: 'center', margin: 'auto' }} disabled={timerActive} variant="text" color="dark" fullWidth onClick={() => { resendOTP('mobile') }}>
                                  {timerActive ? `Resend Mobile OTP in ${resendTimer} seconds` : 'Resend Mobile OTP'}
                                </MDButton>
                              </Grid>
                              
                              <Grid item xs={12} md={12} lg={12} mt={.25} display="flex" justifyContent="center">
                                <MDButton variant="gradient" style={{backgroundColor:"#65BA0D", color:'white'}} fullWidth onClick={otpConfirmation} disabled={buttonClicked}>
                                {buttonLoading.signupConfirmOtp ?
                                    <CircularProgress size={20} color="inherit" /> : "Confirm"
                                  }
                                  
                                </MDButton>
                            </Grid>
                          
                        </>
                        )}

                    </Grid>
                    }

                    {!signup &&
                    <Grid container spacing={1} xs={12} md={12} lg={12} mb={1} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width: '100%',minWidth:'100%'}}>
                      <Grid item xs={12} md={12} lg={12} mt={2} mb={2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                          {showConfirmation && 
                              <MDTypography variant="button" color="text" fontSize={12} fontWeight='bold'>
                                Don't have an account?{" "}
                                <MDTypography
                                  // component={Link}
                                  // to="/login"
                                  variant="button"
                                  color="dark"
                                  fontWeight="medium"
                                  textGradient
                                  fontSize={13}
                                  onClick={handleSIClick}
                                  style={{cursor:'pointer'}}
                                >
                                  Sign Up
                                </MDTypography>
                              </MDTypography>
                          }
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                          <TextField
                            required
                            disabled={showEmailOTP}
                            id="outlined-required"
                            label="Enter mobile number to login"
                            fullWidth
                            type='number'
                            onChange={handleMobileChange}
                          />
                        </Grid>

                        {invalidDetail && 
                        <Grid item xs={12} md={12} lg={12} mb={.25} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                          <MDTypography fontSize={12} variant="button" color={invalidDetail && "error"}>
                            {invalidDetail && invalidDetail}
                          </MDTypography>
                        </Grid>
                        }

                        {!otpGen &&
                          <Grid item xs={12} md={12} lg={12}>
                          <MDButton variant="gradient" style={{backgroundColor:'#65BA0D', color:'white'}} onClick={phoneLogin} fullWidth>
                          
                            {buttonLoading.loginGetOtp ?
                                    <CircularProgress size={20} color="inherit" /> : " Get Mobile OTP"
                                  }
                          </MDButton>
                          </Grid>
                        }

                        {otpGen && <>
                        <Grid item xs={12} md={12} xl={6} width="100%" display="flex" justifyContent="center">
                          <TextField
                            fullWidth
                            label="Mobile OTP"
                            value={mobileOtp}
                            onChange={(e)=>{setMobileOtp(e.target.value)}}
                          />
                          </Grid>
                          
                          <Grid item xs={12} md={6} lg={6} display="flex" justifyContent="center">
                          <MDButton style={{padding:'0rem', margin:'0rem', minHeight:20, display: 'flex', justifyContent: 'center', margin: 'auto'}} disabled={timerActiveSi} variant="text" color="dark" fullWidth onClick={()=>{resendOTPSi('mobile')}}>
                            {timerActiveSi ? `Resend Mobile OTP in ${resendTimerSi} seconds` : 'Resend Mobile OTP'}
                          </MDButton>
                          </Grid>

                          <Grid item xs={12} md={6} xl={12} mt={1} display="flex" justifyContent="center">
                            <MDButton variant="gradient" style={{backgroundColor:'#65BA0D', color:'white'}} fullWidth onClick={otpConfirmationSi}>
                              
                              {buttonLoading.loginConfirmOtp ?
                                    <CircularProgress size={20} color="inherit" /> : "Confirm OTP"
                                  }
                            </MDButton>
                          </Grid>
                          </>
                        }

                    </Grid>
                    }

                    </Grid>
          
                  </Grid>
              </MDBox>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container mb={3} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start'>
        <Grid item xs={12} md={12} lg={12} mt={1} display='flex' flexDirection='column' justifyContent='center' alignContent='center' alignItems='center'>
          <Grid container xs={12} md={12} lg={12} mt={2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={2.4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <TotalContest initialCount={data?.totalContestConducted || 0}/>
            </Grid>
            <Grid item xs={12} md={12} lg={2.4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <CollegeContest initialCount={data?.collegeContestConducted || 0}/>
            </Grid>
            <Grid item xs={12} md={12} lg={2.4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <Subscription initialCount={data?.tenxSubscriptionsBought || 0}/>
            </Grid>
            <Grid item xs={12} md={12} lg={2.4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <Interns initialCount={data?.internsCount || 0}/>
            </Grid>
            <Grid item xs={12} md={12} lg={2.4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <Rewards initialCount={data?.payouts || 0}/>
            </Grid>
            <Grid item xs={12} md={12} lg={2.4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <SignUps initialCount={data?.totalSignups || 0}/>
            </Grid>
            <Grid item xs={12} md={12} lg={2.4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <Trades initialCount={data?.totalTrades || 0}/>
            </Grid>
            <Grid item xs={12} md={12} lg={2.4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <TradeVolume initialCount={data?.totalTradedVolume || 0}/>
            </Grid>
            <Grid item xs={12} md={12} lg={2.4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <FNOTurnover initialCount={data?.totalTradedTurnover || 0}/>
            </Grid>
            <Grid item xs={12} md={12} lg={2.4} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <Withdrawals initialCount={data?.withdrawalProcessedAmount || 0}/>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={12} lg={12} display='flex' flexDirection='column' justifyContent='center' alignContent='center' alignItems='center'>
        <Grid container xs={12} md={12} lg={12} mt={2} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <MDTypography fontSize={15} color='text' fontWeight='bold'>Download the App Now</MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <MDButton style={{ maxWidth: '50%', maxHeight: '20%', width: 'auto', height: 'auto' }} component="a" href="https://play.google.com/store/apps/details?id=com.stoxhero.app" target="_blank">
                <img src={playstore} style={{ maxWidth: '60%', maxHeight: '20%', width: 'auto', height: 'auto' }}/>
              </MDButton>
            </Grid>    
        </Grid>
        </Grid>
      </Grid>
      {renderSuccessSB}
      {renderInfoSB}
      {renderSuccessSBSI}
      </ThemeProvider>
      
      </MDBox>
      <MDBox>
        <Footer/>
      </MDBox>
    </>
      
  );
}

export default Cover;
