import React, { useEffect, useState } from 'react'
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { apiUrl } from '../../../constants/constants';
import {CircularProgress } from '@mui/material'; 
import axios from 'axios';
import {Grid} from '@mui/material';
import MDAvatar from '../../../components/MDAvatar';
import MDButton from '../../../components/MDButton';
import checklist from '../../../assets/images/checklist.png';
import CardContent from '@mui/material/CardContent';
import { useNavigate} from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ...



const Workshops = () => {
  const [currentworkshop, setCurrentWorkshop] = useState();
  const Navigate = useNavigate();
  const [workshops, setWorkshops] = useState();
  const[isLoading, setIsLoading] = useState(true);  
//   useEffect(()=>{
//     (async ()=>{

//         const res = await axios.get(`${apiUrl}internbatch/currentworkshop`, {withCredentials: true});
//         console.log(res.data);
//         if(Object.keys(res.data.data).length!=0){
//             setCurrentWorkshop(res.data.data);
//         }
//         setIsLoading(false);
//     })()
//   },[])

  useEffect(()=>{
    fetchData();
  },[])

  const fetchData = async() => {
    const res = await axios.get(`${apiUrl}internbatch/currentworkshop`, {withCredentials: true});
    console.log(res.data);
    console.log('bhai job ye',res.data?.data?.career?.jobTitle);
    if(Object.keys(res.data.data).length!=0){
        setCurrentWorkshop(res.data.data);
    }
    const resp = await axios.get(`${apiUrl}internbatch/workshops`, {withCredentials: true});
        console.log(resp.data);
        if(Object.keys(resp.data.data).length!=0){
            setWorkshops(resp.data.data.filter((item)=>item._id!=res.data.data?._id));
        }
        setIsLoading(false);

  }
  
  

  return (
    <MDBox bgColor="dark" color="light" mt={2} mb={2} p={2} borderRadius={10} minHeight='65vh' >
        <MDBox>
            <MDTypography color='white'>
                Current Workshops
            </MDTypography>
            <MDBox minHeight='25vh'>
            {isLoading ? 
          
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
            <CircularProgress color="white" />
          </MDBox>
          :
           currentworkshop ? 
           <MDBox mt={3}>
            <Card name={currentworkshop?.career?.jobTitle} goTo='/internship/trade' 
                state={currentworkshop._id} startDate={currentworkshop?.batchStartDate.toString().substring(0,10)} 
                endDate={currentworkshop?.batchEndDate.toString().substring(0,10)}/> 
                </MDBox> :
           <MDBox display="flex" flexDirection='column' justifyContent="center" alignItems="center" mt={5} mb={5} minHeight='25vh' border='1px solid white' borderRadius='12px'>
           <MDTypography color='white'>No current workshops</MDTypography>
           <MDButton variant='text'>Apply for workshops here</MDButton> 
          </MDBox>  
          }
            </MDBox>
        </MDBox>
        <MDBox>
            <MDTypography color='white'>
                Past Workshops
            </MDTypography>
            <MDBox minHeight='25vh'>
            {isLoading ? 
          
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5} minHeight='25vh'>
            <CircularProgress color="white" />
          </MDBox>
          :
           workshops?.length>0 ? 
           <MDBox mt={3}>
            {workshops?.map((workshop)=>{
                return <Card name ={workshop?.career?.jobTitle} startDate={workshop?.batchStartDate.toString().substring(0,10)} 
                endDate={workshop?.batchEndDate.toString().substring(0,10)}/>
            })}
           </MDBox> 
            :
           <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5} minHeight='25vh' border='1px solid white' borderRadius='12px'> 
            <MDTypography color='white'>No Workshops</MDTypography>
           </MDBox>  
          }
            </MDBox>
        </MDBox>
    </MDBox>
  )
}

const Card = ({name, goTo, state, startDate, endDate})=> {
    const Navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Grid xs={12} lg={12} mb={2}>
        <MDBox color='black' bgColor='white' minHeight='5vh' p={2} width='100%' minWidth='100%' borderRadius='12px'>
        <MDBox display='flex' flexDirection={isMobile ? 'column' : 'row'} justifyContent='space-between' alignItems='center'>
                    <Grid xs={12} xl={3}>
                        <MDTypography fontSize={16} fontWeight='bold'>{name}</MDTypography>
                    </Grid>
                    <Grid xs={12} xl={3}>
                        <MDTypography fontSize={14}>Start:{startDate}</MDTypography>
                    </Grid>
                    <Grid xs={12} xl={3}>    
                        <MDTypography fontSize={14}>End:{endDate}</MDTypography>
                    </Grid>
                    <Grid xs={12} xl={3}>    
                <MDButton onClick={()=>{Navigate(goTo, {state:{batchId:state}})}}>View</MDButton>
                </Grid>
            </MDBox>
        </MDBox>
        </Grid>
  )}
export default Workshops