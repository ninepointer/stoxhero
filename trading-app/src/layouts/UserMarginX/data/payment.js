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
import { Grid, Typography } from '@mui/material';
import paymentQr from '../../../assets/images/paymentQrc.jpg';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import {apiUrl} from '../../../constants/constants';
import MDSnackbar from '../../../components/MDSnackbar';
import Input from '@mui/material/Input';

const ariaLabel = { 'aria-label': 'description' };
const Payment = ({ elem, setShowPay, showPay, whichTab }) => {
  const [open, setOpen] = React.useState(false);
  const [userWallet, setUserWallet] = useState(0);
  const [setting, setSetting] = useState([]);
  const [code, setCode] = useState('');
  const [verifiedCode, setVerifiedCode] = useState('');
  const [invalidCode, setInvalidCode] = useState('');
  const [discountData, setDiscountData] = useState();
  const [discountAmount, setDiscountAmount] = useState(0);
  const [cashbackAmount, setCashbackAmount] = useState(0);
  const [messege, setMessege] = useState({
    lowBalanceMessage: "",
    thanksMessege: "",
    error: ""
  })
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [title,setTitle] = useState('')
  const [content,setContent] = useState('');
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (title,content) => {
  console.log('status success')  
  setTitle(title)
  setContent(content)
  setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);
  
    const renderSuccessSB = (
      <MDSnackbar
          color="success"
          icon="check"
          title={title}
          content={content}
          open={successSB}
          onClose={closeSuccessSB}
          close={closeSuccessSB}
          bgWhite="info"
      />
      );
      
      const [errorSB, setErrorSB] = useState(false);
      const openErrorSB = (title,content) => {
      setTitle(title)
      setContent(content)
      setErrorSB(true);
      }
      const closeErrorSB = () => setErrorSB(false);
      
      const renderErrorSB = (
      <MDSnackbar
          color="error"
          icon="warning"
          title={title}
          content={content}
          open={errorSB}
          onClose={closeErrorSB}
          close={closeErrorSB}
          bgWhite
      />
      );

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"


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
    setShowPromoCode(false);
    setCode('');
    setVerifiedCode('');
    messege.thanksMessege && setShowPay(!showPay);
  };

  async function captureIntent() {
    handleClickOpen();
    const res = await fetch(`${baseUrl}api/v1/marginxs/purchaseintent/${elem._id}`, {
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
    if (userWallet < Number(amount-discountAmount)) {
      return openErrorSB('Low Wallet Balance', 'You don\'t have enough wallet balance for this purchase');
    }
    const res = await fetch(`${baseUrl}api/v1/marginx/feededuct`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        entryFee: Number(amount-discountAmount).toFixed(2), marginXName: elem?.marginXName, marginXId: elem?._id, coupon:verifiedCode
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
        thanksMessege: `Thanks for the payment of ₹${(Number(amount-discountAmount) + actualAmount).toFixed(2)}, your seat is booked for the MarginX - ${elem.marginXName}, please click on "Start Trading" once the MarginX starts.`
      })
    }
  }

  const [value, setValue] = useState('wallet');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const amount = elem?.marginXTemplate?.entryFee;
  const actualAmount = (elem?.marginXTemplate?.entryFee-discountAmount)*setting.gstPercentage/100;
  

  const initiatePayment = async() => {
    try{
      const res = await axios.post(`${apiUrl}payment/initiate`,{amount:(Number(amount-discountAmount)*100)+actualAmount*100, redirectTo:window.location.href, paymentFor:'MarginX', productId: elem?._id, coupon:verifiedCode},{withCredentials: true});
      console.log(res?.data?.data?.instrumentResponse?.redirectInfo?.url);
      window.location.href = res?.data?.data?.instrumentResponse?.redirectInfo?.url;
  }catch(e){
      console.log(e);
  }
  }
  const calculateDiscount = (discountType, rewardType, discount, maxDiscount=1000) => {
    if(rewardType =='Discount'){
      if(discountType == 'Flat'){
        setDiscountAmount(discount);
      }else if(discountType == 'Percentage'){
        setDiscountAmount(Math.min(amount*discount/100, maxDiscount));
      }
    }else{
      setCashbackAmount(discount);
    }
  }
  const applyPromoCode = async () => {
    try{
      if(verifiedCode){
        setVerifiedCode('');
        setCode('');
        setInvalidCode(false);
        setDiscountAmount(0);
        return;
      }
      const res = await axios.post(`${apiUrl}coupons/verify`, {code, product:'6517d40e3aeb2bb27d650de1', orderValue:elem?.marginXTemplate?.entryFee}, {withCredentials:true});
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
  return (

    <>
      {whichTab === "view" ?
        <Grid item xs={6} md={6} lg={12} display='flex' justifyContent='center' alignItems='center' minWidth='100%'>
          <MDBox p={0.5} display='flex' justifyContent='flex-end' alignItems='center' minWidth='100%'>
            <MDButton size='small' variant='contained' color='success' style={{ minWidth: '100%' }} onClick={captureIntent} >Buy</MDButton>
          </MDBox>
        </Grid>
        :
        <MDBox display='flex' justifyContent='center' alignItems='center' minWidth='100%'>
          <MDButton
            color='success'
            size='small'
            style={{ minWidth: '95%', fontSize: 9 }}
            onClick={captureIntent}
            fontSize={9}
          >
            Buy
          </MDButton>
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

                  <MDBox display="flex" flexDirection="column"  >
                    <Title variant={{ xs: "h2", md: "h3" }} style={{ color: "#000", fontWeight: "bold", marginTop: "6px", display:"flex", justifyContent:'center' }} >Choose how to pay</Title>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="payment-mode-label"
                        defaultValue="wallet"
                        name="radio-buttons-group"
                        value={value}
                        onChange={handleChange}
                      >
                        <FormControlLabel value="wallet" control={<Radio />} label="Pay from StoxHero Wallet" />
                        {value == 'wallet' &&
                          <MDBox display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={0} mb={2} style={{minWidth:'40vw'}} >
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
                            <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Fee Amount: ₹{amount ? amount : 0}</Typography>
                            <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">GST({setting?.gstPercentage}%) on Fee: ₹{0}</Typography>
                            {verifiedCode && discountData?.rewardType == 'Discount' && <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">{discountData?.discountType === 'Percentage' ? 
                              `Discount (${discountData?.discount}%) on Fee: ₹${discountAmount}` : 
                              `Discount (FLAT ₹ ${discountData?.discount} OFF) on Fee: ₹${discountAmount}`}</Typography>}
                            {verifiedCode && discountData?.rewardType == 'Cashback' && <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">{discountData?.discountType === 'Percentage' ? 
                              `Cashback (${discountData?.discount}%) on Fee: ₹${cashbackAmount}` : 
                              `Cashback (FLAT ₹ ${discountData?.discount} Cashback) as Wallet Bonus: ₹${cashbackAmount}`}</Typography>}
                            <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Net Transaction Amount: ₹{Number(amount-discountAmount).toFixed(2)}</Typography>
                          </MDBox>}
                        <FormControlLabel value="bank" control={<Radio />} label="Pay from Bank Account/UPI" />
                        {value == 'bank' &&
                          <MDBox display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={0} mb={0} >
                            <Typography textAlign="justify" sx={{ width: "100%", fontSize: "14px" }} color="#000" variant="body2">Starting October 1, 2023, there's a small change: GST will now be added to all wallet top-ups due to new government regulations. However you don't need to pay anything extra. StoxHero will be taking care of the GST on your behalf. To offset it, we've increased our pricing by a bit.</Typography>
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
                            {verifiedCode && discountData?.rewardType == 'Discount' && <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#ab1" variant="body2">{`Applied ${verifiedCode} - ${discountData?.discountType == 'Percentage'?`(${discountData?.discount}% off)`: `(FLAT ₹${discountData?.discount}) off`}`}</Typography>}
                            {verifiedCode && discountData?.rewardType == 'Cashback' && <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#ab1" variant="body2">{`Applied ${verifiedCode} - ${discountData?.discountType == 'Percentage'?`(${discountData?.discount}% Cashback)`: `(FLAT ₹${discountData?.discount}) Cashback`}`}</Typography>}
                            {invalidCode && <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#f16" variant="body2">{invalidCode}</Typography>}
                            </>
                            }
                            <Typography textAlign="left" mt={1} sx={{ width: "100%", fontSize: "14px", fontWeight: 600, }} color="#000" variant="body2">Cost Breakdown</Typography>
                            <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Fee Amount: ₹{amount ? amount : 0}</Typography>
                            <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">GST({setting?.gstPercentage}%) on Fee: ₹{actualAmount ? actualAmount : 0}</Typography>
                            {verifiedCode && discountData?.rewardType == 'Discount' && <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">{discountData?.discountType === 'Percentage' ? 
                              `Discount (${discountData?.discount}%) on Fee: ₹${discountAmount}` : 
                              `Discount (FLAT ₹ ${discountData?.discount} OFF) on Fee: ₹${discountAmount}`}</Typography>}
                            {verifiedCode && discountData?.rewardType == 'Cashback' && <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">{discountData?.discountType === 'Percentage' ? 
                              `Cashback (${discountData?.discount}%) on Fee: ₹${cashbackAmount}` : 
                              `Cashback (FLAT ₹ ${discountData?.discount} Cashback) as Wallet Bonus: ₹${cashbackAmount}`}</Typography>}  
                            <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Net Transaction Amount: ₹{(Number(amount-discountAmount) + actualAmount).toFixed(2)}</Typography>
                          </MDBox>}
                      </RadioGroup>
                    </FormControl>

                    {/* <Grid container display="flex" flexDirection="row" justifyContent="center" alignContent={"center"} gap={2} >
                      <Grid container mt={2} xs={12} md={9} xl={12} lg={12}>
                        <Grid item xs={12} md={6} xl={9} lg={9} >
                          <TextField
                            // disabled={((isSubmitted || battle) && (!editing || saving))}
                            id="outlined-required"
                            label='Coupen Code'
                            name='coupenCode'
                            fullWidth
                            value={amount}
                            onChange={(e) => { }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6} xl={3} lg={3} >
                          <MDButton color={"success"} onClick={handleClose} autoFocus>
                            Apply
                          </MDButton>
                        </Grid>
                      </Grid>

                    </Grid> */}

                  </MDBox>
                </DialogContentText>

                {value == 'wallet' &&
                  <MDBox display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={2}  >
                    <MDBox onClick={() => { buySubscription() }} border="1px solid #4CAF50" borderRadius="10px" display="flex" alignItems="center" justifyContent="space-between" sx={{ height: "40px", width: { xs: "85%", md: "auto" }, "&:hover": { cursor: "pointer", border: "1px solid #fff" } }} style={{ backgroundColor: "#4CAF50" }} >

                      <MDBox display="flex" justifyContent="center">
                        <Typography variant="body2" color="#fff" style={{ marginRight: '14px', marginLeft: "8px" }} >Stoxhero Wallet</Typography>
                        <AccountBalanceWalletIcon sx={{ marginTop: "5px", color: "#fff", marginRight: "4px" }} />
                        <Typography variant="body2" sx={{ fontSize: "16.4px", fontWeight: "550" }} color="#fff" > {`₹${userWallet}`}</Typography>
                      </MDBox>

                      <MDBox>
                        <ArrowForwardIosIcon sx={{ mt: "8px", color: "#fff", marginRight: "5px", marginLeft: "5px" }} />
                      </MDBox>

                    </MDBox>
                  </MDBox>}

              </>
          }
          

        </DialogContent>
        {value !== 'wallet' &&
          <DialogActions>
            <MDButton color='error' onClick={handleClose} autoFocus>
              Close
            </MDButton>
            <MDButton color={"success"} onClick={()=>initiatePayment()} autoFocus>
              {`Pay ₹${Number(amount-discountAmount)  + actualAmount} securely`}
            </MDButton>
          </DialogActions>}
          {renderSuccessSB}
          {renderErrorSB}
      </Dialog>
    </>
  );

}

export default memo(Payment);
