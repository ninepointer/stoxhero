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
import Input from '@mui/material/Input';


const ariaLabel = { 'aria-label': 'description' };

export default function AddMoney() {
  const [open, setOpen] = React.useState(false);
    const [amount, setAmount] = useState(0);
  const [setting, setSetting] = useState([]);
  const [code, setCode] = useState('');
  const [verifiedCode, setVerifiedCode] = useState('');
  const [invalidCode, setInvalidCode] = useState('');
  const [discountData, setDiscountData] = useState();
  const [discountAmount, setDiscountAmount] = useState(0);
  const [cashbackAmount, setCashbackAmount] = useState(0);
  const [showPromoCode, setShowPromoCode] = useState(false);
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
    setShowPromoCode(false);
    setCode('');
    setVerifiedCode('');
    // messege.thanksMessege && setShowPay(false);
  };
  const calculateDiscount = (discountType, rewardType, discount, maxDiscount=1000) => {
    if(rewardType =='Discount'){
      if(discountType == 'Flat'){
        setDiscountAmount(discount);
      }else if(discountType == 'Percentage'){
        setDiscountAmount(Math.min(amount*discount/100, maxDiscount));
      }
    }else{
      if(discountType == 'Flat'){
        setCashbackAmount(discount);
      }else{
        setCashbackAmount (Math.min(amount*discount/100, maxDiscount));
      }
    }
  }
  const applyPromoCode = async () => {
    try{
      if(amount==0){
        return setInvalidCode('Please specify your topup amount')
      }
      if(verifiedCode){
        setVerifiedCode('');
        setCode('');
        setInvalidCode(false);
        setDiscountAmount(0);
        return;
      }
      const res = await axios.post(`${apiUrl}coupons/verify`, {code, product:'6517d48d3aeb2bb27d650de5', orderValue:amount, platform:'Web', paymentMode: 'addition'}, {withCredentials:true});
      console.log('verified code',res?.data?.data);
      if(res.status == 200){
        setVerifiedCode(code);
        setInvalidCode('');
        setDiscountData(res?.data?.data);
        calculateDiscount(res?.data?.data?.discountType, res?.data?.data?.rewardType, res?.data?.data?.discount, res?.data?.data?.maxDiscount);
      }else{
        setInvalidCode(res?.data?.message);
      }
    }catch(e){
      console.log('verified error',e);
      if(e.name == 'AxiosError'){
        setInvalidCode(e?.response?.data?.message);
      }
    }
  }

  const initiatePayment = async() => {
    try{
      const res = await axios.post(`${apiUrl}payment/initiate`,{amount: Number(amount*100) + actualAmount*100, redirectTo:window.location.href, coupon:verifiedCode},{withCredentials: true});
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

            <Typography textAlign="justify" sx={{ width: "100%", fontSize: "14px" }} color="#000" variant="body2">Starting October 1, 2023, there's a small change: GST will now be added to all wallet top-ups due to new government regulations. However you don't need to pay anything extra. StoxHero will be taking care of the GST on your behalf. To offset it, we've increased our pricing by a bit. 
            </Typography>
            {!showPromoCode?<MDBox display='flex' justifyContent='flex-start' width='100%' mt={1} 
                onClick={()=>{setShowPromoCode(true)}} style={{cursor:'pointer'}}>
                    <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Have a promo code?</Typography>
                  </MDBox>
                :
                <>
                <MDBox display='flex' justifyContent='flex-start' width='100%' alignItems='flex-start' mt={1}>
                  <Input placeholder="Enter your promo code" disabled={verifiedCode} inputProps={ariaLabel} value={code} onChange={(e)=>{setCode(e.target.value)}} />
                  <MDButton onClick={applyPromoCode}>{verifiedCode && code? 'Remove':'Apply'}</MDButton>
                </MDBox>
                {verifiedCode && discountData?.rewardType == 'Discount' && <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#ab1" variant="body2">{`Applied ${verifiedCode} - ${discountData?.discountType == 'Percentage'?`(${discountData?.discount}% off ${discountData?.maxDiscount &&`upto ₹${discountData?.maxDiscount}`})`: `(FLAT ₹${discountData?.discount}) off`}`}</Typography>}
                {verifiedCode && discountData?.rewardType == 'Cashback' && <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#ab1" variant="body2">{`Applied ${verifiedCode} - ${discountData?.discountType == 'Percentage'?`(${discountData?.discount}% Cashback ${discountData?.maxDiscount &&`upto ₹${discountData?.maxDiscount}`})`: `(FLAT ₹${discountData?.discount}) Cashback`}`}</Typography>}
                {invalidCode && <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#f16" variant="body2">{invalidCode}</Typography>}
                </>
              }
            <Typography textAlign="left" mt={1} sx={{ width: "100%", fontSize: "14px", fontWeight: 600, }} color="#000" variant="body2">Cost Breakdown</Typography>
            <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Wallet Top-up Amount: ₹{amount ? amount : 0}</Typography>
            <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500,  }} color="#808080" variant="body2">GST({setting?.gstPercentage}%) on Wallet Top-up: ₹{actualAmount ? actualAmount : 0}</Typography>
            {verifiedCode && discountData?.rewardType == 'Discount' && <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">{discountData?.discountType === 'Percentage' ? 
              `Discount (${discountData?.discount}%) on Fee: ₹${discountAmount}` : 
              `Discount (FLAT ₹ ${discountData?.discount} OFF) on Fee: ₹${discountAmount}`}</Typography>}
            {verifiedCode && discountData?.rewardType == 'Cashback' && <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">{discountData?.discountType === 'Percentage' ? 
              `Cashback (${discountData?.discount}%) on Fee: ₹${cashbackAmount}` : 
              `Cashback (FLAT ₹ ${discountData?.discount} Cashback) as Wallet Bonus: ₹${cashbackAmount}`}</Typography>}
            <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500,  }} color="#808080" variant="body2">Net Transaction Amount: ₹{ Number(amount) + actualAmount}</Typography>

              <Grid container display="flex" flexDirection="row" justifyContent="start" >
                <Grid container mt={0.5} xs={12} md={9} xl={12} lg={12}>
                  <Grid item xs={12} md={6} xl={12} lg={12} mt={2} >
                    <TextField
                      // disabled={((isSubmitted || battle) && (!editing || saving))}
                      id="outlined-required"
                      label='Amount'
                      name='amount'
                      disabled={verifiedCode}
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
