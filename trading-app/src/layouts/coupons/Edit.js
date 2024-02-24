
// import { Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material'
// import React, { useState } from 'react'
// import MDButton from '../../components/MDButton'
// import { Link} from "react-router-dom";
// import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
// import Footer from "../../examples/Footer";

// const Edit = () => {

    


//     let [data, setData] = useState({
//         fname: "",
//         lname: "",
        
//     })
    
//     let [newData, setNewData] = useState([])
    
    
    
    
//     const HandleChange = (e) => {
    
//      let { name, value } = e.target;
    
//         setData((prev) => {
//             return {
//                 ...prev, [name]: value
//             }
//         })
    
//     }
    
//     const HandleSubmit = (e) => {
    
//         e.preventDefault();
//         setNewData([...newData, data]);    
      
//         setData({fname:"",lname:""})
//     }
    

//   return (

//    <DashboardLayout>

//     <DashboardNavbar />
//         <Card style={{ maxWidth: "70%", margin: "60px auto", padding: "20px 5px", textAlign: "left" }} sx={{ xs: "20px" }} >
//                 <CardContent>

//                     <Typography  gutterBottom variant='h5'>Edit College Details</Typography>
                    

//                     <form onSubmit={HandleSubmit} >


//                         <Grid container spacing={5}>

//                             <Grid item xs={12} sm={12} >

//                                 <TextField value={data.fname} name='fname' label="College Name" placeholder='Enter College name' variant='outlined' fullWidth required onChange={HandleChange} />

//                             </Grid>

//                             <Grid item xs={12} sm={12} >

//                                 <TextField value={data.lname} name='lname' label="Zone" placeholder='Enter Zone' variant='outlined' fullWidth required onChange={HandleChange} />

//                             </Grid>

//                             <Grid item xs={12}  >

//                                 <Button type='submit' variant='contained' sx={{color:"#fff"}} fullWidth>Save</Button>

//                             </Grid>

//                             <Grid item xs={12}>

//                                 <MDButton component = {Link} to={{pathname: `/college`}} variant='contained' color={"light"} sx={{color:"#fff",background:'blue','&:hover':{background:"blue"}}} fullWidth >Back</MDButton>

//                             </Grid>


                            

//                         </Grid>
                            

//                     </form>
//                 </CardContent>
//             </Card>
//         <Footer />
//     </DashboardLayout>
         
//   )
// }

// export default Edit




















import React ,{useEffect, useState} from "react";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";

import { IoMdAddCircle } from 'react-icons/io';

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";



