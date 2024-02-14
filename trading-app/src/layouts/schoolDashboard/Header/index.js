import { useState, useEffect, useContext } from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { styled, Autocomplete, Grid, Box, TextField } from '@mui/material';
import { userContext } from '../../../AuthContext';
import MDTypography from '../../../components/MDTypography';
import { CircularProgress, Typography, Paper } from '@mui/material';
import TotalDataTiles from '../data/totalDataTiles';
import TotalRegistrationChart from '../data/totalRegistrationChart';
import RecentJoinee from '../data/recentJoinee';
import QuizRegistrationChart from '../data/quizRegistrationChart';
import QuizJoined from '../data/quizJoinedStudent';
import QuizRegistrationChartDateWise from '../data/quizRegistrationChartDateWise';
import { apiUrl } from '../../../constants/constants';

const CustomAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-clearIndicator {
    color: white;
  }
`;

export default function Dashboard() {

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [quizValue, setQuizValue] = useState(data && data[0]);

  useEffect(()=>{
    fetchQuiz()
  }, [])

  async function fetchQuiz(){
    const data = await axios.get(`${apiUrl}quiz/school`, {withCredentials: true});
    setData(data?.data?.data);
  }

  const handleQuizChange = (event, newValue) => {
    setQuizValue(newValue);
  };

  return (

    <MDBox mt={2} mb={1} borderRadius={10} minHeight='auto' display='flex' justifyContent='center' alignItems='center' flexDirection='column'>

      {!isLoading ?
        <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ minWidth: '100%', minHeight: 'auto' }}>

          <Grid item xs={12} md={12} lg={8} display='flex' justifyContent='center' alignItems='center' style={{ width: '100%', minHeight: 'auto' }}>
            <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ minWidth: '100%', minHeight: 'auto' }}>
              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                <TotalRegistrationChart />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={12} lg={4} mt={1} style={{ width: '100%', height: '400px' }}>
              <RecentJoinee />
          </Grid>

          <Grid item xs={12} md={12} lg={12} display='flex' flexDirection='column' justifyContent='flex-start' alignItems='center' style={{ width: '100%', minHeight: 'auto' }}>
            <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ minWidth: '100%', minHeight: 'auto' }}>
              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                <CustomAutocomplete
                  id="country-select-demo"
                  sx={{
                    width: "100%",
                    backgroundColor: "#ffffff", // Set background color here
                    '& .MuiAutocomplete-clearIndicator': {
                      color: 'dark',
                    },
                  }}
                  options={data}
                  value={quizValue}
                  onChange={handleQuizChange}
                  autoHighlight
                  getOptionLabel={(option) => option ? option?.title : 'Grade'}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      {option?.title}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Quiz"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                        style: { color: 'dark', height: "10px" }, // set text color to dark
                      }}
                      InputLabelProps={{
                        style: { color: 'dark' },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <MDTypography sx={{ textAlign: 'start' }} fontSize={12}>
                  **The information below this section is filtered based on the selected quiz
                </MDTypography>
              </Grid>
            </Grid>
          </Grid>



          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ width: '100%', minHeight: 'auto' }}>
            <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ minWidth: '100%', minHeight: 'auto' }}>
              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                <TotalDataTiles />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={12} lg={8} mt={1} display='flex' justifyContent='center' alignItems='center' style={{ width: '100%', minHeight: 'auto' }}>
            <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
              <Grid item spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ width: '100%', minHeight: 'auto' }}>
                <QuizRegistrationChart />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={12} lg={4} mt={2} style={{ width: '100%', height: '400px' }}>
              <QuizJoined />
          </Grid>

          <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center' alignItems='center' style={{ width: '100%', minHeight: 'auto' }}>
            <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
              <Grid item spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ width: '100%', minHeight: 'auto' }}>
                <QuizRegistrationChartDateWise />
              </Grid>
            </Grid>
          </Grid>

        </Grid>
        :
        <Grid container mb={1} spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ minWidth: '100%', minHeight: '380px' }}>
          <CircularProgress />
        </Grid>
      }

    </MDBox>
  );
}