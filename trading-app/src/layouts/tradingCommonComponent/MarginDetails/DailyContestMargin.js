import React from 'react'
import Grid from "@mui/material/Grid";
import {useState, useContext, useEffect, memo} from "react"
import axios from "axios";
import { NetPnlContext } from '../../../PnlContext';
import MDBox from '../../../components/MDBox';
import DefaultInfoCard from "../../../examples/Cards/InfoCards/DefaultInfoCard";
import { renderContext } from '../../../renderContext';

const InternShipMargin = ({contestId, setyesterdayData}) => {
  const { netPnl, totalRunningLots, pnlData } = useContext(NetPnlContext);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [fundDetail, setFundDetail] = useState({});
  // const [yesterdayData, setyesterdayData] = useState({});
  const {render} = useContext(renderContext);

 

  const todayAmount = pnlData.reduce((total, acc) => {
    if (acc.lots !== 0) {
      return total + Math.abs(acc.amount);
    }
    return total; // return the accumulator if the condition is false
  }, 0);

  // console.log("margin", todayAmount)

  useEffect(() => {
    axios.get(`${baseUrl}api/v1/dailycontest/trade/${contestId}/myPnlandCreditData`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      }}
      ).then((res)=>{
        setFundDetail(res.data.data);
        setyesterdayData(res.data.data);
      })
      
  }, [render, contestId]);

  // console.log("fundDetail", Number(netPnl?.toFixed(0)), fundDetail)

  let totalCreditString = fundDetail?.totalFund ? fundDetail?.totalFund >= 0 ? "+₹" + fundDetail?.totalFund?.toLocaleString() : "-₹" + ((-fundDetail?.totalFund)?.toLocaleString()): "+₹0"

  let runningPnl = Number(netPnl?.toFixed(0));
  let openingBalance = fundDetail?.openingBalance ? (fundDetail?.openingBalance)?.toFixed(0) : fundDetail?.totalFund;
  let openingBalanceString = openingBalance >= 0 ? "₹" + Number(openingBalance)?.toLocaleString() : "₹" + (-Number(openingBalance))?.toLocaleString()
  let availableMargin = openingBalance ? (totalRunningLots === 0 ? Number(openingBalance)+runningPnl : Number(openingBalance)-todayAmount) : fundDetail?.totalFund;
  let availableMarginpnlstring = availableMargin >= 0 ? "₹" + Number(availableMargin)?.toLocaleString() : "₹" + (-Number(availableMargin))?.toLocaleString()
  let usedMargin = runningPnl >= 0 ? 0 : runningPnl
  let usedMarginString = usedMargin >= 0 ? "₹" + Number(usedMargin)?.toLocaleString() : "₹" + (-Number(usedMargin))?.toLocaleString()
  
  // console.log("checkmargin", netPnl, fundDetail, fundDetail)
    
    return (<>
  
      <MDBox mt={0.5}>
        <MDBox mb={0}>
          <Grid container spacing={1}>
            <Grid item xs={16} lg={12}>
              <Grid container spacing={1}>

                <Grid item xs={16} md={6} xl={4}>
                  <DefaultInfoCard
                    // icon={<CreditCardIcon/>}
                    title="Portfolio value"
                    description="Total funds added by StoxHero in your Account"
                    value={totalCreditString}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={4}>
                  <DefaultInfoCard
                    // icon={<AvailableIcon/>}
                    title="available margin"
                    description="Funds that you can used to trade today"
                    value={availableMarginpnlstring}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={4}>
                  <DefaultInfoCard
                    // icon={<ShoppingCartIcon/>}
                    title="used margin"
                    description="Net funds utilized for your executed trades"
                    value={usedMarginString}
                  />
                </Grid>

                {/* <Grid item xs={16} md={8} xl={4}>
                  <DefaultInfoCard
                    // icon={<AccountBalanceWalletIcon/>}
                    title="opening balance"
                    description="Cash available at the beginning of the day"
                    value={openingBalanceString}
                  />
                </Grid> */}
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      </>
    )
}

export default memo(InternShipMargin);