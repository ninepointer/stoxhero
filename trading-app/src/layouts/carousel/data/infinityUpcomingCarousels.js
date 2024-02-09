import { Box, Button, Card, CardContent, Grid, Paper, TableContainer, TextField, Typography } from '@mui/material';
import React from 'react';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import MDTypography from '../../../components/MDTypography';
import {CircularProgress, Tooltip} from '@mui/material';
import {useState, useEffect} from 'react';
import axios from "axios";
// import EditIcon from '@mui/icons-material/Edit';
import { Link} from "react-router-dom";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import CarouselBox from './liveCarouselBox';

const LiveCarousels = () => {


  // let baseUrl =  "http://localhost:5001/api/v1/college"
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  let [skip, setSkip] = useState(0);
  const limitSetting = 4;
  const [count, setCount] = useState(0);
  const [isLoading,setIsLoading] = useState(false);
  let [carouselData,setCarouselData] = useState([])
  

useEffect(()=>{
  let call1 = axios.get((`${baseUrl}api/v1/carousels/infinityupcoming`),{
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
    setCarouselData(api1Response.data.data)
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
  setCarouselData([]);
  setIsLoading(true)
  axios.get(`${baseUrl}api/v1/carousels/infinityupcoming?skip=${skip-limitSetting}&limit=${limitSetting}`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
  })
  .then((res) => {
      setCarouselData(res.data.data)
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
  setCarouselData([]);
  setIsLoading(true)
  axios.get(`${baseUrl}api/v1/carousels/infinityupcoming?skip=${skip+limitSetting}&limit=${limitSetting}`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
  })
  .then((res) => {
      setCarouselData(res.data.data)
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
  axios.get(`${baseUrl}api/v1/carousels/delete/${id}`,{
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
      {carouselData?.length === 0 ? 
      <MDBox minHeight='20vH' display='flex' justifyContent='center' alignItems='center'>
          <MDTypography fontSize={15} fontWeight='bold' color='light'>No Upcoming Carousels for Infinity Traders</MDTypography>
      </MDBox>

      :
      <MDBox>
      <MDTypography fontSize={15} color='light' p={1} sx={{textAlign:'center'}}>Upcoming - Carousels</MDTypography>
      <Grid container spacing={2} p={2}>
        {!isLoading ?
             carouselData?.map((elem, index)=>{    
                return(    
                    
                        <Grid item xs={12} md={2} lg={3} key={index} display="flex" justifyContent="center" alignContent="center" alignItems="center" flexDirection='row'>
                            <CarouselBox image={elem.carouselImage} name={elem.carouselName} startDate={elem.carouselStartDate} endDate={elem.carouselEndDate} link={elem.linkToCarousel} elem={elem}/>
                        </Grid>
                  
                )
            })
            :
            // <Grid container display="flex" justifyContent="center" alignContent='center' alignItems="center">
                <Grid item display="flex" justifyContent="center" alignContent='center' alignItems="center" lg={12}>
                <MDBox mt={5} mb={5}>
                    <CircularProgress color="info" />
                </MDBox>
                </Grid>
            // </Grid>
            }
            {!isLoading && count !== 0 &&
            <MDBox m={2} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
              <MDButton variant='outlined' color='warning' disabled={(skip+limitSetting)/limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
              <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Carousels: {!count ? 0 : count} | Page {(skip+limitSetting)/limitSetting} of {!count ? 1 : Math.ceil(count/limitSetting)}</MDTypography>
              <MDButton variant='outlined' color='warning' disabled={Math.ceil(count/limitSetting) === (skip+limitSetting)/limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
            </MDBox>
            }
      </Grid>
      </MDBox>}
    </MDBox>
  )
}

export default LiveCarousels

















