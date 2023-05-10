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


const CardData = [
  {
    id:0,
    plan:"Begineer",
    price:"₹45",
    upto:"/22 trading days",
    discount:"",
    discountPrice:"",
    validity:"Valid till next 22 days of purchase",
    validityPeriods:"22 days",
    plan1:"unlimited acess to the desired tokens for the contest",
    plan2:"unlimited acess to the desired tokens for the contest",
    plan3:"unlimited acess to the desired tokens for the contest",
    plan4:"unlimited acess to the desired tokens for the contest"

  },

  {
    id:1,
    plan:"Intermediate",
    price:"₹49",
    upto:"/22 trading days",
    discount:"Discount",
    discountPrice:"25%",
    validity:"Valid till next 22 days of purchase",
    validityPeriods:"22 days",
    plan1:"unlimited acess to the desired tokens for the contest",
    plan2:"unlimited acess to the desired tokens for the contest",
    plan3:"unlimited acess to the desired tokens for the contest",
    plan4:"unlimited acess to the desired tokens for the contest"

  },

  {
    id:2,
    plan:"Pro",
    price:"₹249",
    upto:"/22 trading days",
    discount:"",
    discountPrice:"",
    validity:"Valid till next 22 days of purchase",
    validityPeriods:"22 days",
    plan1:"unlimited acess to the desired tokens for the contest",
    plan2:"unlimited acess to the desired tokens for the contest",
    plan3:"unlimited acess to the desired tokens for the contest",
    plan4:"unlimited acess to the desired tokens for the contest"

  },

  {
    id:3,
    plan:"Silver",
    price:"₹490",
    upto:"/22 trading days",
    discount:"",
    discountPrice:"",
    validity:"Valid till next 22 days of purchase",
    validityPeriods:"22 days",
    plan1:"unlimited acess to the desired tokens for the contest",
    plan2:"unlimited acess to the desired tokens for the contest",
    plan3:"unlimited acess to the desired tokens for the contest",
    plan4:"unlimited acess to the desired tokens for the contest"

  },

  {
    id:4,
    plan:"Gold",
    price:"₹990",
    upto:"/22 trading days",
    discount:"",
    discountPrice:"",
    validity:"Valid till next 22 days of purchase",
    validityPeriods:"22 days",
    plan1:"unlimited acess to the desired tokens for the contest",
    plan2:"unlimited acess to the desired tokens for the contest",
    plan3:"unlimited acess to the desired tokens for the contest",
    plan4:"unlimited acess to the desired tokens for the contest"

  },

  {
    id:5,
    plan:"Platinum",
    price:"₹1990",
    upto:"/22 trading days",
    discount:"",
    discountPrice:"",
    validity:"Valid till next 22 days of purchase",
    validityPeriods:"22 days",
    plan1:"unlimited acess to the desired tokens for the contest",
    plan2:"unlimited acess to the desired tokens for the contest",
    plan3:"unlimited acess to the desired tokens for the contest",
    plan4:"unlimited acess to the desired tokens for the contest"

  },
  

]

