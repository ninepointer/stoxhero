import React from 'react'
import Grid from "@mui/material/Grid";
import {useState, useContext, useEffect, memo} from "react"
import axios from "axios";
import { NetPnlContext } from '../../../PnlContext';
import MDBox from '../../../components/MDBox';
import DefaultInfoCard from "../../../examples/Cards/InfoCards/DefaultInfoCard";
import { renderContext } from '../../../renderContext';

const InternShipMargin = ({BatchId, setyesterdayData}) => {
  const { netPnl, totalRunningLots, pnlData } = useContext(NetPnlContext);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  const [fundDetail, setFundDetail] = useState({});
  const {render} = useContext(renderContext);

  const todayMargin = pnlData.reduce((total, acc) => {
    return total + (acc.margin ? acc.margin : 0);
  }, 0);

  useEffect(() => {
    axios.get(`${baseUrl}api/v1/internship/marginDetail/${BatchId}`,{
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
      
  }, [render, BatchId]);


  const totalCreditString = fundDetail?.totalFund ? fundDetail?.totalFund >= 0 ? "+₹" + fundDetail?.totalFund?.toLocaleString() : "-₹" + ((-fundDetail?.totalFund)?.toLocaleString()): "+₹0"
  const runningPnl = Number(netPnl?.toFixed(0));
  const openingBalance = fundDetail?.openingBalance ? (fundDetail?.openingBalance)?.toFixed(0) : fundDetail?.totalFund;
  // const openingBalanceString = openingBalance >= 0 ? "₹" + Number(openingBalance)?.toLocaleString() : "₹" + (-Number(openingBalance))?.toLocaleString()
  // const availableMargin = openingBalance ? (totalRunningLots === 0 ? Number(openingBalance)+runningPnl : Number(openingBalance)-todayAmount) : fundDetail?.totalFund;
  const availableMargin = (runningPnl < 0) ? totalRunningLots===0 ? (openingBalance-todayMargin+runningPnl) : openingBalance-todayMargin : openingBalance-todayMargin;
  const availableMarginpnlstring = availableMargin >= 0 ? "₹" + Number(availableMargin)?.toLocaleString() : "₹0"
  const usedMargin = runningPnl >= 0 ? 0 : runningPnl
  const usedMarginString = usedMargin >= 0 ? "₹" + Number(usedMargin)?.toLocaleString() : "₹" + (-Number(usedMargin))?.toLocaleString()
  const unrealisedPnl = runningPnl >= 0 ? runningPnl : 0
  const unrealisedPnlString = unrealisedPnl >= 0 ? "₹" + Number(unrealisedPnl)?.toLocaleString() : "₹" + (-Number(unrealisedPnl))?.toLocaleString()

    
    return (<>
  
      <MDBox mt={0.5}>
        <MDBox mb={0}>
          <Grid container spacing={3}>
            <Grid item xs={16} lg={12}>
              <Grid container spacing={3}>

                <Grid item xs={16} md={6} xl={3}>
                  <DefaultInfoCard
                    // icon={<CreditCardIcon/>}
                    title="Virtual Margin Money"
                    description="Total funds added by StoxHero in your Account"
                    value={totalCreditString}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={3}>
                  <DefaultInfoCard
                    // icon={<AvailableIcon/>}
                    title="Virtual available margin"
                    description="Funds that you can used to trade today"
                    value={availableMarginpnlstring}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={3}>
                  <DefaultInfoCard
                    // icon={<ShoppingCartIcon/>}
                    title="Virtual used margin"
                    description="Net funds utilized for your executed trades"
                    value={usedMarginString}
                  />
                </Grid>

                <Grid item xs={16} md={8} xl={3}>
                  <DefaultInfoCard
                    // icon={<AccountBalanceWalletIcon/>}
                    title="Virtual unrealised pnl"
                    description="Increased value of your investment"
                    value={unrealisedPnlString}
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

export default memo(InternShipMargin);