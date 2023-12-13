import React, { useEffect, useState, useContext } from 'react';
import Modal from '@mui/material/Modal';
import { Checkbox, TextField } from '@mui/material';
import {Box} from '@mui/material';
import axios from 'axios';
import { apiUrl } from '../../../constants/constants';
import MDTypography from '../../../components/MDTypography';
// import {Grid} from '@mui/material';
// import {Select} from '@mui/material';
// import {FormControl} from '@mui/material';
// import {InputLabel} from '@mui/material';
// import {OutlinedInput} from '@mui/material';
// import {MenuItem} from '@mui/material';
import MDButton from '../../../components/MDButton';
import MDBox from '../../../components/MDBox';
// import DataTable from '../../../examples/Tables/DataTable';
import MDSnackbar from '../../../components/MDSnackbar';
import { userContext } from "../../../AuthContext";


const WithDrawalModal = ( {open, handleClose, walletBalance}) => {
    console.log('modal')
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      // width: 400,
      bgcolor: 'background.paper',
      height: 'auto',
    //   border: '2px solid #000',
      borderRadius:2,
      boxShadow: 24,
      p: 4,
    };
    
    const getDetails = useContext(userContext);
    const [title,setTitle] = useState('')
    const [content,setContent] = useState('')
    const [amount,setAmount] = useState(200);
    const [minWithdrawal, setMinWithdrawal] = useState(200);
    const [maxWithdrawal, setMaxWithdrawal] = useState(1000);
    const [maxWithdrawalHigh, setMaxWithdrawalHigh] = useState(15000);
    const [walletBalanceUpperLimit, setWalletBalanceUpperLimit] = useState(15000);
    const [minWalletBalance, setMinWalletBalance] = useState(200);
  
    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = (title,content) => {
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
        useEffect(()=>{
            axios.get(`${apiUrl}readsetting`).then((res)=>{
                setMinWithdrawal(res.data[0].minWithdrawal);
                setMaxWithdrawal(res.data[0].maxWithdrawal);
                setMaxWithdrawalHigh(res.data[0].maxWithdrawalHigh);
                setWalletBalanceUpperLimit(res.data[0].walletBalanceUpperLimit);
                setMinWalletBalance(res.data[0].minWalletBalance);
            });
        },[open])

    const handleSubmit = async() =>{
        try{
            if(getDetails?.userDetails?.KYCStatus!='Approved'){
                return openErrorSB('KYC Status not verified', 'Please get your KYC Verified before proceeding');
            }
    
            //check if the amount is greater than wallet balance
            if(amount>walletBalance){
                return openErrorSB('Insufficient Wallet Balance', 'Your withdrawal amount is greater than your wallet balance')
            }
    
            //check if the amount is less than 200
            if(amount<minWithdrawal){
                return openErrorSB('Amount less than withdrawal limit', `Your withdrawal amount is less than minimum withdrawal limit of ₹${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(minWithdrawal ? minWithdrawal : 0)}`);
            }
            if(walletBalance>=walletBalanceUpperLimit){
              if(amount>walletBalance - maxWithdrawalHigh && amount > maxWithdrawal){
                return openErrorSB('Amount greater than withdrawal limit', `Your withdrawal amount is greater than minimum withdrawal limit of ₹${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.max(walletBalance-maxWithdrawalHigh, maxWithdrawal) ? Math.max(walletBalance-maxWithdrawalHigh, maxWithdrawal) : 0)}`);
            }
            }else{
              if(amount>maxWithdrawal){
                  return openErrorSB('Withdrawal greater than daily limit', `Maximum withdrawal limit for a day is ₹${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(maxWithdrawal ? maxWithdrawal : 0)}`);
              }
            }
            if(walletBalance-amount<minWalletBalance){
              return openErrorSB('Maintain minimum wallet balance', `Your minimum wallet balance should be ₹${new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(minWalletBalance ? minWalletBalance : 0)}, you can withdraw only upto ₹${new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(walletBalance - minWalletBalance ? walletBalance - minWalletBalance : 0)}`) ;
            }
            const res = await axios.post(`${apiUrl}withdrawals`, {amount}, {withCredentials: true});
            console.log(res.data, res.status, res.statusCode);
            if(res.data.status == 'success'){
                openSuccessSB('Withdrawal Request Successful', 'Withdrawal Request submitted.')
                handleClose();
            } else{
              openErrorSB('Error', res.data.message)
            }    
        }catch(e){
            console.log(e.response.data);
            openErrorSB('Error', e.response.data.message);
        }
        //check if user has kyc verified
        
    }        
    return (
      <>
     <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
     >
      <Box sx={style}>
        <MDBox style={{height:'auto', display:'flex', flexDirection:'column'}}>
        <MDTypography style={{fontSize:'14px', fontWeight:'bold', marginBottom:'8px'}}>IMPORTANT</MDTypography>  
          <MDTypography style={{fontSize:'12px', marginBottom:'5px'}}>1. Please ensure you have filled your bank details and completed your KYC before proceeding with your withdrawal.</MDTypography>
          <MDTypography style={{fontSize:'12px', marginBottom:'5px'}}>2. Your full name on StoxHero, Bank Account, Aadhaar Card and PAN Card should match.</MDTypography>
          <MDTypography style={{fontSize:'12px', marginBottom:'5px'}}>3. TDS has already been deducted from your net winnings.</MDTypography>
          <MDTypography style={{fontSize:'12px', marginBottom:'5px'}}>4. Transfer might take upto 24-48 working hours to reflect in your bank account.</MDTypography>
          <MDTypography style={{fontSize:'12px', marginBottom:'5px'}}>5. You can only make one withdrawal in a day.</MDTypography>    
          <MDTypography style={{fontSize:'12px', marginBottom:'5px'}}>6. The minimum withdrawal amount is ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(minWithdrawal ? minWithdrawal : 0)}.</MDTypography>    
          <MDTypography style={{fontSize:'12px', marginBottom:'5px'}}>7. The maximum withdrawal limit for a day is ₹{walletBalance>=walletBalanceUpperLimit ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.max(walletBalance-maxWithdrawalHigh) ? Math.max(walletBalance-maxWithdrawalHigh) : 0) : new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(maxWithdrawal ? maxWithdrawal : 0)}.</MDTypography>
          <MDTypography style={{fontSize:'12px', fontWeight:'bold', marginBottom:'10px'}}>Your Wallet Balance: ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(walletBalance ? walletBalance : 0)}</MDTypography>   
          <TextField label='Withdrawal Amount' type= "number" value={amount} onChange={(e)=>{setAmount(e.target.value)}} outerWidth='40%'/>
          <MDBox sx={{display:'flex', justifyContent:'flex-end', marginTop:'12px' }}>
            <MDButton onClick={()=>{handleClose()}}>Cancel</MDButton>
            <MDButton color='success' onClick={()=>{handleSubmit()}}>Confirm</MDButton>
          </MDBox>
        </MDBox>
      </Box>
     </Modal>
      {renderSuccessSB}
      {renderErrorSB}
      </>
    )
  }

export default WithDrawalModal