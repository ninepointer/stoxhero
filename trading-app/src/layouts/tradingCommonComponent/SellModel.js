// import React, { useContext, useState } from "react";
// import { useEffect, memo } from 'react';
// // import axios from "axios"
// import uniqid from "uniqid"
// import { userContext } from "../../AuthContext";
// import MDSnackbar from '../../components/MDSnackbar';

// // import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { useTheme } from '@mui/material/styles';
// import TextField from '@mui/material/TextField';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import InputLabel from '@mui/material/InputLabel';
// import FormControl from '@mui/material/FormControl';
// import MDButton from '../../components/MDButton';
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormLabel from '@mui/material/FormLabel';
// // import MDBox from '../../components/MDBox';
// import { Box, Typography } from '@mui/material';
// import { renderContext } from "../../renderContext";
// import {Howl} from "howler";
// import sound from "../../assets/sound/tradeSound.mp3"
// import {dailyContest, paperTrader, infinityTrader, tenxTrader, internshipTrader, marginX, battle } from "../../variables";
// import { NetPnlContext } from "../../PnlContext";


// const SellModel = ({chartInstrument, traderId, socket, exchangeSegment, exchangeInstrumentToken, subscriptionId, sellState, exchange, symbol, instrumentToken, symbolName, lotSize, ltp, maxLot, fromSearchInstrument, expiry, from, setSellState, module}) => {
//   // console.log("rendering in userPosition: sellModel", exchange)
//   const {render, setRender} = useContext(renderContext);
//   // const marketDetails = useContext(marketDataContext)
//   // console.log("rendering : sell");
//   // const tradeSound = new Howl({
//   //   src : [sound],
//   //   html5 : true
//   // })

//   const { pnlData } = useContext(NetPnlContext);
//   // console.log("pnlData", pnlData)
//   // let runningLotsSymbol = 0;
//   const runningLotsSymbol = pnlData.reduce((total, acc) => {
//     if (acc?._id?.symbol === symbol) {
//       return total + acc.lots;
//     }
//     return total; // return the accumulator if the condition is false
//   }, 0);

//   const type = "SELL";

  
//   let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

//   const getDetails = React.useContext(userContext);
//   const tradeSound = getDetails.tradeSound;
//   let uId = uniqid();
//   let date = new Date();
//   // let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
//   let createdBy = getDetails.userDetails.name;
//   let userId = getDetails.userDetails.email;
//   // let tradeBy = getDetails.userDetails.name;
//   let trader = getDetails.userDetails._id;
//   let dummyOrderId = `${date.getFullYear()-2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000+ Math.random() * 900000000)}`
//   const [messageObj, setMessageObj] = useState({
//     color: '',
//     icon: '',
//     title: '',
//     content: ''
//   })


//   let finalLot = maxLot/lotSize;
//   let optionData = [];
//   for(let i =1; i<= finalLot; i++){
//       optionData.push( <option value={i * lotSize}>{ i * lotSize}</option>)
      
//   }

//   useEffect(()=>{
//     socket?.on(`sendResponse${trader.toString()}`, (data)=>{
//       // render ? setRender(false) : setRender(true);
//       openSuccessSB(data.status, data.message)
//     })
//   }, [])


//   const [open, setOpen] = React.useState(sellState);
//   const theme = useTheme();
//   const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

//   const [regularSwitch, setRegularSwitch] = React.useState(true);
//   const [buttonClicked, setButtonClicked] = useState(false);
//   const [errorMessageStopLoss, setErrorMessageStopLoss] = useState("");
//   const [errorMessageStopProfit, setErrorMessageStopProfit] = useState("");

//   const [sellFormDetails, setsellFormDetails] = React.useState({
//     exchange: "",
//     symbol: "",
//     ceOrPe: "",
//     buyOrSell: "",
//     variety: "regular",
//     Product: "",
//     Quantity: "",
//     price: "",
//     OrderType: "",
//     TriggerPrice: "",
//     stopLoss: "",
//     validity: "",
//   })


//   const [value, setValue] = React.useState('NRML');
//   sellFormDetails.Product = value;
//   const handleChange = (event) => {
//     setValue(event.target.value);
//     sellFormDetails.Product = event.target.value;

//   };

//   const [market, setMarket] = React.useState('MARKET');
//   sellFormDetails.OrderType = market;
//   const marketHandleChange = (event) => {
//     setMarket(event.target.value);
//     sellFormDetails.OrderType = event.target.value;
//   };
//   const [validity, setValidity] = React.useState('DAY');
//   sellFormDetails.validity = validity;
//   const validityhandleChange = (event) => {
//     setValidity(event.target.value);
//     sellFormDetails.validity = event.target.value;
//   };

//   const handleClickOpen = async () => {
//     if(fromSearchInstrument){
//       addInstrument();
//       render ? setRender(false) : setRender(true);
//     }
//     setButtonClicked(false);
//     setOpen(true);
//   }; 

//   const handleClose = async (e) => {
//     if(fromSearchInstrument){
//       removeInstrument();
//       render ? setRender(false) : setRender(true);
//     }
    
//     setOpen(false);
//     setSellState(false);
//     setButtonClicked(false);
//   };

//   const stopLoss = async (e) => {
//     setErrorMessageStopLoss("")
//     sellFormDetails.stopLossPrice = e.target.value
//     if(Number(ltp) > Number(e.target.value)){//errorMessage
//       const text  = "Stop Loss price should be greater then LTP.";
//       setErrorMessageStopLoss(text)
//     }
//     if(e.target.value === ""){
//       sellFormDetails.stopLossPrice = false;
//     }
//   }


