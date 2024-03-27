import React, { useEffect, useState } from "react";
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import { Grid } from "@mui/material";
import theme from "../../utils/theme/index";
import { ThemeProvider } from "styled-components";
import { useMediaQuery, CircularProgress } from "@mui/material";
import FinNavbar from "../../components/Navbars/FinNavBar";
import MDTypography from "../../../../components/MDTypography";
import MDSnackbar from "../../../../components/MDSnackbar";
import axios from "axios";
import champions from "../../../../assets/images/champions.png";
import { useLocation } from "react-router-dom";
import { apiUrl } from "../../../../constants/constants";
import { Helmet } from "react-helmet";
import realtime from "../../../../assets/images/realtime.png";
import ChartBar from "../../../../assets/images/Chart Bar Presentation.png";
import ChartBarUp from "../../../../assets/images/Chart Bar Up.png";
import Videoplay from "../../../../assets/images/Video Play.png";
import Lightbulb from "../../../../assets/images/Light Bulb Check.png";
import SignupLoginPopup from "./signupLoginPopup";
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import {useNavigate} from 'react-router-dom';

const Workshop = () => {
    const [courseDetails, setCourseDetails] = useState(false);
    const navigate = useNavigate();
    const [instructor, setInstructor] = useState({});
    const location = useLocation();
    let campaignCode = location?.state?.campaignCode;
    const params = new URLSearchParams(location?.search);
    const referrerCode = params.get("referral");
    campaignCode = params.get("campaigncode");

    const newReferrerCode = campaignCode ? campaignCode : referrerCode;
    // const couponReferrerCode = referrerCode ? referrerCode : "";
    const getCourseDetails = async (slug) => {
        try {
            const res = await axios.get(
                `${apiUrl}courses/user/${slug}/slug`
            );
            setInstructor(res?.data?.instructor);
            setCourseDetails(res?.data?.data);
            //   setDetails((prev) => ({ ...prev, contest: res?.data?.data?._id }));
        } catch (e) {
            navigate('/')
            console.log(e);
        }
    };

    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000)?.toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000)?.toFixed(1) + 'K';
        } else {
            return num?.toString();
        }
    }

    function openSocialMediaHandle(url) {
        window.open(url, '_blank');
    }

    useEffect(() => {
        const url = location?.pathname?.split("/");
        const slug = decodeURIComponent(url[2]);
        getCourseDetails(slug);
        window.webengage.track("workshop_registration_clicked", {});
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
        const finalFormattedDate = `${dayOfMonth}${suffix} ${formattedDate?.split(" ")[0]
            }, ${date.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            })}`;

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
                // minWidth: "100vW",
            }}
        >
            <ThemeProvider theme={theme}>
                <FinNavbar />
                <Helmet>
                    <title>{courseDetails?.metaTitle}</title>
                    <meta name="description" content={courseDetails?.metaDescription} />
                    <meta name="keywords" content={courseDetails?.metaKeyword} />
                </Helmet>

                <Grid
                    container
                    xs={12}
                    md={12}
                    xl={12}
                    mt={10}
                    spacing={5}
                    display="flex"
                    justifyContent="center"
                    alignContent="center"
                    alignItems="center"
                >
                    <Grid
                        item
                        xs={12}
                        md={12}
                        xl={12}
                        display="flex"
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center"
                        style={{ minWidth: "75%" }}
                    >
                        {courseDetails?.workshopCoverImage ?
                            <img
                                src={courseDetails?.workshopCoverImage}
                                width={isMobile ? "100%" : "75%"}
                            />
                            :
                            <CircularProgress color='light' />
                        }
                    </Grid>

                    <Grid
                        item
                        mt={5}
                        xs={12}
                        md={12}
                        lg={12}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        alignContent="center"
                    >
                        <Grid
                            container
                            spacing={1}
                            xs={12}
                            md={12}
                            lg={12}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            alignContent="center"
                        >
                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={12}
                                container
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <MDBox display="flex" alignItems="center">
                                    <MDBox
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        style={{
                                            borderRadius: "50%",
                                            width: 10,
                                            height: 10,
                                            backgroundColor: "#E6F495",
                                            marginRight: 5, // Adjust as needed
                                        }}
                                    ></MDBox>
                                    <MDTypography
                                        variant={isMobile ? "body3" : "h2"}
                                        color="light"
                                        fontWeight={600}
                                        textAlign={"center"} // Responsive textAlign
                                    >
                                        Workshop begins on
                                    </MDTypography>
                                    <MDBox
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        style={{
                                            borderRadius: "50%",
                                            width: 10,
                                            height: 10,
                                            backgroundColor: "#E6F495",
                                            marginLeft: 5, // Adjust as needed
                                        }}
                                    ></MDBox>
                                </MDBox>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={12}
                                mt={2}
                                display="flex"
                                justifyContent="center"
                                alignContent="center"
                                alignItems="center"
                            >
                                <MDTypography
                                    variant={isMobile ? "body3" : "h3"}
                                    color="light"
                                    fontWeight={400}
                                    textAlign="center"
                                >
                                    {`${dateConvert(
                                        courseDetails?.courseStartTime
                                    )} | ${dateConvert(courseDetails?.courseEndTime)}`}
                                </MDTypography>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={12}
                                mt={2}
                                display="flex"
                                justifyContent="center"
                                alignContent="center"
                                alignItems="center"
                            >
                                <MDBox
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        alignContent: "center",
                                    }}
                                >
                                    <MDBox
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            alignContent: "center",
                                        }}
                                    >
                                        <MDTypography
                                            color="light"
                                            variant={isMobile ? "body3" : "h3"}
                                        >
                                            Entry Fee:
                                        </MDTypography>
                                    </MDBox>
                                    {courseDetails?.discountedPrice === 0 ?
                                        <MDBox
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                alignContent: "center",
                                                marginLeft: 5,
                                                // textDecoration: "line-through",
                                                // textDecorationColor: "#E6F495",
                                            }}
                                        >
                                            <MDTypography
                                                // color="#E6F495"
                                                style={{color: '#E6F495'}}
                                                variant={isMobile ? "body3" : "h3"}
                                            >
                                                Free
                                            </MDTypography>
                                        </MDBox>
                                        :
                                        <>
                                            <MDBox
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    alignContent: "center",
                                                    marginLeft: 5,
                                                    textDecoration: "line-through",
                                                    textDecorationColor: "#E6F495",
                                                }}
                                            >
                                                <MDTypography
                                                    color="light"
                                                    variant={isMobile ? "body3" : "h4"}
                                                >
                                                    ₹
                                                    {new Intl.NumberFormat(undefined, {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 0,
                                                    }).format(courseDetails?.coursePrice)}
                                                </MDTypography>
                                            </MDBox>
                                            <MDBox
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    alignContent: "center",
                                                    marginLeft: 5,
                                                }}
                                            >
                                                <MDTypography
                                                    color="light"
                                                    variant={isMobile ? "body3" : "h3"}
                                                >
                                                    ₹
                                                    {new Intl.NumberFormat(undefined, {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 0,
                                                    }).format(courseDetails?.discountedPrice)}
                                                </MDTypography>
                                            </MDBox>
                                        </>}
                                </MDBox>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                md={12}
                                xl={6}
                                mt={"16px"}
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
                                        data={courseDetails}
                                        workshop={true}
                                        referrerCode={newReferrerCode}
                                        // isCoupon={Boolean(couponReferrerCode)}
                                    />
                                    <MDBox
                                        mt={isMobile ? 0.5 : 1}
                                        display="flex"
                                        justifyContent="center"
                                        alignContent="center"
                                        alignItems="center"
                                        style={{ color: "white" }}
                                    >
                                        <MDTypography
                                            variant="caption"
                                            style={{
                                                fontSize: isMobile ? "7px" : "14px",
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
                        style={{ maxWidth: "90%" }}
                    >
                        <Grid
                            container
                            xs={12}
                            md={12}
                            lg={12}
                            p={2}
                            display="flex"
                            justifyContent="center"
                            alignContent="center"
                            alignItems="center"
                            style={{
                                borderRadius: 20,
                                border: "2px solid #343434",
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
                                flexDirection={'column'}
                                justifyContent="flex-start"
                                // alignItems="center"
                                alignContent="center"
                            >
                                {courseDetails?.courseBenefits?.map((elem)=>{
                                    return(
                                        <>
                                            <MDBox
                                                display="flex"
                                                justifyContent="flex-start"
                                                alignItems="center"
                                                gap={1}
                                                alignContent="center"
                                            >
                                                <MDBox>
                                                    <img
                                                        src={realtime}
                                                        alt="Real-time"
                                                        style={{ marginTop: '5px' }}
                                                        width={isMobile ? "10px" : "30px"}
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
                                                            fontSize: isMobile ? "12px" : "18px",
                                                        }}
                                                    >
                                                        {elem?.benefits}
                                                    </MDTypography>
                                                </MDBox>
                                            </MDBox>
                                        </>
                                    )
                                })}
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        xl={12}
                        md={12}
                        mt={5}
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
                            variant={isMobile ? "body3" : "h3"}
                            style={{ fontWeight: 600, color: "white" }}
                        >
                            Event & Details
                        </MDTypography>
                        <MDTypography
                            variant={isMobile ? "caption" : "body3"}
                            color="white"
                            mt={2}
                            style={{ fontWeight: 400, color: "white" }}
                        >
                            {courseDetails?.courseOverview}
                        </MDTypography>
                        <Grid
                            container
                            spacing={4}
                            xs={12}
                            md={12}
                            lg={12}
                            display="flex"
                            justifyContent="center"
                            mt={"64px"}
                        >
                            <Grid
                                item
                                xs={12}
                                md={6}
                                lg={6}
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignContent="center"
                                alignItems="center"
                                style={{ maxWidth: "100%" }}
                            >
                                <img
                                    src={ChartBar}
                                    alt="ChartBar"
                                    width={isMobile ? 36 : 72}
                                    height={isMobile ? 36 : 72}
                                />
                                <MDTypography
                                    variant={isMobile ? "caption" : "h3"}
                                    style={{
                                        fontWeight: 500,
                                        color: "white",
                                        textAlign: "center",
                                    }}
                                >
                                    Access to exclusive live video content
                                </MDTypography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                lg={6}
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignContent="center"
                                alignItems="center"
                            >
                                <img
                                    src={Videoplay}
                                    alt="Videoplay"
                                    width={isMobile ? 36 : 72}
                                    height={isMobile ? 36 : 72}
                                />
                                <MDTypography
                                    variant={isMobile ? "caption" : "h3"}
                                    style={{ fontWeight: 500, color: "white" }}
                                >
                                    Interactive sessions on market analysis and risk management
                                </MDTypography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                lg={6}
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignContent="center"
                                alignItems="center"
                            >
                                <img
                                    src={Lightbulb}
                                    alt="Lightbulb"
                                    width={isMobile ? 36 : 72}
                                    height={isMobile ? 36 : 72}
                                />
                                <MDTypography
                                    variant={isMobile ? "caption" : "h3"}
                                    style={{ fontWeight: 500, color: "white" }}
                                >
                                    Dedicated Q&A session for participants.
                                </MDTypography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                lg={6}
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignContent="center"
                                alignItems="center"
                            >
                                <img
                                    src={ChartBarUp}
                                    alt="ChartBar"
                                    width={isMobile ? 36 : 72}
                                    height={isMobile ? 36 : 72}
                                />
                                <MDTypography
                                    variant={isMobile ? "caption" : "h3"}
                                    style={{ fontWeight: 500, color: "white" }}
                                >
                                    ⁠Insights into crafting personalised trading strategies and setups.
                                </MDTypography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        mt={5}
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center"
                        style={{ width: "100%" }}
                    >
                        <MDTypography
                            variant={isMobile ? "body3" : "h3"}
                            style={{ fontWeight: 600, color: "white" }}
                        >
                            Who are we?
                        </MDTypography>
                        <MDTypography
                            variant={isMobile ? "caption" : "body3"}
                            style={{ fontWeight: 500, color: "white", textAlign: "center" }}
                        >
                            Virtual trading and investing platform that makes stockmarket:
                        </MDTypography>
                        <MDTypography
                            variant={isMobile ? "body3" : "body3"}
                            style={{ fontWeight: 500, color: "#D5F47E" }}
                        >
                            Easy | Riskfree | Fun
                        </MDTypography>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        mt={2}
                        // spacing={4}
                        md={12}
                        lg={12}
                        display="flex"
                        justifyContent="center"
                        // alignItems="center"
                        id='about_instructor'
                        style={{ maxWidth: isMobile ? '100%' : "85%" }}
                      >
                        <MDBox
                          display="flex"
                          justifyContent="center"
                          alignItems="stretch"
                        >
                          <Grid
                            container
                            // spacing={5}
                            xs={12}
                            md={12}
                            lg={12}
                            display="flex"
                            justifyContent={
                              isMobile ? "center" : "center"
                            }
                            alignContent="center"
                            alignItems="center"
                            style={{
                              maxWidth: isMobile ? "100%" : "100%",
                              height: "auto",
                              borderRadius: 20,
                              border: "2px solid #343434",
                            }}
                          >

                            <MDBox display='flex' justifyContent={isMobile ? 'center' : 'center'} flexDirection='column' alignContent='center' ml={isMobile ? 0 : 0} p={2}>
                              <MDBox display='flex' justifyContent={isMobile ? 'center' : 'center'} alignContent='center' height='auto'>
                                <MDTypography style={{ fontSize: "24px", fontWeight: 700, color: '#ffffff' }}>
                                  {`${courseDetails?.type==='Workshop' ? 'Workshop' : 'Course'} Created and Instructed By`}
                                </MDTypography>
                              </MDBox>
                              <MDBox display='flex' justifyContent={isMobile ? 'center' : 'center'} alignContent='center' height='auto'>
                                <MDTypography style={{ fontSize: "24px", fontWeight: 700, color: '#E6F495' }}>
                                  {`${instructor?.first_name} ${instructor?.last_name}`}
                                </MDTypography>
                              </MDBox>
                              <MDBox display='flex' justifyContent={isMobile ? 'center' : 'center'} flexDirection={isMobile ? 'column' : 'row'} alignContent='center' alignItems={isMobile ? "flex-start" : "center"} gap={2} mt={1}>
                                <img src={instructor?.profilePhoto?.url} style={{ borderRadius: '50%', width: '90px', height: '90px' }} />
                                <MDBox display='flex' justifyContent='center' flexDirection='column' alignContent='center' fontColor='#ffffff'>
                                  <MDBox display='flex' alignContent='center' gap={1} sx={{ cursor: 'pointer' }} onClick={() => { openSocialMediaHandle(instructor?.influencerDetails?.channelDetails?.youtube?.channelLink) }} ><span style={{ color: '#ffffff', marginTop: '3px' }}><YouTubeIcon color='red' /></span> <span style={{ color: '#ffffff' }}>{`${formatNumber(instructor?.influencerDetails?.channelDetails?.youtube?.followers)} Subscribers`}</span></MDBox>
                                  <MDBox display='flex' alignContent='center' gap={1} sx={{ cursor: 'pointer' }} onClick={() => { openSocialMediaHandle(instructor?.influencerDetails?.channelDetails?.instagram?.channelLink) }}><span style={{ color: '#ffffff', marginTop: '3px' }}><InstagramIcon color='orange' /> </span> <span style={{ color: '#ffffff' }}>{`${formatNumber(instructor?.influencerDetails?.channelDetails?.instagram?.followers)}  Followers`}</span></MDBox>
                                  <MDBox display='flex' alignContent='center' gap={1} sx={{ cursor: 'pointer' }} onClick={() => { openSocialMediaHandle(instructor?.influencerDetails?.channelDetails?.telegram?.channelLink) }}><span style={{ color: '#ffffff', marginTop: '3px' }}><TelegramIcon color='blue' /></span> <span style={{ color: '#ffffff' }}>{`${formatNumber(instructor?.influencerDetails?.channelDetails?.telegram?.followers)}  Followers`}</span></MDBox>
                                  {/* <MDBox display='flex' alignContent='center' gap={1}><span style={{ color: '#ffffff', marginTop: '3px' }}><PlayCircleIcon /></span> <span style={{ color: '#ffffff' }}>{`${count} Courses`}</span></MDBox> */}
                                </MDBox>
                              </MDBox>

                              <MDBox display='flex' justifyContent='center' flexDirection='column' alignContent='center' height='auto' width={isMobile ? '100%' : '100%'} mt={1}>
                                <MDTypography style={{ fontSize: "16px", fontWeight: 500, color: '#ffffff', textAlign: 'justify' }}>
                                  {instructor?.influencerDetails?.about || 'Lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquam ultricies eros, a consectetur turpis maximus sed. Quisque convallis, lorem vitae ultrices consequat, nibh justo fermentum dui, et sodales justo magna non elit. Nulla facilisi. Integer auctor consequat diam, id fermentum magna efficitur eu.'}
                                </MDTypography>
                              </MDBox>
                            </MDBox>
                          </Grid>
                        </MDBox>
                      </Grid>

                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        mt={5}
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center"
                        style={{ maxWidth: "75%" }}
                    >
                        <Grid
                            container
                            spacing={4}
                            xs={12}
                            md={12}
                            lg={12}
                            display="flex"
                            justifyContent="center"
                            alignItems="flex-start"
                            alignContent="center"
                        >
                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={6}
                                display="flex"
                                justifyContent="center"
                                alignContent="flex-start"
                                alignItems="center"
                                style={{ width: "100%" }}
                            >
                                <MDBox>
                                    <MDTypography
                                        variant={isMobile ? "body3" : "h3"}
                                        style={{ fontWeight: 600, color: "white" }}
                                    >
                                        Frequently Asked Questions
                                    </MDTypography>
                                    <MDTypography
                                        style={{
                                            fontSize: "20px",
                                            fontWeight: 500,
                                            lineHeight: "23.46px",
                                            color: "white",
                                            marginTop: 30,
                                        }}
                                    >
                                        If you have any questions or you need more information
                                        regarding us, please feel free to reach out.
                                    </MDTypography>
                                    <MDButton
                                        style={{
                                            backgroundColor: "#D5F47E",
                                            marginTop: 30,
                                            color: "black",
                                            fontSize: "18px",
                                            fontFamily: "Work Sans , sans-serif",
                                            textTransform: "capitalize",
                                        }}
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
                                style={{ width: "75%" }}
                            >
                                <MDBox>
                                    {courseDetails?.faqs?.map((faq, index) => (
                                        <div key={index}>
                                            <MDTypography
                                                color="white"
                                                fontSize={18}
                                                fontWeight="bold"
                                            >
                                                {faq?.question}
                                            </MDTypography>
                                            <MDTypography color="white" fontSize={14} mb={2}>
                                                {faq?.answer}
                                            </MDTypography>
                                        </div>
                                    ))}
                                </MDBox>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        mt={5}
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
                        mt={5}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        alignContent="center"
                    >
                        <MDTypography
                            style={{
                                fontSize: "32px",
                                fontWeight: 500,
                                lineHeight: "37.54px",
                                color: "white",
                                textAlign: "center",
                            }}
                        >
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
                                data={courseDetails}
                                workshop={true}
                                referrerCode={newReferrerCode}
                            />
                            <MDBox
                                mt={1}
                                display="flex"
                                justifyContent="center"
                                alignContent="center"
                                alignItems="center"
                            >
                                <MDTypography variant="caption" color="white" pb={3}>
                                    *Limited seats only. Hurry Up!
                                </MDTypography>
                            </MDBox>
                        </MDBox>
                    </Grid>
                </Grid>
            </ThemeProvider>
            {renderSuccessSB}
        </MDBox>
    );
};

export default Workshop;
