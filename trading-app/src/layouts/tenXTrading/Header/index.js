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


export default function TenXSubscriptions() {
  const [cashBalance, setCashBalance] = React.useState(0);
  // const [open, setOpen] = React.useState(false);
  // const [isLoading,setIsLoading] = useState(false);
  const [activeTenXSubs,setActiveTenXSubs] = useState([]);
  const [isLoading,setIsLoading] = useState(true);
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
      setTimeout(() => {
        setIsLoading(false); // Set loading state to false when data is fetched
      }, 500);
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
      setTimeout(() => {
        setIsLoading(false); // Set loading state to false when data is fetched
      }, 500);
    
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });


  },[])

  console.log("cashBalance", cashBalance)

  return (
    <>
    {
      isLoading ?<MDBox bgColor="dark" mt={2} mb={2} p={2} height="80vh" borderRadius={10}> <MDBox display="flex" justifyContent="center" sx={{position:"absolute",right:{xs:"150px",md:"380px",lg:"600px"},top:"350px"}}> <CircularProgress style={{height:"90px",width:"90px", color:"#fff"}} /></MDBox></MDBox>
      :
   
    <MDBox bgColor="dark"  color="light" mt={2} mb={2} p={2} borderRadius={10}>

      

    <MDBox display="flex" justifyContent='center' flexDirection='column' mb={2} mt={1}>
      <MDTypography fontSize={20} mb={1} fontWeight='bold' color="light">What is TenX Trading / TenX ट्रेडिंग क्या है?</MDTypography>
      <MDBox bgColor="white" p={2} mb={1} borderRadius={5} boxShadow="0px 4px 10px rgba(0, 0, 0, 0.15)">
        <MDTypography fontSize={15} fontWeight='bold' color="dark">
          <span style={{fontWeight:'bold', fontSize:20}}>TenX</span> gives every trader an opportunity to make a profit with <span style={{fontWeight:'bold', fontSize:20}}>0 (Zero) capital.</span> You just have 
          to start trading using the virtual currency (i.e. margin money) provided by StoxHero. After 
          20 days of active trading, <span style={{fontWeight:'bold', fontSize:20}}>we'll transfer 10%</span> of the net profit (the real money) to your wallet.
          And the cycle repeats. Yes, you heard it right. Don't miss out on the opportunity to learn and 
          potentially earn real money through virtual currency trading, with the ultimate goal of becoming 
          a successful trader, a StoxHero. Your trader's journey starts now.
        </MDTypography>
      </MDBox>
      <MDBox bgColor="white" p={2} mb={1} mt={1} borderRadius={5} boxShadow="0px 4px 10px rgba(0, 0, 0, 0.15)">
        <MDTypography fontSize={15} fontWeight='bold' color="dark">
          <span style={{fontWeight:'bold', fontSize:20}}>TenX</span> हर ट्रेडर को वास्तविक पैसे कमाने का मौका देता है 
          जहां उपभोक्ता को <span style={{fontWeight:'bold', fontSize:20}}>0 (शून्य) पूंजी</span> के साथ लाभ कमाने का मौका मिलता है। आपको सिर्फ StoxHero द्वारा प्रदान की जाने वाली 
          वर्चुअल मुद्रा (अर्थात मार्जिन पैसे) का उपयोग करके ट्रेडिंग शुरू करनी होगी। सक्रिय ट्रेडिंग के 20 दिनों के बाद, हम आपके <span style={{fontWeight:'bold', fontSize:20}}> वॉलेट में 10% </span>
          नेट लाभ (वास्तविक पैसे) स्थानांतरित करेंगे। और यह प्रक्रिया दोहराती रहेगी। हाँ, आपने सही सुना है। वास्तविक मुद्रा ट्रेडिंग के माध्यम से 
          सीखने और संभावित रूप से वास्तविक पैसे कमाने का यह मौका न छोड़ें, जहां अंतिम लक्ष्य है सफल ट्रेडर बनना, एक स्टॉक्सहीरो। आपकी 
          ट्रेडर की यात्रा अब शुरू होती है।
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
                plan5: elem.features[4]?.description,
              })}
              </Card>
            </Grid>
          ))
          }
          
      </Grid>
        
      

    </MDBox>
}
    </>
  );
}