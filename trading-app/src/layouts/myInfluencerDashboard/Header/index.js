import React,{useState, useEffect, useContext} from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
import Card from '@mui/material/Card';
import { CardActionArea, CardContent, CardMedia, CircularProgress, Divider, FormControl, Grid, InputLabel, Select } from '@mui/material';
import MDTypography from '../../../components/MDTypography';
import dayjs from 'dayjs';
import { apiUrl } from '../../../constants/constants';
import MDSnackbar from "../../../components/MDSnackbar";
import { userContext } from "../../../AuthContext";
import EarningsChart from '../data/last30daysEarningsChart'
import {adminRole, userRole} from "../../../variables"
import ChooseAfiliate from "../data/chooseAffiliate"
import InfluencerUserData from '../data/InfluencerUserData';
import moment from "moment";
import { socketContext } from "../../../socketContext";


export default function Dashboard() {
  const getDetails = useContext(userContext);
  const userDetails = getDetails.userDetails
  // const [period, setPeriod] = React.useState('Today');
  let [isLoading,setIsLoading] = useState(false)
  const date = new Date();
  // const [startDate, setStartDate] = React.useState(dayjs(date).startOf('day'));
  // const [endDate, setEndDate] = useState(dayjs(date).endOf('day'));
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [successSB, setSuccessSB] = useState(false);
  const [affiliateData, setAffiliateData] = useState(null);
  // const [showDetailClicked, setShowDetailClicked] = useState(false);
  const socket = useContext(socketContext);

  const [userData, setUserData] = React.useState({});

  useEffect(() => {
    socket?.on(`influencer-user:${(getDetails.userDetails._id).toString()}`, (data) => {
      if(data?.influencerUser){
        setUserData(data?.data);
      }
    })
  }, [])

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



  // async function handleShowDetails(){
  //   setShowDetailClicked(!showDetailClicked);
  //   if(new Date(startDate)>new Date(endDate)){
  //     return openErrorSB("Invalid Date Range", "Start Date is greater than End Date");
  //   }
  //   let call1 = axios.get((`${apiUrl}affiliate/${userDetails?.role?.roleName === adminRole ? "adminsummery" : "mysummery"}?startDate=${startDate}&endDate=${endDate}&skip=${0}&limit=${10}&affiliateId=${affiliateData?.affiliateId}&affiliateType=${affiliateData?.affiliateType}&affiliatePrograme=${affiliateData?.affiliatePrograme}`), {
  //     withCredentials: true,
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Credentials": true
  //     },
  //   })


  //   Promise.all([call1])
  //     .then(([api1Response, api2Response]) => {
  //       setAffiliateOverview(api1Response?.data?.data[0])
  //       setAffiliateRafferalSummery(api1Response?.data?.affiliateRafferalSummery[0])
  //       // setAffiliateReferrals(api2Response?.data?.data?.affiliateReferrals)
  //       setIsLoading(false)
  //     })
  //     .catch((error) => {
  //       //   Handle errors here
  //       console.error(error);
  //     });
  // }

  // const handlePeriodChange = (event) => {
  //   const selectedPeriod = event.target.value;
  //   setPeriod(selectedPeriod);

  //   // Update start and end dates based on the selected period
  //   const today = moment();

  //   switch (selectedPeriod) {
  //     case 'Today':
  //       setStartDate(today.startOf('day'));
  //       setEndDate(today);
  //       break;
  //     case 'Yesterday':
  //       const yesterday = today.clone().subtract(1, 'day');
  //       setStartDate(yesterday.startOf('day'));
  //       setEndDate(yesterday);
  //       break;
  //     case 'This Week':
  //       const startDateOfWeek = today.clone().startOf('week');
  //       setStartDate(startDateOfWeek);
  //       setEndDate(today);
  //       break;
  //     case 'Last Week':
  //       const startDateOfLastWeek = today.clone().subtract(1, 'week').startOf('week');
  //       const endDateOfLastWeek = today.clone().subtract(1, 'week').endOf('week');
  //       setStartDate(startDateOfLastWeek);
  //       setEndDate(endDateOfLastWeek);
  //       break;
  //     case 'This Month':
  //       const firstDayOfMonth = today.clone().startOf('month');
  //       setStartDate(firstDayOfMonth);
  //       setEndDate(today);
  //       break;
  //     case 'Last Month':
  //       const firstDayOfLastMonth = today.clone().subtract(1, 'month').startOf('month');
  //       const lastDayOfLastMonth = today.clone().subtract(1, 'month').endOf('month');
  //       setStartDate(firstDayOfLastMonth);
  //       setEndDate(lastDayOfLastMonth);
  //       break;

  //       case 'Lifetime':
  //         setStartDate(moment("2000-01-01"));
  //         setEndDate(today);
  //         break;
  //     default:
  //       break;
  //   }
  // };


  return (

    <MDBox mt={userDetails?.role?.roleName === adminRole ? 0 : 2} mb={1} borderRadius={10} minHeight='auto' width="100%" display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center'>
        <Grid item xs={12} md={12} lg={12}>
          <MDTypography fontSize={15} ml={1.5} fontWeight='bold'>My Dashboard</MDTypography>
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

                <Grid item xs={12} md={12} lg={12} style={{ width: '100%', height: 'auto' }}>
                  <InfluencerUserData userData={userData} setUserData={setUserData} />
                </Grid>

                

              </Grid>
            </Grid>

          </>
        }

      </Grid>
      {renderSuccessSB}
      {renderErrorSB}
    </MDBox>
  );
}