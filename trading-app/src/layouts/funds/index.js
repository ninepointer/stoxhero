// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import MasterCard from "../../examples/Cards/MasterCard";
import DefaultInfoCard from "../../examples/Cards/InfoCards/DefaultInfoCard";
import AvailableIcon from '@mui/icons-material/Savings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentsIcon from '@mui/icons-material/Payments';


// Billing page components
import PaymentMethod from "./components/PaymentMethod";
import Invoices from "./components/Invoices";
import BillingInformation from "./components/BillingInformation";
import Transactions from "./components/Transactions";


function Billing() {
  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={16} lg={12}>
              <Grid container spacing={3}>
                {/* <Grid item xs={12} xl={6}>
                  <MasterCard number={4562112245947852} holder="jack peterson" expires="11/22" />
                </Grid> */}
                <Grid item xs={16} md={6} xl={2.4}>
                  <DefaultInfoCard
                    icon=<AvailableIcon/>
                    title="total credit"
                    //description="Belong Interactive"
                    value="+₹2000"
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={2.4}>
                  <DefaultInfoCard
                    icon=<AvailableIcon/>
                    title="available margin"
                    //description="Belong Interactive"
                    value="+₹2000"
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={2.4}>
                  <DefaultInfoCard
                    icon=<ShoppingCartIcon/>
                    title="used margin"
                    //description="Belong Interactive"
                    value="+₹2000"
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={2.4}>
                  <DefaultInfoCard
                    icon=<PaymentsIcon/>
                    title="available cash"
                    //description="Freelance Payment"
                    value="₹455.00"
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={2.4}>
                  <DefaultInfoCard
                    icon=<AccountBalanceWalletIcon/>
                    title="opening balance"
                    //description="Freelance Payment"
                    value="₹455.00"
                  />
                </Grid>
              </Grid>
            </Grid>
            
          </Grid>
        </MDBox>
        <MDBox mt={3} mb={3}>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} md={7}>
              <BillingInformation />
            </Grid> */}
            <Grid item xs={12} md={5}>
              <Transactions />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
