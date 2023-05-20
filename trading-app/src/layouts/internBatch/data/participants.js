import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";


export default function Participants({batch}) {
    console.log("Batch", batch)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [batchParticipants,setBatchParticipants] = React.useState([]);
    const [applicationCount,setApplicationCount] = useState(0);
    async function getBatchParticipants(){
        let call1 = axios.get(`${baseUrl}api/v1/batch/batchparticipants/${batch}`,{
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
            setBatchParticipants(api1Response.data.data)
            setApplicationCount(api1Response.data.count);
            })
            .catch((error) => {
            // Handle errors here
            console.error(error);
            });
    }

    useEffect(()=>{
      getBatchParticipants();
    },[])

    let columns = [
        { Header: "#", accessor: "index", align: "center" },
        { Header: "First Name", accessor: "firstname", align: "center" },
        { Header: "Last Name", accessor: "lastname", align: "center" },
        { Header: "Date of Birth", accessor: "dob", align: "center" },
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
  featureObj.dob = (
    <MDButton component="a" variant="caption" color="text" fontWeight="medium">
      {new Date(elem?.userId?.dob).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
    </MDButton>
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
  featureObj.college = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.collegeName}
    </MDTypography>
  );
  featureObj.joinedon = (
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
            Selected Candidates({applicationCount})
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

