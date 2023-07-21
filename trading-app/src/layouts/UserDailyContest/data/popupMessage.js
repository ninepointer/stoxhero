import React, { useContext, useState, useEffect } from "react";
import { memo } from 'react';
// import axios from "axios"
// import uniqid from "uniqid"
// import { userContext } from "../../AuthContext";
import axios from "axios";
import { debounce } from 'lodash';

// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// import TextField from '@mui/material/TextField';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import InputLabel from '@mui/material/InputLabel';
// import FormControl from '@mui/material/FormControl';
import MDButton from '../../../components/MDButton';
// import MDSnackbar from '../../components/MDSnackbar';
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormLabel from '@mui/material/FormLabel';
// import { Box } from '@mui/material';
// import { renderContext } from "../../renderContext";
// import {Howl} from "howler";
// import sound from "../../assets/sound/tradeSound.mp3"
// import { paperTrader, infinityTrader, tenxTrader, internshipTrader, dailyContest } from "../../variables";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import Chain from '../../../assets/images/chain.png'
import { Grid, MenuItem, TextField } from "@mui/material";
import BuyModel from "../../tradingCommonComponent/BuyModel";
import SellModel from "../../tradingCommonComponent/SellModel";
import { dailyContest, maxLot_BankNifty, maxLot_Nifty, maxLot_FinNifty, maxLot_Nifty_DailyContest } from "../../../variables";


const PopupMessage = ({ data, elem, setIsInterested, isInterested, isInterestedState, setIsInterestedState }) => {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    const handleClose = async (e) => {
        setOpen(false);
    };

    
    async function registerUserToContest(id){
        setOpen(true);
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

    const [showThanksMessage, setShowThanksMessage] = useState(false);

    const handleButtonClick = () => {
        // Update the interested state for the current element in the contest array
        setIsInterested((prevState) => ({
          ...prevState,
          [elem._id]: {
            interested: true,
            count: prevState[elem._id] ? prevState[elem._id].count + 1 : 1,
          },
        }));
    
        setShowThanksMessage(true); // Show the "Thanks for expressing your interest" message
      };


    return (
        <div>
            {/* {!isInterested &&
            <MDButton
                variant='outlined'
                color='info'
                size='small'
                onClick={() => { registerUserToContest(elem._id) }}
            >
                <MDTypography color='info' fontWeight='bold' fontSize={10}>Get Notified</MDTypography>
            </MDButton>} */}

            {!isInterested[elem._id]?.interested && !showThanksMessage ? (
                <>
                    {/* <MDTypography>{data}</MDTypography> */}
                    <MDButton onClick={handleButtonClick}>Express Interest</MDButton>
                </>
            ) : (
                <>
                    <MDTypography color="info" fontWeight="bold" fontSize={13} mt={0.5}>
                        Thanks for expressing your interest.
                    </MDTypography>
                    {isInterested[elem._id]?.count && (
                        <MDTypography>
                            Total Expressions of Interest: {isInterested[elem._id].count}
                        </MDTypography>
                    )}
                </>
            )}


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
                </Dialog>
            </div >
        </div >
    );
}

export default memo(PopupMessage);