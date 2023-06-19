import * as React from 'react';
import {useEffect, useState} from "react";
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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
import RegisteredUsers from "./data/registeredUsers";
import AllowedUsers from './data/allowedUsers';
import { IoMdAddCircle } from 'react-icons/io';
import OutlinedInput from '@mui/material/OutlinedInput';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

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
    const  id  = location?.state?.data;
    console.log('id hai',id);
    const [applicationCount, setApplicationCount] = useState(0);
    const [isSubmitted,setIsSubmitted] = useState(false);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [isLoading,setIsLoading] = useState(id ? true : false)
    const [editing,setEditing] = useState(false)
    const [saving,setSaving] = useState(false)
    const [creating,setCreating] = useState(false)
    const navigate = useNavigate();
    const [newObjectId, setNewObjectId] = useState("");
    const [updatedDocument, setUpdatedDocument] = useState([]);
    const [dailyContest,setDailyContest] = useState([]);
    const [portfolios,setPortfolios] = useState([]);
    const [careers,setCareers] = useState([]);
    const [action, setAction] = useState(false);
    const [type, setType] = useState(id?.portfolio?.portfolioName.includes('Workshop')?'Workshop':'Job');

    const [formState,setFormState] = useState({
        contestName:'' || id?.contestName,
        contestStartTime: dayjs(id?.contestStartTime) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
        contestEndTime:  dayjs(id?.contestEndTime) ?? dayjs(new Date()).set('hour', 23).set('minute', 59).set('second', 59),
        allowedUsers: [{addedOn:'',userId:''}],
        contestStatus:'' || id?.contestStatus,
        contestOn:'' || id?.contestOn,
        maxParticipants: '' || id?.maxParticipants,
        payoutPercentage: '' || id?.payoutPercentage,
        entryFee: '' || id?.entryFee,
        description: '' || id?.description,
        portfolio: {
            id: "" || id?.portfolio?._id,
            portfolioName: "" || id?.portfolio?.portfolioName,
            portfolioValue: "" || id?.portfolio?.portfolioValue,
        },
        registeredUsers: {
          userId: "",
          registeredOn: "",
          status: "",
          exitDate: "",
      },
    });

    const [childFormState,setChildFormState] = useState({
      gdTitle:'',
      gdTopic: '',
      gdEndDate: '',
      gdEndDate: '',
      meetLink: '',
  });

    useEffect(()=>{
        setTimeout(()=>{
            id && setUpdatedDocument(id)
            setIsLoading(false);
        },500)
    },[])


    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/portfolio/dailycontest`)
        .then((res)=>{
          console.log("Contest Portfolios :",res?.data?.data)
          setPortfolios(res?.data?.data);
        }).catch((err)=>{
            return new Error(err)
        })

    
        axios.get(`${baseUrl}api/v1/dailycontest/${id?._id}`)
        .then((res)=>{
          console.log("Daily Contest :",res?.data?.data)
          setDailyContest(res?.data?.data);
          setTimeout(()=>{
            setIsLoading(false)
          },500)
        //   setIsLoading(false).setTimeout(30000);
        }).catch((err)=>{
            console.log("Error in useeffect: ",err)
        })    
    },[])

    const handleTypeChange = (e) =>{
      const value = e.target.value;
      console.log('e target value', value);
      setType(prev=>value);
      setFormState(prevState => ({
        ...prevState,
        portfolio: {id: '', name: ''},
        career: {id: '', name: ''},

      }))
    }
    const handlePortfolioChange = (event) => {
        const {
          target: { value },
        } = event;
        let portfolioId = portfolios?.filter((elem)=>{
            return elem.portfolioName === value;
        })
        setFormState(prevState => ({
          ...prevState,
          portfolio: {id: portfolioId[0]?._id, name: portfolioId[0]?.portfolioName}
        }))
        console.log("portfolioId", portfolioId, formState)
      };

    const handleCareerChange = (event) => {
    const {
        target: { value },
    } = event;
    let careerId = careers?.filter((elem)=>{
        return elem.jobTitle === value;
    })
    setFormState(prevState => ({
        ...prevState,
        career: {id: careerId[0]?._id, name: careerId[0]?.jobTitle}
    }))
    console.log("careerId", careerId, formState)
    };

    async function onSubmit(e,formState){
      e.preventDefault()
      console.log(formState)
      if(!formState.contestName || !formState.contestStartTime || !formState.contestEndTime || !formState.contestStatus || !formState.career || !formState.portfolio){
      
          setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
          return openErrorSB("Missing Field","Please fill all the mandatory fields")
      }
        if((type == 'Job' && !formState?.portfolio.name.toLowerCase().includes('internship')) || (type == 'Workshop' && !formState?.portfolio.name.toLowerCase().includes('workshop'))){
        console.log('true');
        return openErrorSB("Wrong Portfolio","Please check the portfolio and type compatibility");
      }


      
      console.log("Is Submitted before State Update: ",isSubmitted)
      setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
      const {contestName, contestStartTime, contestEndTime, contestStatus, career, portfolio} = formState;
      const res = await fetch(`${baseUrl}api/v1/internbatch/`, {
          method: "POST",
          credentials:"include",
          headers: {
              "content-type" : "application/json",
              "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify({
            contestName, contestStartTime, contestEndTime, contestStatus, career : career.id, portfolio: portfolio.id 
          })
      });
      
      
      const data = await res.json();
      console.log(data,res.status);
      if (res.status !== 201) {
          setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
          openErrorSB("Contest not created",data?.message)
      } else {
          openSuccessSB("Contest Created",data?.message)
          setNewObjectId(data?.data?._id)
          console.log("New Object Id: ",data?.data?._id,newObjectId)
          setIsSubmitted(true)
          setDailyContest(data?.data);
          setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
        }
    }

    async function addAllowedUser(e,childFormState,setChildFormState){
      e.preventDefault()
      console.log(childFormState)
      setSaving(true)
      if(!childFormState?.gdTitle || !childFormState?.gdTopic || !childFormState?.meetLink || !childFormState?.gdStartDate || !childFormState?.gdEndDate){
          setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
          return openErrorSB("Missing Field","Please fill all the mandatory fields")
      }
      const {gdTitle, gdTopic, meetLink, gdStartDate, gdEndDate} = childFormState;
    
      const res = await fetch(`${baseUrl}api/v1/gd/`, {
          method: "POST",
          credentials:"include",
          headers: {
              "content-type" : "application/json",
              "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify({
            gdTitle, gdTopic, meetLink, gdStartDate, gdEndDate, dailyContest : dailyContest
          })
      });
      const data = await res.json();
      console.log(data);
      if (res.status !== 201) {
          openErrorSB("Error",data.message)
      } else {
          openSuccessSB("Success",data.message)
          setTimeout(()=>{setSaving(false);setEditing(false)},500)
      }
    }

    async function onEdit(e,formState){
        e.preventDefault()
        console.log("Edited FormState: ",formState,id._id)
        setSaving(true)
        console.log(formState)
        if(!formState.contestName || !formState.contestStartTime || !formState.contestEndTime || !formState.contestStatus || !formState.career || !formState.portfolio){
            setTimeout(()=>{setSaving(false);setEditing(true)},500)
            return openErrorSB("Missing Field","Please fill all the mandatory fields")
        }
        const { contestName, contestStartTime, contestEndTime, contestStatus, career, portfolio } = formState;
    
        const res = await fetch(`${baseUrl}api/v1/dailycontest/${id._id}`, {
            method: "PATCH",
            credentials:"include",
            headers: {
                "content-type" : "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
              contestName, contestStartTime, contestEndTime, contestStatus, portfolio: portfolio.id 
            })
        });
    
        const data = await res.json();
        console.log(data);
        if (data.status === 422 || data.error || !data) {
            openErrorSB("Error",data.error)
        } else {
            openSuccessSB("Contest Edited", "Edited Successfully")
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

const handleChange = (e) => {
  const {name, value} = e.target;
  if (!formState[name]?.includes(e.target.value)) {
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }
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
          Fill Contest Details
        </MDTypography>
        </MDBox>

        <Grid container display="flex" flexDirection="row" justifyContent="space-between">
        <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>
          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Contest Name *'
                name='contestName'
                fullWidth
                defaultValue={editing ? formState?.contestName : id?.contestName}
                onChange={handleChange}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-1} mb={2.5}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['MobileDateTimePicker']}>
                <DemoItem>
                  <MobileDateTimePicker 
                    label="Contest Start Time"
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    value={formState?.contestStartTime || dayjs(dailyContest?.contestStartTime)}
                    onChange={(newValue) => {
                      if (newValue && newValue.isValid()) {
                        setFormState(prevState => ({ ...prevState, contestStartTime: newValue }))
                      }
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
                      label="Contest End Time"
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      value={formState?.contestEndTime || dayjs(dailyContest?.contestEndTime)}
                      onChange={(newValue) => {
                        if (newValue && newValue.isValid()) {
                          setFormState(prevState => ({ ...prevState, contestEndTime: newValue }))
                        }
                      }}
                      minDateTime={null}
                      sx={{ width: '100%' }}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
          </Grid>

           {!id && <Grid item xs={12} md={3} xl={3}>
                <FormControl sx={{ minHeight:10, minWidth:263 }}>
                  <InputLabel id="demo-multiple-name-label">Contest Type</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    name='contestType'
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    // defaultValue={id ? portfolios?.portfolio : ''}
                    value={formState?.type}
                    onChange={handleTypeChange}
                    input={<OutlinedInput label="Contest Type" />}
                    sx={{minHeight:45}}
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
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Max Participants *'
                name='maxParticipants'
                fullWidth
                type='number'
                defaultValue={editing ? formState?.maxParticipants : id?.maxParticipants}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={3} mb={2}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Payout Percentage *'
                name='payoutPercentage'
                fullWidth
                type='number'
                defaultValue={editing ? formState?.payoutPercentage : id?.payoutPercentage}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={3} mb={2}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Contest On *'
                name='contestOn'
                fullWidth
                type='text'
                defaultValue={editing ? formState?.contestOn : id?.contestOn}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={3} mb={2}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Entry Fee *'
                name='contestOn'
                fullWidth
                type='number'
                defaultValue={editing ? formState?.entryFee : id?.entryFee}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={12} mt={-2}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Description *'
                name='description'
                fullWidth
                defaultValue={editing ? formState?.description : id?.description}
                onChange={handleChange}
              />
            </Grid>

           <Grid item xs={12} md={3} xl={3}>
                <FormControl sx={{ minHeight:10, minWidth:263 }}>
                  <InputLabel id="demo-multiple-name-label">Portfolio</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    name='portfolio'
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    value={formState?.portfolio?.name || dailyContest?.portfolio?.portfolioName}
                    onChange={handlePortfolioChange}
                    input={<OutlinedInput label="Portfolio" />}
                    sx={{minHeight:45}}
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
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Contest Status *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                name='contestStatus'
                value={formState?.contestStatus || id?.contestStatus}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    contestStatus: e.target.value
                }))}}
                label="Contest Status"
                sx={{ minHeight:43 }}
                >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
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
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{navigate("/dailycontest")}}>
                        Cancel
                    </MDButton>
                    </>
                    )}
                    {(isSubmitted || id) && !editing && (
                    <>
                    <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} onClick={()=>{setEditing(true)}}>
                        Edit
                    </MDButton>
                    <MDButton variant="contained" color="info" size="small" onClick={()=>{navigate('/dailycontest')}}>
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

            {(isSubmitted || id) && !editing && 
                <Grid item xs={12} md={6} xl={12}>
                    
                    <Grid container spacing={2}>

                    <Grid item xs={12} md={6} xl={12} mb={1}>
                    <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                        Add Allowed Users
                    </MDTypography>
                    </Grid>
                    
                    {/* Add field to search users and add them */}
            
                    <Grid item xs={12} md={6} xl={3}>
                        {/* <IoMdAddCircle cursor="pointer" onClick={(e)=>{onAddFeature(e,formState,setFormState)}}/> */}
                        <MDButton 
                          variant='contained' 
                          color='success' 
                          size='small' 
                          onClick={(e)=>{addAllowedUser(e,childFormState,setChildFormState)}}>Create GD</MDButton>
                    </Grid>
    
                    </Grid>
    
                </Grid>}

                {(isSubmitted || id) && <Grid item xs={12} md={12} xl={12} mt={2}>
                    <MDBox>
                        <AllowedUsers saving={saving} dailyContest={dailyContest} updatedDocument={updatedDocument} setUpdatedDocument={setUpdatedDocument} action={action} setAction={setAction}/>
                    </MDBox>
                </Grid>}

                {(id || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                    <MDBox>
                        <RegisteredUsers dailyContest={newObjectId ? newObjectId : id?._id} action={action} setAction={setAction}/>
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