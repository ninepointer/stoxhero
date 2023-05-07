import * as React from 'react';
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";


export default function FeatureData({updatedDocument}) {
    console.log("updatedDocument", updatedDocument)
    let columns = [
        { Header: "Order No.", accessor: "orderNo", align: "center" },
        { Header: "Description", accessor: "description", align: "center" },
        { Header: "Edit", accessor: "edit", align: "center" },
        { Header: "Delete", accessor: "delete", align: "center" },
      ]

    let rows = []

updatedDocument?.features?.map((elem)=>{
  let featureObj = {}
  featureObj.orderNo = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem.orderNo}
    </MDTypography>
  );
  featureObj.description = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem.description}
    </MDTypography>
  );
  featureObj.edit = (
    <MDButton component="a" variant="caption" color="text" fontWeight="medium">
      Edit
    </MDButton>
  );
  featureObj.delete = (
    <MDButton component="a" variant="caption" color="text" fontWeight="medium">
      Delete
    </MDButton>
  );

  rows.push(featureObj)
})

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Feature added!
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

