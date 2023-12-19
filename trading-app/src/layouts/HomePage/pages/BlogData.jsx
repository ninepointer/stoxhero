import React, {useEffect, useState} from 'react'
import axios from "axios";
import {apiUrl} from "../../../constants/constants.js"
import MDBox from '../../../components/MDBox';
import { ThemeProvider } from 'styled-components';
import Navbar from '../components/Navbars/Navbar';
import theme from '../utils/theme/index';
import {useLocation} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Grid } from '@mui/material';
import BlogSignUpCard from './BlogSignupCard.jsx'
import MDTypography from '../../../components/MDTypography/index.js';
import moment from 'moment'
import { CiCalendar } from "react-icons/ci";
import { CiTimer } from "react-icons/ci";
import { CiRead } from "react-icons/ci";
import Footer from '../../authentication/components/Footer/index.js'
import { CircularProgress } from '@mui/material';
import MDButton from '../../../components/MDButton/index.js';
import playstore from '../../../assets/images/playstore.png'
import ReactGA from "react-ga"

export default function BlogCard() {
  const [blogData, setBlogData] = useState();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // console.log("location", location, location?.pathname?.split("/"))
  useEffect(() => {
    let call1 = axios.get(`${apiUrl}blogs/bytitle/${location?.pathname?.split("/")[2]}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    Promise.all([call1])
      .then(([api1Response]) => {
        setBlogData(api1Response.data.data)
        setTimeout((() => setIsLoading(false)), 500);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname)
  }, []);

  useEffect(()=>{
    blogData && fetchDeviceDetail(blogData?._id);
  }, [blogData])
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


  return (
    <MDBox style={{ backgroundColor: 'white',  }} >
      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ backgroundColor: 'white', height: 'auto', width: 'auto', maxWidth: '100vW' }}>
        <ThemeProvider theme={theme}>
          <Navbar />
          <Grid container p={5} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{width:'100%'}}>
          {isLoading ?
            
              <Grid container mt={35} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' spacing={1} xs={12} md={12} lg={12} style={{ maxWidth: '100%', height: 'auto' }}>
                <CircularProgress color='success' />
              </Grid>
           
            :
              <>
              {/* {(blogData?.metaTitle && blogData?.metaDescription && blogData?.thumbnailImage?.url) && */}
                <Helmet>

 
                  <title>{blogData?.metaTitle}</title>
                  <meta name='description' content={blogData?.metaDescription} />
                  <meta name='keywords' content={blogData?.keywords} />
                  <meta name="twitter:card" content="summary_large_image" />
                  <meta name="twitter:title" content={blogData?.metaTitle} />
                  <meta name="twitter:description" content={blogData?.metaDescription} />
                  <meta name="twitter:image" content={blogData?.thumbnailImage?.url} />
                  <meta itemprop="image" content={blogData?.thumbnailImage?.url}></meta>
                  <meta property="og:title" content={blogData?.metaTitle} />
                  <meta property="og:description" content={blogData?.metaDescription} />
                  <meta property="og:image" content={blogData?.thumbnailImage?.url} />
                  <meta property="og:url" content={`https://stoxhero.com/blogs/${location?.pathname?.split("/")[2]}`} />

                </Helmet>
                {/* } */}

                <Grid container p={2} spacing={1} xs={12} md={12} lg={8} mt={5} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid container xs={12} md={12} lg={12} mb={5} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' spacing={1} style={{ maxWidth: '100%', height: 'auto' }}>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start'>
                          <MDTypography variant="h5">{blogData?.blogTitle}</MDTypography>
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                        <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start'>
                          <MDTypography variant="caption" style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
                            <CiCalendar /> &nbsp;
                            {`${moment.utc(blogData?.publishedOn).utcOffset('+05:30').format('DD MMMM YYYY')}`} &nbsp;
                            <CiTimer /> &nbsp;
                            {`${blogData?.readingTime || 1} min read`} &nbsp;
                            <CiRead /> &nbsp;
                            {`${blogData?.viewCount || 0} views`}
                          </MDTypography>
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                        <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ width: '100%' }}>
                          <Grid item xs={12} md={12} lg={12} style={{ maxWidth: '100%' }}>
                            <img src={blogData?.thumbnailImage?.url} width='100%' />
                          </Grid>
                          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ maxWidth: '100%' }}>
                            <MDBox
                              // dangerouslySetInnerHTML={{ __html: blogData?.blogData }} 
                              style={{ maxWidth: '100%', width: '100%', height: 'auto' }}
                            >
                              <div dangerouslySetInnerHTML={{ __html: blogData?.blogData }} />
                              <style>
                                {`
                                img {
                                  max-width: 70%;
                                  height: auto;
                                }
                              `}
                              </style>
                            </MDBox>
                          </Grid>

                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </>

            
          }


              <Grid container p={2} mt={10} xs={12} md={12} lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                  <BlogSignUpCard />
                </Grid>
              </Grid>

              <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{ maxWidth: '100%', height: 'auto' }}>
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                  <MDTypography fontSize={15} color='text' fontWeight='bold'>Download the App Now</MDTypography>
                </Grid>
                <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
                  <MDButton style={{ maxWidth: '50%', maxHeight: '20%', width: 'auto', height: 'auto' }} component="a" href="https://play.google.com/store/apps/details?id=com.stoxhero.app" target="_blank">
                    <img src={playstore} style={{ maxWidth: '60%', maxHeight: '20%', width: 'auto', height: 'auto' }} />
                  </MDButton>
                </Grid>
              </Grid>

      </Grid>
      </ThemeProvider>
      </MDBox>


      <MDBox>
        <Footer />
      </MDBox>
    </MDBox>
  );
}