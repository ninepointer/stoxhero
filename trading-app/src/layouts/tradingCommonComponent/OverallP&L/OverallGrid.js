
// import React, {useEffect, useState, useContext} from 'react'
// import Card from "@mui/material/Card";
// import axios from "axios";
// import { NetPnlContext } from '../../../PnlContext';
// import { Typography } from "@mui/material";
// import TableContainer from '@mui/material/TableContainer';
// import Paper from '@mui/material/Paper';
// import { Tooltip } from '@mui/material';
// import Grid from '@mui/material/Grid'


// // Material Dashboard 2 React components

// import { GrAnchor } from "react-icons/gr";


// // Data

// // import OverallPL from './Overall P&L';
// // import DataTable from '../../../examples/Tables/DataTable';
// import MDBox from '../../../components/MDBox';
// import MDTypography from '../../../components/MDTypography';
// import { userContext } from '../../../AuthContext';
// import MDButton from '../../../components/MDButton';
// import ExitPosition from './ExitPosition';
// import Buy from "../../tradingCommonComponent/BuyModel";
// import Sell from "../../tradingCommonComponent/SellModel"
// import OverallRow from './OverallRow';
// import { marketDataContext } from '../../../MarketDataContext';

// // import Button from '@mui/material/Button';

// function OverallGrid({socket, reRender, setReRender , setIsGetStartedClicked, from}) {
//   console.log("rendering in userPosition: overallPnl")
//   let styleTD = {
//     textAlign: "center",
//     fontSize: "11px",
//     fontWeight: "900",
//     color: "#7b809a",
//     opacity: 0.7,
//     // padding: "50px"
//   }
//   let styleBottomRow = {
//     textAlign: "center", 
//     fontSize: ".75rem", 
//     color: "#003366", 
//     backgroundColor: "#CCCCCC", 
//     borderRadius: "5px", 
//     padding: "5px",  
//     fontWeight: "600",
//   }

  
//   const { updateInfinityNetPnl } = useContext(NetPnlContext);
//   const { updateNetPnl } = useContext(NetPnlContext);
//   const marketDetails = useContext(marketDataContext)
//   const getDetails = useContext(userContext);
//   let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
//   const [tradeData, setTradeData] = useState([]);
//   const countPosition = {
//     openPosition: 0,
//     closePosition: 0
//   };
//   let totalTransactionCost = 0;
//   let totalGrossPnl = 0;
//   let totalRunningLots = 0;
//   let rows = [];
//   let pnlEndPoint = from === "paperTrade" ? "paperTrade/pnl" : from === "algoTrader" && "infinityTrade/pnl";


//     useEffect(()=>{

//       let abortController;
//       (async () => {
//            abortController = new AbortController();
//            let signal = abortController.signal;    

//            // the signal is passed into the request(s) we want to abort using this controller
//            const { data } = await axios.get(`${baseUrl}api/v1/${pnlEndPoint}`,{
//            withCredentials: true,
//            headers: {
//                Accept: "application/json",
//                "Content-Type": "application/json",
//                "Access-Control-Allow-Credentials": true
//            },
//            signal: signal }
//            );
//            setTradeData(data.data);

//       })();

//       return () => abortController.abort();
//     }, [reRender])
//   // }, [marketDetails.marketData, reRender])

//     // useEffect(() => {
//     //   return () => {
//     //       socket.emit('removeKey', socket.id);
//     //       socket.close();
//     //   }
//     // }, [])
//     console.log("tradeData", tradeData)

//     tradeData.map((subelem, index)=>{
//       let obj = {};
//       let liveDetail = marketDetails.marketData.filter((elem)=>{
//         // console.log("elem", elem, subelem)
//         return subelem._id.instrumentToken == elem.instrument_token;
//       })
//       totalRunningLots += Number(subelem.lots)

//       let updatedValue = (subelem.amount+(subelem.lots)*liveDetail[0]?.last_price);
//       let netupdatedValue = updatedValue - Number(subelem.brokerage);
//       totalGrossPnl += updatedValue;

//       totalTransactionCost += Number(subelem.brokerage);
//       let lotSize = (subelem._id.symbol).includes("BANKNIFTY") ? 25 : 50;

