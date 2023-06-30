import React, {useState} from 'react';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import {Link} from 'react-router-dom'
import { Grid } from '@mui/material';
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
  const [traderSelectedOption, setTraderSelectedOption] = useState(traders[0]);

  const handleSideOptionChange = (event, newValue) => {
    setSideSelectedOption(newValue);
  };

  const handleTraderOptionChange = (event, newValue) => {
    setTraderSelectedOption(newValue);
  };

  return (
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
                    options={traders}
                    value={traderSelectedOption}
                    onChange={handleTraderOptionChange}
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

      <MDBox bgColor="light" color="light" mt={1} mb={1} p={0} borderRadius={0} minHeight='auto'>
          <Grid container spacing={0}>
            
            <Grid item xs={12} md={8} lg={4}>
              
              <Grid item xs={12} md={8} lg={12} style={{backgroundColor:'white'}} width='100%'>
                <TraderDetails/>     
              </Grid>

            </Grid>

            <Grid item xs={12} md={8} lg={8}>
              
              <Grid item xs={12} md={12} lg={12} p={2} display='flex' justifyContent='center' flexDirection='column' style={{backgroundColor:'white', width:'100%'}}>
                <PNLSummary/>
              </Grid>

              <Grid item xs={12} md={8} lg={12} p={2} style={{backgroundColor:'white', width:'100%'}}>
                <TraderMetrics/>
              </Grid>

            </Grid>
            
          </Grid>
          
      </MDBox>

      <MDBox bgColor="light" color="light" mt={1} mb={1} p={0} borderRadius={0} minHeight='auto'>

          <Grid item xs={12} md={8} lg={12} mt={1} style={{minHeight:'auto'}}>
              <Grid container width='100%'>
                <Grid item lg={12} style={{backgroundColor:'white', width:'100%'}}>
                    <LiveMockInfinityDailyData/>
                </Grid>
              </Grid>
          </Grid>

      </MDBox>

      <MDBox bgColor="light" color="light" mt={1} mb={1} p={0} borderRadius={0} minHeight='auto'>

          <Grid item xs={12} md={8} lg={12} mt={1} style={{minHeight:'auto'}}>
              <Grid container width='100%'>
                <Grid item lg={12} p={1} style={{backgroundColor:'white', width:'100%'}}>
                    <LiveMockInfinityTableData/>
                </Grid>
              </Grid>
          </Grid>

      </MDBox>

    </MDBox>
  );
}

const traders = [
  {  
    label: 'Prateek Pawan',
    image: Logo,
    id: '1'
  },
  {
    label: 'Manish Nair', 
    image: Logo,
    id: '2'
  },
  { 
    label: 'Anamika Verma', 
    image: Logo,
    id: '3'
  },
  {
    label: 'Preetraj Anand',
    image: Logo,
    id: '4'
  }
];

const sides = [
  {  
    label: 'Company Side',
  },
  {
    label: 'Trader Side', 
  }
];