const card = (props)=> (
  <React.Fragment>
    <CardContent sx={{height:"600px"}} justifyContent="center" >
      <MDBox sx={{background:"linear-gradient(195deg, #49a3f1, #1A73E8)",height:"160px",marginTop:"21px",boxShadow:("box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15)"),borderRadius:"15px"}}>
        
       

        {/* <Grid sx={{border:"1px solid red"}} container spacing={1} display="flex" justifyContent='center' alignItems='center'>
        <Grid item xs={2} md={2} lg={2}>
        <MDAvatar src={Subs} height={50} size="small" display="flex" justifyContent="center"/>
        </Grid>
        <Grid item xs={10} md={10} lg={10} display="flex" justifyContent='left' alignItems='left'>
        <MDTypography fontFamily=" ui-rounded" fontSize={20} sx={{color:"#fff"}} fontWeight='bold'>{props.plan}</MDTypography>
        </Grid>
        </Grid> */}



        {/* blue box new Logo and Plan NAme  which is aligned in the center of the blue card please dont uncomment above code */}

            <Grid  container spacing={1} justifyContent="center" alignItems="center">
  <Grid item xs={12}>
    <Box display="flex" justifyContent="center" alignItems="center">
      <MDAvatar src={Subs} height={50} size="small" />
      <MDTypography fontFamily="ui-rounded" fontSize={20} sx={{ color: "#fff", marginLeft: "10px" }} fontWeight="bold">
        {props.plan}
      </MDTypography>
    </Box>
  </Grid>
            </Grid>

            {/* The Logo and Plan NAme ends HEre */}


       {/* Blue box Price content which is also aligned in the centre */}

      <MDBox display='flex' justifyContent='center'>
      <MDTypography fontFamily=" ui-rounded" sx={{ fontSize: 34, color:"#fff" }} color="gold" gutterBottom>
        {props.price}
      </MDTypography>
      <MDTypography fontFamily=" ui-rounded" style={{fontSize:"13px", lineHeight:5, color:"#fff"}}>{props.upto}</MDTypography>
      </MDBox>

      {/* BLue box Price content ends here */}


      <MDBox display="flex" fontFamily=" ui-rounded" justifyContent="center" color="black" >
      <MDTypography sx={{ mb: 1.5 }} color="red">
        {props.discount} 
        <span> {props.discountPrice}</span>
      </MDTypography>
      </MDBox>
     </MDBox>



      

      <MDBox display="flex" sx={{margin:"10px 10px"}} justifyContent="center" flexDirection="column" alignItems="center">

      <MDTypography fontWeigh="800" fontFamily="system-ui" color="black" variant="body1">
       {props.validity}
      </MDTypography>
      <MDTypography sx={{color:"purple"}} gutterBottom variant="body2">
      * Validity - {props.validityPeriods} *
      </MDTypography>
      </MDBox>

      <MDBox  borderTop="1px dotted blue"  justifyContent="center">
        
        <MDBox display="flex" justifyContent="center">

        <MDTypography fontFamily="Leyton" fontWeight="bold" sx={{color:"rgb(45, 80, 150)", margin:"10px 10px"}} >Benifits</MDTypography>
        </MDBox>

        <MDTypography fontFamily="Lucida Sans" variant="body2" color="black" >
       <CheckIcon sx={{color:"green",verticalAlign: "text-top"}}/>
       <span> {props.plan1}</span>
       
      </MDTypography>
      <MDTypography fontFamily="Lucida Sans" variant="body2" color="black" >
       <CheckIcon sx={{color:"green",verticalAlign: "text-top"}}/>
       <span> {props.plan2}</span>
       
      </MDTypography>

      <MDTypography fontFamily="Lucida Sans" variant="body2" color="black"  >
       <CheckIcon sx={{color:"green",verticalAlign: "text-top"}}/>
       <span> {props.plan3}</span>
       </MDTypography>
      

       <MDTypography fontFamily="Lucida Sans" variant="body2" color="black">
       <CheckIcon sx={{ color: "green", verticalAlign: "text-top" }} />
       <span> {props.plan4}</span>
       </MDTypography>
      

      </MDBox>
       
      <MDBox sx={{display:"flex",justifyContent:"center", margin:"10px 0px"}}>

      <Button sx={{color:"#fff", "&:hover":  {width: '180px'}}} style={{width:"150px",height:"50px",borderRadius:"15px",background:"#000",boxShadow:"14px 29px 20px -21px  rgba(5,5,4,1)",}}>Purchase</Button>
      
      </MDBox>
    </CardContent>
    
   
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
         {

           CardData.map((elem,index)=>(
            <Grid item key={elem.id} xs={12} md={6} lg={4}>
            
            <Card style={{background:"#fff"}} variant="outlined">
  {card({
    plan: elem.plan,
    price: elem.price,
    upto: elem.upto,
    discount: elem.discount,
    discountPrice: elem.discountPrice,
    validity: elem.validity,
    validityPeriods: elem.validityPeriods,
    plan1: elem.plan1,
    plan2: elem.plan2,
    plan3: elem.plan3,
    plan4: elem.plan4
  })}
</Card>
          </Grid>

          ))
         }

          {/* <Grid item  xs={12} md={6} lg={4}>
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
          </Grid> */}

          
          
      </Grid>

     


      
    
          
      {/* </Box> */}


    </MDBox>
  );
}
























// const card = (
//   <React.Fragment>
//     <CardContent justifyContent="center" >
//       <MDBox>
//       <Grid container spacing={1} display="flex" justifyContent='flex-start' alignItems='center' alignContent='center'>
//         <Grid item xs={2} md={2} lg={2}>
//         <MDAvatar src={Subs} height={50} size="small" display="flex" justifyContent="left"/>
//         </Grid>
//         <Grid item xs={10} md={10} lg={10} display="flex" justifyContent='flex-start' alignItems='left'>
//         <MDTypography fontSize={20} fontWeight='bold'>Basic</MDTypography>
//         </Grid>
//       </Grid>
//       </MDBox>
//       <MDBox display='flex' justifyContent='center'>
//       <MDTypography sx={{ fontSize: 34 }} color="text.secondary" gutterBottom>
//         ₹45
//       </MDTypography>
//       <MDTypography style={{fontSize:"13px", lineHeight:5}}>/22 trading days</MDTypography>
//       </MDBox>
//       <MDTypography sx={{ mb: 1.5 }} color="red">
//         Discount 
//         <span> -25%</span>
//       </MDTypography>
//       <MDTypography variant="body2">
//        validity
//       </MDTypography>
//       <MDTypography gutterBottom variant="body2">
//        validity periods
//       </MDTypography>
//       <MDTypography  variant="body2">
//        <CheckIcon sx={{color:"green"}}/>
//        <span> plan1</span>
       
//       </MDTypography>
//       <MDTypography  variant="body2">
//        <CheckIcon sx={{color:"green"}}/>
//        <span> plan2</span>
       
//       </MDTypography>
//       <MDTypography  variant="body2">
//        <CheckIcon sx={{color:"green"}}/>
//        <span> plan3</span>
       
//       </MDTypography>
//       <MDTypography  variant="body2">
//         <CloseIcon  sx={{color:"red"}}/>
//        <span> plan4</span>
       
//       </MDTypography>
//     </CardContent>
    
//       {/* <button style={{background:"black",color:"white",borderRadius:"13px"}}>Purchase</button> */}
   
//   </React.Fragment>

// );
