import { Button, Card, CardContent, Grid, Paper, TableContainer, TextField, Typography } from '@mui/material';
import React from 'react';
import MDBox from '../../components/MDBox';
import MDButton from '../../components/MDButton';
import MDTypography from '../../components/MDTypography';
import CreateCollege from "./createCollege";
import {useState, useEffect} from 'react';
import CollegeComponent from '../../assets/theme/components/collegeComponent/CollegeComponent';
import axios from "axios";

import { Link} from "react-router-dom";



const data = [
  {
    id:1,
    collegeName :"college",
    zone:"xxx",
  },
  {
    id:2,
    collegeName :"college",
    zone:"xxx",
  },
  {
    id:3,
    collegeName :"college",
    zone:"xxx",
  },
  {
    id:4,
    collegeName :"college",
    zone:"xxx",
  },
  {
    id:5,
    collegeName :"college",
    zone:"xxx",
  },
]





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
    <MDBox style={{marginTop:"10px", height: "80vh", backgroundColor:"#344666", borderRadius:"12px"}}>
        {!createCollegeForm ? 
        <>
        <MDBox>
            <MDButton
               variant="contained" 
               size="small" 
               color="success" 
               sx={{marginLeft:1.5}}
               onClick={()=>{setCreateCollegeForm(true);setIsObjectNew(true)}}
               >
                Create College
            </MDButton>
        </MDBox>

        <>
        
         <Grid mt={2} p={1} container style={{border:'1px solid white', borderRadius:5}}>
              <Grid item xs={4} md={4} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">College</MDTypography>
              </Grid>
              <Grid item xs={4} md={4} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Zone</MDTypography>
              </Grid>
              <Grid item xs={4} md={4} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Action</MDTypography>
              </Grid>
         </Grid>

         

         <Card container>
       {collegeData.map((elem,index)=>{
         return(
           <Grid key={elem._id} container mt={1} p={1}>
                  <Grid item xs={4} md={4} lg={4} display="flex" justifyContent="center" borderBottom="1px solid gray" alignContent="center" alignItems="center">
                <MDTypography color="#000" fontSize={13} fontWeight="bold">{elem.collegeName}</MDTypography>
              </Grid>
              <Grid item xs={4} md={4} lg={4} display="flex" justifyContent="center" borderBottom="1px solid gray" alignContent="center" alignItems="center">
                <MDTypography color="#000" fontSize={13} fontWeight="bold">{elem.zone}</MDTypography>
              </Grid>
              <Grid item xs={4} md={4} lg={4} display="flex" justifyContent="center" borderBottom="1px solid gray" alignContent="center" alignItems="center">

           
              <MDButton  size="small" style={{background:"blue",color:"#fff",fontSize:"10px",fontWeight:"500",width:"60px",borderRadius:"10px",marginBottom:"5px"}} component={Link} to={{pathname:"/collegeEdit"}} state={{data:elem}} >edit</MDButton>
              </Grid>
                  </Grid>
                )
              })}

         </Card>
   
         
        </>
        

    </> : 
    <>
        <CreateCollege setCreateCollegeForm={setCreateCollegeForm}/>
    </>}
    </MDBox>
  )
}

export default College