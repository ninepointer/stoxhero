import * as React from 'react';
import {useContext, useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import axios from "axios";
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import DefaultCarouselImage from '../../assets/images/defaultcarousel.png'
import OutlinedInput from '@mui/material/OutlinedInput';
import CarouselClickedBy from './data/clickedByData'

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      maxWidth: "100%",
    },
  },
};


function Index() {

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const location = useLocation();
    const  id  = location?.state?.data;
    console.log("Carousel:",id)
    let [photo,setPhoto] = useState(id ? id?.carouselImage : DefaultCarouselImage)
    const [imageFile, setImageFile] = useState(id ? id?.carouselImage : DefaultCarouselImage);
    const [previewUrl, setPreviewUrl] = useState('');
    const [carousel,setCarousel] = useState([]);
    const [isSubmitted,setIsSubmitted] = useState(false);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    const [isLoading,setIsLoading] = useState(id ? true : false)
    const [editing,setEditing] = useState(id ? false : true)
    const [saving,setSaving] = useState(false)
    const [creating,setCreating] = useState(false)
    const navigate = useNavigate();
    const [formState,setFormState] = useState({
        carouselName:'' || id?.carouselName,
        description:'' || id?.description,
        carouselStartDate: dayjs(id?.carouselStartDate) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
         carouselEndDate: dayjs(id?.carouselEndDate) ?? dayjs(new Date()).set('hour', 0).set('minute', 0).set('second', 0),
        carouselImage:'' || id?.carouselImage,
        status:'' || id?.status,
        clickable: '' || id?.clickable,
        linkToCarousel: '' || id?.linkToCarousel,
        window: '' || id?.window,
        carouselPosition: '' || id?.carouselPosition,
        visibility: '' || id?.visibility
    });
    console.log("Initial FormState:", formState)

    useEffect(()=>{
      setTimeout(()=>{
          id && setCarousel(id)
          setIsLoading(false);
      },500)

      axios.get(`${baseUrl}api/v1/carousels/${id}`, {withCredentials:true})
      .then((res)=>{
        setCarousel(res?.data?.data);
        setFormState({
          carouselName:'' || res.data?.carouselName,
          description:'' || res.data?.description,
          carouselStartDate:'' || res.data?.carouselStartDate,
          carouselEndDate:'' || res.data?.carouselEndDate,
          carouselImage:'' || res.data?.carouselImage,
          status:'' || res.data?.status,
          clickable: '' || res.data?.clickable,
          linkToCarousel: '' || res.data?.linkToCarousel,
          window: '' || res.data?.window,
          carouselPosition: '' || res.data?.carouselPosition,
          visibility: '' || res.data?.visibility
        });
          setTimeout(()=>{setIsLoading(false)},500) 
      // setIsLoading(false)
        }).catch((err)=>{
            //window.alert("Server Down");
            return new Error(err);
        })
      // setCampaignUserCount(id?.users?.length);
    },[id,isSubmitted])

    async function onSubmit(e,data){
        e.preventDefault();
        setCreating(true)
        console.log("Form Data: ",data)
        try{
          const formData = new FormData();
          Object.keys(data).forEach((key) => {
            console.log("data to be appended")
            formData.append('blogContent', data[key])
            // formData.append('blogContent', JSON.stringify(childFormState.blogContent));
            console.log("data appended",formData)
            console.log("formState",formState)
          });
          
            if(!formState.carouselName || !formState.description || 
              !formState.carouselStartDate || !formState.carouselEndDate
              || !formState.status || !formState.clickable || !formState.visibility
              || !formState.carouselImage || !formState.linkToCarousel || !formState.carouselPosition
              ) 
            {
              setCreating(false);
              return openErrorSB("Error","Please fill the mandatory fields.")
            }
          
          const res = await fetch(`${baseUrl}api/v1/carousels`, {
  
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

    async function onEdit(e, data) {
      e.preventDefault();
      console.log("Form Data: ", formState);
      setSaving(true);

      try {
        const formData1 = new FormData();
        Object.keys(data).forEach((key) => {
          formData1.append(key, data[key]);
        });

        if (!formState.carouselName || !formState.description ||
            !formState.carouselStartDate || !formState.carouselEndDate ||
            !formState.status || !formState.carouselImage ||
            !formState.linkToCarousel || !formState.carouselPosition) 
        {
          setSaving(false)
          return openErrorSB("Error", "Please upload the required fields.")
        }
          
        setTimeout(() => { setIsSubmitted(true); }, 500);
    
        const res = await fetch(`${baseUrl}api/v1/carousels/${id?._id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Access-Control-Allow-Credentials": true,
          },
          body: formData1
        });
    
        const response = await res.json();
        const updatedData = response?.data;
        if (updatedData) {
          openSuccessSB("Carousel Edited", response.message);
          setTimeout(() => { setSaving(false); setEditing(false); }, 500);
        } else {
          openErrorSB("Error", "data.error");
        }
      } catch(e) {
        console.log(e);
      }
    }

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      setImageFile(file);
  
      // Create a FileReader instance
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    };

  
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
          Fill Carousel Details
        </MDTypography>
        </MDBox>

        <Grid container display="flex" flexDirection="row" justifyContent="space-between">
            <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={9} xl={9}>
                
                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Carousel Name *'
                      fullWidth
                      // defaultValue={id?.carouselName}
                      value={formState?.carouselName}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          carouselName: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={6} xl={6}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Link *'
                      fullWidth
                      // defaultValue={portfolioData?.portfolioName}
                      value={formState?.linkToCarousel}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          linkToCarousel: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                    <FormControl sx={{width: "100%" }}>
                      <InputLabel id="demo-simple-select-autowidth-label">Visibility *</InputLabel>
                      <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      value={formState?.visibility}
                      defaultValue="All"
                      // value={oldObjectId ? contestData?.status : formState?.status}
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          visibility: e.target.value
                      }))}}
                      label="Visibility"
                      sx={{ minHeight:43 }}
                      >
                      <MenuItem value="Infinity">Infinity</MenuItem>
                      <MenuItem value="StoxHero">StoxHero</MenuItem>
                      <MenuItem value="All">All</MenuItem>
                      </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Carousel Position *'
                      fullWidth
                      type="number"
                      value={formState?.carouselPosition}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          carouselPosition: e.target.value
                        }))}}
                    />
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['MobileDateTimePicker']}>
                        <DemoItem>
                          <MobileDateTimePicker 
                            label="Carousel Start Date"
                            disabled={((isSubmitted || id) && (!editing || saving))}
                            value={formState?.carouselStartDate || dayjs(carousel?.carouselStartDate)}
                            onChange={(e) => {
                              setFormState(prevState => ({
                                ...prevState,
                                carouselStartDate: dayjs(e)
                              }))
                            }}
                            minDateTime={null}
                            sx={{ width: '100%' }}
                          />
                        </DemoItem>
                      </DemoContainer>
                    </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['MobileDateTimePicker']}>
                        <DemoItem>
                          <MobileDateTimePicker 
                            label="Contest End Date"
                            disabled={((isSubmitted || id) && (!editing || saving))}
                            // defaultValue={dayjs(setFormState?.carouselEndDate)}
                            value={formState?.carouselEndDate || dayjs(carousel?.carouselEndDate)}
                            onChange={(e) => {
                                setFormState(prevState => ({
                                ...prevState,
                                carouselEndDate: dayjs(e)
                                }))
                            }}
                            minDateTime={null}
                            sx={{ width: '100%' }}
                          />
                        </DemoItem>
                      </DemoContainer>
                    </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                    <FormControl sx={{width: "100%" }}>
                      <InputLabel id="demo-simple-select-autowidth-label">Clicklable *</InputLabel>
                      <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      value={formState?.clickable}
                      defaultValue={false}
                      // value={oldObjectId ? contestData?.status : formState?.status}
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          clickable: e.target.value
                      }))}}
                      label="Clickable"
                      sx={{ minHeight:43 }}
                      >
                      <MenuItem value={true}>True</MenuItem>
                      <MenuItem value={false}>False</MenuItem>
                      </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                    <FormControl sx={{width: "100%" }}>
                      <InputLabel id="demo-simple-select-autowidth-label">Window *</InputLabel>
                      <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      value={formState?.window}
                      // value={oldObjectId ? contestData?.status : formState?.status}
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          window: e.target.value
                      }))}}
                      label="Window"
                      sx={{ minHeight:43 }}
                      >
                      <MenuItem value="In App">In App</MenuItem>
                      <MenuItem value="New Tab">New Tab</MenuItem>
                      </Select>
                    </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6} xl={3} mt={1}>
                    <FormControl sx={{width: "100%" }}>
                      <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                      <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      value={formState?.status}
                      // value={oldObjectId ? contestData?.status : formState?.status}
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          status: e.target.value
                      }))}}
                      label="Status"
                      sx={{ minHeight:43 }}
                      >
                      <MenuItem value="Live">Live</MenuItem>
                      <MenuItem value="Draft">Draft</MenuItem>
                      </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={1}>
                    <MDButton variant="outlined" style={{fontSize:10}} fullWidth color="success" component="label">
                      {!formState?.carouselImage?.name ? "Upload Carousel Image" : "Upload Another File?"}
                      <input 
                      hidden 
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      accept="image/*" 
                      type="file" 
                      // defaultValue={formState?.carouselImage}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          carouselImage: e.target.files[0]
                        }));
                        handleImageUpload(e);
                      }}
                      />
                    </MDButton>
                </Grid>

                <Grid item xs={12} md={6} xl={3} mt={.75} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                  <TextField
                          disabled
                          id="outlined-required"
                          // label='Selected Carousel Image'
                          fullWidth
                          // defaultValue={portfolioData?.portfolioName}
                          value={id ? id?.carouselImage.split("/")[6]  : (formState?.carouselImage?.name ? formState?.carouselImage?.name : "No Image Uploaded")}
                      />
                </Grid>

                <Grid item xs={12} md={6} xl={12} mt={2}>
                  <TextField
                      disabled={((isSubmitted || id) && (!editing || saving))}
                      id="outlined-required"
                      label='Description *'
                      fullWidth
                      multiline
                      // defaultValue={portfolioData?.portfolioName}
                      value={formState?.description}
                      onChange={(e) => {setFormState(prevState => ({
                          ...prevState,
                          description: e.target.value
                        }))}}
                    />
                </Grid>
                
            </Grid>

        <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={3} xl={3}>
            <Grid item xs={12} md={6} lg={12}>
            {previewUrl ? 
              <img src={previewUrl} style={{height:"250px", width:"250px",borderRadius:"5px", border:"1px #ced4da solid"}}/>
            :
              <img src={imageFile} style={{height:"250px", width:"250px",borderRadius:"5px", border:"1px #ced4da solid"}}/>
            }
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
                  <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{navigate("/carousel")}}>
                      Cancel
                  </MDButton>
                  </>
                  )}
                  {(isSubmitted || id) && !editing && (
                  <>
                  <MDButton variant="contained" color="warning" size="small" sx={{mr:1, ml:2}} onClick={()=>{setEditing(true)}}>
                      Edit
                  </MDButton>
                  <MDButton variant="contained" color="info" size="small" onClick={()=>{id ? navigate("/carousel") : setIsSubmitted(false)}}>
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
                      // onClick={()=>{navigate("/carousel")}}
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

        <Grid container mt={1} xs={12} md={12} lg={12}>
          <CarouselClickedBy carousel={carousel}/>
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