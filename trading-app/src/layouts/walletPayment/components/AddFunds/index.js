// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// import Icon from "@mui/material/Icon";
// import Tooltip from "@mui/material/Tooltip";
import { useState, useContext, useEffect } from "react"
// import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { FormControl, InputLabel, OutlinedInput, Select, Typography } from "@mui/material";
// import Person3Icon from '@mui/icons-material/Person3';
// import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import dayjs from 'dayjs';

// Images
// import masterCardLogo from "../../../../assets/images/logos/mastercard.png";
// import visaLogo from "../../../../assets/images/logos/visa.png";

// // Material Dashboard 2 React context
// import { useMaterialUIController } from "../../../../context";
// import { userContext } from "../../../../AuthContext";
// import uniqid from "uniqid"
import User from "./user"
import { LocalizationProvider, MobileDateTimePicker } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MDSnackbar from "../../../../components/MDSnackbar";


const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function AddFunds({setRender, render}) {

  // const [controller] = useMaterialUIController();
  // const { darkMode } = controller;
  // const [traders, setTraders] = useState([]);
  const [formState, setFormState] = useState({})
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [paymentBy, setPaymentBy] = useState("");

  async function onSave() {
    const { paymentTime, transactionId, amount, currency, paymentMode, paymentStatus } = formState;
    console.log(formState, paymentBy._id)
    if (!formState.paymentTime || !formState.transactionId || !formState.amount || !paymentBy._id || !formState.currency || !formState.paymentMode || !formState.paymentStatus) {
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }

    const res = await fetch(`${baseUrl}api/v1/payment`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        paymentTime, transactionId, amount, paymentBy: paymentBy._id, currency, paymentMode, paymentStatus
      })
    });


    const data = await res.json();
    console.log(data, res.status);
    if (res.status !== 201) {
      openErrorSB("Payment not created", data?.message)
    } else {
      openSuccessSB("Payment Created", data?.message)
    }

    setRender(!render)
    
  }


  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [successSB, setSuccessSB] = useState(false);
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


  return (
    <Card id="delete-account">
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Add Funds
        </MDTypography>

      </MDBox>
      <MDBox p={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={12}>
            <User setPaymentBy={setPaymentBy} />
          </Grid>

          <Grid item xs={12} md={4} lg={12} display='flex' justifyContent={"space-between"}>
            <Grid item xs={12} md={6} xl={3} mb={1} mt={1} lg={4}>
              <TextField
                // disabled={((isSubmitted || !contest) && (!editing || saving))}
                id="outlined-required"
                label='Transaction Id *'
                name='transactionId'
                fullWidth
                type='text'
                // defaultValue={editing ? formState?.transactionId : contest?.transactionId}
                onChange={(e) => {
                  setFormState(prevState => ({
                    ...prevState,
                    transactionId: e.target.value
                  }))
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={3} mb={1} lg={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDateTimePicker']}>
                  <DemoItem>
                    <MobileDateTimePicker
                      label="Payment Time"
                      // disabled={((isSubmitted || contest) && (!editing || saving))}
                      value={formState?.paymentTime || dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0)}
                      onChange={(newValue) => {
                        if (newValue && newValue.isValid()) {
                          setFormState(prevState => ({ ...prevState, paymentTime: newValue }))
                        }
                      }}
                      minDateTime={null}
                      sx={{ width: '100%' }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6} xl={3} mb={1} mt={1} lg={4}>
              <TextField
                // disabled={((isSubmitted || contest) && (!editing || saving))}
                id="outlined-required"
                label='Amount *'
                name='amount'
                fullWidth
                type='number'
                // defaultValue={editing ? formState?.entryFee : contest?.entryFee}
                onChange={(e) => {
                  setFormState(prevState => ({
                    ...prevState,
                    amount: parseInt(e.target.value, 10)
                  }))
                }}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} md={4} lg={12} display='flex' justifyContent={"space-between"}>
            <Grid item xs={12} md={3} xl={3} lg={4}>
              <FormControl sx={{ minHeight: 10, minWidth: 200, width: "100%" }}>
                <InputLabel id="demo-multiple-name-label">Currency</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name='currency'
                  // disabled={((isSubmitted || contest) && (!editing || saving))}
                  value={formState?.currency}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      currency: e.target.value
                    }))
                  }}
                  input={<OutlinedInput label="Contest For" />}
                  sx={{ minHeight: 45 }}
                  MenuProps={MenuProps}
                >
                  <MenuItem
                    value='INR'
                  >
                    INR
                  </MenuItem>
                  <MenuItem
                    value='Other'
                  >
                    Other
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3} xl={3} lg={4}>
              <FormControl sx={{ minHeight: 10, minWidth: 200, width: "100%" }}>
                <InputLabel id="demo-multiple-name-label">Payment Mode</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name='paymentMode'
                  // disabled={((isSubmitted || contest) && (!editing || saving))}
                  value={formState?.paymentMode}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      paymentMode: e.target.value
                    }))
                  }}
                  input={<OutlinedInput label="Contest For" />}
                  sx={{ minHeight: 45 }}
                  MenuProps={MenuProps}
                >
                  <MenuItem
                    value='UPI'
                  >
                    UPI
                  </MenuItem>
                  <MenuItem
                    value='Account Transfer'
                  >
                    Account Transfer
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3} xl={3} lg={4}>
              <FormControl sx={{ minHeight: 10, minWidth: 200, width: "100%" }}>
                <InputLabel id="demo-multiple-name-label">Payment Status</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name='paymentStatus'
                  // disabled={((isSubmitted || contest) && (!editing || saving))}
                  value={formState?.paymentStatus}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      paymentStatus: e.target.value
                    }))
                  }}
                  input={<OutlinedInput label="Payment Status" />}
                  sx={{ minHeight: 45 }}
                  MenuProps={MenuProps}
                >
                  <MenuItem
                    value='succeeded'
                  >
                    Succeeded
                  </MenuItem>
                  <MenuItem
                    value='failed'
                  >
                    Failed
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4} lg={12} display='flex' justifyContent={"flex-end"}>

            <MDButton
              variant="contained"
              color="info"
              size="small"
              sx={{ mr: 1, ml: 2 }}
              // disabled={saving}
              onClick={(e) => { onSave() }}
            >
              Save
            </MDButton>
          </Grid>

        </Grid>
        {renderErrorSB}
        {renderSuccessSB}
      </MDBox>
    </Card>
  );
}



export default AddFunds;
