
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
  const school = location?.state?.data;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(school ? true : false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate();
  const [newObjectId, setNewObjectId] = useState("");
  const [updatedDocument, setUpdatedDocument] = useState([]);
  const [schoolData, setSchoolData] = useState([]);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [logo, setLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState('');
  const [userState, setUserState] = useState('');

  const [cityData, setCityData] = useState([]);
  const [gradeData, setGradeData] = useState([]);


  const [formState, setFormState] = useState({
    name: '' || school?.name,
    principalName: '' || school?.principalName,
    address: '' || school?.address,
    status: '' || school?.status,
    email: "" || school?.email,
    affiliation: false || school?.affiliation,
    affiliationNumber: "" || school?.affiliationNumber,
    website: "" || school?.website,
    mobile: "" || school?.mobile,
    image: "" || school?.image,
    logo: "" || school?.logo,
  });

  useEffect(() => {
    setTimeout(() => {
      school && setUpdatedDocument(school)
      setIsLoading(false);
    }, 500)
  }, [])

  
  const [gradeValue, setGradeValue] = useState({
    _id: "" || school?.highestGrade?._id,
    grade: "" || school?.highestGrade?.grade
  });

  const [value, setValue] = useState({
    _id: school?.city?._id || '',
    name: school?.city?.name || ""
  })

  const getGrade = async () => {
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
    getGrade();
  }, [])

  const getCities = async () => {
    try {
      const res = await axios.get(`${apiUrl}cities/bystate/${userState}`);
      if (res.data.status == 'success') {
        setCityData(res.data.data);
      }
    } catch (e) {
      console.log(e);
    }

  }

  useEffect(() => {
    getCities();
  }, [userState])

  const handleImage = (event) => {
    const file = event.target.files[0];
    setImage(event.target.files);
    // Create a FileReader instance
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogo = (event) => {
    const file = event.target.files[0];
    setLogo(event.target.files);
    // Create a FileReader instance
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  async function onSubmit(e, formState) {
    e.preventDefault()
  

    if (!formState.name || !formState.email) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }

    setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)

    const formData = new FormData();
    if (image) {
      formData.append("image", image[0]);
    }

    if (logo) {
      formData.append("logo", logo[0]);
    }

    for (let elem in formState) {
      formData.append(`${elem}`, formState[elem]);
    }

    if (gradeValue) {
      formData.append(`highestGrade`, gradeValue?._id);
    }

    if (userState) {
      formData.append(`state`, userState);
    }

    if (value?._id) {
      formData.append(`city`, value?._id);
    }

    // const {grade, title, startDateTime, registrationOpenDateTime, durationInSeconds, rewardType, status } = formState;
    const res = await fetch(`${apiUrl}school`, {
      method: "POST",
      credentials: "include",
      body: formData
    });


    const data = await res.json();
    if (res.status !== 201) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      openErrorSB("School not created", data?.message)
    } else {
      openSuccessSB("School Created", data?.message)
      setNewObjectId(data?.data?._id)
      setIsSubmitted(true)
      setSchoolData(data?.data);
      setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    }
  }

  async function onEdit(e, formState) {
    e.preventDefault()
    setSaving(true)

    if (!formState.name || !formState.email) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }


    const formData = new FormData();
    if (image) {
      formData.append("image", image[0]);
    }

    if (logo) {
      formData.append("logo", logo[0]);
    }

    for (let elem in formState) {
      formData.append(`${elem}`, formState[elem]);
    }

    if (gradeValue) {
      formData.append(`highestGrade`, gradeValue?._id);
    }

    if (userState) {
      formData.append(`state`, userState);
    }

    if (value?._id) {
      formData.append(`city`, value?._id);
    }
    const res = await fetch(`${apiUrl}school/${school?._id}`, {
      method: "PATCH",
      credentials: "include",
      body: formData
    });

    const data = await res.json();

    if (data.status === 500 || data.status == 400 || data.status == 401 || data.status == 'error' || data.error || !data) {
      openErrorSB("Error", data.error)
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
    } else if (data.status == 'success') {
      openSuccessSB("School Edited", "Edited Successfully")
      setTimeout(() => { setSaving(false); setEditing(false) }, 500)
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
      setFormState(prevState => ({
        ...prevState,
        [name]: value,
      }));
  };

  const handleCityChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleGradeChange = (event, newValue) => {
    setGradeValue(newValue);
  };

  const handleStateChange = (event, newValue) => {
    setUserState(newValue);
    setCityData([]);
    setValue({id:'',name:''});
  }

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
                Fill School Details
              </MDTypography>
            </MDBox>

            <Grid container spacing={1} mt={1} xs={12} md={12} xl={12} display="flex" flexDirection="row" justifyContent="center">
                <Grid item xs={12} md={12} xl={9} display="flex">
                  <Grid container spacing={2} xs={12} md={12} xl={12} display="flex" flexDirection="row" justifyContent="center">
                      <Grid item xs={12} md={6} xl={12}>
                        <TextField
                          disabled={((isSubmitted || school) && (!editing || saving))}
                          id="outlined-required"
                          label='School Name *'
                          name='name'
                          fullWidth
                          defaultValue={editing ? formState?.name : school?.name}
                          onChange={(e) => {
                            setFormState(prevState => ({
                              ...prevState,
                              name: e.target.value
                            }))
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} xl={4}>
                        <TextField
                          disabled={((isSubmitted || school) && (!editing || saving))}
                          id="outlined-required"
                          label='Email *'
                          name='email'
                          type='text'
                          fullWidth
                          defaultValue={editing ? formState?.email : school?.email}
                          onChange={handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} xl={4}>
                        <TextField
                          disabled={((isSubmitted || school) && (!editing || saving))}
                          id="outlined-required"
                          label='Principal Name *'
                          name='principalName'
                          fullWidth
                          type='text'
                          defaultValue={editing ? formState?.principalName : school?.principalName}
                          onChange={handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} xl={4}>
                        <TextField
                          disabled={((isSubmitted || school) && (!editing || saving))}
                          id="outlined-required"
                          label='Address *'
                          name='address'
                          type='text'
                          fullWidth
                          defaultValue={editing ? formState?.address : school?.address}
                          onChange={handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} xl={4}>
                        <TextField
                          disabled={((isSubmitted || school) && (!editing || saving))}
                          id="outlined-required"
                          label='Website *'
                          name='website'
                          type='text'
                          fullWidth
                          defaultValue={editing ? formState?.website : school?.website}
                          onChange={handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} xl={4}>
                        <FormControl sx={{ width: "100%" }}>
                          <InputLabel id="demo-simple-select-autowidth-label">Affiliation *</InputLabel>
                          <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            name='affiliation'
                            value={formState?.affiliation || school?.affiliation}
                            disabled={((isSubmitted || school) && (!editing || saving))}
                            onChange={(e) => {
                              setFormState(prevState => ({
                                ...prevState,
                                affiliation: e.target.value
                              }))
                            }}
                            label="Reward Type"
                            sx={{ minHeight: 43 }}
                          >
                            <MenuItem value="State Board">State Board</MenuItem>
                            <MenuItem value="CBSE">CBSE</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6} xl={4}>
                        <TextField
                          disabled={((isSubmitted || school) && (!editing || saving))}
                          id="outlined-required"
                          label='Affiliation Number *'
                          name='affiliationNumber'
                          type='text'
                          fullWidth
                          defaultValue={editing ? formState?.affiliationNumber : school?.affiliationNumber}
                          onChange={handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} xl={4}>
                        <TextField
                          disabled={((isSubmitted || school) && (!editing || saving))}
                          id="outlined-required"
                          label='Mobile *'
                          name='mobile'
                          type='text'
                          fullWidth
                          defaultValue={editing ? formState?.mobile : school?.mobile}
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
                          options={gradeData}
                          value={gradeValue}
                          disabled={((isSubmitted || school) && (!editing || saving))}
                          onChange={handleGradeChange}
                          autoHighlight
                          getOptionLabel={(option) => option ? option?.grade : 'Grade'}
                          renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                              {option?.grade}
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Grade/Class"
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

                      <Grid item xs={12} md={12} lg={4}>
                        <CustomAutocomplete
                          id="country-select-demo"
                          sx={{
                            width: "100%",
                            '& .MuiAutocomplete-clearIndicator': {
                              color: 'dark',
                            },
                          }}
                          options={['Andaman & Nicobar', 'Andhra Pradesh', 'Arunachal Pradesh', "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi",
                            "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh",
                            "Lakshadeep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Pondicherry",
                            "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"]}
                          value={userState}
                          disabled={((isSubmitted || school) && (!editing || saving))}
                          onChange={handleStateChange}
                          autoHighlight
                          getOptionLabel={(option) => option ? option : ''}
                          renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                              {option}
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search your state"
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
                        <CustomAutocomplete
                          id="country-select-demo"
                          sx={{
                            width: "100%",
                            '& .MuiAutocomplete-clearIndicator': {
                              color: 'dark',
                            },
                          }}
                          options={cityData}
                          disabled={((isSubmitted || school) && (!editing || saving))}
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
                              label="Choose a City"
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
                          <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                          <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            name='status'
                            value={formState?.status || school?.status}
                            disabled={((isSubmitted || school) && (!editing || saving))}
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

                      <Grid item xs={12} md={6} xl={4}>
                      <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={(schoolData?.image?.url && !image) ? "warning" : ((schoolData?.image?.url && image) || image) ? "error" : "success"} component="label">
                        Upload Image(512X256)
                        <input
                          hidden
                          // disabled={((schoolData || school) && (!editing))}
                          accept="image/*"
                          type="file"
                          // onChange={(e)=>{setTitleImage(e.target.files)}}
                          onChange={(e) => {
                            setFormState(prevState => ({
                              ...prevState,
                              image: e.target.files
                            }));
                            // setTitleImage(e.target.files);
                            handleImage(e);
                          }}
                        />
                      </MDButton>
                      </Grid>

                      <Grid item xs={12} md={6} xl={4}>
                      <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={(schoolData?.image?.url && !image) ? "warning" : ((schoolData?.image?.url && image) || image) ? "error" : "success"} component="label">
                        Upload logo
                        <input
                          hidden
                          // disabled={((schoolData || school) && (!editing))}
                          accept="image/*"
                          type="file"
                          // onChange={(e)=>{setTitleImage(e.target.files)}}
                          onChange={(e) => {
                            setFormState(prevState => ({
                              ...prevState,
                              logo: e.target.files
                            }));
                            // setTitleImage(e.target.files);
                            handleLogo(e);
                          }}
                        />
                      </MDButton>
                      </Grid>

                  </Grid>
                </Grid>

                <Grid mt={0} item xs={12} md={12} xl={3} display="flex" flexDirection={'column'} justifyContent="center">
                  <Grid container spacing={1} xs={12} md={12} xl={12} display="flex" justifyContent="center">
                    {previewImage ?
                      <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                        <Grid container xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                          <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                            <Card sx={{ minWidth: '100%', cursor: 'pointer' }}>
                              <CardActionArea>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                  <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                      <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{ textAlign: 'center' }}>
                                        School Image!
                                      </Typography>
                                    </MDBox>
                                  </CardContent>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                  <img src={previewImage} style={{ width: "100%", height: "auto", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
                                </Grid>
                              </CardActionArea>
                            </Card>
                          </Grid>
                        </Grid>
                      </Grid>
                      :
                      <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                        <Grid container xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                          <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                            <Card sx={{ minWidth: '100%', cursor: 'pointer' }}>
                              <CardActionArea>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                  <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                      <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{ textAlign: 'center' }}>
                                        Banner Image!
                                      </Typography>
                                    </MDBox>
                                  </CardContent>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                  <img src={school?.image} style={{ width: "100%", height: "auto", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
                                </Grid>
                              </CardActionArea>
                            </Card>
                          </Grid>
                        </Grid>
                      </Grid>
                    }
                    
                  </Grid>

                  <Grid container spacing={1} xs={12} md={12} xl={12} display="flex" justifyContent="center">
                    {previewLogo ?
                      <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                        <Grid container xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                          <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                            <Card sx={{ minWidth: '100%', cursor: 'pointer' }}>
                              <CardActionArea>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                  <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                      <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{ textAlign: 'center' }}>
                                        Logo
                                      </Typography>
                                    </MDBox>
                                  </CardContent>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                  <img src={previewLogo} style={{ width: "100%", height: "auto", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
                                </Grid>
                              </CardActionArea>
                            </Card>
                          </Grid>
                        </Grid>
                      </Grid>
                      :
                      <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                        <Grid container xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                          <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                            <Card sx={{ minWidth: '100%', cursor: 'pointer' }}>
                              <CardActionArea>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                  <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                      <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{ textAlign: 'center' }}>
                                        Logo
                                      </Typography>
                                    </MDBox>
                                  </CardContent>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                  <img src={school?.logo} style={{ width: "100%", height: "auto", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
                                </Grid>
                              </CardActionArea>
                            </Card>
                          </Grid>
                        </Grid>
                      </Grid>
                    }

                  </Grid>
                </Grid>

               

                <Grid mt={2} item xs={12} md={12} xl={12} display="flex" justifyContent="flex-end" style={{minWidth:'100%'}}>
                  {!isSubmitted && !school && (
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
                      <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/school") }}>
                        Cancel
                      </MDButton>
                    </>
                  )}
                  {(isSubmitted || school) && !editing && (
                    <>
                      {school?.contestStatus !== "Completed" &&
                        <MDButton variant="contained" color="warning" size="small" sx={{ mr: 1, ml: 2 }} onClick={() => { setEditing(true) }}>
                          Edit
                        </MDButton>}
                      <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/school') }}>
                        Back
                      </MDButton>
                    </>
                  )}
                  {(isSubmitted || school) && editing && (
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