//       from === "paperTrade" ? 
//       updateNetPnl(totalGrossPnl-totalTransactionCost,totalRunningLots, totalGrossPnl, totalTransactionCost)
//       :
//       from === "algoTrader" &&
//       updateInfinityNetPnl(totalGrossPnl-totalTransactionCost);


      
//       const instrumentcolor = subelem._id.symbol.slice(-2) == "CE" ? "success" : "error"
//       const quantitycolor = subelem.lots >= 0 ? "success" : "error"
//       const gpnlcolor = updatedValue >= 0 ? "success" : "error"
//       const pchangecolor = (liveDetail[0]?.change) >= 0 ? "success" : "error"
//       const productcolor =  subelem._id.product === "NRML" ? "info" : subelem._id.product == "MIS" ? "warning" : "error"

//       obj.Product = (
//         <MDTypography component="a" variant="caption" color={productcolor} fontWeight="medium">
//           {(subelem._id.product)}
//         </MDTypography>
//       );

//       obj.symbol = (
//         <MDTypography component="a" variant="caption" color={instrumentcolor} fontWeight="medium">
//           {(subelem._id.symbol)}
//         </MDTypography>
//       );

//       obj.Quantity = (
//         <MDTypography component="a" variant="caption" color={quantitycolor} fontWeight="medium">
//           {subelem.lots}
//         </MDTypography>
//       );

//       obj.avgPrice = (
//         <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
//           {"₹"+subelem.lastaverageprice.toFixed(2)}
//         </MDTypography>
//       );

//       if((liveDetail[0]?.last_price)){
//         obj.last_price = (
//           <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
//             {"₹"+(liveDetail[0]?.last_price).toFixed(2)}
//           </MDTypography>
//         );
//       } else{
//         obj.last_price = (
//           <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
//             {"₹"+(liveDetail[0]?.last_price)}
//           </MDTypography>
//         );
//       }

//       obj.grossPnl = (
//         <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
//           {updatedValue >= 0.00 ? "+₹" + (updatedValue.toFixed(2)): "-₹" + ((-updatedValue).toFixed(2))}
//         </MDTypography>
//       );

//       obj.netPnl = (
//         <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
//           {netupdatedValue >= 0.00 ? "+₹" + (netupdatedValue.toFixed(2)): "-₹" + ((-netupdatedValue).toFixed(2))}
//         </MDTypography>
//       );

//       if((liveDetail[0]?.change)){
//         obj.change = (
//           <MDTypography component="a" variant="caption" color={pchangecolor} fontWeight="medium">
//             {(liveDetail[0]?.change).toFixed(2)+"%"}
//           </MDTypography>
//         );
//       } else{
//         console.log((liveDetail[0]?.last_price, liveDetail[0]?.average_price), liveDetail[0]?.average_price);
//         obj.change = (
//           <MDTypography component="a" variant="caption" color={pchangecolor} fontWeight="medium">
//             {liveDetail[0]?.average_price ? (((liveDetail[0]?.last_price-liveDetail[0]?.average_price)/liveDetail[0]?.average_price)*100).toFixed(2)+"%" : "0.00%"}
//           </MDTypography>
//         );
//       }
//       obj.exit = (
//         < ExitPosition from={from} reRender={reRender} setReRender={setReRender} product={(subelem._id.product)} symbol={(subelem._id.symbol)} quantity= {subelem.lots} instrumentToken={subelem._id.instrumentToken} exchange={subelem._id.exchange}/>
//       );
//       obj.buy = (
//         <Buy from={from} reRender={reRender} setReRender={setReRender} symbol={subelem._id.symbol} exchange={subelem._id.exchange} instrumentToken={subelem._id.instrumentToken} symbolName={(subelem._id.symbol).slice(-7)} lotSize={lotSize} maxLot={lotSize*36} ltp={(liveDetail[0]?.last_price)?.toFixed(2)}/>
//       );
      
//       obj.sell = (
//         <Sell from={from} reRender={reRender} setReRender={setReRender} symbol={subelem._id.symbol} exchange={subelem._id.exchange} instrumentToken={subelem._id.instrumentToken} symbolName={(subelem._id.symbol).slice(-7)} lotSize={lotSize} maxLot={lotSize*36} ltp={(liveDetail[0]?.last_price)?.toFixed(2)}/>
//       );

