import {useState, useContext, useEffect} from "react"
import axios from "axios";
// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
// import MasterCard from "../../examples/Cards/MasterCard";
// import DefaultInfoCard from "../../examples/Cards/InfoCards/DefaultInfoCard";
// import AvailableIcon from '@mui/icons-material/Savings';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import PaymentsIcon from '@mui/icons-material/Payments';

// Billing page components
import AddFunds from "./components/AddFunds";
// import Invoices from "./components/Invoices";
import BillingInformation from "./components/BillingInformation";


function WalletPayment() {

  // let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  // const [marginDetails, setMarginDetails] = useState([]);
  let [render, setRender] = useState(true);
  // useEffect(()=>{
  //   axios.get(`${baseUrl}api/v1/getUserMarginDetailsAll`)
  //     .then((res)=>{
  //             console.log(res.data);
  //             setMarginDetails(res.data);
  //     }).catch((err)=>{
  //         // window.alert("Error Fetching Margin Details");
  //         return new Error(err);
  //     })
  //   },[render])

    // console.log("marginDetails main", marginDetails)
  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <AddFunds setRender={setRender} render={render}/>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7} lg={12}>
              <BillingInformation render={render}/>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default WalletPayment;