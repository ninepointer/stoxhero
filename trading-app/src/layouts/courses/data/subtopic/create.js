import * as React from "react";
import { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import {
  Grid,
  Card,
  CardContent,
  CardActionArea,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from "@mui/material";
import MDTypography from "../../../../components/MDTypography";
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { CircularProgress, Typography } from "@mui/material";
import MDSnackbar from "../../../../components/MDSnackbar";
import { apiUrl } from "../../../../constants/constants";
import FormControl from "@mui/material/FormControl";
import axios from "axios";

export default function Create({
  createForm,
  setCreateForm,
  subtopic,
  contentId,
  courseId,
  setData,
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    order: "" || subtopic?.order,
    topic: "" || subtopic?.topic,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fileVid, setFileVid] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    setFileVid(event.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formState?.order || !formState?.topic) {
      setTimeout(() => {
        setIsSubmitted(false);
      }, 500);
      return openErrorSB(
        "Missing Field",
        "Please fill all the mandatory fields"
      );
    }

    const formData = new FormData();
    for (let elem in formState) {
      formData.append(`${elem}`, formState[elem]);
    }
    formData.append("fileVid", fileVid);

    if (subtopic?.topic) {
      try {
        const response = await axios.patch(
          `${apiUrl}courses/${courseId}/subtopic/${contentId}/${subtopic?._id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const { loaded, total } = progressEvent;
              const progress = Math.round((loaded / total) * 100);
              setUploadProgress(progress);
            },
          }
        );
        const data = response.data.data;
        if (!data.error) {
          setTimeout(() => {
            setIsSubmitted(true);
          }, 500);
          openSuccessSB(
            data.message,
            `Contest Reward Created with prize: ${data.data?.prize}`
          );
          setCreateForm(!createForm);
        } else {
          setTimeout(() => {
            setIsSubmitted(false);
          }, 500);
          console.log("Invalid Entry");
          return openErrorSB("Couldn't Add Reward", data.error);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadProgress(-1);
        alert("Error uploading file. Please try again.");
      }
    } else {
      try {
        if (!fileVid) {
          setTimeout(() => {
            setIsSubmitted(false);
          }, 500);
          return openErrorSB(
            "Missing Field",
            "Please fill all the mandatory fields"
          );
        }
        const response = await axios.patch(
          `${apiUrl}courses/${courseId}/subtopic/${contentId}`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const { loaded, total } = progressEvent;
              const progress = Math.round((loaded / total) * 100);
              setUploadProgress(progress);
            },
          }
        );
        const data = response.data.data;
        console.log("File uploaded successfully:", response.data);
        setUploadProgress(200);
        if (!data.error) {
          setTimeout(() => {
            setIsSubmitted(true);
          }, 500);
          openSuccessSB(
            data.message,
            `Contest Reward Created with prize: ${data.data?.prize}`
          );
          setCreateForm(!createForm);
        } else {
          setTimeout(() => {
            setIsSubmitted(false);
          }, 500);
          console.log("Invalid Entry");
          setUploadProgress(-1);
          return openErrorSB("Couldn't Add Reward", data.error);
        }
        // Reset file input
        setFileVid(null);
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadProgress(-1);
        alert("Error uploading file. Please try again.");
      }
    }
  };

  async function onNext(e) {
    e.preventDefault();

    if (!formState?.order || !formState?.topic) {
      setTimeout(() => {
        setIsSubmitted(false);
      }, 500);
      return openErrorSB(
        "Missing Field",
        "Please fill all the mandatory fields"
      );
    }

    if (subtopic?.topic) {
      const res = await fetch(
        `${apiUrl}courses/${courseId}/subtopic/${contentId}/${subtopic?._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            order: parseInt(formState?.order),
            topic: formState?.topic,
          }),
        }
      );

      const data = await res.json();
      if (!data.error) {
        setTimeout(() => {
          setIsSubmitted(true);
        }, 500);
        openSuccessSB(
          data.message,
          `Contest Reward Created with prize: ${data.data?.prize}`
        );
        setCreateForm(!createForm);
        setData(data?.data);
      } else {
        setTimeout(() => {
          setIsSubmitted(false);
        }, 500);
        console.log("Invalid Entry");
        return openErrorSB("Couldn't Add Reward", data.error);
      }
    } else {
      const res = await fetch(
        `${apiUrl}courses/${courseId}/subtopic/${contentId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            order: parseInt(formState?.order),
            topic: formState?.topic,
          }),
        }
      );

      const data = await res.json();
      if (!data.error) {
        setTimeout(() => {
          setIsSubmitted(true);
        }, 500);
        openSuccessSB(
          data.message,
          `Contest Reward Created with prize: ${data.data?.prize}`
        );
        setCreateForm(!createForm);
        setData(data?.data?.subtopics);
      } else {
        setTimeout(() => {
          setIsSubmitted(false);
        }, 500);
        console.log("Invalid Entry");
        return openErrorSB("Couldn't Add Reward", data.error);
      }
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
        <MDBox mt={4} p={3}>
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
              Sub Topic Details
            </MDTypography>
          </MDBox>

          <Grid container mt={0.5} alignItems="space-between">
            <Grid
              item
              xs={12}
              md={6}
              xl={12}
              display="flex"
              gap={1}
              mt={1}
              justifyContent={"space-between"}
            >
              <Grid item xs={12} md={6} xl={6}>
                <TextField
                  disabled={isSubmitted}
                  id="outlined-required"
                  placeholder="Order*"
                  inputMode="numeric"
                  fullWidth
                  value={formState?.order}
                  onChange={(e) => {
                    setFormState((prevState) => ({
                      ...prevState,
                      order: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={6}>
                <TextField
                  disabled={isSubmitted}
                  id="outlined-required"
                  placeholder="Topic*"
                  fullWidth
                  value={formState?.topic}
                  onChange={(e) => {
                    setFormState((prevState) => ({
                      ...prevState,
                      topic: e.target.value,
                    }));
                  }}
                />
              </Grid>
              <Grid item xs={12} md={12} xl={9}>
                <label>Topic Video</label>
                <input type="file" onChange={handleFileChange} />
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <span>Upload Progress: {uploadProgress}%</span>
                )}
                {uploadProgress == 100 && <span>Storing Data in S3...</span>}
                {uploadProgress == 200 && (
                  <span>File uploaded successfully.</span>
                )}
                {uploadProgress == -1 && (
                  <span>Error in file upload. Try again.</span>
                )}
                {/* <button onClick={handleUpload}>Upload</button> */}
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            xl={4}
            mt={1}
            display="flex"
            gap={10}
            // justifyContent={'space-around'}
          >
            {!isSubmitted && (
              <>
                <Grid item xs={12} md={2} xl={1} width="100%">
                  <MDButton
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={(e) => {
                      handleUpload(e);
                    }}
                  >
                    Next
                  </MDButton>
                </Grid>
                <Grid item xs={12} md={2} xl={1} width="100%">
                  <MDButton
                    variant="contained"
                    size="small"
                    color="warning"
                    onClick={(e) => {
                      setCreateForm(!createForm);
                    }}
                  >
                    Back
                  </MDButton>
                </Grid>
              </>
            )}
          </Grid>
          {renderSuccessSB}
          {renderErrorSB}
        </MDBox>
      )}
    </>
  );
}
