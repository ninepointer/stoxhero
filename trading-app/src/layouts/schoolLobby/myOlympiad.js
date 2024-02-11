import React, { useState, useContext, useEffect } from "react"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import moment from 'moment'
import MDSnackbar from "../../components/MDSnackbar";

// @mui material components
import Grid from "@mui/material/Grid";
import { CardActionArea, Divider } from '@mui/material';
// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";
import axios from 'axios';
import { apiUrl } from "../../constants/constants";
import { useNavigate } from "react-router-dom";

function Cover({update}) {

    const [data, setData] = useState([]);

    useEffect(()=>{
        fetchData();
    }, [update])

    async function fetchData(){
        const data = await axios.get(`${apiUrl}quiz/user/my`, {withCredentials: true});
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
    function handleStartClick(startDateTime) {
        if(new Date(startDateTime) > new Date()){
            openSuccessSB("Not started Yet", `The Olympiad will start on ${moment.utc(startDateTime).utcOffset('+05:30').format('DD MMM YY HH:mm a')} `)
        }
    };


    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [color, setColor] = useState('')
    const [icon, setIcon] = useState('')
  
  
    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = (value, content, title) => {
      // console.log("Value: ",value)
      if (value === "Success") {
        setTitle(title || 'Successful');
        setContent(content);
        setColor("success");
        setIcon("check")
      }else if (value === "Error") {
        setTitle(title || "Error");
        setContent(content);
        setColor("error");
        setIcon("warning")
      }else{
        setTitle(value);
        setContent(content);
        setColor("warning");
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

    const getDaysBetweenDates = (startDate, endDate) => {
        // Copy the dates to remove the time part

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Calculate the time difference in milliseconds
        const timeDifference = end.getDate() - start.getDate();

        // Convert the time difference to days
        const daysDifference = Math.ceil(timeDifference);

        return daysDifference;
    };

    function joinGroup() {
        window.open('https://chat.whatsapp.com/J08D2Bx5m814S07wPzjVeD', '_blank');
    }

    function practice(){
        openSuccessSB("Coming Soon", `Practice will be here soon.`)
    }

    return (
        <>
                <Grid mb={2} container xs={10} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ zIndex: 0, overflow: 'visible' }} gap={2}>
            {data.length >0 ?

                data.map((elem) => {
                    let dayToGo = getDaysBetweenDates(new Date(),elem?.startDateTime)
                    return (
                        <Grid item xs={12} md={3} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                <Card sx={{ minWidth: '100%'}}>
                                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <img src={elem?.image} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                                    <MDTypography variant="h6" fontSize={10} fontFamily='Work Sans , sans-serif' fontWeight={400} style={{ position: 'absolute', top: 0, right: 0, margin: '8px', textAlign: 'center', color: 'black', backgroundColor: "transparent", borderRadius: "15px", border:'1px solid lightgrey', padding: "2px 10px 2px 10px", marginTop: "10px" }}>
                                        {elem?.grade} grade
                                    </MDTypography>
                                    <MDTypography variant="h6" fontSize={10} fontFamily='Work Sans , sans-serif' fontWeight={400} style={{ position: 'absolute', top: 0, left: 0, margin: '8px', textAlign: 'center', color: 'black', backgroundColor: "transparent", borderRadius: "15px", border:'1px solid lightgrey', padding: "2px 10px 2px 10px", marginTop: "10px" }}>
                                        {dayToGo > 0 ? `${dayToGo} days to go!` : 'Test day has arrived!'}
                                    </MDTypography>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                        <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', minHeight:60 }}>
                                        <MDTypography variant="h6" fontFamily='Work Sans , sans-serif' style={{ textAlign: 'center' }}>
                                            {elem?.title}
                                        </MDTypography>
                                        </MDBox>
                                        <Divider style={{ width: '100%' }} />
                                        <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                        <MDTypography variant='caption' fontFamily='Work Sans , sans-serif' style={{ textAlign: 'center', color:'#532b9e' }}>
                                            Olympiad Date: {`${moment.utc(elem?.startDateTime).utcOffset('+05:30').format('DD-MMM-YYYY')}`}
                                        </MDTypography>
                                        </MDBox>
                                    </CardContent>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <CardContent>
                                        <Grid mb={-1} container spacing={1} display='flex' justifyContent='center' xs={12} md={12} lg={12}>
                                            <Grid item display='flex' justifyContent='center' alignContent={'center'} alignItems={'center'} xs={12} md={12} lg={6}>
                                                <MDButton variant='outlined' color='dark' size="small" style={{fontSize:10, backgroundColor: '#ffffff', fontFamily: 'Work Sans , sans-serif', minWidth:'100%'}} onClick={()=>{practice()}}>
                                                    Practice
                                                </MDButton>
                                            </Grid>
                                            <Grid item display='flex' justifyContent='center' alignContent={'center'} alignItems={'center'} xs={12} md={12} lg={6}>
                                                <MDButton variant='outlined' color='dark' size="small" style={{fontSize:10, fontFamily: 'Work Sans , sans-serif', minWidth:'100%' }} onClick={()=>{handleStartClick(elem?.startDateTime)}}>
                                                    Start
                                                </MDButton>
                                            </Grid>
                                            <Grid item display='flex' justifyContent='center' alignContent={'center'} alignItems={'center'} xs={12} md={12} lg={6}>
                                                <MDButton variant='outlined' color='dark' size="small" style={{fontSize:10, fontFamily: 'Work Sans , sans-serif', minWidth:'100%' }} onClick={handleCopyClick} >
                                                    Invite Friends
                                                </MDButton>
                                            </Grid>
                                            <Grid item display='flex' justifyContent='center' alignContent={'center'} alignItems={'center'} xs={12} md={12} lg={6}>
                                                <MDButton variant='outlined' color='dark' size="small" style={{fontSize:10, backgroundColor: '#ffffff', fontFamily: 'Work Sans , sans-serif', minWidth:'100%'}} onClick={joinGroup} >
                                                    {/* <WhatsAppIcon/>  */}
                                                    Join WhatsApp
                                                </MDButton>
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
                    <MDTypography variant='caption' color='student' style={{ textAlign: 'center', fontFamily: 'Work Sans , sans-serif' }}>You have not registered for any finance olympiads yet.</MDTypography>
                </MDBox>
            </Grid>}
        </Grid>
        {renderSuccessSB}
        </>
    );
}

export default Cover;
