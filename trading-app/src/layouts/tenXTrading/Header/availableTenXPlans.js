import React, {useEffect, useState} from 'react';
import axios from "axios";
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import MDTypography from '../../../components/MDTypography';
import beginner from '../../../assets/images/beginner.png'
import intermediate from '../../../assets/images/intermediate.png'
import pro from '../../../assets/images/pro.png'
import checklist from '../../../assets/images/checklist.png'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialogue from './dialogueBox';
import SubscriptionCard from '../data/subscriptionCard'
import WinnerImage from '../../../assets/images/TenXHeader.png'


export default function TenXSubscriptions({setClicked}) {
  const [cashBalance, setCashBalance] = React.useState(0);
  const [activeTenXSubs,setActiveTenXSubs] = useState([]);
  const [currentTenXSubs,setCurrentTenXSubs] = useState([]);
  let [checkPayment, setCheckPayment] = useState(true)
  const [isLoading, setIsLoading] = useState(false); 
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

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
    let call1 = axios.get(`${baseUrl}api/v1/tenx/active`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    let call2 = axios.get(`${baseUrl}api/v1/tenX/myactivesubscription`, {
      withCredentials:true
    })            
    Promise.all([call1, call2])
    .then(([api1Response, api2Response]) => {
      // Process the responses here
      // setActiveTenXSubs(api1Response.data.data.filter(obj1 => !api2Response.data.data.some(obj2 => JSON.stringify(obj1) === JSON.stringify(obj2))));
      setActiveTenXSubs(api1Response.data.data);
      setCurrentTenXSubs(api2Response.data.data);
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
    {isLoading ?
        <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
            <CircularProgress color='info' />
        </MDBox>
        :
    <>
    {activeTenXSubs?.length > 0 ?
        <Grid container spacing={1} mb={1}>
            {
            activeTenXSubs?.map((elem,index)=>(
                <Grid item key={elem._id} xs={12} md={6} lg={4}>
                <MDBox>
                    <SubscriptionCard subscription={elem} checkPayment={checkPayment} setCheckPayment={setCheckPayment} amount={elem.discounted_price} name={elem.plan_name} id={elem._id} walletCash={cashBalance} allowRenewal={elem.allowRenewal}/>
                </MDBox>
                </Grid>
            ))
            }
        </Grid>
        :
        <MDBox style={{minHeight:"20vh"}} border='1px solid white' borderRadius={5} display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
            <img src={WinnerImage} width={50} height={50}/>
            <MDTypography color="light" fontSize={15} mb={1}>No Active TenX Subscription(s)</MDTypography>
            <MDButton color="info" size='small' fontSize={10}  onClick={()=>{setClicked("live")}}>Check Available TenX Subscriptions</MDButton>
        </MDBox>
    }
    </>}
    </MDBox>
  );
}