import React, {useEffect, useState, useContext} from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import axios from "axios";
import {apiUrl} from "../../../constants/constants.js"
import MDBox from '../../../components/MDBox';
import { ThemeProvider } from 'styled-components';
import Navbar from '../components/Navbars/Navbar';
import theme from '../utils/theme/index';
import MDTypography from '../../../components/MDTypography/index.js';


export default function BlogCard() {
  const [blogData, setBlogData] = useState();
  useEffect(()=>{
    let call1 = axios.get(`${apiUrl}blogs/published`,{
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
  },[])

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
  return (
    <>
        <ThemeProvider theme={theme}>
    <Navbar/>
    <MDTypography fontSize={60} fontWeight={900} mt={10} textAlign='center'>StoxHero Blogs</MDTypography>
    <MDBox mt={5}>
      {blogData?.map((elem)=>{
        return (
          <MDBox display='flex' alignItem='center' justifyContent='center'>
            <Card sx={{ maxWidth: 345 }} onClick={()=>{handleOpenNewTab(elem)}}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={elem?.thumbnailImage?.url}
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {elem?.blogTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {`${elem?.publishedOn} • ${elem?.readingTime} min read`}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </MDBox>
        )
      })}
      </MDBox>
      </ThemeProvider>
    </>
  );
}