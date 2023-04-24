import React, {useEffect, useState} from 'react';
import axios from "axios";
import { CircularProgress, Grid, Divider } from '@mui/material';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDAvatar from '../../../components/MDAvatar';
import MDButton from '../../../components/MDButton'
import {Link} from 'react-router-dom'


import wallet from '../../../assets/images/wallet.png'
import bonus from '../../../assets/images/bonus.png'
import rupee from '../../../assets/images/rupee.png'
import referral from '../../../assets/images/referralt.png'
import battle from '../../../assets/images/battlet.png'
import CashFlow from '../../../assets/images/transaction.png'
import DefaultProfilePic from "../../../assets/images/default-profile.png";

export default function Wallet() {
  let name = 'Prateek Pawan'
  const [photo,setPhoto] = useState(DefaultProfilePic)
  const [myWallet,setMyWallet] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  useEffect(()=>{
  

    let call1 = axios.get(`${baseUrl}api/v1/userwallet/my`,{
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  },
                })

    Promise.all([call1])
    .then(([api1Response]) => {
      // Process the responses here
      console.log(api1Response?.data?.data);
      setMyWallet(api1Response?.data?.data)
      setPhoto(api1Response?.data?.data?.userId?.profilePhoto?.url)
      console.log(api1Response?.data?.data?.userId?.profilePhoto?.url)
    
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
    });


  },[])

  const cashTransactions = myWallet?.transactions?.filter((transaction) => {
    return transaction.transactionType === "Cash";
  });
  
  const totalCashAmount = cashTransactions?.reduce((total, transaction) => {
    return total + transaction?.amount;
  }, 0);
  
  console.log("Total cash amount: ", totalCashAmount);

  const bonusTransactions = myWallet?.transactions?.filter((transaction) => {
    return transaction?.transactionType === "Bonus";
  });
  
  const totalBonusAmount = bonusTransactions?.reduce((total, transaction) => {
    return total + transaction?.amount;
  }, 0);
  
  console.log("Total bonus amount: ", totalBonusAmount);

  return (
    <>
    <MDBox bgColor="dark" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='100vh'>
      <Grid container xs={12} md={6} lg={12}>
        
        <Grid item xs={12} md={12} lg={6} mb={1}>
          <MDBox mb={2}>
            <MDTypography color="light" fontSize={15} display="flex" justifyContent="center">Transactions</MDTypography>
          </MDBox>
           
          {myWallet?.transactions?.length > 0 ? 
            myWallet?.transactions?.map((elem) => {
              return (
                <MDBox mb={1} style={{border:'1px solid white', borderRadius:5,padding:4}}>
                  <Grid container xs={12} md={6} lg={12} spacing={1} display="flex" justifyContent="center" alignItems="center" alignContent="center">
                    <Grid item xs={8} md={6} lg={8} display="flex" alignItems="center">
                      <MDAvatar src={battle} name={name} size="sm" />
                      <MDBox display="flex" flexDirection="column">
                        <MDTypography style={{alignContent:'center'}} ml={1} color="light" fontSize={15} fontWeight="bold">{elem?.title}</MDTypography>
                        <MDTypography style={{alignContent:'center'}} ml={1} color="light" fontSize={10} fontWeight="bold">{elem?.transactionDate}</MDTypography>
                        <MDTypography style={{alignContent:'center'}} ml={1} color="light" fontSize={10} fontWeight="bold">{elem?.description}</MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={6} md={6} lg={4} display="flex" justifyContent="flex-end">
                      <MDTypography color="light" fontSize={15} fontWeight="bold">+₹{elem?.amount}</MDTypography>
                    </Grid>
                  </Grid>
                </MDBox>
              );
            }) 
            : 
            <MDBox style={{border:'1px solid white', borderRadius:5,padding:4}} >
              <Grid container mt={2} xs={12} md={6} lg={12} display="flex" justifyContent="center">
                <Grid item xs={6} md={6} lg={12} display="flex" justifyContent="center">
                   <MDAvatar src={CashFlow} name={name} size="xl" />
                </Grid>
                <MDTypography mt={3} color="light" display="flex" justifyContent="center">No Transactions Yet!</MDTypography>
                <MDTypography mt={3} color="light" display="flex" justifyContent="center" fontSize={15}>Participate in Battles and invite your friends to the app to earn cash & bonus.</MDTypography>
                <MDBox mt={3} display="flex" justifyContent="center" flexDirection="column" alignContent="center" alignItems="center">
                  <Link to ='/BattleGround'><MDButton variant="outlined" color="warning" size="small" style={{marginBottom:15,marginLeft:100,marginRight:100}}>Check Upcoming Battles</MDButton></Link>
                  <Link to ='/Referrals'><MDButton variant="outlined" color="warning" size="small" style={{marginBottom:30,marginLeft:100,marginRight:100}}>Invite A Friend</MDButton></Link>
                </MDBox>
              </Grid>
            </MDBox>
          }


          
          
        </Grid>

        <Grid item xs={0} md={0.5} lg={0.5}>
          <Divider orientation="vertical" style={{backgroundColor: 'white', height: '96vh'}} hidden={{ mdDown: true }} />
        </Grid>


        <Grid item xs={12} md={6} lg={5.5}>
          <MDBox>
            <MDTypography color="light" fontSize={15} display="flex" justifyContent="center">Complete Your KYC for withdrawals.</MDTypography>
          </MDBox>
          <Grid container mt={1} spacing={1} display="flex" justifyContent="center" alignContent="center" alignItems="center">
            <Grid item xs={12} md={6} lg={12} display="flex" justifyContent="center">
              <MDAvatar src={photo} name={name} size="xl" />
            </Grid>

            <Grid item xs={12} md={6} lg={12} mb={2} display="flex" justifyContent="center" alignItems="center">
              <MDTypography color="light">{myWallet?.userId?.first_name} {myWallet?.userId?.last_name}</MDTypography>
            </Grid>

            
            <Grid item xs={12} md={6} lg={12} style={{border:'1px solid white', borderRadius:5}}>
              
              <Grid container spacing={1} mt={0.5} display="flex" justifyContent="space-between" alignItems="center" alignContent="center">
                <Grid item xs={3} md={6} lg={3} ml={1} display="flex" justifyContent="left" alignItems="center">
                  <MDAvatar src={wallet} name={name} size="sm" />
                  <MDTypography ml={1} color="light" fontSize={15} fontWeight="bold">Deposit</MDTypography>
                </Grid>
                <Grid item xs={3} md={6} lg={3} display="flex" justifyContent="center" alignItems="center"><MDTypography color="light" fontSize={15} fontWeight="bold">₹0</MDTypography></Grid>
                <Grid item xs={3} md={6} lg={3} display="flex" justifyContent="center" alignItems="center" mr={1}><MDButton size="small" style={{width:'95%'}}>Add Money</MDButton></Grid>
              </Grid>
              
              <Grid item xs={12} md={6} lg={12} mr={1} style={{maxWidth:'100vw'}}>
                <Divider variant="middle" style={{ backgroundColor: '#fff' }} />
              </Grid>

              <Grid container spacing={1} display="flex" justifyContent="space-between" alignItems="center">
                <Grid item xs={3} md={6} lg={3} ml={1} display="flex" justifyContent="left" alignItems="center">
                  <MDAvatar src={rupee} name={name} size="sm" />
                  <MDTypography ml={1} color="light" fontSize={15} fontWeight="bold">Cash</MDTypography>
                </Grid>
                <Grid item xs={3} md={6} lg={3} display="flex" justifyContent="center" alignItems="center"><MDTypography color="light" fontSize={15} fontWeight="bold">₹{totalCashAmount ? totalCashAmount : 0}</MDTypography></Grid>
                <Grid item xs={3} md={6} lg={3} display="flex" justifyContent="center" alignItems="center" mr={1}><MDButton size="small" style={{width:'95%'}}>Withdraw</MDButton></Grid>
              </Grid>

              <Grid item xs={12} md={6} lg={12} mr={1} style={{maxWidth:'100vw'}}>
                <Divider variant="middle" style={{ backgroundColor: '#fff' }} />
              </Grid>

              <Grid container spacing={1} mb={1.5} display="flex" justifyContent="space-between" alignItems="center">
                <Grid item xs={3} md={6} lg={3} ml={1} display="flex" justifyContent="left" alignItems="center">
                  <MDAvatar src={bonus} name={name} size="sm" />
                  <MDTypography ml={1} color="light" fontSize={15} fontWeight="bold">Bonus</MDTypography>
                </Grid>
                <Grid item xs={3} md={6} lg={3} display="flex" justifyContent="center" alignItems="center"><MDTypography color="light" fontSize={15} fontWeight="bold">₹{totalBonusAmount ? totalBonusAmount : 0}</MDTypography></Grid>
                <Grid item xs={3} md={6} lg={3} display="flex" justifyContent="center" alignItems="center" mr={1}><MDButton size="small" style={{width:'95%'}}>Redeem</MDButton></Grid>
              </Grid>

            </Grid>
           

          </Grid>
        </Grid>

      </Grid>
    </MDBox>
    </>
  );
}