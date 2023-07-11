import React, {useState, useEffect} from 'react'
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { apiUrl } from '../../../constants/constants';
import axios from 'axios';
import KYCCard from './KYCCard';

const Approved = () => {
  const [approved, setApproved] = useState([]); 
  const [action, setAction] = useState(false); 
  const getApprovedKYCs = async() =>{
    const res = await axios.get(`${ apiUrl}KYC/approved`, {withCredentials: true});
    console.log(res.data.data)
    setApproved((prev)=>res.data.data);
  }
  useEffect(()=>{
    getApprovedKYCs()
  },[action])  
  return (
   <MDBox sx={{minHeight:'60vh'}}>
    {approved.length>0?
        approved.map((kyc)=><KYCCard key={kyc._id} 
           user={kyc}
        />):<MDBox sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'60vh'}}>
        <MDTypography>
            No Approved KYCs
            </MDTypography> 
    </MDBox>
    }
   </MDBox>
  )
}

export default Approved