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
import CircularProgress from "@mui/material/CircularProgress";

const MarginGrid = () => {
  console.log("rendering : papermargin")
  //console.log("rendering in userPosition: marginGrid")
  const { netPnl, totalRunningLots } = useContext(NetPnlContext);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [marginDetails, setMarginDetails] = useState([]);
  const [fundDetail, setFundDetail] = useState({});
  const {render} = useContext(renderContext);
  const [isLoading, setIsLoading] = useState(true);
  // const { columns, rows } = MarginDetails();
//   const { columns: pColumns, rows: pRows } = MarginDetails();
  // const [lifetimePNL, setLifetimePNL] = useState([]);
  // const [availableMarginPNL, setAvailableMarginPNL] = useState([]);
  // const [payIn, setPayIn] = useState([]);
  // const getDetails = useContext(userContext);
  // const id = getDetails?.userDetails?._id



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
        setMarginDetails(res.data.data)
        setFundDetail(res.data.data);
        setTimeout(() => {
          setIsLoading(false); 
        }, 2000);
        console.log(fundDetail)
    }).catch((err) => {
        return new Error(err);
    })
  }, [render]);
  

  console.log("marginDetails", marginDetails)
  let totalCredit = marginDetails?.totalCredit?.totalFund?.valueSum;
  let portfolioName = marginDetails?.totalCredit?.totalFund?.name
  // marginDetails?.map((elem)=>{
  //   totalCredit =+ totalCredit + elem.amount
  // })

  let totalCreditString = totalCredit >= 0 ? "+₹" + totalCredit.toLocaleString() : "-₹" + ((-totalCredit).toLocaleString())
  // let lifetimenetpnl = lifetimePNL[0] ? Number((lifetimePNL[0]?.npnl).toFixed(0)) : 0;
  // //console.log(lifetimenetpnl)
  // let runninglotnumber = totalRunningLots;
  let runningPnl = Number(netPnl?.toFixed(0));
  let totalPnl = marginDetails?.lifetimePnl?.npnl ? (marginDetails?.lifetimePnl?.npnl + runningPnl).toFixed(0) : runningPnl
  // let totalPnlString = marginDetails?.lifetimePnl?.npnl ? totalPnl >= 0 ? "+₹" + Number(totalPnl).toLocaleString() : "-₹" + (-Number(totalPnl)).toLocaleString() : "+₹0"
  //console.log("checking", runningPnl, totalPnl, marginDetails?.lifetimePnl?.npnl, Boolean(totalPnl))
  // let availableMarginpnl = availableMarginPNL[0] ? Number((availableMarginPNL[0].npnl).toFixed(0)) : 0;
  // let availableMargin = (Number(openingBalance) + runningPnl)
  // let availableMarginpnlstring = availableMargin >= 0 ? "₹" + Number(availableMargin).toLocaleString() : "₹" + (-Number(availableMargin)).toLocaleString()
  // rows.OpeningBalance = openingBalance
  let usedMargin = runningPnl >= 0 ? 0 : runningPnl
  // let usedMargin = runninglotnumber == 0 ? openingBalance - availableMargin : openingBalance - availableMargin + runningPnl
  let usedMarginString = usedMargin >= 0 ? "₹" + Number(usedMargin).toLocaleString() : "₹" + (-Number(usedMargin)).toLocaleString()
  // let payInAmount = payIn && (payIn[0] ? Number(payIn[0].totalCredit) : 0)
  // let payInString = payInAmount >= 0 ? "+₹" + Number(payInAmount).toLocaleString() : "-₹" + (-Number(payInAmount)).toLocaleString()
  let availableMargin = totalCredit + Number(totalPnl);
  //console.log("availableMargin", totalCredit , Number(totalPnl))
  let openingBalance = fundDetail?.openingBalance ? (fundDetail?.openingBalance)?.toFixed(0) : fundDetail?.totalFund;
  
  let openingBalanceString = openingBalance >= 0 ? "₹" + Number(openingBalance)?.toLocaleString() : "₹" + (-Number(openingBalance))?.toLocaleString()
  // let availableMargin = openingBalance ? (totalRunningLots === 0 ? Number(openingBalance)+runningPnl : Number(openingBalance)+runningPnl-todayAmount) : fundDetail?.totalFund;
  // let availableMarginString = availableMargin >= 0 ? "₹" + Number(availableMargin).toLocaleString() : "₹" + (-Number(availableMargin)).toLocaleString()
  let availableMarginpnlstring = availableMargin >= 0 ? "₹" + Number(availableMargin)?.toLocaleString() : "₹" + (-Number(availableMargin))?.toLocaleString()

  
  // //console.log("runningPnl", runningPnl, openingBalance)

    // const { columns, rows } = authorsTableData();  md={8} xl={3}
    
    return (
    
      <MDBox mt={0.5}>
        
        <MDBox  mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={16} lg={12}>
              <Grid container spacing={3}  borderRadius="20px" >

              <Grid sx={{height:"30px"}} item xs={16} md={6} xl={3}>
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
          // {/* <Grid item xs={12} md={6} lg={12}>
          //   <MDBox bgColor="light" borderRadius={5} p={2} display="flex" justifyContent="space-between">
          //     <Grid container display="flex" justifyContent="space-around">



          //       <Grid item xs={12} md={6} lg={4}>
          //         <MDAvatar src={marginicon} size="lg"/>
          //         <MDTypography fontSize={17} fontWeight="bold" display="flex" justifyContent="left" alignContent="left" alignItems="left">Portfolio</MDTypography>
          //       </Grid>
           
          //       <Grid item xs={12} md={6} lg={4}>
          //         <MDBox display="flex">
          //           <MDTypography fontSize={10}>{totalPnlString}</MDTypography>
          //           <MDAvatar src={downicon} style={{width:15, height:15}} display="flex" justifyContent="left"/>
          //         </MDBox>
          //       </Grid>
              
          //       <Grid item xs={12} md={6} lg={4}>
          //         <MDTypography fontSize={13} fontWeight="bold" display="flex" justifyContent="right">{totalCreditString}</MDTypography>
          //         <MDBox display="flex" justifyContent="right">
          //           <MDTypography fontSize={10} display="flex" justifyContent="right">(-40.00%)</MDTypography>
          //           <MDAvatar src={downicon} style={{width:15, height:15}} display="flex" justifyContent="right"/>
          //         </MDBox>   
          //       </Grid>
          //     </Grid>
            
          //   </MDBox>
          // </Grid> */}

      
    
    )
}

export default memo(MarginGrid);