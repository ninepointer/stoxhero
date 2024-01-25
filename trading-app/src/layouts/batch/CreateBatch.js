import * as React from 'react';
import {useContext, useState} from "react";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import {userContext} from "../../AuthContext";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
// import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
// import { IoMdAddCircle } from 'react-icons/io';
import { useTheme } from '@mui/material/styles';
// import OutlinedInput from '@mui/material/OutlinedInput';
import { useNavigate } from "react-router-dom";


function CreateBatch({createContestForm, setCreateBatchForm, oldObjectId, setOldObjectId, setCreateBatchFormCard}) {
  // console.log("Old Object Id: ",oldObjectId)
  const [isSubmitted,setIsSubmitted] = useState(false);
  const getDetails = useContext(userContext);
  const [batchData,setBatchData] = useState([]);
  const [linkedContestRule,setLinkedContestRule] = useState();
  const [formState,setFormState] = useState();
  const [id,setId] = useState(oldObjectId ? oldObjectId : '');
  const [isObjectNew,setIsObjectNew] = useState(id ? true : false)
  const [isLoading,setIsLoading] = useState(id ? true : false)
  const [editing,setEditing] = useState(false)
  const [saving,setSaving] = useState(false)
  const [creating,setCreating] = useState(false)
  const [newObjectId,setNewObjectId] = useState(oldObjectId)
  const [contestRules,setContestRules] = useState([])
  // const [addRewardObject,setAddRewardObject] = useState(false);

let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
const navigate = useNavigate();

React.useEffect(()=>{
    // console.log("Inside Use Effect")
    // console.log("Inside Use Effect Id & Old Object Id: ",id,oldObjectId)
    axios.get(`${baseUrl}api/v1/contest/${id}`)
    .then((res)=>{
        setBatchData(res?.data?.data);
        // console.log("Contest Data in Create Contest Form: ",res?.data?.data)
        setLinkedContestRule(res?.data?.data?.contestRule._id)
        // setId(res?.data?.data._id)
        setFormState({
            batchName: res.data.data?.batchName || '',
            batchLimit: res.data.data?.batchLimit || '',
            participantRevenueSharing: res.data.data?.participantRevenueSharing || '',
            stockType: res.data.data?.stockType || 'Options',
            contestOn: res.data.data?.contestOn || '',
            batchStartDate: res.data?.data?.batchStartDate || '',
            batchEndDate: res.data?.data?.batchEndDate || '',
            applicationStartDate: res.data?.data?.applicationStartDate || '',
            applicationEndDate: res.data?.data?.applicationEndDate || '',
            entryFee:{
                amount : res.data?.data?.entryFee?.amount || '',
                currency: res.data?.data?.entryFee?.currency || ''
            },
            contestRule: res.data?.data?.contestRule || '',
            batchStatus: res.data?.data?.batchStatus || 'Live',
            createdBy: res.data?.data?.createdBy || '',
            lastModifiedBy: res.data?.data?.lastModifiedBy || '',
            lastModifiedOn: res.data?.data?.lastModifiedOn || '',
            contestMargin: res.data?.data?.contestMargin || '',
          });
            setTimeout(()=>{setIsLoading(false)},500) 
        // setIsLoading(false)
    }).catch((err)=>{
        //window.alert("Server Down");
        return new Error(err);
    })

},[id,isSubmitted])


async function onSubmit(e,formState){
e.preventDefault()
setCreating(true)

if(
    !formState?.batchName || !formState?.batchLimit || !formState?.participantRevenueSharing || 
    !formState?.batchStartDate || !formState?.batchEndDate || !formState?.applicationStartDate || 
    !formState?.applicationEndDate || !formState?.batchStatus){

    setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
    return openErrorSB("Missing Field","Please fill all the mandatory fields")

}
// console.log("Is Submitted before State Update: ",isSubmitted)
setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
const { batchName, batchLimit, participantRevenueSharing, batchStartDate, batchEndDate, applicationStartDate, applicationEndDate, batchStatus} = formState;
const res = await fetch(`${baseUrl}api/v1/batch`, {
    method: "POST",
    credentials:"include",
    headers: {
        "content-type" : "application/json",
        "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      batchName, batchLimit, participantRevenueSharing, batchStartDate, batchEndDate, applicationStartDate, applicationEndDate, batchStatus
    })
});


const data = await res.json();
// console.log(data);
if (data.batchStatus === 422 || data.error || !data) {
    setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
    // console.log("invalid entry");
} else {
    openSuccessSB("Contest Created",data.message)
    setNewObjectId(data.data._id)
    setIsSubmitted(true)
    // console.log("setting linked contest rule to: ",data.data.contestRule)
    // setLinkedContestRule(data?.data?.contestRule)
    // console.log(data.data)
    setBatchData(data.data)
    setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
  }
}


