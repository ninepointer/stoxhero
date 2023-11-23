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
import { Typography } from "@mui/material";


function Index() {
  const [value, setValue] = useState('');
  const [isSubmitted,setIsSubmitted] = useState(false);
  const [editing,setEditing] = useState(false)
  const [saving,setSaving] = useState(false)
  const location = useLocation();

  const  id  = location?.state?.data;
  const [imageFile, setImageFile] = useState(id ? id?.thumbnailImage : DefaultBlogImage);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageData, setImageData] = useState();
  const [title, setTitle] = useState("");
  const [titleImage, setTitleImage] = useState(null);
  const editor = useRef(null);


  async function onSubmit(e) {
    e.preventDefault();
    // setCreating(true)
    // console.log("Form Data: ", data)
    try {
      // const formData = new FormData();
      // Object.keys(data).forEach((key) => {
      //   console.log("data to be appended:", key, data[key])
      //   // formData.append(key, data[key])
      //   formData.append(key, data[key])
      //   console.log("data appended", formData)
      //   console.log("formState", formState)
      // });

      // if (!formState.blogTitle || !formState.content || !formState.author || !formState.thumbnailImage) {
      //   setCreating(false);
      //   return openErrorSB("Error", "Please fill the mandatory fields.")
      // }
      console.log("Calling API", value)
      const res = await fetch(`${apiUrl}blogs`, {

        method: "POST",
        credentials: "include",
        headers: {
          "content-type" : "application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          value: value
        })
      });

      let data1 = await res.json()
      console.log("Response:", data1)
      if (data1.data) {
        // openSuccessSB("Success", data1.message)
        // setIsSubmitted(true)
        // setTimeout(() => { setCreating(false); setIsSubmitted(true); setEditing(false) }, 500)
      } else {
        // setTimeout(() => { setCreating(false); setIsSubmitted(false); setEditing(false) }, 500)
      }
    } catch (e) {
      console.log(e);
    }
  }

  console.log(value)

  const [file, setFile] = useState(null);
  const [uploadedData, setUploadedData] = useState([]);


  const handleFileChange = (event) => {
    setFile(event.target.files);
  };



  const handleUpload = async () => {
    // setDetails(detail);
    console.log("file", titleImage, file);
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
  
    try {
      const formData = new FormData();
      if (titleImage) {
        formData.append("titleFiles", titleImage[0]);
      }
  
      // Append each file in the file array to the "files" array
      for (let i = 0; i < file.length; i++) {
        formData.append("files", file[i]);
      }
      formData.append('title', title);

      console.log("formData", formData)

      const res = await fetch(`${apiUrl}blogs/images`, {

        method: "POST",
        credentials: "include",
        headers: {
          // 'content-type': 'multipart/form-data',
          "Access-Control-Allow-Credentials": true
        },
        body: formData
      });

      let data = await res.json()
  

      console.log("if file uploaded before", data);
      alert("File upload successfully");
      console.log("if file uploaded", data);
      setFile(null)
      setImageData(data.data);
    } catch (error) {
      console.log(error, file);
      alert('File upload failed');
    }
  };

  // async function onEdit(e, formState) {
  //   e.preventDefault()
  //   setSaving(true)
  //   // if (!formState?.blogTitle || !formState?.content || !formState.author) {

  //   //   setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
  //   //   return openErrorSB("Missing Field", "Please fill all the mandatory fields")

  //   // }
  //   // setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
  //   const { blogTitle, content, author, thumbnailImage } = formState;
  //   const res = await fetch(`${baseUrl}api/v1/blogs/${id?._id || imageData?._id}`, {
  //     method: "PATCH",
  //     credentials: "include",
  //     headers: {
  //       "content-type": "application/json",
  //       "Access-Control-Allow-Credentials": true
  //     },
  //     body: JSON.stringify({
  //       blogTitle, content, author, thumbnailImage
  //     })

  //   });

  //   const data = await res.json();
  //   const updatedData = data?.data
  //   if (updatedData || res.status === 200) {
  //     setNewObjectId(data.data);
  //     openSuccessSB("Blog Edited", data.message)
  //     setTimeout(()=>{setSaving(false);setEditing(false)},500)
  //   } else {
  //     openErrorSB("Error", "data.error")
  //   }
  // }

  async function saveBlogData(value) {
    // e.preventDefault()
    setSaving(true)
    const res = await fetch(`${apiUrl}blogs/${id?._id || imageData?._id}/blogData`, {
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
      // setNewObjectId(data.data);
      // openSuccessSB("Blog Edited", data.message)
      // setTimeout(()=>{setSaving(false);setEditing(false)},500)
    } else {
      // openErrorSB("Error", "data.error")
    }
  }

  console.log("imageData", imageData)

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
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Blog Title *'
                fullWidth
                value={title}
                onChange={(e) => { setTitle(e.target.value) }}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={4}>
              <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color="success" component="label">
                Upload Title Image
                <input
                  hidden
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  accept="image/*"
                  type="file"
                  onChange={(e)=>{setTitleImage(e.target.files)}}
                />
              </MDButton>
            </Grid>

            <Grid item xs={12} md={6} xl={4}>
              <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color="success" component="label">
                Upload Other Images
                <input
                  hidden
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  accept="image/*"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </MDButton>
            </Grid>

          </Grid>
        </Grid>

        <MDBox display='flex' justifyContent='flex-end' alignItems='center'>
            <MDButton
              variant="contained"
              color="success"
              size="small"
              sx={{ mr: 1, ml: 2 }}
              // disabled={creating}
              onClick={handleUpload}
            >
              Save
            </MDButton>
          </MDBox>

        <MDBox mt={1}>
          {imageData &&
            <>
              <MDBox display="flex" justifyContent='flex-start' alignItems='center'>
                <MDBox>
                  <img src={imageData.thumbnailImage.url} style={{ height: "100px", width: "100px", borderRadius: "5px", border: "1px #ced4da solid" }} />
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

        <MDBox sx={{ height: "250px" }}>

          <JoditEditor
            ref={editor}
            value={value}
            // config={config}
            // tabIndex={1} // tabIndex of textarea
            // onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
            onChange={newContent => setValue(newContent)}
          />
        </MDBox>


        <MDBox display='flex' justifyContent='space-between' alignItems='center' sx={{ marginTop: "60px" }}>
          <MDBox sx={{ fontWeight: 600, fontSize: "18px" }}>
            Preview
          </MDBox>
          <MDBox display='flex' justifyContent='center' alignItems='center'>
            <MDButton
              variant="contained"
              color="success"
              size="small"
              sx={{ mr: 1, ml: 2 }}
              // disabled={creating}
              onClick={()=>{saveBlogData(value)}}
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
        </MDBox>

        <MDBox sx={{ border: "1px solid #CCCCCC", minHeight: "300px", marginTop: "10px", padding: "5px" }} dangerouslySetInnerHTML={{ __html: value }} />
      </MDBox>
    </>
  )
}
export default Index;













