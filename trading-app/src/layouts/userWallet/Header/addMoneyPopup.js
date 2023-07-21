import React, { useEffect, useState } from 'react';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Title from '../../HomePage/components/Title'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from '@mui/material/Button';
// import MDSnackbar from '../../../components/MDSnackbar';
import { Typography } from '@mui/material';





export default function AddMoney() {
  const [open, setOpen] = React.useState(false);
  //   const [userWallet, setUserWallet] = useState(0);
  const [setting, setSetting] = useState([]);
  //   const [messege, setMessege] = useState({
  //     lowBalanceMessage: "",
  //     thanksMessege: "",
  //     error: ""
  //   })

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"


  useEffect(() => {
    axios.get(`${baseUrl}api/v1/readsetting`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
      .then((res) => {
        setSetting(res?.data[0]);

      }).catch((err) => {
        console.log("Fail to fetch data of user", err);
      })

  }, [])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // messege.thanksMessege && setShowPay(false);
  };


  return (

    <>
      <MDBox>
        <MDButton size="small" style={{ width: '95%' }} onClick={() => { setOpen(true) }}>
          Add Money
        </MDButton>
      </MDBox>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >

        <DialogContent>
          <>
            <DialogContentText id="alert-dialog-description">

              <MDBox display="flex" flexDirection="column" textAlign="center" alignItems="center" >
                <Typography textAlign="center" sx={{ width: "100%", mt: "7px" }} color="#000" variant="body2">
                  {`To add money in your wallet please make the UPI payment to ${setting?.contest?.upiId} and share the payment screenshot at ${setting?.contest?.email} along with your contact number(Mobile/WhatsApp) or call @ ${setting?.contest?.mobile}`}
                </Typography>
              </MDBox>
            </DialogContentText>

          </>
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