async function onEdit(e,formState){
  e.preventDefault()
  setSaving(true)
  // console.log(formState)
  if(
    !formState?.batchName || !formState?.batchLimit || !formState?.participantRevenueSharing || 
    !formState?.batchStartDate || !formState?.batchEndDate || !formState?.applicationStartDate || 
    !formState?.applicationEndDate || !formState?.batchStatus){

    setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
    return openErrorSB("Missing Field","Please fill all the mandatory fields")

}
  const { batchName, batchLimit, participantRevenueSharing, batchStartDate, batchEndDate, applicationStartDate, applicationEndDate, batchStatus } = formState;

  const res = await fetch(`${baseUrl}api/v1/batch/${isObjectNew}`, {
      method: "PATCH",
      credentials:"include",
      headers: {
          "content-type" : "application/json",
          "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        batchName, batchLimit, participantRevenueSharing, batchStartDate, batchEndDate, applicationStartDate, applicationEndDate, batchStatus
      })
    });

  const data = await res.json();
  // console.log(data);
  if (data.batchStatus === 422 || data.error || !data) {
      openErrorSB("Error","data.error")
  } else {
      openSuccessSB("Contest Edited",data.displayName + " | " + data.instrumentSymbol + " | " + data.exchange + " | " + data.batchStatus)
      setTimeout(()=>{setSaving(false);setEditing(false)},500)
      // console.log("entry succesfull");
  }
}


const [title,setTitle] = useState('')
const [content,setContent] = useState('')

