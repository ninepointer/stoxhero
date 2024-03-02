import React, { useEffect, useState, useContext } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, Divider, Grid } from '@mui/material';
import axios from "axios";
import { apiUrl } from "../../../../constants/constants.js"
import MDBox from '../../../../components/MDBox/index.js'
import MDButton from '../../../../components/MDButton/index.js';
import { ThemeProvider } from 'styled-components';
import Navbar from '../../components/Navbars/Navbar.jsx';
import theme from '../../utils/theme/index';
import MDTypography from '../../../../components/MDTypography/index.js';
import Footer from '../../../authentication/components/Footer/index.js'
import moment from 'moment'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { CircularProgress } from '@mui/material';
import NoData from "../../../../assets/images/noBlogFound.png"
import PaymentIcon from '@mui/icons-material/Payment';
import Groups2Icon from '@mui/icons-material/Groups2';
import { Link, useNavigate } from 'react-router-dom'
import Payment from '../../../coursesUser/data/payment.js'



export default function Courses() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const [showPay, setShowPay] = useState()

    // Get the value of the "mobile" parameter
    const courseSlug = urlParams.get('course');
    const userId = urlParams.get('id');

    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    const slug = window.location.pathname.split('/')[2]
    const [checkPaid, setCheckPaid] = useState(false);


    useEffect(() => {
        let call1 = axios.get(`${apiUrl}courses/user/${courseSlug}/slug`, {
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

    return (
        <>
            <MDBox mt={5} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ backgroundColor: 'white', minHeight: '100%', height: 'auto', width: 'auto', maxWidth: '100%', minHeight: "80vh" }}>
                <ThemeProvider theme={theme}>
                    <Navbar />
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
                                                    {userId ?
                                                        <Payment data={courses} showPay={showPay} setShowPay={setShowPay} checkPaid={checkPaid} />
                                                        :
                                                        <MDButton
                                                            variant='gradient'
                                                            color='error'
                                                            size='small'
                                                            disabled={checkPaid}
                                                            onClick={() => { navigate(`/courses/${slug}/fill+details?course=${courseSlug}`) }}>
                                                            Pay
                                                        </MDButton>}
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
                </ThemeProvider>
            </MDBox>

            <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-end' >
                <Footer />
            </MDBox>
        </>
    );
}