import React, { memo, useContext, useEffect, useState } from 'react';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DialogTitle, DialogContentText, Button } from '@mui/material';
import axios from "axios";
import { Grid, TextField, Tooltip, Box, useMediaQuery } from '@mui/material';
import { apiUrl } from '../../../constants/constants';
// import MDSnackbar from '../../../components/MDSnackbar';
import { userContext } from '../../../AuthContext';
// import { Autocomplete } from "@mui/material";
// import { styled } from '@mui/material';
import MDTypography from "../../../components/MDTypography";
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import logo from '../../../assets/images/logo1.jpeg'
import Slots from "./Slots";
import UploadImage from "./uploadImage"


const Registration = ({ id, setUpdate, setData, update, quizData }) => {
    const [open, setOpen] = React.useState(false);
    const [slotAction, setSlotAction] = useState(true);
    const [error, setError] = useState("");
    const [registrationMessage, setRegistrationMessage] = useState("");
    const [selected, setSelected] = useState();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const getDetails = useContext(userContext);

    const handleClose = () => {
        setOpen(false);
        setUpdate(!update)
    };

    function handleNext() {
        if (!selected) {
            setError('Please select a slot for particiating.');
            return;
        }
        setSlotAction(false);
    }

    async function register() {
        const res = await fetch(`${apiUrl}quiz/user/registration/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": false
            },
            body: JSON.stringify({
                slotId: selected?.slotId
            })
        });

        const data = await res.json();
        if (res.status === 200 || res.status === 201) {
            setSlotAction(false);
            setRegistrationMessage(data?.message)
        } else {
            
            setError(data?.message)
        }
    }

    return (
        <>
            <MDButton variant='outlined' color='dark' size="small" style={{fontSize:10, fontFamily: 'Work Sans , sans-serif', minWidth:'100%' }}
                onClick={() => { setOpen(true) }}
            >Register</MDButton>

            <Dialog
                // fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
                    {/* {"Option Chain"} */}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ display: "flex", flexDirection: "column" }}>
                        <MDBox >
                            {slotAction &&
                                <Slots id={id} quizData={quizData} selected={selected} setSelected={setSelected} setError={setError} setRegistrationMessage={setRegistrationMessage} getDetails={getDetails} />}

                            {(!slotAction && !registrationMessage && !getDetails.userDetails?.schoolDetails?.profilePhoto) &&
                                <UploadImage selected={selected} setData={setData} setRegistrationMessage={setRegistrationMessage} id={id} getDetails={getDetails} />}

                            {registrationMessage &&
                                <MDTypography fontSize={15} sx={{ color: '#353535' }} style={{ fontFamily: 'Work Sans , sans-serif', textAlign: 'center' }}>
                                    {registrationMessage}
                                </MDTypography>}

                            {error &&
                                <MDTypography fontSize={11} sx={{ color: '#FF0000' }} style={{ fontFamily: 'Work Sans , sans-serif', textAlign: 'center' }}>
                                    {error}
                                </MDTypography>}

                        </MDBox>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {slotAction &&
                        <MDButton variant='contained' size='small' color='success' style={{ color: '#fff', fontFamily: 'Work Sans , sans-serif' }}
                            onClick={getDetails?.userDetails?.schoolDetails?.profilePhoto ? ()=>{register()} : () => { handleNext() }}>Next</MDButton>}

                    {registrationMessage &&
                        <MDButton variant='contained' size='small' color='info' style={{ color: '#fff', fontFamily: 'Work Sans , sans-serif' }}
                            onClick={() => { handleClose() }}>Close</MDButton>}
                </DialogActions>
            </Dialog>

        </>
    );
}

export default memo(Registration);


