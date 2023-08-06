
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
import CreateRules from './rulesAndRewards/battleRules';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const CustomAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-clearIndicator {
    color: white;
  }
`;

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
  const battle = location?.state?.data;
  const [collegeSelectedOption, setCollegeSelectedOption] = useState();
  console.log('id hai', battle);
  // const [applicationCount, setApplicationCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [isLoading, setIsLoading] = useState(battle ? true : false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate();
  const [newObjectId, setNewObjectId] = useState("");
  const [updatedDocument, setUpdatedDocument] = useState([]);
  const [battles, setBattles] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [college, setCollege] = useState([]);
  const [action, setAction] = useState(false);

  const [formState, setFormState] = useState({
    battleName: '' || battle?.battleName,
    battleLiveTime: dayjs(battle?.battleLiveTime) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
    battleStartTime: dayjs(battle?.battleStartTime) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
    battleEndTime: dayjs(battle?.battleEndTime) ?? dayjs(new Date()).set('hour', 23).set('minute', 59).set('second', 59),
    battleStatus: '' || battle?.battleStatus,
    battleType: '' || battle?.battleType,
    battleFor: '' || battle?.battleFor,
    collegeCode: '' || battle?.collegeCode,
    minParticipants: '' || battle?.minParticipants,
    entryFee: '' || battle?.entryFee,
    description: '' || battle?.description,
    portfolio: {
      id: "" || battle?.portfolio?._id,
      name: "" || battle?.portfolio?.portfolioName
    },
    college: "" || battle?.college?._id,
    battleExpiry: "" || battle?.battleExpiry,
    isNifty:false || battle?.isNifty,
    isBankNifty: false || battle?.isBankNifty,
    isFinNifty: false || battle?.isFinNifty,

    registeredUsers: {
      userId: "",
      registeredOn: "",
      status: "",
      exitDate: "",
    },
  });

  useEffect(() => {
    setTimeout(() => {
      battle && setUpdatedDocument(battle)
      setIsLoading(false);
    }, 500)
  }, [])


  useEffect(() => {
    axios.get(`${baseUrl}api/v1/portfolio/battleportfolio`, {withCredentials: true})
      .then((res) => {
        console.log("Battle Portfolios :", res?.data?.data)
        setPortfolios(res?.data?.data);
      }).catch((err) => {
        return new Error(err)
      })

    axios.get(`${baseUrl}api/v1/college`,{withCredentials: true})
    .then((res) => {
      console.log("College Lists :", res?.data?.data)
      setCollege(res?.data?.data);
    }).catch((err) => {
      return new Error(err)
    })

    axios.get(`${baseUrl}api/v1/college/${battle?.college?._id}`,{withCredentials: true})
    .then((res) => {
      console.log("College :", res?.data?.data)
      setCollegeSelectedOption(res?.data?.data);
    }).catch((err) => {
      return new Error(err)
    })

  }, [])

  // console.log("College:", collegeSelectedOption)
  const handlePortfolioChange = (event) => {
    const {
      target: { value },
    } = event;
    let portfolioId = portfolios?.filter((elem) => {
      return elem.portfolioName === value;
    })
    setFormState(prevState => ({
      ...prevState,
      portfolio: {
        ...prevState.portfolio,
        id: portfolioId[0]?._id,
        name: portfolioId[0]?.portfolioName
      }
    }));
    // console.log("portfolioId", portfolioId, formState)
  };

  const handleCollegeChange = (event, newValue) => {
    console.log("College Selection:",newValue)
    setCollegeSelectedOption(newValue);
    setFormState(prevState => ({
      ...prevState,
      college: newValue?._id

    }))
    // setTraderId(newValue);
  };


  async function onSubmit(e, formState) {
    // console.log("inside submit")
    e.preventDefault();
    try{
      console.log(formState)
      if(formState.battleStartTime > formState.battleEndTime){
        return openErrorSB("Error", "Date range is not valid.")
      }
      if (!formState.battleName || !formState.battleLiveTime || !formState.battleStartTime || !formState.battleEndTime || !formState.battleStatus || !formState.battleType || !formState.portfolio.id || (!formState.isNifty && !formState.isBankNifty && !formState.isFinNifty) ) {
        setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
        return openErrorSB("Missing Field", "Please fill all the mandatory fields")
      }
  
      setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
      const { battleName, battleLiveTime, battleStartTime, battleEndTime, rewardType, battleStatus, minParticipants, entryFee, description, portfolio, battleType, battleFor, collegeCode, college, isNifty, isBankNifty, isFinNifty, battleExpiry } = formState;
      const res = await fetch(`${baseUrl}api/v1/battles/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          battleName, battleLiveTime, battleStartTime, rewardType, battleEndTime, battleStatus, minParticipants, entryFee, description, portfolio: portfolio?.id, battleType, battleFor, collegeCode, college, isNifty, isBankNifty, isFinNifty, battleExpiry
        })
      });
  
  
      const data = await res.json();
      console.log(data, res.status);
      if (res.status !== 201) {
        console.log('is submitted', isSubmitted);
        setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
        openErrorSB("Battle not created", data?.message)
      } else {
        openSuccessSB("Battle Created", data?.message)
        setNewObjectId(data?.data?._id)
        console.log('is submitted', isSubmitted);
        console.log("New Object Id: ", data?.data?._id, newObjectId)
        setIsSubmitted(true);
        setBattles(data?.data);
        setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
      }
    }catch(e){
      console.log(e);
      console.log('is submitted', isSubmitted, battle, editing);
      console.log('condition', ((isSubmitted || Boolean(battle)) && !editing) );
    }
  }

  async function onEdit(e, formState) {
    e.preventDefault()
    console.log("Edited FormState: ", new Date(formState.battleStartTime).toISOString(), new Date(formState.battleEndTime).toISOString())
    setSaving(true)
    console.log("formstate", formState)

    if(new Date(formState.battleStartTime).toISOString() > new Date(formState.battleEndTime).toISOString()){
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
      return openErrorSB("Error", "Date range is not valid.")
    }
    if (!formState.battleName || !formState.battleLiveTime || !formState.battleStartTime || !formState.battleEndTime || !formState.battleStatus || !formState.minParticipants || !formState.payoutPercentage || !formState.description || !formState.battleType || !formState.portfolio || !formState.battleFor || (!formState.isNifty && !formState.isBankNifty && !formState.isFinNifty) ) {
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }
    const { battleName, battleLiveTime, battleStartTime, battleEndTime, battleStatus, minParticipants, entryFee, description, portfolio, battleType, battleFor, collegeCode, college, isNifty, isBankNifty, isFinNifty, battleExpiry } = formState;

    const res = await fetch(`${baseUrl}api/v1/dailycontest/contest/${battle?._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        battleName, battleLiveTime, battleStartTime, battleEndTime, battleStatus, minParticipants, entryFee, description, portfolio: portfolio?.id, battleType, battleFor, collegeCode, college, isNifty, isBankNifty, isFinNifty, battleExpiry
      })
    });

    const data = await res.json();
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
                Fill Battle Details
              </MDTypography>
            </MDBox>

            <Grid container display="flex" flexDirection="row" justifyContent="space-between">
              <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>
                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                    disabled={((isSubmitted || battle) && (!editing || saving))}
                    id="outlined-required"
                    label='Battle Name *'
                    name='battleName'
                    fullWidth
                    defaultValue={editing ? formState?.battleName : battle?.battleName}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        battleName: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={-1} mb={1}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['MobileDateTimePicker']}>
                      <DemoItem>
                        <MobileDateTimePicker
                          label="Battle Live Time"
                          disabled={((isSubmitted || battle) && (!editing || saving))}
                          value={(formState?.battleLiveTime || battle?.battleLiveTime)}
                          onChange={(newValue) => {
                            if (newValue && newValue.isValid()) {
                              setFormState(prevState => ({ ...prevState, battleLiveTime: newValue }))
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
                          label="Battle Start Time"
                          disabled={((isSubmitted || battle) && (!editing || saving))}
                          value={(formState?.battleStartTime || battle?.battleStartTime)}
                          onChange={(newValue) => {
                            if (newValue && newValue.isValid()) {
                              setFormState(prevState => ({ ...prevState, battleStartTime: newValue }))
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
                          label="Battle End Time"
                          disabled={((isSubmitted || battle) && (!editing || saving))}
                          value={(formState?.battleEndTime || battle?.battleEndTime)}
                          onChange={(newValue) => {
                            if (newValue && newValue.isValid()) {
                              setFormState(prevState => ({ ...prevState, battleEndTime: newValue }))
                            }
                          }}
                          minDateTime={null}
                          sx={{ width: '100%' }}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={3} xl={3}>
                  <FormControl sx={{ minHeight: 10, minWidth: 263 }}>
                    <InputLabel id="demo-multiple-name-label">Battle For</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      name='battleFor'
                      disabled={((isSubmitted || battle) && (!editing || saving))}
                      // defaultValue={id ? portfolios?.portfolio : ''}
                      value={formState?.battleFor}
                      // onChange={handleTypeChange}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          battleFor: e.target.value
                        }))
                      }}
                      input={<OutlinedInput label="Battle For" />}
                      sx={{ minHeight: 45 }}
                      MenuProps={MenuProps}
                    >
                      <MenuItem
                        value='StoxHero'
                      >
                        StoxHero
                      </MenuItem>
                      <MenuItem
                        value='College'
                      >
                        College
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {(formState?.battleFor === "College" || battle?.battleFor === "College") &&
                  <>
                    <Grid item xs={12} md={3} xl={6}>
                      <CustomAutocomplete
                        id="country-select-demo"
                        sx={{
                          width: 526,
                          height: 10,
                          '& .MuiAutocomplete-clearIndicator': {
                            color: 'black',
                          },
                        }}
                        options={college}
                        disabled={((isSubmitted || battle) && (!editing || saving))}
                        value={collegeSelectedOption}
                        onChange={handleCollegeChange}
                        autoHighlight
                        getOptionLabel={(option) => option.collegeName + ' - ' + option.zone}
                        renderOption={(props, option) => (
                          <MDBox component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            {option.collegeName + ' - ' + option.zone}
                          </MDBox>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="College"
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: 'new-password', // disable autocomplete and autofill
                              style: { color: 'grey', height: 11 }, // set text color to white
                            }}
                            InputLabelProps={{
                              style: { color: 'grey' },
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} xl={3}>
                      <TextField
                        disabled={((isSubmitted || battle) && (!editing || saving))}
                        id="outlined-required"
                        label='College Code *'
                        name='collegeCode'
                        fullWidth
                        defaultValue={editing ? formState?.collegeCode : battle?.collegeCode}
                        onChange={handleChange}
                      />
                    </Grid>
                  </>
                }

                {!battle && 
                <Grid item xs={12} md={3} xl={3}>
                  <FormControl sx={{ minHeight: 10, minWidth: 263 }}>
                    <InputLabel id="demo-multiple-name-label">Battle Type</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      name='battleType'
                      disabled={((isSubmitted || battle) && (!editing || saving))}
                      // defaultValue={id ? portfolios?.portfolio : ''}
                      value={formState?.battleType}
                      // onChange={handleTypeChange}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          battleType: e.target.value
                        }))
                      }}
                      input={<OutlinedInput label="Battle Type" />}
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
                    disabled={((isSubmitted || battle) && (!editing || saving))}
                    id="outlined-required"
                    label='Min Participants *'
                    name='minParticipants'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.minParticipants : battle?.minParticipants}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        minParticipants: parseInt(e.target.value, 10)
                      }))
                    }}
                  />
                </Grid>


                <Grid item xs={12} md={6} xl={3} mb={2}>
                  <TextField
                    disabled={((isSubmitted || battle) && (!editing || saving))}
                    id="outlined-required"
                    label='Entry Fee *'
                    name='entryFee'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.entryFee : battle?.entryFee}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        entryFee: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={12} mt={-2}>
                  <TextField
                    disabled={((isSubmitted || battle) && (!editing || saving))}
                    id="outlined-required"
                    label='Description *'
                    name='description'
                    fullWidth
                    defaultValue={editing ? formState?.description : battle?.description}
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
                      disabled={((isSubmitted || battle) && (!editing || saving))}
                      value={formState?.portfolio?.name?.portfolio?.portfolioName || battle?.portfolio?.portfolioName}
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
                    <InputLabel id="demo-simple-select-autowidth-label">Reward Type *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='rewardType'
                      value={formState?.rewardType || battle?.rewardType}
                      disabled={((isSubmitted || battle) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          rewardType: e.target.value
                        }))
                      }}
                      label="Reward Type"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="Gift">Gift</MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Battle Status *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='battleStatus'
                      value={formState?.battleStatus || battle?.battleStatus}
                      disabled={((isSubmitted || battle) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          battleStatus: e.target.value
                        }))
                      }}
                      label="Battle Status"
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
                    <InputLabel id="demo-simple-select-autowidth-label">Battle Expiry *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='battleExpiry'
                      value={formState?.battleExpiry || battle?.battleExpiry}
                      disabled={((isSubmitted || battle) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          battleExpiry: e.target.value
                        }))
                      }}
                      label="Battle Expiry"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="Day">Day</MenuItem>
                      <MenuItem value="Weekly">Weekly</MenuItem>
                      <MenuItem value="Monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  {/* <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Is Battle on Nifty ? *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='isNifty'
                      value={(battle?.isNifty !== undefined && !editing && formState?.isNifty === undefined) ? battle?.isNifty : formState?.isNifty}
                      disabled={((isSubmitted || battle) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          isNifty: e.target.value
                        }))
                      }}
                      label="Is Nifty"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value={true}>TRUE</MenuItem>
                      <MenuItem value={false}>FALSE</MenuItem>
                    </Select>
                  </FormControl> */}
                  <FormGroup>
                    <FormControlLabel  
                      checked={(battle?.isNifty !== undefined && !editing && formState?.isNifty === undefined) ? battle?.isNifty : formState?.isNifty}
                      disabled={((isSubmitted || battle) && (!editing || saving))}
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
                  {/* <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Is Battle on BankNifty ? *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='isBankNifty'
                      value={(battle?.isBankNifty !== undefined && !editing && formState?.isBankNifty === undefined) ? battle?.isBankNifty : formState?.isBankNifty}
                      disabled={((isSubmitted || battle) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          isBankNifty: e.target.value
                        }))
                      }}
                      label="Is BankNifty"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value={true}>TRUE</MenuItem>
                      <MenuItem value={false}>FALSE</MenuItem>
                    </Select>
                  </FormControl> */}
                  <FormGroup>
                  <FormControlLabel 
                    checked={(battle?.isBankNifty !== undefined && !editing && formState?.isBankNifty === undefined) ? battle?.isBankNifty : formState?.isBankNifty}
                    disabled={((isSubmitted || battle) && (!editing || saving))}
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
                      checked={(battle?.isFinNifty !== undefined && !editing && formState?.isFinNifty === undefined) ? battle?.isFinNifty : formState?.isFinNifty}
                      disabled={((isSubmitted || battle) && (!editing || saving))}
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
                {!isSubmitted && !Boolean(battle) && (
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
                {((isSubmitted || Boolean(battle)) && !editing) && (
                  <>
                  {battle?.battleStatus !== "Completed" &&
                    <MDButton variant="contained" color="warning" size="small" sx={{ mr: 1, ml: 2 }} onClick={() => { setEditing(true) }}>
                      Edit
                    </MDButton>}
                    <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/battledashboard') }}>
                      Back
                    </MDButton>
                  </>
                )}
                {((isSubmitted || Boolean(battle)) && editing) && (
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

            {isSubmitted && <CreateRules />}
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