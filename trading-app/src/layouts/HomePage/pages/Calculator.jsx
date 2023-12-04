import React from 'react'
import MDBox from '../../../components/MDBox';
import { ThemeProvider } from 'styled-components';
import Navbar from '../components/Navbars/Navbar';
import theme from '../utils/theme/index';
import Footer from '../../../layouts/authentication/components/Footer'
import ComingSoon from "../../../assets/images/ComingSoon.png"


export default function Calculator() {


  return (
    <>
      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ backgroundColor: 'white', minHeight: '100%', height: 'auto', width: 'auto', maxWidth: '100%', minHeight: "80vh" }}>
        <ThemeProvider theme={theme}>
          <Navbar />
          <>
          <MDBox mt={13}>
              <img src={ComingSoon} width='300px' height='300px' />

          </MDBox>
          </>
        </ThemeProvider>
      </MDBox>

      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-end' >
        <Footer />
      </MDBox>
    </>
  );
}