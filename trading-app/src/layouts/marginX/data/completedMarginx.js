import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import { apiUrl } from "../../../constants/constants";
import { CircularProgress } from '@mui/material';

const CompletedContest = () => {
  const [completedMarginX, setCompletedMarginX] = useState([]);
  const [skip, setSkip] = useState(0);
  const limitSetting = 12;
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData()
  }, [skip]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl}marginx/completed?skip=${skip}&limit=${limitSetting}`, { withCredentials: true });
      setCompletedMarginX((prev) => res.data.data);
      setCount(res.data.count);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  }

  function backHandler() {
    if (skip <= 0) {
      return;
    }
    setSkip((prev) => prev - limitSetting);
    setCompletedMarginX([]);
  }

  function nextHandler() {
    if (skip + limitSetting >= count) {
      return;
    }
    setSkip((prev) => prev + limitSetting);
    setCompletedMarginX([]);
  }

  return (
    <>
      {
       isLoading ?
       <MDBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
         <CircularProgress color='light' />
       </MDBox>
       :
      completedMarginX.length > 0 ? (
        <MDBox>
          <Grid container spacing={2} bgColor="dark">
            {completedMarginX?.map((e) => {
              return (
                <Grid key={e._id} item xs={12} md={12} lg={12} bgColor="dark">
                  <MDBox padding={0} style={{ borderRadius: 4 }}>
                    <MDButton
                      variant="contained"
                      color={"light"}
                      size="small"
                      component={Link}
                      style={{ minWidth: "100%" }}
                      to={{
                        pathname: `/marginxdashboard/createmarginx`,
                      }}
                      state={{ data: e }}
                    >
                      <Grid container>
                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={12}
                          mt={1}
                          display="flex"
                          justifyContent="left"
                        >
                          <MDTypography
                            fontSize={15}
                            style={{
                              color: "black",
                              paddingRight: 4,
                              fontWeight: "bold",
                            }}
                          >
                            MarginX Name: {e?.marginXName}
                          </MDTypography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={3}
                          mb={1}
                          display="flex"
                          justifyContent="left"
                        >
                          <MDTypography fontSize={9} style={{ color: "black" }}>
                            No. of Registrations:{" "}
                            <span style={{ fontSize: 11, fontWeight: 700 }}>
                              {e?.participants?.length}
                            </span>
                          </MDTypography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={3}
                          mb={1}
                          display="flex"
                          justifyContent="left"
                        >
                          <MDTypography fontSize={9} style={{ color: "black" }}>
                            Total Seats:{" "}
                            <span style={{ fontSize: 11, fontWeight: 700 }}>
                              {e?.maxParticipants}
                            </span>
                          </MDTypography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={3}
                          mb={1}
                          display="flex"
                          justifyContent="left"
                        >
                          <MDTypography fontSize={9} style={{ color: "black" }}>
                            Seats Left:{" "}
                            <span style={{ fontSize: 11, fontWeight: 700 }}>
                              {e?.maxParticipants - e?.participants?.length}
                            </span>
                          </MDTypography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={3}
                          mb={1}
                          display="flex"
                          justifyContent="left"
                        >
                          <MDTypography fontSize={9} style={{ color: "black" }}>
                            Live Time:{" "}
                            <span style={{ fontSize: 11, fontWeight: 700 }}>
                              {moment
                                .utc(e?.liveTime)
                                .utcOffset("+05:30")
                                .format("DD-MMM-YY hh:mm a")}
                            </span>
                          </MDTypography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={3}
                          mb={1}
                          display="flex"
                          justifyContent="left"
                        >
                          <MDTypography fontSize={9} style={{ color: "black" }}>
                            Start Time:{" "}
                            <span style={{ fontSize: 11, fontWeight: 700 }}>
                              {moment
                                .utc(e?.startTime)
                                .utcOffset("+05:30")
                                .format("DD-MMM-YY hh:mm a")}
                            </span>
                          </MDTypography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={3}
                          mb={1}
                          display="flex"
                          justifyContent="left"
                        >
                          <MDTypography fontSize={9} style={{ color: "black" }}>
                            End Time:{" "}
                            <span style={{ fontSize: 11, fontWeight: 700 }}>
                              {moment
                                .utc(e?.endTime)
                                .utcOffset("+05:30")
                                .format("DD-MMM-YY hh:mm a")}
                            </span>
                          </MDTypography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={3}
                          mb={1}
                          display="flex"
                          justifyContent="left"
                        >
                          <MDTypography fontSize={9} style={{ color: "black" }}>
                            Expiry:{" "}
                            <span style={{ fontSize: 11, fontWeight: 700 }}>
                              {e?.marginXExpiry}
                            </span>
                          </MDTypography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={3}
                          mb={1}
                          display="flex"
                          justifyContent="left"
                        >
                          <MDTypography fontSize={9} style={{ color: "black" }}>
                            Status:{" "}
                            <span style={{ fontSize: 11, fontWeight: 700 }}>
                              {e?.status}
                            </span>
                          </MDTypography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={3}
                          mb={1}
                          display="flex"
                          justifyContent="left"
                        >
                          <MDTypography fontSize={9} style={{ color: "black" }}>
                            Index:{" "}
                            <span style={{ fontSize: 11, fontWeight: 700 }}>
                              {`${e?.isNifty ? "NIFTY 50 | " : ""}${e?.isBankNifty ? "BANKNIFTY | " : ""
                                }${e?.isFinNifty ? "FINNIFTY | " : ""}`.slice(
                                  0,
                                  -3
                                )}
                            </span>
                          </MDTypography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={3}
                          mb={1}
                          display="flex"
                          justifyContent="left"
                        >
                          <MDTypography fontSize={9} style={{ color: "black" }}>
                            Template:{" "}
                            <span style={{ fontSize: 11, fontWeight: 700 }}>
                              {e?.marginXTemplate?.templateName}
                            </span>
                          </MDTypography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={3}
                          mb={1}
                          display="flex"
                          justifyContent="left"
                        >
                          <MDTypography fontSize={9} style={{ color: "black" }}>
                            Entry Fee:{" "}
                            <span style={{ fontSize: 11, fontWeight: 700 }}>
                              ₹{e?.marginXTemplate?.entryFee}
                            </span>
                          </MDTypography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={3}
                          mb={1}
                          display="flex"
                          justifyContent="left"
                        >
                          <MDTypography fontSize={9} style={{ color: "black" }}>
                            Portfolio:{" "}
                            <span style={{ fontSize: 11, fontWeight: 700 }}>
                              ₹
                              {new Intl.NumberFormat(undefined, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(e?.marginXTemplate?.portfolioValue)}
                            </span>
                          </MDTypography>
                        </Grid>
                      </Grid>
                    </MDButton>
                  </MDBox>
                </Grid>
              );
            })}
          </Grid>
        </MDBox>
      ) : (
        <Grid container spacing={1} xs={12} md={6} lg={12}>
          <Grid
            item
            mt={2}
            xs={6}
            md={3}
            lg={12}
            display="flex"
            justifyContent="center"
          >
            <MDTypography color="light">No Completed MarginX(s)</MDTypography>
          </Grid>
        </Grid>
      )}

      {!isLoading && count !== 0 && (
        <MDBox
          mt={1}
          p={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <MDButton
            variant="outlined"
            color="light"
            disabled={
              (skip + limitSetting) / limitSetting === 1
                ? true
                : false
            }
            size="small"
            onClick={backHandler}
          >
            Back
          </MDButton>
          <MDTypography
            color="light"
            fontSize={15}
            fontWeight="bold"
          >
            Total Data: {!count ? 0 : count} | Page{" "}
            {(skip + limitSetting) / limitSetting} of{" "}
            {!count ? 1 : Math.ceil(count / limitSetting)}
          </MDTypography>
          <MDButton
            variant="outlined"
            color="light"
            disabled={
              Math.ceil(count / limitSetting) ===
                (skip + limitSetting) / limitSetting
                ? true
                : !count
                  ? true
                  : false
            }
            size="small"
            onClick={nextHandler}
          >
            Next
          </MDButton>
        </MDBox>
      )}
    </>
  );
};

export default CompletedContest;
