import React, {useEffect, useState, useContext} from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, Divider, Grid } from '@mui/material';
import axios from "axios";
import {apiUrl} from "../../../constants/constants.js"
import MDBox from '../../../components/MDBox/index.js';
// import { ThemeProvider } from 'styled-components';
// import Navbar from '../components/Navbars/Navbar';
// import theme from '../utils/theme/index';
// import MDTypography from '../../../components/MDTypography/index.js';
// import Footer from '../../../layouts/authentication/components/Footer'
import moment from 'moment'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { CircularProgress } from '@mui/material';
import NoData from "../../../assets/images/noBlogFound.png"
import {Link} from 'react-router-dom'


export default function CoursesList({data, isLoading}) {


  return (
    <>
      {!isLoading ?
        <Grid mt={1} mb={1} display='flex' justifyContent='center' alignContent='center' alignItems='center' container xs={12} md={12} lg={12} style={{ maxWidth: '80%', height: 'auto' }}>

          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>

              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%' }}>
                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>

                  {data?.length > 0 ?
                    <Grid item xs={12} mt={5} md={12} lg={12} alignItems='stretch'>

                      <MDBox alignItems='stretch'>
                        <Grid container spacing={3} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                          {data?.map((elem) => {
                            return (
                              <Grid item xs={12} md={4} lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                  <Card 
                                  sx={{ minWidth: '100%', cursor: 'pointer' }}
                                  component={Link}
                                  to={{
                                      pathname: `/coursedata`,
                                      search: `?id=${elem?._id}`,
                                      state: { data: elem }
                                  }}
                                  >

                                    <CardActionArea>
                                      <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                        <img src={elem?.courseImage} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                                        {/* <Typography variant="h6" fontSize={10} fontFamily='Segoe UI' fontWeight={400} style={{ position: 'absolute', top: 0, right: 0, margin: '8px', textAlign: 'center', color: 'black', backgroundColor: "white", borderRadius: "15px", padding: "2px 10px 2px 10px", marginTop: "10px" }}>
                                          {elem?.category?.toUpperCase() || "F&O"}
                                        </Typography> */}
                                      </Grid>
                                      <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                        <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                          <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', minHeight: 60 }}>
                                            <Typography variant="h5" fontFamily='Segoe UI' fontWeight={400} style={{ textAlign: 'center' }}>
                                              {elem?.courseName}
                                            </Typography>
                                          </MDBox>
                                          <Divider style={{ width: '100%' }} />
                                          <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                            <Typography variant='caption'>
                                               {`${elem?.userEnrolled} enrolled • ${elem?.maxEnrolments - elem?.userEnrolled} enrollment left`}
                                               {/* ${moment.utc(elem?.courseStartTime).utcOffset('+05:30').format('DD MMM YYYY')} */}
                                            </Typography>
                                          </MDBox>
                                        </CardContent>
                                      </Grid>
                                    </CardActionArea>
                                  </Card>
                                </Grid>
                              </Grid>
                            )
                          })}
                        </Grid>
                      </MDBox>

                    </Grid>
                    :
                    <Grid item xs={12} md={12} lg={12} ml={15} display='flex' justifyContent={'center'} alignContent={'center'}>
                      <img src={NoData} width='500px' height='500px' />
                    </Grid>
                  }
                </Grid>
              </Grid>

            </Grid>
          </Grid>
        </Grid>
        :
        <MDBox mt={35} mb={35} display="flex" width="100%" justifyContent="center" alignItems="center">
          <CircularProgress color='success' />
        </MDBox>
      }
    </>
  );
}