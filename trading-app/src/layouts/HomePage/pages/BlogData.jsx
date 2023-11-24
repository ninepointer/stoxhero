import React, {useEffect, useState} from 'react'
import axios from "axios";
import {apiUrl} from "../../../constants/constants.js"
import MDBox from '../../../components/MDBox';
import { ThemeProvider } from 'styled-components';
import Navbar from '../components/Navbars/Navbar';
import theme from '../utils/theme/index';
import {useLocation} from 'react-router-dom';
import { Helmet } from 'react-helmet';


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
        <ThemeProvider theme={theme}>
    <Navbar/>
    <Helmet>
        <title></title>
        <meta name='description' content={blogData?.metaDescription} />
        <meta name='keywords' content={blogData?.keywords} />
    </Helmet>
    <MDBox mt={10} p={5} dangerouslySetInnerHTML={{ __html: blogData?.blogData }}>
      </MDBox>
      </ThemeProvider>
    </>
  );
}