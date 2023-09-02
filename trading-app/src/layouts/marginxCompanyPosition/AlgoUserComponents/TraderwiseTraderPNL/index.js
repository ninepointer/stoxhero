import { useState, useEffect } from "react"
import axios from "axios";
// @mui material components
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Switch from '@mui/material/Switch';

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import { Grid } from "@mui/material";

// Material Dashboard 2 React examples
import DataTable from "../../../../examples/Tables/DataTable";

// Data
import data from "./data";
import { TextField } from "@mui/material";
import { apiUrl } from "../../../../constants/constants";

function TraderwiseTraderPNL({ socket }) {
  const { columns, rows } = data();
  // let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
  const [allTrade, setAllTrade] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [marginx, setMarginx] = useState([]);
  const [selectedMarginx, setselectedMarginx] = useState();
  const [trackEvent, setTrackEvent] = useState({});
  // const [isLive, setIsLive] = useState(false);
  const [action, setAction] = useState(false);

  useEffect(() => {
    axios.get(`${apiUrl}marginx/today`, { withCredentials: true })
      .then((res) => {
        setMarginx(res.data.data);
        setselectedMarginx(res.data.data[0])
        // setIsLive(res.data.data[0]?.currentLiveStatus=='Live');
      }).catch(e => console.log(e));
  }, [action]);

  useEffect(() => {
    socket.on('updatePnl', (data) => {
      setTimeout(() => {
        setTrackEvent(data);
      })
    })
  }, [])

  useEffect(() => {

    axios.get(`${apiUrl}getliveprice`)
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

  useEffect(() => {
    if (!selectedMarginx?._id) {
      return;
    }
    axios.get(`${apiUrl}marginxtrade/${selectedMarginx?._id}/traderWisePnl`, { withCredentials: true })
      .then((res) => {
        setAllTrade(res.data.data);
      }).catch((err) => {
        return new Error(err);
      })

  }, [selectedMarginx, trackEvent])


  let mapForParticularUser = new Map();
  for (let i = 0; i < allTrade.length; i++) {
    if (mapForParticularUser.has(allTrade[i]._id.traderId)) {
      let marketDataInstrument = marketData.filter((elem) => {
        return elem.instrument_token == Number(allTrade[i]._id.symbol)
      })

      let obj = mapForParticularUser.get(allTrade[i]._id.traderId)
      obj.totalPnl += ((allTrade[i].amount + ((allTrade[i].lots) * marketDataInstrument[0]?.last_price)));
      obj.lotUsed += Math.abs(allTrade[i].lotUsed)
      obj.runninglots += allTrade[i].lots;
      obj.brokerage += allTrade[i].brokerage;
      obj.noOfTrade += allTrade[i].trades

    } else {
      let marketDataInstrument = marketData.filter((elem) => {
        return elem !== undefined && elem.instrument_token === Number(allTrade[i]._id.symbol)
      })
      mapForParticularUser.set(allTrade[i]._id.traderId, {
        name: allTrade[i]._id.traderName,
        totalPnl: ((allTrade[i].amount + ((allTrade[i].lots) * marketDataInstrument[0]?.last_price))),
        lotUsed: Math.abs(allTrade[i].lotUsed),
        runninglots: allTrade[i].lots,
        brokerage: allTrade[i].brokerage,
        noOfTrade: allTrade[i].trades,
        userId: allTrade[i]._id.traderId,
        email: allTrade[i]._id.traderEmail,
        mobile: allTrade[i]._id.traderMobile
      })
    }

  }

  let finalTraderPnl = [];
  for (let value of mapForParticularUser.values()) {
    finalTraderPnl.push(value);
  }

  finalTraderPnl.sort((a, b) => {
    return (b.totalPnl - b.brokerage) - (a.totalPnl - a.brokerage)
  });


  let totalGrossPnl = 0;
  let totalTransactionCost = 0;
  let totalNoRunningLots = 0;
  let totalTrades = 0;
  let totalLotsUsed = 0;
  let totalTraders = 0;



  finalTraderPnl.map((subelem, index) => {
    let obj = {};
    let npnlcolor = ((subelem.totalPnl) - (subelem.brokerage)) >= 0 ? "success" : "error"
    let tradercolor = ((subelem.totalPnl) - (subelem.totalPnl)) >= 0 ? "success" : "error"
    let gpnlcolor = (subelem.totalPnl) >= 0 ? "success" : "error"
    let runninglotscolor = subelem.runninglots > 0 ? "info" : (subelem.runninglots < 0 ? "error" : "dark")
    let runninglotsbgcolor = subelem.runninglots > 0 ? "#ffff00" : ""
    let traderbackgroundcolor = subelem.runninglots != 0 ? "white" : "#e0e1e5"

    totalGrossPnl += (subelem.totalPnl);
    totalTransactionCost += (subelem.brokerage);
    totalNoRunningLots += (subelem.runninglots);
    totalLotsUsed += (subelem.lotUsed);
    totalTrades += (subelem.noOfTrade);
    totalTraders += 1;

    obj.traderName = (
      <MDTypography component="a" variant="caption" color={tradercolor} fontWeight="medium" backgroundColor={traderbackgroundcolor} padding="5px" borderRadius="5px">
        {(subelem.name)}
      </MDTypography>
    );

    obj.grossPnl = (
      <MDTypography component="a" variant="caption" color={gpnlcolor} fontWeight="medium">
        {(subelem.totalPnl) >= 0.00 ? "+₹" + ((subelem.totalPnl).toFixed(2)) : "-₹" + ((-(subelem.totalPnl)).toFixed(2))}
      </MDTypography>
    );

    obj.noOfTrade = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {subelem.noOfTrade}
      </MDTypography>
    );

    obj.runningLots = (
      <MDTypography component="a" variant="caption" color={runninglotscolor} backgroundColor={runninglotsbgcolor} fontWeight="medium">
        {subelem.runninglots}
      </MDTypography>
    );

    obj.lotUsed = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {subelem.lotUsed}
      </MDTypography>
    );

    obj.brokerage = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {"₹" + (subelem.brokerage).toFixed(2)}
      </MDTypography>
    );

    obj.netPnl = (
      <MDTypography component="a" variant="caption" color={npnlcolor} fontWeight="medium">
        {((subelem.totalPnl) - (subelem.brokerage)) >= 0.00 ? "+₹" + (((subelem.totalPnl) - (subelem.brokerage)).toFixed(2)) : "-₹" + ((-((subelem.totalPnl) - (subelem.brokerage))).toFixed(2))}
      </MDTypography>
    );

    obj.email = (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        {(subelem?.email)}
      </MDTypography>
    );

    obj.mobile = (
      <MDTypography component="a" variant="caption" fontWeight="medium">
        {(subelem.mobile)}
      </MDTypography>
    );

    rows.push(obj);
  })

  let obj = {};

  const totalGrossPnlcolor = totalGrossPnl >= 0 ? "success" : "error"
  const totalnetPnlcolor = (totalGrossPnl - totalTransactionCost) >= 0 ? "success" : "error"

  obj.traderName = (
    <MDTypography component="a" variant="caption" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
      Traders : {totalTraders}
    </MDTypography>
  );

  obj.grossPnl = (
    <MDTypography component="a" variant="caption" color={totalGrossPnlcolor} padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
      {totalGrossPnl >= 0.00 ? "+₹" + (totalGrossPnl.toFixed(2)) : "-₹" + ((-totalGrossPnl).toFixed(2))}
    </MDTypography>
  );

  obj.noOfTrade = (
    <MDTypography component="a" variant="caption" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
      {totalTrades}
    </MDTypography>
  );

  obj.runningLots = (
    <MDTypography component="a" variant="caption" color="dark" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
      {totalNoRunningLots}
    </MDTypography>
  );

  obj.lotUsed = (
    <MDTypography component="a" variant="caption" color="dark" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
      {totalLotsUsed}
    </MDTypography>
  );


  obj.brokerage = (
    <MDTypography component="a" variant="caption" color="dark" padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
      {"₹" + (totalTransactionCost).toFixed(2)}
    </MDTypography>
  );

  obj.netPnl = (
    <MDTypography component="a" variant="caption" color={totalnetPnlcolor} padding="5px" borderRadius="5px" backgroundColor="#e0e1e5" fontWeight="medium">
      {(totalGrossPnl - totalTransactionCost) >= 0.00 ? "+₹" + ((totalGrossPnl - totalTransactionCost).toFixed(2)) : "-₹" + ((-(totalGrossPnl - totalTransactionCost)).toFixed(2))}
    </MDTypography>
  );



  rows.push(obj);
