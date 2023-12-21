import * as React from 'react';
import { useEffect, useState } from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";
import { apiUrl } from '../../../constants/constants';
import { Switch } from '@mui/material';


export default function RegisteredUsers({ dailyContest }) {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  let [updateSwitch, setUpdateSwitch] = React.useState(true);
  // const [dailyContest,setDailyContest] = useState([]);
  const [userContestDetail, setUserContestDetails] = useState([]);

  let columns = [
    { Header: "#", accessor: "index", align: "center" },
    // { Header: "Remove", accessor: "remove", align: "center" },
    { Header: "Name", accessor: "fullname", align: "center" },
    { Header: "Email", accessor: "email", align: "center" },
    { Header: "Mobile", accessor: "mobile", align: "center" },
    { Header: "Total TestZone", accessor: "totalContest", width: "12.5%", align: "center" },
    { Header: "Paid TestZone", accessor: "paidContest", width: "12.5%", align: "center" },
    { Header: "Free TestZone", accessor: "freeContest", width: "12.5%", align: "center" },
    { Header: "Trading Day", accessor: "tradingDay", width: "12.5%", align: "center" },

    { Header: "Mock/Live", accessor: "mockLive", width: "12.5%", align: "center" },

  ]

  useEffect(() => {
    axios.get(`${baseUrl}api/v1/dailycontest/usercontestdata/${dailyContest?._id}`, { withCredentials: true })
      .then((res) => {
        setUserContestDetails(res.data.data);
      }).catch((err) => {
        return new Error(err);
      })
  }, [])

  let rows = []

  async function switchUser(userId, isLive) {
    const res = await fetch(`${baseUrl}api/v1/dailycontest/switchUser/${dailyContest?._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        userId, isLive
      })
    });
    const data = await res.json();
    console.log(data);
    if (data.status === 422 || data.error || !data) {

    } else {
      setUpdateSwitch(!updateSwitch)
    }
  }

  dailyContest?.participants?.map((elem, index) => {

    const userContestInfo = userContestDetail.filter((subelem) => {
      return elem?.userId._id?.toString() === subelem?.userId?.toString();
    })

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

    featureObj.totalContest = (
      <MDTypography component="a" variant="caption" fontWeight="medium">
        {userContestInfo[0]?.totalContestsCount}
      </MDTypography>
    );

    featureObj.paidContest = (
      <MDTypography component="a" variant="caption" fontWeight="medium">
        {userContestInfo[0]?.totalPaidContests}
      </MDTypography>
    );

    featureObj.freeContest = (
      <MDTypography component="a" variant="caption" fontWeight="medium">
        {userContestInfo[0]?.totalFreeContests}
      </MDTypography>
    );

    featureObj.tradingDay = (
      <MDTypography component="a" variant="caption" fontWeight="medium">
        {userContestInfo[0]?.totalTradingDays}
      </MDTypography>
    );

    featureObj.mockLive = (
      <MDTypography component="a" variant="caption" fontWeight="medium">
        <Switch checked={elem.isLive} onChange={() => { switchUser(elem?.userId?._id, elem?.isLive) }} />
      </MDTypography>
    );

    rows.push(featureObj)
  })

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Participated Users({dailyContest?.participants?.length})
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

