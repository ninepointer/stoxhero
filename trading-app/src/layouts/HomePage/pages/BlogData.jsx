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

export default function BlogCard() {
  const [blogData, setBlogData] = useState();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  console.log("location", location, location?.pathname?.split("/"))
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


  return (
    <MDBox style={{ backgroundColor: 'white' }} >
      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ backgroundColor: 'white', height: 'auto', width: 'auto', maxWidth: '100vW' }}>
        <ThemeProvider theme={theme}>
          <Navbar />
          <Helmet>
            <title>{blogData?.metaTitle}</title>
            <meta name='description' content={blogData?.metaDescription} />
            <meta name='keywords' content={blogData?.keywords} />
          </Helmet>
          {isLoading ?
            <MDBox mt={35} mb={35} display="flex" width="100%" justifyContent="center" alignItems="center">
              <CircularProgress color='success' />
            </MDBox>
            :
            <MDBox spacing={2} mt={10} p={1} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ backgroundColor: 'white', maxWidth: '100%', height: 'auto' }}>
              <Grid container display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' spacing={1} xs={12} md={12} lg={12} style={{ maxWidth: '100%', height: 'auto' }}>
                <Grid item display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' xs={12} md={12} lg={12} style={{ maxWidth: '100%', height: 'auto' }}>
                  <Grid container ml={3} mr={3} mb={5} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' spacing={1} xs={12} md={12} lg={8} style={{ maxWidth: '100%', height: 'auto' }}>
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
                          <MDBox dangerouslySetInnerHTML={{ __html: blogData?.blogData }}></MDBox>
                        </Grid>

                      </Grid>
                    </Grid>


                  </Grid>
                  <Grid container ml={3} mr={3} mt={1} mb={5} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' spacing={1} xs={12} md={12} lg={4} style={{ maxWidth: '100%', height: 'auto' }}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ maxWidth: '100%', height: 'auto' }}>
                        <BlogSignUpCard />
                      </MDBox>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </MDBox>}

        </ThemeProvider>


      </MDBox>

      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDTypography fontSize={15} color='text' fontWeight='bold'>Download the App Now</MDTypography>
          </Grid>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <MDButton style={{ maxWidth: '50%', maxHeight: '20%', width: 'auto', height: 'auto' }} component="a" href="https://play.google.com/store/apps/details?id=com.stoxhero.app" target="_blank">
              <img src={playstore} style={{ maxWidth: '60%', maxHeight: '20%', width: 'auto', height: 'auto' }} />
            </MDButton>
          </Grid>
        </Grid>


      <MDBox>
        <Footer />
      </MDBox>
    </MDBox>
  );
}