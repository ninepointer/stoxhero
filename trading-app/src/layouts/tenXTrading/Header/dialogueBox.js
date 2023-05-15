import React, {useEffect, useState} from 'react';
import { userContext } from '../../../AuthContext';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import MDTypography from '../../../components/MDTypography';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {BiCopy} from 'react-icons/bi'
import MDSnackbar from '../../../components/MDSnackbar';
import {useNavigate} from 'react-router-dom';



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

  AB INDIA SIKHEGA OPTIONS TRADING AUR BANEGA ATMANIRBHAR

  Join me at StoxHero - Options Trading and Investment Platform 🤝                            

  👉 Get 10,00,000 virtual currency in your account to start option trading using my referral code

  👉 Join the community of ace traders and learn real-time options trading

  👉 Participate in TenX Trading and earn 10% real cash on the profit you will make on the platform

  📲 Visit https://www.stoxhero.com/signup?referral=${getDetails.userDetails.myReferralCode}                          

  Use my below invitation code 👇 and get INR ₹10,00,000 in your wallet and start trading

  My Referral Code to join the StoxHero: ${getDetails.userDetails.myReferralCode}`

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
        setMessege({
            ...messege, 
            lowBalanceMessage: 
            <>
                <MDTypography>Your wallet balance is low refer more user to plateform for buy this subscription.</MDTypography>
                <MDBox display='flex' 
                    alignItems='center' 
                    style={{
                        backgroundColor:'#c3c3c3', 
                        padding: '10px',
                        borderRadius: '10px'
                    }}
                >
                <MDTypography paddingLeft = '15px'>{getDetails.userDetails.myReferralCode}</MDTypography>
                <MDButton variant='text' color='black' padding={0} margin={0} >
                    <CopyToClipboard text = {copyText} onCopy={handleCopy}>
                        <BiCopy/>
                    </CopyToClipboard>
                </MDButton>
                </MDBox>
            </>
        });
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
            {!messege.thanksMessege ?
                <>
                    Thanks for showing your interest in our subscription!
                    <br />
                    {`Your wallet money is INR ${walletCash}`}
                </>
                :
                "Thanks for showing your interest in our subscription!"
            }
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {messege.thanksMessege ? messege.thanksMessege
                :
                messege.lowBalanceMessage ? messege.lowBalanceMessage
                :
                "Purchase subscription using your wallet money"
                }
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={buySubscription} autoFocus>
                Buy
            </Button>
            <Button onClick={handleClose} autoFocus>
                Close
            </Button>
            </DialogActions>
        </Dialog>
        {renderSuccessSB}
    </>
  );
}