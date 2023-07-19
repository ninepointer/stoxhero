import React,{useState, useEffect} from 'react'
import MDBox from '../../components/MDBox'
import MDTypography from '../../components/MDTypography'
import DataTable from '../../examples/Tables/DataTable';
import { Grid } from '@mui/material';
import { apiUrl } from '../../constants/constants';
import axios from 'axios';
import ContactInfoCard from './components/contactInfoCard';
const ContactInfo = () => {
    const [contactInfos, setContactInfos] = useState([]);
    const getAllContactInfo = async () =>{
        const res = await axios.get(`${apiUrl}contactus`,{withCredentials:true});
        console.log(res.data.data);
        setContactInfos(res.data.data);
    }
    useEffect(()=>{
        getAllContactInfo();
    },[])
     
  return (
    <Grid container>
        <MDBox style={{minHeight:'85vh'}}>
            <MDTypography style={{marginTop:'14px', fontWeight:'700'}}>
                Inbound Messages
            </MDTypography>
            <MDBox>
                {contactInfos.map((item)=>{
                    return(
                        <ContactInfoCard contactInfo={item}/>
                    )
                })}
            </MDBox>
        </MDBox>
    </Grid>
  )
}

export default ContactInfo