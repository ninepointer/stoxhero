
import * as React from 'react';
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import {Grid, Card, CardContent, CardActionArea, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import { CircularProgress, Typography } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import {apiUrl} from  '../../constants/constants';
import { Autocomplete, Box } from "@mui/material";
import { styled } from '@mui/material';
import axios from 'axios';


const CustomAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-clearIndicator {
    color: white;
  }
`;


function Index() {
  const location = useLocation();
  const quiz = location?.state?.data;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(quiz ? true : false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate();
  const [newObjectId, setNewObjectId] = useState("");
  const [updatedDocument, setUpdatedDocument] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [previewUrl, setPreviewUrl] = useState('');

  const [formState, setFormState] = useState({
    name: '' || quiz?.name,
    state: '' || quiz?.state,
    tier: '' || quiz?.tier,
    status: '' || quiz?.status,
  });

  useEffect(() => {
    setTimeout(() => {
      quiz && setUpdatedDocument(quiz)
      setIsLoading(false);
    }, 500)
  }, [])

  const [cityData, setCityData] = useState([]);
  // const [tierValue, setTierValue] = useState(quiz?.tier || 3);
  const [value, setValue] = useState({
    _id: quiz?.city?._id || '',
    name: quiz?.city?.name || ""
  })


  async function onSubmit(e, formState) {
    e.preventDefault()

    if (!formState.name || !formState.state || !formState.tier || !formState.status) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }

    setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)

    const formData = new FormData();

    for(let elem in formState){
      formData.append(`${elem}`, formState[elem]);
    }

    const res = await fetch(`${apiUrl}cities`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      credentials: "include",
      body: JSON.stringify({
        name:formState.name,
        state:formState.state,
        status:formState.status,
        tier:Number(formState.tier)
      })
    });


    const data = await res.json();
    if (res.status !== 201) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      openErrorSB("City not created", data?.message)
    } else {
      openSuccessSB("City Created", data?.message)
      setNewObjectId(data?.data?._id)
      setIsSubmitted(true)
      setQuizData(data?.data);
      setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    }
  }

  async function onEdit(e, formState) {
    e.preventDefault()
    setSaving(true)
    console.log(formState)

    // if (!formState.name || !formState.state || !formState.tier || !formState.status) {
    //   setTimeout(() => { setCreating(false); setIsSubmitted(false); setSaving(false) }, 500)
    //   return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    // }

    if (!formState.name || !formState.name.trim()) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false); setSaving(false) }, 500);
      return openErrorSB("Missing Field", "Name field is blank");
    } else if (!formState.state || !formState.state.trim()) {
        setTimeout(() => { setCreating(false); setIsSubmitted(false); setSaving(false) }, 500);
        return openErrorSB("Missing Field", "State field is blank");
    } else if (!formState.tier) {
        setTimeout(() => { setCreating(false); setIsSubmitted(false); setSaving(false) }, 500);
        return openErrorSB("Missing Field", "Tier field is blank");
    } else if (!formState.status) {
        setTimeout(() => { setCreating(false); setIsSubmitted(false); setSaving(false) }, 500);
        return openErrorSB("Missing Field", "Status field is blank");
    }
  
    console.log("All fields are filled")
    const res = await fetch(`${apiUrl}cities/${quiz?._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type" : "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        name:formState.name,
        state:formState.state,
        status:formState.status,
        tier:Number(formState.tier)
      }),
    });

    const data = await res.json();

    if (data.status === 500 || data.status == 400 || data.status==401 || data.status == 'error' || data.error || !data) {
      openErrorSB("Error", data.error)
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
    } else if(data.status == 'success') {
      openSuccessSB("City Edited", "Edited Successfully")
      setTimeout(() => { setSaving(false); setEditing(false) }, 500)
    }else{
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

  // const handleGradeChange = (event, newValue) => {
  //   console.log('event', event, newValue)
  //   setTierValue(newValue);
  // };

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
                Fill City Details
              </MDTypography>
            </MDBox>

            <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={12} xl={12} display="flex" flexDirection="row" justifyContent="space-between">
    
                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                    disabled={((isSubmitted || quiz) && (!editing || saving))}
                    id="outlined-required"
                    label='City Name'
                    name='name'
                    required
                    fullWidth
                    defaultValue={editing ? formState?.name : quiz?.name}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        name: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                    disabled={((isSubmitted || quiz) && (!editing || saving))}
                    id="outlined-required"
                    label='State'
                    name='state'
                    required
                    fullWidth
                    defaultValue={editing ? formState?.state : quiz?.state}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        state: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Tier *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='tier'
                      required
                      value={formState?.tier || quiz?.tier}
                      disabled={((isSubmitted || quiz) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          tier: e.target.value
                        }))
                      }}
                      label="Tier"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="3">3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='status'
                      required
                      value={formState?.status || quiz?.status}
                      disabled={((isSubmitted || quiz) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          status: e.target.value
                        }))
                      }}
                      label="Status"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                      <MenuItem value="Draft">Draft</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

            </Grid>

            

            <Grid container spacing={2} mt={2} mb={2} xs={12} md={12} xl={12} display="flex" justifyContent="center" alignItems='center'>
              <Grid item display="flex" justifyContent="flex-start" xs={6} md={6} xl={6}>
                {quiz && <MDTypography variant='caption'>City Code: {quiz.code}</MDTypography>}
              </Grid>
              <Grid item display="flex" justifyContent="flex-end" xs={6} md={6} xl={6}>
                {!isSubmitted && !quiz && (
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
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/city") }}>
                      Cancel
                    </MDButton>
                  </>
                )}
                {(isSubmitted || quiz) && !editing && (
                  <>
                  {quiz?.contestStatus !== "Completed" &&
                    <MDButton variant="contained" color="warning" size="small" sx={{ mr: 1, ml: 2 }} onClick={() => { setEditing(true) }}>
                      Edit
                    </MDButton>}
                    <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/city') }}>
                      Back
                    </MDButton>
                  </>
                )}
                {(isSubmitted || quiz) && editing && (
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