//   const stopProfit = async (e) => {
//     setErrorMessageStopProfit("")
//     sellFormDetails.stopProfitPrice = e.target.value
//     if(Number(ltp) < Number(e.target.value)){
//       setErrorMessageStopProfit("Stop Profit price should be less then LTP.")
//     }
//     if(e.target.value === ""){
//       sellFormDetails.stopProfitPrice = false;
//     }
//   }



//   async function sellFunction(e) {

//       if(!sellFormDetails.Quantity){
//         openSuccessSB('error', "Please select quantity for trade.");
//         return;
//       }

//       if(sellFormDetails.OrderType === "SL/SP-M" && (!sellFormDetails.stopLossPrice && !sellFormDetails.stopProfitPrice)){
//         openSuccessSB('error', "Please enter stop loss or stop profit price.");
//         return;
//       }

//       if(buttonClicked){
//         return;
//       }
//       setButtonClicked(true);

//       e.preventDefault()
//       setOpen(false);
//       setSellState(false);

//       sellFormDetails.buyOrSell = "SELL";
  
//       if (regularSwitch === true) {
//         sellFormDetails.variety = "regular"
//       }
//       else {
//         sellFormDetails.variety = "amo"
//       }

//       sellFormDetails.exchange = exchange;
//       sellFormDetails.symbol = symbol

//       setsellFormDetails(sellFormDetails)

//       placeOrder();

//       // let id = setTimeout(()=>{
//       //     render ? setRender(false) : setRender(true)
//       // }, 1000);
      
//   }

//   async function placeOrder() {

//     const {stopProfitPrice, stopLossPrice, exchange, symbol, buyOrSell, Quantity, price, Product, OrderType, TriggerPrice, stopLoss, validity, variety } = sellFormDetails;
//     let endPoint 
//     let paperTrade = false;
//     let tenxTraderPath;
//     let internPath ;
//     let fromAdmin ;
//     if(from === paperTrader){
//       endPoint = 'paperTrade';
//       paperTrade = true;
//     } else if(from === infinityTrader){
//       endPoint = 'placingOrder';
//       paperTrade = false;
//     } else if(from === tenxTrader){
//       endPoint = 'tenxPlacingOrder';
//       tenxTraderPath = true;
//     } else if(from === internshipTrader){
//       endPoint = 'internPlacingOrder';
//       internPath = true;
//     }else if(from === "Admin"){
//       endPoint = 'placingOrder'
//       paperTrade = false;
//       trader = traderId;
//       fromAdmin = true;
//     }else if(from === dailyContest){
//       if(module?.currentLiveStatus==="Live"){
//         endPoint = 'placingLiveOrderDailyContest';
//       } else{
//         endPoint = 'placingOrderDailyContest';
//       }
//     }else if(from === marginX){
//       endPoint = 'placingOrderMarginx';
//     }else if(from === battle){
//       endPoint = 'battleTrade';
//     }

//     const res = await fetch(`${baseUrl}api/v1/${endPoint}`, {
//         method: "POST",
//         credentials:"include",
//         headers: {
//             "content-type": "application/json"
//         },
//         body: JSON.stringify({
            
//           exchange, symbol, buyOrSell, Quantity, price, subscriptionId, contestId: module?.data,
//           Product, OrderType, TriggerPrice, stopLoss, uId, exchangeInstrumentToken, fromAdmin, stopProfitPrice, stopLossPrice,
//           validity, variety, createdBy, order_id:dummyOrderId, internPath, marginxId: subscriptionId,
//           userId, instrumentToken, trader, paperTrade: paperTrade, tenxTraderPath, battleId: subscriptionId

//         })
//     });
//     const dataResp = await res.json();
//     ////console.log("dataResp", dataResp)
//     if (dataResp.status === 422 || dataResp.error || !dataResp) {
//         ////console.log(dataResp.error)
//         // window.alert(dataResp.error);
//         openSuccessSB('error', dataResp.error)
//         //////console.log("Failed to Trade");
//       } else {
//         tradeSound.play();
//         if(dataResp.message === "COMPLETE"){
//             // //console.log(dataResp);
//             openSuccessSB('complete', {symbol, Quantity})
//             // window.alert("Trade Succesfull Completed");
//         } else if(dataResp.message === "REJECTED"){
//             // //console.log(dataResp);
//             openSuccessSB('reject', "Trade is Rejected due to Insufficient Fund")
//             // window.alert("Trade is Rejected due to Insufficient Fund");
//         } else if(dataResp.message === "AMO REQ RECEIVED"){
//             // //console.log(dataResp);
//             openSuccessSB('amo', "AMO Request Recieved")
//             // window.alert("AMO Request Recieved");
//         } else if(dataResp.message === "Live"){
//         }else{
//             openSuccessSB('else', dataResp.message)
//         }
//     }

//     setsellFormDetails({});
//     render ? setRender(false) : setRender(true);
//   }

//   async function addInstrument(){
//     const res = await fetch(`${baseUrl}api/v1/addInstrument`, {
//       method: "POST",
//       credentials:"include",
//       headers: {
//           "content-type" : "application/json",
//           "Access-Control-Allow-Credentials": true
//       },
//       body: JSON.stringify({
//         instrument: symbolName, exchange, status: "Active", 
//         symbol, lotSize, instrumentToken, from, chartInstrument,
//         uId, contractDate: expiry, maxLot, notInWatchList: true,
//         exchangeInstrumentToken, exchangeSegment
//       })
//     });
  
//     const data = await res.json();
//     if(data.status === 422 || data.error || !data){
//         window.alert(data.error);
//     }else{
//       // openSuccessSB();
//       //console.log(data.message)
//     }
//   }

