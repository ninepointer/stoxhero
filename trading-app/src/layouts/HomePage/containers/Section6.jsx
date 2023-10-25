import { Container, Grid, Stack, Typography } from "@mui/material";
import React from "react";

import Title from "../components/Title";
import MDBox from "../../../components/MDBox"
import trading1 from '../assets/images/section6/Trading1.png'
import trading2 from '../assets/images/section6/Trading2.png'
import trading3 from '../assets/images/section6/Trading3.png'
import trading4 from '../assets/images/section6/Trading4.webp'





const Section6 = () => {
  return (
    <Container sx={{ mt: { xs: 10, md: 20, lg: 25 }, mb: { lg: 25, xs: 10, md: 20 } }}>
      <MDBox display="flex" justifyContent="center" >
        <Title variant={{ xs: "h3", md: "h2" }} sx={{ mb: { xs: 5, md: 8 } }} style={{ color: "white" }}>Why Choose Us?</Title>
      </MDBox>

      <Grid container justifyContent="center" mt={0} textAlign="center"  spacing={4}>
        <Grid item xs={12} md={6} lg={3} >
          <Stack spacing={2} alignItems="center" justifyContent="center" >
            <img src={trading1}

              style={{
                height: "75px",
                width: "55%",
                objectFit: "contain",
                flex: 1,
                marginRight: { xs: "40px" }

              }}
              alt=""
            />
            <Title variant={{ xs: "h5", sm: "h4" }} style={{color:"#fff",background:"gray",borderRadius:"10px",width:"100px"}} >Learn</Title>
            <Typography width="170px" variant="body2"  color="rgba(255, 255, 255, 0.6)" >Enhance skills, expand knowledge, and unlock your trading potential.</Typography>

          </Stack>
        </Grid>
        <Grid item xs={12} md={6} lg={3} >
          <Stack spacing={2} alignItems="center" justifyContent="center" >
            <img src={trading2}
              style={{
                height: "75px",
                width: "71%",
                objectFit: "contain",
                flex: 1,
                marginRight: { xs: "40px" }
               

              }}
              alt=""
            />
            <Title variant={{ xs: "h5", sm: "h4" }} style={{color:"#fff",background:"gray",borderRadius:"10px",width:"100px"}} >Earn</Title>
            <Typography width="170px" variant="body2"  color="rgba(255, 255, 255, 0.6)" >Profitable learning with trading tools and risk-free trading with money making opportunities.</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} lg={3} >
          <Stack spacing={2} alignItems="center" justifyContent="center" >
            <img src={trading3}
              style={{
                height: "75px",
                width: "75%",
                objectFit: "contain",
                flex: 1,
                marginRight: { xs: "40px" }

              }}
              alt=""
            />
            <Title variant={{ xs: "h5", sm: "h4" }} style={{color:"#fff",background:"gray",borderRadius:"10px",width:"100px"}} >Trade</Title>
            <Typography width="170px"  variant="body2"  color="rgba(255, 255, 255, 0.6)" >User-friendly interface with real-time data, analysis & execution for all traders, from beginners to experienced.</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} lg={3} >
          <Stack spacing={2} alignItems="center" justifyContent="center"  >
            <img src={trading4}

              style={{
                height: "75px",
                width: "65%",
                objectFit: "contain",
                flex: 1,
                marginRight: { xs: "40px" },

              }}
              alt=""
            />
            <Title variant={{ xs: "h5", sm: "h4" }} style={{color:"#fff",background:"gray",borderRadius:"10px",width:"100px"}} >Grow</Title>
            <Typography width="170px" variant="body2"  color="rgba(255, 255, 255, 0.6)" >Transparent, secure, and reliable platform for Intraday Trading. Trusted by traders, for traders.</Typography>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Section6;