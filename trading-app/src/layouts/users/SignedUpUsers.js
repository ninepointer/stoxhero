import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import DataTable from "../../examples/Tables/DataTable";
import SignedUpUserData from "./data/SignedUpUserData";

const SignedUpUser = () => {
  const { columns, rows } = SignedUpUserData();

  let baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";

  const [signedUpUserData, setSignedUpUserData] = useState([]);
  const [reRender, setReRender] = useState(true);

  useEffect(() => {
    axios
      .get(`${baseUrl}api/v1/signedupusers`, { withCredentials: true })
      .then((res) => {
        setSignedUpUserData(res.data);
      })
      .catch((err) => {
        return new Error(err);
      });
  }, [reRender]);


  signedUpUserData.map((elem) => {
    let signedupusers = {};


    signedupusers.name = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem.first_name} {elem.last_name}
      </MDTypography>
    );

    signedupusers.email = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem.email}
      </MDTypography>
    );
    signedupusers.mobile = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem.mobile}
      </MDTypography>
    );

    // signedupusers.status = (
    //   <MDTypography
    //     component="a"
    //     variant="caption"
    //     color="text"
    //     fontWeight="medium"
    //   >
    //     {elem.status}
    //   </MDTypography>
    // );

    rows.push(signedupusers);
  });

  return (
    <>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={1}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <MDTypography variant="h6" color="white" py={1}>
                  Signed Up User Details
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </>
  );
};

export default SignedUpUser;
