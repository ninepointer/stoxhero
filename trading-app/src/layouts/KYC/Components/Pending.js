import React, {useState, useEffect} from 'react'
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { apiUrl } from '../../../constants/constants';
import axios from 'axios';
import KYCCard from './KYCCard';

const Pending = () => {
  const [pending, setPending] = useState([]); 
  const [action, setAction] = useState(false); 
  const getPendingKYCs = async() =>{
    const res = await axios.get(`${ apiUrl}KYC/pendingapproval`, {withCredentials: true});
    console.log(res.data.data)
    setPending((prev)=>res.data.data);
  }
  useEffect(()=>{
    getPendingKYCs()
  },[action])  
  return (
   <MDBox sx={{minHeight:'60vh'}}>
    {pending.length>0?
        pending.map((doc)=><KYCCard key={doc._id} 
            user={doc}  action={action} setAction={setAction}
        />):<MDBox sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'60vh'}}>
        <MDTypography>
            No Pending KYCs
            </MDTypography> 
    </MDBox>
    }
   </MDBox>
  )
}

export default Pending