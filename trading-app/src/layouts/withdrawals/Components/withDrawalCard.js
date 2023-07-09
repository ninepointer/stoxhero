import React, {useState} from 'react'
import MDBox from '../../../components/MDBox'
import MDButton from '../../../components/MDButton'
import MDTypography from '../../../components/MDTypography';
import axios from 'axios';
import { apiUrl } from '../../../constants/constants';
import ApproveModal from './approveModal';

const WithDrawalCard = ({amount, withdrawalStatus, withdrawalRequestDate, user, walletTransactionId, withdrawalId, setAction, action}) => {
  const requestTime = new Date(withdrawalRequestDate);
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const[open,setOpen] = useState(false);
  const handleClose =() =>{
    setOpen(false);
  }
  const handleOpen = (e) => {
    setOpen(true);
  }
  const localRequestTime = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
    timeZone: localTimeZone 
  }).format(requestTime);
  const approve = async()=>{
    const res =await axios.patch(`${apiUrl}withdrawals/approve/${withdrawalId}`, 
    {transactionId: 'abc', settlementMethod:'UPI', settlementAccount:'10114567'}, {withCredentials:true});
    if(res.data.status == 'success'){
        setAction(!action);
    }
  }  
  const reject = async()=>{
    const res =await axios.patch(`${apiUrl}withdrawals/reject/${withdrawalId}`, {}, {withCredentials:true});
    if(res.data.status == 'success'){
        setAction(!action);
    }
  }  
  const process = async()=>{
    const res =await axios.patch(`${apiUrl}withdrawals/process/${withdrawalId}`,{}, {withCredentials:true} );
    if(res.data.status == 'success'){
        setAction(!action);
    }
  }  
  return (
    <MDBox style={{display:'flex', justifyContent:'space-between', marginBottom:'12px', padding:'12px', borderRadius:'16px', boxShadow:"0px 4px 6px -2px rgba(0, 0, 0, 0.5)"}}>
        <MDBox>
            <MDTypography style={{fontSize:'14px', marginBottom:'12px'}} >Name:{`${user?.first_name} ${user?.last_name}`}</MDTypography>
            <MDTypography style={{fontSize:'14px', marginBottom:'12px'}}>Amount:{amount}</MDTypography>
            <MDTypography style={{fontSize:'14px', marginBottom:'12px'}}>Status:{withdrawalStatus}</MDTypography>
            <MDTypography style={{fontSize:'14px', marginBottom:'12px'}}>Request Date:{localRequestTime}</MDTypography>
            <MDTypography style={{fontSize:'14px', marginBottom:'12px'}}>Wallet Transaction Id:{walletTransactionId}</MDTypography>
        </MDBox>
        {(withdrawalStatus == 'Pending' || withdrawalStatus == 'Initiated')&&<MDBox>
            <MDButton onClick={handleOpen} color='success' sx={{marginRight:'6px'}}>Approve</MDButton>
            {(withdrawalStatus == 'Pending') && <MDButton onClick={process} color='warning' sx={{marginRight:'6px'}} >Process</MDButton>}
            <MDButton onClick={reject} sx={{marginRight:'6px'}} color='error'>Reject</MDButton>
        </MDBox>}
       {open && <ApproveModal open={open} handleClose={handleClose} user={user} amount={amount} action={action} setAction={setAction} withdrawalRequestDate={localRequestTime} withdrawalId={withdrawalId} />} 
    </MDBox>
  )
}

export default WithDrawalCard