import React, {  useState, useContext } from "react";
import ReactGA from "react-ga"
import { memo } from 'react';
import { userContext } from "../../../AuthContext";
import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MDButton from '../../../components/MDButton';
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import { useNavigate } from "react-router-dom";

const PopupTrading = ({elem, timeDifference}) => {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [data, setData] = useState("The battle is already full. We sincerely appreciate your enthusiasm to participate in our battle. Please join in our future battles.");
    const getDetails = useContext(userContext);
    console.log('time difference', timeDifference);

    // console.log("main data", open)
    const navigate = useNavigate();

    const handleClose = async (e) => {

        setOpen(false);
    };


    async function participateUserToBattle(elem) {
        let isParticipated = elem?.participants.some(elem => {
            return elem?.userId?._id?.toString() === getDetails?.userDetails?._id?.toString()
        })
        console.log("isParticipated", elem?.battleEndTime)
        if (isParticipated) {
            navigate(`/battles/${elem.battleName}`, {
                state: { data: elem._id, isNifty: elem.isNifty, isBank: elem.isBankNifty, isFin: elem.isFinNifty, isAll: elem.isAllIndex, timeDifference: timeDifference, name: elem?.battleName, endTime: elem?.battleEndTime }
            });
            return;
        }

        const res = await fetch(`${baseUrl}api/v1/battles/battle/${elem._id}/participate`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
            })
        });

        const data = await res.json();
        // console.log(data);
        if (data.status === "error" || data.error || !data) {
            setOpen(true);
            setData(data.message)
        } else {
            navigate(`/battles/${elem.battleName}`, {
                state: { data: elem._id, isNifty: elem.isNifty, isBank: elem.isBankNifty, isFin: elem.isFinNifty, isAll: elem.isAllIndex, name: elem?.battleName, endTime: elem?.battleEndTime }
            });
        }
    }


    return (
        <div>
            {timeDifference ?
            <MDButton
                // variant='outlined'
                color= {"success" }
                size='small'
                disabled={timeDifference > 0}
                onClick={() => { participateUserToBattle(elem) }}
            >
                <MDTypography color={"light" } fontWeight='bold' fontSize={9}>START TRADING</MDTypography>
            </MDButton>
            :
            ""}
            <div>
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
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

export default memo(PopupTrading);