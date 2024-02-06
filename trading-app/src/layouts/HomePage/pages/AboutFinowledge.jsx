import { Container, Grid, Stack } from '@mui/material'
import { ThemeProvider } from 'styled-components';
import { useEffect } from 'react';
import ReactGA from "react-ga";
import Title from '../components/Title/index'
import React from 'react'
import ServiceCard from '../components/Cards/ServiceCard'
import Navbar from '../components/Navbars/FinNavBar'
import theme from '../utils/theme/index'
import Footer from '../../authentication/components/Footer'
import { Helmet } from 'react-helmet';

// IMages for about 
// import aboutuspage from '../../../assets/images/aboutuspage.png'
import cofounder_prateek from '../../../assets/images/cofounder_prateek.png'
import cofounder_kush from '../../../assets/images/cofounder_kush.png'
import cofounder_manish from '../../../assets/images/cofounder_manish.png'
import MDAvatar from '../../../components/MDAvatar';
import MDTypography from '../../../components/MDTypography';
import MDBox from '../../../components/MDBox';
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import AboutUs from '../../../assets/images/aboutus.jpg'

const LinkButton = ({ children, ...props }) => (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.2}
      sx={{
        cursor: "pointer",
        color: "#353535",
        "&:hover": { color: '#ffffff'},
      }}
      {...props}
    >
      {children}
    </Stack>
  );

