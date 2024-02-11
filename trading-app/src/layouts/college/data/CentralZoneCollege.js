import { Box, Button, Card, CardContent, Grid, Paper, TableContainer, TextField, Typography } from '@mui/material';
import React from 'react';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import MDTypography from '../../../components/MDTypography';
import {CircularProgress, Tooltip} from '@mui/material';
// import CreateCollege from "./createCollege";
import {useState, useEffect} from 'react';
// import CollegeComponent from '../../../assets/theme/components/collegeComponent/CollegeComponent';
import axios from "axios";
// import EditIcon from '@mui/icons-material/Edit';
import { Link} from "react-router-dom";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';

const College = () => {


  // let baseUrl =  "http://localhost:5001/api/v1/college"
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  let [skip, setSkip] = useState(0);
  const limitSetting = 10;
  const [count, setCount] = useState(0);
  const [isLoading,setIsLoading] = useState(false);
  let [collegeData,setCollegeData] = useState([])
  

useEffect(()=>{
  let call1 = axios.get((`${baseUrl}api/v1/college/central`),{
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
    setCollegeData(api1Response.data.data)
    setCount(api1Response.data.count)
  })
  .catch((error) => {
    // Handle errors here
    console.error(error);
  });
  
},[])

function backHandler(){
  if(skip <= 0){
      return;
  }
  setSkip(prev => prev-limitSetting);
  setCollegeData([]);
  setIsLoading(true)
  axios.get(`${baseUrl}api/v1/college/central?skip=${skip-limitSetting}&limit=${limitSetting}`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
  })
  .then((res) => {
      setCollegeData(res.data.data)
      setCount(res.data.count)
      setTimeout(()=>{
          setIsLoading(false)
        },500)
  }).catch((err) => {
      setIsLoading(false)
      return new Error(err);
  })
}

function nextHandler(){
  if(skip+limitSetting >= count){ 
    return;
  }
  console.log("inside next handler")
  setSkip(prev => prev+limitSetting);
  setCollegeData([]);
  setIsLoading(true)
  axios.get(`${baseUrl}api/v1/college/central?skip=${skip+limitSetting}&limit=${limitSetting}`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
  })
  .then((res) => {
      setCollegeData(res.data.data)
      setCount(res.data.count)
      setTimeout(()=>{
          setIsLoading(false)
        },500)
  }).catch((err) => {
      setIsLoading(false)
      return new Error(err);
  })
}

function Delete(id){
  console.log(id)
  axios.get(`${baseUrl}api/v1/college/delete/${id}`,{
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
    },
  })
  .then((res) => {
      setTimeout(()=>{
          setIsLoading(false)
        },500)
  }).catch((err) => {
      setIsLoading(false)
      return new Error(err);
  })
}

  return (
    <MDBox bgColor="dark" color="light" mb={1} borderRadius={10} minWidth='100%' minHeight='auto'>
      <Grid container spacing={1}>
        <Grid container p={1} backgroundColor='#7b809a' style={{border:'1px solid white', borderRadius:5}}>
              <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Action</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold" >College Name</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">Zone</MDTypography>
              </Grid>
              <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDTypography color="light" fontSize={13} fontWeight="bold">CreatedBy</MDTypography>
              </Grid>
        </Grid>
        {!isLoading ?
             collegeData?.map((elem, index)=>{
                
                return(
              
                    
                    <Grid container backgroundColor={ index % 2 === 0 ? 'grey' : 'lightgrey'} mt={1} p={1} style={{border:'1px solid white', borderRadius:5}}>
                        <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <Tooltip title="View">
                        <MDButton 
                            variant="a" 
                            // color={index % 2 === 0 ? 'success' : 'warning'}
                            size="small" 
                            component = {Link}
                            to={{
                                pathname: `/collegedetails`,
                              }}
                            state={{data: elem}}
                          >
                            <RemoveRedEyeIcon color='black'/>
                          </MDButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                        <MDButton 
                            variant="a" 
                            // color={index % 2 === 0 ? 'success' : 'warning'}
                            size="small" 
                            component = {Link}
                            onClick={(e)=>{Delete(elem?._id)}}
                          >
                            <DeleteIcon color='black'/>
                          </MDButton>
                        </Tooltip>
                        </Grid>
                        <Grid item xs={12} md={2} lg={5} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color={index % 2 === 0 ? 'white' : 'black'} fontSize={13} fontWeight="bold">{elem?.collegeName.slice(0, 60) + (elem?.collegeName.length > 60 ? '...' : '')}</MDTypography>
                        </Grid>
                        
                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color={index % 2 === 0 ? 'white' : 'black'} fontSize={13} fontWeight="bold">{elem?.zone}</MDTypography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            <MDTypography color={index % 2 === 0 ? 'white' : 'black'} fontSize={13} fontWeight="bold">{elem?.createdBy?.first_name} {elem?.createdBy?.last_name}</MDTypography>
                        </Grid>
                    </Grid>
                    
                
                )
            })
            :
            <Grid container display="flex" justifyContent="center" alignContent='center' alignItems="center">
                <Grid item display="flex" justifyContent="center" alignContent='center' alignItems="center" lg={12}>
                <MDBox mt={5} mb={5}>
                    <CircularProgress color="info" />
                </MDBox>
                </Grid>
            </Grid>
            }
            {!isLoading && count !== 0 &&
            <MDBox mt={1} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
              <MDButton variant='outlined' color='warning' disabled={(skip+limitSetting)/limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
              <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Colleges: {!count ? 0 : count} | Page {(skip+limitSetting)/limitSetting} of {!count ? 1 : Math.ceil(count/limitSetting)}</MDTypography>
              <MDButton variant='outlined' color='warning' disabled={Math.ceil(count/limitSetting) === (skip+limitSetting)/limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
            </MDBox>
            }
      </Grid>
    </MDBox>
  )
}

export default College

















