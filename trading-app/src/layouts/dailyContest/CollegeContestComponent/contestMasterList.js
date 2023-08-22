import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";
// import moment from 'moment';


export default function ContestMasterList({saving,dailyContest, action, updatedDocument}) {
    // const [open, setOpen] = useState(false);
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [contestMasters,setContestMaster] = React.useState([]);
    // let [update,setUpdate] = React.useState(true);
    const [contestMasterCount,setContestMasterCount] = useState(0);
    async function getAllowedUsers() {
      let call1 = axios.get(`${baseUrl}api/v1/dailycontest/contest/${dailyContest?._id}/contestMasters`, {
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
          setContestMaster(api1Response.data.data)
          setContestMasterCount(api1Response.data?.length);
        })
        .catch((error) => {
          // Handle errors here
          console.error(error);
        });
    }

    useEffect(()=>{
      getAllowedUsers();
    },[saving, updatedDocument])

    console.log("dailyContest", dailyContest)

    let columns = [
        { Header: "Name", accessor: "name", align: "center" },
        { Header: "Mobile No.", accessor: "mobile", align: "center" },
        { Header: "College", accessor: "college", align: "center" },
        { Header: "Invite Code", accessor: "inviteCode", align: "center" },
    ]

let rows = []

    // async function removeUser(   ){
    //   axios.put(`${baseUrl}api/v1/dailycontest/contest/${dailyContest._id}/remove/${+/{}}`, {
    //     withCredentials: true,
    //     headers: {
    //         Accept: "application/json",
//         "Content-t   {}y/+/y]tType": "application/json",
    //         "Access-Control-Allow-Credentials": true
    //     },
    //   })
    //   .then((res)=>{
    //     //console.log("instrumentData", res.data)
    //     // setUser(res.data)
    //     // dispatch({ type: 'setUser', payload: (res?.data?.data) });
    //     setUpdate(!update);
  
    //   }).catch((err)=>{
    //     //console.log(err);
    //   })
    // }

    contestMasters?.map((elem, index) => {
    let featureObj = {}

    featureObj.name = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.first_name} {elem?.last_name}
      </MDTypography>
    );
    featureObj.mobile = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.mobile}
      </MDTypography>
    );
    featureObj.college = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.collegeName}
      </MDTypography>
    );

    featureObj.inviteCode = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.inviteCode}
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
            Contest Masters({contestMasterCount})
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

