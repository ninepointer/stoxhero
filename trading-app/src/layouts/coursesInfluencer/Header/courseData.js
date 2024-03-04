
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { apiUrl } from "../../../constants/constants.js"
import { Card, Box, Typography } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, CircularProgress, Divider, Grid } from '@mui/material';
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import { Link } from "react-router-dom";
import moment from 'moment'
import SuggestModal from '../data/suggestModal.js';
import MDSnackbar from "../../../components/MDSnackbar";
import EnrolledUser from '../data/enrolledUsers.js'

const Courses = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Get the value of the "mobile" parameter
    const courseId = urlParams.get('id');

    const [courses, setCourses] = useState([]);
    const [buttonClicked, setButtonClicked] = useState(false);

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

    const sendAdminApproval = async () => {
        try {
            const data = await axios.get(`${apiUrl}courses/${courseId}/adminapproval`, { withCredentials: true });
            openSuccessSB('Approval Request Sent', '');
            setButtonClicked(true)
        } catch (err) {
            openErrorSB('Error', 'Something went wrong')
        }

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


    return (
        <>
            {courses ?
                <MDBox mt={3}>
                    <Grid container spacing={4} style={{ backgroundColor: 'dark', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Grid key={courses?._id} item xs={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '100%', height: 'auto' }}>
                            <Grid container xs={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '100%', height: 'auto' }}>
                                <Card
                                    sx={{ minWidth: '100%', cursor: 'pointer' }}
                                    component={Link}
                                    to={{
                                        pathname: `/coursedata`,
                                        search: `?id=${courses?._id}`,
                                        state: { data: courses }
                                    }}
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
                                                        <MDBox sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: 5 }}>
                                                            <img src={courses.courseImage} style={{ height: '200px', width: '350' }} />
                                                            <video src={courses.salesVideo} style={{ height: '200px', width: '350px' }} controls />

                                                        </MDBox>

                                                        <MDTypography style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 800, color: '#000000' }} >Course Basic Details</MDTypography>
                                                        <MDBox>
                                                            <MDBox sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                                                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Name: <span style={{ fontWeight: 600 }}>{`${courses.courseName}`}</span></MDTypography>
                                                                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Language: <span style={{ fontWeight: 600 }}>{`${courses?.courseLanguages}`}</span></MDTypography>
                                                                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Duration: <span style={{ fontWeight: 600 }}>{`${courses?.courseDurationInMinutes} min`}</span></MDTypography>
                                                                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Max Enrollments: <span style={{ fontWeight: 600 }}>{`${courses?.maxEnrolments || 'N/A'}`}</span></MDTypography>
                                                            </MDBox>

                                                            <MDBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Type: <span style={{ fontWeight: 600 }}>{`${courses.type}`}</span></MDTypography>
                                                                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Course Type: <span style={{ fontWeight: 600 }}>{`${courses?.courseType}`}</span></MDTypography>
                                                                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Course Category: <span style={{ fontWeight: 600 }}>{`${courses?.category}`}</span></MDTypography>
                                                                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Level: <span style={{ fontWeight: 600 }}>{`${courses?.level}`}</span></MDTypography>
                                                            </MDBox>

                                                            {(courses.courseStartTime || courses.courseEndTime) &&
                                                                <MDBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
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

                                                        <MDTypography style={{ fontSize: '14px', marginBottom: '2px', fontWeight: 800, color: '#000000' }} >Course Description</MDTypography>
                                                        <MDBox style={{ maxWidth: '100%', width: '100%', height: 'auto' }}>
                                                            <div dangerouslySetInnerHTML={{ __html: courses?.courseDescription }} />
                                                        </MDBox>

                                                        <MDTypography style={{ fontSize: '14px', marginTop: '5px', marginBottom: '2px', fontWeight: 800, color: '#000000' }} >Pricing Details</MDTypography>
                                                        <MDBox sx={{ display: 'flex', justifyContent: 'center', flexDirection: "column" }}>
                                                            <MDBox sx={{ display: 'flex', gap: 5 }}>
                                                                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Actual Price : <span style={{ fontWeight: 600 }}>₹{
                                                                    new Intl.NumberFormat(undefined, {
                                                                        minimumFractionDigits: 0,
                                                                        maximumFractionDigits: 0,
                                                                    }).format(courses?.coursePrice)}</span></MDTypography>
                                                                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Discounted Price : <span style={{ fontWeight: 600 }}>₹{
                                                                    new Intl.NumberFormat(undefined, {
                                                                        minimumFractionDigits: 0,
                                                                        maximumFractionDigits: 0,
                                                                    }).format(courses?.discountedPrice)}</span></MDTypography>
                                                                <MDTypography style={{ fontSize: '14px', marginBottom: '12px' }} >Commission : <span style={{ fontWeight: 600 }}>{`${courses?.commissionPercentage}`}%</span></MDTypography>
                                                            </MDBox>
                                                        </MDBox>

                                                        <MDTypography style={{ fontSize: '14px', margin: '2px 0px 2px 0px', fontWeight: 800, color: '#000000' }} >Instructor Details</MDTypography>
                                                        <MDBox sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                                                            {courses?.courseInstructors?.map((elem) => {
                                                                return (
                                                                    <MDBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <MDBox>
                                                                            <MDTypography style={{ fontSize: '14px', marginBottom: '2px' }} >Instructor Name: <span style={{ fontWeight: 600 }}>{`${elem?.id?.first_name + " " + elem?.id?.last_name}`}</span></MDTypography>
                                                                            <MDTypography style={{ fontSize: '14px', marginBottom: '2px' }} >About Instructor: <span style={{ fontWeight: 600 }}>{`${elem?.about}`}</span></MDTypography>
                                                                        </MDBox>
                                                                        <MDBox>
                                                                            <img src={elem?.image} alt="image" style={{ height: '70px', width: '70px' }} />
                                                                        </MDBox>
                                                                    </MDBox>
                                                                )
                                                            })}

                                                        </MDBox>

                                                        <MDTypography style={{ fontSize: '14px', margin: '2px 0px 0px 0px', fontWeight: 800, color: '#000000' }} >Course Topics</MDTypography>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                                                            {courses?.courseContent?.map((elem) => (
                                                                <Box key={elem._id} sx={{ margin: '2px' }}>
                                                                    <Typography style={{ fontSize: '16px' }}> <span>{elem?.order}.</span> {elem?.topic}</Typography>
                                                                    <ul style={{ marginLeft: "30px" }}>
                                                                        {elem?.subtopics?.map((item, index) => (
                                                                            <li key={index}>
                                                                                <Typography style={{ fontSize: '14px', marginBottom: '1px' }}> {item?.topic}</Typography>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </Box>
                                                            ))}
                                                        </Box>

                                                        <MDTypography style={{ fontSize: '14px', margin: '2px 0px 2px 0px', fontWeight: 800, color: '#000000' }} >Course Benefits</MDTypography>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                                                            {courses?.courseBenefits?.map((elem) => (
                                                                <Box key={elem._id} sx={{ margin: '2px' }}>
                                                                    <Typography style={{ fontSize: '16px', marginBottom: '2px' }}> <span>{elem?.order}.</span> {elem?.benefits}</Typography>
                                                                </Box>
                                                            ))}
                                                        </Box>

                                                        <MDTypography style={{ fontSize: '14px', margin: '2px 0px 2px 0px', fontWeight: 800, color: '#000000' }} >FAQ's</MDTypography>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                                                            {courses?.faqs?.map((elem) => (
                                                                <Box key={elem._id} sx={{ margin: '2px' }}>
                                                                    <Typography style={{ fontSize: '16px', marginBottom: '2px' }}> <span>{"Question"} : </span> {elem?.question}</Typography>
                                                                    <Typography style={{ fontSize: '16px', marginBottom: '2px' }}> <span>{"Answer"} : </span> {elem?.answer}</Typography>
                                                                </Box>
                                                            ))}
                                                        </Box>

                                                        {courses?.suggestChanges?.length ?
                                                            <>
                                                                <MDTypography style={{ fontSize: '14px', margin: '2px 0px 2px 0px', fontWeight: 800, color: '#000000' }} >Changes</MDTypography>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    {courses?.suggestChanges?.map((elem, index) => (
                                                                        <Box key={index} sx={{ margin: '2px' }}>
                                                                            <Typography style={{ fontSize: '16px', marginBottom: '2px' }}> {elem}</Typography>
                                                                        </Box>
                                                                    ))}
                                                                </Box>
                                                            </>
                                                            :
                                                            <></>
                                                        }
                                                    </MDBox>

                                                </MDBox>
                                            </CardContent>
                                        </Grid>

                                        {((courses?.status === 'Sent To Creator') && !buttonClicked) &&
                                            <Grid item xs={12} md={4} lg={12} p={2} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', maxWidth: '100%', height: 'auto', gap: 5 }}>
                                                <MDButton
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={sendAdminApproval}
                                                >
                                                    Proceed
                                                </MDButton>

                                                <SuggestModal id={courseId} />
                                            </Grid>}

                                        {(courses?.status === 'Published') &&
                                            <EnrolledUser courses={courses} />
                                        }
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