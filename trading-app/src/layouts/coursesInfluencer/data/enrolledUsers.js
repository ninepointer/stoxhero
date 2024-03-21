import * as React from "react";
// import { useEffect, useState } from "react";
import DataTable from "../../../examples/Tables/DataTable";
// import MDButton from "../../../components/MDButton";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import {Card, Tooltip} from "@mui/material";
// import axios from "axios";
import moment from 'moment';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';

export default function EnrolledUsers({
  course,
}) {

  let columns = [
    { Header: "Name", accessor: "name", align: "center" },
    { Header: "Enrollment Date", accessor: "date", align: "center" },
    { Header: "Fee", accessor: "amount", align: "center" },
    { Header: "Commission", accessor: "commission", align: "center" },
  ];

  let rows = [];


  course?.enrollments?.map((elem, index) => {
    let obj = {};
    console.log('elem is', elem);

    obj.name = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem?.userId?.first_name} {elem?.userId?.last_name}
      </MDTypography>
    );

    obj.date = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {moment(elem?.enrolledOn).format("DD-MM-YY hh:mm:ss a")}
      </MDTypography>
    );

    obj.amount = (
        <MDTypography
          component="a"
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          ₹{(Number(elem?.pricePaidByUser)- Number(elem?.gstAmount)).toFixed(2)}
        </MDTypography>
      );
    obj.commission = (
        <MDTypography
          component="a"
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          ₹{((elem?.pricePaidByUser-elem?.gstAmount)*((course?.commissionPercentage/100)??0)).toFixed(2)}
        </MDTypography>
      );

    rows.push(obj);
  });

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
    let csvDataDailyPnl = [["NAME", "ENROLLMENT DATE", "FEE", "COMMISSION"]]
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem) => {

        return [
          `${elem?.userId?.first_name} ${elem?.userId?.last_name}`,
          elem?.enrolledOn,
          (Number(elem?.pricePaidByUser)- Number(elem?.gstAmount)),
          ((elem?.pricePaidByUser-elem?.gstAmount)*((course?.commissionPercentage/100)??0))
        ]
      })
    }

    return [[...csvDataDailyPnl, ...csvDataFile]]
  }

  const pnlData = downloadHelper(course?.enrollments)

  
  return (
    <Card sx={{ width: '100%' }}>
       <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
        <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
          Users Enrolled({course?.enrollments?.length})
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} gutterBottom >
            <Tooltip title="Download CSV"><MDBox sx={{ backgroundColor: "lightgrey", borderRadius: "2px", cursor: "pointer", marginRight: "5px" }} onClick={() => { handleDownload(pnlData, `enrolledUsers-${course?.courseName}`) }}><DownloadIcon /></MDBox></Tooltip>
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
