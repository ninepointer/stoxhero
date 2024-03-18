
import React, { useState, useEffect, useContext } from 'react'
import axios from "axios";
import { apiUrl } from "../../../../constants/constants.js"
import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Divider, Grid, CircularProgress } from '@mui/material';
// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox/index.js";
// import MDButton from "../../../../components/MDButton/index.js";
import MDTypography from "../../../../components/MDTypography/index.js";
// import { Link } from "react-router-dom";
// import moment from 'moment';
// import Pagination from '@mui/material/Pagination';
// import Stack from '@mui/material/Stack';
// import PaymentIcon from '@mui/icons-material/Payment';
// import Groups2Icon from '@mui/icons-material/Groups2';
// import NoData from "../../../../assets/images/noBlogFound.png";
import { useMediaQuery } from "@mui/material";
import theme from "../../../HomePage/utils/theme/index";
import Payment from "../../../coursesUser/data/payment.js";
import { socketContext } from "../../../../socketContext";
import Timer from './timer.js';

const Workshop = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPay, setShowPay] = useState();
  const socket = useContext(socketContext);

  useEffect(() => {
    let call1 = axios.get(`${apiUrl}courses/user/homeworkshop`, {
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
        setData(api1Response?.data?.data)
        setTimeout(() => setIsLoading(false), 500);
      })
      .catch((error) => {
        // Handle errors here
        console.error(error);
      });
  }, [])

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <>     
      {!isLoading ? (
        <Grid
          mb={1}
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
                      mt={1}
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
                                            lg={2}
                                            display="flex"
                                            justifyContent="center"
                                            alignContent="center"
                                            alignItems="center"
                                        >
                                            <img
                                                src={elem?.courseImage}
                                                style={{
                                                    minWidth: "50%",
                                                    height: "50%",
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
                                            lg={4}
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
                                        >
                                        {elem?.courseOverview}
                                        </MDTypography>
                                    </Grid> */}

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
                                        >
                                        By: {elem?.instructorName.join(', ')}
                                        </MDTypography>
                                    </Grid> */}
                                            </Grid>

                                        </Grid>

                                        <Grid item xs={12} md={12} lg={3} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                                            <Timer socket={socket} courseData={elem} isPaid={elem?.isPaid} />
                                        </Grid>

                                        <Grid gap={2} item xs={12} md={12} lg={3} display='flex' justifyContent={isMobile ? 'center' : 'flex-end'} alignContent='center' alignItems='center' padding={isMobile ? '5px' : '0px'}>
                                            <>
                                                <MDTypography variant='body3' color='dark' style={{ textDecoration: 'line-through' }}>
                                                    ₹{new Intl.NumberFormat(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 0,
                                                            maximumFractionDigits: 0,
                                                        }
                                                    ).format(elem?.coursePrice)}/-
                                                </MDTypography>
                                                <MDTypography variant='body3' color='dark'>
                                                    ₹{new Intl.NumberFormat(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 0,
                                                            maximumFractionDigits: 0,
                                                        }
                                                    ).format(elem?.discountedPrice)}/-
                                                </MDTypography>
                                            </>
                                            <MDTypography variant='body3' color='light' style={{ maxWidth: '50%' }}>
                                                <Payment
                                                    data={elem}
                                                    setShowPay={setShowPay}
                                                    showPay={showPay}
                                                    checkPaid={elem?.isPaid}
                                                    workshop={true}
                                                />
                                            </MDTypography>
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
   
    </>
  )
}



export default Workshop;