import React,{useState, useEffect, useContext} from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
// import MDButton from '../../../components/MDButton'
import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, CardContent, CardMedia, CircularProgress, Divider, FormControl, Grid, InputLabel, Select } from '@mui/material';
import MDTypography from '../../../components/MDTypography';

import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
// import ListItemText from '@mui/material/ListItemText';
// import Checkbox from '@mui/material/Checkbox';
// import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
// import signupcount from 
import { apiUrl } from '../../../constants/constants';
import ReferredProduct from "../data/transactions"
import RaferralGrid from "../data/affiliateRaferrals"
import RecentReferralGrid from "../data/recentAffiliateRaferrals"
import logo from '../../../assets/images/logo1.jpeg'
import MDSnackbar from "../../../components/MDSnackbar";
import { userContext } from "../../../AuthContext";
import EarningsChart from '../data/last30daysEarningsChart'
import Referral2ActiveChart from '../data/pieChartReferral2Active'
import Referral2PaidChart from '../data/pieChartReferrals2Paid'
import MDButton from '../../../components/MDButton';
import {adminRole, userRole} from "../../../variables"
import ChooseAfiliate from "../data/chooseAffiliate"
import AfiliateBasicSummary from '../data/affiliateBasicSummary';
import moment from "moment";

export default function Dashboard() {
  const getDetails = useContext(userContext);
  const userDetails = getDetails.userDetails
  const [period, setPeriod] = React.useState('Today');
  let [isLoading,setIsLoading] = useState([])
  const [affiliateOverview,setAffiliateOverview] = useState([]);
  const [affiliateRafferalSummery,setAffiliateRafferalSummery] = useState([]);
  // const [affiliateReferrals,setAffiliateReferrals] = useState([]);
  const date = new Date();
  // const lastMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const [startDate, setStartDate] = React.useState(dayjs(date).startOf('day'));
  const [endDate, setEndDate] = useState(dayjs(date).endOf('day'));
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [successSB, setSuccessSB] = useState(false);
  const [affiliateData, setAffiliateData] = useState(null);
  const [referralData, setReferralData] = useState();
  const [chartData, setChartData] = useState([]);
  const [showDetailClicked, setShowDetailClicked] = useState(false);
  const openSuccessSB = (title, content) => {
    setTitle(title)
    setContent(content)
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);


  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={title}
      content={content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = (title, content) => {
    setTitle(title)
    setContent(content)
    setErrorSB(true);
  }
  const closeErrorSB = () => setErrorSB(false);

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title={title}
      content={content}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  useEffect(() => {
    setIsLoading(true)
    if (affiliateData || userDetails?.role?.roleName === userRole) {
      let call1 = axios.get((`${apiUrl}affiliate/${userDetails?.role?.roleName === adminRole ? "adminlast30daysdata" : "last30daysdata"}?affiliateId=${affiliateData?.affiliateId}&affiliateType=${affiliateData?.affiliateType}&affiliatePrograme=${affiliateData?.affiliatePrograme}`), {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })

      Promise.all([call1])
        .then(([api1Response]) => {
          setChartData(api1Response?.data?.data)
          setIsLoading(false)
        })
        .catch((error) => {
          //   Handle errors here
          console.error(error);
        });
    }

  }, [affiliateData])

  
  useEffect(() => {
    setIsLoading(true)
    if (affiliateData || userDetails?.role?.roleName === userRole) {
      let call1 = axios.get((`${apiUrl}affiliate/${userDetails?.role?.roleName === adminRole ? "adminsummery" : "mysummery"}?startDate=${startDate}&endDate=${endDate}&skip=${0}&limit=${10}&affiliateId=${affiliateData?.affiliateId}&affiliateType=${affiliateData?.affiliateType}&affiliatePrograme=${affiliateData?.affiliatePrograme}`), {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
      // let call2 = axios.get((`${apiUrl}affiliate/myaffiliaterafferals?startDate=${startDate}&endDate=${endDate}&skip=${0}&limit=${10}&affiliateId=${affiliateData}`), {
      //   withCredentials: true,
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //     "Access-Control-Allow-Credentials": true
      //   },
      // })

      Promise.all([call1])
        .then(([api1Response, api2Response]) => {
          setAffiliateOverview(api1Response?.data?.data[0])
          setAffiliateRafferalSummery(api1Response?.data?.affiliateRafferalSummery[0])
          // setAffiliateReferrals(api2Response?.data?.data?.affiliateReferrals)
          setIsLoading(false)
        })
        .catch((error) => {
          //   Handle errors here
          console.error(error);
        });
    }

  }, [affiliateData])



  async function handleShowDetails(){
    setShowDetailClicked(!showDetailClicked);
    if(new Date(startDate)>new Date(endDate)){
      return openErrorSB("Invalid Date Range", "Start Date is greater than End Date");
    }
    let call1 = axios.get((`${apiUrl}affiliate/${userDetails?.role?.roleName === adminRole ? "adminsummery" : "mysummery"}?startDate=${startDate}&endDate=${endDate}&skip=${0}&limit=${10}&affiliateId=${affiliateData?.affiliateId}&affiliateType=${affiliateData?.affiliateType}&affiliatePrograme=${affiliateData?.affiliatePrograme}`), {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    // let call2 = axios.get((`${apiUrl}affiliate/myaffiliaterafferals?startDate=${startDate}&endDate=${endDate}&skip=${0}&limit=${10}&affiliateId=${affiliateData?.affiliateId}&affiliateType=${affiliateData?.affiliateType}&affiliatePrograme=${affiliateData?.affiliatePrograme}`), {
    //   withCredentials: true,
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     "Access-Control-Allow-Credentials": true
    //   },
    // })

    Promise.all([call1])
      .then(([api1Response, api2Response]) => {
        setAffiliateOverview(api1Response?.data?.data[0])
        setAffiliateRafferalSummery(api1Response?.data?.affiliateRafferalSummery[0])
        // setAffiliateReferrals(api2Response?.data?.data?.affiliateReferrals)
        setIsLoading(false)
      })
      .catch((error) => {
        //   Handle errors here
        console.error(error);
      });
  }

  const handlePeriodChange = (event) => {
    const selectedPeriod = event.target.value;
    setPeriod(selectedPeriod);

    // Update start and end dates based on the selected period
    const today = moment();

    switch (selectedPeriod) {
      case 'Today':
        setStartDate(today.startOf('day'));
        setEndDate(today);
        break;
      case 'Yesterday':
        const yesterday = today.clone().subtract(1, 'day');
        setStartDate(yesterday.startOf('day'));
        setEndDate(yesterday);
        break;
      case 'This Week':
        const startDateOfWeek = today.clone().startOf('week');
        setStartDate(startDateOfWeek);
        setEndDate(today);
        break;
      case 'Last Week':
        const startDateOfLastWeek = today.clone().subtract(1, 'week').startOf('week');
        const endDateOfLastWeek = today.clone().subtract(1, 'week').endOf('week');
        setStartDate(startDateOfLastWeek);
        setEndDate(endDateOfLastWeek);
        break;
      case 'This Month':
        const firstDayOfMonth = today.clone().startOf('month');
        setStartDate(firstDayOfMonth);
        setEndDate(today);
        break;
      case 'Last Month':
        const firstDayOfLastMonth = today.clone().subtract(1, 'month').startOf('month');
        const lastDayOfLastMonth = today.clone().subtract(1, 'month').endOf('month');
        setStartDate(firstDayOfLastMonth);
        setEndDate(lastDayOfLastMonth);
        break;

        case 'Lifetime':
          setStartDate(moment("2000-01-01"));
          setEndDate(today);
          break;
      default:
        break;
    }
  };
  


  return (

    <MDBox mt={userDetails?.role?.roleName === adminRole ? 0 : 2} mb={1} borderRadius={10} minHeight='auto' width="100%" display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
        <Grid item xs={12} md={12} lg={12}>
          <MDTypography fontSize={15} ml={1.5} fontWeight='bold'>My Affiliate Dashboard</MDTypography>
        </Grid>
        {userDetails?.role?.roleName === adminRole &&
          <ChooseAfiliate setAffiliateData={setAffiliateData} />}

        {isLoading ?
          <Grid container display="flex" justifyContent="center" alignContent='center' alignItems="center">
            <Grid item display="flex" justifyContent="center" alignContent='center' alignItems="center" lg={12}>
              <MDBox mt={5} mb={5}>
                <CircularProgress color="info" />
              </MDBox>
            </Grid>
          </Grid>
          :
          <>

            <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center'>
              <Grid container spacing={2} xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{ width: '100%' }}>

                <Grid item xs={12} md={12} lg={4} style={{ width: '100%', minHeight: '410px' }}>
                  <AfiliateBasicSummary setReferralData={setReferralData} affiliateData={affiliateData} />
                </Grid>

                <Grid item xs={12} md={12} lg={8} style={{ width: '100%', minHeight: '410px' }}>
                  <Card sx={{ minWidth: '100%', minHeight: '410px', maxWidth: '100%', maxHeight: '410px' }}>
                    <CardContent sx={{ minWidth: '100%' }}>
                      {chartData?.length ?
                        <EarningsChart sx={{ minWidth: '100%' }} chartData={chartData} />
                        :
                        // <MDTypography color="secondary" mt={2} mb={2} fontSize={15} fontWeight='bold' display='flex' alignItems='center' alignContent='center' lineHeight='1.5' justifyContent='center'>No Transactions Yet!</MDTypography>
                        <MDTypography
                          color="secondary"
                          mt={22}
                          mb={2}
                          fontSize={15}
                          fontWeight='bold'
                          display='flex'
                          alignItems='center'
                          alignContent='center'
                          justifyContent='center'
                          textAlign='center'  // Center horizontally

                        >
                          No earnings in last 30 days Yet!
                        </MDTypography>
                      }
                    </CardContent>
                  </Card>
                </Grid>

              </Grid>
            </Grid>

            <Grid item xs={12} md={12} lg={12} mt={2} display='flex' justifyContent='center' style={{ width: '100%' }}>
              <Grid container spacing={2} xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{ width: '100%' }}>

                <Grid item xs={12} md={12} lg={4} style={{ width: '100%', minHeight: '410px' }}>
                  <Card sx={{ minWidth: '100%', minHeight: '410px', maxWidth: '100%', maxHeight: '410px' }}>
                    <CardContent sx={{ minWidth: '100%' }}>
                      {referralData?.affiliateRefferalCount ?
                        <>
                          <Referral2ActiveChart sx={{ minWidth: '100%' }} referralData={referralData} />
                          <Referral2PaidChart sx={{ minWidth: '100%' }} referralData={referralData} />
                        </>
                        :
                        <MDTypography
                          color="secondary"
                          mt={22}
                          mb={2}
                          fontSize={15}
                          fontWeight='bold'
                          display='flex'
                          alignItems='center'
                          alignContent='center'
                          justifyContent='center'
                          textAlign='center'  // Center horizontally
                        >
                          No referrals Yet!
                        </MDTypography>}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={12} lg={8} style={{ width: '100%', minHeight: '410px' }}>
                  <Card sx={{ minWidth: '100%', minHeight: '410px', maxWidth: '100%', maxHeight: '410px' }}>
                    <CardContent sx={{ minWidth: '100%' }}>
                      {chartData.length ?
                      <RecentReferralGrid style={{ width: '100%', minHeight: '410px' }} chartData={chartData} />
                      :
                      <MDTypography
                          color="secondary"
                          mt={22}
                          mb={2}
                          fontSize={15}
                          fontWeight='bold'
                          display='flex'
                          alignItems='center'
                          alignContent='center'
                          justifyContent='center'
                          textAlign='center'  // Center horizontally
                        >
                          No orders in last 30 days Yet!
                        </MDTypography>}

                    </CardContent>
                  </Card>
                </Grid>

              </Grid>
            </Grid>

            <Grid item xs={12} md={12} lg={12} mt={3} display='flex' justifyContent='center' style={{ width: '100%' }}>
              <Grid container spacing={2} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center'>

                <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center' alignItems='center'>
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel id="demo-simple-select-label">Period</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={period}
                      label="Period"
                      sx={{ minHeight: 44 }}
                      onChange={handlePeriodChange}
                    >
                      <MenuItem value={"Today"}>Today</MenuItem>
                      <MenuItem value={"Yesterday"}>Yesterday</MenuItem>
                      <MenuItem value={"This Week"}>This Week</MenuItem>
                      <MenuItem value={"Last Week"}>Last Week</MenuItem>
                      <MenuItem value={"This Month"}>This Month</MenuItem>
                      <MenuItem value={"Last Month"}>Last Month</MenuItem>
                      <MenuItem value={"Lifetime"}>Lifetime</MenuItem>
                      <MenuItem value={"Custom"}>Custom</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} lg={3} display='flex' justifyContent='center' alignItems='center'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={async (e) => {
                          setStartDate(prev => dayjs(e));
                          // await handleShowDetails(dayjs(e), endDate);
                        }}
                        sx={{ width: '100%' }}
                        disabled={period !== "Custom"}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6} lg={3} display='flex' justifyContent='center' alignItems='center'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={async (e) => {
                          setEndDate(prev => dayjs(e));
                          // await handleShowDetails(startDate, dayjs(e))
                        }}
                        disabled={period !== "Custom"}
                        sx={{ width: '100%' }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6} lg={3} mt={.5} display='flex' justifyContent='center' alignItems='center'>
                  <MDButton variant="contained" color="info" style={{ minWidth: '100%' }} onClick={handleShowDetails}>Show</MDButton>
                </Grid>

              </Grid>
            </Grid>

            <Grid item xs={12} md={12} lg={12} mt={2} display='flex' justifyContent='center'>
              <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center'>
                <Grid item xs={12} md={12} lg={12} sx={{ minWidth: 120, ml: 0.5 }}>
                  <MDTypography fontSize={15} fontWeight='bold'>Summary for the selected period</MDTypography>
                </Grid>

                <Grid item xs={12} md={12} lg={2.4} sx={{ minWidth: 120, minHeight: 135 }}>
                  <Card sx={{ maxWidth: 345, alignContent: 'center', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      alt="signup"
                      height="30"
                      image={logo}
                    />
                    <CardContent sx={{ minWidth: 120, minHeight: 135 }}>
                      <MDTypography variant="h6" fontSize={15} gutterBottom style={{ textAlign: 'center' }}>
                        Referrals
                      </MDTypography>
                      <MDTypography variant="h5" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        {affiliateRafferalSummery?.affiliateRefferalCount || 0}
                      </MDTypography>
                      <MDTypography fontSize={10} color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        Total signups through your affiliate code
                      </MDTypography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={12} lg={2.4} sx={{ minWidth: 120, minHeight: 135 }}>
                  <Card sx={{ maxWidth: 345, alignContent: 'center', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      alt="signup"
                      height="30"
                      image={logo}
                    />
                    <CardContent sx={{ minWidth: 120, minHeight: 135 }}>
                      <MDTypography variant="h6" fontSize={15} gutterBottom style={{ textAlign: 'center' }}>
                        Active Referrals
                      </MDTypography>
                      <MDTypography variant="h5" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        {affiliateRafferalSummery?.activeAffiliateRefferalCount || 0}
                      </MDTypography>
                      <MDTypography fontSize={10} color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        Users activiated who joined through your affiliate code
                      </MDTypography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={12} lg={2.4} sx={{ minWidth: 120, minHeight: 135 }}>
                  <Card sx={{ maxWidth: 345, alignContent: 'center', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      alt="signup"
                      height="30"
                      image={logo}
                    />
                    <CardContent sx={{ minWidth: 120, minHeight: 135 }}>
                      <MDTypography variant="h6" fontSize={15} gutterBottom style={{ textAlign: 'center' }}>
                        Act. Conversion
                      </MDTypography>
                      <MDTypography variant="h5" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        {affiliateRafferalSummery?.affiliateRefferalCount > 0 ? (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((affiliateRafferalSummery?.activeAffiliateRefferalCount * 100 / affiliateRafferalSummery?.affiliateRefferalCount) || 0)) : 0}%
                      </MDTypography>
                      <MDTypography fontSize={10} color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        Active Referrals/Total Referrals
                      </MDTypography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={12} lg={2.4} sx={{ minWidth: 120, minHeight: 135 }}>
                  <Card sx={{ maxWidth: 345, alignContent: 'center', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      alt="signup"
                      height="30"
                      image={logo}
                    />
                    <CardContent sx={{ minWidth: 120, minHeight: 135 }}>
                      <MDTypography variant="h6" fontSize={15} gutterBottom style={{ textAlign: 'center' }}>
                        Paid Referrals
                      </MDTypography>
                      <MDTypography variant="h5" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        {affiliateRafferalSummery?.paidAffiliateRefferalCount || 0}
                      </MDTypography>
                      <MDTypography fontSize={10} color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        # of referrals who purchased any product
                      </MDTypography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={12} lg={2.4} sx={{ minWidth: 120, minHeight: 135 }}>
                  <Card sx={{ maxWidth: 345, alignContent: 'center', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      alt="signup"
                      height="30"
                      image={logo}
                    />
                    <CardContent sx={{ minWidth: 120, minHeight: 135 }}>
                      <MDTypography variant="h6" fontSize={15} gutterBottom style={{ textAlign: 'center' }}>
                        Paid Conversion
                      </MDTypography>
                      <MDTypography variant="h5" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        {affiliateRafferalSummery?.affiliateRefferalCount > 0 ? (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format((affiliateRafferalSummery?.paidAffiliateRefferalCount * 100 / affiliateRafferalSummery?.affiliateRefferalCount) || 0)) : 0}%
                      </MDTypography>
                      <MDTypography fontSize={10} color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        Paid Referrals/Total Referrals
                      </MDTypography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={12} lg={2.4} sx={{ minWidth: 120, minHeight: 135 }}>
                  <Card sx={{ maxWidth: 345, alignContent: 'center', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      alt="signup"
                      height="30"
                      image={logo}
                    />
                    <CardContent sx={{ minWidth: 120, minHeight: 135 }}>
                      <MDTypography variant="h6" fontSize={15} gutterBottom style={{ textAlign: 'center' }}>
                        Referral Amount
                      </MDTypography>
                      <MDTypography variant="h5" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        {"₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(affiliateRafferalSummery?.affiliateRefferalPayout || 0))}
                      </MDTypography>
                      <MDTypography fontSize={10} color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        Amount recieved for referrals
                      </MDTypography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={12} lg={2.4} sx={{ minWidth: 120, minHeight: 135 }}>
                  <Card sx={{ maxWidth: 345, alignContent: 'center', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      alt="signup"
                      height="30"
                      image={logo}
                    />
                    <CardContent sx={{ minWidth: 120, minHeight: 135 }}>
                      <MDTypography variant="h6" fontSize={15} gutterBottom style={{ textAlign: 'center' }}>
                        Activation Amount
                      </MDTypography>
                      <MDTypography variant="h5" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        {"₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(0))}
                      </MDTypography>
                      <MDTypography fontSize={10} color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        Amount recieved for activating referrals
                      </MDTypography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={12} lg={2.4} sx={{ minWidth: 120, minHeight: 135 }}>
                  <Card sx={{ maxWidth: 345, alignContent: 'center', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      alt="signup"
                      height="30"
                      image={logo}
                    />
                    <CardContent sx={{ minWidth: 120, minHeight: 135 }}>
                      <MDTypography variant="h6" fontSize={15} gutterBottom style={{ textAlign: 'center' }}>
                        # of Purchases
                      </MDTypography>
                      <MDTypography variant="h5" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        {(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(affiliateOverview?.summery?.[0]?.totalProductCount || 0))}
                      </MDTypography>
                      <MDTypography fontSize={10} color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        # of products purchased using your affiliate code
                      </MDTypography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={12} lg={2.4} sx={{ minWidth: 120, minHeight: 135 }}>
                  <Card sx={{ maxWidth: 345, alignContent: 'center', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      alt="signup"
                      height="30"
                      image={logo}
                    />
                    <CardContent sx={{ minWidth: 120, minHeight: 135 }}>
                      <MDTypography variant="h6" fontSize={15} gutterBottom style={{ textAlign: 'center' }}>
                        Commission
                      </MDTypography>
                      <MDTypography variant="h5" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        {"₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(affiliateOverview?.summery?.[0]?.totalProductCPayout || 0))}
                      </MDTypography>
                      <MDTypography fontSize={10} color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        Commission from purchases using your affiliate code
                      </MDTypography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={12} lg={2.4} sx={{ minWidth: 120, minHeight: 135 }}>
                  <Card sx={{ maxWidth: 345, alignContent: 'center', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      alt="signup"
                      height="30"
                      image={logo}
                    />
                    <CardContent sx={{ minWidth: 120, minHeight: 135 }}>
                      <MDTypography variant="h6" fontSize={15} gutterBottom style={{ textAlign: 'center' }}>
                        Total Amount
                      </MDTypography>
                      <MDTypography variant="h5" color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        {"₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(((affiliateRafferalSummery?.affiliateRefferalPayout || 0) + (affiliateOverview?.summery?.[0]?.totalProductCPayout || 0)) || 0))}
                      </MDTypography>
                      <MDTypography fontSize={10} color="text.secondary" gutterBottom style={{ textAlign: 'center' }}>
                        Total amount earned from referrals and commission
                      </MDTypography>
                    </CardContent>
                  </Card>
                </Grid>

              </Grid>
            </Grid>

            <Grid item xs={12} md={12} lg={12} sx={{ minWidth: 120 }}>
              <RaferralGrid showDetailClicked={showDetailClicked} start={startDate} end={endDate} affiliateData={affiliateData} />
            </Grid>

            <Grid item xs={12} md={12} lg={12} sx={{ minWidth: 120 }}>
              <ReferredProduct showDetailClicked={showDetailClicked} start={startDate} end={endDate} affiliateData={affiliateData} />
            </Grid>

          </>
        }

      </Grid>
      {renderSuccessSB}
      {renderErrorSB}
    </MDBox>
  );
}