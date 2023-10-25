import React from 'react'
import Grid from "@mui/material/Grid";
import {useState, useContext, useEffect, memo} from "react"
import axios from "axios";
import { NetPnlContext } from '../../../PnlContext';
import MDBox from '../../../components/MDBox';
import DefaultInfoCard from "../../../examples/Cards/InfoCards/DefaultInfoCard";
import { renderContext } from '../../../renderContext';

const MarginGrid = () => {
  const { netPnl, totalRunningLots, pnlData  } = useContext(NetPnlContext);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [fundDetail, setFundDetail] = useState({});
  // const {render} = useContext(renderContext);

  const todayAmount = pnlData.reduce((total, acc) => {
    if (acc.lots !== 0) {
      return total + Math.abs(acc.amount);
    }
    return total; // return the accumulator if the condition is false
  }, 0);

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
  

  let portfolioName = fundDetail?.portfolioName


  let totalCreditString = fundDetail?.totalFund ? fundDetail?.totalFund >= 0 ? "+₹" + fundDetail?.totalFund?.toLocaleString() : "-₹" + ((-fundDetail?.totalFund)?.toLocaleString()): "+₹0"

  let runningPnl = Number(netPnl?.toFixed(0));
  let openingBalance = fundDetail?.openingBalance ? (fundDetail?.openingBalance)?.toFixed(0) : fundDetail?.totalFund;
  let availableMargin = openingBalance ? (totalRunningLots === 0 ? Number(openingBalance)+runningPnl : Number(openingBalance)-todayAmount) : fundDetail?.totalFund;
  availableMargin = runningPnl >= 0 ? (openingBalance ? openingBalance : fundDetail?.totalFund) : availableMargin;
  let availableMarginpnlstring = availableMargin >= 0 ? "₹" + Number(availableMargin)?.toLocaleString() : "₹0"

  let usedMargin = runningPnl >= 0 ? 0 : runningPnl
  let unrealisedPnl = runningPnl >= 0 ? runningPnl : 0
  let usedMarginString = usedMargin >= 0 ? "₹" + Number(usedMargin)?.toLocaleString() : "₹" + (-Number(usedMargin))?.toLocaleString()
  let unrealisedPnlString = unrealisedPnl >= 0 ? "₹" + Number(unrealisedPnl)?.toLocaleString() : "₹" + (-Number(unrealisedPnl))?.toLocaleString()
    
  return (
    <>
      <MDBox mt={0.5}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={16} lg={12}>
              <Grid container spacing={3}>

                <Grid item xs={16} >
                  <DefaultInfoCard
                    title={`Portfolio Details(${portfolioName})`}
                    description="Below is a summary of the total funds and their intended uses"
                    value={
                      <MDBox display='flex' justifyContent='space-between'>
                        <MDBox sx={{ backgroundColor: "#d3d3d3", borderRadius: "5px", padding: "10px", color: "#000000" }} fontSize='17px' >{`Portfolio Value: ${totalCreditString}`}</MDBox>
                        <MDBox sx={{ backgroundColor: "#d3d3d3", borderRadius: "5px", padding: "10px", color: "#000000" }} fontSize='17px' >{`Available Margin: ${availableMarginpnlstring}`}</MDBox>
                        <MDBox sx={{ backgroundColor: "#d3d3d3", borderRadius: "5px", padding: "10px", color: "#000000" }} fontSize='17px' >{`Used Margin: ${usedMarginString}`}</MDBox>
                        <MDBox sx={{ backgroundColor: "#d3d3d3", borderRadius: "5px", padding: "10px", color: "#000000" }} fontSize='17px' >{`UnRealised P&L: ${unrealisedPnlString}`}</MDBox>
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