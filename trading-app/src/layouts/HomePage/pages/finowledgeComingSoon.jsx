import React, {useEffect, useState} from 'react'
import MDBox from '../../../components/MDBox';
import { ThemeProvider } from 'styled-components';
import Navbar from '../components/Navbars/FinNavBar';
import theme from '../utils/theme/index';
import ComingSoon from "../../../assets/images/finowledge_coming_soon.png"
import { useMediaQuery, Grid } from '@mui/material'

export default function FinowledgeComingSoon() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(()=>{
    window.webengage.track('finowledge_comingsoon_clicked', {
    })
  },[])

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"))
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const backgroundColor = scrollPosition > 10 ? 'rgba(0, 0, 0, 0.8)' : 'transparent'
  const backdropFilter = scrollPosition > 10 ? 'blur(5px)' : 'none'

  return (
    <>
      <MDBox display='flex' justifyContent='center' alignContent='center' alignItems='flex-start' style={{ backgroundColor: '#353535', minHeight: '100%', height: 'auto', width: 'auto', maxWidth: '100%', minHeight: "80vh" }}>
        <ThemeProvider theme={theme}>
          <Navbar />
          <>

          <Grid
          container
          mt={0}
          xs={12}
          md={12}
          lg={12}
          display='flex'
          justifyContent='center'
          alignItems='center'
          style={{
            // display: 'flex',
            // justifyContent: 'center',
            // alignContent: 'center',
            backgroundImage: `url(${ComingSoon})`,
            backgroundSize: 'cover', // Make the background image responsive
            backgroundPosition: 'center center',
            height: '100vh',
            // flexDirection: 'column',
            // textAlign: 'center',
            // padding: '10px',
            position: 'fixed',
            top: 0,
            left: 0,
            filter: backdropFilter,
            backgroundColor: backgroundColor,
            overflow: 'visible'
          }}
        >

       
      </Grid>
          </>
        </ThemeProvider>
      </MDBox>

    </>
  );
}