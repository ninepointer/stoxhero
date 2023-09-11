import { React } from "react";


// prop-types is a library for typechecking of props.
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
                        Introducing Battle: Your Gateway to Realistic Trading
                    </MDTypography>
                    <MDTypography color='dark' fontSize={15} textAlign='center'>
                        We've designed this innovative trading experience to bridge the gap between learning and real-world trading, allowing you to get as close to the market as possible.
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
