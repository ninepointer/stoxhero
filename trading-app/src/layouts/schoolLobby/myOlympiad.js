import React, { useState, useContext, useEffect } from "react"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import strategy from '../../assets/images/strategy.png'
import moment from 'moment'
import MDSnackbar from "../../components/MDSnackbar";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import axios from 'axios';
import { apiUrl } from "../../constants/constants";
import { useNavigate } from "react-router-dom";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function Cover({update}) {

    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        fetchData();
    }, [update])

    async function fetchData(){
        const data = await axios.get(`${apiUrl}quiz/user/my`, {withCredentials: true});
        console.log('data',data?.data?.data);
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
        openSuccessSB("Success", "Share this link to your friends.")
    };


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

    function joinGroup(){
        window.open('https://chat.whatsapp.com/Bcjt7NbDTyz1odeF8RDtih', '_blank');
      }

    return (
        <Grid mb={2} container xs={10} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ zIndex: 10, overflow: 'visible' }} gap={2}>
            {data.length >0 ?

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
                                                borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                                        </Grid>
                                        <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', minHeight: 60 }}>
                                            <MDTypography variant="h5" fontFamily='Work Sans , sans-serif' fontWeight={400} style={{ textAlign: 'center' }}>
                                                {elem?.title}
                                            </MDTypography>
                                        </MDBox>
                                        {/* <Divider style={{ width: '100%' }} /> */}
                                        <MDBox mt={-1} mb={1} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
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
                                                <MDButton size="small" style={{ fontFamily: 'Work Sans , sans-serif' }} 
                                                 >Start</MDButton>
                                                <MDButton style={{color: 'green', backgroundColor: '#ffffff', fontFamily: 'Work Sans , sans-serif'}} onClick={joinGroup} ><WhatsAppIcon/> </MDButton>
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
    );
}

export default Cover;
