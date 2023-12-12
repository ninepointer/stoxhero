import * as React from 'react';
import Box from '@mui/material/Box';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material'
import MDTypography from '../../../components/MDTypography';

export default function MaxWidthDialog({ subscription, isActive }) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleMaxWidthChange = (event) => {
  //   setMaxWidth(
  //     // @ts-expect-error autofill of arbitrary value is not handled.
  //     event.target.value,
  //   );
  // };

  // const handleFullWidthChange = (event) => {
  //   setFullWidth(event.target.checked);
  // };

  // useEffect(()=>{

  // }, [])

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

          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}