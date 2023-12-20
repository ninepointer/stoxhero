import React from 'react'
import {useState, useEffect} from "react"
import axios from "axios";
// import { userContext } from "../../../AuthContext";
import MDBox from "../../../components/MDBox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "../../../components/MDTypography";
import DataTable from "../../../examples/Tables/DataTable";
import {apiUrl} from "../../../constants/constants"

function ReferralProduct() {
  const [data,setData] = useState([]);

  useEffect(()=>{

    axios.get(`${apiUrl}referrals/referredproduct`,{withCredentials:true})
    .then((res)=>{
        setData(res?.data?.data);
    }).catch((err)=>{
        return new Error(err);
    });
  },[]);

  let referralColumns = [
        { Header: "#", accessor: "serialno",align: "center" },
        { Header: "Full Name", accessor: "fullName",align: "center" },
        { Header: "Product", accessor: "product", align: "center"},
        { Header: "# of Product Referred", accessor: "referredProduct", align: "center"},
        { Header: "Earnings", accessor: "earnings", align: "center"},
  ];

  let referralRows = [];

  data?.map((elem,index)=>{
    let joinedRowData = {}

    joinedRowData.serialno = (
        <MDTypography variant="Contained" color = 'dark' fontWeight="small">
            {index+1}
        </MDTypography>
    );
    joinedRowData.fullName = (
        <MDTypography variant="Contained" color = 'dark' fontWeight="small">
            {elem?.buyer_name}
        </MDTypography>
    );
    joinedRowData.product = (
        <MDTypography variant="Contained" color = 'dark' fontWeight="small">
            {elem?.product}
        </MDTypography>
    );
    joinedRowData.referredProduct = (
        <MDTypography variant="Contained" color = 'dark' fontWeight="small">
            {elem?.productReferred}
        </MDTypography>
    );
    joinedRowData.earnings = (
        <MDTypography variant="Contained" color = 'dark' fontWeight="small">
            { "₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(elem?.payout))}
        </MDTypography>
    );

    referralRows.push(joinedRowData);
  })


  return (
    <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
            <Grid item xs={12} md={12} lg={12}>
                <Card>
                    <MDBox
                        mx={2}
                        mt={-3}
                        py={1}
                        px={2}
                        variant="gradient"
                        bgColor="dark"
                        borderRadius="lg"
                        coloredShadow="dark"
                        sx={{
                            display: 'flex',
                            justifyContent: "space-between",
                        }}>
                        <MDTypography variant="h6" color="white" py={1}>
                            Your friends whome you refer product
                        </MDTypography>
                    </MDBox>
                    <MDBox pt={2}>
                        <DataTable
                            table={{ columns : referralColumns, rows : referralRows }}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                        />
                    </MDBox>
                </Card>
            </Grid>
        </Grid>
    </MDBox>
  );
}

export default ReferralProduct;
