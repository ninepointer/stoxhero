import React, { useContext, useState, memo, useEffect } from 'react'
// import axios from "axios";
import { userContext } from '../../../AuthContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// import uniqid from "uniqid"
import MDSnackbar from '../../../components/MDSnackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import MDButton from '../../../components/MDButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { Box, Typography } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { renderContext } from '../../../renderContext';
import { Howl } from "howler";
import sound from "../../../assets/sound/tradeSound.mp3"
import { marginX, paperTrader, infinityTrader, tenxTrader, internshipTrader, dailyContest, battle } from "../../../variables";
import MDBox from '../../../components/MDBox';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RefreshIcon from '@mui/icons-material/Refresh';
import MDTypography from '../../../components/MDTypography';


function ExitPosition({ltp, module, maxLot, lotSize, traderId, socket, subscriptionId, from, isFromHistory, product, symbol, quantity, exchange, instrumentToken, setExitState, exitState, exchangeInstrumentToken }) {
  const [buttonClicked, setButtonClicked] = useState(false);
  const { render, setRender } = useContext(renderContext);
  let checkBuyOrSell;
  if (quantity > 0) {
    checkBuyOrSell = "BUY"
  } else if (quantity < 0) {
    checkBuyOrSell = "SELL"
  }
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const getDetails = React.useContext(userContext);
  const tradeSound = getDetails.tradeSound;
  let date = new Date();
  let userId = getDetails.userDetails.email;
  let trader = getDetails.userDetails._id;
  let dummyOrderId = `${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(100000000 + Math.random() * 900000000)}`
  const [messageObj, setMessageObj] = useState({
    color: '',
    icon: '',
    title: '',
    content: ''
  })
  const [errorMessageQuantity, setErrorMessageQuantity] = useState("");


  const [open, setOpen] = React.useState(exitState);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [regularSwitch, setRegularSwitch] = React.useState(true);

  const [exitPositionFormDetails, setexitPositionFormDetails] = React.useState({
    exchange: "",
    symbol: "",
    ceOrPe: "",
    buyOrSell: "",
    variety: "",
    Product: product,
    Quantity: (Math.abs(quantity) > maxLot) ? maxLot : Math.abs(quantity),
    Price: "",
    order_type: "",
    TriggerPrice: "",
    stopLoss: "",
    validity: "",
  })

  const [filledQuantity, setFilledQuantity] = useState((Math.abs(quantity) > maxLot) ? maxLot : Math.abs(quantity));

  useEffect(() => {
    setFilledQuantity((Math.abs(quantity) > maxLot) ? maxLot : Math.abs(quantity))
  }, [quantity])

  // console.log("filledQuantity", filledQuantity, quantity)

  // function quantityChange(e) {
  //   setFilledQuantity(e.target.value)
  //   exitPositionFormDetails.Quantity = e.target.value
  // }

  exitPositionFormDetails.Product = product;


  const [market, setMarket] = React.useState('MARKET');
  exitPositionFormDetails.order_type = market;
  const marketHandleChange = (event) => {
    setMarket(event.target.value);
    exitPositionFormDetails.order_type = event.target.value;
  };
  const [validity, setValidity] = React.useState('DAY');
  exitPositionFormDetails.validity = validity;
  const validityhandleChange = (event) => {
    setValidity(event.target.value);
    exitPositionFormDetails.validity = event.target.value;
  };

  useEffect(() => {
    socket?.on(`sendResponse${trader.toString()}`, (data) => {
      // render ? setRender(false) : setRender(true);
      openSuccessSB(data.status, data.message)
    })
  }, [])

  const handleClickOpen = async () => {
    if (Math.abs(quantity) === 0) {
      openSuccessSB('error', "You do not have any open position for this symbol.")
      return;
    }
    setButtonClicked(false);
    // await checkMargin();
    setMargin("0.00")
    exitPositionFormDetails.Quantity = ((Math.abs(quantity) > maxLot) ? maxLot : Math.abs(quantity));
    setFilledQuantity((Math.abs(quantity) > maxLot) ? maxLot : Math.abs(quantity));
    setOpen(true);

  };

  const handleClose = (e) => {
    setOpen(false);
    setExitState(false);
    setButtonClicked(false);

    setMessageObj({});
    setErrorMessageQuantity("");
    setexitPositionFormDetails({});
    setFilledQuantity(null);
    setMargin(null);
  };

  let finalLot = maxLot / lotSize;
  let optionData = [];
  for (let i = 1; i <= finalLot; i++) {
    optionData.push(<MenuItem value={i * lotSize}>{i * lotSize}</MenuItem>)
  }

  async function exitPosition(e, uId) {
    if(exitPositionFormDetails.Quantity > maxLot){
      setErrorMessageQuantity(`Quantity must be lower than max limit: ${maxLot}`)
      return;
    }
    if(exitPositionFormDetails.Quantity % lotSize !== 0){
      setErrorMessageQuantity(`The quantity should be a multiple of ${lotSize}. Try again with ${parseInt(exitPositionFormDetails.Quantity/lotSize) * lotSize} or ${parseInt(exitPositionFormDetails.Quantity/lotSize + 1) * lotSize}.`)
      return;
    }
    if(exitPositionFormDetails.Quantity < lotSize){
      setErrorMessageQuantity(`Quantity must be greater than min limit: ${lotSize}`)
      return;
    }

    if (buttonClicked) {
      return;
    }
    setButtonClicked(true);

    e.preventDefault()
    setOpen(false);
    setExitState(false);

    exitPositionFormDetails.buyOrSell = "BUY";

    if (checkBuyOrSell === "BUY") {
      exitPositionFormDetails.buyOrSell = "SELL"
    } else if (checkBuyOrSell === "SELL") {
      exitPositionFormDetails.buyOrSell = "BUY"
    }

    if (regularSwitch === true) {
      exitPositionFormDetails.variety = "regular"
    }
    else {
      exitPositionFormDetails.variety = "amo"
    }


    exitPositionFormDetails.exchange = exchange;
    exitPositionFormDetails.symbol = symbol;
    exitPositionFormDetails.Quantity = filledQuantity;

    setexitPositionFormDetails(exitPositionFormDetails)

    placeOrder();

  }


  async function placeOrder() {

    const { exchange, symbol, buyOrSell, Quantity, Price, Product, order_type, TriggerPrice, stopLoss, validity, variety } = exitPositionFormDetails;

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
    }else if (from === battle) {
      endPoint = 'battleTrade';
    }

    const res = await fetch(`${baseUrl}api/v1/${endPoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({

        exchange, symbol, buyOrSell, Quantity, Price, contestId: module?.data, battleId: subscriptionId,
        Product, order_type, TriggerPrice, stopLoss, internPath, marginxId: subscriptionId,
        validity, variety, order_id: dummyOrderId, subscriptionId, exchangeInstrumentToken, fromAdmin,
        userId, instrumentToken, trader, paperTrade: paperTrade, tenxTraderPath

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
      if (dataResp.message === "COMPLETE") {
        // //console.log(dataResp);
        openSuccessSB('complete', { symbol, Quantity })
        // window.alert("Trade Succesfull Completed");
      } else if (dataResp.message === "REJECTED") {
        // //console.log(dataResp);
        openSuccessSB('reject', "Trade is Rejected due to Insufficient Fund")
        // window.alert("Trade is Rejected due to Insufficient Fund");
      } else if (dataResp.message === "AMO REQ RECEIVED") {
        // //console.log(dataResp);
        openSuccessSB('amo', "AMO Request Recieved")
        // window.alert("AMO Request Recieved");
      } else if (dataResp.message === "Live") {
      } else {
        openSuccessSB('else', dataResp.message)

      }
      render ? setRender(false) : setRender(true)
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
      messageObj.color = 'warning' 
      messageObj.icon = 'warning'
      messageObj.title = "Warning";
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
      sx={{ borderLeft: `10px solid ${messageObj.color==="success" ? "#4CAF50" : messageObj.color==="error" ? "#F44335" : "#FB8C00"}`, borderRight: `10px solid ${messageObj.color==="success" ? "#4CAF50" : messageObj.color==="error" ? "#F44335" : "#FB8C00"}`, borderRadius: "15px", width: "auto" }}
    />
  );

  const [margin, setMargin] = useState("0.00");
  async function handleQuantity(e){
    e.preventDefault();
    exitPositionFormDetails.Quantity = Math.abs(e.target.value);
    setFilledQuantity(Number(e.target.value));

    setMargin(null);
    setErrorMessageQuantity("")

    if(e.target.value <= Math.abs(quantity)){
      return setMargin("0.00");
    }
    if(Number(e.target.value)){
      await checkMargin();
    }
    if((e.target.value > maxLot) || (e.target.value % lotSize !== 0) || (e.target.value < lotSize)){
      return;
    }
    
  }

  const checkMargin = async()=>{
    const { Product, validity, variety, price } = exitPositionFormDetails;
    const response = await fetch(`${baseUrl}api/v1/marginrequired`, {
      method: "PATCH",
      credentials:"include",
      headers: {
          "Accept": "application/json",
          "content-type": "application/json"
      },
      body: JSON.stringify({
        exchange, symbol, buyOrSell: checkBuyOrSell==="BUY" ? "SELL" : "BUY", Quantity: Number(exitPositionFormDetails.Quantity), Product, order_type: "MARKET", validity, variety, price, last_price: Number(ltp)
      })
    });

    const data = await response.json();
    setMargin(data?.margin);
    // console.log("response", data)
  }

  async function removeQuantity(){
    if(exitPositionFormDetails.Quantity % lotSize !== 0){
      setFilledQuantity(parseInt(exitPositionFormDetails.Quantity/lotSize) * lotSize)
      exitPositionFormDetails.Quantity  = parseInt(exitPositionFormDetails.Quantity/lotSize) * lotSize
    } else{
      exitPositionFormDetails.Quantity -= lotSize
      setFilledQuantity(prev => prev-lotSize)
    }


    if(exitPositionFormDetails.Quantity <= Math.abs(quantity)){
      return setMargin("0.00");
    }

    await checkMargin();
    setErrorMessageQuantity("")
  }

  async function addQuantity(){
    if(exitPositionFormDetails.Quantity % lotSize !== 0){
      setFilledQuantity(parseInt(exitPositionFormDetails.Quantity/lotSize + 1) * lotSize)
      exitPositionFormDetails.Quantity  = parseInt(exitPositionFormDetails.Quantity/lotSize + 1) * lotSize
    } else{
      exitPositionFormDetails.Quantity += lotSize
      setFilledQuantity(prev => prev+lotSize)
    }


    if(exitPositionFormDetails.Quantity <= Math.abs(quantity)){
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

      <MDButton size="small" sx={{ marginRight: 0.5, minWidth: 2, minHeight: 3 }} color="warning" onClick={handleClickOpen} disabled={isFromHistory}>
        E
      </MDButton>
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title">
          {/* <DialogTitle id="responsive-dialog-title" sx={{ textAlign: 'center' }}>
          </DialogTitle> */}
          <DialogContent>
            <DialogContentText sx={{ display: "flex", flexDirection: "column", justifyContent: "center" , width: "320px"}}>

              <MDBox sx={{ display: "flex", justifyContent: 'space-between', textAlign: "center" }}>
                <MDBox sx={{ backgroundColor: "#ffffff", color: "#8D91A8", width: "150px", borderRadius: "5px", fontWeight: 600, fontSize: "13px", textAlign: "left" }}>
                  Variety : Regular
                </MDBox>
                <MDBox sx={{ backgroundColor: "#ffffff", color: "#8D91A8", width: "150px", borderRadius: "5px", fontWeight: 600, fontSize: "13px", textAlign: "right" }}>
                  Symbol : {symbol?.slice(-7)}
                </MDBox>
              </MDBox>


              <MDBox sx={{ display: "flex", justifyContent: 'space-between', textAlign: "center" }}>
                <MDBox sx={{ backgroundColor: "#ffffff", color: "#8D91A8", width: "150px", borderRadius: "5px", fontWeight: 600, fontSize: "13px", textAlign: "left"  }}>
                  Index : {symbol.includes("FIN") ? "FINNIFTY" : symbol.includes("BANK") ? "BANKNIFTY" : "NIFTY"}
                </MDBox>
                <MDBox sx={{ backgroundColor: "#ffffff", color: "#8D91A8", width: "150px", borderRadius: "5px", fontWeight: 600, fontSize: "13px", textAlign: "right"  }}>
                  LTP : ₹{ltp}
                </MDBox>
              </MDBox>

              <MDBox sx={{ display: "flex", justifyContent: 'space-between', textAlign: "center", marginBottom: "20px" }}>
                <MDBox sx={{ backgroundColor: "#ffffff", color: "#8D91A8", width: "150px", borderRadius: "5px", fontWeight: 600, fontSize: "13px", textAlign: "left"  }}>
                  Exchange : NFO
                </MDBox>
                <MDBox sx={{ backgroundColor: "#ffffff", color: "#8D91A8", width: "150px", borderRadius: "5px", fontWeight: 600, fontSize: "13px", textAlign: "right"  }}>
                  Lots : {Math.abs(quantity)}
                </MDBox>
              </MDBox>

              <MDBox sx={{display: "flex", justifyContent: 'space-between', textAlign: "center"}}>
                <MDBox sx={{backgroundColor: "#FB8C00", color: "#ffffff", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                  Intraday (Same day)
                </MDBox>
                <MDBox onClick={notAvailable} sx={{color: "#8D91A8", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px", border: ".5px solid #8D91A8" }}>
                  Delivery (Longterm)
                </MDBox>
              </MDBox>

              <MDBox sx={{ display: "flex", justifyContent: 'space-between', textAlign: "center", marginTop: "20px" }}>
                <MDBox sx={{ display: "flex", justifyContent: "space-between", alignContent: "center", alignItems: "center", width: "150px", height: "35px", borderRadius: "5px", cursor: "pointer", border: "0.5px solid #D2D6DA" }}>
                  <MDBox>
                    <RemoveIcon onClick={(filledQuantity !== lotSize && filledQuantity > lotSize) ? removeQuantity : () => { }} sx={{ marginLeft: "2px", marginTop: "5px", disabled: true }} />
                  </MDBox>

                  <MDBox>
                    <input onChange={(e) => { handleQuantity(e) }} style={{ width: "70px", height: "20px", border: "none", outline: "none", fontSize: "15px", textAlign: "center" }} value={filledQuantity}></input>
                  </MDBox>

                  <MDBox>

                    <AddIcon onClick={(filledQuantity !== maxLot && filledQuantity < maxLot) ? addQuantity : () => { }} sx={{ marginRight: "2px", marginTop: "5px" }} />
                  </MDBox>


                </MDBox>

                <MDBox sx={{ display: "flex", justifyContent: 'space-between', textAlign: "center", gap: "5px"}}>
                  <MDBox sx={{ backgroundColor: "#FB8C00", color: "#FFFFFF", minHeight: "2px", width: "150px", height: "35px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                    Market
                  </MDBox>

                </MDBox>

              </MDBox>
              <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                  <Typography fontSize={15} color={"error"}>{errorMessageQuantity && errorMessageQuantity}</Typography>
              </Box>
              <MDBox sx={{display: "flex", justifyContent: 'space-between', textAlign: "center", gap: "5px", marginTop: "20px"}}>
                <MDBox sx={{backgroundColor: "#FB8C00", color: "#ffffff", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                  Day
                </MDBox>

                <MDBox onClick={notAvailable} sx={{color: "#8D91A8", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px", border: ".5px solid #8D91A8" }}>
                  Immediate
                </MDBox>

                <MDBox onClick={notAvailable} sx={{color: "#8D91A8", minHeight: "2px", width: "150px", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: 600, fontSize: "13px", border: ".5px solid #8D91A8" }}>
                 Minute
                </MDBox>
              </MDBox>

              {margin &&
              <MDBox sx={{display: "flex", justifyContent: "left", alignContent: "center", alignItems: "center", marginTop: "5px"}}>
                <MDTypography sx={{fontSize: "14px", color: "#000000", fontWeight: 500 }}>Virtual margin required:</MDTypography>
                <MDTypography sx={{fontSize: "14px", color: "#000000", fontWeight: 500 ,marginLeft: "4px"}}> <b>₹{margin}</b></MDTypography>
                <MDTypography sx={{fontSize: "14px", color: "#000000", fontWeight: 500, marginTop: "4px", marginLeft: "4px" }}> <span><RefreshIcon onClick={exitPositionFormDetails.Quantity <= Math.abs(quantity) ? ()=>{} : async ()=>{await checkMargin()}} sx={{cursor: "pointer"}} /></span> </MDTypography>
              </MDBox>}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <MDButton size="small" variant="contained" color="warning" onClick={handleClose} autoFocus>
              Cancel
            </MDButton>
            <MDButton size="small" autoFocus variant="contained" color="warning" onClick={(e) => { exitPosition(e) }}>
              EXIT
            </MDButton>
          </DialogActions>
        </Dialog>
      </div >
      {renderSuccessSB}
    </div >
  );

}
export default memo(ExitPosition);
