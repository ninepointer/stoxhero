import {useState, useContext, useEffect} from "react"
import axios from "axios";
import { userContext } from "../../../../AuthContext";

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

function Transactions({render}) {
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [traderPNLDetails, settraderPNLDetails] = useState([]);

  console.log("marginDetails transaction")

  useEffect(()=>{
      axios.get(`${baseUrl}api/v1/infinityTrade/pnlandCreditData`)
        .then((res)=>{
                // console.log(res.data);
                settraderPNLDetails(res.data?.data);
        }).catch((err)=>{
            // window.alert("Error Fetching Margin Details");
            return new Error(err);
        })
  }, [render])



  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Net P&L, Portfolio Value & Available Margin Details
        </MDTypography>
        <MDBox display="flex" alignItems="flex-start">
          <MDBox color="text" mr={0.5} lineHeight={0}>
            <Icon color="inherit" fontSize="small">
              date_range
            </Icon>
          </MDBox>
          <MDTypography variant="button" color="text" fontWeight="regular">
            Lifetime Credits
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox pt={3} pb={2} px={2}>

        <MDBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          <Transaction
          color="info"
          colorTotal="info"
          colorTotalAvailable="info"
          namecolor="info"
          // colorTotal={colorTotal}
          icon={<CurrencyRupeeIcon/>}
          name="Trader Id"
          // description={datestring + " Transaction ID: " + elem.transactionId}
          value="Net P&L"
          valueTotal="Portfolio Value"
          valueTotalAvailable="Available Margin"
          />
          {/* {rows} */}
          {
            traderPNLDetails.map((elem)=>{
              let obj = {};
              let pnlAmountString = elem.npnl ? (elem.npnl >= 0 ? "+₹" + (elem.npnl.toFixed(0)).toLocaleString() : "-₹" + (-(elem.npnl.toFixed(0))).toLocaleString()) : 0
              let totalCreditString = elem.totalCredit ? (elem.totalCredit >= 0 ? "+₹" + (elem.totalCredit).toLocaleString() : "-₹" + (-(elem.totalCredit)).toLocaleString()) : 0
              let availableMarginString = elem.availableMargin ? (elem.availableMargin >= 0 ? "+₹" + (elem.availableMargin.toFixed(0)).toLocaleString() : "-₹" + (-(elem.availableMargin.toFixed(0))).toLocaleString()) : 0
              let color = elem.npnl >= 0 ? "success" : "error"
              let colorTotal = elem.totalCredit >= 0 ? "success" : "error"
              let colorTotalAvailable = elem.availableMargin >= 0 ? "success" : "error"
              obj = (
                <Transaction
                  color={color}
                  colorTotal={colorTotal}
                  colorTotalAvailable = {colorTotalAvailable}
                  icon={<CurrencyRupeeIcon/>}
                  name={elem.employeeId}
                  // description={datestring + " Transaction ID: " + elem.transactionId}
                  value={pnlAmountString}
                  valueTotal={totalCreditString}
                  valueTotalAvailable={availableMarginString}
                  />
              );
              return obj;
            })
          }
        </MDBox>
       
      </MDBox>
    </Card>
  );
}

export default Transactions;
