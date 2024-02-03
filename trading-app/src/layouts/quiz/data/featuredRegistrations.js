import * as React from 'react';
import DataTable from "../../../examples/Tables/DataTable";
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import { saveAs } from 'file-saver';
import { Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

// import moment from 'moment';


export default function AllowedUsers({ registrations }) {

  let columns = [
    { Header: "Name", accessor: "name", align: "center" },
    { Header: "Mobile No.", accessor: "mobile", align: "center" },
    { Header: "Email", accessor: "email", align: "center" },
    { Header: "Referrer Code", accessor: "referrerCode", align: "center" },
    { Header: "Campaign Code", accessor: "campaignCode", align: "center" },
    // { Header: "Remove", accessor: "remove", align: "center" },
  ]

  let rows = []


  registrations?.map((elem, index) => {
    let featureObj = {}

    featureObj.name = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.first_name} {elem?.last_name}
      </MDTypography>
    );
    featureObj.mobile = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.mobileNo}
      </MDTypography>
    );
    featureObj.email = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.email}
      </MDTypography>
    );

    featureObj.referrerCode = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.referrerCode}
      </MDTypography>
    );
    featureObj.campaignCode = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.campaignCode}
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
    let csvDataDailyPnl = [["NAME", "MOBILE", "EMAIL", "REFERRER CODE", "CAMPAIGN CODE"]]
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem) => {

        return [
          `${elem?.first_name} ${elem?.last_name}`,
          elem?.mobileNo,
          elem?.email,
          elem?.referrerCode,
          elem?.campaignCode,
        ]
      })
    }

    return [[...csvDataDailyPnl, ...csvDataFile]]
  }

  const pnlData = downloadHelper(registrations)


  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            TestZone Registrations({registrations?.length})
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} gutterBottom >
            <Tooltip title="Download CSV"><MDBox sx={{ backgroundColor: "lightgrey", borderRadius: "2px", cursor: "pointer", marginRight: "5px" }} onClick={() => { handleDownload(pnlData, `contest-registration`) }}><DownloadIcon /></MDBox></Tooltip>
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