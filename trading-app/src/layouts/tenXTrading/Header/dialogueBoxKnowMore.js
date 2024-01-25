import * as React from 'react';
import Box from '@mui/material/Box';
import MDButton from '../../../components/MDButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MDBox from '../../../components/MDBox';
import { Grid } from '@mui/material'
import MDTypography from '../../../components/MDTypography';
import { userContext } from '../../../AuthContext';

export default function MaxWidthDialog(subscription) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm');
  const getDetails = React.useContext(userContext);
  // console.log("Subscription inside Dialognbox:",subscription?.subscription)

  const handleClickOpen = () => {
    window.webengage.track('tenx_know_more_clicked', {
      user: getDetails?.userDetails?._id,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMaxWidthChange = (event) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value,
    );
  };

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };
  
  return (
    <React.Fragment>
      <MDBox display='flex' justifyContent='center' alignItems='center' style={{width:'90%'}}>
        <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' flexDirection='row' style={{width:'100%'}}>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
            <button variant="contained" color="warning" style={{ fontSize: "10px",width:'100%', padding:2, border: 'none', fontWeight:'bold', textDecoration:'under-line', cursor: 'pointer'}} size='small' onClick={handleClickOpen}>💡 Click to know more</button>
            {/* <button varaint='contained' color='error' size="small" style={{fontSize:'10px',width:'88%', padding:2}} onClick={captureTutorialViews}>Watch Tutorial Video</button> */}
          </Grid>
        </Grid>
      </MDBox>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          {subscription && <MDTypography fontSize={15} textAlign='center'> <span style={{fontWeight:'bold'}}>{subscription?.subscription?.plan_name} Subscription Details</span></MDTypography>}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <MDTypography mb={1} fontSize={12} display='flex' flexDirection='column'>
              <span style={{fontWeight:'bold', textAlign:'center'}}>💰 Virtual Margin Money Boost</span> 
              <span style={{textAlign:'center'}}>This subscription plan provides you with a margin of 
              ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(subscription?.subscription?.portfolio?.portfolioValue)}/-,
              to enhance your F&O Intraday Options trading. This boost empowers you to take advantage of more trading opportunities.</span>
            </MDTypography>
            <MDTypography mb={1} fontSize={12} display='flex' flexDirection='column'>
              <span style={{fontWeight:'bold', textAlign:'center'}}>⌛ Duration Flexibility</span> 
              <span style={{textAlign:'center'}}>The subscription is designed to cater to your needs. It covers either {subscription?.subscription?.validity} trading {subscription?.subscription?.validityPeriod} or a total of {subscription?.subscription?.expiryDays} calendar days, whichever comes first. This flexibility allows you to align the plan with your trading preferences and schedule.</span>
            </MDTypography>
            <MDTypography mb={1} fontSize={12} display='flex' flexDirection='column'>
              <span style={{fontWeight:'bold', textAlign:'center'}}>🏆 Profit Rewards</span>
              <span style={{textAlign:'center'}}>At the end of the subscription period, which spans {subscription?.subscription?.validity} trading {subscription?.subscription?.validityPeriod}, you become eligible for {subscription?.subscription?.payoutPercentage}% of the net profit if your trading results are in the positive. This means that your successful trades are rewarded, adding to your earnings.</span>
            </MDTypography>
            <MDTypography mb={1} fontSize={12} display='flex' flexDirection='column'>
              <span style={{fontWeight:'bold', textAlign:'center'}}>👉 Profit Cap</span>
              <span style={{textAlign:'center'}}>To ensure fairness and stability, the subscription plan includes a profit cap of 
              ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(subscription?.subscription?.profitCap)}/-.
              This cap represents the maximum amount you can earn as a part of the plan, even if your trading results exceed expectations. It's a safeguard that maintains a balanced and secure trading environment.</span>
            </MDTypography>
            <MDTypography mb={1} fontSize={12} display='flex' flexDirection='column'>
              <span style={{fontWeight:'bold', textAlign:'center'}}>🕗 Automatic Expiry</span>
              <span style={{textAlign:'center'}}>If, for any reason, you are unable to complete the full {subscription?.subscription?.validity} trading {subscription?.subscription?.validityPeriod} within the specified {subscription?.subscription?.expiryDays} calendar days, the subscription will automatically expire without processing any payouts.</span>
            </MDTypography>
            <MDTypography mb={1} fontSize={12} display='flex' flexDirection='column'>
              <span style={{fontWeight:'bold', textAlign:'center'}}>💸 Seamless Payouts</span>
              <span style={{textAlign:'center'}}>Your hard-earned profits are important to us. At the end of the {subscription?.subscription?.validity} trading {subscription?.subscription?.validityPeriod}, your payout is swiftly credited to your wallet. This hassle-free process ensures that you can enjoy the fruits of your trading success without delay.</span>
            </MDTypography>
            <MDTypography mb={1} fontSize={12} display='flex' flexDirection='column'>
              <span style={{fontWeight:'bold', textAlign:'center'}}>❎ Daily Square-Off</span>
              <span style={{textAlign:'center'}}>For your convenience and risk management, all trades within the subscription plan are automatically squared off at 3:20 PM every trading day. This ensures that you have a clean slate for the next trading session and helps you maintain control over your portfolio.</span>
            </MDTypography>
            <MDTypography mb={1} fontSize={12} fontWeight='bold' textAlign='center'>
              With our subscription plan, we aim to enhance your trading journey by providing flexibility, rewards, and a seamless experience. Start your subscription today and maximize your trading potential! 🚀
            </MDTypography>
          </DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
            }}
          >
            
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}