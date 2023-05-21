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
import BatchParticipants from "./data/participants";
import GroupDiscussions from './data/groupDiscussions';
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
    console.log(id)
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
    const [batch,setBatch] = useState([]);
    const [portfolios,setPortfolios] = useState([]);
    const [careers,setCareers] = useState([]);

    const [formState,setFormState] = useState({
        batchName:'' || id?.batchName,
        batchStartDate: dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0) || id?.batchStartDate,
        batchEndDate: dayjs(new Date()).set('hour', 23).set('minute', 59).set('second', 59) || id?.batchEndDate,
        participants: [{collegeName:'',joinedOn:'',userId:''}],
        batchStatus:'' || id?.batchStatus,
        career: {
            id: "" || id?.career?._id,
            jobTitle: "" || id?.career?.jobTitle,
        },
        portfolio: {
            id: "" || id?.portfolio?._id,
            portfolioName: "" || id?.portfolio?.portfolioName,
            portfolioValue: "" || id?.portfolio?.portfolioValue,
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
        console.log("inside useeffect")
        axios.get(`${baseUrl}api/v1/portfolio/internship`)
        .then((res)=>{
          console.log("Internship Portfolios :",res?.data?.data)
          setPortfolios(res?.data?.data);
        }).catch((err)=>{
            return new Error(err)
        })

        axios.get(`${baseUrl}api/v1/career`)
        .then((res)=>{
          console.log("Careers :",res?.data?.data)
          setCareers(res?.data?.data);
        }).catch((err)=>{
            return new Error(err)
        })
    
        axios.get(`${baseUrl}api/v1/internbatch/${id?._id}`)
        .then((res)=>{
          console.log("Batch :",res?.data?.data)
          setBatch(res?.data?.data);
          setTimeout(()=>{
            setIsLoading(false)
          },500)
        //   setIsLoading(false).setTimeout(30000);
        }).catch((err)=>{
            console.log("Error in useeffect: ",err)
        })    
    },[])

    const handlePortfolioChange = (event) => {
        const {
          target: { value },
        } = event;
        // setRuleName(value)
        let portfolioId = portfolios?.filter((elem)=>{
            return elem.portfolioName === value;
        })
    
        // console.log("portfolioId", portfolioId)
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
    // setRuleName(value)
    let careerId = careers?.filter((elem)=>{
        return elem.jobTitle === value;
    })

    // console.log("portfolioId", portfolioId)
    setFormState(prevState => ({
        ...prevState,
        career: {id: careerId[0]?._id, name: careerId[0]?.jobTitle}
    }))
    console.log("careerId", careerId, formState)
    };

    async function onSubmit(e,formState){
      e.preventDefault()
      console.log(formState)
      if(!formState.batchName || !formState.batchStartDate || !formState.batchEndDate || !formState.batchStatus || !formState.career || !formState.portfolio){
      
          setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
          return openErrorSB("Missing Field","Please fill all the mandatory fields")
      }
      // console.log("Is Submitted before State Update: ",isSubmitted)
      setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
      const {batchName, batchStartDate, batchEndDate, batchStatus, career, portfolio} = formState;
      const res = await fetch(`${baseUrl}api/v1/internbatch/`, {
          method: "POST",
          credentials:"include",
          headers: {
              "content-type" : "application/json",
              "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify({
            batchName, batchStartDate, batchEndDate, batchStatus, career : career.id, portfolio: portfolio.id 
          })
      });
      
      
      const data = await res.json();
      console.log(data,res.status);
      if (res.status !== 201) {
          setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
          openErrorSB("Batch not created",data?.message)
      } else {
          openSuccessSB("Batch Created",data?.message)
          setNewObjectId(data?.data?._id)
          console.log("New Object Id: ",data?.data?._id,newObjectId)
          setIsSubmitted(true)
          setBatch(data?.data);
          setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
        }
    }

    async function createGD(e,childFormState,setChildFormState){
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
            gdTitle, gdTopic, meetLink, gdStartDate, gdEndDate, batch : batch
          })
      });
      const data = await res.json();
      console.log(data);
      if (res.status !== 201) {
          openErrorSB("Error",data.message)
      } else {
          // setUpdatedDocument(data?.data);
          openSuccessSB("Success",data.message)
          setTimeout(()=>{setSaving(false);setEditing(false)},500)
          // setChildFormState(prevState => ({
          //     ...prevState,
          //     rolesAndResponsibilities: {}
          // }))
      }
    }

    async function onEdit(e,formState){
        e.preventDefault()
        console.log("Edited FormState: ",formState,id._id)
        setSaving(true)
        console.log(formState)
        if(!formState.batchName || !formState.batchStartDate || !formState.batchEndDate || !formState.batchStatus || !formState.career || !formState.portfolio){
            setTimeout(()=>{setSaving(false);setEditing(true)},500)
            return openErrorSB("Missing Field","Please fill all the mandatory fields")
        }
        const { batchName, batchStartDate, batchEndDate, batchStatus, career, portfolio } = formState;
    
        const res = await fetch(`${baseUrl}api/v1/internbatch/${id._id}`, {
            method: "PATCH",
            credentials:"include",
            headers: {
                "content-type" : "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                batchName, batchStartDate, batchEndDate, batchStatus, career: career.id, portfolio: portfolio.id 
            })
        });
    
        const data = await res.json();
        console.log(data);
        if (data.status === 422 || data.error || !data) {
            openErrorSB("Error",data.error)
        } else {
            openSuccessSB("Batch Edited", "Edited Successfully")
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


console.log(id)

const handleChange = (e) => {
  if (!formState.batchName.includes(e.target.value)) {
    setFormState(prevState => ({
      ...prevState,
      batchName: e.target.value,
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
          Fill Batch Details
        </MDTypography>
        </MDBox>

        <Grid container display="flex" flexDirection="row" justifyContent="space-between">
        <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>
          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Batch Name *'
                fullWidth
                // defaultValue={portfolioData?.portfolioName}
                defaultValue={editing ? formState?.batchName : id?.batchName}
                // onChange={(e) => {setFormState(prevState => ({
                //     ...prevState,
                //     batchName: e.target.value
                //   }))}}
                onChange={handleChange}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={-1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                    <DatePicker
                    label="Batch Start Date"
                    value={formState?.batchStartDate || dayjs(batch?.batchStartDate)}
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    onChange={(e) => {
                      const selectedDate = dayjs(e);
                      const startOfDay = selectedDate.set('hour', 0).set('minute', 0).set('second', 0);
                      setFormState(prevState => ({ ...prevState, batchStartDate: startOfDay }))
                    }}
                    sx={{ width: '100%' }}
                    />
                </DemoContainer>
                </LocalizationProvider>
           </Grid>

           <Grid item xs={12} md={6} xl={3} mt={-1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                    <DatePicker
                    label="Batch End Date"
                    value={formState?.batchEndDate || dayjs(batch?.batchEndDate)}
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    onChange={(e) => {
                      const selectedDate = dayjs(e);
                      const endOfDay = selectedDate.set('hour', 23).set('minute', 59).set('second', 59);
                      setFormState(prevState => ({ ...prevState, batchEndDate: endOfDay }))
                    }}
                    sx={{ width: '100%' }}
                    />
                </DemoContainer>
                </LocalizationProvider>
           </Grid>

           <Grid item xs={12} md={3} xl={3}>
                <FormControl sx={{ minHeight:10, minWidth:263 }}>
                  <InputLabel id="demo-multiple-name-label">Portfolio</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    // defaultValue={id ? portfolios?.portfolio : ''}
                    value={formState?.portfolio?.name || batch?.portfolio?.portfolioName}
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

            <Grid item xs={12} md={3} xl={3}>
                <FormControl sx={{ minHeight:10, minWidth:263 }}>
                  <InputLabel id="demo-multiple-name-label">Career</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    // defaultValue={id ? portfolios?.portfolio : ''}
                    value={formState?.career?.name || batch?.career?.jobTitle}
                    onChange={handleCareerChange}
                    input={<OutlinedInput label="Career" />}
                    sx={{minHeight:45}}
                    MenuProps={MenuProps}
                  >
                    {careers?.map((career) => (
                      <MenuItem
                        key={career?.jobTitle}
                        value={career?.jobTitle}
                      >
                        {career.jobTitle}
                      </MenuItem>
                    ))}
                  </Select>
            </FormControl>
            </Grid>

          <Grid item xs={12} md={6} xl={3}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Batch Status *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={formState?.batchStatus || id?.batchStatus}
                // value={oldObjectId ? contestData?.status : formState?.status}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    batchStatus: e.target.value
                }))}}
                label="Batch Status"
                sx={{ minHeight:43 }}
                >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
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
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{navigate("/internshipbatch")}}>
                        Cancel
                    </MDButton>
                    </>
                    )}
                    {(isSubmitted || id) && !editing && (
                    <>
                    <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} onClick={()=>{setEditing(true)}}>
                        Edit
                    </MDButton>
                    <MDButton variant="contained" color="info" size="small" onClick={()=>{navigate('/internshipbatch')}}>
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
                        Create Group Discussion
                    </MDTypography>
                    </Grid>
                    
                    <Grid item xs={12} md={1.35} xl={3}>
                        <TextField
                            id="outlined-required"
                            label='Title'
                            fullWidth
                            type="text"
                            // value={formState?.features?.orderNo}
                            onChange={(e) => {setChildFormState(prevState => ({
                                ...prevState,
                                gdTitle: e.target.value
                            }))}}
                        />
                    </Grid>
        
                    <Grid item xs={12} md={6} xl={6}>
                        <TextField
                            id="outlined-required"
                            label='Topic *'
                            fullWidth
                            type="text"
                            // value={formState?.features?.description}
                            onChange={(e) => {setChildFormState(prevState => ({
                                ...prevState,
                                gdTopic: e.target.value
                            }))}}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} xl={3}>
                        <TextField
                            id="outlined-required"
                            label='Meet Link *'
                            fullWidth
                            type="text"
                            // value={formState?.features?.description}
                            onChange={(e) => {setChildFormState(prevState => ({
                                ...prevState,
                                meetLink: e.target.value
                            }))}}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} xl={3} mt={-1} mb={2.5}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['MobileDateTimePicker']}>
                        <DemoItem>
                          <MobileDateTimePicker 
                            label="GD Start Date"
                            // disabled={((isSubmitted || id) && (!editing || saving))}
                            // defaultValue={dayjs(oldObjectId ? contestData?.contestEndDate : setFormState?.contestEndDate)}
                            onChange={(e) => {setChildFormState(prevState => ({
                              ...prevState,
                              gdStartDate: dayjs(e)
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
                            label="GD End Date"
                            // disabled={((isSubmitted || id) && (!editing || saving))}
                            // defaultValue={dayjs(oldObjectId ? contestData?.contestEndDate : setFormState?.contestEndDate)}
                            onChange={(e) => {setChildFormState(prevState => ({
                              ...prevState,
                              gdEndDate: dayjs(e)
                            }))}}
                            sx={{ width: '100%' }}
                          />
                        </DemoItem>
                      </DemoContainer>
                    </LocalizationProvider>
                    </Grid>
            
                    <Grid item xs={12} md={6} xl={3}>
                        {/* <IoMdAddCircle cursor="pointer" onClick={(e)=>{onAddFeature(e,formState,setFormState)}}/> */}
                        <MDButton 
                          variant='contained' 
                          color='success' 
                          size='small' 
                          onClick={(e)=>{createGD(e,childFormState,setChildFormState)}}>Create GD</MDButton>
                    </Grid>
    
                    </Grid>
    
                </Grid>}

                {(isSubmitted || id) && <Grid item xs={12} md={12} xl={12} mt={2}>
                    <MDBox>
                        <GroupDiscussions saving={saving} batch={batch} updatedDocument={updatedDocument} setUpdatedDocument={setUpdatedDocument}/>
                    </MDBox>
                </Grid>}

                {(id || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                    <MDBox>
                        <BatchParticipants batch={newObjectId ? newObjectId : id?._id}/>
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