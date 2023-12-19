import * as React from 'react';
import {useEffect, useState} from "react";
import axios from "axios";
import DataTable from "../../../examples/Tables/DataTable";
// import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import { Tooltip } from '@mui/material';
import MDButton from '../../../components/MDButton';
// import axios from "axios";
import moment from 'moment';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';



export default function AllowedUsers({ dailyContest }) {
  const [leaderBoard, setLeaderBoard] = useState([]);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  
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
    { Header: "Rank", accessor: "rank", align: "center" },
    { Header: "Name", accessor: "name", align: "center" },
    { Header: "Mobile No.", accessor: "mobile", align: "center" },
    { Header: "Email", accessor: "email", align: "center" },
    { Header: "SignUp Method", accessor: "signupMethod", align: "center" },
    { Header: "Joining Date", accessor: "doj", align: "center" },
    { Header: "Gross P&L", accessor: "grosspnl", align: "center" },
    { Header: "Net P&L", accessor: "netpnl", align: "center" },
    { Header: "Payout", accessor: "payout", align: "center" },
    { Header: "# of Trades", accessor: "trades", align: "center" },
  ]

  let rows = []

  useEffect(() => {
    let call1 = axios.get(`${baseUrl}api/v1/dailycontest/trade/${dailyContest?._id}/leaderboard`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
    })
    Promise.all([call1])
      .then(([api1Response]) => {
        // Process the responses here
        setLeaderBoard(api1Response.data.data)
      })
      .catch((error) => {
        // Handle errors here
        console.error(error);
      });
  }, [dailyContest])

  
  leaderBoard?.map((elem, index) => {
    let featureObj = {}

    featureObj.rank = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {index + 1}
      </MDTypography>
    );
    featureObj.name = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {TruncatedName(elem?.first_name + ' ' + elem?.last_name)}
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
        {elem?.creationProcess !== 'Auto SignUp' ? elem?.creationProcess : (elem?.creationProcess === 'Auto SignUp' && (elem?.referredBy || elem?.referredBy === ' ')) ? 'Referral SignUp' : 'Organic SignUp'}
      </MDTypography>
    );

    featureObj.doj = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {moment.utc(elem?.joining_date).utcOffset('+00:00').format('DD-MMM-YY')}
      </MDTypography>
    );

    featureObj.grosspnl = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.grosspnl >= 0 ? "₹" : "-₹"}{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(elem?.grosspnl >= 0 ? elem?.grosspnl : -elem?.grosspnl)}
      </MDTypography>
    );

    featureObj.netpnl = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.netpnl >= 0 ? "₹" : "-₹"}{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(elem?.netpnl >= 0 ? elem?.netpnl : -elem?.netpnl)}
      </MDTypography>
    );

    featureObj.payout = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.payout >= 0 ? "₹" : "-₹"}{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(elem?.payout >= 0 ? elem?.payout : -elem?.payout)}
      </MDTypography>
    );

    featureObj.trades = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.trades}
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
    let csvDataDailyPnl = [["Rank","Name", "Mobile", "Email", "Signup Method", "Joining_date", "Gross P&L", "Net P&L", "Payout", "Trades"]]
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem, index) => {

        return [
          index+1,
          TruncatedName(elem?.first_name + ' ' + elem?.last_name),
          elem?.mobile,
          elem?.email,
          elem?.creationProcess !== 'Auto SignUp' ? elem?.creationProcess : (elem?.creationProcess === 'Auto SignUp' && (elem?.referredBy || elem?.referredBy === ' ')) ? 'Referral SignUp' : 'Organic SignUp',
          moment.utc(elem?.joining_date).utcOffset('+00:00').format('DD-MMM-YY'),
          (elem?.grosspnl)?.toFixed(2),
          (elem?.netpnl)?.toFixed(2),
          (elem?.payout)?.toFixed(2),
          elem?.trades
        ]
      })
    }

    return [[...csvDataDailyPnl, ...csvDataFile]]
  }

  const pnlData = downloadHelper(leaderBoard)


  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
        <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
          TestZone Leaderboard
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} gutterBottom >
            <Tooltip title="Download CSV"><MDBox sx={{ backgroundColor: "lightgrey", borderRadius: "2px", cursor: "pointer", marginRight: "5px" }} onClick={() => { handleDownload(pnlData, `Leaderboard-${dailyContest?.contestName}`) }}><DownloadIcon /></MDBox></Tooltip>
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

