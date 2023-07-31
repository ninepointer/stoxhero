import React, { useEffect } from 'react'
import MDBox from '../../components/MDBox';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import MDTypography from '../../components/MDTypography';
import {apiUrl} from '../../constants/constants';

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [status, setStatus] = useState('loading'); 
  useEffect(()=>{
    checkStatus();
  },[location]);
  const checkStatus = async ()=> {
    try{
        const res = await axios.get(`${apiUrl}payment/checkstatus/${location.search.merchantTransactionId}`, {withCredentials: true});
        console.log(res.data);
        if(res.data.code == 'PAYMENT_SUCCESS'){
            setStatus('succeeded');
            if(location.search.redirectTo){
                navigate(location.search.redirectTo);
            }
        }else if(res.data.code == 'PAYMENT_ERROR'){
            setStatus('failed');
        }else{
            setStatus('processing');
        }
    }catch(e){
        console.log('error', e)
    }
    
  }  

  return (
    <MDBox>
        <MDTypography>
            Payment Status
        </MDTypography>
        <MDBox>
            {status!='loading' && <MDTypography>We're verifying your transaction. Please don't refresh or go back. This may take a minute.</MDTypography>} 
        </MDBox>
        <MDBox>
            {status == 'succeeded' && <MDTypography>Payment Successful</MDTypography>}
            {status == 'failed'&& <MDTypography>Payment Failed</MDTypography>}
            {status == 'processing' && <MDTypography>Payment Processing</MDTypography>}
        </MDBox>
    </MDBox>
  )
}

export default PaymentStatus