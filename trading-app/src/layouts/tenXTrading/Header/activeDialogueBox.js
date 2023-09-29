import React, {useEffect, useState} from 'react';
import { userContext } from '../../../AuthContext';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import paymentQr from '../../../assets/images/paymentQrc.jpg';

//icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Title from '../../HomePage/components/Title'
import { Grid } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import Button from '@mui/material/Button';
import MDSnackbar from '../../../components/MDSnackbar';
import {useNavigate} from 'react-router-dom';
import { CircularProgress, Typography } from '@mui/material';
import Renew from './renew/renew';
import { set } from 'react-ga';


export default function Dialogue({subscription ,amount, name, id, walletCash, setCheckPayment, checkPayment, allowRenewal}) {
  const [open, setOpen] = React.useState(false);
  const getDetails = React.useContext(userContext);
  const [updatedUser, setUpdatedUser] = React.useState({});
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [setting, setSetting] = useState([]);
  const [messege, setMessege] = useState({
    lowBalanceMessage: "",
    thanksMessege: ""
  });
  const [isLoading,setIsLoading] = useState(true)

  const navigate = useNavigate();
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

  // const copyText = `https://www.stoxhero.com/signup?referral=${getDetails.userDetails.myReferralCode}`

  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/loginDetail`, {
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res)=>{
      setUpdatedUser(res.data);
      let subscribed = (res.data?.subscription)?.filter((elem)=>{
        return (elem?.subscriptionId?._id)?.toString() === (id)?.toString() && elem?.status === "Live";
      })

      if(subscribed?.length > 0){
        setIsSubscribed(true);
      }

    }).catch((err)=>{
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
      setInterval(()=>{
        setIsLoading(false)
      },5000)
    }).catch((err) => {
      console.log("Fail to fetch data of user", err);
    })
  }, [])

  useEffect(()=>{
    let subscribed = (updatedUser?.subscription)?.filter((elem)=>{
      console.log("Return:",(elem?.subscriptionId?._id)?.toString(), (id)?.toString(), elem?.status,)
      return (elem?.subscriptionId?._id)?.toString() === (id)?.toString() && elem?.status === "Live";
    })
    console.log("Subscribed:",subscribed)
    if(subscribed?.length > 0){
      setIsSubscribed(true);
    }
  }, [updatedUser])


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCheckPayment(!checkPayment)
  };

  async function captureIntent(){
    handleClickOpen();
    const res = await fetch(`${baseUrl}api/v1/tenX/capturepurchaseintent`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          purchase_intent_by : getDetails?.userDetails?._id, tenXSubscription : id
        })
    });
  }

  const buySubscription = async () => {
    if(walletCash < amount){
      return;
    }

    const res = await fetch(`${baseUrl}api/v1/userwallet/deduct`, {
      method: "PATCH",
      credentials: "include",
      headers: {
          "Accept": "application/json",
          "content-type": "application/json"
      },
      body: JSON.stringify({
        subscriptionAmount: amount, subscriptionName: name, subscribedId: id
      })
    });
    const dataResp = await res.json();
    if (dataResp.status === "error" || dataResp.error || !dataResp) {
        openSuccessSB("error", dataResp.message)
    } else {
        setMessege({
            ...messege,
            thanksMessege: "Congrats you have unlocked your TenX trading subscription"
        })
        setUpdatedUser(dataResp.data);
        
        // openSuccessSB("success", dataResp.message)
    }
  }

  const [messageObj, setMessageObj] = useState({
    color: '',
    icon: '',
    title: '',
    content: ''
  })
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (value,content) => {
    if(value === "success"){
        messageObj.color = 'success'
        messageObj.icon = 'check'
        messageObj.title = "Successful";
        messageObj.content = content
    };
    if(value === "reject"){
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "REJECTED";
      messageObj.content = content;
    };
    
    if(value === "else"){
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "REJECTED";
      messageObj.content = content;
    };
    if(value === "error"){
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "Error";
      messageObj.content = content;
    };

    setMessageObj(messageObj);
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color= {messageObj.color}
      icon= {messageObj.icon}
      title={messageObj.title}
      content={messageObj.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
      sx={{ borderLeft: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRight: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRadius: "15px", width: "auto"}}
    />
  );

  

  return (
   
    <MDBox display='flex' justifyContent='center' alignItems='center' style={{width:'90%'}}>
        {isSubscribed ?
        
        <MDBox display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
          <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' flexDirection='row' style={{width:'100%'}}>
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
              <MDButton disabled variant="contained" color="success" sx={{ fontSize: "10px",width:'100%'}} size='small'>Already Subscribed</MDButton>
            </Grid>
            {/* <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
              {allowRenewal && <Renew amount={amount} name={name} id={id} walletCash={walletCash}/>}
            </Grid> */}
          </Grid>
        </MDBox>
        
        :
        messege.thanksMessege ?
        <MDBox display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
          <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' flexDirection='row' style={{width:'100%'}}>
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
              <MDButton variant="contained" color="success" sx={{ fontSize: "10px",width:'100%'}} onClick={()=>{navigate(`/tenxtrading/${name}`, {state: {subscriptionId: id}})}} size='small'>Start Trading</MDButton>
            </Grid>
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
              {allowRenewal && <Renew amount={amount} name={name} id={id} walletCash={walletCash}/>}
            </Grid>
          </Grid>
        </MDBox>
        :
        <MDBox display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
          <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' flexDirection='row' style={{width:'100%'}}>
            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
              <MDButton variant="contained" color="success" sx={{fontSize: "10px",width:'100%'}} onClick={captureIntent} size='small'>Subscribe</MDButton>
            </Grid>
          </Grid>
        </MDBox>
       
        }

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
              {!messege.thanksMessege &&
                <MDBox display="flex" alignItems="center" justifyContent="center" >
                  <LockOutlinedIcon sx={{color:"#000"}} />
                </MDBox>
              }

            </DialogTitle>
            <DialogContent>
              {messege.thanksMessege ? 

              messege.thanksMessege
              :
              <>
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
                  <Title variant={{ xs: "h2", md: "h3" }} style={{ color: "#000", fontWeight: "bold", marginTop: "-24px" }} >Choose how to pay</Title>
                  <Typography textAlign="center" sx={{ mt: "4px", width: "75%", mb: "4px" }} color="#000" variant="body2">
                    
                    {
                    (walletCash < amount) ?
                    `Your wallet balance is low, kindly add money to your wallet. Follow the steps below.`
                    :
                    `To add money in your wallet, please follow these steps.`
                    }
                  </Typography>
                  <Typography textAlign="start" px={3} fontSize={13}>Step-1: Open any UPI app, scan the QR or enter the UPI ID {setting?.contest?.upiId}</Typography>
                  <MDBox>
                    <img src={paymentQr} width={200} height={200}/>
                  </MDBox>
                  <Typography textAlign="start" px={3} mb={0.4} fontSize={13}>Step-2: Complete the payment of your desired amount and take a screenshot.</Typography>
                  <Typography textAlign="start" px={4} fontSize={13}>Step-3: Please email {setting?.contest?.email} or WhatsApp {setting?.contest?.mobile} with your name, registered phone number, payment screenshot. Call for quicker resolution. Make sure your transactionId and amount is visible.</Typography>

                </MDBox>
              </DialogContentText>
            </>
          }

        </DialogContent>

                <MDBox display="flex" flexDirection="column" justifyContent="center" alignItems="center"  mt={0} >
                  <MDBox onClick={()=>{buySubscription()}} border="1px solid black" borderRadius="10px" display="flex" alignItems="center" justifyContent="space-between" sx={{height:"40px",width:{xs:"85%",md:"auto"},"&:hover":{cursor:"pointer",border:"1px solid blue"}}} >

                    <MDBox display="flex" justifyContent="center">
                    <Typography variant="body2" color="#000" style={{ marginRight: '14px', marginLeft:"8px" }} >Stoxhero Wallet</Typography>
                    <AccountBalanceWalletIcon sx={{marginTop:"5px",color:"#000",marginRight:"4px"}} />
                    <Typography variant="body2" sx={{fontSize:"16.4px",fontWeight:"550"}} color="#000" > {` ₹${walletCash.toFixed(2)}`}</Typography>
                    </MDBox>

                    <MDBox>
                    <ArrowForwardIosIcon sx={{mt:"8px",color:"#000",marginRight:"5px",marginLeft:"5px"}}/>
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
        {renderSuccessSB}
        </MDBox>
  );
}
