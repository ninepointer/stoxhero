import React from 'react'
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import { CircularProgress, IconButton, InputAdornment } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";

import { IoMdAddCircle } from 'react-icons/io';



const CollegeEdit = () => {

    const location = useLocation();
    const id = location?.state?.data;
    console.log(id)
    console.log("Campaign Users: ", id?.users?.length)
    const [campaignUserCount, setCampaignUserCount] = useState(id?.users?.length);
    const [isSubmitted, setIsSubmitted] = useState(false);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [isLoading, setIsLoading] = useState(id ? true : false)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [creating, setCreating] = useState(false)
    const navigate = useNavigate();
    const [newObjectId, setNewObjectId] = useState("");
    const [updatedDocument, setUpdatedDocument] = useState([]);
    const [campaignData, setCampaignData] = useState([])
    const [cac, setCAC] = useState(0);
    console.log(id?.campaignName)
    const [formState, setFormState] = useState({
        collegeName: '',
        zone: '',

    });

    useEffect(() => {
        setTimeout(() => {
            id && setUpdatedDocument(id)
            setIsLoading(false);
        }, 500)

    }, [])

    React.useEffect(() => {

        axios.get(`${baseUrl}api/v1/college/${id?._id}`)
            .then((res) => {



                setFormState({
                    collegeName: res.data.data?.collegeName || '',
                    zone: res.data.data?.zone || '',

                });
                setTimeout(() => { setIsLoading(false) }, 500)
            }).catch((err) => {
                return new Error(err);
            })

    }, [])

    

    async function onEdit(e, formState) {
        e.preventDefault()
        console.log("Edited FormState: ", formState, id._id)
        setSaving(true)
        console.log(formState)
        if (!formState.collegeName || !formState.zone) {
            setTimeout(() => { setSaving(false) ; setEditing(true)}, 500)
            return openErrorSB("Missing Field", "Please fill all the mandatory fields")
        }
        const { collegeName, zone } = formState;
    
        const res = await fetch(`${baseUrl}api/v1/college/${id._id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                collegeName, zone
            })
        });
    
        const data = await res.json();
        console.log(data);
        if (data.status === 422 || data.error || !data) {
            openErrorSB("Error", data.error)
        } else {
            openSuccessSB("Campaign Edited", "Edited Successfully")
            setTimeout(() => {setSaving(false); setEditing(false)}, 500)
            console.log("entry succesfull");
        }
    }




    async function onSubmit(e,formState){
        e.preventDefault()
        console.log(formState)
        if(!formState.collegeName || !formState.zone){
        
            setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
            return openErrorSB("Missing Field","Please fill all the mandatory fields")
        }
        // console.log("Is Submitted before State Update: ",isSubmitted)
        setTimeout(()=>{setCreating(false);setIsSubmitted(true)},500)
        const {collegeName, zone } = formState;
        const res = await fetch(`${baseUrl}api/v1/college`, {
            method: "POST",
            credentials:"include",
            headers: {
                "content-type" : "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
              collegeName, zone
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

    

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = (title, content) => {
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
    const openErrorSB = (title, content) => {
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

    const handleChange = (e) => {
        if (!formState.collegeName.includes(e.target.value)) {
          setFormState(prevState => ({
            ...prevState,
            collegeName: e.target.value,
          }));
        }
      };

    return (
        <>

            <DashboardLayout>
                <DashboardNavbar />

                <MDBox>
                    {isLoading ? (
                        <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
                            <CircularProgress color="info" />
                        </MDBox>
                    )
                        :
                        (
                            <MDBox pl={2} pr={2} mt={4} mb={2}>
                                <MDBox  display="flex" justifyContent="space-between" alignItems="center">
                                    <MDTypography variant="caption" fontWeight="bold"  textTransform="uppercase">
                                        Fill college Details
                                    </MDTypography>
                                </MDBox>

                                <Grid container display="flex" flexDirection="row" justifyContent="space-between">
                                    <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={9} xl={12}>
                                        <Grid  item xs={12} md={6} xl={6} mt={2}>
                                            <TextField
                                                disabled={((isSubmitted || id) && (!editing || saving))}
                                                id="outlined-required"
                                                label='College Name *'
                                                
                                                fullWidth
                                                // value={formState?.collegeName || id?.collegeName}
                                                // value={editing ? formState.collegeName : id?.collegeName}
                                                defaultValue={editing ? formState.collegeName : id?.collegeName}
                                                
                                                // onChange={(e) => {
                                                //     setFormState(prevState => ({
                                                //         ...prevState,
                                                //         collegeName: e.target.value
                                                //     }))
                                                // }}

                                                onChange={handleChange}
                                            />



                                     </Grid>



                                        <Grid item xs={12} md={6} xl={6} mt={2}>
                                            <FormControl sx={{ width: "100%" }}>
                                                <InputLabel id="demo-simple-select-autowidth-label">Zone*</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-autowidth-label"
                                                    id="demo-simple-select-autowidth"
                                                    value={formState?.zone || id?.zone}
                                                    // value={oldObjectId ? contestData?.status : formState?.status}
                                                    disabled={((isSubmitted || id) && (!editing || saving))}
                                                    onChange={(e) => {
                                                        setFormState(prevState => ({
                                                            ...prevState,
                                                            zone: e.target.value
                                                        }))
                                                    }}
                                                    label="zone"
                                                    sx={{ minHeight: 43 }}
                                                >
                                                    <MenuItem value="North">North</MenuItem>
                                                    <MenuItem value="South">South</MenuItem>
                                                    <MenuItem value="East">East</MenuItem>
                                                    <MenuItem value="West">West</MenuItem>
                                                    <MenuItem value="Central">Central</MenuItem>

                                                </Select>
                                            </FormControl>
                                        </Grid>




                                    </Grid>

                                </Grid>

                                <Grid container  mt={2} xs={12} md={12} xl={12} >
                                    <Grid item display="flex" justifyContent="flex-end"  xs={12} md={6} xl={12}>
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
                                                    {creating ? <CircularProgress size={20} color="inherit" /> : "Save"}
                                                </MDButton>
                                                <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/college") }}>
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
                                                    sx={{ mr: 1, ml: 2 }}
                                                    onClick={(e) => { setEditing(!editing) }}
                                                    
                                                >
                                                    Edit
                                                </MDButton>
                                                <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/college') }}>
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
                                                    sx={{ mr: 1, ml: 2 }}
                                                    disabled={saving}
                                                    onClick={(e) => { onEdit(e, formState) }}
                                                >
                                                    {saving ? <CircularProgress size={20} color="inherit"/> : "Save"}
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



                                </Grid>

                                {renderSuccessSB}
                                {renderErrorSB}
                            </MDBox>
                        )
                    }
                </MDBox>


                <Footer />
            </DashboardLayout>
        </>

    )
}

export default CollegeEdit



