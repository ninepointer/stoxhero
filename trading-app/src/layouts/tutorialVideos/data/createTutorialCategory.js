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
import CategoryVideos from './categoryVideos';


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

export default function TutorialCategory() {
const location = useLocation();
const navigate = useNavigate();
const  id  = location?.state?.data;
const [videos,setVideos] = useState(0);
const [tutorialCategory,setTutorialCategory] = useState([]);
const [isLoading,setIsLoading] = useState(id ? true : false)
const [saving,setSaving] = useState(false)
const [editing,setEditing] = useState(false)
const [isSubmitted,setIsSubmitted] = useState(false);
const [creating,setCreating] = useState(false);
const [newObjectId, setNewObjectId] = useState("");
const [updatedDocument, setUpdatedDocument] = useState([]);


console.log("location", location, id)
let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"

const [formState,setFormState] = useState({
    categoryName:'',
    status:'',
    description:'',
    categoryVideos: {
        title: "",
        videoId: ""
    },
});

React.useEffect(()=>{
    setTimeout(()=>{
        id && setUpdatedDocument(id)
        setIsLoading(false);
    },500)
},[])


React.useEffect(()=>{

    axios.get(`${baseUrl}api/v1/tutorialcategory/${id?._id}`)
    .then((res)=>{
      console.log(res?.data?.data)
      setTutorialCategory(res?.data?.data);
      setVideos(res?.data?.data?.categoryVideos?.length);
      setFormState({
        categoryName: res.data.data?.categoryName || '',
        status: res.data.data?.status || '',
        description: res.data.data?.description || '',
      });
      setTimeout(()=>{
        setIsLoading(false)
      },500)
    //   setIsLoading(false).setTimeout(30000);
    }).catch((err)=>{
        return new Error(err)
    })    
},[])

async function onEdit(e,formState){
    e.preventDefault()
    setSaving(true)
    console.log(formState)
    if(!formState.categoryName || !formState.status || !formState.description){
        setTimeout(()=>{setSaving(false);setEditing(true)},500)
        return openErrorSB("Missing Field","Please fill all the mandatory fields")
    }
    const { categoryName, status, description } = formState;

    const res = await fetch(`${baseUrl}api/v1/tutorialcategory/${id}`, {
        method: "PATCH",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            categoryName, status, description 
        })
    });

    const data = await res.json();
    console.log(data);
    if (data.status === 422 || data.error || !data) {
        openErrorSB("Error",data.error)
    } else {
        openSuccessSB("Slab Edited", "Edited Successfully")
        setTimeout(()=>{setSaving(false);setEditing(false)},500)
        console.log("entry succesfull");
    }
}

  async function onSubmit(e,formState){
    e.preventDefault()
    console.log(formState)
    if(!formState.categoryName || !formState.status || !formState.description ){
    
        setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
        return openErrorSB("Missing Field","Please fill all the mandatory fields")
    }
    setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
    const {categoryName, status, description} = formState;
    const res = await fetch(`${baseUrl}api/v1/tutorialcategory/`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            categoryName, status, description
        })
    });
    
    
    const data = await res.json();
    if (data.status === 422 || data.error || !data) {
        setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
    } else {
        setNewObjectId(data?.data._id)
        openSuccessSB("Category Created",data.message)
        setIsSubmitted(true)
        setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
      }
  }

  async function AddVideo(e,childFormState,setChildFormState){
    e.preventDefault()
    setSaving(true)
    console.log(id,newObjectId)
    if(!childFormState?.title || !childFormState?.videoId){
        setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
        return openErrorSB("Missing Field","Please fill all the mandatory fields")
    }
    const {title, videoId} = childFormState;
  
    const res = await fetch(`${baseUrl}api/v1/tutorialcategory/${id ? id?._id : newObjectId}`, {
        method: "PATCH",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
            categoryVideos:{title, videoId}
        })
    });
    const data = await res.json();
    console.log(data);
    if (data.status === 422 || data.error || !data) {
        openErrorSB("Error",data.error)
    } else {
        setUpdatedDocument(data?.data);
        setVideos(data?.data?.categoryVideos?.length);
        openSuccessSB("Video Added","New Video has been added.")
        setTimeout(()=>{setSaving(false);setEditing(false)},500)
        setChildFormState(prevState => ({
            ...prevState,
            categoryVideos: {}
        }))
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
                Fill Tutorial Video Category Details
            </MDTypography>
            </MDBox>

            <Grid container display="flex" flexDirection="row" justifyContent="space-between">
            <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>
            <Grid item xs={12} md={6} xl={3}>
                <TextField
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    id="outlined-required"
                    label='Category Name *'
                    fullWidth
                    // defaultValue={portfolioData?.portfolioName}
                    value={formState?.categoryName || tutorialCategory?.categoryName}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        categoryName: e.target.value
                    }))}}
                />
            </Grid>
            
            <Grid item xs={12} md={6} xl={3}>
                <FormControl sx={{width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                    <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={formState?.status || tutorialCategory?.status}
                    // value={oldObjectId ? contestData?.status : formState?.status}
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    onChange={(e) => {setFormState(prevState => ({
                        ...prevState,
                        status: e.target.value
                    }))}}
                    label="Status"
                    sx={{ minHeight:43 }}
                    >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6} xl={12}>
                <TextField
                    disabled={((isSubmitted || id) && (!editing || saving))}
                    id="outlined-required"
                    label='Description *'
                    type='multiline'
                    fullWidth
                    // defaultValue={portfolioData?.portfolioName}
                    value={formState?.description || tutorialCategory?.description}
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
                        <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{navigate("/tutorialvideos")}}>
                            Cancel
                        </MDButton>
                        </>
                        )}
                        {(isSubmitted || id) && !editing && (
                        <>
                        <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} onClick={()=>{setEditing(true)}}>
                            Edit
                        </MDButton>
                        <MDButton variant="contained" color="info" size="small" onClick={()=>{(id || newObjectId) ? navigate("/tutorialvideos") : setIsSubmitted(false)}}>
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
                    
                    <Grid container spacing={1}>

                    <Grid item xs={12} md={6} xl={12}>
                    <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                        Add Videos
                    </MDTypography>
                    </Grid>
                    
                    <Grid item xs={12} md={6} xl={6}>
                        <TextField
                            id="outlined-required"
                            label='Title *'
                            fullWidth
                            type="text"
                            onChange={(e) => {setFormState(prevState => ({
                                ...prevState,
                                title: e.target.value
                            }))}}
                        />
                    </Grid>
        
                    <Grid item xs={12} md={6} xl={3}>
                        <TextField
                            id="outlined-required"
                            label='Video Id *'
                            fullWidth
                            type="text"
                            // value={formState?.features?.description}
                            onChange={(e) => {setFormState(prevState => ({
                                ...prevState,
                                videoId: e.target.value
                            }))}}
                        />
                    </Grid>
            
                    <Grid item xs={12} md={6} xl={3} display='flex' justifyContent='left' alignItems='center'>
                        {/* <IoMdAddCircle cursor="pointer" onClick={(e)=>{AddVideo(e,formState,setFormState)}}/> */}
                        <MDButton 
                            variant="contained" 
                            color="success" 
                            size="small"  
                            onClick={(e)=>{AddVideo(e,formState,setFormState)}}
                            >
                            Add Video
                        </MDButton>
                    </Grid>
    
                    </Grid>
    
                </Grid>}

                {/* {(isSubmitted || id) &&  */}
                <Grid item xs={12} md={12} xl={12} mt={2}>
                    <MDBox>
                        <CategoryVideos updatedDocument={updatedDocument} setUpdatedDocument={setUpdatedDocument}/>
                    </MDBox>
                </Grid>
              

                {/* {(id || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2}>
                    <MDBox>
                        <TenXSubscribers tenXSubscription={tenXSubs} subscriptionCount={subscriptionCount} setSubscriptionCount={setSubscriptionCount}/>
                    </MDBox>
                </Grid>}

                {(id || newObjectId) && <Grid item xs={12} md={12} xl={12} mt={2}>
                    <MDBox>
                        <TenXSubscriptionPurchaseIntent tenXSubscription={newObjectId ? newObjectId : id} purchaseIntentCount={purchaseIntentCount} setPurchaseIntentCount={setPurchaseIntentCount}/>
                    </MDBox>
                </Grid>}  */}

            </Grid>

            {renderSuccessSB}
            {renderErrorSB}
        </MDBox>
    )
                }
    </>
    );
}