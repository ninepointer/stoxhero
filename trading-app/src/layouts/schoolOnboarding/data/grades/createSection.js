import * as React from 'react';
import { useContext, useState } from "react";
import TextField from '@mui/material/TextField';
import { Grid, Card, CardContent, CardActionArea, Box } from "@mui/material";
import MDTypography from "../../../../components/MDTypography";
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton"
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { CircularProgress, Typography } from "@mui/material";
import MDSnackbar from "../../../../components/MDSnackbar";
import { apiUrl } from '../../../../constants/constants';
import { styled } from '@mui/material';
import { Autocomplete } from "@mui/material";


const CustomAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-clearIndicator {
    color: white;
  }
`;
export default function CreateSection({ createSections, setCreateSections, school, grade, data }) {

    const newData = data.filter((elem)=>{
    return elem.sections.length > 0;
    })

    
    const [noOfSection, setNoOfSection] = useState('');
    const [sectionValues, setSectionValues] = useState(Array.from({ length: noOfSection }, () => ''));
    const [value, setValue] = useState();

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

    async function onNext(e) {
        e.preventDefault()

        for (let elem of sectionValues) {
            if (!elem) {
                return openErrorSB("Missing Section", "Please fill all the sections")
            }
        }

        const res = await fetch(`${apiUrl}school/${school}/section/${grade?._id}`, {
            method: "PATCH",
            credentials:"include",
            headers: {
              "content-type": "application/json",
              "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                sections: sectionValues
            })
        });

        const data = await res.json();
        if (!data.error) {
            openSuccessSB(data.message, `Contest Reward Created with prize: ${data.data?.prize}`)
            setCreateSections(!createSections);
        } else {
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

    const handleSimilar = (event, newValue) => {
        setValue(newValue);
        if(Array.isArray(newValue?.sections))
        setSectionValues(newValue?.sections)
    };


    return (
        <>
            <MDBox m={1}>

                <Grid container alignItems="space-between">

                    <Grid item xs={12} md={6} xl={12} >

                        <Grid item xs={12} md={6} xl={12} display='flex' justifyContent={'space-between'} alignContent={'center'} alignItems={'center'} gap={1}>
                            <Grid item xs={12} md={6} lg={5} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                                <CustomAutocomplete
                                    id="country-select-demo"
                                    sx={{
                                        width: "100%",
                                        '& .MuiAutocomplete-clearIndicator': {
                                            color: 'dark',
                                        },
                                    }}
                                    options={newData}
                                    // value={value}
                                    disabled={newData.length===0}
                                    onChange={handleSimilar}
                                    autoHighlight
                                    getOptionLabel={(option) => option ? option.grade?.grade : 'Section Similar To Grade'}
                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            {option?.grade?.grade}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Sections similar to grade"
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                                style: { color: 'dark', height: "10px" }, // set text color to dark
                                            }}
                                            InputLabelProps={{
                                                style: { color: 'dark' },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6} xl={5} >
                                <TextField
                                    disabled={value}
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
        </>
    )
}