//   async function removeInstrument(){
//     const response = await fetch(`${baseUrl}api/v1/inactiveInstrument/${instrumentToken}`, {
//       method: "PATCH",
//       credentials:"include",
//       headers: {
//           "Accept": "application/json",
//           "content-type": "application/json"
//       },
//       body: JSON.stringify({
//         isAddedWatchlist: false, from
//       })
//     });

//     const permissionData = await response.json();
//     //console.log("remove", permissionData)
//     if (permissionData.status === 422 || permissionData.error || !permissionData) {
//         window.alert(permissionData.error);
//     }else {
//     }
//   }


//   const [successSB, setSuccessSB] = useState(false);
//   const openSuccessSB = (value,content) => {
//     // //console.log("Value: ",value)
//     if(value === "complete"){
//         messageObj.color = 'success'
//         messageObj.icon = 'check'
//         messageObj.title = "Trade Successful";
//         messageObj.content = `Traded ${content.Quantity} of ${content.symbol}`;

//     };
//     if(value === "reject"){
//       messageObj.color = 'error'
//       messageObj.icon = 'error'
//       messageObj.title = "REJECTED";
//       messageObj.content = content;
//     };
//     if(value === "amo"){
//       messageObj.color = 'error'
//       messageObj.icon = 'warning'
//       messageObj.title = "AMO Requested";
//       messageObj.content = content;
//     };
//     if(value === "else"){
//       messageObj.color = 'error'
//       messageObj.icon = 'error'
//       messageObj.title = "REJECTED";
//       messageObj.content = content;
//     };
//     if(value === "error"){
//       messageObj.color = 'error'
//       messageObj.icon = 'error'
//       messageObj.title = "Error";
//       messageObj.content = content;
//     };

//     setMessageObj(messageObj);
//     setSuccessSB(true);
//   }
//   const closeSuccessSB = () => setSuccessSB(false);
//   // //console.log("Title, Content, Time: ",title,content,time)


//   const renderSuccessSB = (
//     <MDSnackbar
//       color= {messageObj.color}
//       icon= {messageObj.icon}
//       title={messageObj.title}
//       content={messageObj.content}
//       open={successSB}
//       onClose={closeSuccessSB}
//       close={closeSuccessSB}
//       bgWhite="error"
      
//       sx={{ borderLeft: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRight: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRadius: "15px", width: "auto"}}
//     />
//   );

//   const [checkQuantity, setChaeckQuantity] = useState();
//     async function handleQuantity(e){
//       sellFormDetails.Quantity = e.target.value;
//       setChaeckQuantity(e.target.value);
//       if(sellFormDetails.OrderType==="LIMIT" && sellFormDetails.price){
//         await checkMargin();
//       }
//       if(sellFormDetails.OrderType!=="LIMIT"){
//         await checkMargin();
//       }

//     }

//     const priceChange = async(e)=>{
//       sellFormDetails.price = e.target.value;
//       if(sellFormDetails.Quantity){
//         await checkMargin();
//       }
//     }

//     const checkMargin = async()=>{
//       const {Quantity, Product, OrderType, validity, variety, price } = sellFormDetails;

//       const response = await fetch(`${baseUrl}api/v1/marginrequired`, {
//         method: "PATCH",
//         credentials:"include",
//         headers: {
//             "Accept": "application/json",
//             "content-type": "application/json"
//         },
//         body: JSON.stringify({
//           exchange, symbol, buyOrSell: "SELL", Quantity, Product, OrderType, validity, variety, price, last_price: ltp
//         })
//       });

//       const data = await response.json();
//       console.log("response", data)
//     }

//   return (
//     <div>

//       <MDButton size="small" sx={{marginRight:0.5,minWidth:2,minHeight:3}} color="error" onClick={handleClickOpen} >
//         S
//       </MDButton>
//       <Dialog
//         fullScreen={fullScreen}
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="responsive-dialog-title"
//       >
//         <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
//           {"Regular"}
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText sx={{ display: "flex", flexDirection: "column", marginLeft: 2, marginTop: 1 }}>
//             <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", margin: 2 }}><Box sx={{ backgroundColor: "#ccccb3", fontWeight: 600, padding:"5px", borderRadius:"5px" }}>{symbolName}</Box> &nbsp; &nbsp; &nbsp; <Box sx={{ backgroundColor: "#ccccb3", fontWeight: 600, padding:"5px", borderRadius:"5px" }}>₹{ltp}</Box></Box>
//             <FormControl >

//               <FormLabel id="demo-controlled-radio-buttons-group" sx={{ width: "300px" }}></FormLabel>
//               <RadioGroup
//                 aria-labelledby="demo-controlled-radio-buttons-group"
//                 name="controlled-radio-buttons-group"
//                 value={value}
//                 onChange={handleChange}
//                 sx={{ display: "flex", flexDirection: "row" }}
//               >
//                 <FormControlLabel value="MIS" disabled="true" control={<Radio />} label="Intraday (MIS)" />
//                 <FormControlLabel value="NRML" disabled="true" control={<Radio />} label="Overnight (NRML)" />
//               </RadioGroup>
//             </FormControl>

