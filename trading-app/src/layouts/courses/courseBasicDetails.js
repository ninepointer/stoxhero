import * as React from "react";
import {
  useState,
  useRef,
  useEffect,
} from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import axios from "axios";
import { CircularProgress, FormControlLabel, FormGroup, Checkbox } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useLocation, useNavigate } from "react-router-dom";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import dayjs from "dayjs";
import JoditEditor from "jodit-react";
import UploadImage from "../../assets/images/uploadimage.png";
import UploadVideo from "../../assets/images/uploadvideo.png";
import { apiUrl } from "../../constants/constants";

const CreateCourse = (
  { setActiveStep, activeStep, steps, setCreatedCourse }
) => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.data;
  const [courseData, setCourseData] = useState(id ? id : "");
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [titlePreviewUrl, setTitlePreviewUrl] = useState("");
  const [titleVideoPreviewUrl, setTitleVideoPreviewUrl] = useState("");
  const [formState, setFormState] = useState({
    courseName: courseData?.courseName || "",
    courseLanguages: courseData?.courseLanguages || "",
    courseOverview: courseData?.courseOverview || "",
    tags: courseData?.tags || "",
    category: courseData?.category || "",
    level: courseData?.level || "",
    type: courseData?.type || "",
    courseType: courseData?.courseType || "",
    courseDurationInMinutes: courseData?.courseDurationInMinutes || "",
    courseDescription: courseData?.courseDescription || "",
    meetLink: courseData?.meetLink || "",
    metaTitle: courseData?.metaTitle || "",
    metaDescription: courseData?.metaDescription || "",
    metaKeywords: courseData?.metaKeywords || "",
  });
  const editor = useRef(null);
  const [file, setFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [editClicked, setEditClicked] = useState(false);

  const queryString = location.search;
  const urlParams = new URLSearchParams(queryString);

  // Get the value of the "mobile" parameter
  const courseId = urlParams.get("id");
  const paramsActiveSteps = urlParams.get("activestep");


  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [paramsActiveSteps, courseId]);

  async function fetchCourseData() {
    try {
      const data = await axios.get(`${apiUrl}courses/${courseId}`, {
        withCredentials: true,
      });
      setCourseData(data?.data?.data);

      setFormState({
        ...data?.data?.data,
        courseEndTime: dayjs(data?.data?.data?.courseEndTime),
        courseStartTime: dayjs(data?.data?.data?.courseStartTime),
        registrationEndTime: dayjs(data?.data?.data?.registrationEndTime),
        registrationStartTime: dayjs(data?.data?.data?.registrationStartTime),
      });
      setEditing(true);
    } catch (err) {}
  }

  async function onSubmit(type) {
    if (courseData) {
      setActiveStep(activeStep + 1);
      return navigate(
        `/coursedetails?id=${courseData?._id}&activestep=${activeStep + 1}`
      );
    }
    const formData = new FormData();
    if (file) {
      formData.append("courseImage", file);
    }
    if (videoFile) {
      formData.append("salesVideo", videoFile);
    }

    for (let elem in formState) {
      if (elem !== "courseImage") formData.append(`${elem}`, formState[elem]);
    }

    const res = await fetch(`${apiUrl}courses`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Credentials": true,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.status === 200 || res.status == 201 || data) {
      if (type === "Draft") {
        openSuccessSB("Course Created", data.message);
        setEditing(true);
        navigate(
          `/coursedetails?id=${data?.data?._id}&activestep=${activeStep}`
        );
        return;
      }
      openSuccessSB("Course Created", data.message);
      console.log("response data", data);
      setCreatedCourse(data.data);
      setCourseData(data.data);
      setActiveStep(activeStep + 1);
      navigate(
        `/coursedetails?id=${data?.data?._id}&activestep=${activeStep + 1}`
      );
    } else {
    }
  }

  async function onEdit() {
    const formData = new FormData();
    if (file) {
      formData.append("courseImage", file);
    }
    if (videoFile) {
      formData.append("salesVideo", videoFile);
    }

    for (let elem in formState) {
      if (elem !== "courseImage") formData.append(`${elem}`, formState[elem]);
    }

    const res = await fetch(`${apiUrl}courses/${courseId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Credentials": true,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.status === 200 || res.status == 201 || data) {
      openSuccessSB("Course Edited", data.message);
      setEditing(true);
      setEditClicked(false);
      setCreatedCourse(data.data);
      setCourseData(data.data);
    } else {
    }
  }

  const handleCourseImage = (event) => {
    setFile(event.target.files[0]);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setTitlePreviewUrl(reader.result);
      // console.log("Title Preview Url:",reader.result)
    };
    reader.readAsDataURL(file);
  };

  const handleSalesVideo = (event) => {
    setVideoFile(event.target.files[0]);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setTitleVideoPreviewUrl(reader.result);
      // console.log("Title Preview Url:",reader.result)
    };
    reader.readAsDataURL(file);
  };

  const config = React.useMemo(
    () => ({
      disabled: editing,
      readonly: false,
      enableDragAndDropFileToEditor: false,
      toolbarAdaptive: false,
      toolbarSticky: true,
      addNewLine: false,
      useSearch: false,
      hidePoweredByJodit: true,
    }),
    [editing]
  );

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

  async function editAndSave(){
    if(editing){
      setEditing(false);
      setEditClicked(true);
    } else{
      onEdit();
    }
  }

  return (
    <>
      {isLoading ? (
        <MDBox
          mt={10}
          mb={10}
          display="flex"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress color="info" />
        </MDBox>
      ) : (
        <MDBox
          bgColor="light"
          color="dark"
          mb={1}
          borderRadius={10}
          minHeight="auto"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Grid
            container
            spacing={1}
            xs={12}
            md={12}
            lg={12}
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
          >
            <Grid
              item
              mt={0.5}
              xs={12}
              md={12}
              lg={8}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Grid
                container
                spacing={2}
                xs={12}
                md={12}
                lg={12}
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid item xs={12} md={6} lg={12}>
                  <TextField
                    disabled={editing}
                    id="outlined-required"
                    // label='Course Name *'
                    placeholder="Course Name: e.g Introduction to Stock Market"
                    value={formState?.courseName}
                    fullWidth
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        courseName: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} lg={12}>
                  <TextField
                    disabled={editing}
                    id="outlined-required"
                    // label='Course Overview *'
                    placeholder="Course Overview: e.g This course will cover basic of stock market"
                    value={formState?.courseOverview}
                    fullWidth
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        courseOverview: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    disabled={editing}
                    id="outlined-required"
                    // label='Course Name *'
                    placeholder="Course Language: e.g Introduction to Stock Market"
                    value={formState?.courseLanguages}
                    fullWidth
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        courseLanguages: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    disabled={editing}
                    id="outlined-required"
                    // label='Course Name *'
                    placeholder="Tags: e.g Live Simulation, Live Trading"
                    value={formState?.tags}
                    fullWidth
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        tags: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">
                      Category *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      disabled={editing}
                      value={formState?.category}
                      placeholder="Course Name: e.g Introduction to Stock Market"
                      onChange={(e) => {
                        setFormState((prevState) => ({
                          ...prevState,
                          category: e.target.value,
                        }));
                      }}
                      label="Category *"
                      sx={{
                        minHeight: 43,
                      }}
                    >
                      <MenuItem value="Trading">Trading</MenuItem>
                      <MenuItem value="Investing">Investing</MenuItem>
                      <MenuItem value="Mutual Funds">Mutual Funds</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">
                      Level *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      disabled={editing}
                      value={formState?.level}
                      onChange={(e) => {
                        setFormState((prevState) => ({
                          ...prevState,
                          level: e.target.value,
                        }));
                      }}
                      label="Level *"
                      sx={{
                        minHeight: 43,
                      }}
                    >
                      <MenuItem value="Beginner">Beginner</MenuItem>
                      <MenuItem value="Intermediate">Intermediate</MenuItem>
                      <MenuItem value="Advanced">Advanced</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">
                      Type *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      disabled={editing}
                      value={formState?.type}
                      onChange={(e) => {
                        setFormState((prevState) => ({
                          ...prevState,
                          type: e.target.value,
                        }));

                        e.target.value === "Workshop" &&
                          setFormState((prevState) => ({
                            ...prevState,
                            courseType: "Live",
                          }));
                      }}
                      label="Type *"
                      sx={{
                        minHeight: 43,
                      }}
                    >
                      <MenuItem value="Course">Course</MenuItem>
                      <MenuItem value="Workshop">Workshop</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-autowidth-label">
                      Course Type *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      disabled={editing || formState?.type === "Workshop"}
                      value={
                        formState?.type === "Workshop"
                          ? "Live"
                          : formState?.courseType
                      }
                      onChange={(e) => {
                        setFormState((prevState) => ({
                          ...prevState,
                          courseType: e.target.value,
                        }));
                      }}
                      label="Course Type *"
                      sx={{
                        minHeight: 43,
                      }}
                    >
                      <MenuItem value="Live">Live</MenuItem>
                      <MenuItem value="Recorded">Recorded</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    disabled={editing}
                    id="outlined-required"
                    type="number"
                    placeholder="Duration in minutes"
                    value={
                      formState?.courseDurationInMinutes===0 ? '' : formState?.courseDurationInMinutes
                    }
                    fullWidth
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        courseDurationInMinutes: Math.abs(e.target.value),
                      }));
                    }}
                  />
                </Grid>

                {formState?.courseType === "Live" && (
                  <Grid item xs={12} md={6} lg={6}>
                    <TextField
                      disabled={editing}
                      id="outlined-required"
                      label="Max Enrollments *"
                      value={
                        formState?.maxEnrolments || courseData?.maxEnrolments
                      }
                      fullWidth
                      onChange={(e) => {
                        setFormState((prevState) => ({
                          ...prevState,
                          maxEnrolments: e.target.value,
                        }));
                      }}
                    />
                  </Grid>
                )}

                {formState?.courseType === "Live" && (
                  <Grid item xs={12} md={6} lg={6} mt={-1}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["MobileDateTimePicker"]}>
                        <DemoItem>
                          <MobileDateTimePicker
                            label="Registration Start Time"
                            disabled={editing}
                            value={
                              formState?.registrationStartTime ||
                              dayjs(courseData?.registrationStartTime)
                            }
                            onChange={(newValue) => {
                              if (newValue && newValue.isValid()) {
                                setFormState((prevState) => ({
                                  ...prevState,
                                  registrationStartTime: newValue,
                                }));
                              }
                            }}
                            minDateTime={null}
                            sx={{ width: "100%" }}
                          />
                        </DemoItem>
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                )}

                {formState?.courseType === "Live" && (
                  <Grid item xs={12} md={6} lg={6} mt={-1}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["MobileDateTimePicker"]}>
                        <DemoItem>
                          <MobileDateTimePicker
                            label="Registration End Time"
                            disabled={editing}
                            value={
                              formState?.registrationEndTime ||
                              dayjs(courseData?.registrationEndTime)
                            }
                            onChange={(newValue) => {
                              if (newValue && newValue.isValid()) {
                                setFormState((prevState) => ({
                                  ...prevState,
                                  registrationEndTime: newValue,
                                }));
                              }
                            }}
                            minDateTime={null}
                            sx={{ width: "100%" }}
                          />
                        </DemoItem>
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                )}

                {formState?.courseType === "Live" && (
                  <Grid item xs={12} md={6} lg={6} mt={-1}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["MobileDateTimePicker"]}>
                        <DemoItem>
                          <MobileDateTimePicker
                            label="Course Start Time"
                            disabled={editing}
                            value={
                              formState?.courseStartTime ||
                              dayjs(courseData?.courseStartTime)
                            }
                            onChange={(newValue) => {
                              if (newValue && newValue.isValid()) {
                                setFormState((prevState) => ({
                                  ...prevState,
                                  courseStartTime: newValue,
                                }));
                              }
                            }}
                            minDateTime={null}
                            sx={{ width: "100%" }}
                          />
                        </DemoItem>
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                )}

                {formState?.courseType === "Live" && (
                  <Grid item xs={12} md={6} lg={6} mt={-1}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["MobileDateTimePicker"]}>
                        <DemoItem>
                          <MobileDateTimePicker
                            label="Course End Time"
                            disabled={editing}
                            value={
                              formState?.courseEndTime ||
                              dayjs(courseData?.courseEndTime)
                            }
                            onChange={(newValue) => {
                              if (newValue && newValue.isValid()) {
                                setFormState((prevState) => ({
                                  ...prevState,
                                  courseEndTime: newValue,
                                }));
                              }
                            }}
                            minDateTime={null}
                            sx={{ width: "100%" }}
                          />
                        </DemoItem>
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                )}

                  <Grid item xs={12} md={6} xl={6}>
                    <MDButton
                      variant="outlined"
                      style={{ fontSize: 10 }}
                      fullWidth
                      color={
                        courseData?.courseImage && !file
                          ? "warning"
                          : (courseData?.courseImage && file) || file
                            ? "error"
                            : "success"
                      }
                      component="label"
                    >
                      Upload Image(1080X720)
                      <input
                          type="file"
                          onChange={handleCourseImage}
                          disabled={editing}
                          accept="image/*"
                          style={{ display: "none", cursor: "pointer" }}
                          id="image-upload"
                        />
                    </MDButton>
                  </Grid>

                  <Grid item xs={12} md={6} xl={6}>
                    <MDButton
                      variant="outlined"
                      style={{ fontSize: 10 }}
                      fullWidth
                      color={
                        courseData?.salesVideo && !videoFile
                          ? "warning"
                          : (courseData?.salesVideo && videoFile) || videoFile
                            ? "error"
                            : "success"
                      }
                      component="label"
                    >
                      Upload Sales Video(1080X720)
                      <input
                          type="file"
                          onChange={handleSalesVideo}
                          accept="*"
                          disabled={editing}
                          style={{ display: "none", cursor: "pointer" }}
                          id="video-upload"
                        />
                    </MDButton>
                  </Grid>

                  <Grid item xs={12} md={6} xl={6}>
                    <FormGroup>
                      <FormControlLabel
                        checked={
                          courseData?.bestSeller !== undefined &&
                            !editing &&
                            formState?.bestSeller === undefined
                            ? courseData?.bestSeller
                            : formState?.bestSeller
                        }
                        disabled={editing}
                        onChange={(e) => {
                          // console.log("checkbox", e.target.checked, e.target.value);
                          setFormState((prevState) => ({
                            ...prevState,
                            bestSeller: e.target.checked,
                          }));
                        }}
                        control={<Checkbox />}
                        label="Best Seller"
                      />
                    </FormGroup>
                  </Grid>

                  {formState?.type=== 'Workshop' && <Grid item xs={12} md={6} lg={6}>
                    <TextField
                      disabled={editing}
                      id="outlined-required"
                      type="text"
                      placeholder="Meet Link"
                      value={
                        formState?.meetLink
                      }
                      fullWidth
                      onChange={(e) => {
                        setFormState((prevState) => ({
                          ...prevState,
                          meetLink: (e.target.value),
                        }));
                      }}
                    />
                  </Grid>}

                  <Grid item xs={12} md={6} lg={6}>
                    <TextField
                      disabled={editing}
                      id="outlined-required"
                      type="text"
                      placeholder="Meta Title"
                      value={
                        formState?.metaTitle
                      }
                      fullWidth
                      onChange={(e) => {
                        setFormState((prevState) => ({
                          ...prevState,
                          metaTitle: (e.target.value),
                        }));
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
                    <TextField
                      disabled={editing}
                      id="outlined-required"
                      type="text"
                      placeholder="Meta Description"
                      value={
                        formState?.metaDescription
                      }
                      fullWidth
                      onChange={(e) => {
                        setFormState((prevState) => ({
                          ...prevState,
                          metaDescription: (e.target.value),
                        }));
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
                    <TextField
                      disabled={editing}
                      id="outlined-required"
                      type="text"
                      placeholder="Meta Keywords"
                      value={
                        formState?.metaKeywords
                      }
                      fullWidth
                      onChange={(e) => {
                        setFormState((prevState) => ({
                          ...prevState,
                          metaKeywords: (e.target.value),
                        }));
                      }}
                    />
                  </Grid>

                <Grid item xs={12} md={12} lg={12}>
                  <JoditEditor
                    ref={editor}
                    config={config}
                    value={formState?.courseDescription}
                    onChange={(newContent) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        courseDescription: newContent,
                      }))
                    }
                    disabled={true}
                    style={{ minWidth: "100%" }}
                  />
                </Grid>

                <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={2}
                  mt={2}
                >
                  {activeStep !== steps.length - 1 && (
                    <>
                      <Grid item>
                        <MDButton
                          variant="contained"
                          color="warning"
                          size="small"
                          onClick={() => onSubmit("Draft")}
                        >
                          Save as Draft
                        </MDButton>
                      </Grid>

                      <Grid item>
                        <MDButton
                          variant="contained"
                          color="success"
                          size="small"
                          disabled={!courseData}
                          onClick={editAndSave}
                          
                        >
                          {editing ? "Edit" : "Edit & Save"}
                        </MDButton>
                      </Grid>

                      <Grid item>
                        <MDButton
                          variant="contained"
                          color="success"
                          size="small"
                          disabled={editClicked}
                          onClick={() => {
                            onSubmit("Submit");
                            // handleButtonClick("create");
                          }}
                        >
                          Save & Continue
                        </MDButton>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              md={12}
              lg={4}
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              {titlePreviewUrl ? (
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  style={{ minWidth: "100%" }}
                >
                  <Grid
                    container
                    xs={12}
                    md={12}
                    lg={12}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid
                      item
                      xs={12}
                      md={12}
                      lg={12}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <MDTypography variant="button">Course Image</MDTypography>
                    </Grid>
                      <Grid
                        item
                        mt={0.5}
                        xs={12}
                        md={12}
                        lg={12}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{ maxWidth: "100%", border: "1px dashed #ccc" }}
                      >
                        <img
                          src={titlePreviewUrl}
                          alt="Preview"
                          style={{ maxWidth: "100%" }}
                        />
                      </Grid>
                  </Grid>
                </Grid>
                ) : (
                  courseData?.courseImage ?
                    <Grid
                      item
                      xs={12}
                      md={12}
                      lg={12}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid
                        container
                        mt={0.5}
                        xs={12}
                        md={12}
                        lg={12}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{ maxWidth: "100%", border: "1px dotted #ccc" }}
                      >
                        <img
                          src={courseData?.courseImage}
                          alt="Preview"
                          style={{ maxWidth: "100%" }}
                        />
                      </Grid>
                    </Grid>
                    :
                    <Grid
                      item
                      xs={12}
                      md={12}
                      lg={12}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      style={{ minWidth: "100%" }}
                    >
                      <Grid
                        container
                        xs={12}
                        md={12}
                        lg={12}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid
                          item
                          xs={12}
                          md={12}
                          lg={12}
                          display="flex"
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <Grid
                            item
                            mt={0.5}
                            xs={12}
                            md={12}
                            lg={12}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            style={{
                              maxWidth: "100%",
                              minHeight: "220px",
                              border: "1px dashed #ccc",
                            }}
                          >
                            <input
                              type="file"
                              onChange={handleCourseImage}
                              disabled={editing}
                              accept="image/*"
                              style={{ display: "none", cursor: "pointer" }}
                              id="image-upload"
                            />
                            <label
                              htmlFor="image-upload"
                              style={{ cursor: "pointer" }}
                            >
                              <Grid
                                container
                                xs={12}
                                md={12}
                                lg={12}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Grid
                                  item
                                  xs={12}
                                  md={12}
                                  lg={12}
                                  display="flex"
                                  justifyContent="center"
                                  alignItems="center"
                                >
                                  <img src={UploadImage} width="20px" />
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  md={12}
                                  lg={12}
                                  display="flex"
                                  justifyContent="center"
                                  alignItems="center"
                                >
                                  <MDTypography variant="caption" component="span">
                                    {!formState?.courseImage?.name
                                      ? "Upload Image"
                                      : "Upload Another Image"}
                                  </MDTypography>
                                </Grid>
                              </Grid>
                            </label>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                )}

                {titleVideoPreviewUrl ? (
                  <Grid
                    item
                    mt={1}
                    xs={12}
                    md={12}
                    lg={12}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ minWidth: "100%" }}
                  >
                    <Grid
                      container
                      xs={12}
                      md={12}
                      lg={12}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        <MDTypography variant="button">Sales Video</MDTypography>
                      </Grid>

                      <Grid
                        item
                        mt={0.5}
                        xs={12}
                        md={12}
                        lg={12}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{ maxWidth: "100%", border: "1px dashed #ccc" }}
                      >
                        <video
                          src={titleVideoPreviewUrl}
                          alt="Preview"
                          style={{ maxWidth: "100%" }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (

                  courseData?.salesVideo ?
                    <Grid
                      item
                      xs={12}
                      md={12}
                      lg={12}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid
                        container
                        mt={0.5}
                        xs={12}
                        md={12}
                        lg={12}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{ maxWidth: "100%", border: "1px dotted #ccc" }}
                      >
                        <video
                          controls // This adds controls like play, pause, and volume.
                          src={courseData?.salesVideo} // Set the video source dynamically.
                          alt="Preview" // Provide alternative text for accessibility.
                          style={{ maxWidth: "100%" }} // Ensure the video doesn't exceed container width.
                        />
                      </Grid>
                    </Grid>
                    :
                    <Grid
                      item
                      mt={1}
                      xs={12}
                      md={12}
                      lg={12}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      style={{ minWidth: "100%" }}
                    >
                      <Grid
                        container
                        xs={12}
                        md={12}
                        lg={12}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid
                          item
                          xs={12}
                          md={12}
                          lg={12}
                          display="flex"
                          justifyContent="flex-start"
                          alignItems="center"
                        >

                          <Grid
                            item
                            mt={0.5}
                            xs={12}
                            md={12}
                            lg={12}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            style={{
                              maxWidth: "100%",
                              minHeight: "220px",
                              border: "1px dashed #ccc",
                            }}
                          >
                            <input
                              type="file"
                              onChange={handleSalesVideo}
                              accept="*"
                              disabled={editing}
                              style={{ display: "none", cursor: "pointer" }}
                              id="video-upload"
                            />
                            <label
                              htmlFor="video-upload"
                              style={{ cursor: "pointer" }}
                            >
                              <Grid
                                container
                                xs={12}
                                md={12}
                                lg={12}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Grid
                                  item
                                  xs={12}
                                  md={12}
                                  lg={12}
                                  display="flex"
                                  justifyContent="center"
                                  alignItems="center"
                                >
                                  <img src={UploadVideo} width="20px" />
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  md={12}
                                  lg={12}
                                  display="flex"
                                  justifyContent="center"
                                  alignItems="center"
                                >
                                  <MDTypography variant="caption" component="span">
                                    {!formState?.salesVideo?.name
                                      ? "Upload Video"
                                      : "Upload Another Video"}
                                  </MDTypography>
                                </Grid>
                              </Grid>
                            </label>
                          </Grid>

                        </Grid>
                      </Grid>
                    </Grid>
                )}
            </Grid>
          </Grid>
          {renderSuccessSB}
          {renderErrorSB}
        </MDBox>
      )}
    </>
  );
};
export default CreateCourse;