//       if(subelem.lots != 0){
//         countPosition.openPosition += 1;
//         rows.unshift(obj);
//       } else{
//         countPosition.closePosition += 1;
//         rows.push(obj);
//       }

//     })


//   return (
//     <Card>
//       <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
//         <MDBox>
//           <MDTypography variant="h6" gutterBottom>
//             {`My Positions (Open P: ${countPosition.openPosition} | Close P: ${countPosition.closePosition})`}
//           </MDTypography>
//         </MDBox>
//       </MDBox>
//       {rows.length === 0 ? (
//       <MDBox display="flex" flexDirection="column" mb={4} sx={{alignItems:"center"}}>
//         <GrAnchor style={{fontSize: '30px'}}/>
//         <Typography style={{fontSize: '20px', color:"grey"}}>No open positions yet</Typography>
//         <Typography mb={2} fontSize={15} color="grey">Add instruments and start trading.</Typography>
//         <MDButton variant="outlined" size="small" color="info" onClick={()=>{setIsGetStartedClicked(true)}}>Get Started</MDButton>
//       </MDBox>)
//       :

//       (<MDBox>
//         <TableContainer component={Paper}>
//         <Grid container mt={0.5} p={0} style={{borderBottom:'1px solid #D3D3D3',borderRadius:4}}>
          
//           <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
//             <MDTypography color="#7b809a" style={{textAlign: "center", fontSize: "11px", fontWeight: "900", color: "#7b809a", opacity: 0.7}}>PRODUCT</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={2} display="flex" justifyContent="center">
//             <MDTypography color="#7b809a" style={{textAlign: "center", fontSize: "11px", fontWeight: "900", color: "#7b809a", opacity: 0.7}}>INSTRUMENT</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
//             <MDTypography color="#7b809a" style={{textAlign: "center", fontSize: "11px", fontWeight: "900", color: "#7b809a", opacity: 0.7}}>QUANTITY</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
//             <MDTypography color="#7b809a" style={{textAlign: "center", fontSize: "11px", fontWeight: "900", color: "#7b809a", opacity: 0.7}}>AVG. PRICE</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
//           <MDTypography color="#7b809a" style={{textAlign: "center", fontSize: "11px", fontWeight: "900", color: "#7b809a", opacity: 0.7}}>LTP</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
//           <MDTypography color="#7b809a" style={{textAlign: "center", fontSize: "11px", fontWeight: "900", color: "#7b809a", opacity: 0.7}}>GROSS P&L</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
//             <MDTypography color="#7b809a" style={{textAlign: "center", fontSize: "11px", fontWeight: "900", color: "#7b809a", opacity: 0.7}}>NET P&L</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
//             <MDTypography color="#7b809a" style={{textAlign: "center", fontSize: "11px", fontWeight: "900", color: "#7b809a", opacity: 0.7}}>CHANGE(%)</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
//             <MDTypography color="#7b809a" style={{textAlign: "center", fontSize: "11px", fontWeight: "900", color: "#7b809a", opacity: 0.7}}>EXIT</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
//           <MDTypography color="#7b809a" style={{textAlign: "center", fontSize: "11px", fontWeight: "900", color: "#7b809a", opacity: 0.7}}>BUY</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
//           <MDTypography color="#7b809a" style={{textAlign: "center", fontSize: "11px", fontWeight: "900", color: "#7b809a", opacity: 0.7}}>SELL</MDTypography>
//           </Grid>


