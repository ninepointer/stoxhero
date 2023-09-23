import React, {useState, useEffect} from 'react'
import axios from "axios";
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
// import MDAvatar from '../../../components/MDAvatar';
// import todaysignup from '../../../assets/images/todaysignup.png'
// import netpnlicon from '../../../assets/images/netpnlicon.png'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import MDButton from '../../../components/MDButton';
import dayjs from 'dayjs';

export default function LabTabs() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState({
    referral: {
      id: "",
      name: ""
    },
    campaign: {
      id: "",
      name: ""
    }
  });
  const [referralProgramme, setReferralProgramme] = React.useState(0);
  const [campaign, setCampaign] = React.useState(0);
  const date = new Date();
  const lastMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  lastMonth.setDate(date.getDate());
  const [startDate,setStartDate] = React.useState(dayjs(lastMonth));
  const [endDate,setEndDate] = React.useState(dayjs(date));

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"


  const CustomTextField = withStyles({
    root: {
      '& .MuiInputBase-input': {
        color: '#ffffff', // Replace 'red' with your desired text color
        textAlign: 'center',
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: '#ffffff', // Replace 'red' with your desired text color
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#ffffff', // Replace 'red' with your desired text color
      },
    },
  })(TextField);

  const CustomTextField2 = withStyles({
    root: {
      '& .MuiInputBase-input': {
        color: '#ffffff', // Replace 'red' with your desired text color
        textAlign: 'center',
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: '#ffffff', // Replace 'red' with your desired text color
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#ffffff', // Replace 'red' with your desired text color
      },
    },
  })(TextField);

  useEffect(() => {

    setIsLoading(true);
    console.log("IsLoading: ", isLoading)
    let call1 = axios.get(`${baseUrl}api/v1/referrals/name`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })

    let call2 = axios.get(`${baseUrl}api/v1/campaign/name`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    Promise.all([call1, call2])
      .then(([api1Response, api2Response]) => {
        setReferralProgramme(api1Response.data.data)
        setCampaign(api2Response.data.data)
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle errors here
        console.error(error);
      });

  }, [])

  async function handleShowDetails(){

  }

  // function 

  // setselectedSubscription(referralProgramme.filter((item) => item._id == (e.target.value))[0])

  return (
    <>
    {isLoading ?
        <MDBox display="flex" justifyContent="center" alignItems="center" mt={10} mb={10}>
          <CircularProgress fontSize='xxl' color="light" />
        </MDBox>

      :
    
        <Grid mt={3} container>
          <Grid item xs={12} md={6} lg={12}>
            <MDBox bgColor="light" borderRadius={5}>

              <MDBox display="flex" justifyContent="space-around" alignContent="center" alignItems="center">
                <Grid container spacing={0} p={1} display="flex" justifyContent="space-evenly" alignContent="center" alignItems="center">


                  <Grid item xs={12} md={6} lg={9} mt={1} mb={1} p={0} display="flex" justifyContent="center" alignContent="center" alignItems="center">

                    <MDBox alignItem='center'>
                      <MDTypography display="flex" justifyContent="center" alignContent="center" alignItems="center" color="dark" fontSize={15} fontWeight="bold">Select Date Range</MDTypography>

                      <Grid container spacing={0} p={1} lg={12} display="flex" alignContent="center" alignItems="center" justifyContent='space-between'>

                        <Grid item xs={12} md={6} lg={4} mb={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                          <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                  label="Start Date"
                                  value={startDate}
                                  onChange={(e) => { setStartDate(prev => dayjs(e)) }}
                                  sx={{ width: '100%' }}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </MDBox>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4} mb={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                          <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                  label="End Date"
                                  // disabled={true}
                                  // defaultValue={dayjs(date)}
                                  value={endDate}
                                  onChange={(e) => { setEndDate(prev => dayjs(e)) }}
                                  // value={dayjs(date)}
                                  // onChange={(e) => {setFormStatePD(prevState => ({
                                  //   ...prevState,
                                  //   dateField: dayjs(e)
                                  // }))}}
                                  sx={{ width: '100%', marginLeft: "30px" }}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </MDBox>
                        </Grid>

                        <CustomTextField
                          select
                          label=""
                          value={selectedTab?.referral?.name}
                          minHeight="4em"
                          placeholder="Referral Programme"
                          variant="outlined"
                          sx={{ width: "400px" }}
                          onChange={(e) => {  }}
                          InputLabelProps={{
                            style: { color: '#ffffff' },
                          }}
                          SelectProps={{
                            MenuProps: {
                              PaperProps: {
                                style: { width: '400px' }, // Replace '200px' with your desired width
                              },
                            },
                          }}
                        >
                          {referralProgramme?.map((option) => (
                            <MenuItem key={option?._id} value={option?._id} minHeight="4em" width='300px'>
                              {option?.referralProgramName}
                            </MenuItem>
                          ))}
                        </CustomTextField>

                        <CustomTextField2
                          select
                          label=""
                          value={selectedTab?.campaign?.name}
                          minHeight="4em"
                          placeholder="Select Type"
                          variant="outlined"
                          sx={{ width: '150px', marginLeft: '4px', marginRight: '4px' }}
                          onChange={(e) => setselectedTab(e.target.value)}
                          InputLabelProps={{
                            style: { color: '#ffffff' },
                          }}
                          SelectProps={{
                            MenuProps: {
                              PaperProps: {
                                style: { width: '150px' }, // Replace '200px' with your desired width
                              },
                            },
                          }}
                        >
                          {campaign?.map((option) => (
                            <MenuItem key={option?._id} value={option?._id} minHeight="4em" width='300px'>
                              {option?.campaignName}
                            </MenuItem>
                          ))}
                        </CustomTextField2>

                        <Grid item xs={12} md={6} lg={4} mt={1} mb={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                          <MDButton variant="contained" color="info" onClick={handleShowDetails}>Show Details</MDButton>
                        </Grid>

                      </Grid>
                    </MDBox>
                  </Grid>


                </Grid>
              </MDBox>

            </MDBox>
          </Grid>
        </Grid>
      
    }
  </>
  );
}