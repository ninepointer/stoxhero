import React from 'react'
import MDBox from '../../../components/MDBox'
import MDButton from '../../../components/MDButton';
import { Grid, TextField } from '@mui/material'
import theme from '../utils/theme/index';
import { ThemeProvider } from 'styled-components';
import Navbar from '../components/Navbars/Navbar';
import Footer from '../components/Footers/Footer';
import MDTypography from '../../../components/MDTypography';

const CareerForm = () => {
  return (
    <div>
        <ThemeProvider theme={theme}>
        <Navbar/>
        <MDBox>

            <MDBox mt={'65px'} p={4}>
                <MDBox display='flex' justifyContent='center'>
                    <MDTypography>Please fill your details!</MDTypography>
                </MDBox>
                <Grid container spacing={2} mt={1} xs={12} md={12} lg={9} display='flex' justifyContent='center'>
                    <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="First Name"
                        type="text"
                        fullWidth
                        // onChange={(e)=>{formstate.email = e.target.value}}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="Last Name"
                        type="text"
                        fullWidth
                        // onChange={(e)=>{formstate.email = e.target.value}}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="Email"
                        type="email"
                        fullWidth
                        // onChange={(e)=>{formstate.email = e.target.value}}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="Mobile"
                        type="text"
                        fullWidth
                        // onChange={(e)=>{formstate.email = e.target.value}}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="Roll No."
                        type="text"
                        fullWidth
                        // onChange={(e)=>{formstate.email = e.target.value}}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                    <TextField
                        required
                        // disabled={showEmailOTP}
                        id="outlined-required"
                        label="Applying For"
                        type="text"
                        fullWidth
                        // onChange={(e)=>{formstate.email = e.target.value}}
                      />
                    </Grid>
                </Grid>
            </MDBox>

            <MDBox mb={1} display="flex" justifyContent="space-around">
              <MDButton variant="gradient" color="info">
                Submit
              </MDButton>
            </MDBox>

        </MDBox>
        <Footer/>
        </ThemeProvider>
    </div>
  )
}

export default CareerForm