import React ,{useEffect, useState, useRef} from "react";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import {apiUrl} from "../../constants/constants.js"
import JoditEditor from 'jodit-react';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import { useNavigate, useLocation } from "react-router-dom";
import DefaultBlogImage from '../../assets/images/defaultcarousel.png'
import axios from "axios";
import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import MDSnackbar from '../../components/MDSnackbar';


function Index() {
  const location = useLocation();
  const  prevData  = location?.state?.data;

  const [value, setValue] = useState(prevData?.blogData || '');
  const [isSubmitted,setIsSubmitted] = useState(false);
  const [editing,setEditing] = useState(false)
  const [saving,setSaving] = useState(false)

  // console.log("this is data", id)
  // const [imageFile, setImageFile] = useState(id ? id?.thumbnailImage : DefaultBlogImage);
  // const [previewUrl, setPreviewUrl] = useState('');
  const [imageData, setImageData] = useState(prevData || null);
  const [title, setTitle] = useState(prevData?.blogTitle || "");
  const [titleImage, setTitleImage] = useState(null);
  const [formstate, setFormState] = useState({
    metaTitle: prevData?.metaTitle || "",
    metaDescription: prevData?.metaDescription || "",
    metaKeywords: prevData?.metaKeywords || "",
    status: prevData?.status || ""
  })
  const editor = useRef(null);


  const [file, setFile] = useState(null);
  const handleFileChange = (event) => {
    setFile(event.target.files);
  };
  // {"country_code":"IN","country_name":"India","city":null,"postal":null,"latitude":20,"longitude":77,"IPv4":"49.36.239.8","state":null}


  const handleUpload = async () => {

    if (!title) {
      openSuccessSB('error', 'Please fill title');
      return;
    }
    if (!file || !titleImage) {
      openSuccessSB('error', 'Please select a file to upload');
      return;
    }
  
    try {
      const formData = new FormData();
      if (titleImage) {
        formData.append("titleFiles", titleImage[0]);
      }
  
      // Append each file in the file array to the "files" array
      if(file){
        for (let i = 0; i < file.length; i++) {
          formData.append("files", file[i]);
        }
      }

      formData.append('title', title);
      for(let elem in formstate){
        formData.append(`${elem}`, formstate[elem]);
      }

      const res = await fetch(`${apiUrl}blogs`, {

        method: "POST",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Credentials": true
        },
        body: formData
      });

      let data = await res.json()
  
      if(data.status==='success'){
        setFile(null)
        setImageData(data.data);
        openSuccessSB('success', data.message);
      }
    } catch (error) {
      openSuccessSB('error', error?.err);
    }
  };

  const edit = async () => {
    try {
      const formData = new FormData();
      if (titleImage) {
        formData.append("titleFiles", titleImage[0]);
      }
  
      // Append each file in the file array to the "files" array
      if(file){
        for (let i = 0; i < file.length; i++) {
          formData.append("files", file[i]);
        }
      }
      formData.append('blogTitle', title);
      for(let elem in formstate){
        formData.append(`${elem}`, formstate[elem]);
      }

      const res = await fetch(`${apiUrl}blogs/${prevData?._id}`, {

        method: "PATCH",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Credentials": true
        },
        body: formData
      });

      let data = await res.json()
  
      if(data.status==='success'){
        setFile(null)
        setImageData(data.data);
        setEditing(false)
        openSuccessSB('success', data.message);
      }
    } catch (error) {
      openSuccessSB('error', error?.err);
    }
  };

  async function saveBlogData(value) {
    if (!value) {
      openSuccessSB('error', 'Please type text.');
      return;
    }
    setSaving(true)
    const res = await fetch(`${apiUrl}blogs/${prevData?._id || imageData?._id}/blogData`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        blogData: value
      })

    });

    const data = await res.json();
    const updatedData = data?.data
    if (updatedData || res.status === 200) {
      openSuccessSB("success", data.message)
    } else {
      openSuccessSB("error", data.message)
    }
  }


  const [successSB, setSuccessSB] = useState(false);
  const [messageObj, setMessageObj] = useState({
    color: '',
    icon: '',
    title: '',
    content: ''
  })
  const openSuccessSB = (value, content) => {
    if (value === "success") {
      messageObj.color = 'success'
      messageObj.icon = 'check'
      messageObj.title = "Success";
      messageObj.content = content;
      setSuccessSB(true);
    };
    if (value === "error") {
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "Error";
      messageObj.content = content;
    };

    setMessageObj(messageObj);
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);
  const renderSuccessSB = (
    <MDSnackbar
      color={messageObj.color}
      icon={messageObj.icon}
      title={messageObj.title}
      content={messageObj.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite={messageObj.color}
      sx={{ borderLeft: `10px solid ${messageObj.color==="success" ? "#4CAF50" : messageObj.color==="error" ? "#F44335" : "#1A73E8"}`, borderRight: `10px solid ${messageObj.color==="success" ? "#4CAF50" : messageObj.color==="error" ? "#F44335" : "#1A73E8"}`, borderRadius: "15px", width: "auto" }}
    />
  );

  return (
    <>
      <MDBox pl={2} pr={2} mt={4} mb={2}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
            Fill Blog Details
          </MDTypography>
        </MDBox>
        <Grid container display="flex" flexDirection="row" justifyContent="space-between">
          <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={9} xl={12}>

            <Grid item xs={12} md={6} xl={4}>
              <TextField
                disabled={((imageData || prevData) && (!editing || saving))}
                id="outlined-required"
                label='Blog Title *'
                fullWidth
                value={title || prevData?.blogTitle}
                onChange={(e) => { setTitle(e.target.value) }}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={4}>
              <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={(imageData?.thumbnailImage?.url && !titleImage) ? "warning" : ((imageData?.thumbnailImage?.url && titleImage) || titleImage) ? "error" : "success"} component="label">
                Upload Title Image
                <input
                  hidden
                  disabled={((imageData || prevData) && (!editing || saving))}
                  accept="image/*"
                  type="file"
                  onChange={(e)=>{setTitleImage(e.target.files)}}
                />
              </MDButton>
            </Grid>

            <Grid item xs={12} md={6} xl={4}>
              <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={(imageData?.images?.length && !titleImage) ? "warning" : ((imageData?.images?.length && titleImage) || titleImage) ? "error" : "success"} component="label">
                Upload Other Images
                <input
                  hidden
                  disabled={((isSubmitted || prevData) && (!editing || saving))}
                  accept="image/*"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </MDButton>
            </Grid>

          </Grid>
        </Grid>


        <Grid container display="flex" flexDirection="row" justifyContent="space-between">
          <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={9} xl={12}>

            <Grid item xs={12} md={6} xl={4}>
              <TextField
                disabled={((imageData || prevData) && (!editing || saving))}
                id="outlined-required"
                label='Meta Title *'
                fullWidth
                value={formstate?.metaTitle || prevData?.metaTitle}
                onChange={(e) => {
                  setFormState(prevState => ({
                    ...prevState,
                    metaTitle: e.target.value
                  }))
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={4}>
            <TextField
                disabled={((imageData || prevData) && (!editing || saving))}
                id="outlined-required"
                label='Meta Keywords *'
                fullWidth
                value={formstate?.metaKeywords || prevData?.metaKeywords}
                onChange={(e) => {
                  setFormState(prevState => ({
                    ...prevState,
                    metaKeywords: e.target.value
                  }))
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={4}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='status'
                      value={formstate?.status || prevData?.status}
                      disabled={((imageData || prevData) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          status: e.target.value
                        }))
                      }}
                      label="Status"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="Created">Created</MenuItem>
                      <MenuItem value="Published">Published</MenuItem>
                      <MenuItem value="Unpublished">Unpublished</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

          </Grid>
        </Grid>


        <Grid container display="flex" flexDirection="row" justifyContent="space-between">
          <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={9} xl={12}>

            <Grid item xs={12} md={6} xl={12}>
            <TextField
                disabled={((imageData || prevData) && (!editing || saving))}
                id="outlined-required"
                label='Meta Description *'
                fullWidth
                value={formstate?.metaDescription || prevData?.metaDescription}
                onChange={(e) => {
                  setFormState(prevState => ({
                    ...prevState,
                    metaDescription: e.target.value
                  }))
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        
        <MDBox display='flex' justifyContent='flex-end' alignItems='center'>
          <MDButton
            variant="contained"
            color= {(prevData && !editing) ? "warning" : (prevData && editing) ? "warning" : "success"}
            size="small"
            sx={{ mr: 1, ml: 2, mt: 1 }}
            // disabled={creating}
            onClick={(prevData && !editing) ? ()=>{setEditing(true)} : (prevData && editing) ? edit : handleUpload}
          >
            {(prevData && !editing) ? "Edit" : (prevData && editing) ? "Save" : "Save"}
          </MDButton>
        </MDBox>

        <MDBox mt={1}>
          {imageData &&
            <>
              <MDBox display="flex" justifyContent='flex-start' alignItems='center'>
                <MDBox>
                  <img src={imageData?.thumbnailImage?.url} style={{ height: "100px", width: "100px", borderRadius: "5px", border: "1px #ced4da solid" }} />
                </MDBox>
                <MDBox>
                  <Typography sx={{ fontSize: "12px" }}>Url: {imageData.thumbnailImage.url}</Typography>
                  <Typography sx={{ fontSize: "12px" }}>Name: {imageData.thumbnailImage.name}</Typography>

                </MDBox>
              </MDBox>

              {imageData.images.map((elem) => {
                return (
                  <MDBox display="flex" justifyContent='flex-start' alignItems='center'>
                    <MDBox>
                      <img src={elem.url} style={{ height: "100px", width: "100px", borderRadius: "5px", border: "1px #ced4da solid" }} />
                    </MDBox>
                    <MDBox>
                      <Typography sx={{ fontSize: "12px" }}>Url: {elem.url}</Typography>
                      <Typography sx={{ fontSize: "12px" }}>Name: {elem.name}</Typography>

                    </MDBox>
                  </MDBox>
                )
              })}
            </>
          }
        </MDBox>

          <JoditEditor
            ref={editor}
            value={value}
            onChange={newContent => setValue(newContent)}
            style={{height: "100%"}}
          />

          <MDBox display='flex' justifyContent='flex-end' alignItems='center' mt={1}>
            <MDButton
              variant="contained"
              color="success"
              size="small"
              sx={{ mr: 1, ml: 2 }}
              // disabled={creating}
              onClick={() => { saveBlogData(value) }}
            >
              Save
            </MDButton>
            <MDButton
              variant="contained"
              color="warning"
              size="small"
              sx={{ mr: 1, ml: 2 }}
            // disabled={creating}

            >
              Reset
            </MDButton>
          </MDBox>
        {renderSuccessSB}
      </MDBox>
    </>
  )
}
export default Index;