
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { CircularProgress, Grid } from "@mui/material";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import { Link } from "react-router-dom";
import AffiliateOverview from "../mainData";
import IndividualAffiliate from "../../myAffiliateDashboard/Header";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

export default function LabTabs() {
  const [value, setValue] = React.useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [clicked, setClicked] = useState("overview");

  const handleChange = (event, newValue) => {
    setIsLoading(true);
    setValue(newValue);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleClick = (e) => {
    console.log(e);
    setClicked(e);
  };

  return (
    <MDBox
      mt={1}
      display="flex"
      justifyContent="center"
      flexDirection="column"
      mb={1}
      borderRadius={10}
      minHeight="auto"
      width="100%"
    >
      <MDBox
        mt={0}
        mb={1}
        p={0.5}
        minWidth="100%"
        bgColor="light"
        minHeight="auto"
        display="flex"
        justifyContent="center"
        borderRadius={7}
      >
        <Grid container spacing={1} xs={12} md={12} lg={12} minWidth="100%">
          <Grid
            item
            xs={12}
            md={4}
            lg={6}
            display="flex"
            justifyContent="center"
          >
            <MDButton
              bgColor="dark"
              color={clicked == "overview" ? "success" : "secondary"}
              size="small"
              style={{ minWidth: "100%" }}
              onClick={() => {
                handleClick("overview");
              }}
            >
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <MDBox
                  display="flex"
                  color="light"
                  justifyContent="center"
                  alignItems="center"
                >
                  {/* <RemoveRedEyeIcon /> */}
                </MDBox>
                <MDBox
                  display="flex"
                  color="light"
                  justifyContent="center"
                  alignItems="center"
                >
                  Affiliate Overview
                </MDBox>
              </MDBox>
            </MDButton>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            lg={6}
            display="flex"
            justifyContent="center"
          >
            <MDButton
              bgColor="dark"
              color={clicked == "individual" ? "success" : "secondary"}
              size="small"
              style={{ minWidth: "100%" }}
              onClick={() => {
                handleClick("individual");
              }}
            >
              <MDBox display="flex" justifyContent="center" alignItems="center">
                <MDBox
                  display="flex"
                  color="light"
                  justifyContent="center"
                  alignItems="center"
                >
                  {/* <RemoveRedEyeIcon /> */}
                </MDBox>
                <MDBox
                  display="flex"
                  color="light"
                  justifyContent="center"
                  alignItems="center"
                >
                  Individual Affiliate
                </MDBox>
              </MDBox>
            </MDButton>
          </Grid>
        </Grid>
      </MDBox>

      {isLoading ? (
        <MDBox
          mt={10}
          mb={10}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress color="light" />
        </MDBox>
      ) : (
        <>
          <MDBox>
            <Grid
              container
              xs={12}
              md={12}
              lg={12}
              display="flex"
              justifyContent="center"
            >
              <Grid
                item
                xs={12}
                md={6}
                lg={12}
                display="flex"
                justifyContent="center"
              >
                {clicked === "overview" ? (
                  <>
                    <AffiliateOverview setClicked={setClicked} />
                  </>
                ) : clicked === "individual" ? (
                  <>
                    <IndividualAffiliate setClicked={setClicked} />
                  </>
                ) : (
                  <>{/* <PastBattles/> */}</>
                )}
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </MDBox>
  );
}
