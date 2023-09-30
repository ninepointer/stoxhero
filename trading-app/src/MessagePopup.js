import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';


export default function MessagePopUp({socket}) {
    const [open, setOpen] = React.useState(false);
    const [serverTime, setServerTime] = useState("");
    let date = new Date();
    let todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const [setting, setSetting] = useState([]);

    // const [holiday, setHoliday] = useState([]);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  
    useEffect(() => {

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

        // let date = new Date();
        // let weekDay = date.getDay();
     //   if (weekDay > 0 && weekDay < 6 && holiday === 0) {
    
          const appEndTime = new Date(setting[0]?.time?.message);

          appEndTime.setHours(appEndTime.getHours() - 5);
          appEndTime.setMinutes(appEndTime.getMinutes() - 30);
          const appEndHour = appEndTime.getHours().toString().padStart(2, '0');
          const appEndMinute = appEndTime.getMinutes().toString().padStart(2, '0');

          const appOfflineTime = new Date(`${todayDate}T${appEndHour}:${appEndMinute}:00.000Z`);
          const now = new Date(serverTime);
    // console.log(now.getMinutes(), appOfflineTime.getMinutes(), now.getSeconds(), appOfflineTime.getSeconds(), now.getHours() , appOfflineTime.getHours())
          if ((now.getMinutes() === appOfflineTime.getMinutes()) && (now.getSeconds() === appOfflineTime.getSeconds()) && (now.getHours() === appOfflineTime.getHours())) {
            handleClickOpen();
          }
    
      //  }
    
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
            <Typography textAlign="justify" sx={{ width: "100%" }} color="#000" variant="body2">
              Starting October 1, 2023, there are few changes on in-app payments: 
              GST will now be added to all wallet top-ups and bank payments due to new government regulations, 
              TDS will be deducted from payout credit to wallets on the net winning amount. 
              Thanks for understanding and adjusting your transactions accordingly!
            </Typography>
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
