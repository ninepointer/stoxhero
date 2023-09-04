
import * as React from 'react';
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import { CircularProgress, formLabelClasses } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
import { apiUrl } from '../../constants/constants';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import ChallengeParameters from './data/challengeParameters'

function Index() {
  const location = useLocation();
  const template = location?.state?.data;
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(template ? true : false)
  const [editing, setEditing] = useState(false)
  const [action, setAction] = useState(false);
  const [saving, setSaving] = useState(false)
  const [updatedDocument, setUpdatedDocument] = useState([]);
  const [creating, setCreating] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    challengeName: '' || template?.challengeName,
    startTime: '' || template?.startTime,
    endTime: '' || template?.endTime,
    challengeType: '' || template?.challengeType,
    status: '' || template?.status,
  });

  const [childFormState,setChildFormState] = useState({
    category:'',
    interval: '',
    entryFee: '',
});   

  useEffect(()=>{
    setTimeout(()=>{
        template && setUpdatedDocument(template)
        setIsLoading(false);
    },500)
  },[])


  async function onSubmit(e, formState) {
    e.preventDefault();
    try{
      console.log(formState)

      if (!formState.challengeName || !formState.startTime || !formState.endTime || !formState.status || !formState.challengeType) {
        setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
        return openErrorSB("Missing Field", "Please fill all the mandatory fields")
      }
  
      setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
      const { challengeName, startTime, endTime, status, challengeType } = formState;
      const res = await fetch(`${apiUrl}challengetemplates`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          challengeName, startTime, endTime, status, challengeType
        })
      });
  
  
      const data = await res.json();
      // setCreateTemplate(data);
      if (res.status !== 201) {
        setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
        openErrorSB("Challenge Template not created", data?.message)
      } else {
        console.log('res',data?.data);
        setCurrentTemplate(data?.data);
        openSuccessSB("Challenge Template Created", data?.message)
        // setNewObjectId(data?.data?._id)
        setIsSubmitted(true);
        // setTemplate(data?.data);
        setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
      }
    }catch(e){
      console.log(e);
    }
  }

  async function createParameter(e,childFormState,setChildFormState){
    e.preventDefault()
    setSaving(true)
    if(!childFormState?.category || !childFormState?.interval || !childFormState?.entryFee){
        setTimeout(()=>{setCreating(false);setIsSubmitted(false)},200)
        return openErrorSB("Missing Field","Please fill all the mandatory fields")
    }
    const {category, interval, entryFee} = childFormState;
  
    const res = await fetch(`${apiUrl}challengetemplates/${currentTemplate._id}`, {
        method: "PATCH",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          challengeParameters:[ ...currentTemplate?.challengeParameters, {
          category, interval, entryFee
        }]  
        })
    });
    const data = await res.json();
    if (res.status !== 201) {
        openErrorSB("Error",data.message)
    } else {
        // setUpdatedDocument(data?.data);
        openSuccessSB("Success",data.message)
        setTimeout(()=>{setSaving(false);setEditing(false)},500)
    }
  }

  async function onEdit(e, formState) {
    e.preventDefault()
    // console.log("Edited FormState: ", new Date(formState.battleStartTime).toISOString(), new Date(formState.battleEndTime).toISOString())
    setSaving(true)
    console.log("formstate", formState)


    if (!formState.challengeName || !formState.startTime || !formState.endTime || !formState.status || !formState.challengeType) {
      console.log('edit', formState);
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }
    const { challengeName, startTime, endTime, status, challengeType } = formState;

    const res = await fetch(`${apiUrl}challengetemplates/${template?._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        challengeName, startTime, endTime, status, challengeType
      })
    });

    const data = await res.json();
    console.log(data);
    if (data.status === 500 || data.error || !data) {
      openErrorSB("Error", data.error)
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
    } else {
      openSuccessSB("Challenge Template Edited", "Edited Successfully")
      setTimeout(() => { setSaving(false); setEditing(false) }, 500)
      console.log("entry succesfull");
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

  // console.log("check stoxhero", formState?.isNifty , contest?.contestFor , dailyContest?.contestFor )

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
                Fill Template Details
              </MDTypography>
            </MDBox>

            <Grid container display="flex" flexDirection="row" justifyContent="space-between">
              <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>
                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                    disabled={((isSubmitted || template) && (!editing || saving))}
                    id="outlined-required"
                    label='Challenge Name *'
                    name='challengeName'
                    fullWidth
                    defaultValue={editing ? formState?.challengeName : template?.challengeName}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        challengeName: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={1.5} mt={-1} mb={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={[
                        'TimePicker',
                      ]}
                    >
                      <DemoItem>
                        <TimePicker 
                          // defaultValue={dayjs('2022-04-17T15:30')}
                          label="Start Time"
                          disabled={((isSubmitted || template) && (!editing || saving))}
                          value={formState?.startTime || dayjs(template?.startTime)}
                          onChange={(newValue) => {
                            if (newValue && newValue.isValid()) {
                              setFormState(prevState => ({ ...prevState, startTime: newValue }))
                            }
                          }}
                          minDateTime={null}
                          sx={{ width: '100%' }} 
                        />
                      </DemoItem>
                    </DemoContainer>
                </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6} xl={1.5} mt={-1} mb={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={[
                        'TimePicker',
                      ]}
                    >
                      <DemoItem>
                        <TimePicker 
                          // defaultValue={dayjs('2022-04-17T15:30')}
                          label="End Time"
                          disabled={((isSubmitted || template) && (!editing || saving))}
                          value={formState?.endTime || dayjs(template?.endTime)}
                          onChange={(newValue) => {
                            if (newValue && newValue.isValid()) {
                              setFormState(prevState => ({ ...prevState, endTime: newValue }))
                            }
                          }}
                          minDateTime={null}
                          sx={{ width: '100%' }} 
                        />
                      </DemoItem>
                    </DemoContainer>
                </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Challenge Type *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='status'
                      value={formState?.challengeType || template?.challengeType}
                      disabled={((isSubmitted || template) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          challengeType: e.target.value
                        }))
                      }}
                      label="Status"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="Intraday">Intraday</MenuItem>
                      <MenuItem value="PTWT">PTWT</MenuItem>
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
                      value={formState?.status || template?.status}
                      disabled={((isSubmitted || template) && (!editing || saving))}
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
                    </Select>
                  </FormControl>
                </Grid>

              </Grid>

            </Grid>

            {(isSubmitted || template) && !editing && 
                  <Grid item xs={12} md={6} xl={12}>
                      
                      <Grid container spacing={2}>

                      <Grid item xs={12} md={6} xl={12} mb={1}>
                      <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                          Create Challenge Parameters
                      </MDTypography>
                      </Grid>
                      
                      <Grid item xs={12} md={1.35} xl={3}>
                          <TextField
                              id="outlined-required"
                              label='Category'
                              fullWidth
                              type="text"
                              // value={formState?.features?.orderNo}
                              onChange={(e) => {setChildFormState(prevState => ({
                                  ...prevState,
                                  gdTitle: e.target.value
                              }))}}
                          />
                      </Grid>

                      <Grid item xs={12} md={6} xl={3}>
                        <FormControl sx={{ width: "100%" }}>
                          <InputLabel id="demo-simple-select-autowidth-label">Category *</InputLabel>
                          <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            name='category'
                            onChange={(e) => {setChildFormState(prevState => ({
                              ...prevState,
                              category: e.target.value
                            }))}}
                            sx={{ minHeight: 43 }}
                          >
                            <MenuItem value="Low Entry">Low Entry</MenuItem>
                            <MenuItem value="Medium Entry">Medium Entry</MenuItem>
                            <MenuItem value="High Entry">High Entry</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
          
                      <Grid item xs={12} md={6} xl={6}>
                          <TextField
                              id="outlined-required"
                              label='Interval *'
                              fullWidth
                              type="number"
                              // value={formState?.features?.description}
                              onChange={(e) => {setChildFormState(prevState => ({
                                  ...prevState,
                                  interval: e.target.value
                              }))}}
                          />
                      </Grid>

                      <Grid item xs={12} md={6} xl={3}>
                          <TextField
                              id="outlined-required"
                              label='Entry Fee *'
                              fullWidth
                              type="number"
                              onChange={(e) => {setChildFormState(prevState => ({
                                  ...prevState,
                                  entryFee: e.target.value
                              }))}}
                          />
                      </Grid>
              
                      <Grid item xs={12} md={6} xl={3}>
                          <MDButton 
                            variant='contained' 
                            color='success' 
                            size='small' 
                            onClick={(e)=>{createParameter(e,childFormState,setChildFormState)}}>Add Parameter</MDButton>
                      </Grid>
      
                      </Grid>
      
                  </Grid>
                }

            <Grid container mt={2} xs={12} md={12} xl={12} >
              <Grid item display="flex" justifyContent="flex-end" xs={12} md={6} xl={12}>
                {!isSubmitted && !Boolean(template) && (
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
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/challengedashboard/challengetemplate") }}>
                      Cancel
                    </MDButton>
                  </>
                )}
                {((isSubmitted || Boolean(template)) && !editing) && (
                  <>
                  {template?.status !== "Completed" &&
                    <MDButton variant="contained" color="warning" size="small" sx={{ mr: 1, ml: 2 }} onClick={() => { setEditing(true) }}>
                      Edit
                    </MDButton>}
                    <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/challengedashboard/challengetemplate') }}>
                      Back
                    </MDButton>
                  </>
                )}
                {((isSubmitted || Boolean(template)) && editing) && (
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

            {(isSubmitted || template) && !editing && 
                  <Grid item xs={12} md={6} xl={12} display='flex' justifyContent='center' alignItems='center'>
                      
                      <Grid container spacing={2} display='flex' justifyContent='center' alignItems='center'>

                      <Grid item xs={12} md={6} xl={12} mb={1}>
                      <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                          Create Challenge Parameters
                      </MDTypography>
                      </Grid>

                      <Grid item xs={12} md={6} xl={3}>
                        <FormControl sx={{ width: "100%" }}>
                          <InputLabel id="demo-simple-select-autowidth-label">Category *</InputLabel>
                          <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            name='category'
                            onChange={(e) => {setChildFormState(prevState => ({
                              ...prevState,
                              category: e.target.value
                            }))}}
                            sx={{ minHeight: 43 }}
                          >
                            <MenuItem value="Low Entry">Low Entry</MenuItem>
                            <MenuItem value="Medium Entry">Medium Entry</MenuItem>
                            <MenuItem value="High Entry">High Entry</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
          
                      <Grid item xs={12} md={6} xl={3}>
                          <TextField
                              id="outlined-required"
                              label='Interval *'
                              fullWidth
                              type="number"
                              // value={formState?.features?.description}
                              onChange={(e) => {setChildFormState(prevState => ({
                                  ...prevState,
                                  interval: e.target.value
                              }))}}
                          />
                      </Grid>

                      <Grid item xs={12} md={6} xl={3}>
                          <TextField
                              id="outlined-required"
                              label='Entry Fee *'
                              fullWidth
                              type="number"
                              onChange={(e) => {setChildFormState(prevState => ({
                                  ...prevState,
                                  entryFee: e.target.value
                              }))}}
                          />
                      </Grid>
              
                      <Grid item xs={12} md={6} xl={3}>
                          <MDButton 
                            variant='contained' 
                            color='success' 
                            size='small' 
                            style={{minWidth:'100%'}}
                            onClick={(e)=>{createParameter(e,childFormState,setChildFormState)}}>Add Parameter</MDButton>
                      </Grid>
      
                      </Grid>
      
                  </Grid>
                }

            {(isSubmitted || template) && 
                <Grid item xs={12} md={12} xl={12} mt={2}>
                    <MDBox>
                        <ChallengeParameters saving={saving} template={template} updatedDocument={updatedDocument} setUpdatedDocument={setUpdatedDocument} action={action} setAction={setAction}/>
                    </MDBox>
                </Grid>
            }

            {renderSuccessSB}
            {renderErrorSB}
          </MDBox>
        )
      }
    </>
  )
}
export default Index;

//TODO: Server error- isSubmitted state changes/submit condition becomes true