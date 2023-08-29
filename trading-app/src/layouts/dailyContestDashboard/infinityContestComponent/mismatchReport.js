import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import { Typography } from "@mui/material";
import { TbEqualNot } from "react-icons/tb";

// Material Dashboard 2 React examples
import DataTable from "../../../examples/Tables/DataTable";

// Data
// import data from "./data";
import { useEffect } from "react";
import axios from "axios";


function MismatchDetails({socket, id}) {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  let columns = [
    { Header: "Product", accessor: "product", width: "10%", align: "center" },
    { Header: "Instrument", accessor: "instrument", width: "10%", align: "center" },
    { Header: "Instrument Type", accessor: "instrumenttype", width: "10%", align: "center" },
    { Header: "App Running Lots", accessor: "apprunninglots", width: "10%", align: "center" },
    { Header: "Zerodha Running Lots", accessor: "zerodharunninglots", width: "10%", align: "center" },
    { Header: "app gross p&l", accessor: "appgrosspnl", width: "10%", align: "center" },
    { Header: "zerodha gross p&l", accessor: "zerodhagrosspnl", width: "10%", align: "center" },
  ]

  let rows = [];
  // const [menu, setMenu] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [OpenPositionData, setOpenPositionData] = useState([]);
  const [tradeData, setTradeData] = useState([]);
  const [trackEvent, setTrackEvent] = useState({});

  let apprunninglotsTotal = 0;
  let zerodharunninglotsTotal = 0;
  let appPnlTotal = 0;
  let zerodhaPnlTotal = 0;
  let appAndZerodhaSameSymbolRunningLotTotal = 0;
  let appAndZerodhaSameSymbolPnlTotal = 0;
  let otmRunningLotsTotal = 0;
  
  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/getliveprice`)
    .then((res) => {
        setMarketData(res.data);
    }).catch((err) => {
        return new Error(err);
    })

    socket.on("tick", (data) => {
      console.log("ticks", data)
      setMarketData(prevInstruments => {
        const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
        data.forEach(instrument => {
          instrumentMap.set(instrument.instrument_token, instrument);
        });
        return Array.from(instrumentMap.values());
      });
    })
  }, [])

  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/getPositions`)
    .then((res) => {
        setOpenPositionData(res.data.data);
    }).catch((err) => {
        return new Error(err);
    })


    axios.get(`${baseUrl}api/v1/dailycontest/livePnlCompanymismatch`, {withCredentials: true})
    .then((res) => {
        setTradeData(res.data.data);

    }).catch((err) => {
        return new Error(err);
    })
  }, [trackEvent])

  useEffect(()=>{
    socket.on('updatePnl', (data)=>{
      // console.log("in the pnl event", data)
      setTimeout(()=>{
        setTrackEvent(data);
      })
    })
  }, [])


  if(OpenPositionData.length !== 0){

    OpenPositionData.map((elem)=>{
      
      let appPnlData = tradeData.filter((element)=>{
        return (element?.exchangeInstrumentToken == elem?.ExchangeInstrumentId || element?.instrumentToken == elem?.ExchangeInstrumentId) && elem?.ProductType == element?.product;
      })

      console.log("appdata", appPnlData)

      let liveDetail = marketData.filter((element)=>{
        console.log(element.instrument_token, elem.ExchangeInstrumentId)
        return element !== undefined && element?.instrument_token == appPnlData[0]?.instrumentToken
      })

      let XTSPnl = Number(elem?.NetAmount) + (Number(elem?.Quantity) * liveDetail[0]?.last_price);
      let updatedValue = (appPnlData[0]?.amount+(appPnlData[0]?.lots)*liveDetail[0]?.last_price);
      // console.log(Number(elem?.NetAmount), elem?.Quantity , liveDetail[0]?.last_price, appPnlData[0]?.amount, appPnlData[0]?.lots )
      apprunninglotsTotal += Math.abs(appPnlData[0] ? appPnlData[0]?.lots : 0);
      zerodharunninglotsTotal += Math.abs(elem?.Quantity) 
      appPnlTotal += (updatedValue ? updatedValue : 0); 
      zerodhaPnlTotal += XTSPnl;
      if(appPnlData[0]?.exchangeInstrumentToken === elem?.ExchangeInstrumentId){
        appAndZerodhaSameSymbolRunningLotTotal += Math.abs(elem?.Quantity);
        appAndZerodhaSameSymbolPnlTotal += XTSPnl;
      }
      otmRunningLotsTotal = Math.abs(zerodharunninglotsTotal - apprunninglotsTotal)
      
      let obj = {};
      const productcolor = elem?.ProductType == "NRML" ? "info" : "warning"
      const instrumenttypecolor = !updatedValue ? "warning" : "info"
      const updatedValuecolor = updatedValue >= 0 ? "success" : "error"
      const pnlcolor = XTSPnl >= 0 ? "success" : "error"
      const appPnlDatacolor = appPnlData[0] >= 0 ? "info" : "error"
      const quantitycolor = (elem?.Quantity) >= 0 ? "info" : "error"
      const instrumentcolor = elem?.TradingSymbol.includes("CE") ? "success" : "error"
      
      obj.instrument = (
        <MDTypography component="a" variant="caption" color={instrumentcolor} fontWeight="medium">
          {elem.TradingSymbol}
        </MDTypography>
      );
      obj.product = (
        <MDTypography component="a" variant="caption" color={productcolor} fontWeight="medium">
          {elem.ProductType}
        </MDTypography>
      );
      obj.instrumenttype = (
        <MDTypography component="a" variant="caption" color={instrumenttypecolor} fontWeight="medium">
          {!updatedValue ? "OTM" : "REGULAR"}
        </MDTypography>
      );
      obj.appgrosspnl = (
        <MDTypography component="a" variant="caption" color={updatedValuecolor} fontWeight="medium">

          {updatedValue ? updatedValue >= 0.00 ? "+₹" + (updatedValue.toFixed(2)): "-₹" + ((-updatedValue).toFixed(2)) : "+₹0"}
        </MDTypography>
      );
      obj.zerodhagrosspnl = (
        <MDTypography component="a" variant="caption" color={pnlcolor} fontWeight="medium">
          {XTSPnl >= 0.00 ? "+₹" + (XTSPnl.toFixed(2)): "-₹" + ((-XTSPnl).toFixed(2))}
        </MDTypography>
      );
      obj.apprunninglots = (
        <MDTypography component="a" variant="caption" color={appPnlDatacolor} fontWeight="medium">
          {appPnlData[0] ? appPnlData[0]?.lots : 0}
        </MDTypography>
      );
      obj.zerodharunninglots = (
        <MDTypography component="a" variant="caption" color={quantitycolor} fontWeight="medium">
          {elem?.Quantity}
        </MDTypography>
      );

      rows.push(obj)

    })


  let obj = {};

  const zerodhaplusapplotsbgcolor = appAndZerodhaSameSymbolRunningLotTotal  == apprunninglotsTotal ? "#e0e1e5" : "#ffff00"
  const otmgrosspnlcolor = (zerodhaPnlTotal-appPnlTotal) >= 0 ? "success" : "error"
  const appPnlTotalcolor = appPnlTotal >= 0 ? "success" : "error"
  const zerodhaPnlTotalcolor = zerodhaPnlTotal >= 0 ? "success" : "error"
  // const totalnetPnlcolor = (totalGrossPnl-totalTransactionCost) >= 0 ? "#e0e1e5" : "warning"
  obj.product = (
    <MDTypography component="a" variant="caption" color={otmgrosspnlcolor} backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
      OTM GP&L : {(zerodhaPnlTotal-appPnlTotal) >= 0.00 ? "+₹" + ((zerodhaPnlTotal-appPnlTotal).toFixed(2)): "-₹" + ((-(zerodhaPnlTotal-appPnlTotal)).toFixed(2))}
    </MDTypography>
  );
  obj.instrument = (
    <MDTypography component="a" variant="caption" color="dark" backgroundColor={zerodhaplusapplotsbgcolor} borderRadius="5px" padding="5px" fontWeight="medium">
      Z&A Same Symbol RLots : {appAndZerodhaSameSymbolRunningLotTotal}
    </MDTypography>
  );
  obj.instrumenttype = (
    <MDTypography component="a" variant="caption" color="dark" backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
      OTM RLots : {otmRunningLotsTotal}
    </MDTypography>
  );
  obj.apprunninglots = (
    <MDTypography component="a" variant="caption" color="dark" backgroundColor={zerodhaplusapplotsbgcolor} borderRadius="5px" padding="5px" fontWeight="medium">
      App RLots : {apprunninglotsTotal}
    </MDTypography>
  );
  obj.zerodharunninglots = (
    <MDTypography component="a" variant="caption" backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
      Zerodha RLots : {zerodharunninglotsTotal}
    </MDTypography>
  );
  obj.appgrosspnl = (
    <MDTypography component="a" variant="caption" color={appPnlTotalcolor} backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
      App GP&L : {appPnlTotal >= 0.00 ? "+₹" + (appPnlTotal.toFixed(2)): "-₹" + ((-appPnlTotal).toFixed(2))}
    </MDTypography>
  );
  obj.zerodhagrosspnl = (
    <MDTypography component="a" variant="caption" color={zerodhaPnlTotalcolor} backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
      Zerodha GP&L : {zerodhaPnlTotal >= 0.00 ? "+₹" + (zerodhaPnlTotal.toFixed(2)): "-₹" + ((-zerodhaPnlTotal).toFixed(2))}
    </MDTypography>
  );
  

  rows.push(obj)

  }



  return (
    <>
      {(tradeData.length > 0) &&

        <MDBox display='flex' justifyContent='center' flexDirection='column' m={1}>
          <MDBox bgColor='grey' p={1} borderRadius={3}>
            <MDTypography fontSize={15} color='light' fontWeight='bold'>Mismatch Report</MDTypography>
          </MDBox>

          <DataTable
            table={{ columns, rows }}
            showTotalEntries={false}
            isSorted={false}
            noEndBorder
          />
        </MDBox>
      }
    </>

  );
}

export default MismatchDetails;