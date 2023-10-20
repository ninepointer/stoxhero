import React, { useContext, useState } from "react";
import { useEffect, memo } from 'react';
// import axios from "axios"
import uniqid from "uniqid"
import { userContext } from "../../AuthContext";
import MDSnackbar from '../../components/MDSnackbar';

// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MDButton from '../../components/MDButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
// import MDBox from '../../components/MDBox';
import { Box, Typography } from '@mui/material';
import { renderContext } from "../../renderContext";
import {Howl} from "howler";
import sound from "../../assets/sound/tradeSound.mp3"
import {dailyContest, paperTrader, infinityTrader, tenxTrader, internshipTrader, marginX, battle } from "../../variables";
import { NetPnlContext } from "../../PnlContext";


const SellModel = ({chartInstrument, traderId, socket, exchangeSegment, exchangeInstrumentToken, subscriptionId, sellState, exchange, symbol, instrumentToken, symbolName, lotSize, ltp, maxLot, fromSearchInstrument, expiry, from, setSellState, module}) => {
  // console.log("rendering in userPosition: sellModel", exchange)
  const {render, setRender} = useContext(renderContext);
  // const marketDetails = useContext(marketDataContext)
  // console.log("rendering : sell");
  // const tradeSound = new Howl({
  //   src : [sound],
  //   html5 : true
  // })

  const { pnlData } = useContext(NetPnlContext);
  // console.log("pnlData", pnlData)
  // let runningLotsSymbol = 0;
  const runningLotsSymbol = pnlData.reduce((total, acc) => {
    if (acc?._id?.symbol === symbol) {
      return total + acc.lots;
    }
    return total; // return the accumulator if the condition is false
  }, 0);
  
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const getDetails = React.useContext(userContext);
  const tradeSound = getDetails.tradeSound;
  let uId = uniqid();
  let date = new Date();
  // let createdOn = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${(date.getFullYear())} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
  let createdBy = getDetails.userDetails.name;
  let userId = getDetails.userDetails.email;
  // let tradeBy = getDetails.userDetails.name;
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
      optionData.push( <option value={i * lotSize}>{ i * lotSize}</option>)
      
  }

  useEffect(()=>{
    socket?.on(`sendResponse${trader.toString()}`, (data)=>{
      // render ? setRender(false) : setRender(true);
      openSuccessSB(data.status, data.message)
    })
  }, [])


  const [open, setOpen] = React.useState(sellState);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [regularSwitch, setRegularSwitch] = React.useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [errorMessageStopLoss, setErrorMessageStopLoss] = useState("");
  const [errorMessageStopProfit, setErrorMessageStopProfit] = useState("");

  const [sellFormDetails, setsellFormDetails] = React.useState({
    exchange: "",
    symbol: "",
    ceOrPe: "",
    buyOrSell: "",
    variety: "",
    Product: "",
    Quantity: "",
    Price: "",
    OrderType: "",
    TriggerPrice: "",
    stopLoss: "",
    validity: "",
  })


  const [value, setValue] = React.useState('NRML');
  sellFormDetails.Product = value;
  const handleChange = (event) => {
    setValue(event.target.value);
    sellFormDetails.Product = event.target.value;

  };

  const [market, setMarket] = React.useState('MARKET');
  sellFormDetails.OrderType = market;
  const marketHandleChange = (event) => {
    setMarket(event.target.value);
    sellFormDetails.OrderType = event.target.value;
  };
  const [validity, setValidity] = React.useState('DAY');
  sellFormDetails.validity = validity;
  const validityhandleChange = (event) => {
    setValidity(event.target.value);
    sellFormDetails.validity = event.target.value;
  };

  const handleClickOpen = async () => {
    if(fromSearchInstrument){
      addInstrument();
      render ? setRender(false) : setRender(true);
    }
    setButtonClicked(false);
    setOpen(true);
  }; 

  const handleClose = async (e) => {
    if(fromSearchInstrument){
      removeInstrument();
      render ? setRender(false) : setRender(true);
    }
    
    setOpen(false);
    setSellState(false);
    setButtonClicked(false);
  };

  const stopLoss = async (e) => {
    setErrorMessageStopLoss("")
    sellFormDetails.stopLossPrice = e.target.value
    if(Number(ltp) > Number(e.target.value)){//errorMessage
      const text  = "Stop Loss price should be greater then LTP.";
      setErrorMessageStopLoss(text)
    }
    if(e.target.value === ""){
      sellFormDetails.stopLossPrice = false;
    }
  }


  const stopProfit = async (e) => {
    setErrorMessageStopProfit("")
    sellFormDetails.stopProfitPrice = e.target.value
    if(Number(ltp) < Number(e.target.value)){
      setErrorMessageStopProfit("Stop Profit price should be less then LTP.")
    }
    if(e.target.value === ""){
      sellFormDetails.stopProfitPrice = false;
    }
  }



  async function sellFunction(e) {

      if(!sellFormDetails.Quantity){
        openSuccessSB('error', "Please select quantity for trade.");
        return;
      }

      if(sellFormDetails.OrderType === "SL/SP-M" && (!sellFormDetails.stopLossPrice && !sellFormDetails.stopProfitPrice)){
        openSuccessSB('error', "Please enter stop loss or stop profit price.");
        return;
      }

      if(buttonClicked){
        return;
      }
      setButtonClicked(true);

      e.preventDefault()
      setOpen(false);
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

      // let id = setTimeout(()=>{
      //     render ? setRender(false) : setRender(true)
      // }, 1000);
      
  }

  async function placeOrder() {

    const {stopProfitPrice, stopLossPrice, exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType, TriggerPrice, stopLoss, validity, variety } = sellFormDetails;
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
    } else if(from === internshipTrader){
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

    const res = await fetch(`${baseUrl}api/v1/${endPoint}`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            
          exchange, symbol, buyOrSell, Quantity, Price, subscriptionId, contestId: module?.data,
          Product, OrderType, TriggerPrice, stopLoss, uId, exchangeInstrumentToken, fromAdmin, stopProfitPrice, stopLossPrice,
          validity, variety, createdBy, order_id:dummyOrderId, internPath, marginxId: subscriptionId,
          userId, instrumentToken, trader, paperTrade: paperTrade, tenxTraderPath, battleId: subscriptionId

        })
    });
    const dataResp = await res.json();
    ////console.log("dataResp", dataResp)
    if (dataResp.status === 422 || dataResp.error || !dataResp) {
        ////console.log(dataResp.error)
        // window.alert(dataResp.error);
        openSuccessSB('error', dataResp.error)
        //////console.log("Failed to Trade");
      } else {
        tradeSound.play();
        if(dataResp.message === "COMPLETE"){
            // //console.log(dataResp);
            openSuccessSB('complete', {symbol, Quantity})
            // window.alert("Trade Succesfull Completed");
        } else if(dataResp.message === "REJECTED"){
            // //console.log(dataResp);
            openSuccessSB('reject', "Trade is Rejected due to Insufficient Fund")
            // window.alert("Trade is Rejected due to Insufficient Fund");
        } else if(dataResp.message === "AMO REQ RECEIVED"){
            // //console.log(dataResp);
            openSuccessSB('amo', "AMO Request Recieved")
            // window.alert("AMO Request Recieved");
        } else if(dataResp.message === "Live"){
        }else{
            openSuccessSB('else', dataResp.message)
        }
    }

    setsellFormDetails({});
    render ? setRender(false) : setRender(true);
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
        exchangeInstrumentToken, exchangeSegment
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
    // //console.log("Value: ",value)
    if(value === "complete"){
        messageObj.color = 'success'
        messageObj.icon = 'check'
        messageObj.title = "Trade Successful";
        messageObj.content = `Traded ${content.Quantity} of ${content.symbol}`;

    };
    if(value === "reject"){
      messageObj.color = 'error'
      messageObj.icon = 'error'
      messageObj.title = "REJECTED";
      messageObj.content = content;
    };
    if(value === "amo"){
      messageObj.color = 'info'
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
  // //console.log("Title, Content, Time: ",title,content,time)


  const renderSuccessSB = (
    <MDSnackbar
      color= {messageObj.color}
      icon= {messageObj.icon}
      title={messageObj.title}
      content={messageObj.content}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
      
      sx={{ borderLeft: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRight: `10px solid ${messageObj.icon == 'check' ? "green" : "red"}`, borderRadius: "15px", width: "auto"}}
    />
  );

  const [checkQuantity, setChaeckQuantity] = useState();
    function handleQuantity(e){
      sellFormDetails.Quantity = e.target.value;
      setChaeckQuantity(e.target.value);
    }

  return (
    <div>

      <MDButton size="small" sx={{marginRight:0.5,minWidth:2,minHeight:3}} color="error" onClick={handleClickOpen} >
        S
      </MDButton>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
          {"Regular"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ display: "flex", flexDirection: "column", marginLeft: 2, marginTop: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", margin: 2 }}><Box sx={{ backgroundColor: "#ccccb3", fontWeight: 600, padding:"5px", borderRadius:"5px" }}>{symbolName}</Box> &nbsp; &nbsp; &nbsp; <Box sx={{ backgroundColor: "#ccccb3", fontWeight: 600, padding:"5px", borderRadius:"5px" }}>₹{ltp}</Box></Box>
            <FormControl >

              <FormLabel id="demo-controlled-radio-buttons-group" sx={{ width: "300px" }}></FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={handleChange}
                sx={{ display: "flex", flexDirection: "row" }}
              >
                <FormControlLabel value="MIS" disabled="true" control={<Radio />} label="Intraday (MIS)" />
                <FormControlLabel value="NRML" disabled="true" control={<Radio />} label="Overnight (NRML)" />
              </RadioGroup>
            </FormControl>

            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120, }}>
                <InputLabel id="demo-simple-select-standard-label">Quantity</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="Quantity"
                  // { sellFormDetails.Quantity = (e.target.value) }
                  // sellFormDetails(prev => ({...prev, Quantity: e.target.value}))
                  onChange={(e) => { handleQuantity(e)  }}
                  sx={{ margin: 1, padding: 0.5, }}
                >
                  {/* <MenuItem value="100">100</MenuItem>
                    <MenuItem value="150">150</MenuItem> */}
                  {optionData.map((elem) => {
                    // //console.log("optionData", elem)
                    return (
                      <MenuItem value={elem.props.value}>
                        {elem.props.children}
                      </MenuItem>
                    )
                  })
                  }
                </Select>
              </FormControl>

              <TextField
                id="outlined-basic" disabled={from !== "TenX Trader" || sellFormDetails.OrderType === "MARKET" || sellFormDetails.OrderType === "SL/SP-M"} label="Price" variant="standard" onChange={(e) => { { stopLoss(e) } }}
                sx={{ margin: 1, padding: 1, width: "300px", marginRight: 1, marginLeft: 1 }} type="number" />

              <TextField
                id="outlined-basic" disabled={from !== "TenX Trader" || sellFormDetails.OrderType === "MARKET" || sellFormDetails.OrderType === "LIMIT" || checkQuantity <= runningLotsSymbol} label="StopLoss Price" variant="standard" onChange={(e) => { { stopLoss(e) } }}
                sx={{ margin: 1, padding: 1, width: "300px", marginRight: 1, marginLeft: 1 }} type="number" />

              <TextField
                id="outlined-basic" disabled={from !== "TenX Trader" || sellFormDetails.OrderType === "MARKET" || sellFormDetails.OrderType === "LIMIT" || checkQuantity <= runningLotsSymbol} label="StopProfit Price" variant="standard" onChange={(e) => { { stopProfit(e) } }}
                sx={{ margin: 1, padding: 1, width: "300px" }} type="number" />

            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "10px" }}>
                  <Typography fontSize={15} color={"error"}> {sellFormDetails.stopLossPrice && errorMessageStopLoss && errorMessageStopLoss}</Typography>
                  <Typography fontSize={15} color={"error"}>{sellFormDetails.stopProfitPrice && errorMessageStopProfit && errorMessageStopProfit}</Typography>
              </Box>


              <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                <FormControl  >
                  <FormLabel id="demo-controlled-radio-buttons-group" ></FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={market}
                    onChange={marketHandleChange}
                    sx={{ display: "flex", flexDirection: "row" }}
                  >
                    <FormControlLabel value="MARKET" control={<Radio />} label="MARKET" />
                    <FormControlLabel disabled="false" value="LIMIT" control={<Radio />} label="LIMIT" />
                    <FormControlLabel value="SL/SP-M" control={<Radio />} label="SL/SP-M" />

                  </RadioGroup>
                </FormControl>

              </Box>

            <Box>
              <FormControl  >
                <FormLabel id="demo-controlled-radio-buttons-group" >Validity</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={validity}
                  onChange={validityhandleChange}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <FormControlLabel value="DAY" disabled="true" control={<Radio />} label="DAY" />
                  <FormControlLabel value="IMMEDIATE" disabled="true" control={<Radio />} label="IMMEDIATE" />
                  <FormControlLabel value="MINUTES" disabled="true" control={<Radio />} label="MINUTES" />
                </RadioGroup>
              </FormControl>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton disabled={(sellFormDetails.stopLossPrice && (Number(ltp) > sellFormDetails.stopLossPrice)) || (sellFormDetails.stopProfitPrice && (Number(ltp) < sellFormDetails.stopProfitPrice))} autoFocus variant="contained" color="error" onClick={(e) => { sellFunction(e) }}>
            Sell
          </MDButton>
          <MDButton variant="contained" color="error" onClick={handleClose} autoFocus>
            Cancel
          </MDButton>
        </DialogActions>


      </Dialog>
      {renderSuccessSB}
    </div>
  );
}

export default memo(SellModel)