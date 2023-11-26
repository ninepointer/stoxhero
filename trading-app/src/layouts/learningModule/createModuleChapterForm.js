import React ,{useEffect, useState} from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import { useNavigate, useLocation } from "react-router-dom";
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';


function Index() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const location = useLocation();
    const  id  = location?.state?.data;
    const [isSubmitted,setIsSubmitted] = useState(false);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [isLoading,setIsLoading] = useState(id ? true : false)
    const [editing,setEditing] = useState(false)
    const [saving,setSaving] = useState(false)
    const [creating,setCreating] = useState(false)
    const navigate = useNavigate();
    const [newObjectId, setNewObjectId] = useState(id);
    const [updatedDocument, setUpdatedDocument] = useState([]);
    const [moduleData,setModuleData] = useState([])
    const [formState,setFormState] = useState({
        chapterNumber: '' || id?.chapterNumber,
        chapterName:'' || id?.chapterName,
        chapterImage: '' || id?.chapterImage,
        chapterCateogry: '' || id?.chapterCateogry,
        chapterDescription: '' || id?.chapterDescription,
        learningModule: '' || id?.learningModule,
        chapterStatus: '' || id?.chapterStatus,
    });
    
    useEffect(()=>{
        setTimeout(()=>{
            id && setModuleData(id)
            setIsLoading(false);
        },500)
        // setCampaignUserCount(id?.users?.length);
        axios.get(`${baseUrl}api/v1/learningmodule/${id ? id?._id : newObjectId?._id}`, {withCredentials:true})
          .then((res)=>{
              setModuleData(res.data.data);
              setNewObjectId(res.data.data);
              setFormState({
                  chapterNumber: res.data.data?.chapterNumber || '',
                  chapterName: res.data.data?.chapterName || '',
                  chapterImage: res.data.data?.chapterImage || '',
                  chapterStatus: res.data?.chapterStatus || '',
                  chapterDescription: res.data?.chapterDescription || '',
                  chapterCategory: res.data?.chapterCategory || '',
                  learningModule: res.data?.learningModule || '',
                });
                  setTimeout(()=>{setIsLoading(false)},500) 
          }).catch((err)=>{
              return new Error(err);
          })
    },[isLoading,editing,saving])
    

  async function onSubmit(e,data){
      e.preventDefault();
      setCreating(true)
      console.log("Form Data: ",data)
      try{
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          console.log("data to be appended:",key, data[key])
          // formData.append(key, data[key])
          formData.append(key,data[key])
          console.log("data appended",formData)
          console.log("formState",formState)
        });
        
          if(!(formState.moduleNumber).toString() || !formState.moduleName || !formState.moduleColor || !formState.moduleStatus || !formState.moduleDescription) 
          {
            setCreating(false);
            return openErrorSB("Error","Please fill the mandatory fields.")
          }
        console.log("Calling API")
        const res = await fetch(`${baseUrl}api/v1/learningmodule`, {

          method: "POST",
          credentials:"include",
          headers: {
              // "content-type" : "application/json",
              "Access-Control-Allow-Credentials": true
          },
          body: formData 
        });

        let data1 = await res.json()
        console.log("Response:",data1)
        if (data1.data) {
          openSuccessSB("Success", data1.message)
          setIsSubmitted(true)
          setTimeout(() => { setCreating(false); setIsSubmitted(true); setEditing(false) }, 500)
        } else {
          setTimeout(() => { setCreating(false); setIsSubmitted(false); setEditing(false) }, 500)
        }
        }catch(e){
          console.log(e);
        }
  }
    

  async function onEdit(e, formState) {
    e.preventDefault()
    setSaving(true)
    if (!formState?.blogTitle || !formState?.content || !formState.author) {

      setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")

    }
    setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    const { blogTitle, content, author, thumbnailImage } = formState;
    const res = await fetch(`${baseUrl}api/v1/blogs/${id?._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        blogTitle, content, author, thumbnailImage
      })

    });

    const data = await res.json();
    const updatedData = data?.data
    if (updatedData || res.status === 200) {
      setNewObjectId(data.data);
      openSuccessSB("Blog Edited", data.message)
      setTimeout(()=>{setSaving(false);setEditing(false)},500)
    } else {
      openErrorSB("Error", "data.error")
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
      dateTime={null}
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
      dateTime={null}
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
        <MDBox pl={2} pr={2} mt={4} mb={2}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          Fill Learning Module Details
        </MDTypography>
        </MDBox>

        <Grid container display="flex" flexDirection="row" justifyContent="space-between">
        <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={9} xl={12}>
          <Grid item xs={12} md={6} lg={2}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Chapter Number *'
                fullWidth
                type='Number'
                value={formState?.chapterNumber}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    chapterNumber: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Chapter Name *'
                fullWidth
                value={formState?.chapterName}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    chapterName: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-autowidth-label">Chapter Category *</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                name='chapterCategory'
                value={formState?.chapterCategory}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {
                  setFormState(prevState => ({
                    ...prevState,
                    chapterCategory: e.target.value
                  }))
                }}
                label="Chapter Category"
                sx={{ minHeight: 43 }}
              >
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermedaite</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-autowidth-label">Chapter Status *</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                name='chapterStatus'
                value={formState?.chapterStatus}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {
                  setFormState(prevState => ({
                    ...prevState,
                    chapterStatus: e.target.value
                  }))
                }}
                label="Module Status"
                sx={{ minHeight: 43 }}
              >
                <MenuItem value="Published">Published</MenuItem>
                <MenuItem value="Unpublished">Unpublished</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={12} xl={12} mt={1}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                name="moduleDescription"
                label='Description *'
                fullWidth
                multiline
                rows={5}
                defaultValue={editing ? formState?.moduleDescription : id?.moduleDescription}
                onChange={(e) => {setFormState(prevState => ({
                  ...prevState,
                  moduleDescription: e.target.value
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
                        {creating ? <CircularProgress size={20} color="inherit" /> : "Create"}
                    </MDButton>
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{navigate("/allblogs")}}>
                        Cancel
                    </MDButton>
                    </>
                    )}
                    {(isSubmitted || id) && !editing && (
                    <>
                    <MDButton 
                      variant="contained" 
                      color="warning" 
                      size="small" 
                      sx={{mr:1, ml:1}} 
                      onClick={(e)=>{setEditing(true)}}
                    >
                        Edit
                    </MDButton>
                    <MDButton variant="contained" color="info" size="small" onClick={()=>{navigate('/learningmodules')}}>
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
                        sx={{mr:1, ml:1}} 
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
    )
}
export default Index;