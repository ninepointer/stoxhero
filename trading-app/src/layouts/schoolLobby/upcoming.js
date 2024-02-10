import React, { useState, useContext, useEffect } from "react"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import moment from 'moment'
import MDSnackbar from "../../components/MDSnackbar";

// @mui material components
import { Grid, Button } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import { CardActionArea, Divider } from '@mui/material';
import axios from 'axios';
import { apiUrl } from "../../constants/constants";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Registration from './component/register'

function Cover({ setUpdate, update }) {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [update])

    async function fetchData() {
        const data = await axios.get(`${apiUrl}quiz/user`, { withCredentials: true });
        setData(data?.data?.data);
    }

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [color, setColor] = useState('')
    const [icon, setIcon] = useState('')


    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = (value, content, title) => {
        // console.log("Value: ",value)
        if (value === "Success") {
            setTitle(title || "Successfull");
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
            sx={{zIndex: 10}}
        />
    );

    const getDaysBetweenDates = (startDate, endDate) => {
        // Copy the dates to remove the time part
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Calculate the time difference in milliseconds
        const timeDifference = end.getTime() - start.getTime();

        // Convert the time difference to days
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    
    
        // If days difference is 0, calculate hours difference
        if (daysDifference === 0) {
            const hoursDifference = Math.ceil(timeDifference / (1000 * 60 * 60));
            return { daysDifference, hoursDifference };
        }
    
        return {daysDifference};
    };

    return (
        <>
            <Grid mt={2} container xs={10} md={9} lg={9} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ zIndex: 0, overflow: 'visible' }}>
                <Grid p={.5} mb={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: '#D5F47E', borderRadius: 10 }}>
                    {/* <MDBox p={0.5} display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}> */}
                    <MDTypography variant='h6' style={{ fontFamily: 'Work Sans , sans-serif' }}>Upcoming Olympiad(s)</MDTypography>
                    {/* </MDBox> */}
                </Grid>
            </Grid>
            <Grid mb={2} container xs={10} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ zIndex: 0, overflow: 'visible' }} gap={2}>
                {data.length > 0 ?

                    data.map((elem) => {
                        let dayLeft = getDaysBetweenDates(new Date(), elem?.registrationCloseDateTime)
                        // console.log("dayLeft", dayLeft)
                        return (
                            <Grid item xs={12} md={4} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <Card sx={{ minWidth: '100%' }}>
                                        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                            <img src={elem?.image} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                                            <MDTypography variant="h6" fontSize={10} fontFamily='Work Sans , sans-serif' fontWeight={400} style={{ position: 'absolute', top: 0, right: 0, margin: '8px', textAlign: 'center', color: 'black', backgroundColor: "transparent", borderRadius: "15px", border: '1px solid lightgrey', padding: "2px 10px 2px 10px", marginTop: "10px" }}>
                                                {elem?.grade} grade
                                            </MDTypography>
                                            <MDTypography variant="h6" fontSize={10} fontFamily='Work Sans , sans-serif' fontWeight={400} style={{ position: 'absolute', top: 0, left: 0, margin: '8px', textAlign: 'center', color: 'black', backgroundColor: "transparent", borderRadius: "15px", border: '1px solid lightgrey', padding: "2px 10px 2px 10px", marginTop: "10px" }}>
                                                {dayLeft.daysDifference > 0 ? `${dayLeft.daysDifference} days left for registration!` : dayLeft.hoursDifference > 0 ? `${dayLeft.hoursDifference} hours left for registration!` :  'Registration closed!'}
                                            </MDTypography>
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                            <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%' }}>
                                                <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', minHeight: 60 }}>
                                                    <MDTypography variant="h6" fontFamily='Work Sans , sans-serif' style={{ textAlign: 'center' }}>
                                                        {elem?.title}
                                                    </MDTypography>
                                                </MDBox>
                                                <Divider style={{ width: '100%' }} />
                                                <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                                    <MDTypography variant='caption' fontFamily='Work Sans , sans-serif' style={{ textAlign: 'center', color: '#532b9e' }}>
                                                        Olympiad Date: {`${moment.utc(elem?.startDateTime).utcOffset('+05:30').format('DD-MMM-YYYY')} • ${elem.maxParticipant * elem?.noOfSlots - elem?.registrationsCount} seats left`}
                                                    </MDTypography>
                                                </MDBox>
                                            </CardContent>
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                            <CardContent>
                                                <Grid mb={-1} container spacing={1} display='flex' justifyContent='center' xs={12} md={12} lg={12}>
                                                    <Grid item display='flex' justifyContent='center' alignContent={'center'} alignItems={'center'} xs={12} md={12} lg={12}>
                                                        <Registration id={elem?._id} quizData={elem} setData={setData} setUpdate={setUpdate} update={update} />
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Grid>
                                    </Card>
                                </Grid>
                            </Grid>
                        )
                    })

                    :
                    <Grid item xs={12} md={12} lg={9} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                        <MDBox p={0.5} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ minWidth: '100%', borderRadius: 10, border: '1px #D5F47E solid' }}>
                            <MDTypography variant='caption' color='student' style={{ textAlign: 'center', fontFamily: 'Work Sans , sans-serif' }}>No upcoming finance olympiad, keep checking this space!</MDTypography>
                        </MDBox>
                    </Grid>}

                {renderSuccessSB}
            </Grid>


            {renderSuccessSB}
        </>
    );
}

export default Cover;
