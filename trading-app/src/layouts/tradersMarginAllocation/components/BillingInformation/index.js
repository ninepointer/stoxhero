import {useState, useContext, useEffect} from "react"
import axios from "axios";
import { userContext } from "../../../../AuthContext";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

// Billing page components
import Bill from "../Bill";
import Transaction from "../Transaction";
import TransactionData from './data/transactionData';
import { margin } from "@mui/system";

function BillingInformation({marginDetails}) {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  // const [marginDetails, setMarginDetails] = useState([]);
  const { columns, rows } = TransactionData();
  const getDetails = useContext(userContext);
  const [traders, setTraders] = useState([]);
  const [marginDetailsCount, setMarginDetailsCount] = useState([]);



  // useEffect(()=>{
  //     axios.get(`${baseUrl}api/v1/getUserMarginDetailsAll`)
  //       .then((res)=>{
  //               console.log(res.data);
  //               setMarginDetails(res.data);
  //               setMarginDetailsCount((res.data).length);
  //       }).catch((err)=>{
  //           window.alert("Error Fetching Margin Details");
  //           return new Error(err);
  //       })
  // },[])

  console.log("marginDetails billing")

  marginDetails.map((elem)=>{
    let obj = {};
    let amountstring = elem.amount > 0 ? "+₹" + (elem.amount).toLocaleString() : "-₹" + (-(elem.amount)).toLocaleString()
    let color = elem.amount > 0 ? "success" : "error"

    // Define the input timestamp in UTC format
    const utcTimestamp = elem.creditedOn ? elem.creditedOn : '2023-04-29T11:33:02.495+00:00';

    // Create a Date object from the input timestamp
    const date = new Date(utcTimestamp);

    // Convert the UTC date to IST by adding 5 hours and 30 minutes
    // date.setHours(date.getHours() + 5);
    // date.setMinutes(date.getMinutes() + 30);

    // Format the date and time in IST as a string
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, timeZone: 'Asia/Kolkata' };
    const formattedDate = date.toLocaleString('en-US', options);

    // Output the result
    console.log(formattedDate); // Output: "Fri, Apr 29, 2023, 5:03:02 PM"
    console.log(elem.userId?.name, elem.userId)
    obj = (
      <Bill
            name={elem.userId?.name}
            company={elem.createdBy?.name}
            email={elem.userId?.email}
            vat={elem.transactionId}
            creditedOn={formattedDate}
            amount={amountstring}
            color={color}
            totalCredit=''
          />
      );
  rows.push(obj);
  })

  console.log(rows[1])


  return (
    <Card id="delete-account">
      <MDBox pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Credit History
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
        {rows}
        <h1>{marginDetails.length}</h1>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default BillingInformation;
