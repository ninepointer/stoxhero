import React, { useState, useContext, useEffect } from "react"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import moment from 'moment'
import MDSnackbar from "../../components/MDSnackbar";
import { useTheme } from '@mui/material/styles';

// @mui material components
import {Grid, Button} from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import axios from 'axios';
import { apiUrl } from "../../constants/constants";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';


function Cover({setUpdate, update}) {

    const [data, setData] = useState([]);
    const [registrationMessage, setRegistrationMessage] = useState("");

    useEffect(()=>{
        fetchData();
    }, [])

    async function fetchData(){
        const data = await axios.get(`${apiUrl}quiz/user`, {withCredentials: true});
        setData(data?.data?.data);
    }

    function handleCopyClick() {
        const textarea = document.createElement('textarea');
        textarea.value = "https://stoxhero.com/finowledge";
        document.body.appendChild(textarea);

        // Select the text in the textarea
        textarea.select();
        document.execCommand('copy');

        // Remove the temporary textarea
        document.body.removeChild(textarea);
        openSuccessSB("Success", "Share this link with your friends.")
    };

    async function registration(id) {
        const res = await fetch(`${apiUrl}quiz/user/registration/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": false
            },
            body: JSON.stringify({
            })
        });

        const data = await res.json();
        if (res.status === 200 || res.status === 201) {
            setData(data?.data)
            setUpdate(!update)
            setRegistrationMessage(data?.message)
            setOpen(true)
            
            // openSuccessSB("Success", data.message);
        } else {
            setRegistrationMessage(data?.message)
            setOpen(true)
            // openSuccessSB("Something went wrong", data.mesaage);
        }
    }

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [color, setColor] = useState('')
    const [icon, setIcon] = useState('')
  
  
    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = (value, content) => {
      // console.log("Value: ",value)
      if (value === "Success") {
        setTitle("Successfull");
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

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClose = async (e) => {
        setOpen(false);
    };

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
            <Grid mb={2} container xs={10} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ zIndex: 10, overflow: 'visible' }}>
                {data.length > 0 ?

                    data.map((elem) => {
                        return (
                            <Grid key={elem?._id} item xs={12} md={12} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                    <Card
                                        sx={{ cursor: 'pointer' }}
                                    // onClick={() => { handleOpenNewTab(elem) }}
                                    >
                                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                                <img src={elem?.image} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                                            </Grid>
                                            <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', minHeight: 60 }}>
                                                <MDTypography variant="h5" fontFamily='Work Sans , sans-serif' fontWeight={400} style={{ textAlign: 'center' }}>
                                                    {elem?.title}
                                                </MDTypography>
                                            </MDBox>
                                            {/* <Divider style={{ width: '100%' }} /> */}
                                            <MDBox mb={1} mt={-1} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                                <MDTypography variant='caption' style={{ fontFamily: 'Work Sans , sans-serif' }}>
                                                    {elem?.grade} Grade
                                                </MDTypography>
                                            </MDBox>
                                            <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                                <MDTypography variant='caption' style={{ fontFamily: 'Work Sans , sans-serif' }}>
                                                    Starts: {`${moment.utc(elem?.startDateTime).utcOffset('+05:30').format('DD MMM YYYY HH:mm a')} • ${(elem.maxParticipant || 0) - (elem?.registrations?.length || 0)} seats left`}
                                                </MDTypography>
                                            </MDBox>
                                        </CardContent>
                                        <CardContent>
                                            <Grid mb={-2} container display='flex' justifyContent='space-between' xs={12} md={12} lg={12}>
                                                <Grid item display='flex' justifyContent='space-between' xs={12} md={12} lg={12}>
                                                    <MDButton size="small" style={{ fontFamily: 'Work Sans , sans-serif' }} onClick={handleCopyClick} >Invite Friends</MDButton>
                                                    <MDButton size="small" style={{ fontFamily: 'Work Sans , sans-serif' }} onClick={() => { registration(elem?._id) }}>Register</MDButton>
                                                    <MDButton style={{color: 'green', backgroundColor: '#ffffff', fontFamily: 'Work Sans , sans-serif'}} onClick={joinGroup} ><WhatsAppIcon/> </MDButton>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
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


            </Grid>

            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
                    {/* {"Option Chain"} */}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ display: "flex", flexDirection: "column", marginLeft: 2 }}>
                        <MDBox sx={{ display: 'flex', alignItems: 'center', marginBottom: "10px" }}>
                            <MDTypography color="dark" fontSize={15}>{registrationMessage}</MDTypography>
                        </MDBox>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            {renderSuccessSB}
        </>
    );
}

export default Cover;