//         </Grid>
//               {rows.map((elem)=>{
//                 return(
//                   <>
//               <Grid container mt={0.5} p={0} style={{borderBottom:'1px solid #D3D3D3',borderRadius:4}}>
//                   <OverallRow 
//                     quantity={elem?.Quantity?.props?.children}
//                     symbol={elem?.symbol?.props?.children}
//                     product={elem?.Product?.props?.children}
//                     avgPrice={elem?.avgPrice?.props?.children}
//                     last_price={elem?.last_price?.props?.children}
//                     grossPnl={elem?.grossPnl?.props?.children}
//                     netPnl={elem?.netPnl?.props?.children}
//                     change={elem?.change?.props?.children}
//                   />
//                   {/* <MDBox display='flex' alignItems='center' textAlign= "center"> */}
//                   <Tooltip title="Exit Your Position" placement="top">
//                   <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center" alignItems='center'>
//                     <MDTypography  color="#7b809a" style={{textAlign: "center", fontSize: ".75rem", fontWeight: "600"}}>{elem?.exit}</MDTypography>
//                   </Grid>
//                   </Tooltip>
//                   <Tooltip title="Buy" placement="top">
//                   <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center" alignItems='center'>
//                     <MDTypography fontSize={13} color="#7b809a" style={{textAlign: "center", fontSize: ".75rem", fontWeight: "600"}}>{elem?.buy}</MDTypography>
//                   </Grid>
//                   </Tooltip>
//                   <Tooltip title="Sell" placement="top">
//                   <Grid item xs={12} md={12} lg={1} display="flex" justifyContent="center">
//                     <MDTypography fontSize={13} color="#7b809a" style={{textAlign: "center", fontSize: ".75rem", fontWeight: "600"}}>{elem?.sell}</MDTypography>
//                   </Grid>
//                   </Tooltip>
//                   {/* </MDBox> */}
      
//                 </Grid>
//               </>

//                 )
//               })} 

//         <Grid container  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
//           <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
//             <MDTypography fontSize={".75rem"} backgroundColor= "#CCCCCC" color="#003366" style={{borderRadius: "5px", padding: "5px", fontWeight: "600"}}>Running Lots: {totalRunningLots}</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
//             <MDTypography fontSize={".75rem"} backgroundColor= "#CCCCCC" color="#003366" style={{borderRadius: "5px", padding: "5px", fontWeight: "600"}}>Brokerage: {"₹"+(totalTransactionCost).toFixed(2)}</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
//             <MDTypography fontSize={".75rem"} backgroundColor= "#CCCCCC" color={`${totalGrossPnl > 0 ? 'success' : 'error'}`} style={{borderRadius: "5px", padding: "5px", fontWeight: "600"}}>Gross P&L: {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)): "-₹" + ((-totalGrossPnl).toFixed(2))}</MDTypography>
//           </Grid>

//           <Grid item xs={12} md={12} lg={3} display="flex" justifyContent="center">
//             <MDTypography fontSize={".75rem"} backgroundColor= "#CCCCCC" color={`${(totalGrossPnl-totalTransactionCost) > 0 ? 'success' : 'error'}`} style={{borderRadius: "5px", padding: "5px", fontWeight: "600"}}>Net P&L: {(totalGrossPnl-totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnl-totalTransactionCost).toFixed(2)): "-₹" + ((-(totalGrossPnl-totalTransactionCost)).toFixed(2))}</MDTypography>
//           </Grid>
//         </Grid>
//         {/* </tbody>
//         </table> */}
//         </TableContainer>
//       </MDBox>
//       )
//       }
//     </Card>
//   );

// }
// export default OverallGrid;



import React, {useEffect, useState, useContext} from 'react'
import Card from "@mui/material/Card";
import axios from "axios";
import { NetPnlContext } from '../../../PnlContext';
import { Typography } from "@mui/material";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { Tooltip } from '@mui/material';

// Material Dashboard 2 React components

import { GrAnchor } from "react-icons/gr";


// Data

// import OverallPL from './Overall P&L';
// import DataTable from '../../../examples/Tables/DataTable';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { userContext } from '../../../AuthContext';
import MDButton from '../../../components/MDButton';
import ExitPosition from './ExitPosition';
import Buy from "../../tradingCommonComponent/BuyModel";
import Sell from "../../tradingCommonComponent/SellModel"
import OverallRow from './OverallRow';
import { marketDataContext } from '../../../MarketDataContext';
import Grid from '@mui/material/Grid'
// import Button from '@mui/material/Button';

