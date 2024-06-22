import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import { Link } from "react-router-dom";
import moment from "moment";

const Active = ({ type }) => {
  const [skip, setSkip] = useState(0);
  const limitSetting = 10;
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";

  useEffect(() => {
    fetchData(skip, limitSetting);
  }, []);

  async function fetchData(skip, limitSetting) {
    let call1 = axios.get(
      `${baseUrl}api/v1/leaderboard/active?skip=${skip}&limit=${limitSetting}`,
      {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      }
    );
    Promise.all([call1])
      .then(([api1Response]) => {
        setData(api1Response.data.data);
        setCount(api1Response.data.count);
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      })
      .catch((error) => {
        // Handle errors here
      });
  }

  function backHandler() {
    if (skip <= 0) {
      return;
    }
    setSkip((prev) => prev - limitSetting);
    setData([]);
    setIsLoading(true);
    fetchData(skip - limitSetting, limitSetting);
  }

  function nextHandler() {
    if (skip + limitSetting >= count) {
      return;
    }
    setSkip((prev) => prev + limitSetting);
    setData([]);
    setIsLoading(true);
    fetchData(skip + limitSetting, limitSetting);
  }

  return (
    <>
      {data.length > 0 ? (
        <MDBox>
          <Grid container spacing={2} bgColor="dark">
            {data?.map((e) => {
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
                        pathname: `/leaderboard-params-create`,
                      }}
                      state={{ data: e }}
                    >
                      <Grid container>
                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={12}
                          display={"flex"}
                          justifyContent={"center"}
                          alignItems={"center"}
                        >
                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={4}
                            mb={1}
                            display="flex"
                            justifyContent="center"
                          >
                            <MDTypography
                              fontSize={12}
                              style={{ color: "black" }}
                            >
                              Frequency:{" "}
                              <span style={{ fontSize: 14, fontWeight: 700 }}>
                                {e?.frequency}
                              </span>
                            </MDTypography>
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={4}
                            mb={1}
                            display="flex"
                            justifyContent="center"
                          >
                            <MDTypography
                              fontSize={12}
                              style={{ color: "black" }}
                            >
                              Users Per Table:{" "}
                              <span style={{ fontSize: 14, fontWeight: 700 }}>
                                {e?.usersPerTable}
                              </span>
                            </MDTypography>
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            md={6}
                            lg={4}
                            mb={1}
                            display="flex"
                            justifyContent="center"
                          >
                            <MDTypography
                              fontSize={12}
                              style={{ color: "black" }}
                            >
                              Margin Money Interest:{" "}
                              <span style={{ fontSize: 14, fontWeight: 700 }}>
                                {e?.marginMoneyInterest}
                              </span>
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </MDButton>
                  </MDBox>
                </Grid>
              );
            })}
          </Grid>
          {!isLoading && count !== 0 && (
            <MDBox
              mt={1}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <MDButton
                variant="outlined"
                color="warning"
                disabled={
                  (skip + limitSetting) / limitSetting === 1 ? true : false
                }
                size="small"
                onClick={backHandler}
              >
                Back
              </MDButton>
              <MDTypography color="light" fontSize={15} fontWeight="bold">
                Total Data: {!count ? 0 : count} | Page{" "}
                {(skip + limitSetting) / limitSetting} of{" "}
                {!count ? 1 : Math.ceil(count / limitSetting)}
              </MDTypography>
              <MDButton
                variant="outlined"
                color="warning"
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
            <MDTypography color="light">No Active Data</MDTypography>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Active;
