
import React, {useEffect, useState, useContext} from 'react'
import Card from "@mui/material/Card";
import axios from "axios";
import { NetPnlContext } from '../../../PnlContext';
import { Typography } from "@mui/material";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

// Material Dashboard 2 React components

import { GrAnchor } from "react-icons/gr";


// Data

import OverallPL from './Overall P&L';
import DataTable from '../../../examples/Tables/DataTable';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';
import { userContext } from '../../../AuthContext';
import MDButton from '../../../components/MDButton';
import ExitPosition from './ExitPosition';
import Buy from "../components/InstrumentDetails/data/BuyModel";
import Sell from "../components/InstrumentDetails/data/SellModel"
import OverallRow from './OverallRow';
// import Button from '@mui/material/Button';

function OverallGrid({socket, Render, setIsGetStartedClicked}) {
  console.log("rendering in userPosition: overallPnl")
  let styleTD = {
    textAlign: "center",
    fontSize: "11px",
    fontWeight: "900",
    color: "#7b809a",
    opacity: 0.7
  }
  const { netPnl, updateNetPnl } = useContext(NetPnlContext);
  // const { columns, rows } = OverallPL();
  const [menu, setMenu] = useState(null);

  const closeMenu = () => setMenu(null);

  const getDetails = useContext(userContext);
  const { reRender, setReRender } = Render
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [liveDetail, setLiveDetail] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [tradeData, setTradeData] = useState([]);
  const [render, setRender] = useState(true);
  // const [instrumentData, setInstrumentData] = useState([]);

  let liveDetailsArr = [];
  let totalTransactionCost = 0;
  let totalGrossPnl = 0;
  let totalRunningLots = 0;
  let rows = [];

    useEffect(()=>{

      let abortController;
      (async () => {
           abortController = new AbortController();
           let signal = abortController.signal;    

           // the signal is passed into the request(s) we want to abort using this controller
           const { data } = await axios.get(
            `${baseUrl}api/v1/getliveprice`,
               { signal: signal }
           );
           setMarketData(data);
      })();

      // axios.get(`${baseUrl}api/v1/instrumentDetails`,{
      //   withCredentials: true,
      //   headers: {
      //       Accept: "application/json",
      //       "Content-Type": "application/json",
      //       "Access-Control-Allow-Credentials": true
      //   },
      // })
      // .then((res) => {
      //     //console.log("live price data", res)
      //     setInstrumentData(res.data);
      //     // setDetails.setMarketData(data);
      // }).catch((err) => {
      //     return new Error(err);
      // })

      socket.on("tick", (data) => {
        setMarketData(prevInstruments => {
          const instrumentMap = new Map(prevInstruments.map(instrument => [instrument.instrument_token, instrument]));
          data.forEach(instrument => {
            instrumentMap.set(instrument.instrument_token, instrument);
          });
          return Array.from(instrumentMap.values());
        });
      })

      return () => abortController.abort();
    }, [])



    useEffect(()=>{

      let abortController;
      (async () => {
           abortController = new AbortController();
           let signal = abortController.signal;    

           // the signal is passed into the request(s) we want to abort using this controller
           const { data } = await axios.get(
            `${baseUrl}api/v1/getoverallpnlmocktradeparticularusertoday/${getDetails.userDetails.email}`,
              { signal: signal }
           );

           setTradeData(data);
           data.map((elem)=>{
             marketData.map((subElem)=>{
                  console.log(subElem.instrument_token , elem._id.instrumentToken)
                 if(subElem !== undefined && subElem.instrument_token == elem._id.instrumentToken){
                     liveDetailsArr.push(subElem)
                 }
             })
           })
 
         setLiveDetail(liveDetailsArr);

      })();

      reRender ? setRender(false) : setRender(true);
      return () => abortController.abort();
    }, [marketData, render])


    useEffect(() => {
      return () => {
          socket.close();
      }
    }, [])


    tradeData.map((subelem, index)=>{
      let obj = {};
      totalRunningLots += Number(subelem.lots)

      let updatedValue = (subelem.amount+(subelem.lots)*liveDetail[index]?.last_price);
      totalGrossPnl += updatedValue;

      totalTransactionCost += Number(subelem.brokerage);
      let lotSize = (subelem._id.symbol).includes("BANKNIFTY") ? 25 : 50
      updateNetPnl(totalGrossPnl-totalTransactionCost,totalRunningLots);
      // let perticularInstrumentData = instrumentData.filter((elem)=>{
      //   console.log("elem", elem, subelem)
      //   return subelem._id.instrumentToken == elem.instrumentToken;
      // })

      
      const instrumentcolor = subelem._id.symbol.slice(-2) == "CE" ? "success" : "error"
      const quantitycolor = subelem.lots >= 0 ? "success" : "error"
      const gpnlcolor = updatedValue >= 0 ? "success" : "error"
      const pchangecolor = (liveDetail[index]?.change) >= 0 ? "success" : "error"
      const productcolor =  subelem._id.product === "NRML" ? "info" : subelem._id.product == "MIS" ? "warning" : "error"

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
          {"₹"+subelem.lastaverageprice.toFixed(2)}
        </MDTypography>
      );

      if((liveDetail[index]?.last_price)){
        obj.last_price = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {"₹"+(liveDetail[index]?.last_price).toFixed(2)}
          </MDTypography>
        );
      } else{
        obj.last_price = (
          <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
            {"₹"+(liveDetail[index]?.last_price)}
          </MDTypography>
        );
      }

      obj.grossPnl = (
        <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
          {updatedValue >= 0.00 ? "+₹" + (updatedValue.toFixed(2)): "-₹" + ((-updatedValue).toFixed(2))}
        </MDTypography>
      );

      if((liveDetail[index]?.change)){
        obj.change = (
          <MDTypography component="a" variant="caption" color={pchangecolor} fontWeight="medium">
            {(liveDetail[index]?.change).toFixed(2)+"%"}
          </MDTypography>
        );
      } else{
        obj.change = (
          <MDTypography component="a" variant="caption" color={pchangecolor} fontWeight="medium">
            {(((liveDetail[index]?.last_price-liveDetail[index]?.average_price)/liveDetail[index]?.average_price)*100).toFixed(2)+"%"}
          </MDTypography>
        );
      }
      obj.exit = (
        < ExitPosition product={(subelem._id.product)} symbol={(subelem._id.symbol)} quantity= {subelem.lots} instrumentToken={subelem._id.instrumentToken} exchange={subelem._id.exchange}/>
      );
      obj.buy = (
        <Buy reRender={reRender} setReRender={setReRender} symbol={subelem._id.symbol} exchange={subelem._id.exchange} instrumentToken={subelem._id.instrumentToken} symbolName={(subelem._id.symbol).slice(-7)} lotSize={lotSize} maxLot={lotSize*36} ltp={(liveDetail[index]?.last_price)?.toFixed(2)}/>
      );
      
      obj.sell = (
        <Sell reRender={reRender} setReRender={setReRender} symbol={subelem._id.symbol} exchange={subelem._id.exchange} instrumentToken={subelem._id.instrumentToken} symbolName={(subelem._id.symbol).slice(-7)} lotSize={lotSize} maxLot={lotSize*36} ltp={(liveDetail[index]?.last_price)?.toFixed(2)}/>
      );


      //console.log(obj)
      rows.push(obj);
    })

    console.log("rows value", rows)

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Positions
          </MDTypography>
        </MDBox>
      </MDBox>
      {rows.length === 1 ? (
      <MDBox display="flex" flexDirection="column" mb={4} sx={{alignItems:"center"}}>
        <GrAnchor style={{fontSize: '30px'}}/>
        <Typography style={{fontSize: '20px', color:"grey"}}>No open positions yet</Typography>
        <Typography mb={2} fontSize={15} color="grey">Add instruments and start trading.</Typography>
        <MDButton variant="outlined" size="small" color="info" onClick={()=>{setIsGetStartedClicked(true)}}>Get Started</MDButton>
      </MDBox>)
      :
      // (<MDBox>
      //   <DataTable
      //     table={{ columns, rows }}
      //     showTotalEntries={false}
      //     isSorted={false}
      //     noEndBorder
      //     entriesPerPage={false}
      //   />
      // </MDBox>
      // )
      (<MDBox>
        <TableContainer component={Paper}>
          <table style={{borderCollapse: "collapse", width: "100%", borderSpacing: "10px 5px"}}>
            <thead>
              <tr style={{borderBottom: "1px solid #D3D3D3"}}>
                <td style={styleTD} >PRODUCT</td>
                <td style={styleTD} >INSTRUMENT</td>
                <td style={styleTD}>QUANTITY</td>
                <td style={styleTD} >AVG. PRICE</td>
                <td style={styleTD} >LTP</td>
                <td style={styleTD} >GROSS P&L</td>
                <td style={styleTD} >CHANGE(%)</td>
                <td style={styleTD} >EXIT</td>
                <td style={styleTD} >BUY</td>
                <td style={styleTD} >SELL</td>
                
              </tr>
            </thead>
            <tbody>

              {rows.map((elem)=>{
                return(
                  <>
              <tr
              style={{borderBottom: "1px solid #D3D3D3"}} key={elem.symbol.props.children}
              >
                  <OverallRow 
                    quantity={elem?.Quantity?.props?.children}
                    symbol={elem?.symbol?.props?.children}
                    product={elem?.Product?.props?.children}
                    avgPrice={elem?.avgPrice?.props?.children}
                    last_price={elem?.last_price?.props?.children}
                    grossPnl={elem?.grossPnl?.props?.children}
                    change={elem?.change?.props?.children}
                  />
                  <td style={{textAlign: "center", marginRight:0.5,minWidth:2,minHeight:3}} >{elem?.exit}</td>
                  <td style={{textAlign: "center", marginRight:0.5,minWidth:2,minHeight:3}} >{elem?.buy}</td>
                  <td style={{textAlign: "center", marginRight:0.5,minWidth:2,minHeight:3}} >{elem?.sell}</td>
      
              </tr>
              </>

                )
              })} 
              <tr
              style={{borderBottom: "1px solid #D3D3D3"}}
              >
                  <td style={{textAlign: "center", fontSize: ".75rem", color: "#7b809a", fontWeight: "600"}} ></td>
                  <td style={{textAlign: "center", fontSize: ".75rem", color: "#7b809a", fontWeight: "600"}} ></td>
                  <td style={{textAlign: "center", fontSize: ".75rem", color: "#7b809a", fontWeight: "600"}} >Running Lots : {totalRunningLots}</td>
                  <td style={{textAlign: "center", fontSize: ".75rem", color: "#7b809a", fontWeight: "600"}} ></td>
                  <td style={{textAlign: "center", fontSize: ".75rem", color: "#7b809a", fontWeight: "600"}} >Brokerage : {"₹"+(totalTransactionCost).toFixed(2)}</td>
                  <td style={{textAlign: "center", fontSize: ".75rem", color: "#7b809a", fontWeight: "600", color: `${totalGrossPnl > 0 ? 'green' : 'red'}`}} >Gross P&L : {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)): "-₹" + ((-totalGrossPnl).toFixed(2))}</td>
                  <td style={{textAlign: "center", fontSize: ".75rem", color: "#7b809a", fontWeight: "600", color: `${(totalGrossPnl-totalTransactionCost) > 0 ? 'green' : 'red'}`}} >Net P&L : {(totalGrossPnl-totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnl-totalTransactionCost).toFixed(2)): "-₹" + ((-(totalGrossPnl-totalTransactionCost)).toFixed(2))}</td>
                  <td style={{textAlign: "center", fontSize: ".75rem", color: "#7b809a", fontWeight: "600"}} ></td>
                  <td style={{textAlign: "center", fontSize: ".75rem", color: "#7b809a", fontWeight: "600"}} ></td>
                  <td style={{textAlign: "center", fontSize: ".75rem", color: "#7b809a", fontWeight: "600"}} ></td>
                  <td style={{textAlign: "center", fontSize: ".75rem", color: "#7b809a", fontWeight: "600"}} ></td>
              </tr>
            </tbody>
          </table>
        </TableContainer>

      </MDBox>
      )
      }
    </Card>
  );

}
export default OverallGrid;
