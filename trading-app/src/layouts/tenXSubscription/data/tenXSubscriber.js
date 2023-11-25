import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import moment from 'moment';
import axios from "axios";


export default function TenXSubscribers({tenXSubscription, subscriptionCount, setSubscriptionCount}) {
    
    setSubscriptionCount(tenXSubscription?.users?.length)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    const [tenXSubsPurchaseIntent,setTenXSubsPurchaseIntent] = React.useState([]);

    function TruncatedName(name) {
      const originalName = name;
      const convertedName = originalName
        .toLowerCase() // Convert the entire name to lowercase
        .split(' ') // Split the name into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(' '); // Join the words back together with a space
    
      // Trim the name to a maximum of 30 characters
      const truncatedName = convertedName.length > 30 ? convertedName.substring(0, 30) + '...' : convertedName;
    
      return truncatedName;
    }
   
    let columns = [
        { Header: "#", accessor: "index", align: "center" },
        { Header: "Full Name", accessor: "fullname", align: "center" },
        { Header: "Email", accessor: "email", align: "center" },
        { Header: "Mobile", accessor: "mobile", align: "center" },
        { Header: "Subscribed On", accessor: "subscribedon", align: "center" },
        { Header: "Expiring On", accessor: "expiringon", align: "center" },
        { Header: "Status", accessor: "status", align: "center" },
        { Header: "Payout", accessor: "payout", align: "center" },
      ]

    let rows = []

    tenXSubscription?.users?.map((elem, index)=>{
  let featureObj = {}
  featureObj.index = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {index+1}
    </MDTypography>
  );
  featureObj.fullname = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {TruncatedName(elem?.userId?.first_name + ' ' + elem?.userId?.last_name)}
    </MDTypography>
  );
  featureObj.email = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.userId?.email}
    </MDTypography>
  );
  featureObj.mobile = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.userId?.mobile}
    </MDTypography>
  );
  featureObj.subscribedon = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {moment.utc(elem?.subscribedOn).utcOffset('+05:30').format("DD-MMM-YY hh:mm a")}
    </MDTypography>
  );
  featureObj.expiringon = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {moment.utc(elem?.subscribedOn).utcOffset('+05:30').add(elem?.expiryDays, 'days').hours(19).minutes(0).format("DD-MMM-YY hh:mm a")}
    </MDTypography>
  );
  featureObj.status = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.status}
    </MDTypography>
  );
  featureObj.payout = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.payout ? elem?.payout : 0)}
    </MDTypography>
  );

  

  rows.push(featureObj)
})

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Users who bought {tenXSubscription.plan_name} Subscription({subscriptionCount})
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox mt={1}>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={true}
          isSorted={false}
          noEndBorder
          entriesPerPage={true}
        />
      </MDBox>
    </Card>
  );
}

