import React,{useState, useEffect, memo, useContext} from 'react'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../../components/MDTypography'
import MDButton from '../../../../components/MDButton'
import axios from "axios";
import { CircularProgress } from "@mui/material";
import  { marketDataContext } from '../../../../MarketDataContext';



function MYPNLData({contestId, portfolioId, socket, Render, isFromHistory}){
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  // const [marketDetails.contestMarketData, setMarketData] = useState([]);
  const marketDetails = useContext(marketDataContext)

  const [tradeData, setTradeData] = useState([]);
  const [isLoading,setIsLoading] = useState(true)
  const {render, setReRender} = Render
  let totalTransactionCost = 0;
  let totalGrossPnl = 0;
  let totalRunningLots = 0;



  useEffect(()=>{
    let abortController;
      (async () => {
        abortController = new AbortController();
        let signal = abortController.signal;    

        // the signal is passed into the request(s) we want to abort using this controller
        const { data } = await axios.get(
         `${baseUrl}api/v1/contest/${contestId}/trades/pnl?portfolioId=${portfolioId}`,
           
           {
             withCredentials: true,
             headers: {
                 Accept: "application/json",
                 "Content-Type": "application/json",
                 "Access-Control-Allow-Credentials": true
             },
           },
           { signal: signal }
        );

        console.log("in mypnl", data)
        if(data){
         setTradeData(data);
         setIsLoading(false)
        }

    })();

    return () => abortController.abort();
  }, [render])
  // }, [marketDetails.contestMarketData, render])

  // useEffect(()=>{
  //   let abortController;
  //   (async () => {
  //     abortController = new AbortController();
  //     let signal = abortController.signal;    

  //     // the signal is passed into the request(s) we want to abort using this controller
  //     const { data } = await axios.get(
  //      `${baseUrl}api/v1/contest/${contestId}/trades/historyPnl?portfolioId=${portfolioId}`,
         
  //        {
  //          withCredentials: true,
  //          headers: {
  //              Accept: "application/json",
  //              "Content-Type": "application/json",
  //              "Access-Control-Allow-Credentials": true
  //          },
  //        },
  //        { signal: signal }
  //     );

  //     console.log("in mypnl", data)
  //     if(data){
  //      setTradeData(data);
  //      setIsLoading(false)
  //     }

  //   })();
  // }, [])



  console.log("in mypnl", tradeData)

return (
    <>
      <Grid container mt={2}>
        <Grid item xs={12} md={12} lg={12}>
          <MDTypography fontSize={13} color="light">My P&L</MDTypography>
        </Grid>
      </Grid>


      {isLoading ?
      <Grid mt={1} mb={1} display="flex" width="100%" justifyContent="center" alignItems="center">
        <CircularProgress color="light" />
      </Grid>

      :
      <>

      <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
          
          <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Instrument</MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Quantity</MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Avg. Price</MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>LTP</MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
          <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>Gross P&L</MDTypography>
          </Grid>


      </Grid>


      {tradeData?.map((subelem, index)=>{
      let liveDetail = marketDetails.contestMarketData.filter((elem)=>{
        return subelem._id.instrumentToken == elem.instrument_token;
      })
      totalRunningLots += Number(subelem.lots)

      let updatedValue = (liveDetail.length && liveDetail[0]?.last_price) ? (subelem.amount+(subelem.lots)*liveDetail[0]?.last_price) : subelem.amount;
      totalGrossPnl += updatedValue;

      totalTransactionCost += Number(subelem.brokerage);
      const instrumentcolor = subelem?._id?.symbol?.slice(-2) == "CE" ? "success" : "error"
      const quantitycolor = subelem?.lots >= 0 ? "success" : "error"
      const gpnlcolor = updatedValue >= 0 ? "success" : "error"

      return(

        <Grid key={subelem._id.symbol} container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
          
        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
          {/* <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>NIFTY13042023CE</MDTypography> */}
          <MDTypography component="a" variant="caption" color={instrumentcolor} style={{fontWeight:700}}>
            {(subelem._id.symbol)}
          </MDTypography>
        </Grid>

        <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
          {/* <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>250</MDTypography> */}
          <MDTypography component="a" variant="caption" color={quantitycolor} style={{fontWeight:700}}>
            {subelem.lots}
          </MDTypography>
        </Grid>

        <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
          {/* <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>135</MDTypography> */}
          <MDTypography component="a" variant="caption" color="text" style={{fontWeight:700}}>
            {"₹"+subelem?.lastaverageprice?.toFixed(2)}
          </MDTypography>
        </Grid>

        <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
          {/* <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>140</MDTypography> */}
          {((liveDetail[0]?.last_price)) ?
          <MDTypography component="a" variant="caption" color="text" style={{fontWeight:700}}>
            {/* {"₹"+(liveDetail[0]?.last_price)?.toFixed(2)} */}
            {(liveDetail[0]?.last_price) ? "₹"+(liveDetail[0]?.last_price)?.toFixed(2) : "₹"+0.00}
          </MDTypography>
          :
          <MDTypography component="a" variant="caption" color="dark" style={{fontWeight:700}}>
            {(liveDetail.length && liveDetail[0]?.last_price) ? "₹"+(liveDetail[0]?.last_price) : "₹"+0.00}
          </MDTypography>
          }
        </Grid>

        <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
        {/* <MDTypography fontSize={13} color="light" style={{fontWeight:700}}>+1250</MDTypography> */}
          <MDTypography component="a" variant="caption" color={gpnlcolor} style={{fontWeight:700}}>
            {updatedValue ? (updatedValue >= 0.00 ? "+₹" + updatedValue?.toFixed(2): "-₹" + (-updatedValue).toFixed(2)) : (subelem?.amount)?.toFixed(2)}
          </MDTypography>
        </Grid>


        </Grid>

      )})
      }

        <Grid container  mt={1} mb={2} p={1} style={{border:'1px solid white',borderRadius:4, }}>
      
            <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
              <MDTypography fontSize={13} color="light">Open Quantity : {totalRunningLots}</MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
              <MDTypography fontSize={13} color={`${totalGrossPnl >= 0 ? 'success' : 'error'}`}>Gross P&L : {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)): "-₹" + ((-totalGrossPnl).toFixed(2))}</MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
              <MDTypography fontSize={13} color="light">Brokerage : {"₹"+(totalTransactionCost).toFixed(2)}</MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
              <MDTypography fontSize={13} color={`${(totalGrossPnl-totalTransactionCost) > 0 ? 'success' : 'error'}`}>Net P&L : {(totalGrossPnl-totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnl-totalTransactionCost).toFixed(2)): "-₹" + ((-(totalGrossPnl-totalTransactionCost)).toFixed(2))}</MDTypography>
            </Grid>

        </Grid>
        </>
        }

    </>
);
}

export default memo(MYPNLData);