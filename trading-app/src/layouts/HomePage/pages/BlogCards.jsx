import React, {useEffect, useState, useContext} from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
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
      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{backgroundColor:'white', minHeight:'100vH', height: 'auto', width: 'auto', minWidth:'100vW'}}>
      <ThemeProvider theme={theme}>
        <Navbar/>
        <Grid mt={10} mb={10} display='flex' justifyContent='center' alignContent='center' alignItems='center' container xs={12} md={12} lg={12} style={{maxWidth:'80%'}}>
          
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center'>
              
              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'90%'}}>
                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
                  <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
                    <MDBox  display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
                      <MDTypography fontSize={18} fontWeight="bold">StoxHero Blogs</MDTypography>
                    </MDBox>
                  </Grid>
                  
                  <Grid item xs={12} mt={5} md={12} lg={12} alignItems='stretch'>
                    
                      <MDBox alignItems='stretch'>
                      <Grid container spacing={3} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
                          {blogData?.map((elem)=>{
                            return (
                                <Grid item xs={12} md={4} lg={4} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
                                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
                                <Card sx={{ minWidth: '100%' }} onClick={()=>{handleOpenNewTab(elem)}}>
                                
                                  <CardActionArea>
                                  <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
                                    <CardMedia
                                      component="img"
                                      height="180"
                                      style={{maxWidth:'100%'}}
                                      image={elem?.thumbnailImage?.url}
                                      alt="green iguana"
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
                                    <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
                                      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%', minHeight:60}}>
                                      <Typography variant="h5" fontFamily='Segoe UI' fontWeight={400} style={{textAlign:'center'}}>
                                        {elem?.blogTitle}
                                      </Typography>
                                      </MDBox>
                                      <Divider style={{width:'100%'}}/>
                                      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{width:'100%'}}>
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

                </Grid>
              </Grid>

            </Grid>
          </Grid>
        </Grid>
        
      </ThemeProvider>
    </MDBox>
    <MDBox>
      <Footer/>
    </MDBox>
    </>
  );
}