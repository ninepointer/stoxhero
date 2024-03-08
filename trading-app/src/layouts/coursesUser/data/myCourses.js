
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { apiUrl } from "../../../constants/constants.js"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Grid, CircularProgress } from '@mui/material';
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox/index.js";
import MDButton from "../../../components/MDButton/index.js";
import MDTypography from "../../../components/MDTypography/index.js";
import { Link } from "react-router-dom";
import moment from 'moment';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import PaymentIcon from '@mui/icons-material/Payment';
import Groups2Icon from '@mui/icons-material/Groups2';
import NoData from "../../../assets/images/noBlogFound.png";
import { useMediaQuery } from "@mui/material";
import theme from "../../HomePage/utils/theme/index";
import StarRating from "../../HomePage/pages/courses/starRatings.js";

const Courses = () => {
  const [data, setData] = useState([]);
  const limitSetting = 9;
  const [skip, setSkip] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    let call1 = axios.get(`${apiUrl}courses/user/mycourses?skip=${skip}&limit=${limitSetting}`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    Promise.all([call1])
      .then(([api1Response]) => {
        // Process the responses here
        setData(api1Response.data.data)
        setCount(api1Response.data.count)
        setTimeout(() => setIsLoading(false), 500);
      })
      .catch((error) => {
        // Handle errors here
        console.error(error);
      });
  }, [skip])

  const handlePageChange = (event, value) => {
    setSkip((Number(value) - 1) * limitSetting)
  };

  const handleOpenNewTab = async (elem) => {
    const newTab = window.open(`/watchcourse?course=${elem?.slug}`, '_blank');
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));


  return (
    <>
      {!isLoading ? (
        <Grid
          // mt={10}
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


                  {data.length > 0 ? (
                    <Grid
                      item
                      xs={12}
                      mt={2}
                      md={12}
                      lg={12}
                      display="flex"
                      justifyContent="center"
                      alignItems="stretch"
                    >
                      <MDBox
                        display="flex"
                        justifyContent="center"
                        alignItems="stretch"
                      >
                        <Grid
                          container
                          spacing={3}
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
                                    maxWidth: "100%",
                                    minWidth: "100%",
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
                                        spacing={1}
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
                                            fontWeight="bold"
                                          >
                                            {elem?.courseOverview}
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
                                            fontWeight="bold"
                                          >
                                            By: {elem?.instructorName.join(', ')}
                                          </MDTypography>
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
                                          <MDTypography variant="body1">
                                            <StarRating rating={Number(elem?.averageRating) || 4} />
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
                                              color: "#532B9E",
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
                                      mt={2}
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
                                        spacing={1}
                                        xs={12}
                                        md={12}
                                        lg={12}
                                        display="flex"
                                        justifyContent={
                                          isMobile ? "center" : "center"
                                        }
                                        alignContent="center"
                                        alignItems={
                                          isMobile ? "center" : "flex-start"
                                        }
                                      >
                                        {/* <Grid
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
                                          <Payment data={elem} setShowPay={setShowPay} showPay={showPay} checkPaid={elem?.isPaid} />
                                        </Grid> */}
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
                                            size="small"
                                            color="info"
                                            style={{ minWidth: "100%" }}
                                            onClick={()=>{handleOpenNewTab(elem)}}
                                          >
                                            Watch
                                          </MDButton>
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
                                            variant="body1"
                                            fontWeight="bold"
                                          >
                                            ₹
                                            {new Intl.NumberFormat(
                                              undefined,
                                              {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                              }
                                            ).format(elem?.discountedPrice)}
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
      {data.length > 0 &&
        <Grid item xs={12} md={12} lg={12} mt={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
          <Stack spacing={2}>
            <Pagination style={{ backgroundColor: 'transparent' }} count={Math.ceil(count / limitSetting)} color="success" onChange={handlePageChange} />
          </Stack>
        </Grid>}
    </>
  )
}



export default Courses;