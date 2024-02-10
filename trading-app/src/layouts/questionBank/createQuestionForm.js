
import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import TextField from '@mui/material/TextField';
import { Grid, Card, CardContent, CardActionArea, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
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
import { apiUrl } from '../../constants/constants';
import Option from "./data/option/options";
import { Autocomplete, Box } from "@mui/material";
import { styled } from '@mui/material';
import axios from 'axios';
import RegisteredUser from "./data/registeredUsers";

const CustomAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-clearIndicator {
    color: white;
  }
`;


function Index() {
  const location = useLocation();
  const queBank = location?.state?.data;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(queBank ? true : false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate();
  const [newObjectId, setNewObjectId] = useState("");
  const [updatedDocument, setUpdatedDocument] = useState([]);
  const [queBankData, setQueBankData] = useState([]);
  const [queImage, setQuizImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [formState, setFormState] = useState({
    title: '' || queBank?.title,
    type: '' || queBank?.type,
    image: '' || queBank?.image,
    status: '' || queBank?.status,
    score: "" || queBank?.score,
    difficultyLevel: "" || queBank?.difficultyLevel,
    topic: "" || queBank?.topic,
    isMain: false || queBank?.isMain,
    isPractice: false || queBank?.isPractice
  });

  useEffect(() => {
    setTimeout(() => {
      queBank && setUpdatedDocument(queBank)
      setIsLoading(false);
    }, 500)
  }, [])

  const [gradeData, setGradeData] = useState([]);
  // const [gradeValue, setGradeValue] = useState(queBank?.grade || '6th');
  const [gradeValue, setGradeValue] = useState({
    _id: queBank?.grade?._id || '',
    grade: queBank?.grade?.grade || ""
  })

  const getGrades = async () => {
    try {
      const res = await axios.get(`${apiUrl}grades`);
      if (res.data.status == 'success') {
        setGradeData(res.data.data);
      }
    } catch (e) {
      console.log(e);
    }

  }
  useEffect(() => {
    getGrades();
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

    if (!queImage) {
      openErrorSB('error', 'Please select a file to upload');
      return;
    }

    if (!formState.title || !formState.type || !formState.score || !formState.topic || !formState.difficultyLevel || !formState.status) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }

    setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)

    const formData = new FormData();
    if (queImage) {
      formData.append("questionImage", queImage[0]);
    }

    for (let elem in formState) {
      formData.append(`${elem}`, formState[elem]);
    }

    console.log("gradeValue", gradeValue?._id)
    if (gradeValue?._id) {
      formData.append(`grade`, gradeValue?._id);
    }

    // const {grade, title, startDateTime, registrationOpenDateTime, durationInSeconds, rewardType, status } = formState;
    const res = await fetch(`${apiUrl}questionbank`, {
      method: "POST",
      credentials: "include",
      body: formData
    });


    const data = await res.json();
    if (res.status !== 201) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      openErrorSB("Bank not created", data?.message)
    } else {
      openSuccessSB("Bank Created", data?.message)
      setNewObjectId(data?.data?._id)
      setIsSubmitted(true)
      setQueBankData(data?.data);
      setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    }
  }

  async function onEdit(e, formState) {
    e.preventDefault()
    setSaving(true)

    console.log(formState)
    if (!formState.title || !formState.type || !formState.score || !formState.topic || !formState.difficultyLevel || !formState.status) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }

    setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)

    const formData = new FormData();
    if (queImage) {
      formData.append("questionImage", queImage[0]);
    }

    for (let elem in formState) {
      formData.append(`${elem}`, formState[elem]);
    }

    if (gradeValue?._id) {
      formData.append(`grade`, gradeValue?._id);
    }

    const res = await fetch(`${apiUrl}queBank/${queBank?._id}`, {
      method: "PATCH",
      credentials: "include",
      body: formData
    });

    const data = await res.json();

    if (data.status === 500 || data.status == 400 || data.status == 401 || data.status == 'error' || data.error || !data) {
      openErrorSB("Error", data.error)
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
    } else if (data.status == 'success') {
      openSuccessSB("Quiz Edited", "Edited Successfully")
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

  const handleGradeChange = (event, newValue) => {
    console.log(newValue)
    setGradeValue(newValue);
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
              <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={12} xl={12} display="flex" flexDirection="row" justifyContent="space-between">
                <Grid mt={0.5} xs={12} md={12} xl={9}>
                  <Grid mt={1} xs={12} md={12} xl={12} display="flex" gap={1}>
                    <Grid item xs={12} md={6} xl={4}>
                      <TextField
                        disabled={((isSubmitted || queBank) && (!editing || saving))}
                        id="outlined-required"
                        label='Title *'
                        name='title'
                        fullWidth
                        defaultValue={editing ? formState?.title : queBank?.title}
                        onChange={(e) => {
                          setFormState(prevState => ({
                            ...prevState,
                            title: e.target.value
                          }))
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} xl={4}>
                      <TextField
                        disabled={((isSubmitted || queBank) && (!editing || saving))}
                        id="outlined-required"
                        label='Score *'
                        name='score'
                        fullWidth
                        type='number'
                        defaultValue={editing ? formState?.score : queBank?.score}
                        onChange={(e) => {
                          setFormState(prevState => ({
                            ...prevState,
                            score: e.target.value
                          }))
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} xl={4}>
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Type *</InputLabel>
                        <Select
                          labelId="demo-simple-select-autowidth-label"
                          id="demo-simple-select-autowidth"
                          name='type'
                          value={formState?.type || queBank?.type}
                          disabled={((isSubmitted || queBank) && (!editing || saving))}
                          onChange={(e) => {
                            setFormState(prevState => ({
                              ...prevState,
                              type: e.target.value
                            }))
                          }}
                          label="Type"
                          sx={{ minHeight: 43 }}
                        >
                          <MenuItem value="Single Correct">Single Correct</MenuItem>
                          <MenuItem value="Multiple Correct">Multiple Correct</MenuItem>
                          <MenuItem value="Image Single Correct">Image Single Correct</MenuItem>
                          <MenuItem value="Image Multiple Correct">Image Multiple Correct</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid mt={1} xs={12} md={12} xl={12} display="flex" gap={1}>

                    <Grid item xs={12} md={6} xl={4}>
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Difficulty Level *</InputLabel>
                        <Select
                          labelId="demo-simple-select-autowidth-label"
                          id="demo-simple-select-autowidth"
                          name='difficultyLevel'
                          value={formState?.difficultyLevel || queBank?.difficultyLevel}
                          disabled={((isSubmitted || queBank) && (!editing || saving))}
                          onChange={(e) => {
                            setFormState(prevState => ({
                              ...prevState,
                              difficultyLevel: e.target.value
                            }))
                          }}
                          label="Difficulty Level"
                          sx={{ minHeight: 43 }}
                        >
                          <MenuItem value="Easy">Easy</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="Difficult">Difficult</MenuItem>
                        </Select>
                      </FormControl>
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
                        options={gradeData}
                        value={gradeValue}
                        disabled={((isSubmitted || queBank) && (!editing || saving))}
                        onChange={handleGradeChange}
                        autoHighlight
                        getOptionLabel={(option) => option ? option.grade : 'Grade'}
                        renderOption={(props, option) => (
                          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            {option.grade}
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
                        disabled={((isSubmitted || queBank) && (!editing || saving))}
                        id="outlined-required"
                        label='Topic *'
                        name='topic'
                        type='text'
                        fullWidth
                        defaultValue={editing ? formState?.topic : queBank?.topic}
                        onChange={(e) => {
                          setFormState(prevState => ({
                            ...prevState,
                            topic: e.target.value
                          }))
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid mt={1.5} xs={12} md={12} xl={12} display="flex" gap={1}>
                    <Grid item xs={12} md={6} xl={4}>
                      <FormGroup>
                        <FormControlLabel
                          checked={formState?.isMain}
                          disabled={isSubmitted}
                          control={<Checkbox />}
                          onChange={(e) => {
                            setFormState(prevState => ({
                              ...prevState,
                              isMain: e.target.checked
                            }))
                          }}
                          label="Main" />
                      </FormGroup>
                    </Grid>

                    <Grid item xs={12} md={6} xl={4}>
                      <FormGroup>
                        <FormControlLabel
                          checked={formState?.isPractice}
                          disabled={isSubmitted}
                          control={<Checkbox />}
                          onChange={(e) => {
                            setFormState(prevState => ({
                              ...prevState,
                              isPractice: e.target.checked
                            }))
                          }}
                          label="Practice" />
                      </FormGroup>
                    </Grid>

                    <Grid item xs={12} md={6} xl={4}>
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                        <Select
                          labelId="demo-simple-select-autowidth-label"
                          id="demo-simple-select-autowidth"
                          name='status'
                          value={formState?.status || queBank?.status}
                          disabled={((isSubmitted || queBank) && (!editing || saving))}
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
                      <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={(queBankData?.image?.url && !queImage) ? "warning" : ((queBankData?.image?.url && queImage) || queImage) ? "error" : "success"} component="label">
                        Upload Image(1080X720)
                        <input
                          hidden
                          // disabled={((queBankData || queBank) && (!editing))}
                          accept="image/*"
                          type="file"
                          // onChange={(e)=>{setTitleImage(e.target.files)}}
                          onChange={(e) => {
                            setFormState(prevState => ({
                              ...prevState,
                              queImage: e.target.files
                            }));
                            // setTitleImage(e.target.files);
                            handleImage(e);
                          }}
                        />
                      </MDButton>
                    </Grid>
                  </Grid>

                </Grid>

                <Grid xs={12} md={12} xl={3} display="flex" justifyContent="flex-end">
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
                                  <img src={previewUrl} style={{ width: "200px", height: "200px", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
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
                                  <img src={queBank?.image} style={{ width: "200px", height: "200px", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
                                </Grid>
                              </CardActionArea>
                            </Card>
                          </Grid>
                        </Grid>
                      </Grid>
                    }
                  </Grid>
                </Grid>

              </Grid>
            </Grid>


            <Grid container mt={2} xs={12} md={12} xl={12} >
              <Grid item display="flex" justifyContent="flex-end" xs={12} md={6} xl={12}>
                {!isSubmitted && !queBank && (
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
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/questionbank") }}>
                      Cancel
                    </MDButton>
                  </>
                )}
                {(isSubmitted || queBank) && !editing && (
                  <>
                    {queBank?.contestStatus !== "Completed" &&
                      <MDButton variant="contained" color="warning" size="small" sx={{ mr: 1, ml: 2 }} onClick={() => { setEditing(true) }}>
                        Edit
                      </MDButton>}
                    <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/questionbank') }}>
                      Back
                    </MDButton>
                  </>
                )}
                {(isSubmitted || queBank) && editing && (
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

              {(queBank || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2}>
                <MDBox>
                  <Option question={queBank != undefined ? queBank?._id : queBankData?._id} />
                </MDBox>
              </Grid>}

              {(queBank || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                <MDBox>
                  <RegisteredUser data={queBank?._id ? queBank?.registrations : queBankData?.registrations} />
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