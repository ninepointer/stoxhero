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

export default function CreateQuestions({ createQuestionForm, setCreateQuestionForm, option, questionId, quizId, setData }) {

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formState, setFormState] = useState({
        optionKey: "" || option?.optionKey,
        optionText: "" || option?.optionText,
        isCorrect: false || option?.isCorrect,
    });
    const [quizImage, setQuizImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState('');

    const handleImage = (event) => {
        const file = event.target.files[0];
        setQuizImage(event.target.files);
        // Create a FileReader instance
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    async function onNext(e) {
        e.preventDefault()

        if (!formState?.optionKey || !formState?.optionText) {
            setTimeout(() => { setIsSubmitted(false) }, 500)
            return openErrorSB("Missing Field", "Please fill all the mandatory fields")
        }

        const formData = new FormData();
        if (quizImage) {
            formData.append("optionImage", quizImage[0]);
        }

        for (let elem in formState) {
            formData.append(`${elem}`, formState[elem]);
        }

        if (option?.optionText) {
            const res = await fetch(`${apiUrl}quiz/${quizId}/option/${questionId}/${option?._id}`, {
                method: "PATCH",
                credentials: "include",
                body: formData
            });

            const data = await res.json();
            if (!data.error) {
                setTimeout(() => { setIsSubmitted(true) }, 500)
                openSuccessSB(data.message, `Contest Reward Created with prize: ${data.data?.prize}`)
                setCreateQuestionForm(!createQuestionForm);
                setData(data?.data?.options)
            } else {
                setTimeout(() => { setIsSubmitted(false) }, 500)
                console.log("Invalid Entry");
                return openErrorSB("Couldn't Add Reward", data.error)
            }
        } else {
            const res = await fetch(`${apiUrl}quiz/${quizId}/option/${questionId}`, {
                method: "PATCH",
                credentials: "include",
                body: formData
            });

            const data = await res.json();
            if (!data.error) {
                setTimeout(() => { setIsSubmitted(true) }, 500)
                openSuccessSB(data.message, `Contest Reward Created with prize: ${data.data?.prize}`)
                setCreateQuestionForm(!createQuestionForm);
                setData(data?.data?.options)
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
                                Option Details
                            </MDTypography>
                        </MDBox>

                        <Grid container mt={0.5} alignItems="space-between">

                            <Grid item xs={12} md={6} xl={9} >

                                <Grid item xs={12} md={6} xl={12} display='flex' gap={1} mt={1} justifyContent={'space-between'}>
                                    <Grid item xs={12} md={6} xl={6}>
                                        <TextField
                                            disabled={isSubmitted}
                                            id="outlined-required"
                                            placeholder='Option Key*'
                                            inputMode='numeric'
                                            fullWidth
                                            value={formState?.optionKey}
                                            onChange={(e) => {
                                                setFormState(prevState => ({
                                                    ...prevState,
                                                    optionKey: e.target.value
                                                }))
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6} xl={6}>
                                        <TextField
                                            disabled={isSubmitted}
                                            id="outlined-required"
                                            placeholder='Option Text*'
                                            inputMode='numeric'
                                            fullWidth
                                            value={formState?.optionText}
                                            onChange={(e) => {
                                                setFormState(prevState => ({
                                                    ...prevState,
                                                    optionText: e.target.value
                                                }))
                                            }}
                                        />
                                    </Grid>
                                </Grid>





                                <Grid item xs={12} md={6} xl={12} display='flex' gap={1} mt={1} justifyContent={'space-between'}>
                                    <Grid item xs={12} md={6} xl={6}>
                                        <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={(option?.image && !quizImage) ? "warning" : ((option?.image && quizImage) || quizImage) ? "error" : "success"} component="label">
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

                                    <Grid item xs={12} md={6} xl={6}>
                                        <FormGroup>
                                            <FormControlLabel
                                                checked={formState?.isCorrect}
                                                disabled={isSubmitted}
                                                control={<Checkbox />}
                                                onChange={(e) => {
                                                    setFormState(prevState => ({
                                                        ...prevState,
                                                        isCorrect: e.target.checked
                                                    }))
                                                }}
                                                label="CORRECT" />
                                        </FormGroup>
                                    </Grid>


                                </Grid>
                            </Grid>



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
                                                                            Question Image
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
                                                                            Question Image
                                                                        </Typography>
                                                                    </MDBox>
                                                                </CardContent>
                                                            </Grid>
                                                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                                                <img src={option?.optionImage} style={{ maxWidth: '100%', height: 'auto', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} />
                                                            </Grid>
                                                        </CardActionArea>
                                                    </Card>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    }
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
                                        <MDButton variant="contained" size="small" color="warning" onClick={(e) => { setCreateQuestionForm(!createQuestionForm) }}>Back</MDButton>
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
