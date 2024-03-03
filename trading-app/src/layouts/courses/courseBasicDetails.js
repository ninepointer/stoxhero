import * as React from "react";
import {
  useContext,
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import { userContext } from "../../AuthContext";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useLocation, useNavigate } from "react-router-dom";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import dayjs from "dayjs";
import JoditEditor from "jodit-react";
import UploadImage from "../../assets/images/uploadimage.png";
import UploadVideo from "../../assets/images/uploadvideo.png";
import { apiUrl } from "../../constants/constants";

const CreateCourse = (
  // ref,
  { setActiveStep, activeStep, steps, setCreatedCourse }
) => {
  // console.log("props", props);
  let baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  // const getDetails = useContext(userContext);
  const location = useLocation();
  const id = location?.state?.data;
  const [courseData, setCourseData] = useState(id ? id : "");
  // const [isObjectNew, setIsObjectNew] = useState(id ? true : false);
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  // const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [titlePreviewUrl, setTitlePreviewUrl] = useState("");
  const [titleVideoPreviewUrl, setTitleVideoPreviewUrl] = useState("");
  // const [imagesPreviewUrl, setImagesPreviewUrl] = useState(null);
  // const [imageData, setImageData] = useState(courseData || null);
  const [title, setTitle] = useState(courseData?.courseName || "");
  // const [titleImage, setTitleImage] = useState(null);
  // const [titleVideo, setTitleVideo] = useState(null);
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
  });
  const editor = useRef(null);
  const [file, setFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [fileVid, setFileVid] = useState(null);
  const [value, setValue] = useState(courseData?.courseDescription || "");
  const [created, setCreated] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const queryString = location.search;
  const urlParams = new URLSearchParams(queryString);

  // Get the value of the "mobile" parameter
  const courseId = urlParams.get("id");
  const paramsActiveSteps = urlParams.get("activestep");
  const handleFileChange = (event) => {
    setFileVid(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!fileVid) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("fileVid", fileVid);

    try {
      const response = await axios.post(`${apiUrl}courses/s3upload`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const progress = Math.round((loaded / total) * 100);
          setUploadProgress(progress);
        },
      });
      console.log("File uploaded successfully:", response.data);
      setUploadProgress(200);
      // Reset file input
      setFileVid(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadProgress(-1);
      alert("Error uploading file. Please try again.");
    }
  };

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

      setValue(data?.data?.data?.courseDescription);
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

  console.log("formState", formState, formState?.type);

  async function onSubmit(type) {
    if (courseData) {
      setActiveStep(activeStep + 1);
      return navigate(
        `/coursedetails?id=${courseData?._id}&activestep=${activeStep + 1}`
      );
    }
    setTimeout(() => {
      setCreating(false);
      // setIsSubmitted(true);
    }, 500);
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
    // if (value) {
    //   formData.append("courseDescription", value);
    // }

    const res = await fetch(`${baseUrl}api/v1/courses/info`, {
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
      setCreated(true);
      console.log("response data", data);
      setCreatedCourse(data.data);
      setCourseData(data.data);
      setIsSubmitted(true);
      setActiveStep(activeStep + 1);
      setTimeout(() => {
        setCreating(false);
        setIsSubmitted(true);
      }, 500);
      navigate(
        `/coursedetails?id=${data?.data?._id}&activestep=${activeStep + 1}`
      );
    } else {
      setTimeout(() => {
        setCreating(false);
        setIsSubmitted(false);
      }, 500);
    }
  }

  async function onEdit() {
    setTimeout(() => {
      setCreating(false);
      // setIsSubmitted(true);
    }, 500);
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
    // if (value) {
    //   formData.append("courseDescription", value);
    // }

    const res = await fetch(`${baseUrl}api/v1/courses/${courseId}`, {
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
      // setCreated(true);
      // console.log("response data", data);
      setEditing(true);
      setCreatedCourse(data.data);
      setCourseData(data.data);
      // setIsSubmitted(true);
      // setActiveStep(activeStep + 1);
      // setTimeout(() => {
      //   setCreating(false);
      //   setIsSubmitted(true);
      // }, 500);
      // navigate(`/coursedetails?id=${data?.data?._id}&activestep=${activeStep + 1}`)
    } else {
      setTimeout(() => {
        setCreating(false);
        setIsSubmitted(false);
      }, 500);
    }
  }

  const handleCourseImage = (event) => {
    setFile(event.target.files[0]);
    const file = event.target.files[0];
    // setTitleImage(event.target.files);
    // console.log("Title File:",file)
    // Create a FileReader instance
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
    // setTitleVideo(event.target.files);
    // console.log("Title File:",file)
    // Create a FileReader instance
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

  const [ntitle, setNtitle] = useState("");
  const [content, setContent] = useState("");

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = (ntitle, content) => {
    setTitle(ntitle);
    setContent(content);
    setSuccessSB(true);
  };
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title={ntitle}
      content={content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = (ntitle, content) => {
    setTitle(ntitle);
    setContent(content);
    setErrorSB(true);
  };
  const closeErrorSB = () => setErrorSB(false);

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title={ntitle}
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
                      formState?.courseDurationInMinutes ||
                      courseData?.courseDurationInMinutes
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
                        formState?.maxEnrollments || courseData?.maxEnrollments
                      }
                      fullWidth
                      onChange={(e) => {
                        setFormState((prevState) => ({
                          ...prevState,
                          maxEnrollments: e.target.value,
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
                          onClick={() => {
                            editing ? setEditing(false) : onEdit();
                            // handleButtonClick("create");
                          }}
                        >
                          {editing ? "Edit" : "Edit & Save"}
                        </MDButton>
                      </Grid>

                      <Grid item>
                        <MDButton
                          variant="contained"
                          color="success"
                          size="small"
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
              {!courseData?.courseImage ? (
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
                    {titlePreviewUrl ? (
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
                    ) : (
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
                    )}
                  </Grid>
                </Grid>
              ) : (
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
              )}

              {!courseData?.salesVideo ? (
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
                    {titleVideoPreviewUrl ? (
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
                    ) : (
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
                    )}
                  </Grid>
                </Grid>
              ) : (
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
