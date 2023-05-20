import { Button, Card, CardContent, Grid, Paper, TableContainer, TextField, Typography } from '@mui/material';
import React from 'react';
import MDBox from '../../components/MDBox';
import MDButton from '../../components/MDButton';
import MDTypography from '../../components/MDTypography';
import CreateCollege from "./createCollege";
import {useState, useEffect} from 'react';
import CollegeComponent from '../../assets/theme/components/collegeComponent/CollegeComponent';
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import { Link} from "react-router-dom";




const College = () => {


  let baseUrl =  "http://localhost:5000/api/v1/college"

  let [collegeData,setCollegeData] = useState([])
  

useEffect(()=>{
  let call1 = axios.get(baseUrl,{
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
    setCollegeData(api1Response.data.data)
    console.log(api1Response.data.data._id)
    
  
  })
  .catch((error) => {
    // Handle errors here
    console.error(error);
  });
},[])



  const [isLoading,setIsLoading] = useState(false);
  const [createCollegeForm,setCreateCollegeForm] = useState(false);
  const [isObjectNew,setIsObjectNew] =useState(false);  

  const collegeID = collegeData.map((data) => data._id);
  console.log(collegeID);



  return (
    <MDBox style={{marginTop:"10px", height: "80vh",background:"#344767" ,borderRadius:"12px"}}>
        {!createCollegeForm ? 
        <>
        <MDBox display="flex" justifyContent="flex-end"  sx={{width:"92%",marginLeft:{xs:"-55px",md:"50px"}}}>
          
            <MDButton
               variant="contained" 
               size="small" 
               style={{marginTop:"20px"}}
               color="success" 
               sx={{marginLeft:1.5}}
               onClick={()=>{setCreateCollegeForm(true);setIsObjectNew(true)}}
               >
                Create College
            </MDButton>
        </MDBox>

        <>
        
         <Grid mt={3} p={1} container sx={{background:"#fff",borderRadius:"8px",color:"#000",marginLeft:{xs:"13px",md:"50px"},width:"92%"}}>
              <Grid item xs={4} md={4} lg={4} display="flex" justifyContent="center" alignContent="center"  alignItems="center">
                <MDTypography  fontSize={13} fontWeight="bold">College</MDTypography>
              </Grid>
              <Grid item xs={4} md={4} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography  fontSize={13} fontWeight="bold">Zone</MDTypography>
              </Grid>
              <Grid item xs={4} md={4} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography  fontSize={13} fontWeight="bold">Action</MDTypography>
              </Grid>
         </Grid>

         

         <MDBox mt={3}>
       {collegeData.map((elem,index)=>{
         return(
           <Grid key={elem._id} container  sx={{background:"whitesmoke",marginLeft:{xs:"13px",md:"50px"},width:"92%"}} borderRadius="8px"  mt={1} mb={1} p={1}>

                  <Grid item xs={4} md={4} lg={4} display="flex" justifyContent="center"  alignContent="center" alignItems="center">
                   <MDTypography color="#000" fontSize={13} fontWeight="bold">{elem.collegeName}</MDTypography>
                  </Grid>

                  <Grid item xs={4} md={4} lg={4} display="flex" justifyContent="center"  alignContent="center" alignItems="center">
                   <MDTypography color="#000" fontSize={13} fontWeight="bold">{elem.zone}</MDTypography>
                 </Grid>

                 <Grid item xs={4} md={4} lg={4} display="flex" justifyContent="center"  alignContent="center" alignItems="center">
                   <MDButton size="small" style={{color:"#fff",fontSize:"13px",fontWeight:"500",width:"60px",marginBottom:"2px",marginTop:"1px",background:"rgb(88, 115, 196)"}} component={Link} to={{pathname:"/collegeEdit"}} state={{data:elem}} ><EditIcon/></MDButton>
                 </Grid>


            </Grid>
                )
              })}

         </MDBox>
   
         
        </>
        

    </> : 
    <>
        <CreateCollege setCreateCollegeForm={setCreateCollegeForm}/>
    </>}
    </MDBox>
  )
}

export default College

















