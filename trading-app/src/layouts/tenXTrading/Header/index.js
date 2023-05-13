import React, {useEffect, useState} from 'react';
import axios from "axios";
import { userContext } from '../../../AuthContext';
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import MDTypography from '../../../components/MDTypography';
import tradesicon from '../../../assets/images/tradesicon.png'
import beginner from '../../../assets/images/beginner.png'
import intermediate from '../../../assets/images/intermediate.png'
import pro from '../../../assets/images/pro.png'
import checklist from '../../../assets/images/checklist.png'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Subs from '../../../assets/images/subs.png';
import Dialogue from './dialogueBox';


export default function TenXSubscriptions() {
  const [cashBalance, setCashBalance] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const [activeTenXSubs,setActiveTenXSubs] = useState([]);
  const getDetails = React.useContext(userContext);
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

  const card = (props)=> {

    return (
    <React.Fragment>
      <CardContent sx={{height: 'auto', flex:1 ,padding:2}} justifyContent="center">
        <MDBox mb={-3}>
        
          <MDBox bgColor={props.color} p={1} mb={2} sx={{height:"auto",boxShadow:("box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15)"),borderRadius:"10px"}}>
  
            <Grid  container spacing={1} justifyContent="center" alignItems="center">
              <Grid item xs={12} mt={1}>
                <MDBox display="flex"  pl={2}justifyContent="left" alignItems="center" flexDirection='row'>
                  <MDAvatar 
                    src={props.icon} 
                    size="small" 
                    style={{
                      border: '2px solid lightgray'
                    }}
                  />
                  <MDTypography fontSize={25} color='light' ml={1} fontWeight="bold">
                    {props.plan}
                  </MDTypography>
                </MDBox>
              </Grid>
            </Grid>
  
            <MDBox p={2} pl={3} pr={3}>
              <MDTypography mb={1} fontFamily="Lucida Sans" fontWeight="bold" variant="body2" color="light" display='flex' justifyContent='left' alignItems='center'>
                <MDAvatar 
                  src={checklist} 
                  size="xs" 
                />
                <MDTypography fontSize={12} color='light' fontWeight='bold'> {props.plan1}</MDTypography>
              </MDTypography>
  
              <MDTypography mb={1} fontFamily="Lucida Sans" fontWeight="bold" variant="body2" color="light" display='flex' justifyContent='left' alignItems='center'>
                <MDAvatar 
                    src={checklist} 
                    size="xs" 
                  />
                <MDTypography fontSize={12} color='light' fontWeight='bold'> {props.plan2}</MDTypography>
              </MDTypography>
  
              <MDTypography mb={1} fontFamily="Lucida Sans" fontWeight="bold" variant="body2" color="light" display='flex' justifyContent='left' alignItems='center'>
                <MDAvatar 
                  src={checklist} 
                  size="xs" 
                />
                <MDTypography fontSize={12} color='light' fontWeight='bold'> {props.plan3}</MDTypography>
              </MDTypography>
  
              <MDTypography mb={1} fontFamily="Lucida Sans" fontWeight="bold" variant="body2" color="light" display='flex' justifyContent='left' alignItems='center'>
                <MDAvatar 
                  src={checklist} 
                  size="xs" 
                />
                <MDTypography fontSize={12} color='light' fontWeight='bold'> {props.plan4}</MDTypography>
              </MDTypography>
            </MDBox>
  
          </MDBox>
  
  
          <MDBox p={1}  borderTop="1px dotted #1A73E8" display='flex' justifyContent="space-between" alignItems='center' flexDirection='row'>
  
            <MDBox display='flex' justifyContent='center' alignItems='center'>
              <MDTypography 
                mr={1}  
                sx={{ fontSize: 18, fontWeight:'bold', textDecoration: "line-through", textDecorationColor: "gold", textDecorationThickness: "1px" }}  
                gutterBottom
                lineHeight={0}
                color='dark'
              >
                ₹{props.price}
              </MDTypography>
              <MDTypography sx={{ fontSize: 25 }} fontWeight="bold" color="dark" gutterBottom>
                ₹{props.discountPrice}
              </MDTypography>
              <MDTypography color='dark' style={{fontSize:"15px", lineHeight:4.5}}>{props.upto}</MDTypography>
            </MDBox>
            
            <Dialogue amount={props.actual_discountPrice} name={props.plan} id={props.id} walletCash={cashBalance} />


          
          </MDBox>
  
        </MDBox>
         
      </CardContent>
      
     
    </React.Fragment>
  
  )}



  useEffect(()=>{
  

    let call1 = axios.get(`${baseUrl}api/v1/tenx/active`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })

    Promise.all([call1])
    .then(([api1Response]) => {
      // Process the responses here
      console.log(api1Response.data.data);
      setActiveTenXSubs(api1Response.data.data)
    
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });


  },[])

  console.log("cashBalance", cashBalance)

  return (
   
    <MDBox bgColor="dark" color="light" mt={2} mb={2} p={2} borderRadius={10}>

    <MDBox display="flex" justifyContent='center' flexDirection='column' mb={2} mt={1}>
      <MDTypography fontSize={20} mb={1} fontWeight='bold' color="light">What is TenX Trading / TenX ट्रेडिंग क्या है?</MDTypography>
      <MDBox bgColor="white" p={2} mb={1} borderRadius={5} boxShadow="0px 4px 10px rgba(0, 0, 0, 0.15)">
        <MDTypography fontSize={15} fontWeight='bold' color="dark">
          <span style={{fontWeight:'bold', fontSize:20}}>TenX</span> is a unique program that gives every trader (beginner or experienced) 
          an opportunity to make a profit at <span style={{color:'red'}}>0 (Zero) capital</span>. You start trading using 
          virtual currency of a specific value (margin money) provided by StoxHero. 
          After 20 days of trading, if you've made a profit, <span style={{color:'red'}}>we'll transfer 10% of 
          the net profit amount to your wallet</span>. Yes, you heard it right. You have 
          a chance to earn real money, with virtual currency while learning & improving 
          your trading skills. Don’t miss it. Start trading now!
        </MDTypography>
      </MDBox>
      <MDBox bgColor="white" p={2} mb={1} mt={1} borderRadius={5} boxShadow="0px 4px 10px rgba(0, 0, 0, 0.15)">
        <MDTypography fontSize={15} fontWeight='bold' color="dark">
          <span style={{fontWeight:'bold', fontSize:20}}>TenX</span> एक अनोखा कार्यक्रम है जो प्रत्येक ट्रेडर (शुरुआती या अनुभवी) को <span style={{color:'red'}}>0 (शून्य) पूंजी</span> पर लाभ कमाने का अवसर देता है। आप स्टॉक्सहेरो द्वारा प्रदान किए गए एक विशिष्ट मूल्य (मार्जिन मनी)
          की आभासी मुद्रा का उपयोग करके व्यापार करना शुरू करते हैं। 20 दिनों के व्यापार के बाद, यदि आपने लाभ कमाया है, 
          <span style={{color:'red'}}> तो हम शुद्ध लाभ राशि का 10% आपके बटुए में स्थानांतरित कर देंगे।</span> हां, 
          आपने इसे सही सुना। आपके पास अपने व्यापारिक कौशल सीखने और सुधारने के दौरान आभासी मुद्रा के साथ वास्तविक पैसा कमाने का 
          मौका है। इसे याद मत करो अभी ट्रेडिंग शुरू करें!
        </MDTypography>
      </MDBox>
    </MDBox>
          
    <Grid container spacing={3} mb={1}>
         {

          activeTenXSubs?.map((elem,index)=>(
            <Grid item key={elem._id} xs={12} md={6} lg={4}>
              
              <Card style={{background:"#fff"}} variant="outlined">
              {card({
                id: elem._id,
                plan: elem.plan_name,
                color: elem.plan_name === 'Beginner' ? 'info' : elem.plan_name === 'Intermediate' ? 'success' : 'error',
                icon: elem.plan_name === 'Beginner' ? beginner : elem.plan_name === 'Intermediate' ? intermediate : pro,
                price: elem.actual_price+"/-",
                // upto: "/"+elem.validity+" trading "+elem.validityPeriod,
                discount: "₹",
                discountPrice: elem.discounted_price+"/-",
                actual_discountPrice: elem.discounted_price,
                validity: elem.validity,
                validityPeriods: elem.validity+" trading "+elem.validityPeriod,
                plan1: elem?.features[0]?.description,
                plan2: elem.features[1]?.description,
                plan3: elem.features[2]?.description,
                plan4: elem.features[3]?.description,
                // buyFunc: buySubscription(elem.discounted_price, elem.plan_name)
              })}
              </Card>
            </Grid>
          ))
          }
          
      </Grid>

    </MDBox>
  );
}