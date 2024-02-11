import * as React from 'react';
import { useEffect, useState } from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";
import { apiUrl } from '../../../constants/constants';
import { Switch } from '@mui/material';


export default function RegisteredUsers({ data }) {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  let [updateSwitch, setUpdateSwitch] = React.useState(true);
  const [userContestDetail, setUserContestDetails] = useState([]);

  let columns = [
    { Header: "#", accessor: "index", align: "center" },
    { Header: "Name", accessor: "fullname", align: "center" },
    { Header: "Mobile", accessor: "mobile", align: "center" },
    { Header: "City", accessor: "city", align: "center" },
    { Header: "Grade", accessor: "grade", align: "center" },

  ]


  let rows = []


  data?.map((elem, index) => {

    let featureObj = {}
    featureObj.index = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {index + 1}
      </MDTypography>
    );

    featureObj.fullname = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.userId?.full_name}
      </MDTypography>
    );

    featureObj.mobile = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.userId?.mobile}
      </MDTypography>
    );

    featureObj.city = (
      <MDTypography component="a" variant="caption" fontWeight="medium">
        {elem?.userId?.schoolDetails?.city?.name}
      </MDTypography>
    );

    featureObj.grade = (
      <MDTypography component="a" variant="caption" fontWeight="medium">
        {elem?.userId?.schoolDetails?.grade}
      </MDTypography>
    );

    rows.push(featureObj)
  })

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Registered Users({data?.length})
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

