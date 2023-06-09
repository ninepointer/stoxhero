import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import { Typography } from "@mui/material";
import { TbEqualNot } from "react-icons/tb";

// Material Dashboard 2 React examples
import DataTable from "../../../../examples/Tables/DataTable";

// Data
import data from "./data";
import { useEffect } from "react";
import axios from "axios";


function MismatchDetails({socket}) {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  const { columns, rows } = data();
  const [menu, setMenu] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [OpenPositionData, setOpenPositionData] = useState([]);
  const [tradeData, setTradeData] = useState([]);

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

    axios.get(`${baseUrl}api/v1/getOpenPositions`)
    .then((res) => {
        setOpenPositionData(res.data);
    }).catch((err) => {
        return new Error(err);
    })


    axios.get(`${baseUrl}api/v1/getoverallpnllivetradecompanytoday`)
    .then((res) => {
        setTradeData(res.data);

    }).catch((err) => {
        return new Error(err);
    })
  }, [marketData])

  useEffect(() => {
    return () => {
        socket.close();
    }
  }, [])


  console.log("Open Position Data: ",OpenPositionData)

  if(OpenPositionData.length !== 0)
  {

  OpenPositionData.map((elem)=>{
    let appPnlData = tradeData.filter((element)=>{
      return element._id.symbol === elem.tradingsymbol && elem.product === element._id.product;
    })

    let liveDetail = marketData.filter((element)=>{
      return element !== undefined && element.instrument_token == elem.instrument_token
    })


    let updatedValue = (appPnlData[0]?.amount+(appPnlData[0]?.lots)*liveDetail[0]?.last_price);

    apprunninglotsTotal += Math.abs(appPnlData[0] ? appPnlData[0]?.lots : 0);
    zerodharunninglotsTotal += Math.abs(elem.buy_quantity - elem.sell_quantity) 
    appPnlTotal += (updatedValue ? updatedValue : 0); 
    zerodhaPnlTotal += elem.pnl;
    if(appPnlData[0]?._id.symbol === elem.tradingsymbol){
      appAndZerodhaSameSymbolRunningLotTotal += Math.abs(elem.buy_quantity - elem.sell_quantity);
      appAndZerodhaSameSymbolPnlTotal += elem.pnl;
    }
    otmRunningLotsTotal = Math.abs(zerodharunninglotsTotal - apprunninglotsTotal)
    
    let obj = {};
    const productcolor = elem.product == "NRML" ? "info" : "warning"
    const instrumenttypecolor = !updatedValue ? "warning" : "info"
    const updatedValuecolor = updatedValue >= 0 ? "success" : "error"
    const pnlcolor = elem.pnl >= 0 ? "success" : "error"
    const appPnlDatacolor = appPnlData[0] >= 0 ? "info" : "error"
    const quantitycolor = (elem.buy_quantity - elem.sell_quantity) >= 0 ? "info" : "error"
    const instrumentcolor = elem.tradingsymbol.slice(-2) == "CE" ? "success" : "error"
    
    obj.instrument = (
      <MDTypography component="a" variant="caption" color={instrumentcolor} fontWeight="medium">
        {elem.tradingsymbol}
      </MDTypography>
    );
    obj.product = (
      <MDTypography component="a" variant="caption" color={productcolor} fontWeight="medium">
        {elem.product}
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
        {elem.pnl >= 0.00 ? "+₹" + (elem.pnl.toFixed(2)): "-₹" + ((-elem.pnl).toFixed(2))}
      </MDTypography>
    );
    obj.apprunninglots = (
      <MDTypography component="a" variant="caption" color={appPnlDatacolor} fontWeight="medium">
        {appPnlData[0] ? appPnlData[0]?.lots : 0}
      </MDTypography>
    );
    obj.zerodharunninglots = (
      <MDTypography component="a" variant="caption" color={quantitycolor} fontWeight="medium">
        {elem.buy_quantity - elem.sell_quantity}
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

  const closeMenu = () => setMenu(null);


  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Mismatch Details
          </MDTypography>
        </MDBox>
      </MDBox>

      {rows.length === 0 ? (
      <MDBox display="flex" flexDirection="column" mb={4} sx={{alignItems:"center"}}>
        <TbEqualNot style={{fontSize: '30px', color:"green"}}/>
        <Typography style={{fontSize: '20px',color:"grey"}}>No open trades on Zerodha</Typography>
        <Typography mb={2} fontSize={15} color="grey">This section shows mismatch of App and Zerodha trades</Typography> 
      </MDBox>)
      :
        (<MDBox>
          <DataTable
            table={{ columns, rows }}
            showTotalEntries={false}
            isSorted={false}
            noEndBorder
            entriesPerPage={false}
          />
        </MDBox>
      )}
    </Card>
  );
}

export default MismatchDetails;



