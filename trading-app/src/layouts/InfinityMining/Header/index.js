import React, {useState, useEffect} from 'react';
import MDBox from '../../../components/MDBox';
import axios from 'axios';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import {Link} from 'react-router-dom'
import { CircularProgress, Grid, LinearProgress } from '@mui/material';
import Logo from '../../../assets/images/default-profile.png'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material';

//data
import LiveMockInfinityDailyData from '../data/liveMockInfinityDailyChart'
import PNLSummary from '../data/pnlSummary'
import TraderMetrics from '../data/traderMetrics'
import TraderDetails from '../data/traderDetails';
import LiveMockInfinityTableData from '../data/liveMockInfinityDailyDataTable'

const CustomAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-clearIndicator {
    color: white;
  }
`;


export default function InfinityMining() {
  const [sideSelectedOption, setSideSelectedOption] = useState(sides[0]);
  const [traderSelectedOption, setTraderSelectedOption] = useState();
  const [infinityMiningData, setInfinityMiningData] = useState();
  const [traderId,setTraderId] = useState();
  const [infinityTraders,setInfinityTraders] = useState();
  const [isLoading, setIsLoading] = useState(false);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  useEffect(()=>{
    console.log("Inside Use Effect")
    setIsLoading(true)
    let call2 = axios.get((`${baseUrl}api/v1/infinityTraders`),{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
    Promise.all([call2])
    .then(([api1Response2]) => {
      // Process the responses here
      console.log(api1Response2.data.data);
      setTraderSelectedOption(traderSelectedOption ? traderSelectedOption : api1Response2.data.data[0]);
      setTraderId(traderSelectedOption ? traderSelectedOption : api1Response2.data.data[0]);
      setInfinityTraders(api1Response2.data.data)
      InfinityMining(traderId)
      setTimeout(()=>{
        setIsLoading(false)
      },1000)
      
    })
    .catch((error) => {
      // Handle errors here
      setIsLoading(false)
      console.error(error);
    });  
  },[traderId])

  async function InfinityMining(traderId){
    console.log("Infinity Mining Function Called")
    let call1 = await axios.get((`${baseUrl}api/v1/infinitymining/traderstats/${traderId?._id}`),{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
    Promise.all([call1])
    .then(([api1Response1]) => {
      // Process the responses here
      console.log("Infinity Mining Data:",api1Response1.data.data);
      setInfinityMiningData(api1Response1.data.data)
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    }); 
  }

  console.log(traderSelectedOption)

  const handleSideOptionChange = (event, newValue) => {
    console.log("Side Selection:",newValue)
    setSideSelectedOption(newValue);
  };

  const handleTraderOptionChange = (event, newValue) => {
    console.log("Trader Selection:",newValue)
    setTraderSelectedOption(newValue);
    setTraderId(newValue);
  };

  return (
    <>
    {infinityTraders && 
      <MDBox>
       
       <MDBox bgColor="primary" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='10vh'>
         
          <Grid container lg={12}>
              <Grid item lg={4}>
                  <CustomAutocomplete
                    id="country-select-demo"
                    sx={{ 
                      width: 300,
                      '& .MuiAutocomplete-clearIndicator': {
                        color: 'white',
                      },
                     }}
                    options={infinityTraders}
                    value={traderSelectedOption}
                    onChange={handleTraderOptionChange}
                    autoHighlight
                    getOptionLabel={(option) => option.first_name + ' ' + option.last_name + ' - ' + option.cohort}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <img
                          loading="lazy"
                          width="20"
                          src={option.profilePhoto?.url || Logo}
                          srcSet={option.profilePhoto?.url || Logo}
                          alt=""
                        />
                        {option.first_name + ' ' + option.last_name + ' - ' + option.cohort}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Choose a Trader"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password', // disable autocomplete and autofill
                          style: { color: 'white' }, // set text color to white
                        }}
                        InputLabelProps={{
                          style: { color: 'white' }, // set label color to white
                        }}
                      />
                    )}
                  />
              </Grid>

              <Grid item lg={4}>
                  <CustomAutocomplete
                    id="country-select-demo"
                    disabled
                    sx={{ 
                      width: 300,
                      '& .MuiAutocomplete-clearIndicator': {
                        color: 'white',
                      },
                     }}
                    options={sides}
                    value={sideSelectedOption}
                    onChange={handleSideOptionChange}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <img
                          loading="lazy"
                          width="20"
                          src={option.image}
                          srcSet={option.image}
                          alt=""
                        />
                        {option.label}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Choose Side"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password', // disable autocomplete and autofill
                          style: { color: 'white' }, // set text color to white
                        }}
                        InputLabelProps={{
                          style: { color: 'white' }, // set label color to white
                        }}
                      />
                    )}
                  />
              </Grid>
          </Grid>
          
      </MDBox>

      {isLoading &&
      <MDBox
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999}}
      >
       <CircularProgress/>
      </MDBox>
      } 
      <MDBox style={{backgroundColor:'white'}} color="light" mt={1} mb={1} p={0} borderRadius={0} minHeight='auto'>
          <Grid container spacing={0}>
            
            <Grid item xs={12} md={8} lg={4}>
              
              <Grid item xs={12} md={8} lg={12} style={{backgroundColor:'white'}} width='100%'>
                {traderId && <TraderDetails traderId = {traderId} isLoading={isLoading}/>}   
              </Grid>

            </Grid>

            <Grid item xs={12} md={8} lg={8}>
              
              <Grid item xs={12} md={12} lg={12} p={2} display='flex' justifyContent='center' flexDirection='column' style={{backgroundColor:'white', width:'100%'}}>
                {infinityMiningData && <PNLSummary infinityMiningData={infinityMiningData} isLoading={isLoading}/>}
              </Grid>

              <Grid item xs={12} md={8} lg={12} p={2} style={{backgroundColor:'white', width:'100%'}}>
                {infinityMiningData && <TraderMetrics infinityMiningData={infinityMiningData} isLoading={isLoading}/>}
              </Grid>

            </Grid>
            
          </Grid>
          
      </MDBox>

      <MDBox bgColor="light" color="light" mt={1} mb={1} p={0} borderRadius={0} minHeight='auto'>

          <Grid item xs={12} md={8} lg={12} mt={1} style={{minHeight:'auto'}}>
              <Grid container width='100%'>
                <Grid item lg={12} style={{backgroundColor:'white', width:'100%'}}>
                    <LiveMockInfinityDailyData isLoading={isLoading}/>
                </Grid>
              </Grid>
          </Grid>

      </MDBox>

      <MDBox bgColor="light" color="light" mt={1} mb={1} p={0} borderRadius={0} minHeight='auto'>

          <Grid item xs={12} md={8} lg={12} mt={1} style={{minHeight:'auto'}}>
              <Grid container width='100%'>
                <Grid item lg={12} p={1} style={{backgroundColor:'white', width:'100%'}}>
                    <LiveMockInfinityTableData isLoading={isLoading}/>
                </Grid>
              </Grid>
          </Grid>

      </MDBox>

    </MDBox>}
    </>
  );
}

const sides = [
  {  
    label: 'Trader Side',
  },
  {
    label: 'Company Side', 
  }
];