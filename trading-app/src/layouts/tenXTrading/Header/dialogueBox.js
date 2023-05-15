import React, {useEffect, useState} from 'react';
import { userContext } from '../../../AuthContext';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


//icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Title from '../../HomePage/components/Title'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import MDTypography from '../../../components/MDTypography';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {BiCopy} from 'react-icons/bi'
import MDSnackbar from '../../../components/MDSnackbar';
import {useNavigate} from 'react-router-dom';
import { Typography } from '@mui/material';





export default function Dialogue({amount, name, id, walletCash}) {
  // console.log("props", amount, name, id, walletCash)
  const [open, setOpen] = React.useState(false);
  const getDetails = React.useContext(userContext);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [messege, setMessege] = useState({
    lowBalanceMessage: "",
    thanksMessege: ""
  })

  const navigate = useNavigate();
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const copyText = `                    

  📲 Visit https://www.stoxhero.com/signup?referral=${getDetails.userDetails.myReferralCode}`

  useEffect(()=>{
    console.log("user detail", getDetails?.userDetails)
    let subscribed = (getDetails?.userDetails?.subscription)?.filter((elem)=>{
      return (elem?.subscriptionId)?.toString() === (id)?.toString();
    })
    if(subscribed?.length > 0){
      setIsSubscribed(true);
    }
  }, [])

  const handleCopy = () => {
    openSuccessSB('success', 'Text copied.');
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function captureIntent(){
    console.log(getDetails)
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
    console.log(dataResp);
    if (dataResp.status === "error" || dataResp.error || !dataResp) {
        openSuccessSB("error", dataResp.message)
    } else {
        setMessege({
            ...messege,
            thanksMessege: "Thanks for purchase subscription"
        })
        openSuccessSB("success", dataResp.message)
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
        messageObj.title = "Successfull";
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
   
    <>
        {isSubscribed ?
        <MDBox>
        <MDButton variant="contained" color="dark" sx={{width: "130px", height: "20px", fontSize: "500x"}} onClick={()=>{navigate(`/tenxtrading/${name}`, {state: {subscriptionId: id}})}} size='small'>Start Trading</MDButton>
        </MDBox>
        :
        messege.thanksMessege ?
        <MDBox>
        <MDButton variant="contained" color="dark" sx={{width: "40px", height: "20px", fontSize: "500x"}} onClick={()=>{navigate(`/tenxtrading/${name}`, {state: {subscriptionId: id}})}} size='small'>Start Trading</MDButton>
        </MDBox>
        :
        <MDBox>
        <MDButton variant="contained" color="dark" onClick={captureIntent} size='small'>Unlock</MDButton>
        </MDBox>}

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

            {/* {!messege.thanksMessege ?
                <>
                    Thanks for showing your interest in our subscription!
                    <br />
                    {`Your wallet money is INR ${walletCash}`}
                </>
                :
                "Thanks for showing your interest in our subscription!"
            } */}
            </DialogTitle>
            <DialogContent>
              {messege.thanksMessege ? 

              messege.thanksMessege
              :
              <>
                <DialogContentText id="alert-dialog-description">

                  <MDBox display="flex" flexDirection="column" textAlign="center" alignItems="center" >
                    <Title variant={{xs:"h2",md:"h3"}} style={{color:"#000",fontWeight:"bold",marginTop:"10px"}} >Choose how to pay</Title>
                    <Typography textAlign="center" sx={{mt:"12px", width:"75%",mb:"12px"}} color="#000" variant="body2">Your payment is encrypted and you can change your payment method at anytime.</Typography>
                    <Typography  variant="body2" sx={{fontWeight:"bold"}} color="#000" >Secure for peace of mind.</Typography>
                    <Typography  variant="body2" sx={{fontWeight:"bold"}} color="#000" >Cancel easily online.</Typography>
                  </MDBox>
                    {/* {messege.thanksMessege ? messege.thanksMessege
                    :
                    messege.lowBalanceMessage ? messege.lowBalanceMessage
                    :
                    "Purchase subscription using your wallet money"
                    } */}
                </DialogContentText>

                <MDBox display="flex" flexDirection="column" justifyContent="center" alignItems="center"  mt={8} >
                  <MDBox onClick={()=>{buySubscription()}} border="1px solid black" borderRadius="10px" display="flex" alignItems="center" justifyContent="space-between" sx={{height:"40px",width:{xs:"85%",md:"auto"},"&:hover":{cursor:"pointer",border:"1px solid blue"}}} >

                    <MDBox display="flex" justifyContent="center">
                    <Typography variant="body2" color="#000" style={{ marginRight: '14px', marginLeft:"8px" }} >Stoxhero wallet</Typography>
                    <AccountBalanceWalletIcon sx={{marginTop:"5px",color:"#000",marginRight:"4px"}} />
                    <Typography variant="body2" sx={{fontSize:"16.4px",fontWeight:"550"}} color="#000" > {` ₹${walletCash}`}</Typography>
                    </MDBox>

                    <MDBox>
                    <ArrowForwardIosIcon sx={{mt:"8px",color:"#000",marginRight:"5px",marginLeft:"5px"}}/>
                    </MDBox>

                  </MDBox>

                  <MDBox border="1px solid red" borderRadius="10px" mt={5}>

                    <MDBox>
                      {(walletCash < amount) &&
                      <MDBox display="flex" flexDirection="column" textAlign="center" justifyContent="center" sx={{width:{xs:"95%"}}} >

                        <Typography variant="body2" color="#000" sx={{fontWeight:"600"}} >Your wallet balance is low kindly refer more users on this platform to buy this subscription.</Typography>
                        <br />
                        {/* <Typography variant="body2" color="#000" sx={{fontWeight:"600"}} >  {`Your wallet money is INR ${walletCash}`} </Typography> */}
                    
                      </MDBox>
                    //  :
                    //  <Typography>

                    //    "Thanks for showing your interest in our subscription!"
                    //  </Typography>
                    
                  }
                    </MDBox>
                
                  </MDBox>

                </MDBox>
              </>
              }

            </DialogContent>
            <DialogActions>
            {/* <Button onClick={buySubscription} autoFocus>
                Buy
            </Button> */}
            <Button onClick={handleClose} autoFocus>
                Close
            </Button>
            </DialogActions>
        </Dialog>
        {renderSuccessSB}
    </>
  );
}