function OverallGrid({socket, reRender, setReRender , setIsGetStartedClicked, from}) {
  console.log("rendering in userPosition: overallPnl")
  let styleTD = {
    textAlign: "center",
    fontSize: "9px",
    fontWeight: "800",
    color: "#7b809a",
    opacity: 0.7,
    // padding: "50px"
  }
  let styleBottomRow = {
    textAlign: "center", 
    fontSize: ".75rem", 
    color: "#003366", 
    backgroundColor: "#CCCCCC", 
    borderRadius: "5px", 
    padding: "5px",  
    fontWeight: "600",
  }

  
  const { updateInfinityNetPnl } = useContext(NetPnlContext);
  const { updateNetPnl } = useContext(NetPnlContext);
  const marketDetails = useContext(marketDataContext)
  const getDetails = useContext(userContext);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [tradeData, setTradeData] = useState([]);
  const countPosition = {
    openPosition: 0,
    closePosition: 0
  };
  let totalTransactionCost = 0;
  let totalGrossPnl = 0;
  let totalRunningLots = 0;
  let rows = [];
  let pnlEndPoint = from === "paperTrade" ? "paperTrade/pnl" : from === "algoTrader" && "infinityTrade/pnl";


    useEffect(()=>{

      let abortController;
      (async () => {
           abortController = new AbortController();
           let signal = abortController.signal;    

           // the signal is passed into the request(s) we want to abort using this controller
           const { data } = await axios.get(`${baseUrl}api/v1/${pnlEndPoint}`,{
           withCredentials: true,
           headers: {
               Accept: "application/json",
               "Content-Type": "application/json",
               "Access-Control-Allow-Credentials": true
           },
           signal: signal }
           );
           setTradeData(data.data);

      })();

      return () => abortController.abort();
    }, [reRender])
  // }, [marketDetails.marketData, reRender])

    // useEffect(() => {
    //   return () => {
    //       socket.emit('removeKey', socket.id);
    //       socket.close();
    //   }
    // }, [])
    console.log("tradeData", tradeData)

    tradeData.map((subelem, index)=>{
      let obj = {};
      let liveDetail = marketDetails.marketData.filter((elem)=>{
        // console.log("elem", elem, subelem)
        return subelem._id.instrumentToken == elem.instrument_token;
      })
      totalRunningLots += Number(subelem.lots)

      let updatedValue = (subelem.amount+(subelem.lots)*liveDetail[0]?.last_price);
      let netupdatedValue = updatedValue - Number(subelem.brokerage);
      totalGrossPnl += updatedValue;

      totalTransactionCost += Number(subelem.brokerage);
      let lotSize = (subelem._id.symbol).includes("BANKNIFTY") ? 25 : 50;

      from === "paperTrade" ? 
      updateNetPnl(totalGrossPnl-totalTransactionCost,totalRunningLots, totalGrossPnl, totalTransactionCost)
      :
      from === "algoTrader" &&
      updateInfinityNetPnl(totalGrossPnl-totalTransactionCost);


      
      const instrumentcolor = subelem._id.symbol.slice(-2) == "CE" ? "success" : "error"
      const quantitycolor = subelem.lots >= 0 ? "success" : "error"
      const gpnlcolor = updatedValue >= 0 ? "success" : "error"
      const pchangecolor = (liveDetail[0]?.change) >= 0 ? "success" : "error"
      const productcolor =  subelem._id.product === "NRML" ? "info" : subelem._id.product == "MIS" ? "warning" : "error"

      obj.Product = (
        <MDTypography component="a" variant="caption" color={productcolor} fontWeight="medium">
          {(subelem._id.product)}
        </MDTypography>
      );

      obj.symbol = (
        <MDTypography component="a" variant="caption" color={instrumentcolor} fontWeight="medium">
          {(subelem._id.symbol)}
        </MDTypography>
      );

      obj.Quantity = (
        <MDTypography component="a" variant="caption" color={quantitycolor} fontWeight="medium">
          {subelem.lots}
        </MDTypography>
      );

      obj.avgPrice = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {"₹"+subelem.lastaverageprice.toFixed(2)}
        </MDTypography>
      );

      if((liveDetail[0]?.last_price)){
        obj.last_price = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {"₹"+(liveDetail[0]?.last_price).toFixed(2)}
          </MDTypography>
        );
      } else{
        obj.last_price = (
          <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
            {"₹"+(liveDetail[0]?.last_price)}
          </MDTypography>
        );
      }

      obj.grossPnl = (
        <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
          {updatedValue >= 0.00 ? "+₹" + (updatedValue.toFixed(2)): "-₹" + ((-updatedValue).toFixed(2))}
        </MDTypography>
      );

      obj.netPnl = (
        <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
          {netupdatedValue >= 0.00 ? "+₹" + (netupdatedValue.toFixed(2)): "-₹" + ((-netupdatedValue).toFixed(2))}
        </MDTypography>
      );

      if((liveDetail[0]?.change)){
        obj.change = (
          <MDTypography component="a" variant="caption" color={pchangecolor} fontWeight="medium">
            {(liveDetail[0]?.change).toFixed(2)+"%"}
          </MDTypography>
        );
      } else{
        console.log((liveDetail[0]?.last_price, liveDetail[0]?.average_price), liveDetail[0]?.average_price);
        obj.change = (
          <MDTypography component="a" variant="caption" color={pchangecolor} fontWeight="medium">
            {liveDetail[0]?.average_price ? (((liveDetail[0]?.last_price-liveDetail[0]?.average_price)/liveDetail[0]?.average_price)*100).toFixed(2)+"%" : "0.00%"}
          </MDTypography>
        );
      }
      obj.exit = (
        < ExitPosition from={from} reRender={reRender} setReRender={setReRender} product={(subelem._id.product)} symbol={(subelem._id.symbol)} quantity= {subelem.lots} instrumentToken={subelem._id.instrumentToken} exchange={subelem._id.exchange}/>
      );
      obj.buy = (
        <Buy from={from} reRender={reRender} setReRender={setReRender} symbol={subelem._id.symbol} exchange={subelem._id.exchange} instrumentToken={subelem._id.instrumentToken} symbolName={(subelem._id.symbol).slice(-7)} lotSize={lotSize} maxLot={lotSize*36} ltp={(liveDetail[0]?.last_price)?.toFixed(2)}/>
      );
      
      obj.sell = (
        <Sell from={from} reRender={reRender} setReRender={setReRender} symbol={subelem._id.symbol} exchange={subelem._id.exchange} instrumentToken={subelem._id.instrumentToken} symbolName={(subelem._id.symbol).slice(-7)} lotSize={lotSize} maxLot={lotSize*36} ltp={(liveDetail[0]?.last_price)?.toFixed(2)}/>
      );

      if(subelem.lots != 0){
        countPosition.openPosition += 1;
        rows.unshift(obj);
      } else{
        countPosition.closePosition += 1;
        rows.push(obj);
      }

    })


  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            {`My Positions (Open P: ${countPosition.openPosition} | Close P: ${countPosition.closePosition})`}
          </MDTypography>
        </MDBox>
      </MDBox>
      {rows.length === 0 ? (
      <MDBox display="flex" flexDirection="column" mb={4} sx={{alignItems:"center"}}>
        <GrAnchor style={{fontSize: '30px'}}/>
        <Typography style={{fontSize: '20px', color:"grey"}}>No open positions yet</Typography>
        <Typography mb={2} fontSize={15} color="grey">Add instruments and start trading.</Typography>
        <MDButton variant="outlined" size="small" color="info" onClick={()=>{setIsGetStartedClicked(true)}}>Get Started</MDButton>
      </MDBox>)
      :

      (<MDBox>
        <TableContainer component={Paper}>
          <table style={{ borderCollapse: "collapse", width: "100%", borderSpacing: "10px 5px"}}>
            <thead>
              <tr style={{borderBottom: "1px solid #D3D3D3"}}>
                {/* <td style={{...styleTD, paddingLeft: "20px"}} >PRODUCT</td> */}
                <td style={{...styleTD, paddingLeft: "5px"}} >INSTRUMENT</td>
                <td style={styleTD}>QUANTITY</td>
                <td style={styleTD} >AVG. PRICE</td>
                <td style={styleTD} >LTP</td>
                <td style={styleTD} >GROSS P&L</td>
                {/* <td style={styleTD} >NET P&L</td> */}
                <td style={styleTD} >CHANGE(%)</td>
                <td style={styleTD} >EXIT</td>
                <td style={styleTD} >BUY</td>
                <td style={{...styleTD, paddingRight: "20px"}} >SELL</td>
              </tr>
            </thead>
            <tbody>

              {rows.map((elem)=>{
                return(
                  <>
              <tr
              style={{borderBottom: "1px solid #D3D3D3"}}  key={elem.symbol.props.children}
              >
                  <OverallRow
                    quantity={elem?.Quantity?.props?.children}
                    symbol={elem?.symbol?.props?.children}
                    product={elem?.Product?.props?.children}
                    avgPrice={elem?.avgPrice?.props?.children}
                    last_price={elem?.last_price?.props?.children}
                    grossPnl={elem?.grossPnl?.props?.children}
                    netPnl={elem?.netPnl?.props?.children}
                    change={elem?.change?.props?.children}
                  />
                  <Tooltip title="Exit Your Position" placement="top">
                    <td style={{textAlign: "center", marginRight:0.5,minWidth:1.5,minHeight:2}} >{elem?.exit}</td>
                  </Tooltip>
                  <Tooltip title="Buy" placement="top">
                    <td style={{textAlign: "center", marginRight:0.5,minWidth:1.5,minHeight:2}} >{elem?.buy}</td>
                  </Tooltip>
                  <Tooltip title="Sell" placement="top">
                    <td style={{textAlign: "center", marginRight:0.5,minWidth:1.5,minHeight:2}} >{elem?.sell}</td>
                  </Tooltip>
      
              </tr>
              </>

                )
              })} 
              {/* <tr
              style={{borderBottom: "1px solid #D3D3D3", padding: "10x",}}
              display='flex'
              >
                  <td  ></td>
                  <td  ></td>
                  <td style={{ padding: "8px 10px"}} ><div style={styleBottomRow}>Running Lots: {totalRunningLots}</div></td>
                  <td style={{ padding: "8px 10px"}}><div style={styleBottomRow} >Brokerage: {"₹"+(totalTransactionCost).toFixed(2)}</div></td>
                  <td style={{ padding: "8px 10px"}} ><div style={{...styleBottomRow, color: `${totalGrossPnl > 0 ? 'green' : 'red'}`}}>Gross P&L: {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)): "-₹" + ((-totalGrossPnl).toFixed(2))}</div></td>
                  <td style={{ padding: "8px 10px"}} ><div style={{...styleBottomRow, color: `${(totalGrossPnl-totalTransactionCost) > 0 ? 'green' : 'red'}`}}>Net P&L: {(totalGrossPnl-totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnl-totalTransactionCost).toFixed(2)): "-₹" + ((-(totalGrossPnl-totalTransactionCost)).toFixed(2))}</div></td>
                  <td  ></td>
                  <td  ></td>
                  <td  ></td>
                  <td  ></td>

              </tr> */}
            </tbody>
          </table>
          <Grid container display='flex'  mt={1} p={1} style={{border:'1px solid white',borderRadius:4}}>
        <Grid item xs={6} md={3} lg={3} display="flex" justifyContent="center">
            <MDTypography fontSize={".75rem"} backgroundColor= "#CCCCCC" color="#003366" style={{borderRadius: "5px", padding: "5px", fontWeight: "600"}}>Running Lots: {totalRunningLots}</MDTypography>
          </Grid>

          <Grid item xs={6} md={3} lg={3} display="flex" justifyContent="center">
            <MDTypography fontSize={".75rem"} backgroundColor= "#CCCCCC" color="#003366" style={{borderRadius: "5px", padding: "5px", fontWeight: "600"}}>Brokerage: {"₹"+(totalTransactionCost).toFixed(2)}</MDTypography>
          </Grid>

          <Grid item xs={6} md={3} lg={3} display="flex" justifyContent="center">
            <MDTypography fontSize={".75rem"} backgroundColor= "#CCCCCC" color={`${totalGrossPnl > 0 ? 'success' : 'error'}`} style={{borderRadius: "5px", padding: "5px", fontWeight: "600"}}>Gross P&L: {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)): "-₹" + ((-totalGrossPnl).toFixed(2))}</MDTypography>
          </Grid>

          <Grid item xs={6} md={3} lg={3} display="flex" justifyContent="center">
            <MDTypography fontSize={".75rem"} backgroundColor= "#CCCCCC" color={`${(totalGrossPnl-totalTransactionCost) > 0 ? 'success' : 'error'}`} style={{borderRadius: "5px", padding: "5px", fontWeight: "600"}}>Net P&L: {(totalGrossPnl-totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnl-totalTransactionCost).toFixed(2)): "-₹" + ((-(totalGrossPnl-totalTransactionCost)).toFixed(2))}</MDTypography>
          </Grid>
          </Grid>
        </TableContainer>

      </MDBox>
      )
      }
    </Card>
  );

}
export default OverallGrid;
