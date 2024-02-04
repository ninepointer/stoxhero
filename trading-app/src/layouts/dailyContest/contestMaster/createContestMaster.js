
import * as React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
// import { useForm } from "react-hook-form";
// import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../../components/MDTypography";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton"
import { Box, CircularProgress, formLabelClasses } from "@mui/material";
import MDSnackbar from "../../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
import RegisteredUsers from "../data/registeredUsers";
import AllowedUsers from '../data/notifyUsers';
// import { IoMdAddCircle } from 'react-icons/io';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
// import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
// import User from './users';
import PotentialUser from "../data/potentialUsers"
import Shared from "../data/shared";

const CustomAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-clearIndicator {
    color: white;
  }
`;

const CustomAutocomplete2 = styled(Autocomplete)`
  .MuiAutocomplete-clearIndicator {
    color: white;
  }
`;

const CustomAutocomplete3 = styled(Autocomplete)`
  .MuiAutocomplete-clearIndicator {
    color: white;
  }
`;

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function Index() {
    const location = useLocation();
    const contest = location?.state?.data;
    const [collegeSelectedOption, setCollegeSelectedOption] = useState();
    console.log('id hai', contest);
    // const [applicationCount, setApplicationCount] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [isLoading, setIsLoading] = useState(contest ? true : false)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [creating, setCreating] = useState(false)
    const navigate = useNavigate();
    const [newObjectId, setNewObjectId] = useState("");
    const [updatedDocument, setUpdatedDocument] = useState([]);
    const [dailyContest, setDailyContest] = useState([]);
    const [trader, setTrader] = useState([]);
    const [value, setValue] = useState({})
    const [poc, setPOC] = useState([]);
    const [pocValue, setPOCValue] = useState({})

    const [college, setCollege] = useState([]);
    // const [careers,setCareers] = useState([]);
    const [action, setAction] = useState(false);
    // const [type, setType] = useState(contest?.portfolio?.portfolioName.includes('Workshop')?'Workshop':'Job');

    const [formState, setFormState] = useState({
        contestMaster: '' || contest?.contestMaster,
        contestMasterMobile: '' || contest?.contestMasterMobile,
        stoxheroPOC: '' || contest?.stoxheroPOC,
        college: '' || contest?.college,
        status: '' || contest?.status,
        inviteCode: "" || contest?.inviteCode
    });

    
    useEffect(() => {
        setTimeout(() => {
            contest && setUpdatedDocument(contest)
            setIsLoading(false);
        }, 500)
    }, [])


    useEffect(() => {
        axios.get(`${baseUrl}api/v1/college`, { withCredentials: true })
            .then((res) => {
                console.log("College Lists :", res?.data?.data)
                setCollege(res?.data?.data);
            }).catch((err) => {
                return new Error(err)
            })

        axios.get(`${baseUrl}api/v1/college/${contest?.college?._id}`, { withCredentials: true })
            .then((res) => {
                console.log("College :", res?.data?.data)
                setCollegeSelectedOption(res?.data?.data);
            }).catch((err) => {
                return new Error(err)
            })

    }, [])

    useEffect(() => {
        let abortController;
        (async () => {
            abortController = new AbortController();
            let signal = abortController.signal;

            // the signal is passed into the request(s) we want to abort using this controller
            const { data } = await axios.get(`${baseUrl}api/v1/normalusers`, {
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                signal: signal
            }
            );
            setTrader(data.data);
            setValue(data?.data[0])

        })();
        return () => abortController.abort();
    }, [])

    useEffect(() => {
        let abortController;
        (async () => {
            abortController = new AbortController();
            let signal = abortController.signal;

            // the signal is passed into the request(s) we want to abort using this controller
            const { data } = await axios.get(`${baseUrl}api/v1/adminAndcr`, {
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                signal: signal
            }
            );
            setPOC(data.data);
            // setValue(data?.data[0])

        })();
        return () => abortController.abort();
    }, [])


    const handleCollegeChange = (event, newValue) => {
        console.log("College Selection:", newValue)
        setCollegeSelectedOption(newValue);
        setFormState(prevState => ({
            ...prevState,
            college: newValue?._id

        }))
        // setTraderId(newValue);
    };


    async function onSubmit(e, formState) {
        // console.log("inside submit")
        e.preventDefault()
        console.log("poc", poc)
        // if(formState.contestStartTime > formState.contestEndTime){
        //   return openErrorSB("Error", "Date range is not valid.")
        // }

        if (!formState.college || !formState.status) {
            setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
            return openErrorSB("Missing Field", "Please fill all the mandatory fields")
        }

        setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
        const { stoxheroPOC, college, status, inviteCode } = formState;
        const res = await fetch(`${baseUrl}api/v1/contestmaster`, {
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                contestMaster: value?._id, contestMasterMobile: value?.mobile, stoxheroPOC: pocValue?._id, college, status, inviteCode
            })
        });


        const data = await res.json();
        // console.log(data, res.status);
        if (res.status !== 201) {
            setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
            openErrorSB("TestZone not created", data?.message)
        } else {
            openSuccessSB("TestZone Created", data?.message)
            setNewObjectId(data?.data?._id)
            console.log("New Object Id: ", data?.data?._id, newObjectId)
            setIsSubmitted(true)
            setDailyContest(data?.data);
            setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
        }
    }

    // console.log("dailyContest", dailyContest)

    async function onEdit(e, formState) {
        e.preventDefault()
        console.log("Edited FormState: ", new Date(formState.contestStartTime).toISOString(), new Date(formState.contestEndTime).toISOString())
        setSaving(true)
        console.log("formstate", formState)

        // if(new Date(formState.contestStartTime).toISOString() > new Date(formState.contestEndTime).toISOString()){
        //   setTimeout(() => { setSaving(false); setEditing(true) }, 500)
        //   return openErrorSB("Error", "Date range is not valid.")
        // }

        if (!formState.contestMaster || !formState.contestMasterMobile || !formState.stoxheroPOC || !formState.college || !formState.status) {
            setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
            return openErrorSB("Missing Field", "Please fill all the mandatory fields")
        }

        const { contestMaster, contestMasterMobile, stoxheroPOC, college, status } = formState;

        const res = await fetch(`${baseUrl}api/v1/contestmaster/${contest?._id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                contestMaster, contestMasterMobile, stoxheroPOC, college, status
            })
        });

        const data = await res.json();
        console.log(data);
        if (data.status === 500 || data.error || !data) {
            openErrorSB("Error", data.error)
            setTimeout(() => { setSaving(false); setEditing(true) }, 500)
        } else {
            openSuccessSB("Contest Edited", "Edited Successfully")
            setTimeout(() => { setSaving(false); setEditing(false) }, 500)
            console.log("entry succesfull");
        }
    }

    const handleTraderOptionChange = (event, newValue) => {
        console.log("Trader Selection:",newValue)
        setValue(newValue);
    };

    const handlePOCOptionChange = (event, newValue) => {
        console.log("Trader Selection:",newValue)
        setPOCValue(newValue);
    };

      


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

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (!formState[name]?.includes(e.target.value)) {
            setFormState(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };


    return (
        <>
            {isLoading ? (
                <MDBox display="flex" justifyContent="center" alignItems="center" mt={5} mb={5}>
                    <CircularProgress color="info" />
                </MDBox>
            )
                :
                (
                    <MDBox pl={2} pr={2} mt={4}>
                        <MDBox display="flex" justifyContent="space-between" alignItems="center">
                            <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                                Fill Contest Details
                            </MDTypography>
                        </MDBox>

                        <Grid container display="flex" flexDirection="row" justifyContent="space-between">
                            <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12} lg={12}>


                                <Grid item xs={12} md={3} xl={6} lg={12}>
                                    <CustomAutocomplete
                                        id="country-select-demo"
                                        sx={{
                                            width: 526,
                                            height: 10,
                                            '& .MuiAutocomplete-clearIndicator': {
                                                color: 'black',
                                            },
                                        }}
                                        options={college}
                                        disabled={((isSubmitted || contest) && (!editing || saving))}
                                        value={collegeSelectedOption}
                                        onChange={handleCollegeChange}
                                        autoHighlight
                                        getOptionLabel={(option) => option.collegeName + ' - ' + option.zone}
                                        renderOption={(props, option) => (
                                            <MDBox component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                {option.collegeName + ' - ' + option.zone}
                                            </MDBox>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="College"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                                    style: { color: 'grey', height: 11 }, // set text color to white
                                                }}
                                                InputLabelProps={{
                                                    style: { color: 'grey' },
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6} xl={3} mb={2} lg={12}>
                                    <TextField
                                        disabled={((isSubmitted || contest) && (!editing || saving))}
                                        id="outlined-required"
                                        label='Invite Code'
                                        name='inviteCode'
                                        fullWidth
                                        type='number'
                                        defaultValue={editing ? formState?.inviteCode : contest?.inviteCode}
                                        // onChange={handleChange}
                                        onChange={(e) => {
                                            setFormState(prevState => ({
                                                ...prevState,
                                                inviteCode: e.target.value
                                            }))
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={3} xl={6} lg={12}>
                                    <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CustomAutocomplete2
                                            id="country-select-demo"
                                            sx={{
                                                width: "100%",
                                                '& .MuiAutocomplete-clearIndicator': {
                                                    color: 'dark',
                                                },

                                            }}
                                            options={trader}
                                            value={value}
                                            onChange={handleTraderOptionChange}
                                            autoHighlight
                                            getOptionLabel={(option) => option.first_name + ' ' + option.last_name + ' - ' + option.mobile}
                                            renderOption={(props, option) => (
                                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                    {option.first_name + ' ' + option.last_name + ' - ' + option.mobile}
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Choose a Trader"
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
                                    </MDBox>
                                </Grid>

                                <Grid item xs={12} md={3} xl={6} lg={12}>
                                    <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CustomAutocomplete3
                                            id="country-select-demo"
                                            sx={{
                                                width: "100%",
                                                '& .MuiAutocomplete-clearIndicator': {
                                                    color: 'dark',
                                                },

                                            }}
                                            options={poc}
                                            value={pocValue}
                                            onChange={handlePOCOptionChange}
                                            autoHighlight
                                            getOptionLabel={(option) => option.first_name + ' ' + option.last_name + ' - ' + option.mobile}
                                            renderOption={(props, option) => (
                                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                    {option.first_name + ' ' + option.last_name + ' - ' + option.mobile}
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Choose a StoxHero POC"
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
                                    </MDBox>
                                </Grid>

                                <Grid item xs={12} md={6} xl={3} lg={12}>
                                    <FormControl sx={{ width: "100%" }}>
                                        <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-autowidth-label"
                                            id="demo-simple-select-autowidth"
                                            name='status'
                                            value={formState?.status || contest?.status}
                                            disabled={((isSubmitted || contest) && (!editing || saving))}
                                            onChange={(e) => {
                                                setFormState(prevState => ({
                                                    ...prevState,
                                                    status: e.target.value
                                                }))
                                            }}
                                            label="Contest Status"
                                            sx={{ minHeight: 43 }}
                                        >
                                            <MenuItem value="Active">Active</MenuItem>
                                            <MenuItem value="Inactive">Inactive</MenuItem>
                                            {/* <MenuItem value="Cancelled">Cancelled</MenuItem> */}
                                        </Select>
                                    </FormControl>
                                </Grid>

                            </Grid>

                        </Grid>

                        <Grid container mt={2} xs={12} md={12} xl={12} >
                            <Grid item display="flex" justifyContent="flex-end" xs={12} md={6} xl={12}>
                                {!isSubmitted && !contest && (
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
                                        <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/contestdashboard/dailycontest") }}>
                                            Cancel
                                        </MDButton>
                                    </>
                                )}
                                {(isSubmitted || contest) && !editing && (
                                    <>
                                        {contest?.contestStatus !== "Completed" &&
                                            <MDButton variant="contained" color="warning" size="small" sx={{ mr: 1, ml: 2 }} onClick={() => { setEditing(true) }}>
                                                Edit
                                            </MDButton>}
                                        <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/contestdashboard/dailycontest') }}>
                                            Back
                                        </MDButton>
                                    </>
                                )}
                                {(isSubmitted || contest) && editing && (
                                    <>
                                        <MDButton
                                            variant="contained"
                                            color="warning"
                                            size="small"
                                            sx={{ mr: 1, ml: 2 }}
                                            disabled={saving}
                                            onClick={(e) => { onEdit(e, formState) }}
                                        >
                                            {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
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
        </>
    )
}
export default Index;