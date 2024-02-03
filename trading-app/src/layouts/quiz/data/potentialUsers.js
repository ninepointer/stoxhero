import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
// import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import { Tooltip } from '@mui/material';
// import MDButton from '../../../components/MDButton';
// import axios from "axios";
// import moment from 'moment';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';
// import html2canvas from 'html2canvas';



export default function AllowedUsers({ dailyContest }) {

  let columns = [
    { Header: "Name", accessor: "name", align: "center" },
    { Header: "Mobile No.", accessor: "mobile", align: "center" },
    { Header: "Email", accessor: "email", align: "center" },
    { Header: "SignUp Method", accessor: "signupMethod", align: "center" },
  ]

  let rows = []


  dailyContest?.potentialParticipants?.map((elem, index) => {
    let featureObj = {}

    featureObj.name = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.first_name} {elem?.last_name}
      </MDTypography>
    );
    featureObj.mobile = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.mobile}
      </MDTypography>
    );
    featureObj.email = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.email}
      </MDTypography>
    );

    featureObj.signupMethod = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.creationProcess}
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
    let csvDataDailyPnl = [["NAME", "MOBILE", "EMAIL", "SIGNUP METHOD"]]
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem) => {

        return [
          `${elem?.first_name} ${elem?.last_name}`,
          elem?.mobile,
          elem?.email,
          elem?.creationProcess
        ]
      })
    }

    return [[...csvDataDailyPnl, ...csvDataFile]]
  }

  const pnlData = downloadHelper(dailyContest?.potentialParticipants)


  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
        <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Potential Users({dailyContest?.potentialParticipants?.length})
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} gutterBottom >
            <Tooltip title="Download CSV"><MDBox sx={{ backgroundColor: "lightgrey", borderRadius: "2px", cursor: "pointer", marginRight: "5px" }} onClick={() => { handleDownload(pnlData, `registeredUsers-${dailyContest?.contestName}`) }}><DownloadIcon /></MDBox></Tooltip>
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox mt={1}>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  );
}

