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

 

  const todayAmount = pnlData.reduce((total, acc) => {
    if (acc.lots !== 0) {
      return total + Math.abs(acc.amount);
    }
    return total; // return the accumulator if the condition is false
  }, 0);

//   console.log("margin", todayAmount)

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

//   console.log("fundDetail", Number(netPnl?.toFixed(0)), fundDetail)

  let totalCreditString = fundDetail?.totalFund ? fundDetail?.totalFund >= 0 ? "+₹" + fundDetail?.totalFund?.toLocaleString() : "-₹" + ((-fundDetail?.totalFund)?.toLocaleString()): "+₹0"

  let runningPnl = Number(netPnl?.toFixed(0));
  let openingBalance = fundDetail?.openingBalance ? (fundDetail?.openingBalance)?.toFixed(0) : fundDetail?.totalFund;
//   let openingBalanceString = openingBalance >= 0 ? "₹" + Number(openingBalance)?.toLocaleString() : "₹" + (-Number(openingBalance))?.toLocaleString()
  let availableMargin = openingBalance ? (totalRunningLots === 0 ? Number(openingBalance)+runningPnl : Number(openingBalance)-todayAmount) : fundDetail?.totalFund;
  let availableMarginpnlstring = availableMargin >= 0 ? "₹" + Number(availableMargin)?.toLocaleString() : "₹" + (-Number(availableMargin))?.toLocaleString()
  let usedMargin = runningPnl >= 0 ? 0 : runningPnl
  let usedMarginString = usedMargin >= 0 ? "₹" + Number(usedMargin)?.toLocaleString() : "₹" + (-Number(usedMargin))?.toLocaleString()
  
    
    return (
        <Grid container spacing={1} xs={12} md={12} lg={12}>
            <Grid item xs={12} md={6} lg={3}>
                <MDButton style={{ minWidth: '100%' }}>
                    <MDBox display='flex' alignItems='center'>
                        <MDBox display='flex' justifyContent='flex-start'><img src={AMargin} width='40px' height='40px' /></MDBox>
                        <MDBox><MDTypography ml={1} fontSize={11} fontWeight='bold'>Portfolio:</MDTypography></MDBox>
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
                        <MDBox><MDTypography ml={1} fontSize={11} fontWeight='bold'>Gross Profit:</MDTypography></MDBox>
                        <MDBox><MDTypography ml={1} fontSize={11}> {(pnl?.grossPnlAndBrokerage?.grossPnl) >= 0 ? "+₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(pnl?.grossPnlAndBrokerage?.grossPnl)) : "-₹" + (new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(-pnl?.grossPnlAndBrokerage?.grossPnl))}</MDTypography></MDBox>
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