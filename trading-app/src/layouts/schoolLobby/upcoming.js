import React, { useState, useContext, useEffect } from "react"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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

function Cover({setUpdate, update}) {

    const [data, setData] = useState([]);

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
        openSuccessSB("Success", "Share this link to your friends.")
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
            openSuccessSB("Success", data.message);
        } else {
            openSuccessSB("Something went wrong", data.mesaage);
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

    return (
        <Grid mb={2} container xs={10} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ zIndex: 10, overflow: 'visible' }}>
            {data ?

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
                                        <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                            <MDTypography variant='caption' style={{ fontFamily: 'Work Sans , sans-serif' }}>
                                                Starts: {`${moment.utc(elem?.startDateTime).utcOffset('+05:30').format('DD MMM YYYY HH:mm a')} • ${elem.maxParticipant - elem?.registrations?.length} seats left`}
                                            </MDTypography>
                                        </MDBox>
                                    </CardContent>
                                    <CardContent>
                                        <Grid mb={-2} container display='flex' justifyContent='space-between' xs={12} md={12} lg={12}>
                                            <Grid item display='flex' justifyContent='space-between' xs={12} md={12} lg={12}>
                                                <MDButton size="small" style={{ fontFamily: 'Work Sans , sans-serif' }} onClick={handleCopyClick} >Invite Friends</MDButton>
                                                <MDButton size="small" style={{ fontFamily: 'Work Sans , sans-serif' }} onClick={()=>{registration(elem?._id)}}>Register</MDButton>
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

            {renderSuccessSB}
        </Grid>
    );
}

export default Cover;
