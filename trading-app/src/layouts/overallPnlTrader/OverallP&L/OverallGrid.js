import React, { useEffect, useState, useContext } from 'react'
import Card from "@mui/material/Card";
import axios from "axios";
import { NetPnlContext } from '../../../PnlContext';
import { MenuItem, TextField, Typography } from "@mui/material";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { Tooltip } from '@mui/material';
import { GrAnchor } from "react-icons/gr";
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import MDButton from '../../../components/MDButton';
import ExitPosition from '../../tradingCommonComponent/OverallP&L/ExitPosition';
import Buy from "../../tradingCommonComponent/BuyModel";
import Sell from "../../tradingCommonComponent/SellModel"
import OverallRow from './OverallRow';
import { marketDataContext } from '../../../MarketDataContext';
import Grid from '@mui/material/Grid'
import { renderContext } from '../../../renderContext';
// import { paperTrader, infinityTrader, tenxTrader, internshipTrader } from "../../../variables";
import { userContext } from '../../../AuthContext';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

function OverallGrid({ socket, setIsGetStartedClicked, from, subscriptionId }) {
  const { render, setRender } = useContext(renderContext);
  const getDetails = useContext(userContext);
  let styleTD = {
    textAlign: "center",
    fontSize: "9px",
    fontWeight: "800",
    color: "#7b809a",
    opacity: 0.7,
  }



  const { updateNetPnl, setPnlData } = useContext(NetPnlContext);
  const marketDetails = useContext(marketDataContext)
  const [exitState, setExitState] = useState(false);
  const [buyState, setBuyState] = useState(false);
  const [sellState, setSellState] = useState(false);
  const [trader, setTrader] = useState([])
  const [value, setValue] = useState(null);
  // const [value, setValue] = React.useState<FilmOptionType | null>(null);
  // const [selectedTrader, setSelectedTrader] = useState("");

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
  // let pnlEndPoint = from === paperTrader ? `paperTrade/pnl` : from === infinityTrader ? "infinityTrade/pnl" : from === tenxTrader ? `tenX/${subscriptionId}/trade/pnl` : from === internshipTrader && `internship/pnl/${subscriptionId}`;
  const [trackEvent, setTrackEvent] = useState({});


  useEffect(() => {
    axios.get(`${baseUrl}api/v1/getliveprice`)
      .then((res) => {
        marketDetails.setMarketData(res.data);
      }).catch((err) => {
        return new Error(err);
      })
    socket?.on("tick-room", (data) => {

      marketDetails.setMarketData(prevInstruments => {
        const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
        data.forEach(instrument => {
          instrumentMap.set(instrument.instrument_token, instrument);
        });
        return Array.from(instrumentMap.values());
      });
    })
  }, [])

  useEffect(() => {

    let abortController;
    (async () => {
      abortController = new AbortController();
      let signal = abortController.signal;

      // the signal is passed into the request(s) we want to abort using this controller
      const { data } = await axios.get(`${baseUrl}api/v1/infinityTrade/pnl/traderWise/${value?._id}`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        signal: signal
      }
      );

      if (data?.data?.length === 0) {
        updateNetPnl(0, 0, 0, 0);
      }
      setPnlData(data.data);
      setTradeData(data.data);

    })();

    (async () => {
      abortController = new AbortController();
      let signal = abortController.signal;

      // the signal is passed into the request(s) we want to abort using this controller
      const { data } = await axios.get(`${baseUrl}api/v1/infinityUsers`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        signal: signal
      }
      );
      // setSelectedTrader(data.data[0].name)
      setTrader(data.data);

    })();

    return () => abortController.abort();
  }, [render, trackEvent, value])

  useEffect(() => {
    socket.on(`${(getDetails.userDetails._id).toString()}autoCut`, (data) => {
      console.log("in the pnl event", data)
      setTimeout(() => {
        setTrackEvent(data);
      })
    })
  }, [])

  console.log("value", value)

  tradeData.map((subelem, index) => {
    let obj = {};
    let liveDetail = marketDetails.marketData.filter((elem) => {
      // //console.log("elem", elem, subelem)
      return (subelem._id.instrumentToken == elem.instrument_token || subelem._id.exchangeInstrumentToken == elem.instrument_token)
    })
    totalRunningLots += Number(subelem.lots)

    let updatedValue = (subelem.amount + (subelem.lots) * liveDetail[0]?.last_price);
    let netupdatedValue = updatedValue - Number(subelem.brokerage);
    totalGrossPnl += updatedValue;

    totalTransactionCost += Number(subelem.brokerage);
    let lotSize = (subelem._id.symbol)?.includes("BANKNIFTY") ? 25 : 50;

    // from === paperTrader ? 
    updateNetPnl(totalGrossPnl - totalTransactionCost, totalRunningLots, totalGrossPnl, totalTransactionCost)
    // :
    // (from === infinityTrader || from === tenxTrader) &&
    // updateInfinityNetPnl(totalGrossPnl-totalTransactionCost);


    const instrumentcolor = subelem._id.symbol?.slice(-2) == "CE" ? "success" : "error"
    const quantitycolor = subelem.lots >= 0 ? "success" : "error"
    const gpnlcolor = updatedValue >= 0 ? "success" : "error"
    const pchangecolor = (liveDetail[0]?.change) >= 0 ? "success" : "error"
    const productcolor = subelem._id.product === "NRML" ? "info" : subelem._id.product == "MIS" ? "warning" : "error"

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
        {"₹" + subelem.lastaverageprice?.toFixed(2)}
      </MDTypography>
    );

    if ((liveDetail[0]?.last_price)) {
      obj.last_price = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {"₹" + (liveDetail[0]?.last_price)?.toFixed(2)}
        </MDTypography>
      );
    } else {
      obj.last_price = (
        <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
          {"₹" + (liveDetail[0]?.last_price)}
        </MDTypography>
      );
    }

    obj.grossPnl = (
      <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
        {updatedValue >= 0.00 ? "+₹" + (updatedValue?.toFixed(2)) : "-₹" + ((-updatedValue)?.toFixed(2))}
      </MDTypography>
    );

    obj.netPnl = (
      <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
        {netupdatedValue >= 0.00 ? "+₹" + (netupdatedValue?.toFixed(2)) : "-₹" + ((-netupdatedValue)?.toFixed(2))}
      </MDTypography>
    );

    if ((liveDetail[0]?.change)) {
      obj.change = (
        <MDTypography component="a" variant="caption" color={pchangecolor} fontWeight="medium">
          {(liveDetail[0]?.change)?.toFixed(2) + "%"}
        </MDTypography>
      );
    } else {
      //console.log((liveDetail[0]?.last_price, liveDetail[0]?.average_price), liveDetail[0]?.average_price);
      obj.change = (
        <MDTypography component="a" variant="caption" color={pchangecolor} fontWeight="medium">
          {liveDetail[0]?.average_price ? (((liveDetail[0]?.last_price - liveDetail[0]?.average_price) / liveDetail[0]?.average_price) * 100)?.toFixed(2) + "%" : "0.00%"}
        </MDTypography>
      );
    }
    obj.exit = (
      < ExitPosition traderId={value?._id} subscriptionId={subscriptionId} from={from} render={render} setRender={setRender} product={(subelem._id.product)} symbol={(subelem._id.symbol)} quantity={subelem.lots} instrumentToken={subelem._id.instrumentToken} exchange={subelem._id.exchange} setExitState={setExitState} exitState={exitState} />
    );
    obj.buy = (
      <Buy traderId={value?._id} subscriptionId={subscriptionId} from={from} render={render} setRender={setRender} symbol={subelem._id.symbol} exchange={subelem._id.exchange} instrumentToken={subelem._id.instrumentToken} symbolName={(subelem._id.symbol)?.slice(-7)} lotSize={lotSize} maxLot={lotSize * 36} ltp={(liveDetail[0]?.last_price)?.toFixed(2)} setBuyState={setBuyState} buyState={buyState} />
    );

    obj.sell = (
      <Sell traderId={value?._id} subscriptionId={subscriptionId} from={from} render={render} setRender={setRender} symbol={subelem._id.symbol} exchange={subelem._id.exchange} instrumentToken={subelem._id.instrumentToken} symbolName={(subelem._id.symbol)?.slice(-7)} lotSize={lotSize} maxLot={lotSize * 36} ltp={(liveDetail[0]?.last_price)?.toFixed(2)} setSellState={setSellState} sellState={sellState} />
    );

    obj.sellState = (
      false
    );

    obj.buyState = (
      false
    );

    obj.exitState = (
      false
    );

    if (subelem.lots != 0) {
      countPosition.openPosition += 1;
      rows.unshift(obj);
    } else {
      countPosition.closePosition += 1;
      rows.push(obj);
    }

  })

  const handleBuyClick = (index) => {
    setBuyState(true)
    const newRows = [...rows];
    newRows[index].sellState = true;
    rows = (newRows);
  };

  const handleExitClick = (index) => {
    setExitState(true)
    const newRows = [...rows];
    newRows[index].sellState = true;
    rows = (newRows);
  };

  const handleSellClick = (index) => {
    setSellState(true)
    const newRows = [...rows];
    newRows[index].sellState = true;
    rows = (newRows);
  };


  return (
    <Card>
      <MDBox sx={{ display: 'flex', alignItems: 'center', marginLeft: '24px' }}>
        <MDTypography fontSize={15}>Select User</MDTypography>

        <Autocomplete
          value={value}
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              setValue({
                title: newValue,
              });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setValue({
                title: newValue.inputValue,
              });
            } else {
              setValue(newValue);
            }
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="traders"
          options={trader}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === 'string') {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue;
            }
            // Regular option
            return `${option.first_name} ${option.last_name}`;
          }}
          renderOption={(props, option) => <li {...props}>{`${option.first_name} ${option.last_name}`}</li>}
          sx={{ width: 200, maxHeight: 300, margin: "10px",  }}
          freeSolo
          renderInput={(params) => (
            <TextField {...params} label="Select" />
          )}
        />
      </MDBox>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            {`My Positions (Open P: ${countPosition.openPosition} | Close P: ${countPosition.closePosition})`}
          </MDTypography>
        </MDBox>
      </MDBox>
      {rows.length === 0 ? (
        <MDBox display="flex" flexDirection="column" mb={4} sx={{ alignItems: "center" }}>
          <GrAnchor style={{ fontSize: '30px' }} />
          <Typography style={{ fontSize: '20px', color: "grey" }}>No open positions yet</Typography>
          <Typography mb={2} fontSize={15} color="grey">Add instruments and start trading.</Typography>
          <MDButton variant="outlined" size="small" color="info" onClick={() => { setIsGetStartedClicked(true) }}>Get Started</MDButton>
        </MDBox>)
        :

        (<MDBox>
          <TableContainer component={Paper}>
            <table style={{ borderCollapse: "collapse", width: "100%", borderSpacing: "10px 5px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #D3D3D3" }}>
                  {/* <td style={{...styleTD, paddingLeft: "20px"}} >PRODUCT</td> */}
                  <td style={{ ...styleTD, paddingLeft: "5px" }} >INSTRUMENT</td>
                  <td style={styleTD}>QUANTITY</td>
                  <td style={styleTD} >AVG. PRICE</td>
                  <td style={styleTD} >LTP</td>
                  <td style={styleTD} >GROSS P&L</td>
                  {/* <td style={styleTD} >NET P&L</td> */}
                  <td style={styleTD} >CHANGE(%)</td>
                  <td style={styleTD} >EXIT</td>
                  <td style={styleTD} >BUY</td>
                  <td style={{ ...styleTD, paddingRight: "20px" }} >SELL</td>
                </tr>
              </thead>
              <tbody>

                {rows.map((elem, index) => {
                  return (
                    <>
                      <tr
                        style={{ borderBottom: "1px solid #D3D3D3" }} key={elem.symbol.props.children}
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
                          {elem.exitState ?
                            <td style={{ textAlign: "center", marginRight: 0.5, minWidth: 1.5, minHeight: 2 }} >
                              <MDButton size="small" sx={{ marginRight: 0.5, minWidth: 2, minHeight: 3 }} color="warning" onClick={() => { handleExitClick(index) }}>
                                E
                              </MDButton>
                            </td>
                            :
                            <td style={{ textAlign: "center", marginRight: 0.5, minWidth: 1.5, minHeight: 2 }} >{elem?.exit}</td>
                          }
                        </Tooltip>
                        <Tooltip title="Buy" placement="top">
                          {!elem.buyState ?
                            <td style={{ textAlign: "center", marginRight: 0.5, minWidth: 1.5, minHeight: 2 }} >{elem?.buy}</td>
                            :
                            <td style={{ textAlign: "center", marginRight: 0.5, minWidth: 1.5, minHeight: 2 }} >
                              <MDButton size="small" color="info" sx={{ marginRight: 0.5, minWidth: 2, minHeight: 3 }} onClick={() => { handleBuyClick(index) }} >
                                B
                              </MDButton>
                            </td>
                          }
                        </Tooltip>
                        <Tooltip title="Sell" placement="top">
                          {!elem.sellState ?
                            <td style={{ textAlign: "center", marginRight: 0.5, minWidth: 1.5, minHeight: 2 }} >{elem?.sell}</td>
                            :
                            <td style={{ textAlign: "center", marginRight: 0.5, minWidth: 1.5, minHeight: 2 }} >
                              <MDButton size="small" color="error" sx={{ marginRight: 0.5, minWidth: 2, minHeight: 3 }} onClick={() => { handleSellClick(index) }} >
                                S
                              </MDButton>
                            </td>
                          }
                        </Tooltip>
                      </tr>
                    </>

                  )
                })}

              </tbody>
            </table>
            <Grid container display='flex' mt={1} p={1} style={{ border: '1px solid white', borderRadius: 4 }}>
              <Grid item xs={6} md={3} lg={3} display="flex" justifyContent="center">
                <MDTypography fontSize={".75rem"} backgroundColor="#CCCCCC" color="#003366" style={{ borderRadius: "5px", padding: "5px", fontWeight: "600" }}>Running Lots: {totalRunningLots}</MDTypography>
              </Grid>

              <Grid item xs={6} md={3} lg={3} display="flex" justifyContent="center">
                <MDTypography fontSize={".75rem"} backgroundColor="#CCCCCC" color="#003366" style={{ borderRadius: "5px", padding: "5px", fontWeight: "600" }}>Brokerage: {"₹" + (totalTransactionCost).toFixed(2)}</MDTypography>
              </Grid>

              <Grid item xs={6} md={3} lg={3} display="flex" justifyContent="center">
                <MDTypography fontSize={".75rem"} backgroundColor="#CCCCCC" color={`${totalGrossPnl > 0 ? 'success' : 'error'}`} style={{ borderRadius: "5px", padding: "5px", fontWeight: "600" }}>Gross P&L: {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)) : "-₹" + ((-totalGrossPnl).toFixed(2))}</MDTypography>
              </Grid>

              <Grid item xs={6} md={3} lg={3} display="flex" justifyContent="center">
                <MDTypography fontSize={".75rem"} backgroundColor="#CCCCCC" color={`${(totalGrossPnl - totalTransactionCost) > 0 ? 'success' : 'error'}`} style={{ borderRadius: "5px", padding: "5px", fontWeight: "600" }}>Net P&L: {(totalGrossPnl - totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnl - totalTransactionCost).toFixed(2)) : "-₹" + ((-(totalGrossPnl - totalTransactionCost)).toFixed(2))}</MDTypography>
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

