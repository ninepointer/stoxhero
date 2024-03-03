
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { apiUrl } from "../../../constants/constants.js"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, CircularProgress, Divider, Grid } from '@mui/material';
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox/index.js";
import MDButton from "../../../components/MDButton/index.js";
import MDTypography from "../../../components/MDTypography/index.js";
import { Link } from "react-router-dom";
import moment from 'moment'
import Payment from '../data/payment.js';
import MDSnackbar from "../../../components/MDSnackbar/index.js";


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
                                                <MDBox style={{ maxWidth: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                                    <img src={courses?.courseImage} alt={courses?.courseName} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />

                                                    <MDTypography variant="body1" color='#000000' fontSize={16} fontWeight='bold' display= 'flex' justifyContent= 'flex-start'>
                                                        Course Basic Info
                                                    </MDTypography>

                                                    <MDBox style={{ padding: '10px', textAlign: 'center', marginTop: '10px' }}>
                                                        <MDTypography variant="body1" fontWeight={400}>
                                                            Overview: {courses?.courseOverview}
                                                        </MDTypography>
                                                        <MDTypography variant="body1" fontWeight={400}>
                                                            Type: {courses?.courseType}
                                                        </MDTypography>
                                                        <MDTypography variant="body1" fontWeight={400}>
                                                            Language: {courses?.courseLanguages}
                                                        </MDTypography>
                                                        <MDTypography variant="body1" fontWeight={400}>
                                                            Duration: {courses?.courseDurationInMinutes} minutes
                                                        </MDTypography>
                                                        <MDTypography variant="body1" fontWeight={400}>
                                                            Start Time: {new Date(courses?.courseStartTime).toLocaleString()}
                                                        </MDTypography>
                                                        <MDTypography variant="body1" fontWeight={400}>
                                                            Instructor: {courses?.courseInstructors?.[0]?.about}
                                                        </MDTypography>
                                                        <MDTypography variant="body1" fontWeight={400}>
                                                            Price: ${courses?.coursePrice}
                                                        </MDTypography>
                                                        <MDTypography variant="body1" fontWeight={400}>
                                                            Discounted Price: ${courses?.discountedPrice}
                                                        </MDTypography>
                                                    </MDBox>
                                                </MDBox>
                                            </CardContent>
                                        </Grid>

                                            <Grid item xs={12} md={4} lg={12} p={2} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', maxWidth: '100%', height: 'auto', gap: 5 }}>
                                                <Payment data={courses} setShowPay={setShowPay} showPay={showPay} checkPaid={checkPaid} />
                                            </Grid>
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