function Index() {

    const location = useLocation();
    const  id  = location?.state?.data;
    console.log("Campaign Users: ",id?.users?.length)
    const [campaignUserCount, setCampaignUserCount] = useState(id?.users?.length);
    const [isSubmitted,setIsSubmitted] = useState(false);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/api/v1/college"
    const [isLoading,setIsLoading] = useState(id ? true : false)
    const [editing,setEditing] = useState(false)
    const [saving,setSaving] = useState(false)
    const [creating,setCreating] = useState(false)
    const navigate = useNavigate();
    const [newObjectId, setNewObjectId] = useState("");
    const [updatedDocument, setUpdatedDocument] = useState([]);
    const [campaignData,setCampaignData] = useState([])
    const [cac,setCAC] = useState(0);
    console.log(id?.collegeName)
    const [formState,setFormState] = useState({
        collegeName: '',
        zone:'',
        
    });

    useEffect(()=>{
        setTimeout(()=>{
            id && setUpdatedDocument(id)
            setIsLoading(false);
        },500)
        // setCampaignUserCount(id?.users?.length);
    },[])
    console.log("Campaign User Count: ",campaignUserCount);
    React.useEffect(()=>{

      axios.get(`${baseUrl}api/v1/college/${id?._id}`,{withCredentials:true})
      .then((res)=>{
          setCampaignData(res.data.data);
          setUpdatedDocument(res.data.data);
          console.log("Campaign data is", res.data)
          setCAC(((res.data.data.campaignCost)/campaignUserCount).toFixed(2))
          // setCampaignUserCount(res?.data?.data?.users?.length);
          setFormState({
              collegeName: res.data.data?.collegeName || '',
              zone: res.data.data?.zone || '',
              
            });
              setTimeout(()=>{setIsLoading(false)},500) 
      }).catch((err)=>{
          return new Error(err);
      })
  
  },[isLoading,editing,campaignUserCount])

    async function onSubmit(e,formState){
      e.preventDefault()
      console.log(formState)
      if(!formState.campaignName || !formState.description || !formState.campaignCode || !formState.campaignFor || !formState.campaignLink || !formState.status){
      
          setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
          return openErrorSB("Missing Field","Please fill all the mandatory fields")
      }
      // console.log("Is Submitted before State Update: ",isSubmitted)
      setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
      const {campaignName, description, campaignCode, campaignFor, campaignLink, campaignCost, status } = formState;
      const res = await fetch(`${baseUrl}api/v1/campaign/create`, {
          method: "POST",
          credentials:"include",
          headers: {
              "content-type" : "application/json",
              "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify({
            campaignName, description, campaignCode, campaignFor, campaignLink, campaignCost, status
          })
      });
      
      
      const data = await res.json();
      console.log(data);
      if (data.status === 400 || data.info) {
          setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
          openErrorSB("Campaign not created",data?.info)
      } else {
          openSuccessSB("Campaign Created",data?.message)
          setNewObjectId(data?.data?._id)
          console.log("New Object Id: ",data?.data?._id,newObjectId)
          setIsSubmitted(true)
          setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
        }
    }
  
  async function onEdit(e,formState){
      e.preventDefault()
      console.log("Edited FormState: ",formState,id._id)
      setSaving(true)
      console.log(formState)
      if(!formState.campaignName || !formState.description || !formState.campaignFor || !formState.campaignLink || !formState.campaignCode || !formState.status){
          setTimeout(()=>{setSaving(false);setEditing(true)},500)
          return openErrorSB("Missing Field","Please fill all the mandatory fields")
      }
      const { campaignName, description, campaignFor, campaignLink, campaignCode, campaignCost, status } = formState;
  
      const res = await fetch(`${baseUrl}api/v1/campaign/${id._id}`, {
          method: "PATCH",
          credentials:"include",
          headers: {
              "content-type" : "application/json",
              "Access-Control-Allow-Credentials": true
          },
          body: JSON.stringify({
            campaignName, description, campaignFor, campaignLink, campaignCost, campaignCode, status, 
          })
      });
  
      const data = await res.json();
      console.log(data);
      if (data.status === 422 || data.error || !data) {
          openErrorSB("Error",data.error)
      } else {
          openSuccessSB("Campaign Edited", "Edited Successfully")
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


  console.log("Campaign User Count: ",campaignUserCount);
    return (
    <DashboardLayout>
         <DashboardNavbar />
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
          Fill College Details
        </MDTypography>
        </MDBox>

        <Grid container display="flex" flexDirection="row" justifyContent="space-between">
        <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={9} xl={12}>
          <Grid item xs={12} md={6} xl={3} mt={2}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='College Name *'
                fullWidth
                value={formState?.collegeName || id?.collegeName}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    collegeName: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={3} mt={2}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Zone *'
                fullWidth
                value={formState?.zone || id?.zone}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    zone: e.target.value
                  }))}}
              />
          </Grid>

          {/* <Grid item xs={12} md={6} xl={3} mt={2}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Campaign For *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={formState?.campaignFor || id?.campaignFor}
                // value={oldObjectId ? contestData?.status : formState?.status}
                disabled={((isSubmitted || id) && (!editing || saving))}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    campaignFor: e.target.value
                }))}}
                label="Job Type"
                sx={{ minHeight:43 }}
                >
                <MenuItem value="Facebook">Facebook</MenuItem>
                <MenuItem value="Instagram">Instagram</MenuItem>
                <MenuItem value="Twitter">Twitter</MenuItem>
                <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                <MenuItem value="Career">Career</MenuItem>
                <MenuItem value="Google">Google</MenuItem>
                <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                <MenuItem value="Telegram">Telegram</MenuItem>
                <MenuItem value="Influencer">Influencer</MenuItem>
                <MenuItem value="Website">Website</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6} xl={3} mt={2}>
              <FormControl sx={{width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={formState?.status || id?.status}
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
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
          </Grid>

          <Grid item xs={6} md={6} xl={2} mt={2}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Campaign Cost (in ₹)'
                fullWidth
                type='number'
                multiline
                value={formState?.campaignCost || id?.campaignCost}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    campaignCost: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={6} md={6} xl={2} mt={2}>
            <TextField
                disabled={true}
                id="outlined-required"
                label='CAC'
                fullWidth
                multiline
                value={"₹"+cac}
                defaultValue={cac}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={8} mt={2}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Campaign Link *'
                fullWidth
                multiline
                value={formState?.campaignLink || id?.campaignLink}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    campaignLink: e.target.value
                  }))}}
              />
          </Grid>

          <Grid item xs={12} md={6} xl={12} mt={2}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                label='Campaign Description *'
                fullWidth
                multiline
                value={formState?.description || id?.description}
                onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    description: e.target.value
                  }))}}
              />
          </Grid> */}
            
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
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={()=>{navigate("/college")}}>
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
                      sx={{mr:1, ml:2}} 
                      onClick={(e)=>{setEditing(true)}}
                    >
                        Edit
                    </MDButton>
                    <MDButton variant="contained" color="info" size="small" onClick={()=>{navigate('/college')}}>
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

            {/* {(id || newObjectId) && 
            <Grid item xs={12} md={12} xl={12} mt={2}>
                <MDBox>
                    <CampaignUsers campaign={campaignData} campaignUserCount={campaignUserCount}/>
                </MDBox>
            </Grid>} */}

         </Grid>

          {renderSuccessSB}
          {renderErrorSB}
    </MDBox>
    )
                }
                <Footer />
    </DashboardLayout>
    )
}
export default Index;