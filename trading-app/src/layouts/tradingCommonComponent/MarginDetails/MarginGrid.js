import React from 'react'
import Grid from "@mui/material/Grid";
import {useState, useContext, useEffect, memo} from "react"
import axios from "axios";
// import { userContext } from "../../../AuthContext";
import { NetPnlContext } from '../../../PnlContext';
import MDBox from '../../../components/MDBox';
// import MarginDetails from './MarginDetails';
import DefaultInfoCard from "../../../examples/Cards/InfoCards/DefaultInfoCard";

const MarginGrid = () => {

  console.log("rendering in userPosition: marginGrid")
  const { netPnl, totalRunningLots } = useContext(NetPnlContext);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [marginDetails, setMarginDetails] = useState([]);
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
        //console.log("live price data", res)
        // setUserInstrumentData(res.data);
        // setDetails.setMarketData(data);
        setMarginDetails(res.data.data)
    }).catch((err) => {
        return new Error(err);
    })
  }, []);

  console.log("marginDetails", marginDetails)
  let totalCredit = marginDetails?.totalCredit?.totalFund;
  // marginDetails?.map((elem)=>{
  //   totalCredit =+ totalCredit + elem.amount
  // })

  let totalCreditString = totalCredit >= 0 ? "+₹" + totalCredit.toLocaleString() : "-₹" + ((-totalCredit).toLocaleString())
  // let lifetimenetpnl = lifetimePNL[0] ? Number((lifetimePNL[0]?.npnl).toFixed(0)) : 0;
  // console.log(lifetimenetpnl)
  // let runninglotnumber = totalRunningLots;
  let runningPnl = Number(netPnl?.toFixed(0));
  let openingBalance = (marginDetails?.totalCredit?.totalFund + marginDetails?.lifetimePnl?.npnl).toFixed(0);
  let openingBalanceString = openingBalance >= 0 ? "₹" + Number(openingBalance).toLocaleString() : "₹" + (-Number(openingBalance)).toLocaleString()
  // let availableMarginpnl = availableMarginPNL[0] ? Number((availableMarginPNL[0].npnl).toFixed(0)) : 0;
  let availableMargin = (Number(openingBalance) + runningPnl)
  let availableMarginpnlstring = availableMargin >= 0 ? "₹" + Number(availableMargin).toLocaleString() : "₹" + (-Number(availableMargin)).toLocaleString()
  // rows.OpeningBalance = openingBalance
  let usedMargin = runningPnl >= 0 ? 0 : runningPnl
  // let usedMargin = runninglotnumber == 0 ? openingBalance - availableMargin : openingBalance - availableMargin + runningPnl
  let usedMarginString = usedMargin >= 0 ? "+₹" + Number(usedMargin).toLocaleString() : "-₹" + (-Number(usedMargin)).toLocaleString()
  // let payInAmount = payIn && (payIn[0] ? Number(payIn[0].totalCredit) : 0)
  // let payInString = payInAmount >= 0 ? "+₹" + Number(payInAmount).toLocaleString() : "-₹" + (-Number(payInAmount)).toLocaleString()
  
  
  console.log("runningPnl", runningPnl, openingBalance)

    // const { columns, rows } = authorsTableData();
    
    return (<>
  
      <MDBox mt={0.5}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={16} lg={12}>
              <Grid container spacing={3}>
                {/* <Grid item xs={12} xl={6}>
                  <MasterCard number={4562112245947852} holder="jack peterson" expires="11/22" />
                </Grid> */}
                <Grid item xs={16} md={6} xl={2.4}>
                  <DefaultInfoCard
                    // icon={<CreditCardIcon/>}
                    title="total credit"
                    description="Total funds added by StoxHero"
                    value={totalCreditString}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={2.4}>
                  <DefaultInfoCard
                    // icon={<AvailableIcon/>}
                    title="available margin"
                    description="Funds that you can used to trade today"
                    value={availableMarginpnlstring}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={2.4}>
                  <DefaultInfoCard
                    // icon={<ShoppingCartIcon/>}
                    title="used margin"
                    description="Net funds utilized for your executed trades"
                    value={usedMarginString}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={2.4}>
                  <DefaultInfoCard
                    // icon={<CurrencyRupeeIcon/>}
                    title="Payin"
                    description="Funds added in your trading account today"
                    // value={payInString}
                    value={openingBalanceString}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={2.4}>
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

export default memo(MarginGrid);