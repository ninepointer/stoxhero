import React from "react";
import axios from "axios";
import { useEffect, useState, useContext, useRef, useReducer } from "react";
// @mui material components
import { Chart } from 'chart.js/auto';
// Chart.register(...registerables);
import Grid from "@mui/material/Grid";
// import Input from "@mui/material/Input";

// Material Dashboard 2 React components

// import MDButton from "../";
import MDButton from "../../../components/MDButton";
import MDSnackbar from "../../../components/MDSnackbar";
// import { userContext } from "../../../AuthContext";
import { Tooltip } from '@mui/material';




// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import TextField from '@mui/material/TextField';
// import { createTheme } from '@mui/material/styles';
import { RxCross2 } from 'react-icons/rx';
import { AiOutlineSearch } from 'react-icons/ai';
// import { userContext } from "../../AuthContext";
import BuyModel from "../BuyModel";
import SellModel from "../SellModel";
import { marketDataContext } from "../../../MarketDataContext";
import uniqid from "uniqid"
import { renderContext } from "../../../renderContext";
import {battle, marginX, paperTrader, infinityTrader, tenxTrader, internshipTrader, dailyContest } from "../../../variables";
import { userContext } from "../../../AuthContext";
import {maxLot_BankNifty, maxLot_Nifty, maxLot_FinNifty} from "../../../variables";

const initialState = {
  instrumentsData: [],
  successSB: false,
  text: '',
  timeoutId: null,
  addOrRemoveCheck: null,
  // userInstrumentData: [],
  instrumentName: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'setEmptyInstrumentsData':
      return { ...state, instrumentsData: action.payload };
    case 'setInstrumentsData':
      return { ...state, instrumentsData: action.payload };
    case 'openSuccess':
      return { ...state, successSB: action.payload };
    case 'closeSuccess':
      return { ...state, successSB: action.payload };
    case 'setText':
      return { ...state, text: action.payload };
    case 'setEmptyText':
      return { ...state, text: action.payload };
    case 'setValueInText':
      return { ...state, text: action.payload };
    case 'setAddOrRemoveCheckFalse':
      return { ...state, addOrRemoveCheck: action.payload };
    case 'setAddOrRemoveCheckTrue':
      return { ...state, addOrRemoveCheck: action.payload };
    // case 'setUserInstrumentData':
    //   return { ...state, userInstrumentData: action.payload };
    case 'setInstrumentName':
      return { ...state, instrumentName: action.payload };
  

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}


