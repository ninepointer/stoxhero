import React from 'react'
import Grid from "@mui/material/Grid";
import {useState, useContext, useEffect, memo} from "react"
import axios from "axios";
import { userContext } from "../../../AuthContext";
import { NetPnlContext } from '../../../PnlContext';
import MDBox from '../../../components/MDBox';
import MarginDetails from './MarginDetails';
import DefaultInfoCard from "../../../examples/Cards/InfoCards/DefaultInfoCard";
import { renderContext } from '../../../renderContext';

const InfinityMarginGrid = () => {
  console.log("rendering : infinitymargin")
  //console.log("rendering in userPosition: marginGrid")
  const { infinityNetPnl } = useContext(NetPnlContext);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
//   const [marginDetails, setMarginDetails] = useState([]);
  // const { columns, rows } = MarginDetails();
  // const getDetails = useContext(userContext);
  // const id = getDetails?.userDetails?._id
  const [fundDetail, setFundDetail] = useState({});
  const [yesterdayData, setyesterdayData] = useState({});
  const {render} = useContext(renderContext);



  useEffect(() => {
    axios.get(`${baseUrl}api/v1/infinityTrade/myOpening`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      }}
      ).then((res)=>{
        setyesterdayData(res.data.data);
      })
      
  }, [render]);

  useEffect(() => {
    axios.get(`${baseUrl}api/v1/infinityTrade/myPnlandCreditData`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      }}
      ).then((res)=>{
        setFundDetail(res.data.data);
      })
      
  }, [render]);


//   let totalCredit = 0;
//   marginDetails?.map((elem)=>{
//     totalCredit =+ totalCredit + elem.amount
//   })

  let totalCreditString = fundDetail?.totalCredit ? fundDetail?.totalCredit >= 0 ? "+₹" + fundDetail?.totalCredit?.toLocaleString() : "-₹" + ((-fundDetail?.totalCredit)?.toLocaleString()): "+₹0"
  // let lifetimenetpnl = fundDetail?.npnl ? Number((fundDetail?.npnl)?.toFixed(0)) : 0;
  let yesterdaylifetimenetpnl = yesterdayData?.npnl ? Number((yesterdayData?.npnl)?.toFixed(0)) : 0;

  //console.log(lifetimenetpnl)
  // let runninglotnumber = totalRunningLots;
  let runningPnl = Number(infinityNetPnl?.toFixed(0));
  let openingBalance = yesterdayData?.totalCredit ? (yesterdayData?.totalCredit + yesterdaylifetimenetpnl) : 0;
  let openingBalanceString = openingBalance >= 0 ? "₹" + Number(openingBalance)?.toLocaleString() : "₹" + (-Number(openingBalance))?.toLocaleString()
  let availableMargin = fundDetail?.availableMargin ? Number((fundDetail?.availableMargin)?.toFixed(0))+runningPnl : 0;
//   let availableMargin = (fundDetail?.totalCredit + availableMarginpnl)
  let availableMarginpnlstring = availableMargin >= 0 ? "₹" + Number(availableMargin)?.toLocaleString() : "₹" + (-Number(availableMargin))?.toLocaleString()
  // rows.OpeningBalance = openingBalance
  let usedMargin = runningPnl >= 0 ? 0 : runningPnl
  let usedMarginString = usedMargin >= 0 ? "+₹" + Number(usedMargin)?.toLocaleString() : "-₹" + (-Number(usedMargin))?.toLocaleString()
  
  console.log("checkmargin", infinityNetPnl, yesterdayData, fundDetail)
    
    return (<>
  
      <MDBox mt={0.5}>
        <MDBox mb={0}>
          <Grid container spacing={3}>
            <Grid item xs={16} lg={12}>
              <Grid container spacing={3}>

                <Grid item xs={16} md={6} xl={3}>
                  <DefaultInfoCard
                    // icon={<CreditCardIcon/>}
                    title="total credit"
                    description="Total funds added by StoxHero in your Account"
                    value={totalCreditString}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={3}>
                  <DefaultInfoCard
                    // icon={<AvailableIcon/>}
                    title="available margin"
                    description="Funds that you can used to trade today"
                    value={availableMarginpnlstring}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={3}>
                  <DefaultInfoCard
                    // icon={<ShoppingCartIcon/>}
                    title="used margin"
                    description="Net funds utilized for your executed trades"
                    value={usedMarginString}
                  />
                </Grid>

                <Grid item xs={16} md={8} xl={3}>
                  <DefaultInfoCard
                    // icon={<AccountBalanceWalletIcon/>}
                    title="opening balance"
                    description="Cash available at the beginning of the day"
                    value={openingBalanceString}
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

export default memo(InfinityMarginGrid);