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

export default function CreateSection({ createSections, setCreateSections, school, grade, data }) {

    const newData = data.map((elem)=>{
        return elem.sections.length > 0;
    })
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [noOfSection, setNoOfSection] = useState('');
    const [sectionValues, setSectionValues] = useState(Array.from({ length: noOfSection }, () => ''));

    const handleNoOfSectionChange = (e) => {
        const value = parseInt(e);
        setNoOfSection(e);
        setSectionValues(Array.from({ length: value }, () => ''));
    };

    const handleSectionValueChange = (index) => (e) => {
        const newSectionValues = [...sectionValues];
        newSectionValues[index] = e.target.value;
        setSectionValues(newSectionValues);
    };

    console.log('sectionValues', sectionValues)

    async function onNext(e) {
        e.preventDefault()

        for (let elem of sectionValues) {
            if (!elem) {
                return openErrorSB("Missing Section", "Please fill all the sections")
            }
        }

        const res = await fetch(`${apiUrl}school/${school}/section/${grade?._id}`, {
            method: "PATCH",
            credentials: "include",
            // body: formData
        });

        const data = await res.json();
        if (!data.error) {
            setTimeout(() => { setIsSubmitted(true) }, 500)
            openSuccessSB(data.message, `Contest Reward Created with prize: ${data.data?.prize}`)
            setCreateSections(!createSections);
        } else {
            setTimeout(() => { setIsSubmitted(false) }, 500)
            console.log("Invalid Entry");
            return openErrorSB("Couldn't Add Reward", data.error)
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
                    <MDBox m={1}>

                        <Grid container alignItems="space-between">

                            <Grid item xs={12} md={6} xl={12} >

                                <Grid item xs={12} md={6} xl={12} display='flex' justifyContent={'space-between'} alignContent={'center'} alignItems={'center'}>
                                    <Grid item xs={12} md={6} xl={5} >
                                        <TextField
                                            disabled={isSubmitted}
                                            id="outlined-required"
                                            placeholder='No Of Section*'
                                            type='number'
                                            fullWidth
                                            value={noOfSection}
                                            onChange={(e) => {
                                                handleNoOfSectionChange(e.target.value)
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6} xl={2} gap={1} display='flex' justifyContent={'center'} alignContent={'center'} alignItems={'center'}>
                                        <MDButton size="small" color="success" onClick={onNext} >
                                            Save
                                        </MDButton>
                                        <MDButton size="small" color="warning" onClick={()=>{setCreateSections(false)}} >
                                            Back
                                        </MDButton>
                                    </Grid>
                                </Grid>
                               
                                <Grid item xs={12} md={6} xl={12} mt={1} display='flex' gap={1} flexWrap={'wrap'} justifyContent={'flex-start'} alignContent={'center'} alignItems={'center'}>
                                    {sectionValues.map((elem, index) => {
                                        return (
                                            <Grid item xs={12} md={3} xl={2} key={index}>
                                                <TextField
                                                    id={`outlined-required-${index}`}
                                                    placeholder={`Section ${index + 1}`}
                                                    fullWidth
                                                    value={sectionValues[index]}
                                                    onChange={handleSectionValueChange(index)}
                                                />
                                            </Grid>
                                        )
                                    })}
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
