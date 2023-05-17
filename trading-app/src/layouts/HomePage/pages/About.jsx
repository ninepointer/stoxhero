import { Box, Container, Grid, Stack } from '@mui/material'
import { ThemeProvider } from 'styled-components';
import Title from '../components/Title/index'
import React from 'react'
import ServiceCard from '../components/Cards/ServiceCard'

import useMeasure from 'react-use-measure'

import Footer from '../components/Footers/Footer'

import Navbar from '../components/Navbars/Navbar'
import theme from '../utils/theme/index'

// IMages for about 

import about1 from '../assets/images/About/about1.png'
import about2 from '../assets/images/About/about2.png'
import about3 from '../assets/images/About/about3.webp'
import about4 from '../assets/images/About/about4.png'
import about5 from '../assets/images/About/about5.webp'



const About = () => {
    console.log(theme);
    return (



        <ThemeProvider theme={theme}>






            <Navbar />
            <Box bgcolor="#06070A" sx={{mt:{xs:-10,lg:-15}}} >
                
                

                <Container >
                    <Grid container spacing={10} flexWrap="wrap-reverse" justifyContent="center" alignItems="center" sx={{ mt: { xs: 10, md: 15, } }}>
                        <Grid item xs={12} md={6} sx={{mt:10}}  >
                            <Stack spacing={2} sx={{ maxWidth: 480 }}>
                                <Title variant={{ xs: 'h3', sm: 'h2', md: 'h1' }} sx={{ letterSpacing: "0.02em", mb: 1 }} style={{ color: "white" }} >StoxHero</Title>
                                <Title variant={{ xs: 'body1', sm: 'body1', md: "body1" }} sx={{ fontWeight: 500, letterSpacing: "0.05em", mb: 6, color: "rgba(255, 255, 255, 0.6)" }} >Welcome to StoxHero.com, the ultimate trading-gamification platform designed to empower GenZ users interested in pursuing a career in the exciting world of trading. Our platform provides a unique blend of gamification and real-time trading, offering a comprehensive training experience for retail traders.</Title>

                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={6} sx={{mt:10}} >
                            <img src={about1} style={{ width: "100%", objectFit: "contain" }} alt="" />
                        </Grid>
                    </Grid>
                </Container>


                <Container sx={{ height: "1200" }} >
                    <Grid container spacing={10} flexWrap="wrap-reverse" alignItems="center" sx={{ mt: { xs: 10, md: 15 } }}>
                        <Grid item xs={12} md={6}  >
                            <Stack spacing={2} sx={{ maxWidth: 480 }}>

                                <Title variant={{ xs: 'h3', sm: 'h2', md: 'h1' }} sx={{ letterSpacing: "0.02em", mb: 1 }} style={{ color: "white" }} >Idea</Title>
                                <Title variant={{ xs: 'body1', sm: 'body1', md: "body1" }} sx={{ fontWeight: 500, letterSpacing: "0.05em", mb: 6, color: "rgba(255, 255, 255, 0.6)" }} >At StoxHero, we understand the importance of practice and learning in mastering the art of trading. That's why we have created a cutting-edge platform that combines the thrill of gamification with the dynamics of intra-day trading. Our daily contests on real-time contracts provide users with the perfect opportunity to test their skills, implement different strategies, and stay ahead in the competitive stock market environment..</Title>

                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <img src={about2} style={{ width: "100%", objectFit: "contain" }} />
                        </Grid>

                    </Grid>
                </Container>









                <Container sx={{ height: "100%", mt: 20, mb: 20 }}>



                    <Stack spacing={4} >
                        <ServiceCard image={about3} title="Community" subtitle="StoxHero's Smart Reports are a game-changer, offering user-specific trading insights and analysis. These reports provide invaluable guidance to help traders evolve and make informed decisions. Our goal is to empower users to choose trading as a viable career option while continuing to trade on StoxHero with real money." />
                        <ServiceCard image={about4} title="Gamified" subtitle="Whether you're a beginner looking to explore the world of trading or an experienced trader seeking to enhance your skills, StoxHero is your go-to platform. Our gamified trading approach, coupled with user-specific insights, helps you maximize your potential and increase your income." />
                        <ServiceCard image={about5} title="Program" subtitle="Join StoxHero.com today and embark on an exhilarating journey towards success in the stock market. Experience the power of gamification, practice your strategies in the virtual trading section, and unlock a world of opportunities. With StoxHero, you have the tools, knowledge, and support you need to excel in intra-day trading and beyond." />
                    </Stack>


                </Container>


                <Footer />
            </Box>


        </ThemeProvider>
    )
}

export default About;



