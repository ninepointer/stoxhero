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

    function handleCopyClick() {
        const textarea = document.createElement('textarea');
        textarea.value = "https://www.stoxhero.com/finowledge";
        document.body.appendChild(textarea);

        // Select the text in the textarea
        textarea.select();
        document.execCommand('copy');

        // Remove the temporary textarea
        document.body.removeChild(textarea);
        openSuccessSB("Success", "Share this link with your friends.", "Link Copied")
    };

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
        />
    );

    function joinGroup() {
        window.open('https://chat.whatsapp.com/Bcjt7NbDTyz1odeF8RDtih', '_blank');
    }

    return (
        <>
            <Grid mt={2} container xs={10} md={9} lg={9} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ zIndex: 1, overflow: 'visible' }}>
                <Grid p={.5} mb={2} item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: '#D5F47E', borderRadius: 10 }}>
                    {/* <MDBox p={0.5} display='flex' justifyContent='center' alignItems='center' style={{overflow: 'visible'}}> */}
                    <MDTypography variant='body2' style={{ fontFamily: 'Work Sans , sans-serif' }}>Upcoming Olympiad(s)</MDTypography>
                    {/* </MDBox> */}
                </Grid>
            </Grid>
            <Grid mb={2} container xs={10} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ zIndex: 10, overflow: 'visible' }} gap={2}>
                {data.length > 0 ?

                    data.map((elem) => {

                        return (
                            <Grid key={elem?._id} item xs={12} md={12} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' >
                                {/* <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'> */}
                                <Card
                                    sx={{ cursor: 'pointer' }}
                                // onClick={() => { handleOpenNewTab(elem) }}
                                >
                                    <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center'
                                    // style={{ maxWidth: '100%', height: 'auto' }}
                                    >
                                        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'
                                        // style={{ maxWidth: '100%', height: 'auto' }}
                                        >
                                            <img src={elem?.image} style={{
                                                width: '110%', height: 'auto',
                                                borderTopLeftRadius: 10, borderTopRightRadius: 10
                                            }} />
                                        </Grid>
                                        <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', minHeight: 60 }}>
                                            <MDTypography variant="h5" fontFamily='Work Sans , sans-serif' fontWeight={400} style={{ textAlign: 'center' }}>
                                                {elem?.title}
                                            </MDTypography>
                                        </MDBox>
                                        {/* <Divider style={{ width: '100%' }} /> */}
                                        <MDBox mb={1} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                            <MDTypography variant='caption' style={{ fontFamily: 'Work Sans , sans-serif' }}>
                                                {elem?.grade} Grade
                                            </MDTypography>
                                        </MDBox>
                                        <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                            <MDTypography variant='caption' style={{ fontFamily: 'Work Sans , sans-serif' }}>
                                                Starts: {`${moment.utc(elem?.startDateTime).utcOffset('+05:30').format('DD MMM YY HH:mm a')} • ${elem.maxParticipant - elem?.registrationsCount} seats left`}
                                            </MDTypography>
                                        </MDBox>
                                    </CardContent>
                                    <CardContent>
                                        <Grid mb={-2} container display='flex' justifyContent='space-between' xs={12} md={12} lg={12}>
                                            <Grid item display='flex' justifyContent='space-between' alignContent={'center'} alignItems={'center'} xs={12} md={12} lg={12}>
                                                <MDButton size="small" style={{ fontFamily: 'Work Sans , sans-serif' }} onClick={handleCopyClick} >Invite Friends</MDButton>
                                                <Registration id={elem?._id} quizData={elem} setData={setData} setUpdate={setUpdate} update={update}/>
                                                <MDButton style={{ color: 'green', backgroundColor: '#ffffff', fontFamily: 'Work Sans , sans-serif' }} onClick={joinGroup} ><WhatsAppIcon /> </MDButton>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                                {/* </Grid> */}
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
