import * as React from 'react';
import Box from '@mui/material/Box';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material'
import MDTypography from '../../../components/MDTypography';

export default function MaxWidthDialog() {
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm');

  const handleClickOpen = () => {
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
      <Grid container spacing={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' flexDirection='row' style={{width:'100%'}}>
        <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
          {/* <MDButton variant="contained" sx={{fontSize: "10px",width:'90%'}} size='small' color='primary' onClick={handleClickOpen}> */}
          <button variant="contained" color="warning" style={{ fontSize: "10px",width:'100%', padding:2, border: 'none', fontWeight:'bold', textDecoration:'under-line', cursor: 'pointer'}} size='small' onClick={handleClickOpen}>
              Analytics
          </button>
          {/* </MDButton> */}
        </Grid>
        <Grid item xs={12} md={12} lg={0} display='flex' justifyContent='center' alignItems='center' style={{width:'100%'}}>
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
            <MDTypography>Analytics of your TenX Plan</MDTypography>
          </MDBox>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <MDBox display='flex' justifyContent='center'>
              <MDTypography>Coming Soon!!!</MDTypography>
            </MDBox>
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