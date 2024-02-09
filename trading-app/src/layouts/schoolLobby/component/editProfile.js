import React, { memo, useContext, useEffect, useState } from 'react';
import MDBox from '../../../components/MDBox';
import MDButton from '../../../components/MDButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import { Grid, TextField, Tooltip, Box } from '@mui/material';
import { apiUrl } from '../../../constants/constants';
import MDSnackbar from '../../../components/MDSnackbar';
import { userContext } from '../../../AuthContext';
import { Autocomplete } from "@mui/material";
import { styled } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MDAvatar from "../../../components/MDAvatar";
import logo from '../../../assets/images/logo1.jpeg'


const CustomAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-clearIndicator {
    color: white;
  }
`;

const EditProfile = ({ user, update, setUpdate }) => {
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [gradeValue, setGradeValue] = useState(user?.schoolDetails?.grade);
    const setDetails = useContext(userContext);

    const [content, setContent] = useState('')
    const [successSB, setSuccessSB] = useState(false);
    const [cityData, setCityData] = useState([]);
    const [value, setValue] = useState({
        _id: user?.schoolDetails?.city?._id || '',
        name: user?.schoolDetails?.city?.name || ""
    });

    const [formState, setFormState] = useState({
        student_name: "" || user?.student_name,
        school: "" || user?.schoolDetails?.school
    });

    const [isFocused, setIsFocused] = useState(false);
    const [dateValue, setDateValue] = useState(user?.schoolDetails?.dob?.toString()?.split("T")?.[0]);
  
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
      if (!dateValue) {
        setIsFocused(false);
      }
    };
    const handleTypeChange = (event) => {
      setDateValue(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getCities = async () => {
        try {
            const res = await axios.get(`${apiUrl}cities/active`);
            if (res.data.status == 'success') {
                setCityData(res.data.data);
            }
        } catch (e) {
            console.log(e);
        }

    }

    useEffect(() => {
        getCities();
    }, [])

    const handleImage = (event) => {
        const file = event.target.files[0];
        setImage(event.target.files);
        // Create a FileReader instance
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (!formState[name]?.includes(e.target.value)) {
            setFormState(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleCityChange = (event, newValue) => {
        setValue(newValue);
    };

    async function edit(e) {
        e.preventDefault()

        const formData = new FormData();
        if (image) {
            formData.append("profilePhoto", image[0]);
        }

        for (let elem in formState) {
            formData.append(`${elem}`, formState[elem]);
        }

        if (value?._id) {
            formData.append(`city`, value?._id);
        }

        if (gradeValue) {
            formData.append(`grade`, gradeValue);
        }

        if(dateValue){
            formData.append(`dob`, dateValue);
        }

        const res = await fetch(`${apiUrl}student/me`, {
            method: "PATCH",
            credentials: "include",
            body: formData
        });

        const data = await res.json();

        if (data.status === 500 || data.status == 400 || data.status == 401 || data.status == 'error' || data.error || !data) {
            openErrorSB("Error", data.error)
        } else if (data.status == 'success') {
            setDetails.setUserDetail(data?.data);
            openSuccessSB("Profile Edited", "Edited Successfully");
            setUpdate(!update);
            setOpen(false);
        } else {
            openErrorSB("Error", data.message);
        }
    }

    const handleGradeChange = (event, newValue) => {
        setGradeValue(newValue);
    };
    return (
        <>
            <Tooltip title='Edit Profile' >
                <EditIcon style={{ marginRight: "15px", cursor: "pointer", color: 'grey' }} onClick={() => { setOpen(true) }} />
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <MDBox display="flex" alignItems="center" justifyContent="center" >
                        Edit Profile
                    </MDBox>
                </DialogTitle>
                <DialogContent>

                    <Grid
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        style={{ overflow: 'visible' }}
                    >
                        <MDAvatar src={previewUrl || user?.profilePhoto?.url || logo} size='md' alt='your image' style={{border: '1px solid grey' }} />
                    </Grid>

                    <Grid item xs={12} md={12} xl={12} mt={1}>
                        <TextField
                            id="outlined-required"
                            placeholder='Full Name *'
                            name='student_name'
                            fullWidth
                            defaultValue={formState?.student_name}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                        <CustomAutocomplete
                            id="country-select-demo"
                            sx={{
                                width: "100%",
                                '& .MuiAutocomplete-clearIndicator': {
                                    color: 'dark',
                                },
                            }}
                            options={["6th", '7th', '8th', '9th', '10th', '11th', "12th"]}
                            value={gradeValue}
                            onChange={handleGradeChange}
                            autoHighlight
                            getOptionLabel={(option) => option ? option : 'Grade'}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    {option}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Grade"
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

                    <Grid mt={1} item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                        <TextField
                            required
                            id="outlined-required"
                            fullWidth
                            type={isFocused || dateValue ? 'date' : 'text'}
                            name="dob"
                            placeholder={!isFocused && !dateValue ? "Date of Birth" : ""}
                            value={dateValue}
                            onChange={handleTypeChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            InputLabelProps={isFocused || dateValue ? { shrink: true } : {}}
                        />
                    </Grid>

                    <Grid item mt={1} xs={12} md={12} xl={12}>
                        <TextField
                            // disabled={((isSubmitted || quiz) && (!editing || saving))}
                            id="outlined-required"
                            placeholder='School *'
                            name='school'
                            fullWidth
                            defaultValue={formState?.school}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12} md={12} xl={12} mt={1}>
                        <CustomAutocomplete
                            id="country-select-demo"
                            sx={{
                                width: "100%",
                                '& .MuiAutocomplete-clearIndicator': {
                                    color: 'dark',
                                },
                            }}
                            options={cityData}
                            value={value}
                            onChange={handleCityChange}
                            autoHighlight
                            getOptionLabel={(option) => option ? option.name : 'City'}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    {option.name}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Choose a City"
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

                    <Grid item xs={12} md={12} xl={12} mt={1}>
                        <MDButton variant="outlined" style={{ fontSize: 10 }} fullWidth color={(user?.profilePhoto?.url && !image) ? "warning" : ((user?.profilePhoto?.url && image) || image) ? "error" : "success"} component="label">
                            Upload Profile Image(1080X720)
                            <input
                                hidden
                                // disabled={((quizData || quiz) && (!editing))}
                                accept="image/*"
                                type="file"
                                // onChange={(e)=>{setTitleImage(e.target.files)}}
                                onChange={(e) => {
                                    setFormState(prevState => ({
                                        ...prevState,
                                        image: e.target.files
                                    }));
                                    // setTitleImage(e.target.files);
                                    handleImage(e);
                                }}
                            />
                        </MDButton>
                    </Grid>
                </DialogContent >
                <DialogActions>
                    <MDButton color={"success"} onClick={(e) => edit(e)} autoFocus>
                        Edit
                    </MDButton>
                </DialogActions>
                {renderSuccessSB}
                {renderErrorSB}
            </Dialog >
        </>
    );

}

export default memo(EditProfile);

