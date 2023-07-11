import React, {useState, useEffect} from 'react'
import MDBox from '../../../components/MDBox';
import { apiUrl } from '../../../constants/constants';
import axios from 'axios';
import WithDrawalCard from './withDrawalCard';
import MDTypography from '../../../components/MDTypography';

const Initiated = () => {
  const [initiated, setInitiated] = useState([]); 
  const [action, setAction] = useState(false); 
  const getInitiatedWithdrawals = async() =>{
    const res = await axios.get(`${ apiUrl}withdrawals/initiated`, {withCredentials: true});
    console.log(res.data.data)
    setInitiated((prev)=>res.data.data);
  }
  useEffect(()=>{
    getInitiatedWithdrawals()
  },[action])  
  return (
   <MDBox sx={{minHeight:'60vh'}}>
    {initiated.length>0?
        initiated.map((withdrawal)=><WithDrawalCard key={withdrawal._id} 
            amount={withdrawal.amount} user={withdrawal?.user} withdrawalRequestDate={withdrawal.withdrawalRequestDate}
            walletTransactionId={withdrawal.walletTransactionId}  withdrawalStatus={withdrawal.withdrawalStatus}
            withdrawalId={withdrawal?._id} action={action} setAction={setAction}
        />):<MDBox sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'60vh'}}>
            <MDTypography>
                No Initiated Withdrawals
                </MDTypography> 
        </MDBox>
    }
   </MDBox>
  )
}

export default Initiated