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

export default function BlogCard() {
  const [blogData, setBlogData] = useState();
  const location = useLocation();

  console.log("location", location, location?.pathname?.split("/"))
  useEffect(() => {
    let call1 = axios.get(`${apiUrl}blogs/${location?.pathname?.split("/")[2]}`,{
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
      })
Promise.all([call1])
.then(([api1Response]) => {
setBlogData(api1Response.data.data)
})
.catch((error) => {
console.error(error);
});
  }, []);


  return (
    <>
    <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{backgroundColor:'white', height: 'auto', width: 'auto', maxWidth:'100vW'}}>
    <ThemeProvider theme={theme}>
    <Navbar/>
    <Helmet>
        <title></title>
        <meta name='description' content={blogData?.metaDescription} />
        <meta name='keywords' content={blogData?.keywords} />
    </Helmet>
    <MDBox mt={15} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{backgroundColor:'white', height: 'auto', width: 'auto', maxWidth:'100vW'}}>
    <Grid mb={5} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' container spacing={1} xs={12} md={12} lg={12} style={{maxWidth:'95%'}}>
      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start'>
        <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start' pl={8} pr={8}>
          <MDTypography variant="h5">{blogData?.blogTitle}</MDTypography>
        </MDBox>
      </Grid>
      <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start'>
        <MDBox display='flex' justifyContent='flex-start' alignContent='center' alignItems='flex-start' pl={8} pr={8}>
          <MDTypography variant="caption" style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
              <CiCalendar /> &nbsp;
              {`${moment.utc(blogData?.publishedOn).utcOffset('+05:30').format('DD MMMM YYYY')}`} &nbsp;
              <CiTimer /> &nbsp;
              {`${blogData?.readingTime} min read`} &nbsp;
              <CiRead/> &nbsp;
              {`${blogData?.reader?.length} views`}
          </MDTypography>
        </MDBox>
      </Grid>
      <Grid item xs={12} md={12} lg={8} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{width:'100%'}}>
        <Grid container pl={8} pr={8} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{width:'100%'}}>
          <Grid item xs={12} md={12} lg={12} style={{maxWidth:'100%'}}>
            <img src={blogData?.thumbnailImage?.url} width='100%'/>
          </Grid>
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%'}}>
            <MDBox dangerouslySetInnerHTML={{ __html: blogData?.blogData }}></MDBox>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={12} lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{width:'100%'}}>
        <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{minWidth:'100%'}}>
          <BlogSignUpCard/>
        </MDBox>
      </Grid>
    </Grid> 
    </MDBox>
    </ThemeProvider>
    </MDBox>
    <MDBox>
      <Footer/>
    </MDBox>
    </>
  );
}