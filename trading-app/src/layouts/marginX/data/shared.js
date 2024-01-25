import * as React from 'react';
import DataTable from "../../../examples/Tables/DataTable";
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import moment from 'moment';


export default function RegisteredUsers({ marginx }) {

  console.log("MarginX in Registered Users:",marginx)
  let columns = [
    { Header: "#", accessor: "index", align: "center" },
    { Header: "Name", accessor: "fullname", align: "center" },
    { Header: "Email", accessor: "email", align: "center" },
    { Header: "Mobile", accessor: "mobile", align: "center" },
    { Header: "SignUp Method", accessor: "signupMethod", align: "center" },
    { Header: "Time", accessor: "time", align: "center" },

  ]


  let rows = []

  marginx?.sharedBy?.sort((a, b)=>{
    if(new Date(b.boughtAt) < new Date(a.boughtAt)) return -1;
    else if(new Date(b.boughtAt) > new Date(a.boughtAt)) return 1;
    else return 0;
  })

  marginx?.sharedBy?.map((elem, index) => {

    let featureObj = {}
    featureObj.index = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {index + 1}
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
    featureObj.signupMethod = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.userId?.creationProcess}
      </MDTypography>
    );
    featureObj.time = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {moment.utc(elem?.boughtAt).utcOffset('+05:30').format('DD-MMM-YY hh:mm a')}
      </MDTypography>
    );

    rows.push(featureObj)
  })

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Users Who Shared the MarginX({marginx?.sharedBy?.length})
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

