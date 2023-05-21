import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";
import moment from 'moment';
import ParticipantsModal from './participantsModal';


export default function GroupDiscussions({saving,batch, action, setAction}) {
    console.log("Batch", batch)
    const [open, setOpen] = useState(false);
    const[selectedGd, setSelectedGd] = useState();
    const handleClose = () => {
      setOpen(false);
    };
    const handleOpen = (gd) => {
      setSelectedGd(gd);
      setOpen(true);
    };
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [groupDiscussions,setGroupDiscussions] = React.useState([]);
    const [gdCount,setGDCount] = useState(0);
    async function getGroupDiscussions(){
        let call1 = axios.get(`${baseUrl}api/v1/gd/batch/${batch?._id}`,{
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
            setGroupDiscussions(api1Response.data.data)
            setGDCount(api1Response.data.count);
            })
            .catch((error) => {
            // Handle errors here
            console.error(error);
            });
    }

    useEffect(()=>{
        getGroupDiscussions();
    },[saving])

    let columns = [
        { Header: "View Candidates", accessor: "candidates", align: "center" },
        { Header: "# of Candidates", accessor: "noofcandidates", align: "center" },
        { Header: "Title", accessor: "title", align: "center" },
        { Header: "Start Time", accessor: "stime", align: "center" },
        { Header: "End Time", accessor: "etime", align: "center" },
        { Header: "Meet Link", accessor: "meetlink", align: "center" },
        { Header: "Topic", accessor: "topic", align: "center" },
      ]

    let rows = []

  groupDiscussions?.map((elem, index)=>{
  let featureObj = {}
  featureObj.candidates = (
    <MDButton component="a" variant="outlined" color="text" fontWeight="medium" onClick={()=>{handleOpen(elem._id)}}>
      View Participants
    </MDButton>
  ); 
  featureObj.noofcandidates = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem.participants.length}
    </MDTypography>
  );
  featureObj.title = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.gdTitle}
    </MDTypography>
  );
  featureObj.stime = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {moment.utc(elem?.gdStartDate).utcOffset('+05:30').format('DD-MMM-YY HH:mm a')}
    </MDTypography>
  );
  featureObj.etime = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {moment.utc(elem?.gdEndDate).utcOffset('+05:30').format('DD-MMM-YY HH:mm a')}
    </MDTypography>
  );
  featureObj.meetlink = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.meetLink}
    </MDTypography>
  );
  featureObj.topic = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.gdTopic}
    </MDTypography>
  );

  rows.push(featureObj)
})
console.log(groupDiscussions)
  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Group Discussions({gdCount})
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox mt={1}>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          // noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
      <ParticipantsModal open={open} handleClose={handleClose} gd={selectedGd} action={action} setAction={setAction}/>
    </Card>
  );
}

