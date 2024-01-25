import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";
import { apiUrl } from '../../../constants/constants';
import { saveAs } from 'file-saver';
import { Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import moment from 'moment';  

export default function Participants({batch, action, setAction}) {
    console.log("Batch", batch)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [batchParticipants,setBatchParticipants] = React.useState([]);
    const [applicationCount,setApplicationCount] = useState(0);
    // const [action, setAction] = useState(false);
    async function getBatchParticipants(){
        let call1 = axios.get(`${baseUrl}api/v1/internbatch/batchparticipants/${batch}`,{
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
            console.log(api1Response.data.data);
            setBatchParticipants(api1Response.data.data.participants)
            setApplicationCount(api1Response.data.data.participants.length);
            })
            .catch((error) => {
            // Handle errors here
            console.error(error);
            });
    }

    useEffect(()=>{
      getBatchParticipants();
    },[action])
    const handleRemove = async (userId) =>{
      const res = await axios.patch(`${apiUrl}internbatch/remove/${batch}/${userId}`, {}, {withCredentials: true});
      console.log(res.data);
      setAction(!action);
    }
    let columns = [
        { Header: "#", accessor: "index", align: "center" },
        { Header: "Remove", accessor: "remove", align: "center" },
        { Header: "Name", accessor: "fullname", align: "center" },
        { Header: "Email", accessor: "email", align: "center" },
        { Header: "Mobile", accessor: "mobile", align: "center" },
        { Header: "College", accessor: "college", align: "center" },
        { Header: "Joined On", accessor: "joinedon", align: "center" },
      ]

    let rows = []

  batchParticipants?.map((elem, index)=>{
  let featureObj = {}
  featureObj.index = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {index+1}
    </MDTypography>
  );
  featureObj.remove = (
    <MDButton component="a" variant="Outlined" color="error" fontWeight="medium" onClick = {()=>{handleRemove(elem?.user._id)}}>
      Remove
    </MDButton>
  );
  featureObj.fullname = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.user?.first_name} {elem?.user?.last_name}
    </MDTypography>
  );

  featureObj.email = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.user?.email}
    </MDTypography>
  );
  featureObj.mobile = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.user?.mobile}
    </MDTypography>
  );
  featureObj.college = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.college?.collegeName}
    </MDTypography>
  );
  featureObj.joinedon = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {new Date(elem?.joiningDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} {(new Date(elem?.joiningDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata',hour12: true, timeStyle: 'medium' }).toUpperCase())}
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
  let csvDataDailyPnl = [["NAME", "EMAIL", "MOBILE", "COLLEGE", "JOINED ON"]]
  if (data) {
    // dates = Object.keys(data)
    let csvpnlData = Object.values(data)
    csvDataFile = csvpnlData?.map((elem) => {

      return [
        `${elem?.first_name} ${elem?.last_name}`,
        elem?.user?.email,
        elem?.user?.mobile,
        elem?.college?.collegeName,
        moment(elem?.joiningDate).format('DD-MM-YY HH:mm:ss a')
      ]
    })
  }

  return [[...csvDataDailyPnl, ...csvDataFile]]
}

const pnlData = downloadHelper(batchParticipants);


  return (
    <Card>
      {/* <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Selected Candidates({applicationCount})
          </MDTypography>
        </MDBox>
      </MDBox> */}
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Selected Candidates({applicationCount})
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} gutterBottom >
            <Tooltip title="Download CSV"><MDBox sx={{ backgroundColor: "lightgrey", borderRadius: "2px", cursor: "pointer", marginRight: "5px" }} onClick={() => { handleDownload(pnlData, `selected-candidates`) }}><DownloadIcon /></MDBox></Tooltip>
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

