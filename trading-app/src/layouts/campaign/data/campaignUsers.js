import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";
import { saveAs } from 'file-saver';
import { Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import moment from 'moment';


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

const handleDownload = (csvData, nameVariable) => {
  // Create the CSV content
  // const csvContent = csvData.map(row => row.join(',')).join('\n');
  const csvContent = csvData?.map((row) => {
    return row?.map((row1) => row1.join(',')).join('\n');
  });
  // const csvContent = 'Date,Weekday,Gross P&L(S) Gross P&L(I) Net P&L(S) Net P&L(I) Net P&L Diff(S-I)\nValue 1,Value 2,Value 3\nValue 4, Value 5, Value 6';

  // Create a Blob object with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

  // Save the file using FileSaver.js
  saveAs(blob, `${nameVariable}.csv`);
}

function downloadHelper(data) {
  let csvDataFile = [[]]
  let csvDataDailyPnl = [["FIRST NAME", "LAST NAME", "EMAIL", "MOBILE", "JOINED ON"]]
  if (data) {
    // dates = Object.keys(data)
    let csvpnlData = Object.values(data)
    csvDataFile = csvpnlData?.map((elem) => {

      return [
        `${elem?.userId?.first_name}`, 
        `${elem?.userId?.last_name}`,
        elem?.userId?.email,
        elem?.userId?.mobile,
        moment(elem?.joinedOn).format('DD-MM-YY HH:mm:ss a')  
      ]
    })
  }

  return [[...csvDataDailyPnl, ...csvDataFile]]
}

const pnlData = downloadHelper(campaign?.users);


  return (
    <Card>
      {/* <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Campaign Users({campaignUserCount ? campaignUserCount : 'No Users'})
          </MDTypography>
        </MDBox>
      </MDBox> */}
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Campaign Users({campaignUserCount ? campaignUserCount : 'No Users'})
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} gutterBottom >
            <Tooltip title="Download CSV"><MDBox sx={{ backgroundColor: "lightgrey", borderRadius: "2px", cursor: "pointer", marginRight: "5px" }} onClick={() => { handleDownload(pnlData, `campaign-users`) }}><DownloadIcon /></MDBox></Tooltip>
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

