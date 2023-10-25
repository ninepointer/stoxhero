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
import OutlinedInput from '@mui/material/OutlinedInput';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


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

export default function TradingHoliday() {
const location = useLocation();
const navigate = useNavigate();
const  id  = location?.state?.data;
const [tradingHoliday,setTradingHoliday] = useState([]);
const [isLoading,setIsLoading] = useState(id ? true : false)
const [saving,setSaving] = useState(false)
const [editing,setEditing] = useState(false)
const [isSubmitted,setIsSubmitted] = useState(false);
const [creating,setCreating] = useState(false);
const [newObjectId, setNewObjectId] = useState("");

let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

const [formState,setFormState] = useState({
    holidayName:'',
    description:'',
    holidayDate:'',
});

React.useEffect(()=>{

    axios.get(`${baseUrl}api/v1/tradingholiday/${id?._id}`, {withCredentials: true})
    .then((res)=>{
   
      setTradingHoliday(res?.data?.data);
      console.log(res.data.data)
      setFormState({
        holidayName: res.data.data?.holidayName || '',
        description: res.data.data?.description || '',
        holidayDate: res.data.data?.holidayDate || '',
      });
      setTimeout(()=>{
        setIsLoading(false)
      },500)
    }).catch((err)=>{
        return new Error(err)
    })    
},[])


async function onEdit(e,formState){
    e.preventDefault()
    setSaving(true)
    console.log(formState)

    if(!formState.holidayName || !formState.holidayDate || !formState.description){
        setTimeout(()=>{setSaving(false);setEditing(true)},500)
        return openErrorSB("Missing Field","Please fill all the mandatory fields")
    }
    const { holidayName, holidayDate, description } = formState;

    const res = await fetch(`${baseUrl}api/v1/tradingholiday/${id?._id}`, {
        method: "PATCH",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            holidayName, holidayDate, description 
        })
    });

    const data = await res.json();

    if (!data.data) {
        setTimeout(()=>{setSaving(false);setEditing(false)},500)
        openErrorSB("Error",data.error)  
    } else {
        openSuccessSB("Holiday Edited", "Edited Successfully")
        setTimeout(()=>{setSaving(false);setEditing(false)},500)
    }
}

  async function onSubmit(e,formState){
    e.preventDefault()

    if(!formState.holidayName || !formState.holidayDate || !formState.description ){
    
        setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
        return openErrorSB("Missing Field","Please fill all the mandatory fields")
    }
    setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
    const {holidayName, holidayDate, description} = formState;
    const res = await fetch(`${baseUrl}api/v1/tradingholiday/`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            holidayName, holidayDate, description
        })
    });
    
    
    const data = await res.json();

    if (!data.data) {
        setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
        openErrorSB("Error",data.message)
    } else {
        setNewObjectId(data?.data._id)
        openSuccessSB("Trading Holiday Created",data.message)
        setIsSubmitted(true)
        setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
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
        <MDBox pl={2} pr={2} mt={4} mb={5}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                Fill Trading Holiday Details
            </MDTypography>
            </MDBox>

            <Grid container display="flex" flexDirection="row" justifyContent="space-between">
            <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>
            <Grid item xs={12} md={6} xl={3}>
                <TextField
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    id="outlined-required"
                    label='Holiday Name *'
                    fullWidth
                    // defaultValue={portfolioData?.portfolioName}
                    value={formState?.holidayName || tradingHoliday?.holidayName}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        holidayName: e.target.value
                    }))}}
                />
            </Grid>
            
            <Grid item xs={12} md={6} xl={3} mt={-1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                    <DatePicker
                    label="Holiday Date"
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    value={dayjs(formState?.holidayDate) || dayjs(tradingHoliday?.holidayDate)}
                    onChange={(e)=>{setFormState(prevState => ({...prevState, holidayDate: dayjs(e)}))}}
                    sx={{ width: '100%' }}
                    />
                </DemoContainer>
                </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6} xl={12}>
                <TextField
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    id="outlined-required"
                    label='Description *'
                    type='multiline'
                    fullWidth
                    // defaultValue={portfolioData?.portfolioName}
                    value={formState?.description || tradingHoliday?.description}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        description: e.target.value
                    }))}}
                />
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
                        <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{navigate("/tradingholiday")}}>
                            Cancel
                        </MDButton>
                        </>
                        )}
                        {(isSubmitted || id) && !editing && (
                        <>
                        <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} onClick={()=>{setEditing(true)}}>
                            Edit
                        </MDButton>
                        <MDButton variant="contained" color="info" size="small" onClick={()=>{(id || newObjectId) ? navigate("/tradingholiday") : setIsSubmitted(false)}}>
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
                            onClick={(e)=>{onEdit(e,formState)}}
                            >
                            {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                        </MDButton>
                        <MDButton 
                            variant="contained" 
                            color="error" 
                            size="small" 
                            disabled={saving} 
                            onClick={()=>{setEditing(false)}}
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
    );
}