{/* <Grid container display="flex" flexDirection="row" justifyContent="space-between">
<Grid container spacing={1} mt={0.5} mb={0} xs={12} md={9} xl={12}>
  <Grid item xs={12} md={6} xl={6}>
    <TextField
      disabled={((isSubmitted || id) && (!editing || saving))}
      id="outlined-required"
      label='Blog Title *'
      fullWidth
      value={formState?.blogTitle}
      onChange={(e) => {
        setFormState(prevState => ({
          ...prevState,
          blogTitle: e.target.value
        }))
      }}
    />
  </Grid>

  <Grid item xs={12} md={6} xl={3}>
    <TextField
      disabled={((isSubmitted || id) && (!editing || saving))}
      id="outlined-required"
      label='Author Name *'
      fullWidth
      value={formState?.author}
      onChange={(e) => {
        setFormState(prevState => ({
          ...prevState,
          author: e.target.value
        }))
      }}
    />
  </Grid>

  <Grid item xs={12} md={6} xl={3}>
    <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color="success" component="label">
      {!formState?.thumbnailImage?.name ? "Upload Thumbnail Image" : "Upload Another File?"}
      <input
        hidden
        disabled={((isSubmitted || id) && (!editing || saving))}
        accept="image/*"
        type="file"
        onChange={(e) => {
          setFormState(prevState => ({
            ...prevState,
            thumbnailImage: e.target.files[0]
          }));
          handleImageUpload(e);
        }}
      />
    </MDButton>
  </Grid>

  <Grid item xs={12} md={12} xl={12} mt={1}>
    <TextField
      disabled={((isSubmitted || id) && (!editing || saving))}
      id="outlined-required"
      name="content"
      label='Summary *'
      fullWidth
      multiline
      rows={5}
      defaultValue={editing ? formState?.content : id?.content}
      onChange={(e) => {
        setFormState(prevState => ({
          ...prevState,
          content: e.target.value
        }))
      }}
    />
  </Grid>

  <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={3} xl={12}>
    <Grid item xs={12} md={6} lg={12}>
      {previewUrl ?
        <img src={previewUrl} style={{ height: "250px", width: "250px", borderRadius: "5px", border: "1px #ced4da solid" }} />
        :
        <img src={imageFile} style={{ height: "250px", width: "250px", borderRadius: "5px", border: "1px #ced4da solid" }} />
      }
    </Grid>
  </Grid>

  {newObjectId?.status &&
    <>
      <Grid item xs={12} md={12} xl={3} display='flex' justifyContent='center'>
        <MDTypography fontSize={13} color='success'>Status : {newObjectId?.status}</MDTypography>
      </Grid>

      <Grid item xs={12} md={12} xl={3} display='flex' justifyContent='center'>
        <MDTypography fontSize={13}>CreatedOn : {moment.utc(newObjectId?.createdOn).utcOffset('+05:30').format("DD-MMM-YY HH:mm a")}</MDTypography>
      </Grid>

      <Grid item xs={12} md={12} xl={3} display='flex' justifyContent='center'>
        <MDTypography fontSize={13}>{newObjectId?.status} On : {moment.utc(newObjectId?.lastModifiedOn).utcOffset('+05:30').format("DD-MMM-YY HH:mm a")}</MDTypography>
      </Grid>

      <Grid item xs={12} md={12} xl={3} display='flex' justifyContent='center'>
        <MDTypography fontSize={13}>Last Modified By : {newObjectId?.lastModifiedBy?.first_name} {newObjectId?.lastModifiedBy?.last_name}</MDTypography>
      </Grid>
    </>
  }

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
        sx={{ mr: 1, ml: 2 }}
        disabled={creating}
        onClick={(e) => { onSubmit(e, formState) }}
      >
        {creating ? <CircularProgress size={20} color="inherit" /> : "Create"}
      </MDButton>
      <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/allblogs") }}>
        Cancel
      </MDButton>
    </>
  )}
  {(isSubmitted || id) && !editing && (
    <>
      <MDButton
        variant="contained"
        color="success"
        size="small"
        sx={{ mr: 0, ml: 1 }}
        onClick={() => { updateStatus(newObjectId?._id, newObjectId?.status === 'Created' ? 'Published' : newObjectId?.status === 'Published' ? 'Unpublished' : newObjectId?.status === 'Unpublished' ? 'Published' : '') }}
      >
        {newObjectId?.status === 'Created' ? 'Publish' : newObjectId?.status === 'Published' ? 'Unpublish' : newObjectId?.status === 'Unpublished' ? 'Publish' : ''}
      </MDButton>
      <MDButton
        variant="contained"
        color="warning"
        size="small"
        sx={{ mr: 1, ml: 1 }}
        onClick={(e) => { setEditing(true) }}
      >
        Edit
      </MDButton>
      <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/allblogs') }}>
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
        sx={{ mr: 1, ml: 1 }}
        disabled={saving}
        onClick={(e) => { onEdit(e, formState) }}
      >
        {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
      </MDButton>
      <MDButton
        variant="contained"
        color="error"
        size="small"
        disabled={saving}
        onClick={() => { setEditing(false) }}
      >
        Cancel
      </MDButton>
    </>
  )}
</Grid>

</Grid> */}