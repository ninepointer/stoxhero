import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import { apiUrl } from '../../../constants/constants';


export default function AffiliateGrid({data}) {

    const [newData, setNewData] = useState(data);

    useEffect(()=>{
        setNewData(data)
    }, [data])


    let columns = [
        { Header: "Action", accessor: "remove", align: "center" },
        { Header: "Name", accessor: "name", align: "center" },
        { Header: "Mobile No.", accessor: "mobile", align: "center" },
        { Header: "Email", accessor: "email", align: "center" },
        { Header: "SignUp Method", accessor: "signupMethod", align: "center" },
        { Header: "Affiliate Code", accessor: "code", align: "center" },
      ]

    async function removeAffiliateUser(elem){
        const res = await fetch(`${apiUrl}affiliate/remove/${newData?._id}/${elem?.userId?._id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
              "content-type": "application/json",
              "Access-Control-Allow-Credentials": true
            }
          });
      
          const data = await res.json();
          const updatedData = data?.data
          if (updatedData || res.status === 200) {
            setNewData(data.data)
          } else {
  
          }
    }

    let rows = []

    newData?.affiliates?.map((elem, index) => {
    let featureObj = {}

    featureObj.remove = (
      <MDButton size='small' variant='contained' onClick={()=>{removeAffiliateUser(elem)}}>
        Remove
      </MDButton>
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

    featureObj.code = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {elem?.userId?.myReferralCode}
        </MDTypography>
      );

    rows.push(featureObj)
  })

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Affiliates({data?.affiliates?.length})
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

