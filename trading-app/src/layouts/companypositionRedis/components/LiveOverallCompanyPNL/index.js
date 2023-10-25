import {useState, useEffect} from "react"
import axios from "axios";
// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import { Typography } from "@mui/material";
import { MdAutoGraph } from "react-icons/md";

// Material Dashboard 2 React examples
import DataTable from "../../../../examples/Tables/DataTable";

// Data
import data from "./data";

// function OverallCompantPNL({socket}) {
function LiveOverallCompantPNL({socket}) {
  const { columns, rows } = data();
  const [menu, setMenu] = useState(null);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  // let date = new Date();
  let totalTransactionCost = 0;
  // const [overallPnlArr, setOverallPnlArr] = useState([]);
  // const [liveDetail, setLiveDetail] = useState([]);
  // const [avgPrice, setAvgPrice] = useState([]);
  const [marketData, setMarketData] = useState([]);
  // const [instrumentData, setInstrumentData] = useState([]);
  const [tradeData, setTradeData] = useState([]);
  const [trackEvent, setTrackEvent] = useState({});

  let [latestLive, setLatestLive] = useState({
    tradeTime: "",
    tradeBy: "",
    tradeSymbol: "",
    tradeType: "",
    tradeQuantity: "",
    tradeStatus: ""
  })

  // let liveDetailsArr = [];
  let totalGrossPnl = 0;
  let totalRunningLots = 0;
  
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
      console.log("this is live market data", data);
      setMarketData(prevInstruments => {
        const instrumentMap = new Map(prevInstruments.map(instrument => [instrument?.instrument_token, instrument]));
        data.forEach(instrument => {
          instrumentMap.set(instrument?.instrument_token, instrument);
        });
        return Array.from(instrumentMap.values());
      });
      // setDetails.setMarketData(data);
    })
  }, [])

  useEffect(()=>{
    socket.on('updatePnl', (data)=>{
      // console.log("in the pnl event", data)
      setTimeout(()=>{
        setTrackEvent(data);
      })
    })
  }, [])

  useEffect(()=>{

    axios.get(`${baseUrl}api/v1/infinityRedis/livePnlCompany`)
    .then((res) => {
        setTradeData(res.data.data);
    }).catch((err) => {
        return new Error(err);
    })

      // Get Lastest Trade timestamp
      axios.get(`${baseUrl}api/v1/infinityRedis/live/letestTradeCompany`)
      .then((res)=>{
        latestLive.tradeTime = (res?.data?.data?.trade_time) ;
        latestLive.tradeBy = (res?.data?.data?.createdBy) ;
        latestLive.tradeType = (res?.data?.data?.buyOrSell) ;
        latestLive.tradeQuantity = (res?.data?.data?.Quantity) ;
        latestLive.tradeSymbol = (res?.data?.data?.symbol) ;
        latestLive.tradeStatus = (res?.data?.data?.status)
  
        setLatestLive(latestLive)
      }).catch((err) => { 
        return new Error(err);
      })

  }, [trackEvent])


  // useEffect(() => {
  //   return () => {
  //       socket.close();
  //   }
  // }, [])

  console.log("latestLive", latestLive)

  // if(tradeData.length != 0){
    tradeData.map((elem)=>{
        totalTransactionCost += Number(elem.brokerage);
    })

    tradeData.map((subelem, index)=>{
      let obj = {};
      totalRunningLots += Number(subelem?.lots)

      const liveDetail = marketData.filter((elem)=>{
        // console.log("liveDetail2", elem.instrument_token, subelem.exchangeInstrumentToken, ( subelem.exchangeInstrumentToken == elem.instrument_token))
        return elem !== undefined && (subelem?.instrumentToken == elem?.instrument_token || subelem?.exchangeInstrumentToken == elem?.instrument_token)
      })

      console.log("liveDetail", liveDetail[0]?.instrument_token, subelem?.instrumentToken )
      let updatedValue = (subelem?.amount+(subelem?.lots)*liveDetail[0]?.last_price);
      totalGrossPnl += updatedValue;

      const instrumentcolor = subelem?.symbol?.slice(-2) == "CE" ? "success" : "error"
      const quantitycolor = subelem?.lots >= 0 ? "success" : "error"
      const gpnlcolor = updatedValue >= 0 ? "success" : "error"
      const pchangecolor = (liveDetail[0]?.change) >= 0 ? "success" : "error"
      const productcolor =  subelem?.product === "NRML" ? "info" : subelem?.product == "MIS" ? "warning" : "error"

      obj.Product = (
        <MDTypography component="a" variant="caption" color={productcolor} fontWeight="medium">
          {(subelem?.product)}
        </MDTypography>
      );

      obj.symbol = (
        <MDTypography component="a" variant="caption" color={instrumentcolor} fontWeight="medium">
          {(subelem?.symbol)}
        </MDTypography>
      );

      obj.Quantity = (
        <MDTypography component="a" variant="caption" color={quantitycolor} fontWeight="medium">
          {subelem?.lots}
        </MDTypography>
      );

      obj.avgPrice = (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {"₹"+(subelem?.lastaverageprice)}
        </MDTypography>
      );

      if((liveDetail[0]?.last_price)){
        obj.last_price = (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {"₹"+(liveDetail[0]?.last_price)?.toFixed(2)}
          </MDTypography>
        );
      } else{
        obj.last_price = (
          <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
            {"₹"+(liveDetail[0]?.last_price)}
          </MDTypography>
        );
      }

      obj.grossPnl = (
        <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
          {updatedValue >= 0.00 ? "+₹" + (updatedValue?.toFixed(2)): "-₹" + ((-updatedValue)?.toFixed(2))}
        </MDTypography>
      );

      if((liveDetail[0]?.change)){
        obj.change = (
          <MDTypography component="a" variant="caption" color={pchangecolor} fontWeight="medium">
            {(liveDetail[0]?.change)?.toFixed(2)+"%"}
          </MDTypography>
        );
      } else{
        obj.change = (
          <MDTypography component="a" variant="caption" color={pchangecolor} fontWeight="medium">
            {(((liveDetail[0]?.last_price-liveDetail[0]?.average_price)/liveDetail[0]?.average_price)*100)?.toFixed(2)+"%"}
          </MDTypography>
        );
      }
      //console.log(obj)
      if(subelem.lots != 0){
        rows.unshift(obj);
      } else{
        rows.push(obj);
      }
    })


      let obj = {};

      const totalGrossPnlcolor = totalGrossPnl >= 0 ? "success" : "error"
      const totalnetPnlcolor = (totalGrossPnl-totalTransactionCost) >= 0 ? "success" : "error"

      obj.symbol = (
        <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
        {}
        </MDTypography>
      );
    
      obj.Quantity = (
        <MDTypography component="a" variant="caption" backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
          Running Lots : {totalRunningLots}
        </MDTypography>
      );
    
      obj.avgPrice = (
        <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
        {}
        </MDTypography>
      );
    
      obj.last_price = (
        <MDTypography component="a" variant="caption" color="dark" backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
          Brokerage : {"₹"+(totalTransactionCost)?.toFixed(2)}
        </MDTypography>
      );
    
    
      obj.grossPnl = (
        <MDTypography component="a" variant="caption" color={totalGrossPnlcolor} backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
        Gross P&L : {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl?.toFixed(2)): "-₹" + ((-totalGrossPnl)?.toFixed(2))}
        </MDTypography>
      );
    
      obj.change = (
        <MDTypography component="a" variant="caption" color={totalnetPnlcolor} backgroundColor="#e0e1e5" borderRadius="5px" padding="5px" fontWeight="medium">
          Net P&L : {(totalGrossPnl-totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnl-totalTransactionCost)?.toFixed(2)): "-₹" + ((-(totalGrossPnl-totalTransactionCost))?.toFixed(2))}
        </MDTypography>
      );
    
      
      rows.push(obj);

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



  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>

      <MDBox display="flex" justifyContent="space-between" alignItems="center" flexGrow={1}>
          <MDTypography variant="h6" gutterBottom>
            Company Position(Live Trade)
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0} textAlign="right">
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: 0,
              }}
            >
              {latestLive?.tradeBy ? 'done' : 'stop'}
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
            {latestLive?.tradeBy ? 
              <span>
                <strong> last trade </strong>
                {latestLive?.tradeBy} {latestLive?.tradeType === "BUY" ? "bought " : "sold "}  
                {Math.abs(latestLive?.tradeQuantity)} quantity of {latestLive?.tradeSymbol} at {(latestLive?.tradeTime).toString().split("T")[1].split(".")[0]} - {latestLive?.tradeStatus}
              </span>
              : "No real trades today"
            }
            </MDTypography>
          </MDBox>
        </MDBox>

        {renderMenu}
      </MDBox>

      {rows.length === 0 ? (
      <MDBox display="flex" flexDirection="column" mb={4} sx={{alignItems:"center"}}>
        <MdAutoGraph style={{fontSize: '30px', color:"green"}}/>
        <Typography style={{fontSize: '20px',color:"grey"}}>Nothing here</Typography>
        <Typography mb={2} fontSize={15} color="grey">Active real trades will show up here.</Typography> 
      </MDBox>)
      :
        (<MDBox>
          <DataTable
            table={{ columns, rows }}
            showTotalEntries={false}
            isSorted={false}
            noEndBorder
            // entriesPerPage={false}
          />
         </MDBox>
      )}
    </Card>
  );
}
export default LiveOverallCompantPNL;
