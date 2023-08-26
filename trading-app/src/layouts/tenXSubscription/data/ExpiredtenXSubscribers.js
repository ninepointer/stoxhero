import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";


export default function TenXSubscribers({tenXSubscription}) {
    // console.log("Subscription", tenXSubscription)
    // setSubscriptionCount(tenXSubscription?.users?.length)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    // const [tenXSubsPurchaseIntent,setTenXSubsPurchaseIntent] = React.useState([]);

    // const tenXLiveSubscriptions = tenXSubscription?.users?.filter(user => user.status === 'Live')
    let columns = [
        { Header: "#", accessor: "index", align: "center" },
        { Header: "Full Name", accessor: "fullname", align: "center" },
        { Header: "Email", accessor: "email", align: "center" },
        { Header: "Mobile", accessor: "mobile", align: "center" },
        { Header: "Subscribed On", accessor: "subscribedon", align: "center" },
        { Header: "Status", accessor: "status", align: "center" },
      ]

    let rows = []

    tenXSubscription?.map((elem, index)=>{
  let featureObj = {}
  featureObj.index = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {index+1}
    </MDTypography>
  );
  featureObj.fullname = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.userId?.first_name} {elem?.userId?.last_name}
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
      {new Date(elem?.subscribedOn).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} {(new Date(elem?.subscribedOn).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata',hour12: true, timeStyle: 'medium' }).toUpperCase())}
    </MDTypography>
  );
  featureObj.status = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.status}
    </MDTypography>
  );

  

  rows.push(featureObj)
})

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Users with Expired {tenXSubscription.plan_name} Subscriptions({tenXSubscription.length})
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

