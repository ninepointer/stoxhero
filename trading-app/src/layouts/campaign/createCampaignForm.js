import React, { useEffect, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useNavigate, useLocation } from "react-router-dom";
import CampaignUsers from "./data/campaignUsers";
import { IoMdAddCircle } from "react-icons/io";

function Index() {
  const location = useLocation();
  const id = location?.state?.data;
  console.log("Campaign Users: ", id?.users?.length);
  const [campaignUserCount, setCampaignUserCount] = useState(id?.users?.length);
  const [isSubmitted, setIsSubmitted] = useState(false);
  let baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";
  const [isLoading, setIsLoading] = useState(id ? true : false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const [newObjectId, setNewObjectId] = useState("");
  const [updatedDocument, setUpdatedDocument] = useState([]);
  const [campaignData, setCampaignData] = useState([]);
  const [cac, setCAC] = useState(0);
  console.log(id?.campaignName);
  const [formState, setFormState] = useState({
    campaignName: "",
    description: "",
    campaignFor: "",
    campaignCode: "",
    campaignLink: "",
    campaignCost: "",
    status: "",
    campaignType: "",
    maxUsers: "",
    campaignSignupBonus: {
      amount: "",
      currency: "",
    },
  });

  useEffect(() => {
    setTimeout(() => {
      id && setUpdatedDocument(id);
      setIsLoading(false);
    }, 500);
    // setCampaignUserCount(id?.users?.length);
  }, []);
  console.log("Campaign User Count: ", campaignUserCount);
  React.useEffect(() => {
    axios
      .get(`${baseUrl}api/v1/campaign/${id?._id}`, { withCredentials: true })
      .then((res) => {
        setCampaignData(res.data.data);
        setUpdatedDocument(res.data.data);
        console.log("Campaign data is", res.data);
        setCAC((res.data.data.campaignCost / campaignUserCount).toFixed(2));
        // setCampaignUserCount(res?.data?.data?.users?.length);
        setFormState({
          campaignName: res.data.data?.campaignName || "",
          description: res.data.data?.description || "",
          campaignCode: res.data.data?.campaignCode || "",
          campaignFor: res.data.data?.campaignFor || "",
          campaignLink: res.data.data?.campaignLink || "",
          campaignCost: res.data.data?.campaignCost || "",
          status: res.data.data?.status || "",
          campaignType: res.data.data?.campaignType || "",
          maxUsers: res.data.data?.maxUsers || "",
          campaignSignupBonus: {
            amount: res.data.data?.campaignSignupBonus?.amount || "",
            currency: res.data.data?.campaignSignupBonus?.currency || "",
          },
          isDefault: res.data.data?.isDefault || "",
        });
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      })
      .catch((err) => {
        return new Error(err);
      });
  }, [isLoading, editing, campaignUserCount]);

  async function onSubmit(e, formState) {
    e.preventDefault();
    console.log(formState);
    if (
      !formState.campaignName ||
      !formState.description ||
      !formState.campaignCode ||
      !formState.campaignFor ||
      !formState.campaignLink ||
      !formState.status
    ) {
      setTimeout(() => {
        setCreating(false);
        setIsSubmitted(false);
      }, 500);
      return openErrorSB(
        "Missing Field",
        "Please fill all the mandatory fields"
      );
    }
    // console.log("Is Submitted before State Update: ",isSubmitted)
    setTimeout(() => {
      setCreating(false);
      setIsSubmitted(true);
    }, 500);
    const {
      campaignSignupBonus,
      currency,
      campaignType,
      maxUsers,
      amount,
      campaignName,
      description,
      campaignCode,
      campaignFor,
      campaignLink,
      campaignCost,
      status,
      isDefault,
    } = formState;
    const res = await fetch(`${baseUrl}api/v1/campaign/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        campaignSignupBonus: campaignSignupBonus,
        campaignType,
        maxUsers,
        campaignName,
        description,
        campaignCode,
        campaignFor,
        campaignLink,
        campaignCost,
        status,
        isDefault,
      }),
    });

    const data = await res.json();
    console.log(data);
    if (data.status === 400 || data.info) {
      setTimeout(() => {
        setCreating(false);
        setIsSubmitted(false);
      }, 500);
      openErrorSB("Campaign not created", data?.info);
    } else {
      openSuccessSB("Campaign Created", data?.message);
      setNewObjectId(data?.data?._id);
      console.log("New Object Id: ", data?.data?._id, newObjectId);
      setIsSubmitted(true);
      setTimeout(() => {
        setCreating(false);
        setIsSubmitted(true);
      }, 500);
    }
  }

  async function onEdit(e, formState) {
    e.preventDefault();
    console.log("Edited FormState: ", formState, id._id);
    setSaving(true);
    console.log(formState);
    if (
      !formState.campaignName ||
      !formState.description ||
      !formState.campaignFor ||
      !formState.campaignLink ||
      !formState.campaignCode ||
      !formState.status
    ) {
      setTimeout(() => {
        setSaving(false);
        setEditing(true);
      }, 500);
      return openErrorSB(
        "Missing Field",
        "Please fill all the mandatory fields"
      );
    }
    const {
      campaignSignupBonus,
      currency,
      campaignType,
      maxUsers,
      amount,
      campaignName,
      description,
      campaignFor,
      campaignLink,
      campaignCode,
      campaignCost,
      status,
      isDefault,
    } = formState;

    const res = await fetch(`${baseUrl}api/v1/campaign/${id._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        campaignSignupBonus: campaignSignupBonus,
        campaignType,
        maxUsers,
        campaignName,
        description,
        campaignFor,
        campaignLink,
        campaignCost,
        campaignCode,
        status,
        isDefault,
      }),
    });

    const data = await res.json();
    console.log(data);
    if (data.status === 422 || data.error || !data) {
      openErrorSB("Error", data.error);
    } else {
      openSuccessSB("Campaign Edited", "Edited Successfully");
      setTimeout(() => {
        setSaving(false);
        setEditing(false);
      }, 500);
      console.log("entry succesfull");
    }
  }

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (title, content) => {
    setTitle(title);
    setContent(content);
    setSuccessSB(true);
  };
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
    setTitle(title);
    setContent(content);
    setErrorSB(true);
  };
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
      setFormState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  console.log("Campaign User Count: ", campaignUserCount);
  return (
    <>
      {isLoading ? (
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={5}
          mb={5}
        >
          <CircularProgress color="info" />
        </MDBox>
      ) : (
        <MDBox pl={2} pr={2} mt={4} mb={2}>
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <MDTypography
              variant="caption"
              fontWeight="bold"
              color="text"
              textTransform="uppercase"
            >
              Fill Campaign Details
            </MDTypography>
          </MDBox>

          <Grid
            container
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={9} xl={12}>
              {/* <Grid item xs={12} md={6} xl={3} mt={2}>
            <TextField
                disabled={((isSubmitted || id) && (!editing || saving))}
                id="outlined-required"
                name="campaignName"
                label='Campaign Name *'
                fullWidth
                // value={formState?.campaignName || id?.campaignName}
                // onChange={(e) => {setFormState(prevState => ({
                //     ...prevState,
                //     campaignName: e.target.value
                //   }))}}

                defaultValue={editing ? formState.campaignName:id?.campaignName}
                onChange={handleChange}
              />
          </Grid> */}

              <Grid item xs={12} md={6} xl={3} mt={2}>
                <TextField
                  disabled={(isSubmitted || id) && (!editing || saving)}
                  id="outlined-required"
                  name="campaignName"
                  label="Campaign Name *"
                  fullWidth
                  // value={formState?.campaignName || id?.campaignName}
                  // onChange={(e) => {setFormState(prevState => ({
                  //     ...prevState,
                  //     campaignName: e.target.value
                  //   }))}}

                  defaultValue={
                    editing ? formState.campaignName : id?.campaignName
                  }
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={3} mt={2}>
                <TextField
                  disabled={(isSubmitted || id) && (!editing || saving)}
                  id="outlined-required"
                  name="campaignCode"
                  label="Campaign Code *"
                  fullWidth
                  // value={formState?.campaignCode || id?.campaignCode}
                  // onChange={(e) => {setFormState(prevState => ({
                  //     ...prevState,
                  //     campaignCode: e.target.value
                  //   }))}}

                  defaultValue={
                    editing ? formState.campaignCode : id?.campaignCode
                  }
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={3} mt={2}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-autowidth-label">
                    Campaign Type *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    name="campaignType"
                    value={formState?.campaignType || id?.campaignType}
                    // value={oldObjectId ? contestData?.status : formState?.status}
                    disabled={(isSubmitted || id) && (!editing || saving)}
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        campaignType: e.target.value,
                      }));
                    }}
                    label="Job Type"
                    sx={{ minHeight: 43 }}
                  >
                    <MenuItem value="Campaign">Campaign</MenuItem>
                    <MenuItem value="Invite">Invite</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} xl={3} mt={2}>
                <TextField
                  disabled={(isSubmitted || id) && (!editing || saving)}
                  id="outlined-required"
                  name="maxUsers"
                  label="Max User *"
                  fullWidth
                  // value={formState?.maxUsers || id?.maxUsers}
                  // onChange={(e) => {setFormState(prevState => ({
                  //     ...prevState,
                  //     maxUsers: e.target.value
                  //   }))}}

                  defaultValue={editing ? formState.maxUsers : id?.maxUsers}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={3} mt={2}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-autowidth-label">
                    Is Default *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    name="isDefault"
                    value={formState?.isDefault || id?.isDefault}
                    // value={oldObjectId ? contestData?.status : formState?.status}
                    disabled={(isSubmitted || id) && (!editing || saving)}
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        isDefault: e.target.value,
                      }));
                    }}
                    label="Is Default"
                    sx={{ minHeight: 43 }}
                  >
                    <MenuItem value={true}>true</MenuItem>
                    <MenuItem value={false}>false</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} xl={3} mt={2}>
                <TextField
                  disabled={(isSubmitted || id) && (!editing || saving)}
                  id="outlined-required"
                  name="amount"
                  label="Amount *"
                  fullWidth
                  defaultValue={
                    editing
                      ? formState?.campaignSignupBonus?.amount
                      : id?.campaignSignupBonus?.amount
                  }
                  onChange={(e) => {
                    setFormState((prevState) => ({
                      ...prevState,
                      campaignSignupBonus: {
                        ...prevState.campaignSignupBonus,
                        amount: e.target.value,
                      },
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={3} mt={2}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-autowidth-label">
                    Currency *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    name="currency"
                    value={
                      formState?.campaignSignupBonus?.currency ||
                      id?.campaignSignupBonus?.currency
                    }
                    // value={oldObjectId ? contestData?.status : formState?.status}
                    disabled={(isSubmitted || id) && (!editing || saving)}
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        campaignSignupBonus: {
                          ...prevState.campaignSignupBonus,
                          currency: e.target.value,
                        },
                      }));
                    }}
                    label="Job Type"
                    sx={{ minHeight: 43 }}
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Bonus">Bonus</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} xl={3} mt={2}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-autowidth-label">
                    Campaign For *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    name="campaignFor"
                    value={formState?.campaignFor || id?.campaignFor}
                    // value={oldObjectId ? contestData?.status : formState?.status}
                    disabled={(isSubmitted || id) && (!editing || saving)}
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        campaignFor: e.target.value,
                      }));
                    }}
                    label="Job Type"
                    sx={{ minHeight: 43 }}
                  >
                    <MenuItem value="Facebook">Facebook</MenuItem>
                    <MenuItem value="Instagram">Instagram</MenuItem>
                    <MenuItem value="Twitter">Twitter</MenuItem>
                    <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                    <MenuItem value="Career">Career</MenuItem>
                    <MenuItem value="Google">Google</MenuItem>
                    <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                    <MenuItem value="Telegram">Telegram</MenuItem>
                    <MenuItem value="Influencer">Influencer</MenuItem>
                    <MenuItem value="Website">Website</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} xl={3} mt={2}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-autowidth-label">
                    Status *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    name="status"
                    id="demo-simple-select-autowidth"
                    value={formState?.status || id?.status}
                    // value={oldObjectId ? contestData?.status : formState?.status}
                    disabled={(isSubmitted || id) && (!editing || saving)}
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        status: e.target.value,
                      }));
                    }}
                    label="Status"
                    sx={{ minHeight: 43 }}
                  >
                    <MenuItem value="Live">Live</MenuItem>
                    <MenuItem value="Draft">Draft</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={6} xl={2} mt={2}>
                <TextField
                  disabled={(isSubmitted || id) && (!editing || saving)}
                  id="outlined-required"
                  name="campaignCost"
                  label="Campaign Cost (in ₹)"
                  fullWidth
                  type="number"
                  multiline
                  // value={formState?.campaignCost || id?.campaignCost}
                  // onChange={(e) => {setFormState(prevState => ({
                  //     ...prevState,
                  //     campaignCost: e.target.value
                  //   }))}}

                  defaultValue={
                    editing ? formState.campaignCost : id?.campaignCost
                  }
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={6} md={6} xl={2} mt={2}>
                <TextField
                  disabled={true}
                  id="outlined-required"
                  name="cac"
                  label="CAC"
                  fullWidth
                  multiline
                  value={"₹" + cac}
                  defaultValue={cac}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={8} mt={2}>
                <TextField
                  disabled={(isSubmitted || id) && (!editing || saving)}
                  id="outlined-required"
                  name="campaignLink"
                  label="Campaign Link *"
                  fullWidth
                  multiline
                  // value={formState?.campaignLink || id?.campaignLink}
                  // onChange={(e) => {setFormState(prevState => ({
                  //     ...prevState,
                  //     campaignLink: e.target.value
                  //   }))}}

                  defaultValue={
                    editing ? formState?.campaignLink : id?.campaignLink
                  }
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={12} mt={2}>
                <TextField
                  disabled={(isSubmitted || id) && (!editing || saving)}
                  id="outlined-required"
                  name="description"
                  label="Campaign Description *"
                  fullWidth
                  multiline
                  // value={formState?.description || id?.description}
                  // onChange={(e) => {setFormState(prevState => ({
                  //     ...prevState,
                  //     description: e.target.value
                  //   }))}}

                  defaultValue={
                    editing ? formState?.description : id?.description
                  }
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid container mt={2} xs={12} md={12} xl={12}>
            <Grid
              item
              display="flex"
              justifyContent="flex-end"
              xs={12}
              md={6}
              xl={12}
            >
              {!isSubmitted && !id && (
                <>
                  <MDButton
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{ mr: 1, ml: 2 }}
                    disabled={creating}
                    onClick={(e) => {
                      onSubmit(e, formState);
                    }}
                  >
                    {creating ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Save"
                    )}
                  </MDButton>
                  <MDButton
                    variant="contained"
                    color="error"
                    size="small"
                    disabled={creating}
                    onClick={() => {
                      navigate("/campaigns");
                    }}
                  >
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
                    onClick={(e) => {
                      setEditing(true);
                    }}
                  >
                    Edit
                  </MDButton>
                  <MDButton
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => {
                      navigate("/campaigns");
                    }}
                  >
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
                    onClick={(e) => {
                      onEdit(e, formState);
                    }}
                  >
                    {saving ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Save"
                    )}
                  </MDButton>
                  <MDButton
                    variant="contained"
                    color="error"
                    size="small"
                    disabled={saving}
                    onClick={() => {
                      setEditing(false);
                    }}
                  >
                    Cancel
                  </MDButton>
                </>
              )}
            </Grid>

            {(id || newObjectId) && (
              <Grid item xs={12} md={12} xl={12} mt={2}>
                <MDBox>
                  <CampaignUsers
                    campaign={campaignData}
                    campaignUserCount={campaignUserCount}
                  />
                </MDBox>
              </Grid>
            )}
          </Grid>

          {renderSuccessSB}
          {renderErrorSB}
        </MDBox>
      )}
    </>
  );
}
export default Index;
