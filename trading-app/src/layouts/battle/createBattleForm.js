
import * as React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
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
import OutlinedInput from '@mui/material/OutlinedInput';
import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { apiUrl } from '../../constants/constants';
import RegisteredUsers from './data/registeredUsers';
import PotentialUsers from './data/potentialUsers'
import Shared from './data/shared'


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
  const battle = location?.state?.data;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(battle ? true : false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newObjectId, setNewObjectId] = useState("");
  const navigate = useNavigate();
  const [battleTemplates, setBattleTemplates] = useState([]);
  const [createdBattle, setCreatedBattle] = useState();
  const [action, setAction] = useState(false);
  console.log("battle:",battle)
  
  const [formState, setFormState] = useState({
    battleName: '' || battle?.battleName,
    battleLiveTime: dayjs(battle?.battleLiveTime) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
    battleStartTime: dayjs(battle?.battleStartTime) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
    battleEndTime: dayjs(battle?.battleEndTime) ?? dayjs(new Date()).set('hour', 23).set('minute', 59).set('second', 59),
    status: '' || battle?.status,
    battleTemplate: {
      id: "" || battle?.battleTemplate?._id,
      name: "" || battle?.battleTemplate?.templateName,
      entryFee: "" || battle?.battleTemplate?.entryFee,
      portfolioValue: "" || battle?.battleTemplate?.portfolioValue,
      minParticipants: "" || battle?.battleTemplate?.minParticipants,
      winnerPercentage: "" || battle?.battleTemplate?.winnerPercentage,
      battleType: "" || battle?.battleTemplate?.battleType,
      battleTemplateType: "" || battle?.battleTemplate?.battleTemplateType,
      gstPercentage: "" || battle?.battleTemplate?.gstPercentage,
      topWinners: "" || battle?.battleTemplate?.rankingPayout?.length,
    },
    isNifty:false || battle?.isNifty,
    isBankNifty: false || battle?.isBankNifty,
    isFinNifty: false || battle?.isFinNifty,

  });

  console.log("formState", formState)
  useEffect(() => {
    setTimeout(() => {
      // marginx && setUpdatedDocument(marginx)
      setIsLoading(false);
    }, 500)
  }, [saving,creating,editing])


  useEffect(() => {
    axios.get(`${apiUrl}battletemplates/active`, {withCredentials: true})
      .then((res) => {
        setBattleTemplates(res?.data?.data);
        console.log("Battle Template:",res?.data?.data)
      }).catch((err) => {
        return new Error(err)
      })

  }, [])

  const handleTemplateChange = (event) => {
    const {
      target: { value },
    } = event;
    let battleTemplate = battleTemplates?.filter((elem) => {
      return elem.battleTemplateName === value;
    })
    let entryFee = 0;
    setFormState(prevState => ({
      ...prevState,
      battleTemplate: {
        ...prevState.battleTemplate,
        id: battleTemplate[0]?._id,
        name: battleTemplate[0]?.battleTemplateName,
        entryFee: battleTemplate[0]?.entryFee,
        portfolioValue: battleTemplate[0]?.portfolioValue,
        minParticipants: battleTemplate[0]?.minParticipants,
        winnerPercentage: battleTemplate[0]?.winnerPercentage,
        battleType: battleTemplate[0]?.battleType,
        battleTemplateType: battleTemplate[0]?.battleTemplateType,
        gstPercentage: battleTemplate[0]?.gstPercentage,
        topWinners: battleTemplate[0]?.rankingPayout?.length,
      }
    }));
  };

  async function onSubmit(e, formState) {
    // console.log("inside submit")
    e.preventDefault();
    try{
      console.log(formState, battleTemplates)
      if(formState.battleStartTime > formState.battleEndTime){
        return openErrorSB("Error", "Date range is not valid.")
      }
      if (!formState.battleName || !formState.battleLiveTime || !formState.battleStartTime || !formState.battleEndTime || !formState.status || (!formState.isNifty && !formState.isBankNifty && !formState.isFinNifty) ) {
        setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
        return openErrorSB("Missing Field", "Please fill all the mandatory fields")
      }

      setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
      const { battleName ,battleLiveTime ,battleStartTime ,battleEndTime ,status, isNifty, isBankNifty, isFinNifty, battleTemplate } = formState;
      const res = await fetch(`${apiUrl}battles/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          battleTemplate: battleTemplate?.id, battleName ,battleLiveTime ,battleStartTime ,battleEndTime ,status, isNifty, isBankNifty, isFinNifty
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
        setNewObjectId(data?.data?._id)
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

    if(new Date(formState.battleStartTime).toISOString() > new Date(formState.battleEndTime).toISOString()){
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
      return openErrorSB("Error", "Date range is not valid.")
    }
    if (!formState.battleName || !formState.battleLiveTime || !formState.battleStartTime || !formState.battleEndTime || !formState.status || (!formState.isNifty && !formState.isBankNifty && !formState.isFinNifty)  ) {
      setTimeout(() => { setCreating(false); setIsSubmitted(false); setSaving(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }
    const { battleTemplate, battleName ,battleLiveTime ,battleStartTime ,battleEndTime ,status, isNifty, isBankNifty, isFinNifty } = formState;

    const res = await fetch(`${apiUrl}battle/${battle?._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        battleTemplate: battleTemplate?.id, battleName ,battleLiveTime ,battleStartTime ,battleEndTime ,status, isNifty, isBankNifty, isFinNifty
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

            <Grid container display="flex" flexDirection="row" justifyContent="space-between" alignItems='center'>
              <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12} display='flex' justifyContent='center' alignItems='center'>
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
                          label="Live Time"
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
                          label="Start Time"
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
                          label="End Time"
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
                  <FormControl sx={{ minHeight: 10, minWidth: '100%' }}>
                    <InputLabel id="demo-multiple-name-label">Battle Template</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      name='battletemplates'
                      disabled={((isSubmitted || battle) && (!editing || saving))}
                      value={formState?.battleTemplate?.name || battle?.battleTemplate?.templateName}
                      onChange={handleTemplateChange}
                      input={<OutlinedInput label="Battle Template" />}
                      sx={{ minHeight: 45, minWidth:'100%' }}
                      MenuProps={MenuProps}
                    >
                      {battleTemplates?.map((battleTemplate) => (
                        <MenuItem
                          key={battleTemplate?.battleTemplateName}
                          value={battleTemplate?.battleTemplateName}
                        >
                          {battleTemplate.battleTemplateName}
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
                      value={formState?.status || battle?.status}
                      disabled={((isSubmitted || battle) && (!editing || saving))}
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
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>               
              
                <Grid item xs={12} md={6} xl={2}>
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

                <Grid item xs={12} md={6} xl={2}>
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

                <Grid item xs={12} md={6} xl={2}>
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

                <Grid container xs={12} md={12} xl={12} m={2} p={1}>
                
                  <Grid item xs={12} md={6} xl={3}>
                    <MDTypography fontSize={15}>Entry Fee: {formState?.battleTemplate?.entryFee}</MDTypography>
                  </Grid>

                  <Grid item xs={12} md={6} xl={3}>
                    <MDTypography fontSize={15}>Portfolio Value: {formState?.battleTemplate?.portfolioValue}</MDTypography>
                  </Grid>

                  <Grid item xs={12} md={6} xl={3} ml={0}>
                    <MDTypography fontSize={15}>Min Participants: {formState?.battleTemplate?.minParticipants}</MDTypography>
                  </Grid>

                  <Grid item xs={12} md={6} xl={3} ml={0}>
                    <MDTypography fontSize={15}>GST Percentage: {formState?.battleTemplate?.gstPercentage}%</MDTypography>
                  </Grid>

                  <Grid item xs={12} md={6} xl={3} ml={0}>
                    <MDTypography fontSize={15}>Battle Type: {formState?.battleTemplate?.battleType}</MDTypography>
                  </Grid>

                  <Grid item xs={12} md={6} xl={3} ml={0}>
                    <MDTypography fontSize={15}>Battle Template: {formState?.battleTemplate?.battleTemplateType}</MDTypography>
                  </Grid>

                  <Grid item xs={12} md={6} xl={3} ml={0}>
                    <MDTypography fontSize={15}>Top Winners: {formState?.battleTemplate?.topWinners}</MDTypography>
                  </Grid>

                </Grid>
               
                {(battle || newObjectId) && 
                <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                  <MDBox>
                    <RegisteredUsers battle={battle} action={action} setAction={setAction} />
                  </MDBox>
                </Grid>
                }

                {(battle || newObjectId) && 
                <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                  <MDBox>
                    <PotentialUsers battle={battle} action={action} setAction={setAction} />
                  </MDBox>
                </Grid>
                }

                {(battle || newObjectId) && 
                <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                  <MDBox>
                    <Shared battle={battle} action={action} setAction={setAction} />
                  </MDBox>
                </Grid>
                }

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
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/battledashboard/battles") }}>
                      Cancel
                    </MDButton>
                  </>
                )}
                {((isSubmitted || Boolean(battle)) && !editing) && (
                  <>
                  {battle?.status !== "Completed" &&
                    <MDButton variant="contained" color="warning" size="small" sx={{ mr: 1, ml: 2 }} onClick={() => { setEditing(true) }}>
                      Edit
                    </MDButton>}
                    <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/battledashboard/battles') }}>
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
                      onClick={() => { setEditing(false); setFormState(
                        {
                          battleName: '' || battle?.battleName,
                          battleLiveTime: dayjs(battle?.battleLiveTime) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
                          battleStartTime: dayjs(battle?.battleStartTime) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
                          battleEndTime: dayjs(battle?.battleEndTime) ?? dayjs(new Date()).set('hour', 23).set('minute', 59).set('second', 59),
                          status: '' || battle?.status,
                          battleTemplate: {
                            id: "" || battle?.battleTemplate?._id,
                            name: "" || battle?.battleTemplate?.battleTemplateName,
                            entryFee: "" || battle?.battleTemplate?.entryFee,
                            portfolioValue: "" || battle?.battleTemplate?.portfolioValue,
                            minParticipants: "" || battle?.battleTemplate?.minParticipants,
                            winnerPercentage: "" || battle?.battleTemplate?.winnerPercentage,
                            battleType: "" || battle?.battleTemplate?.battleType,
                            battleTemplateType: "" || battle?.battleTemplate?.battleTemplateType,
                            gstPercentage: "" || battle?.battleTemplate?.gstPercentage,
                            topWinners: "" || battle?.battleTemplate?.rankingPayout?.length,
                          },
                          isNifty:false || battle?.isNifty,
                          isBankNifty: false || battle?.isBankNifty,
                          isFinNifty: false || battle?.isFinNifty,
                      
                        }
                      ) }}
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