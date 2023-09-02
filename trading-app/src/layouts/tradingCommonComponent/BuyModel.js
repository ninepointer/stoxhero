import React, { useRef, useContext, useState, useEffect } from "react";
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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MDButton from '../../components/MDButton';
import MDSnackbar from '../../components/MDSnackbar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { Box } from '@mui/material';
import { renderContext } from "../../renderContext";
import {Howl} from "howler";
import sound from "../../assets/sound/tradeSound.mp3"
import {dailyContest, paperTrader, infinityTrader, tenxTrader, internshipTrader, marginX } from "../../variables";


// import MDBox from '../../../../../components/MDBox';
// import { borderBottom } from '@mui/system';
// import { marketDataContext } from "../../../../../MarketDataContext";

const BuyModel = ({chartInstrument, isOption, setOpenOptionChain, traderId, socket, subscriptionId, buyState, exchange, symbol, instrumentToken, symbolName, lotSize, maxLot, ltp, fromSearchInstrument, expiry, from, setBuyState, exchangeSegment, exchangeInstrumentToken, module}) => {
  const tradeSound = new Howl({
    src : [sound],
    html5 : true
  })
  

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  const {render, setRender} = useContext(renderContext);
  const getDetails = React.useContext(userContext);
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
      optionData.push( <MenuItem value={i * lotSize}>{ i * lotSize}</MenuItem>)      
  }

  const [buttonClicked, setButtonClicked] = useState(false);

  const [open, setOpen] = React.useState(buyState);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [regularSwitch, setRegularSwitch] = React.useState(true);
  // const [appLive, setAppLive] = useState([]);

  const [buyFormDetails, setBuyFormDetails] = React.useState({
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

  useEffect(()=>{
    socket?.on(`sendResponse${trader.toString()}`, (data)=>{
      // render ? setRender(false) : setRender(true);
      openSuccessSB(data.status, data.message)
    })
  }, [])


  const [value, setValue] = React.useState('NRML');
  buyFormDetails.Product = value;
  const handleChange = (event) => {
    setValue(event.target.value);
    buyFormDetails.Product = event.target.value;

  };

  const [market, setMarket] = React.useState('MARKET');
  buyFormDetails.OrderType = market;
  const marketHandleChange = (event) => {
    setMarket(event.target.value);
    buyFormDetails.OrderType = event.target.value;
  };
  const [validity, setValidity] = React.useState('DAY');
  buyFormDetails.validity = validity;
  const validityhandleChange = (event) => {
    setValidity(event.target.value);
    buyFormDetails.validity = event.target.value;
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
    if(isOption){
        setOpenOptionChain(false) 
    }
    
    setBuyState(false);
    setButtonClicked(false);
  };

  async function buyFunction(e, uId) {
    //console.log("caseStudy 1: buy")
    // console.log("buttonClicked inside", buttonClicked)
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
    setBuyState(false);

    buyFormDetails.buyOrSell = "BUY";

    if (regularSwitch === true) {
      buyFormDetails.variety = "regular"
    }
    else {
      buyFormDetails.variety = "amo"
    }

    buyFormDetails.exchange = exchange;
    buyFormDetails.symbol = symbol

    setBuyFormDetails(buyFormDetails)

    placeOrder();

  }

  async function placeOrder() {
    // console.log("exchangeInstrumentToken", exchangeInstrumentToken)
    const { exchange, symbol, buyOrSell, Quantity, Price, Product, OrderType, TriggerPrice, stopLoss, validity, variety } = buyFormDetails;
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
    }

    console.log("module", module)
    const res = await fetch(`${baseUrl}api/v1/${endPoint}`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
          exchange, symbol, buyOrSell, Quantity, Price, contestId: module?.data,
          Product, OrderType, TriggerPrice, stopLoss, uId, exchangeInstrumentToken, fromAdmin,
          validity, variety, createdBy, order_id:dummyOrderId, subscriptionId, marginxId: subscriptionId,
          userId, instrumentToken, trader, paperTrade: paperTrade, tenxTraderPath, internPath

        })
    });
    const dataResp = await res.json();
    // console.log("dataResp", dataResp, res)
    if (dataResp.status === 422 || dataResp.error || !dataResp) {
        // console.log("dataResp if")
        // window.alert(dataResp.error);
        openSuccessSB('error', dataResp.error)
        //////console.log("Failed to Trade");
    } else {
      // console.log("dataResp else")
      //console.log("caseStudy 3: place resp")
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
        } else{
            openSuccessSB('else', dataResp.message)
        }
    }
    setBuyFormDetails({});
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

  // let renderSuccessSB;
  const [successSB, setSuccessSB] = useState(false);
  // let success = useRef(false);
  // let message = useRef({
  //   color: '',
  //   icon: '',
  //   title: '',
  //   content: ''
  // })
  const openSuccessSB = (value,content) => {
    // //console.log("Value: ",value)
    if(value === "complete"){

      // console.log("no response if")
        messageObj.color = 'success'
        messageObj.icon = 'check'
        messageObj.title = "Trade Successful";
        messageObj.content = `Traded ${content.Quantity} of ${content.symbol}`;
        setSuccessSB(true);

        // success.current = true;
        // message.current.color = 'success'
        // message.current.icon = 'check'
        // message.current.title = "Trade Successful";
        // message.current.content = `Traded ${content.Quantity} of ${content.symbol}`;
        // renderSuccessSB = (
        //   <MDSnackbar
        //     color= "success"
        //     icon= "check"
        //     title="Trade Successful"
        //     content="Trade Successful"
        //     open={true}
        //     onClose={closeSuccessSB}
        //     close={closeSuccessSB}
        //     bgWhite="info"
        //     sx={{ borderLeft: `10px solid ${message.current.icon == 'check' ? "green" : "red"}`, borderRight: `10px solid ${message.current.icon == 'check' ? "green" : "red"}`, borderRadius: "15px", width: "auto"}}
        //   />
        // );
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
  // console.log("no response ", successSB)
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



  // console.log("no response renderSuccessSB", success.current)


  return (
    <div>

      <MDButton  size="small" color="info" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={handleClickOpen} >
        B
      </MDButton>
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title">
          <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
            {"Regular"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ display: "flex", flexDirection: "column", marginLeft: 2 }}>
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
                  <FormControlLabel disabled="true" value="MIS" control={<Radio />} label="Intraday (MIS)" />
                  <FormControlLabel value="NRML" control={<Radio />} label="Overnight (NRML)" />
                </RadioGroup>
              </FormControl>

              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120, }}>
                  <InputLabel id="demo-simple-select-standard-label">Quantity</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    label="Quantity"
                    onChange={(e) => { { buyFormDetails.Quantity = (e.target.value) } }}
                    sx={{ margin: 1, padding: 0.5, }}
                  >
                    {/* <MenuItem value="100">100</MenuItem>
                    <MenuItem value="150">150</MenuItem> */}
                    {optionData.map((elem)=>{
                      // //console.log("optionData", elem)
                        return(
                            <MenuItem value={elem.props.value}>
                            {elem.props.children}
                            </MenuItem>
                        )
                    }) 
                    }
                  </Select>
                </FormControl>
                <TextField
                  id="outlined-basic" disabled="true" label="Price" variant="standard" onChange={(e) => { { buyFormDetails.Price = (e.target.value) } }}
                  sx={{ margin: 1, padding: 1, width: "300px", marginRight: 1, marginLeft: 1 }} />

                <TextField
                  id="outlined-basic" disabled="true" label="Trigger Price" variant="standard" onChange={(e) => { { buyFormDetails.TriggerPrice = (e.target.value) } }}
                  sx={{ margin: 1, padding: 1, width: "300px" }} />
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
                    <FormControlLabel  disabled="true" value="MARKET" control={<Radio />} label="MARKET" />
                    <FormControlLabel disabled="true" value="LIMIT" control={<Radio />} label="LIMIT" />
                  </RadioGroup>
                </FormControl>
                <FormControl  >
                  <FormLabel id="demo-controlled-radio-buttons-group" ></FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    onChange={(e) => { { buyFormDetails.stopLoss = (e.target.value) } }}
                    sx={{ display: "flex", flexDirection: "row" }}
                  >
                    <FormControlLabel disabled="true" value="SL" control={<Radio />} label="SL" />
                    <FormControlLabel disabled="true" value="SLM" control={<Radio />} label="SL-M" />
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
            <MDButton autoFocus variant="contained" color="info" onClick={(e) => { buyFunction(e) }}>
              BUY
            </MDButton>
            <MDButton variant="contained" color="info" onClick={handleClose} autoFocus>
              Close
            </MDButton>
          </DialogActions>
        </Dialog>
      </div >
      {renderSuccessSB}
    </div >
  );
}

export default memo(BuyModel);