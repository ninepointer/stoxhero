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


export default function BlogCard() {
  const [blogData, setBlogData] = useState(null);
  const limitSetting = 9;
  const [skip, setSkip] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    fetchData();
  },[skip])

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
 
  const fetchDeviceDetail = async (id)=>{
    const ipData = await axios.get('https://geolocation-db.com/json/');
    console.log(ipData)
    const ip = ipData?.data?.IPv4;
    const country = ipData?.data?.country_name;
    const isMobile = /Mobi/.test(navigator.userAgent);

    const res = await fetch(`${apiUrl}blogs/savereader`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        ip, country, isMobile, blogId: id
      })
    });


    const data = await res.json();
  }
  const handleOpenNewTab = async (elem) => {
    
    const newTab = window.open(`/blogs/${elem?._id}`, '_blank');
    await fetchDeviceDetail(elem?._id);
  };

  const handlePageChange = (event, value) => {
    setSkip((Number(value)-1)*limitSetting)
  };

  return (
    <>
      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ backgroundColor: 'white', minHeight: '100%', height: 'auto', width: 'auto', maxWidth: '100%' }}>
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
                                              {`${moment.utc(elem?.publishedOn).utcOffset('+05:30').format('DD MMM YYYY')} • ${elem?.readingTime} min read • ${elem?.reader?.length} views`}
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

                    <Grid item xs={12} md={12} lg={12} mt={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                      <Stack spacing={2}>
                        <Pagination style={{ backgroundColor: 'transparent' }} count={Math.ceil(count / limitSetting)} color="success" onChange={handlePageChange} />
                      </Stack>
                    </Grid>

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

      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-end'>
        <Footer />
      </MDBox>
    </>
  );
}