import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";
import Moment from 'moment';
import { Tooltip } from '@mui/material';
// import axios from "axios";
// import moment from 'moment';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';


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
        { Header: "Joining Date", accessor: "joiningDate", align: "center" },
        { Header: "Applied On", accessor: "appliedOn", align: "center" },
        { Header: "Product Type", accessor: "product", align: "center" },
        { Header: "Product", accessor: "specificProduct", align: "center" },
        { Header: "Price", accessor: "price", align: "center" },
        { Header: "Discount", accessor: "discountAmount", align: "center" },
        { Header: "Effective Price", accessor: "effectivePrice", align: "center" },
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
    featureObj.joiningDate = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {Moment(elem?.user?.joining_date).format('DD-MM-YY HH:mm:ss a').toString()}
      </MDTypography>
    );
    featureObj.appliedOn = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {Moment(elem?.appliedOn).format('DD-MM-YY HH:mm:ss a').toString()}
      </MDTypography>
    );
    featureObj.product = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.product?.productName}
      </MDTypography>
    );
    featureObj.specificProduct = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.specificProductDetail?.name}
      </MDTypography>
    );
    featureObj.price = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.specificProductDetail?.price}
      </MDTypography>
    );
    featureObj.discountAmount = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.specificProductDetail?.discountAmount?.toFixed(2)}
      </MDTypography>
    );
    featureObj.effectivePrice = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.specificProductDetail?.effectivePrice?.toFixed(2)}
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
  const handleDownload = (csvData, nameVariable) => {
    // Create the CSV content
    // const csvContent = csvData.map(row => row.join(',')).join('\n');
    const csvContent = csvData?.map((row) => {
      return row?.map((row1) => row1.join(',')).join('\n');
    });
    // const csvContent = 'Date,Weekday,Gross P&L(S) Gross P&L(I) Net P&L(S) Net P&L(I) Net P&L Diff(S-I)\nValue 1,Value 2,Value 3\nValue 4, Value 5, Value 6';

    // Create a Blob object with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

    // Save the file using FileSaver.js
    saveAs(blob, `${nameVariable}.csv`);
  }

  function downloadHelper(data) {
    let csvDataFile = [[]]
    let csvDataDailyPnl = [["NAME", "MOBILE", "EMAIL", "SIGNUP METHOD", "JOINING DATE", "APPLIED ON", "PRODUCT TYPE", "PRODUCT", "PRICE", "DISCOUNT", "EFFECTIVE PRICE"]]
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem) => {

        return [
          `${elem?.user?.first_name} ${elem?.user?.last_name}`,
          elem?.user?.mobile,
          elem?.user?.email,
          elem?.user?.creationProcess,
          Moment(elem?.user?.joining_date).format('DD-MM-YY HH:MM:ss a').toString(),
          Moment(elem?.appliedOn).format('DD-MM-YY HH:MM:ss a').toString(),
          elem?.product?.productName,
          elem?.specificProductDetail?.name,
          elem?.specificProductDetail?.price,
          elem?.specificProductDetail?.discountAmount?.toFixed(2),
          elem?.specificProductDetail?.effectivePrice?.toFixed(2),
        ]
      })
    }

    return [[...csvDataDailyPnl, ...csvDataFile]]
  }

  const pnlData = downloadHelper(couponData?.usedBySuccessful)


  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        {/* <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Successful Coupon Purchases({couponData?.usedBySuccessful?.length})
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} gutterBottom >
            <Tooltip title="Download CSV"><MDBox sx={{ backgroundColor: "lightgrey", borderRadius: "2px", cursor: "pointer", marginRight: "5px" }} onClick={() => { handleDownload(pnlData, `couponPurchases-${couponData?.code}`) }}><DownloadIcon /></MDBox></Tooltip>
          </MDTypography>
        </MDBox> */}
        <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
        <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
          Successful Coupon Purchases({couponData?.usedBySuccessful?.length})
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} gutterBottom >
            <Tooltip title="Download CSV"><MDBox sx={{ backgroundColor: "lightgrey", borderRadius: "2px", cursor: "pointer", marginRight: "5px" }} onClick={() => { handleDownload(pnlData, `couponPurchases-${couponData?.code}`) }}><DownloadIcon /></MDBox></Tooltip>
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

