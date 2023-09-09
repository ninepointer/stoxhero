import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";


export default function GroupDiscussions({saving,template, action, setAction, prizePool}) {
    console.log("Template", template)
    const [open, setOpen] = useState(false);
  
 
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [rankingPayout,setRankingPayout] = React.useState([]);
    const [rankingPayoutCount,setRankingPayoutCount] = useState(0);
    async function getRankingPayout(){
        let call1 = axios.get(`${baseUrl}api/v1/battletemplates/${template?._id}`,{
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
            setRankingPayout(api1Response?.data?.data?.rankingPayout)
            setRankingPayoutCount(api1Response?.data?.data?.rankingPayout?.count);
            })
            .catch((error) => {
            // Handle errors here
            console.error(error);
            });
    }

    useEffect(()=>{
      getRankingPayout();
    },[saving, open])

    let columns = [
        { Header: "#", accessor: "index", align: "center" },
        { Header: "Rank", accessor: "rank", align: "center" },
        { Header: "Reward Percentage", accessor: "percentage", align: "center" },
        { Header: "Reward Amount", accessor: "amount", align: "center" },
      ]

    let rows = []

  rankingPayout?.map((elem, index)=>{
  let featureObj = {}
 
  featureObj.index = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {index+1}
    </MDTypography>
  );
  featureObj.rank = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.rank}
    </MDTypography>
  );
  featureObj.percentage = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.rewardPercentage}%
    </MDTypography>
  );
  featureObj.amount = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      ₹{((elem?.rewardPercentage*prizePool)/100).toFixed(0)}
    </MDTypography>
  );

  rows.push(featureObj)
})
console.log(rankingPayout)
  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Ranking Payout({rankingPayoutCount})
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
    </Card>
  );
}

