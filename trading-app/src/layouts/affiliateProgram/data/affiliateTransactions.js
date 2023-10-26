import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import { apiUrl } from '../../../constants/constants';
import moment from 'moment';


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
  })

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Affiliate Transactions({newData?.length ? newData?.length : 0})
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

