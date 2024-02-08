
import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import TextField from '@mui/material/TextField';
import {Grid, Card, CardContent, CardActionArea, FormControlLabel, FormGroup, Checkbox} from "@mui/material";
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
import Rewards from "./data/reward/contestReward";
import Question from "./data/questions/questions";
import { Autocomplete, Box } from "@mui/material";
import { styled } from '@mui/material';
import axios from 'axios';
import JoditEditor from 'jodit-react';


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
  const editor = useRef(null);
  // const [descData, setDescData] = useState(quiz?.description || '');


  const [formState, setFormState] = useState({
    title: '' || quiz?.title,
    startDateTime: dayjs(quiz?.startDateTime) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
    registrationOpenDateTime: dayjs(quiz?.registrationOpenDateTime) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
    durationInSeconds: '' || quiz?.durationInSeconds,
    rewardType: '' || quiz?.rewardType,
    status: '' || quiz?.status,
    maxParticipant: "" || quiz?.maxParticipant,
    openForAll: false || quiz?.openForAll,
    description: "" || quiz?.description,
    image: "" || quiz?.image
  });

  useEffect(() => {
    setTimeout(() => {
      quiz && setUpdatedDocument(quiz)
      setIsLoading(false);
    }, 500)
  }, [])

  const [cityData, setCityData] = useState([]);
  const [gradeValue, setGradeValue] = useState(quiz?.grade || '6th');
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

  const handleImage = (event) => {
    const file = event.target.files[0];
    setQuizImage(event.target.files);
    // Create a FileReader instance
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  async function onSubmit(e, formState) {
    e.preventDefault()

    if (!quizImage) {
      openErrorSB('error', 'Please select a file to upload');
      return;
    }

    if (!gradeValue || !formState.title || !formState.startDateTime || !formState.registrationOpenDateTime || !formState.durationInSeconds || !formState.rewardType || !formState.status) {
      console.log(gradeValue, formState.title, formState.startDateTime, formState.registrationOpenDateTime, formState.durationInSeconds, formState.rewardType, formState.status)
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

    if(gradeValue){
      formData.append(`grade`, gradeValue);
    }

    if(value?._id){
      formData.append(`city`, value?._id);
    }

    // const {grade, title, startDateTime, registrationOpenDateTime, durationInSeconds, rewardType, status } = formState;
    const res = await fetch(`${apiUrl}quiz`, {
      method: "POST",
      credentials: "include",
      body: formData
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
    
    // if (!quizImage) {
    //   openErrorSB('error', 'Please select a file to upload');
    //   return;
    // }

    if (!gradeValue || !formState.title || !formState.startDateTime || !formState.registrationOpenDateTime || !formState.durationInSeconds || !formState.rewardType || !formState.status) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }

    const formData = new FormData();
    if (quizImage) {
      formData.append("quizImage", quizImage[0]);
    }

    for(let elem in formState){
      formData.append(`${elem}`, formState[elem]);
    }

    if(gradeValue){
      formData.append(`grade`, gradeValue);
    }

    if(value?._id){
      formData.append(`city`, value?._id);
    }

    const res = await fetch(`${apiUrl}quiz/${quiz?._id}`, {
      method: "PATCH",
      credentials: "include",
      body: formData
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

  const handleCityChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleGradeChange = (event, newValue) => {
    setGradeValue(newValue);
  };

  const config = React.useMemo(
    () => ({
      disabled: ((isSubmitted || quiz) && (!editing || saving)),
      readonly: false,
      enableDragAndDropFileToEditor: false,
      toolbarAdaptive: false,
      toolbarSticky: true,
      addNewLine: false,
      useSearch: false,
      hidePoweredByJodit: true,
    }),
    [isSubmitted, quiz, editing, saving],
  )

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
              <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={12} xl={12} display="flex" flexDirection="row" justifyContent="space-between">
                <Grid mt={0.5} xs={12} md={12} xl={9}>
                  <Grid mt={1} xs={12} md={12} xl={12} display="flex" gap={1}>
                    <Grid item xs={12} md={6} xl={4}>
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

                    <Grid item xs={12} md={6} xl={4} mt={-1} mb={1}>
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

                    <Grid item xs={12} md={6} xl={4} mt={-1} mb={1}>
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
                  </Grid>

                  <Grid mt={1} xs={12} md={12} xl={12} display="flex" gap={1}>
                    <Grid item xs={12} md={6} xl={4}>
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

                    <Grid item xs={12} md={6} xl={4}>
                      <CustomAutocomplete
                        id="country-select-demo"
                        sx={{
                          width: "100%",
                          '& .MuiAutocomplete-clearIndicator': {
                            color: 'dark',
                          },
                        }}
                        options={["6th", '7th', '8th', '9th', '10th', '11th', "12th"]}
                        value={gradeValue}
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
                            placeholder="Grade/Class"
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

                    <Grid item xs={12} md={6} xl={4}>
                      <TextField
                        disabled={((isSubmitted || quiz) && (!editing || saving))}
                        id="outlined-required"
                        label='Max Participants *'
                        name='maxParticipant'
                        fullWidth
                        defaultValue={editing ? formState?.maxParticipant : quiz?.maxParticipant}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>

                  <Grid mt={1.5} xs={12} md={12} xl={12} display="flex" gap={1}>
                    <Grid item xs={12} md={6} xl={4}>
                      <CustomAutocomplete
                        id="country-select-demo"
                        sx={{
                          width: "100%",
                          '& .MuiAutocomplete-clearIndicator': {
                            color: 'dark',
                          },
                        }}
                        options={cityData}
                        value={value}
                        onChange={handleCityChange}
                        autoHighlight
                        getOptionLabel={(option) => option ? option.name : 'City'}
                        renderOption={(props, option) => (
                          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            {option.name}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Choose a City"
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

                    <Grid item xs={12} md={6} xl={4}>
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

                    <Grid item xs={12} md={6} xl={4}>
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

                  <Grid mt={1.5} xs={12} md={12} xl={12} display="flex" gap={1}>
                    <Grid item xs={12} md={6} xl={4}>
                      <FormGroup>
                        <FormControlLabel
                          checked={formState?.openForAll}
                          disabled={isSubmitted}
                          control={<Checkbox />}
                          onChange={(e) => {
                            setFormState(prevState => ({
                              ...prevState,
                              openForAll: e.target.checked
                            }))
                          }}
                          label="Open For All" />
                      </FormGroup>
                    </Grid>

                    <Grid item xs={12} md={6} xl={4}>
                      <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={(quizData?.image?.url && !quizImage) ? "warning" : ((quizData?.image?.url && quizImage) || quizImage) ? "error" : "success"} component="label">
                        Upload Image(1080X720)
                        <input
                          hidden
                          // disabled={((quizData || quiz) && (!editing))}
                          accept="image/*"
                          type="file"
                          // onChange={(e)=>{setTitleImage(e.target.files)}}
                          onChange={(e) => {
                            setFormState(prevState => ({
                              ...prevState,
                              quizImage: e.target.files
                            }));
                            // setTitleImage(e.target.files);
                            handleImage(e);
                          }}
                        />
                      </MDButton>
                    </Grid>
                  </Grid>

                </Grid>

                <Grid  xs={12} md={12} xl={3} display="flex" justifyContent="flex-end">
                  <Grid container mb={2} spacing={2} xs={12} md={12} xl={12} display="flex" justifyContent='flex-start' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    {previewUrl ?

                      <Grid item xs={12} md={12} xl={3} style={{ maxWidth: '100%', height: 'auto' }}>
                        <Grid container xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                          <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                            <Card sx={{ minWidth: '100%', cursor: 'pointer' }}>
                              <CardActionArea>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                  <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                      <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{ textAlign: 'center' }}>
                                        Quiz Image
                                      </Typography>
                                    </MDBox>
                                  </CardContent>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                  <img src={previewUrl} style={{ maxWidth: '100%', height: 'auto', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
                                </Grid>
                              </CardActionArea>
                            </Card>
                          </Grid>
                        </Grid>
                      </Grid>
                      :
                      <Grid item xs={12} md={12} xl={3} style={{ maxWidth: '100%', height: 'auto' }}>
                        <Grid container xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                          <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                            <Card sx={{ minWidth: '100%', cursor: 'pointer' }}>
                              <CardActionArea>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                  <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                      <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{ textAlign: 'center' }}>
                                        Quiz Image
                                      </Typography>
                                    </MDBox>
                                  </CardContent>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                  <img src={quiz?.image} style={{width: "200px", height: "200px",  borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
                                </Grid>
                              </CardActionArea>
                            </Card>
                          </Grid>
                        </Grid>
                      </Grid>
                    }
                  </Grid>
                </Grid>

                <Grid xs={12} md={12} xl={12}>
                  <JoditEditor
                    ref={editor}
                    config={config}
                    value={formState.description}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        description: e
                      }))
                    }}
                    disabled={true}
                    style={{ height: "100%" }}
                  />
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
              
              {(quiz || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2}>
                <MDBox>
                <Rewards quiz={quiz!=undefined ? quiz?._id : quizData?._id}/>
                </MDBox>
              </Grid>}

              {(quiz || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2}>
                <MDBox>
                <Question quiz={quiz!=undefined ? quiz?._id : quizData?._id}/>
                </MDBox>
              </Grid>}
              
              {/* {(quiz || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                <MDBox>
                  <RegisteredUsers quizData={quiz?._id ? quiz : quizData} action={action} setAction={setAction} />
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