const [successSB, setSuccessSB] = useState(false);
const openSuccessSB = (title,content) => {
setTitle(title)
setContent(content)
setSuccessSB(true);
}
const closeSuccessSB = () => setSuccessSB(false);
// console.log("contestRules",contestRules)


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
const openErrorSB = (title,content) => {
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

// console.log("Old Object Id: ",oldObjectId)

    return (
    <>
    {isLoading ? (
        <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
          <CircularProgress color="info" />
        </MDBox>
      )
        :
      ( 
        <MDBox pl={2} pr={2} mt={6}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Batch Details
        </MDTypography>
        </MDBox>

        <Grid container spacing={1} mt={0.5}>
          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Batch Name *'
                fullWidth
                // defaultValue={batchData?.displayName}
                defaultValue={oldObjectId ? batchData?.batchName : formState?.batchName}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    batchName: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Batch Limit *'
                defaultValue={oldObjectId ? batchData.batchLimit : formState?.batchLimit}
                fullWidth
                type="number"
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    batchLimit: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label="Revenue Sharing *"
                defaultValue={oldObjectId ? batchData.participantRevenueSharing :formState?.participantRevenueSharing}
                fullWidth
                type="number"
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    participantRevenueSharing: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">batchStatus *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={oldObjectId ? batchData?.batchStatus : formState?.batchStatus}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    batchStatus: e.target.value
                }))}}
                label="Batch Status"
                sx={{ minHeight:43 }}
                >
                <MenuItem value="Live">Live</MenuItem>
                <MenuItem value="Not Live">Not Live</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-1} mb={2.5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDateTimePicker']}>
                  <DemoItem>
                    <MobileDateTimePicker 
                      label="Batch Start Date"
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      defaultValue={dayjs(oldObjectId ? batchData?.batchStartDate : setFormState?.batchStartDate)}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          batchStartDate: dayjs(e)
                        }))
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
                      defaultValue={dayjs(oldObjectId ? batchData?.batchEndDate : setFormState?.batchEndDate)}
                      onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        batchEndDate: dayjs(e)
                      }))}}
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
                      label="Application Start Date"
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      defaultValue={dayjs(oldObjectId ? batchData?.applicationStartDate : setFormState?.applicationStartDate)}
                      onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        applicationStartDate: dayjs(e)
                      }))}}
                      sx={{ width: '100%' }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-1}>
            
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['MobileDateTimePicker']}>
                  <DemoItem>
                    <MobileDateTimePicker 
                      label="Application End Date"
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      defaultValue={dayjs(oldObjectId ? batchData?.applicationEndDate : setFormState?.applicationEndDate)}
                      onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        applicationEndDate: dayjs(e)
                      }))}}
                      sx={{ width: '100%' }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>

          </Grid>
                
          {/* <Grid item xs={12} md={3} xl={6} mb={-3}>
                <FormControl sx={{ minHeight:10, minWidth:245 }}>
                  <InputLabel id="demo-multiple-name-label">Contest Rule</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    defaultValue={oldObjectId ? batchData?.contestRule?.ruleName : ruleName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Contest Rule" />}
                    sx={{minHeight:45}}
                    MenuProps={MenuProps}
                  >
                    {contestRules?.map((rule) => (
                      <MenuItem
                        key={rule?.ruleName}
                        value={rule?._id}
                        // style={getStyles(rule, ruleName, theme)}
                      >
                        {rule.ruleName}
                      </MenuItem>
                    ))}
                  </Select>
            </FormControl>
          </Grid> */}


          <Grid item display="flex" justifyContent="flex-end" alignContent="center" xs={12} md={6} xl={6}>
                {!isSubmitted && !isObjectNew && (
                <>
                <MDButton variant="contained" color="success" size="small" sx={{mr:1, ml:2}} disabled={creating} onClick={(e)=>{onSubmit(e,formState)}}>
                    {creating ? <CircularProgress size={20} color="inherit" /> : "Next"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{setCreateBatchForm(false)}}>
                    Cancel
                </MDButton>
                </>
                )}
                {(isSubmitted || isObjectNew) && !editing && (
                <>
                <MDButton variant="contained" color="success" size="small" sx={{mr:1, ml:2}} disabled={editing} onClick={(e)=>{setEditing(true)}}>
                    {editing ? <CircularProgress size={20} color="inherit" /> : "Edit"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={editing} onClick={()=>{id ? navigate("/contests") : setIsSubmitted(false)}}>
                    Back
                </MDButton>
                {/* onClick={()=>{setCreateBatchFormCard(false); setCreateBatchForm(false)}} */}
                </>
                )}
                {(isSubmitted || isObjectNew) && editing && (
                <>
                <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} disabled={saving} 
                onClick={(e)=>{onEdit(e,formState)}}
                
                >
                    {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={saving} onClick={()=>{setEditing(false)}}>
                    Cancel
                </MDButton>
                </>
                )}
          </Grid>

          {(isSubmitted || isObjectNew) && !editing && <Grid item xs={12} md={6} xl={12}>
                
                <Grid container spacing={1}>

                <Grid item xs={12} md={6} xl={12} mt={-3} mb={-1}>
                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                  Fill in the rank detail and click add
                </MDTypography>
                </Grid>
                
                {/* <Grid item xs={12} md={1.35} xl={2.7}>
                    <TextField
                        id="outlined-required"
                        label='Rank Start *'
                        fullWidth
                        type="number"
                        value={formState?.rewards?.rankStart}
                        onChange={(e) => {setFormState(prevState => ({
                            ...prevState,
                            rankStart: e.target.value
                        }))}}
                    />
                </Grid> */}
    
                {/* <Grid item xs={12} md={1.35} xl={2.7}>
                    <TextField
                        id="outlined-required"
                        label='Rank End *'
                        fullWidth
                        type="number"
                        value={formState?.rewards?.rankEnd}
                        onChange={(e) => {setFormState(prevState => ({
                            ...prevState,
                            rankEnd: e.target.value
                        }))}}
                    />
                </Grid> */}

                {/* <Grid item xs={12} md={1.35} xl={2.7}>
                    <TextField
                        id="outlined-required"
                        label='Reward *'
                        fullWidth
                        type="number"
                        value={formState?.rewards?.reward}
                        onChange={(e) => {setFormState(prevState => ({
                            ...prevState,
                            reward: e.target.value
                        }))}}
                    />
                </Grid> */}

                {/* <Grid item xs={12} md={1.35} xl={2.7}>
                  <FormControl sx={{width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Currency *</InputLabel>
                    <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={formState?.currency}
                    onChange={(e) => {setFormState(prevState => ({
                      ...prevState,
                      currency: e.target.value
                    }))}}
                    label="Currency"
                    sx={{ minHeight:43 }}
                    >
                    <MenuItem value="INR">INR</MenuItem>
                    <MenuItem value="CREDOS">CREDOS</MenuItem>
                    </Select>
                  </FormControl>
              </Grid> */}
    
                {/* <Grid item xs={12} md={0.6} xl={1.2} mt={-0.7}>
                    <IoMdAddCircle cursor="pointer" onClick={(e)=>{onAddReward(e,formState,setFormState)}}/>
                </Grid> */}
    
                </Grid>
    
                </Grid>}

          {/* {(isSubmitted || oldObjectId) && <Grid item xs={12} md={12} xl={12} mt={2}>
                <MDBox>
                    <RewardsData id={newObjectId} oldObjectId={oldObjectId} addRewardObject={addRewardObject} setAddRewardObject={setAddRewardObject}/>
                </MDBox>
          </Grid>} */}

          {/* {(isSubmitted || oldObjectId) && <Grid item xs={12} md={12} xl={12} mt={2}>
                <MDBox>
                    <LinkedContestRuleData linkedRuleId={linkedContestRule} setLinkedRuleId={setLinkedContestRule} isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted}/>
                </MDBox>
          </Grid>} */}

          {/* {(isSubmitted || oldObjectId) && <Grid item xs={12} md={12} xl={12} mt={2}>
                <MDBox>
                    <ContestParticipantsData batchData={batchData} setBatchData={setBatchData} isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted}/>
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
export default CreateBatch;