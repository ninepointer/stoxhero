import React, { useEffect } from 'react';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { ThemeProvider } from 'styled-components';
import Title from '../components/Title/index';
import ReactGA from "react-ga";
import Navbar from '../components/Navbars/Navbar';
import Footer from '../components/Footers/Footer';
import theme from '../utils/theme/index';

const TermsAndConditions = () => {
    useEffect(() => {
        ReactGA.pageview(window.location.pathname);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Navbar />
            <Box bgcolor="#06070A" sx={{ mt: { xs: -10, lg: -15 } }}>
                <Container>
                    <Grid container spacing={10} flexWrap="wrap-reverse" justifyContent="start" alignItems="center" sx={{ mt: { xs: 10, md: 15 } }}>
                        <Grid item xs={12} md={6} sx={{ mt: 10 }}>
                            <Stack spacing={2} sx={{ maxWidth: 1280 }}>
                                <Title variant={{ xs: 'h3', sm: 'h2', md: 'h1' }} sx={{ letterSpacing: "0.02em", mb: 1, p: 0 }} style={{ color: "white" }}>
                                    STOXHERO TERMS AND CONDITIONS
                                </Title>
                                <Title variant={{ xs: 'body2', sm: 'body2', md: "body2" }} sx={{ fontWeight: 500, letterSpacing: "0.05em", mb: 6, color: "rgba(255, 255, 255, 0.6)" }}>
                                    Last Updated: 24 June, 2023
                                </Title>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
                <Container>
                    <Grid container spacing={3} sx={{ mt: 2, mb:2, maxWidth: '1280px' }}>
                        <Grid item xs={12}>
                            <Typography variant="h5" color="#ffffff">1. Introduction</Typography>
                            <Typography variant="body1" color="#ffffff">
                                Welcome to StoxHero, a premier virtual options trading platform. By accessing and using our platform, you signify your agreement to these terms and conditions. If you disagree with any part of these terms, you must refrain from using our platform.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5" color="#ffffff">2. Definitions</Typography>
                            <Typography variant="body1" color="#ffffff">
                                "Platform" refers to the StoxHero virtual options trading platform and all associated services.
                            </Typography>
                            <Typography variant="body1" color="#ffffff">
                                "User" refers to any individual or entity that accesses or uses our platform.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5" color="#ffffff">3. Services</Typography>
                            <Typography variant="body1" color="#ffffff">
                                StoxHero offers a platform for derivatives traders to learn, practice, and enhance their trading skills. The platform provides real-time data, analysis, and execution tools for both novice and experienced traders.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5" color="#ffffff">4. User Obligations</Typography>
                            <Typography variant="body1" color="#ffffff">
                                Users are obligated to use the platform in a manner consistent with any and all applicable laws and regulations. Unauthorized use of the platform is strictly prohibited.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5" color="#ffffff">5. Refund Policy</Typography>
                            <Typography variant="body1" color="#ffffff">
                                All sales on StoxHero are final. No refunds will be provided once services or goods have been purchased.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5" color="#ffffff">6. Limitation of Liability</Typography>
                            <Typography variant="body1" color="#ffffff">
                                StoxHero shall not be liable for any damages or losses resulting from the use or inability to use the platform or any of its services.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5" color="#ffffff">7. Amendments</Typography>
                            <Typography variant="body1" color="#ffffff">
                                StoxHero reserves the right to modify or replace these terms at any time without prior notice.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5" color="#ffffff">8. Governing Law</Typography>
                            <Typography variant="body1" color="#ffffff">
                                These terms shall be governed by the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of India.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5" color="#ffffff">9. Contact</Typography>
                            <Typography variant="body1" color="#ffffff">
                                For queries, clarifications, or feedback, users can contact StoxHero Games Technologies Private Limited at the provided email and contact.
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
                <Footer />
            </Box>
        </ThemeProvider>
    );
}

export default TermsAndConditions;
