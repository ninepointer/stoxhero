import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";


export default function Applicants({campaign, campaignUserCount}) {
    console.log("Campaign", campaign)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [campaignUsers,setCampaignUsers] = React.useState([]);
    // async function getCampaignUsers(){
    //     let call1 = axios.get(`${baseUrl}api/v1/campaign/${campaign}`,{
    //         withCredentials: true,
    //         headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/json",
    //             "Access-Control-Allow-Credentials": true
    //           },
    //         })
    //         Promise.all([call1])
    //         .then(([api1Response]) => {
    //         // Process the responses here
    //         console.log(api1Response.data.data);
    //         setCampaignUsers(api1Response.data.data)
    //         setCampaignUsersCount(api1Response.data.count);
    //         })
    //         .catch((error) => {
    //         // Handle errors here
    //         console.error(error);
    //         });
    // }

    // useEffect(()=>{
    //     getCampaignUsers();
    // },[campaign])

    let columns = [
        { Header: "#", accessor: "index", align: "center" },
        { Header: "First Name", accessor: "firstname", align: "center" },
        { Header: "Last Name", accessor: "lastname", align: "center" },
        { Header: "Email", accessor: "email", align: "center" },
        { Header: "Mobile", accessor: "mobile", align: "center" },
        { Header: "Joined On", accessor: "appliedon", align: "center" },
      ]

    let rows = []

  campaign.users?.map((elem, index)=>{
  console.log("elem:",elem)
  let featureObj = {}
  featureObj.index = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {index+1}
    </MDTypography>
  );
  featureObj.firstname = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.userId?.first_name}
    </MDTypography>
  );
  featureObj.lastname = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.userId?.last_name}
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
  featureObj.appliedon = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {new Date(elem?.joinedOn).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} {(new Date(elem?.joinedOn).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata',hour12: true, timeStyle: 'medium' }).toUpperCase())}
    </MDTypography>
  );

  

  rows.push(featureObj)
})

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Campaign Users({campaignUserCount ? campaignUserCount : 'No Users'})
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox mt={1}>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          // noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  );
}

