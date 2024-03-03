import * as React from "react";
import { useEffect, useState } from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import Card from "@mui/material/Card";
import axios from "axios";
// import moment from 'moment';

export default function EnrolledUsers({
  course,
}) {

  let columns = [
    { Header: "Name", accessor: "name", align: "center" },
    { Header: "Enrollment Date", accessor: "date", align: "center" },
    { Header: "Amount", accessor: "amount", align: "center" },
  ];

  let rows = [];

  course?.enrollments?.map((elem, index) => {
    let obj = {};

    obj.name = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem?.userId?.first_name} {elem?.userId?.last_name}
      </MDTypography>
    );
    // obj.mobile = (
    //   <MDTypography
    //     component="a"
    //     variant="caption"
    //     color="text"
    //     fontWeight="medium"
    //   >
    //     {elem?.userId?.mobile}
    //   </MDTypography>
    // );
    // obj.email = (
    //   <MDTypography
    //     component="a"
    //     variant="caption"
    //     color="text"
    //     fontWeight="medium"
    //   >
    //     {elem?.userId?.email}
    //   </MDTypography>
    // );

    obj.date = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {elem?.enrolledOn}
      </MDTypography>
    );

    // obj.amount = (
    //     <MDTypography
    //       component="a"
    //       variant="caption"
    //       color="text"
    //       fontWeight="medium"
    //     >
    //       {elem?.enrolledOn}
    //     </MDTypography>
    //   );

    rows.push(obj);
  });

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}
        >
          <MDTypography
            variant="text"
            fontSize={12}
            color="black"
            mt={0.7}
            alignItems="center"
            gutterBottom
          >
            Users Enrolled({course?.enrollments?.length})
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
