import * as React from 'react';
import {useEffect, useState} from "react";
import DataTable from "../../../examples/Tables/DataTable";
import MDButton from "../../../components/MDButton"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";
import axios from "axios";
import {AiFillEdit} from 'react-icons/ai'


export default function GroupDiscussions({saving,template, action, setAction, prizePool, childFormState, setChildFormState, rankingPayoutMode, setRankingPayoutMode, rankingPayout, setRankingPayout}) {
    console.log("Template", template)
    const [open, setOpen] = useState(false);
  
 
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
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
    },[saving, action])

    let totalCollection = template?.entryFee*template?.minParticipants;
    let gst = ((template?.entryFee*template?.minParticipants)*template?.gstPercentage)/100;
    let collectionAfterTax = (totalCollection)-(gst)
    let platfromFee = ((collectionAfterTax*template?.platformCommissionPercentage)/100);
    let expectedPrizePool = (collectionAfterTax) - platfromFee;
    let totalNumberOfWinners = ((template?.minParticipants*template?.winnerPercentage)/100).toFixed(0);
    console.log('ranking payout', rankingPayout);
    let columns = [
        { Header: "Edit", accessor: "edit", align: "center" },
        { Header: "Rank", accessor: "rank", align: "center" },
        { Header: "Reward Percentage", accessor: "percentage", align: "center" },
        { Header: "Reward Amount", accessor: "amount", align: "center" },
      ]

    let rows = []
  
  const stageRankingPayout = async (elem) => {
    setChildFormState({
      _id: elem?._id,
      rank:elem?.rank,
      rewardPercentage:elem?.rewardPercentage
    });
    setRankingPayoutMode('edit');
  }  
  rankingPayout?.map((elem, index)=>{
  let featureObj = {}
 
  featureObj.edit = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {<MDButton onClick={() => stageRankingPayout(elem)}>
        <AiFillEdit/>
        </MDButton>}
    </MDTypography>
  );
  featureObj.rank = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {elem?.rank}
    </MDTypography>
  );
  featureObj.percentage = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      {parseInt(elem?.rewardPercentage)?.toFixed(2)}%
    </MDTypography>
  );
  featureObj.amount = (
    <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
      ₹{new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(((elem?.rewardPercentage*prizePool)/100))}
    </MDTypography>
  );

  rows.push(featureObj)
})

let remainingObj = {}
  let remainingWinners = (((template?.minParticipants*template?.winnerPercentage)/100)-template?.rankingPayout?.length) 
  let prizePoolToppersPercentage = template?.rankingPayout.reduce((total, currentItem) => {
    return total + currentItem.rewardPercentage;
  }, 0)
  let remainingPrizePoolPercentage = 100-prizePoolToppersPercentage
  let remainingPrizePool = (expectedPrizePool*remainingPrizePoolPercentage)/100
  console.log("Remaining Winners:",remainingWinners);
    remainingObj.rank = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {template?.rankingPayout?.length+1 + "-" + ((template?.minParticipants*template?.winnerPercentage)/100).toFixed(0)}
      </MDTypography>
    );
    remainingObj.percentage = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {((100-(template?.rankingPayout.reduce((total, currentItem) => {
                    return total + currentItem.rewardPercentage;
                  }, 0)))/remainingWinners).toFixed(2)}%
      </MDTypography>
    );
    remainingObj.amount = (
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