const switchToMock = async () => {
  const id = selectedMarginx?._id;
  try{
    const res = await axios.get(`${apiUrl}switchRealToMockContest/${id}`, {withCredentials:true});
    if(res.status == 200){
      // setIsLive(false);
      setAction(!action);
    }
    console.log(res.data);
  }catch(e){
    console.log(e);
  }
}

  return (
    <>
      {selectedMarginx &&
        <Card>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDBox>
              <MDTypography variant="h6" gutterBottom p={3}>
                Daily Contest Trader Position(Company Side)
              </MDTypography>
            </MDBox>

          </MDBox>

          <MDBox >
            {/* <MDTypography fontSize={15}>Select Contest</MDTypography> */}
            <TextField
              select
              label=""
              value={selectedMarginx?.contestName ? selectedMarginx?.contestName : marginx[0]?.contestName}
              minHeight="4em"
              // helperText="Please select subscription"
              variant="outlined"
              sx={{ margin: 1, padding: 1, width: "300px" }}
              onChange={(e) => { setselectedMarginx(marginx.filter((item) => item.contestName == e.target.value)[0]); }}
            >
              {marginx?.map((option) => (
                <MenuItem key={option.contestName} value={option.contestName} minHeight="4em">
                  {option.contestName}
                </MenuItem>
              ))}
            </TextField>

            <MDBox style={{backgroundColor:`${selectedMarginx?.marginXTemplate?.entryFee > 0 ? 'lightgreen' : 'yellow'}`}} borderRadius={3} m={1}>
              <Grid container xs={12} md={12} lg={12}>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Entry Fee:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >₹{selectedMarginx?.marginXTemplate?.entryFee}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Max Participant:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >{selectedMarginx?.maxParticipants}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Participant:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >{selectedMarginx?.participants?.length}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Expected Collection:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >₹{selectedMarginx?.marginXTemplate?.entryFee * selectedMarginx?.maxParticipants}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Collected Fee:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >₹{(selectedMarginx?.marginXTemplate?.entryFee * selectedMarginx?.participants?.length)}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>Template:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >₹{(selectedMarginx?.marginXTemplate?.portfolioValue)}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>NIFTY:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >{(selectedMarginx?.isNifty === true ? 'Yes' : 'No')}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>BANKNIFTY:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >{(selectedMarginx?.isBankNifty === true ? 'Yes' : 'No')}</MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={12} lg={2}>
                    <MDBox display="flex" justifyContent="center" alignContent="center" alignItems="center" borderRadius={5} p={1}>
                      <MDTypography fontSize={11}>FINNIFTY:&nbsp;</MDTypography>
                      <MDTypography fontSize={13} fontWeight="bold" >{(selectedMarginx?.isFinNifty === true ? 'Yes' : 'No')}</MDTypography>
                    </MDBox>
                  </Grid>
              </Grid>
            </MDBox>
          </MDBox>

          <MDBox>
            <DataTable
              table={{ columns, rows }}
              showTotalEntries={false}
              isSorted={false}
              noEndBorder
            />
          </MDBox>
        </Card>
      }
    </>
  );
}
export default TraderwiseTraderPNL;
