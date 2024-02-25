import * as React from "react";
import {
  useContext,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
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

const CoursePricing = forwardRef(({ createdCourse }, ref) => {
  console.log("created course", createdCourse);
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

  useImperativeHandle(ref, () => ({
    setPricing: async function setPricing() {
      //   if (created) return;

      //   e.preventDefault();
      setTimeout(() => {
        setCreating(false);
        // setIsSubmitted(true);
      }, 500);

      const res = await fetch(
        `${baseUrl}api/v1/courses/pricing/${createdCourse?._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            coursePrice: formState.coursePrice,
            discountedPrice: formState.discountedPrice,
            commissionPercentage: formState.commissionPercentage,
          }),
        }
      );

      const data = await res.json();

      if (res.status === 200 || res.status == 201 || data) {
        openSuccessSB("Course Created", data.message);
        setCourseData(res.data);
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
    },
  }));

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
          style={{ minWidth: "100%" }}
        >
          <Grid
            container
            spacing={1}
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
              md={6}
              lg={4}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <TextField
                disabled={(isSubmitted || id) && (!editing || saving)}
                id="outlined-required"
                // label='Course Name *'
                placeholder="Course Price"
                value={formState?.coursePrice || courseData?.coursePrice}
                fullWidth
                type="number"
                onChange={(e) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    coursePrice: e.target.value,
                  }));
                }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <TextField
                disabled={(isSubmitted || id) && (!editing || saving)}
                id="outlined-required"
                // label='Course Name *'
                placeholder="Course Discounted Price"
                value={
                  formState?.discountedPrice || courseData?.discountedPrice
                }
                fullWidth
                type="number"
                onChange={(e) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    discountedPrice: e.target.value,
                  }));
                }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <TextField
                disabled={(isSubmitted || id) && (!editing || saving)}
                id="outlined-required"
                // label='Course Name *'
                placeholder="Commission Percentage"
                value={
                  formState?.commissionPercentage ||
                  courseData?.commissionPercentage
                }
                fullWidth
                type="number"
                onChange={(e) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    commissionPercentage: e.target.value,
                  }));
                }}
              />
            </Grid>
          </Grid>
          {renderSuccessSB}
          {renderErrorSB}
        </MDBox>
      )}
    </>
  );
});
export default CoursePricing;
