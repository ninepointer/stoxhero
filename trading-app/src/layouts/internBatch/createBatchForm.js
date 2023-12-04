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
import { Checkbox, CircularProgress, FormControlLabel, FormGroup, formLabelClasses } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
import BatchParticipants from "./data/participants";
import GroupDiscussions from './data/groupDiscussions';
import { IoMdAddCircle } from 'react-icons/io';
import OutlinedInput from '@mui/material/OutlinedInput';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

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
  const id = location?.state?.data;
  // const [applicationCount, setApplicationCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [isLoading, setIsLoading] = useState(id ? true : false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate();
  const [newObjectId, setNewObjectId] = useState("");
  const [updatedDocument, setUpdatedDocument] = useState([]);
  const [batch, setBatch] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [careers, setCareers] = useState([]);
  const [action, setAction] = useState(false);
  const [type, setType] = useState(id?.portfolio?.portfolioName.includes('Workshop') ? 'Workshop' : 'Job');

  const [formState, setFormState] = useState({
    batchName: '' || id?.batchName,
    batchStartDate: dayjs(id?.batchStartDate) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
    batchEndDate: dayjs(id?.batchEndDate) ?? dayjs(new Date()).set('hour', 23).set('minute', 59).set('second', 59),
    participants: [{ collegeName: '', joinedOn: '', userId: '' }],
    batchStatus: '' || id?.batchStatus,
    referralCount: '' || id?.referralCount,
    orientationDate: dayjs(id?.orientationDate) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
    orientationMeetingLink: '' || id?.orientationMeetingLink,
    payoutPercentage: '' || id?.payoutPercentage,
    payoutCap: '' || id?.payoutCap,
    attendancePercentage: '' || id?.attendancePercentage,
    career: {
      id: id?.career?._id || "",
      jobTitle: id?.career?.jobTitle || "",
    },
    portfolio: {
      id: id?.portfolio?._id || "",
      portfolioName: id?.portfolio?.portfolioName || "",
      portfolioValue: id?.portfolio?.portfolioValue || "",
    },
    rewardType: '' || id?.rewardType,
    tdsRelief: '' || id?.tdsRelief,
  });

  const [childFormState, setChildFormState] = useState({
    gdTitle: '',
    gdTopic: '',
    gdEndDate: '',
    gdEndDate: '',
    meetLink: '',
  });

  useEffect(() => {
    setTimeout(() => {
      id && setUpdatedDocument(id)
      setIsLoading(false);
    }, 500)
  }, [])


  useEffect(() => {
    axios.get(`${baseUrl}api/v1/portfolio/internship`, { withCredentials: true })
      .then((res) => {
        setPortfolios(res?.data?.data);
      }).catch((err) => {
        return new Error(err)
      })

    axios.get(`${baseUrl}api/v1/career/all?type=${type}`, { withCredentials: true })
      .then((res) => {
        setCareers(res?.data?.data);
      }).catch((err) => {
        return new Error(err)
      })

    axios.get(`${baseUrl}api/v1/internbatch/${id?._id}`, { withCredentials: true })
      .then((res) => {
        setBatch(res?.data?.data);
        setFormState({
          batchName: '' || res?.data?.data?.batchName,
          batchStartDate: dayjs(res?.data?.data?.batchStartDate) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
          batchEndDate: dayjs(res?.data?.data?.batchEndDate) ?? dayjs(new Date()).set('hour', 23).set('minute', 59).set('second', 59),
          participants: [{ collegeName: '', joinedOn: '', userId: '' }],
          batchStatus: '' || res?.data?.data?.batchStatus,
          referralCount: '' || res?.data?.data?.referralCount,
          orientationDate: dayjs(res?.data?.data?.orientationDate) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
          orientationMeetingLink: '' || res?.data?.data?.orientationMeetingLink,
          payoutPercentage: '' || res?.data?.data?.payoutPercentage,
          payoutCap: '' || res?.data?.data?.payoutCap,
          attendancePercentage: '' || res?.data?.data?.attendancePercentage,
          career: {
            id: res?.data?.data?.career?._id || "",
            jobTitle: res?.data?.data?.career?.jobTitle || "",
          },
          portfolio: {
            id: res?.data?.data?.portfolio?._id || "",
            portfolioName: res?.data?.data?.portfolio?.portfolioName || "",
            portfolioValue: res?.data?.data?.portfolio?.portfolioValue || "",
          },
          rewardType: '' || res?.data?.data?.rewardType,
          tdsRelief: '' || res?.data?.data?.tdsRelief,
      
        })
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
        //   setIsLoading(false).setTimeout(30000);
      }).catch((err) => {
        //Handle error here
      })
  }, [type])

  console.log("formstate", formState, formState?.career?.jobTitle);

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setType(prev => value);
    setFormState(prevState => ({
      ...prevState,
      portfolio: { id: '', name: '' },
      career: { id: '', name: '' },

    }))
  }
  const handlePortfolioChange = (event) => {
    const {
      target: { value },
    } = event;
    // setRuleName(value)
    let portfolioId = portfolios?.filter((elem) => {
      return elem.portfolioName === value;
    })

    setFormState(prevState => ({
      ...prevState,
      portfolio: { id: portfolioId[0]?._id, name: portfolioId[0]?.portfolioName }
    }))
  };

  const handleCareerChange = (event) => {
    const {
      target: { value },
    } = event;
    // setRuleName(value)
    let careerId = careers?.filter((elem) => {
      return elem.jobTitle === value;
    })

    setFormState(prevState => ({
      ...prevState,
      career: { id: careerId[0]?._id, name: careerId[0]?.jobTitle }
    }))
  };

  async function onSubmit(e, formState) {
    e.preventDefault()
    if (!formState.batchName ||
      !formState.batchStartDate ||
      !formState.batchEndDate ||
      !formState.batchStatus ||
      !formState.career ||
      !formState.portfolio ||
      !formState.attendancePercentage ||
      formState.payoutPercentage === '' ||
      !formState.payoutCap ||
      !formState.rewardType ||
      !formState.orientationDate ||
      !formState.orientationMeetingLink ||
      !formState.referralCount) {

      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }
    if ((type == 'Job' && !formState?.portfolio.name.toLowerCase().includes('internship')) || (type == 'Workshop' && !formState?.portfolio.name.toLowerCase().includes('workshop'))) {
      return openErrorSB("Wrong Portfolio", "Please check the portfolio and type compatibility");
    }

    setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    const { rewardType, tdsRelief, batchName, batchStartDate, batchEndDate, batchStatus, career, portfolio, payoutPercentage, payoutCap, attendancePercentage, referralCount, orientationDate, orientationMeetingLink } = formState;
    const res = await fetch(`${baseUrl}api/v1/internbatch/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        rewardType, tdsRelief, batchName, batchStartDate, batchEndDate, batchStatus, career: career.id, portfolio: portfolio.id, payoutPercentage, attendancePercentage, payoutCap, referralCount, orientationDate, orientationMeetingLink
      })
    });


    const data = await res.json();
    if (res.status !== 201) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      openErrorSB("Batch not created", data?.message)
    } else {
      openSuccessSB("Batch Created", data?.message)
      setNewObjectId(data?.data?._id)
      setIsSubmitted(true)
      setBatch(data?.data);
      setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    }
  }

  async function createGD(e, childFormState, setChildFormState) {
    e.preventDefault()
    setSaving(true)
    if (!childFormState?.gdTitle || !childFormState?.gdTopic || !childFormState?.meetLink || !childFormState?.gdStartDate || !childFormState?.gdEndDate) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }
    const { gdTitle, gdTopic, meetLink, gdStartDate, gdEndDate } = childFormState;

    const res = await fetch(`${baseUrl}api/v1/gd/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        gdTitle, gdTopic, meetLink, gdStartDate, gdEndDate, batch: batch
      })
    });
    const data = await res.json();
    if (res.status !== 201) {
      openErrorSB("Error", data.message)
    } else {
      // setUpdatedDocument(data?.data);
      openSuccessSB("Success", data.message)
      setTimeout(() => { setSaving(false); setEditing(false) }, 500)
    }
  }

  async function onEdit(e, formState) {
    e.preventDefault()
    console.log("Edit Form:", formState)
    setSaving(true)
    if (!formState.batchName ||
      !formState.batchStartDate ||
      !formState.batchEndDate ||
      !formState.batchStatus ||
      !formState.career ||
      !formState.portfolio ||
      formState.payoutPercentage === '' ||
      !formState.payoutCap ||
      !formState.rewardType ||
      !formState.attendancePercentage ||
      !formState.orientationDate ||
      !formState.orientationMeetingLink ||
      !formState.referralCount) {
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }
    const {rewardType, tdsRelief, batchName, batchStartDate, batchEndDate, batchStatus, career, portfolio, payoutPercentage, payoutCap, attendancePercentage, referralCount, orientationDate, orientationMeetingLink } = formState;

    const res = await fetch(`${baseUrl}api/v1/internbatch/${id._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        rewardType, tdsRelief, batchName, batchStartDate, batchEndDate, batchStatus, career: career.id, portfolio: portfolio.id, payoutPercentage, payoutCap, attendancePercentage, referralCount, orientationDate, orientationMeetingLink
      })
    });

    const data = await res.json();
    if (data.data) {
      openSuccessSB("Batch Edited", "Edited Successfully")
      setTimeout(() => { setSaving(false); setEditing(false) }, 500)
    } else {
      openErrorSB("Error", data.error)
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
    // if (!formState[name]?.includes(e.target.value)) {
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
    // }
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
                Fill Batch Details
              </MDTypography>
            </MDBox>

            <Grid container display="flex" flexDirection="row" justifyContent="space-between">
              <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>
                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    id="outlined-required"
                    label='Batch Name *'
                    name='batchName'
                    fullWidth
                    defaultValue={editing ? formState?.batchName : id?.batchName}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    id="outlined-required"
                    label='Referral Count *'
                    name='referralCount'
                    type='number'
                    fullWidth
                    defaultValue={editing ? formState?.referralCount : id?.referralCount}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    id="outlined-required"
                    label='Payout Cap *'
                    name='payoutCap'
                    type='number'
                    fullWidth
                    defaultValue={editing ? formState?.payoutCap : id?.payoutCap}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    id="outlined-required"
                    label='Attendance % *'
                    name='attendancePercentage'
                    type='number'
                    fullWidth
                    defaultValue={editing ? formState?.attendancePercentage : id?.attendancePercentage}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    id="outlined-required"
                    label='Payout % *'
                    name='payoutPercentage'
                    type='number'
                    fullWidth
                    defaultValue={editing ? formState?.payoutPercentage : id?.payoutPercentage}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={-1} mb={2.5}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['MobileDateTimePicker']}>
                      <DemoItem>
                        <MobileDateTimePicker
                          label="Batch Start Date"
                          disabled={((isSubmitted || id) && (!editing || saving))}
                          value={formState?.batchStartDate || dayjs(batch?.batchStartDate)}
                          onChange={(newValue) => {
                            if (newValue && newValue.isValid()) {
                              setFormState(prevState => ({ ...prevState, batchStartDate: newValue }))
                            }
                          }}
                          minDateTime={null}
                          sx={{ width: '100%' }}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>


                <Grid item xs={12} md={6} xl={3} mt={-1} mb={2.5}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['MobileDateTimePicker']}>
                      <DemoItem>
                        <MobileDateTimePicker
                          label="Batch End Date"
                          disabled={((isSubmitted || id) && (!editing || saving))}
                          value={formState?.batchEndDate || dayjs(batch?.batchEndDate)}
                          onChange={(newValue) => {
                            if (newValue && newValue.isValid()) {
                              setFormState(prevState => ({ ...prevState, batchEndDate: newValue }))
                            }
                          }}
                          minDateTime={null}
                          sx={{ width: '100%' }}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={-1} mb={2.5}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['MobileDateTimePicker']}>
                      <DemoItem>
                        <MobileDateTimePicker
                          label="Orientation Date"
                          disabled={((isSubmitted || id) && (!editing || saving))}
                          value={formState?.orientationDate || dayjs(batch?.orientationDate)}
                          onChange={(newValue) => {
                            if (newValue && newValue.isValid()) {
                              setFormState(prevState => ({ ...prevState, orientationDate: newValue }))
                            }
                          }}
                          minDateTime={null}
                          sx={{ width: '100%' }}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={-2}>
                  <TextField
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    id="outlined-required"
                    label='Orientation Meet Link *'
                    name='orientationMeetingLink'
                    type='text'
                    fullWidth
                    defaultValue={editing ? formState?.orientationMeetingLink : id?.orientationMeetingLink}
                    onChange={handleChange}
                  />
                </Grid>

                {!id && <Grid item xs={12} md={6} xl={3} mt={-2}>
                  <FormControl sx={{ minHeight: 10 }}>
                    <InputLabel id="demo-multiple-name-label">Batch Type</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      name='batchType'
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      // defaultValue={id ? portfolios?.portfolio : ''}
                      value={formState?.type}
                      onChange={handleTypeChange}
                      input={<OutlinedInput label="Batch Type" />}
                      sx={{ minHeight: 45, width: 235 }}
                      MenuProps={MenuProps}
                    >
                      <MenuItem
                        value='Job'
                      >
                        Internship
                      </MenuItem>
                      <MenuItem
                        value='Workshop'
                      >
                        Workshop
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>}

                <Grid item xs={12} md={3} xl={3} mt={-2}>
                  <FormControl sx={{ minHeight: 10, width: '100%' }}>
                    <InputLabel id="demo-multiple-name-label">Portfolio</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      name='portfolio'
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      // defaultValue={id ? portfolios?.portfolio : ''}
                      value={formState?.portfolio?.portfolioName || batch?.portfolio?.portfolioName}
                      onChange={handlePortfolioChange}
                      input={<OutlinedInput label="Portfolio" />}
                      sx={{ minHeight: 45 }}
                      MenuProps={MenuProps}
                    >
                      {portfolios?.map((portfolio) => (
                        <MenuItem
                          key={portfolio?.portfolioName}
                          value={portfolio?.portfolioName}
                        >
                          {portfolio.portfolioName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3} xl={3} mt={-2}>
                  <FormControl sx={{ minHeight: 10, width: '100%' }}>
                    <InputLabel id="demo-multiple-name-label">Career</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      name='jobTitle'
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      // defaultValue={id ? portfolios?.portfolio : ''}
                      value={formState?.career?.jobTitle || batch?.career?.jobTitle}
                      onChange={handleCareerChange}
                      input={<OutlinedInput label="Career" />}
                      sx={{ minHeight: 45 }}
                      MenuProps={MenuProps}
                    >
                      {careers?.map((career) => (
                        <MenuItem
                          key={career?.jobTitle}
                          value={career?.jobTitle}
                        >
                          {career.jobTitle}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Batch Status *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='batchStatus'
                      value={formState?.batchStatus || id?.batchStatus}
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          batchStatus: e.target.value
                        }))
                      }}
                      label="Batch Status"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Reward Type *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='rewardType'
                      value={formState?.rewardType || id?.rewardType}
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          rewardType: e.target.value
                        }))
                      }}
                      label="Batch Status"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="HeroCash">HeroCash</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormGroup>
                    <FormControlLabel
                      checked={(id?.tdsRelief !== undefined && !editing && formState?.tdsRelief === undefined) ? id?.tdsRelief : formState?.tdsRelief}
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      onChange={(e) => {
                        console.log('checkbox', e.target.checked, e.target.value);
                        setFormState(prevState => ({
                          ...prevState,
                          tdsRelief: e.target.checked
                        }))
                      }}
                      control={<Checkbox />}
                      label="TDS Relief" />
                  </FormGroup>
                </Grid>
              </Grid>

            </Grid>

            <Grid container mt={2} xs={12} md={12} xl={12} >
              <Grid item display="flex" justifyContent="flex-end" xs={12} md={6} xl={12}>
                {!isSubmitted && !id && (
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
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/internshipbatch") }}>
                      Cancel
                    </MDButton>
                  </>
                )}
                {(isSubmitted || id) && !editing && (
                  <>
                    <MDButton variant="contained" color="warning" size="small" sx={{ mr: 1, ml: 2 }} onClick={() => { setEditing(true) }}>
                      Edit
                    </MDButton>
                    <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/internshipbatch') }}>
                      Back
                    </MDButton>
                  </>
                )}
                {(isSubmitted || id) && editing && (
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

              {(isSubmitted || id) && !editing &&
                <Grid item xs={12} md={6} xl={12}>

                  <Grid container spacing={2}>

                    <Grid item xs={12} md={6} xl={12} mb={1}>
                      <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                        Create Group Discussion
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={1.35} xl={3}>
                      <TextField
                        id="outlined-required"
                        label='Title'
                        fullWidth
                        type="text"
                        // value={formState?.features?.orderNo}
                        onChange={(e) => {
                          setChildFormState(prevState => ({
                            ...prevState,
                            gdTitle: e.target.value
                          }))
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} xl={6}>
                      <TextField
                        id="outlined-required"
                        label='Topic *'
                        fullWidth
                        type="text"
                        // value={formState?.features?.description}
                        onChange={(e) => {
                          setChildFormState(prevState => ({
                            ...prevState,
                            gdTopic: e.target.value
                          }))
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} xl={3}>
                      <TextField
                        id="outlined-required"
                        label='Meet Link *'
                        fullWidth
                        type="text"
                        // value={formState?.features?.description}
                        onChange={(e) => {
                          setChildFormState(prevState => ({
                            ...prevState,
                            meetLink: e.target.value
                          }))
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} xl={3} mt={-1} mb={2.5}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['MobileDateTimePicker']}>
                          <DemoItem>
                            <MobileDateTimePicker
                              label="GD Start Date"
                              // disabled={((isSubmitted || id) && (!editing || saving))}
                              // defaultValue={dayjs(oldObjectId ? idData?.idEndDate : setFormState?.idEndDate)}
                              onChange={(e) => {
                                setChildFormState(prevState => ({
                                  ...prevState,
                                  gdStartDate: dayjs(e)
                                }))
                              }}
                              sx={{ width: '100%' }}
                            />
                          </DemoItem>
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} md={6} xl={3} mt={-1} mb={2.5}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['MobileDateTimePicker']}>
                          <DemoItem>
                            <MobileDateTimePicker
                              label="GD End Date"
                              // disabled={((isSubmitted || id) && (!editing || saving))}
                              // defaultValue={dayjs(oldObjectId ? idData?.idEndDate : setFormState?.idEndDate)}
                              onChange={(e) => {
                                setChildFormState(prevState => ({
                                  ...prevState,
                                  gdEndDate: dayjs(e)
                                }))
                              }}
                              sx={{ width: '100%' }}
                            />
                          </DemoItem>
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} md={6} xl={3}>
                      {/* <IoMdAddCircle cursor="pointer" onClick={(e)=>{onAddFeature(e,formState,setFormState)}}/> */}
                      <MDButton
                        variant='contained'
                        color='success'
                        size='small'
                        onClick={(e) => { createGD(e, childFormState, setChildFormState) }}>Create GD</MDButton>
                    </Grid>

                  </Grid>

                </Grid>
              }

              {(isSubmitted || id) && <Grid item xs={12} md={12} xl={12} mt={2}>
                <MDBox>
                  <GroupDiscussions saving={saving} batch={batch} updatedDocument={updatedDocument} setUpdatedDocument={setUpdatedDocument} action={action} setAction={setAction} />
                </MDBox>
              </Grid>}

              {(id || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                <MDBox>
                  <BatchParticipants batch={newObjectId ? newObjectId : id?._id} action={action} setAction={setAction} />
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