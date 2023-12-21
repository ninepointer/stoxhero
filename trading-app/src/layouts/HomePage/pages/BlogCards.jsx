import React, {useEffect, useState, useContext} from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, Divider, Grid } from '@mui/material';
import axios from "axios";
import {apiUrl} from "../../../constants/constants.js"
import MDBox from '../../../components/MDBox';
import { ThemeProvider } from 'styled-components';
import Navbar from '../components/Navbars/Navbar';
import theme from '../utils/theme/index';
import MDTypography from '../../../components/MDTypography/index.js';
import Footer from '../../../layouts/authentication/components/Footer'
import moment from 'moment'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { CircularProgress } from '@mui/material';
import NoData from "../../../assets/images/noBlogFound.png"
import ReactGA from "react-ga"


export default function BlogCard() {
  const [blogData, setBlogData] = useState(null);
  const limitSetting = 9;
  const [skip, setSkip] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    fetchData();
  },[skip])

  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
  }, []);

  async function fetchData() {
    let call1 = axios.get(`${apiUrl}${"blogs/userpublished"}?skip=${skip}&limit=${limitSetting}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    Promise.all([call1])
      .then(([api1Response]) => {
        setBlogData(api1Response.data.data);
        setCount(api1Response.data.count);
        setTimeout((()=>setIsLoading(false)), 500);
      })
      .catch((error) => {
        console.error(error);
      });
  }
 

  const handleOpenNewTab = async (elem) => {
    
    const newTab = window.open(`/blogs/${elem?.slug}`, '_blank');
    // await fetchDeviceDetail(elem?._id);
  };

  const handlePageChange = (event, value) => {
    setSkip((Number(value)-1)*limitSetting)
  };

  return (
    <>
      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ backgroundColor: 'white', minHeight: '100%', height: 'auto', width: 'auto', maxWidth: '100%', minHeight: "80vh" }}>
        <ThemeProvider theme={theme}>
          <Navbar />
          {!isLoading ?
          <Grid mt={10} mb={7} display='flex' justifyContent='center' alignContent='center' alignItems='center' container xs={12} md={12} lg={12} style={{ maxWidth: '80%', height: 'auto' }}>

            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>

                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '90%' }}>
                  <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDTypography fontSize={18} fontWeight="bold">StoxHero Blogs</MDTypography>
                      </MDBox>
                    </Grid>

                      {blogData.length > 0 ?
                        <Grid item xs={12} mt={5} md={12} lg={12} alignItems='stretch'>

                          <MDBox alignItems='stretch'>
                            <Grid container spacing={3} xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                              {blogData?.map((elem) => {
                                return (
                                  <Grid item xs={12} md={4} lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                    <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                      <Card sx={{ minWidth: '100%', cursor: 'pointer' }} onClick={() => { handleOpenNewTab(elem) }}>

                                        <CardActionArea>
                                          <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                            <img src={elem?.thumbnailImage?.url} style={{ maxWidth: '100%', height: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                                            <Typography variant="h6" fontSize={10} fontFamily='Segoe UI' fontWeight={400} style={{ position: 'absolute', top: 0, right: 0, margin: '8px', textAlign: 'center', color: 'black', backgroundColor: "white", borderRadius: "15px", padding: "2px 10px 2px 10px", marginTop: "10px" }}>
                                              {elem?.category?.toUpperCase() || "F&O"}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                            <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                              <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ width: '100%', minHeight: 60 }}>
                                                <Typography variant="h5" fontFamily='Segoe UI' fontWeight={400} style={{ textAlign: 'center' }}>
                                                  {elem?.blogTitle}
                                                </Typography>
                                              </MDBox>
                                              <Divider style={{ width: '100%' }} />
                                              <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                                                <Typography variant='caption'>
                                                  {`${moment.utc(elem?.publishedOn).utcOffset('+05:30').format('DD MMM YYYY')} • ${elem?.readingTime || 1} min read • ${elem?.viewCount} views`}
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
                        <>
                          <img src={NoData} width='500px' height='500px' />
                        </>
                      }

                    {blogData.length > 0 &&
                    <Grid item xs={12} md={12} lg={12} mt={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <Stack spacing={2}>
                        <Pagination style={{ backgroundColor: 'transparent' }} count={Math.ceil(count / limitSetting)} color="success" onChange={handlePageChange} />
                      </Stack>
                    </Grid>}

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
        </ThemeProvider>
      </MDBox>

      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-end' >
        <Footer />
      </MDBox>
    </>
  );
}