
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { apiUrl } from "../../../constants/constants.js"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, CircularProgress, Divider, Grid, Box, Typography } from '@mui/material';
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox/index.js";
import MDButton from "../../../components/MDButton/index.js";
import MDTypography from "../../../components/MDTypography/index.js";
import { Link } from "react-router-dom";
import moment from 'moment'
import Payment from '../data/payment.js';
import MDSnackbar from "../../../components/MDSnackbar/index.js";
import { useMediaQuery } from "@mui/material";
import theme from "../../HomePage/utils/theme/index";

import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Button from '@mui/material/Button';
// import { ModeStandby } from '@mui/icons-material';
import LanguageIcon from '@mui/icons-material/Language';
import CategoryIcon from '@mui/icons-material/Category';
import DvrIcon from '@mui/icons-material/Dvr';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import { SiOpslevel } from "react-icons/si";
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import Accordion from '@mui/material/Accordion';



const Courses = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Get the value of the "mobile" parameter
    const courseId = urlParams.get('id');
    const [showPay, setShowPay] = useState();
    const [courses, setCourses] = useState([]);
    const [checkPaid, setCheckPaid] = useState(false);

    useEffect(() => {
        let call1 = axios.get(`${apiUrl}courses/user/${courseId}`, {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        })
        Promise.all([call1])
            .then(([api1Response]) => {
                // Process the responses here
                setCourses(api1Response.data.data)

            })
            .catch((error) => {
                // Handle errors here
                console.error(error);
            });
    }, [])

    useEffect(() => {
        checkPaidFunc();
    }, [showPay, courses])

    async function checkPaidFunc() {
        const check = await axios.get(`${apiUrl}courses/user/${courses?._id}/checkpaid`, { withCredentials: true })
        setCheckPaid(check.data.data);
    }


    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = (title, content) => {
        setTitle(title)
        setContent(content)
        setSuccessSB(true);
    }
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
            bgWhite="info"
        />
    );

    const [errorSB, setErrorSB] = useState(false);
    const openErrorSB = (title, content) => {
        setTitle(title)
        setContent(content)
        setErrorSB(true);
    }
    const closeErrorSB = () => setErrorSB(false);

    const renderErrorSB = (
        <MDSnackbar
            color="error"
            icon="warning"
            title={title}
            content={content}
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );

    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

    return (
        <>
            {courses ?
                <>
                    <MDBox mt={10} p={3} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ minWidth: '100%', backgroundColor: '#343434' }}>
                        <Grid container spacing={5} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ maxWidth: '90%' }}>
                            <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='flex-start' alignContent='flex-start' alignItems='flex-start'>
                                <Grid container spacing={2} xs={12} md={12} lg={6} display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start' style={{ minWidth: '100%' }}>
                                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='flex-start' alignItems='flex-start'>
                                        <MDTypography variant='h3' color='light'>{courses?.courseName}</MDTypography>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <MDTypography variant='body3' fontSize={15} color='light'>{courses?.courseOverview}</MDTypography>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center'>

                                        {courses?.courseInstructors?.map((courses) => {
                                            return (
                                                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' flexDirection='row'>
                                                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignItems='flex-start' alignContent='flex-start' flexDirection='row'>
                                                        <img src={courses?.image} alt="something here" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />&nbsp;
                                                        <MDTypography color='light'>{`${courses?.id?.first_name + " " + courses?.id?.last_name}`}</MDTypography>
                                                    </Grid>
                                                    {/* <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignItems='center' alignContent='center' flexDirection='row'>
                                                        <MDTypography color='light'>Created By:</MDTypography>
                                                        <MDTypography color='light'>{`${courses?.id?.first_name + " " + courses?.id?.last_name}`}</MDTypography>
                                                    </Grid> */}
                                                </Grid>
                                            )
                                        })}

                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='space-between' alignContent='center' alignItems='center' flexWrap='wrap'>
                                        <MDBox display='flex' alignItems='center' alignContent='center' gap={0.5} mr={1}>
                                            <LanguageIcon color='white' />
                                            <MDTypography variant='body3' fontSize={15} color='light' >{`${courses?.courseLanguages}`}</MDTypography>
                                        </MDBox>
                                        <MDBox display='flex' alignItems='center' alignContent='center' gap={0.5} mr={1}>
                                            <CategoryIcon color='white' />
                                            <MDTypography variant='body3' fontSize={15} color='light' >{`${courses?.category}`}</MDTypography>
                                        </MDBox>
                                        <MDBox display='flex' alignItems='center' alignContent='center' gap={0.5} mr={1}>
                                            <SiOpslevel color='white' />
                                            <MDTypography variant='body3' fontSize={15} color='light' >{`${courses?.level}`}</MDTypography>
                                        </MDBox>
                                        <MDBox display='flex' alignItems='center' alignContent='center' gap={0.5} mr={1}>
                                            <AvTimerIcon color='white' />
                                            <MDTypography variant='body3' fontSize={15} color='light' >{`${(courses?.courseDurationInMinutes / 60).toFixed(0)} hours`}</MDTypography>
                                        </MDBox>
                                        <MDBox display='flex' alignItems='center' alignContent='center' gap={0.5} mr={1}>
                                            <DvrIcon color='white' />
                                            <MDTypography variant='body3' fontSize={15} color='light' >{`${courses?.courseType}`}</MDTypography>
                                        </MDBox>
                                    </Grid>
                                    <Grid gap={2} item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center'>

                                        {courses?.discountedPrice !== 0 &&
                                            <>
                                                <MDTypography variant='body3' color='light' style={{ textDecoration: 'line-through' }}>
                                                    ₹{new Intl.NumberFormat(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 0,
                                                            maximumFractionDigits: 0,
                                                        }
                                                    ).format(courses?.coursePrice)}/-
                                                </MDTypography>
                                                <MDTypography variant='body3' color='light'>
                                                    ₹{new Intl.NumberFormat(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 0,
                                                            maximumFractionDigits: 0,
                                                        }
                                                    ).format(courses?.discountedPrice)}/-
                                                </MDTypography>
                                            </>
                                        }

                                        <MDTypography variant='body3' color='light' style={{ maxWidth: '50%' }}>
                                            <Payment data={courses} setShowPay={setShowPay} showPay={showPay} checkPaid={checkPaid} workshop={courses?.type==='Workshop' ? true : false} />
                                        </MDTypography>
                                    </Grid>

                                    <Grid container justifyContent='flex-start' mt={3}>
                                        <Grid item xs={12} md={12} lg={12} pl={3}>
                                            {courses?.courseType === 'Live' && (
                                                <Grid container justifyContent='flex-start' alignItems='center' spacing={2}>
                                                    <Grid >
                                                        <MDTypography variant='body3' color='light' fontSize={isMobile ? '12.5px' : '18px'}>
                                                          👨‍👨‍👦 {`Max Enrollments : ${courses?.maxEnrolments}`}
                                                        </MDTypography>
                                                    </Grid>
                                                    <Grid >
                                                        <MDTypography variant='body3' color='light' fontSize={isMobile ? '12.5px' : '18px'}>
                                                            🕑 {`Registration End : ${moment(courses?.registrationEndTime).format('DD MMM hh:mm a')}`}
                                                        </MDTypography>
                                                    </Grid>
                                                    <Grid >
                                                        <MDTypography variant='body3' color='light' fontSize={isMobile ? '12.5px' : '18px'}>
                                                            🕑 {`${courses?.type === 'Workshop' ? 'Workshop' : 'Course'} Start : ${moment(courses?.courseStartTime).format('DD MMM hh:mm a')}`}
                                                        </MDTypography>
                                                    </Grid>
                                                    <Grid >
                                                        <MDTypography variant='body3' color='light' fontSize={isMobile ? '12.5px' : '18px'}>
                                                            🕑 {`${courses?.type === 'Workshop' ? 'Workshop' : 'Course'} End : ${moment(courses?.courseEndTime).format('DD MMM hh:mm a')}`}
                                                        </MDTypography>
                                                    </Grid>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Grid>



                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                <video src={courses.salesVideo} style={{ width: '100%', height: 'auto' }} controls />
                            </Grid>
                        </Grid>
                    </MDBox>
                    <MDBox p={3} display='flex' justifyContent='center' alignContent='flex-start' alignItems='flex-start' style={{ minWidth: '100%', backgroundColor: 'white' }}>
                        <Grid container spacing={5} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='flex-start' alignItems='flex-start' style={{ maxWidth: '90%' }}>
                            <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignContent='flex-start' alignItems='flex-start'>
                                <Grid container mt={5} p={3} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start' style={{ border: '1px solid lightgrey', borderRadius: 5 }}>
                                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='flex-start' alignItems='flex-start'>
                                        <MDTypography variant='h3' fontSize={20} color='dark'>{`About the ${courses?.type === 'Workshop' ? 'workshop' : 'course'}`}</MDTypography>
                                    </Grid>
                                    <Grid item mt={2} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                        <div dangerouslySetInnerHTML={{ __html: courses?.courseDescription }} style={{ fontFamily: 'Work Sans , sans-serif' }} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center' alignContent='flex-start' alignItems='flex-start'>
                                <Grid container spacing={1} mt={5} p={0} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='flex-start' alignItems='flex-start'>
                                    {courses?.type !== 'Workshop' ?
                                        <>
                                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='flex-start' alignItems='flex-start' style={{ width: '100%' }}>
                                                <MDTypography variant='h3' fontSize={20} color='dark'>{`${courses?.type === 'Workshop' ? 'Workshop' : 'Course'} Content`}</MDTypography>
                                            </Grid>
                                            <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='flex-start' alignItems='flex-start' style={{ width: '100%' }}>

                                                <div style={{ width: '100%' }}>
                                                    {courses?.courseContent?.map((courses) => (
                                                        <Accordion>
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                aria-controls="panel1-content"
                                                                id="panel1-header"
                                                            >
                                                                <MDBox display='flex' justifyContent='center' flexDirection='row' alignItems='center' gap={2}>
                                                                    <MDTypography variant='body3' fontSize={20} fontWeight={600}>{courses?.order}. {courses?.topic}</MDTypography>
                                                                    <MDTypography variant='caption'>{courses?.subtopics?.length} lecture(s)</MDTypography>
                                                                </MDBox>
                                                            </AccordionSummary>
                                                            {courses?.subtopics?.map((item, index, duration) => (
                                                                <AccordionDetails style={{ marginLeft: 25 }}>
                                                                    <MDTypography variant='caption' fontSize={15}>{courses?.order}.{item?.order} {item?.topic}</MDTypography>
                                                                </AccordionDetails>
                                                            ))}
                                                        </Accordion>
                                                    ))}
                                                </div>

                                            </Grid>
                                        </>
                                        :
                                        <></>
                                    }
                                    <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='flex-start' alignItems='flex-start' style={{ width: '100%' }}>
                                        <MDTypography variant='h3' fontSize={20} color='dark'>{`${courses?.type === 'Workshop' ? 'Workshop' : 'Course'} Benefits`}</MDTypography>
                                    </Grid>
                                    <Grid item mt={1} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='flex-start' alignItems='flex-start' style={{ width: '100%' }}>

                                        <div style={{ width: '100%' }}>
                                            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='flex-start' alignItems='flex-start' style={{ width: '100%' }}>
                                                {courses?.courseBenefits?.map((courses) => (

                                                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='flex-start' alignItems='flex-start' style={{ width: '100%' }}>
                                                        <MDBox display='flex' justifyContent='center' flexDirection='row' alignItems='center' gap={2}>
                                                            <CandlestickChartIcon />
                                                            <MDTypography variant='body3' fontSize={20} fontWeight={600} color='dark'>{courses?.benefits}</MDTypography>
                                                        </MDBox>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </div>

                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </MDBox>
                </>
                :
                <>
                    <Grid container spacing={1} xs={12} md={6} lg={12}>
                        <Grid item mt={2} xs={6} md={3} lg={12} style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress color='dark' />
                        </Grid>
                    </Grid>
                </>
            }
        </>
    )
}



export default Courses;