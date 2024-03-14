import * as React from 'react';
import { useContext, useState } from "react";
import TextField from '@mui/material/TextField';
import { Grid, Card, CardContent, CardActionArea, FormControlLabel, Checkbox, FormGroup } from "@mui/material";
import MDTypography from "../../../../components/MDTypography";
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton"
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
// import InputLabel from '@mui/material/InputLabel';
import { CircularProgress, Typography } from "@mui/material";
import MDSnackbar from "../../../../components/MDSnackbar";
import { apiUrl } from '../../../../constants/constants';
// import FormControl from '@mui/material/FormControl';
import User from './users';

export default function Create({ createForm, setCreateForm, contestId, instructor }) {

    // console.log("contestId", instructor)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formState, setFormState] = useState({
        about: "" || instructor?.about,
        fee: '' || instructor?.fee,
        isPurchaseRequired: false || instructor?.isPurchaseRequired
    });
    const [selectedUser, setSelectedUser] = useState({
        id: '' || instructor?.id?._id,
        name: '' || instructor?.id?.first_name + " " + instructor?.id?.last_name,
        mobile: '' || instructor?.id?.mobile
        
    });
    const [instructorImage, setInstructorImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState('');

    const handleImage = (event) => {
        const file = event.target.files[0];
        setInstructorImage(event.target.files);
        // Create a FileReader instance
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    async function onNext(e) {
        e.preventDefault()

        if(!selectedUser?.id){
            return openErrorSB("Missing Field", "Please select instructor")
        }

        if (!formState?.about) {
            setTimeout(() => { setIsSubmitted(false) }, 500)
            return openErrorSB("Missing Field", "Please fill all the mandatory fields")
        }

        const formData = new FormData();
        if (instructorImage) {
            formData.append("instructorImage", instructorImage[0]);
        }

        for (let elem in formState) {
            formData.append(`${elem}`, formState[elem]);
        }


        if (selectedUser?.id) {
            formData.append("instructor", selectedUser?.id);
        }

       
        if (instructor?.about) {
            const res = await fetch(`${apiUrl}dailycontest/${contestId}/instructor/${instructor?._id}`, {
                method: "PATCH",
                credentials: "include",
                body: formData
            });

            const data = await res.json();
            if (!data.error) {
                setTimeout(() => { setIsSubmitted(true) }, 500)
                openSuccessSB(data.message, `Contest Reward Created with prize: ${data.data?.prize}`)
                setCreateForm(!createForm);
            } else {
                setTimeout(() => { setIsSubmitted(false) }, 500)
                console.log("Invalid Entry");
                return openErrorSB("Couldn't Add Reward", data.error)
            }
        } else {
            const res = await fetch(`${apiUrl}dailycontest/${contestId}/instructor`, {
                method: "PATCH",
                credentials: "include",
                body: formData
            });

            const data = await res.json();
            if (!data.error) {
                setTimeout(() => { setIsSubmitted(true) }, 500)
                openSuccessSB(data.message, `Contest Reward Created with prize: ${data.data?.prize}`)
                setCreateForm(!createForm);

            } else {
                setTimeout(() => { setIsSubmitted(false) }, 500)
                console.log("Invalid Entry");
                return openErrorSB("Couldn't Add Reward", data.error)
            }
        }
    }


    const [about, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = (about, content) => {
        setTitle(about)
        setContent(content)
        setSuccessSB(true);
    }
    const closeSuccessSB = () => setSuccessSB(false);
    // console.log("Title, Content, Time: ",about,content,time)


    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            about={about}
            content={content}
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite="info"
        />
    );

    const [errorSB, setErrorSB] = useState(false);
    const openErrorSB = (about, content) => {
        setTitle(about)
        setContent(content)
        setErrorSB(true);
    }
    const closeErrorSB = () => setErrorSB(false);

    const renderErrorSB = (
        <MDSnackbar
            color="error"
            icon="warning"
            about={about}
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
                    <MDBox mt={1} p={3}>
                        <MDBox display="flex" justifyContent="space-between" alignItems="center">
                            <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                Instructor Details
                            </MDTypography>
                        </MDBox>

                        <Grid container mt={0.5} alignItems="space-between">

                            <Grid item xs={12} md={6} xl={12} display="flex"
                                justifyContent="space-between"
                                alignItems="center" gap={2}>
                                <Grid item xs={12} md={6} xl={3.5}>
                                    <User selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                                </Grid>

                                <Grid item xs={12} md={6} xl={4.5}>
                                    <TextField
                                        disabled={isSubmitted}
                                        id="outlined-required"
                                        placeholder='About*'
                                        // inputMode='numeric'
                                        fullWidth
                                        value={formState?.about}
                                        onChange={(e) => {
                                            setFormState(prevState => ({
                                                ...prevState,
                                                about: e.target.value
                                            }))
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6} xl={4}>
                                    <TextField
                                        disabled={isSubmitted}
                                        id="outlined-required"
                                        placeholder='Contest Fee*'
                                        type='number'
                                        fullWidth
                                        value={formState?.fee}
                                        onChange={(e) => {
                                            setFormState(prevState => ({
                                                ...prevState,
                                                fee: e.target.value
                                            }))
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6} xl={4} mb={.5} display='flex' gap={1} mt={1} justifyContent={'space-between'}>
                                    <Grid item xs={12} md={12} xl={12}>
                                        <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={(instructor?.image && !instructorImage) ? "warning" : ((instructor?.image && instructorImage) || instructorImage) ? "error" : "success"} component="label">
                                            Upload Image(1080X720)
                                            <input
                                                hidden
                                                disabled={isSubmitted}
                                                accept="image/*"
                                                type="file"
                                                onChange={(e) => {
                                                    handleImage(e);
                                                }}
                                            />
                                        </MDButton>
                                    </Grid>


                                </Grid>
                            </Grid>

                            <Grid item xs={12} md={6} xl={12} display="flex"
                                justifyContent="space-between"
                                alignItems="center" gap={2}>
                                <Grid item xs={12} md={6} xl={3}>
                                    <Grid container xs={12} md={12} xl={12} display="flex" justifyContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                        {previewUrl ?

                                            <Grid item xs={12} md={12} xl={3} style={{ maxWidth: '100%', height: 'auto' }}>
                                                <Grid container xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                                                    <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                                                        <Card sx={{ minWidth: '100%', cursor: 'pointer' }}>
                                                            <CardActionArea>
                                                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                                                    <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                                                        <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                                                            <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{ textAlign: 'center' }}>
                                                                                Image
                                                                            </Typography>
                                                                        </MDBox>
                                                                    </CardContent>
                                                                </Grid>
                                                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                                                    <img src={previewUrl} style={{ maxWidth: '100%', height: 'auto', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
                                                                </Grid>
                                                            </CardActionArea>
                                                        </Card>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            :
                                            <Grid item xs={12} md={12} xl={3} style={{ maxWidth: '100%', height: 'auto' }}>
                                                <Grid container xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                                                    <Grid item xs={12} md={12} xl={12} style={{ maxWidth: '100%', height: 'auto' }}>
                                                        <Card sx={{ minWidth: '100%', cursor: 'pointer' }}>
                                                            <CardActionArea>
                                                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                                                    <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                                                        <MDBox mb={-2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', height: 'auto' }}>
                                                                            <Typography variant="caption" fontFamily='Segoe UI' fontWeight={600} style={{ textAlign: 'center' }}>
                                                                                Image
                                                                            </Typography>
                                                                        </MDBox>
                                                                    </CardContent>
                                                                </Grid>
                                                                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                                                    <img src={instructor?.image} style={{ maxWidth: '100%', height: 'auto', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
                                                                </Grid>
                                                            </CardActionArea>
                                                        </Card>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        }
                                    </Grid>
                                </Grid>

                                <Grid item xs={12} md={6} xl={3}>
                                    <FormGroup>
                                        <FormControlLabel
                                            checked={
                                                formState?.isPurchaseRequired
                                            }
                                            // disabled={(isSubmitted || contest) && (!editing || saving)}
                                            control={<Checkbox />}
                                            onChange={(e) => {
                                                setFormState((prevState) => ({
                                                    ...prevState,
                                                    isPurchaseRequired: e.target.checked,
                                                }));
                                            }}
                                            label="Is Purchase Required"
                                        />
                                    </FormGroup>
                                </Grid>

                                <Grid item xs={12} md={6} xl={6} display='flex' justifyContent={'flex-end'} >
                                    {!isSubmitted && (
                                        <>
                                            <Grid item xs={12} md={2} xl={2} width="100%">
                                                <MDButton variant="contained" size="small" color="success" onClick={(e) => { onNext(e, formState) }}>Save</MDButton>
                                            </Grid>
                                            <Grid item xs={12} md={2} xl={2} width="100%">
                                                <MDButton variant="contained" size="small" color="warning" onClick={(e) => { setCreateForm(!createForm); setFormState({}) }}>Back</MDButton>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
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
