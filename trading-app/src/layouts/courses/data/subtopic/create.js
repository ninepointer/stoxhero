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
  setData, reloadContent, setReloadContent
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    order: "" || subtopic?.order,
    topic: "" || subtopic?.topic,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fileVid, setFileVid] = useState(subtopic?.videoUrl);
  const [notes, setNotes] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    setFileVid(event.target.files[0]);
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.files);
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

    
    for(let note of notes){
      console.log('notes', note)
      formData.append('pdfFiles', note);
    }
    // notes.forEach((file) => {
    //   formData.append('pdfFiles', file);
    // });

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
        setReloadContent(!reloadContent);
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
        setReloadContent(!reloadContent);
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
        <MDBox p={3}>
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

            <Grid container mt={0.5} alignItems="center" justifyContent="center">
              <Grid
                container
                spacing={1}
                xs={12}
                md={12}
                xl={12}
                display="flex"
                justifyContent="center"
              >
                <Grid item xs={12} md={6} xl={3}>
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
                <Grid item xs={12} md={6} xl={9}>
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
              </Grid>
            </Grid>

            <Grid container mt={0.5} alignItems="center" justifyContent="center">
              <Grid
                item
                container
                spacing={1}
                xs={12}
                md={6}
                xl={12}
                display="flex"
                justifyContent="center"
              >
                <Grid item xs={12} md={8} xl={4}>
                  <label>Topic Video</label>
                  <input type="file" onChange={handleFileChange} />
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <span>Upload Progress: {uploadProgress}%</span>
                  )}
                  {uploadProgress == 100 && <span>Storing Data in S3...</span>}
                  {uploadProgress == 200 && <span>File uploaded successfully.</span>}
                  {uploadProgress == -1 && <span>Error in file upload. Try again.</span>}
                </Grid>

                <Grid item xs={12} md={8} xl={4}>
                  <label>Notes</label>
                  <input type="file" multiple onChange={handleNotesChange} />
                  {/* {uploadProgress > 0 && uploadProgress < 100 && (
                    <span>Upload Progress: {uploadProgress}%</span>
                  )}
                  {uploadProgress == 100 && <span>Storing Data in S3...</span>}
                  {uploadProgress == 200 && <span>File uploaded successfully.</span>}
                  {uploadProgress == -1 && <span>Error in file upload. Try again.</span>} */}
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={6}
                  xl={4}
                  mt={1}
                  display="flex"
                  justifyContent="flex-end"
                  gap={1}
                >
                  {!isSubmitted && (
                    <>
                      <Grid item>
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
                      <Grid item>
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
              </Grid>
            </Grid>




            {/* <Grid container mt={0.5} alignItems="center" justifyContent="center">
              <Grid
                container
                spacing={1}
                xs={12}
                md={12}
                xl={12}
                display="flex"
                justifyContent="center"
              >
                {subtopic?.notes?.map((elem) => {
                  return (
                    <Grid item xs={12} md={6} xl={3}>
                      <embed src={elem} type="application/pdf" width="100%" height="500px" />
                    </Grid>
                  )
                })}
               
              </Grid>
            </Grid> */}
          {renderSuccessSB}
          {renderErrorSB}
        </MDBox>
      )}
    </>
  );
}
