import * as React from 'react';
import { useContext, useState } from "react";
import TextField from '@mui/material/TextField';
import { Grid, Card, CardContent, CardActionArea, FormControlLabel, FormGroup, Checkbox } from "@mui/material";
import MDTypography from "../../../../components/MDTypography";
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton"
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { CircularProgress, Typography } from "@mui/material";
import MDSnackbar from "../../../../components/MDSnackbar";
import { apiUrl } from '../../../../constants/constants';
import FormControl from '@mui/material/FormControl';

export default function Create({ createForm, setCreateForm, subtopic, contentId, courseId, setData }) {

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formState, setFormState] = useState({
        order: "" || subtopic?.order,
        topic: "" || subtopic?.topic,
    });
    const [isLoading, setIsLoading] = useState(false)


    async function onNext(e) {
        e.preventDefault()

        if (!formState?.order || !formState?.topic) {
            setTimeout(() => { setIsSubmitted(false) }, 500)
            return openErrorSB("Missing Field", "Please fill all the mandatory fields")
        }

        if (subtopic?.topic) {
            const res = await fetch(`${apiUrl}courses/${courseId}/subtopic/${contentId}/${subtopic?._id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    order: parseInt(formState?.order), topic: formState?.topic
                })
            });

            const data = await res.json();
            if (!data.error) {
                setTimeout(() => { setIsSubmitted(true) }, 500)
                openSuccessSB(data.message, `Contest Reward Created with prize: ${data.data?.prize}`)
                setCreateForm(!createForm);
                setData(data?.data)
            } else {
                setTimeout(() => { setIsSubmitted(false) }, 500)
                console.log("Invalid Entry");
                return openErrorSB("Couldn't Add Reward", data.error)
            }
        } else {
            const res = await fetch(`${apiUrl}courses/${courseId}/subtopic/${contentId}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    order: parseInt(formState?.order), topic: formState?.topic
                })
            });

            const data = await res.json();
            if (!data.error) {
                setTimeout(() => { setIsSubmitted(true) }, 500)
                openSuccessSB(data.message, `Contest Reward Created with prize: ${data.data?.prize}`)
                setCreateForm(!createForm);
                setData(data?.data?.subtopics)
            } else {
                setTimeout(() => { setIsSubmitted(false) }, 500)
                console.log("Invalid Entry");
                return openErrorSB("Couldn't Add Reward", data.error)
            }
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


    return (
        <>
            {isLoading ? (
                <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
                    <CircularProgress color="info" />
                </MDBox>
            )
                :
                (
                    <MDBox mt={4} p={3}>
                        <MDBox display="flex" justifyContent="space-between" alignItems="center">
                            <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                Sub Topic Details
                            </MDTypography>
                        </MDBox>

                        <Grid container mt={0.5} alignItems="space-between">
                            <Grid item xs={12} md={6} xl={12} display='flex' gap={1} mt={1} justifyContent={'space-between'}>
                                <Grid item xs={12} md={6} xl={6}>
                                    <TextField
                                        disabled={isSubmitted}
                                        id="outlined-required"
                                        placeholder='Order*'
                                        inputMode='numeric'
                                        fullWidth
                                        value={formState?.order}
                                        onChange={(e) => {
                                            setFormState(prevState => ({
                                                ...prevState,
                                                order: e.target.value
                                            }))
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6} xl={6}>
                                    <TextField
                                        disabled={isSubmitted}
                                        id="outlined-required"
                                        placeholder='Topic*'
                                        fullWidth
                                        value={formState?.topic}
                                        onChange={(e) => {
                                            setFormState(prevState => ({
                                                ...prevState,
                                                topic: e.target.value
                                            }))
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} xl={4} mt={1} display='flex' gap={10}
                        // justifyContent={'space-around'} 
                        >
                            {!isSubmitted && (
                                <>
                                    <Grid item xs={12} md={2} xl={1} width="100%">
                                        <MDButton variant="contained" size="small" color="success" onClick={(e) => { onNext(e, formState) }}>Next</MDButton>
                                    </Grid>
                                    <Grid item xs={12} md={2} xl={1} width="100%">
                                        <MDButton variant="contained" size="small" color="warning" onClick={(e) => { setCreateForm(!createForm) }}>Back</MDButton>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        {renderSuccessSB}
                        {renderErrorSB}
                    </MDBox>
                )
            }
        </>
    )
}
