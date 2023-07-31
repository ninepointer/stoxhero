import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";
import { apiUrl } from '../../../constants/constants';


export default function RegisteredUsers({dailyContest, action, setAction}) {
   
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [registeredUsers,setRegisteredUsers] = React.useState([]);
    const [registeredUsersCount,setRegisteredUsersCount] = useState(0);
 
    let columns = [
        { Header: "#", accessor: "index", align: "center" },
        // { Header: "Remove", accessor: "remove", align: "center" },
        { Header: "Name", accessor: "fullname", align: "center" },
        { Header: "Email", accessor: "email", align: "center" },
        { Header: "Mobile", accessor: "mobile", align: "center" },
      ]

    let rows = []

  dailyContest?.participants?.map((elem, index)=>{
  let featureObj = {}
  featureObj.index = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {index+1}
    </MDTypography>
  );

  featureObj.fullname = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.userId?.first_name} {elem?.userId?.last_name}
    </MDTypography>
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

  rows.push(featureObj)
})

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Participated Users({dailyContest?.participants?.length})
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

