import React, {useEffect, useState} from 'react';
import axios from "axios";
// import { userContext } from '../../../AuthContext';
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
// import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import MDTypography from '../../../components/MDTypography';
// import tradesicon from '../../../assets/images/tradesicon.png'
import beginner from '../../../assets/images/beginner.png'
import intermediate from '../../../assets/images/intermediate.png'
import pro from '../../../assets/images/pro.png'
import checklist from '../../../assets/images/checklist.png'
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';

// import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import CheckIcon from '@mui/icons-material/Check';
// import CloseIcon from '@mui/icons-material/Close';
// import Subs from '../../../assets/images/subs.png';
import Dialogue from './dialogueBox';
import MDButton from '../../../components/MDButton';
import { useNavigate } from 'react-router-dom';


export default function TenXSubscriptions() {
  const [cashBalance, setCashBalance] = React.useState(0);
  const navigate = useNavigate();
  // const [open, setOpen] = React.useState(false);
  // const [isLoading,setIsLoading] = useState(false);
  const [activeTenXSubs,setActiveTenXSubs] = useState([]);
  // const getDetails = React.useContext(userContext);
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
              <MDTypography mb={1} fontFamily="Lucida Sans" fontWeight="bold" variant="body2" color="light" display='flex' justifyContent='left' alignItems='center'>
                <MDAvatar 
                  src={checklist} 
                  size="xs" 
                />
                <MDTypography fontSize={12} color='light' fontWeight='bold'> {props.plan5}</MDTypography>
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
   
    <MDBox bgColor="dark" color="light" mt={2} mb={2} p={2} borderRadius={10} minHeight='65vh' >

    <MDBox display="flex" justifyContent='center' flexDirection='column' mb={1} mt={1}>
      <MDTypography fontSize={20} mb={1} fontWeight='bold' color="light">What is StoxHero Internship?</MDTypography>
      <MDBox bgColor="white" p={2} mb={1} borderRadius={5} boxShadow="0px 4px 10px rgba(0, 0, 0, 0.15)">
        <MDTypography fontSize={15} fontWeight='bold' color="dark">
            Welcome to the StoxHero Derivatives Trader Internship Program!
            At StoxHero, we believe in nurturing and developing the next generation of derivatives traders. Our internship program is designed to provide you with a comprehensive learning experience that will sharpen your skills, deepen your understanding of the financial markets, and prepare you for a successful career in derivatives trading. 
            At the successful completion of your internship, you will receive a valuable internship certificate from StoxHero. This certificate recognizes your dedication, knowledge, and practical skills gained during your internship.
            Best of luck, and let's make this internship experience remarkable together!
        </MDTypography>
      </MDBox>
    </MDBox>
          
    <Grid container spacing={3} mb={1} mt={0}>
      <MDBox bgColor="white" p={2} borderRadius={5} boxShadow="0px 4px 10px rgba(0, 0, 0, 0.15)" mb={2} mt={1} ml={3} width='100%'>
        <MDTypography fontSize={18} fontWeight='bold' color="dark">
          Rules for completion of Internship
        </MDTypography>
        <MDTypography fontSize = {15}>1. You must accept and abide by the terms of usage.</MDTypography>
        <MDTypography fontSize = {15}>2. You must take trades on 80 percent of the trading days during the internship period.</MDTypography>
        <MDTypography fontSize = {15}>3. You must not partake in any malpractices or manipulation.</MDTypography>
        <MDTypography fontSize = {15}>4. It is preferred if you refer more people to the platform.</MDTypography>
        <MDTypography></MDTypography>
      </MDBox>
      <MDBox width='100%'>
        <MDButton variant="contained" color="success" sx={{width: "60%", height: "20px", fontSize: "500x" , margin: '0 20%'}} onClick={()=>{navigate(`/internship/trade`)}} size='small'>Start Trading</MDButton>
      </MDBox>               
    </Grid>

    </MDBox>
  );
}