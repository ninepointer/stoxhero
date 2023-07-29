import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";
import { apiUrl } from '../../../constants/constants';


export default function Participants({batch, action, setAction}) {
    console.log("Batch", batch)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
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

