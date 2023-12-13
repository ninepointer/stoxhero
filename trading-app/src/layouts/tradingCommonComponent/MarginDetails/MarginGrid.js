import React from 'react'
import Grid from "@mui/material/Grid";
import {useState, useContext, useEffect, memo} from "react"
import axios from "axios";
import { NetPnlContext } from '../../../PnlContext';
import MDBox from '../../../components/MDBox';
import DefaultInfoCard from "../../../examples/Cards/InfoCards/DefaultInfoCard";

const MarginGrid = () => {
  const { netPnl, totalRunningLots, pnlData  } = useContext(NetPnlContext);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [fundDetail, setFundDetail] = useState({});

  const todayMargin = pnlData.reduce((total, acc) => {
    return total + acc.margin;
  }, 0);

  let amount = 0;
  let margin = 0;
  pnlData.map((elem) => {
    console.log(elem._id.isLimit)
    if(elem._id.isLimit){
      margin += elem.margin;
    } else{
      amount += (elem.amount - elem.brokerage)
    }
  });

  useEffect(() => {
    axios.get(`${baseUrl}api/v1/paperTrade/margin`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res) => {
        setFundDetail(res.data.data);
    }).catch((err) => {
        return new Error(err);
    })
  }, []);
  

  const portfolioName = fundDetail?.portfolioName
  const totalCreditString = fundDetail?.totalFund ? fundDetail?.totalFund >= 0 ? "+₹" + fundDetail?.totalFund?.toLocaleString() : "-₹" + ((-fundDetail?.totalFund)?.toLocaleString()): "+₹0"

  const runningPnl = Number(netPnl?.toFixed(0));
  const openingBalance = fundDetail?.openingBalance ? (fundDetail?.openingBalance)?.toFixed(0) : fundDetail?.totalFund;

  const availableMargin = ((runningPnl < 0) ? totalRunningLots===0 ? (openingBalance-todayMargin+runningPnl) : openingBalance-(Math.abs(amount)+margin) : openingBalance-todayMargin)?.toFixed(0);
  const availableMarginpnlstring = availableMargin >= 0 ? "₹" + Number(availableMargin)?.toLocaleString() : "₹0"

  const usedMargin = runningPnl >= 0 ? 0 : runningPnl
  const unrealisedPnl = runningPnl >= 0 ? runningPnl : 0
  const usedMarginString = usedMargin >= 0 ? "₹" + Number(usedMargin)?.toLocaleString() : "₹" + (-Number(usedMargin))?.toLocaleString()
  const unrealisedPnlString = unrealisedPnl >= 0 ? "₹" + Number(unrealisedPnl)?.toLocaleString() : "₹" + (-Number(unrealisedPnl))?.toLocaleString()
    
  return (
    <>
      <MDBox mt={0.5}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={16} lg={12}>
              <Grid container spacing={3}>

                <Grid item xs={16} >
                  <DefaultInfoCard
                    title={`Virtual Margin Details(${portfolioName})`}
                    description="Below is a summary of the total funds and their intended uses"
                    value={
                      <MDBox display='flex' justifyContent='space-between'>
                        <MDBox sx={{ backgroundColor: "#d3d3d3", borderRadius: "5px", padding: "10px", color: "#000000" }} fontSize='15px' >{`Virtual Margin Money: ${totalCreditString}`}</MDBox>
                        <MDBox sx={{ backgroundColor: "#d3d3d3", borderRadius: "5px", padding: "10px", color: "#000000" }} fontSize='15px' >{`Virtual Available Margin: ${availableMarginpnlstring}`}</MDBox>
                        <MDBox sx={{ backgroundColor: "#d3d3d3", borderRadius: "5px", padding: "10px", color: "#000000" }} fontSize='15px' >{`Virtual Used Margin: ${usedMarginString}`}</MDBox>
                        <MDBox sx={{ backgroundColor: "#d3d3d3", borderRadius: "5px", padding: "10px", color: "#000000" }} fontSize='15px' >{`Virtual Unrealised P&L: ${unrealisedPnlString}`}</MDBox>
                      </MDBox>}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </>
  )
}

export default memo(MarginGrid);