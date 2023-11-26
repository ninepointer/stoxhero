import React ,{useEffect, useState, useRef} from "react";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Divider, Grid } from '@mui/material';
import {apiUrl} from "../../constants/constants.js"
import JoditEditor from 'jodit-react';
import TextField from '@mui/material/TextField';
import { useNavigate, useLocation } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import MDSnackbar from '../../components/MDSnackbar';


function Index() {
  const location = useLocation();
  const [prevData, setPrevData]  = useState(location?.state?.data);
  const navigate = useNavigate();
  const [value, setValue] = useState(prevData?.blogData || '');
  const [isSubmitted,setIsSubmitted] = useState(false);
  const [editing,setEditing] = useState(prevData ? false : true)
  const [saving,setSaving] = useState(false)
  const [titlePreviewUrl, setTitlePreviewUrl] = useState('');
  const [imagesPreviewUrl, setImagesPreviewUrl] = useState(null);
  const [imageData, setImageData] = useState(prevData || null);
  const [title, setTitle] = useState(prevData?.blogTitle || "");
  const [titleImage, setTitleImage] = useState(null);
  const [formstate, setFormState] = useState({
    metaTitle: prevData?.metaTitle || "",
    metaDescription: prevData?.metaDescription || "",
    category: prevData?.category || "",
    metaKeywords: prevData?.metaKeywords || "",
    status: prevData?.status || ""
  })
  const [isfileSizeExceed, setIsFileExceed] = useState(false);
  const editor = useRef(null);
  const [file, setFile] = useState(null);

  useEffect(()=>{
    setIsFileExceed(false)
    if(file){
      for(let elem of file){
        if(elem?.size > 5*1024*1024){
          setIsFileExceed(true);
          openSuccessSB('error', 'Image size should be less then 5 MB.');

        }
      }
    }
  },[file])
  
  const handleFileChange = (event) => {
    setFile(event.target.files);
    let previewUrls = [];
    const files = event.target.files;
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = () => {
        // Add the preview URL to the array
        previewUrls.push(reader.result);
  
        // If all files have been processed, update the state with the array of preview URLs
        if (previewUrls.length === files.length) {
          setImagesPreviewUrl(previewUrls);
          console.log("Title Preview URLs:", previewUrls);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlogThumbnailImage = (event) => {
    const file = event.target.files[0];
    setTitleImage(event.target.files);
    console.log("Title File:",file)
    // Create a FileReader instance
    const reader = new FileReader();
    reader.onload = () => {
      setTitlePreviewUrl(reader.result);
      console.log("Title Preview Url:",reader.result)
    };
    reader.readAsDataURL(file);
  };

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
      setPrevData(data.data);
      if(data.status==='success'){
        setFile(null)
        setImageData(data.data);
        setIsSubmitted(true);
        setEditing(false);
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

  function handleCopyClick(textToCopy) {
      console.log("TextToCopy:",textToCopy)
      // Create a temporary textarea element to copy the text
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
  
      // Select the text in the textarea
      textarea.select();
      document.execCommand('copy');
  
      // Remove the temporary textarea
      document.body.removeChild(textarea);
    };

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
          <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>

            <Grid item xs={12} md={12} xl={12}>
              <TextField
                disabled={((imageData || prevData) && (!editing || saving))}
                id="outlined-required"
                label='Blog Title *'
                fullWidth
                value={title || prevData?.blogTitle}
                onChange={(e) => { setTitle(e.target.value) }}
              />
            </Grid>

            <Grid item xs={12} md={12} xl={12}>
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

            <Grid item xs={12} md={8} xl={8}>
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

            <Grid item xs={12} md={4} xl={4}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Category *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='category'
                      value={formstate?.category || prevData?.category}
                      disabled={((imageData || prevData) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          category: e.target.value
                        }))
                      }}
                      label="Category"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="Stocks">Stocks</MenuItem>
                      <MenuItem value="Learn">Learn</MenuItem>
                      <MenuItem value="News">News</MenuItem>
                      <MenuItem value="Aadhar">Aadhar</MenuItem>
                      <MenuItem value="Taxation">Taxation</MenuItem>
                      <MenuItem value="Banking">Banking</MenuItem>
                      <MenuItem value="Insurance">Insurance</MenuItem>
                      <MenuItem value="FnO">FnO</MenuItem>
                      <MenuItem value="Trading">Trading</MenuItem>
                      <MenuItem value="IPO">IPO</MenuItem>
                      <MenuItem value="Mutual Funds">Mutual Funds</MenuItem>
                      <MenuItem value="Personal Finance">Personal Finance</MenuItem>
                      <MenuItem value="Bonds">Bonds</MenuItem>
                      <MenuItem value="General">General</MenuItem>
                      <MenuItem value="StoxHero">StoxHero</MenuItem>
                    </Select>
                  </FormControl>
            </Grid>

            <Grid item xs={12} md={12} xl={12}>
            <TextField
                disabled={((imageData || prevData) && (!editing || saving))}
                id="outlined-required"
                label='Meta Description *'
                fullWidth
                multiline
                rows={5}
                value={formstate?.metaDescription || prevData?.metaDescription}
                onChange={(e) => {
                  setFormState(prevState => ({
                    ...prevState,
                    metaDescription: e.target.value
                  }))
                }}
              />
            </Grid>

            {prevData &&
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
            </Grid>}

            <Grid item xs={12} md={6} xl={!prevData ? 6 : 4}>
              <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={(imageData?.thumbnailImage?.url && !titleImage) ? "warning" : ((imageData?.thumbnailImage?.url && titleImage) || titleImage) ? "error" : "success"} component="label">
                {!formstate?.titleImage?.name ? "Upload Blog Thumbnail(1080X720)" : "Upload Another File?"}
                <input
                  hidden
                  disabled={((imageData || prevData) && (!editing || saving))}
                  accept="image/*"
                  type="file"
                  // onChange={(e)=>{setTitleImage(e.target.files)}}
                  onChange={(e) => {
                    setFormState(prevState => ({
                      ...prevState,
                      titleImage: e.target.files
                    }));
                    // setTitleImage(e.target.files);
                    handleBlogThumbnailImage(e);
                  }}
                />
              </MDButton>
            </Grid>

            <Grid item xs={12} md={6} xl={!prevData ? 6 : 4}>
              <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={(imageData?.images?.length && !file) ? "warning" : ((imageData?.images?.length && file) || file) ? "error" : "success"} component="label">
                {!formstate?.titleImage?.name ? "Upload Blog Images(1080X720)" : "Upload More File?"}
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

        
        <Grid container mt={2} xs={12} md={12} xl={12} >
          <Grid item display="flex" justifyContent="flex-end" xs={12} md={12} xl={12}>
          <MDButton
            variant="contained"
            color= {(prevData && !editing) ? "warning" : (prevData && editing) ? "warning" : "success"}
            size="small"
            sx={{mr:1, ml:1}} 
            disabled={isfileSizeExceed}
            onClick={(prevData && !editing) ? ()=>{setEditing(true)} : (prevData && editing) ? edit : handleUpload}
          >
            {(prevData && !editing) ? "Edit" : (prevData && editing) ? "Save" : "Next"}
          </MDButton>
          {(isSubmitted || prevData) && !editing && <MDButton 
            variant="contained" 
            color="info" 
            size="small" 
            sx={{mr:1, ml:1}} 
            onClick={()=>{navigate('/allblogs')}}
          >
              Back
          </MDButton>}
          {(isSubmitted || prevData) && editing && <MDButton 
            variant="contained" 
            color="info" 
            size="small" 
            sx={{mr:1, ml:1}} 
            // onClick={()=>{navigate('/allblogs')}}
            onClick={()=>{setEditing(false)}}
          >
              Cancel
          </MDButton>}
          {!prevData && editing && <MDButton 
            variant="contained" 
            color="info" 
            size="small" 
            sx={{mr:1, ml:1}} 
            onClick={()=>{navigate('/allblogs')}}
            // onClick={()=>{setEditing(false)}}
          >
              Cancel
          </MDButton>}
          </Grid>
        </Grid>

        <Grid container mb={2} spacing={2} xs={12} md={12} xl={12} mt={1} display="flex" justifyContent='flex-start' alignItems='center' style={{maxWidth:'100%', height:'auto'}}>
          {titlePreviewUrl ?
             
             <Grid item xs={12} md={12} xl={3} style={{maxWidth:'100%', height:'auto'}}>
              <Grid container xs={12} md={12} xl={12} style={{maxWidth:'100%', height:'auto'}}>
                <Grid item xs={12} md={12} xl={12} style={{maxWidth:'100%', height:'auto'}}>
                  <Card sx={{ minWidth: '100%', cursor:'pointer' }}>       
                    <CardActionArea>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                      <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                        <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                        <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{textAlign:'center'}}>
                          Blog Thumbnail
                        </Typography>
                        </MDBox>
                      </CardContent>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                      <img src={titlePreviewUrl} style={{maxWidth: '100%',height: 'auto', borderBottomLeftRadius:10, borderBottomRightRadius:10}}/>
                    </Grid>
                    </CardActionArea>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
              :
              <Grid item xs={12} md={12} xl={3} style={{maxWidth:'100%', height:'auto'}}>
                <Grid container xs={12} md={12} xl={12} style={{maxWidth:'100%', height:'auto'}}>
                  <Grid item xs={12} md={12} xl={12} style={{maxWidth:'100%', height:'auto'}}>
                    <Card sx={{ minWidth: '100%', cursor:'pointer' }}>       
                      <CardActionArea>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                          <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                          <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{textAlign:'center'}}>
                            Blog Thumbnail
                          </Typography>
                          </MDBox>
                        </CardContent>
                      </Grid>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                        <img src={imageData?.thumbnailImage?.url} style={{maxWidth: '100%',height: 'auto', borderBottomLeftRadius:10, borderBottomRightRadius:10}}/>
                      </Grid>
                      </CardActionArea>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
          }
          </Grid>
          {(imagesPreviewUrl && !imageData) ? 
          <Grid container mb={2} spacing={2} xs={12} md={12} xl={12} mt={1} display="flex" justifyContent='flex-start' alignItems='center' style={{maxWidth:'100%', height:'auto'}}>
          {imagesPreviewUrl?.map((elem) => {
              return (
                <>
                  <Grid item xs={12} md={12} xl={2} style={{maxWidth:'100%', height:'auto'}}>
                    <Grid container xs={12} md={12} xl={12} style={{maxWidth:'100%', height:'auto'}}>
                      <Grid item xs={12} md={12} xl={12} style={{maxWidth:'100%', height:'auto'}}>
                        <Card sx={{ minWidth: '100%', cursor:'pointer' }} onClick={()=>{handleCopyClick(elem?.url)}}>       
                          <CardActionArea>
                          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                            <img src={elem} style={{maxWidth: '100%',height: 'auto', borderTopLeftRadius:10, borderTopRightRadius:10}}/>
                          </Grid>
                          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                            <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                              <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                              <Typography variant="caption" fontFamily='Segoe UI' fontWeight={400} style={{textAlign:'center'}}>
                                Click to copy URL
                              </Typography>
                              </MDBox>
                            </CardContent>
                          </Grid>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )
            })}
          </Grid> 
          :
          <Grid container mb={2} spacing={2} xs={12} md={12} xl={12} mt={1} display="flex" justifyContent='flex-start' alignItems='center' style={{maxWidth:'100%', height:'auto'}}>
          {imageData?.images?.map((elem) => {
              return (
                <>
                  <Grid item xs={12} md={12} xl={2} style={{maxWidth:'100%', height:'auto'}}>
                    <Grid container xs={12} md={12} xl={12} style={{maxWidth:'100%', height:'auto'}}>
                      <Grid item xs={12} md={12} xl={12} style={{maxWidth:'100%', height:'auto'}}>
                        <Card sx={{ minWidth: '100%', cursor:'pointer' }} onClick={()=>{handleCopyClick(elem?.url)}}>       
                          <CardActionArea>
                          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                            <img src={elem?.url} style={{maxWidth: '100%',height: 'auto', borderTopLeftRadius:10, borderTopRightRadius:10}}/>
                          </Grid>
                          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth:'100%', height: 'auto'}}>
                            <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{maxWidth: '100%',height: 'auto'}}>
                              <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', height:'auto'}}>
                              <Typography variant="caption" fontFamily='Segoe UI' fontWeight={400} style={{textAlign:'center'}}>
                                Click to copy URL
                              </Typography>
                              </MDBox>
                            </CardContent>
                          </Grid>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )
            })}
          </Grid>}
       

          {prevData?.status && 
          <>
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
          </>
          }
          {renderSuccessSB}
      </MDBox>
    </>
  )
}
export default Index;