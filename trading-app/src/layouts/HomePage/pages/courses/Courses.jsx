import React, { useEffect, useState, useContext } from "react";
import { CardActionArea, Divider, Grid } from "@mui/material";
import axios from "axios";
import { useMediaQuery } from "@mui/material";
import { apiUrl } from "../../../../constants/constants.js";
import MDBox from "../../../../components/MDBox/index.js";
import MDButton from "../../../../components/MDButton/index.js";
import { ThemeProvider } from "styled-components";
import Navbar from "../../components/Navbars/Navbar.jsx";
import FinNavbar from "../../components/Navbars/FinNavBar.jsx";
import theme from "../../utils/theme/index";
import MDTypography from "../../../../components/MDTypography/index.js";
import Footer from "../../../authentication/components/Footer/index.js";
import moment from "moment";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { CircularProgress } from "@mui/material";
import SMC from "../../../../assets/images/SMC.png";
import logo from "../../../../assets/images/logo_light.png";
import ondemand from "../../../../assets/images/ondemand.png";
import community from "../../../../assets/images/community.png";
import qa from "../../../../assets/images/qa.png";
import simulator from "../../../../assets/images/simulator.png";
import lifetime from "../../../../assets/images/lifetime.png";
import coursecertificate from "../../../../assets/images/coursecertificate.png";
import SMCM from "../../../../assets/images/SMCM.png";
import NoData from "../../../../assets/images/noBlogFound.png";
import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import StarRating from './starRatings.js'
import SignupLoginPopup from './signupLoginPopup.jsx'


