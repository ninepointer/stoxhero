/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";

function Breadcrumbs({ icon, title, route, light }) {
  
  const routes = route.slice(0, -1);
  console.log("this is el", route, routes, title )

  if(title === "infinitytrading"){
    title = "Infinity Trading"
  } else if(title === "battlestreet"){
    title = "BattleGround"
  } else if(title === "virtualtrading"){
    title = "Virtual Trading"
  } else if(title === "faqs"){
    title = "FAQ'S"
  } else if(title === "stoxherotrading"){
    title = "StoxHero Trading"
  } else if(title === "tenxtrading"){
    title = "TenX Trading"
  } else if(title === "referralprogram"){
    title = "Referral Program"
  } else if(title === "tenxsubscriptions"){
    title = "TenX Subscriptions"
  } else if(title === "adminreport"){
    title = "Admin Reports(M)"
  } else if(title === "careerlist"){
    title = "Career List"
  } else if(title === "careerdetails"){
    title = "Career Details"
  } else if(title === "campaigndetails"){
    title = "Campaign Details"
  } else if(title === "careerdashboard"){
    title = "Career Dashboard"
  } else if(title === "infinitydashboard"){
    title = "Infinity Dashboard"
  } else if(title === "internposition"){
    title = "Intern Position"
  } else if(title === "tenxposition"){
    title = "TenX Position"
  } else if(title === "virtualposition"){
    title = "Virtual Position"
  } else if(title === "internshipbatch"){
    title = "Internship Batches"
  } else if(title === "tutorialvideos"){
    title = "Tutorial Videos"
  } else if(title === "companyposition"){
    title = "Company Position"
  }
  // let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:3000/"
  let path=' ';

  return (
    <MDBox mr={{ xs: 0, xl: 8 }}>
      <MuiBreadcrumbs
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
          },
        }}
      >
        <Link to="/">
          <MDTypography
            component="span"
            variant="body2"
            color={light ? "white" : "dark"}
            opacity={light ? 0.8 : 0.5}
            sx={{ lineHeight: 0 }}
          >
            <Icon>{icon}</Icon>
          </MDTypography>
        </Link>
        {routes.map((el) => {
          console.log("this is el", el);
          if(path == ' '){
            path=`${el}`
          }else{
            path += `/${el}`;
          }
          return(
          <Link to={`/${path}`} key={el}>
            <MDTypography
              component="span"
              variant="button"
              fontWeight="regular"
              textTransform="capitalize"
              color={light ? "white" : "dark"}
              opacity={light ? 0.8 : 0.5}
              sx={{ lineHeight: 0 }}
            >
              {el}
            </MDTypography>
          </Link>)
        })}
        <MDTypography
          variant="button"
          fontWeight="regular"
          textTransform="capitalize"
          color={light ? "white" : "dark"}
          sx={{ lineHeight: 0 }}
        >
          {title.replace("-", " ")}
        </MDTypography>
      </MuiBreadcrumbs>
      <MDTypography
        fontWeight="bold"
        textTransform="capitalize"
        variant="h6"
        color={light ? "white" : "dark"}
        noWrap
      >
        {title.replace("-", " ")}
      </MDTypography>
    </MDBox>
  );
}

// Setting default values for the props of Breadcrumbs
Breadcrumbs.defaultProps = {
  light: false,
};

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  light: PropTypes.bool,
};

export default Breadcrumbs;
