import * as React from 'react';
import { useContext, useState } from "react";
import TextField from '@mui/material/TextField';
import { Grid, Card, CardContent, CardActionArea } from "@mui/material";
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

export default function CreateQuestions({ createForm, setCreateForm, courseId, content }) {

    console.log("courseId", content)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formState, setFormState] = useState({
        order: "" || content?.order,
        topic: "" || content?.topic,
    });
    const [isLoading, setIsLoading] = useState(false)

    async function onNext(e) {
        e.preventDefault()

        if (!formState?.order || !formState?.topic) {
            setTimeout(() => { setIsSubmitted(false) }, 500)
            return openErrorSB("Missing Field", "Please fill all the mandatory fields")
        }

        const formData = new FormData();

        for (let elem in formState) {
            formData.append(`${elem}`, formState[elem]);
        }

        if (content?.order) {
            const res = await fetch(`${apiUrl}courses/${courseId}/content/${content?._id}`, {
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
            } else {
                setTimeout(() => { setIsSubmitted(false) }, 500)
                console.log("Invalid Entry");
                return openErrorSB("Couldn't Add Reward", data.error)
            }
        } else {
            const res = await fetch(`${apiUrl}courses/${courseId}/content`, {
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

            } else {
                setTimeout(() => { setIsSubmitted(false) }, 500)
                console.log("Invalid Entry");
                return openErrorSB("Couldn't Add Reward", data.error)
            }
        }
    }


    const [order, setTitle] = useState('')
    const [contentData, setContent] = useState('')

    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = (order, content) => {
        setTitle(order)
        setContent(content)
        setSuccessSB(true);
    }
    const closeSuccessSB = () => setSuccessSB(false);
    // console.log("Title, Content, Time: ",order,content,time)


    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            order={order}
            content={contentData}
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite="info"
        />
    );

    const [errorSB, setErrorSB] = useState(false);
    const openErrorSB = (order, content) => {
        setTitle(order)
        setContent(content)
        setErrorSB(true);
    }
    const closeErrorSB = () => setErrorSB(false);

    const renderErrorSB = (
        <MDSnackbar
            color="error"
            icon="warning"
            order={order}
            content={contentData}
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
                                Content Details
                            </MDTypography>
                        </MDBox>

                        <Grid container mt={0.5} alignItems="space-between">
                            <Grid item xs={12} md={6} xl={9} >
                                <Grid item xs={12} md={12} xl={3}>
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

                                <Grid item xs={12} md={12} xl={9}>
                                    <TextField
                                        disabled={isSubmitted}
                                        id="outlined-required"
                                        placeholder='Topic*'
                                        inputMode='numeric'
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

                            <Grid item xs={12} md={6} xl={3}>
                                <Grid item xs={12} md={12} xl={12} display='flex' gap={5} >
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
