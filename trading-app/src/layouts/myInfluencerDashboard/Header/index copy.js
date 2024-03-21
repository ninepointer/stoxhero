import React,{useState, useEffect, useContext} from 'react';
import axios from "axios";
import MDBox from '../../../components/MDBox';
import Card from '@mui/material/Card';
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
import { socketContext } from "../../../socketContext";

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
  const socket = useContext(socketContext);
  const userDetails = getDetails.userDetails
  const [userData, setUserData] = React.useState({});

  useEffect(() => {
    console.log('user data socket', socket)
    socket?.on(`influencer-user:${(getDetails.userDetails._id).toString()}`, (data) => {
      console.log('user data data', data)
        setUserData(data);
    })
  }, [])

  console.log('user data', userData, `influencer-user:${(getDetails.userDetails._id).toString()}`)

  return (

    <MDBox mt={userDetails?.role?.roleName === adminRole ? 0 : 2} mb={1} borderRadius={10} minHeight='auto' width="100%" display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
      
    </MDBox>
  );
}