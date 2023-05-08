import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import { footerContent } from "../../utils/content";
import OutlinedButton from "../Buttons/OutlinedButton";
import Title from "../Title";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from '@mui/icons-material/Facebook';


const {
  subscribe,
  protocols,
  governance,
  support,
  developers,
  copyright,
  socials,
} = footerContent;

const LinkSection = ({ title, links }) => (
  <Stack spacing={2.5}>
    <Title sx={{color:"#fff"}} >{title}</Title>

    {links.map(({ title }) => (
      <Typography
        key={title}
        variant="body2"
        color="#fff"
        sx={{
          cursor: "pointer",
          "&:hover": {
            color: "gray",
          },
        }}
      >
        {title}
      </Typography>
    ))}
  </Stack>
);

const Footer = () => {
  return (
    <Box>
      <Divider sx={{ mb: 0 }} />

      <Container>
        <Grid container spacing={8} flexWrap="wrap-reverse">
          {/* Links */}
          <Grid spacing={4} item xs={12} md={6} lg={7} xl={8}>
            <Grid container spacing={2}>
              {/* Protocols */}
              <Grid style={{color:"#fff",cursor:"pointer"}} item xs={6} sm={3} md={6} lg={3}>
                <a style={{color:"#fff"}} href="/contact">Contact us</a>
              </Grid>

              {/* Governance */}
              <Grid style={{color:"#fff",cursor:"pointer"}} item xs={6} sm={3} md={6} lg={3}>
              <a style={{color:"#fff"}} href="/Careers">Careers</a>
              </Grid>

              {/* Support */}
              <Grid style={{color:"#fff",cursor:"pointer"}}  item xs={6} sm={3} md={6} lg={3}>
              <a style={{color:"#fff",}} href="/about">About us</a>
              </Grid>

              {/* Developers */}
              <Grid style={{color:"#fff",cursor:"pointer"}} item xs={6} sm={3} md={6} lg={3}>
              <a style={{color:"#fff",}} href="/signup">Sign Up</a>
              </Grid>

              
              <Typography mt={4} style={{color:"gray"}} variant="body2"> With StoxHero, you have the tools, knowledge, and support you need to excel in intra-day trading and beyond. Start your trading adventure today with StoxHero.com - the ultimate destination for traders of all levels.</Typography>

            </Grid>
          </Grid>

          {/* Subscribe */}
          <Grid item xs={12} md={6} lg={5} xl={4}>
            <Stack color={'rgba(255, 255, 255, 0.6)'}>
              <Title sx={{ mb: 1 }}>{subscribe.title}</Title>

              <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                {subscribe.subtitle}
              </Typography>

              <a href="/contact">
              <OutlinedButton arrow sx={{ height: 60, my: 3 }}>
                Contact us!
              </OutlinedButton>
              </a>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                color="#fff"
              >
                {/* {socials.map((item, i) => (
                  <IconButton key={i}>
                   <item.icon sx={{color:"#fff"}} />
                  </IconButton>
                ))} */}

                <IconButton>
                <a href="https://www.linkedin.com/company/stoxhero"><LinkedInIcon color="white"/></a>
                </IconButton>

                <IconButton>
                <a href="https://instagram.com/stoxhero_official?igshid=NTc4MTlwNjQ2YQ=="><InstagramIcon color="white"/></a>
                </IconButton>

                <IconButton>
                 <TwitterIcon color="white"/>
                 </IconButton>

                <IconButton>
                <a href="https://m.facebook.com/people/STOCK-HERO/100071091021180/"><FacebookIcon color="white"/></a>
                </IconButton>


              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 6, mb: 5 }} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{ pb: 6 }}
        >
          <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
          © 2023, made 
by
 StoxHero 
for a better trading experience.
          </Typography>

          {/* <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
            {copyright.center}
          </Typography>

          <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
            {copyright.right}
          </Typography> */}
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;