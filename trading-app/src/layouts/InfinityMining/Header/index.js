import React from 'react';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import MDAvatar from '../../../components/MDAvatar';
import {Link} from 'react-router-dom'
import { Grid } from '@mui/material';
import Logo from '../../../assets/images/default-profile.png'

//data

export default function PaymentHeader() {

  return (
    <MDBox>
      <MDBox bgColor="primary" color="light" mt={2} mb={1} p={2} borderRadius={10} minHeight='10vh'>
          
          
      </MDBox>
      <MDBox bgColor="text" color="light" mt={1} mb={1} p={0} borderRadius={0} minHeight='100vh'>
          <Grid container spacing={0}>
            <Grid item lg={9} style={{minHeight:'100vh'}}>

            </Grid>
            <Grid item lg={3} style={{backgroundColor:'white', minHeight:'100vh'}}>
              <MDBox display='flex' justifyContent='center' flexDirection='column' mt={2}>
                <MDBox display='flex' justifyContent='center'>
                  <MDAvatar
                    src={Logo}
                    alt="Profile"
                    size="xl"
                    sx={({ borders: { borderWidth }, palette: { white } }) => ({
                      border: `${borderWidth[2]} solid ${white.main}`,
                      cursor: "pointer",
                      position: "relative",
                      ml: -1.25,

                      "&:hover, &:focus": {
                        zIndex: "10",
                      },
                    })}
                  />
                </MDBox>
                <MDBox display='flex' justifyContent='center' flexDirection='column'>
                  <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold'>Prateek Pawan</MDTypography></MDBox>
                  <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold'>DOB: 24-Jan-1991</MDTypography></MDBox>
                  <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold'>Joining Date: 24-Jan-2023</MDTypography></MDBox>
                </MDBox>
              </MDBox>
              {/* <MDBox display='flex' justifyContent='center' flexDirection='column' mt={2}>
                <MDBox display='flex' justifyContent='center'>
                 <MDTypography fontSize={18} fontWeight='bold'>Trading History</MDTypography>
                </MDBox>
                <MDBox display='flex' justifyContent='center' flexDirection='column'>
                  <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold'>Lifetime Gross P&L</MDTypography></MDBox>
                  <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold'>This Month's P&L</MDTypography></MDBox>
                  <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold'>This Week's P&L</MDTypography></MDBox>
                  <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold'>Yesterday's P&L</MDTypography></MDBox>
                  <MDBox display='flex' justifyContent='center'><MDTypography fontSize={15} fontWeight='bold'>Todays's P&L</MDTypography></MDBox>
                </MDBox>
              </MDBox> */}
            </Grid>
          </Grid>
          
      </MDBox>
    </MDBox>
  );
}