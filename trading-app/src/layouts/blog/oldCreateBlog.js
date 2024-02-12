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
import moment from 'moment'
import DefaultBlogImage from '../../assets/images/defaultcarousel.png'
import { IoMdAddCircle } from 'react-icons/io';
import Content from './data/contents'


function Index() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const location = useLocation();
    const  id  = location?.state?.data;
    console.log("Blog:",id)
    const [isSubmitted,setIsSubmitted] = useState(false);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [isLoading,setIsLoading] = useState(id ? true : false)
    const [imageFile, setImageFile] = useState(id ? id?.thumbnailImage : DefaultBlogImage);
    const [previewUrl, setPreviewUrl] = useState('');
    const [editing,setEditing] = useState(false)
    const [saving,setSaving] = useState(false)
    const [creating,setCreating] = useState(false)
    const navigate = useNavigate();
    const [newObjectId, setNewObjectId] = useState(id);
    const [updatedDocument, setUpdatedDocument] = useState([]);
    const [blogData,setBlogData] = useState([])
    const [formState,setFormState] = useState({
        blogTitle: '' || id?.blogTitle,
        content:'' || id?.content,
        author: '' || id?.author,
        thumbnailImage:'' || id?.thumbnailImage,
        blogContent: {
          serialNumber: "",
          header: "",
          content: "",
          image:"",
      },
    });
    const [childFormState,setChildFormState] = useState({
      blogContent : [{
        serialNumber: "",
        header: "",
        content: "",
        image:"",
       }]
      });
    console.log("Initial FormState:", formState)
    
    useEffect(()=>{
        setTimeout(()=>{
            id && setBlogData(id)
            setIsLoading(false);
        },500)
        // setCampaignUserCount(id?.users?.length);
        axios.get(`${baseUrl}api/v1/blogs/${id ? id?._id : newObjectId?._id}`, {withCredentials:true})
          .then((res)=>{
              setBlogData(res.data.data);
              setUpdatedDocument(res.data.data)
              console.log("API Call Blog:",res.data.data)
              setNewObjectId(res.data.data);
              setFormState({
                  blogTitle: res.data.data?.blogTitle || '',
                  content: res.data.data?.content || '',
                  author: res.data.data?.author || '',
                  thumbnailImage: res.data?.thumbnailImage || '',
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
        
          if(!formState.blogTitle || !formState.content || !formState.author || !formState.thumbnailImage) 
          {
            setCreating(false);
            return openErrorSB("Error","Please fill the mandatory fields.")
          }
        console.log("Calling API")
        const res = await fetch(`${baseUrl}api/v1/blogs`, {

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

  async function onAddContent(e,childFormState,setChildFormState){
    e.preventDefault();
      setSaving(true)
      console.log("Child Form Data: ",childFormState.blogContent[0])
      try{
        const formData1 = new FormData();
        Object.keys(childFormState.blogContent[0]).forEach((key) => {
          // console.log("data to be appended:",key, childFormState.blogContent[0][key])
          // formData.append(key, data[key])
          formData1.append("blogContent."+key,childFormState.blogContent[0][key])
          // console.log("data appended",formData)
          // console.log("childFormState",childFormState.blogContent[0])
        });

        if (!childFormState.blogContent[0].serialNumber ||
          !childFormState.blogContent[0].content ||
          !childFormState.blogContent[0].header ||
          childFormState.blogContent[0].serialNumber.trim() === '' ||
          childFormState.blogContent[0].content.trim() === '' ||
          childFormState.blogContent[0].header.trim() === '') {
            setSaving(false);
        return openErrorSB("Error", "Please fill the mandatory fields.");
      }
 
        const res = await fetch(`${baseUrl}api/v1/blogs/${id ? id?._id : newObjectId?._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          // "content-type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: formData1
      });
      
    const data = await res.json();
    console.log("Data:",data)
    if (data.data) {
      setUpdatedDocument(data?.data);
      openSuccessSB("Content added","New Content line item has been added in the Blog")
      setTimeout(()=>{setSaving(false);setEditing(false)},500)
      setChildFormState(prevState => ({
          ...prevState,
          blogContent: []
      }))
    } else {
        openErrorSB("Error",data.error)
    }
    }catch(e){
      console.log(e);
    }
  }

  async function updateStatus(eid, status) {
    setSaving(true)
    setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
    const res = await fetch(`${baseUrl}api/v1/blogs/${eid}/${status}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        status
      })

    });

    const data = await res.json();
    const updatedData = data?.data
    if (updatedData || res.status === 200) {
      setNewObjectId(updatedData)
      openSuccessSB(`Blog ${status} successfully` , data.message)
      setTimeout(()=>{setSaving(false)},500)
    } else {
      openErrorSB("Error", data.error)
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
          Fill Blog Details
        </MDTypography>
        </MDBox>

        <Grid container display="flex" flexDirection="row" justifyContent="space-between">
        <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={9} xl={12}>
          
          
          <Grid item xs={12} md={6} xl={6}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Blog Title *'
                fullWidth
                value={formState?.blogTitle}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    blogTitle: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Author Name *'
                fullWidth
                value={formState?.author}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    author: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3}>
            <MDButton variant="outlined" style={{fontSize:10}} fullWidth color="success" component="label">
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
                onChange={(e) => {setFormState(prevState => ({
                  ...prevState,
                  content: e.target.value
                }))}}
              />
          </Grid>

          <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={3} xl={12}>
            <Grid item xs={12} md={6} lg={12}>
            {previewUrl ? 
              <img src={previewUrl} style={{height:"250px", width:"250px",borderRadius:"5px", border:"1px #ced4da solid"}}/>
            :
              <img src={imageFile} style={{height:"250px", width:"250px",borderRadius:"5px", border:"1px #ced4da solid"}}/>
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
                      color="success" 
                      size="small" 
                      sx={{mr:0, ml:1}} 
                      onClick={()=>{updateStatus(newObjectId?._id,newObjectId?.status === 'Created' ? 'Published' : newObjectId?.status === 'Published' ? 'Unpublished' : newObjectId?.status === 'Unpublished' ? 'Published' : '')}}
                    >
                        {newObjectId?.status === 'Created' ? 'Publish' : newObjectId?.status === 'Published' ? 'Unpublish' : newObjectId?.status === 'Unpublished' ? 'Publish' : ''}
                    </MDButton>
                    <MDButton 
                      variant="contained" 
                      color="warning" 
                      size="small" 
                      sx={{mr:1, ml:1}} 
                      onClick={(e)=>{setEditing(true)}}
                    >
                        Edit
                    </MDButton>
                    <MDButton variant="contained" color="info" size="small" onClick={()=>{navigate('/allblogs')}}>
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

         {(isSubmitted || id) && !editing && 
                <Grid item xs={12} md={6} xl={12} mt={4}>
                    
                    <Grid container spacing={1}>

                    <Grid item xs={12} md={6} xl={12} mt={-3}>
                    <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                        Add Section
                    </MDTypography>
                    </Grid>
                    
                    <Grid item xs={12} md={12} xl={3}>
                        <TextField
                            id="outlined-required"
                            label='Index Number *'
                            fullWidth
                            type="number"
                            onChange={(e) => {
                              const indexToUpdate = 0; // Specify the index of the object you want to update
                            
                              setChildFormState((prevState) => ({
                                ...prevState,
                                blogContent: prevState.blogContent.map((item, index) =>
                                  index === indexToUpdate
                                    ? { ...item, serialNumber: e.target.value }
                                    : item
                                )
                              }));
                            }}
                        />
                    </Grid>
        
                    <Grid item xs={12} md={12} xl={6}>
                        <TextField
                            id="outlined-required"
                            label='Sub Heading *'
                            fullWidth
                            type="text"
                            onChange={(e) => {
                              const indexToUpdate = 0; // Specify the index of the object you want to update
                            
                              setChildFormState((prevState) => ({
                                ...prevState,
                                blogContent: prevState.blogContent.map((item, index) =>
                                  index === indexToUpdate
                                    ? { ...item, header: e.target.value }
                                    : item
                                )
                              }));
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} xl={3}>
                      <MDButton variant="outlined" style={{fontSize:10}} fullWidth color="success" component="label">
                        {!formState?.image?.name ? "Upload Header Image" : "Upload Another File?"}
                        <input 
                        hidden 
                        accept="image/*" 
                        type="file" 
                        // onChange={(e) => {
                        //   setChildFormState(prevState => ({
                        //     ...prevState,
                        //     image: e.target.files[0]
                        //   }));
                        //   handleImageUpload(e);
                        // }}
                        onChange={(e) => {
                          const indexToUpdate = 0; // Specify the index of the object you want to update
                        
                          setChildFormState((prevState) => ({
                            ...prevState,
                            blogContent: prevState.blogContent.map((item, index) =>
                              index === indexToUpdate
                                ? { ...item, image: e.target.files[0] }
                                : item
                            )
                          }));
                          handleImageUpload(e);
                        }}
                        />
                      </MDButton>
                    </Grid>

                    <Grid item xs={12} md={12} xl={12}>
                        <TextField
                            id="outlined-required"
                            label='Subheading Content *'
                            fullWidth
                            multiline
                            rows={20}
                            type="text"
                            onChange={(e) => {
                              const indexToUpdate = 0; // Specify the index of the object you want to update
                            
                              setChildFormState((prevState) => ({
                                ...prevState,
                                blogContent: prevState.blogContent.map((item, index) =>
                                  index === indexToUpdate
                                    ? { ...item, content: e.target.value }
                                    : item
                                )
                              }));
                            }}
                        />
                    </Grid>
            
                    <Grid item xs={12} md={0.6} xl={1.2} mt={-0.7}>
                        <IoMdAddCircle cursor="pointer" onClick={(e)=>{onAddContent(e,childFormState,setChildFormState)}}/>
                    </Grid>

                    {(isSubmitted || id) && <Grid item xs={12} md={12} xl={12} mt={2}>
                    <MDBox>
                        <Content updatedDocument={updatedDocument} setUpdatedDocument={setUpdatedDocument}/>
                    </MDBox>
                    </Grid>}
    
                    </Grid>
    
                </Grid>}

          {renderSuccessSB}
          {renderErrorSB}
    </MDBox>
    )
                }
    </>
    )
}
export default Index;