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
import paymentQr from '../../../assets/images/paymentQr.jpeg';




export default function AddMoney() {
  const [open, setOpen] = React.useState(false);
  //   const [userWallet, setUserWallet] = useState(0);
  const [setting, setSetting] = useState([]);
  //   const [messege, setMessege] = useState({
  //     lowBalanceMessage: "",
  //     thanksMessege: "",
  //     error: ""
  //   })

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"


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

        <DialogContentText id="alert-dialog-description">

        <MDBox display="flex" flexDirection="column" textAlign="center" alignItems="center" >
          <Title variant={{ xs: "h2", md: "h3" }} style={{ color: "#000", fontWeight: "bold", marginTop: "0px" }} >Add Money to Wallet</Title>
          <Typography textAlign="center" sx={{ mt: "4px", width: "75%", mb: "4px" }} color="#000" variant="body2">
            To add money in your wallet, please follow these steps.
          </Typography>
          <Typography textAlign="start" px={3} fontSize={13}>Step-1: Open any UPI app, scan the QR or enter the UPI ID {setting?.contest?.upiId}</Typography>
          <MDBox>
            <img src={paymentQr} width={200} height={200}/>
          </MDBox>
          <Typography textAlign="start" px={3} mb={0.4} fontSize={13}>Step-2: Complete the payment of your desired amount and take a screenshot.</Typography>
          <Typography textAlign="start" px={4} fontSize={13}>Step-3: Please email {setting?.contest?.email} or WhatsApp {setting?.contest?.mobile} with your name, registered phone number, payment screenshot. Call for quicker resolution. Make sure your transactionId and amount is visible.</Typography>

        </MDBox>
        </DialogContentText>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

}
