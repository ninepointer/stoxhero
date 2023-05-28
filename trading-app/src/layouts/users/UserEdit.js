import React, { useContext, useEffect, useState } from 'react'
import MDBox from '../../components/MDBox'
import { Card, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import MDTypography from '../../components/MDTypography'
import MDAvatar from '../../components/MDAvatar'
import backgroundImage from "../../../src/assets/images/trading.jpg";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import MDSnackbar from '../../components/MDSnackbar'
import axios from 'axios'
import MDButton from '../../components/MDButton'
import { useLocation, useNavigate } from 'react-router-dom'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { userContext } from '../../AuthContext'
import DefaultProfilePic from "../../../src/assets/images/default-profile.png";



const UserEdit = () => {

    const location = useLocation();
    const id = location?.state?.data;
    console.log(id)


    const [isSubmitted, setIsSubmitted] = useState(false);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [isLoading, setIsLoading] = useState(id ? true : false)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [creating, setCreating] = useState(false)
    const navigate = useNavigate();
    const [newObjectId, setNewObjectId] = useState("");
    const [updatedDocument, setUpdatedDocument] = useState([]);
    const [profilePhoto,setProfilePhoto] = useState(DefaultProfilePic);

    const [formState, setFormState] = useState({
        employeeid: '',
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        whatsApp_number: '',
        gender: '',
        designation: '',
        degree: '',
        last_occupation: '',
        address: '',
        city: '',
        pincode: '',
        state: '',
        country: '',
        dob: '',
        joining_date: '',
        family_yearly_income: '',
        role: '',
        subscriptionStatus: '',
        algotrader: '',

    });

    useEffect(() => {
        setTimeout(() => {
            id && setUpdatedDocument(id)
            setIsLoading(false);
        }, 500)

    }, [])

    React.useEffect(() => {

        axios.get(`${baseUrl}api/v1/readuserdetails/${id?._id}`)
            .then((res) => {


                console.log(res.data)

                setFormState({
                    employeeid: res.data?.employeeid || '',
                    first_name: res.data?.first_name || '',
                    last_name: res.data?.last_name || '',
                    email: res.data?.email || '',
                    mobile: res.data?.mobile || '',
                    whatsApp_number: res.data?.whatsApp_number || '',
                    gender: res.data?.gender || '',
                    designation: res.data?.designation || '',
                    degree: res.data?.degree || '',
                    last_occupation: res.data?.last_occupation || '',
                    address: res.data?.address || '',
                    city: res.data?.city || '',
                    pincode: res.data?.pincode || '',
                    state: res.data?.state || '',
                    country: res.data?.country || '',
                    dob: res.data?.dob || '',
                    joining_date: res.data?.joining_date || '',
                    family_yearly_income: res.data?.family_yearly_income || '',
                    roleName: res.data.role?.roleName || '',
                    // subscription: res.data.subscription[0]?.status || '',
                    algotrader: res.data?.isAlgoTrader || 'no',
                });
                setTimeout(() => { setIsLoading(false) }, 500)

            }).catch((err) => {
                return new Error(err);
            })

    }, [])






    // async function onEdit(e, formState) {
    //     e.preventDefault()

    //     setSaving(true)
    //     console.log(formState)
    //     // if (!formState.employeeid || !formState.first_name || !formState.last_name || !formState.email || !formState.mobile || !formState.whatsApp_number||!formState.gender||!formState.designation||!formState.degree||!formState.last_occupation||formState.address||!formState.city||!formState.state||!formState.country||!formState.dob||!formState.joining_date||!formState.family_yearly_income||!formState.roleName||!formState.subscription||!formState.algotrader) {
    //     //     setTimeout(() => { setSaving(false); setEditing(true) }, 500)
    //     //     return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    //     // }
    //     const { employeeid,first_name,last_name,email,mobile,whatsApp_number,gender,designation,degree,last_occupation,address,city,pincode,state,country,dob,joining_date,family_yearly_income,roleName,subscription,algotrader} = formState;

    //     const res = await fetch(`${baseUrl}api/v1/readuserdetails/${id?._id}`, {
    //         method: "PUT",
    //         credentials: "include",
    //         headers: {
    //             "content-type": "application/json",
    //             "Access-Control-Allow-Credentials": true
    //         },
    //         body: JSON.stringify({
    //             employeeid,first_name,last_name,email,mobile,whatsApp_number,gender,designation,degree,last_occupation,address,city,pincode,state,country,dob,joining_date,family_yearly_income,roleName,subscription,algotrader
    //         })
    //     });

    //     const data = await res.json();
    //     console.log(data);
    //     if (data.status === 422 || data.error || !data) {
    //         openErrorSB("Error", data.error)
    //     } else {
    //         openSuccessSB("Campaign Edited", "Edited Successfully")
    //         setTimeout(() => { setSaving(false); setEditing(false) }, 500)
    //         console.log("entry succesfull");
    //     }
    // }

    async function onEdit(e, formState) {
        e.preventDefault();

        setSaving(true);
        console.log(id?._id)

        const { employeeid, first_name, last_name, email, mobile, whatsApp_number, gender, designation, degree, last_occupation, address, city, pincode, state, country, dob, joining_date, family_yearly_income, roleName,algotrader } = formState;

        try {
            const res = await fetch(`${baseUrl}api/v1/readuserdetails/${id?._id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    employeeid, first_name, last_name, email, mobile, whatsApp_number, gender, designation, degree, last_occupation, address, city, pincode, state, country, dob, joining_date, family_yearly_income, roleName, algotrader
                })
            });

            const data = await res.json();
            console.log(data);

            if (res.ok) {
                openSuccessSB("User Edited", "Edited Successfully");
                // Perform actions to update the user list with the latest changes
            } else {
                openErrorSB("Error", data.error || "An error occurred");
            }
        } catch (error) {
            openErrorSB("Error", "An error occurred");
        } finally {
            setSaving(false);
            setEditing(false);
        }
    }




    async function onSubmit(e, formState) {
        e.preventDefault()
        console.log(formState)
        // if (!formState.employeeid || !formState.first_name || !formState.last_name || !formState.email || !formState.mobile || !formState.whatsApp_number||!formState.gender||!formState.designation||!formState.degree||!formState.last_occupation||formState.address||!formState.city||!formState.state||!formState.country||!formState.dob||!formState.joining_date||!formState.family_yearly_income||!formState.roleName||!formState.subscription||!formState.algotrader) {

        //     setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
        //     return openErrorSB("Missing Field", "Please fill all the mandatory fields")
        // }
        // console.log("Is Submitted before State Update: ",isSubmitted)
        setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
        const { employeeid, first_name, last_name, email, mobile, whatsApp_number, gender, designation, degree, last_occupation, address, city, pincode, state, country, dob, joining_date, family_yearly_income, roleName, subscription, algotrader } = formState;
        const res = await fetch(`${baseUrl}api/v1/college`, {
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                employeeid, first_name, last_name, email, mobile, whatsApp_number, gender, designation, degree, last_occupation, address, city, pincode, state, country, dob, joining_date, family_yearly_income, roleName, subscription, algotrader
            })
        });


        const data = await res.json();
        console.log(data);
        if (data.status === 400 || data.info) {
            setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
            openErrorSB("user not edited", data?.info)
        } else {
            openSuccessSB("User Edited", data?.message)
            setNewObjectId(data?.data?._id)
            console.log("New Object Id: ", data?.data?._id, newObjectId)
            setIsSubmitted(true)
            setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
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
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox position="relative" mb={2}>
                <MDBox
                    display="flex"
                    alignItems="center"
                    position="relative"
                    minHeight="10rem"
                    borderRadius="xl"
                    sx={{
                        backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
                            `${linearGradient(
                                rgba(gradients.info.main, 0.6),
                                rgba(gradients.info.state, 0.6)
                            )}, url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "50%",
                        overflow: "hidden",
                    }}
                />
                <Card
                    sx={{
                        position: "relative",
                        mt: -15,
                        mx: 3,
                        py: 2,
                        px: 2,
                    }}
                >
                    <Grid container spacing={3}>
                        <Grid item>
                            <MDAvatar
                                src={profilePhoto}
                                alt="profile-image" size="xl" shadow="sm" />
                        </Grid>
                        <Grid item>
                            <MDBox height="100%" mt={0} lineHeight={1}>
                                <MDTypography variant="h5" fontWeight="medium">
                                    {id?.first_name} {id?.last_name}
                                </MDTypography>
                                <MDBox display="flex" flexDirection="row" style={{ alignItems: "center" }}>


                                </MDBox>
                            </MDBox>
                        </Grid>

                    </Grid>
                    <Grid container mt={1} display="flex" flexDirection="row" justifyContent="space-between">
                        <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={9} xl={12}>


                            <Grid item mt={2} xs={12} md={6} xl={3}>
                                <TextField
                                    required
                                    disabled={((isSubmitted || id) && (!editing || saving))}
                                    id="outlined-required"
                                    label="User ID"
                                    defaultValue={editing ? formState.employeeid : id?.employeeid}
                                    fullWidth
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            employeeid: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>

                            <Grid item mt={2} xs={12} md={6} xl={3}>
                                <TextField
                                    required
                                    disabled={((isSubmitted || id) && (!editing || saving))}
                                    id="outlined-required"
                                    label="First Name"
                                    defaultValue={editing ? formState.first_name : id?.first_name}
                                    fullWidth
                                    // onChange={(e) => {setFormStatePD({first_name: e.target.value})}}
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            first_name: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>

                            <Grid item mt={2} xs={12} md={6} xl={3}>
                                <TextField
                                    required
                                    disabled={((isSubmitted || id) && (!editing || saving))}
                                    id="outlined-required"
                                    label="Last Name"
                                    defaultValue={editing ? formState.last_name : id?.last_name}
                                    fullWidth
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            last_name: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>

                            <Grid item mt={2} xs={12} md={6} xl={3}>
                                <TextField
                                    required
                                    disabled={((isSubmitted || id) && (!editing || saving))}
                                    id="outlined-required"
                                    label="Email"
                                    defaultValue={editing ? formState.email : id?.email}
                                    fullWidth
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            email: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>

                            <Grid item mt={2} xs={12} md={6} xl={3}>
                                <TextField
                                    required
                                    disabled={((isSubmitted || id) && (!editing || saving))}
                                    id="outlined-required"
                                    label="Mobile No."
                                    defaultValue={editing ? formState.mobile : id?.mobile}
                                    fullWidth
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            mobile: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>

                            <Grid item mt={2} xs={12} md={6} xl={3}>
                                <TextField
                                    required
                                    disabled={((isSubmitted || id) && (!editing || saving))}
                                    id="outlined-required"
                                    label="WhatsApp No."
                                    defaultValue={editing ? formState.whatsApp_number : id?.whatsApp_number}
                                    fullWidth
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            whatsApp_number: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>

                            {/* <Grid item xs={12} md={6} xl={3}>
                    <FormControl sx={{width: "100%" }}>
                      <InputLabel id="demo-simple-select-autowidth-label">Gender *</InputLabel>
                      <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        defaultValue={editing ? formState.collegeName : id?.collegeName}
                        disabled={!editablePD}
                        required
                        onChange={(e) => {setFormStatePD(prevState => ({
                          ...prevState,
                          gender: e.target.value
                        }))}}
                        label="Gender"
                        sx={{ minHeight:43 }}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid> */}

                            <Grid item mt={2} xs={12} md={6} xl={3}>
                                <FormControl sx={{ width: "100%" }}>
                                    <InputLabel id="demo-simple-select-autowidth-label">Gender*</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        value={formState.gender || id?.gender}

                                        disabled={((isSubmitted || id) && (!editing || saving))}
                                        onChange={(e) => {
                                            setFormState(prevState => ({
                                                ...prevState,
                                                gender: e.target.value
                                            }))
                                        }}
                                        label="gender"
                                        sx={{ minHeight: 43 }}
                                    >
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>


                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item mt={2} xs={12} md={6} xl={3}>
                                <TextField
                                    required
                                    disabled={((isSubmitted || id) && (!editing || saving))}
                                    id="outlined-required"
                                    label="Designation"
                                    defaultValue={editing ? formState.designation : id?.designation}
                                    fullWidth
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            designation: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>

                            <Grid item mt={2} xs={12} md={6} xl={3}>
                                <TextField
                                    required
                                    disabled={((isSubmitted || id) && (!editing || saving))}
                                    id="outlined-required"
                                    label="degree"
                                    defaultValue={editing ? formState.degree : id?.degree}
                                    fullWidth
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            degree: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>

                            <Grid item mt={2} xs={12} md={6} xl={6}>
                                <TextField
                                    required
                                    disabled={((isSubmitted || id) && (!editing || saving))}
                                    id="outlined-required"
                                    label="Last Occupation"
                                    defaultValue={editing ? formState.last_occupation : id?.last_occupation}
                                    fullWidth
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            last_occupation: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>

                            <Grid item mt={2} xs={12} md={6} xl={3}>
                                <TextField
                                    required
                                    disabled={((isSubmitted || id) && (!editing || saving))}
                                    id="outlined-required"
                                    label="Address"
                                    defaultValue={editing ? formState.address : id?.address}
                                    fullWidth
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            address: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>

                            <Grid item mt={2} xs={12} md={6} xl={3}>
                                <TextField
                                    required
                                    disabled={((isSubmitted || id) && (!editing || saving))}
                                    id="outlined-required"
                                    label="City"
                                    defaultValue={editing ? formState.city : id?.city}
                                    fullWidth
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            city: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>

                            <Grid item mt={2} xs={12} md={6} xl={3}>
                                <TextField
                                    required
                                    disabled={((isSubmitted || id) && (!editing || saving))}
                                    id="outlined-required"
                                    label="Pincode"
                                    defaultValue={editing ? formState.pincode : id?.pincode}
                                    fullWidth
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            pincode: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>

                            <Grid item mt={2} xs={12} md={6} xl={3}>
                                <TextField
                                    required
                                    disabled={((isSubmitted || id) && (!editing || saving))}
                                    id="outlined-required"
                                    label="State"
                                    defaultValue={editing ? formState.state : id?.state}
                                    fullWidth
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            state: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>

                            <Grid item mt={2} xs={12} md={6} xl={3}>
                                <TextField
                                    required
                                    disabled={((isSubmitted || id) && (!editing || saving))}
                                    id="outlined-required"
                                    label="Family Yearly Income"
                                    defaultValue={editing ? formState.country : id?.country}
                                    fullWidth
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            country: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>

                            <Grid item mt={2} xs={12} md={6} xl={3}>
                                <TextField
                                    required
                                    disabled={((isSubmitted || id) && (!editing || saving))}
                                    id="outlined-required"
                                    label="Role"
                                    defaultValue={editing ? formState.role : id?.role?.roleName}
                                    fullWidth
                                    onChange={(e) => {
                                        setFormState(prevState => ({
                                            ...prevState,
                                            roleName: e.target.value
                                        }))
                                    }}
                                />
                            </Grid>


                            {/* <Grid item mt={2} xs={12} md={6} xl={3}>

                                <FormControl sx={{ width: "100%" }}>
                                    <InputLabel id="demo-simple-select-autowidth-label">
                                        Subscription Status*
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        value={formState?.subscription || id.subscription[0]?.status}
                                        disabled={!editing || saving}
                                        onChange={(e) => {
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                subscription: e.target.value,
                                            }));
                                        }}
                                        label="Subscription Status"
                                        sx={{ minHeight: 43 }}
                                    >
                                        <MenuItem value="Live">Live</MenuItem>
                                        <MenuItem value="Expired">Expired</MenuItem>
                                    </Select>
                                </FormControl>


                            </Grid> */}

                            <Grid item mt={2} xs={12} md={6} xl={3}>

                                <FormControl sx={{ width: "100%" }}>
                                    <InputLabel id="demo-simple-select-autowidth-label">IsAlgoTrader*</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        value={!formState?.algotrader ? true:false }
                                        // value={oldObjectId ? contestData?.status : formState?.status}
                                        disabled={((isSubmitted || id) && (!editing || saving))}
                                        onChange={(e) => {
                                            setFormState(prevState => ({
                                                ...prevState,
                                                algotrader: e.target.value
                                            }))
                                        }}
                                        label="IsAlgoTrader"
                                        sx={{ minHeight: 43 }}
                                    >
                                        <MenuItem value={true}>True</MenuItem>
                                        <MenuItem value={false}>False</MenuItem>


                                    </Select>
                                </FormControl>
                            </Grid>



                            {/* <Grid item xs={12} md={6} xl={3} mt={-1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label="Date of Birth"
                  disabled={((isSubmitted || id) && (!editing || saving))}
                  value={dayjs(formStatePD.dob)}
                  // onChange={(e) => {setFormStatePD({dob: dayjs(e)})}}
                  onChange={(e) => {setFormState(prevState => ({
                    ...prevState,
                    dob: dayjs(e)
                  }))}}
                  sx={{ width: '100%' }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid> */}

                            {/* <Grid item xs={12} md={6} xl={3} mt={-1}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="Joining Date"
                    disabled={true}
                    value={dayjs(formStatePD.joining_date)}
                    onChange={(e) => {setFormStatePD(prevState => ({
                      ...prevState,
                      joining_date: dayjs(e)
                    }))}}
                    sx={{ width: '100%' }}
                  />
                </DemoContainer>
              </LocalizationProvider>
          </Grid> */}

                        </Grid>

                    </Grid>

                    <Grid container mt={2} xs={12} md={12} xl={12} >
                        <Grid item display="flex" justifyContent="flex-end" xs={12} md={6} xl={12}>
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
                                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/users") }}>
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
                                    <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/users') }}>
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

                </Card>
                {renderSuccessSB}
                {renderErrorSB}
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}

export default UserEdit