
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
  const [quizImage, setQuizImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [formState, setFormState] = useState({
    name: '' || quiz?.name,
    state: '' || quiz?.state,
    status: '' || quiz?.status,
  });

  useEffect(() => {
    setTimeout(() => {
      quiz && setUpdatedDocument(quiz)
      setIsLoading(false);
    }, 500)
  }, [])

  const [cityData, setCityData] = useState([]);
  const [tierValue, setTierValue] = useState(quiz?.tier || 3);
  const [value, setValue] = useState({
    _id: quiz?.city?._id || '',
    name: quiz?.city?.name || ""
  })

  const getCities = async () => {
    try{
      const res = await axios.get(`${apiUrl}cities/active`);
      if(res.data.status == 'success'){
        setCityData(res.data.data);
      }
    }catch(e){
      console.log(e);
    }

  }
  useEffect(() => {
    getCities();
  }, [])


  async function onSubmit(e, formState) {
    e.preventDefault()

    if (!formState.name || !formState.state || !formState.status) {
      console.log('values',tierValue, formState.name, formState.status, formState.state);
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }

    setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)

    const formData = new FormData();
    if (quizImage) {
      formData.append("quizImage", quizImage[0]);
    }

    for(let elem in formState){
      formData.append(`${elem}`, formState[elem]);
    }

    if(tierValue){
      formData.append(`grade`, tierValue);
    }

    if(value?._id){
      formData.append(`city`, value?._id);
    }

    // const {grade, title, startDateTime, registrationOpenDateTime, durationInSeconds, rewardType, status } = formState;
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
        tier:tierValue
      })
    });


    const data = await res.json();
    if (res.status !== 201) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      openErrorSB("Quiz not created", data?.message)
    } else {
      openSuccessSB("Quiz Created", data?.message)
      setNewObjectId(data?.data?._id)
      setIsSubmitted(true)
      setQuizData(data?.data);
      setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    }
  }

  async function onEdit(e, formState) {
    e.preventDefault()
    setSaving(true)
    

    if (!formState.name || !formState.state || !formState.status) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }

    const res = await fetch(`${apiUrl}cities/${quiz?._id}`, {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({
        name:formState.name,
        state:formState.state,
        status:formState.status,
        tier:tierValue
      }),
    });

    const data = await res.json();

    if (data.status === 500 || data.status == 400 || data.status==401 || data.status == 'error' || data.error || !data) {
      openErrorSB("Error", data.error)
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
    } else if(data.status == 'success') {
      openSuccessSB("Quiz Edited", "Edited Successfully")
      setTimeout(() => { setSaving(false); setEditing(false) }, 500)
      console.log("entry succesfull");
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

  const handleGradeChange = (event, newValue) => {
    console.log('event', event, newValue)
    setTierValue(newValue);
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
                Fill City Details
              </MDTypography>
            </MDBox>

            <Grid container display="flex" flexDirection="row" justifyContent="space-between">
              <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={12} xl={12}>
                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                    disabled={((isSubmitted || quiz) && (!editing || saving))}
                    id="outlined-required"
                    label='City Name'
                    name='name'
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
                  <CustomAutocomplete
                    id="country-select-demo"
                    sx={{
                      width: "100%",
                      '& .MuiAutocomplete-clearIndicator': {
                        color: 'dark',
                      },
                    }}
                    options={[1,2,3]}
                    label='Tier'
                    value={tierValue}
                    onChange={handleGradeChange}
                    autoHighlight
                    getOptionLabel={(option) => option ? option : 'Grade'}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        {option}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Tier"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password', // disable autocomplete and autofill
                          style: { color: 'dark', height: "10px" }, // set text color to dark
                        }}
                        InputLabelProps={{
                          style: { color: 'dark' },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='status'
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

            </Grid>

            

            <Grid container mt={2} xs={12} md={12} xl={12} >
              <Grid item display="flex" justifyContent="flex-end" xs={12} md={6} xl={12}>
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