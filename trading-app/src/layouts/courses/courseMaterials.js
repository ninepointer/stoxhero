import * as React from "react";
import { useContext, useState, useRef } from "react";
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

function CreateCourse() {
  let baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const getDetails = useContext(userContext);
  const location = useLocation();
  const id = location?.state?.data;
  const [courseData, setCourseData] = useState(id ? id : "");
  const [isObjectNew, setIsObjectNew] = useState(id ? true : false);
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [titlePreviewUrl, setTitlePreviewUrl] = useState("");
  const [imagesPreviewUrl, setImagesPreviewUrl] = useState(null);
  const [imageData, setImageData] = useState(courseData || null);
  const [title, setTitle] = useState(courseData?.courseName || "");
  const [titleImage, setTitleImage] = useState(null);
  const [formState, setFormState] = useState({
    courseName: id?.courseName || "",
    courseOverview: id?.courseOverview || "",
    courseLanguages: id?.courseLanguages || "",
    courseOverview: id?.courseOverview || "",
    courseOverview: id?.courseOverview || "",
  });
  const editor = useRef(null);
  const [file, setFile] = useState(null);
  const [value, setValue] = useState(courseData?.courseDescription || "");

  async function onSubmit(e, formState) {
    e.preventDefault();

    setCreating(true);

    if (!formState?.collegeName || !formState?.zone) {
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
    const { collegeName, zone } = formState;
    const res = await fetch(`${baseUrl}api/v1/college`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        collegeName,
        zone,
      }),
    });

    const data = await res.json();

    if (res.status === 200 || data) {
      openSuccessSB("Course Created", data.message);
      setIsSubmitted(true);
      setTimeout(() => {
        setCreating(false);
        setIsSubmitted(true);
      }, 500);
    } else {
      setTimeout(() => {
        setCreating(false);
        setIsSubmitted(false);
      }, 500);
    }
  }

  async function onEdit(e, formState) {
    e.preventDefault();
    setSaving(true);
    if (!formState?.collegeName || !formState?.zone) {
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
    const { collegeName, zone } = formState;
    const res = await fetch(`${baseUrl}api/v1/college/${id?._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        collegeName,
        zone,
      }),
    });

    const data = await res.json();
    const updatedData = data?.data;
    if (updatedData || res.status === 200) {
      openSuccessSB(
        "College Edited",
        updatedData.collegeName + " | " + updatedData.zone
      );
      setTimeout(() => {
        setSaving(false);
        setEditing(false);
      }, 500);
    } else {
      openErrorSB("Error", "data.error");
    }
  }

  const handleCourseImage = (event) => {
    const file = event.target.files[0];
    setTitleImage(event.target.files);
    // console.log("Title File:",file)
    // Create a FileReader instance
    const reader = new FileReader();
    reader.onload = () => {
      setTitlePreviewUrl(reader.result);
      // console.log("Title Preview Url:",reader.result)
    };
    reader.readAsDataURL(file);
  };

  const config = React.useMemo(
    () => ({
      disabled: (isSubmitted || id) && (!editing || saving),
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
                    disabled={(isSubmitted || id) && (!editing || saving)}
                    id="outlined-required"
                    // label='Course Name *'
                    placeholder="Course Name: e.g Introduction to Stock Market"
                    value={formState?.courseName || courseData?.courseName}
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
                    disabled={(isSubmitted || id) && (!editing || saving)}
                    id="outlined-required"
                    // label='Course Overview *'
                    placeholder="Course Overview: e.g This course will cover basic of stock market"
                    value={
                      formState?.courseOverview || courseData?.courseOverview
                    }
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
                    disabled={(isSubmitted || id) && (!editing || saving)}
                    id="outlined-required"
                    // label='Course Name *'
                    placeholder="Course Language: e.g Introduction to Stock Market"
                    value={
                      formState?.courseLanguages || courseData?.courseLanguages
                    }
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
                    disabled={(isSubmitted || id) && (!editing || saving)}
                    id="outlined-required"
                    // label='Course Name *'
                    placeholder="Tags: e.g Live Simulation, Live Trading"
                    value={formState?.tags || courseData?.tags}
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
                      disabled={(isSubmitted || id) && (!editing || saving)}
                      value={formState?.category || courseData?.category}
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
                      disabled={(isSubmitted || id) && (!editing || saving)}
                      value={formState?.level || courseData?.level}
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
                      Course Type *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      disabled={(isSubmitted || id) && (!editing || saving)}
                      value={formState?.courseType || courseData?.courseType}
                      onChange={(e) => {
                        setFormState((prevState) => ({
                          ...prevState,
                          courseType: e.target.value,
                        }));
                      }}
                      label="Level *"
                      sx={{
                        minHeight: 43,
                      }}
                    >
                      <MenuItem value="Live">Live</MenuItem>
                      <MenuItem value="Recorded">Recorded</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {formState?.courseType === "Live" && (
                  <Grid item xs={12} md={6} lg={6}>
                    <TextField
                      disabled={(isSubmitted || id) && (!editing || saving)}
                      id="outlined-required"
                      label="Max Enrolments *"
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
                            disabled={
                              (isSubmitted || courseData) &&
                              (!editing || saving)
                            }
                            value={
                              formState?.registrationStartTime || courseData
                                ? dayjs(courseData?.registrationStartTime)
                                : null
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
                            disabled={
                              (isSubmitted || courseData) &&
                              (!editing || saving)
                            }
                            value={
                              formState?.registrationEndTime || courseData
                                ? dayjs(courseData?.registrationEndTime)
                                : null
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
                            disabled={
                              (isSubmitted || courseData) &&
                              (!editing || saving)
                            }
                            value={
                              formState?.courseStartTime || courseData
                                ? dayjs(courseData?.courseStartTime)
                                : null
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
                            disabled={
                              (isSubmitted || courseData) &&
                              (!editing || saving)
                            }
                            value={
                              formState?.courseEndTime || courseData
                                ? dayjs(courseData?.courseEndTime)
                                : null
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
                    value={value}
                    onChange={(newContent) => setValue(newContent)}
                    disabled={true}
                    style={{ minWidth: "100%" }}
                  />
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
              {!courseData ? (
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
                      src={courseData?.courseImage?.url}
                      alt="Preview"
                      style={{ maxWidth: "100%" }}
                    />
                  </Grid>
                </Grid>
              )}

              {!courseData ? (
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
                          accept="image/*"
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
                                {!formState?.courseImage?.name
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
                    <img
                      src={courseData?.courseImage?.url}
                      alt="Preview"
                      style={{ maxWidth: "100%" }}
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
}
export default CreateCourse;
