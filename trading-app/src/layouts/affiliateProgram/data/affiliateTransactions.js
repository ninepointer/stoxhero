import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import { apiUrl } from '../../../constants/constants';
import moment from 'moment';
import { saveAs } from 'file-saver';
import { Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';



export default function AffiliateGrid({data}) {
    console.log(data)
    const [newData, setNewData] = useState([]);

    useEffect(()=>{
        getAffiliateTransactions(data);
    }, [data])


    let columns = [
        { Header: "#", accessor: "index", align: "center" },
        { Header: "Affiliate Name", accessor: "name", align: "center" },
        { Header: "Mobile No.", accessor: "mobile", align: "center" },
        { Header: "Affiliate Code", accessor: "code", align: "center" },
        { Header: "Buyer", accessor: "buyer", align: "center" },
        { Header: "Buyer Mobile", accessor: "bmobile", align: "center" },
        { Header: "Bought At", accessor: "boughtat", align: "center" },
        { Header: "Product", accessor: "product", align: "center" },
        { Header: "Purchase Value", accessor: "purchasevalue", align: "center" },
        { Header: "Net PV", accessor: "netpurchasevalue", align: "center" },
        { Header: "Affiliate Comm", accessor: "commission", align: "center" },
      ]

    async function getAffiliateTransactions(elem){
        const res = await fetch(`${apiUrl}affiliate/transactions/${elem?._id}`, {
            method: "GET",
            credentials: "include",
            headers: {
              "content-type": "application/json",
              "Access-Control-Allow-Credentials": true
            }
          });
      
          const data = await res.json();
          const updatedData = data?.data
          if (updatedData || res.status === 200) {
              console.log('new data is', data?.data);
              setNewData(data.data)
          } else {
  
          }
    }

    let rows = []

    newData?.map((elem, index) => {
    let featureObj = {}

    featureObj.index = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {index+1}
      </MDTypography>
    );

    featureObj.name = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.affiliate?.first_name} {elem?.affiliate?.last_name}
      </MDTypography>
    );

    featureObj.mobile = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.affiliate?.mobile}
      </MDTypography>
    );

    featureObj.code = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.affiliate?.myReferralCode}
      </MDTypography>
    );

    featureObj.buyer = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.buyer?.first_name} {elem?.buyer?.last_name}
      </MDTypography>
    );

    featureObj.bmobile = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem?.buyer?.mobile}
        </MDTypography>
    );

    featureObj.boughtat = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {moment(elem?.transactionDate).format('DD-MM-YY HH:mm:ss a')}
      </MDTypography>
    );

    featureObj.product = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.product?.productName}
      </MDTypography>
    );

    featureObj.purchasevalue = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.productActualPrice}
      </MDTypography>
    );

    featureObj.netpurchasevalue = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.productDiscountedPrice}
      </MDTypography>
    );

    featureObj.commission = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.affiliatePayout}
      </MDTypography>
    );

    rows.push(featureObj)
  });
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
    let csvDataDailyPnl = [["INDEX", "NAME", "MOBILE", "CODE", "BUYER", "BUYER MOBILE", "BOUGHT AT", "PRODUCT", "PURCHASE VALUE", "NET PURCHASE VALUE", "COMMISSION"]]
    if (data) {
      // dates = Object.keys(data)
      let csvpnlData = Object.values(data)
      csvDataFile = csvpnlData?.map((elem, index) => {

        return [
          index+1,
          `${elem?.affiliate?.first_name} ${elem?.affiliate?.last_name}`,
          elem?.affiliate?.mobile,
          elem?.affiliate?.myReferralCode,
          `${elem?.buyer?.first_name} ${elem?.buyer?.last_name}`,
          elem?.buyer?.mobile,
          moment(elem?.transactionDate).format('DD-MM-YY HH:mm:ss a'),
          elem?.product?.productName,
          elem?.productActualPrice,
          elem?.productDiscountedPrice,
          elem?.affiliatePayout,
        ]
      })
    }

    return [[...csvDataDailyPnl, ...csvDataFile]]
  }

  const pnlData = downloadHelper(newData);


  return (
    <Card>
      {/* <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Affiliate Transactions({newData?.length ? newData?.length : 0})
          </MDTypography>
        </MDBox>
      </MDBox> */}
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
          Affiliate Transactions({newData?.length ? newData?.length : 0})
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} gutterBottom >
            <Tooltip title="Download CSV"><MDBox sx={{ backgroundColor: "lightgrey", borderRadius: "2px", cursor: "pointer", marginRight: "5px" }} onClick={() => { handleDownload(pnlData, `affiliate-transactions`) }}><DownloadIcon /></MDBox></Tooltip>
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

