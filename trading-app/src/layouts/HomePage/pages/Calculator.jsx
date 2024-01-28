import React, {useEffect} from 'react'
import MDBox from '../../../components/MDBox';
import { ThemeProvider } from 'styled-components';
import Navbar from '../components/Navbars/Navbar';
import theme from '../utils/theme/index';
import Footer from '../../../layouts/authentication/components/Footer'
import ComingSoon from "../../../assets/images/ComingSoon.png"
import { Helmet } from 'react-helmet';

export default function Calculator() {

  useEffect(()=>{
    window.webengage.track('calculator_clicked', {
    })
  },[])

  let text = 'Explore StoxHero’s range of financial calculators designed to help you make informed investment choices. Calculate returns, risks, and more with ease.'

  return (
    <>
      <Helmet>

 
        <title>StoxHero Calculators - Maximize Your Investment Potential</title>
        <meta name='description' content={text} />
        <meta name='keywords' content='brokerage caclulator, discount broker, discount brokerage, lowest brokerage commissions, lowest brokerage fees, indian discount brokerage, indian discount broker, cheap brokerage, discount brokerage bangalore, fixed brokerage bangalore, cheap trading, cheap commodity trading, trading terminal, futures trading, stock broker, fixed stock brokerage, cheapest brokerage, cheapest brokerage in india, online trading, online brokerage, cheap demat account, broker, commodities trading' />

      </Helmet>
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