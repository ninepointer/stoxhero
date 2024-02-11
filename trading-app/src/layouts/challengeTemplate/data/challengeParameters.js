import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";

export default function ChallengeParameters({saving,template, action, setAction}) {
    console.log("Challenge Template", template)
    const [open, setOpen] = useState(false);

    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    const [challengeParameters,setChallengeParameters] = React.useState([]);
    const [parameterCount,setParameterCount] = useState(0);
    async function getChallengeParameter(){
        let call1 = axios.get(`${baseUrl}api/v1/gd/template/${template?._id}`,{
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
            setChallengeParameters(api1Response.data.data)
            setParameterCount(api1Response.data.count);
            })
            .catch((error) => {
            // Handle errors here
            console.error(error);
            });
    }

    useEffect(()=>{
      getChallengeParameter();
    },[saving, open])

    let columns = [
        { Header: "#", accessor: "index", align: "center" },
        { Header: "Category", accessor: "category", align: "center" },
        { Header: "Interval", accessor: "interval", align: "center" },
        { Header: "Entry Fee", accessor: "entryfee", align: "center" },
      ]

    let rows = []

  challengeParameters?.map((elem, index)=>{
  let featureObj = {}

  featureObj.index = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {index+1}
    </MDTypography>
  );
  featureObj.category = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.category}
    </MDTypography>
  );
  featureObj.interval = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.interval}
    </MDTypography>
  );
  featureObj.entryfee = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.entryFee}
    </MDTypography>
  );

  rows.push(featureObj)
})
console.log(template)
  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Challenge Parameter({parameterCount})
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

