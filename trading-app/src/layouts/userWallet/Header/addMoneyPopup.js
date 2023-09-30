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
import { TextField, Typography } from '@mui/material';
import paymentQr from '../../../assets/images/paymentQrc.jpg';
import Grid from '@mui/material/Grid'
import MDTypography from '../../../components/MDTypography';
import {apiUrl} from '../../../constants/constants';




export default function AddMoney() {
  const [open, setOpen] = React.useState(false);
    const [amount, setAmount] = useState(0);
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

  const initiatePayment = async() => {
    try{
      const res = await axios.post(`${apiUrl}payment/initiate`,{amount: Number(amount*100) + actualAmount*100, redirectTo:window.location.href},{withCredentials: true});
      console.log(res?.data?.data?.instrumentResponse?.redirectInfo?.url);
      window.location.href = res?.data?.data?.instrumentResponse?.redirectInfo?.url;
  }catch(e){
      console.log(e);
  }
  }


  const actualAmount = amount*setting.gstPercentage/100;
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

          <>

          <DialogTitle id="alert-dialog-title">
            <MDBox display="flex" flexDirection='column' alignItems="center" justifyContent="center" >
              <LockOutlinedIcon sx={{ color: "#000" }} />
              <Typography textAlign="center" sx={{ width: "100%", fontWeight: 700 }} color="#000" variant="body2">Add Money To Wallet</Typography>
            </MDBox>
        </DialogTitle>

            <DialogContent>

            <Typography textAlign="justify" sx={{ width: "100%", fontSize: "14px" }} color="#000" variant="body2">Starting October 1, 2023, there's a small change: GST will now be added to all wallet top-ups due to new government regulations. However you don't need to pay anything extra. StoxHero will be taking care of the GST on your behalf. 
            </Typography>
            
            <Typography textAlign="left" mt={1} sx={{ width: "100%", fontSize: "14px", fontWeight: 600, }} color="#000" variant="body2">Cost Breakdown</Typography>
            <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Wallet Top-up Amount: ₹{amount ? amount : 0}</Typography>
            <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500,  }} color="#808080" variant="body2">GST({setting?.gstPercentage}%) on Wallet Top-up: ₹{actualAmount ? actualAmount : 0}</Typography>
            <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500,  }} color="#808080" variant="body2">Net Transaction Amount: ₹{ Number(amount) + actualAmount}</Typography>

              <Grid container display="flex" flexDirection="row" justifyContent="start" >
                <Grid container mt={0.5} xs={12} md={9} xl={12} lg={12}>
                  <Grid item xs={12} md={6} xl={12} lg={12} mt={2} >
                    <TextField
                      // disabled={((isSubmitted || battle) && (!editing || saving))}
                      id="outlined-required"
                      label='Amount'
                      name='amount'
                      fullWidth
                      value={amount}
                      onChange={(e) => { setAmount(e.target.value) }}
                    />
                  </Grid>
                </Grid>

              </Grid>
            </DialogContent>

            <DialogActions>
              <>
                <MDButton
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{ mr: 2, ml: 2 }}
                  disabled={!amount}
                  onClick={(e) => { initiatePayment() }}
                >
                  <MDBox display='flex' alignItems='center' justifyContent='center' gap={1} style={{color:'#fff'}}>
                    
                      {actualAmount ? `Pay ₹${Number(amount) + actualAmount} Securely ` : "Pay Securely "} 
                
                    <LockOutlinedIcon sx={{ color: "#fff" }} />
                  </MDBox>

                </MDButton>
              </>

            </DialogActions>


          </>
      </Dialog>
    </>
  );

}
