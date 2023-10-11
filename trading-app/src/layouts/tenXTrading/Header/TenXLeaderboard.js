import React, {useEffect, useState} from 'react';
import axios from "axios";
import { CircularProgress, Grid } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import MDTypography from '../../../components/MDTypography';
import TenXLeaderboardData from '../data/tenXLeaderboard'
import WinnerImage from '../../../assets/images/TenXHeader.png'


export default function TenXLeaderboard({setClicked}) {
  const [cashBalance, setCashBalance] = React.useState(0);
  const [expiredTenXSubs,setExpiredTenXSubs] = useState([]);
  let [checkPayment, setCheckPayment] = useState(true);
  const [isLoading,setIsLoading] = useState(false)
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

  return (
   
    <MDBox bgColor="dark" color="light" mt={0.5} borderRadius={10} style={{width:'100%'}}>
        <Grid container mb={1} display='flex' justifyContent='center' style={{width:'100%'}}>
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' style={{width:'100%'}}>
                    <TenXLeaderboardData/>
                </Grid>
        </Grid>
    </MDBox>
  );
}