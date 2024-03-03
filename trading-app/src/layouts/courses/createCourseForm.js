import * as React from "react";
import { useEffect, useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import {
  Grid,
  Card,
  CardContent,
  CardActionArea,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import { CircularProgress, Typography } from "@mui/material";
import MDSnackbar from "../../components/MDSnackbar";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useNavigate, useLocation } from "react-router-dom";
import { apiUrl } from "../../constants/constants";
import { Autocomplete, Box } from "@mui/material";
import { styled } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import Stepper from "react-stepper-horizontal";
import CourseBasicDetails from "./courseBasicDetails";
import CourseMaterialInfo from "./courseMaterials";
import CoursePricing from "./coursePricing";
import Preview from "./Preview";




function Index() {
  const childRef = useRef();
  const pricingRef = useRef();
  const location = useLocation();
  const course = location?.state?.data;
  const from = location?.state?.from;

  console.log('from data', from, location)
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(course ? true : false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const [newObjectId, setNewObjectId] = useState("");
  const [updatedDocument, setUpdatedDocument] = useState([]);
  const [courseData, setCourseData] = useState(course);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [logo, setLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState("");
  const [userState, setUserState] = useState(course?.state || "");
  const [createdCourse, setCreatedCourse] = useState();

  const [cityData, setCityData] = useState([]);
  const queryString = location.search;
  const urlParams = new URLSearchParams(queryString);

  // Get the value of the "mobile" parameter
  // const courseId = urlParams.get('id');
  const paramsActiveSteps = urlParams.get('activestep');

  const [activeStep, setActiveStep] = useState(Number(urlParams.get('activestep')));

  const steps = [
    { title: "Course Info & FAQs" },
    { title: "Upload Course Materials" },
    { title: "Pricing" },
    { title: "Preview & Publish" },
  ];

  function getSectionComponent() {
    console.log('activestep', activeStep)
    switch (activeStep) {
      case 0:
        return (
          <CourseBasicDetails
            // ref={childRef}
            steps={steps}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setCreatedCourse={setCreatedCourse}
          />
        );
      case 1:
        return <CourseMaterialInfo
        steps={steps}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        />;
      case 2:
        return <CoursePricing 
        steps={steps}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        />;
      case 3:
        return <Preview
        steps={steps}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        from={from}
        />;
      default:
        return null;
    }
  }

  const [formState, setFormState] = useState({
    courseName: "" || course?.courseName,
    courseSlug: "" || course?.courseSlug,
    aboutInstructor: "" || course?.aboutInstructor,
    courseDescription: "" || course?.courseDescription,
    courseOverview: "" || course?.courseOverview,
    courseStartTime:
      dayjs(course?.courseStartTime) ??
      dayjs(new Date()).set("hour", 0).set("minute", 0).set("second", 0),
    courseEndTime:
      dayjs(course?.courseEndTime) ??
      dayjs(new Date()).set("hour", 0).set("minute", 0).set("second", 0),
    registrationStartTime:
      dayjs(course?.registrationStartTime) ??
      dayjs(new Date()).set("hour", 0).set("minute", 0).set("second", 0),
    registrationEndTime:
      dayjs(course?.registrationEndTime) ??
      dayjs(new Date()).set("hour", 0).set("minute", 0).set("second", 0),
    status: "" || course?.status,
    maxEnrollments: "" || course?.maxEnrollments,
    coursePrice: "" || course?.coursePrice,
    discountedPrice: "" || course?.discountedPrice,
    courseBenefits: {
      orderNo: "",
      benefits: "",
    },
    commissionPercentage: "" || course?.commissionPercentage,
    tags: "" || course?.tags,
    level: "" || course?.level,
    courseLink: "" || course?.courseLink,
    courseImage: "" || course?.courseImage,
    courseLanguages: "" || course?.courseLanguages,
    isOnboarding: "" || course?.isOnboarding,
  });

  const [gradeValue, setGradeValue] = useState(
    course && {
      _id: course?.highestGrade?._id,
      grade: course?.highestGrade?.grade,
    }
  );

  const [value, setValue] = useState({
    _id: course?.city?._id || "",
    name: course?.city?.name || "",
  });

  const handleImage = (event) => {
    const file = event.target.files[0];
    setImage(event.target.files);
    // Create a FileReader instance
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogo = (event) => {
    const file = event.target.files[0];
    setLogo(event.target.files);
    // Create a FileReader instance
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = async (action) => {
    if (activeStep == 0) {
      if (childRef.current && typeof childRef.current.onSubmit === "function") {
        try {
          const res = await childRef.current.onSubmit();
          setActiveStep(activeStep + 1);
        } catch (e) {
          console.log(e);
        }
      }
    } else if (activeStep == 2) {
      if (
        pricingRef.current &&
        typeof pricingRef.current.setPricing === "function"
      ) {
        try {
          const res = await pricingRef.current.setPricing();
          setActiveStep(activeStep + 1);
        } catch (e) {
          console.log(e);
        }
      }
    } else {
      setActiveStep(activeStep + 1);
    }
  };
  async function onSubmit(e, formState) {
    e.preventDefault();

    if (!formState.courseName || !formState.email) {
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

    const formData = new FormData();
    if (image) {
      formData.append("image", image[0]);
    }

    if (logo) {
      formData.append("logo", logo[0]);
    }

    for (let elem in formState) {
      formData.append(`${elem}`, formState[elem]);
    }

    if (gradeValue) {
      formData.append(`highestGrade`, gradeValue?._id);
    }

    if (userState) {
      formData.append(`state`, userState);
    }

    if (value?._id) {
      formData.append(`city`, value?._id);
    }

    // const {grade, title, startDateTime, registrationOpenDateTime, durationInSeconds, rewardType, status } = formState;
    const res = await fetch(`${apiUrl}course`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();
    if (res.status !== 201) {
      setTimeout(() => {
        setCreating(false);
        setIsSubmitted(false);
      }, 500);
      openErrorSB("Course not created", data?.message);
    } else {
      openSuccessSB("Course Created", data?.message);
      setNewObjectId(data?.data?._id);
      setIsSubmitted(true);
      setCourseData(data?.data);
      setTimeout(() => {
        setCreating(false);
        setIsSubmitted(true);
      }, 500);
    }
  }

  async function onEdit(e, formState) {
    e.preventDefault();
    setSaving(true);
    setUpdatedDocument(false);

    if (!formState.courseName || !formState.email) {
      setTimeout(() => {
        setCreating(false);
        setIsSubmitted(false);
      }, 500);
      return openErrorSB(
        "Missing Field",
        "Please fill all the mandatory fields"
      );
    }

    const formData = new FormData();
    if (image) {
      formData.append("image", image[0]);
    }

    if (logo) {
      formData.append("logo", logo[0]);
    }

    for (let elem in formState) {
      formData.append(`${elem}`, formState[elem]);
    }

    if (gradeValue) {
      formData.append(`highestGrade`, gradeValue?._id);
    }

    if (userState) {
      formData.append(`state`, userState);
    }

    if (value?._id) {
      formData.append(`city`, value?._id);
    }
    const res = await fetch(`${apiUrl}course/${course?._id}`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();

    if (
      data.status === 500 ||
      data.status == 400 ||
      data.status == 401 ||
      data.status == "error" ||
      data.error ||
      !data
    ) {
      openErrorSB("Error", data.error);
      setTimeout(() => {
        setSaving(false);
        setEditing(true);
      }, 500);
    } else if (data.status == "success") {
      openSuccessSB("Course Edited", "Edited Successfully");
      setNewObjectId(data?.data?._id);
      setUpdatedDocument(true);
      setCourseData(data?.data);
      setTimeout(() => {
        setSaving(false);
        setEditing(false);
      }, 500);
    } else {
      openErrorSB("Error", data.message);
      setTimeout(() => {
        setSaving(false);
        setEditing(true);
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
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCityChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleGradeChange = (event, newValue) => {
    setGradeValue(newValue);
  };

  const handleStateChange = (event, newValue) => {
    setUserState(newValue);
    setCityData([]);
    setValue({ id: "", name: "" });
  };

  return (
    <>
      <MDBox
      display="flex"
      flexDirection='column'
      justifyContent="center"
      gap={2}
      >
        <Stepper steps={steps} activeStep={activeStep} />
        {getSectionComponent()}
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          // style={{ padding: "20px" }}
        >
          {/* <Grid
            container
            xs={12}
            md={12}
            lg={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
          > */}
            {/* <Grid
              item
              xs={12}
              md={12}
              lg={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            > */}
              {/* {getSectionComponent()} */}
            {/* </Grid> */}
            {/* <Grid
              p={1}
              item
              xs={12}
              md={12}
              lg={8}
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Grid
                container
                spacing={1}
                xs={12}
                md={12}
                lg={12}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {activeStep !== 0 && activeStep !== steps.length - 1 && (
                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={4}
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <MDButton
                      variant="contained"
                      color="dark"
                      size="small"
                      onClick={() => setActiveStep(activeStep - 1)}
                    >
                      Previous
                    </MDButton>
                  </Grid>
                )}
                {activeStep !== steps.length - 1 && (
                  <>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      lg={4}
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <MDButton
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={() => setActiveStep(activeStep + 1)}
                      >
                        Save as Draft
                      </MDButton>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      lg={4}
                      display="flex"
                      justifyContent="flex-end"
                      alignItems="center"
                    >
                      <MDButton
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => {
                          handleButtonClick("create");
                        }}
                      >
                        Save & Continue
                      </MDButton>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid> */}




            {/* <Grid
              item
              xs={12}
              md={12}
              lg={4}
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
            ></Grid> */}
          {/* </Grid> */}
        </MDBox>
      </MDBox>
    </>
  );
}
export default Index;
