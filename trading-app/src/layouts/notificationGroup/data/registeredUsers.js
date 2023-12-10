import * as React from 'react';
import {useState, useEffect, useRef} from 'react';
import DataTable from "../../../examples/Tables/DataTable";
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import moment from 'moment';
import {apiUrl} from "../../../constants/constants";
import axios from 'axios';

export default function RegisteredUsers({ notification, action }) {
  const [userData, setUserData] = useState([]);
  const isInitialMount = useRef(true);
  console.log('notificationId', notification?._id);
  let getNotificationGroup = async()=>{
    const res = await axios.get(`${apiUrl}notificationgroup/${notification?._id}`, {withCredentials:true});
    setUserData(res?.data?.data?.users);
  }
  let refreshUsers = async()=>{
    const res = await axios.patch(`${apiUrl}notificationgroup/refresh/${notification?._id}`,{}, {withCredentials:true});
    await getNotificationGroup();
  }
  useEffect(()=>{
    getNotificationGroup();
  },[]);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      refreshUsers();
    }
  }, [action]);
  let columns = [
    { Header: "#", accessor: "index", align: "center" },
    { Header: "Name", accessor: "fullname", align: "center" },
    { Header: "Mobile", accessor: "mobile", align: "center" },
    { Header: "Joining Date", accessor: "joiningDate", align: "center" },
    { Header: "Campaign Code", accessor: "campaignCode", align: "center" },
  ]

  let rows = [];

  userData?.map((elem, index) => {

    let featureObj = {}
    featureObj.index = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {index + 1}
      </MDTypography>
    );

    featureObj.fullname = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.first_name} {elem?.last_name}
      </MDTypography>
    );

    featureObj.mobile = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.mobile}
      </MDTypography>
    );
    featureObj.joiningDate = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {moment(elem?.joining_date).format('DD-MM-YY HH:MM a')}
      </MDTypography>
    );
    featureObj.campaignCode = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.campaignCode}
      </MDTypography>
    );
    rows.push(featureObj)
  })

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Users({userData?.length})
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