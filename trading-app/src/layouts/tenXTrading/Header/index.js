import React, {useState} from 'react';
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDAvatar from '../../../components/MDAvatar';
import MDTypography from '../../../components/MDTypography';
import tradesicon from '../../../assets/images/tradesicon.png'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Subs from '../../../assets/images/subs.png';

const card = (
  <React.Fragment>
    <CardContent justifyContent="center" >
      <MDBox>
      <Grid container spacing={1} display="flex" justifyContent='flex-start' alignItems='center' alignContent='center'>
        <Grid item xs={2} md={2} lg={2}>
        <MDAvatar src={Subs} height={50} size="small" display="flex" justifyContent="left"/>
        </Grid>
        <Grid item xs={10} md={10} lg={10} display="flex" justifyContent='flex-start' alignItems='left'>
        <MDTypography fontSize={20} fontWeight='bold'>Basic</MDTypography>
        </Grid>
      </Grid>
      </MDBox>
      <MDBox display='flex' justifyContent='center'>
      <MDTypography sx={{ fontSize: 34 }} color="text.secondary" gutterBottom>
        ₹45
      </MDTypography>
      <MDTypography style={{fontSize:"13px", lineHeight:5}}>/22 trading days</MDTypography>
      </MDBox>
      <MDTypography sx={{ mb: 1.5 }} color="red">
        Discount 
        <span> -25%</span>
      </MDTypography>
      <MDTypography variant="body2">
       validity
      </MDTypography>
      <MDTypography gutterBottom variant="body2">
       validity periods
      </MDTypography>
      <MDTypography  variant="body2">
       <CheckIcon sx={{color:"green"}}/>
       <span> plan1</span>
       
      </MDTypography>
      <MDTypography  variant="body2">
       <CheckIcon sx={{color:"green"}}/>
       <span> plan2</span>
       
      </MDTypography>
      <MDTypography  variant="body2">
       <CheckIcon sx={{color:"green"}}/>
       <span> plan3</span>
       
      </MDTypography>
      <MDTypography  variant="body2">
        <CloseIcon  sx={{color:"red"}}/>
       <span> plan4</span>
       
      </MDTypography>
    </CardContent>
    
      {/* <button style={{background:"black",color:"white",borderRadius:"13px"}}>Purchase</button> */}
   
  </React.Fragment>

);


export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [isLoading,setIsLoading] = useState(false);




  return (
   
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10}>
          
            {/* <Grid item xs={12} md={6} lg={12}>
              <MDBox style={{minHeight:"80vh"}} border='1px solid white' borderRadius={5} display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
                <img src={tradesicon} width={100} height={100}/>
                <MDTypography color="light" style={{alignContent:'center', alignItems:'center'}} fontSize={20}>Keep watching this space to learn and earn with StoxHero!</MDTypography>
              </MDBox>
            </Grid> */}

{/* <Box sx={{ minWidth: 275,display:"flex", flexWrap:"wrap",justifyContent:"center",alignItems:"center" }}> */}
        
    <Grid container spacing={3} >

          <Grid item  xs={12} md={6} lg={4}>
          <Card variant="outlined">{card}</Card>
          </Grid>

          <Grid item  xs={12} md={6} lg={4}>
          <Card variant="outlined">{card}</Card>
          </Grid>

          <Grid item  xs={12} md={6} lg={4}>
          <Card variant="outlined">{card}</Card>
          </Grid>

          <Grid item  xs={12} md={6} lg={4}>
          <Card variant="outlined">{card}</Card>
          </Grid>

          <Grid item  xs={12} md={6} lg={4}>
          <Card variant="outlined">{card}</Card>
          </Grid>

          <Grid item  xs={12} md={6} lg={4}>
          <Card variant="outlined">{card}</Card>
          </Grid>

          
          
      </Grid>

     


      
    
          
      {/* </Box> */}


    </MDBox>
  );
}