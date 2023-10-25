import React from 'react'
import MDBox from '../../../components/MDBox'
import Title from '../components/Title'
import { Grid, Stack, Typography } from '@mui/material'
import dot from '../assets/images/section7/Dot.png'
import img1 from '../assets/images/section7/section7-img1.png'
import img2 from '../assets/images/section7/section7-img2.webp'
import img3 from '../assets/images/section7/section7-img3.png'
import img4 from '../assets/images/section7/section7-img4.webp'

const Section7 = () => {
  return (

    <MDBox mb={30}>

      <MDBox mr={{xs:"10px",md:"50px",lg:"205px"}} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Title sx={{mr:{xs:"15px",md:"0px"}}} style={{ color: "#fff" }} variant={{ xs: "h2", }}>Become an </Title>
        <Title  sx={{mr:{md:"-175px"},ml:{xs:"80px",md:"0px"}}} style={{ color: "#fff" }} variant={{ xs: "h2", }}>expert investor today! </Title>
      </MDBox>

      <MDBox mt={15} ml={{xs:"80px",}} display="flex" flexDirection="column" justifyContent="center" >


        <Grid container alignContent="center" justifyContent="center">

          <Grid item xs={12} md={3}>
            <Stack width={{xs:"80%",}} justifyContent={{xs:"center"}} borderLeft={{xs:"2px dashed gray",md:"none"}} >
              <img src={img1} alt="" />
            </Stack>
          </Grid>

          <Grid display="flex" justifyContent="flex-start" alignItems="center" item xs={12} md={3} sx={{ borderLeft: "2px dashed gray" }} >
            <Stack ml={3} >
            <MDBox> <img src={dot} alt="" style={{width:"5%"}} /> <Title style={{ color: "#fff" }} variant={{ xs: "h6", sm: "body1" }}>Sign Up </Title></MDBox>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" >Sign up now and earn a free portfolio.</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}></Grid>

        </Grid>

        <Grid container wrap='wrap-reverse' justifyContent="center">

          <Grid justifyContent="center" item xs={12} md={3}></Grid>

          <Grid display="flex" justifyContent="flex-start" alignItems="center" sx={{ borderLeft: "2px dashed gray" }} item xs={12} md={3}>
            <Stack ml={3} >
            <MDBox> <img src={dot} alt="" style={{width:"5%"}} /> <Title style={{ color: "#fff" }} variant={{ xs: "h6", sm: "body1" }}>Learn with Virtual Trade. </Title></MDBox>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" >Practice investing with virtual money.</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Stack width={{xs:"80%",}} justifyContent={{xs:"center"}} borderLeft={{xs:"2px dashed gray",sm:"none"}}>
              <img src={img2} style={{ maxWidth: "100%" }} alt="" />
            </Stack>
          </Grid>

        </Grid>


        <Grid container alignContent="center" justifyContent="center">

          <Grid item xs={12} md={3}>
            <Stack width={{xs:"80%",}} justifyContent={{xs:"center"}} borderLeft={{xs:"2px dashed gray",md:"none"}} >
              <img src={img3} alt="" />
            </Stack>
          </Grid>

          <Grid display="flex" justifyContent="flex-start" alignItems="center" item xs={12} md={3} sx={{ borderLeft: "2px dashed gray" }} >
            <Stack ml={3} >
            <MDBox> <img src={dot} alt="" style={{width:"5%"}} /> <Title style={{ color: "#fff" }} variant={{ xs: "h6", sm: "body1" }}>Earn Real Money with 10x Trading. </Title></MDBox>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" >Turn your knowledge into profit.</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}></Grid>

        </Grid>


        <Grid container wrap='wrap-reverse' justifyContent="center">

          <Grid justifyContent="center" item xs={12} md={3}></Grid>

          <Grid display="flex" justifyContent="flex-start" alignItems="center" sx={{ borderLeft: "2px dashed gray" }} item xs={12} md={3}>
            <Stack ml={3} >
            <MDBox> <img src={dot} alt="" style={{width:"5%"}} /> <Title style={{ color: "#fff" }} variant={{ xs: "h6", sm: "body1" }}>Grow Together with Referral. </Title></MDBox>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" >Invite friends, earn rewards, and succeed together.</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Stack width={{xs:"80%",}} justifyContent={{xs:"center"}} borderLeft={{xs:"2px dashed gray",sm:"none"}}>
              <img src={img4} style={{ maxWidth: "100%" }} alt="" />
            </Stack>
          </Grid>

        </Grid>

      </MDBox>

    </MDBox>


  )
}

export default Section7