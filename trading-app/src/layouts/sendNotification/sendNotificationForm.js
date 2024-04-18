import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
// import { useForm } from "react-hook-form";
// import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  formLabelClasses,
} from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useNavigate, useLocation } from "react-router-dom";
import RegisteredUsers from "./data/registeredUsers";
// import AllowedUsers from './data/notifyUsers';
import { IoMdAddCircle } from "react-icons/io";
import OutlinedInput from "@mui/material/OutlinedInput";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import { apiUrl } from "../../constants/constants";
import moment from "moment";

const CustomAutocomplete = styled(Autocomplete)`
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
  const sendNotification = location?.state?.data;
  const [isSubmitted, setIsSubmitted] = useState(false);
  let baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";
  const [isLoading, setIsLoading] = useState(sendNotification ? true : false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const [newObjectId, setNewObjectId] = useState("");
  const [sendNotificationData, setSendNotification] = useState([]);
  const [notification, setNotification] = useState([]);
  const [image, setImage] = useState(null);
  const [csvUpload, setCsvUpload] = useState(null);
  const [previewUrl, setPreviewUrl] = useState([]);
  const [previousNotifications, setPreviousNotifications] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const [formState, setFormState] = useState({
    title: "" || sendNotification?.title,
    body: "" || sendNotification?.body,
    notificationImage: "" || sendNotification?.mediaUrl,
    notificationGroup: {
      id: "" || sendNotification?.notificationGroup?._id,
      name: "" || sendNotification?.notificationGroup?.notificationGroupName,
    },
    actions: "" || sendNotification?.actions,
    external: false || sendNotification?.external,
  });

  useEffect(() => {
    axios
      .get(`${baseUrl}api/v1/notificationgroup/activegroups`, {
        withCredentials: true,
      })
      .then((res) => {
        // console.log("TestZone Portfolios :", res?.data?.data)
        setNotification(res?.data?.data);
      })
      .catch((err) => {
        return new Error(err);
      });
  }, []);

  const getPreviousNotifications = async (id) => {
    if(id){
      const res = await axios.get(
        `${baseUrl}api/v1/notificationgroup/${id}/previousnotifications`,
        { withCredentials: true }
      );
      setPreviousNotifications(res.data.data);  
    }
  };

  // console.log("College:", collegeSelectedOption)
  const handleGroupChange = (event) => {
    const {
      target: { value },
    } = event;
    let notificationId = notification?.filter((elem) => {
      return elem.notificationGroupName === value;
    });
    getPreviousNotifications(notificationId[0]?._id);
    setFormState((prevState) => ({
      ...prevState,
      notificationGroup: {
        ...prevState.notificationGroup,
        id: notificationId[0]?._id,
        name: notificationId[0]?.notificationGroupName,
      },
    }));
    // console.log("portfolioId", portfolioId, formState)
  };

  const handleImage = (event) => {
    const file = event.target.files[0];
    setImage(event.target.files);
    // console.log("Title File:",file)
    // Create a FileReader instance
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      // console.log("Title Preview Url:",reader.result)
    };
    reader.readAsDataURL(file);
  };

  const handleCsv = (event) => {
    setCsvUpload(event.target.files);
  };

  async function onSubmit(e, formState) {
    e.preventDefault();

    if (!formState.title || !formState.body) {
      setTimeout(() => {
        setCreating(false);
        setIsSubmitted(false);
      }, 500);
      return openErrorSB(
        "Missing Field",
        "Please fill all the mandatory fields"
      );
    }

    setTimeout(() => {
      setCreating(false);
      setIsSubmitted(true);
    }, 500);
    const { title, body, notificationGroup, actions, external } = formState;
    const formData = new FormData();
    if (image) {
      formData.append("notificationImage", image[0]);
    }
    if (csvUpload) {
      formData.append("csvFile", csvUpload[0]);
    }
    formData.append("title", title);
    formData.append("body", body);
    formData.append("external", external);
    if (actions) {
      formData.append("actions", actions);
    }
    setIsSending(true);
    const res = await fetch(
      `${baseUrl}api/v1/push/group/${notificationGroup?.id || 'csv'}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          // "content-type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        body: formData,
      }
    );

    const data = await res.json();
    setIsSending(false);
    console.log(data, res.status);
    if (res.status != 200) {
      setTimeout(() => {
        setCreating(false);
        setIsSubmitted(false);
      }, 500);
      openErrorSB("Notifications not sent", data?.message);
    } else {
      openSuccessSB("Group Notifications sent", data?.message);
      console.log("data hai ye", formState?.notificationGroup?.id);
      await getPreviousNotifications(formState?.notificationGroup?.id);
      setNewObjectId(data?.data?._id);
      setIsSubmitted(true);
      setSendNotification(data?.data);
      setTimeout(() => {
        setCreating(false);
        setIsSubmitted(true);
      }, 500);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!formState[name]?.includes(e.target.value)) {
      setFormState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const date = new Date(sendNotification?.contestStartTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = `${year}${month}${day}`;
  const contestFor = sendNotification?.contestFor;
  const link = contestFor === "College" ? "collegecontest" : "";
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
              Fill Notification Details
            </MDTypography>
          </MDBox>

          <Grid
            container
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Grid
              container
              spacing={2}
              mt={0.5}
              mb={0}
              xs={12}
              md={12}
              xl={9}
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-start"
            >
              <Grid item xs={12} md={6} xl={3}>
                <TextField
                  disabled={
                    (isSubmitted || sendNotification) && (!editing || saving)
                  }
                  id="outlined-required"
                  label="Title *"
                  name="title"
                  fullWidth
                  defaultValue={
                    editing ? formState?.title : sendNotification?.title
                  }
                  onChange={(e) => {
                    setFormState((prevState) => ({
                      ...prevState,
                      title: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={9}>
                <TextField
                  disabled={
                    (isSubmitted || sendNotification) && (!editing || saving)
                  }
                  id="outlined-required"
                  label="Body *"
                  name="body"
                  multiline
                  maxRows={4}
                  fullWidth
                  defaultValue={
                    editing ? formState?.body : sendNotification?.body
                  }
                  onChange={(e) => {
                    setFormState((prevState) => ({
                      ...prevState,
                      body: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={3}>
                <MDButton
                  variant="outlined"
                  style={{
                    fontSize: 10,
                    color: "black",
                    border: "1px black solid",
                  }}
                  fullWidth
                  component="label"
                >
                  Upload Image
                  <input
                    hidden
                    // disabled={((imageData || prevData) && (!editing))}
                    accept="image/*"
                    type="file"
                    // onChange={(e)=>{setTitleImage(e.target.files)}}
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        notificationImage: e.target.files[0],
                      }));
                      handleImage(e);
                    }}
                  />
                </MDButton>
              </Grid>

              <Grid item xs={12} md={6} xl={3}>
                <TextField
                  disabled
                  id="outlined-required"
                  // label='Selected Carousel Image'
                  fullWidth
                  // defaultValue={portfolioData?.portfolioName}
                  value={
                    sendNotification
                      ? sendNotification?.mediaUrl.split("/")[6]
                      : formState?.notificationImage?.name
                      ? formState?.notificationImage?.name
                      : "No Image Uploaded"
                  }
                />
              </Grid>

              <Grid item xs={12} md={6} xl={3}>
                <MDButton
                  variant="outlined"
                  style={{
                    fontSize: 10,
                    color: "black",
                    border: "1px black solid",
                  }}
                  fullWidth
                  component="label"
                >
                  Upload CSV
                  <input
                    hidden
                    // disabled={((imageData || prevData) && (!editing))}
                    // accept="image/*"
                    type="file"
                    // onChange={(e)=>{setTitleImage(e.target.files)}}
                    onChange={(e) => {
                      handleCsv(e);
                    }}
                  />
                </MDButton>
              </Grid>

              <Grid item xs={12} md={6} xl={3}>
                <TextField
                  disabled
                  id="outlined-required"
                  // label='Selected Carousel Image'
                  fullWidth
                  // defaultValue={portfolioData?.portfolioName}
                  value={
                       csvUpload?.[0]?.name
                      || "No CSV Uploaded"
                  }
                />
              </Grid>

              {!csvUpload ? <Grid item xs={12} md={6} xl={4}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-multiple-name-label">
                    Notification Group
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    name="notificationGroup"
                    disabled={
                      (isSubmitted || sendNotification) && (!editing || saving)
                    }
                    value={
                      formState?.notificationGroup?.name ||
                      sendNotificationData?.notificationGroup
                        ?.notificationGroupName ||
                      sendNotification?.notificationGroup?.notificationGroupName
                    }
                    onChange={(event) => {
                      handleGroupChange(event);
                    }}
                    input={<OutlinedInput label="Portfolio" />}
                    sx={{ minHeight: 45 }}
                    MenuProps={MenuProps}
                  >
                    {notification?.map((elem) => (
                      <MenuItem
                        key={elem?.notificationGroupName}
                        value={elem?.notificationGroupName}
                      >
                        {elem.notificationGroupName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> : <></>}

              <Grid item xs={12} md={6} xl={4}>
                <FormGroup>
                  <FormControlLabel
                    checked={
                      sendNotification?.external !== undefined &&
                      !editing &&
                      formState?.external === undefined
                        ? sendNotification?.external
                        : formState?.external
                    }
                    disabled={
                      (isSubmitted || sendNotification) && (!editing || saving)
                    }
                    control={<Checkbox />}
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        actions: "",
                      }));
                      setFormState((prevState) => ({
                        ...prevState,
                        external: e.target.checked,
                      }));
                    }}
                    label="External Link"
                  />
                </FormGroup>
              </Grid>

              {!formState?.external ? (
                <Grid item xs={12} md={6} xl={4}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-multiple-name-label">Route</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      name="route"
                      disabled={
                        (isSubmitted || sendNotification) &&
                        (!editing || saving)
                      }
                      // defaultValue={id ? portfolios?.portfolio : ''}
                      value={formState?.actions}
                      // onChange={handleTypeChange}
                      onChange={(e) => {
                        setFormState((prevState) => ({
                          ...prevState,
                          actions: e.target.value,
                        }));
                      }}
                      input={<OutlinedInput label="TestZone For" />}
                      sx={{ minHeight: 45 }}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value="home">home</MenuItem>
                      <MenuItem value="wallet">wallet</MenuItem>
                      <MenuItem value="market">market</MenuItem>
                      <MenuItem value="marginxs">marginxs</MenuItem>
                      <MenuItem value="tenxtrading">tenxtrading</MenuItem>
                      <MenuItem value="testzone">testzone</MenuItem>
                      <MenuItem value="collegetestzone">
                        collegetestzone
                      </MenuItem>
                      <MenuItem value="portfolio">portfolio</MenuItem>
                      <MenuItem value="internship">internship</MenuItem>
                      <MenuItem value="marketguru">marketguru</MenuItem>
                      <MenuItem value="tutorials">tutorials</MenuItem>
                      <MenuItem value="profile">profile</MenuItem>
                      <MenuItem value="referrals">referrals</MenuItem>
                      <MenuItem value="faqs">faqs</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              ) : (
                <Grid item xs={12} md={6} xl={6}>
                  <TextField
                    disabled={
                      (isSubmitted || sendNotification) && (!editing || saving)
                    }
                    id="outlined-required"
                    label="External Link *"
                    name="externalLink"
                    fullWidth
                    value={formState?.actions}
                    // defaultValue={editing ? formState?.title : sendNotification?.actions}
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        actions: e.target.value,
                      }));
                    }}
                  />
                </Grid>
              )}
            </Grid>

            <Grid container spacing={1} mt={0.5} mb={0} xs={12} md={3} xl={3}>
              <Grid item xs={12} md={6} lg={12}>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    style={{
                      height: "200px",
                      width: "250px",
                      borderRadius: "5px",
                      border: "1px #ced4da solid",
                    }}
                  />
                ) : (
                  <img
                    src={image}
                    style={{
                      height: "200px",
                      width: "250px",
                      borderRadius: "5px",
                      border: "1px #ced4da solid",
                    }}
                  />
                )}
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
              {
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
                    {creating || isSending ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Send"
                    )}
                  </MDButton>
                  <MDButton
                    variant="contained"
                    color="error"
                    size="small"
                    disabled={creating}
                    onClick={() => {
                      navigate("/tenxdashboard");
                    }}
                  >
                    Cancel
                  </MDButton>
                </>
              }
            </Grid>
            <>
              <Grid xl={12}>
                {previousNotifications?.length > 0 && (
                  <MDTypography>Previous Notifications</MDTypography>
                )}
                {previousNotifications?.map((item) => {
                  return (
                    <>
                      <Grid xl={12}>
                        <MDBox
                          display="flex"
                          justifyContent="space-between"
                          style={{
                            padding: "12px",
                            marginBottom: "12px",
                            padding: "12px",
                            borderRadius: "16px",
                            boxShadow: "0px 4px 6px -2px rgba(0, 0, 0, 0.5)",
                          }}
                        >
                          <MDBox>
                            <MDTypography fontSize={16}>
                              Title: {item?.title}
                            </MDTypography>
                            <MDTypography fontSize={14}>
                              Body:{item?.body}
                            </MDTypography>
                            <MDTypography fontSize={12}>
                              Notification Date:
                              {moment(item?.createdOn).format(
                                "DD-MM-YY hh:mm a"
                              )}
                            </MDTypography>
                            {/* <MDButton>Send Again</MDButton> */}
                          </MDBox>
                          <MDBox>
                            {item?.mediaUrl && (
                              <img
                                width="200px"
                                height="100px"
                                src={item?.mediaUrl}
                              />
                            )}
                          </MDBox>
                        </MDBox>
                      </Grid>
                    </>
                  );
                })}
              </Grid>
            </>
          </Grid>

          {renderSuccessSB}
          {renderErrorSB}
        </MDBox>
      )}
    </>
  );
}
export default Index;
