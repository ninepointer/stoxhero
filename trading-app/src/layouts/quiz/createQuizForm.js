
import * as React from 'react';
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import { CircularProgress } from "@mui/material";
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


function Index() {
  const location = useLocation();
  const quiz = location?.state?.data;
  const [isSubmitted, setIsSubmitted] = useState(false);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [isLoading, setIsLoading] = useState(quiz ? true : false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate();
  const [newObjectId, setNewObjectId] = useState("");
  const [updatedDocument, setUpdatedDocument] = useState([]);
  const [quizData, setQuizData] = useState([]);

  const [formState, setFormState] = useState({
    title: '' || quiz?.title,
    startDateTime: dayjs(quiz?.startDateTime) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
    registrationOpenDateTime: dayjs(quiz?.registrationOpenDateTime) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
    durationInSeconds: '' || quiz?.durationInSeconds,
    rewardType: '' || quiz?.rewardType,
    status: '' || quiz?.status,
  });

  useEffect(() => {
    setTimeout(() => {
      quiz && setUpdatedDocument(quiz)
      setIsLoading(false);
    }, 500)
  }, [])

  async function onSubmit(e, formState) {
    e.preventDefault()

    if (!formState.title || !formState.startDateTime || !formState.registrationOpenDateTime || !formState.durationInSeconds || !formState.rewardType || !formState.status) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }

    setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    const { title, startDateTime, registrationOpenDateTime, durationInSeconds, rewardType, status } = formState;
    const res = await fetch(`${apiUrl}quiz`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        title, startDateTime, registrationOpenDateTime, durationInSeconds, rewardType, status
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
    // console.log("Edited FormState: ", new Date(formState.contestStartTime).toISOString(), new Date(formState.contestEndTime).toISOString())
    setSaving(true)
    
    if (!formState.title || !formState.startDateTime || !formState.registrationOpenDateTime || !formState.durationInSeconds || !formState.rewardType || !formState.status) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }
    const { title, startDateTime, registrationOpenDateTime, durationInSeconds, rewardType, status } = formState;

    const res = await fetch(`${apiUrl}quiz/${quiz?._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        title, startDateTime, registrationOpenDateTime, durationInSeconds, rewardType, status
      })
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
                Fill Quiz Details
              </MDTypography>
            </MDBox>

            <Grid container display="flex" flexDirection="row" justifyContent="space-between">
              <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={12} xl={12}>
                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                    disabled={((isSubmitted || quiz) && (!editing || saving))}
                    id="outlined-required"
                    label='Title *'
                    name='title'
                    fullWidth
                    defaultValue={editing ? formState?.title : quiz?.title}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        title: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={-1} mb={1}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['MobileDateTimePicker']}>
                      <DemoItem>
                        <MobileDateTimePicker
                          label="Start Date Time"
                          disabled={((isSubmitted || quiz) && (!editing || saving))}
                          value={formState?.startDateTime || dayjs(quizData?.startDateTime)}
                          onChange={(newValue) => {
                            if (newValue && newValue.isValid()) {
                              setFormState(prevState => ({ ...prevState, startDateTime: newValue }))
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
                          label="Registration Open Date"
                          disabled={((isSubmitted || quiz) && (!editing || saving))}
                          value={formState?.registrationOpenDateTime || dayjs(quizData?.registrationOpenDateTime)}
                          onChange={(newValue) => {
                            if (newValue && newValue.isValid()) {
                              setFormState(prevState => ({ ...prevState, registrationOpenDateTime: newValue }))
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
                  <TextField
                    disabled={((isSubmitted || quiz) && (!editing || saving))}
                    id="outlined-required"
                    label='Duration (seconds) *'
                    name='durationInSeconds'
                    fullWidth
                    defaultValue={editing ? formState?.durationInSeconds : quiz?.durationInSeconds}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Reward Type *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='rewardType'
                      value={formState?.rewardType || quiz?.rewardType}
                      disabled={((isSubmitted || quiz) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          rewardType: e.target.value
                        }))
                      }}
                      label="Reward Type"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Certificate">Certificate</MenuItem>
                      <MenuItem value="Goodies">Goodies</MenuItem>
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
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/quiz") }}>
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
                    <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/quiz') }}>
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

              {/* {(quiz?.payoutType === "Reward" || (isSubmitted && formState?.payoutType === "Reward")) && <Grid item xs={12} md={12} xl={12} mt={2}>
                <MDBox>
                <ContestRewards quiz={quiz!=undefined ? quiz?._id : quizData?._id}/>
                </MDBox>
              </Grid>}
              

              {(isSubmitted || quiz) && <Grid item xs={12} md={12} xl={12} mt={2}>
                <MDBox>
                  <AllowedUsers saving={saving} quizData={quiz?._id ? quiz : quizData} updatedDocument={updatedDocument} setUpdatedDocument={setUpdatedDocument} action={action} setAction={setAction} />
                </MDBox>
              </Grid>}

              {(quiz || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                <MDBox>
                  <RegisteredUsers quizData={quiz?._id ? quiz : quizData} action={action} setAction={setAction} />
                </MDBox>
              </Grid>}

              {(quiz || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                <MDBox>
                  <PotentialUser quizData={quiz?._id ? quiz : quizData} action={action} setAction={setAction} />
                </MDBox>
              </Grid>}

              {(quiz || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                <MDBox>
                  <Shared quizData={quiz?._id ? quiz : quizData} action={action} setAction={setAction} />
                </MDBox>
              </Grid>}
              {(quiz || newObjectId) && quiz?.contestFor == 'College' && <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                <MDBox>
                  <CollegeRegistrations registrations={contestRegistrations} action={action} setAction={setAction} />
                </MDBox>
              </Grid>}
              {(quiz || newObjectId) && quiz?.contestFor == 'StoxHero' && <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                <MDBox>
                  <FeaturedRegistrations registrations={featuredRegistrations} action={action} setAction={setAction} />
                </MDBox>
              </Grid>}

              {((quiz || newObjectId) && (quiz?.contestStatus === 'Completed')) && <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                <MDBox>
                  <Leaderboard quizData={quiz?._id ? quiz : quizData} action={action} setAction={setAction} />
                </MDBox>
              </Grid>} */}

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