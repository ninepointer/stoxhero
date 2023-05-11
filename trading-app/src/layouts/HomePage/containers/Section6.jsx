import { Container, Grid, Stack, Typography } from "@mui/material";
import React from "react";

import Title from "../components/Title";
import MDBox from "../../../components/MDBox"





const Section6 = () => {
  return (
    <Container sx={{ mt: { xs: 10, md: 20, lg: 25 }, mb: { lg: 25, xs: 10, md: 20 } }}>
      <MDBox display="flex" justifyContent="center" >
        <Title variant={{ xs: "h3", md: "h2" }} sx={{ mb: { xs: 5, md: 8 } }} style={{ color: "white" }}>Why Choose Us?</Title>
      </MDBox>

      <Grid container justifyContent="center" mt={0} textAlign="center"  spacing={4}>
        <Grid item xs={12} md={6} lg={3} >
          <Stack spacing={2} alignItems="center" justifyContent="center" >
            <img src="https://www.pngall.com/wp-content/uploads/8/Trading-PNG.png"

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
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/trading-3359445-2809309.png"
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
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/man-trading-stocks-3359444-2809308.png"
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
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/forex-trading-4268346-3560989.png?f=webp"

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