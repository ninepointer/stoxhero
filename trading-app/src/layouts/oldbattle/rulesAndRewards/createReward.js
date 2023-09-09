import * as React from 'react';
import {useContext, useState} from "react";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../../components/MDTypography";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton"
import {userContext} from "../../../AuthContext";
// import axios from "axios";
import { CircularProgress, Typography } from "@mui/material";
import MDSnackbar from "../../../components/MDSnackbar";
// import MenuItem from '@mui/material/MenuItem';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import InputLabel from '@mui/material/InputLabel';
// import FormControl from '@mui/material/FormControl';
// import { IoMdAddCircle } from 'react-icons/io';
// import TabContext from '@material-ui/lab/TabContext';

//Icons

// import { GrFormNextLink } from 'react-icons/gr';

// //Data
// import RuleData from '../data/battleRuleData';



export default function CreateContest({createRewardForm, setCreateRewardForm, battle, reward}) {

const [isSubmitted,setIsSubmitted] = useState(false);
const getDetails = useContext(userContext);
const [rewardData,setRewardData] = useState([]);
const [formState,setFormState] = useState({
    rankStart:"" || reward?.rankStart,
    rankEnd:"" || reward?.rankEnd,
    prize:"" || reward?.prize,
    prizeValue:"" || reward?.prizeValue
});
const [id,setId] = useState();
const [isObjectNew,setIsObjectNew] = useState(id ? true : false)
const [isLoading,setIsLoading] = useState(id ? true : false)
const [editing,setEditing] = useState(false)
const [saving,setSaving] = useState(false)
const [creating,setCreating] = useState(false)
const [newObjectId,setNewObjectId] = useState()
const [addRewardObject,setAddRewardObject] = useState(false);



let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

// React.useEffect(()=>{

//     axios.get(`${baseUrl}api/v1/battle/:id/rules`)
//     .then((res)=>{
//             setRuleData(res.data[0]);
//             console.log("Contest Rule Object: ",res.data[0])
//             setId(res.data[0]._id)
//             setFormState({
//             ruleName: res.data[0]?.ruleName || '',
//             contestRules:[{
//                 orderNo : res.data[0]?.contestRules?.orderNo || '',
//                 rule: res.data[0]?.contestRules?.rule || ''
//             }],
//             status: res.data[0]?.status || '',
//             createdBy: res.data[0]?.createdBy || '',
//             lastModifiedBy: res.data[0]?.lastModifiedBy || '',
//             lastModifiedOn: res.data[0]?.lastModifiedOn || '',
//           });
//             setTimeout(()=>{setIsLoading(false)},500) 
//         // setIsLoading(false)
//     }).catch((err)=>{
//         //window.alert("Server Down");
//         return new Error(err);
//     })

// },[formState])

async function onNext(e,formState){
e.preventDefault()
setCreating(true)
console.log("Reward Form State: ",formState)

if(!formState?.rankStart || !formState?.rankEnd || !formState?.prize || !formState.prizeValue){

  setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
  return openErrorSB("Missing Field","Please fill all the mandatory fields")

}

const {rankStart, rankEnd, prize, prizeValue} = formState;
if(reward?.rankStart){
    const res = await fetch(`${baseUrl}api/v1/battles/${battle}/rewards/${reward?._id}`, {
        method: "PATCH",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          rankStart: parseInt(rankStart), rankEnd: parseInt(rankEnd), prize, prizeValue
        })
    });
    
    const data = await res.json();
    console.log(data.error,data);
    if (!data.error) {
        setNewObjectId(data.data?._id)
        setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
        openSuccessSB(data.message,`Contest Reward Created with prize: ${data.data?.prize}`)
        setCreateRewardForm(!createRewardForm);
        
    } else {
        setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
        console.log("Invalid Entry");
        return openErrorSB("Couldn't Add Reward",data.error)
    }
}else{
    const res = await fetch(`${baseUrl}api/v1/battles/${battle}/rewards`, {
        method: "PATCH",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          rankStart: parseInt(rankStart), rankEnd: parseInt(rankEnd), prize, prizeValue
        })
    });
    
    const data = await res.json();
    console.log(data.error,data);
    if (!data.error) {
        setNewObjectId(data.data?._id)
        setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
        openSuccessSB(data.message,`Contest Reward Created with prize: ${data.data?.prize}`)
        setCreateRewardForm(!createRewardForm);
        
    } else {
        setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
        console.log("Invalid Entry");
        return openErrorSB("Couldn't Add Reward",data.error)
    }
}
}

// async function onAdd(e,childFormState,setChildFormState){
//     e.preventDefault()
//     setSaving(true)
//     console.log("Rule Child Form State: ",childFormState)
//     console.log("New Rule Object Id: ",newObjectId)
//     if(!childFormState?.orderNo || !childFormState?.rule){
    
//         setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
//         return openErrorSB("Missing Field","Please fill all the mandatory fields")
    
//     }
//     const {orderNo,rule} = childFormState;

//     const res = await fetch(`${baseUrl}api/v1/contestrule/${newObjectId}`, {
//         method: "PUT",
//         credentials:"include",
//         headers: {
//             "content-type" : "application/json",
//             "Access-Control-Allow-Credentials": true
//         },
//         body: JSON.stringify({
//           contestRules:{orderNo,rule}
//         })
//     });

//     const data = await res.json();
//     console.log(data);
//     if (data.status === 422 || data.error || !data) {
//         openErrorSB("Error",data.error)
//     } else {
//         openSuccessSB("New Rule Added","New Rule line item has been added in the contest rule")
//         setTimeout(()=>{setSaving(false);setEditing(false)},500)
//         setAddRuleObject(!addRuleObject);
//         console.log("Entry Succesfull");
//     }
//   }
  