//             <Box sx={{ display: "flex", flexDirection: "row" }}>
//               <FormControl variant="standard" sx={{ m: 1, minWidth: 120, }}>
//                 <InputLabel id="demo-simple-select-standard-label">Quantity</InputLabel>
//                 <Select
//                   labelId="demo-simple-select-standard-label"
//                   id="demo-simple-select-standard"
//                   label="Quantity"
//                   // { sellFormDetails.Quantity = (e.target.value) }
//                   // sellFormDetails(prev => ({...prev, Quantity: e.target.value}))
//                   onChange={(e) => { handleQuantity(e)  }}
//                   sx={{ margin: 1, padding: 0.5, }}
//                 >
//                   {/* <MenuItem value="100">100</MenuItem>
//                     <MenuItem value="150">150</MenuItem> */}
//                   {optionData.map((elem) => {
//                     // //console.log("optionData", elem)
//                     return (
//                       <MenuItem value={elem.props.value}>
//                         {elem.props.children}
//                       </MenuItem>
//                     )
//                   })
//                   }
//                 </Select>
//               </FormControl>

//               <TextField
//                 id="outlined-basic" disabled={from !== "TenX Trader" || sellFormDetails.OrderType === "MARKET" || sellFormDetails.OrderType === "SL/SP-M"} label="Price" variant="standard" onChange={(e) => { { priceChange(e) } }}
//                 sx={{ margin: 1, padding: 1, width: "300px", marginRight: 1, marginLeft: 1 }} type="number" />

//               <TextField
//                 id="outlined-basic" disabled={from !== "TenX Trader" || sellFormDetails.OrderType === "MARKET" || sellFormDetails.OrderType === "LIMIT" || (runningLotsSymbol > 0 && checkQuantity <= Math.abs(runningLotsSymbol))} label="StopLoss Price" variant="standard" onChange={(e) => { { stopLoss(e) } }}
//                 sx={{ margin: 1, padding: 1, width: "300px", marginRight: 1, marginLeft: 1 }} type="number" />

//               <TextField
//                 id="outlined-basic" disabled={from !== "TenX Trader" || sellFormDetails.OrderType === "MARKET" || sellFormDetails.OrderType === "LIMIT" || (runningLotsSymbol > 0 && checkQuantity <= Math.abs(runningLotsSymbol))} label="StopProfit Price" variant="standard" onChange={(e) => { { stopProfit(e) } }}
//                 sx={{ margin: 1, padding: 1, width: "300px" }} type="number" />

//             </Box>

//             <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "10px" }}>
//                   <Typography fontSize={15} color={"error"}> {sellFormDetails.stopLossPrice && errorMessageStopLoss && errorMessageStopLoss}</Typography>
//                   <Typography fontSize={15} color={"error"}>{sellFormDetails.stopProfitPrice && errorMessageStopProfit && errorMessageStopProfit}</Typography>
//               </Box>


//               <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
//                 <FormControl  >
//                   <FormLabel id="demo-controlled-radio-buttons-group" ></FormLabel>
//                   <RadioGroup
//                     aria-labelledby="demo-controlled-radio-buttons-group"
//                     name="controlled-radio-buttons-group"
//                     value={market}
//                     onChange={marketHandleChange}
//                     sx={{ display: "flex", flexDirection: "row" }}
//                   >
//                     <FormControlLabel value="MARKET" control={<Radio />} label="MARKET" />
//                     <FormControlLabel value="LIMIT" control={<Radio />} label="LIMIT" />
//                     <FormControlLabel value="SL/SP-M" control={<Radio />} label="SL/SP-M" />

//                   </RadioGroup>
//                 </FormControl>

//               </Box>

//             <Box>
//               <FormControl  >
//                 <FormLabel id="demo-controlled-radio-buttons-group" >Validity</FormLabel>
//                 <RadioGroup
//                   aria-labelledby="demo-controlled-radio-buttons-group"
//                   name="controlled-radio-buttons-group"
//                   value={validity}
//                   onChange={validityhandleChange}
//                   sx={{ display: "flex", flexDirection: "column" }}
//                 >
//                   <FormControlLabel value="DAY" disabled="true" control={<Radio />} label="DAY" />
//                   <FormControlLabel value="IMMEDIATE" disabled="true" control={<Radio />} label="IMMEDIATE" />
//                   <FormControlLabel value="MINUTES" disabled="true" control={<Radio />} label="MINUTES" />
//                 </RadioGroup>
//               </FormControl>
//             </Box>
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <MDButton disabled={(sellFormDetails.stopLossPrice && (Number(ltp) > sellFormDetails.stopLossPrice)) || (sellFormDetails.stopProfitPrice && (Number(ltp) < sellFormDetails.stopProfitPrice))} autoFocus variant="contained" color="error" onClick={(e) => { sellFunction(e) }}>
//             Sell
//           </MDButton>
//           <MDButton variant="contained" color="error" onClick={handleClose} autoFocus>
//             Cancel
//           </MDButton>
//         </DialogActions>


//       </Dialog>
//       {renderSuccessSB}
//     </div>
//   );
// }

// export default memo(SellModel)



import React, { useContext, useState, useEffect } from "react";
import {  memo } from 'react';
// import axios from "axios"
import uniqid from "uniqid"
import { userContext } from "../../AuthContext";

// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import MDButton from '../../components/MDButton';
import MDSnackbar from '../../components/MDSnackbar';
import { Box, Typography } from '@mui/material';
import { renderContext } from "../../renderContext";
import {dailyContest, paperTrader, infinityTrader, tenxTrader, internshipTrader, marginX, battle } from "../../variables";
import { NetPnlContext } from "../../PnlContext";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
// import SellModel from "./SellModel";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RefreshIcon from '@mui/icons-material/Refresh';
import BuyModel from "./BuyModel";

