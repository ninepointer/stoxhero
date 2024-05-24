import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ReactGA from "react-ga";
import { Paper, Avatar, Box, Divider, CircularProgress } from "@mui/material";

// import {Grid} from '@mui/material'
import MDTypography from "../../../components/MDTypography";
import MDBox from "../../../components/MDBox";
// import MDAvatar from '../../../components/MDAvatar';
import logo from "../../../assets/images/logo1.jpeg";
import { userContext } from "../../../AuthContext";

const Scoreboard = () => {
  let baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";
  // const [sortedTraders, setSortedTraders] = useState([]);
  const [traders, setTraders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getDetails = useContext(userContext);
  // function convertName(name){
  //   // const name = 'SARTHAK SINGHAL';

  //   const cname = name
  //     .toLowerCase()
  //     .split(' ')
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(' ');

  //   return cname;
  // };

  useEffect(() => {
    setIsLoading(true);
    let call1 = axios.get(`${baseUrl}api/v1/contestscoreboard/scoreboard`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
    Promise.all([call1])
      .then(([api1Response]) => {
        // Process the responses here
        setTraders(api1Response.data.data);
        ReactGA.pageview(window.location.pathname);
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      })
      .catch((error) => {
        // Handle errors here
        setIsLoading(true);
      });

    window.webengage.track("marginx_leaderboard_clicked", {
      user: getDetails?.userDetails?._id,
    });
  }, []);

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
            MarginX Leaderboard
          </MDTypography>
        </MDBox>
      </MDBox>
      {isLoading ? (
        <MDBox mt={10} minHeight="30vH">
          <CircularProgress color="info" />
        </MDBox>
      ) : (
        <MDBox
          p={5}
          display="flex"
          justifyContent="center"
          alignItems="center"
          border="2px solid grey"
          minWidth="100%"
        >
          <MDTypography
            fontSize={15}
            fontWeight="bold"
            color="light"
            style={{ textAlign: "center" }}
          >
            Coming Soon
          </MDTypography>
        </MDBox>
      )}
    </Box>
  );
};

export default Scoreboard;
