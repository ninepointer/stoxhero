// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import YoutubeIcon from "@mui/icons-material/YouTube"

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import { Divider, Grid } from "@mui/material";
import MDTypography from "../../../../components/MDTypography";

// Material Dashboard 2 React base styles
import typography from "../../../../assets/theme/base/typography";

function Footer({ light }) {
  const { size } = typography;

  return (
    <MDBox width="100%" bottom={0} py={2} style={{backgroundColor:'#315c45'}}>
      <Grid container xs={12} md={12} lg={12}>

          <Grid item xs={12} md={12} lg={4} mt={1}>
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
              color={light ? "text" : "white"}
              fontSize={size.sm}
            >
              &copy; {new Date().getFullYear()}, made with
              <MDBox fontSize={size.md} color={light ? "dark" : "white"} mb={-0.5} mx={0.25}>
                <Icon color="inherit" fontSize="inherit">
                  favorite
                </Icon>
              </MDBox>
              by
              <Link href="https://www.stoxhero.com/" target="_blank">
                <MDTypography variant="button" fontWeight="medium" color={light ? "dark" : "white"}>
                  &nbsp;StoxHero&nbsp;
                </MDTypography>
              </Link>
              for a better trading experience.
            </MDBox>
          </Grid>

          <Grid item xs={12} md={12} lg={4} mt={1} display='flex' justifyContent='center' alignItems='center'>
            <MDBox lineHeight={1}>
              <Link href="https://www.youtube.com/@stoxhero_official" target="_blank">
                <YoutubeIcon color='white'/>
              </Link>
            </MDBox>
            <MDBox pl={2} lineHeight={1}>
              <Link href="https://www.linkedin.com/company/stoxhero" target="_blank">
                <LinkedInIcon color='white'/>
              </Link>
            </MDBox>
            <MDBox pl={2} lineHeight={1}>
              <Link href="https://www.instagram.com/stoxhero_official/" target="_blank">
                <InstagramIcon color='white'/>
              </Link>
            </MDBox>
            <MDBox pl={2} lineHeight={1}>
              <Link href="https://www.facebook.com/stoxhero" target="_blank">
                <FacebookIcon color='white'/>
              </Link>
            </MDBox>
          </Grid>

          <Grid item xs={12} md={12} lg={4} mt={1} display='flex' justifyContent='center'>
            <MDBox lineHeight={1}>
              <Link href="/about" target="_blank">
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color={light ? "dark" : "white"}
                >
                  About
                </MDTypography>
              </Link>
            </MDBox>
            <MDBox pl={2} lineHeight={1}>
              <Link href="/contact" target="_blank">
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color={light ? "dark" : "white"}
                >
                  Contact Us
                </MDTypography>
              </Link>
            </MDBox>
            <MDBox pl={2} lineHeight={1}>
              <Link href="/terms" target="_blank">
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color={light ? "dark" : "white"}
                >
                  Terms of Usage
                </MDTypography>
              </Link>
            </MDBox>
          </Grid>

          <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center' alignItems='center'>
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
              color={light ? "text" : "white"}
              fontSize={size.sm}
              // style={{textDecoration:'underline'}}
            >
              For support: team@stoxhero.com
            </MDBox>
          </Grid>

          <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center' alignItems='center'>
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
              color={light ? "text" : "white"}
              fontSize={size.sm}
              style={{textAlign:'center'}}
            >
              © 2023, STOXHERO GAMES TECHNOLOGIES PRIVATE LIMITED. All rights reserved.
            </MDBox>
          </Grid>

          <Grid item xs={12} md={12} lg={12} mt={1} display='flex' justifyContent='center' alignItems='center'>
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
              color={light ? "text" : "white"}
              fontSize={size.sm}
              style={{textAlign:'center'}}
            >
              S-77, NRI Colony, Sec-24, Pratap Nagar, Sanganer, Pratap Nagar Housing Board, Jaipur-302033
            </MDBox>
          </Grid>

      </Grid>
    </MDBox>
  );
}

// Setting default props for the Footer
Footer.defaultProps = {
  light: false,
};

// Typechecking props for the Footer
Footer.propTypes = {
  light: PropTypes.bool,
};

export default Footer;
