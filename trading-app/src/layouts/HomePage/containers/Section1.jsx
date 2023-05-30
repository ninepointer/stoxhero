import { Box, Button, Container, Hidden, Stack, Typography, useMediaQuery,} from '@mui/material'
import React from 'react'

import LaunchButton from '../components/Buttons/LaunchButton';
import { Apple, Google} from '@mui/icons-material';
import zIndex from '@mui/material/styles/zIndex';
import useMeasure from 'react-use-measure';
import Title from '../components/Title/index'
import { useTheme } from 'styled-components';
import { section1Content } from '../utils/content';
import back from '../../../assets/images/bgBanner2.jpg'






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
      {/* Background Elements */}
      
      <Box ref={ref} sx={{position:'absolute',zIndex:-1, top:0, left:0, right:0}}>
        <Box sx={{height:"15px",mb:3,width:"100%",background:"#06070A",position:"absolute",bottom:{xs:"-30px"}}}></Box>
        <img src={back} style={{width:"100%",opacity:"0.9",}} alt="img" />

        

         {/* Star image */}
        {/* <img src={ShootingStarImage} style={{position:"absolute", top:"30px", right:'15%', width:"500px" }} /> */}



        {/* Trees */}
        {/* <Hidden mdDown>

        </Hidden> */}
        {/* <img src={TreesImage} style={{position:"absolute",width:"100%",right:0,left:0,bottom:0 }} alt="" /> */}


        {/* Cliff image */}
        {/* <img src={CliffImage} style={{position:"absolute", right:0, top:0, backgroundSize:"cover", height:'100%' }} /> */}


         {/* Horse image */}
        {/* <img src={HorseImage} style={{position:"absolute",height:"38%",right:"14%",bottom:"45%" }} /> */}

        <Box sx={{bgcolor:"#06070A",position:"absolute",bottom:"0",left:0,right:0,height:{xs:"4000px", md:"2150px", lg:"1800px" },top:height,}}>

        </Box>



      </Box>

      {/* Content */}
      <Container sx={{ height: "80vh", mt:8,[theme.breakpoints.up("md")]: { mt: 6 } }}>
        <Stack sx={{ height: "100%", px: 3 }} justifyContent="center" >

          <Title variant={{xs:'h3', sm:'h2',md:'h1'}} sx={{letterSpacing:"0.02em", mb:1,color:theme.palette.text.secondary}} style={{color:"white"}} >{title}</Title>
          <Title variant={{xs:'h4',sm:'h3',md:"h2"}} sx={{ fontWeight:500, letterSpacing:"0.05em", mb:6}} style={{color:"white"}} >{subtitle}</Title>

          <Stack direction={{ xs: "column", md: "row" }} alignItems="center" spacing={4}>
            <a href="/login"><LaunchButton fullWidth={isSmallScreen} sx={{ height: '55px' }} /></a>
            {/* <CustomButton fullWidth={isSmallScreen} >
              <Apple sx={{ml:-2,}} style={{color:"red",fontSize:"55px"}} />
              <Stack sx={{ textAlign: 'left', ml: 1 }}>
                <Typography variant='caption' sx={{ lineHeight: 1 }} >Download on the </Typography>
                <Typography variant='h5'>App Store</Typography>
              </Stack>
            </CustomButton>
            <CustomButton fullWidth={isSmallScreen} >
              <Google sx={{ fontSize: 88, ml: -1 }} />
              <Stack sx={{ textAlign: 'left', ml: 1 }}>
                <Typography variant='caption' sx={{ lineHeight: 1 }} >Get it on </Typography>
                <Typography variant='h5'>Google Play</Typography>
              </Stack>
            </CustomButton> */}
          </Stack>

        </Stack>
      </Container>


    </Box>
  )
}

export default Section1