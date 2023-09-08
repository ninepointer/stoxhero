import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';





export default function AutoCutPopUp({socket}) {
    const [open, setOpen] = React.useState(false);
    const [serverTime, setServerTime] = useState("");
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const [setting, setSetting] = useState([]);

    const [holiday, setHoliday] = useState([]);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  
    useEffect(() => {

        axios.get(`${baseUrl}api/v1/tradingholiday/dates/${new Date(todayDate)}/${new Date(`${todayDate}T23:59:00.000Z`)}`, { withCredentials: true })
            .then((res) => {
                setHoliday(res.data.data);
            });

        axios.get(`${baseUrl}api/v1/readsetting`, { withCredentials: true })
            .then((res) => {
                setSetting(res.data);
            });

    }, []);

    useEffect(()=>{
        socket.on("serverTime", (data)=>{
          // console.log("serverTime", data)
          setServerTime(data)
        })
      }, [])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {

        let date = new Date();
        let weekDay = date.getDay();
        if (weekDay > 0 && weekDay < 6 && holiday === 0) {
    
          const appEndTime = new Date(setting[0]?.time?.appEndTime);

          appEndTime.setHours(appEndTime.getHours() - 5);
          appEndTime.setMinutes(appEndTime.getMinutes() - 34);
          const appEndHour = appEndTime.getHours().toString().padStart(2, '0');
          const appEndMinute = appEndTime.getMinutes().toString().padStart(2, '0');

          const appOfflineTime = new Date(`${todayDate}T${appEndHour}:${appEndMinute}:00.000Z`);
          const now = new Date(serverTime);
    
          if ((now.getMinutes() === appOfflineTime.getMinutes()) && (now.getSeconds() === appOfflineTime.getSeconds()) && (now.getHours() === appOfflineTime.getHours())) {
            handleClickOpen();
          }
    
        }
    
      }, [serverTime]);
    
  return (
   
    <>

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >

            <DialogContent>
            <Typography textAlign="center" sx={{ width: "100%" }} color="#000" variant="body2">System will autocut your all trades in 4 minutes. Please squre off your positions.</Typography>
            </DialogContent>


            <DialogActions>
            <Button onClick={handleClose} autoFocus>
                Close
            </Button>
            </DialogActions>
        </Dialog>
    </>
  );
}
