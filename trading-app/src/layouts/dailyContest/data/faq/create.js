import * as React from "react";
import { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MDTypography from "../../../../components/MDTypography";
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
// import { userContext } from "../../../../AuthContext";
// import axios from "axios";
import { CircularProgress, Typography } from "@mui/material";
import MDSnackbar from "../../../../components/MDSnackbar";
import { apiUrl } from "../../../../constants/constants";

export default function Create({ createForm, setCreateForm, contestId, faq }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  // const getDetails = useContext(userContext);
  // const [rewardData, setRewardData] = useState([]);
  const [formState, setFormState] = useState({
    order: "" || faq?.order,
    question: "" || faq?.question,
    answer: "" || faq?.answer,
  });
  // const [id, setId] = useState();
  // const [isObjectNew, setIsObjectNew] = useState(id ? true : false)
  const [isLoading, setIsLoading] = useState(false);

  async function onNext(e, formState) {
    e.preventDefault();

    if (!formState?.order || !formState?.question || !formState?.answer) {
      setTimeout(() => {
        setIsSubmitted(false);
      }, 500);
      return openErrorSB(
        "Missing Field",
        "Please fill all the mandatory fields"
      );
    }

    const { order, question, answer } = formState;
    if (faq?.order) {
      const res = await fetch(`${apiUrl}dailycontest/${contestId}/faq/${faq?._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          order: parseInt(order),
          question: question,
          answer,
        }),
      });

      const data = await res.json();
      console.log(data.error, data);
      if (!data.error) {
        // setNewObjectId(data.data?._id)
        setTimeout(() => {
          setIsSubmitted(true);
        }, 500);
        openSuccessSB(
          data.message,
          `Contest Reward Created with answer: ${data.data?.answer}`
        );
        setCreateForm(!createForm);
      } else {
        setTimeout(() => {
          setIsSubmitted(false);
        }, 500);
        console.log("Invalid Entry");
        return openErrorSB("Couldn't Add Reward", data.error);
      }
    } else {
      const res = await fetch(`${apiUrl}dailycontest/${contestId}/faq`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          order: parseInt(order),
          question: question,
          answer,
        }),
      });

      const data = await res.json();
      console.log(data.error, data);
      if (!data.error) {
        // setNewObjectId(data.data?._id)
        setTimeout(() => {
          setIsSubmitted(true);
        }, 500);
        openSuccessSB(
          data.message,
          `Contest Reward Created with answer: ${data.data?.answer}`
        );
        setCreateForm(!createForm);
      } else {
        setTimeout(() => {
          setIsSubmitted(false);
        }, 500);
        console.log("Invalid Entry");
        return openErrorSB("Couldn't Add Reward", data.error);
      }
    }
    setFormState({})
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
              FAQ Details
            </MDTypography>
          </MDBox>

          <Grid container spacing={1} mt={0.5} alignItems="space-between">
            <Grid item xs={12} md={5} xl={2}>
              <TextField
                disabled={isSubmitted}
                id="outlined-required"
                label="Order*"
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
            <Grid item xs={12} md={5} xl={5}>
              <TextField
                disabled={isSubmitted}
                id="outlined-required"
                label="Question*"
                inputMode="numeric"
                fullWidth
                value={formState?.question}
                onChange={(e) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    question: e.target.value,
                  }));
                }}
              />
            </Grid>
            <Grid item xs={12} md={5} xl={5}>
              <TextField
                disabled={isSubmitted}
                id="outlined-required"
                label="Answer*"
                fullWidth
                value={formState?.answer}
                onChange={(e) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    answer: e.target.value,
                  }));
                }}
              />
            </Grid>

            {!isSubmitted && (
              <Grid
                item
                xs={12}
                md={12}
                xl={12}
                display="flex"
                justifyContent="flex-end"
                gap={2}
              >
                <Grid item>
                  <MDButton
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={(e) => {
                      
                      onNext(e, formState);
                    }}
                  >
                    Save
                  </MDButton>
                </Grid>
                <Grid item>
                  <MDButton
                    variant="contained"
                    size="small"
                    color="warning"
                    onClick={(e) => {
                      setCreateForm(!createForm);
                      setFormState({})
                    }}
                  >
                    Back
                  </MDButton>
                </Grid>
              </Grid>
            )}
          </Grid>
          {renderSuccessSB}
          {renderErrorSB}
        </MDBox>
      )}
    </>
  );
}
