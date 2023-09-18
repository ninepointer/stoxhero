import {useContext, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { RiStockFill } from "react-icons/ri";
import { TiMediaRecord } from "react-icons/ti";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Tooltip } from '@mui/material';


// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";

// Material Dashboard 2 React examples
import MDSnackbar from "../../../components/MDSnackbar";

import { useEffect } from "react";
import axios from "axios";
import BuyModel from "../BuyModel";
import SellModel from "../SellModel";
import { Typography } from "@mui/material";
import InstrumentComponent from "./InstrumentComponent";
import { marketDataContext } from "../../../MarketDataContext";
import { renderContext } from "../../../renderContext";
import { InfinityTraderRole, dailyContest, battle, marginX } from "../../../variables";
import { userContext } from "../../../AuthContext";
import Timer from "./timer";
import AutoCutPopUp from "./tradecutPopup";


function InstrumentDetails({socket , setIsGetStartedClicked, from, subscriptionId, moduleData, setWatchList}) {
  // if(from === marginX || from === battle){
  //   from = dailyContest;
  // }
  const marketDetails = useContext(marketDataContext)
  const {render, setRender} = useContext(renderContext);
  const [buyState, setBuyState] = useState(false);
  const [sellState, setSellState] = useState(false);
  //console.log("socket print", socket)
  const getDetail = useContext(userContext);
  // console.log("rendering : InstrumentDetails", subscriptionId)
  let styleTD = {
    textAlign: "center",
    fontSize: "11px",
    fontWeight: "900",
    color: "#7b809a",
    opacity: 0.7
  }

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

  // const { render, setRender } = Render;
  const [isAppLive, setisAppLive] = useState('');
  const [successSB, setSuccessSB] = useState(false);
  const [instrumentName, setInstrumentName] = useState("");
  const [showTimer, setShowTimer] = useState("");
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  useEffect(()=>{
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
    // console.log("InfinityTraderRole", InfinityTraderRole , getDetail.userDetails.role.roleName)
    axios.get(`${baseUrl}api/v1/readsetting`, {withCredentials: true})
      .then((res) => {
        setShowTimer(res.data[0].timer)
        if(InfinityTraderRole == getDetail.userDetails.role.roleName){
          setisAppLive(res.data[0].infinityLive);
        } else{
          setisAppLive(res.data[0].isAppLive);
        }
      });
  }, []);


  const [instrumentData, setInstrumentData] = useState([]);

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

  url = url.slice(1);

  // console.log("isAllIndex url", isAllIndex, url);
  if(from === dailyContest){
    endPoint = `${baseUrl}api/v1/instrumentDetails?${url}&dailyContest=${true}`
  } else{
    endPoint = `${baseUrl}api/v1/instrumentDetails`
  }


  useEffect(()=>{
    // console.log("endPoint", endPoint)
    axios.get(`${endPoint}`,{
      withCredentials: true,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
      },
    })
    .then((res) => {
        setInstrumentData(res.data.data);
        setWatchList(res.data.data);
    }).catch((err) => {
        return new Error(err);
    })
  }, [render])


  const instrumentDetailArr = [];
  instrumentData.map((elem)=>{
    // console.log("instrument date", elem)
    const date = new Date(elem.contractDate);
    const day = date.getDate(); // returns the day of the month (4 in this case)
    const month = date.toLocaleString('default', { month: 'long' }); // returns the full month name (May in this case)
    const formattedDate = `${day}${day % 10 == 1 && day != 11 ? 'st' : day % 10 == 2 && day != 12 ? 'nd' : day % 10 == 3 && day != 13 ? 'rd' : 'th'} ${month}`; // formats the date as "4th May"
    //console.log(formattedDate);

    let instrumentDetailObj = {}
    const instrumentcolor = elem.symbol.slice(-2) == "CE" ? "success" : "error"
    let perticularInstrumentMarketData = marketDetails.marketData.filter((subelem)=>{
      // console.log("perticularInstrumentMarketData", elem.instrumentToken , subelem.instrument_token, elem.exchangeInstrumentToken)
      return (elem.instrumentToken == subelem.instrument_token) || (elem.exchangeInstrumentToken == subelem.instrument_token)
    })
    
    // console.log("perticularInstrumentMarketData", perticularInstrumentMarketData)
    const percentagechangecolor = perticularInstrumentMarketData[0]?.change >= 0 ? "success" : "error"
    const percentagechangecolor1 = (((perticularInstrumentMarketData[0]?.last_price - perticularInstrumentMarketData[0]?.average_price) / perticularInstrumentMarketData[0]?.average_price)*100) >= 0 ? "success" : "error"


    instrumentDetailObj.instrument = (
      <MDTypography variant="caption" color={instrumentcolor} fontWeight="medium">
        {elem.instrument}
      </MDTypography>
    );
    instrumentDetailObj.symbol = (
      <MDTypography variant="caption" color={instrumentcolor} fontWeight="medium">
        {elem.symbol}
      </MDTypography>
    );
    instrumentDetailObj.quantity = (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {elem.Quantity}
      </MDTypography>
    );
    instrumentDetailObj.contractDate = (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {formattedDate}
      </MDTypography>
    );
    instrumentDetailObj.last_price = (
      <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="medium">
        {"₹"+(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)}
      </MDTypography>
    );
    if(perticularInstrumentMarketData[0]?.change !== undefined){
      instrumentDetailObj.change = (
        <MDTypography component="a" href="#" variant="caption" color={percentagechangecolor} fontWeight="medium">
          {perticularInstrumentMarketData[0]?.change >= 0 ? "+" + ((perticularInstrumentMarketData[0]?.change)?.toFixed(2))+"%" : ((perticularInstrumentMarketData[0]?.change)?.toFixed(2))+"%"}
        </MDTypography>
      );
    } else{
      instrumentDetailObj.change = (
        <MDTypography component="a" href="#" variant="caption" color={percentagechangecolor1} fontWeight="medium">
          {(((perticularInstrumentMarketData[0]?.last_price - perticularInstrumentMarketData[0]?.average_price) / perticularInstrumentMarketData[0]?.average_price)*100) >= 0 ? "+" + (((perticularInstrumentMarketData[0]?.last_price - perticularInstrumentMarketData[0]?.average_price) / perticularInstrumentMarketData[0]?.average_price)*100)?.toFixed(2)+"%" : (((perticularInstrumentMarketData[0]?.last_price - perticularInstrumentMarketData[0]?.average_price) / perticularInstrumentMarketData[0]?.average_price)*100)?.toFixed(2)+"%"}
        </MDTypography>
      );
    }

    instrumentDetailObj.buy = (
      <BuyModel module={moduleData} socket={socket} exchangeInstrumentToken={elem.exchangeInstrumentToken} subscriptionId={subscriptionId} buyState={buyState} from={from} render={render} setRender={setRender} symbol={elem.symbol} exchange={elem.exchange} instrumentToken={elem.instrumentToken} symbolName={ (elem.symbol).slice(-7)} lotSize={elem.lotSize} maxLot={elem.maxLot} ltp={(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)} setBuyState={setBuyState}/> 
    );
    
    instrumentDetailObj.sell = (
      <SellModel module={moduleData} socket={socket} exchangeInstrumentToken={elem.exchangeInstrumentToken} subscriptionId={subscriptionId} sellState={sellState} from={from} render={render} setRender={setRender} symbol={elem.symbol} exchange={elem.exchange} instrumentToken={elem.instrumentToken} symbolName={ (elem.symbol).slice(-7)} lotSize={elem.lotSize} maxLot={elem.maxLot} ltp={(perticularInstrumentMarketData[0]?.last_price)?.toFixed(2)} setSellState={setSellState}/>
    );

    instrumentDetailObj.remove = (
      <MDButton size="small" sx={{marginRight:0.5,minWidth:2,minHeight:3, height: "30px"}} color="secondary" onClick={()=>{removeInstrument(elem.instrumentToken, elem.instrument)}}>
        <RemoveCircleOutlineIcon  />
      </MDButton>
    );

    instrumentDetailObj.instrumentToken = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.instrumentToken}
      </MDTypography>
    );

    instrumentDetailObj.chartInstrument = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {elem.chartInstrument}
      </MDTypography>
    );

    instrumentDetailObj.sellState = (
      false
    );

    instrumentDetailObj.buyState = (
      false
    );

    instrumentDetailArr.push(instrumentDetailObj)
  })

  const handleBuyClick = (index) => {
    setBuyState(true)
    const newRows = [...instrumentDetailArr];
    newRows[index].sellState = true;
    instrumentDetailArr = (newRows);
  };

  const handleSellClick = (index) => {
    setSellState(true)
    const newRows = [...instrumentDetailArr];
    newRows[index].sellState = true;
    instrumentDetailArr = (newRows);
  };

  async function removeInstrument(instrumentToken, instrument){
    setInstrumentName(instrument)
    const response = await fetch(`${baseUrl}api/v1/inactiveInstrument/${instrumentToken}`, {
      method: "PATCH",
      credentials:"include",
      headers: {
          "Accept": "application/json",
          "content-type": "application/json"
      },
      body: JSON.stringify({
        isAddedWatchlist: false
      })
    });

    const permissionData = await response.json();
    //console.log("remove", permissionData)
    if (permissionData.status === 422 || permissionData.error || !permissionData) {
        window.alert(permissionData.error);
        ////console.log("Failed to Edit");
    }else {
        let instrumentTokenArr = [];
        instrumentTokenArr.push(instrumentToken)
        socket.emit("unSubscribeToken", instrumentTokenArr);
        openSuccessSB();
    }
    render ? setRender(false) : setRender(true);
  }


  let title = "Instrument Removed"
  let content = `${instrumentName} is removed from your watchlist`
  const renderSuccessSB = (
    <MDSnackbar
      color="error"
      icon='error'
      title={title}
      content={content}
      // dateTime={timestamp}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite="info"
      sx={{ borderLeft: '10px solid red', borderRadius: "15px" }}
    />
  );

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pl={2} pr={2} pt={2} pb={2}>
        <MDBox display="flex">
          <MDTypography variant="h6" gutterBottom>
            My Watchlist
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
          </MDBox>
        </MDBox>
        <MDBox color="text" px={0}>
            <MDTypography 
            p={0}
            fontWeight="bold" 
            variant="button" 
            color={isAppLive ? "success" : "error"}
            style={{display:"flex",alignItems:"center"}}
            >
              {showTimer ?
              <Timer socket={socket}/>
              :
              <>
              <TiMediaRecord sx={{margin:10}}/> {isAppLive ? "System Live" : "System Offline"}
              </>
              }
              <AutoCutPopUp socket={socket} />
            </MDTypography>
        </MDBox>
      </MDBox>
      {instrumentDetailArr?.length === 0 ? (
      <MDBox display="flex" flexDirection="column" mb={4} sx={{alignItems:"center"}}>
        <RiStockFill style={{fontSize: '30px'}}/>
        <Typography style={{fontSize: '20px',color:"grey"}}>Nothing here</Typography>
        <Typography mb={2} fontSize={15} color="grey">Use the search bar to add instruments.</Typography>
        <MDButton variant="outlined" size="small" color="info" onClick={()=>{setIsGetStartedClicked(true)}}>Add Instrument</MDButton>
      </MDBox>)
      :
      (<MDBox>
        <TableContainer component={Paper}>
          <table style={{borderCollapse: "collapse", width: "100%", borderSpacing: "10px 5px"}}>
            <thead>
              <tr style={{borderBottom: "1px solid #D3D3D3"}}>
                <td style={styleTD}>CONTRACT DATE</td>
                <td style={styleTD} >SYMBOL</td>
                <td style={styleTD} >INSTRUMENT</td>
                <td style={styleTD} >LTP</td>
                <td style={styleTD} >CHANGE(%)</td>
                {from !== InfinityTraderRole &&
                <td style={styleTD} >CHART</td>}
                <td style={styleTD} >BUY</td>
                <td style={styleTD} >SELL</td>
                <td style={styleTD} >REMOVE</td>
              </tr>
            </thead>
            <tbody>

              {instrumentDetailArr.map((elem, index)=>{
                return(
              <tr
              style={{borderBottom: "1px solid #D3D3D3"}} key={elem.instrumentToken.props.children}
              >
                  <InstrumentComponent 
                    contractDate={elem.contractDate.props.children}
                    symbol={elem.symbol.props.children}
                    instrument={(elem.symbol.props.children).slice(-7)}
                    last_price={elem.last_price.props.children}
                    change={elem.change.props.children}
                    chartInstrument={elem.chartInstrument.props.children}
                    from={from}
                  />

                  <Tooltip title="Buy" placement="top">
                    {!elem.buyState ?
                    <td style={{textAlign: "center", marginRight:0.5,minWidth:2,minHeight:3}} >{elem.buy}</td>
                    :
                    <td style={{textAlign: "center", marginRight:0.5,minWidth:2,minHeight:3}} >
                      <MDButton  size="small" color="info" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={()=>{handleBuyClick(index)}} >
                        B
                      </MDButton>
                    </td>
                    }
                  </Tooltip>
                  <Tooltip title="Sell" placement="top">
                    {!elem.sellState ?
                    <td style={{textAlign: "center", marginRight:0.5,minWidth:2,minHeight:3}} >{elem.sell}</td>
                    :
                    <td style={{textAlign: "center", marginRight:0.5,minWidth:2,minHeight:3}} >
                      <MDButton  size="small" color="error" sx={{marginRight:0.5,minWidth:2,minHeight:3}} onClick={()=>{handleSellClick(index)}} >
                        S
                      </MDButton>
                      </td>
                    }
                  </Tooltip>

                  <Tooltip title="Remove Instrument" placement="top">
                    <td style={{textAlign: "center", marginRight:0.5,minWidth:2,minHeight:3}} >{elem.remove}</td>
                  </Tooltip>
      
              </tr>

                )
              })}
            </tbody>
          </table>
        </TableContainer>

      </MDBox>
      )}
      {renderSuccessSB}
    </Card>
  );
}

export default InstrumentDetails;
















