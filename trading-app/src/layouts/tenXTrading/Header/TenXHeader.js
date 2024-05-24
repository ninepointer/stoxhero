import { React } from "react";
import WinnerImage from '../../../assets/images/TenXHeader.png'

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

import MDTypography from "../../../components/MDTypography";



function Header() {


  return (
    
    <Grid container>
        <Grid item xs={12} md={12} lg={12}>
            <MDBox bgColor='light' minHeight='auto' borderRadius={3}>
            <Grid container p={1} xs={12} md={12} lg={12} display='flex' justifyContent='center' alignContent='center' alignItems='center' width='100%'>
                <Grid item xs={12} md={12} lg={2} display='flex' justifyContent='center' alignContent='center' alignItems='center' textAlign='center'>
                    <img src={WinnerImage} width='110px' height='110px'/>
                </Grid>

                <Grid item xs={12} md={12} lg={10} display='flex' justifyContent='center' flexDirection='column' alignItems='center'>
                <Grid container xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column' alignItems='center'>
                    <Grid item xs={12} md={12} lg={12} display='flex' justifyContent='center' flexDirection='column'>
                    <MDTypography color='dark' fontSize={20} fontWeight='bold' textAlign='center'>
                        TenX Subscription Plans!
                    </MDTypography>
                    <MDTypography color='dark' fontSize={15} textAlign='center'>
                        Your Gateway to risk-free earning opportunity from Intraday Options Trading using virtual currency but real cash reward.
                    </MDTypography>
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
