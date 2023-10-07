import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";
import Moment from 'moment';


export default function SuccessfullAppliedUser({couponData}) {
    const [open, setOpen] = useState(false);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [allowedUsers,setAllowedUsers] = React.useState([]);
    let [update,setUpdate] = React.useState(true);
    const [allowedUserCount,setAllowedUserCount] = useState(0);

    console.log("couponData", couponData)

    let columns = [
        { Header: "Name", accessor: "name", align: "center" },
        { Header: "Mobile No.", accessor: "mobile", align: "center" },
        { Header: "Email", accessor: "email", align: "center" },
        { Header: "SignUp Method", accessor: "signupMethod", align: "center" },
        { Header: "Applied On", accessor: "appliedOn", align: "center" },
        // { Header: "Remove", accessor: "remove", align: "center" },
      ]

    let rows = []


    couponData?.usedBySuccessful?.map((elem, index) => {
    let featureObj = {}

    featureObj.name = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.user?.first_name} {elem?.user?.last_name}
      </MDTypography>
    );
    featureObj.mobile = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.user?.mobile}
      </MDTypography>
    );
    featureObj.email = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.user?.email}
      </MDTypography>
    );

    featureObj.signupMethod = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.user?.creationProcess}
      </MDTypography>
    );
    featureObj.appliedOn = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {Moment(elem?.appliedOn).format('DD-MM-YY HH:mm:ss a').toString()}
      </MDTypography>
    );

    // featureObj.remove = (
    //   <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
    //     {/* {elem?.email} */}
    //     <MDButton size="small" color="secondary" sx={{ marginRight: 0.5, minWidth: 2, minHeight: 3 }} onClick={() => { removeUser(elem._id) }}>-</MDButton>
    //   </MDTypography>
    // );

    rows.push(featureObj)
  })

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Coupon Uses({couponData?.usedBySuccessful?.length})
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

