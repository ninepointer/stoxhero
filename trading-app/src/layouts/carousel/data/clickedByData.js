import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";
import moment from 'moment';


export default function ClickedBy({carousel, action, updatedDocument}) {
    const [open, setOpen] = useState(false);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [clickedByUsers,setClickedByUsers] = React.useState([]);
    let [update,setUpdate] = React.useState(true);
    const [clickedByUserCount,setClickedByUserCount] = useState(0);
    console.log("Carousel", carousel)

    let columns = [
        { Header: "#", accessor: "index", align: "center" },
        { Header: "Name", accessor: "name", align: "center" },
        { Header: "Mobile No.", accessor: "mobile", align: "center" },
        { Header: "Email", accessor: "email", align: "center" },
        { Header: "SignUp Method", accessor: "signupMethod", align: "center" },
        { Header: "Clicked On", accessor: "clickedon", align: "center" },
        { Header: "Joining Date", accessor: "joiningdate", align: "center" },
        // { Header: "Remove", accessor: "remove", align: "center" },
      ]

    let rows = []

    carousel?.clickedBy?.map((elem, index) => {
    let featureObj = {}
    console.log(elem)
    featureObj.index = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {index+1}
        </MDTypography>
      );

    featureObj.name = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.userId?.first_name} {elem?.userId?.last_name}
      </MDTypography>
    );
    featureObj.mobile = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.userId?.mobile}
      </MDTypography>
    );
    featureObj.email = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.userId?.email}
      </MDTypography>
    );

    featureObj.signupMethod = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.userId?.creationProcess}
      </MDTypography>
    );

    featureObj.clickedon = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {moment.utc(elem?.clickedOn).utcOffset('+05:30').format('DD-MMM hh:mm a')}
        </MDTypography>
      );

    featureObj.joiningdate = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
           {moment.utc(elem?.userId?.joining_date).utcOffset('+05:30').format('DD-MMM hh:mm a')}
        </MDTypography>
      );

    rows.push(featureObj)
  })

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Carousel Clicked By({carousel?.clickedBy?.length})
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