const date = new Date(rewardData.lastModifiedOn);

const formattedLastModifiedOn = `${date.getUTCDate()}/${date.toLocaleString('default', { month: 'short' })}/${String(date.getUTCFullYear())} ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}`;



const [title,setTitle] = useState('')
const [content,setContent] = useState('')

const [successSB, setSuccessSB] = useState(false);
const openSuccessSB = (title,content) => {
setTitle(title)
setContent(content)
setSuccessSB(true);
}
const closeSuccessSB = () => setSuccessSB(false);
// console.log("Title, Content, Time: ",title,content,time)


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


    return (
    <>
    {isLoading ? (
        <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
        <CircularProgress color="info" />
        </MDBox>
    )
        :
      ( 
        <MDBox mt={4} p={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Reward Details
        </MDTypography>
        </MDBox>

        <Grid container spacing={1} mt={0.5} alignItems="space-between">

          <Grid item xs={12} md={5} xl={6}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Rank Start*'
                inputMode='numeric'
                fullWidth
                value={formState?.rankStart}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    rankStart: e.target.value
                  }))}}
              />
          </Grid>
          <Grid item xs={12} md={5} xl={6}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Rank End*'
                inputMode='numeric'
                fullWidth
                value={formState?.rankEnd}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    rankEnd: e.target.value
                  }))}}
              />
          </Grid>
          <Grid item xs={12} md={5} xl={6}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Prize*'
                fullWidth
                value={formState?.prize}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    prize: e.target.value
                  }))}}
              />
          </Grid>
          <Grid item xs={12} md={5} xl={6}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Prize Value*'
                fullWidth
                value={formState?.prizeValue}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    prizeValue: e.target.value
                  }))}}
              />
          </Grid>

   

          {!isSubmitted && (
          <>
          <Grid item xs={12} md={2} xl={1} width="100%">
            <MDButton variant="contained" size="small" color="success" onClick={(e) => {onNext(e,formState)}}>Next</MDButton>
          </Grid>
          <Grid item xs={12} md={2} xl={1} width="100%">
            <MDButton variant="contained" size="small" color="warning" onClick={(e) => {setCreateRewardForm(!createRewardForm)}}>Back</MDButton>
          </Grid>
          </>
          )}

          {/* {isSubmitted && 
        //   <Grid item xs={12} md={6} xl={12}>
                
            <Grid container spacing={1} mt={0.5}>
            <Grid item xs={12} md={3} xl={3}>
                <TextField
                    id="outlined-required"
                    label='Rule No *'
                    fullWidth
                    type="number"
                    value={formState?.contestRules?.orderNo}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        orderNo: e.target.value
                    }))}}
                />
            </Grid>

            <Grid item xs={12} md={7.5} xl={8}>
                <TextField
                    id="outlined-required"
                    label='Add rule here *'
                    defaultValue={formState?.contestRules?.rule}
                    fullWidth
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        rule: e.target.value
                    }))}}
                />
            </Grid>

            <Grid item xs={12} md={1.5} xl={1} display="flex" justifyContent="center" >
                <IoMdAddCircle cursor="pointer" onClick={(e)=>{onAdd(e,formState,setFormState)}}/>
            </Grid>

            </Grid>

            // </Grid>
            } */}

          {/* {isSubmitted && <Grid item xs={12} md={6} xl={12}> */}
                {/* <MDTypography>Added Rules will show up here</MDTypography> */}
                {/* <MDBox> */}
                    {/* <RuleData id={newObjectId} addRuleObject={addRuleObject} setAddRuleObject={setAddRuleObject}/> */}
                {/* </MDBox> */}
          {/* </Grid>} */}

          {/* <Grid item xs={12} md={6} xl={6}>
            {isObjectNew &&
            <>
            <MDBox style={{fontSize:10}}>
                Last Modified By: {ruleData?.lastModifiedBy?.first_name} {ruleData?.lastModifiedBy?.last_name}
            </MDBox>
            <MDBox style={{fontSize:10}}>
                Last Modified On: {formattedLastModifiedOn}
            </MDBox>
            </>}
          </Grid> */}
          

          {/* <Grid item display="flex" justifyContent="flex-end" alignContent="center" xs={12} md={6} xl={6}>
                {!isSubmitted && !isObjectNew && (
                <>
                <MDButton variant="contained" color="success" size="small" sx={{mr:1, ml:2}} disabled={creating} onClick={(e)=>{onSubmit(e,formState)}}>
                    {creating ? <CircularProgress size={20} color="inherit" /> : "Save"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{setCreateRuleForm(false)}}>
                    Cancel
                </MDButton>
                </>
                )}
                {(isSubmitted || isObjectNew) && !editing && (
                <>
                <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} onClick={()=>{setEditing(true)}}>
                    Edit
                </MDButton>
                <MDButton variant="contained" color="info" size="small" onClick={()=>{setCreateRuleForm(false)}}>
                    Back
                </MDButton>
                </>
                )}
                {(isSubmitted || isObjectNew) && editing && (
                <>
                <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} disabled={saving} onClick={(e)=>{onEdit(e,formState)}}>
                    {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                </MDButton>
                <MDButton variant="contained" color="error" size="small" disabled={saving} onClick={()=>{setCreateRuleForm(false)}}>
                    Cancel
                </MDButton>
                </>
                )}
          </Grid> */}
            
          </Grid>
          {renderSuccessSB}
          {renderErrorSB}
    </MDBox>
    )
                }
    </>
    )
}
// export default CreateContest;