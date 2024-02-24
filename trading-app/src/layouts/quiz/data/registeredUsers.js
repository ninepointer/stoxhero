import React, { useEffect, useState } from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import Card from "@mui/material/Card";
import moment from 'moment';

export default function RegisteredUsers({ data }) {
  const [sortedData, setSortedData] = useState([]);
  useEffect(() => {
    // Sort the data array based on registeredOn property
    const newData = [...data].sort((a, b) => moment(b.registeredOn).valueOf() - moment(a.registeredOn).valueOf());
    setSortedData(newData);
  }, [data]);

  let columns = [
    { Header: "#", accessor: "index", align: "center" },
    { Header: "Student Name", accessor: "fullname", align: "center" },
    { Header: "Mobile No.", accessor: "mobile", align: "center" },
    { Header: "School", accessor: "school", align: "center" },
    { Header: "City", accessor: "city", align: "center" },
    { Header: "Grade/Class", accessor: "grade", align: "center" },
    { Header: "Registration Time", accessor: "time", align: "center" },
  ];

  // Generate rows inside the useEffect hook after sortedData is updated
  const rows = sortedData.map((elem, index) => ({
    index: <MDTypography key={`index-${index}`} component="a" variant="caption" color="text" fontWeight="medium">{index + 1}</MDTypography>,
    fullname: <MDTypography key={`fullname-${index}`} component="a" variant="caption" color="text" fontWeight="medium">{elem?.userId?.student_name}</MDTypography>,
    mobile: <MDTypography key={`mobile-${index}`} component="a" variant="caption" color="text" fontWeight="medium">{elem?.userId?.mobile}</MDTypography>,
    school: <MDTypography key={`school-${index}`} component="a" variant="caption" fontWeight="medium">{elem?.userId?.schoolDetails?.school?.school_name}</MDTypography>,
    city: <MDTypography key={`city-${index}`} component="a" variant="caption" fontWeight="medium">{elem?.userId?.schoolDetails?.city?.name}</MDTypography>,
    grade: <MDTypography key={`grade-${index}`} component="a" variant="caption" fontWeight="medium">{elem?.userId?.schoolDetails?.grade?.grade}</MDTypography>,
    time: <MDTypography key={`time-${index}`} component="a" variant="caption" fontWeight="medium">{moment.utc(elem?.registeredOn).utcOffset('+05:30').format('DD-MMM-YY HH:mm a')}</MDTypography>
  }));

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Registrations({sortedData?.length})
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
