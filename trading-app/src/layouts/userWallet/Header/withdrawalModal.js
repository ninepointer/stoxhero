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
      height: '50vh',
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
        useEffect(()=>{
            axios.get(`${apiUrl}readsetting`).then((res)=>{
                setMinWithdrawal(res.data[0].minWithdrawal);
                setMaxWithdrawal(res.data[0].maxWithdrawal);
                setMaxWithdrawalHigh(res.data[0].maxWithdrawalHigh);
                setWalletBalanceUpperLimit(res.data[0].walletBalanceUpperLimit);
            });
        },[open])

    const handleSubmit = async() =>{
        try{
            if(getDetails?.userDetails?.KYCStatus!='Approved'){
                return openErrorSB('KYC Status not verified', 'Please get your KYC Verified before proceeding');
            }
    
            //check if the amount is greater than wallet balance
            if(amount>walletBalance){
                return openErrorSB('Insufficient funds', 'You don\'t have the amount in your wallet for this withdrawal')
            }
    
            //check if the amount is less than 200
            if(amount<minWithdrawal){
                return openErrorSB('Amount too low', `Minimum withdrawal amount is ₹${minWithdrawal}`);
            }
            if(walletBalance>=walletBalanceUpperLimit){
              if(amount>walletBalance - maxWithdrawalHigh && amount > maxWithdrawal){
                return openErrorSB('Amount too high', `Maximum withdrawal amount is ₹${Math.max(walletBalance-maxWithdrawalHigh, maxWithdrawal)}`);
            }
            }else{
              if(amount>maxWithdrawal){
                  return openErrorSB('Amount too high', `Maximum withdrawal amount is ₹${maxWithdrawal}`);
              }
            }
            const res = await axios.post(`${apiUrl}withdrawals`, {amount}, {withCredentials: true});
            console.log(res.data, res.status, res.statusCode);
            if(res.data.status == 'success'){
                openSuccessSB('Withdrawal Request Successful', 'Request has been submitted. Please wait for 3-4 business days to get the amount in your account')
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
        <MDTypography>Withdraw from wallet to bank account</MDTypography>
        <MDBox mt={1} style={{height:'85vh', display:'flex', flexDirection:'column'}}>
          <MDTypography style={{fontSize:'14px', marginBottom:'12px'}}>Please ensure you have completed your KYC before proceeding with your withdrawal</MDTypography>  
          <MDTypography style={{fontSize:'14px', marginBottom:'12px'}}>You can only make one withdrawal in a day. The minimum amount is ₹{minWithdrawal} and the maximum amount is ₹{walletBalance>=walletBalanceUpperLimit ? maxWithdrawalHigh : maxWithdrawal}.</MDTypography>  
          <MDTypography style={{fontSize:'14px', marginBottom:'24px'}}>Your wallet balance: ₹{walletBalance}</MDTypography>   
          <TextField label='Amount' type= "number" value={amount} onChange={(e)=>{setAmount(e.target.value)}} outerWidth='40%'/>
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