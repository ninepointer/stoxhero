import React from 'react'
import MDBox from '../../../components/MDBox'
import Title from '../components/Title'
import { Grid, Stack, Typography } from '@mui/material'

const Section7 = () => {
  return (

    <MDBox mb={30}>

      <MDBox mr={{xs:"170px",md:"50px",lg:"205px"}} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Title sx={{mr:{xs:"70px"}}} style={{ color: "#fff" }} variant={{ xs: "h4", sm: "h5" }}>Become an </Title>
        <Title style={{ color: "#fff" }} variant={{ xs: "h4", sm: "h5" }}> ace investor today </Title>
      </MDBox>

      <MDBox mt={15} display="flex" flexDirection="column" justifyContent="center" >


        <Grid container alignContent="center" justifyContent="center">

          <Grid item xs={12} md={3}>
            <Stack width={{xs:"80%",}} justifyContent={{xs:"center"}} borderLeft={{xs:"2px dashed gray",md:"none"}} >
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/trading-2268548-1888743.png" alt="" />
            </Stack>
          </Grid>

          <Grid display="flex" justifyContent="flex-start" alignItems="center" item xs={12} md={3} sx={{ borderLeft: "2px dashed gray" }} >
            <Stack ml={3} >
            <MDBox> <img src="https://www.pngmart.com/files/22/Dot-PNG-Isolated-Transparent.png" alt="" style={{width:"5%"}} /> <Title style={{ color: "#fff" }} variant={{ xs: "h6", sm: "body1" }}>Sign Up </Title></MDBox>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" >Join a league to get start</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}></Grid>

        </Grid>

        <Grid container wrap='wrap-reverse' justifyContent="center">

          <Grid justifyContent="center" item xs={12} md={3}></Grid>

          <Grid display="flex" justifyContent="flex-start" alignItems="center" sx={{ borderLeft: "2px dashed gray" }} item xs={12} md={3}>
            <Stack ml={3} >
              <Title style={{ color: "#fff" }} variant={{ xs: "h6", sm: "body1" }}>Build your portfolio </Title>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" >Follow experts, learn and start building</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Stack width={{xs:"80%",}} justifyContent={{xs:"center"}} borderLeft={{xs:"2px dashed gray",sm:"none"}}>
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/trading-2268548-1888743.png" style={{ maxWidth: "100%" }} alt="" />
            </Stack>
          </Grid>

        </Grid>


        <Grid container alignContent="center" justifyContent="center">

          <Grid item xs={12} md={3}>
            <Stack width={{xs:"80%",}} justifyContent={{xs:"center"}} borderLeft={{xs:"2px dashed gray",md:"none"}} >
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/trading-2268548-1888743.png" alt="" />
            </Stack>
          </Grid>

          <Grid display="flex" justifyContent="flex-start" alignItems="center" item xs={12} md={3} sx={{ borderLeft: "2px dashed gray" }} >
            <Stack ml={3} >
              <Title style={{ color: "#fff" }} variant={{ xs: "h6", sm: "body1" }}>BYOG </Title>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" >(Bring Your Own Gang!)It’s no fun without friends, who’re we kidding</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}></Grid>

        </Grid>


        <Grid container wrap='wrap-reverse' justifyContent="center">

          <Grid justifyContent="center" item xs={12} md={3}></Grid>

          <Grid display="flex" justifyContent="flex-start" alignItems="center" sx={{ borderLeft: "2px dashed gray" }} item xs={12} md={3}>
            <Stack ml={3} >
              <Title style={{ color: "#fff" }} variant={{ xs: "h6", sm: "body1" }}>Community </Title>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" >Discover new company,follow experts and learn everyday</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Stack width={{xs:"80%",}} justifyContent={{xs:"center"}} borderLeft={{xs:"2px dashed gray",sm:"none"}}>
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/trading-2268548-1888743.png" style={{ maxWidth: "100%" }} alt="" />
            </Stack>
          </Grid>

        </Grid>

      </MDBox>

    </MDBox>


  )
}

export default Section7