export default function Courses() {
  const [data, setData] = useState(null);
  const limitSetting = 9;
  const [skip, setSkip] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const slug = window.location.pathname.split("/")[2];
  const [checkPaid, setCheckPaid] = useState(false);
  // Get a reference to the section you want to scroll to by its ID
  
  const scrollToSection = () => {
    // Get a reference to the section you want to scroll to by its ID
    const section = document.getElementById('courses');
  
    // Scroll to the section using window.scrollTo()
    if (section) {
      window.scrollTo({
        top: section.offsetTop, // Scroll to the top of the section
        behavior: 'smooth', // Smooth scrolling animation
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [skip]);

  async function fetchData() {
    let call1 = axios.get(
      `${apiUrl}courses/user/byslug?slug=${slug}&skip=${skip}&limit=${limitSetting}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      }
    );
    Promise.all([call1])
      .then(([api1Response]) => {
        setData(api1Response.data.data);
        setCount(api1Response.data.count);
        setTimeout(() => setIsLoading(false), 500);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const handlePageChange = (event, value) => {
    setSkip((Number(value) - 1) * limitSetting);
  };

  return (
    <>
      <MDBox
        display="flex"
        justifyContent="center"
        alignContent="center"
        alignItems="center"
        style={{
          height: "auto",
          backgroundColor: "black",
          width: "auto",
          maxWidth: "100%",
          minHeight: "100vh",
        }}
      >
        <ThemeProvider theme={theme}>
          <FinNavbar />
          {!isLoading ? (
            <Grid
              mt={10}
              mb={7}
              display="flex"
              justifyContent="center"
              alignContent="center"
              alignItems="center"
              container
              xs={12}
              md={12}
              lg={12}
              style={{ maxWidth: "auto", height: "auto" }}
            >
              {/* <Grid
                item
                xs={12}
                md={12}
                lg={12}
                display="flex"
                justifyContent="center"
                alignContent="center"
                alignItems="center"
              >
                <img
                  // src={isMobile ? SMCM : SMC}
                  src={SMC}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Grid> */}
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                display="flex"
                justifyContent="center"
                alignContent="center"
                alignItems="center"
                style={{ position: "relative" }} // Ensure relative positioning for the container
              >
                <img
                  src={isMobile ? SMCM : SMC}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <MDButton
                  sinze="small"
                  style={{
                    position: "absolute", // Position the button absolutely
                    top: "90%", // Position the button in the center vertically
                    left: "50%", // Position the button in the center horizontally
                    transform: "translate(-50%, -90%)", // Adjust to center the button perfectly
                    padding: "12px", // Add padding to the button
                    backgroundColor: "#D5F47E", // Add background color to the button
                    color: "black", // Set text color
                    border: "0.25px solid #454341",
                    borderRadius: "10px", // Add border radius
                    cursor: "pointer", // Add pointer cursor
                    // width: "15%"
                  }}
                  onClick={scrollToSection} // Call scrollToSection() on button click
                >
                  <MDTypography style={{fontSize:"18px", fontWeight:600}}>View Courses</MDTypography>
                </MDButton>
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
                style={{minWidth:'100%'}}
              >
                <MDBox p={5} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{backgroundColor:'white', minWidth:'100%'}}>
                <Grid container spacing={2} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{backgroundColor:'white', minWidth:'100%'}}>
                  <Grid item xs={6} md={12} lg={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' flexDirection='column'>
                    <img src={simulator} width={50} />
                    <MDTypography variant='body3' textAlign="center">Stock<br />Simulator</MDTypography>
                  </Grid>
                  <Grid item xs={6} md={12} lg={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' flexDirection='column'>
                    <img src={ondemand} width={50} />
                    <MDTypography variant='body3' textAlign="center">On-Demand <br />Courses</MDTypography>
                  </Grid>
                  <Grid item xs={6} md={12} lg={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' flexDirection='column'>
                    <img src={community} width={50} />
                    <MDTypography  variant='body3'textAlign="center">Community <br />Channel</MDTypography>
                  </Grid>
                  <Grid item xs={6} md={12} lg={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' flexDirection='column'>
                    <img src={lifetime} width={50} />
                    <MDTypography variant='body3' textAlign="center">Lifetime <br />Access</MDTypography>
                  </Grid>
                  <Grid item xs={6} md={12} lg={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' flexDirection='column'>
                    <img src={qa} width={50} />
                    <MDTypography variant='body3' textAlign="center">Live Q&A<br />Sessions</MDTypography>
                  </Grid>
                  <Grid item xs={6} md={12} lg={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' flexDirection='column'>
                    <img src={coursecertificate} width={50} />
                    <MDTypography variant='body3' textAlign="center">Course<br />Certificate</MDTypography>
                  </Grid>
                </Grid>
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
                  id={'courses'}
                >
                  <Grid
                    item
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
                      container
                      xs={12}
                      md={12}
                      lg={12}
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                      style={{ maxWidth: "100%", height: "auto" }}
                    >
                      <Grid
                        item
                        mt={2}
                        xs={12}
                        md={12}
                        lg={12}
                        display="flex"
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center"
                        style={{ maxWidth: "100%", height: "auto" }}
                      >
                        <MDBox
                          display="flex"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                          flexDirection="column"
                        >
                          <MDTypography
                            variant={isMobile ? "h3" : "h2"}
                            fontWeight="bold"
                            color='light'
                            style={{ textAlign: "center" }}
                          >
                            Courses by Vijay Verma
                          </MDTypography>
                            <MDBox
                              display="flex"
                              justifyContent="center"
                              alignContent="center"
                              alignItems="center"
                              flexDirection="row"
                              gap={0.5}
                              mt={1}
                            >
                              <MDTypography
                                variant={isMobile ? "body3" : "body3"}
                                fontWeight="bold"
                                color='light'
                                style={{ textAlign: "center" }}
                              >
                                powered by
                              </MDTypography>
                              <img src={logo} width={120}/>
                            </MDBox>
                        </MDBox>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        mt={2}
                        mb={5}
                        display="flex"
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center"
                        style={{ maxWidth: "100%", height: "auto" }}
                      >
                        <MDBox
                          display="flex"
                          justifyContent="center"
                          alignContent="center"
                          alignItems="center"
                          style={{ maxWidth: "100%", height: "auto" }}
                        >
                          <MDTypography
                            variant="body3"
                            fontWeight="bold"
                            style={{ color: "grey" }}
                          >
                            What do Vijay offers?
                          </MDTypography>
                        </MDBox>
                      </Grid>

                      {data.length > 0 ? (
                        <Grid
                          item
                          xs={12}
                          mt={2}
                          md={12}
                          lg={12}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          style={{minxWidth:'90%'}}
                        >
                          <MDBox
                            display="flex"
                            justifyContent="center"
                            alignItems="stretch"
                          >
                            <Grid
                              container
                              spacing={5}
                              xs={12}
                              md={12}
                              lg={12}
                              display="flex"
                              justifyContent={
                                isMobile ? "center" : "flex-start"
                              }
                              alignContent="center"
                              alignItems="center"
                              style={{
                                maxWidth: isMobile ? "80%" : "100%",
                                height: "auto",
                              }}
                            >
                              {data?.map((elem, index) => {
                                return (
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
                                    <Card
                                      style={{
                                        maxWidth: "90%",
                                        minWidth: "90%",
                                        backgroundColor:'#343434'
                                      }}
                                    >
                                      <Grid
                                        container
                                        spacing={isMobile ? 0 : 2}
                                        xs={12}
                                        md={12}
                                        lg={12}
                                        display="flex"
                                        flexDirection="row"
                                        justifyContent="center"
                                        alignContent="center"
                                        alignItems="center"
                                      >
                                        <Grid
                                          item
                                          xs={12}
                                          md={4}
                                          lg={4}
                                          display="flex"
                                          justifyContent="center"
                                          alignContent="center"
                                          alignItems="center"
                                        >
                                          <img
                                            src={elem?.courseImage}
                                            style={{
                                              minWidth: "100%",
                                              height: "100%",
                                              borderBottomLeftRadius: isMobile
                                                ? 0
                                                : 10,
                                              borderTopLeftRadius: isMobile
                                                ? 10
                                                : 10,
                                              borderTopRightRadius: isMobile
                                                ? 10
                                                : 0,
                                            }}
                                          />
                                        </Grid>

                                        <Grid
                                          item
                                          p={2}
                                          xs={12}
                                          md={6}
                                          lg={6}
                                          display="flex"
                                          justifyContent={
                                            isMobile ? "center" : "center"
                                          }
                                          flexDirection="column"
                                          alignContent="center"
                                          alignItems={
                                            isMobile ? "center" : "center"
                                          }
                                        >
                                          <Grid
                                            container
                                            spacing={1.5}
                                            xs={12}
                                            md={12}
                                            lg={12}
                                            display="flex"
                                            justifyContent={
                                              isMobile ? "center" : "flex-start"
                                            }
                                            alignContent="center"
                                            alignItems={
                                              isMobile ? "center" : "flex-start"
                                            }
                                          >
                                            <Grid
                                              item
                                              xs={12}
                                              md={12}
                                              lg={12}
                                              display="flex"
                                              justifyContent={
                                                isMobile
                                                  ? "center"
                                                  : "flex-start"
                                              }
                                              alignContent="center"
                                              alignItems={
                                                isMobile
                                                  ? "center"
                                                  : "flex-start"
                                              }
                                            >
                                              <MDTypography
                                                variant="body1"
                                                fontWeight="bold"
                                                color="light"
                                              >
                                                {elem?.courseName}
                                              </MDTypography>
                                            </Grid>

                                            <Grid
                                              item
                                              xs={12}
                                              md={12}
                                              lg={12}
                                              display="flex"
                                              justifyContent={
                                                isMobile
                                                  ? "center"
                                                  : "flex-start"
                                              }
                                              alignContent="center"
                                              alignItems={
                                                isMobile
                                                  ? "center"
                                                  : "flex-start"
                                              }
                                            >
                                              <MDTypography
                                                variant="caption"
                                                fontWeight={500}
                                                color="light"
                                              >
                                                {elem?.courseOverview}
                                              </MDTypography>
                                            </Grid>

                                            {/* <Grid
                                              item
                                              xs={12}
                                              md={12}
                                              lg={12}
                                              display="flex"
                                              justifyContent={
                                                isMobile
                                                  ? "center"
                                                  : "flex-start"
                                              }
                                              alignContent="center"
                                              alignItems={
                                                isMobile
                                                  ? "center"
                                                  : "flex-start"
                                              }
                                            >
                                              <MDTypography
                                                variant="caption"
                                                fontWeight="bold"
                                                color="light"
                                              >
                                                By: {elem?.instructorName.join(', ')}
                                              </MDTypography>
                                            </Grid> */}
                                          </Grid>
                                          <Grid
                                            container
                                            spacing={1.5}
                                            xs={12}
                                            md={12}
                                            lg={12}
                                            display="flex"
                                            justifyContent={
                                              isMobile ? "center" : "flex-start"
                                            }
                                            alignContent="center"
                                            alignItems={
                                              isMobile ? "center" : "flex-start"
                                            }
                                          >
                                            <Grid
                                              item
                                              xs={12}
                                              md={12}
                                              lg={12}
                                              display="flex"
                                              justifyContent={
                                                isMobile
                                                  ? "center"
                                                  : "flex-start"
                                              }
                                              alignContent="center"
                                              alignItems={
                                                isMobile
                                                  ? "center"
                                                  : "flex-start"
                                              }
                                            >
                                              <MDTypography variant="body1" color='light'>
                                                <StarRating rating={Number(elem?.averageRating) || '4.0'} />
                                              </MDTypography>
                                            </Grid>
                                            <Grid
                                              item
                                              xs={12}
                                              md={12}
                                              lg={12}
                                              display="flex"
                                              justifyContent={
                                                isMobile
                                                  ? "center"
                                                  : "flex-start"
                                              }
                                              alignContent={
                                                isMobile ? "center" : "flex-end"
                                              }
                                              alignItems="center"
                                            >
                                              <MDTypography
                                                variant="caption"
                                                fontWeight="bold"
                                                color="light"
                                              >
                                                {elem?.courseDurationInMinutes}{" "}
                                                Min •{" "}
                                                {elem?.courseContent?.length}{" "}
                                                Lectures • For {elem?.level}
                                              </MDTypography>
                                            </Grid>
                                            <Grid
                                              item
                                              xs={12}
                                              md={12}
                                              lg={12}
                                              display="flex"
                                              justifyContent={
                                                isMobile
                                                  ? "center"
                                                  : "flex-start"
                                              }
                                              alignContent={
                                                isMobile ? "center" : "flex-end"
                                              }
                                              alignItems="center"
                                            >
                                              <MDTypography
                                                variant="caption"
                                                fontWeight="bold"
                                                style={{
                                                  color: "#E6F495",
                                                  textAlign: "center",
                                                }}
                                              >
                                                Access to free StoxHero trading
                                                simulator along with this course
                                              </MDTypography>
                                            </Grid>
                                          </Grid>
                                        </Grid>

                                        <Grid
                                          item
                                          p={2}
                                          xs={12}
                                          md={2}
                                          lg={2}
                                          display="flex"
                                          justifyContent={
                                            isMobile ? "center" : "center"
                                          }
                                          flexDirection="column"
                                          alignContent="center"
                                          alignItems={
                                            isMobile ? "center" : "center"
                                          }
                                        >
                                          <Grid
                                            container
                                            spacing={1.5}
                                            xs={12}
                                            md={12}
                                            lg={12}
                                            display="flex"
                                            justifyContent="center"
                                            alignContent="center"
                                            alignItems={
                                              isMobile ? "center" : "center"
                                            }
                                          >
                                            <Grid
                                              item
                                              xs={12}
                                              md={12}
                                              lg={12}
                                              display="flex"
                                              justifyContent={
                                                isMobile ? "center" : "center"
                                              }
                                              alignContent="center"
                                              alignItems={
                                                isMobile ? "center" : "center"
                                              }
                                            >
                                              <MDTypography
                                                variant="body1"
                                                fontWeight="bold"
                                                color="light"
                                              >
                                                ₹
                                                {new Intl.NumberFormat(
                                                  undefined,
                                                  {
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                  }
                                                ).format(elem?.discountedPrice)}/-
                                              </MDTypography>
                                            </Grid>

                                            <Grid
                                              item
                                              xs={12}
                                              md={12}
                                              lg={12}
                                              display="flex"
                                              justifyContent={
                                                isMobile ? "center" : "center"
                                              }
                                              alignContent="center"
                                              alignItems={
                                                isMobile ? "center" : "center"
                                              }
                                            >
                                              <MDTypography
                                                variant="body2"
                                                fontWeight="normal"
                                                color="light"
                                                style={{
                                                  textDecoration:
                                                    "line-through",
                                                }}
                                              >
                                                ₹
                                                {new Intl.NumberFormat(
                                                  undefined,
                                                  {
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                  }
                                                ).format(elem?.coursePrice)}
                                              </MDTypography>
                                            </Grid>

                                            <Grid
                                              item
                                              xs={12}
                                              md={12}
                                              lg={12}
                                              display="flex"
                                              justifyContent={
                                                isMobile ? "center" : "center"
                                              }
                                              alignContent="center"
                                              alignItems={
                                                isMobile ? "center" : "center"
                                              }
                                            >
                                              <SignupLoginPopup data={elem} slug={slug} checkPaid={checkPaid} />
                                            </Grid>

                                            <Grid
                                              item
                                              xs={12}
                                              md={12}
                                              lg={12}
                                              display="flex"
                                              justifyContent={
                                                isMobile ? "center" : "center"
                                              }
                                              alignContent="center"
                                              alignItems={
                                                isMobile ? "center" : "center"
                                              }
                                            >
                                              <MDButton
                                                variant="outlined"
                                                // style={{ minWidth: "100%" }}
                                                component={Link}
                                                to={{
                                                  pathname: `/courses/${slug}/details`,
                                                  search: `?course=${elem?.courseSlug}`,
                                                  state: { data: elem },
                                                }}
                                                style={{
                                                  padidng: "12px",
                                                  fontSize: "18px",
                                                  borderRadius: "10px",
                                                  color: "black",
                                                  // backgroundColor: "#E6F495",
                                                  textAlign: "center",
                                                  fontFamily: "Work Sans , sans-serif",
                                                  fontWeight: 600,
                                                  textTransform: "capitalize",
                                                  width:'100%',
                                                  color:"white",
                                                }}
                                                size="small"
                                              >
                                                <span>Course Details</span>
                                              </MDButton>
                                            </Grid>
                                            
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    </Card>
                                  </Grid>
                                );
                              })}
                            </Grid>
                          </MDBox>

                        </Grid>
                      ) : (
                        <>
                          <img src={NoData} width="500px" height="500px" />
                        </>
                      )}

                      {data.length > 0 && (
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
                          style={{ maxWidth: "100%", height: "auto" }}
                        >
                          <Stack spacing={2}>
                            <Pagination
                              style={{ backgroundColor: "transparent" }}
                              count={Math.ceil(count / limitSetting)}
                              color="success"
                              onChange={handlePageChange}
                            />
                          </Stack>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <MDBox
              mt={35}
              mb={35}
              display="flex"
              width="100%"
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress color="success" />
            </MDBox>
          )}
        </ThemeProvider>
      </MDBox>

      <MDBox
        display="flex"
        justifyContent="center"
        alignContent="center"
        alignItems="flex-end"
      >
        <Footer />
      </MDBox>
    </>
  );
}