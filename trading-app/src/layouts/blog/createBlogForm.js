import React ,{useEffect, useState, useRef} from "react";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {apiUrl} from "../../constants/constants.js"

function Index() {
  const [value, setValue] = useState('');
  // const modules
  const quillRef = useRef(null)
  const toolbarOptions={
    toolbar: [
      [{header: [1,2,3,4,5,6,false]}],
      [{font: []}],
      [{size: []}],
      ["italic", "bold", "underline", "strike", "blockquote"],
      [
        {list: "ordered"},
        {list: "bullet"},
        {indent: "+1"},
        {indent: "-1"}
      ],
      ["link", "image", "video"]
    ],

  }

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

  function imageHandler() {
    if (!quillRef.current) return

    const editor = quillRef.current.getEditor()
    const range = editor.getSelection()
    const value = prompt("Please enter the image URL")

    if (value && range) {
      editor.insertEmbed(range.index, "image", value, "user")
    }
  }

  return (
    <>
      <MDBox pl={2} pr={2} mt={4} mb={2}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
            Fill Blog Details
          </MDTypography>
        </MDBox>

        <MDBox sx={{height: "250px"}}>
          <ReactQuill
            forwardedRef={quillRef}
            theme="snow"
            value={value}
            onChange={setValue}
            modules={{
              toolbar: {
                  container: toolbarOptions,
                  handlers: {
                      image: imageHandler
                  }
              }
          }}
            // {modules}
            style={{ height: "250px" }}
          />
        </MDBox>


        <MDBox display='flex' justifyContent='space-between' alignItems='center' sx={{marginTop: "60px"}}>
          <MDBox sx={{fontWeight: 600, fontSize: "18px"}}>
            Preview
          </MDBox>
          <MDBox display='flex' justifyContent='center' alignItems='center'>
            <MDButton
              variant="contained"
              color="success"
              size="small"
              sx={{ mr: 1, ml: 2 }}
            // disabled={creating}
            onClick={onSubmit}  
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

        <MDBox sx={{border: "1px solid #CCCCCC", minHeight: "300px", marginTop: "10px", padding: "5px"}} dangerouslySetInnerHTML={{__html: value}} />
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