const About = () => {
    useEffect(()=>{
        ReactGA.pageview(window.location.pathname)
        window.webengage.track('about_clicked', {
        })
    })

    let text = 'Learn about StoxHero\'s journey to revolutionize trading education with our expert team from top institutions. Join our community of skilled traders.'

    return (

        <div
            style={{
                height: '100vh',
                backgroundColor: "#353535",
            }}
        >
            <ThemeProvider theme={theme}>
                <Navbar />
                <Helmet>


                    <title>StoxHero - Empowering Traders with Expert Education</title>
                    <meta name='description' content={text} />
                    <meta name='keywords' content='learn stock market, learn stock market trading, stock market learning course, learn how to invest in stock market, how to learn stock market trading in india, best way to learn stock market, trading, stock market learning app, best app for virtual trading, trading chart patterns, social trading,stock price today, online trading, trading competition, share trading competition, trading competition in india' />

                </Helmet>
                <MDBox style={{ backgroundColor: "#353535" }}  mb={8}>
                    {/* <Container> */}
                    <Grid container xs={12} md={12} lg={12} style={{ minWidth: 'auto', backgroundColor: "#353535" }} display='flex' flexWrap="wrap-reverse" justifyContent="center" alignItems="flex-start">

                        <Grid item xs={12} md={12} lg={12} style={{ minWidth: '100%', textAlign: 'center' }}>
                            <img src={AboutUs} style={{ maxWidth: "70%", maxHeight: "30%", marginTop: "80px" }} alt="" />
                        </Grid>

                    </Grid>
                    {/* </Container> */}
                    <Container sx={{ height: "1200" }} display='flex' justifyContent='center' alignItems='flex-start'>
                        <Grid container xs={12} md={6} lg={12} spacing={2} display='flex' justifyContent='center' alignItems="flex-start">
                            <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems="flex-start">
                                <Stack>
                                    <Title fontSize={20} sx={{ letterSpacing: "0.02em", mb: 1, textAlign: 'center' }} style={{ color: '#D5F47E' }} >The goal of a successful trader is to make the best trades. Money is secondary.</Title>
                                    <Title fontSize={15} sx={{ letterSpacing: "0.02em", mb: 1, textAlign: 'center' }} style={{ color: '#D5F47E' }} >At StoxHero, our mission is to reduce the number of individual traders incurring losses in the equity F&O segment, striving for a more successful trading community.</Title>
                                    <Title fontSize={20} sx={{ letterSpacing: "0.02em", mb: 1, textAlign: 'center' }} style={{ color: '#D5F47E' }} >The Team</Title>
                                    <Title fontSize={15} sx={{ fontWeight: 400, letterSpacing: "0.05em", mb: 6, textAlign: 'center', color: "#ffffff" }} >
                                        StoxHero is led by a dynamic co-founding team with second-time startup founders and impressive educational backgrounds,
                                        including <span style={{ color: '#ffffff', fontWeight: 'bold' }}>IIT, IIM, and NIT</span>. Their diverse expertise spans derivatives trading, stock exchanges, and leadership roles
                                        at top tech startups like <span style={{ color: '#ffffff', fontWeight: 'bold' }}>Unacademy, OLA, Mu-Sigma, JAYPEE Capital, NCDEX, and NeoStencil</span>. All three co-founders share
                                        a history of working as a team at Unacademy and NeoStencil and committed to one cause - to make individual traders better traders!
                                    </Title>
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems='flex-start'>

                                <Grid container style={{ minHeight: '20vH' }} spacing={8} xs={12} md={6} lg={12} display='flex' justifyContent='center' alignItems='flex-start'>
                                    <Grid item xs={12} md={6} lg={4} display='flex' justifyContent='center' alignItems='flex-start' style={{ width: '100%' }}>
                                        <MDBox display='flex' justifyContent='center' flexDirection='column' alignItems='flex-start' style={{ width: '100%' }}>
                                            <MDBox display='flex' justifyContent='center' alignItems='flex-start' style={{ width: '100%' }}>
                                                <MDAvatar alt="Kush Beejal" src={cofounder_kush} sx={{ width: 100, height: 100 }} />
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='center' alignItems='flex-start' style={{ width: '100%' }}>
                                                <MDTypography fontWeight='bold' sx={{ letterSpacing: "0.02em", textAlign: 'center', color: '#ffffff' }} >Kush Beejal</MDTypography>
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='center' alignItems='flex-start' style={{ width: '100%' }}>
                                                <a href="https://www.linkedin.com/in/kushbeejal/" target="_blank">
                                                    <LinkButton>
                                                        <LinkedInIcon style={{ height: 30, width: 30 }} />
                                                    </LinkButton>
                                                </a>
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='center' alignItems='flex-start'>
                                                <MDTypography fontSize={13} sx={{ letterSpacing: "0.02em", textAlign: 'justify', color: '#ffffff' }} >
                                                    StoxHero is my 2nd startup having previously built NeoStencil, a successful and profitable edtech platform acquired by India’s leading edtech company Unacademy in 2020. As VP, Business at Unacademy, I launched new business segments. In earlier roles, I worked as a Derivatives Trader for a leading prop-trading desk for 2.5 years. I hold degrees from IIT Bombay & IIM Calcutta.
                                                </MDTypography>
                                            </MDBox>
                                        </MDBox>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={4} display='flex' justifyContent='center' alignItems='flex-start' style={{ width: '100%' }}>
                                        <MDBox display='flex' justifyContent='center' flexDirection='column' alignItems='flex-start' style={{ width: '100%' }}>
                                            <MDBox display='flex' justifyContent='center' alignItems='flex-start' style={{ width: '100%' }}>
                                                <MDAvatar alt="Prateek Pawan" src={cofounder_prateek} sx={{ width: 100, height: 100 }} />
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='center' alignItems='flex-start' style={{ width: '100%' }}>
                                                <MDTypography fontWeight='bold' sx={{ letterSpacing: "0.02em", textAlign: 'center', color: '#ffffff' }} >Prateek Pawan</MDTypography>
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='center' alignItems='flex-start' style={{ width: '100%' }}>
                                                <a href="https://www.linkedin.com/in/prateekpawan/" target="_blank">
                                                    <LinkButton>
                                                        <LinkedInIcon style={{ height: 30, width: 30 }} />
                                                    </LinkButton>
                                                </a>
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='center' alignItems='flex-start'>
                                                <MDTypography fontSize={13} sx={{ letterSpacing: "0.02em", textAlign: 'justify', color: '#ffffff' }} >
                                                    StoxHero is my 2nd startup. I previously built a food-tech startup MBL Foods Services, a leading chain in terms of orders for North Indian food on Zomato & Swiggy in Bangalore region. I have worked with Unacademy to set up new business lines. At Ninjacart, I handled operations in Delhi region, and prior to that, I worked as a Data Analyst with MuSigma & TCS. I am a Computer Science Engineer from NIT Rourkela.
                                                </MDTypography>
                                            </MDBox>
                                        </MDBox>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={4} display='flex' justifyContent='center' alignItems='flex-start' style={{ width: '100%' }}>
                                        <MDBox display='flex' justifyContent='center' flexDirection='column' alignItems='flex-start' style={{ width: '100%' }}>
                                            <MDBox display='flex' justifyContent='center' alignItems='flex-start' style={{ width: '100%' }}>
                                                <MDAvatar alt="Manish Nair" src={cofounder_manish} sx={{ width: 100, height: 100 }} />
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='center' alignItems='flex-start' style={{ width: '100%' }}>
                                                <MDTypography fontWeight='bold' sx={{ letterSpacing: "0.02em", textAlign: 'center', color: '#ffffff' }} >Manish Nair</MDTypography>
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='center' alignItems='flex-start' style={{ width: '100%' }}>
                                                <a href="https://www.linkedin.com/in/i-manishnair/" target="_blank">
                                                    <LinkButton>
                                                        <LinkedInIcon style={{ height: 30, width: 30 }} />
                                                    </LinkButton>
                                                </a>
                                            </MDBox>
                                            <MDBox display='flex' justifyContent='center' alignItems='flex-start'>
                                                <MDTypography fontSize={13} sx={{ letterSpacing: "0.02em", textAlign: 'justify', color: '#ffffff' }} >
                                                    Boasting a rich decade in startups, I've excelled in business development, operations, and strategy. My journey includes thriving in online advertising, marketplace, and edtech sectors, collaborating with IndiaMart, OLA, NeoStencil, and Unacademy. My enduring commitment drives me to redefine success.
                                                </MDTypography>
                                            </MDBox>
                                        </MDBox>
                                    </Grid>
                                </Grid>


                            </Grid>

                        </Grid>
                    </Container>
                </MDBox>

            </ThemeProvider>
        </div>
    )
}

export default About;



