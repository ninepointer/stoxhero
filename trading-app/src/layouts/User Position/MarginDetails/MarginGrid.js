import React from 'react'
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import {useState, useContext, useEffect} from "react"
import axios from "axios";
import { userContext } from "../../../AuthContext";
import { NetPnlContext } from '../../../PnlContext';

// Data

import DataTable from '../../../examples/Tables/DataTable';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MarginDetails from './MarginDetails';
import DefaultInfoCard from "../../../examples/Cards/InfoCards/DefaultInfoCard";
import AvailableIcon from '@mui/icons-material/Savings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentsIcon from '@mui/icons-material/Payments';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const MarginGrid = () => {

  const { netPnl, totalRunningLots } = useContext(NetPnlContext);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [marginDetails, setMarginDetails] = useState([]);
  const { columns, rows } = MarginDetails();
//   const { columns: pColumns, rows: pRows } = MarginDetails();
  const [lifetimePNL, setLifetimePNL] = useState([]);
  const [availableMarginPNL, setAvailableMarginPNL] = useState([]);
  const [payIn, setPayIn] = useState([]);
  const getDetails = useContext(userContext);

  // useEffect(()=>{

  //   let abortController;
  //   (async () => {
  //        abortController = new AbortController();
  //        let signal = abortController.signal;    

  //        // the signal is passed into the request(s) we want to abort using this controller
  //        const { data1 } = await axios.get(
  //         `${baseUrl}api/v1/getUserMarginDetails/${getDetails.userDetails.email}`,
  //            { signal: signal }
  //        );
  //        setMarginDetails(data1);

  //        const { data2 } = await axios.get(
  //         `${baseUrl}api/v1/gettraderpnlformargin/${getDetails.userDetails.email}`,
  //            { signal: signal }
  //        );
         
  //        setLifetimePNL(data2);

  //        const { data3 } = await axios.get(
  //         `${baseUrl}api/v1/gettraderpnlforavailablemargin/${getDetails.userDetails.email}`,
  //           { signal: signal }
  //        );
  //        setAvailableMarginPNL(data3);

  //        const { data4 } = await axios.get(
  //         `${baseUrl}api/v1/getUserPayInDetails/${getDetails.userDetails.email}`,
  //            { signal: signal }
  //        );
  //        setPayIn(data4);

  //   })();

  //   return () => abortController.abort();

  // },[netPnl,totalRunningLots])

  useEffect(() => {
    let abortController;
    (async () => {
      abortController = new AbortController();
      let signal = abortController.signal;
  
      try {
        const { data: data1 } = await axios.get(`${baseUrl}api/v1/getUserMarginDetails/${getDetails.userDetails.email}`, {
          signal: signal,
        });
        if (!signal.aborted) {
          setMarginDetails(data1);
        }
  
        const { data: data2 } = await axios.get(`${baseUrl}api/v1/gettraderpnlformargin/${getDetails.userDetails.email}`, {
          signal: signal,
        });
        if (!signal.aborted) {
          setLifetimePNL(data2);
        }
  
        const { data: data3 } = await axios.get(`${baseUrl}api/v1/gettraderpnlforavailablemargin/${getDetails.userDetails.email}`, {
          signal: signal,
        });
        if (!signal.aborted) {
          setAvailableMarginPNL(data3);
        }
  
        const { data: data4 } = await axios.get(`${baseUrl}api/v1/getUserPayInDetails/${getDetails.userDetails.email}`, {
          signal: signal,
        });
        if (!signal.aborted) {
          setPayIn(data4);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  
    return () => abortController.abort();
  }, [netPnl, totalRunningLots]);

  let totalCredit = 0;
  marginDetails?.map((elem)=>{
    totalCredit =+ totalCredit + elem.amount
  })

  let totalCreditString = totalCredit >= 0 ? "+₹" + totalCredit.toLocaleString() : "-₹" + ((-totalCredit).toLocaleString())
  let lifetimenetpnl = lifetimePNL[0] ? Number((lifetimePNL[0]?.npnl).toFixed(0)) : 0;
  console.log(lifetimenetpnl)
  let runninglotnumber = totalRunningLots;
  let runningPnl = Number(netPnl?.toFixed(0));
  let openingBalance = (totalCredit + lifetimenetpnl);
  let openingBalanceString = openingBalance >= 0 ? "₹" + Number(openingBalance).toLocaleString() : "₹" + (-Number(openingBalance)).toLocaleString()
  let availableMarginpnl = availableMarginPNL[0] ? Number((availableMarginPNL[0].npnl).toFixed(0)) : 0;
  let availableMargin = (totalCredit + availableMarginpnl)
  let availableMarginpnlstring = availableMargin >= 0 ? "₹" + Number(availableMargin).toLocaleString() : "₹" + (-Number(availableMargin)).toLocaleString()
  rows.OpeningBalance = openingBalance
  let usedMargin = runninglotnumber == 0 ? openingBalance - availableMargin : openingBalance - availableMargin + runningPnl
  let usedMarginString = usedMargin >= 0 ? "+₹" + Number(usedMargin).toLocaleString() : "-₹" + (-Number(usedMargin)).toLocaleString()
  let payInAmount = payIn && (payIn[0] ? Number(payIn[0].totalCredit) : 0)
  let payInString = payInAmount >= 0 ? "+₹" + Number(payInAmount).toLocaleString() : "-₹" + (-Number(payInAmount)).toLocaleString()
  
  

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
                    icon={<CreditCardIcon/>}
                    title="total credit"
                    description="Total funds added by ninepointer"
                    value={totalCreditString}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={2.4}>
                  <DefaultInfoCard
                    icon={<AvailableIcon/>}
                    title="available margin"
                    description="Funds that you can used to trade today"
                    value={availableMarginpnlstring}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={2.4}>
                  <DefaultInfoCard
                    icon={<ShoppingCartIcon/>}
                    title="used margin"
                    description="Net funds utilized for your executed trades"
                    value={usedMarginString}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={2.4}>
                  <DefaultInfoCard
                    icon={<CurrencyRupeeIcon/>}
                    title="Payin"
                    description="Funds added in your trading account today"
                    value={payInString}
                  />
                </Grid>
                <Grid item xs={16} md={8} xl={2.4}>
                  <DefaultInfoCard
                    icon={<AccountBalanceWalletIcon/>}
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

export default MarginGrid;