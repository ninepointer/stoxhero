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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
import RegisteredUsers from "./data/registeredUsers";
import AllowedUsers from './data/notifyUsers';
import { IoMdAddCircle } from 'react-icons/io';
import OutlinedInput from '@mui/material/OutlinedInput';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
// import User from './users';
import PotentialUser from "./data/potentialUsers"

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
  const contest = location?.state?.data;
  console.log('id hai', contest);
  // const [applicationCount, setApplicationCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  const [isLoading, setIsLoading] = useState(contest ? true : false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate();
  const [newObjectId, setNewObjectId] = useState("");
  const [updatedDocument, setUpdatedDocument] = useState([]);
  const [dailyContest, setDailyContest] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  // const [careers,setCareers] = useState([]);
  const [action, setAction] = useState(false);
  // const [type, setType] = useState(contest?.portfolio?.portfolioName.includes('Workshop')?'Workshop':'Job');

  const [formState, setFormState] = useState({
    contestName: '' || contest?.contestName,
    contestStartTime: dayjs(contest?.contestStartTime) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
    contestEndTime: dayjs(contest?.contestEndTime) ?? dayjs(new Date()).set('hour', 23).set('minute', 59).set('second', 59),
    allowedUsers: [{ addedOn: '', userId: '' }],
    contestStatus: '' || contest?.contestStatus,
    contestType: '' || contest?.contestType,
    contestOn: '' || contest?.contestOn,
    maxParticipants: '' || contest?.maxParticipants,
    payoutPercentage: '' || contest?.payoutPercentage,
    entryFee: '' || contest?.entryFee,
    description: '' || contest?.description,
    portfolio: "" || contest?.portfolio?._id,

    contestExpiry: "" || contest?.contestExpiry,
    isNifty: "" || contest?.isNifty,
    isBankNifty: "" || contest?.isBankNifty,
    isFinNifty: "" || contest?.isFinNifty,
    isAllIndex: "" || contest?.isAllIndex,

    registeredUsers: {
      userId: "",
      registeredOn: "",
      status: "",
      exitDate: "",
    },
  });

  useEffect(() => {
    setTimeout(() => {
      contest && setUpdatedDocument(contest)
      setIsLoading(false);
    }, 500)
  }, [])


  useEffect(() => {
    axios.get(`${baseUrl}api/v1/portfolio/dailycontestportfolio`)
      .then((res) => {
        console.log("Contest Portfolios :", res?.data?.data)
        setPortfolios(res?.data?.data);
      }).catch((err) => {
        return new Error(err)
      })

  }, [])


  const handlePortfolioChange = (event) => {
    const {
      target: { value },
    } = event;
    let portfolioId = portfolios?.filter((elem) => {
      return elem.portfolioName === value;
    })
    setFormState(prevState => ({
      ...prevState,
      // portfolio: { id: portfolioId[0]?._id, portfolioName: portfolioId[0]?.portfolioName, portfolioValue: portfolioId[0]?.portfolioValue }
      portfolio: portfolioId[0]?._id

    }))
    console.log("portfolioId", portfolioId, formState)
  };


  async function onSubmit(e, formState) {
    console.log("inside submit")
    e.preventDefault()
    console.log(formState)
    if (!formState.contestName || !formState.contestStartTime || !formState.contestEndTime || !formState.contestStatus || !formState.portfolio) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }

    setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    const { contestName, contestStartTime, contestEndTime, contestStatus, maxParticipants, payoutPercentage, entryFee, description, portfolio, contestType, isNifty, isBankNifty, isFinNifty, isAllIndex, contestExpiry } = formState;
    const res = await fetch(`${baseUrl}api/v1/dailycontest/contest`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        contestName, contestStartTime, contestEndTime, contestStatus, maxParticipants, payoutPercentage, entryFee, description, portfolio, contestType, isNifty, isBankNifty, isFinNifty, isAllIndex, contestExpiry
      })
    });


    const data = await res.json();
    console.log(data, res.status);
    if (res.status !== 201) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      openErrorSB("Contest not created", data?.message)
    } else {
      openSuccessSB("Contest Created", data?.message)
      setNewObjectId(data?.data?._id)
      console.log("New Object Id: ", data?.data?._id, newObjectId)
      setIsSubmitted(true)
      setDailyContest(data?.data);
      setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    }
  }

  console.log("dailyContest", dailyContest)

  async function onEdit(e, formState) {
    e.preventDefault()
    console.log("Edited FormState: ", formState, contest?._id)
    setSaving(true)
    console.log(formState)
    if (!formState.contestName || !formState.contestStartTime || !formState.contestEndTime || !formState.contestStatus || !formState.portfolio) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }
    const { contestName, contestStartTime, contestEndTime, contestStatus, maxParticipants, payoutPercentage, entryFee, description, portfolio, contestType, isNifty, isBankNifty, isFinNifty, isAllIndex, contestExpiry } = formState;

    const res = await fetch(`${baseUrl}api/v1/dailycontest/contest/${contest?._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        contestName, contestStartTime, contestEndTime, contestStatus, maxParticipants, payoutPercentage, entryFee, description, portfolio, contestType, isNifty, isBankNifty, isFinNifty, isAllIndex, contestExpiry
      })
    });

    const data = await res.json();
    console.log(data);
    if (data.status === 422 || data.error || !data) {
      openErrorSB("Error", data.error)
    } else {
      openSuccessSB("Contest Edited", "Edited Successfully")
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
                Fill Contest Details
              </MDTypography>
            </MDBox>

            <Grid container display="flex" flexDirection="row" justifyContent="space-between">
              <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>
                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                    disabled={((isSubmitted || contest) && (!editing || saving))}
                    id="outlined-required"
                    label='Contest Name *'
                    name='contestName'
                    fullWidth
                    defaultValue={editing ? formState?.contestName : contest?.contestName}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={-1} mb={2.5}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['MobileDateTimePicker']}>
                      <DemoItem>
                        <MobileDateTimePicker
                          label="Contest Start Time"
                          disabled={((isSubmitted || contest) && (!editing || saving))}
                          value={formState?.contestStartTime || dayjs(dailyContest?.contestStartTime)}
                          onChange={(newValue) => {
                            if (newValue && newValue.isValid()) {
                              setFormState(prevState => ({ ...prevState, contestStartTime: newValue }))
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
                          label="Contest End Time"
                          disabled={((isSubmitted || contest) && (!editing || saving))}
                          value={formState?.contestEndTime || dayjs(dailyContest?.contestEndTime)}
                          onChange={(newValue) => {
                            if (newValue && newValue.isValid()) {
                              setFormState(prevState => ({ ...prevState, contestEndTime: newValue }))
                            }
                          }}
                          minDateTime={null}
                          sx={{ width: '100%' }}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>

                {!contest && <Grid item xs={12} md={3} xl={3}>
                  <FormControl sx={{ minHeight: 10, minWidth: 263 }}>
                    <InputLabel id="demo-multiple-name-label">Contest Type</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      name='contestType'
                      disabled={((isSubmitted || contest) && (!editing || saving))}
                      // defaultValue={id ? portfolios?.portfolio : ''}
                      value={formState?.contestType}
                      // onChange={handleTypeChange}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          contestType: e.target.value
                        }))
                      }}
                      input={<OutlinedInput label="Contest Type" />}
                      sx={{ minHeight: 45 }}
                      MenuProps={MenuProps}
                    >
                      <MenuItem
                        value='Mock'
                      >
                        Mock
                      </MenuItem>
                      <MenuItem
                        value='Live'
                      >
                        Live
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>}

                <Grid item xs={12} md={6} xl={3} mb={2}>
                  <TextField
                    disabled={((isSubmitted || contest) && (!editing || saving))}
                    id="outlined-required"
                    label='Max Participants *'
                    name='maxParticipants'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.maxParticipants : contest?.maxParticipants}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        maxParticipants: parseInt(e.target.value, 10)
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mb={2}>
                  <TextField
                    disabled={((isSubmitted || contest) && (!editing || saving))}
                    id="outlined-required"
                    label='Payout Percentage *'
                    name='payoutPercentage'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.payoutPercentage : contest?.payoutPercentage}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        payoutPercentage: parseInt(e.target.value, 10)
                      }))
                    }}
                  />
                </Grid>

                {/* <Grid item xs={12} md={6} xl={3} mb={2}>
                  <TextField
                    disabled={((isSubmitted || contest) && (!editing || saving))}
                    id="outlined-required"
                    label='Contest On *'
                    name='contestOn'
                    fullWidth
                    type='text'
                    defaultValue={editing ? formState?.contestOn : contest?.contestOn}
                    onChange={handleChange}
                  />
                </Grid> */}

                <Grid item xs={12} md={6} xl={3} mb={2}>
                  <TextField
                    disabled={((isSubmitted || contest) && (!editing || saving))}
                    id="outlined-required"
                    label='Entry Fee *'
                    name='entryFee'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.entryFee : contest?.entryFee}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        entryFee: parseInt(e.target.value, 10)
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={12} mt={-2}>
                  <TextField
                    disabled={((isSubmitted || contest) && (!editing || saving))}
                    id="outlined-required"
                    label='Description *'
                    name='description'
                    fullWidth
                    defaultValue={editing ? formState?.description : contest?.description}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={3} xl={3}>
                  <FormControl sx={{ minHeight: 10, minWidth: 263 }}>
                    <InputLabel id="demo-multiple-name-label">Portfolio</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      name='portfolio'
                      disabled={((isSubmitted || contest) && (!editing || saving))}
                      value={formState?.portfolio?.name || dailyContest?.portfolio?.portfolioName}
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

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Contest Status *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='contestStatus'
                      value={formState?.contestStatus || contest?.contestStatus}
                      disabled={((isSubmitted || contest) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          contestStatus: e.target.value
                        }))
                      }}
                      label="Contest Status"
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
                    <InputLabel id="demo-simple-select-autowidth-label">Contest Expiry *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='contestExpiry'
                      value={formState?.contestExpiry || contest?.contestExpiry}
                      disabled={((isSubmitted || contest) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          contestExpiry: e.target.value
                        }))
                      }}
                      label="Contest Expiry"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="Day">Day</MenuItem>
                      <MenuItem value="Weekly">Weekly</MenuItem>
                      <MenuItem value="Monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Is Contest on Nifty ? *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='isNifty'
                      value={formState?.isNifty || contest?.isNifty}
                      disabled={((isSubmitted || contest) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          isNifty: e.target.value
                        }))
                      }}
                      label="Is Nifty"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="true">TRUE</MenuItem>
                      <MenuItem value="false">FALSE</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Is Contest on BankNifty ? *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='isBankNifty'
                      value={formState?.isBankNifty || contest?.isBankNifty}
                      disabled={((isSubmitted || contest) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          isBankNifty: e.target.value
                        }))
                      }}
                      label="Is BankNifty"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="true">TRUE</MenuItem>
                      <MenuItem value="false">FALSE</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Is Contest on FinNifty ? *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='isFinNifty'
                      value={formState?.isFinNifty || contest?.isFinNifty}
                      disabled={((isSubmitted || contest) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          isFinNifty: e.target.value
                        }))
                      }}
                      label="Is FinNifty"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="true">TRUE</MenuItem>
                      <MenuItem value="false">FALSE</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Is Contest on All Index ? *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='isAllIndex'
                      value={formState?.isAllIndex || contest?.isAllIndex}
                      disabled={((isSubmitted || contest) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          isAllIndex: e.target.value
                        }))
                      }}
                      label="Is All Index"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="true">TRUE</MenuItem>
                      <MenuItem value="false">FALSE</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

              </Grid>

            </Grid>

            <Grid container mt={2} xs={12} md={12} xl={12} >
              <Grid item display="flex" justifyContent="flex-end" xs={12} md={6} xl={12}>
                {!isSubmitted && !contest && (
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
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/dailycontest") }}>
                      Cancel
                    </MDButton>
                  </>
                )}
                {(isSubmitted || contest) && !editing && (
                  <>
                    <MDButton variant="contained" color="warning" size="small" sx={{ mr: 1, ml: 2 }} onClick={() => { setEditing(true) }}>
                      Edit
                    </MDButton>
                    <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/dailycontest') }}>
                      Back
                    </MDButton>
                  </>
                )}
                {(isSubmitted || contest) && editing && (
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

              {/* {(isSubmitted || contest) && !editing &&
                <Grid item xs={12} md={6} xl={12}>

                  <Grid container spacing={2}>

                    <Grid item xs={12} md={6} xl={12} mb={1}>
                      <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                        Add Allowed Users
                      </MDTypography>
                    </Grid>

                    <User contestId={contest?._id ? contest?._id : dailyContest?._id} setUpdatedDocument={setUpdatedDocument} />


                  </Grid>

                </Grid>} */}

              {(isSubmitted || contest) && <Grid item xs={12} md={12} xl={12} mt={2}>
                <MDBox>
                  <AllowedUsers saving={saving} dailyContest={contest?._id ? contest : dailyContest} updatedDocument={updatedDocument} setUpdatedDocument={setUpdatedDocument} action={action} setAction={setAction} />
                </MDBox>
              </Grid>}

              {(contest || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                <MDBox>
                  <RegisteredUsers dailyContest={contest?._id ? contest : dailyContest} action={action} setAction={setAction} />
                </MDBox>
              </Grid>}

              {(contest || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                <MDBox>
                  <PotentialUser dailyContest={contest?._id ? contest : dailyContest} action={action} setAction={setAction} />
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