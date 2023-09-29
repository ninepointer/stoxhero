import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";


export default function SubscriptionTutorialVideoView({tenXSubscription, tutorialVideoViewCount, setTutorialVideoViewCount}) {
    console.log("Subscription", tenXSubscription)
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [tenXSubsTutorialView,setTenXSubsTutorialView] = React.useState([]);
    async function getSubscriptionTutorialViews(){
        let call1 = axios.get(`${baseUrl}api/v1/tenx/tutorialvideoview/${tenXSubscription}`,{
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
              },
            })
            Promise.all([call1])
            .then(([api1Response]) => {
            // Process the responses here
            console.log(api1Response.data.data);
            setTenXSubsTutorialView(api1Response.data.data)
            setTutorialVideoViewCount(api1Response.data.count);
            })
            .catch((error) => {
            // Handle errors here
            console.error(error);
            });
    }

    useEffect(()=>{
      getSubscriptionTutorialViews();
    },[])

    let columns = [
        { Header: "#", accessor: "index", align: "center" },
        { Header: "Full Name", accessor: "fullname", align: "center" },
        { Header: "Email", accessor: "email", align: "center" },
        { Header: "Mobile", accessor: "mobile", align: "center" },
        { Header: "Viewed On", accessor: "clickedon", align: "center" },
        { Header: "Signup Method", accessor: "creationprocess", align: "center" },
      ]

    let rows = []

  tenXSubsTutorialView?.map((elem, index)=>{
  let featureObj = {}
  featureObj.index = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {index+1}
    </MDTypography>
  );
  featureObj.fullname = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.tutorialViewedBy?.first_name} {elem?.tutorialViewedBy?.last_name}
    </MDTypography>
  );
  featureObj.email = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.tutorialViewedBy?.email}
    </MDTypography>
  );
  featureObj.mobile = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.tutorialViewedBy?.mobile}
    </MDTypography>
  );
  featureObj.clickedon = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {new Date(elem?.clicked_On).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} {(new Date(elem?.clicked_On).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata',hour12: true, timeStyle: 'medium' }).toUpperCase())}
    </MDTypography>
  );
  featureObj.creationprocess = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.tutorialViewedBy?.creationProcess}
    </MDTypography>
  );

  

  rows.push(featureObj)
})

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Users who viewed TenX Tutorial Video({tutorialVideoViewCount})
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox mt={1}>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={true}
          isSorted={false}
          noEndBorder
          entriesPerPage={true}
        />
      </MDBox>
    </Card>
  );
}

