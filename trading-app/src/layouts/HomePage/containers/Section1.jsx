import { Box, Button, Container, Hidden, Stack, Typography, useMediaQuery,} from '@mui/material'
import React from 'react'
import { section1Content } from '../utils/content';
import LaunchButton from '../components/Buttons/LaunchButton';
import { Apple, Google, Opacity } from '@mui/icons-material';
import zIndex from '@mui/material/styles/zIndex';
import useMeasure from 'react-use-measure';
import Title from '../components/Title/index'
import { useTheme } from 'styled-components';






const {
  MainBG,
  TreesImage,
  CliffImage,
  HorseImage,
  ShootingStarImage,
  title,
  subtitle, } = section1Content;


const CustomButton = ({ children,...props}) => (
  <Button variant='outlined' sx={{ justifyContent: 'flex-start', borderRadius: 4, color: 'text.primary', borderColor: 'text.primary', height: 58,px:2 }} {...props} >{children}</Button>

)


const Section1 = () => {

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [ref,{height}] = useMeasure();
  return (
    <Box>

      {/* Main Background */}

      <Box sx={{position:"fixed", zIndex:-10, top:0,left:0,right:0 }}>
        <img src="https://e0.pxfuel.com/wallpapers/428/686/desktop-wallpaper-purple-artistic-landscape-digital-art-sunset-artist-and-background.jpg" style={{width:"100%"}} />
      </Box>


      {/* Background Elements */}
      
      <Box ref={ref} sx={{position:'absolute', width:'100%', zIndex:-1, top:0, left:0, right:0}}>

        <img src="https://e0.pxfuel.com/wallpapers/428/686/desktop-wallpaper-purple-artistic-landscape-digital-art-sunset-artist-and-background.jpg" style={{width:"100%", opacity:0}} />
        

         {/* Star image */}
        <img src={ShootingStarImage} style={{position:"absolute", top:"30px", right:'15%', width:"500px" }} />



        {/* Trees */}
        <Hidden mdDown>

        <img src={TreesImage} style={{position:"absolute",width:"100%",right:0,left:0,bottom:0, }} />
        </Hidden>


        {/* Cliff image */}
        {/* <img src={CliffImage} style={{position:"absolute", right:0, top:0, backgroundSize:"cover", height:'100%' }} /> */}


         {/* Horse image */}
        {/* <img src={HorseImage} style={{position:"absolute",height:"38%",right:"14%",bottom:"45%" }} /> */}

        <Box sx={{bgcolor:"background.default",position:"absolute",bottom:"0",left:0,right:0,height:'500px',top:height}}>

        </Box>



      </Box>

      {/* Content */}
      <Container sx={{ height: "80vh", mt:8,[theme.breakpoints.up("md")]: { mt: 6 } }}>
        <Stack sx={{ height: "100%", px: 3 }} justifyContent="center" >

          <Title variant={{xs:'h3', sm:'h2',md:'h1'}} sx={{letterSpacing:"0.02em", mb:1}} >{title}</Title>
          <Title variant={{xs:'h4',sm:'h3',md:"h2"}} sx={{ fontWeight:500, letterSpacing:"0.05em", mb:6}} >{subtitle}</Title>

          <Stack direction={{ xs: "column", md: "row" }} alignItems="center" spacing={4}>
            <LaunchButton fullWidth={isSmallScreen} sx={{ height: '55px' }} />
            <CustomButton fullWidth={isSmallScreen} >
              <Apple sx={{ fontSize: 36, ml: -1 }} />
              <Stack sx={{ textAlign: 'left', ml: 1 }}>
                <Typography variant='caption' sx={{ lineHeight: 1 }} >Download on the </Typography>
                <Typography variant='h5'>App Store</Typography>
              </Stack>
            </CustomButton>
            <CustomButton fullWidth={isSmallScreen} >
              <Google sx={{ fontSize: 34, ml: -1 }} />
              <Stack sx={{ textAlign: 'left', ml: 1 }}>
                <Typography variant='caption' sx={{ lineHeight: 1 }} >Get it on </Typography>
                <Typography variant='h5'>Google Play</Typography>
              </Stack>
            </CustomButton>
          </Stack>

        </Stack>
      </Container>


    </Box>
  )
}

export default Section1