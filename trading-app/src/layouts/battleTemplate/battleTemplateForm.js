
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
import RankingPayout from './data/rankingPayout'


function Index() {
  const location = useLocation();
  const id = location?.state?.data;
  const [template, setTemplate] = useState(id ? id : null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [isLoading, setIsLoading] = useState(template ? true : false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate();
  const [updatedDocument, setUpdatedDocument] = useState([]);
  const [action, setAction] = useState(false);
  const [formState, setFormState] = useState({
    battleTemplateName: '' || template?.battleTemplateName,
    portfolioValue: '' || template?.portfolioValue,
    entryFee: (template?.entryFee ? parseInt(template?.entryFee) : 0),
    status: '' || template?.status,
    platformCommissionPercentage: (template?.platformCommissionPercentage ? parseInt(template?.platformCommissionPercentage) : 0),
    minParticipants: (template?.minParticipants ? parseInt(template?.minParticipants) : 0),
    gstPercentage: (template?.gstPercentage ? parseInt(template?.gstPercentage) : 0),
    winnerPercentage: (template?.winnerPercentage ? parseInt(template?.winnerPercentage) : 0),
    battleType: '' || template?.battleType,
    battleTemplateType: '' || template?.battleTemplateType,
    expectedCollection: 0 
  });

  const [childFormState,setChildFormState] = useState({
    rank:'',
    rewardPercentage: '',
  });

  console.log(formState)

  useEffect(() => {
    setTimeout(() => {
      template && setUpdatedDocument(template)
      setIsLoading(false);
    }, 200)
  }, [])


  async function onSubmit(e, formState) {
    e.preventDefault();
    try{
      console.log(formState)

      if (!formState.battleTemplateName || !formState.portfolioValue || !formState.entryFee || !formState.winnerPercentage || !formState.platformCommissionPercentage || !formState.minParticipants || !formState.gstPercentage || !formState.battleType || !formState.battleTemplateType  || !formState.status) {
        setTimeout(() => { setCreating(false); setIsSubmitted(false) }, 500)
        return openErrorSB("Missing Field", "Please fill all the mandatory fields")
      }
  
      setTimeout(() => { setCreating(false); setIsSubmitted(true) }, 500)
      const { battleTemplateName, portfolioValue, entryFee, winnerPercentage, platformCommissionPercentage, minParticipants, gstPercentage, battleType, battleTemplateType, status } = formState;
      const res = await fetch(`${apiUrl}battletemplates`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          battleTemplateName, portfolioValue, entryFee, winnerPercentage, platformCommissionPercentage, minParticipants, gstPercentage, battleType, battleTemplateType, status
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
        console.log("Created Template Data:",data?.data)
        setTemplate(data?.data);
        setFormState({
          battleTemplateName: '' || template?.battleTemplateName,
          portfolioValue: '' || template?.portfolioValue,
          entryFee: '' || template?.entryFee,
          status: '' || template?.status,
          platformCommissionPercentage: '' || template?.platformCommissionPercentage,
          minParticipants: '' || template?.minParticipants,
          gstPercentage: '' || template?.gstPercentage,
          winnerPercentage: '' || template?.winnerPercentage,
          battleType: '' || template?.battleType,
          battleTemplateType: '' || template?.battleTemplateType
        });
        calculation();
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


    if (!formState.battleTemplateName || !formState.portfolioValue || !formState.entryFee || !formState.winnerPercentage || !formState.platformCommissionPercentage || !formState.minParticipants || !formState.gstPercentage || !formState.battleType || !formState.battleTemplateType || !formState.status) {
      console.log('edit', formState);
      setTimeout(() => { setSaving(false); setEditing(true) }, 500)
      return openErrorSB("Missing Field", "Please fill all the mandatory fields")
    }
    const { battleTemplateName, portfolioValue, entryFee, winnerPercentage, platformCommissionPercentage, minParticipants, gstPercentage, battleType, battleTemplateType, status } = formState;

    const res = await fetch(`${apiUrl}battletemplates/${template?._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        battleTemplateName, portfolioValue, entryFee, winnerPercentage, platformCommissionPercentage, minParticipants, gstPercentage, battleType, battleTemplateType, status
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

  async function createRankingPayout(e,childFormState,setChildFormState){
    e.preventDefault()
    console.log("Inside Add Ranking Payout Function")
    setSaving(true)
    if(!childFormState?.rank || !childFormState?.rewardPercentage){
        setTimeout(()=>{setCreating(false);setIsSubmitted(false)},500)
        return openErrorSB("Missing Field","Please fill all the mandatory fields")
    }
    const {rank, rewardPercentage} = childFormState;
  
    const res = await fetch(`${baseUrl}api/v1/battletemplates/${template?._id}`, {
        method: "PATCH",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(
          {rankingPayout : [...template?.rankingPayout, {rank, rewardPercentage} ]}
          )
    });
    const data = await res.json();
    if (res.status !== 200) {
        openErrorSB("Error",data.message)
    } else {
        setUpdatedDocument(data?.data);
        console.log("Data Check:",data?.data);
        setTemplate(data?.data);
        openSuccessSB("Success",data.message);
        setChildFormState({
          rank:'',
          rewardPercentage: '',
        });
        setTimeout(()=>{setSaving(false);setEditing(false)},500)
    }
  }

  let collection = 0;
  function calculation(entryFee,minParticipants){
    // Perform your calculation based on formState.field1 and formState.field2
    console.log("Calculation Function Called")
    //  collection = formState.entryFee * formState.minParticipants;
    // Update the calculatedField in the state
    setFormState(prevState => ({
      ...prevState,
      expectedCollection: entryFee * minParticipants,
    }));
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


const handleEntryFeeChange = (e) => {
  // Update field2 in the state
  console.log("Inside Entry Fee Change")
  setFormState(prevState => ({
    ...prevState,
    entryFee: e.target.value,
  }));

  // Call the calculation function here
  calculation(e.target.value,formState?.minParticipants);
};

const handleParticipantChange = (e) => {
  // Update field2 in the state
  console.log("Inside Participant Change")
  setFormState(prevState => ({
    ...prevState,
    minParticipants: e.target.value,
  }));

  // Call the calculation function here
  calculation(formState?.entryFee,e.target.value);
};
console.log("Condiiton:",(isSubmitted || template) && (!editing || saving))
console.log("Condiiton:",(isSubmitted || template))
console.log("Condiiton:",(!editing || saving))
console.log("Condiiton:",isSubmitted,template,!editing,saving)
let totalCollection = template ? template?.entryFee*template?.minParticipants : (formState?.expectedCollection ? formState?.expectedCollection : 0);
let gst = template ? ((template?.entryFee*template?.minParticipants)*template?.gstPercentage)/100 : (formState.expectedCollection*formState?.gstPercentage)/100;
let collectionAfterTax = (totalCollection)-(gst)
let platfromFee = template ? ((collectionAfterTax*template?.platformCommissionPercentage)/100): (collectionAfterTax*formState?.platformCommissionPercentage)/100;
let prizePool = (collectionAfterTax) - platfromFee;
let totalNumberOfWinners = template ? ((template?.minParticipants*template?.winnerPercentage)/100).toFixed(0) : ((formState?.minParticipants*formState?.winnerPercentage)/100).toFixed(0)

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
                    name='battleTemplateName'
                    fullWidth
                    defaultValue={editing ? formState?.battleTemplateName : template?.battleTemplateName}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        battleTemplateName: e.target.value
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
                    value={template ? template?.entryFee : formState?.entryFee}
                    defaultValue={editing ? formState?.entryFee : template?.entryFee}
                    // onChange={handleChange}
                    // onChange={(e) => {
                    //   setFormState(prevState => ({
                    //     ...prevState,
                    //     entryFee: e.target.value
                    //   }))
                    //   calculation();
                    // }}
                    onChange={handleEntryFeeChange}
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
                    value={template ? template?.winnerPercentage : formState?.winnerPercentage}
                    defaultValue={editing ? formState?.winnerPercentage : template?.winnerPercentage}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        winnerPercentage: e.target.value
                      }))
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} xl={3} mb={1}>
                  <TextField
                    disabled={((isSubmitted || template) && (!editing || saving))}
                    id="outlined-required"
                    label='Platform Commission*'
                    name='platformCommissionPercentage'
                    fullWidth
                    type='number'
                    value={template ? template?.platformCommissionPercentage : formState?.platformCommissionPercentage}
                    defaultValue={editing ? formState?.platformCommissionPercentage : template?.platformCommissionPercentage}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setFormState(prevState => ({
                        ...prevState,
                        platformCommissionPercentage: e.target.value
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
                    value={template ? template?.minParticipants : formState?.minParticipants}
                    defaultValue={editing ? formState?.minParticipants : template?.minParticipants}
                    // onChange={handleChange}
                    // onChange={(e) => {
                    //   setFormState(prevState => ({
                    //     ...prevState,
                    //     minParticipants: e.target.value
                    //   }))
                    //   calculation();
                    // }}
                    onChange={handleParticipantChange}
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
                    value={formState?.gstPercentage}
                    // defaultValue={editing ? formState?.gstPercentage : template?.gstPercentage}
                    // onChange={handleChange}
                    onChange={(e) => {
                      console.log('change',e.target.value);
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
                      name='battleType'
                      value={formState?.battleType || template?.battleType}
                      disabled={((isSubmitted || template) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          battleType: e.target.value
                        }))
                      }}
                      label="Battle Template Type"
                      sx={{ minHeight: 43 }}
                    >
                      <MenuItem value="Intraday">Intraday</MenuItem>
                      <MenuItem value="Weeklong">Weeklong</MenuItem>
                      <MenuItem value="Monthlong">Monthlong</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} xl={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Battle Template Type *</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      name='battleTemplateType'
                      value={formState?.battleTemplateType || template?.battleTemplateType}
                      disabled={((isSubmitted || template) && (!editing || saving))}
                      onChange={(e) => {
                        setFormState(prevState => ({
                          ...prevState,
                          battleTemplateType: e.target.value
                        }))
                      }}
                      label="Battle Template Type"
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
                      <MenuItem value="Draft">Draft</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

              </Grid>

            </Grid>

            <Grid container mt={2} xs={12} md={12} xl={12} >
              
              <Grid item xs={12} md={6} xl={12} mb={1}>
                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                    Calculated Fields
                </MDTypography>
              </Grid>

              <Grid item xs={12} md={6} xl={3} mb={1}>
                <MDTypography fontSize={15}>Total Collection(Exp.): ₹{totalCollection}</MDTypography>
              </Grid>

              <Grid item xs={12} md={6} xl={3} mb={1}>
                <MDTypography fontSize={15}>GST(Exp.): ₹{gst}</MDTypography>
              </Grid>

              <Grid item xs={12} md={6} xl={3} mb={1}>
                <MDTypography fontSize={15}>Collection After Tax(Exp.): ₹{collectionAfterTax}</MDTypography>
              </Grid>

              <Grid item xs={12} md={6} xl={3} mb={1}>
                <MDTypography fontSize={15}>Platform Fee(Exp.): ₹{platfromFee}</MDTypography>
              </Grid>

              <Grid item xs={12} md={6} xl={3} mb={1}>
                <MDTypography fontSize={15}>Prize Pool(Exp.): ₹{prizePool}</MDTypography>
              </Grid>

              <Grid item xs={12} md={6} xl={3} mb={1}>
                <MDTypography fontSize={15}>Top # of Winners: {template?.rankingPayout.length}</MDTypography>
              </Grid>

              {template?.rankingPayout?.length > 0 && <Grid item xs={12} md={6} xl={3} mb={1}>
                <MDTypography fontSize={15}>Total # of Winners: {totalNumberOfWinners}</MDTypography>
              </Grid>}

              {template?.rankingPayout?.length > 0 && <Grid item xs={12} md={6} xl={3} mb={1}>
                <MDTypography fontSize={15}>Reward(Remaining Winners):
                ₹{((100-(template?.rankingPayout.reduce((total, currentItem) => {
                    return total + currentItem.rewardPercentage;
                  }, 0)))*prizePool)/100}
                </MDTypography>
              </Grid>}

              {template?.rankingPayout.length > 0 && <Grid item xs={12} md={6} xl={3} mb={1}>
                <MDTypography fontSize={15}>Reward/Remaining Winners:
                ₹{(((100-(template?.rankingPayout.reduce((total, currentItem) => {
                    return total + currentItem.rewardPercentage;
                  }, 0)))*prizePool)/100)/(totalNumberOfWinners-template?.rankingPayout.length)}
                </MDTypography>
              </Grid>}

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
                    <MDButton variant="contained" color="error" size="small" disabled={creating} onClick={() => { navigate("/battledashboard/battletemplate") }}>
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

            {(isSubmitted || template) && !editing && 
                  <Grid item xs={12} md={6} xl={12}>
                      
                      <Grid container spacing={2} display='flex' justifyContent='left' alignItems='center'>

                      <Grid item xs={12} md={6} xl={12} mb={1}>
                      <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                          Create Ranking Payout
                      </MDTypography>
                      </Grid>
                      
                      <Grid item xs={12} md={1} xl={1}>
                          <TextField
                              id="outlined-required"
                              label='Rank'
                              fullWidth
                              type="text"
                              value={childFormState?.rank}
                              onChange={(e) => {setChildFormState(prevState => ({
                                  ...prevState,
                                  rank: e.target.value
                              }))}}
                          />
                      </Grid>
          
                      <Grid item xs={12} md={2} xl={2}>
                          <TextField
                              id="outlined-required"
                              label='Reward Percentage*'
                              fullWidth
                              type="text"
                              value={childFormState?.rewardPercentage}
                              onChange={(e) => {setChildFormState(prevState => ({
                                  ...prevState,
                                  rewardPercentage: e.target.value
                              }))}}
                          />
                      </Grid>
              
                      <Grid item xs={12} md={5} xl={5}>
                          {/* <IoMdAddCircle cursor="pointer" onClick={(e)=>{onAddFeature(e,formState,setFormState)}}/> */}
                          <MDButton 
                            variant='contained' 
                            color='success' 
                            size='small' 
                            onClick={(e)=>{createRankingPayout(e,childFormState,setChildFormState)}}>Create Reward Payouts</MDButton>
                      </Grid>
      
                      </Grid>
      
                  </Grid>
                }

                {(isSubmitted || template) && 
                <Grid item xs={12} md={12} xl={12} mt={2} mb={2}>
                    <MDBox>
                        <RankingPayout saving={saving} template={template} updatedDocument={updatedDocument} setUpdatedDocument={setUpdatedDocument} prizePool={prizePool} action={action} setAction={setAction}/>
                    </MDBox>
                </Grid>
                }


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