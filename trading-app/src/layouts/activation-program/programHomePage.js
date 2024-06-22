import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import Grid from "@mui/material/Grid";
import MDTypography from "../../components/MDTypography";

function ActivationHomePage() {
  const [program, setProgram] = useState();
  const [totalUsers, setTotalUsers] = useState();
  let baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";

  useEffect(() => {
    axios
      .get(`${baseUrl}api/v1/activations/active`, { withCredentials: true })
      .then((res) => {
        setProgram(res?.data?.data[0]);
        setTotalUsers(res?.data?.data[0]?.users?.length);
      })
      .catch((err) => {
        return new Error(err);
      });
  }, []);

  function ConvertDate(dateToConvert) {
    if (dateToConvert) {
      const date = new Date(dateToConvert);
      const formattedDate = date.toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      return formattedDate;
    }
  }

  return (
    <MDBox>
      <MDBox>
        <MDBox mb={1} mt={1} display="flex" justifyContent="right" gap={1}>
          <MDButton
            variant="contained"
            color="success"
            size="small"
            component={Link}
            to="/activationprogramdetails"
          >
            Create Activation Program
          </MDButton>

          <MDButton
            variant="contained"
            color="warning"
            size="small"
            component={Link}
            to={{
              pathname: `/activationprogramdetails`,
            }}
            state={{ data: program }}
          >
            Edit Activation Program
          </MDButton>
        </MDBox>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6} lg={3}>
            <MDButton
              color="dark"
              variant="contained"
              width="100%"
              style={{ minWidth: "100%" }}
            >
              <MDBox>
                <MDBox
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <MDTypography
                    pt={1}
                    color="light"
                    fontSize={20}
                    display="flex"
                    justifyContent="center"
                  >
                    10
                  </MDTypography>
                  <MDTypography
                    pb={1}
                    color="light"
                    fontSize={13}
                    display="flex"
                    justifyContent="center"
                  >
                    Total Activations
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDButton>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDButton
              color="dark"
              variant="contained"
              style={{ minWidth: "100%" }}
            >
              <MDBox>
                <MDBox
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <MDTypography
                    pt={1}
                    color="light"
                    fontSize={20}
                    display="flex"
                    justifyContent="center"
                  >
                    10
                  </MDTypography>
                  <MDTypography
                    pb={1}
                    color="light"
                    fontSize={13}
                    display="flex"
                    justifyContent="center"
                  >
                    Total Activations
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDButton>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDButton
              color="dark"
              variant="contained"
              style={{ minWidth: "100%" }}
            >
              <MDBox>
                <MDBox
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <MDTypography
                    pt={1}
                    color="light"
                    fontSize={20}
                    display="flex"
                    justifyContent="center"
                  >
                    10
                  </MDTypography>
                  <MDTypography
                    pb={1}
                    color="light"
                    fontSize={13}
                    display="flex"
                    justifyContent="center"
                  >
                    Total Activations
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDButton>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDButton
              color="dark"
              variant="contained"
              style={{ minWidth: "100%" }}
            >
              <MDBox>
                <MDBox
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <MDTypography
                    pt={1}
                    color="light"
                    fontSize={20}
                    display="flex"
                    justifyContent="center"
                  >
                    10
                  </MDTypography>
                  <MDTypography
                    pb={1}
                    color="light"
                    fontSize={13}
                    display="flex"
                    justifyContent="center"
                  >
                    Total Activations
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDButton>
          </Grid>
        </Grid>
      </MDBox>

      <MDBox mt={2}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6} lg={6}>
            <MDBox
              bgColor="dark"
              borderRadius={5}
              variant="contained"
              style={{ minWidth: "100%", minHeight: "auto" }}
            >
              <MDBox>
                <MDBox
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <MDTypography
                    p={1}
                    m={2}
                    color="dark"
                    borderRadius={1}
                    fontSize={20}
                    display="flex"
                    backgroundColor="white!important"
                    justifyContent="center"
                  >
                    Active Activation Program
                  </MDTypography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        display="flex"
                        justifyContent="center"
                      >
                        Activation Program Name
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        style={{ fontWeight: 600 }}
                        display="flex"
                        backgroundColor="grey!important"
                        borderRadius={1}
                        justifyContent="center"
                      >
                        {program?.activationProgramName}
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        display="flex"
                        justifyContent="center"
                      >
                        Activation Program Start Date
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        style={{ fontWeight: 600 }}
                        display="flex"
                        backgroundColor="grey!important"
                        borderRadius={1}
                        justifyContent="center"
                      >
                        {ConvertDate(program?.activationProgramStartDate)}
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        display="flex"
                        justifyContent="center"
                      >
                        Activation Program End Date
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        style={{ fontWeight: 600 }}
                        display="flex"
                        backgroundColor="grey!important"
                        borderRadius={1}
                        justifyContent="center"
                      >
                        {ConvertDate(program?.activationProgramEndDate)}
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        display="flex"
                        justifyContent="center"
                      >
                        Reward Per Activation
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        style={{ fontWeight: 600 }}
                        display="flex"
                        backgroundColor="grey!important"
                        borderRadius={1}
                        justifyContent="center"
                      >
                        {program?.rewardPeractivation}
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        display="flex"
                        justifyContent="center"
                      >
                        Currency
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        style={{ fontWeight: 600 }}
                        display="flex"
                        backgroundColor="grey!important"
                        borderRadius={1}
                        justifyContent="center"
                      >
                        {program?.currency}
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        display="flex"
                        justifyContent="center"
                      >
                        Activation Program Status
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        style={{ fontWeight: 600 }}
                        display="flex"
                        backgroundColor="grey!important"
                        borderRadius={1}
                        justifyContent="center"
                      >
                        {program?.status}
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} mb={2}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        display="flex"
                        justifyContent="center"
                      >
                        Description
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        style={{ fontWeight: 600 }}
                        display="flex"
                        backgroundColor="grey!important"
                        borderRadius={1}
                        minHeight={35}
                        justifyContent="center"
                      >
                        {program?.description}
                      </MDTypography>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <MDBox
              bgColor="dark"
              borderRadius={5}
              variant="contained"
              style={{ minWidth: "100%", minHeight: "auto" }}
            >
              <MDBox>
                <MDBox
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <MDTypography
                    p={1}
                    m={2}
                    color="dark"
                    fontSize={20}
                    display="flex"
                    borderRadius={1}
                    backgroundColor="white!important"
                    justifyContent="center"
                  >
                    Activation Program Performance
                  </MDTypography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        display="flex"
                        justifyContent="center"
                      >
                        Users Invited (By Email)
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        style={{ fontWeight: 600 }}
                        display="flex"
                        backgroundColor="grey!important"
                        borderRadius={1}
                        justifyContent="center"
                      >
                        10000
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        display="flex"
                        justifyContent="center"
                      >
                        Users Invited (By Mobile)
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        style={{ fontWeight: 600 }}
                        display="flex"
                        backgroundColor="grey!important"
                        borderRadius={1}
                        justifyContent="center"
                      >
                        10000
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        display="flex"
                        justifyContent="center"
                      >
                        Users Invited (By Mobile & Email)
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        style={{ fontWeight: 600 }}
                        display="flex"
                        backgroundColor="grey!important"
                        borderRadius={1}
                        justifyContent="center"
                      >
                        10000
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        display="flex"
                        justifyContent="center"
                      >
                        Users Invited (Total)
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        style={{ fontWeight: 600 }}
                        display="flex"
                        backgroundColor="grey!important"
                        borderRadius={1}
                        justifyContent="center"
                      >
                        10000
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        display="flex"
                        justifyContent="center"
                      >
                        Users Joined (Total)
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="warning"
                        fontSize={13}
                        style={{ fontWeight: 600 }}
                        display="flex"
                        backgroundColor="grey!important"
                        borderRadius={1}
                        justifyContent="center"
                      >
                        {totalUsers}
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        display="flex"
                        justifyContent="center"
                      >
                        Conversion(%)
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        style={{ fontWeight: 600 }}
                        display="flex"
                        backgroundColor="grey!important"
                        borderRadius={1}
                        justifyContent="center"
                      >
                        60%
                      </MDTypography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="light"
                        fontSize={13}
                        display="flex"
                        justifyContent="center"
                      >
                        Activation Bonus Payout (INR)
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} mb={2}>
                      <MDTypography
                        p={1}
                        ml={2}
                        mr={2}
                        color="warning"
                        fontSize={13}
                        style={{ fontWeight: 600 }}
                        display="flex"
                        backgroundColor="grey!important"
                        borderRadius={1}
                        justifyContent="center"
                      >
                        {totalUsers * program?.rewardPeractivation}
                      </MDTypography>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default ActivationHomePage;
