import React, {useState} from 'react';
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
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

const card = (
  <React.Fragment>
    <CardContent justifyContent="center" >
      <img src="https://indianroyalmatrimony.com/admin_panel/admin/product_images/package_img/basic%20plan/basic-icon-png-500x500.png" style={{height:"30px"}}/>
      <span style={{marginLeft:"13px",paddingTop:"45px"}}>hey</span>
      <Typography sx={{ fontSize: 34 }} color="text.secondary" gutterBottom>
        ₹45
        <span style={{fontSize:"13px"}}>/month</span>
      <Typography variant="body2" color="text.secondary">
        per user/month,billed anually
       </Typography>
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="red">
        Discount 
        <span> -25%</span>
      </Typography>
      <Typography variant="body2">
       validity
      </Typography>
      <Typography gutterBottom variant="body2">
       validity periods
      </Typography>
      <Typography  variant="body2">
       <CheckIcon sx={{color:"green"}}/>
       <span> plan1</span>
       
      </Typography>
      <Typography  variant="body2">
       <CheckIcon sx={{color:"green"}}/>
       <span> plan2</span>
       
      </Typography>
      <Typography  variant="body2">
       <CheckIcon sx={{color:"green"}}/>
       <span> plan3</span>
       
      </Typography>
      <Typography  variant="body2">
        <CloseIcon  sx={{color:"red"}}/>
       <span> plan4</span>
       
      </Typography>
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
        
    <Grid container sx={{ml:"14px"}} rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3,lg:5 }} columns={{ xs: 2, sm: 8, md: 12 }} >

          <Grid item  xs={2} sm={4} md={4} >
          <Card  style={{width:"85%"}} variant="outlined">{card}</Card>
          </Grid>

          <Grid item  xs={2} sm={4} md={4} >
          <Card  style={{width:"85%"}} variant="outlined">{card}</Card>
          </Grid>

          <Grid item  xs={2} sm={4} md={4} >
          <Card  style={{width:"85%"}} variant="outlined">{card}</Card>
          </Grid>

          <Grid item  xs={2} sm={4} md={4} >
          <Card  style={{width:"85%"}} variant="outlined">{card}</Card>
          </Grid>

          <Grid item  xs={2} sm={4} md={4} >
          <Card  style={{width:"85%"}} variant="outlined">{card}</Card>
          </Grid>

          <Grid item  xs={2} sm={4} md={4} >
          <Card  style={{width:"85%"}} variant="outlined">{card}</Card>
          </Grid>

          
          
      </Grid>

     


      
    
          
      {/* </Box> */}


    </MDBox>
  );
}