const SellModel = ({chartInstrument, isOption, setOpenOptionChain, traderId, socket, subscriptionId, buyState, exchange, symbol, instrumentToken, symbolName, lotSize, maxLot, ltp, fromSearchInstrument, expiry, from, setSellState, exchangeSegment, exchangeInstrumentToken, module}) => {

  const newLtp = ltp;
  const { pnlData } = useContext(NetPnlContext);
  const runningLotsSymbol = pnlData.reduce((total, acc) => {
    if (acc?._id?.symbol === symbol) {
      return total + acc.lots;
    }
    return total; // return the accumulator if the condition is false
  }, 0);

  console.log(runningLotsSymbol)
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const {render, setRender} = useContext(renderContext);
  const getDetails = React.useContext(userContext);
  const tradeSound = getDetails.tradeSound;
  let uId = uniqid();
  let date = new Date();
  let createdBy = getDetails.userDetails.name;
  let userId = getDetails.userDetails.email;
  let trader = getDetails.userDetails._id;
  let dummyOrderId = `${date.getFullYear()-2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000+ Math.random() * 900000000)}`
  const [messageObj, setMessageObj] = useState({
    color: '',
    icon: '',
    title: '',
    content: ''
  })
  let finalLot = maxLot/lotSize;
  let optionData = [];
  for(let i =1; i<= finalLot; i++){
      optionData.push( <MenuItem value={i * lotSize}>{ i * lotSize}</MenuItem>)      
  }

  const [buttonClicked, setButtonClicked] = useState(false);
  const [errorMessageStopLoss, setErrorMessageStopLoss] = useState("");
  const [errorMessageStopProfit, setErrorMessageStopProfit] = useState("");
  const [errorMessageQuantity, setErrorMessageQuantity] = useState("");

  const [open, setOpen] = React.useState(buyState);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [regularSwitch, setRegularSwitch] = React.useState(true);
  const [sellFormDetails, setsellFormDetails] = React.useState({
    exchange: "",
    symbol: "",
    ceOrPe: "",
    buyOrSell: "",
    variety: "regular",
    Product: "",
    Quantity: lotSize,
    stopLossPrice: "",
    price: "",
    OrderType: "",
    TriggerPrice: "",
    stopLoss: "",
    validity: "",
  })

  useEffect(()=>{
    socket?.on(`sendResponse${trader.toString()}`, (data)=>{
      // render ? setRender(false) : setRender(true);
      openSuccessSB(data.status, data.message)
    })
  }, [])


  const [value, setValue] = React.useState('NRML');
  sellFormDetails.Product = value;
  // const handleChange = (event) => {
  //   setValue(event.target.value);
  //   sellFormDetails.Product = event.target.value;

  // };

  const [ordertype, setOrdertype] = React.useState('MARKET');
  sellFormDetails.OrderType = ordertype;
  const marketHandleChange = (value) => {
    setOrdertype(value);
    sellFormDetails.OrderType = value;
  };
  const [validity, setValidity] = React.useState('DAY');
  sellFormDetails.validity = validity;
  // const validityhandleChange = (event) => {
  //   setValidity(event.target.value);
  //   sellFormDetails.validity = event.target.value;
  // };

  const handleClickOpen = async () => {
    if(fromSearchInstrument){
      addInstrument();
      render ? setRender(false) : setRender(true);
    }

    sellFormDetails.Quantity = lotSize;
    await checkMargin();
    setOrdertype("MARKET")
    setButtonClicked(false);
    setOpen(true);

  }; 

  const handleClose = async (e) => {
    if(fromSearchInstrument){
      removeInstrument();
      render ? setRender(false) : setRender(true);
    }
    
    setOpen(false);
    if(isOption){
        setOpenOptionChain(false) 
    }
    
    setMessageObj({});
    setErrorMessageStopLoss("");
    setErrorMessageStopProfit("");
    setErrorMessageQuantity("");
    setsellFormDetails({});
    setOrdertype("");
    // setCheckQuantity(null);
    setMargin(null);
    setSellState(false);
    setButtonClicked(false);
  };

  const stopLoss = async (e) => {
    setErrorMessageStopLoss("")
    sellFormDetails.stopLossPrice = e.target.value
    if(Number(newLtp) < Number(e.target.value)){//errorMessage
      const text  = "Stop Loss price should be less then LTP.";
      setErrorMessageStopLoss(text)
    }
    if(e.target.value === ""){
      sellFormDetails.stopLossPrice = false;
    }
  }


  const stopProfit = async (e) => {
    setErrorMessageStopProfit("")
    sellFormDetails.stopProfitPrice = e.target.value
    if(Number(newLtp) > Number(e.target.value)){
      setErrorMessageStopProfit("Stop Profit price should be greater then LTP.")
    }
    if(e.target.value === ""){
      sellFormDetails.stopProfitPrice = false;
    }
  }

  async function buyFunction(e, uId) {
    if(!sellFormDetails.Quantity){
      openSuccessSB('error', "Please select quantity for trade.");
      return;
    }

    if(sellFormDetails.Quantity > maxLot){
      setErrorMessageQuantity(`Quantity must be lower than max limit: ${maxLot}`)
      return;
    }
    if(sellFormDetails.Quantity % lotSize !== 0){
      setErrorMessageQuantity(`The quantity should be a multiple of ${lotSize}. Try again with ${parseInt(sellFormDetails.Quantity/lotSize) * lotSize} or ${parseInt(sellFormDetails.Quantity/lotSize + 1) * lotSize}.`)
      return;
    }
    if(sellFormDetails.Quantity < lotSize){
      setErrorMessageQuantity(`Quantity must be greater than min limit: ${lotSize}`)
      return;
    }

    if(sellFormDetails.OrderType === "SL/SP-M" && (!sellFormDetails.stopLossPrice && !sellFormDetails.stopProfitPrice)){
      openSuccessSB('error', "Please enter stop loss or stop profit price.");
      return;
    }

    if(buttonClicked){
      // setButtonClicked(false);
      return;
    }
    setButtonClicked(true);
    e.preventDefault()
    setOpen(false);
    if(isOption){
      setOpenOptionChain(false)
    }
    setSellState(false);

    sellFormDetails.buyOrSell = "SELL";

    if (regularSwitch === true) {
      sellFormDetails.variety = "regular"
    }
    else {
      sellFormDetails.variety = "amo"
    }

    sellFormDetails.exchange = exchange;
    sellFormDetails.symbol = symbol

    setsellFormDetails(sellFormDetails)

    placeOrder();

  }

  async function placeOrder() {
    // console.log("exchangeInstrumentToken", exchangeInstrumentToken)
    const { exchange, symbol, buyOrSell, Quantity, Product, OrderType, TriggerPrice, stopProfitPrice, stopLoss, stopLossPrice, validity, variety, price } = sellFormDetails;
    let endPoint 
    let paperTrade = false;
    let tenxTraderPath;
    let internPath ;
    let fromAdmin ;
    if(from === paperTrader){
      endPoint = 'paperTrade';
      paperTrade = true;
    } else if(from === infinityTrader){
      endPoint = 'placingOrder';
      paperTrade = false;
    } else if(from === tenxTrader){
      endPoint = 'tenxPlacingOrder';
      tenxTraderPath = true;
    }else if(from === internshipTrader){
      endPoint = 'internPlacingOrder';
      internPath = true;
    }else if(from === "Admin"){
      endPoint = 'placingOrder'
      paperTrade = false;
      trader = traderId;
      fromAdmin = true;
    }else if(from === dailyContest){
      if(module?.currentLiveStatus==="Live"){
        endPoint = 'placingLiveOrderDailyContest';
      } else{
        endPoint = 'placingOrderDailyContest';
      }
    }else if(from === marginX){
      endPoint = 'placingOrderMarginx';
    }else if(from === battle){
      endPoint = 'battleTrade';
    }

    console.log("module", module)
    const res = await fetch(`${baseUrl}api/v1/${endPoint}`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
          exchange, symbol, buyOrSell, Quantity, stopLoss, contestId: module?.data, battleId: subscriptionId,
          Product, OrderType, TriggerPrice, stopProfitPrice, stopLossPrice, uId, exchangeInstrumentToken, fromAdmin,
          validity, variety, createdBy, order_id:dummyOrderId, subscriptionId, marginxId: subscriptionId,
          userId, instrumentToken, trader, paperTrade: paperTrade, tenxTraderPath, internPath, price

        })
    });
    const dataResp = await res.json();
    if (dataResp.status === 422 || dataResp.error || !dataResp) {
        openSuccessSB('error', dataResp.error)
    } else {
      tradeSound.play();
        if(dataResp.message === "COMPLETE"){
            openSuccessSB('complete', {symbol, Quantity})
        } else if(dataResp.message === "REJECTED"){
            openSuccessSB('reject', "Trade is Rejected due to Insufficient Fund")
        } else if(dataResp.message === "AMO REQ RECEIVED"){
            openSuccessSB('amo', "AMO Request Recieved")
        } else if(dataResp.message === "Live"){
        } else{
            openSuccessSB('else', dataResp.message)
        }
    }
    setsellFormDetails({});
    render ? setRender(false) : setRender(true)
  }

  async function addInstrument(){
    const res = await fetch(`${baseUrl}api/v1/addInstrument`, {
      method: "POST",
      credentials:"include",
      headers: {
          "content-type" : "application/json",
          "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        instrument: symbolName, exchange, status: "Active", 
        symbol, lotSize, instrumentToken, from, chartInstrument,
        uId, contractDate: expiry, maxLot, notInWatchList: true,
        exchangeSegment, exchangeInstrumentToken, 
      })
    });
  
    const data = await res.json();
    if(data.status === 422 || data.error || !data){
        window.alert(data.error);
    }else{
      // openSuccessSB();
      //console.log(data.message)
    }
  }

  async function removeInstrument(){
    const response = await fetch(`${baseUrl}api/v1/inactiveInstrument/${instrumentToken}`, {
      method: "PATCH",
      credentials:"include",
      headers: {
          "Accept": "application/json",
          "content-type": "application/json"
      },
      body: JSON.stringify({
        isAddedWatchlist: false, from
      })
    });

    const permissionData = await response.json();
    //console.log("remove", permissionData)
    if (permissionData.status === 422 || permissionData.error || !permissionData) {
        window.alert(permissionData.error);
    }else {
    }
  }

  const [successSB, setSuccessSB] = useState(false);

  const openSuccessSB = (value,content) => {
    if(value === "complete"){
        messageObj.color = 'success'
        messageObj.icon = 'check'
        messageObj.title = "Trade Successful";
        messageObj.content = `Traded ${content.Quantity} of ${content.symbol}`;
        setSuccessSB(true);
    };
    if(value === "reject"){
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "REJECTED";
      messageObj.content = content;
    };
    if(value === "amo"){
      messageObj.color = 'error'
      messageObj.icon = 'warning'
      messageObj.title = "AMO Requested";
      messageObj.content = content;
    };
    if(value === "else"){
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "REJECTED";
      messageObj.content = content;
    };
    if(value === "error"){
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "Error";
      messageObj.content = content;
    };

    setMessageObj(messageObj);
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);
  const renderSuccessSB = (
    <MDSnackbar
      color= {messageObj.color}
      icon= {messageObj.icon}
      title={messageObj.title}
      content={messageObj.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="error"
      sx={{ borderLeft: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRight: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRadius: "15px", width: "auto"}}
    />
  );

    const [checkQuantity, setCheckQuantity] = useState(lotSize);
    const [margin, setMargin] = useState();

    async function handleQuantity(e){
      e.preventDefault();
      sellFormDetails.Quantity = Math.abs(e.target.value);
      setCheckQuantity(e.target.value);

      setMargin(null);
      setErrorMessageQuantity("")
      if((e.target.value > maxLot) || (e.target.value % lotSize !== 0) || (e.target.value < lotSize)){
        return;
      }

      if(sellFormDetails.OrderType==="LIMIT" && sellFormDetails.price){
        await checkMargin();
      }
      if(sellFormDetails.OrderType!=="LIMIT"){
        await checkMargin();
      }
      
    }

    const priceChange = async(e)=>{
      sellFormDetails.price = e.target.value;
      if(sellFormDetails.Quantity){
        await checkMargin();
      }
    }

    const checkMargin = async()=>{
      const { Quantity, Product, OrderType, validity, variety, price } = sellFormDetails;

      const response = await fetch(`${baseUrl}api/v1/marginrequired`, {
        method: "PATCH",
        credentials:"include",
        headers: {
            "Accept": "application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify({
          exchange, symbol, buyOrSell: "SELL", Quantity, Product, OrderType, validity, variety, price, last_price: newLtp
        })
      });

      const data = await response.json();
      setMargin(data?.margin);
      // console.log("response", data)
    }

    async function removeQuantity(){
      if(sellFormDetails.Quantity % lotSize !== 0){
        setCheckQuantity(parseInt(sellFormDetails.Quantity/lotSize) * lotSize)
        sellFormDetails.Quantity  = parseInt(sellFormDetails.Quantity/lotSize) * lotSize
      } else{
        sellFormDetails.Quantity -= lotSize
        setCheckQuantity(prev => prev-lotSize)
      }

      await checkMargin();
      setErrorMessageQuantity("")
    }


    async function addQuantity(){
      if(sellFormDetails.Quantity % lotSize !== 0){
        setCheckQuantity(parseInt(sellFormDetails.Quantity/lotSize + 1) * lotSize)
        sellFormDetails.Quantity  = parseInt(sellFormDetails.Quantity/lotSize + 1) * lotSize
      } else{
        sellFormDetails.Quantity += lotSize
        setCheckQuantity(prev => prev+lotSize)
      }

      await checkMargin();
      setErrorMessageQuantity("")
    }

  return (
    <div>

      <MDButton  size="small" color="error" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={handleClickOpen} >
        S
      </MDButton>
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title">
          {/* <DialogTitle >
            <MDBox sx={{display: "flex", justifyContent: 'center', textAlign: "center"}}>
                <MDBox onClick={()=>{setOpen(false)}} sx={{backgroundColor: "info", color: "#ffffff", minHeight: "2px", width: "160px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                  <BuyModel handleClose={handleClose} />
                </MDBox>
                <MDBox sx={{backgroundColor: "#F44335", color: "#ffffff", minHeight: "2px", width: "160px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                  S
                </MDBox>
              </MDBox>
          </DialogTitle> */}
          <DialogContent>
            <DialogContentText sx={{ display: "flex", flexDirection: "column", marginLeft: 2, justifyContent: "center" , width: "320px"}}>

              <MDBox sx={{ display: "flex", justifyContent: 'space-between', textAlign: "center" }}>
                <MDBox sx={{ backgroundColor: "#ffffff", color: "#8D91A8", width: "150px", borderRadius: "5px", fontWeight: 600, fontSize: "13px", textAlign: "left" }}>
                  Variety : Regular
                </MDBox>
                <MDBox sx={{ backgroundColor: "#ffffff", color: "#8D91A8", width: "150px", borderRadius: "5px", fontWeight: 600, fontSize: "13px", textAlign: "right"  }}>
                  Symbol : {symbolName}
                </MDBox>
              </MDBox>
              <MDBox sx={{ display: "flex", justifyContent: 'space-between', textAlign: "center", marginBottom: "20px" }}>
                <MDBox sx={{ backgroundColor: "#ffffff", color: "#8D91A8", width: "150px", borderRadius: "5px", fontWeight: 600, fontSize: "13px", textAlign: "left"  }}>
                  Exchange : NFO
                </MDBox>
                <MDBox sx={{ backgroundColor: "#ffffff", color: "#8D91A8", width: "150px", borderRadius: "5px", fontWeight: 600, fontSize: "13px", textAlign: "right"  }}>
                  LTP : ₹{ltp}
                </MDBox>
              </MDBox>

              <MDBox sx={{display: "flex", justifyContent: 'space-between', textAlign: "center"}}>
                <MDBox sx={{backgroundColor: "#F44335", color: "#ffffff", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                  Intraday (Same day)
                </MDBox>
                <MDBox sx={{color: "#8D91A8", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px", border: ".5px solid #8D91A8" }}>
                  Delivery (Longterm)
                </MDBox>
              </MDBox>

              <MDBox sx={{ display: "flex", justifyContent: 'space-between', textAlign: "center", marginTop: "10px" }}>
                <MDBox sx={{ display: "flex", justifyContent: "space-between", alignContent: "center", alignItems: "center", width: "140px", borderRadius: "5px", cursor: "pointer", border: "0.5px solid #D2D6DA" }}>
                  <MDBox>
                  <RemoveIcon  onClick={(checkQuantity !== lotSize && checkQuantity > lotSize) ? removeQuantity : ()=>{}} sx={{marginLeft: "2px", marginTop: "5px", disabled: true}}  />
                  </MDBox>

                  <MDBox>
                    <input onChange={(e)=>{handleQuantity(e)}} style={{  width: "70px", height: "35px", border: "none", outline: "none", fontSize: "15px" , textAlign: "center"}} value={checkQuantity}></input>
                  </MDBox>

                  <MDBox>
                    
                    <AddIcon onClick={(checkQuantity !== maxLot && checkQuantity < maxLot) ? addQuantity : ()=>{}} sx={{marginRight: "2px", marginTop: "5px"}} />
                  </MDBox>


                </MDBox>

                <TextField
                  id="outlined-basic" disabled={from !== "TenX Trader" || sellFormDetails.OrderType === "MARKET" || sellFormDetails.OrderType === "SL/SP-M"} label="Price" variant="outlined" onChange={(e) => { { priceChange(e) } }}
                  sx={{ width: "140px", innerHeight: "1px" }} type="number" />
              </MDBox>

              {ordertype === "SL/SP-M" &&
                <MDBox sx={{ display: "flex", justifyContent: 'space-between', textAlign: "center" }}>
                  <TextField
                    id="outlined-basic" disabled={from !== "TenX Trader" || sellFormDetails.OrderType === "MARKET" || sellFormDetails.OrderType === "LIMIT" || (runningLotsSymbol < 0 && checkQuantity <= Math.abs(runningLotsSymbol))} label="SL price" variant="outlined" onChange={(e) => { { stopLoss(e) } }}
                    sx={{ width: "140px", marginTop: "20px", innerHeight: "1px" }} type="number" />

                  <TextField
                    id="outlined-basic" disabled={from !== "TenX Trader" || sellFormDetails.OrderType === "MARKET" || sellFormDetails.OrderType === "LIMIT" || (runningLotsSymbol < 0 && checkQuantity <= Math.abs(runningLotsSymbol))} label="SP price" variant="outlined" onChange={(e) => { { stopProfit(e) } }}
                    sx={{ width: "140px", marginTop: "20px", innerHeight: "1px" }} type="number" />
                </MDBox>}


              <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                  <Typography fontSize={15} color={"error"}> {sellFormDetails.stopLossPrice && errorMessageStopLoss && errorMessageStopLoss}</Typography>
                  <Typography fontSize={15} color={"error"}>{sellFormDetails.stopProfitPrice && errorMessageStopProfit && errorMessageStopProfit}</Typography>
                  <Typography fontSize={15} color={"error"}>{errorMessageQuantity && errorMessageQuantity}</Typography>
              </Box>

              <MDBox sx={{display: "flex", justifyContent: 'space-between', textAlign: "center", gap: "5px", marginTop: "20px"}}>
                <MDBox onClick={()=>{marketHandleChange("MARKET")}} sx={{backgroundColor: ordertype==="MARKET" ? "#F44335" : "#FFFFFF", color: ordertype==="MARKET" ? "#FFFFFF" : "#8D91A8", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px", border: ordertype!=="MARKET" && ".5px solid #8D91A8" }}>
                  Market
                </MDBox>

                <MDBox onClick={()=>{marketHandleChange("LIMIT")}} sx={{backgroundColor: ordertype==="LIMIT" ? "#F44335" : "#FFFFFF", color: ordertype==="LIMIT" ? "#FFFFFF" : "#8D91A8", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px", border: ordertype!=="LIMIT" && ".5px solid #8D91A8" }}>
                  Limit
                </MDBox>

                <MDBox onClick={()=>{marketHandleChange("SL/SP-M")}} sx={{backgroundColor: ordertype==="SL/SP-M" ? "#F44335" : "#FFFFFF", color: ordertype==="SL/SP-M" ? "#FFFFFF" : "#8D91A8", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px", border: ordertype!=="SL/SP-M" && ".5px solid #8D91A8" }}>
                 SL/SP-M
                </MDBox>
              </MDBox>

              <MDBox sx={{display: "flex", justifyContent: 'space-between', textAlign: "center", gap: "5px", marginTop: "20px"}}>
                <MDBox sx={{backgroundColor: "#F44335", color: "#ffffff", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                  Day
                </MDBox>

                <MDBox sx={{color: "#8D91A8", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px", border: ".5px solid #8D91A8" }}>
                  Immediate
                </MDBox>

                <MDBox sx={{color: "#8D91A8", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px", border: ".5px solid #8D91A8" }}>
                 Minute
                </MDBox>
              </MDBox>

              {margin &&
              <MDBox sx={{display: "flex", justifyContent: "left", alignContent: "center", alignItems: "center", marginTop: "5px"}}>
                <MDTypography sx={{fontSize: "14px", color: "#000000", fontWeight: 500 }}>Margin required:</MDTypography>
                <MDTypography sx={{fontSize: "14px", color: "#000000", fontWeight: 500 ,marginLeft: "4px"}}> <b>₹{margin.toFixed(2)}</b></MDTypography>
                <MDTypography sx={{fontSize: "14px", color: "#000000", fontWeight: 500, marginTop: "4px", marginLeft: "4px" }}> <span><RefreshIcon onClick={async ()=>{await checkMargin()}} sx={{cursor: "pointer"}} /></span> </MDTypography>
              </MDBox>}
              
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <MDButton 
            disabled={(sellFormDetails.stopLossPrice && (Number(ltp) < sellFormDetails.stopLossPrice)) || (sellFormDetails.stopProfitPrice && (Number(ltp) > sellFormDetails.stopProfitPrice))} 
            autoFocus variant="contained" color="error" onClick={(e) => { buyFunction(e) }}>
              SELL
            </MDButton>
            <MDButton variant="contained" color="error" onClick={handleClose} autoFocus>
              Cancel
            </MDButton>
          </DialogActions>
        </Dialog>
      </div >
      {renderSuccessSB}
    </div >
  );
}

export default memo(SellModel);