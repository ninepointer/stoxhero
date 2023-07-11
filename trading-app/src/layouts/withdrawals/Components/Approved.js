import React, {useState, useEffect} from 'react'
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { apiUrl } from '../../../constants/constants';
import axios from 'axios';
import WithDrawalCard from './withDrawalCard';

const Approved = () => {
  const [approved, setApproved] = useState([]); 
  const [action, setAction] = useState(false); 
  const getApprovedWithdrawals = async() =>{
    const res = await axios.get(`${ apiUrl}withdrawals/approved`, {withCredentials: true});
    console.log(res.data.data)
    setApproved((prev)=>res.data.data);
  }
  useEffect(()=>{
    getApprovedWithdrawals()
  },[action])  
  return (
   <MDBox sx={{minHeight:'60vh'}}>
    {approved.length>0?
        approved.map((withdrawal)=><WithDrawalCard key={withdrawal._id} 
            amount={withdrawal.amount} user={withdrawal?.user} withdrawalRequestDate={withdrawal.withdrawalRequestDate}
            walletTransactionId={withdrawal.walletTransactionId}  withdrawalStatus={withdrawal.withdrawalStatus} 
            transactionId = {withdrawal.settlementTransactionId} withdrawalId={withdrawal?._id} action={action} setAction={setAction}
            transactionDocument={withdrawal.transactionDocument}
        />):<MDBox sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'60vh'}}>
        <MDTypography>
            No Approved Withdrawals
            </MDTypography> 
    </MDBox>
    }
   </MDBox>
  )
}

export default Approved