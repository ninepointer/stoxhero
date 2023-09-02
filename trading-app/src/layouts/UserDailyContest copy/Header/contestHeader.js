import { React, useState, useEffect, useContext } from "react";
import axios from "axios";
import { userContext } from '../../../AuthContext';
import moment from 'moment'

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";
import tradesicon from '../../../assets/images/tradesicon.png'
import WinnerImage from '../../../assets/images/cup-image.png'

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

// Images
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import {InfinityTraderRole, tenxTrader} from "../../../variables";
import ContestCup from '../../../assets/images/candlestick-chart.png'
import { Divider } from "@mui/material";
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';



function Header({ children }) {


  return (
    
    <Grid container>
        <Grid item xs={12} md={12} lg={12}>
            <MDBox bgColor='light' minHeight='auto' borderRadius={3}>
            <Grid container p={2} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' width='100%'>
                <Grid item xs={12} md={12} lg={2} textAlign='center'>
                    <img src={WinnerImage} width='110px' height='110px'/>
                </Grid>

                <Grid item xs={12} md={12} lg={10} display='flex' justifyContent='center' flexDirection='column' alignItems='center'>
                <Grid container xs={12} md={12} lg={12}>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column'>
                    <MDTypography color='dark' fontSize={20} fontWeight='bold' textAlign='center'>
                        Welcome StoxHeroes!
                    </MDTypography>
                    <MDTypography color='dark' fontSize={15} textAlign='center'>
                        Start your trading journey by participating in virtual Futures & Options contest
                        and win real cash rewards as per your portfolio value.
                    </MDTypography>
                    <MDTypography color='dark' fontSize={15} textAlign='center'>
                        अपनी ट्रेडिंग यात्रा शुरू करें वर्चुअल फ्यूचर्स और ऑप्शन कॉन्टेस्ट में हिस्सा लेकर और अपने पोर्टफोलियो की 
                        मान्यता के हिसाब से वास्तविक नकदी रिवार्ड्स जीतें।
                    </MDTypography> 
                    </Grid>
                    <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center'>
                        <Grid container display='flex' justifyContent='center' alignItems='center'>
                            <Grid item xs={12} md={12} lg={6} display='flex' justifyContent='center'>
                                <MDButton size='small' varaint='Outlined' color='success' onClick={() => window.open('https://chat.whatsapp.com/CbRHo9BP3SO5fIHI2nM6jq', '_blank')}><WhatsAppIcon/></MDButton>
                                    <span style={{ margin: '0 1px' }}></span> {/* Add space between buttons */}
                                <MDButton size='small' varaint='Outlined' color='info' onClick={() => window.open('https://t.me/stoxhero_official', '_blank')}><TelegramIcon/></MDButton>
                                    <span style={{ margin: '0 1px' }}></span> {/* Add space between buttons */}
                                <MDButton size='small' varaint='Outlined' color='info' onClick={() => window.open('https://www.linkedin.com/company/stoxhero', '_blank')}><LinkedInIcon/></MDButton>
                                    <span style={{ margin: '0 1px' }}></span> {/* Add space between buttons */}
                                <MDButton size='small' varaint='Outlined' color='error' onClick={() => window.open('https://instagram.com/stoxhero_official?igshid=MzRlODBiNWFlZA==', '_blank')}><InstagramIcon/></MDButton>
                                    <span style={{ margin: '0 1px' }}></span> {/* Add space between buttons */}
                                <MDButton size='small' varaint='Outlined' color='info' onClick={() => window.open('https://www.facebook.com/profile.php?id=100091564856087&mibextid=ZbWKwL', '_blank')}><FacebookIcon/></MDButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                </Grid>
            </Grid>
            </MDBox>
        </Grid>
    </Grid>

  );
}

export default Header;
