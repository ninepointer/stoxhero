
import React, { useContext, useState, useEffect } from "react";
import { memo } from 'react';
// import axios from "axios"
import uniqid from "uniqid"
import { userContext } from "../../AuthContext";

// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import MDButton from '../../components/MDButton';
import MDSnackbar from '../../components/MDSnackbar';
import { Box, Typography } from '@mui/material';
import { renderContext } from "../../renderContext";
import { dailyContest, paperTrader, infinityTrader, tenxTrader, internshipTrader, marginX, battle } from "../../variables";
import { NetPnlContext } from "../../PnlContext";
import MDTypography from "../../components/MDTypography";
import MDBox from "../../components/MDBox";
// import SellModel from "./SellModel";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RefreshIcon from '@mui/icons-material/Refresh';
// import {internshipTrader, tenxTrader, dailyContest, marginX, paperTrader } from "../../variables";


const SellModel = ({fromTradable, chartInstrument, isOption, setOpenOptionChain, traderId, socket, subscriptionId, buyState, exchange, symbol, instrumentToken, symbolName, lotSize, maxLot, ltp, fromSearchInstrument, expiry, from, setSellState, exchangeSegment, exchangeInstrumentToken, module }) => {

  const newLtp = ltp;
  const { pnlData } = useContext(NetPnlContext);
  const runningLotsSymbol = pnlData.reduce((total, acc) => {
    if (acc?._id?.symbol === symbol && !acc?._id?.isLimit) {
      return total + acc.lots;
    }
    return total; // return the accumulator if the condition is false
  }, 0);

  console.log(runningLotsSymbol)
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const { render, setRender } = useContext(renderContext);
  const getDetails = React.useContext(userContext);
  const tradeSound = getDetails.tradeSound;
  let uId = uniqid();
  let date = new Date();
  let createdBy = getDetails.userDetails.name;
  let userId = getDetails.userDetails.email;
  let trader = getDetails.userDetails._id;
  let dummyOrderId = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
  const [messageObj, setMessageObj] = useState({
    color: '',
    icon: '',
    title: '',
    content: ''
  })
  let finalLot = maxLot / lotSize;
  let optionData = [];
  for (let i = 1; i <= finalLot; i++) {
    optionData.push(<MenuItem value={i * lotSize}>{i * lotSize}</MenuItem>)
  }

  const [buttonClicked, setButtonClicked] = useState(false);
  const [errorMessageStopLoss, setErrorMessageStopLoss] = useState("");
  const [errorMessageStopProfit, setErrorMessageStopProfit] = useState("");
  const [errorMessageQuantity, setErrorMessageQuantity] = useState("");
  const [errorMessagePrice, setErrorMessagePrice] = useState("");

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
    order_type: "",
    TriggerPrice: "",
    stopLoss: "",
    validity: "",
  })

  useEffect(() => {
    socket?.on(`sendResponse${trader.toString()}`, (data) => {
      // render ? setRender(false) : setRender(true);
      openSuccessSB(data.status, data.message)
    })
  }, [])


  const [value, setValue] = React.useState('NRML');
  sellFormDetails.Product = value;


  const [ordertype, setOrdertype] = React.useState('MARKET');
  sellFormDetails.order_type = ordertype;
  const marketHandleChange = (value) => {
    if (value === "SL/SP-M") {
      setsellFormDetails({ ...sellFormDetails, price: "" });
    }
    if (value === "LIMIT") {
      setsellFormDetails({ ...sellFormDetails, stopLossPrice: "", stopProfitPrice: "" });
    }
    if(value === "MARKET"){
      setsellFormDetails({ ...sellFormDetails, stopLossPrice: "", stopProfitPrice: "" });
      setsellFormDetails({ ...sellFormDetails, price: "" });
    }
    setOrdertype(value);
    sellFormDetails.order_type = value;
  };
  const [validity, setValidity] = React.useState('DAY');
  sellFormDetails.validity = validity;

  const handleClickOpen = async () => {
    if(!ltp && !fromTradable){
      openSuccessSB('error', "This instrument is expired. Please trade on valid instrument.");
      return
    }
    if (fromSearchInstrument) {
      addInstrument();
      render ? setRender(false) : setRender(true);
    }

    sellFormDetails.Quantity = lotSize;
    setCheckQuantity(lotSize)
    if (Math.abs(runningLotsSymbol) && runningLotsSymbol > 0) {
      setMargin("0.00");
    } else {
      await checkMargin();
    }
    setOrdertype("MARKET")
    setButtonClicked(false);
    setOpen(true);

  };

  const handleClose = async (e) => {
    if (fromSearchInstrument) {
      removeInstrument();
      render ? setRender(false) : setRender(true);
    }

    setOpen(false);
    if (isOption) {
      setOpenOptionChain(false)
    }

    setMessageObj({});
    setErrorMessageStopLoss("");
    setErrorMessageStopProfit("");
    setErrorMessageQuantity("");
    setsellFormDetails({});
    setOrdertype("");
    setCheckQuantity(null);
    setMargin(null);
    setSellState(false);
    setButtonClicked(false);
  };


  const stopLoss = async (e) => {
    setsellFormDetails({ ...sellFormDetails, stopLossPrice: Number(e.target.value) });
    const inputPrice = Number(e.target.value);
    if (inputPrice < 0) {
      setsellFormDetails({ ...sellFormDetails, stopLossPrice: "" });
      return;
    }
    setErrorMessageStopLoss("")
    sellFormDetails.stopLossPrice = e.target.value
    if (Number(ltp) > Number(e.target.value)) {//errorMessage
      const text = "Stop Loss price should be greater then LTP.";
      setErrorMessageStopLoss(text)
    }
    if (e.target.value === "") {
      sellFormDetails.stopLossPrice = false;
    }
  }

  const stopProfit = async (e) => {
    setsellFormDetails({ ...sellFormDetails, stopProfitPrice: Number(e.target.value) });
    const inputPrice = Number(e.target.value);
    if (inputPrice < 0) {
      setsellFormDetails({ ...sellFormDetails, stopProfitPrice: "" });
      return;
    }
    setErrorMessageStopProfit("")
    sellFormDetails.stopProfitPrice = e.target.value
    if (Number(ltp) < Number(e.target.value)) {
      setErrorMessageStopProfit("Stop Profit price should be less then LTP.")
    }
    if (e.target.value === "") {
      sellFormDetails.stopProfitPrice = false;
    }
  }

  async function sellFunction(e, uId) {
    if (!sellFormDetails.Quantity) {
      openSuccessSB('error', "Please select quantity for trade.");
      return;
    }

    if (sellFormDetails.Quantity > maxLot) {
      setErrorMessageQuantity(`Quantity must be lower than max limit: ${maxLot}`)
      return;
    }
    if (sellFormDetails.Quantity % lotSize !== 0) {
      setErrorMessageQuantity(`The quantity should be a multiple of ${lotSize}. Try again with ${parseInt(sellFormDetails.Quantity / lotSize) * lotSize} or ${parseInt(sellFormDetails.Quantity / lotSize + 1) * lotSize}.`)
      return;
    }
    if (sellFormDetails.Quantity < lotSize) {
      setErrorMessageQuantity(`Quantity must be greater than min limit: ${lotSize}`)
      return;
    }

    if (sellFormDetails.order_type === "SL/SP-M" && (!sellFormDetails.stopLossPrice && !sellFormDetails.stopProfitPrice)) {
      openSuccessSB('error', "Please enter stop loss or stop profit price.");
      return;
    }

    if (sellFormDetails.order_type === "LIMIT" && (!sellFormDetails.price)) {
      openSuccessSB('error', "Please enter price.");
      return;
    }

    if (buttonClicked) {
      // setButtonClicked(false);
      return;
    }
    setButtonClicked(true);
    e.preventDefault()
    setOpen(false);
    if (isOption) {
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
    const { exchange, symbol, buyOrSell, Quantity, Product, order_type, TriggerPrice, stopProfitPrice, stopLoss, stopLossPrice, validity, variety, price } = sellFormDetails;
    let endPoint
    let paperTrade = false;
    let tenxTraderPath;
    let internPath;
    let fromAdmin;
    if (from === paperTrader) {
      endPoint = 'paperTrade';
      paperTrade = true;
    } else if (from === infinityTrader) {
      endPoint = 'placingOrder';
      paperTrade = false;
    } else if (from === tenxTrader) {
      endPoint = 'tenxPlacingOrder';
      tenxTraderPath = true;
    } else if (from === internshipTrader) {
      endPoint = 'internPlacingOrder';
      internPath = true;
    } else if (from === "Admin") {
      endPoint = 'placingOrder'
      paperTrade = false;
      trader = traderId;
      fromAdmin = true;
    } else if (from === dailyContest) {
      if (module?.currentLiveStatus === "Live") {
        endPoint = 'placingLiveOrderDailyContest';
      } else {
        endPoint = 'placingOrderDailyContest';
      }
    } else if (from === marginX) {
      endPoint = 'placingOrderMarginx';
    } else if (from === battle) {
      endPoint = 'battleTrade';
    }

    console.log("module", module)
    const res = await fetch(`${baseUrl}api/v1/${endPoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        exchange, symbol, buyOrSell, Quantity, stopLoss, contestId: module?.data, battleId: subscriptionId,
        Product, order_type, TriggerPrice, stopProfitPrice, stopLossPrice, uId, exchangeInstrumentToken, fromAdmin,
        validity, variety, createdBy, order_id: dummyOrderId, subscriptionId, marginxId: subscriptionId,
        userId, instrumentToken, trader, paperTrade: paperTrade, tenxTraderPath, internPath, price

      })
    });
    const dataResp = await res.json();
    if (dataResp.status === 422 || dataResp.error || !dataResp) {
      openSuccessSB('error', dataResp.error)
    } else {
      tradeSound.play();
      if (dataResp.message === "COMPLETE") {
        openSuccessSB('complete', { symbol, Quantity })
      } else if (dataResp.message === "REJECTED") {
        openSuccessSB('reject', "Trade is Rejected due to Insufficient Fund")
      } else if (dataResp.message === "AMO REQ RECEIVED") {
        openSuccessSB('amo', "AMO Request Recieved")
      } else if (dataResp.message === "Live") {
      } else {
        openSuccessSB('else', dataResp.message)
      }
    }
    setsellFormDetails({});
    render ? setRender(false) : setRender(true)
  }

  async function addInstrument() {
    const res = await fetch(`${baseUrl}api/v1/addInstrument`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
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
    if (data.status === 422 || data.error || !data) {
      window.alert(data.error);
    } else {
      // openSuccessSB();
      //console.log(data.message)
    }
  }

  async function removeInstrument() {
    const response = await fetch(`${baseUrl}api/v1/inactiveInstrument/${instrumentToken}`, {
      method: "PATCH",
      credentials: "include",
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
    } else {
    }
  }

  const [successSB, setSuccessSB] = useState(false);

  const openSuccessSB = (value, content) => {
    if (value === "complete") {
      messageObj.color = 'success'
      messageObj.icon = 'check'
      messageObj.title = "Trade Successful";
      messageObj.content = `Traded ${content.Quantity} of ${content.symbol}`;
      setSuccessSB(true);
    };
    if (value === "reject") {
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "REJECTED";
      messageObj.content = content;
    };
    if (value === "amo") {
      messageObj.color = 'info'
      messageObj.icon = 'warning'
      messageObj.title = "AMO Requested";
      messageObj.content = content;
    };
    if (value === "else") {
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "REJECTED";
      messageObj.content = content;
    };
    if (value === "error") {
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "Error";
      messageObj.content = content;
    };
    if (value === "notAvailable") {
      messageObj.color = 'info' 
      messageObj.icon = 'warning'
      messageObj.title = "Information";
      messageObj.content = content;
    };

    setMessageObj(messageObj);
    setSuccessSB(true);
  }
  const closeSuccessSB = () => setSuccessSB(false);
  const renderSuccessSB = (
    <MDSnackbar
      color={messageObj.color}
      icon={messageObj.icon}
      title={messageObj.title}
      content={messageObj.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite={messageObj.color}
      sx={{ borderLeft: `10px solid ${messageObj.color==="success" ? "#4CAF50" : messageObj.color==="error" ? "#F44335" : "#1A73E8"}`, borderRight: `10px solid ${messageObj.color==="success" ? "#4CAF50" : messageObj.color==="error" ? "#F44335" : "#1A73E8"}`, borderRadius: "15px", width: "auto" }}
    />
  );

  const [checkQuantity, setCheckQuantity] = useState(lotSize);
  const [margin, setMargin] = useState();

  async function handleQuantity(e) {
    e.preventDefault();
    sellFormDetails.Quantity = Math.abs(Number(e.target.value));
    setCheckQuantity(Number(e.target.value));

    setMargin(null);
    setErrorMessageQuantity("")
    if (Number(e.target.value) <= Math.abs(runningLotsSymbol) && runningLotsSymbol > 0) {
      return setMargin("0.00");
    }

    if ((Number(e.target.value) > maxLot) || (Number(e.target.value) % lotSize !== 0) || (Number(e.target.value) < lotSize)) {
      return;
    }

    if (sellFormDetails.order_type === "LIMIT" && sellFormDetails.price && sellFormDetails.Quantity) {
      await checkMargin();
    }
    if (sellFormDetails.order_type !== "LIMIT" && sellFormDetails.Quantity) {
      await checkMargin();
    }

  }

  const priceChange = async (e) => {
    setsellFormDetails({ ...sellFormDetails, price: Number(e.target.value) });
    const inputPrice = Number(e.target.value);
    if (inputPrice < 0) {
      setsellFormDetails({ ...sellFormDetails, price: "" });
      return;
    }
    sellFormDetails.price = Number(e.target.value);
    setErrorMessagePrice("");
    if(Number(e.target.value) < ltp){
      return setErrorMessagePrice("Price should be greater then LTP.")
    }
    if (sellFormDetails.Quantity && sellFormDetails.price) {
      await checkMargin();
    }
  }

  const checkMargin = async () => {
    const { Quantity, Product, order_type, validity, variety, price } = sellFormDetails;

    const response = await fetch(`${baseUrl}api/v1/marginrequired`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        exchange, symbol, buyOrSell: "SELL", Quantity: runningLotsSymbol > 0 ? Quantity - Math.abs(runningLotsSymbol) : Quantity, Product, order_type, validity, variety, price, last_price: Number(newLtp)
      })
    });

    const data = await response.json();
    setMargin(data?.margin);
    // console.log("response", data)
  }

  async function removeQuantity() {
    if (sellFormDetails.Quantity % lotSize !== 0) {
      setCheckQuantity(parseInt(sellFormDetails.Quantity / lotSize) * lotSize)
      sellFormDetails.Quantity = parseInt(sellFormDetails.Quantity / lotSize) * lotSize
    } else {
      sellFormDetails.Quantity -= lotSize
      setCheckQuantity(prev => prev - lotSize)
    }

    if (sellFormDetails.Quantity <= Math.abs(runningLotsSymbol) && runningLotsSymbol > 0) {
      return setMargin("0.00");
    }

    await checkMargin();
    setErrorMessageQuantity("")
  }

  async function addQuantity() {
    if (sellFormDetails.Quantity % lotSize !== 0) {
      setCheckQuantity(parseInt(sellFormDetails.Quantity / lotSize + 1) * lotSize)
      sellFormDetails.Quantity = parseInt(sellFormDetails.Quantity / lotSize + 1) * lotSize
    } else {
      sellFormDetails.Quantity += lotSize
      setCheckQuantity(prev => prev + lotSize)
    }

    if (sellFormDetails.Quantity <= Math.abs(runningLotsSymbol) && runningLotsSymbol > 0) {
      return setMargin("0.00");
    }

    await checkMargin();
    setErrorMessageQuantity("")
  }

  function notAvailable(){
    openSuccessSB('notAvailable', "This feature is not available on stoxhero currently.");
  }

  return (
    <div>

      <MDButton size="small" color="error" sx={{ marginRight: 0.5, minWidth: 2, minHeight: 3 }} onClick={handleClickOpen} >
        S
      </MDButton>
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title">
          <DialogContent>
            <DialogContentText sx={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "320px" }}>

              <MDBox sx={{ display: "flex", justifyContent: 'space-between', textAlign: "center" }}>
                <MDBox sx={{ backgroundColor: "#ffffff", color: "#8D91A8", width: "150px", borderRadius: "5px", fontWeight: 600, fontSize: "13px", textAlign: "left" }}>
                  Variety : Regular
                </MDBox>
                <MDBox sx={{ backgroundColor: "#ffffff", color: "#8D91A8", width: "150px", borderRadius: "5px", fontWeight: 600, fontSize: "13px", textAlign: "right" }}>
                  Symbol : {symbolName}
                </MDBox>
              </MDBox>
              <MDBox sx={{ display: "flex", justifyContent: 'space-between', textAlign: "center", marginBottom: "20px" }}>
                <MDBox sx={{ backgroundColor: "#ffffff", color: "#8D91A8", width: "150px", borderRadius: "5px", fontWeight: 600, fontSize: "13px", textAlign: "left" }}>
                  Exchange : NFO
                </MDBox>
                <MDBox sx={{ backgroundColor: "#ffffff", color: "#8D91A8", width: "150px", borderRadius: "5px", fontWeight: 600, fontSize: "13px", textAlign: "right" }}>
                  LTP : ₹{ltp}
                </MDBox>
              </MDBox>

              <MDBox sx={{ display: "flex", justifyContent: 'space-between', textAlign: "center" }}>
                <MDBox sx={{ backgroundColor: "#F44335", color: "#ffffff", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                  Intraday (Same day)
                </MDBox>
                <MDBox onClick={notAvailable} sx={{ color: "#8D91A8", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px", border: ".5px solid #8D91A8" }}>
                  Delivery (Longterm)
                </MDBox>
              </MDBox>

              <MDBox sx={{ display: "flex", justifyContent: 'space-between', textAlign: "center", marginTop: "10px" }}>
                <MDBox sx={{ display: "flex", justifyContent: "space-between", alignContent: "center", alignItems: "center", width: "140px", borderRadius: "5px", cursor: "pointer", border: "0.5px solid #D2D6DA" }}>
                  <MDBox>
                    <RemoveIcon onClick={(checkQuantity !== lotSize && checkQuantity > lotSize) ? removeQuantity : () => { }} sx={{ marginLeft: "2px", marginTop: "5px", disabled: true }} />
                  </MDBox>

                  <MDBox>
                    <input onChange={(e) => { handleQuantity(e) }} type="number" style={{ width: "70px", height: "35px", border: "none", outline: "none", fontSize: "15px", textAlign: "center" }} value={checkQuantity}></input>
                  </MDBox>

                  <MDBox>

                    <AddIcon onClick={(checkQuantity !== maxLot && checkQuantity < maxLot) ? addQuantity : () => { }} sx={{ marginRight: "2px", marginTop: "5px" }} />
                  </MDBox>


                </MDBox>

                <TextField
                  id="outlined-basic" disabled={sellFormDetails.order_type === "MARKET" || sellFormDetails.order_type === "SL/SP-M"} label="Price" variant="outlined" onChange={(e) => { { priceChange(e) } }}
                  sx={{ width: "140px", innerHeight: "1px" }} type="number" value={sellFormDetails.price===0?"":sellFormDetails.price} />
              </MDBox>

              {ordertype === "SL/SP-M" &&
                <MDBox sx={{ display: "flex", justifyContent: 'space-between', textAlign: "center" }}>
                  <TextField
                    id="outlined-basic" disabled={sellFormDetails.order_type === "MARKET" || sellFormDetails.order_type === "LIMIT" || (runningLotsSymbol > 0 && checkQuantity <= Math.abs(runningLotsSymbol))} label="SL price" variant="outlined" onChange={(e) => { { stopLoss(e) } }}
                    sx={{ width: "140px", marginTop: "20px", innerHeight: "1px" }} type="number" value={sellFormDetails.stopLossPrice===0?"":sellFormDetails.stopLossPrice}/>

                  <TextField
                    id="outlined-basic" disabled={sellFormDetails.order_type === "MARKET" || sellFormDetails.order_type === "LIMIT" || (runningLotsSymbol > 0 && checkQuantity <= Math.abs(runningLotsSymbol))} label="SP price" variant="outlined" onChange={(e) => { { stopProfit(e) } }}
                    sx={{ width: "140px", marginTop: "20px", innerHeight: "1px" }} type="number" value={sellFormDetails.stopProfitPrice===0?"":sellFormDetails.stopProfitPrice} />
                </MDBox>}


              <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                <Typography fontSize={15} color={"error"}> {sellFormDetails.stopLossPrice && errorMessageStopLoss && errorMessageStopLoss}</Typography>
                <Typography fontSize={15} color={"error"}>{sellFormDetails.stopProfitPrice && errorMessageStopProfit && errorMessageStopProfit}</Typography>
                <Typography fontSize={15} color={"error"}>{errorMessageQuantity && errorMessageQuantity}</Typography>
                <Typography fontSize={15} color={"error"}>{errorMessagePrice && errorMessagePrice}</Typography>
              </Box>

              <MDBox sx={{ display: "flex", justifyContent: 'space-between', textAlign: "center", gap: "5px", marginTop: "20px" }}>
                <MDBox onClick={() => { marketHandleChange("MARKET") }} sx={{ backgroundColor: ordertype === "MARKET" ? "#F44335" : "#FFFFFF", color: ordertype === "MARKET" ? "#FFFFFF" : "#8D91A8", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px", border: ordertype !== "MARKET" && ".5px solid #8D91A8" }}>
                  Market
                </MDBox>

                <MDBox onClick={() => { marketHandleChange("LIMIT") }} sx={{ backgroundColor: ordertype === "LIMIT" ? "#F44335" : "#FFFFFF", color: ordertype === "LIMIT" ? "#FFFFFF" : "#8D91A8", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px", border: ordertype !== "LIMIT" && ".5px solid #8D91A8" }}>
                  Limit
                </MDBox>

                <MDBox onClick={() => { marketHandleChange("SL/SP-M") }} sx={{ backgroundColor: ordertype === "SL/SP-M" ? "#F44335" : "#FFFFFF", color: ordertype === "SL/SP-M" ? "#FFFFFF" : "#8D91A8", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px", border: ordertype !== "SL/SP-M" && ".5px solid #8D91A8" }}>
                  SL/SP-M
                </MDBox>
              </MDBox>

              <MDBox sx={{ display: "flex", justifyContent: 'space-between', textAlign: "center", gap: "5px", marginTop: "20px" }}>
                <MDBox sx={{ backgroundColor: "#F44335", color: "#ffffff", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                  Day
                </MDBox>

                <MDBox onClick={notAvailable} sx={{ color: "#8D91A8", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px", border: ".5px solid #8D91A8" }}>
                  Immediate
                </MDBox>

                <MDBox onClick={notAvailable} sx={{ color: "#8D91A8", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px", border: ".5px solid #8D91A8" }}>
                  Minute
                </MDBox>
              </MDBox>

              {margin &&
                <MDBox sx={{ display: "flex", justifyContent: "left", alignContent: "center", alignItems: "center", marginTop: "5px" }}>
                  <MDTypography sx={{ fontSize: "14px", color: "#000000", fontWeight: 500 }}>Virtual margin required:</MDTypography>
                  <MDTypography sx={{ fontSize: "14px", color: "#000000", fontWeight: 500, marginLeft: "4px" }}> <b>₹{margin}</b></MDTypography>
                  <MDTypography sx={{ fontSize: "14px", color: "#000000", fontWeight: 500, marginTop: "4px", marginLeft: "4px" }}> <span><RefreshIcon onClick={sellFormDetails.Quantity <= Math.abs(runningLotsSymbol) && runningLotsSymbol > 0 ? ()=>{} : async () => { await checkMargin() }} sx={{ cursor: "pointer" }} /></span> </MDTypography>
                </MDBox>}

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <MDButton size="small" variant="contained" color="error" onClick={handleClose} autoFocus>
              Cancel
            </MDButton>
            <MDButton size="small" disabled={(sellFormDetails.stopLossPrice && (Number(ltp) > sellFormDetails.stopLossPrice)) || (sellFormDetails.stopProfitPrice && (Number(ltp) < sellFormDetails.stopProfitPrice)) || (sellFormDetails.price && (sellFormDetails.price < Number(ltp)))} autoFocus variant="contained" color="error" onClick={(e) => { sellFunction(e) }}>
              Sell
            </MDButton>

          </DialogActions>
        </Dialog>
      </div >
      {renderSuccessSB}
    </div >
  );
}

export default memo(SellModel);