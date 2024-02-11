import { Box, Button, Card, CardContent, Grid, Paper, TableContainer, TextField, Typography } from '@mui/material';
import React from 'react';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import MDTypography from '../../../components/MDTypography';
import {CircularProgress, Tooltip} from '@mui/material';
import {useState, useEffect} from 'react';
import axios from "axios";
import { Link, useNavigate} from "react-router-dom";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Navigate } from 'react-router-dom';
import moment from 'moment'


const BrokerReports = () => {
  const navigate = useNavigate();
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  let [skip, setSkip] = useState(0);
  const limitSetting = 10;
  const [count, setCount] = useState(0);
  const [isLoading,setIsLoading] = useState(false);
  let [brokerReportData,setBrokerReportData] = useState([])
  

useEffect(()=>{
  let call1 = axios.get((`${baseUrl}api/v1/brokerreport/`),{
              withCredentials: true,
              headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Credentials": true
                },
              })
  Promise.all([call1])
  .then(([api1Response]) => {
    console.log('report',api1Response.data.data);
    // Process the responses here
    setBrokerReportData(api1Response.data.data)
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
  setBrokerReportData([]);
  setIsLoading(true)
  axios.get(`${baseUrl}api/v1/brokerreport/?skip=${skip-limitSetting}&limit=${limitSetting}`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
  })
  .then((res) => {
      setBrokerReportData(res.data.data)
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
  setBrokerReportData([]);
  setIsLoading(true)
  axios.get(`${baseUrl}api/v1/brokerreport/?skip=${skip+limitSetting}&limit=${limitSetting}`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
  })
  .then((res) => {
      console.log('report',res.data.data);
      setBrokerReportData(res.data.data)
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
  axios.get(`${baseUrl}api/v1/brokerreport/delete/${id}`,{
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
      <MDTypography fontSize={15} color='light' p={1} sx={{textAlign:'center'}}>Broker Reports</MDTypography>
          <Grid container spacing={0} p={2} display='flex' justifyContent='center' alignItems='center'>
                <Grid container p={1} backgroundColor='#7b809a' style={{border:'1px solid white', borderRadius:5}}>
                      <Grid item xs={12} md={2} lg={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={13} fontWeight="bold">Actions</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={13} fontWeight="bold" >Print Date</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={13} fontWeight="bold" >Broker Name</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={13} fontWeight="bold">Cum. Gross P/L</MDTypography>
                      </Grid>
                      <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                        <MDTypography color="light" fontSize={13} fontWeight="bold">Cum. Net P/L</MDTypography>
                      </Grid>
                {/* </Grid> */}
            </Grid>
        {!isLoading ?
             brokerReportData?.map((elem, index)=>{    
                return(      
                  <>                  
                                <Grid container backgroundColor={ index % 2 === 0 ? 'grey' : 'lightgrey'} mt={1} p={1} style={{border:'1px solid white', borderRadius:5}}>
                                    <Grid container lg={1} display='flex' justifyContent='space-between'>
                                    <Grid item xs={12} md={2} lg={6} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                    <Tooltip title="View">
                                    <MDButton 
                                        variant="a" 
                                        // color={index % 2 === 0 ? 'success' : 'warning'}
                                        size="small" 
                                        component = {Link}
                                        to={{
                                            pathname: `/brokerreportdetails`,
                                          }}
                                        state={{data: elem}}
                                      >
                                        <RemoveRedEyeIcon color='black'/>
                                      </MDButton>
                                    </Tooltip>
                                    </Grid>
                                    {/* <Grid item xs={12} md={2} lg={4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
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
                                    </Grid> */}
                                    <Grid item xs={12} md={2} lg={6} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                    <Tooltip title="Download">
                                    <MDButton
                                      variant="a"
                                      // color={index % 2 === 0 ? 'success' : 'warning'}
                                      size="small"
                                      component={Link}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        window.open(elem?.document, '_blank');
                                      }}
                                    >
                                      <CloudDownloadIcon color='black' />
                                    </MDButton>
                                    </Tooltip>
                                    </Grid>
                                    </Grid>
                                    <Grid item xs={12} md={2} lg={2} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                        <MDTypography color={index % 2 === 0 ? 'white' : 'black'} fontSize={13} fontWeight="bold">
                                          {moment.utc(elem?.printDate).utcOffset('+05:30').format("DD-MMM-YY")}
                                        </MDTypography>
                                    </Grid>
                                    
                                    <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                        <MDTypography color={index % 2 === 0 ? 'white' : 'black'} fontSize={13} fontWeight="bold">{elem?.brokerName}</MDTypography>
                                    </Grid>

                                    <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                        <MDTypography color={index % 2 === 0 ? 'white' : 'black'} fontSize={13} fontWeight="bold">
                                          { (elem?.cummulativeGrossPNL) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.cummulativeGrossPNL)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-elem?.cummulativeGrossPNL))}
                                        </MDTypography>
                                    </Grid>

                                    <Grid item xs={12} md={2} lg={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                                        <MDTypography color={index % 2 === 0 ? 'white' : 'black'} fontSize={13} fontWeight="bold">
                                          { (elem?.cummulativeNetPNL) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.cummulativeNetPNL)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-elem?.cummulativeNetPNL))}
                                        </MDTypography>
                                    </Grid>

                                </Grid>       
                                </>        
                            )
                        })
                        :
                        <Grid container p={1} display="flex" justifyContent="center" alignContent='center' alignItems="center">
                            <Grid item display="flex" justifyContent="center" alignContent='center' alignItems="center" lg={12}>
                            <MDBox mt={5} mb={5}>
                                <CircularProgress color="info" />
                            </MDBox>
                            </Grid>
                        </Grid>
                        }
                        {!isLoading && count !== 0 &&
                        <MDBox m={2} display="flex" justifyContent="space-between" alignItems='center' width='100%'>
                          <MDButton variant='outlined' color='warning' disabled={(skip+limitSetting)/limitSetting === 1 ? true : false} size="small" onClick={backHandler}>Back</MDButton>
                          <MDTypography color="light" fontSize={15} fontWeight='bold'>Total Reports: {!count ? 0 : count} | Page {(skip+limitSetting)/limitSetting} of {!count ? 1 : Math.ceil(count/limitSetting)}</MDTypography>
                          <MDButton variant='outlined' color='warning' disabled={Math.ceil(count/limitSetting) === (skip+limitSetting)/limitSetting ? true : !count ? true : false} size="small" onClick={nextHandler}>Next</MDButton>
                        </MDBox>
                        }
                  {/* </Grid> */}
          </Grid>
    </MDBox>
  )
}

export default BrokerReports

















