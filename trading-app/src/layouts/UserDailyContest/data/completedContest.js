import React, { useState, useEffect, useContext } from "react";
// import ReactGA from "react-ga"
import { CircularProgress, Divider, Grid } from "@mui/material";
import MDBox from "../../../components/MDBox";
// import MyPortfolio from '../data/Portfolios'
// import TenXPortfolio from '../data/TenXPortfolio'
import MDTypography from "../../../components/MDTypography";
import FreeContest from "../Header/completedContest/freeCompleted";
import PaidContest from "../Header/completedContest/paidCompeted";
// import MDButton from '../../../components/MDButton';
// import { Link } from "react-router-dom"
import axios from "axios";
import { userContext } from "../../../AuthContext";
import { apiUrl } from "../../../constants/constants";

export default function LabTabs() {
  let baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";
  const [isLoading, setIsLoading] = useState(false);
  const [contest, setContest] = useState([]);
  const [paidTestzone, setPaidTestzone] = useState([]);
  const [freeTestzone, setFreeTestzone] = useState([]);
  const getDetails = useContext(userContext);

  useEffect(() => {
    setIsLoading(true);
    window.webengage.track("completed_testzone_clicked", {
      user: getDetails?.userDetails?._id,
    });
    fetchData();
    setIsLoading(false);
  }, []);

  async function fetchData() {
    const data = await axios.get(`${apiUrl}dailycontest/user/paidcompleted`, {
      withCredentials: true,
    });
    setPaidTestzone(data?.data?.data);

    const data1 = await axios.get(`${apiUrl}dailycontest/user/freecompleted`, {
      withCredentials: true,
    });
    setFreeTestzone(data1?.data?.data);
  }

  return (
    <MDBox
      bgColor="dark"
      color="light"
      mb={1}
      p={0}
      borderRadius={10}
      minHeight="auto"
    >
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
        <>
          <Grid container xs={12} md={12} lg={12} display="flex">
            <Grid item xs={12} md={6} lg={12}>
              <MDTypography
                color="light"
                fontSize={15}
                ml={0.5}
                fontWeight="bold"
              >
                Paid TestZone(s)
              </MDTypography>
              {paidTestzone?.length > 0 ? (
                <PaidContest contest={paidTestzone} />
              ) : (
                <MDBox
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <MDBox
                    ml={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CircularProgress color="light" />
                  </MDBox>
                </MDBox>
              )}
            </Grid>

            <Divider style={{ backgroundColor: "light" }} />

            <Grid item xs={12} md={6} lg={12}>
              <MDBox style={{ minWidth: "100%" }}>
                <MDTypography
                  color="light"
                  fontSize={15}
                  ml={0.5}
                  fontWeight="bold"
                >
                  Free TestZone(s)
                </MDTypography>
                {freeTestzone?.length > 0 ? (
                  <FreeContest contest={freeTestzone} />
                ) : (
                  <MDBox
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <MDBox
                      ml={1}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <CircularProgress color="light" />
                    </MDBox>
                  </MDBox>
                )}
              </MDBox>
            </Grid>
          </Grid>
        </>
      )}
    </MDBox>
  );
}
