import React, {useState} from 'react'
import MDBox from '../../../components/MDBox'
import MDButton from '../../../components/MDButton'
import MDTypography from '../../../components/MDTypography';
import axios from 'axios';
import { apiUrl } from '../../../constants/constants';
import ApproveModal from './approveModal';
import RejectModal from './rejectModal';

const WithDrawalCard = ({amount, withdrawalStatus, withdrawalRequestDate, user, walletTransactionId, withdrawalId, setAction, action, transactionId, transactionDocument, rejectionReason}) => {
  const requestTime = new Date(withdrawalRequestDate);
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const[open,setOpen] = useState(false);
  const[openReject,setOpenReject] = useState(false);
  const handleClose =() =>{
    setOpen(false);
  }
  const handleCloseReject =() =>{
    setOpenReject(false);
  }
  const handleOpenReject = (e) => {
    setOpenReject(true);
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
            <MDTypography style={{fontSize:'14px', marginBottom:'8px'}} >Name:{`${user?.first_name} ${user?.last_name}`}</MDTypography>
            <MDTypography style={{fontSize:'14px', marginBottom:'8px'}}>Amount:{amount}</MDTypography>
            <MDTypography style={{fontSize:'14px', marginBottom:'8px'}}>Status:{withdrawalStatus}</MDTypography>
            <MDTypography style={{fontSize:'14px', marginBottom:'8px'}}>Request Date:{localRequestTime}</MDTypography>
            <MDTypography style={{fontSize:'14px', marginBottom:'8px'}}>Wallet Transaction Id:{walletTransactionId}</MDTypography>
            <MDTypography style={{fontSize:'16px', marginBottom:'12px', fontWeight:'700'}}>Payment Details</MDTypography>
            <MDBox sx={{display:'flex', justifyContent:'space-between'}}>
                <MDTypography style={{fontSize:'14px', marginBottom:'8px', marginRight:'16px'}}>UPI ID:{user?.upiId}</MDTypography>
                <MDTypography style={{fontSize:'14px', marginBottom:'8px',marginRight:'16px'}}>PhonePe:{user?.phonePe_number}</MDTypography>
                <MDTypography style={{fontSize:'14px', marginBottom:'8px',marginRight:'16px'}}>Gpay:{user?.googlePay_number}</MDTypography>
                <MDTypography style={{fontSize:'14px', marginBottom:'8px',marginRight:'16px'}}>PayTM:{user?.payTM_number}</MDTypography>
            </MDBox>
            <MDBox sx={{display:'flex', justifyContent:'space-between'}}>
                <MDTypography style={{fontSize:'14px', marginBottom:'8px', marginRight:'16px'}}>Bank Name:{user?.bankName}</MDTypography>
                <MDTypography style={{fontSize:'14px', marginBottom:'8px',marginRight:'16px'}}>Account Name:{user?.nameAsPerBankAccount}</MDTypography>
                <MDTypography style={{fontSize:'14px', marginBottom:'8px',marginRight:'16px'}}>Ifsc:{user?.ifscCode}</MDTypography>
                <MDTypography style={{fontSize:'14px', marginBottom:'8px',marginRight:'16px'}}>Account No.:{user?.accountNumber}</MDTypography>
            </MDBox>
            {withdrawalStatus == 'Processed' && <MDTypography style={{fontSize:'14px', marginBottom:'8px'}}>Transfer Transaction Id:{transactionId}</MDTypography>}
            {withdrawalStatus == 'Processed' && <MDTypography style={{fontSize:'14px', marginBottom:'8px'}}>Transaction Document:<a href={transactionDocument} target="_blank">{transactionDocument}</a></MDTypography>}
            {withdrawalStatus == 'Rejected' && <MDTypography style={{fontSize:'14px', marginBottom:'8px'}}>Rejection Reason:{rejectionReason}</MDTypography>}
        </MDBox>
        {(withdrawalStatus == 'Pending' || withdrawalStatus == 'Initiated')&&<MDBox>
            <MDButton onClick={handleOpen} color='success' sx={{marginRight:'6px'}}>Approve</MDButton>
            {(withdrawalStatus == 'Pending') && <MDButton onClick={process} color='warning' sx={{marginRight:'6px'}} >Process</MDButton>}
            <MDButton onClick={handleOpenReject} sx={{marginRight:'6px'}} color='error'>Reject</MDButton>
        </MDBox>}
       {open && <ApproveModal open={open} handleClose={handleClose} user={user} amount={amount} action={action} setAction={setAction} withdrawalRequestDate={localRequestTime} withdrawalId={withdrawalId} />} 
       {openReject && <RejectModal open={openReject} handleClose={handleCloseReject} user={user} amount={amount} action={action} setAction={setAction} withdrawalRequestDate={localRequestTime} withdrawalId={withdrawalId} />} 
       </MDBox>
  )
}

export default WithDrawalCard