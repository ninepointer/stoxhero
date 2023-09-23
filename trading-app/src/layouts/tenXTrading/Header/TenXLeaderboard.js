import React, {useEffect, useState} from 'react';
import axios from "axios";
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import MDTypography from '../../../components/MDTypography';
import TenXLeaderboardData from '../data/tenXLeaderboard'
import WinnerImage from '../../../assets/images/TenXHeader.png'


export default function TenXLeaderboard({setClicked}) {
  const [cashBalance, setCashBalance] = React.useState(0);
  const [expiredTenXSubs,setExpiredTenXSubs] = useState([]);
  let [checkPayment, setCheckPayment] = useState(true);
  const [isLoading,setIsLoading] = useState(false)
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/userwallet/my`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
    .then((api1Response)=>{
      
      const cashTransactions = (api1Response?.data?.data)?.transactions?.filter((transaction) => {
        return transaction.transactionType === "Cash";
      });
      const totalCashAmount = cashTransactions?.reduce((total, transaction) => {
        return total + transaction?.amount;
      }, 0);
      setCashBalance(totalCashAmount);
    })
  }, [])

  useEffect(()=>{
    setIsLoading(true)
    let call2 = axios.get(`${baseUrl}api/v1/tenX/myexpiredsubscription`, {
      withCredentials:true
    })            
    Promise.all([call2])
    .then(([api2Response]) => {
      // Process the responses here
      setExpiredTenXSubs(api2Response.data.data);
      setTimeout(()=>{
        setIsLoading(false)
      },500)
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });


  },[checkPayment])

  return (
   
    <MDBox bgColor="dark" color="light" mt={0.5} borderRadius={10} style={{width:'100%'}}>
        <Grid container spacing={1} mb={1} style={{width:'100%'}}>
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' style={{width:'100%'}}>
                <MDBox style={{width:'100%'}}>
                    <TenXLeaderboardData/>
                </MDBox>
                </Grid>
        </Grid>
    </MDBox>
  );
}