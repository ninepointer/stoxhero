import React, {useEffect, useState, useContext} from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Divider, Grid } from '@mui/material';
import axios from "axios";
import {apiUrl} from "../../../constants/constants.js"
import MDBox from '../../../components/MDBox/index.js';
import { ThemeProvider } from 'styled-components';
import Navbar from '../components/Navbars/Navbar.jsx';
import theme from '../utils/theme/index';
import MDTypography from '../../../components/MDTypography/index.js';
import Footer from '../../authentication/components/Footer/index.js'
import moment from 'moment'
import learnfno from '../../../assets/images/learnfno.png'
import testzone from '../../../assets/images/testzone.png'
import MDButton from '../../../components/MDButton/index.js';


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

  const handleOpenHomePage = async () => {
    const newTab = window.open(`https://play.google.com/store/apps/details?id=com.stoxhero.app&hl=en_US`, '_blank');
  };
  return (
    <>
        <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
          
          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
              
              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                  
                  <Grid item xs={12} mt={2} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                    
                      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                          <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                          <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                          <Card sx={{ maxWidth: '100%', height:'auto' }} onClick={()=>{handleOpenHomePage()}}>
                          
                            <CardActionArea>
                            <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                              <CardMedia
                                component="img"
                                height="120"
                                style={{maxWidth:'100%'}}
                                image={learnfno}
                                alt="green iguana"
                              />
                            </Grid>
                            <Grid item xs={12} md={4} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                              <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                                  <Typography variant="h5" fontFamily='Segoe UI' fontWeight={400} style={{textAlign:'center', color:'#65BA0D'}}>
                                    Want to learn Trading?
                                  </Typography>
                                </MDBox>   
                                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                                  <Typography variant='caption' style={{textAlign:'center'}}>
                                      Open a StoxHero account and start learning. It's fast and 100% free!
                                  </Typography>
                                </MDBox>
                                <MDBox mt={3} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                                  <Typography variant='caption' fontWeight={700} style={{textAlign:'center'}}>
                                      Download StoxHero App and use code <span style={{backgroundColor:'#65BA0D', color:'white', padding:2, borderRadius:3}}>SHBSU100</span> to get ₹100 in your StoxHero wallet.
                                  </Typography>
                                </MDBox>
                                <Divider style={{maxWidth:'100%', height:'auto'}}/>
                                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                                  <Typography variant='caption' fontWeight={700} style={{textAlign:'center', color:'#65BA0D'}}>
                                      Download App Now!
                                  </Typography>
                                </MDBox>
                              </CardContent>
                            </Grid>
                            </CardActionArea>
                          </Card>
                          </Grid>
                          </Grid>
                        </Grid>
                      </MDBox>
                    
                  </Grid>

                </Grid>
              </Grid>

            </Grid>
          </Grid>

          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
            <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
              
              <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                  
                  <Grid item mt={2} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                    
                      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                      <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                          <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                          <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                          <Card sx={{ maxWidth: '100%', height:'auto' }} onClick={()=>{handleOpenHomePage()}}>
                          
                            <CardActionArea>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                              <CardMedia
                                component="img"
                                height="120"
                                style={{maxWidth:'100%'}}
                                image={testzone}
                                alt="green iguana"
                              />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                              <CardContent display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                                  <Typography variant="h5" fontFamily='Segoe UI' fontWeight={400} style={{textAlign:'center', color:'#65BA0D'}}>
                                      Experience the real F&O market!
                                  </Typography>
                                </MDBox>   
                                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                                  <Typography variant='caption' style={{textAlign:'center'}}>
                                      Participate in different TestZones to test your strategies & win cash rewards!
                                  </Typography>
                                </MDBox>
                                <MDBox mt={3} display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                                  <Typography variant='caption' fontWeight={700} style={{textAlign:'center'}}>
                                      Download StoxHero App and use code <span style={{backgroundColor:'#65BA0D', color:'white', padding:2, borderRadius:3}}>SHBTZ100</span> to get ₹100 in your StoxHero wallet.
                                  </Typography>
                                </MDBox>
                                <Divider style={{width:'100%'}}/>
                                <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{maxWidth:'100%', height:'auto'}}>
                                  <Typography variant='caption' fontWeight={700} style={{textAlign:'center', color:'#65BA0D'}}>
                                      Download App Now!
                                  </Typography>
                                </MDBox>
                              </CardContent>
                            </Grid>
                            </CardActionArea>
                          </Card>
                          </Grid>
                          </Grid>
                        </Grid>
                      </MDBox>
                    
                  </Grid>

                </Grid>
              </Grid>

            </Grid>
          </Grid>
        </Grid>
    </>
  );
}