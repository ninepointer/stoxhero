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
import debounce from 'debounce';


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
    const [gradeValue, setGradeValue] = useState({
        grade: {
            _id: user?.schoolDetails?.grade?._id,
            grade: user?.schoolDetails?.grade?.grade
        },
        sections: user?.schoolDetails?.grade?.sections
    });
    const setDetails = useContext(userContext);
    const [userState, setUserState] = useState(user?.schoolDetails?.state);
    const [schoolsList, setSchoolsList] = useState([]);
    const [userSchool, setUserSchool] = useState({
        _id: user?.schoolDetails?.school?._id || '',
        schoolString: user?.schoolDetails?.school?.school_name || ""
    });
    const [inputValue, setInputValue] = useState('');
    const [gradeData, setGradeData] = useState([]);
    const [sectionValue, setSectionValue] = useState(user?.schoolDetails?.section);

    const [content, setContent] = useState('')
    const [successSB, setSuccessSB] = useState(false);
    const [cityData, setCityData] = useState([]);
    const [value, setValue] = useState({
        _id: user?.schoolDetails?.city?._id || '',
        name: user?.schoolDetails?.city?.name || ""
    });

    const [formState, setFormState] = useState({
        student_name: "" || user?.student_name,
        profilePhoto: "" || user?.schoolDetails?.profilePhoto
    });

    const [isFocused, setIsFocused] = useState(false);
    const [dateValue, setDateValue] = useState(user?.schoolDetails?.dob?.toString()?.split("T")?.[0]);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
        if (!dateValue) {
            setIsFocused(false);
        }
    };

    useEffect(() => {
        searchSchools();
    }, [value])

    useEffect(() => {
        getGrade();
    }, [userSchool])

    const handleStateChange = (event, newValue) => {
        setUserState(newValue);
        setValue();
        setCityData([]);
        setSchoolsList([]);
        setUserSchool();
        setGradeData([]);
        setGradeValue();
        setSectionValue();
    }

    const searchSchools = async () => {
        const res = await axios.post(`${apiUrl}fetchschools`, { cityId: value?._id || user?.schoolDetails?.city?._id, inputString: inputValue });
        setSchoolsList(res?.data?.data);
    }

    const getGrade = async () => {
        const res = await axios.get(`${apiUrl}school/${userSchool?._id || user?.schoolDetails?.school?._id}/usergrades`);
        setGradeData(res?.data?.data);
    }

    const debounceGetSchools = debounce(searchSchools, 1500);

    const handleSchoolChange = (event, newValue) => {
        setUserSchool(newValue);
        setGradeData([]);
        setGradeValue();
        setSectionValue();
    }

    const handleTypeChange = (event) => {
        setDateValue(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getCities = async () => {
        try {
            const res = await axios.get(`${apiUrl}cities/bystate/${userState || user?.schoolDetails?.state}`);
            if (res.data.status == 'success') {
                setCityData(res.data.data);
            }
        } catch (e) {
            console.log(e);
        }

    }

    useEffect(() => {
        getCities();
    }, [userState])

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
            style={{ zIndex: 20 }}

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
        // if (!formState[name]?.includes(e.target.value)) {
        setFormState(prevState => ({
            ...prevState,
            [name]: value,
        }));
        // }
    };

    const handleCityChange = (event, newValue) => {
        setValue(newValue);
        setSchoolsList([]);
        setUserSchool();
        setGradeData([]);
        setGradeValue();
        setSectionValue();
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

        if (sectionValue) {
            formData.append(`section`, sectionValue);
        }

        if (value?._id) {
            formData.append(`city`, value?._id);
        }

        if (gradeValue?.grade?._id) {
            formData.append(`grade`, gradeValue?.grade?._id);
        }

        if (dateValue) {
            formData.append(`dob`, dateValue);
        }

        if (userSchool?._id) {
            formData.append(`school`, userSchool?._id);
        }

        if (userState) {
            formData.append(`state`, userState);
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
            openSuccessSB("Profile Edited", "Edited Successfully");
            setOpen(false);
            setDetails.setUserDetail(data?.data);
            setUpdate(!update);
        } else {
            openErrorSB("Error", data.message);
        }
    }

    const handleGradeChange = (event, newValue) => {
        setGradeValue(newValue);
        setSectionValue();
    };

    const handleSectionChange = (event, newValue) => {
        setSectionValue(newValue);
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
                        <MDAvatar src={previewUrl || user?.schoolDetails?.profilePhoto || logo} size='md' alt='your image' style={{ border: '1px solid grey' }} />
                    </Grid>

                    <Grid item xs={12} md={12} xl={12} mt={1}>
                        <TextField
                            id="outlined-required"
                            placeholder='Full Name *'
                            name='student_name'
                            type='text'
                            fullWidth
                            defaultValue={formState?.student_name}
                            onChange={handleChange}
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

                    <Grid mt={1} item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                        <CustomAutocomplete
                            id="country-select-demo"
                            sx={{
                                width: "100%",
                                '& .MuiAutocomplete-clearIndicator': {
                                    color: 'dark',
                                },
                            }}
                            options={['Andaman & Nicobar', 'Andhra Pradesh', 'Arunachal Pradesh', "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi",
                                "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh",
                                "Lakshadeep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Pondicherry",
                                "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"]}
                            value={userState}

                            onChange={handleStateChange}
                            autoHighlight
                            getOptionLabel={(option) => option ? option : 'State'}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    {option}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Choose your state"
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
                        <CustomAutocomplete
                            id="country-select-demo"
                            sx={{
                                width: "100%",
                                '& .MuiAutocomplete-clearIndicator': {
                                    color: 'dark',
                                },
                            }}
                            options={cityData || []}
                            value={value}
                            onChange={handleCityChange}
                            autoHighlight
                            getOptionLabel={(option) => option ? option?.name : 'City'}
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

                    <Grid mt={1} item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{ backgroundColor: 'white', borderRadius: 5 }}>
                        <CustomAutocomplete
                            id="country-select-demo"
                            sx={{
                                width: "100%",
                                '& .MuiAutocomplete-clearIndicator': {
                                    color: 'dark',
                                },
                            }}
                            options={schoolsList || []}
                            value={userSchool}

                            onChange={handleSchoolChange}
                            onInputChange={(e) => { setInputValue(e?.target?.value); debounceGetSchools(); }}
                            autoHighlight
                            getOptionLabel={(option) => option ? option?.schoolString : 'School'}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    {option.schoolString}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Choose your school"
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
                        <CustomAutocomplete
                            id="country-select-demo"
                            sx={{
                                width: "100%",
                                '& .MuiAutocomplete-clearIndicator': {
                                    color: 'dark',
                                },
                            }}
                            options={gradeData || []}
                            value={gradeValue}
                            // disabled={otpGen}
                            onChange={handleGradeChange}
                            autoHighlight
                            getOptionLabel={(option) => option ? option?.grade?.grade : 'Grade'}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    {option?.grade?.grade}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Grade/Class"
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
                        <CustomAutocomplete
                            id="country-select-demo"
                            sx={{
                                width: "100%",
                                '& .MuiAutocomplete-clearIndicator': {
                                    color: 'dark',
                                },
                            }}
                            options={gradeData.find((item) => {
                                return item?.grade?.grade == gradeValue?.grade?.grade;
                            })?.sections ?? []}
                            value={sectionValue}
                            // disabled={otpGen}
                            onChange={handleSectionChange}
                            autoHighlight
                            getOptionLabel={(option) => option ? option : 'Section'}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    {option}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Section"
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

            </Dialog >
            {renderSuccessSB}
            {renderErrorSB}
        </>
    );

}

export default memo(EditProfile);

