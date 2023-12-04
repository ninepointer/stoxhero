import React, {memo, useEffect, useState, useContext} from 'react';
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
import { TextField, Typography } from '@mui/material';
import paymentQr from '../../../assets/images/paymentQrc.jpg';
import { userContext } from '../../../AuthContext';
import MDTypography from '../../../components/MDTypography';
// import MDTypography from '../../../components/MDTypography';
// import { userContext } from '../../../AuthContext';
// import { useNavigate } from 'react-router-dom';
// import ReactGA from "react-ga"
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';






const Payment = ({ elem, setShowPay, showPay }) => {
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);
  const [userWallet, setUserWallet] = useState(0);
  const [setting, setSetting] = useState([]);
  const [isCodeSubmit, setIsCodeSubmit] = useState(false);
  const getDetails = useContext(userContext);
  const [data, setData] = useState("Enter your College Code shared by your college POC to participate in the TestZone.")
  const [collegeCode, setCollegeCode] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


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
    await openPopupAndCheckParticipant();
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
        thanksMessege: `Thanks for the payment of ₹${elem.entryFee}, your seat is booked for the TestZone - ${elem.contestName}, please click on "Start Trading" once the TestZone starts.`
      })
    }
  }

  async function openPopupAndCheckParticipant(elem){
    let isParticipated = elem?.participants.some(elem => {
        return elem?.userId?._id?.toString() === getDetails?.userDetails?._id?.toString()
    })
    if (isParticipated) {
        setIsCodeSubmit(true);
        return;
    } else{
        setOpen(true);
    }
  }

  async function participateUserToContest(elem) {
      
      const res = await fetch(`${baseUrl}api/v1/dailycontest/contest/${elem._id}/varifycodeandparticipate`, {
          method: "PUT",
          credentials: "include",
          headers: {
              "content-type": "application/json",
              "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify({
              collegeCode
          })
      });

      const data = await res.json();
      // console.log(data);
      if (data.status === "error" || data.error || !data) {
          setOpen(true);
          
          if(data.message.includes("college")){
              setErrorMsg(data.message)
          } else{
              setData(data.message)
          }
      } 
      else {
          setIsCodeSubmit(true);
      }
  }

  const [value, setValue] = useState('wallet');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const amount = elem?.entryFee;
  const actualAmount = elem?.entryFee*setting.gstPercentage/100;

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
                        <MDBox display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={0} mb={2} >
                          <Typography textAlign="left" mt={1} sx={{ width: "100%", fontSize: "14px", fontWeight: 600, }} color="#000" variant="body2">Cost Breakdown</Typography>
                          <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Fee Amount: ₹{amount ? amount : 0}</Typography>
                          <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">GST({setting?.gstPercentage}%) on Fee: ₹{0}</Typography>
                          <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Net Transaction Amount: ₹{Number(amount)}</Typography>
                        </MDBox>}
                        <FormControlLabel value="bank" control={<Radio />} label="Pay from Bank Account/UPI" />
                        {value == 'bank' &&
                          <MDBox display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={0} mb={0} >
                            <Typography textAlign="justify" sx={{ width: "100%", fontSize: "14px" }} color="#000" variant="body2">Starting October 1, 2023, there's a small change: GST will now be added to all wallet top-ups due to new government regulations. Thanks for understanding and adjusting your transactions accordingly! </Typography>
                            <Typography textAlign="left" mt={1} sx={{ width: "100%", fontSize: "14px", fontWeight: 600, }} color="#000" variant="body2">Cost Breakdown</Typography>
                            <Typography textAlign="left" mt={0} sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Fee Amount: ₹{amount ? amount : 0}</Typography>
                            <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">GST({setting?.gstPercentage}%) on Fee: ₹{actualAmount ? actualAmount : 0}</Typography>
                            <Typography textAlign="left" sx={{ width: "100%", fontSize: "14px", fontWeight: 500, }} color="#808080" variant="body2">Net Transaction Amount: ₹{actualAmount ? Number(amount) + actualAmount : 0}</Typography>
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
                  <MDBox onClick={() => { buySubscription() }} border="1px solid #4CAF50" borderRadius="10px" display="flex" alignItems="center" justifyContent="space-between" sx={{ height: "40px", width: { xs: "85%", md: "auto" }, "&:hover": { cursor: "pointer", border: "1px solid #fff" } }}  style={{backgroundColor: "#4CAF50"}} >

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
          <MDButton color={"success"} onClick={handleClose} autoFocus>
            {`Pay ₹${actualAmount ? Number(amount) + actualAmount : 0} securely`}
          </MDButton>
        </DialogActions>}
      </Dialog>
    </>
  );

}

export default memo(Payment);
