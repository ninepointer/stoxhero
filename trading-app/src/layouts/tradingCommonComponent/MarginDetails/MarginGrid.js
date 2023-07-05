import React from 'react'
import Grid from "@mui/material/Grid";
import {useState, useContext, useEffect, memo} from "react"
import axios from "axios";
// import { userContext } from "../../../AuthContext";
import { NetPnlContext } from '../../../PnlContext';
import MDBox from '../../../components/MDBox';
// import MarginDetails from './MarginDetails';
import DefaultInfoCard from "../../../examples/Cards/InfoCards/DefaultInfoCard";
import downicon from '../../../assets/images/down.png'
import marginicon from '../../../assets/images/marginicon.png'
import MDTypography from '../../../components/MDTypography';
import MDAvatar from '../../../components/MDAvatar';
import { renderContext } from '../../../renderContext';

const MarginGrid = () => {
  console.log("rendering : papermargin")
  //console.log("rendering in userPosition: marginGrid")
  const { netPnl, totalRunningLots, pnlData  } = useContext(NetPnlContext);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  const [fundDetail, setFundDetail] = useState({});
  // const { columns, rows } = MarginDetails();
//   const { columns: pColumns, rows: pRows } = MarginDetails();
  // const [lifetimePNL, setLifetimePNL] = useState([]);
  // const [availableMarginPNL, setAvailableMarginPNL] = useState([]);
  // const [payIn, setPayIn] = useState([]);
  // const getDetails = useContext(userContext);
  // const id = getDetails?.userDetails?._id
  const {render} = useContext(renderContext);

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
        ////console.log("live price data", res)
        // setUserInstrumentData(res.data);
        // setDetails.setMarketData(data);
        setFundDetail(res.data.data);
    }).catch((err) => {
        return new Error(err);
    })
  }, []);
  

  // console.log("marginDetails", marginDetails)
  // let totalCredit = marginDetails?.totalCredit?.totalFund?.valueSum;
  let portfolioName = fundDetail?.portfolioName
  // marginDetails?.map((elem)=>{
  //   totalCredit =+ totalCredit + elem.amount
  // })

  let totalCreditString = fundDetail?.totalFund ? fundDetail?.totalFund >= 0 ? "+₹" + fundDetail?.totalFund?.toLocaleString() : "-₹" + ((-fundDetail?.totalFund)?.toLocaleString()): "+₹0"

  let runningPnl = Number(netPnl?.toFixed(0));
  let openingBalance = fundDetail?.openingBalance ? (fundDetail?.openingBalance)?.toFixed(0) : fundDetail?.totalFund;
  let openingBalanceString = openingBalance >= 0 ? "₹" + Number(openingBalance)?.toLocaleString() : "₹" + (-Number(openingBalance))?.toLocaleString()
  let availableMargin = openingBalance ? (totalRunningLots === 0 ? Number(openingBalance)+runningPnl : Number(openingBalance)+runningPnl-todayAmount) : fundDetail?.totalFund;
  // let availableMarginpnlstring = availableMargin >= 0 ? "₹" + Number(availableMargin)?.toLocaleString() : "₹" + (-Number(availableMargin))?.toLocaleString()
  let availableMarginpnlstring = availableMargin >= 0 ? "₹" + Number(availableMargin)?.toLocaleString() : "₹0"

  let usedMargin = runningPnl >= 0 ? 0 : runningPnl
  let usedMarginString = usedMargin >= 0 ? "₹" + Number(usedMargin)?.toLocaleString() : "₹" + (-Number(usedMargin))?.toLocaleString()

  
  // //console.log("runningPnl", runningPnl, openingBalance)

    // const { columns, rows } = authorsTableData();  md={8} xl={3}
    
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
                    value={`Portfolio Value: ${totalCreditString} | Available Margin: ${availableMarginpnlstring}  | Used Margin Today: ${usedMarginString}`}
                  />
                </Grid>
                {/* <Grid item xs={16} md={8} xl={3}>
                  <DefaultInfoCard
                    title="available margin"
                    description="Funds that you can used to trade today"
                    // value={availableMarginpnlstring}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={3}>
                  <DefaultInfoCard
                    title="used margin"
                    description="Net funds utilized for your executed trades"
                    value={usedMarginString}
                  />
                </Grid> */}
                {/* <Grid item xs={16} md={8} xl={3}>
                  <DefaultInfoCard
                    title="Payin"
                    description="Funds added in your trading account today"
                    // value={openingBalanceString}
                  />
                </Grid> */}
                {/* <Grid item xs={16} md={8} xl={3}>
                  <DefaultInfoCard
                    title="opening balance"
                    description="Cash available at the beginning of the day"
                    // value={openingBalanceString}
                  />
                </Grid> */}
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
          {/* <Grid item xs={12} md={6} lg={12}>
            <MDBox bgColor="light" borderRadius={5} p={2} display="flex" justifyContent="space-between">
              <Grid container display="flex" justifyContent="space-around">



                <Grid item xs={12} md={6} lg={4}>
                  <MDAvatar src={marginicon} size="lg"/>
                  <MDTypography fontSize={17} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Portfolio</MDTypography>
                </Grid>
           
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox display="flex">
                    <MDTypography fontSize={10}>{totalPnlString}</MDTypography>
                    <MDAvatar src={downicon} style={{width:15, height:15}} display="flex" justifyContent="left"/>
                  </MDBox>
                </Grid>
              
                <Grid item xs={12} md={6} lg={4}>
                  <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="right">{totalCreditString}</MDTypography>
                  <MDBox display="flex" justifyContent="right">
                    <MDTypography fontSize={10} display="flex" justifyContent="right">(-40.00%)</MDTypography>
                    <MDAvatar src={downicon} style={{width:15, height:15}} display="flex" justifyContent="right"/>
                  </MDBox>   
                </Grid>
              </Grid>
            
            </MDBox>
          </Grid> */}

      
    </>
    )
}

export default memo(MarginGrid);