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
import OutlinedInput from '@mui/material/OutlinedInput';

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

export default function SubscriptionList(oldObjectId, setOldObjectId) {
const location = useLocation();
const navigate = useNavigate();
const  id  = location?.state?.data;
const [portfolios,setPortfolios] = useState([]);
const [isLoading,setIsLoading] = useState(id ? true : false)
const [saving,setSaving] = useState(false)
const [editing,setEditing] = useState(false)
const [isSubmitted,setIsSubmitted] = useState(false);
const [creating,setCreating] = useState(false)
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

const [formState,setFormState] = useState({
    plan_name:'',
    actual_price:'',
    discounted_price:'',
    profitCap:'',
    features:'',
    validity:'',
    validityPeriod:'',
    status:''
});

React.useEffect(()=>{
    axios.get(`${baseUrl}api/v1/portfolio/tenx`)
    .then((res)=>{
      console.log(res?.data?.data)
      setPortfolios(res?.data?.data);
    }).catch((err)=>{
        return new Error(err)
    })
})

const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    // setRuleName(value)
    setFormState(prevState => ({
      ...prevState,
      portfolio: value
    }))
  };

async function onSubmit(e,formState){
    e.preventDefault();
    console.log(formState);
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
                    label='Profit Cap *'
                    type='number'
                    fullWidth
                    // defaultValue={portfolioData?.portfolioName}
                    value={formState?.profitCap}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        profitCap: e.target.value
                    }))}}
                />
            </Grid>

            <Grid item xs={12} md={3} xl={3} mb={-3}>
                <FormControl sx={{ minHeight:10, minWidth:263 }}>
                  <InputLabel id="demo-multiple-name-label">Portfolio</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    defaultValue={oldObjectId ? portfolios?.portfolioName : ''}
                    onChange={handleChange}
                    input={<OutlinedInput label="Portfolio" />}
                    sx={{minHeight:45}}
                    MenuProps={MenuProps}
                  >
                    {portfolios?.map((portfolio) => (
                      <MenuItem
                        key={portfolio?.portfolioName}
                        value={portfolio?._id}
                      >
                        {portfolio.portfolioName}
                      </MenuItem>
                    ))}
                  </Select>
            </FormControl>
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
                    <MenuItem value="day">Day(s)</MenuItem>
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
                    <MenuItem value="Live">Active</MenuItem>
                    <MenuItem value="Draft">Inactive</MenuItem>
                    <MenuItem value="Rejected">Draft</MenuItem>
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
            </Grid>

            {renderSuccessSB}
            {renderErrorSB}
        </MDBox>
    )
                }
    </>
    );
}