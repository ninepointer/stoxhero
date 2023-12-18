import React from 'react'
import Grid from "@mui/material/Grid";
import {useState, useContext, useEffect, memo} from "react"
import axios from "axios";
import { NetPnlContext } from '../../../PnlContext';
import MDBox from '../../../components/MDBox';
import DefaultInfoCard from "../../../examples/Cards/InfoCards/DefaultInfoCard";
import { renderContext } from '../../../renderContext';
import MDButton from '../../../components/MDButton';
import AMargin from '../../../assets/images/amargin.png'
import Profit from '../../../assets/images/profit.png'
import Tcost from '../../../assets/images/tcost.png'
import MDTypography from '../../../components/MDTypography';


const PnlAndMarginData = ({marginxId}) => {
  const { netPnl, totalRunningLots, pnlData } = useContext(NetPnlContext);
  const pnl = useContext(NetPnlContext);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [fundDetail, setFundDetail] = useState({});
  // const [yesterdayData, setyesterdayData] = useState({});
  const {render} = useContext(renderContext);

 

  const todayMargin = pnlData.reduce((total, acc) => {
    return total + (acc.margin ? acc.margin : 0);
  }, 0);

  let amount = 0;
  let margin = 0;
  let subtractAmount = 0;
  pnlData.map((elem) => {
    console.log(elem?._id?.isLimit)
    if(elem?._id.isLimit){
      margin += elem?.margin;
    } else{
      if(elem?.lots < 0) {
        margin += elem?.margin;
        subtractAmount += Math.abs(elem?.lots*elem?.lastaverageprice);
      }
      amount += (elem?.amount - elem?.brokerage)
    }
  });

  useEffect(() => {
    axios.get(`${baseUrl}api/v1/marginxtrade/${marginxId}/myPnlandCreditData`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      }}
      ).then((res)=>{
        setFundDetail(res.data.data);
        // setyesterdayData(res.data.data);
      })
      
  }, [render, marginxId]);


  const totalCreditString = fundDetail?.totalFund ? fundDetail?.totalFund >= 0 ? "+₹" + fundDetail?.totalFund?.toLocaleString() : "-₹" + ((-fundDetail?.totalFund)?.toLocaleString()): "+₹0"
  const runningPnl = Number(netPnl?.toFixed(0));
  const openingBalance = fundDetail?.openingBalance ? (fundDetail?.openingBalance)?.toFixed(0) : fundDetail?.totalFund;
  const availableMargin = ((runningPnl < 0) ? totalRunningLots===0 ? (openingBalance-todayMargin+runningPnl) : openingBalance-(Math.abs(amount-subtractAmount)+margin) : openingBalance-todayMargin)?.toFixed(0);
  const availableMarginpnlstring =  (availableMargin) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(availableMargin)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-availableMargin))
  const usedMargin = runningPnl >= 0 ? 0 : runningPnl
  const usedMarginString = usedMargin >= 0 ? "₹" + Number(usedMargin)?.toLocaleString() : "₹" + (-Number(usedMargin))?.toLocaleString()
  const unrealisedPnl = runningPnl >= 0 ? runningPnl : 0
  const unrealisedPnlString = unrealisedPnl >= 0 ? "₹" + Number(unrealisedPnl)?.toLocaleString() : "₹" + (-Number(unrealisedPnl))?.toLocaleString()

    
    return (
        <Grid container spacing={1} xs={12} md={12} lg={12}>
            <Grid item xs={12} md={6} lg={3}>
                <MDButton style={{ minWidth: '100%' }}>
                    <MDBox display='flex' alignItems='center'>
                        <MDBox display='flex' justifyContent='flex-start'><img src={AMargin} width='40px' height='40px' /></MDBox>
                        <MDBox><MDTypography ml={1} fontSize={11} fontWeight='bold'>Virtual Money:</MDTypography></MDBox>
                        <MDBox><MDTypography ml={1} fontSize={11}>{totalCreditString}</MDTypography></MDBox>
                    </MDBox>
                </MDButton>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
                <MDButton style={{ minWidth: '100%' }}>
                    <MDBox display='flex' alignItems='center'>
                        <MDBox display='flex' justifyContent='flex-start'><img src={Tcost} width='40px' height='40px' /></MDBox>
                        <MDBox><MDTypography ml={1} fontSize={11} fontWeight='bold'>Margin/Used Margin:</MDTypography></MDBox>
                        <MDBox><MDTypography ml={1} fontSize={11}>{`${availableMarginpnlstring}/${usedMarginString}`}</MDTypography></MDBox>
                    </MDBox>
                </MDButton>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
                <MDButton style={{ minWidth: '100%' }}>
                    <MDBox display='flex' alignItems='center'>
                        <MDBox display='flex' justifyContent='flex-start'><img src={Profit} width='40px' height='40px' /></MDBox>
                        <MDBox><MDTypography ml={1} fontSize={11} fontWeight='bold'>Unrealised P&L:</MDTypography></MDBox>
                        <MDBox><MDTypography ml={1} fontSize={11}> {unrealisedPnlString}</MDTypography></MDBox>
                    </MDBox>
                </MDButton>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
                <MDButton style={{ minWidth: '100%' }}>
                    <MDBox display='flex' alignItems='center'>
                        <MDBox display='flex' justifyContent='flex-start'><img src={Profit} width='40px' height='40px' /></MDBox>
                        <MDBox><MDTypography ml={1} fontSize={11} fontWeight='bold'>Net Profit:</MDTypography></MDBox>
                        <MDBox><MDTypography ml={1} fontSize={11}>{(pnl?.netPnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnl?.netPnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-pnl?.netPnl))}</MDTypography></MDBox>
                    </MDBox>
                </MDButton>
            </Grid>
        </Grid>
    )
}

export default memo(PnlAndMarginData);