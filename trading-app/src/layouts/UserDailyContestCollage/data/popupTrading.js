import React, {  useState, useContext } from "react";
import { memo } from 'react';
import { userContext } from "../../../AuthContext";
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
import { useNavigate } from "react-router-dom";
import { Box, TextField } from "@mui/material";

const PopupTrading = ({elem, timeDifference}) => {

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [data, setData] = useState("Enter your College Code shared by your college POC to participate in the TestZone.")
    const getDetails = useContext(userContext);
    const [collegeCode, setCollegeCode] = useState();
    const [errorMsg, setErrorMsg] = useState("");

    // console.log("main data", open)
    const navigate = useNavigate();

    const handleClickOpen = async () => {
        setOpen(true);
    };

    const handleClose = async (e) => {
        setOpen(false);
    };

    async function openPopupAndCheckParticipant(elem){
        let isParticipated = elem?.participants.some(elem => {
            return elem?.userId?._id?.toString() === getDetails?.userDetails?._id?.toString()
        })
        if (isParticipated) {
            navigate(`/collegetestzone/${elem.contestName}`, {
                state: { data: elem._id, isNifty: elem.isNifty, isBank: elem.isBankNifty, isFin: elem.isFinNifty, isAll: elem.isAllIndex, timeDifference: timeDifference, name: elem?.contestName, endTime: elem?.contestEndTime, allData: elem }
            });
            return;
        } else{
            setOpen(true);
        }
    }

    async function participateUserToContest(elem) {
        
        const res = await fetch(`${baseUrl}api/v1/dailycontest/contest/${elem._id}/varifycodeandparticipate`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                collegeCode
            })
        });

        const data = await res.json();
        // console.log(data);
        if (data.status === "error" || data.error || !data) {
            setOpen(true);
            
            if(data.message.includes("college")){
                setErrorMsg(data.message)
            } else{
                setData(data.message)
            }
        } else {
            navigate(`/collegetestzone/${elem.contestName}`, {
                state: { data: elem._id, isNifty: elem.isNifty, isBank: elem.isBankNifty, isFin: elem.isFinNifty, isAll: elem.isAllIndex, name: elem?.contestName, endTime: elem?.contestEndTime, allData: elem }
            });
        }
    }

    return (
        <div>
            {timeDifference &&
            <MDButton
                variant='outlined'
                color='warning'
                size='small'
                disabled={timeDifference > 0}
                onClick={() => { openPopupAndCheckParticipant(elem) }}
            >
                <MDTypography color='warning' fontWeight='bold' fontSize={10}>START TRADING</MDTypography>
            </MDButton>}
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
                            <MDBox sx={{ display: 'flex', alignItems: 'center', flexDirection: "column", marginBottom: "10px" }}>
                                <MDTypography color="dark" fontSize={15}>{data}</MDTypography>
                               { data.includes("college") && <TextField
                                    id="outlined-basic" label="College Code" variant="standard" onChange={(e) => { { setCollegeCode(e.target.value) } }}
                                    sx={{ margin: 1, padding: 1, width: "300px" }} 
                                    />}

                                {errorMsg &&
                                    <MDTypography color="error" fontSize={10}>{errorMsg}</MDTypography>
                                }
                            </MDBox>
                        </DialogContentText>
                    </DialogContent>
                   { data.includes("college") && <DialogActions>
                        <MDButton autoFocus variant="contained" color="info" onClick={(e) => { participateUserToContest(elem) }} >
                            Submit
                        </MDButton>
                    </DialogActions>}
                </Dialog>
            </div >
        </div >
    );
}

export default memo(PopupTrading);
