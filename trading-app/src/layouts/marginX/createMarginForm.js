
import * as React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
// import { useForm } from "react-hook-form";
// import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import { CircularProgress, formLabelClasses } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
import { IoMdAddCircle } from 'react-icons/io';
import OutlinedInput from '@mui/material/OutlinedInput';
import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { pink } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
// import User from './users';
// import CreateRules from './rulesAndRewards/battleRules';
// import CreateRewards from './rulesAndRewards/battleRewards';

// const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const CustomAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-clearIndicator {
    color: white;
  }
`;
let data;
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
  const marginx = location?.state?.data;
  // const [collegeSelectedOption, setCollegeSelectedOption] = useState();
  // console.log('id hai', marginx);
  // const [applicationCount, setApplicationCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [isLoading, setIsLoading] = useState(marginx ? true : false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate();
  // const [newObjectId, setNewObjectId] = useState("");
  // const [updatedDocument, setUpdatedDocument] = useState([]);
  // const [battles, setBattles] = useState([]);
  const [templates, setTemplate] = useState([]);
  // const [college, setCollege] = useState([]);
  // const [action, setAction] = useState(false);
  const [createdBattle, setCreatedBattle] = useState();
  console.log('created marginx', createdBattle);
  
  const [formState, setFormState] = useState({
    marginXName: '' || marginx?.marginXName,
    liveTime: dayjs(marginx?.liveTime) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
    startTime: dayjs(marginx?.startTime) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
    endTime: dayjs(marginx?.endTime) ?? dayjs(new Date()).set('hour', 23).set('minute', 59).set('second', 59),
    status: '' || marginx?.status,
    marginXExpiry: '' || marginx?.marginXExpiry,
    maxParticipants: '' || marginx?.maxParticipants,
    marginXTemplate: {
      id: "" || marginx?.marginXTemplate?._id,
      name: "" || marginx?.marginXTemplate?.templateName
    },
    isNifty:false || marginx?.isNifty,
    isBankNifty: false || marginx?.isBankNifty,
    isFinNifty: false || marginx?.isFinNifty,

  });

  useEffect(() => {
    setTimeout(() => {
      // marginx && setUpdatedDocument(marginx)
      setIsLoading(false);
    }, 500)
  }, [])


  useEffect(() => {
    axios.get(`${baseUrl}api/v1/marginxtemplate/active`, {withCredentials: true})
      .then((res) => {
        console.log("Battle Portfolios :", res?.data?.data)
        setTemplate(res?.data?.data);
      }).catch((err) => {
        return new Error(err)
      })

  }, [])

  const handleTemplateChange = (event) => {
    const {
      target: { value },
    } = event;
    let template = templates?.filter((elem) => {
      return elem.templateName === value;
    })
    setFormState(prevState => ({
      ...prevState,
      marginXTemplate: {
        ...prevState.marginXTemplate,
        id: template[0]?._id,
        name: template[0]?.templateName
      }
    }));
  };

  async function onSubmit(e, formState) {
    // console.log("inside submit")
    e.preventDefault();
    try{
      console.log(formState)
      if(formState.startTime > formState.endTime){
        return openErrorSB("Error", "Date range is not valid.")
      }
      if (!formState.marginXName || !formState.liveTime || !formState.startTime || !formState.endTime || !formState.status || !formState.marginXExpiry || !formState.maxParticipants  ) {
        setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
        return openErrorSB("Missing Field", "Please fill all the mandatory fields")
      }

      setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
      const { marginXName ,liveTime ,startTime ,endTime ,status ,marginXExpiry ,maxParticipants, isNifty, isBankNifty, isFinNifty } = formState;
      const res = await fetch(`${baseUrl}api/v1/marginx/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          marginXTemplate: templates?._id, marginXName ,liveTime ,startTime ,endTime ,status ,marginXExpiry ,maxParticipants, isNifty, isBankNifty, isFinNifty
        })
      });
  
  
      const data = await res.json();
      setCreatedBattle(data);
      console.log(data, res.status);
      if (res.status !== 201) {
        setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
        openErrorSB("Battle not created", data?.message)
      } else {
        openSuccessSB("Battle Created", data?.message)
        // setNewObjectId(data?.data?._id)
        setIsSubmitted(true);
        setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
      }
    }catch(e){
      console.log(e);
    }
  }

  async function onEdit(e, formState) {
    e.preventDefault()
    setSaving(true)
    console.log("formstate", formState)

    if(new Date(formState.startTime).toISOString() > new Date(formState.endTime).toISOString()){
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
      return openErrorSB("Error", "Date range is not valid.")
    }
    if (!formState.marginXName || !formState.liveTime || !formState.startTime || !formState.endTime || !formState.status || !formState.marginXExpiry || !formState.maxParticipants  ) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }
    const { marginXName ,liveTime ,startTime ,endTime ,status ,marginXExpiry ,maxParticipants, isNifty, isBankNifty, isFinNifty } = formState;

    const res = await fetch(`${baseUrl}api/v1/marginx/${marginx?._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        marginXTemplate: templates?._id, marginXName ,liveTime ,startTime ,endTime ,status ,marginXExpiry ,maxParticipants, isNifty, isBankNifty, isFinNifty
      })
    });

    data = await res.json();
    console.log(data);
    if (data.status === 500 || data.error || !data) {
      openErrorSB("Error", data.error)
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
    } else {
      openSuccessSB("Battle Edited", "Edited Successfully")
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
                Fill MarginX Details
              </MDTypography>
            </MDBox>

            <Grid container display="flex" flexDirection="row" justifyContent="space-between">
              <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>
                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                    disabled={((isSubmitted || marginx) && (!editing || saving))}
                    id="outlined-required"
                    label='MarginX Name *'
                    name='marginXName'
                    fullWidth
                    defaultValue={editing ? formState?.marginXName : marginx?.marginXName}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        marginXName: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={-1} mb={1}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['MobileDateTimePicker']}>
                      <DemoItem>
                        <MobileDateTimePicker
                          label="Live Time"
                          disabled={((isSubmitted || marginx) && (!editing || saving))}
                          value={(formState?.liveTime || marginx?.liveTime)}
                          onChange={(newValue) => {
                            if (newValue && newValue.isValid()) {
                              setFormState(prevState => ({ ...prevState, liveTime: newValue }))
                            }
                          }}
                          minDateTime={null}
                          sx={{ width: '100%' }}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={-1} mb={1}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['MobileDateTimePicker']}>
                      <DemoItem>
                        <MobileDateTimePicker
                          label="Start Time"
                          disabled={((isSubmitted || marginx) && (!editing || saving))}
                          value={(formState?.startTime || marginx?.startTime)}
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


                <Grid item xs={12} md={6} xl={3} mt={-1} mb={1}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['MobileDateTimePicker']}>
                      <DemoItem>
                        <MobileDateTimePicker
                          label="End Time"
                          disabled={((isSubmitted || marginx) && (!editing || saving))}
                          value={(formState?.endTime || marginx?.endTime)}
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

                <Grid item xs={12} md={6} xl={3} mb={2}>
                  <TextField
                    disabled={((isSubmitted || marginx) && (!editing || saving))}
                    id="outlined-required"
                    label='Max Participants *'
                    name='maxParticipants'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.maxParticipants : marginx?.maxParticipants}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        maxParticipants: parseInt(e.target.value, 10)
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3} xl={3}>
                  <FormControl sx={{ minHeight: 10, minWidth: 263 }}>
                    <InputLabel id="demo-multiple-name-label">Templates</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      name='templates'
                      disabled={((isSubmitted || marginx) && (!editing || saving))}
                      value={formState?.marginXTemplate?.name || marginx?.marginXTemplate?.templateName}
                      onChange={handleTemplateChange}
                      input={<OutlinedInput label="Portfolio" />}
                      sx={{ minHeight: 45 }}
                      MenuProps={MenuProps}
                    >
                      {templates?.map((template) => (
                        <MenuItem
                          key={template?.templateName}
                          value={template?.templateName}
                        >
                          {template.templateName}
                        </MenuItem>
                      ))}
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
                      value={formState?.status || marginx?.status}
                      disabled={((isSubmitted || marginx) && (!editing || saving))}
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
                      <MenuItem value="Draft">Draft</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">MarginX Expiry *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='marginXExpiry'
                      value={formState?.marginXExpiry || marginx?.marginXExpiry}
                      disabled={((isSubmitted || marginx) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          marginXExpiry: e.target.value
                        }))
                      }}
                      label="MarginX Expiry"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="Day">Day</MenuItem>
                      <MenuItem value="Weekly">Weekly</MenuItem>
                      <MenuItem value="Monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormGroup>
                    <FormControlLabel  
                      checked={(marginx?.isNifty !== undefined && !editing && formState?.isNifty === undefined) ? marginx?.isNifty : formState?.isNifty}
                      disabled={((isSubmitted || marginx) && (!editing || saving))}
                      onChange={(e) => {
                        console.log('checkbox', e.target.checked, e.target.value);
                        setFormState(prevState => ({
                          ...prevState,
                          isNifty: e.target.checked
                        }))
                      }}
                      control={<Checkbox />} 
                      label="NIFTY" />
                  </FormGroup>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormGroup>
                  <FormControlLabel 
                    checked={(marginx?.isBankNifty !== undefined && !editing && formState?.isBankNifty === undefined) ? marginx?.isBankNifty : formState?.isBankNifty}
                    disabled={((isSubmitted || marginx) && (!editing || saving))}
                    control={<Checkbox />}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        isBankNifty: e.target.checked
                      }))
                    }} 
                    label="BANKNIFTY" />
                  </FormGroup>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormGroup>
                    <FormControlLabel 
                      checked={(marginx?.isFinNifty !== undefined && !editing && formState?.isFinNifty === undefined) ? marginx?.isFinNifty : formState?.isFinNifty}
                      disabled={((isSubmitted || marginx) && (!editing || saving))}
                      control={<Checkbox />} 
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          isFinNifty: e.target.checked
                        }))
                      }}
                      label="FINNIFTY" />
                  </FormGroup>
                </Grid>

              </Grid>

            </Grid>

            <Grid container mt={2} xs={12} md={12} xl={12} >
              <Grid item display="flex" justifyContent="flex-end" xs={12} md={6} xl={12}>
                {!isSubmitted && !Boolean(marginx) && (
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
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/battledashboard") }}>
                      Cancel
                    </MDButton>
                  </>
                )}
                {((isSubmitted || Boolean(marginx)) && !editing) && (
                  <>
                  {marginx?.battleStatus !== "Completed" &&
                    <MDButton variant="contained" color="warning" size="small" sx={{ mr: 1, ml: 2 }} onClick={() => { setEditing(true) }}>
                      Edit
                    </MDButton>}
                    <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/battledashboard') }}>
                      Back
                    </MDButton>
                  </>
                )}
                {((isSubmitted || Boolean(marginx)) && editing) && (
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

//TODO: Server error- isSubmitted state changes/submit condition becomes true