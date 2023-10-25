import React, {useState, useEffect} from 'react'
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { apiUrl } from '../../../constants/constants';
import axios from 'axios';
import KYCCard from './KYCCard';

const Rejected = () => {
  const [rejected, setRejected] = useState([]); 
  const [action, setAction] = useState(false); 
  const getRejectedKYCs = async() =>{
    const res = await axios.get(`${ apiUrl}KYC/rejected`, {withCredentials: true});
    console.log(res.data.data)
    setRejected((prev)=>res.data.data);
  }
  useEffect(()=>{
    getRejectedKYCs()
  },[action])  
  return (
   <MDBox sx={{minHeight:'60vh'}}>
    {rejected.length>0?
        rejected.map((doc)=><KYCCard key={doc._id} 
            user={doc} action={action} setAction={setAction}
        />):<MDBox sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'60vh'}}>
        <MDTypography>
            No Rejected KYCs
            </MDTypography> 
    </MDBox>
    }
   </MDBox>
  )
}

export default Rejected