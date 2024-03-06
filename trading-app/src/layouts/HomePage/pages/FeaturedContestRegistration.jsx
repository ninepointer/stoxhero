import React, { useEffect, useState, useContext } from "react";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import ReactGA from "react-ga";
import { Card, CircularProgress, formLabelClasses } from "@mui/material";
import { Grid, Input, TextField } from "@mui/material";
import theme from "../utils/theme/index";
import { ThemeProvider } from "styled-components";
import { useMediaQuery } from "@mui/material";
import FinNavbar from "../components/Navbars/FinNavBar";
import Footer from "../components/Footers/Footer";
import MDTypography from "../../../components/MDTypography";
import MDSnackbar from "../../../components/MDSnackbar";
import axios from "axios";
import playstore from "../../../assets/images/playstore.png";
import careerpage from "../../../assets/images/contestregistration.png";
import contestimage from "../../../assets/images/tbb1.png";
import champions from "../../../assets/images/champions.png";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { apiUrl } from "../../../constants/constants";
import { userContext } from "../../../AuthContext";
import { Autocomplete } from "@mui/material";
import moment from "moment";
import { Helmet } from "react-helmet";
import DataTable from "../../../examples/Tables/DataTable";
import leaderboard from "../../../assets/images/leaderboardposition.png";
import realtime from "../../../assets/images/realtime.png";
import reward from "../../../assets/images/reward.png";
import ChartBar from "../../../assets/images/Chart Bar Presentation.png";
import ChartBarUp from "../../../assets/images/Chart Bar Up.png";
import Videoplay from "../../../assets/images/Video Play.png";
import Lightbulb from "../../../assets/images/Light Bulb Check.png";
import SignupLoginPopup from "./courses/signupLoginPopup";

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
  // const [saving, setSaving] = useState(false);
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
  const couponReferrerCode = referrerCode ? referrerCode : "";
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

  const getContestDetails = async (slug) => {
    try {
      const res = await axios.get(
        `${apiUrl}dailycontest/featured/findbyname?name=${slug}`
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
      const slug = decodeURIComponent(url[2]);
      // const date = url[3];
      getContestDetails(slug);
    }
    window.webengage.track("featuredTestzone_registration_clicked", {});
  }, []);

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const [successSB, setSuccessSB] = useState(false);
  const [msgDetail, setMsgDetail] = useState({
    title: "",
    content: "",
    // successSB: false,
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

  //price pool worth rs. 800000
  let totalRewardWorth = 0;
  contestDetails.rewards?.map((elem) => {
    let featureObj = {};
    console.log(
      "reward",
      elem?.rankEnd,
      elem?.rankStart,
      Number(elem?.prizeValue)
    );
    totalRewardWorth +=
      (elem?.rankEnd - elem?.rankStart + 1) * Number(elem?.prizeValue);
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
        {contestDetails?.rewardType != "Goodies"
          ? `₹${elem?.prize}`
          : `${elem?.prize}`}
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

  function dateConvert(dateConvert) {
    const dateString = dateConvert || new Date();
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );

    // get day of month and add ordinal suffix
    const dayOfMonth = date.getDate();
    let suffix = "th";
    if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
      suffix = "st";
    } else if (dayOfMonth === 2 || dayOfMonth === 22) {
      suffix = "nd";
    } else if (dayOfMonth === 3 || dayOfMonth === 23) {
      suffix = "rd";
    }

    // combine date and time string with suffix
    const finalFormattedDate = `${dayOfMonth}${suffix} ${
      formattedDate?.split(" ")[0]
    }, ${date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}`;

    // console.log(finalFormattedDate); // Output: "3rd April, 9:27 PM"

    return finalFormattedDate;
  }

  return (
    <MDBox
      display="flex"
      justifyContent="center"
      alignContent="center"
      alignItems="center"
      style={{
        backgroundColor: "#171715",
        minHeight: "100vH",
        height: "auto",
        width: "auto",
        minWidth: "100vW",
      }}
    >
      <ThemeProvider theme={theme}>
        <FinNavbar />
        <Helmet>
          <title>{contestDetails?.metaTitle}</title>
          <meta name="description" content={contestDetails?.metaDescription} />
          <meta name="keywords" content={contestDetails?.metaKeyword} />
        </Helmet>
        <Grid
          mt={1}
          display="flex"
          justifyContent="center"
          alignContent="center"
          alignItems="center"
          container
          xs={12}
          md={12}
          lg={12}
          mb={5}
        >
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            display="flex"
            justifyContent="center"
            alignContent="center"
            alignItems="center"
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
                display="flex"
                justifyContent="center"
                alignContent="center"
                alignItems="center"
              >
                <MDBox
                  component="form"
                  role="form"
                  borderRadius={10}
                  // style={{
                  //   backgroundColor: "white",
                  //   // height: '100vh',
                  //   width: "100%",
                  //   boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)", // Add box shadow
                  // }}
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
                      mt={"120px"}
                      ml={"208px"}
                      mr={"208px"}
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                    >
                      <img
                        src={contestDetails?.image}
                        width={isMobile ? "384px" : "1024px"}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={12}
                      xl={12}
                      mt={5}
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
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
                          display="flex"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                        >
                          <MDTypography
                            variant={isMobile ? "body3" : "h3"}
                            fontWeight="bold"
                            sx={{
                              textAlign: "center",
                              fontFamily: "Work Sans , sans-serif",
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                              color: "white",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                alignContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  borderRadius: "50%",
                                  width: "16px",
                                  height: "16px",
                                  backgroundColor: "#E6F495",
                                  marginRight: "10px",
                                }}
                              ></div>
                              <span
                                style={{
                                  color: "white",
                                  fontSize: "40px",
                                  fontWeight: 600,
                                }}
                              >
                                Trading Competition begins on
                              </span>
                              <div
                                style={{
                                  borderRadius: "50%",
                                  width: "16px",
                                  height: "16px",
                                  backgroundColor: "#E6F495",
                                  marginLeft: "10px",
                                }}
                              ></div>
                            </div>
                          </MDTypography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={12}
                          lg={12}
                          display="flex"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                        >
                          <MDTypography
                            variant={isMobile ? "caption" : "body1"}
                            fontWeight="bold"
                            style={{
                              textAlign: "center",
                              fontFamily: "Work Sans , sans-serif",
                              fontSize: "28px",
                              fontWeight: 400,
                              color: "white",
                            }}
                          >
                            {`${dateConvert(
                              contestDetails?.contestStartTime
                            )} | ${dateConvert(
                              contestDetails?.contestEndTime
                            )}`}
                            {/* 20th March 2024, 9:30 AM | 27th March 3:20 PM */}
                          </MDTypography>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* <Grid
                      item
                      xs={12}
                      md={12}
                      xl={6}
                      mt={2}
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                    >
                      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' flexDirection='column'>

                        <MDBox mt={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'><MDTypography variant='caption'>{
                          <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                            <MDTypography
                              variant="body2"
                              fontWeight={800}

                              fontSize={15}
                              style={{
                                color: '#532B9E',
                                textDecoration: "line-through",
                              }}
                            >
                              Registration Fee : &nbsp;
                            </MDTypography>
                            <MDTypography
                              variant="body2"
                              fontWeight="normal"

                              fontSize={15}
                              style={{
                                color: '#532B9E',
                                textDecoration: "line-through",
                              }}
                            >

                              ₹{new Intl.NumberFormat(
                                undefined,
                                {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                }
                              ).format(contestDetails?.entryFee)}
                            </MDTypography>
                            &nbsp;
                            <MDTypography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ color: '#532B9E' }}
                              fontSize={18}
                            >

                              ₹{new Intl.NumberFormat(
                                undefined,
                                {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                }
                              ).format(contestDetails?.discountedEntryFee)}
                            </MDTypography>
                          </MDBox>
                        }</MDTypography></MDBox>
                      </MDBox>
                    </Grid> */}

                    <Grid
                      item
                      xs={12}
                      md={12}
                      xl={6}
                      mt={2}
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                    >
                      <MDBox
                        display="flex"
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center"
                        flexDirection="column"
                      >
                        {/* <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center'><MDButton variant='contained' color='success' size={isMobile ? 'small' : 'large'}>Register Now(₹200/-)</MDButton></MDBox> */}
                        <SignupLoginPopup
                          data={contestDetails}
                          testzone={true}
                          referrerCode={couponReferrerCode}
                        />
                        <MDBox
                          mt={1}
                          display="flex"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                          style={{ color: "white" }}
                        >
                          <MDTypography
                            variant="caption"
                            style={{
                              fontSize: "14px",
                              fontWeight: 300,
                              lineHeight: "16.42px",
                              color: "white",
                              fontFamily: "Work Sans , sans-serif",
                            }}
                          >
                            *limited seats only. Hurry Up!
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={12}
                      xl={12}
                      mt={5}
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                    >
                      <Grid
                        container
                        mt="40px"
                        xs={12}
                        md={12}
                        lg={12}
                        display="flex"
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center"
                        style={{
                          maxWidth: "75%",
                          backgroundColor: "#343434",
                          height: "381px",
                          width: "1078px",
                          borderRadius: "20px",
                        }}
                      >
                        <Grid
                          item
                          xs={12}
                          md={12}
                          lg={12}
                          display="flex"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                        >
                          <MDTypography
                            variant={isMobile ? "body3" : "h3"}
                            style={{
                              textAlign: "center",
                              fontFamily: "Work Sans , sans-serif",
                              color: "white",
                              fontSize: "40px",
                              fontWeight: 600,
                            }}
                          >
                            Why you can't miss this!
                          </MDTypography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={12}
                          lg={12}
                          display="flex"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                        >
                          <Grid
                            container
                            spacing={2}
                            mt={3}
                            xs={12}
                            md={12}
                            lg={12}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            alignContent="center"
                            style={{ minWidth: "100%" }}
                          >
                            <Grid
                              item
                              xs={12}
                              md={12}
                              lg={4}
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              alignContent="center"
                            >
                              <MDBox
                                display="flex"
                                justifyContent="center"
                                flexDirection="column"
                                alignItems="center"
                                alignContent="center"
                                style={{ minWidth: "100%" }}
                              >
                                <MDBox>
                                  <img
                                    src={reward}
                                    alt="Reward"
                                    width={isMobile ? "80px" : "128px"}
                                  />
                                </MDBox>
                                <MDBox>
                                  <MDTypography
                                    variant="body1"
                                    fontWeight="bold"
                                    style={{
                                      fontFamily: "Work Sans , sans-serif",
                                      color: "white",
                                      textAlign: "center",
                                      fontWeight: 400,
                                      fontSize: "28px",
                                    }}
                                  >
                                    {/* {`Prize pool worth <br /> ₹${new Intl.NumberFormat(undefined, {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    }).format(totalRewardWorth)}`} */}
                                    <>
                                      Prize pool worth <br /> ₹
                                      {new Intl.NumberFormat(undefined, {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                      }).format(totalRewardWorth)}
                                    </>
                                  </MDTypography>
                                </MDBox>
                              </MDBox>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={12}
                              lg={4}
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              alignContent="center"
                            >
                              <MDBox
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                flexDirection="column"
                                alignContent="center"
                              >
                                <MDBox>
                                  <img
                                    src={leaderboard}
                                    alt="Leaderboard"
                                    width={isMobile ? "80px" : "128px"}
                                  />
                                </MDBox>
                                <MDBox>
                                  <MDTypography
                                    variant="body1"
                                    style={{
                                      fontFamily: "Work Sans , sans-serif",
                                      color: "white",
                                      textAlign: "center",
                                      fontWeight: 400,
                                      fontSize: "28px",
                                    }}
                                  >
                                    Leaderboard <br /> recognition
                                  </MDTypography>
                                </MDBox>
                              </MDBox>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={12}
                              lg={4}
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              alignContent="center"
                            >
                              <MDBox
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                flexDirection="column"
                                alignContent="center"
                              >
                                <MDBox>
                                  <img
                                    src={realtime}
                                    alt="Real-time"
                                    width={isMobile ? "80px" : "128px"}
                                  />
                                </MDBox>
                                <MDBox>
                                  <MDTypography
                                    variant="body1"
                                    fontWeight="bold"
                                    style={{
                                      fontFamily: "Work Sans , sans-serif",
                                      color: "white",
                                      textAlign: "center",
                                      fontWeight: 400,
                                      fontSize: "28px",
                                    }}
                                  >
                                    Real-time <br /> market experience
                                  </MDTypography>
                                </MDBox>
                              </MDBox>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={12}
                      xl={12}
                      mt={5}
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                      style={{
                        minWidth: "80%",
                        maxWidth: "80%",
                        textAlign: "center",
                      }}
                    >
                      <MDTypography
                        variant={isMobile ? "body2" : "body3"}
                        color="white"
                        fontWeight="bold"
                      >
                        StoxHero is a virtual trading & investing platform that
                        makes learning stock market easy, risk free and fun!
                      </MDTypography>
                    </Grid>
                    <Grid
                      item
                      xl={12}
                      md={12}
                      mt={5}
                      px={5}
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                      style={{
                        minWidth: "80%",
                        maxWidth: "80%",
                        textAlign: "center",
                      }}
                    >
                      <MDTypography
                        variant={isMobile ? "body2" : "body3"}
                        color="white"
                        fontWeight="bold"
                      >
                        Event & Details
                      </MDTypography>
                      <MDTypography
                        variant={isMobile ? "body2" : "body3"}
                        color="white"
                        px={5}
                        mt={2}
                      >
                        The Big Bull 1.0" is an online learning and virtual
                        trading competition that helps enhance your financial
                        expertise. Win prizes like smartphones, speakers, alexa
                        and smartwatches.
                      </MDTypography>
                      <MDBox display="flex" gap={2} mt={2}>
                        <Grid
                          item
                          xl={12}
                          px={10}
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                        >
                          <img
                            src={ChartBar}
                            alt="ChartBar"
                            width={40}
                            height={40}
                          />
                          <MDTypography mt={1} color="white" fontSize={16}>
                            Introductory training on the virtual trading
                            platform
                          </MDTypography>
                        </Grid>
                        <Grid
                          item
                          xl={12}
                          px={10}
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                        >
                          <img
                            src={Videoplay}
                            alt="Videoplay"
                            width={40}
                            height={40}
                          />
                          <MDTypography mt={1} color="white" fontSize={16}>
                            Interactive sessions on market analysis and risk
                            management.
                          </MDTypography>
                        </Grid>
                      </MDBox>
                      <MDBox display="flex" gap={2} mt={2}>
                        <Grid
                          item
                          xl={12}
                          px={10}
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                        >
                          <img
                            src={Lightbulb}
                            alt="Lightbulb"
                            width={40}
                            height={40}
                          />
                          <MDTypography mt={1} color="white" fontSize={16}>
                            Dedicated Q&A session for participants.
                          </MDTypography>
                        </Grid>
                        <Grid
                          item
                          xl={12}
                          px={10}
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                        >
                          <img
                            src={ChartBarUp}
                            alt="ChartBar"
                            width={40}
                            height={40}
                          />
                          <MDTypography mt={1} color="white" fontSize={16}>
                            Virtual trading competition with market simulation.
                          </MDTypography>
                        </Grid>
                      </MDBox>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={12}
                      xl={12}
                      lg={12}
                      mt={5}
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                      style={{ minWidth: "80%", maxWidth: "80%" }}
                    >
                      <MDBox style={{ minWidth: "70%" }}>
                        <MDBox
                          width="100%"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{
                            backgroundColor: "#D5F47E",
                            borderRadius: "10px",
                          }}
                        >
                          <MDTypography
                            variant="body3"
                            color="dark"
                            fontWeight="bold"
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
                  </Grid>
                </MDBox>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignContent="center"
            alignItems="center"
            style={{ width: "100%" }}
            mt={4}
          >
            <MDTypography mb={2} color="white" fontWeight="bold">
              Who are we?
            </MDTypography>
            <MDTypography mb={1} color="white">
              Virtual trading and investing platform that makes stockmarket:
            </MDTypography>
            <MDTypography mb={3} style={{ color: "#D5F47E" }} fontWeight="bold">
              Easy | Riskfree | Fun
            </MDTypography>
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
            mt={-18}
          >
            <MDBox pl={24} pr={4}>
              <MDTypography color="white" fontWeight="bold">
                Frequently Asked Questions
              </MDTypography>
              <MDTypography mt={2} color="white" fontSize={16} mb={3}>
                If you have any questions or you need more information regarding
                us, please feel free to reach out.
              </MDTypography>
              <MDButton
                mt={2}
                style={{ backgroundColor: "#D5F47E" }}
                onClick={() => {
                  window.open(
                    "http://www.stoxhero.com/contact",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                Contact us
              </MDButton>
            </MDBox>
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
            mt={4}
          >
            <MDBox pr={24}>
              <MDTypography color="white" fontSize={18} fontWeight="bold">
                What are the days and times that the live sessions will be held?
              </MDTypography>
              <MDTypography color="white" fontSize={14} mb={2}>
                The live sessions will be held on Monday & Tuesday via Zoom.
                Each day will have two sessions. The first session of the day
                will begin at 3 PM IST. The second session of the day will begin
                at 7 PM IST.
              </MDTypography>
              <MDTypography color="white" fontSize={18} fontWeight="bold">
                Will there be recordings available if I’m unable to attend the
                live session?
              </MDTypography>
              <MDTypography color="white" fontSize={14} mb={2}>
                No, there will be no recordings available.
              </MDTypography>
              <MDTypography color="white" fontSize={18} fontWeight="bold">
                Does this course require me to join a MLM or trading network
                marketing company?
              </MDTypography>
              <MDTypography color="white" fontSize={14} mb={2}>
                Absolutely not! Our organisation is not affiliated with any
                trading network marketing companies.
              </MDTypography>
              <MDTypography color="white" fontSize={18} fontWeight="bold">
                What should I expect as a student of this Event?
              </MDTypography>
              <MDTypography color="white" fontSize={14} mb={2}>
                Expect to practise patience, discipline, remain focused and
                fully participate throughout the entire Event. This will
                contribute to a great learning experience and improve your
                trading skills over time.
              </MDTypography>
            </MDBox>
          </Grid>

          <Grid
            item
            xs={12}
            md={12}
            lg={12}
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
              mt={5}
              display="flex"
              justifyContent="center"
              alignContent="center"
              alignItems="center"
              style={{ width: "100%" }}
            >
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                display="flex"
                justifyContent="center"
                alignItems="center"
                alignContent="center"
              >
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignContent="center"
                  alignItems="center"
                  style={{ width: "100%" }}
                >
                  <img src={champions} width="348px" />
                </MDBox>
              </Grid>
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                display="flex"
                justifyContent="center"
                alignItems="center"
                alignContent="center"
              >
                <MDTypography variant="h3" color="warning">
                  Be a stock market champion. Prove your trading & investing
                  expertise.
                </MDTypography>
              </Grid>

              <Grid
                item
                xs={12}
                md={12}
                xl={6}
                mt={5}
                display="flex"
                justifyContent="center"
                alignContent="center"
                alignItems="center"
              >
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignContent="center"
                  alignItems="center"
                  flexDirection="column"
                >
                  {/* <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center'><MDButton variant='contained' color='success' size={isMobile ? 'small' : 'large'}>Register Now(₹200/-)</MDButton></MDBox> */}
                  <SignupLoginPopup
                    data={contestDetails}
                    testzone={true}
                    referrerCode={couponReferrerCode}
                  />
                  <MDBox
                    mt={1}
                    display="flex"
                    justifyContent="center"
                    alignContent="center"
                    alignItems="center"
                  >
                    <MDTypography variant="caption" color="white">
                      *Limited seats only. Hurry Up!
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
      {renderSuccessSB}
    </MDBox>
  );
};

export default FeaturedContestRegistration;
