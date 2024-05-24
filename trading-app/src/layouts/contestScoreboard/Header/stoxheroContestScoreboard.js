import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactGA from "react-ga";
import { Paper, Avatar, Box, Divider, CircularProgress } from "@mui/material";

import { Grid } from "@mui/material";
import MDTypography from "../../../components/MDTypography";
import MDBox from "../../../components/MDBox";
import MDButton from '../../../components/MDButton';
import logo from "../../../assets/images/logo1.jpeg";
import { apiUrl } from '../../../constants/constants';

const Scoreboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const limitSetting = 50;
  const [count, setCount] = useState(0);

  function convertName(name) {
    // const name = 'SARTHAK SINGHAL';

    const cname = name
      ?.toLowerCase()
      ?.split(" ")
      ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
      ?.join(" ");

    return cname;
  }

  useEffect(() => {
    fetchData()
  }, [skip])

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl}contestscoreboard/scoreboard?skip=${skip}&limit=${limitSetting}`, { withCredentials: true });
      setData((prev) => res?.data?.data);
      setCount(res?.data?.count);
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
    setData([]);
  }

  function nextHandler() {
    if (skip + limitSetting >= count) {
      return;
    }
    setSkip((prev) => prev + limitSetting);
    setData([]);
  }

  return (
    <Box
      mt={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <MDBox
        p={1}
        backgroundColor="#59B15D"
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <MDBox>
          <Avatar src={logo} alt="StoxHero" />
        </MDBox>
        <MDBox ml={1}>
          <MDTypography color="light" fontWeight="bold">
            TestZone Leaderboard
          </MDTypography>
        </MDBox>
      </MDBox>
      {isLoading ? (
        <MDBox mt={10} minHeight="30vH">
          <CircularProgress color="info" />
        </MDBox>
      ) : (
        <Box
          sx={{ maxWidth: "100%", width: "100%", margin: "0 auto" }}
          component={Paper}
        >
          <Grid container mt={1} display="flex" justifyContent="center">
            <Grid
              item
              xs={12}
              md={6}
              lg={1}
              mt={1}
              display="flex"
              justifyContent="center"
            >
              <MDTypography fontSize={15} fontWeight="bold" color="dark">
                Rank
              </MDTypography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              lg={3}
              mt={1}
              display="flex"
              justifyContent="left"
            >
              <MDBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
              >
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="100%"
                >
                  <MDTypography fontSize={15} fontWeight="bold" color="dark">
                    Trader
                  </MDTypography>
                </MDBox>
              </MDBox>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              lg={2}
              mt={1}
              display="flex"
              justifyContent="center"
            >
              <MDTypography fontSize={15} fontWeight="bold" color="dark">
                Earnings
              </MDTypography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              lg={2}
              mt={1}
              display="flex"
              justifyContent="center"
            >
              <MDTypography fontSize={15} fontWeight="bold" color="dark">
                TestZone Participated
              </MDTypography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              lg={2}
              mt={1}
              display="flex"
              justifyContent="center"
            >
              <MDTypography fontSize={15} fontWeight="bold" color="dark">
                TestZone Won
              </MDTypography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              lg={2}
              mt={1}
              display="flex"
              justifyContent="center"
            >
              <MDTypography fontSize={15} fontWeight="bold" color="dark">
                StrikeRate
              </MDTypography>
            </Grid>
          </Grid>
          <Divider style={{ backgroundColor: "grey" }} />

          {data.map((trader, index) => (
            <>
              <Grid
                container
                mb={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" } }}
              >
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={1}
                  display="flex"
                  justifyContent="center"
                >
                  <MDTypography fontSize={15} color="dark">
                    {index + 1}
                  </MDTypography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={3}
                  display="flex"
                  justifyContent="center"
                  width="100%"
                >
                  <MDBox
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    width="100%"
                  >
                    <MDBox
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                      ml={9}
                      mr={1}
                    >
                      <Avatar
                        src={
                          trader?.traderProfilePhoto
                            ? trader?.traderProfilePhoto
                            : logo
                        }
                        alt={trader?.traderFirstName}
                      // sx={{padding: "5px"}}
                      />
                    </MDBox>
                    <MDBox
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <MDTypography fontSize={15} color="dark">
                        {convertName(trader.traderFirstName)}{" "}
                        {convertName(trader.traderLastName)}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={2}
                  display="flex"
                  justifyContent="center"
                >
                  <MDTypography fontSize={15} color="dark">
                    ₹
                    {new Intl.NumberFormat(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(trader?.totalPayout)}
                  </MDTypography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={2}
                  display="flex"
                  justifyContent="center"
                >
                  <MDTypography fontSize={15} color="dark">
                    {trader?.contestParticipated}
                  </MDTypography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={2}
                  display="flex"
                  justifyContent="center"
                >
                  <MDTypography fontSize={15} color="dark">
                    {trader?.contestWon}
                  </MDTypography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={2}
                  display="flex"
                  justifyContent="center"
                >
                  <MDTypography fontSize={15} color="dark">
                    {(trader?.strikeRate).toFixed(2)}%
                  </MDTypography>
                </Grid>
              </Grid>
              <Divider style={{ backgroundColor: "grey" }} />
            </>
          ))}
        </Box>
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
    </Box>
  );
};

export default Scoreboard;
