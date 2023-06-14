import React, { useEffect, useState } from 'react'
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { apiUrl } from '../../../constants/constants';
import {CircularProgress } from '@mui/material'; 
import axios from 'axios';
import moment from 'moment';
import {Grid} from '@mui/material';
// import MDAvatar from '../../../components/MDAvatar';
import MDButton from '../../../components/MDButton';
// import checklist from '../../../assets/images/checklist.png';
// import CardContent from '@mui/material/CardContent';
import { useNavigate} from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


const Workshops = () => {
  const [currentworkshop, setCurrentWorkshop] = useState();
  const Navigate = useNavigate();
  const [workshops, setWorkshops] = useState();
  const[isLoading, setIsLoading] = useState(true);  
  const [serverTime, setServerTime] = useState();
  // const navigate = useNavigate();

  useEffect(()=>{
    fetchData();
  },[])

  const fetchData = async() => {
    const res = await axios.get(`${apiUrl}internbatch/currentworkshop`, {withCredentials: true});
    console.log(res.data);
    if(Object.keys(res.data.data).length!=0){
        setCurrentWorkshop(res.data.data);
    }
    const resp = await axios.get(`${apiUrl}internbatch/workshops`, {withCredentials: true});
        console.log(resp.data);
        if(Object.keys(resp.data.data).length!=0){
            setWorkshops(resp.data.data.filter((item)=>item._id!=res.data.data?._id));
        }
        setIsLoading(false);
    const res2 = await axios.get(`${apiUrl}servertime`)
        setServerTime(res2.data.data)
  }

  console.log("Checking dates:",currentworkshop?.batchStartDate, serverTime)
  
  return (
    <MDBox bgColor="dark" color="light" mt={0} mb={0} p={1} borderRadius={10} minHeight='auto' >
        
        <MDBox display="flex" justifyContent='center' flexDirection='column' mb={1}>
          <Grid item xs={12} md={6} lg={12}>
          <MDTypography fontSize={15} mb={1} fontWeight='bold' color="light">What is StoxHero Workshop?</MDTypography>
          <MDBox bgColor="white" p={2} mb={1} borderRadius={5} boxShadow="0px 4px 10px rgba(0, 0, 0, 0.15)">
            <MDTypography fontSize={12} fontWeight='bold' color="dark">
              Welcome to our Options Trading Workshop: Unleash the Power of Knowledge! 
              This intensive workshop focuses on providing participants with a solid understanding 
              of the basics and benefits of options trading. Whether you're a novice or an 
              experienced trader, this workshop is designed to enhance your skills and boost 
              your trading performance.
            </MDTypography>
          </MDBox>
          </Grid>
        </MDBox>

        <Grid container spacing={1} mb={1}>
          <Grid item xs={12} md={6} lg={12}>
          <MDBox bgColor="white" p={2} borderRadius={5} boxShadow="0px 4px 10px rgba(0, 0, 0, 0.15)" width='100%'>
            <MDTypography fontSize={15} fontWeight='bold' color="dark">
              Perks & Benefits of StoxHero Workshop
            </MDTypography>
            <MDTypography fontSize = {12}>1. During the workshop, you'll receive comprehensive training on the fundamentals of options trading.</MDTypography> 
            <MDTypography fontSize = {12}>2. Our expert instructors will guide you through various strategies, risk management techniques, and market analysis methods.</MDTypography>
            <MDTypography fontSize = {12}>3. With access to the Stoxhero platform, you'll be able to apply your knowledge and execute trades in real-time.</MDTypography>
            <MDTypography fontSize = {12}>4. Gain practical experience as you navigate the platform's features, place trades, and manage positions.</MDTypography>
            <MDTypography fontSize = {12}>5. At the end of the trading session, your performance will be evaluated based on your profit and loss (P&L).</MDTypography>
            <MDTypography fontSize = {12}>6. To recognize outstanding achievements, we will award special certificates to the top three participants with the highest P&Ls.</MDTypography> 
            <MDTypography fontSize = {12}>7. Rest of the participants will receive well-deserved participation certificates.</MDTypography>    
          </MDBox>   
          </Grid>           
        </Grid>
        
        
        <MDBox>
            <MDTypography fontSize={15} ml={1} color='white'>
                Registered Workshop(s)
            </MDTypography>
            <MDBox minHeight='auto'>
            {isLoading ? 
          
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="white" />
          </MDBox>
          :
           currentworkshop ? 
           <MDBox mt={1}>
            <Card name={currentworkshop?.career?.jobTitle} goTo='/internship/trade' 
                state={currentworkshop._id} startDate= {moment.utc(currentworkshop?.batchStartDate).utcOffset('+05:30').format('DD-MMM-YY HH:mm a')}
                endDate={moment.utc(currentworkshop?.batchEndDate).utcOffset('+05:30').format('DD-MMM-YY HH:mm a')}
                buttonText='Start Trading' disabled={currentworkshop?.batchStartDate >= serverTime}/> 
                </MDBox> :
           <MDBox display="flex" flexDirection='column' mb={2} justifyContent="center" alignItems="center" mt={2} minHeight='auto' border='1px solid white' borderRadius='12px'>
           <MDTypography fontSize={15} mb={2} mt={2} color='light'>You don't have any upcoming registered workshop(s)</MDTypography>
           <MDButton variant='outlined' color='light' style={{marginBottom:20}} fontSize={15} onClick={()=>{window.open('/workshops','_blank')}}>Apply for workshops here</MDButton> 
          </MDBox>  
          }
            </MDBox>
        </MDBox>
        <MDBox>
            <MDTypography fontSize={15} ml={1} color='white'>
                Attended Workshop(s)
            </MDTypography>
            <MDBox minHeight='auto'>
            {isLoading ? 
          
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5} minHeight='auto'>
            <CircularProgress color="white" />
          </MDBox>
          :
           workshops?.length>0 ? 
           <MDBox mt={1}>
            {workshops?.map((workshop)=>{
                return <Card goTo='/workshop/orders' name ={workshop?.career?.jobTitle} startDate={moment.utc(workshop?.batchStartDate).utcOffset('+05:30').format('DD-MMM-YY HH:mm a')} 
                endDate={moment.utc(workshop?.batchEndDate).utcOffset('+05:30').format('DD-MMM-YY HH:mm a')}
                buttonText='View Details' state={workshop._id}/>
            })}
           </MDBox> 
            :
           <MDBox display="flex" justifyContent="center" alignItems="center" mt={1} mb={2} minHeight='15vH' border='1px solid white' borderRadius='12px'> 
            <MDTypography fontSize={15} color='white'>You have not attended any workshops yet!</MDTypography>
           </MDBox>  
          }
            </MDBox>
        </MDBox>
    </MDBox>
  )
}

const Card = ({name, goTo, state, startDate, endDate, buttonText, disabled})=> {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Grid xs={12} lg={12} mb={1}>
        <MDBox color='black' bgColor='white' minHeight='auto' p={2} width='100%' minWidth='100%' borderRadius='12px'>
        <MDBox display='flex' flexDirection={isMobile ? 'column' : 'row'} justifyContent='space-between' alignItems='center'>
                    <Grid xs={12} xl={3}>
                        <MDTypography fontSize={15} fontWeight='bold'>{name}</MDTypography>
                    </Grid>
                    <Grid xs={12} xl={3}>
                        <MDTypography fontSize={12}>Start Time:{startDate}</MDTypography>
                    </Grid>
                    <Grid xs={12} xl={3}>    
                        <MDTypography fontSize={12}>End Time:{endDate}</MDTypography>
                    </Grid>
                    <Grid xs={12} xl={3}>    
                <MDButton variant='outlined' disabled={disabled} color='info' onClick={()=>{navigate(goTo, {state:{batchId:state}})}}>{buttonText}</MDButton>
                </Grid>
            </MDBox>
        </MDBox>
        </Grid>

  )}
export default Workshops