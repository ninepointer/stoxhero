import React, { useContext, useState, useEffect } from "react";
import { memo } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MDButton from '../../../components/MDButton';
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import { Button } from "@mui/material";


const PopupMessage = ({ data, elem, setIsInterested, isInterested, isInterestedState, setIsInterestedState }) => {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [showThanksMessage, setShowThanksMessage] = useState(false);


    const handleClose = async (e) => {
        setOpen(false);
    };

    
    async function registerUserToContest(id){
        setOpen(true);
        setIsInterestedState((prevState) => ({
            ...prevState,
            [elem._id]: {
                interested: true,
                count: prevState[elem._id] ? prevState[elem._id].count + 1 : 1,
            },
        }));
    
        setShowThanksMessage(true); 
  
        const res = await fetch(`${baseUrl}api/v1/dailycontest/contest/${id}/register`, {
            method: "PUT",
            credentials:"include",
            headers: {
                "content-type" : "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
            })
        });
        
        const data = await res.json();
        console.log(data);
        if(data.status === "error" || data.error || !data){
            // openSuccessSB("error", data.message)
        }else{
            isInterestedState ? setIsInterested(false) : setIsInterested(true) ;
        }
    }

    return (
        <div>
            {(!isInterested[elem._id]?.interested && !showThanksMessage) ?
            <MDButton
                variant='outlined'
                color='info'
                size='small'
                onClick={() => { registerUserToContest(elem._id) }}
            >
                <MDTypography color='info' fontWeight='bold' fontSize={10}>Get Notified</MDTypography>
            </MDButton>
            :
            <MDTypography color="info" fontWeight="bold" fontSize={13} mt={0.5}>
                Thanks for expressing your interest.
            </MDTypography>
            }


            <div>
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
                                <MDTypography color="dark" fontSize={15}>{data}</MDTypography>
                            </MDBox>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div >
        </div >
    );
}

export default memo(PopupMessage);