function TradableInstrument({socket, isGetStartedClicked, setIsGetStartedClicked, from, subscriptionId, moduleData, watchList}) {

  if(from === marginX || from === battle){
    from = dailyContest;
  }
  const {render, setRender} = useContext(renderContext);
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  let textRef = useRef(null);
  const PAGE_SIZE = 20;
  const marketDetails = useContext(marketDataContext)
  const [timeoutId, setTimeoutId] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [buyState, setBuyState] = useState(false);
  const [sellState, setSellState] = useState(false);
  const getDetails = useContext(userContext);

  const openSuccessSB = () => {
    return dispatch({ type: 'openSuccess', payload: true });
  }
  const closeSuccessSB = () => {
    return dispatch({ type: 'closeSuccess', payload: false });
  }

  useEffect(()=>{
    if(isGetStartedClicked){
      textRef.current.focus();
      // setValueInText
      dispatch({ type: 'setValueInText', payload: 'NIFTY' });
      // setText('17300CE');
      sendSearchReq('NIFTY');
      setIsGetStartedClicked(false)
    }
  },[isGetStartedClicked])


  function sendSearchReq(e) {
    const value = e?.target?.value ? e.target.value : e;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setTimeoutId(
      setTimeout(() => {
        window.webengage.track('search_instrument_clicked', {
          user: getDetails?.userDetails?._id,
          searchString: value
        })
        sendRequest(value);
      }, 400)
    );
  }

  function handleClear() {
    // setText('');
    dispatch({ type: 'setEmptyText', payload: '' });
    dispatch({ type: 'setEmptyInstrumentsData', payload: [] });
  }

  function sendRequest(data){

    if(data == ""){
      dispatch({ type: 'setEmptyInstrumentsData', payload: [] });
      return;
    }

    // console.log("moduleData", moduleData, dailyContest)

    let isNifty = moduleData?.isNifty;
    let isBankNifty = moduleData?.isBank;
    let isFinNifty = moduleData?.isFin;
    let isAllIndex = moduleData?.isAll;
    let url = "";
    let endPoint = "";

    if(isNifty){
      url = `&isNifty=${true}`;
    }
    if(isBankNifty){
      url += `&isBankNifty=${true}`;
    }
    if(isFinNifty){
      url += `&isFinNifty=${true}`;
    }
    if(isAllIndex){
      url = `&isNifty=${true}&isBankNifty=${true}&isFinNifty=${true}`;
    }

    if((from === dailyContest)){
      endPoint = `${baseUrl}api/v1/tradableInstruments?search=${data}&page=${1}&size=${PAGE_SIZE}${url}&dailyContest=${dailyContest}`
    } else{
      endPoint = `${baseUrl}api/v1/tradableInstruments?search=${data}&page=${1}&size=${PAGE_SIZE}`
    }

    axios.get(`${endPoint}`, {
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res)=>{
      dispatch({ type: 'setInstrumentsData', payload: (res.data) });
    }).catch((err)=>{
      //console.log(err);
    })
  }

  async function subscribeInstrument(instrumentData, addOrRemove){

    const {exchange_token, instrument_token, tradingsymbol, name, strike, lot_size, instrument_type, exchange, expiry, accountType, segment, chartInstrument} = instrumentData

    let maxLot = (tradingsymbol)?.includes("BANKNIFTY") ? maxLot_BankNifty : (tradingsymbol)?.includes("FINNIFTY") ? maxLot_FinNifty :  maxLot_Nifty;

    dispatch({ type: 'setInstrumentName', payload: `${strike} ${instrument_type}` });
    if(addOrRemove === "Add"){
      window.webengage.track('instrument_add_clicked', {
        user: getDetails?.userDetails?._id,
        instrument_token: instrumentData
      })
      dispatch({ type: 'setAddOrRemoveCheckTrue', payload: true });
      const res = await fetch(`${baseUrl}api/v1/addInstrument`, {
        method: "POST",
        credentials:"include",
        headers: {
            "content-type" : "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          instrument: name, exchange, status: "Active", 
          symbol: tradingsymbol, lotSize: lot_size, 
          instrumentToken: instrument_token, uId: uniqid(), 
          contractDate: expiry, maxLot: maxLot, from, chartInstrument,
          accountType, exchangeSegment: segment, exchangeInstrumentToken: exchange_token
        })
      });
    
      const data = await res.json();
      if(data.status === 422 || data.error || !data){
          window.alert(data.error);
      }else{
        openSuccessSB();
      }
      
    } else{
      dispatch({ type: 'setAddOrRemoveCheckFalse', payload: false });
      window.webengage.track('instrument_remove_clicked', {
        user: getDetails?.userDetails?._id,
        instrument_token: instrumentData
      })
      // setAddOrRemoveCheck(false);
      const response = await fetch(`${baseUrl}api/v1/inactiveInstrument/${instrument_token}`, {
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
      if (permissionData.status === 422 || permissionData.error || !permissionData) {
          window.alert(permissionData.error);
      }else {
          openSuccessSB();
      }
      
    }
    render ? setRender(false) : setRender(true);
  }



  let title = `Instrument ${state.addOrRemoveCheck ? "Added" : "Removed"}`
  let content = `${state.instrumentName} is ${state.addOrRemoveCheck ? "Added to" : "Removed from"} your watchlist`
  let color = state.addOrRemoveCheck ? "success" : "error";
  let icon = state.addOrRemoveCheck ? "check" : "error";
  const renderSuccessSB = (
    <MDSnackbar
      color={color}
      icon={icon}
      title={title}
      content={content}
      // dateTime={timestamp}
      open={state.successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
      sx={{ borderLeft: `10px solid ${state.addOrRemoveCheck ? "green" : "red"}`, borderRadius: "15px"}}
    />
  );

  const handleSellClick = (index) => {
    window.webengage.track('sell_clicked_from_searchInstrument', {
      user: getDetails?.userDetails?._id
    })
    setSellState(true)
    const newRows = [...state.instrumentsData];
    newRows[index].sellState = true;
    state.instrumentsData = (newRows);
  };
  const handleBuyClick = (index) => {
    window.webengage.track('buy_clicked_from_searchInstrument', {
      user: getDetails?.userDetails?._id
    })
    setBuyState(true)
    const newRows = [...state.instrumentsData];
    newRows[index].sellState = true;
    state.instrumentsData = (newRows);
  };

  return (
    <MDBox sx={{backgroundColor:"white", display:"flex", borderRadius:2, marginBottom:2}}>
      <MDBox display="flex" flexDirection="column" justifyContent="space-between" sx={{width:"100%"}}>
        <TextField
          id="outlined-basic" 
          // label="Click here to search any symbol and add them in your watchlist to start trading" 
          variant="outlined" 
          type="text"
          placeholder="Type here to search any symbol and add them in your watchlist to start trading"
          value={state.text}
          inputRef={textRef}
          InputProps={{
            onFocus: () => textRef.current.select(),
            endAdornment: (
              <MDButton variant="text" color={from === paperTrader ? "dark" : "light"} onClick={handleClear}>{state.text && <RxCross2/>}</MDButton>
            ),
            startAdornment: (
              <>{<AiOutlineSearch/>}</>
            ),
          }}
          sx={{margin: 0, background:"white",padding : 0, borderRadius:2 ,width:"100%",'& label': { color: '#49a3f1', fontSize:20, padding:0.4 }}} onChange={(e)=>{dispatch({ type: 'setText', payload: e.target.value });sendSearchReq(e)}} //e.target.value.toUpperCase()
        />
        <MDBox>
        { state.instrumentsData?.length > 0 &&
          (state.instrumentsData.map((elem, index)=>{
            let maxLot = (elem.tradingsymbol)?.includes("BANKNIFTY") ? maxLot_BankNifty : (elem.tradingsymbol)?.includes("FINNIFTY") ? maxLot_FinNifty : (getDetails?.userDetails?.role?.roleName === infinityTrader ? maxLot_Nifty/2 : maxLot_Nifty);

            // let maxLot = (getDetails?.userDetails?.role?.roleName==infinityTrader) ? 900 : elem.lot_size*36
            elem.sellState = false;
            elem.buyState = false;
            let perticularInstrumentData = watchList?.filter((subElem)=>{
              return subElem.instrumentToken === elem.instrument_token
            })

            let perticularMarketData = marketDetails.marketData.filter((subElem)=>{
              return subElem.instrument_token === elem.instrument_token
            })
            //console.log("perticularMarketData", perticularMarketData)
            const id = elem.instrument_token;
            const date = new Date(elem.expiry);
            const day = date.getDate();
            const options = { month: 'short' };
            const month = new Intl.DateTimeFormat('en-US', options).format(date);
            const formattedDate = `${day}${getOrdinalSuffix(day)} ${month}`;

            function getOrdinalSuffix(day) {
              const suffixes = ['th', 'st', 'nd', 'rd'];
              const v = day % 100;
              return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
            } 
            return(
              
              <>
              {state.text && (
                <Grid container lg={12} key={elem._id}
                sx={{
                  fontSize:13,
                  display:"flex",
                  gap:"10px",
                  alignItems:"center",
                  flexDirection:"row",
                  justifyContent:"space-between",
                  border:"0.25px solid white",
                  borderRadius:2,
                  backgroundColor: (from===infinityTrader || from === tenxTrader || from === internshipTrader ) && 'white',
                  color: from === paperTrader ? "white" : from === dailyContest ? "#1e2e4a" : "lightgray",
                  padding:"0.5px",
                  '&:hover': {
                    color: (from===infinityTrader || from === tenxTrader || from === internshipTrader ) && '#1e2e4a',
                    backgroundColor: from === paperTrader ? 'lightgray' : 'lightgray',
                    cursor: 'pointer',
                    fontWeight: 600
                  }
                }}
                >
                  <Grid sx={{color:"white", textAlign:"center", display: { xs: 'none', lg: 'block' }}} xs={0} lg={2.2}>{elem.name}</Grid>
                  <Grid sx={{ display: { xs: 'none', lg: 'block' } }} xs={0} lg={2.2}>{formattedDate}</Grid>
                  <Grid xs={5} lg={2.2}>{elem.tradingsymbol}</Grid>
                  <Grid sx={{ display: { xs: 'none', lg: 'block' } }} xs={0} lg={2.2}>{elem.exchange}</Grid>
                  <Grid xs={5} lg={2} mr={4} display="flex" justifyContent="space-between">
                    <Grid  >
                      <Tooltip title="Buy" placement="top">

                        {!elem.buyState ?
                          <BuyModel fromTradable={true} chartInstrument={elem.chartInstrument} socket={socket} subscriptionId={subscriptionId} setBuyState={setBuyState} buyState={buyState} from={from} render={render} setRender={setRender} symbol={elem.tradingsymbol} exchange={elem.exchange} instrumentToken={elem.instrument_token} symbolName={`${elem.strike} ${elem.instrument_type}`} lotSize={elem.lot_size} maxLot={maxLot} ltp={(perticularMarketData[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={elem.expiry} exchangeInstrumentToken={elem.exchange_token} exchangeSegment={elem.segment} module={moduleData}/>
                          :
                          <MDButton  size="small" color="info" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={()=>{handleBuyClick(index)}} >
                            B
                          </MDButton>
                        }
                          </Tooltip>
                    </Grid>

                    <Grid>
                        {!elem.sellState ?
                          <SellModel fromTradable={true} chartInstrument={elem.chartInstrument} socket={socket} subscriptionId={subscriptionId} setSellState={setSellState} sellState={sellState} from={from} render={render} setRender={setRender} symbol={elem.tradingsymbol} exchange={elem.exchange} instrumentToken={elem.instrument_token} symbolName={`${elem.strike} ${elem.instrument_type}`} lotSize={elem.lot_size} maxLot={maxLot} ltp={(perticularMarketData[0]?.last_price)?.toFixed(2)} fromSearchInstrument={true} expiry={elem.expiry} exchangeInstrumentToken={elem.exchange_token} exchangeSegment={elem.segment} module={moduleData}/>
                          :
                          <MDButton  size="small" color="error" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={()=>{handleSellClick(index)}} >
                            S
                          </MDButton>
                        }
                    </Grid>
                    {perticularInstrumentData.length ?
                    <Grid lg={2.2}>
                      <Tooltip title="Remove Instrument" placement="top">
                        <MDButton size="small" color="secondary" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={()=>{subscribeInstrument(elem, "Remove")}}>-</MDButton>
                      </Tooltip>
                    </Grid>
                    :
                    <Grid lg={2.2}>
                      <Tooltip title="Add Instrument" placement="top">
                        <MDButton size="small" color="warning" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={()=>{subscribeInstrument(elem, "Add")}}>+</MDButton>
                      </Tooltip>
                    </Grid>
                    }
                  </Grid>
                </Grid>
                )}
                {renderSuccessSB}
              </>
            )
          }))
        }
        </MDBox>
      {/* <TradableInstrument instrumentsData={instrumentsData} render={render} setRender={setRender} uId={uId} /> */}
      </MDBox>
    </MDBox>
)
}

export default TradableInstrument;
