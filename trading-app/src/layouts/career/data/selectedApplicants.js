import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";
import AddApplicantModal from '../AddApplicantModal';
import { saveAs } from 'file-saver';
import { Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import moment from 'moment';


export default function Applicants({career, action, setAction}) {
    console.log("Career", career);
    const [open, setOpen] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState();
    const [selectedApplicantName, setSelectedApplicantName]=useState();
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [careerApplications,setCareerApplications] = React.useState([]);
    const [applicationCount,setApplicationCount] = useState(0);
    const handleClose = () => {
      setOpen(false);
      setSelectedApplicant('');
      setSelectedApplicantName('');
    };
    const handleOpen = (applicant, name) => {
      setSelectedApplicant(applicant);
      setSelectedApplicantName(name);
      setOpen(true);
    };
    async function getCareerApplications(){
        let call1 = axios.get(`${baseUrl}api/v1/career/careerapplications/selected/${career}`,{
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
            setCareerApplications(api1Response.data.data)
            setApplicationCount(api1Response.data.count);
            })
            .catch((error) => {
            // Handle errors here
            console.error(error);
            });
    }

    useEffect(()=>{
        getCareerApplications();
    },[open, action])

    let columns = [
        // { Header: "Action", accessor: "action", align: "center" },
        { Header: "Full Name", accessor: "fullname", align: "center" },
        { Header: "Date of Birth", accessor: "dob", align: "center" },
        { Header: "Email", accessor: "email", align: "center" },
        { Header: "Mobile", accessor: "mobile", align: "center" },
        { Header: "College", accessor: "college", align: "center" },
        { Header: "Trading Exp.", accessor: "tradingexp", align: "center" },
        { Header: "Source", accessor: "source", align: "center" },
        { Header: "Status", accessor: "status", align: "center" },
        { Header: "Applied On", accessor: "appliedon", align: "center" },   
      ]

    let rows = []

  careerApplications?.map((elem, index)=>{
  let featureObj = {}
//   featureObj.action = (
//     <MDButton component="a" variant="outlined" color="text" fontWeight="medium"  disabled={elem?.applicationStatus != 'Applied'} onClick={()=>{handleOpen(elem._id, `${elem.first_name} ${elem.last_name}`)}}>
//       Assign GD
//     </MDButton>
//   );
  featureObj.fullname = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.first_name} {elem?.last_name}
    </MDTypography>
  );
  featureObj.dob = (
    <MDButton component="a" variant="caption" color="text" fontWeight="medium">
      {new Date(elem?.dob).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
    </MDButton>
  );
  featureObj.email = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.email}
    </MDTypography>
  );
  featureObj.mobile = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.mobileNo}
    </MDTypography>
  );
  featureObj.college = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.collegeName}
    </MDTypography>
  );
  featureObj.tradingexp = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.priorTradingExperience}
    </MDTypography>
  );
  featureObj.source = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.source}
    </MDTypography>
  );
  featureObj.status = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.applicationStatus}
    </MDTypography>
  );
  featureObj.appliedon = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {new Date(elem?.appliedOn).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} {(new Date(elem?.appliedOn).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata',hour12: true, timeStyle: 'medium' }).toUpperCase())}
    </MDTypography>
  );

  

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
  let csvDataDailyPnl = [["NAME", "DOB", "EMAIL","MOBILE", "IN ACTIVE BATCH", "COMPLETED", "PRIOR EXP", "SOURCE", "STATUS", "LINKEDIN", "APPLIED ON", "COLLEGE NAME"]]

  if (data) {
    // dates = Object.keys(data)
    let csvpnlData = Object.values(data)
    csvDataFile = csvpnlData?.map((elem) => {

      return [
        `${elem?.first_name} ${elem?.last_name}`,
        moment(elem?.dob).format('DD-MM-YY HH:mm:ss a'),
        elem?.email,
        elem?.mobileNo,
        elem?.inActiveBatch,
        elem?.completed,
        elem?.priorTradingExperience,
        elem?.source,
        elem?.applicationStatus,
        elem?.linkedInProfileLink,
        moment(elem?.appliedOn).format('DD-MM-YY HH:mm:ss a'),
        elem?.collegeName,
      ]
    })
  }

  return [[...csvDataDailyPnl, ...csvDataFile]]
}

const pnlData = downloadHelper(careerApplications)


  return (
    <Card>
      {/* <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Shortlisted Applications({applicationCount})
          </MDTypography>
        </MDBox>
      </MDBox> */}
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "lightgrey", borderRadius: "2px" }}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Shortlisted Applications({applicationCount})
          </MDTypography>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} gutterBottom >
            <Tooltip title="Download CSV"><MDBox sx={{ backgroundColor: "lightgrey", borderRadius: "2px", cursor: "pointer", marginRight: "5px" }} onClick={() => { handleDownload(pnlData, `selected-applicants`) }}><DownloadIcon /></MDBox></Tooltip>
          </MDTypography>
        </MDBox>
      </MDBox>

      <MDBox mt={1}>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          // noEndBorder
          entriesPerPage={true}
        />
      </MDBox>
      <AddApplicantModal open={open} handleClose={handleClose} applicant={selectedApplicant} applicantName={selectedApplicantName} career = {career}/>
    </Card>
  );
}

