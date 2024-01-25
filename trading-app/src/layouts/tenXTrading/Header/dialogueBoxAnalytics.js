import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, Typography } from '@mui/material'
import MDTypography from '../../../components/MDTypography';
import {apiUrl} from "../../../constants/constants"
import { userContext } from '../../../AuthContext';

export default function MaxWidthDialog({ subscription, isActive }) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm');
  const getDetails = useContext(userContext)
  const [data, setData] = useState([]);

  const handleClickOpen = () => {
    window.webengage.track('tenx_expired_analytics_clicked', {
      user: getDetails?.userDetails?._id,
      subscriptionId: subscription?._id,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };;


  useEffect(()=>{
    fetchData();
  }, [open])

  async function fetchData(){
    if(isActive){
      axios.get(`${apiUrl}tenx/${subscription?._id}/trade/livesubscriptionpnl/${subscription?.subscribedOn}`,{
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
          },
        })
      .then((api1Response)=>{
        setData(api1Response?.data?.data[0]);
      })
    }
  }

  return (
    <React.Fragment>
      <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' flexDirection='row' style={{ width: '100%' }}>
        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{ width: '100%' }}>
          {/* <MDButton variant="contained" sx={{fontSize: "10px",width:'90%'}} size='small' color='primary' onClick={handleClickOpen}> */}
          <button variant="contained" color="warning" style={{ fontSize: "10px", width: '100%', padding: 2, border: 'none', fontWeight: 'bold', textDecoration: 'under-line', cursor: 'pointer' }} size='small' onClick={handleClickOpen}>
            Analytics
          </button>
          {/* </MDButton> */}
        </Grid>
        <Grid item xs={12} md={12} lg={0} display='flex' justifyContent='center' alignItems='center' style={{ width: '100%' }}>
          <></>
        </Grid>
      </Grid>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          <MDBox display='flex' justifyContent='center'>
            <MDTypography color="black" fontSize={15} fontWeight={900}>Analytics of your TenX Plan</MDTypography>
          </MDBox>
        </DialogTitle>

        <DialogContent>
         
        
            <Grid container spacing={0.5} mt={1}>
              
              

            {isActive ?

              data ?
                <>
                  <Grid container p={1} style={{ border: '1px solid #344767', borderRadius: 5 }}>
                    <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="black" fontSize={9} fontWeight="bold">GROSS P&L</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="black" fontSize={9} fontWeight="bold">NET P&L</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="black" fontSize={9} fontWeight="bold">BROKERAGE</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="black" fontSize={9} fontWeight="bold">TRADING DAYS</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="black" fontSize={9} fontWeight="bold">TRADE</MDTypography>
                    </Grid>
                  </Grid>

                  <Grid container mt={1} p={1} style={{ border: '1px solid #344767', borderRadius: 5 }}>
                    <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={(data?.grossPnl) >= 0 ? "success" : "error"} fontSize={10} fontWeight="bold">{(data?.grossPnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.grossPnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-data?.grossPnl))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color={(data?.npnl) >= 0 ? "success" : "error"} fontSize={10} fontWeight="bold">{(data?.npnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.npnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-data?.npnl))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="dark" fontSize={10} fontWeight="bold">{"₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.brokerage))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="dark" fontSize={10} fontWeight="bold">{(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.tradingDays))}</MDTypography>
                    </Grid>
                    <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography color="dark" fontSize={10} fontWeight="bold">{(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data?.trades))}</MDTypography>
                    </Grid>
                  </Grid>

                  <MDBox display='flex' justifyContent='center' mt={1}>
                    <MDTypography color="black" fontSize={15} fontWeight={900} textAlign='justify'> ** The profit and loss (PNL) figures are displayed for the previous trading day until 3:30 PM. After 3:30 PM, the display includes data from both the last trading day and the ongoing trading day for a more comprehensive overview.</MDTypography>
                  </MDBox>

                </>

                :

                <MDBox display='flex' justifyContent='center' textAlign='center' alignContent='center' alignItems='center'>
                  <MDTypography color="black" fontSize={18} fontWeight={900}>No trades were made in this subscription. Please take trade and earn real cash before subscription end.</MDTypography>
                </MDBox>
              :

              <>
                <Grid container p={1} style={{ border: '1px solid #344767', borderRadius: 5 }}>
                  <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="black" fontSize={9} fontWeight="bold">GROSS P&L</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="black" fontSize={9} fontWeight="bold">NET P&L</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="black" fontSize={9} fontWeight="bold">BROKERAGE</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="black" fontSize={9} fontWeight="bold">TRADING DAYS</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="black" fontSize={9} fontWeight="bold">TRADE</MDTypography>
                  </Grid>
                </Grid>

                <Grid container mt={1} p={1} style={{ border: '1px solid #344767', borderRadius: 5 }}>
                  <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color={(subscription.gpnl) >= 0 ? "success" : "error"} fontSize={10} fontWeight="bold">{(subscription.gpnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(subscription.gpnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-subscription.gpnl))}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color={(subscription.npnl) >= 0 ? "success" : "error"} fontSize={10} fontWeight="bold">{(subscription.npnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(subscription.npnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-subscription.npnl))}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="dark" fontSize={10} fontWeight="bold">{"₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(subscription.brokerage))}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="dark" fontSize={10} fontWeight="bold">{(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(subscription.tradingDays))}</MDTypography>
                  </Grid>
                  <Grid item xs={12} md={2} lg={2.4} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                    <MDTypography color="dark" fontSize={10} fontWeight="bold">{(new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(subscription.trades))}</MDTypography>
                  </Grid>
                </Grid>
              </>

            }

          </Grid>

        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}