import React, {useState, useEffect, useContext} from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
import Grid from "@mui/material/Grid";
import { userContext } from '../../../AuthContext';
import MDTypography from '../../../components/MDTypography';
import { CircularProgress, LinearProgress, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { saveAs } from 'file-saver';

//data
import ThisMonthFunnel from "../data/thisMonthFunnel"
import LifetimeFunnel from "../data/lifetimeFunnel"
import MonthlyActiveUsers from "../data/monthlyActiveUserData"
import MDButton from '../../../components/MDButton';
import moment from 'moment';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Janurary',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const years = [
  '2022',
  '2023',
  '2024',
  '2025',
];

function getStyles(name, monthName, theme) {
  return {
    fontWeight:
      monthName.indexOf(name) === 1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function Dashboard() {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let [marketingFunnel,setMarketingFunnel] = useState([])
  let [marketingFunnelLifetime,setMarketingFunnelLifetime] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [downloadingActiveUsers, setDownloadingActiveUsers] = useState(false)
  const [downloadingPaidUsers, setDownloadingPaidUsers] = useState(false)
  const [downloadingSignUpUsers, setDownloadingSignUpUsers] = useState(false)
  const [downloadingLifetimeSignUpUsers, setDownloadingLifetimeSignUpUsers] = useState(false)
  const [downloadingLifetimeActiveUsers, setDownloadingLifetimeActiveUsers] = useState(false)
  const [downloadingLifetimePaidUsers, setDownloadingLifetimePaidUsers] = useState(false)
  // const [downloadingPaidUsers, setDownloadingPaidUsers] = useState(false)
  const [isLoadingLifetime, setIsLoadingLifetime] = useState(false)
  const getDetails = useContext(userContext);
  const userId = getDetails.userDetails._id
  const theme = useTheme();
  const today = new Date()
  const currentMonth = today.getMonth()+1
  const monthNamesArray = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  const month = monthNamesArray[parseInt(currentMonth) - 1];

  const [monthName, setMonthName] = React.useState(month);
  const [yearNumber, setYearNumber] = React.useState('2023');

  function TruncatedName(name) {
    const originalName = name;
    const convertedName = originalName
      .toLowerCase() // Convert the entire name to lowercase
      .split(' ') // Split the name into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back together with a space
  
    // Trim the name to a maximum of 30 characters
    const truncatedName = convertedName.length > 30 ? convertedName.substring(0, 30) + '...' : convertedName;
  
    return truncatedName;
  }


  function monthNameToNumber(month) {
    switch (month) {
      case 'January':
        return 1;
      case 'February':
        return 2;
      case 'March':
        return 3;
      case 'April':
        return 4;
      case 'May':
        return 5;
      case 'June':
        return 6;
      case 'July':
        return 7;
      case 'August':
        return 8;
      case 'September':
        return 9;
      case 'October':
        return 10;
      case 'November':
        return 11;
      case 'December':
        return 12;
      default:
        return null; // Handle invalid input
    }
  }
  
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setMonthName(value);
      console.log("Month Name:",monthName)
  };

  const handleYearChange = (event) => {
    const {
      target: { value },
    } = event;
    setYearNumber(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  
  useEffect(()=>{
    setIsLoading(true)
    let call1 = axios.get((`${baseUrl}api/v1/stoxherouserdashboard/marketingfunnel/${monthNameToNumber(monthName)}/${parseInt(yearNumber)}`),{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })
    Promise.all([call1])
    .then(([api1Response]) => {
      setMarketingFunnel(api1Response.data.data)
      setTimeout(()=>{
        setIsLoading(false)
      },500)
      
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
    
  },[monthName, yearNumber])

  useEffect(()=>{
    setIsLoadingLifetime(true)
    let call2 = axios.get((`${baseUrl}api/v1/stoxherouserdashboard/marketingfunnellifetime`),{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
            },
        })
    Promise.all([call2])
    .then(([api1Response]) => {
      setMarketingFunnelLifetime(api1Response.data.data)
      setTimeout(()=>{
        setIsLoadingLifetime(false)
      },500)
      
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });
    
  },[])

  const downloadThisMonthActiveUsersData = () => {
    setDownloadingActiveUsers(true)
    return new Promise((resolve, reject) => {
        axios
        .get(`${baseUrl}api/v1/stoxherouserdashboard/thismonthactive/${monthNameToNumber(monthName)}/${yearNumber}`, {
            withCredentials: true,
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
            },
        })
        .then((res) => {
            resolve(res.data.data); // Resolve the promise with the data
            setDownloadingActiveUsers(false)
        })
        .catch((err) => {
            console.log(err)
            reject(err); // Reject the promise with the error'
            setDownloadingActiveUsers(false)
        });
    });
    };

  const downloadThisMonthPaidUsersData = () => {
    setDownloadingPaidUsers(true)
    return new Promise((resolve, reject) => {
        axios
        .get(`${baseUrl}api/v1/stoxherouserdashboard/thismonthpaid/${monthNameToNumber(monthName)}/${yearNumber}`, {
            withCredentials: true,
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
            },
        })
        .then((res) => {
            resolve(res.data.data); // Resolve the promise with the data
            setDownloadingPaidUsers(false)
        })
        .catch((err) => {
            console.log(err)
            reject(err); // Reject the promise with the error
            setDownloadingPaidUsers(false)
        });
    });
    };

  const downloadThisMonthSignUpUsersData = () => {
    setDownloadingSignUpUsers(true)
    return new Promise((resolve, reject) => {
        axios
        .get(`${baseUrl}api/v1/stoxherouserdashboard/thismonthsignup/${monthNameToNumber(monthName)}/${yearNumber}`, {
            withCredentials: true,
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
            },
        })
        .then((res) => {
          resolve(res.data.data); // Resolve the promise with the data
          setDownloadingSignUpUsers(false)
        })
        .catch((err) => {
            console.log(err)
            reject(err); // Reject the promise with the error
            setDownloadingSignUpUsers(false)
        });
    });
    };

  const downloadLifetimeSignUpUsersData = () => {
    setDownloadingLifetimeSignUpUsers(true)
    return new Promise((resolve, reject) => {
        axios
        .get(`${baseUrl}api/v1/stoxherouserdashboard/lifetimesignup`, {
            withCredentials: true,
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
            },
        })
        .then((res) => {
          resolve(res.data.data); // Resolve the promise with the data
          setDownloadingLifetimeSignUpUsers(false)
        })
        .catch((err) => {
            console.log(err)
            reject(err); // Reject the promise with the error
            setDownloadingLifetimeSignUpUsers(false)
        });
    });
    };

  const downloadLifetimeActiveUsersData = () => {
    setDownloadingLifetimeActiveUsers(true)
    return new Promise((resolve, reject) => {
        axios
        .get(`${baseUrl}api/v1/stoxherouserdashboard/lifetimeactive`, {
            withCredentials: true,
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
            },
        })
        .then((res) => {
          resolve(res.data.data); // Resolve the promise with the data
          setDownloadingLifetimeActiveUsers(false)
        })
        .catch((err) => {
            console.log(err)
            reject(err); // Reject the promise with the error
            setDownloadingLifetimeActiveUsers(false)
        });
    });
    };

    const downloadLifetimePaidUsersData = () => {
      setDownloadingLifetimePaidUsers(true)
      return new Promise((resolve, reject) => {
          axios
          .get(`${baseUrl}api/v1/stoxherouserdashboard/lifetimepaid`, {
              withCredentials: true,
              headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials': true,
              },
          })
          .then((res) => {
            resolve(res.data.data); // Resolve the promise with the data
            setDownloadingLifetimePaidUsers(false)
          })
          .catch((err) => {
              console.log(err)
              reject(err); // Reject the promise with the error
              setDownloadingLifetimePaidUsers(false)
          });
      });
      };
    
  const handleDownload = async (nameVariable) => {
    try {
      // Wait for downloadContestData() to complete and return data
      let data = [];
      let csvData = [];
      if(nameVariable === 'Month Paid User'){
        data = await downloadThisMonthPaidUsersData();
        csvData = downloadHelper(data)
      }
      if(nameVariable === 'Month SignUp Users'){
        data = await downloadThisMonthSignUpUsersData();
        csvData = downloadHelper(data)
      }
      if(nameVariable === 'Month Active User'){
        data = await downloadThisMonthActiveUsersData();
        csvData = downloadHelper(data)
      }
      if(nameVariable === 'Lifetime SignUp User'){
        data = await downloadLifetimeSignUpUsersData();
        csvData = downloadHelper(data)
      }
      if(nameVariable === 'Lifetime Active User'){
        data = await downloadLifetimeActiveUsersData();
        csvData = downloadHelper(data)
      }
      if(nameVariable === 'Lifetime Paid User'){
        data = await downloadLifetimePaidUsersData();
        csvData = downloadHelper(data)
      }
      // Create the CSV content
      const csvContent = csvData?.map((row) => {
        return row?.map((row1) => row1.join(',')).join('\n');
      });
  
      // Create a Blob object with the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  
      // Save the file using FileSaver.js
      saveAs(blob, `${nameVariable}.csv`);
    } catch (error) {
      console.error('Error downloading monthly active users data:', error);
    }
  }
    
  function downloadHelper(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [["#","Full Name", "Email", "Mobile", "Signup Method","Joining Date", "Campaign", "Referrer Code", "My Referral Code"]]
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem, index) => {

        return [
          index+1,
          TruncatedName(elem?.first_name + ' ' + elem?.last_name),
          elem?.email,
          elem?.mobile,
          elem?.creationProcess,
          elem?.joining_date,
          elem?.campaign,
          elem?.referrerCode,
          elem?.myReferralCode,
        ]
      })
    }

    return [[...csvDataDailyPnl, ...csvDataFile]]
  }


  return (
   
    <MDBox bgColor="light" color="light" mt={2} mb={1} borderRadius={10} minHeight='auto'>
          <Grid container component={Paper} p={.5} mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center'>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-name-label">Month</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  value={monthName}
                  onChange={handleChange}
                  input={<OutlinedInput label="Name" />}
                  MenuProps={MenuProps}
                >
                  {names.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      style={getStyles(name, monthName, theme)}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center'>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-name-label">Year</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  value={yearNumber}
                  onChange={handleYearChange}
                  input={<OutlinedInput label="Year" />}
                  MenuProps={MenuProps}
                >
                  {years.map((year) => (
                    <MenuItem
                      key={year}
                      value={year}
                      style={getStyles(year, yearNumber, theme)}
                    >
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container component={Paper} p={1} mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
                <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center'>
                <MDBox>
                  <MDButton
                    variant='contained'
                    color='info'
                    size='small'
                    onClick={() => { handleDownload(`Month SignUp Users`) }}
                  >
                    {!downloadingSignUpUsers ? (
                      <div>
                        <MDTypography variant="text" color="textSecondary" style={{ marginTop: '0px' }}>
                          {monthName + ' Signup Data'}
                        </MDTypography>
                      </div>
                    ) : (
                      <div>
                        <CircularProgress size={12} thickness={4} color="primary" />
                        <MDTypography variant="text" color="textSecondary" style={{ marginTop: '0px' }}>
                          Downloading SignUp...
                        </MDTypography>
                      </div>
                    )}
                  </MDButton>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center'>
                <MDBox>
                  <MDButton
                    variant='contained'
                    color='info'
                    size='small'
                    onClick={() => { handleDownload(`Month Active User`) }}
                  >
                    {!downloadingActiveUsers ? (
                      <div>
                        <MDTypography variant="text" color="textSecondary" style={{ marginTop: '0px' }}>
                          {monthName + ' Active User'}
                        </MDTypography>
                      </div>
                    ) : (
                      <div>
                        <CircularProgress size={12} thickness={4} color="primary" />
                        <MDTypography variant="text" color="textSecondary" style={{ marginTop: '0px' }}>
                          Downloading Active User Data...
                        </MDTypography>
                      </div>
                    )}
                  </MDButton>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center'>
                <MDBox>
                  <MDButton
                    variant='contained'
                    color='info'
                    size='small'
                    onClick={() => { handleDownload(`Month Paid User`) }}
                  >
                    {!downloadingPaidUsers ? (
                      <div>
                        <MDTypography variant="text" color="textSecondary" style={{ marginTop: '0px' }}>
                          {monthName + ' Paid User'}
                        </MDTypography>
                      </div>
                    ) : (
                      <div>
                        <MDBox display='flex' justifyContent='center' alignItems='center'>
                          <MDBox display='flex' justifyContent='center' alignItems='center'>
                            <CircularProgress size={14} thickness={4} color="light" />
                          </MDBox>
                          <MDBox display='flex' justifyContent='center' alignItems='center'>
                            <MDTypography variant="text" color="light" style={{ marginTop: '0px' }}>
                              Downloading Paid User Data...
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </div>
                    )}
                  </MDButton>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center'>
                <MDBox>
                  <MDButton
                    variant='contained'
                    color='info'
                    size='small'
                    onClick={() => { handleDownload(`Lifetime SignUp User`) }}
                  >
                    {!downloadingLifetimeSignUpUsers ? (
                      <div>
                        <MDTypography variant="text" color="textSecondary" style={{ marginTop: '0px' }}>
                          Lifetime Signup Data
                        </MDTypography>
                      </div>
                    ) : (
                      <div>
                        <MDBox display='flex' justifyContent='center' alignItems='center'>
                          <MDBox display='flex' justifyContent='center' alignItems='center'>
                            <CircularProgress size={14} thickness={4} color="light" />
                          </MDBox>
                          <MDBox display='flex' justifyContent='center' alignItems='center'>
                            <MDTypography variant="text" color="light" style={{ marginTop: '0px' }}>
                              Downloading Lifetime SignUp...
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </div>
                    )}
                  </MDButton>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center'>
                <MDBox>
                  <MDButton
                    variant='contained'
                    color='info'
                    size='small'
                    onClick={() => { handleDownload(`Lifetime Active User`) }}
                  >
                    {!downloadingLifetimeActiveUsers ? (
                      <div>
                        <MDTypography variant="text" color="textSecondary" style={{ marginTop: '0px' }}>
                          Lifetime Active Users
                        </MDTypography>
                      </div>
                    ) : (
                      <div>
                        <MDBox display='flex' justifyContent='center' alignItems='center'>
                          <MDBox display='flex' justifyContent='center' alignItems='center'>
                            <CircularProgress size={14} thickness={4} color="light" />
                          </MDBox>
                          <MDBox display='flex' justifyContent='center' alignItems='center'>
                            <MDTypography variant="text" color="light" style={{ marginTop: '0px' }}>
                              Downloading Lifetime SignUp...
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </div>
                    )}
                  </MDButton>
                  </MDBox>
                </Grid>

                <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignItems='center'>
                <MDBox>
                  <MDButton
                    variant='contained'
                    color='info'
                    size='small'
                    onClick={() => { handleDownload(`Lifetime Paid User`) }}
                  >
                    {!downloadingLifetimePaidUsers ? (
                      <div>
                        <MDTypography variant="text" color="textSecondary" style={{ marginTop: '0px' }}>
                          Lifetime Paid Users
                        </MDTypography>
                      </div>
                    ) : (
                      <div>
                        <MDBox display='flex' justifyContent='center' alignItems='center'>
                          <MDBox display='flex' justifyContent='center' alignItems='center'>
                            <CircularProgress size={14} thickness={4} color="light" />
                          </MDBox>
                          <MDBox display='flex' justifyContent='center' alignItems='center'>
                            <MDTypography variant="text" color="light" style={{ marginTop: '0px' }}>
                              Downloading Lifetime Paid Users...
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </div>
                    )}
                  </MDButton>
                  </MDBox>
                </Grid>
          </Grid>

          <Grid container component={Paper} p={.5} mb={1} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={12}>
                {isLoading ?
                <MDBox display='flex' justifyContent='center' alignItems='center' flexDirection='column' minHeight={400}>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <CircularProgress color='info'/>
                  </MDBox>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <MDTypography fontSize={15}>Loading This Month's User Funnel...</MDTypography>
                  </MDBox>
                </MDBox>
                :
                <MDBox>
                  <ThisMonthFunnel marketingFunnel = {marketingFunnel} monthNumber = {monthNameToNumber(monthName)} yearNumber={yearNumber}/>
                 {/* {overallRevenue["Amount Credit"] && <RevenuePayout overallRevenue={overallRevenue}/>} */}
                </MDBox>
                }
            </Grid>
          </Grid>

          <Grid container component={Paper} p={.5} mb={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>
            <Grid item xs={12} md={12} lg={12}>
                {isLoadingLifetime ?
                <MDBox display='flex' justifyContent='center' alignItems='center' flexDirection='column' minHeight={400}>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <CircularProgress color='info'/>
                  </MDBox>
                  <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <MDTypography fontSize={15}>Loading Lifetime User Funnel...</MDTypography>
                  </MDBox>
                </MDBox>
                :
                <MDBox>
                  <LifetimeFunnel marketingFunnelLifetime={marketingFunnelLifetime}/>
                 {/* <DAUPlatform dailyActiveUsersPlatform={dailyActiveUsersPlatform}/> */}
                </MDBox>
                }
            </Grid>
          </Grid>

    </MDBox>
  );
}