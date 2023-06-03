import React, {useState, useEffect} from 'react';
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MyPortfolio from '../data/Portfolios'
import MDTypography from '../../../components/MDTypography';
import axios from "axios";

export default function LabTabs() {
  const [isLoading,setIsLoading] = useState(false);

  const [myPortfolio,setMyPortfolio] = useState([]);
  const [tenX, setTenX] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"


  useEffect(()=>{
    setIsLoading(true)
    axios.get(`${baseUrl}api/v1/portfolio/myTenx`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
      .then((res)=>{
        setTenX(res.data.data);
      })
      .catch((err) => {
        setIsLoading(false)
        return new Error(err);
      })
    
      axios.get(`${baseUrl}api/v1/portfolio/myPortfolio`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
          },
        })
        .then((res)=>{
          setMyPortfolio(res.data.data);
          setIsLoading(false)
        })
        .catch((err) => {
          setIsLoading(false)
          return new Error(err);
        })

  }, [])

  // useEffect(()=>{
  //   axios.get(`${baseUrl}api/v1/portfolio/myPortfolio`,{
  //     withCredentials: true,
  //     headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         "Access-Control-Allow-Credentials": true
  //       },
  //     })
  //     .then((res)=>{
  //       setMyPortfolio(res.data.data);
  //     })
  //     .catch((err) => {
  //       setIsLoading(false)
  //       return new Error(err);
  //     })
  // }, [])

  return (
   
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto'>
          
          {isLoading ? 
          <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
              <CircularProgress color='info'/>
          </MDBox>
          :
          <Grid container >
              <Grid item xs={12} md={6} lg={12} mb={2}>
                <MDTypography mb={2} color="light" fontWeight="bold" style={{textDecoration: "underline"}}>Virtual Trading Portfolio(s)</MDTypography>
                <MyPortfolio type="Virtual Trading" data={myPortfolio}/>
              </Grid>
        
              <Grid item xs={12} md={6} lg={12}>
                <MDTypography mb={2} color="light" fontWeight="bold" style={{textDecoration: "underline"}}>TenX Trading Portfolio(s)</MDTypography>
                <MyPortfolio type="TenX Trading" data={tenX}/>
              </Grid>
          </Grid>
          }
    </MDBox>
  );
}