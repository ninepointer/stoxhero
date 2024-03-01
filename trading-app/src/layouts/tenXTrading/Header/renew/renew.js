import React, {useEffect, useState} from 'react';
import { userContext } from '../../../../AuthContext';
import MDBox from '../../../../components/MDBox';
import MDButton from '../../../../components/MDButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import { apiUrl } from '../../../../constants/constants';
// import paymentQr from '../../../../assets/images/paymentQrc.jpg';

//icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Title from '../../../HomePage/components/Title'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import Button from '@mui/material/Button';
import MDSnackbar from '../../../../components/MDSnackbar';
// import {useNavigate} from 'react-router-dom';
import { Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import Checkbox from '@mui/material/Checkbox';

const ariaLabel = { 'aria-label': 'description' };

export default function Renew({amount, name, id, walletCash, bonusCash}) {
  const [open, setOpen] = React.useState(false);
  const getDetails = React.useContext(userContext);
  const [updatedUser, setUpdatedUser] = React.useState({});
  // const [isContinue, setIsContinue] = useState(false);
  const [setting, setSetting] = useState([]);
  const [code, setCode] = useState('');
  const [verifiedCode, setVerifiedCode] = useState('');
  const [invalidCode, setInvalidCode] = useState('');
  const [discountData, setDiscountData] = useState();
  const [discountAmount, setDiscountAmount] = useState(0);
  const [cashbackAmount, setCashbackAmount] = useState(0);
  const [showPromoCode, setShowPromoCode] = useState(false);
  const[checked, setChecked] = useState(false);
  const [messege, setMessege] = useState({
    lowBalanceMessage: "",
    thanksMessege: ""
  })
  // console.log('bonus cash', bonusCash);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  // console.log('props', amount, name, walletCash, id);
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
      // console.log("subscribed", res.data)
      let subscribed = (res.data?.subscription)?.filter((elem)=>{
        return (elem?.subscriptionId?._id)?.toString() === (id)?.toString() && elem?.status === "Live";
      })
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

    }).catch((err) => {
      console.log("Fail to fetch data of user", err);
    })
  }, [])

  useEffect(()=>{
    let subscribed = (updatedUser?.subscription)?.filter((elem)=>{
      return (elem?.subscriptionId?._id)?.toString() === (id)?.toString() && elem?.status === "Live";
    })
  }, [updatedUser])


  const handleClickOpen = () => {
    window.webengage.track('tenx_renew_payment_clicked', {
      user: getDetails?.userDetails?._id,
      subscriptionId: id?.toString(),
      amount: amount
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpen(false);
    setShowPromoCode(false);
    setCode('');
    setVerifiedCode('');
  };

  async function captureIntent(){
    // console.log(getDetails)
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
    if(walletCash < Number(amount-discountAmount-bonusRedemption)){
      window.webengage.track('tenx_renew_payment_low_balance', {
        user: getDetails?.userDetails?._id,
        subscriptionId: id?.toString(),
        walletBalance: walletCash,
        amount: Number(amount - discountAmount - bonusRedemption)
      })
      return openSuccessSB("error", "You don't have enough wallet balance for this purchase.");
    }

    window.webengage.track('tenx__renew_payment_process_clicked', {
      user: getDetails?.userDetails?._id,
      subscriptionId: id,
      amount: Number(amount - discountAmount - bonusRedemption)
    })
    const res = await fetch(`${baseUrl}api/v1/tenX/renew`, {
      method: "PATCH",
      credentials: "include",
      headers: {
          "Accept": "application/json",
          "content-type": "application/json"
      },
      body: JSON.stringify({
        subscriptionAmount: Number(amount-discountAmount-bonusRedemption).toFixed(2), subscriptionName: name, subscriptionId: id, coupon: verifiedCode,bonusRedemption
      })
    });
    const dataResp = await res.json();
    // console.log(dataResp);
    if (dataResp.status === "error" || dataResp.error || !dataResp) {
        openSuccessSB("error", dataResp.message)
    } else {
        setMessege({
            ...messege,
            thanksMessege: "Congrats you have renewed your TenX trading subscription"
        })
        console.log(dataResp.data)
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

  const [value, setValue] = useState('wallet');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const subs_amount = amount;
  const redeemableBonus = Math.min((subs_amount-discountAmount)*setting?.maxBonusRedemptionPercentage/100, bonusCash/setting?.bonusToUnitCashRatio??1)??0;
  const bonusRedemption = checked? Math.min((subs_amount-discountAmount)*setting?.maxBonusRedemptionPercentage/100, bonusCash/setting?.bonusToUnitCashRatio??1):0;
  const subs_actualAmount = amount*setting.gstPercentage/100;
  // console.log('amounts', subs_amount, amount, subs_actualAmount);
  const initiatePayment = async() => {
    console.log('initiating');
    try{
      const res = await axios.post(`${apiUrl}payment/initiate`,{amount:Number((subs_amount-discountAmount-bonusRedemption)*100) + subs_actualAmount*100, redirectTo:window.location.href, paymentFor:'TenX Renewal', productId:id, coupon:verifiedCode, bonusRedemption},{withCredentials: true});
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
      if(discountType == 'Flat'){
        setCashbackAmount(discount);
      }else{
        setCashbackAmount (Math.min(amount*discount/100, maxDiscount));
      }
    }
  }
  const applyPromoCode = async () => {
    window.webengage.track('tenx_renew_apply_couponcode_clicked', {
      user: getDetails?.userDetails?._id,
      subscriptionId: id,
      amount: Number(amount - discountAmount - bonusRedemption)
    });
    try{
      if(verifiedCode){
        setVerifiedCode('');
        setCode('');
        setInvalidCode(false);
        setDiscountAmount(0);
        return;
      }
      const res = await axios.post(`${apiUrl}coupons/verify`, {code, product:'6517d3803aeb2bb27d650de0', orderValue:amount, platform:'Web', paymentMode: value}, {withCredentials:true});
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

      <button variant="contained" color="warning" style={{ fontSize: "10px", width: "100%", padding: 2, border: 'none', fontWeight: 'bold', textDecoration: 'under-line', cursor: 'pointer' }} onClick={captureIntent} size='small'>Renew Subscription</button>

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
                    <Title variant={{ xs: "h2", md: "h3" }} style={{ color: "#000", fontWeight: "bold", marginTop: "6px", display: "flex", justifyContent: 'center' }} >Choose how to pay</Title>
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
                          <MDBox display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" mt={0} mb={2} style={{ minWidth: '40vw' }}>
                            {!showPromoCode ? <MDBox display='flex' justifyContent='flex-start' width='100%' mt={1}
                              onClick={() => { 
                                window.webengage.track('tenx_renew_intent_to_apply_couponcode_clicked', {
                                  user: getDetails?.userDetails?._id,
                                  subscriptionId: id,
                                  amount: Number(amount - discountAmount - bonusRedemption)
                                });
                                setShowPromoCode(true) }} style={{ cursor: 'pointer' }}>
                              <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Have a promo code?</Typography>
                            </MDBox>
                              :
                              <>
                                <MDBox display='flex' justifyContent='flex-start' width='100%' alignItems='flex-start' mt={1}>
                                  <Input placeholder="Enter your promo code" disabled={verifiedCode} inputProps={ariaLabel} value={code} onChange={(e) => { setCode(e.target.value) }} />
                                  <MDButton onClick={applyPromoCode}>{verifiedCode && code ? 'Remove' : 'Apply'}</MDButton>
                                </MDBox>
                                {verifiedCode && discountData?.rewardType == 'Discount' && <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#ab1" variant="body2">{`Applied ${verifiedCode} - ${discountData?.discountType == 'Percentage' ? `(₹${discountData?.discount}% off ${discountData?.maxDiscount && `upto ₹${discountData?.maxDiscount}`})` : `(FLAT ₹${discountData?.discount}) off`}`}</Typography>}
                                {verifiedCode && discountData?.rewardType == 'Cashback' && <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#ab1" variant="body2">{`Applied ${verifiedCode} - ${discountData?.discountType == 'Percentage' ? `(₹${discountData?.discount}% Cashback ${discountData?.maxDiscount && `upto ₹${discountData?.maxDiscount}`})` : `(FLAT ₹${discountData?.discount}) Cashback`}`}</Typography>}
                                {invalidCode && <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#f16" variant="body2">{invalidCode}</Typography>}
                              </>
                            }
                            <Typography textAlign="left" mt={1} sx={{ width: "100%", fontSize: "14px", fontWeight: 600, }} color="#000" variant="body2">Cost Breakdown</Typography>
                            <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Fee Amount: ₹{subs_amount ? subs_amount : 0}</Typography>
                            {verifiedCode && discountData?.rewardType == 'Discount' && <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">{discountData?.discountType === 'Percentage' ?
                              `Discount (${discountData?.discount}%) on Fee: ₹${discountAmount}` :
                              `Discount (FLAT ₹ ${discountData?.discount} OFF) on Fee: ₹${discountAmount}`}</Typography>}
                            {verifiedCode && discountData?.rewardType == 'Cashback' && <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">{discountData?.discountType === 'Percentage' ?
                              `Cashback (${discountData?.discount}%) on Fee: ₹${cashbackAmount}` :
                              `Cashback (FLAT ₹ ${discountData?.discount} Cashback) as Wallet Bonus: ₹${cashbackAmount}`}</Typography>}
                            <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">GST({setting?.gstPercentage}%) on Fee: ₹{0}</Typography>
                            <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Net Transaction Amount: ₹{Number(subs_amount - discountAmount - bonusRedemption).toFixed(2)}</Typography>
                            {bonusCash > 0 && <MDBox display='flex' justifyContent='flex-start' alignItems='center' ml={-1}>
                              <Checkbox checked={checked} onChange={()=>{
                                window.webengage.track('tenx_renew_herocash_apply_clicked', {
                                  user: getDetails?.userDetails?._id,
                                  subscriptionId: id,
                                });
                                setChecked(!checked)
                              }} />
                              <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Use {redeemableBonus * (setting?.bonusToUnitCashRatio ?? 1)} HeroCash (1 HeroCash = {1 / (setting?.bonusToUnitCashRatio ?? 1)}₹)</Typography>
                            </MDBox>}
                          </MDBox>}
                        <FormControlLabel value="bank" control={<Radio />} label="Pay from Bank Account/UPI" />
                        {value == 'bank' &&
                          <MDBox display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" mt={0} mb={0} >
                            <Typography textAlign="justify" sx={{ width: "100%", fontSize: "14px" }} color="#000" variant="body2">Starting October 1, 2023, there's a small change: GST will now be added to all wallet top-ups due to new government regulations. However you don't need to pay anything extra. StoxHero will be taking care of the GST on your behalf. To offset it, we've increased our pricing by a bit.</Typography>
                            {!showPromoCode ? <MDBox display='flex' justifyContent='flex-start' width='100%' mt={1}
                              onClick={() => { 
                                window.webengage.track('tenx_intent_to_apply_couponcode_clicked', {
                                  user: getDetails?.userDetails?._id,
                                  subscriptionId: id,
                                  amount: Number(amount - discountAmount - bonusRedemption)
                                });
                                setShowPromoCode(true) }} style={{ cursor: 'pointer' }}>
                              <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Have a promo code?</Typography>
                            </MDBox>
                              :
                              <>
                                <MDBox display='flex' justifyContent='flex-start' width='100%' alignItems='flex-start' mt={1}>
                                  <Input placeholder="Enter your promo code" disabled={verifiedCode} inputProps={ariaLabel} value={code} onChange={(e) => { setCode(e.target.value) }} />
                                  <MDButton onClick={applyPromoCode}>{verifiedCode && code ? 'Remove' : 'Apply'}</MDButton>
                                </MDBox>
                                {verifiedCode && discountData?.rewardType == 'Discount' && <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#ab1" variant="body2">{`Applied ${verifiedCode} - ${discountData?.discountType == 'Percentage' ? `(${discountData?.discount}% off)` : `(FLAT ${discountData?.discount}) off`}`}</Typography>}
                                {verifiedCode && discountData?.rewardType == 'Cashback' && <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#ab1" variant="body2">{`Applied ${verifiedCode} - ${discountData?.discountType == 'Percentage' ? `(${discountData?.discount}% Cashback)` : `(FLAT ${discountData?.discount}) Cashback`}`}</Typography>}
                                {invalidCode && <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#f16" variant="body2">{invalidCode}</Typography>}
                              </>
                            }
                            <Typography textAlign="left" mt={1} sx={{ width: "100%", fontSize: "14px", fontWeight: 600, }} color="#000" variant="body2">Cost Breakdown</Typography>
                            <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Fee Amount: ₹{subs_amount ? subs_amount : 0}</Typography>
                            {verifiedCode && discountData?.rewardType == 'Discount' && <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">{discountData?.discountType === 'Percentage' ?
                              `Discount (${discountData?.discount}%) on Fee: ₹${discountAmount}` :
                              `Discount (FLAT ₹ ${discountData?.discount} OFF) on Fee: ₹${discountAmount}`}</Typography>}
                            {verifiedCode && discountData?.rewardType == 'Cashback' && <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">{discountData?.discountType === 'Percentage' ?
                              `Cashback (${discountData?.discount}%) on Fee: ₹${cashbackAmount}` :
                              `Cashback (FLAT ₹ ${discountData?.discount} Cashback) as Wallet Bonus: ₹${cashbackAmount}`}</Typography>}
                            <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">GST({setting?.gstPercentage}%) on Fee: ₹{subs_actualAmount ? subs_actualAmount : 0}</Typography>
                            <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Net Transaction Amount: ₹{(Number(subs_amount - discountAmount - bonusRedemption) + subs_actualAmount).toFixed(2)}</Typography>
                            {bonusCash > 0 && <MDBox display='flex' justifyContent='flex-start' alignItems='center' ml={-1}>
                              <Checkbox checked={checked} onChange={() => setChecked(!checked)} />
                              <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Use {redeemableBonus * (setting?.bonusToUnitCashRatio ?? 1)} HeroCash (1 HeroCash = {1 / (setting?.bonusToUnitCashRatio ?? 1)}₹)</Typography>
                            </MDBox>}
                          </MDBox>}
                      </RadioGroup>
                    </FormControl>
                  </MDBox>
                </DialogContentText>

                {value == 'wallet' &&
                  <MDBox display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={2}  >
                    <MDBox onClick={() => { buySubscription() }} border="1px solid #4CAF50" borderRadius="10px" display="flex" alignItems="center" justifyContent="space-between" sx={{ height: "40px", width: { xs: "85%", md: "auto" }, "&:hover": { cursor: "pointer", border: "1px solid #fff" } }} style={{ backgroundColor: "#4CAF50" }} >

                      <MDBox display="flex" justifyContent="center">
                        <Typography variant="body2" color="#fff" style={{ marginRight: '14px', marginLeft: "8px" }} >Stoxhero Wallet</Typography>
                        <AccountBalanceWalletIcon sx={{ marginTop: "5px", color: "#fff", marginRight: "4px" }} />
                        <Typography variant="body2" sx={{ fontSize: "16.4px", fontWeight: "550" }} color="#fff" > {`₹${walletCash?.toFixed(2)}`}</Typography>
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
            <MDButton color={"success"} onClick={initiatePayment} autoFocus>
              {`Pay ₹${(Number(subs_amount - discountAmount - bonusRedemption) + subs_actualAmount).toFixed(2)} securely`}
            </MDButton>
          </DialogActions>}
      </Dialog>
      {renderSuccessSB}
    </>
  );
}
