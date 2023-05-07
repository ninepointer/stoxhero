import React, {useState} from 'react';
import MDTypography from "../../../components/MDTypography";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton"
import { CircularProgress, Grid, TextField } from '@mui/material';
import {Link} from 'react-router-dom'
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import MDSnackbar from "../../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { IoMdAddCircle } from 'react-icons/io';

export default function SubscriptionList() {
const location = useLocation();
const navigate = useNavigate();
const  id  = location?.state?.data;
const [isLoading,setIsLoading] = useState(id ? true : false)
const [saving,setSaving] = useState(false)
const [editing,setEditing] = useState(false)
const [isSubmitted,setIsSubmitted] = useState(false);
const [creating,setCreating] = useState(false);
const [newObjectId, setNewObjectId] = useState("");
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

const [formState,setFormState] = useState({
    plan_name:'',
    actual_price:'',
    discounted_price:'',
    features: {
        orderNo: "",
        description: ""
    },
    validity:'',
    validityPeriod:'',
    status:''
});


  async function onSubmit(e,formState){
    e.preventDefault()
    console.log(formState)
    if(!formState.plan_name || !formState.actual_price || !formState.discounted_price || !formState.validity || !formState.validityPeriod || !formState.status){
    
        setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
        return openErrorSB("Missing Field","Please fill all the mandatory fields")
    }
    setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
    const {plan_name, actual_price, discounted_price, validity, validityPeriod, status } = formState;
    const res = await fetch(`${baseUrl}api/v1/tenX/create`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            plan_name, actual_price, discounted_price, validity, validityPeriod, status
        })
    });
    
    
    const data = await res.json();
    if (data.status === 422 || data.error || !data) {
        setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
    } else {
        setNewObjectId(data?.data._id)
        openSuccessSB("Slab Created",data.message)
        setIsSubmitted(true)
        setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
      }
  }


  async function onAddReward(e,childFormState,setChildFormState){
    e.preventDefault()
    setSaving(true)
    if(!childFormState?.orderNo || !childFormState?.description){
        setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
        return openErrorSB("Missing Field","Please fill all the mandatory fields")
    }
    const {orderNo, description} = childFormState;
  
    const res = await fetch(`${baseUrl}api/v1/tenX/${newObjectId}`, {
        method: "PATCH",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            features:{orderNo, description}
        })
    });
    const data = await res.json();
    // console.log(data);
    if (data.status === 422 || data.error || !data) {
        openErrorSB("Error","data.error")
    } else {
        openSuccessSB("New Reward Added","New Reward line item has been added in the contest")
        setTimeout(()=>{setSaving(false);setEditing(false)},500)
        setChildFormState(prevState => ({
            ...prevState,
            rewards: {}
        }))
    }
  }

  async function onEdit(e,formState){
    e.preventDefault();
    setSaving(true)
    console.log(formState)
    if(!formState.plan_name || !formState.actual_price || !formState.discounted_price || !formState.validity || !formState.validityPeriod || !formState.status){
  
      setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
      return openErrorSB("Missing Field","Please fill all the mandatory fields")
  
  }
    const {plan_name, actual_price, discounted_price, validity, validityType, status } = formState;
  
    const res = await fetch(`${baseUrl}api/v1/portfolio`, {
        method: "PATCH",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            plan_name, actual_price, discounted_price, validity, validityType, status
        })
      });
  
    const data = await res.json();
    console.log(data);
    if (data.status === 422 || data.error || !data) {
        openErrorSB("Error","data.error")
    } else {
        openSuccessSB("Contest Edited",data.message)
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
        <MDBox pl={2} pr={2} mt={4}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                Fill Subscription Details
            </MDTypography>
            </MDBox>

            <Grid container display="flex" flexDirection="row" justifyContent="space-between">
            <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={9} xl={12}>
            <Grid item xs={12} md={6} xl={3}>
                <TextField
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    id="outlined-required"
                    label='Plan Name *'
                    fullWidth
                    // defaultValue={portfolioData?.portfolioName}
                    value={formState?.jobTitle}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        plan_name: e.target.value
                    }))}}
                />
            </Grid>

            <Grid item xs={12} md={6} xl={3}>
                <TextField
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    id="outlined-required"
                    label='Actual Price *'
                    type='number'
                    fullWidth
                    // defaultValue={portfolioData?.portfolioName}
                    value={formState?.actual_price}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        actual_price: e.target.value
                    }))}}
                />
            </Grid>

            <Grid item xs={12} md={6} xl={3}>
                <TextField
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    id="outlined-required"
                    label='Discounted Price *'
                    type='number'
                    fullWidth
                    // defaultValue={portfolioData?.portfolioName}
                    value={formState?.discounted_price}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        discounted_price: e.target.value
                    }))}}
                />
            </Grid>

            <Grid item xs={12} md={6} xl={3}>
                <TextField
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    id="outlined-required"
                    label='Validity *'
                    type='number'
                    fullWidth
                    // defaultValue={portfolioData?.portfolioName}
                    value={formState?.validity}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        validity: e.target.value
                    }))}}
                />
            </Grid>

            <Grid item xs={12} md={6} xl={3}>
                <FormControl sx={{width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Validity Period *</InputLabel>
                    <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={formState?.validityPeriod}
                    // value={oldObjectId ? contestData?.status : formState?.status}
                    // disabled={((isSubmitted || id) && (!editing || saving))}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        validityPeriod: e.target.value
                    }))}}
                    label="Validity Period"
                    sx={{ minHeight:43 }}
                    >
                    <MenuItem value="days">Day(s)</MenuItem>
                    <MenuItem value="month">Month(s)</MenuItem>
                    <MenuItem value="year">Year(s)</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6} xl={3}>
                <FormControl sx={{width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                    <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={formState?.status}
                    // value={oldObjectId ? contestData?.status : formState?.status}
                    // disabled={((isSubmitted || id) && (!editing || saving))}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        status: e.target.value
                    }))}}
                    label="Status"
                    sx={{ minHeight:43 }}
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
                        {!isSubmitted && !id && (
                        <>
                        <MDButton 
                            variant="contained" 
                            color="success" 
                            size="small" 
                            sx={{mr:1, ml:2}} 
                            disabled={creating} 
                            onClick={(e)=>{onSubmit(e,formState)}}
                            >
                            {creating ? <CircularProgress size={20} color="inherit" /> : "Save"}
                        </MDButton>
                        <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{navigate("/TenX Subscriptions")}}>
                            Cancel
                        </MDButton>
                        </>
                        )}
                        {(isSubmitted || id) && !editing && (
                        <>
                        <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} onClick={()=>{setEditing(true)}}>
                            Edit
                        </MDButton>
                        <MDButton variant="contained" color="info" size="small" onClick={()=>{id ? navigate("/TenX Subscriptions") : setIsSubmitted(false)}}>
                            Back
                        </MDButton>
                        </>
                        )}
                        {(isSubmitted || id) && editing && (
                        <>
                        <MDButton 
                            variant="contained" 
                            color="warning" 
                            size="small" 
                            sx={{mr:1, ml:2}} 
                            disabled={saving} 
                            // onClick={(e)=>{onEdit(e,formState)}}
                            >
                            {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                        </MDButton>
                        <MDButton 
                            variant="contained" 
                            color="error" 
                            size="small" 
                            disabled={saving} 
                            // onClick={()=>{setEditing(false)}}
                            >
                            Cancel
                        </MDButton>
                        </>
                        )}
                </Grid>

                {(isSubmitted || id) && !editing && 
                <Grid item xs={12} md={6} xl={12}>
                    
                    <Grid container spacing={1}>

                    <Grid item xs={12} md={6} xl={12} mt={-3} mb={-1}>
                    <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                        Add Features
                    </MDTypography>
                    </Grid>
                    
                    <Grid item xs={12} md={1.35} xl={2.7}>
                        <TextField
                            id="outlined-required"
                            label='Order No. *'
                            fullWidth
                            type="number"
                            // value={formState?.features?.orderNo}
                            onChange={(e) => {setFormState(prevState => ({
                                ...prevState,
                                orderNo: e.target.value
                            }))}}
                        />
                    </Grid>
        
                    <Grid item xs={12} md={1.35} xl={2.7}>
                        <TextField
                            id="outlined-required"
                            label='Description *'
                            fullWidth
                            type="text"
                            // value={formState?.features?.description}
                            onChange={(e) => {setFormState(prevState => ({
                                ...prevState,
                                description: e.target.value
                            }))}}
                        />
                    </Grid>
            
                    <Grid item xs={12} md={0.6} xl={1.2} mt={-0.7}>
                        <IoMdAddCircle cursor="pointer" onClick={(e)=>{onAddReward(e,formState,setFormState)}}/>
                    </Grid>
    
                    </Grid>
    
                </Grid>}

            </Grid>

            {renderSuccessSB}
            {renderErrorSB}
        </MDBox>
    )
                }
    </>
    );
}