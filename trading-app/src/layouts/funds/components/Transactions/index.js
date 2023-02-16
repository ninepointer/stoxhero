// @mui material components
import Card from "@mui/material/Card";
// import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
// import MDButton from "components/MDButton";

// Billing page components
import Transaction from "../Transaction";

function Transactions() {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Credit&apos;s
        </MDTypography>
        <MDBox display="flex" alignItems="flex-start">
          <MDBox color="text" mr={0.5} lineHeight={0}>
            <Icon color="inherit" fontSize="small">
              date_range
            </Icon>
          </MDBox>
          <MDTypography variant="button" color="text" fontWeight="regular">
            Recent Credits
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox pt={3} pb={2} px={2}>
        <MDBox mb={2}>
          <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
            latest
          </MDTypography>
        </MDBox>
        <MDBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          <Transaction
            color="error"
            icon=<CurrencyRupeeIcon/>
            name="ninepointer"
            description="27 March 2020, at 12:30 PM"
            value="- ₹ 2,500"
          />
          <Transaction
            color="success"
            icon=<CurrencyRupeeIcon/>
            name="ninepointer"
            description="27 March 2020, at 04:30 AM"
            value="+ ₹ 2,000"
          />
        </MDBox>
        <MDBox mt={1} mb={2}>
          <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
            all
          </MDTypography>
        </MDBox>
        <MDBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          <Transaction
            color="success"
            icon=<CurrencyRupeeIcon/>
            name="ninepointer"
            description="26 March 2020, at 13:45 PM"
            value="+ ₹ 750"
          />
          <Transaction
            color="success"
            icon=<CurrencyRupeeIcon/>
            name="ninepointer"
            description="26 March 2020, at 12:30 PM"
            value="+ ₹ 1,000"
          />
          <Transaction
            color="success"
            icon=<CurrencyRupeeIcon/>
            name="ninepointer"
            description="26 March 2020, at 08:30 AM"
            value="+ ₹ 2,500"
          />
          <Transaction
            color="success"
            icon=<CurrencyRupeeIcon/>
            name="ninepointer"
            description="26 March 2020, at 05:00 AM"
            value="+ ₹ 2,500"
          />
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Transactions;
