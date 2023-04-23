import * as React from 'react';
import {useState} from "react";
import axios from "axios";
import DataTable from "../../../examples/Tables/DataTable";
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";

import ContestParticipantsData from './contestParticipantsData'

export default function ContestParticipants({contestData,setContestData,isSubmitted,setIsSubmitted}) {

// console.log("Rule Data rending...")
console.log("Contest Data",contestData)
console.log("Participants Data",contestData?.participants)
const { columns, rows } = ContestParticipantsData();

contestData?.participants?.map((elem)=>{
  let participants = {}

  participants.name = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.userId?.first_name}
    </MDTypography>
  );
  participants.portfolio = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.portfolioId?.portfolioName}
    </MDTypography>
  );
  participants.status = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.status}
    </MDTypography>
  );
  
  rows.push(participants)
})

    console.log(rows)

// console.log("Participants Data: ",rows)
// console.log("Rule Rows: ",rows)

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Contest Participants will show up here!
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox mt={1}>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  

  );
}

