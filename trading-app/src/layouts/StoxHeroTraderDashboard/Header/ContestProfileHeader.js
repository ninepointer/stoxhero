import { useState, useEffect, useContext } from "react";
import { useRef, useCallback } from "react";
import axios from "axios";
import MDBox from "../../../components/MDBox";
import Grid from "@mui/material/Grid";
import { userContext } from "../../../AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactGA from "react-ga";
import ContestProfile from "../data/contestProfile";
import { CircularProgress } from "@mui/material";

export default function Dashboard() {
  const location = useLocation();
  const userData = location?.state?.data;
  console.log("User Data:", userData);
  let baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";
  let [contestProfile, setContestProfile] = useState([]);
  let [dataLength, setDataLength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tradingData, setTradingData] = useState();
  const getDetails = useContext(userContext);
  const userId = getDetails.userDetails._id;

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
    capturePageView();
  }, []);
  let page = "ZoneProfile";
  let pageLink = window.location.pathname;
  async function capturePageView() {
    await fetch(`${baseUrl}api/v1/pageview/${page}${pageLink}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
  }

  useEffect(() => {
    setIsLoading(true);
    let call4 = axios.get(
      `${baseUrl}api/v1/dailycontest/contestprofile/${userData?.trader}`,
      {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      }
    );
    Promise.all([call4])
      .then(([api1Response3]) => {
        setContestProfile(api1Response3?.data?.data);
        setDataLength(api1Response3?.data?.length);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  return (
    <MDBox
      bgColor="light"
      color="light"
      mt={2}
      mb={1}
      borderRadius={10}
      minHeight="auto"
      width="100%"
    >
      <Grid
        container
        spacing={0.75}
        xs={12}
        md={12}
        lg={12}
        display="flex"
        justifyContent="space-between"
        alignItems="start"
        flexDirection="row"
      >
        <Grid item xs={12} md={12} lg={12} mt={1}>
          {!isLoading ? (
            <MDBox style={{ backgroundColor: "white", borderRadius: 5 }}>
              <ContestProfile
                contestProfile={contestProfile}
                dataLength={dataLength}
              />
            </MDBox>
          ) : (
            <MDBox
              mt={5}
              mb={5}
              display="flex"
              justifyContent="center"
              style={{ borderRadius: 5 }}
            >
              <CircularProgress color="info" />
            </MDBox>
          )}
        </Grid>
      </Grid>
    </MDBox>
  );
}
