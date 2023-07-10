import React, {useState, useEffect} from 'react'
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { apiUrl } from '../../../constants/constants';
import axios from 'axios';
import WithDrawalCard from './withDrawalCard';

const Pending = () => {
  const [pending, setPending] = useState([]); 
  const [action, setAction] = useState(false); 
  const getPendingWithdrawals = async() =>{
    const res = await axios.get(`${ apiUrl}withdrawals/pending`, {withCredentials: true});
    console.log(res.data.data)
    setPending((prev)=>res.data.data);
  }
  useEffect(()=>{
    getPendingWithdrawals()
  },[action])  
  return (
   <MDBox sx={{minHeight:'60vh'}}>
    {pending.length>0?
        pending.map((withdrawal)=><WithDrawalCard key={withdrawal._id} 
            amount={withdrawal.amount} user={withdrawal?.user} withdrawalRequestDate={withdrawal.withdrawalRequestDate}
            walletTransactionId={withdrawal.walletTransactionId}  withdrawalStatus={withdrawal.withdrawalStatus}
            withdrawalId={withdrawal?._id} action={action} setAction={setAction}
        />):<MDBox sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'60vh'}}>
        <MDTypography>
            No Pending Withdrawals
            </MDTypography> 
    </MDBox>
    }
   </MDBox>
  )
}

export default Pending