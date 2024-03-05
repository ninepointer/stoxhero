import React, { useEffect, useState, useContext } from "react";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import ReactGA from "react-ga";
import { Card, CircularProgress, formLabelClasses } from "@mui/material";
import { Grid, Input, TextField } from "@mui/material";
import theme from "../utils/theme/index";
import { ThemeProvider } from "styled-components";
import { useMediaQuery } from '@mui/material'
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
import leaderboard from '../../../assets/images/leaderboardposition.png'
import realtime from '../../../assets/images/realtime.png'
import reward from '../../../assets/images/reward.png';
import SignupLoginPopup from "./courses/signupLoginPopup"



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

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))

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
  let totalRewardWorth = 0 ;
  contestDetails.rewards?.map((elem) => {
    let featureObj = {};
    console.log('reward', elem?.rankEnd, elem?.rankStart , Number(elem?.prizeValue));
    totalRewardWorth += ((elem?.rankEnd - elem?.rankStart + 1) * Number(elem?.prizeValue));
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
        backgroundColor: "#EFF6D5",
        minHeight: "100vH",
        height: "auto",
        width: "auto",
        minWidth: "100vW",
      }}
    >
      <ThemeProvider theme={theme}>
        <Helmet>
          <title>{contestDetails?.metaTitle}</title>
          <meta name='description' content={contestDetails?.metaDescription} />
          <meta name='keywords' content={contestDetails?.keywords} />

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
                      mt={3}
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                    >
                      <img src={contestDetails?.image} width= {isMobile ? '384px' : '1024px'}/>
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
                      <Grid container xs={12} md={12} lg={12} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography
                        variant= {isMobile ? 'body3' : 'h3'}
                        fontColor="dark"
                        fontWeight="bold"
                        sx={{ textAlign: "center", fontFamily: 'Work Sans , sans-serif', wordWrap: 'break-word', overflowWrap: 'break-word', color:'#532B9E' }}
                      >
                        Trading Competition begins on 
                      </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                      <MDTypography
                        variant= {isMobile ? 'caption' : 'body1'}
                        fontColor="dark"
                        fontWeight="bold"
                        color='warning'
                        sx={{ textAlign: "center", fontFamily: 'Work Sans , sans-serif' }}
                      >
                        {`${dateConvert(contestDetails?.contestStartTime)} | ${dateConvert(contestDetails?.contestEndTime)}`}
                        {/* 20th March 2024, 9:30 AM | 27th March 3:20 PM */}
                      </MDTypography>
                      </Grid>
                      </Grid>
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
                      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' flexDirection='column'>
                      {/* <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center'><MDButton variant='contained' color='success' size={isMobile ? 'small' : 'large'}>Register Now(₹200/-)</MDButton></MDBox> */}
                        <SignupLoginPopup
                          data={contestDetails} testzone={true} referrerCode={newReferrerCode}
                        />
                      <MDBox mt={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'><MDTypography variant='caption'>*Limited seats only. Hurry Up!</MDTypography></MDBox>
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
                      style={{minWidth:'100%'}}
                    >
                      <Grid container xs={12} md={12} lg={12} display="flex" justifyContent="center" alignContent="center" alignItems="center" style={{minWidth:'100%'}}>
                        <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                          <MDTypography
                            variant= {isMobile ? 'body3' : 'h3'}
                            fontColor="dark"
                            fontWeight="bold"
                            color='warning'
                            sx={{ textAlign: "center", fontFamily: 'Work Sans , sans-serif'}}
                          >
                            Why you can't miss this! 
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} display="flex" justifyContent="center" alignContent="center" alignItems="center">
                          <Grid container spacing={2} mt={3} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center' style={{minWidth:'100%'}}>
                            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                              <MDBox display='flex' justifyContent='center' flexDirection='column' alignItems='center' alignContent='center' style={{minWidth:'100%'}}>
                                <MDBox><img src={reward} alt="Reward" width={isMobile ? '100px' : '150px'}/></MDBox>
                                <MDBox><MDTypography variant='body1' fontWeight='bold' style={{fontFamily: 'Work Sans , sans-serif'}}>{`Price pool worth ₹${new Intl.NumberFormat(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(totalRewardWorth)}`}</MDTypography></MDBox>
                              </MDBox>
                            </Grid>
                            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                              <MDBox display='flex' justifyContent='center' alignItems='center' flexDirection='column' alignContent='center'>
                                <MDBox><img src={leaderboard} alt="Leaderboard" width={isMobile ? '100px' : '150px'}/></MDBox>
                                <MDBox><MDTypography variant='body1' fontWeight='bold' style={{fontFamily: 'Work Sans , sans-serif'}}>Leaderboard recognition</MDTypography></MDBox>
                              </MDBox>
                            </Grid>
                            <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                              <MDBox display='flex' justifyContent='center' alignItems='center' flexDirection='column' alignContent='center'>
                                <MDBox><img src={realtime} alt="Real-time" width={isMobile ? '100px' : '150px'}/></MDBox>
                                <MDBox><MDTypography variant='body1' fontWeight='bold' style={{fontFamily: 'Work Sans , sans-serif'}}>Real-time market experience</MDTypography></MDBox>
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
                      style={{minWidth:'80%', maxWidth:'80%', textAlign:'center'}}
                    >
                      <MDTypography variant={isMobile ? 'body2' : 'body3'} fontWeight='bold'>StoxHero is a virtual trading & investing platform that makes learning stock market easy, risk free and fun!</MDTypography>
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
                      style={{minWidth:'80%', maxWidth:'80%'}}
                    >
                      <MDBox style={{minWidth:'70%'}}>
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
                            fontWeight='bold'
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
              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
              <MDBox
                display="flex"
                justifyContent="center"
                alignContent="center"
                alignItems="center"
                style={{ width: "100%" }}
              >
                <img
                  src={champions}
                  width='348px'
                />
              </MDBox>
              </Grid>
              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignItems='center' alignContent='center'>
                <MDTypography variant='h3' color='warning'>Be a stock market champion. Prove your trading & investing expertise.</MDTypography>
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
                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' flexDirection='column'>
                {/* <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center'><MDButton variant='contained' color='success' size={isMobile ? 'small' : 'large'}>Register Now(₹200/-)</MDButton></MDBox> */}
                  <SignupLoginPopup
                    data={contestDetails} testzone={true} referrerCode={newReferrerCode}
                  />
                <MDBox mt={1} display='flex' justifyContent='center' alignContent='center' alignItems='center'><MDTypography variant='caption'>*Limited seats only. Hurry Up!</MDTypography></MDBox>
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

