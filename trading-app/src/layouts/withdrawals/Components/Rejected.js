import React, {useState, useEffect} from 'react'
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { apiUrl } from '../../../constants/constants';
import axios from 'axios';
import WithDrawalCard from './withDrawalCard';

const Rejected = () => {
  const [rejected, setRejected] = useState([]); 
  const [action, setAction] = useState(false); 
  const getRejectedWithdrawals = async() =>{
    const res = await axios.get(`${ apiUrl}withdrawals/rejected`, {withCredentials: true});
    console.log(res.data.data)
    setRejected((prev)=>res.data.data);
  }
  useEffect(()=>{
    getRejectedWithdrawals()
  },[action])  
  return (
   <MDBox sx={{minHeight:'60vh'}}>
    {rejected.length>0?
        rejected.map((withdrawal)=><WithDrawalCard key={withdrawal._id} 
            amount={withdrawal.amount} user={withdrawal?.user} withdrawalRequestDate={withdrawal.withdrawalRequestDate}
            walletTransactionId={withdrawal.walletTransactionId}  withdrawalStatus={withdrawal.withdrawalStatus}
            withdrawalId={withdrawal?._id} action={action} setAction={setAction}
        />):<MDBox sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'60vh'}}>
        <MDTypography>
            No Rejected Withdrawals
            </MDTypography> 
    </MDBox>
    }
   </MDBox>
  )
}

export default Rejected