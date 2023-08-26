import React, {memo, useEffect, useState} from 'react';
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
import { Typography } from '@mui/material';
import paymentQr from '../../../assets/images/paymentQrc.jpg';
// import MDTypography from '../../../components/MDTypography';
// import { userContext } from '../../../AuthContext';
// import { useNavigate } from 'react-router-dom';
// import ReactGA from "react-ga"






const Payment = ({ elem, setShowPay, showPay }) => {
  const [open, setOpen] = React.useState(false);
  const [userWallet, setUserWallet] = useState(0);
  const [setting, setSetting] = useState([]);
  const [messege, setMessege] = useState({
    lowBalanceMessage: "",
    thanksMessege: "",
    error: ""
  })


  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"


  useEffect(() => {
    if(open){
      axios.get(`${baseUrl}api/v1/userwallet/my`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
      .then((res) => {
  
        const cashTransactions = (res.data.data)?.transactions?.filter((transaction) => {
          return transaction.transactionType === "Cash";
        });
        // console.log((res.data.data)?.transactions);
  
        const totalCashAmount = cashTransactions?.reduce((total, transaction) => {
          return total + transaction?.amount;
        }, 0);
  
        setUserWallet(totalCashAmount.toFixed(2));
        // console.log("totalCashAmount", totalCashAmount)
  
      }).catch((err) => {
        console.log("Fail to fetch data of user", err);
      })
  
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
    }

  }, [open])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    messege.thanksMessege && setShowPay(!showPay);
  };

  async function captureIntent() {
    handleClickOpen();
    const res = await fetch(`${baseUrl}api/v1/dailycontest/purchaseintent/${elem._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
      })
    });
  }

  const buySubscription = async () => {
    if (userWallet < elem.entryFee) {
      return;
    }
    const res = await fetch(`${baseUrl}api/v1/dailycontest/feededuct`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        contestFee: elem?.entryFee, contestName: elem?.contestName, contestId: elem?._id
      })
    });
    const dataResp = await res.json();
    // console.log(dataResp);
    if (dataResp.status === "error" || dataResp.error || !dataResp) {
      // openSuccessSB("error", dataResp.message)
      setMessege({
        ...messege,
        error: dataResp.message
      })
    } else {
      setMessege({
        ...messege,
        thanksMessege: `Thanks for the payment of ₹${elem.entryFee}, your seat is booked for the contest - ${elem.contestName}, please click on "Start Trading" once the contest starts.`
      })
    }
  }

  return (

    <>
      <MDBox>
        <MDButton
          variant='outlined'
          color='error'
          size='small'
          onClick={() => { captureIntent() }} 
         >
            Pay Now
        </MDButton>
      </MDBox>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {!messege.thanksMessege &&
            <MDBox display="flex" alignItems="center" justifyContent="center" >
              <LockOutlinedIcon sx={{ color: "#000" }} />
            </MDBox>
          }

        </DialogTitle>
        <DialogContent>
          {messege.thanksMessege ?

          <Typography textAlign="center" sx={{ width: "100%" }} color="#000" variant="body2">{messege.thanksMessege}</Typography>
          :
          messege.error ?
          <Typography textAlign="center" sx={{ width: "100%" }} color="#000" variant="body2">{messege.error}</Typography>
            :
            <>
              <DialogContentText id="alert-dialog-description">

                <MDBox display="flex" flexDirection="column" textAlign="center" alignItems="center" >
                  <Title variant={{ xs: "h2", md: "h3" }} style={{ color: "#000", fontWeight: "bold", marginTop: "6px" }} >Choose how to pay</Title>
                  <Typography textAlign="center" sx={{ mt: "12px", width: "75%", mb: "6px" }} color="#000" variant="body2">
                    
                    {
                    (userWallet < elem.entryFee) ?
                    `Your wallet balance is low, kindly add money to your wallet. Follow the steps below.`
                    :
                    `To add money in your wallet, please follow these steps.`
                    }
                  </Typography>
                  <Typography textAlign="start" px={3} fontSize={13}>Step-1: Open any UPI app, scan the QR or enter the UPI ID {setting?.contest?.upiId}</Typography>
                  <MDBox>
                    <img src={paymentQr} width={200} height={200}/>
                  </MDBox>
                  <Typography textAlign="start" px={3} mb={2} fontSize={13}>Step-2: Complete the payment of your desired amount and take a screenshot.</Typography>
                  <Typography textAlign="start" px={4} fontSize={13}>Step-3: Please email {setting?.contest?.email} or WhatsApp {setting?.contest?.mobile} with your name, registered phone number, payment screenshot. Call for quicker resolution. Make sure your transactionId and amount is visible.</Typography>

                </MDBox>
              </DialogContentText>

              <MDBox display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={2} >
                <MDBox onClick={() => { buySubscription() }} border="1px solid black" borderRadius="10px" display="flex" alignItems="center" justifyContent="space-between" sx={{ height: "40px", width: { xs: "85%", md: "auto" }, "&:hover": { cursor: "pointer", border: "1px solid blue" } }} >

                  <MDBox display="flex" justifyContent="center">
                    <Typography variant="body2" color="#000" style={{ marginRight: '14px', marginLeft: "8px" }} >Stoxhero Wallet</Typography>
                    <AccountBalanceWalletIcon sx={{ marginTop: "5px", color: "#000", marginRight: "4px" }} />
                    <Typography variant="body2" sx={{ fontSize: "16.4px", fontWeight: "550" }} color="#000" > {`₹${userWallet}`}</Typography>
                  </MDBox>
                  
                  <MDBox>
                    <ArrowForwardIosIcon sx={{ mt: "8px", color: "#000", marginRight: "5px", marginLeft: "5px" }} />
                  </MDBox>

                </MDBox>
              </MDBox>
            </>
          }

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

export default memo(Payment);
