import React, { useEffect, useState, useContext } from "react";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import ReactGA from "react-ga";
import { Card, CircularProgress, formLabelClasses } from "@mui/material";
import { Grid, Input, TextField } from "@mui/material";
import theme from "../utils/theme/index";
import { ThemeProvider } from "styled-components";
import Navbar from "../components/Navbars/Navbar";
import Footer from "../components/Footers/Footer";
import MDTypography from "../../../components/MDTypography";
import MDSnackbar from "../../../components/MDSnackbar";
import axios from "axios";
import logo from "../../../assets/images/fulllogo.png";
import playstore from "../../../assets/images/playstore.png";
import careerpage from "../../../assets/images/contestregistration.png";
import { useLocation } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { apiUrl } from "../../../constants/constants";
import { userContext } from "../../../AuthContext";
import { Autocomplete } from "@mui/material";
import moment from "moment";
import { Helmet } from "react-helmet";
import DataTable from "../../../examples/Tables/DataTable";
import SignupLoginPopup from "./courses/signupLoginPopup"
import { useMediaQuery } from "@mui/material";
// import theme from '../utils/theme/index';


function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

const FeaturedContestRegistration = () => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [otpGenerated, setOTPGenerated] = useState(false);
  const [contestDetails, setContestDetails] = useState(false);
  const location = useLocation();
  const contest = location?.state?.data;
  let campaignCode = location?.state?.campaignCode;
  const params = new URLSearchParams(location?.search);
  const referrerCode = params.get("referral");
  campaignCode = params.get("campaigncode");

  const newReferrerCode = campaignCode ? campaignCode : referrerCode;

  let columns = [
    { Header: "# Rank", accessor: "rank", align: "center" },
    { Header: "Reward", accessor: "reward", align: "center" },
  ];

  let rows = [];

  const [detail, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    contest: contest?._id || contestDetails?._id,
    campaignCode: campaignCode,
    mobile_otp: "",
    referrerCode: referrerCode,
  });


  const getContestDetails = async (name, date) => {
    try {
      const res = await axios.get(
        `${apiUrl}dailycontest/featured/findbyname?name=${name}&date=${date}`
      );
      setContestDetails(res?.data?.data);
      setDetails((prev) => ({ ...prev, contest: res?.data?.data?._id }));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!contest) {
      const url = location?.pathname?.split("/");
      const name = decodeURIComponent(url[2]);
      const date = url[3];
      getContestDetails(name, date);
    }
    window.webengage.track("featuredTestzone_registration_clicked", {});
  }, []);

  const [successSB, setSuccessSB] = useState(false);
  const [msgDetail, setMsgDetail] = useState({
    title: "",
    content: "",
    color: "",
    icon: "",
  });

  const closeSuccessSB = () => {
    setSuccessSB(false);
  };

  const renderSuccessSB = (
    <MDSnackbar
      color={msgDetail.color}
      icon={msgDetail.icon}
      title={msgDetail.title}
      content={msgDetail.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
    />
  );

  // const [checkUserExist, setCheckUserExist] = useState(true);

  contestDetails.rewards?.map((elem) => {
    let featureObj = {};

    featureObj.rank = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {Number(elem?.rankStart) === Number(elem?.rankEnd)
          ? Number(elem?.rankStart)
          : `${Number(elem?.rankStart)}-${Number(elem?.rankEnd)}`}
      </MDTypography>
    );
    featureObj.reward = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {contestDetails?.rewardType === "Goodies"
          ? `${elem?.prize} (Worth ₹${elem?.prizeValue})`
          : `₹${elem?.prize}`}
      </MDTypography>
    );

    rows.push(featureObj);
  });

  let cap;
  if (contestDetails?.entryFee > 0) {
    cap = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(
      (contestDetails?.entryFee *
        (contestDetails?.payoutCapPercentage ?? 1000)) /
      100
    );
  } else {
    cap = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(
      (contestDetails?.portfolio?.portfolioValue *
        (contestDetails?.payoutCapPercentage ?? 10)) /
      100
    );
  }

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));


  return (
    <MDBox
      display="flex"
      justifyContent="center"
      alignContent="center"
      alignItems="center"
      style={{
        backgroundColor: "white",
        minHeight: "100vH",
        height: "auto",
        width: "auto",
        minWidth: "100vW",
      }}
    >
      <ThemeProvider theme={theme}>
        <Navbar />
        <Grid
          mt={10}
          display="flex"
          justifyContent="center"
          alignContent="center"
          alignItems="center"
          container
          xs={12}
          md={12}
          lg={12}
        >
          <Grid
            item
            xs={12}
            md={12}
            lg={6}
            display="flex"
            justifyContent="flex-end"
            // alignContent="center"
            // alignItems="center"
            flexDirection={'column'}
          >
            <Grid
              container
              xs={12}
              md={12}
              lg={12}
              display="flex"
              justifyContent="center"
              alignContent="center"
              alignItems="center"
            >

              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                pl={5}
                pr={5}
                pb={2}
                display="flex"
                justifyContent="center"
                alignContent="center"
                alignItems="center"
              >
                <MDBox
                  component="form"
                  role="form"
                  borderRadius={10}
                  style={{
                    backgroundColor: "white",
                    // height: '100vh',
                    width: "100%",
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)", // Add box shadow
                  }}
                  display="flex"
                  justifyContent="center"
                  alignContent="center"
                  alignItems="center"
                >
                  <Grid
                    container
                    xs={12}
                    md={12}
                    xl={12}
                    pt={1}
                    pb={1}
                    mt={-20}
                    display="flex"
                    justifyContent="center"
                    alignContent="center"
                    alignItems="center"
                    style={{ width: "90%" }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={12}
                      xl={12}
                      pl={2}
                      pr={2}
                      mb={1}
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                    >
                      <MDTypography
                        fontSize={15}
                        fontColor="dark"
                        fontWeight="bold"
                        sx={{ textAlign: "center" }}
                      >
                        🚀 Announcing{" "}
                        {contest
                          ? contest?.contestName
                          : contestDetails?.contestName}{" "}
                        Trading TestZone 🚀
                      </MDTypography>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={12}
                      xl={12}
                      pl={2}
                      pr={2}
                      mb={1}
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                    >
                      <MDTypography
                        fontSize={13}
                        fontColor="dark"
                        fontWeight="bold"
                        sx={{ textAlign: "center" }}
                      >
                        💰 Your Gateway to Stock Market Success! 💰
                      </MDTypography>
                    </Grid>

                    {(contest?.entryFee || contestDetails?.entryFee) && <Grid
                          item
                          xs={12}
                          md={12}
                          xl={12}
                          p={1}
                          display="flex"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                        >
                          <MDTypography
                            fontSize={15}
                            fontColor="dark"
                            fontWeight="bold"
                          >
                            💸 Entry Fee:{" "}
                            {contest
                              ? contest?.entryFee
                              : contestDetails?.entryFee}
                          </MDTypography>
                        </Grid>}

                    <Grid
                      item
                      xs={12}
                      md={12}
                      xl={6}
                      pl={2}
                      pr={2}
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                    >
                      <MDTypography
                        fontSize={12}
                        fontColor="dark"
                        fontWeight="bold"
                      >
                        🕒 Start:{" "}
                        {moment
                          .utc(
                            contest
                              ? contest?.contestStartTime
                              : contestDetails?.contestStartTime
                          )
                          .utcOffset("+05:30")
                          .format("DD-MMM-YY hh:mm a")}
                      </MDTypography>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={12}
                      xl={6}
                      pl={2}
                      pr={2}
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                    >
                      <MDTypography
                        fontSize={12}
                        fontColor="dark"
                        fontWeight="bold"
                      >
                        💰 Virtual Margin Money: ₹
                        {(contest
                          ? contest?.portfolio?.portfolioValue
                          : contestDetails?.portfolio?.portfolioValue
                        )?.toLocaleString()}
                      </MDTypography>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={12}
                      xl={6}
                      pl={2}
                      pr={2}
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                    >
                      <MDTypography
                        fontSize={12}
                        fontColor="dark"
                        fontWeight="bold"
                      >
                        🕒 End:{" "}
                        {moment
                          .utc(
                            contest
                              ? contest?.contestEndTime
                              : contestDetails?.contestEndTime
                          )
                          .utcOffset("+05:30")
                          .format("DD-MMM-YY hh:mm a")}
                      </MDTypography>
                    </Grid>



                    {contestDetails?.payoutType === "Percentage" ? (
                      <>
                        <Grid
                          item
                          xs={12}
                          md={12}
                          xl={6}
                          pl={2}
                          pr={2}
                          display="flex"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                        >
                          <MDTypography
                            fontSize={12}
                            fontColor="dark"
                            fontWeight="bold"
                          >
                            🏆 Reward :{" "}
                            {contestDetails?.entryFee > 0
                              ? `${contestDetails?.payoutPercentage
                              }% of the net P&L${contestDetails?.payoutCapPercentage
                                ? `(upto ₹${cap})`
                                : ""
                              }`
                              : `${contestDetails?.payoutPercentage
                              }% of the net P&L${contestDetails?.payoutCapPercentage
                                ? `(upto ₹${cap})`
                                : ""
                              }`}
                          </MDTypography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={12}
                          xl={12}
                          pl={2}
                          pr={2}
                          mt={1}
                          display="flex"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                        >
                          <MDTypography
                            fontSize={12}
                            fontColor="dark"
                            fontWeight="bold"
                            sx={{ textAlign: "center" }}
                          >
                            Rewards will be based on your net Profit and Loss
                            during the TestZone period. So, bigger the P&L, the
                            bigger you can earn!
                          </MDTypography>
                        </Grid>

                      </>
                    ) : (
                      <>
                        <Grid
                          item
                          xs={12}
                          md={12}
                          xl={6}
                          pl={2}
                          pr={2}
                          display="flex"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                        >
                          <MDTypography
                            fontSize={12}
                            fontColor="dark"
                            fontWeight="bold"
                          >
                            🏆 Reward : Exciting prizes for top rankers
                          </MDTypography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={12}
                          xl={12}
                          pl={2}
                          pr={2}
                          mt={1}
                          display="flex"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                        >
                          <MDTypography
                            fontSize={12}
                            fontColor="dark"
                            fontWeight="bold"
                            sx={{ textAlign: "center" }}
                          >
                            Rewards will be based on your rank during the
                            TestZone period.
                          </MDTypography>
                        </Grid>

                        

                        <Grid
                          item
                          xs={12}
                          md={12}
                          xl={12}
                          lg={12}
                          mt={1}
                          mb={1}
                          display="flex"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                        >
                          <MDBox width="100%" xl={12}>
                            <MDBox
                              width="100%"
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              sx={{
                                backgroundColor: "#315C45",
                                borderRadius: "2px",
                              }}
                            >
                              <MDTypography
                                variant="text"
                                fontSize={12}
                                color="white"
                                mt={0.7}
                                alignItems="center"
                                gutterBottom
                              >
                                Reward Table
                              </MDTypography>
                            </MDBox>
                            <MDBox mt={1}>
                              <DataTable
                                table={{ columns, rows }}
                                showTotalEntries={false}
                                isSorted={false}
                                entriesPerPage={false}
                              />
                            </MDBox>
                          </MDBox>
                        </Grid>
                       
                      </>
                    )}
                  </Grid>


                </MDBox>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={1}
              xs={12}
              md={12}
              lg={12}
              display="flex"
              justifyContent={
                isMobile ? "center" : "flex-end"
              }
              alignContent="center"
              alignItems={
                isMobile ? "center" : "flex-end"
              }
            >
              <Grid
                item
                xs={12}
                md={12}
                lg={4}
                pr={4}
                display="flex"
                justifyContent={
                  isMobile ? "center" : "flex-end"
                }
                alignContent="center"
                alignItems={
                  isMobile ? "center" : "flex-end"
                }
              >
                <SignupLoginPopup
                data={contestDetails} testzone={true} referrerCode={newReferrerCode}
                />
              </Grid>

            </Grid>

          </Grid>

          <Grid
            item
            xs={12}
            md={12}
            lg={6}
            display="flex"
            justifyContent="center"
            alignContent="center"
            alignItems="center"
            style={{ width: "100%" }}
          >
            <Grid
              container
              xs={12}
              md={12}
              lg={12}
              pl={1}
              pr={1}
              display="flex"
              justifyContent="center"
              alignContent="center"
              alignItems="center"
              style={{ width: "100%" }}
            >
              <MDBox
                display="flex"
                justifyContent="center"
                alignContent="center"
                alignItems="center"
                style={{ width: "100%" }}
              >
                <img
                  src={careerpage}
                  style={{
                    maxWidth: "80%",
                    maxHeight: "80%",
                    width: "auto",
                    height: "auto",
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
      {renderSuccessSB}
    </MDBox>
  );
};

export default FeaturedContestRegistration;
