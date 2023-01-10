/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
//
// import Styles from "../Dashboard.module.css";

//
import {useState, useEffect} from "react"
import axios from "axios"
// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "../../../../examples/Tables/DataTable";

// Data
import data from "./data";

function MockOverallCompantPNL({socket}) {
  const { columns, rows } = data();
  const [menu, setMenu] = useState(null);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [overallPnlArr, setOverallPnlArr] = useState([]);
  const [liveDetail, setLiveDetail] = useState([]);
  const [avgPrice, setAvgPrice] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [instrumentData, setInstrumentData] = useState([]);
  const [tradeData, setTradeData] = useState([]);
  const [lastestTradeTimearr, setLatestTradeTimearr] = useState([]);
  const [lastestTradeTime, setLatestTradeTime] = useState([]);
  const [lastestTradeBy, setLatestTradeBy] = useState([]);
  const [lastestTradeSymbol, setLatestTradeSymbol] = useState([]);
  const [lastestTradeType, setLatestTradeType] = useState([]);
  const [lastestTradeQunaity, setLatestTradeQuantity] = useState([]);
  const [lastAvgPriceArr, setLastAvgPriceArr] = useState([]);
  // const lastestTradeTime = '';


  var Total = 0;
  let avgPriceArr = [];
  let liveDetailsArr = [];
  let overallPnl = [];
  let totalTransactionCost = 0;
  let totalGrossPnl = 0;
  




  // Get Latest Trade Time Stamp code ends

  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/getliveprice`)
    .then((res) => {
        //console.log("live price data", res)
        setMarketData(res.data);
        // setDetails.setMarketData(data);
    }).catch((err) => {
        return new Error(err);
    })

    socket.on("tick", (data) => {
      //console.log("this is live market data", data);
      setMarketData(data);
      // setDetails.setMarketData(data);
    })
  }, [])

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/readInstrumentDetails`)
    .then((res) => {
        let dataArr = (res.data).filter((elem) => {
            return elem.status === "Active"
        })
        setInstrumentData(dataArr)
    }).catch((err) => {
        return new Error(err);
    })
  }, [])

  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/getavgpricemocktradecompany`)
    .then((res) => {
      setLastAvgPriceArr(res.data);
    }).catch((err) => {
        return new Error(err);
    })

    axios.get(`${baseUrl}api/v1/getoverallpnlmocktradecompanytoday`)
    .then((res) => {
        setTradeData(res.data);
    }).catch((err) => {
        return new Error(err);
    })

      // let AvgPriceHash = new Map();
      // avgPriceArr.push(tradeData[0])
      // for(let i = 0; i < tradeData.length; i++){
      //     if(avgPriceArr[avgPriceArr.length-1]._id.symbol !== tradeData[i]._id.symbol){
      //         avgPriceArr.push(tradeData[i]);
      //         break;
      //     }
      // }
      // setAvgPrice(avgPriceArr)

      let hash = new Map();

      for(let i = tradeData.length-1; i >= 0 ; i--){ 
          if(hash.has(tradeData[i]._id.symbol + " " + tradeData[i]._id.Product)){
              let obj = hash.get(tradeData[i]._id.symbol + " " + tradeData[i]._id.Product);
              if(tradeData[i]._id.buyOrSell === "BUY"){
                  if(obj.totalBuy === undefined || obj.totalBuyLot === undefined){
                      obj.totalBuy = Number(tradeData[i].amount)
                      obj.totalBuyLot = (Number(tradeData[i].lots))
                  } else{
                      obj.totalBuy = obj.totalBuy + Number(tradeData[i].amount)
                      obj.totalBuyLot = obj.totalBuyLot + (Number(tradeData[i].lots)) 
                  }

                  //console.log("obj.totalBuy", obj.totalBuy, "totalBuyLot", obj.totalBuyLot)
              } if(tradeData[i]._id.buyOrSell === "SELL"){
                  if( obj.totalSell === undefined || obj.totalSellLot === undefined){

                      obj.totalSell = Number(tradeData[i].amount)
                      obj.totalSellLot = (Number(tradeData[i].lots)) 
                  } else{

                      obj.totalSell = obj.totalSell + Number(tradeData[i].amount)
                      obj.totalSellLot = obj.totalSellLot + (Number(tradeData[i].lots)) 
                  }

                  //console.log("obj.totalSell", obj.totalSell, "totalSellLot", obj.totalSellLot)
              }
          }  else{
              if(tradeData[i]._id.buyOrSell === "BUY"){
                  hash.set(tradeData[i]._id.symbol + " " + tradeData[i]._id.Product, {
                      totalBuy : Number(tradeData[i].amount),
                      totalBuyLot : (Number(tradeData[i].lots)),
                      totalSell: 0,
                      totalSellLot: 0,
                      symbol: tradeData[i]._id.symbol,
                      Product: tradeData[i]._id.Product
                  });
                  // hashForProduct.set(tradeData[i]._id.Product);

              }if(tradeData[i]._id.buyOrSell === "SELL"){
                  hash.set(tradeData[i]._id.symbol + " " + tradeData[i]._id.Product, {
                      totalSell : Number(tradeData[i].amount),
                      totalSellLot : (Number(tradeData[i].lots)),
                      totalBuy : 0,
                      totalBuyLot: 0,
                      symbol: tradeData[i]._id.symbol,
                      Product: tradeData[i]._id.Product
                  });
                  // hashForProduct.set(data[i].Product);
                  
              }
          }
      }

      
      for (let value of hash.values()){
          overallPnl.push(value);
      }

      
      overallPnl.map((elem)=>{
          //console.log("52");
          instrumentData.map((element)=>{
              //console.log("53");
              if(element.symbol === elem.symbol){
                  //console.log("line 54");
                  marketData.map((subElem)=>{
                      if(subElem !== undefined && subElem.instrument_token === element.instrumentToken){
                          //console.log(subElem);
                          liveDetailsArr.push(subElem)
                      }
                  })
              }
          })
      })

         // Get Lastest Trade timestamp
    axios.get(`${baseUrl}api/v1/getlastestmocktradecompany`)
    // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
    .then((res)=>{
        console.log(res.data);
        setLatestTradeTimearr(res.data);
        setLatestTradeTime(res.data.trade_time) ;
        setLatestTradeBy(res.data.createdBy) ;
        setLatestTradeType(res.data.buyOrSell) ;
        setLatestTradeQuantity(res.data.Quantity) ;
        setLatestTradeSymbol(res.data.symbol) ;
          console.log(lastestTradeTimearr);
    }).catch((err) => {
      return new Error(err);
  })

      setLatestTradeTime(lastestTradeTime);

      setOverallPnlArr(overallPnl);

      setLiveDetail(liveDetailsArr);

  }, [marketData])

  useEffect(() => {
    return () => {
        socket.close();
    }
  }, [])

  tradeData.map((elem)=>{
      totalTransactionCost += Number(elem.brokerage);
  })

  console.log("lastAvgPriceArr", lastAvgPriceArr, overallPnlArr, tradeData)
    overallPnlArr.map((subelem, index)=>{
      let obj = {};
      let tempavgPriceArr = lastAvgPriceArr.filter((element)=>{
        return (subelem.symbol === element._id.symbol) && (subelem.Product === element._id.product);
      })

      console.log("tempavgPriceArr", tempavgPriceArr)

      let updatedValue = (-(subelem.totalBuy+subelem.totalSell-(subelem.totalBuyLot+subelem.totalSellLot)*liveDetail[index]?.last_price));
      totalGrossPnl += updatedValue;
      const instrumentcolor = subelem.symbol.slice(-2) == "CE" ? "success" : "error"
      const quantitycolor = subelem.Quantity > 0 ? "success" : "error"
      const gpnlcolor = updatedValue > 0 ? "success" : "error"
      const pchangecolor = (liveDetail[index]?.change) > 0 ? "success" : "error"
      const productcolor =  subelem.Product === "NRML" ? "info" : subelem.Product == "MIS" ? "warning" : "error"

      obj.Product = (
        <MDTypography component="a" href="#" variant="caption" color={productcolor} fontWeight="medium">
          {(subelem.Product)}
        </MDTypography>
      );

      obj.symbol = (
        <MDTypography component="a" href="#" variant="caption" color={instrumentcolor} fontWeight="medium">
          {(subelem.symbol)}
        </MDTypography>
      );

      obj.Quantity = (
        <MDTypography component="a" href="#" variant="caption" color={quantitycolor} fontWeight="medium">
          {subelem.totalBuyLot + subelem.totalSellLot}
        </MDTypography>
      );

      obj.avgPrice = (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {"₹"+tempavgPriceArr[0].average_price.toFixed(2)}
        </MDTypography>
      );

      if((liveDetail[index]?.last_price).toFixed(2)){
        obj.last_price = (
          <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="medium">
            {"₹"+(liveDetail[index]?.last_price).toFixed(2)}
          </MDTypography>
        );
      } else{
        obj.last_price = (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {"₹"+(liveDetail[index]?.last_price)}
          </MDTypography>
        );
      }

      obj.grossPnl = (
        <MDTypography component="a" href="#" variant="caption" color={gpnlcolor} fontWeight="medium">
          {updatedValue > 0.00 ? "+₹" + (updatedValue.toFixed(2)): "-₹" + ((-updatedValue).toFixed(2))}
        </MDTypography>
      );

      if((liveDetail[index]?.change)){
        obj.change = (
          <MDTypography component="a" href="#" variant="caption" color={pchangecolor} fontWeight="medium">
            {(liveDetail[index]?.change).toFixed(2)+"%"}
          </MDTypography>
        );
      } else{
        obj.change = (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {(((liveDetail[index]?.last_price-liveDetail[index]?.average_price)/liveDetail[index]?.average_price)*100).toFixed(2)+"%"}
          </MDTypography>
        );
      }
      //console.log(obj)
      rows.push(obj);
    })


  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );

  let obj = {};

  obj.Product = (
    <MDTypography component="a" href="#" variant="caption"  fontWeight="medium">
      {}
    </MDTypography>
  );

  obj.symbol = (
    <MDTypography component="a" href="#" variant="caption"  fontWeight="medium">
      {}
    </MDTypography>
  );

  obj.Quantity = (
    <MDTypography component="a" href="#" variant="caption"  fontWeight="medium">
      Transaction Cost
    </MDTypography>
  );

  obj.avgPrice = (
    <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
      {"₹"+(totalTransactionCost).toFixed(2)}
    </MDTypography>
  );

  obj.last_price = (
    <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="medium">
      {/* {"₹"+(liveDetail[index]?.last_price).toFixed(2)} */}Gross P&L
    </MDTypography>
  );


  obj.grossPnl = (
    <MDTypography component="a" href="#" variant="caption"  fontWeight="medium">
      {totalGrossPnl > 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)): "-₹" + ((-totalGrossPnl).toFixed(2))}
    </MDTypography>
  );

  obj.change = (
    <MDTypography component="a" href="#" variant="caption"  fontWeight="medium">
      {/* {(liveDetail[index]?.change).toFixed(2)+"%"} */}Net P&L : {(totalGrossPnl-totalTransactionCost) > 0.00 ? "+₹" + ((totalGrossPnl-totalTransactionCost).toFixed(2)): "-₹" + ((-(totalGrossPnl-totalTransactionCost)).toFixed(2))}
    </MDTypography>
  );

  //console.log(obj)
  rows.push(obj);


  let totalColumns, totalRows;


  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Overall Company P&L(Mock)
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              done
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>last trade</strong> {lastestTradeBy} {lastestTradeType === "BUY" ? "bought" : "sold"} {Math.abs(lastestTradeQunaity)} quantity of {lastestTradeSymbol}
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
      </MDBox>
      <MDBox>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
        {/* <DataTable
          table={{ totalColumns, totalRows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        /> */}
      </MDBox>
    </Card>
  );
            }
export default MockOverallCompantPNL;
