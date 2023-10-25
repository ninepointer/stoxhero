
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";

// Material Dashboard 2 React context
import { useMaterialUIController } from "../../../../context";

function Bill({ createdOn, name, mobile, email, vat,creditedOn,amount,color,totalCredit, noGutter, paymentStatus, paymentMode, utr }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <MDBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      bgColor={darkMode ? "transparent" : "dark"}
      borderRadius="lg"
      p={1}
      mb={noGutter ? 0 : 1}
      mt={0.5}
    >
      <MDBox p ={1} width="100%" display="flex" flexDirection="column">
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
          mb={0.5}
        >
          <MDTypography color='light' variant="button" fontWeight="medium" >
            {name} | {email} | {mobile}
          </MDTypography>

          <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
            <MDBox mr={1}>
              <MDButton variant="text" color={color}>
                {/* <Icon>delete</Icon>&nbsp;delete */}
                {amount}
              </MDButton>
            </MDBox>
            <MDButton variant="text" color={darkMode ? "dark" : "white"}>
              {/* <Icon>edit</Icon>&nbsp;edit */}
              {totalCredit}
            </MDButton>
          </MDBox>
        </MDBox>
        <MDBox mb={1} lineHeight={0}>
          <MDTypography variant="caption" color="light">
            Payment on:&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" color='light' fontWeight="medium">
              {creditedOn}
            </MDTypography>
          </MDTypography>
        </MDBox>
        <MDBox mb={1} lineHeight={0}>
          <MDTypography variant="caption" color="light">
            Created on:&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" color='light' fontWeight="medium">
              {createdOn}
            </MDTypography>
          </MDTypography>
        </MDBox>
        <MDBox mb={1} lineHeight={0}>
        <MDTypography variant="caption" color="light">
          Transaction ID:&nbsp;&nbsp;&nbsp;
          <MDTypography variant="caption" color='light' fontWeight="medium">
            {vat}
          </MDTypography>
        </MDTypography>
        </MDBox>
        <MDBox mb={1} lineHeight={0}>
        <MDTypography variant="caption" color="light">
          Payment Status:&nbsp;&nbsp;&nbsp;
          <MDTypography variant="caption" color='light' fontWeight="medium">
            {paymentStatus}
          </MDTypography>
        </MDTypography>
        </MDBox>
        <MDBox mb={1} lineHeight={0}>
        <MDTypography variant="caption" color="light">
          Payment Mode:&nbsp;&nbsp;&nbsp;
          <MDTypography variant="caption" color='light' fontWeight="medium">
            {paymentMode}
          </MDTypography>
        </MDTypography>
        </MDBox>
        <MDBox mb={1} lineHeight={0}>
        <MDTypography variant="caption" color="light">
          UTR Number:&nbsp;&nbsp;&nbsp;
          <MDTypography variant="caption" color='light' fontWeight="medium">
            {utr}
          </MDTypography>
        </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of Bill
Bill.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Bill
Bill.propTypes = {
  name: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  vat: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default Bill;
