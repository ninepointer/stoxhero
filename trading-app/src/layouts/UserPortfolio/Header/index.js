import React, {useState, useEffect} from 'react';
// import Box from '@mui/material/Box';
// import Tab from '@mui/material/Tab';
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MyPortfolio from '../data/Portfolios'
import MDTypography from '../../../components/MDTypography';
import axios from "axios";

export default function LabTabs() {
  // const [value, setValue] = React.useState('1');
  // const [isLoading,setIsLoading] = useState(false);

  // const handleChange = (event, newValue) => {
  //   setIsLoading(true)
  //   setValue(newValue);
  //   setTimeout(() => {
  //     setIsLoading(false)
  //   }, 500);
  // };

  const [myPortfolio,setMyPortfolio] = useState([]);
  // const [portfolioPnl, setPortfolioPnl] = useState([]);
  const [tenX, setTenX] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"


  useEffect(()=>{
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
  }, [])

  console.log("myPortfolio", myPortfolio)

  useEffect(()=>{
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
      })
  }, [])

  return (
   
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='auto'>
          
          <Grid container >
              <Grid item xs={12} md={6} lg={12} mb={2}>
                <MDTypography mb={2} color="light" fontWeight="bold" style={{textDecoration: "underline"}}>Virtual Trading Porfolio(s)</MDTypography>
                <MyPortfolio type="Virtual Trading" data={myPortfolio}/>
              </Grid>
        
              <Grid item xs={12} md={6} lg={12}>
                <MDTypography mb={2} color="light" fontWeight="bold" style={{textDecoration: "underline"}}>TenX Trading Porfolio(s)</MDTypography>
                <MyPortfolio type="TenX Trading" data={tenX}/>
              </Grid>
          </Grid>

    </MDBox>
  );
}