import React, {useEffect} from 'react'
import MDBox from '../../../../components/MDBox';
import MDTypography from '../../../../components/MDTypography';
import { ThemeProvider } from 'styled-components';
import Navbar from '../../components/Navbars/Navbar';
import theme from '../../utils/theme/index';
import Footer from '../../../authentication/components/Footer'
// import ComingSoon from "../../../../assets/images/ComingSoon.png"
import { Helmet } from 'react-helmet';
import { Grid, Card } from '@mui/material';
import { FormControl } from '@mui/base/FormControl';
import { Input, inputClasses } from '@mui/base/Input';
import { styled } from '@mui/system';


export default function Calculator() {

  useEffect(()=>{
    window.webengage.track('calculator_clicked', {
    })
  },[])

  const [form, setForm] = useState({});

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
            <Grid container xs={12} md={12} lg={12} mt={10} p={5}>
              <Grid item xs={12} md={12} lg={12}>
                <MDTypography style={{ fontSize: 35, fontWeight: 800 }}>
                  Net Worth Calculator
                </MDTypography>
              </Grid>

              <Grid item xs={6} md={6} lg={12} display='flex' justifyContent={'center'}>
                <Card
                  style={{
                    maxWidth: "50%",
                    minWidth: "50%",
                    // width: '100%',
                    backgroundColor: "light",
                  }}
                >
                  <Grid container xs={12} md={12} lg={12} p={5}>
                    <Grid item xs={12} md={12} lg={12}>
                      <FormControl defaultValue="" required>
                        {({ filled, focused }) => (
                          <React.Fragment>
                            <StyledInput className={filled ? 'filled' : ''} lable='Vijay' />
                            {filled && !focused && <OkMark>✔</OkMark>}
                          </React.Fragment>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Card>

                <Card
                  style={{
                    maxWidth: "50%",
                    minWidth: "50%",
                    // width: '100%',
                    backgroundColor: "light",
                  }}
                >
                  <Grid container xs={12} md={12} lg={12} p={2}>
                    <Grid item xs={12} md={12} lg={12} display='flex' alignContent={'center'} justifyContent={'center'}>
                      <MDBox style={{maxWidth: '60%'}}>
                        <MDTypography style={{ fontSize: 15, fontWeight: 700 }}>
                          Real Estate
                        </MDTypography>
                        <MDTypography style={{ fontSize: 15, fontWeight: 500 }}>
                          Estimate the current value of your house (and other real estate you own).
                        </MDTypography>
                      </MDBox>
                      <FormControl
                        defaultValue="₹"
                        value={'₹'}
                        required 
                        onChange={(prev)=>{
                          ...prev,
                          realState: e.target.value
                        }}
                        style={{marginTop: '30px'}}>
                        {({ filled, focused }) => (
                          <React.Fragment>
                            <StyledInput
                              className={filled ? 'filled' : ''}
                              
                            />
                            {filled.length>0 && !focused && <OkMark>✔</OkMark>}
                          </React.Fragment>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </>
        </ThemeProvider>
      </MDBox>

      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-end' >
        <Footer />
      </MDBox>
    </>
  );
}



const StyledInput = styled(Input)(
  ({ theme }) => `
  display: inline-block;

  .${inputClasses.input} {
    width: 150px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      outline: 0;
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[200] : blue[200]};
    }
  }

  &.filled .${inputClasses.input} {
    box-shadow: 0 0 2px 2px rgba(125, 200, 0, 0.25);
  }
`,
);

const OkMark = styled('span')`
  margin-left: 8px;
  margin-top: 10px;
  position: absolute;
  color: rgb(125 200 0 / 1);
`;

const blue = {
  100: '#DAECFF',
  200: '#80BFFF',
  400: '#3399FF',
  600: '#0072E5',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};