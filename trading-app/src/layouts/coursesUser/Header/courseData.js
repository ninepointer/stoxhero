
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


const Courses = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Get the value of the "mobile" parameter
    const courseId = urlParams.get('id');
    const [showPay, setShowPay] = useState();
    const [courses, setCourses] = useState([]);
    const [checkPaid, setCheckPaid] = useState(false);

    useEffect(() => {
        let call1 = axios.get(`${apiUrl}courses/${courseId}`, {
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
                <MDBox mt={3}>
                    <Grid container spacing={4} style={{ backgroundColor: 'dark', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Grid key={courses?._id} item xs={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '100%', height: 'auto' }}>
                            <Grid container xs={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '100%', height: 'auto' }}>
                                <Card
                                    sx={{ minWidth: '100%', cursor: 'pointer' }}
                                
                                >
                                    <CardActionArea>
                                        <Grid item xs={12} md={4} lg={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '100%', height: 'auto' }}>
                                            <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', maxWidth: '100%', height: 'auto' }}>
                                                <MDBox style={{ width: '100%', minHeight: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <MDTypography variant="h5" fontFamily='Segoe UI' fontWeight={400} style={{ textAlign: 'center' }}>
                                                        {courses?.courseName}
                                                    </MDTypography>
                                                </MDBox>
                                                <Divider style={{ width: '100%' }} />
                                                <MDBox style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', marginBottom: '12px', padding: '12px', borderRadius: '16px', boxShadow: "0px 4px 6px -2px rgba(0, 0, 0, 0.5)", width: '100%' }}>
                                                            <MDBox sx={{ display: 'flex', flexDirection: "column" }}>
                                                                <MDBox sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: 5, flexWrap: 'wrap' }}>
                                                                    <Grid
                                                                        container
                                                                        spacing={1}
                                                                        xs={12}
                                                                        md={12}
                                                                        lg={4}
                                                                        display="flex"
                                                                        justifyContent={
                                                                            isMobile ? "center" : "center"
                                                                        }
                                                                        alignContent="center"
                                                                        alignItems={
                                                                            isMobile ? "center" : "flex-start"
                                                                        }
                                                                    >
                                                                        <img src={courses.courseImage} style={{ height: '200px', width: '350' }} />
                                                                    </Grid>
                                                                    <Grid
                                                                        container
                                                                        spacing={1}
                                                                        xs={12}
                                                                        md={12}
                                                                        lg={4}
                                                                        display="flex"
                                                                        justifyContent={
                                                                            isMobile ? "center" : "center"
                                                                        }
                                                                        alignContent="center"
                                                                        alignItems={
                                                                            isMobile ? "center" : "flex-start"
                                                                        }
                                                                    >
                                                                        <video src={courses.salesVideo} style={{ height: '200px', width: '350px' }} controls />
                                                                    </Grid>
                                                                    <Grid
                                                                        container
                                                                        spacing={1}
                                                                        xs={12}
                                                                        md={12}
                                                                        lg={2}
                                                                        display="flex"
                                                                        justifyContent={
                                                                            isMobile ? "center" : "center"
                                                                        }
                                                                        alignContent="center"
                                                                        alignItems={
                                                                            isMobile ? "center" : "flex-start"
                                                                        }
                                                                    >
                                                                        <Grid
                                                                            item
                                                                            xs={12}
                                                                            md={12}
                                                                            lg={12}
                                                                            display="flex"
                                                                            justifyContent={
                                                                                isMobile ? "center" : "center"
                                                                            }
                                                                            alignContent="center"
                                                                            alignItems={
                                                                                isMobile ? "center" : "center"
                                                                            }
                                                                        >
                                                                            <Payment data={courses} setShowPay={setShowPay} showPay={showPay} checkPaid={checkPaid} />
                                                                        </Grid>
                                                                      
                                                                        <Grid
                                                                            item
                                                                            xs={12}
                                                                            md={12}
                                                                            lg={12}
                                                                            display="flex"
                                                                            justifyContent={
                                                                                isMobile ? "center" : "center"
                                                                            }
                                                                            alignContent="center"
                                                                            alignItems={
                                                                                isMobile ? "center" : "center"
                                                                            }
                                                                        >
                                                                            <MDTypography
                                                                                variant="body1"
                                                                                fontWeight="bold"
                                                                            >
                                                                                ₹
                                                                                {new Intl.NumberFormat(
                                                                                    undefined,
                                                                                    {
                                                                                        minimumFractionDigits: 0,
                                                                                        maximumFractionDigits: 0,
                                                                                    }
                                                                                ).format(courses?.discountedPrice)}
                                                                            </MDTypography>
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={12}
                                                                            md={12}
                                                                            lg={12}
                                                                            display="flex"
                                                                            justifyContent={
                                                                                isMobile ? "center" : "center"
                                                                            }
                                                                            alignContent="center"
                                                                            alignItems={
                                                                                isMobile ? "center" : "center"
                                                                            }
                                                                        >
                                                                            <MDTypography
                                                                                variant="body2"
                                                                                fontWeight="normal"
                                                                                style={{
                                                                                    textDecoration:
                                                                                        "line-through",
                                                                                }}
                                                                            >
                                                                                ₹
                                                                                {new Intl.NumberFormat(
                                                                                    undefined,
                                                                                    {
                                                                                        minimumFractionDigits: 0,
                                                                                        maximumFractionDigits: 0,
                                                                                    }
                                                                                ).format(courses?.coursePrice)}
                                                                            </MDTypography>
                                                                        </Grid>
                                                                    </Grid>
                                                                </MDBox>

                                                                <MDTypography style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 800, color: '#000000', paddingLeft: isMobile ? '20px' : '0px' }} >Course Basic Details</MDTypography>
                                                                <MDBox style={{paddingLeft: isMobile ? '20px' : '0px'}}> 
                                                                    <MDBox sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row' }}>
                                                                        <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Name: <span style={{ fontWeight: 600 }}>{`${courses.courseName}`}</span></MDTypography>
                                                                        <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Language: <span style={{ fontWeight: 600 }}>{`${courses?.courseLanguages}`}</span></MDTypography>
                                                                        <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Duration: <span style={{ fontWeight: 600 }}>{`${courses?.courseDurationInMinutes} min`}</span></MDTypography>
                                                                        {/* <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Max Enrollments: <span style={{ fontWeight: 600 }}>{`${courses?.maxEnrolments}`}</span></MDTypography> */}
                                                                    </MDBox>

                                                                    <MDBox sx={{ display: 'flex', justifyContent: 'space-between' , flexDirection: isMobile ? 'column' : 'row' }}>
                                                                        <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Type: <span style={{ fontWeight: 600 }}>{`${courses.type}`}</span></MDTypography>
                                                                        <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Course Type: <span style={{ fontWeight: 600 }}>{`${courses?.courseType}`}</span></MDTypography>
                                                                        <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Course Category: <span style={{ fontWeight: 600 }}>{`${courses?.category}`}</span></MDTypography>
                                                                        <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Level: <span style={{ fontWeight: 600 }}>{`${courses?.level}`}</span></MDTypography>
                                                                    </MDBox>

                                                                    {(courses.courseStartTime || courses.courseEndTime) &&
                                                                        <MDBox sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row' }}>
                                                                            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Registration Starts: <span style={{ fontWeight: 600 }}>{`${moment(courses?.registrationStartTime).format('DD-MM-YY hh:mm a')}`}</span></MDTypography>
                                                                            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Registration Ends: <span style={{ fontWeight: 600 }}>{`${moment(courses?.registrationEndTime).format('DD-MM-YY hh:mm a')}`}</span></MDTypography>
                                                                            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Course Starts: <span style={{ fontWeight: 600 }}>{`${moment(courses?.courseStartTime).format('DD-MM-YY hh:mm a')}`}</span></MDTypography>
                                                                            <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Course Ends: <span style={{ fontWeight: 600 }}>{`${moment(courses?.courseEndTime).format('DD-MM-YY hh:mm a')}`}</span></MDTypography>
                                                                        </MDBox>
                                                                    }

                                                                    <MDBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Course Overview: <span style={{ fontWeight: 600 }}>{`${courses.courseOverview}`}</span></MDTypography>
                                                                    </MDBox>
                                                                </MDBox>

                                                                <MDTypography style={{ fontSize: '14px', marginBottom: '5px', fontWeight: 800, color: '#000000', paddingLeft: isMobile ? '20px' : '0px' }} >Course Description</MDTypography>
                                                                <MDBox style={{ maxWidth: '100%', width: '100%', height: 'auto', paddingLeft: isMobile ? '20px' : '0px' }}>
                                                                    <div dangerouslySetInnerHTML={{ __html: courses?.courseDescription }} />
                                                                </MDBox>

                                                                <MDTypography style={{ fontSize: '14px', marginTop: '8px', marginBottom: '2px', fontWeight: 800, color: '#000000', paddingLeft: isMobile ? '20px' : '0px' }} >Pricing Details</MDTypography>
                                                                <MDBox sx={{ display: 'flex', justifyContent: 'center', flexDirection: "column", paddingLeft: isMobile ? '20px' : '0px' }}>
                                                                    <MDBox sx={{ display: 'flex', gap: isMobile ? 0 : 5, flexDirection: isMobile ? 'column' : 'row' }}>
                                                                        <MDTypography style={{ fontSize: '14px', marginBottom: '2px' }} >Actual Price: <span style={{ fontWeight: 600 }}>₹{
                                                                            new Intl.NumberFormat(undefined, {
                                                                                minimumFractionDigits: 0,
                                                                                maximumFractionDigits: 0,
                                                                            }).format(courses?.coursePrice)
                                                                        }</span></MDTypography>
                                                                        <MDTypography style={{ fontSize: '14px', marginBottom: '2px' }} >Discounted Price: <span style={{ fontWeight: 600 }}>₹{`${new Intl.NumberFormat(undefined, {
                                                                            minimumFractionDigits: 0,
                                                                            maximumFractionDigits: 0,
                                                                        }).format(courses?.discountedPrice)
                                                                            }`}</span></MDTypography>
                                                                        
                                                                    </MDBox>
                                                                </MDBox>

                                                                <MDTypography style={{ fontSize: '14px', margin: '8px 0px 2px 0px', fontWeight: 800, color: '#000000', paddingLeft: isMobile ? '20px' : '0px' }} >Instructor Details</MDTypography>
                                                                <MDBox sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', paddingLeft: isMobile ? '20px' : '0px' }}>
                                                                    {courses?.courseInstructors?.map((courses) => {
                                                                        return (
                                                                            <MDBox sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                                                                                 <MDBox>
                                                                                    <img src={courses?.image} alt="image" style={{ height: '90px', width: '90px', paddingLeft: isMobile ? '0px' : '0px', borderRadius: '50%' }} />
                                                                                </MDBox>
                                                                                <MDBox>
                                                                                    <MDTypography style={{ fontSize: '14px', marginBottom: '2px' }} >Instructor Name: <span style={{ fontWeight: 600 }}>{`${courses?.id?.first_name + " " + courses?.id?.last_name}`}</span></MDTypography>
                                                                                    <MDTypography style={{ fontSize: '14px', marginBottom: '2px' }} >About Instructor: <span style={{ fontWeight: 600 }}>{`${courses?.about}`}</span></MDTypography>
                                                                                </MDBox>
                                                                            </MDBox>
                                                                        )
                                                                    })}

                                                                </MDBox>

                                                                <MDTypography style={{ fontSize: '14px', margin: '2px 0px 0px 0px', fontWeight: 800, color: '#000000', paddingLeft: isMobile ? '20px' : '0px' }} >Course Topics</MDTypography>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', paddingLeft: isMobile ? '20px' : '0px' }}>
                                                                    {courses?.courseContent?.map((courses) => (
                                                                        <Box key={courses._id} sx={{ margin: '2px' }}>
                                                                            <Typography style={{ fontSize: '16px' }}> <span>{courses?.order}.</span> {courses?.topic}</Typography>
                                                                            <ul style={{ marginLeft: "30px" }}>
                                                                                {courses?.subtopics?.map((item, index) => (
                                                                                    <li key={index}>
                                                                                        <Typography style={{ fontSize: '14px', marginBottom: '1px' }}> {item?.topic}</Typography>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </Box>
                                                                    ))}
                                                                </Box>

                                                                <MDTypography style={{ fontSize: '14px', margin: '8px 0px 2px 0px', fontWeight: 800, color: '#000000', paddingLeft: isMobile ? '20px' : '0px' }} >Course Benefits</MDTypography>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', paddingLeft: isMobile ? '20px' : '0px' }}>
                                                                    {courses?.courseBenefits?.map((courses) => (
                                                                        <Box key={courses._id} sx={{ margin: '2px' }}>
                                                                            <Typography style={{ fontSize: '16px', marginBottom: '2px' }}> <span>{courses?.order}.</span> {courses?.benefits}</Typography>
                                                                        </Box>
                                                                    ))}
                                                                </Box>

                                                                <MDTypography style={{ fontSize: '14px', margin: '8px 0px 2px 0px', fontWeight: 800, color: '#000000', paddingLeft: isMobile ? '20px' : '0px' }} >FAQ's</MDTypography>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', paddingLeft: isMobile ? '20px' : '0px' }}>
                                                                    {courses?.faqs?.map((courses) => (
                                                                        <Box key={courses._id} sx={{ margin: '2px' }}>
                                                                            <Typography style={{ fontSize: '16px', marginBottom: '2px' }}> <span style={{fontWeight: 500}} >{"Question"} : </span> {courses?.question}</Typography>
                                                                            <Typography style={{ fontSize: '16px', marginBottom: '2px' }}> <span style={{fontWeight: 500}} >{"Answer"} : </span> {courses?.answer}</Typography>
                                                                        </Box>
                                                                    ))}
                                                                </Box>
                                                            </MDBox>

                                                        </MDBox>
                                            </CardContent>
                                        </Grid>

                                            {/* <Grid item xs={12} md={4} lg={12} p={2} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', maxWidth: '100%', height: 'auto', gap: 5 }}>
                                                <Payment data={courses} setShowPay={setShowPay} showPay={showPay} checkPaid={checkPaid} />
                                            </Grid> */}
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </MDBox>
                :
                <Grid container spacing={1} xs={12} md={6} lg={12}>
                    <Grid item mt={2} xs={6} md={3} lg={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress color='dark' />
                    </Grid>
                </Grid>
            }

            {renderSuccessSB}
            {renderErrorSB}
        </>

    )
}



export default Courses;