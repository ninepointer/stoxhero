import React, { useState, useEffect } from 'react'
import axios from "axios";
import { Checkbox, CircularProgress, FormControlLabel, FormGroup, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
// import MDTypography from '../../../components/MDTypography';
// import MDAvatar from '../../../components/MDAvatar';
// import todaysignup from '../../../assets/images/todaysignup.png'
// import netpnlicon from '../../../assets/images/netpnlicon.png'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import MDButton from '../../../components/MDButton';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { withStyles } from '@mui/styles';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { apiUrl } from '../../../constants/constants';
// import DownloadIcon from '@mui/icons-material/Download';
// import { saveAs } from 'file-saver';
// import html2canvas from 'html2canvas';
// import { Tooltip } from '@mui/material';
// import moment from 'moment';
// import Users from './users';

export default function FilteredUsers({ setFilteredUsers }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState({
    affiliate: {
      id: "Cummulative",
      name: ""
    },
    isLifetime: false
  });
  // const [referralProgramme, setReferralProgramme] = React.useState([]);
  const [affiliate, setAffiliate] = React.useState([]);
  const date = new Date();
  const lastMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const [startDate, setStartDate] = React.useState(dayjs(lastMonth));

  const [endDate, setEndDate] = React.useState(dayjs(date));


  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const CustomTextField = withStyles({
    root: {
      '& .MuiInputBase-input': {
        color: '#000000', // Replace 'red' with your desired text color
        textAlign: 'center',
        height: '48px'
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: '#000000', // Replace 'red' with your desired text color
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#000000', // Replace 'red' with your desired text color
      },
    },
  })(TextField);

  useEffect(() => {
    handleShowDetails(startDate, endDate, selectedTab?.affiliate?.id, selectedTab?.isLifetime);
    setIsLoading(true);
    let call1 = axios.get(`${baseUrl}api/v1/affiliate`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })

    Promise.all([call1])
      .then(([api1Response]) => {
        setAffiliate(api1Response.data.data)
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle errors here
        console.error(error);
      });

  }, [])


  async function handleShowDetails(startDate, endDate, programe, lifetime) {
    setFilteredUsers([]);
    try {

      const res = await axios.get(`${apiUrl}affiliate/leaderboard?programme=${programe}&startDate=${startDate}&endDate=${endDate}&lifetime=${lifetime} `, { withCredentials: true });
      if (res.status == 200) {
        setFilteredUsers(res.data.data);
        setIsLoading(false);
      } else {
        //handle error
      }
    } catch (e) {
      console.log(e);
      //handle error
    }
  }

  const handleAffiliateChange = async (e) => {
    const affiliateId = e.target.value;
    const selectedAffiliate = affiliate.filter(elem => elem?._id == affiliateId);
    console.log('selected', selectedAffiliate[0], affiliateId);
    setSelectedTab((prev) => {
      return {
        ...prev,
        affiliate: {
          id: affiliateId || selectedAffiliate[0]?._id,
          name: selectedAffiliate[0]?.affiliateType
        },
      }
    });
    console.log('selected tab', selectedTab);

    await handleShowDetails(startDate, endDate, e.target.value, selectedTab?.isLifetime);

  }

  const handleLifetime = async (value) => {

    setSelectedTab(prevState => ({
      ...prevState,
      isLifetime: value
    }))

    await handleShowDetails(startDate, endDate, selectedTab?.affiliate?.id, value);
  }


  return (
    <>

      <Grid item xs={12} md={6} lg={12}>
        <MDBox display="flex" alignContent="center" alignItems="center">
          <Grid container display="flex" alignContent="center" alignItems="center">

            <Grid container xs={12} md={6} lg={12} display="flex" alignContent="center" alignItems="center" justifyContent='space-between'>

              <Grid item xs={12} md={6} lg={3} mb={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={async (e) => { setStartDate(prev => dayjs(e)); await handleShowDetails(dayjs(e), endDate, selectedTab?.affiliate?.id, selectedTab?.isLifetime); }}
                        sx={{ width: '100%' }}
                        disabled={selectedTab?.isLifetime}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </MDBox>
              </Grid>

              <Grid item xs={12} md={6} lg={3} mb={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={async (e) => { if (startDate > dayjs(e)) return; setEndDate(prev => dayjs(e)); await handleShowDetails(startDate, dayjs(e), selectedTab?.affiliate?.id, selectedTab?.isLifetime) }}
                        disabled={selectedTab?.isLifetime}
                        sx={{ width: '100%' }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </MDBox>
              </Grid>

              <Grid item xs={12} md={6} lg={3} mb={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <FormGroup>
                  <FormControlLabel
                    checked={selectedTab?.isLifetime}
                    control={<Checkbox />}
                    onChange={(e) => {
                      handleLifetime(e.target.checked)
                    }}
                    label="LifeTime"
                  // value={selectedTab?.isLifetime}
                  />

                </FormGroup>
              </Grid>

              <Grid item xs={12} md={6} lg={3} mb={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                <CustomTextField
                  select
                  label="Affiliate Type"
                  value={selectedTab?.affiliate?.id}
                  minHeight="6em"
                  placeholder="Affiliate Type"
                  variant="outlined"
                  sx={{ width: "250px" }}
                  onChange={(e) => { handleAffiliateChange(e) }}
                  InputLabelProps={{
                    style: { color: '#000000' },
                  }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: { width: '250px' }, // Replace '200px' with your desired width
                      },
                    },
                  }}
                >
                  {affiliate?.map((option) => (
                    <MenuItem key={option?._id} value={option?._id} minHeight="4em" width='300px'>
                      {option?.affiliateType}
                    </MenuItem>
                  ))}
                  <MenuItem value={"Cummulative"} minHeight="4em" width='300px'>
                    {"Cummulative"}
                  </MenuItem>
                </CustomTextField>
              </Grid>


            </Grid>

            {/* <Grid item xs={12} md={6} lg={12} mt={0} mb={0} display="flex" justifyContent="flex-end" width='100%'>
                      <MDButton variant="contained" color="info" onClick={handleShowDetails}>Show Leaderboard</MDButton>
                    </Grid> */}

          </Grid>
        </MDBox>
      </Grid>
    </>
  );
}