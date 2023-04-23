import React,{useState, useEffect, memo, useContext} from 'react'
import Grid from '@mui/material/Grid'
import MDTypography from '../../../../components/MDTypography'
import MDButton from '../../../../components/MDButton'
import axios from "axios";
import { CircularProgress } from "@mui/material";
import  { marketDataContext } from '../../../../MarketDataContext';
import { NetPnlContext } from '../../../../PnlContext';
import ExitPosition from './ExitPosition';


function MYPNLData({contestId, portfolioId, socket, Render, isFromHistory}){
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  // const [marketDetails.contestMarketData, setMarketData] = useState([]);
  const marketDetails = useContext(marketDataContext)
  const { updateContestNetPnl } = useContext(NetPnlContext);
  const [tradeData, setTradeData] = useState([]);
  const [isLoading,setIsLoading] = useState(true)
  const {render, setReRender} = Render
  let totalTransactionCost = 0;
  let totalGrossPnl = 0;
  let totalRunningLots = 0;


  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/getliveprice`)
    .then((res) => {
      marketDetails.setContestMarketData(res.data);
    }).catch((err) => {
        return new Error(err);
    })
  },[])

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

  console.log("market data", marketDetails.contestMarketData)

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
          
          <Grid item xs={12} md={12} lg={4} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700, fontSize: "10px"}}>Instrument</MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={1.6} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700, fontSize: "10px"}}>Quantity</MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={1.6} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700, fontSize: "10px"}}>Avg. Price</MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={1.6} display="flex" justifyContent="center">
            <MDTypography fontSize={13} color="light" style={{fontWeight:700, fontSize: "10px"}}>LTP</MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={1.6} display="flex" justifyContent="center">
          <MDTypography fontSize={13} color="light" style={{fontWeight:700, fontSize: "10px"}}>Gross P&L</MDTypography>
          </Grid>

          <Grid item xs={12} md={12} lg={1.6} display="flex" justifyContent="center">
          <MDTypography fontSize={13} color="light" style={{fontWeight:700, fontSize: "10px"}}>Exit</MDTypography>
          </Grid>


      </Grid>


      {tradeData?.map((subelem, index)=>{
      let liveDetail = marketDetails.contestMarketData.filter((elem)=>{
        return subelem._id.instrumentToken == elem.instrument_token;
      })
      totalRunningLots += Number(subelem.lots)

      let updatedValue = (liveDetail.length && liveDetail[0]?.last_price) ? (subelem.amount+(subelem.lots)*liveDetail[0]?.last_price) : subelem.amount;
      console.log("updatedValue", updatedValue, liveDetail.length , liveDetail[0]?.last_price, subelem.amount+(subelem.lots)*liveDetail[0]?.last_price, subelem.lots, (subelem.lots)*liveDetail[0]?.last_price)
      totalGrossPnl += updatedValue;

      totalTransactionCost += Number(subelem.brokerage);

      updateContestNetPnl(totalGrossPnl-totalTransactionCost,totalRunningLots);
      const instrumentcolor = subelem?._id?.symbol?.slice(-2) == "CE" ? "success" : "error"
      const quantitycolor = subelem?.lots >= 0 ? "success" : "error"
      const gpnlcolor = updatedValue >= 0 ? "success" : "error"

      return(

        <Grid key={subelem._id.symbol} container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}} alignItems="center">
          
        <Grid item xs={12} md={12} lg={4} display="flex" justifyContent="center">
          <MDTypography component="a" variant="caption" color={instrumentcolor} style={{fontWeight:500, fontSize: "12px"}}>
            {(subelem._id.symbol)}
          </MDTypography>
        </Grid>

        <Grid item xs={12} md={12} lg={1.6} display="flex" justifyContent="center">
          <MDTypography component="a" variant="caption" color={quantitycolor} style={{fontWeight:500, fontSize: "12px"}}>
            {subelem.lots}
          </MDTypography>
        </Grid>

        <Grid item xs={12} md={12} lg={1.6} display="flex" justifyContent="center">
          <MDTypography component="a" variant="caption" color="text" style={{fontWeight:500, fontSize: "12px"}}>
            {"₹"+subelem?.lastaverageprice?.toFixed(2)}
          </MDTypography>
        </Grid>

        <Grid item xs={12} md={12} lg={1.6} display="flex" justifyContent="center">
          {((liveDetail[0]?.last_price)) ?
          <MDTypography component="a" variant="caption" color="text" style={{fontWeight:500, fontSize: "12px"}}>
            {(liveDetail[0]?.last_price) ? "₹"+(liveDetail[0]?.last_price)?.toFixed(2) : "₹"+0.00}
          </MDTypography>
          :
          <MDTypography component="a" variant="caption" color="dark" style={{fontWeight:500, fontSize: "12px"}}>
            {(liveDetail.length && liveDetail[0]?.last_price) ? "₹"+(liveDetail[0]?.last_price) : "₹"+0.00}
          </MDTypography>
          }
        </Grid>

        <Grid item xs={12} md={12} lg={1.6} display="flex" justifyContent="center">
          <MDTypography component="a" variant="caption" color={gpnlcolor} style={{fontWeight:500, fontSize: "12px"}}>
            {updatedValue !== undefined ? (updatedValue >= 0.00 ? "+₹" + updatedValue?.toFixed(2): "-₹" + (-updatedValue).toFixed(2)) : (subelem?.amount)?.toFixed(2)}
          </MDTypography>
        </Grid>

        <Grid item xs={12} md={12} lg={1.6} display="flex" justifyContent="center">
            < ExitPosition isFromHistory={isFromHistory} Render={{render, setReRender}} contestId={contestId} portfolioId={portfolioId} product={(subelem._id.product)} symbol={(subelem._id.symbol)} quantity= {subelem.lots} instrumentToken={subelem._id.instrumentToken} exchange={subelem._id.exchange}/>
        </Grid>
        </Grid>

      )})
      }

        <Grid container  mt={1} mb={2} p={1} style={{border:'1px solid white',borderRadius:4, }}>
      
            <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
              <MDTypography fontSize={10} color="light">Open Quantity : {totalRunningLots}</MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
              <MDTypography fontSize={10} color={`${totalGrossPnl >= 0 ? 'success' : 'error'}`}>Gross P&L : {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)): "-₹" + ((-totalGrossPnl).toFixed(2))}</MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
              <MDTypography fontSize={10} color="light">Brokerage : {"₹"+(totalTransactionCost).toFixed(2)}</MDTypography>
            </Grid>
            <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
              <MDTypography fontSize={10} color={`${(totalGrossPnl-totalTransactionCost) > 0 ? 'success' : 'error'}`}>Net P&L : {(totalGrossPnl-totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnl-totalTransactionCost).toFixed(2)): "-₹" + ((-(totalGrossPnl-totalTransactionCost)).toFixed(2))}</MDTypography>
            </Grid>

        </Grid>
        </>
        }

    </>
);
}

export default memo(MYPNLData);