import React, {useState} from 'react'
import MDBox from '../../../components/MDBox'
import MDButton from '../../../components/MDButton'
import MDTypography from '../../../components/MDTypography';
import axios from 'axios';
import { apiUrl } from '../../../constants/constants';
import ApproveModal from './approveModal';
import RejectModal from './rejectModal';
import MDSnackbar from '../../../components/MDSnackbar';

const KYCCard = ({user, action, setAction}) => {
  // const requestTime = new Date(KYCActionDate);
  // const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const[open,setOpen] = useState(false);
  const[openReject,setOpenReject] = useState(false);
  const [title,setTitle] = useState('')
    const [content,setContent] = useState('')
    const [rejectionReason,setRejectionReason] = useState('');
  
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
  // const localRequestTime = new Intl.DateTimeFormat('en-US', {
  //   year: 'numeric',
  //   month: 'long',
  //   day: '2-digit',
  //   hour: 'numeric',
  //   minute: 'numeric',
  //   second: 'numeric',
  //   hour12: true,
  //   timeZone: localTimeZone 
  // }).format(requestTime);
  const approve = async()=>{
    try{
      const res =await axios.patch(`${apiUrl}KYC/approve/${user?._id}`,{}, 
      {withCredentials:true});
      if(res.data.status == 'success'){
        openSuccessSB('Success', res.data.message);
        setAction(!action);
      }
    }catch(e){
      console.log(e);
      openErrorSB('Error', e.response.data.message);
    }
  }  
  const reject = async()=>{
    try{
      const res =await axios.patch(`${apiUrl}KYC/reject/${user?._id}`, {}, {withCredentials:true});
      if(res.data.status == 'success'){
        openSuccessSB('Success', res.data.message);
        setAction(!action);
      }
    }catch(e){
      console.log(e);
      openErrorSB('Error', e.response.data.message);
    }
  }  
  return (
    <MDBox style={{display:'flex', justifyContent:'space-between', marginBottom:'12px', padding:'12px', borderRadius:'16px', boxShadow:"0px 4px 6px -2px rgba(0, 0, 0, 0.5)"}}>
        <MDBox>
            <MDTypography style={{fontSize:'14px', marginBottom:'12px'}} >Name:{`${user?.first_name} ${user?.last_name}`}</MDTypography>
            <MDTypography style={{fontSize:'14px', marginBottom:'12px'}} >Phone: {user?.mobile}</MDTypography>
            <MDTypography style={{fontSize:'14px', marginBottom:'12px'}}>Aadhaar:{user?.aadhaarNumber}</MDTypography>
            <MDTypography style={{fontSize:'14px', marginBottom:'12px'}}>PAN:{user?.panNumber}</MDTypography>
            <MDTypography style={{fontSize:'14px', marginBottom:'12px'}}>KYC Action Date:{new Date(user?.KYCActionDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} {(new Date(user?.KYCActionDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata',hour12: true, timeStyle: 'medium' }).toUpperCase())}</MDTypography>
            <MDTypography style={{fontSize:'14px', marginBottom:'12px'}}>KYC Status:{user?.KYCStatus}</MDTypography>
            {user?.KYCStatus == 'Rejected' && <MDTypography style={{fontSize:'14px', marginBottom:'12px'}}>KYC Rejection Reason:{user?.KYCRejectionReason}</MDTypography>}
            <MDTypography style={{fontSize:'14px', marginBottom:'12px'}}>Aadhar front:<a href={user?.aadhaarCardFrontImage?.url} target='_blank'>Aadhar Front</a></MDTypography>
            <MDTypography style={{fontSize:'14px', marginBottom:'12px'}}>Pan:<a href={user?.panCardFrontImage?.url} target='_blank'>Pan Card</a></MDTypography>
            <MDTypography style={{fontSize:'16px', marginBottom:'12px', fontWeight:'700'}}>Payment Details</MDTypography>
            <MDBox sx={{display:'flex', justifyContent:'space-between'}}>
                <MDTypography style={{fontSize:'14px', marginBottom:'8px', marginRight:'16px'}}>UPI ID:{user?.upiId}</MDTypography>
                <MDTypography style={{fontSize:'14px', marginBottom:'8px',marginRight:'16px'}}>PhonePe:{user?.phonePe_number}</MDTypography>
                <MDTypography style={{fontSize:'14px', marginBottom:'8px',marginRight:'16px'}}>Gpay:{user?.googlePay_number}</MDTypography>
                <MDTypography style={{fontSize:'14px', marginBottom:'8px',marginRight:'16px'}}>PayTM:{user?.payTM_number}</MDTypography>
            </MDBox>
            <MDBox sx={{display:'flex', justifyContent:'space-between'}}>
                <MDTypography style={{fontSize:'14px', marginBottom:'8px', marginRight:'16px'}}>Bank Name:{user?.bankName}</MDTypography>
                <MDTypography style={{fontSize:'14px', marginBottom:'8px',marginRight:'16px'}}>Account Holder Name:{user?.nameAsPerBankAccount}</MDTypography>
                <MDTypography style={{fontSize:'14px', marginBottom:'8px',marginRight:'16px'}}>Ifsc:{user?.ifscCode}</MDTypography>
                <MDTypography style={{fontSize:'14px', marginBottom:'8px',marginRight:'16px'}}>Account No.:{user?.accountNumber}</MDTypography>
            </MDBox>       
        </MDBox>
        {(user?.KYCStatus == 'Pending Approval')&&<MDBox>
            <MDButton onClick={approve} color='success' sx={{marginRight:'6px'}}>Approve</MDButton>
            <MDButton onClick={()=>{setOpenReject(true)}} sx={{marginRight:'6px'}} color='error'>Reject</MDButton>
        </MDBox>}
       {/* {open && <ApproveModal open={open} handleClose={handleClose} user={user} amount={amount} action={action} setAction={setAction} withdrawalRequestDate={localRequestTime} withdrawalId={withdrawalId} />}  */}
       {openReject && <RejectModal open={openReject} handleClose={handleCloseReject} user={user} action={action} setAction={setAction} />} 
       {renderSuccessSB}
       {renderErrorSB}
       </MDBox>
  )
}

export default KYCCard