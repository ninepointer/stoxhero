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


function CreateCollege({createContestForm, setCreateCollegeForm, oldObjectId, setOldObjectId, setCreateBatchFormCard}) {
  const [isSubmitted,setIsSubmitted] = useState(false);
  const getDetails = useContext(userContext);
  const [batchData,setBatchData] = useState([]);
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
const { collegeName, zone} = formState;
const res = await fetch(`${baseUrl}api/v1/batch`, {
    method: "POST",
    credentials:"include",
    headers: {
        "content-type" : "application/json",
        "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
     collegeName, zone
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
    // setLinkedContestRule(data?.data?.contestRule)
    // console.log(data.data)
    setBatchData(data.data)
    setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
  }
}


async function onEdit(e,formState){
  e.preventDefault()
  setSaving(true)
  console.log(formState)
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
  console.log(data);
  if (data.batchStatus === 422 || data.error || !data) {
      openErrorSB("Error","data.error")
  } else {
      openSuccessSB("Contest Edited",data.displayName + " | " + data.instrumentSymbol + " | " + data.exchange + " | " + data.batchStatus)
      setTimeout(()=>{setSaving(false);setEditing(false)},500)
      console.log("entry succesfull");
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
console.log("contestRules",contestRules)


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

console.log("Old Object Id: ",oldObjectId)

    return (
    <>
    {isLoading ? (
        <MDBox mt={10} mb={10} display="flex" width="100%" justifyContent="center" alignItems="center">
          <CircularProgress color="info" />
        </MDBox>
      )
        :
      ( 
        <MDBox pl={2} pr={2} pt={4} mt={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="caption" fontWeight="bold" color="white" textTransform="uppercase">
          College Details
        </MDTypography>
        </MDBox>

        <Grid container spacing={1} mt={0.5}>
          <Grid item xs={12} md={6} xl={6}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='College Name *'
                fullWidth
                // defaultValue={batchData?.displayName}
                defaultValue={oldObjectId ? batchData?.batchName : formState?.batchName}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,   
                    batchName: e.target.value
                  }))}}
                  sx={{ input: { color: '#ffffff' }, label: {color: '#ffffff'}, outline: {color: '#ffffff'} }}  
              />
          </Grid>


          <Grid item xs={12} md={6} xl={6}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Zone*</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={oldObjectId ? batchData?.batchStatus : formState?.batchStatus}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    zone: e.target.value
                }))}}
                label="Zone*"
                sx={{ input: { color: '#ffffff' }, label: {color: '#ffffff'}, outline: {color: '#ffffff'},  minHeight:43 }} 
                >
                <MenuItem value="North">North</MenuItem>
                <MenuItem value="South">South</MenuItem>
                <MenuItem value="East">East</MenuItem>
                <MenuItem value="West">West</MenuItem>
                <MenuItem value="Central">Central</MenuItem>
                </Select>
              </FormControl>
          </Grid>


          <Grid item display="flex" justifyContent="flex-end" alignContent="center" xs={12} md={6} xl={6}>
                {!isSubmitted && !isObjectNew && (
                <>
                <MDButton variant="contained" color="success" size="small" sx={{mr:1, ml:2}} disabled={creating} onClick={(e)=>{onSubmit(e,formState)}}>
                    {creating ? <CircularProgress size={20} color="inherit" /> : "Submit"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{setCreateCollegeForm(false)}}>
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
          </Grid>
          {renderSuccessSB}
          {renderErrorSB}
    </MDBox>
    )
}
    </>
    )
}
export default CreateCollege;