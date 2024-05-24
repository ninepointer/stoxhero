import * as React from "react";
import { useState } from "react";
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
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { apiUrl } from "../../constants/constants";


function Index() {
  const location = useLocation();
  const id = location?.state?.data;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    ...id,
    activationProgramStartDate:
      dayjs(id?.activationProgramStartDate) ??
      dayjs(new Date()).set("hour", 0).set("minute", 0).set("second", 0),
    activationProgramEndDate:
      dayjs(id?.activationProgramEndDate) ??
      dayjs(new Date()).set("hour", 0).set("minute", 0).set("second", 0),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();

  async function onEdit(e, formState) {
    e.preventDefault();
    setSaving(true);
    if (
      !formState?.activationProgramName ||
      !formState?.activationProgramStartDate ||
      !formState?.activationProgramEndDate ||
      !formState?.rewardPeractivation ||
      !formState?.currency ||
      !formState?.status
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
      activationSignupBonus,
      activationProgramName,
      activationProgramStartDate,
      activationProgramEndDate,
      rewardPeractivation,
      currency,
      status,
      description,
    } = formState;
    const res = await fetch(`${apiUrl}activations/${id?._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        activationSignupBonus,
        activationSignupBonus,
        activationProgramName,
        activationProgramStartDate,
        activationProgramEndDate,
        rewardPeractivation,
        currency,
        status,
        description,
      }),
    });

    const data = await res.json();

    if (data.status === 422 || data.error || !data) {
      openErrorSB("Error", data.error);
    } else {
      openSuccessSB("Activation Saved", data.activationProgramName);
      setTimeout(() => {
        setSaving(false);
        setEditing(false);
      }, 500);
    }
  }

  async function onSubmit(e, formState) {
    e.preventDefault();
    setSaving(true);

    if (
      !formState?.activationProgramName ||
      !formState?.activationProgramStartDate ||
      !formState?.activationProgramEndDate ||
      !formState?.rewardPeractivation ||
      !formState?.currency ||
      !formState?.status
    ) {
      setTimeout(() => {
        setSaving(false);
      }, 500);
      return openErrorSB(
        "Missing Field",
        "Please fill all the mandatory fields"
      );
    }
    const {
      activationSignupBonus,
      activationProgramName,
      activationProgramStartDate,
      activationProgramEndDate,
      rewardPeractivation,
      currency,
      status,
      description,
    } = formState;
    const res = await fetch(`${apiUrl}activations`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        activationSignupBonus,
        activationSignupBonus,
        activationProgramName,
        activationProgramStartDate,
        activationProgramEndDate,
        rewardPeractivation,
        currency,
        status,
        description,
      }),
    });

    const response = await res.json();
    if (response) {
      openSuccessSB(
        "Activation Program Created",
        response.data.activationProgramName +
          "|" +
          response.data.activationProgramName
      );
      // setNewObjectId(data.data)
      setTimeout(() => {
        setCreating(false);
        setIsSubmitted(true);
      }, 500);
    } else {
      setTimeout(() => {
        setCreating(false);
        setIsSubmitted(false);
      }, 500);
      openErrorSB("Error", response.message);
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
        <MDBox pl={2} pr={2} mt={4}>
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
              Activation Program Details
            </MDTypography>
          </MDBox>

          <Grid container spacing={1} mt={0.5} mb={0}>
            <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={(isSubmitted || id) && (!editing || saving)}
                id="outlined-required"
                label="Activation Program Name *"
                fullWidth
                value={formState?.activationProgramName}
                onChange={(e) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    activationProgramName: e.target.value,
                  }));
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={3} mt={-1}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Activation Program Start Date"
                    disabled={(isSubmitted || id) && (!editing || saving)}
                    value={dayjs(formState?.activationProgramStartDate)}
                    onChange={(e) => {

                      setFormState((prevState) => ({
                        ...prevState,
                        activationProgramStartDate: dayjs(e),
                      }));
                    }}
                    sx={{ width: "100%" }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6} xl={3} mt={-1}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Activation Program End Date"
                    disabled={(isSubmitted || id) && (!editing || saving)}
                    value={dayjs(formState?.activationProgramEndDate)}
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        activationProgramEndDate: dayjs(e),
                      }));
                    }}
                    sx={{ width: "100%" }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={(isSubmitted || id) && (!editing || saving)}
                id="outlined-required"
                label="Reward Per Activation *"
                type="number"
                defaultValue={formState?.rewardPeractivation}
                fullWidth
                onChange={(e) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    rewardPeractivation: e.target.value,
                  }));
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={3}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">
                  Reward Currency *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={formState?.currency}
                  disabled={(isSubmitted || id) && (!editing || saving)}
                  onChange={(e) => {
                    setFormState((prevState) => ({
                      ...prevState,
                      currency: e.target.value,
                    }));
                  }}
                  label="Reward Currency"
                  sx={{ minHeight: 43 }}
                >
                  <MenuItem value="INR">INR</MenuItem>
                  <MenuItem value="HeroCash">HeroCash</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={(isSubmitted || id) && (!editing || saving)}
                id="outlined-required"
                label="Amount *"
                type="number"
                defaultValue={formState?.activationSignupBonus?.amount}
                fullWidth
                onChange={(e) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    activationSignupBonus: {
                      ...prevState.activationSignupBonus,
                      amount: e.target.value,
                    },
                  }));
                }}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={3}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">
                  Bonus currency *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={formState?.activationSignupBonus?.currency}
                  disabled={(isSubmitted || id) && (!editing || saving)}
                  onChange={(e) => {
                    setFormState((prevState) => ({
                      ...prevState,
                      activationSignupBonus: {
                        ...prevState.activationSignupBonus,
                        currency: e.target.value,
                      },
                    }));
                  }}
                  label="Bonus Currency"
                  sx={{ minHeight: 43 }}
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Bonus">Bonus</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} xl={3}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">
                  Status *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={formState?.status}
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
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled
                id="outlined-required"
                label="Activation Program ID *"
                fullWidth
                value={formState?.activationProgramId}
              />
            </Grid>

            <Grid item xs={12} md={6} xl={12}>
              <TextField
                disabled={(isSubmitted || id) && (!editing || saving)}
                id="outlined-required"
                label="Description *"
                fullWidth
                value={formState?.description}
                onChange={(e) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    description: e.target.value,
                  }));
                }}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
          <Grid mt={2}>
            <Grid
              item
              display="flex"
              justifyContent="flex-end"
              alignContent="center"
              xs={12}
              md={6}
              xl={6}
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
                      navigate("/activationprogram");
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
                    onClick={() => {
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
                      navigate("/activationprogram");
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
          </Grid>
          {renderSuccessSB}
          {renderErrorSB}
        </MDBox>
      )}
    </>
  );
}
export default Index;
