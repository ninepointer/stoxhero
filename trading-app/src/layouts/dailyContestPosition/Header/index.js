
// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";

// Material Dashboard 2 React base styles

// Images
import backgroundImage from "../../../assets/images/trading.jpg";
import AlgoUser from "../AlgoUser";



function TradingAccountHeader() {

  return (
   
    <MDBox position="relative" mt={0} mb={0}>

      <MDBox/>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={12} lg={12} sx={{ ml: "auto" }}>
            <AlgoUser/>
          </Grid>
        </Grid>
        {/* </Card>      */}
     </MDBox>
   
    
  );
}

// Setting default props for the Header
TradingAccountHeader.defaultProps = {
  children: "",
};

// Typechecking props for the Header
TradingAccountHeader.propTypes = {
  children: PropTypes.node,
};

function TabPanel(props){
  const{children,value,index}=props;
  return(
    <>
    {
      value === index &&
      <h1>{children}</h1>
    }
     {/* <TableOne/> */}
    </>
   
  )
}

export default TradingAccountHeader;
