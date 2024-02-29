import React, { useState, useContext, useEffect } from "react"
import { Link, useLocation } from "react-router-dom";
import ReactGA from "react-ga"
import theme from '../../utils/theme/index';
import { Box, Grid } from '@mui/material';
import MDBox from "../../../../components/MDBox";
import { CircularProgress } from '@mui/material';
import MDTypography from "../../../../components/MDTypography";
import logo from '../../../../assets/images/fulllogo.png'
import playstore from '../../../../assets/images/playstore.png'
import careerpage from '../../../../assets/images/careerpage.png'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MDButton from "../../../../components/MDButton";
import MDSnackbar from "../../../../components/MDSnackbar";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import dayjs from 'dayjs';
import { Autocomplete } from '@mui/material';
import axios from "axios";
import { apiUrl } from '../../../../constants/constants';
import Navbar from "../../components/Navbars/Navbar";
import { ThemeProvider } from 'styled-components';
import { useNavigate } from 'react-router-dom';


function sleep(duration) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

const App = (props) => {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = React.useState('1');
    const [submitted, setSubmitted] = useState(false)
    const [colleges, setColleges] = useState([]);
    const [creating, setCreating] = useState(false)
    const [otpGenerated, setOTPGenerated] = useState(false);
    const location = useLocation();
    const career = location?.state?.data;
    const [careerDetails, setCareerDetails] = useState();
    const params = new URLSearchParams(location?.search);

    const [id, setId] = useState('');
  
    // Get the value of the "mobile" parameter
    const courseId = params.get('course');
  
    const navigate = useNavigate();
    const slug = window.location.pathname.split('/')[2]


    const [detail, setDetails] = useState({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        mobile_otp: "",
    })

    const [buttonClicked, setButtonClicked] = useState(false);

    async function confirmOTP() {
        setButtonClicked(true);
        setCreating(true);
        setDetails(prevState => ({ ...prevState, mobile_otp: detail.mobile_otp }));

        const {
            first_name,
            last_name,
            email,
            mobile,
            mobile_otp,
            
        } = detail;

        const res = await fetch(`${apiUrl}/confirmcourseotp`, {
            method: "PATCH",
            // credentials:"include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": false
            },
            body: JSON.stringify({
                first_name: first_name,
                last_name: last_name,
                email: email,
                mobile: mobile,
                mobile_otp: mobile_otp,
                slug
            })
        });

        const data = await res.json();

        if (res.status === 201) {
            setSubmitted(true);
            setCreating(false);
            setButtonClicked(false);
            navigate(`/courses/${slug}/details?course=${courseId}&id${data?.data?._id}`)
            return openSuccessSB("Application Submitted", data.info, "SUCCESS");
        } else {
            setButtonClicked(false);
            return openSuccessSB("Error", data.info, "Error")
        }

    }

    async function generateOTP() {

        if(id){
            navigate(`/courses/${slug}/details?course=${courseId}&id${id}`);
            return;
        }

        const {
            first_name,
            last_name,
            email,
            mobile,
         
        } = detail;
        console.log("Form:", detail)
        if (!first_name || !last_name || !email || !mobile) {
            return openSuccessSB("Form Incomplete", "Please fill all the required fields", "Error");
        }
        if (mobile.length !== 10) {

            if (mobile.length === 12 && mobile.startsWith('91')) {

            } else if (mobile.length === 11 && mobile.startsWith('0')) {

            }
            else {
                setOTPGenerated(false)
                return openSuccessSB("Invalid mobile Number", "Enter 10 digit mobile number", "Error")
            }
        }

        setOTPGenerated(true)
        const res = await fetch(`${apiUrl}signup`, {
            method: "POST",
            // credentials:"include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": false
            },
            body: JSON.stringify({
                first_name: first_name,
                last_name: last_name,
                email: email,
                mobile: mobile,
            })
        });

        const data = await res.json();

        if (res.status === 201 || res.status === 200) {
            setOTPGenerated(true);
            return openSuccessSB("OTP Sent", data.info, "SUCCESS");
        } else {
            setOTPGenerated(false)
            return openSuccessSB("Error", data.info, "Error")
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

    const openSuccessSB = (title, content, message) => {
        msgDetail.title = title;
        msgDetail.content = content;
        if (message == "SUCCESS") {
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

    const closeSuccessSB = () => {
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


    const [checkUserExist, setCheckUserExist] = useState(true);
    async function handleMobile(e) {
        setDetails(prevState => ({ ...prevState, mobile: e.target.value }))
        if ((e.target.value).length >= 10) {
            axios.get(`${apiUrl}user/exist/${e.target.value}`)
                .then((res) => {
                    setCheckUserExist(res?.data?.data);
                    setId(res?.data?.id);
                   
                }).catch((err) => {
                    return new Error(err)
                })
        }
    }

    return (

        <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ backgroundColor: 'white', minHeight: '100vH', height: 'auto', width: 'auto', minWidth: '100vW' }}>
            <ThemeProvider theme={theme}>
                <Navbar />
                <Grid mt={10} display='flex' justifyContent='center' alignContent='center' alignItems='center' container xs={12} md={12} lg={12}>

                    <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                        <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>

                            <Grid item xs={12} md={12} lg={12} pl={5} pr={5} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>

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
                                            <Grid container pt={1} pb={1} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '90%' }}>

                                                <Grid item xs={12} md={12} xl={12} mt={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                    <MDTypography fontSize={20} fontColor='dark' fontWeight='bold'>
                                                        Application for
                                                    </MDTypography>
                                                </Grid>

                                                <Grid item xs={12} md={12} xl={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                    <MDTypography fontSize={20} fontColor='dark' fontWeight='bold'>
                                                        {career ? career?.jobTitle : careerDetails?.jobTitle}
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
                                                        onChange={(e) => { setDetails(prevState => ({ ...prevState, first_name: e.target.value })) }}
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
                                                        onChange={(e) => { setDetails(prevState => ({ ...prevState, last_name: e.target.value })) }}
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
                                                        onChange={(e) => { setDetails(prevState => ({ ...prevState, email: e.target.value })) }}
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
                                                        onChange={(e) => { handleMobile(e) }}
                                                    />
                                                </Grid>


                                                {!otpGenerated &&
                                                    <Grid item xs={12} md={12} lg={12} p={1}>
                                                        <MDBox mb={1} display="flex" justifyContent="space-around">
                                                            <MDButton
                                                                onClick={generateOTP}
                                                                variant="gradient"
                                                                style={{ backgroundColor: '#65BA0D', color: 'white', width: '90%' }}
                                                            >
                                                                <MDTypography fontSize={13} fontWeight='bold' color='white'>Get Mobile OTP to Apply</MDTypography>
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
                                                            style={{ width: '40%' }}
                                                            onChange={(e) => { setDetails(prevState => ({ ...prevState, mobile_otp: e.target.value })) }}
                                                        />
                                                    </Grid>
                                                }

                                                {otpGenerated &&
                                                    <Grid item xs={12} md={6} lg={12} p={1}>
                                                        <MDBox mb={1} display="flex" justifyContent="space-around">
                                                            <MDButton
                                                                onClick={() => { confirmOTP() }}
                                                                variant="gradient"
                                                                // color="warning"
                                                                disabled={creating || buttonClicked}
                                                                style={{ backgroundColor: '#65BA0D', color: 'white', width: '90%' }}
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
                                            <Grid container pt={1} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '90%' }}>
                                                <Grid item pt={2} pl={5} pr={5} xs={12} md={12} lg={12} display="flex" justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ textAlign: 'center' }}>
                                                    <MDTypography>Your application has been submitted successfully, our team will get back to you shortly!</MDTypography>
                                                    <MDTypography mt={1}>We have also created your StoxHero trading account, please download the StoxHero App to get started!</MDTypography>
                                                    <MDTypography mt={1} fontSize={20} fontWeight='bold'>Explore the world of Virtual Options Trading by downloading our App!</MDTypography>
                                                </Grid>

                                                <Grid item xs={12} md={12} lg={12} p={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                                    <MDButton component="a" href="https://play.google.com/store/apps/details?id=com.stoxhero.app" target="_blank">
                                                        <img src={playstore} style={{ maxWidth: '40%', maxHeight: '20%', width: 'auto', height: 'auto' }} />
                                                    </MDButton>
                                                </Grid>
                                            </Grid>
                                        }
                                    </MDBox>
                                </MDBox>
                            </Grid>

                        </Grid>
                    </Grid>


                    <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                        <Grid container xs={12} md={12} lg={12} pl={1} pr={1} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                            <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                                <img src={careerpage} style={{ maxWidth: '80%', maxHeight: '80%', width: 'auto', height: 'auto' }} />
                            </MDBox>
                        </Grid>
                    </Grid>

                </Grid>
                {renderSuccessSB}
            </ThemeProvider>
        </MDBox>

    )
}

export default App;
