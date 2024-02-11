import React, { useEffect, useState } from 'react';
// import { userContext } from '../../../AuthContext';
// import MDBox from '../../../components/MDBox';
import MDButton from '../../components/MDButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import { Grid, TextField, Typography } from '@mui/material';
import MDBox from '../../components/MDBox';
// import paymentQr from '../../../assets/images/paymentQrc.jpg';

// //icons
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Title from '../../HomePage/components/Title'
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
// import MDTypography from '../../../components/MDTypography';
// import { CopyToClipboard } from 'react-copy-to-clipboard';
// import {BiCopy} from 'react-icons/bi'
// import MDSnackbar from '../../../components/MDSnackbar';
// import {useNavigate} from 'react-router-dom';
// import { Typography } from '@mui/material';
// import Renew from './renew/renew';





export default function SearchModel({ elem, setReRender, reRender }) {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const [reason, setReason] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function onSubmit(e, check) {
    // console.log("inside submit")
    e.preventDefault();
    try {

      if (!reason) {
        return setError("Missing Field. Please fill all the mandatory fields")
      }

      const res = await fetch(`${baseUrl}api/v1/user/deactivate`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          reason, isMail: check === "mail" ? true : false, mobile: elem?.mobile, email: elem?.email, deactivatedUser: elem?._id
        })
      });


      const data = await res.json();

      if (data.status == "error") {
        setError(data.message)
      } else {
        setSuccess(data.message)
        reRender ? setReRender(false) : setReRender(true);
      }
    } catch (e) {
      console.log(e);
    }
  }



  return (

    <>
      <Grid lg={12} display="flex" justifyContent="center" alignContent="center" alignItems="center">
        <MDButton size="small" color="secondary" sx={{ minWidth: 2, minHeight: 3 }} onClick={handleClickOpen}>Deactivate</MDButton>
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >

        {success ?
          <DialogContent >

            {success}
          </DialogContent>

          :
          <>
            <DialogContent>


              <Grid container display="flex" flexDirection="row" justifyContent="space-between">
                <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>

                  <Grid item xs={12} md={6} xl={12} mt={1} ml={2}>
                    <TextField
                      disabled={true}
                      id="outlined-required"
                      label='Name *'
                      name='name'
                      fullWidth
                      defaultValue={elem?.first_name + " " + elem?.last_name}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} xl={12} mt={1} ml={2}>
                    <TextField
                      disabled={true}
                      id="outlined-required"
                      label='Mobile *'
                      name='mobile'
                      fullWidth
                      defaultValue={elem?.mobile}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} xl={12} mt={1} ml={2}>
                    <TextField
                      // disabled={((isSubmitted || battle) && (!editing || saving))}
                      id="outlined-required"
                      label='Reason *'
                      name='reason'
                      fullWidth
                      defaultValue={reason}
                      onChange={(e) => { setReason(e.target.value) }}
                    />
                  </Grid>


                </Grid>

              </Grid>
            </DialogContent>

            {error && <Typography display={"flex"} justifyContent={"center"} alignContent={"center"} fontSize={15} color={"red"} ml={1} >{error}</Typography>}
            <DialogActions>
              <>
                <MDButton
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{ mr: 1, ml: 2 }}
                  // disabled={creating}
                  onClick={(e) => { onSubmit(e) }}
                >
                  {"Save"}

                </MDButton>
                <MDButton variant="contained" color="warning" size="small" onClick={(e) => { onSubmit(e, "mail") }}>
                  Save + Mail
                </MDButton>
              </>

            </DialogActions>


          </>
        }
      </Dialog>
      {/* {renderSuccessSB} */}
    </>
  );
}
