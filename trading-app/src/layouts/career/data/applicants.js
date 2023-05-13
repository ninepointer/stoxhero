import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";


export default function Applicants({career}) {
    console.log("Career", career)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [careerApplications,setCareerApplications] = React.useState([]);
    const [applicationCount,setApplicationCount] = useState(0);
    async function getCareerApplications(){
        let call1 = axios.get(`${baseUrl}api/v1/career/careerapplications/${career}`,{
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
            setCareerApplications(api1Response.data.data)
            setApplicationCount(api1Response.data.count);
            })
            .catch((error) => {
            // Handle errors here
            console.error(error);
            });
    }

    useEffect(()=>{
        getCareerApplications();
    },[])

    let columns = [
        { Header: "#", accessor: "index", align: "center" },
        { Header: "First Name", accessor: "firstname", align: "center" },
        { Header: "Last Name", accessor: "lastname", align: "center" },
        { Header: "Date of Birth", accessor: "dob", align: "center" },
        { Header: "Email", accessor: "email", align: "center" },
        { Header: "Mobile", accessor: "mobile", align: "center" },
        { Header: "College", accessor: "college", align: "center" },
        { Header: "Trading Exp.", accessor: "tradingexp", align: "center" },
        { Header: "Source", accessor: "source", align: "center" },
        { Header: "Applied On", accessor: "appliedon", align: "center" },
      ]

    let rows = []

  careerApplications?.map((elem, index)=>{
  let featureObj = {}
  featureObj.index = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {index+1}
    </MDTypography>
  );
  featureObj.firstname = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.first_name}
    </MDTypography>
  );
  featureObj.lastname = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.last_name}
    </MDTypography>
  );
  featureObj.dob = (
    <MDButton component="a" variant="caption" color="text" fontWeight="medium">
      {new Date(elem?.dob).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
    </MDButton>
  );
  featureObj.email = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.email}
    </MDTypography>
  );
  featureObj.mobile = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.mobileNo}
    </MDTypography>
  );
  featureObj.college = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.collegeName}
    </MDTypography>
  );
  featureObj.tradingexp = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.priorTradingExperience}
    </MDTypography>
  );
  featureObj.source = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.source}
    </MDTypography>
  );
  featureObj.appliedon = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {new Date(elem?.appliedOn).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} {(new Date(elem?.appliedOn).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata',hour12: true, timeStyle: 'medium' }).toUpperCase())}
    </MDTypography>
  );

  

  rows.push(featureObj)
})

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Career Applications({applicationCount})
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

