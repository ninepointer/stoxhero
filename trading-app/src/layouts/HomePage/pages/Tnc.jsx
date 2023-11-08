import React, { useEffect } from 'react';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { ThemeProvider } from 'styled-components';
import Title from '../components/Title/index';
import ReactGA from "react-ga";
import Navbar from '../components/Navbars/Navbar';
import Footer from '../components/Footers/Footer';
import theme from '../utils/theme/index';
import MDBox from '../../../components/MDBox';

const TermsAndConditions = () => {
    useEffect(() => {
        ReactGA.pageview(window.location.pathname);
    }, []);

    return (
        <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='center' style={{backgroundColor:'white', minHeight:'100vH', height: 'auto', width: 'auto', minWidth:'100vW'}}>
        <ThemeProvider theme={theme}>
        <Navbar/>
        <Grid display='flex' justifyContent='center' alignContent='center' alignItems='center' container xs={12} md={12} lg={12}>
        <Container>
                    <Grid container spacing={1} flexWrap="wrap-reverse" justifyContent="start" alignItems="center" sx={{ mt: { xs: 10, md: 15 } }}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Stack spacing={1} sx={{ maxWidth: 1280 }}>
                                <Title variant={{ xs: 'h5', sm: 'h3', md: 'h2' }} sx={{ letterSpacing: "0.02em", mb: 1, p: 0 }} style={{ color: "#315c45" }}>
                                    TERMS AND CONDITIONS
                                </Title>
                                <Title variant={{ xs: 'h6', sm: 'h4', md: 'h3' }} sx={{ letterSpacing: "0.02em", mb: 1, p: 0 }} style={{ color: "#315c45" }}>
                                    Welcome to StoxHero!
                                </Title>
                                <Title variant={{ xs: 'body2', sm: 'body2', md: "body2" }} sx={{ fontWeight: 500, letterSpacing: "0.05em", mb: 6, color: "#65BA0D" }}>
                                    Last Updated: 24 June, 2023
                                </Title>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
                <Container>
                    <Grid container spacing={3} sx={{ mt: 2, mb:2, maxWidth: '1280px' }}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="h6" color="#315c45">1. Introduction</Typography>
                            <Typography variant="body2" color="#65BA0D">
                                Welcome to StoxHero, a premier virtual options trading platform. By accessing and using our platform, you signify your agreement to these terms and conditions. If you disagree with any part of these terms, you must refrain from using our platform.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="h6" color="#315c45">2. Definitions</Typography>
                            <Typography variant="body2" color="#65BA0D">
                                "Platform" refers to the StoxHero virtual options trading platform and all associated services.
                            </Typography>
                            <Typography variant="body2" color="#65BA0D">
                                "User" refers to any individual or entity that accesses or uses our platform.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="h6" color="#315c45">3. Services</Typography>
                            <Typography variant="body2" color="#65BA0D">
                                StoxHero offers a platform for derivatives traders to learn, practice, and enhance their trading skills. The platform provides real-time data, analysis, and execution tools for both novice and experienced traders.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="h6" color="#315c45">4. User Obligations</Typography>
                            <Typography variant="body2" color="#65BA0D">
                                Users are obligated to use the platform in a manner consistent with any and all applicable laws and regulations. Unauthorized use of the platform is strictly prohibited.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="h6" color="#315c45">5. Refund Policy</Typography>
                            <Typography variant="body2" color="#65BA0D">
                                All sales on StoxHero are final. No refunds will be provided once services or goods have been purchased.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="h6" color="#315c45">6. Limitation of Liability</Typography>
                            <Typography variant="body2" color="#65BA0D">
                                StoxHero shall not be liable for any damages or losses resulting from the use or inability to use the platform or any of its services.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="h6" color="#315c45">7. Amendments</Typography>
                            <Typography variant="body2" color="#65BA0D">
                                StoxHero reserves the right to modify or replace these terms at any time without prior notice.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="h6" color="#315c45">8. Governing Law</Typography>
                            <Typography variant="body2" color="#65BA0D">
                                These terms shall be governed by the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of India.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="h6" color="#315c45">9. Duplicate User Accounts</Typography>
                            <Typography variant="body2" color="#65BA0D">
                                It is imperative that each user account maintains unique KYC particulars, encompassing Aadhaar and PAN details, as well as distinct bank information, including the bank account number and UPI specifications. Should any user's information mirror that of another, the subsequent account(s) in question will be promptly suspended.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="h6" color="#315c45">10. Account Termination</Typography>
                            <Typography variant="body2" color="#65BA0D">
                                The trading app platform reserves the right to terminate or suspend your account at any time and for any reason. In the event of account termination, you may lose access to all information associated with your account.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="h6" color="#315c45">11. Contact</Typography>
                            <Typography variant="body2" color="#65BA0D">
                                For queries, clarifications, or feedback, users can contact StoxHero Games Technologies Private Limited at the provided email and contact.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="body2" color="#315c45">
                            By registering on our platform, you hereby acknowledge and consent to our terms and conditions. Should you have any reservations or concerns regarding these terms, please do not hesitate to reach out to our administrative team for assistance. If necessary, we can facilitate the deactivation of your account upon request.
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
        </Grid>
        </ThemeProvider>
        </MDBox>
    );
}

export default TermsAndConditions;
