import * as React from "react";
import { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MDTypography from "../../../../components/MDTypography";
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDSnackbar from "../../../../components/MDSnackbar";

export default function CreateRewards({
  createRewardForm,
  setCreateRewardForm,
  leaderboard,
  reward,
}) {

  const rewardId = reward._id;
  const rewardRankStart = reward?.rankStart;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    rankStart: "" || reward?.rankStart,
    rankEnd: "" || reward?.rankEnd,
    reward: "" || reward?.reward,
    rewardType: "" || reward?.rewardType,
    rewardValue: "" || reward?.rewardValue,
  });

  const [isLoading, setIsLoading] = useState(false);
  let baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";

  async function onNext(e, formState) {
    e.preventDefault();

    if (
      !formState?.rankStart ||
      !formState?.rankEnd ||
      !formState?.rewardType ||
      !formState?.reward ||
      !formState?.rewardValue
    ) {
      setTimeout(() => {
        setIsSubmitted(false);
      }, 500);
      return openErrorSB(
        "Missing Field",
        "Please fill all the mandatory fields"
      );
    }

    const { rankStart, rankEnd, rewardType, reward, rewardValue } = formState;
    if (rewardRankStart) {
      const res = await fetch(
        `${baseUrl}api/v1/leaderboard/${leaderboard}/rewards/${rewardId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            rankStart: parseInt(rankStart),
            rankEnd: parseInt(rankEnd),
            rewardType, reward, rewardValue
          }),
        }
      );

      const data = await res.json();
      console.log(data.error, data);
      if (!data.error) {
        // setNewObjectId(data.data?._id)
        setTimeout(() => {
          setIsSubmitted(true);
        }, 500);
        openSuccessSB(
          data.message,
          `Contest Reward Created with prize: ${data.data?.prize}`
        );
        setCreateRewardForm(!createRewardForm);
      } else {
        setTimeout(() => {
          setIsSubmitted(false);
        }, 500);
        console.log("Invalid Entry");
        return openErrorSB("Couldn't Add Reward", data.error);
      }
    } else {
      const res = await fetch(
        `${baseUrl}api/v1/leaderboard/${leaderboard}/rewards`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            rankStart: parseInt(rankStart),
            rankEnd: parseInt(rankEnd),
            rewardType, reward, rewardValue
          }),
        }
      );

      const data = await res.json();
      console.log(data.error, data);
      if (!data.error) {
        setTimeout(() => {
          setIsSubmitted(true);
        }, 500);
        openSuccessSB(
          data.message,
          `Contest Reward Created with prize: ${data.data?.prize}`
        );
        setCreateRewardForm(!createRewardForm);
      } else {
        setTimeout(() => {
          setIsSubmitted(false);
        }, 500);
        console.log("Invalid Entry");
        return openErrorSB("Couldn't Add Reward", data.error);
      }
    }

    setFormState({});
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
              Reward Details
            </MDTypography>
          </MDBox>

          <Grid container spacing={1} mt={0.5} alignItems="space-between">
            <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={isSubmitted}
                id="outlined-required"
                label="Rank Start*"
                inputMode="numeric"
                fullWidth
                value={formState?.rankStart}
                onChange={(e) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    rankStart: e.target.value,
                  }));
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={isSubmitted}
                id="outlined-required"
                label="Rank End*"
                inputMode="numeric"
                fullWidth
                value={formState?.rankEnd}
                onChange={(e) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    rankEnd: e.target.value,
                  }));
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={isSubmitted}
                id="outlined-required"
                label="Reward*"
                fullWidth
                value={formState?.reward}
                onChange={(e) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    reward: e.target.value,
                  }));
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <TextField
                disabled={isSubmitted}
                id="outlined-required"
                label="Reward Value*"
                type="number"
                fullWidth
                value={formState?.rewardValue}
                onChange={(e) => {
                  setFormState((prevState) => ({
                    ...prevState,
                    rewardValue: e.target.value,
                  }));
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-autowidth-label">
                  Reward Type *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  name="rewardType"
                  value={formState?.rewardType}
                  onChange={(e) => {
                    setFormState((prevState) => ({
                      ...prevState,
                      rewardType: e.target.value,
                    }));
                  }}
                  label="Reward Type"
                  sx={{ minHeight: 43 }}
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Goodies">Goodies</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {!isSubmitted && (
              <>
                <Grid item xs={12} md={2} xl={1} width="100%">
                  <MDButton
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={(e) => {
                      onNext(e, formState);
                      setFormState({});
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
                      setCreateRewardForm(!createRewardForm);
                      setFormState({});
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
// maxReferralsPayoutCap