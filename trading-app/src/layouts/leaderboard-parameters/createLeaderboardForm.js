import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import {
  CircularProgress,
} from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useNavigate, useLocation } from "react-router-dom";
import OutlinedInput from "@mui/material/OutlinedInput";
import ContestRewards from "./data/reward/reward";
import { apiUrl } from "../../constants/constants";

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
  const leaderboard = location?.state?.data;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(leaderboard ? true : false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const [newObjectId, setNewObjectId] = useState("");
  const [updatedDocument, setUpdatedDocument] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const [formState, setFormState] = useState({
    frequency: "" || leaderboard?.frequency,
    status: "" || leaderboard?.status,
    usersPerTable: "" || leaderboard?.usersPerTable,
    marginMoneyInterest: "" || leaderboard?.marginMoneyInterest,
    quarterStartDate: "" || leaderboard?.quarterStartDate,
    quarterEndDate: "" || leaderboard?.quarterEndDate,
  });

  useEffect(() => {
    setTimeout(() => {
      leaderboard && setUpdatedDocument(leaderboard);
      setIsLoading(false);
    }, 500);
  }, []);

  async function onSubmit(e, formState) {
    e.preventDefault();
    const { frequency, status, usersPerTable, marginMoneyInterest, quarterStartDate, quarterEndDate } = formState;

    try {
      if (!frequency || !status || !usersPerTable || !marginMoneyInterest) {
        return openErrorSB("Error", "Please fill all detail");
      }

      if ((frequency==='Quarter') && (new Date(quarterStartDate) > new Date(quarterEndDate))) {
        return openErrorSB("Error", "Start date is greater then end date");
      }

      setTimeout(() => {
        setCreating(false);
        setIsSubmitted(true);
      }, 500);

      const res = await axios.post(`${apiUrl}leaderboard`, {
        frequency, status, usersPerTable, quarterStartDate, quarterEndDate, marginMoneyInterest
      }, {
        withCredentials: true
      })

      if (res.status !== 201) {
        setTimeout(() => {
          setCreating(false);
          setIsSubmitted(false);
        }, 500);
        openErrorSB("Leaderboard params not created", res?.data?.message);
      } else {
        openSuccessSB("Leaderboard params Created", res?.data?.message);
        setNewObjectId(res?.data?.data?._id);
        setIsSubmitted(true);
        setLeaderboardData(res?.data?.data);
        setTimeout(() => {
          setCreating(false);
          setIsSubmitted(true);
        }, 500);
      }

    } catch (err) { }
  }

  async function onEdit(e, formState) {
    try {
      e.preventDefault();
      setSaving(true);

      const { frequency, status, usersPerTable, marginMoneyInterest, quarterStartDate, quarterEndDate } = formState;


      if (!frequency || !status || !usersPerTable || !marginMoneyInterest) {
        return openErrorSB("Error", "Please fill all detail");
      }

      if ((frequency==='Quarter') && (new Date(quarterStartDate) > new Date(quarterEndDate))) {
        return openErrorSB("Error", "Start date is greater then end date");
      }

      const res = await axios.patch(`${apiUrl}leaderboard/${leaderboard?._id}`, {
        frequency, status, usersPerTable, quarterStartDate, quarterEndDate, marginMoneyInterest
      }, {
        withCredentials: true
      })

      if (
        res.status === 500 ||
        res.status == 400 ||
        res.status == 401 ||
        res.status == "error" ||
        res.error ||
        !res
      ) {
        openErrorSB("Error", res?.data?.error);
        setTimeout(() => {
          setSaving(false);
          setEditing(true);
        }, 500);
      } else if (res?.data.status == "success") {
        openSuccessSB("Leaderboard Edited", "Edited Successfully");
        setTimeout(() => {
          setSaving(false);
          setEditing(false);
        }, 500);
      } else {
        openErrorSB("Error", res?.data.message);
        setTimeout(() => {
          setSaving(false);
          setEditing(true);
        }, 500);
      }
    } catch (err) { }
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

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    if (!formState?.quarterStartDate) {
      setIsFocused(false);
    }
  };

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
              Fill Leaderboard Details
            </MDTypography>
          </MDBox>

          <Grid
            container
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Grid container spacing={2} mt={0.5} mb={0} xs={12} md={12} xl={12}>
              <Grid item xs={12} md={6} xl={4}>
                <TextField
                  disabled={(isSubmitted || leaderboard) && (!editing || saving)}
                  id="outlined-required"
                  label="Users Per Table *"
                  type='number'
                  name="usersPerTable"
                  fullWidth
                  defaultValue={
                    editing ? formState?.usersPerTable : leaderboard?.usersPerTable
                  }
                  onChange={(e) => {
                    setFormState((prevState) => ({
                      ...prevState,
                      usersPerTable: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={4}>
                <TextField
                  disabled={(isSubmitted || leaderboard) && (!editing || saving)}
                  id="outlined-required"
                  label="Margin Money Interest *"
                  type='number'
                  name="marginMoneyInterest"
                  fullWidth
                  defaultValue={
                    editing ? formState?.marginMoneyInterest : leaderboard?.marginMoneyInterest
                  }
                  onChange={(e) => {
                    setFormState((prevState) => ({
                      ...prevState,
                      marginMoneyInterest: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={4}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-multiple-name-label">
                    Frequency
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    name="frequency"
                    disabled={(isSubmitted || leaderboard) && (!editing || saving)}
                    value={formState?.frequency}
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        frequency: e.target.value,
                      }));
                    }}
                    input={<OutlinedInput label="Frequency" />}
                    sx={{ minHeight: 45 }}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="Daily">Daily</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="Quarter">Quarter</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {formState?.frequency === 'Quarter' &&
                <>
                  <Grid item xs={12} md={6} xl={4}>
                    <TextField
                      disabled={(isSubmitted || leaderboard) && (!editing || saving)}
                      id="outlined-required"
                      label="Quarter Start Date *"
                      name="quarterStartDate"
                      fullWidth
                      value={
                       new Date(formState?.quarterStartDate).toISOString().slice(0, 10)
                      }
                      onChange={(e) => {
                        setFormState((prevState) => ({
                          ...prevState,
                          quarterStartDate: e.target.value,
                        }));
                      }}
                      type={isFocused || formState?.quarterStartDate ? 'date' : 'text'}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      InputLabelProps={isFocused || formState?.quarterStartDate ? { shrink: true } : {}}

                    />
                  </Grid>
                  <Grid item xs={12} md={6} xl={4}>
                    <TextField
                      disabled={(isSubmitted || leaderboard) && (!editing || saving)}
                      id="outlined-required"
                      label="Quarter End Date *"
                      name="quarterEndDate"
                      fullWidth
                      value={
                        new Date(formState?.quarterEndDate).toISOString().slice(0, 10)
                      }
                      onChange={(e) => {
                        setFormState((prevState) => ({
                          ...prevState,
                          quarterEndDate: e.target.value,
                        }));
                      }}
                      type={isFocused || formState?.quarterEndDate ? 'date' : 'text'}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      InputLabelProps={isFocused || formState?.quarterEndDate ? { shrink: true } : {}}
                    />
                  </Grid>
                </>
              }

              <Grid item xs={12} md={6} xl={4}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-simple-select-autowidth-label">
                    Status *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    name="status"
                    value={formState?.status || leaderboard?.status}
                    disabled={(isSubmitted || leaderboard) && (!editing || saving)}
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        status: e.target.value,
                      }));
                    }}
                    label="Leaderboard Status"
                    sx={{ minHeight: 43 }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
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
              {!isSubmitted && !leaderboard && (
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
                      navigate("/leaderboard-params");
                    }}
                  >
                    Cancel
                  </MDButton>
                </>
              )}
              {(isSubmitted || leaderboard) && !editing && (
                <>
                  {leaderboard?.status !== "Completed" && (
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
                  )}
                  <MDButton
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => {
                      navigate("/leaderboard-params");
                    }}
                  >
                    Back
                  </MDButton>
                </>
              )}
              {(isSubmitted || leaderboard) && editing && (
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

            <Grid item xs={12} md={12} xl={12} mt={2}>
                  <MDBox>
                    <ContestRewards
                      leaderboard={
                        leaderboard != undefined ? leaderboard?._id : leaderboardData?._id
                      }
                    />
                  </MDBox>
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
