import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";


export default function AllowedUsers({battle,expectedPrizePool}) {
    console.log("Battle in Exp. Ranking System:",battle)
    let columns = [
        { Header: "Rank", accessor: "rank", align: "center" },
        { Header: "Reward Percentage", accessor: "rewardpercentage", align: "center" },
        { Header: "Reward", accessor: "reward", align: "center" },
      ]

    let rows = []


    battle?.battleTemplate?.rankingPayout?.map((elem, index) => {
    let featureObj = {}

    featureObj.rank = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem?.rank}
      </MDTypography>
    );
    featureObj.rewardpercentage = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {(elem?.rewardPercentage).toFixed(2)}%
      </MDTypography>
    );
    featureObj.reward = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format((elem?.rewardPercentage*expectedPrizePool)/100)}
      </MDTypography>
    );

    rows.push(featureObj)
  })

  let remainingObj = {}
  let remainingWinners = (((battle?.battleTemplate?.minParticipants*battle?.battleTemplate?.winnerPercentage)/100)-battle?.battleTemplate?.rankingPayout?.length) 
  let prizePoolToppersPercentage = battle?.battleTemplate?.rankingPayout.reduce((total, currentItem) => {
    return total + currentItem.rewardPercentage;
  }, 0)
  let remainingPrizePoolPercentage = 100-prizePoolToppersPercentage
  let remainingPrizePool = (expectedPrizePool*remainingPrizePoolPercentage)/100
  console.log("Remaining Winners:",remainingWinners);
    remainingObj.rank = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {battle?.battleTemplate?.rankingPayout?.length+1 + "-" + ((battle?.battleTemplate?.minParticipants*battle?.battleTemplate?.winnerPercentage)/100).toFixed(0)}
      </MDTypography>
    );
    remainingObj.rewardpercentage = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {((100-(battle?.battleTemplate?.rankingPayout.reduce((total, currentItem) => {
                    return total + currentItem.rewardPercentage;
                  }, 0)))/remainingWinners).toFixed(2)}%
      </MDTypography>
    );
    remainingObj.reward = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(remainingPrizePool/remainingWinners)}
      </MDTypography>
    );

    rows.push(remainingObj)

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="left">
        <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" sx={{backgroundColor:"lightgrey",borderRadius:"2px"}}>
          <MDTypography variant="text" fontSize={12} color="black" mt={0.7} alignItems="center" gutterBottom>
            Reward System({battle?.battleTemplate?.rankingPayout?.length})
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

