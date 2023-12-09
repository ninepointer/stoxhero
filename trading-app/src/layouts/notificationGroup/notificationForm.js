
import * as React from 'react';
import { useEffect, useState } from "react";
// import axios from "axios";
// import { useForm } from "react-hook-form";
// import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import { Checkbox, CircularProgress, FormControlLabel, FormGroup, formLabelClasses } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
// import { styled } from '@mui/material';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
import RegisteredUsers from "./data/registeredUsers";
import OutlinedInput from '@mui/material/OutlinedInput';
// import Autocomplete from '@mui/material/Autocomplete';
import {apiUrl} from "../../constants/constants"

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

function Index() {
  const location = useLocation();
  const notification = location?.state?.data;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(notification ? true : false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate();
  const [newObjectId, setNewObjectId] = useState("");
  const [notificationData, setNotificationData] = useState([]);
  const [action, setAction] = useState(false);
  // let Url = process.env.NODE_ENV === "production" ? "/" : "http://localhost:3000/"

  const [formState, setFormState] = useState({
    notificationGroupName: '' || notification?.notificationGroupName,
    criteria: '' || notification?.criteria,
    status: '' || notification?.status,
  });

  useEffect(() => {
    setTimeout(() => {
      notification &&
        setIsLoading(false);
    }, 500)
  }, [])



  async function onSubmit(e, formState) {
    // console.log("inside submit")
    e.preventDefault()
    console.log(formState)

    if (!formState.notificationGroupName || !formState.status) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }

    setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    const { notificationGroupName, criteria, status } = formState;
    const res = await fetch(`${apiUrl}notificationgroup`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        notificationGroupName, criteria, status
      })
    });


    const data = await res.json();
    console.log(data, res.status);
    if (res.status !== 201) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      openErrorSB("Notification not created", data?.message)
    } else {
      openSuccessSB("Notification Created", data?.message)
      setNewObjectId(data?.data?._id)
      setIsSubmitted(true)
      setNotificationData(data?.data);
      setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    }
  }

  // console.log("notificationData", notificationData)

  async function onEdit(e, formState) {
    e.preventDefault()
    // console.log("Edited FormState: ", new Date(formState.contestStartTime).toISOString(), new Date(formState.contestEndTime).toISOString())
    setSaving(true)
    // console.log("formstate....", formState, formState.contestnotificationGroupName , formState.contestStartTime , formState.contestEndTime , formState.contestStatus , formState.maxParticipants , formState.status , formState.contestType , formState.portfolio , formState.contestFor , ( formState.isNifty , formState.isBankNifty , formState.isFinNifty) )

    if (!formState.notificationGroupName || !formState.status) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }
    const { notificationGroupName, criteria, status } = formState;

    const res = await fetch(`${apiUrl}notificationgroup/${notification?._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        notificationGroupName, criteria, status
      })
    });

    const data = await res.json();
    console.log(data);
    if (data.status === 500 || data.status == 400 || data.status == 401 || data.status == 'error' || data.error || !data) {
      openErrorSB("Error", data.error)
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
    } else if (data.status == 'success') {
      openSuccessSB("Notification Edited", "Edited Successfully")
      setTimeout(() => { setSaving(false); setEditing(false) }, 500)
      console.log("entry succesfull");
    } else {
      openErrorSB("Error", data.message);
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
    }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!formState[name]?.includes(e.target.value)) {
      setFormState(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <>
      {isLoading ? (
        <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
          <CircularProgress color="info" />
        </MDBox>
      )
        :
        (
          <MDBox pl={2} pr={2} mt={4}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                Fill Notification Details
              </MDTypography>
            </MDBox>

            <Grid container display="flex" flexDirection="row" justifyContent="space-between">
              <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={12} xl={12}>
                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                    disabled={((isSubmitted || notification) && (!editing || saving))}
                    id="outlined-required"
                    label='Name *'
                    name='notificationGroupName'
                    fullWidth
                    defaultValue={editing ? formState?.notificationGroupName : notification?.notificationGroupName}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        notificationGroupName: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id="demo-multiple-name-label">Criteria</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      name='criteria'
                      disabled={((isSubmitted || notification) && (!editing || saving))}
                      // defaultValue={id ? portfolios?.portfolio : ''}
                      value={formState?.criteria}
                      // onChange={handleTypeChange}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          criteria: e.target.value
                        }))
                      }}
                      input={<OutlinedInput label="TestZone For" />}
                      sx={{ minHeight: 45 }}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value='Lifetime Active Users'>Lifetime Active Users</MenuItem>
                      <MenuItem value='Monthly Active Users'>Monthly Active Users</MenuItem>
                      <MenuItem value='Lifetime Paid Users'>Lifetime Paid Users</MenuItem>
                      <MenuItem value='Inactive Users'>Inactive Users</MenuItem>
                      <MenuItem value='Month Inactive Users'>Month Inactive Users</MenuItem>
                      <MenuItem value='Inactive Users Today'>Inactive Users Today</MenuItem>

                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id="demo-multiple-name-label">Status</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      name='status'
                      disabled={((isSubmitted || notification) && (!editing || saving))}
                      // defaultValue={id ? portfolios?.portfolio : ''}
                      value={formState?.status}
                      // onChange={handleTypeChange}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          status: e.target.value
                        }))
                      }}
                      input={<OutlinedInput label="TestZone For" />}
                      sx={{ minHeight: 45 }}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value='Active'>Active</MenuItem>
                      <MenuItem value='Inactive'>Inactive</MenuItem>
                      <MenuItem value='Draft'>Draft</MenuItem>

                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

            </Grid>

            <Grid container mt={2} xs={12} md={12} xl={12} >
              <Grid item display="flex" justifyContent="flex-end" xs={12} md={6} xl={12}>
                {!isSubmitted && !notification && (
                  <>
                    <MDButton
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{ mr: 1, ml: 2 }}
                      disabled={creating}
                      onClick={(e) => { onSubmit(e, formState) }}
                    >
                      {creating ? <CircularProgress size={20} color="inherit" /> : "Save"}
                    </MDButton>
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/contestdashboard/notificationData") }}>
                      Cancel
                    </MDButton>
                  </>
                )}
                {(isSubmitted || notification) && !editing && (
                  <>
                    {notification?.contestStatus !== "Completed" &&
                      <MDButton variant="contained" color="warning" size="small" sx={{ mr: 1, ml: 2 }} onClick={() => { setEditing(true) }}>
                        Edit
                      </MDButton>}
                    <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/contestdashboard/notificationData') }}>
                      Back
                    </MDButton>
                  </>
                )}
                {(isSubmitted || notification) && editing && (
                  <>
                    <MDButton
                      variant="contained"
                      color="warning"
                      size="small"
                      sx={{ mr: 1, ml: 2 }}
                      disabled={saving}
                      onClick={(e) => { onEdit(e, formState) }}
                    >
                      {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                    </MDButton>
                    <MDButton
                      variant="contained"
                      color="error"
                      size="small"
                      disabled={saving}
                      onClick={() => { setEditing(false) }}
                    >
                      Cancel
                    </MDButton>
                  </>
                )}
              </Grid>

              {(notification || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                <MDBox>
                  <RegisteredUsers notification={notification || notificationData} action={action} setAction={setAction} />
                </MDBox>
              </Grid>}
            </Grid>

            {renderSuccessSB}
            {renderErrorSB}
          </MDBox>
        )
      }
    </>
  )
}
export default Index;