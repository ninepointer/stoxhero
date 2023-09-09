
import * as React from 'react';
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton"
import { CircularProgress, formLabelClasses } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate, useLocation } from "react-router-dom";
import { apiUrl } from '../../constants/constants';


function Index() {
  const location = useLocation();
  const template = location?.state?.data;
  const [isSubmitted, setIsSubmitted] = useState(false);
  // let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [isLoading, setIsLoading] = useState(template ? true : false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    templateName: '' || template?.templateName,
    portfolioValue: '' || template?.portfolioValue,
    entryFee: '' || template?.entryFee,
    status: '' || template?.status,
    platformCommission: '' || template?.platformCommission,
    minParticipants: '' || template?.minParticipants,
    gstPercentage: '' || template?.gstPercentage,
    winnersPercentage: '' || template?.winnersPercentage,
    battleType: '' || template?.battleType,
  });

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500)
  }, [])


  async function onSubmit(e, formState) {
    e.preventDefault();
    try{
      console.log(formState)

      if (!formState.templateName || !formState.portfolioValue || !formState.entryFee || !formState.status) {
        setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
        return openErrorSB("Missing Field", "Please fill all the mandatory fields")
      }
  
      setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
      const { templateName, portfolioValue, entryFee, status } = formState;
      const res = await fetch(`${apiUrl}battletemplate`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          templateName, portfolioValue, entryFee, status
        })
      });
  
  
      const data = await res.json();
      // setCreateTemplate(data);
      if (res.status !== 201) {
        setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
        openErrorSB("Battle Template not created", data?.message)
      } else {
        openSuccessSB("Battle Template Created", data?.message)
        // setNewObjectId(data?.data?._id)
        setIsSubmitted(true);
        // setTemplate(data?.data);
        setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
      }
    }catch(e){
      console.log(e);
      // console.log('is submitted', isSubmitted, battle, editing);
      // console.log('condition', ((isSubmitted || Boolean(battle)) && !editing) );
    }
  }

  async function onEdit(e, formState) {
    e.preventDefault()
    // console.log("Edited FormState: ", new Date(formState.battleStartTime).toISOString(), new Date(formState.battleEndTime).toISOString())
    setSaving(true)
    console.log("formstate", formState)


    if (!formState.templateName || !formState.portfolioValue || !formState.entryFee || !formState.status) {
      console.log('edit', formState);
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }
    const { templateName, portfolioValue, entryFee, status } = formState;

    const res = await fetch(`${apiUrl}battletemplate/${template?._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        templateName, portfolioValue, entryFee, status
      })
    });

    const data = await res.json();
    console.log(data);
    if (data.status === 500 || data.error || !data) {
      openErrorSB("Error", data.error)
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
    } else {
      openSuccessSB("Battle Template Edited", "Edited Successfully")
      setTimeout(() => { setSaving(false); setEditing(false) }, 500)
      console.log("entry succesfull");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!formState[name]?.includes(e.target.value)) {
      setFormState(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // console.log("check stoxhero", formState?.isNifty , contest?.contestFor , dailyContest?.contestFor )

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
                Fill Template Details
              </MDTypography>
            </MDBox>

            <Grid container display="flex" flexDirection="row" justifyContent="space-between">
              <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={9} xl={12}>
                <Grid item xs={12} md={6} xl={3}>
                  <TextField
                    disabled={((isSubmitted || template) && (!editing || saving))}
                    id="outlined-required"
                    label='Template Name *'
                    name='templateName'
                    fullWidth
                    defaultValue={editing ? formState?.templateName : template?.templateName}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        templateName: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mb={1}>
                  <TextField
                    disabled={((isSubmitted || template) && (!editing || saving))}
                    id="outlined-required"
                    label='Portfolio Value *'
                    name='portfolioValue'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.portfolioValue : template?.portfolioValue}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        portfolioValue: parseInt(e.target.value, 10)
                      }))
                    }}
                  />
                </Grid>


                <Grid item xs={12} md={6} xl={3} mb={1}>
                  <TextField
                    disabled={((isSubmitted || template) && (!editing || saving))}
                    id="outlined-required"
                    label='Entry Fee *'
                    name='entryFee'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.entryFee : template?.entryFee}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        entryFee: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mb={1}>
                  <TextField
                    disabled={((isSubmitted || template) && (!editing || saving))}
                    id="outlined-required"
                    label='Winnner Percentage*'
                    name='winnerPercentage'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.winnersPercentage : template?.winnersPercentage}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        winnersPercentage: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mb={1}>
                  <TextField
                    disabled={((isSubmitted || template) && (!editing || saving))}
                    id="outlined-required"
                    label='Platform Commission*'
                    name='platformCommission'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.platformCommission : template?.platformCommission}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        platformCommission: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mb={1}>
                  <TextField
                    disabled={((isSubmitted || template) && (!editing || saving))}
                    id="outlined-required"
                    label='Min Participants*'
                    name='minParticipants'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.minParticipants : template?.minParticipants}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        minParticipants: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mb={1}>
                  <TextField
                    disabled={((isSubmitted || template) && (!editing || saving))}
                    id="outlined-required"
                    label='GST Percentage*'
                    name='gstPercentage'
                    fullWidth
                    type='number'
                    defaultValue={editing ? formState?.gstPercentage : template?.gstPercentage}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        gstPercentage: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Battle Type *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='status'
                      value={formState?.status || template?.status}
                      disabled={((isSubmitted || template) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          status: e.target.value
                        }))
                      }}
                      label="Battle Type"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="HRHR">HRHR</MenuItem>
                      <MenuItem value="MRMR">MRMR</MenuItem>
                      <MenuItem value="LRLR">LRLR</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Status *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='status'
                      value={formState?.status || template?.status}
                      disabled={((isSubmitted || template) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          status: e.target.value
                        }))
                      }}
                      label="Status"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

              </Grid>

            </Grid>

            <Grid container mt={2} xs={12} md={12} xl={12} >
              <Grid item display="flex" justifyContent="flex-end" xs={12} md={6} xl={12}>
                {!isSubmitted && !Boolean(template) && (
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
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/battledashboard") }}>
                      Cancel
                    </MDButton>
                  </>
                )}
                {((isSubmitted || Boolean(template)) && !editing) && (
                  <>
                  {template?.status !== "Completed" &&
                    <MDButton variant="contained" color="warning" size="small" sx={{ mr: 1, ml: 2 }} onClick={() => { setEditing(true) }}>
                      Edit
                    </MDButton>}
                    <MDButton variant="contained" color="info" size="small" onClick={() => { navigate('/battledashboard/battletemplate') }}>
                      Back
                    </MDButton>
                  </>
                )}
                {((isSubmitted || Boolean(template)) && editing) && (
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

//TODO: Server error- isSubmitted state changes/submit condition becomes true