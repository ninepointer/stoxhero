import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";
// import moment from 'moment';


export default function AllowedUsers({saving,registrations, action, updatedDocument}) {
    // const [open, setOpen] = useState(false);
    // let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
    // const [allowedUsers,setAllowedUsers] = React.useState([]);
    // let [update,setUpdate] = React.useState(true);
    // const [allowedUserCount,setAllowedUserCount] = useState(0);

    // console.log("dailyContest in shared", dailyContest)

    let columns = [
        { Header: "Name", accessor: "name", align: "center" },
        { Header: "Mobile No.", accessor: "mobile", align: "center" },
        { Header: "Email", accessor: "email", align: "center" },
        { Header: "Referrer Code", accessor: "referrerCode", align: "center" },
        { Header: "Campaign Code", accessor: "campaignCode", align: "center" },
        { Header: "College Name", accessor: "collegeName", align: "center" },
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
    featureObj.collegeName = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.collegeName}
      </MDTypography>
    );

    rows.push(featureObj)
  })

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            College Contest Registrations({registrations?.length})
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

