import { useState, useEffect } from "react";
import axios from "axios";
// @mui material components
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "../../../examples/Tables/DataTable";
import { apiUrl } from "../../../constants/constants";

// Data
// import data from "./data";
// import { TextField } from "@mui/material";

function TraderwiseTraderPNL({ socket }) {
  let columns = [
    {
      Header: "Trader Name",
      accessor: "traderName",
      width: "12.5%",
      align: "center",
    },
    {
      Header: "Gross P&L",
      accessor: "grossPnl",
      width: "12.5%",
      align: "center",
    },
    {
      Header: "# of Trades",
      accessor: "noOfTrade",
      width: "12.5%",
      align: "center",
    },
    {
      Header: "Running Lots",
      accessor: "runningLots",
      width: "12.5%",
      align: "center",
    },
    {
      Header: "Abs.Running Lots",
      accessor: "absRunningLots",
      width: "12.5%",
      align: "center",
    },
    {
      Header: "Lots Used",
      accessor: "lotUsed",
      width: "12.5%",
      align: "center",
    },
    {
      Header: "Brokerage",
      accessor: "brokerage",
      width: "12.5%",
      align: "center",
    },
    { Header: "Net P&L", accessor: "netPnl", width: "12.5%", align: "center" },
  ];
  let rows = [];

  let baseUrl =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/";

  const [allTrade, setAllTrade] = useState([]);
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiUrl}getliveprice`)
      .then((res) => {
        setMarketData(res.data);
      })
      .catch((err) => {
        return new Error(err);
      });

    socket.on("tick", (data) => {
      //console.log("this is live market data", data);
      setMarketData((prevInstruments) => {
        const instrumentMap = new Map(
          prevInstruments.map((instrument) => [
            instrument.instrument_token,
            instrument,
          ])
        );
        data.forEach((instrument) => {
          instrumentMap.set(instrument.instrument_token, instrument);
        });
        return Array.from(instrumentMap.values());
      });
    });
  }, []);

  useEffect(() => {
    const fetchTradeData = () => {
      axios
        .get(`${apiUrl}papertrade/influencer/traderwisepnl`, {
          withCredentials: true,
        })
        .then((res) => {
          setAllTrade(res.data.data);
        })
        .catch((err) => {
          console.error(err);
          // Normally, just logging the error or setting some state to indicate an error is enough.
          // Throwing an error here won't be caught by anything since this is an asynchronous callback.
        });
    };

    // Call the function immediately to not wait 10 seconds for the first fetch
    fetchTradeData();

    // Set the interval to call the fetchTradeData function every 10 seconds
    const intervalId = setInterval(fetchTradeData, 10000); // 10000 milliseconds = 10 seconds

    // Return a cleanup function that clears the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   return () => {
  //       socket.close();
  //   }
  // }, [])

  let mapForParticularUser = new Map();
  for (let i = 0; i < allTrade.length; i++) {
    if (mapForParticularUser.has(allTrade[i]._id.traderId)) {
      let marketDataInstrument = marketData.filter((elem) => {
        return elem.instrument_token == Number(allTrade[i]._id.symbol);
      });

      let obj = mapForParticularUser.get(allTrade[i]._id.traderId);
      obj.totalPnl +=
        allTrade[i].amount +
        allTrade[i].lots * marketDataInstrument[0]?.last_price;
      obj.lotUsed += Math.abs(allTrade[i].lotUsed);
      obj.runninglots += allTrade[i].lots;
      obj.brokerage += allTrade[i].brokerage;
      obj.noOfTrade += allTrade[i].trades;
      obj.absRunninglots += Math.abs(allTrade[i].lots);
    } else {
      let marketDataInstrument = marketData.filter((elem) => {
        return (
          elem !== undefined &&
          elem.instrument_token === Number(allTrade[i]._id.symbol)
        );
      });
      mapForParticularUser.set(allTrade[i]._id.traderId, {
        name: allTrade[i]._id.name,
        totalPnl:
          allTrade[i].amount +
          allTrade[i].lots * marketDataInstrument[0]?.last_price,
        lotUsed: Math.abs(allTrade[i].lotUsed),
        runninglots: allTrade[i].lots,
        absRunninglots: Math.abs(allTrade[i].lots),
        brokerage: allTrade[i].brokerage,
        noOfTrade: allTrade[i].trades,
        userId: allTrade[i]._id.traderId,
        email: allTrade[i]._id.traderEmail,
        mobile: allTrade[i]._id.traderMobile,
      });
    }
  }

  let finalTraderPnl = [];
  for (let value of mapForParticularUser.values()) {
    finalTraderPnl.push(value);
  }

  finalTraderPnl.sort((a, b) => {
    return b.totalPnl - b.brokerage - (a.totalPnl - a.brokerage);
  });

  let totalGrossPnl = 0;
  let totalTransactionCost = 0;
  let totalNoRunningLots = 0;
  let totalTrades = 0;
  let totalLotsUsed = 0;
  let totalTraders = 0;
  let totalAbsRunningLots = 0;

  finalTraderPnl.map((subelem, index) => {
    let obj = {};
    let npnlcolor =
      subelem.totalPnl - subelem.brokerage >= 0 ? "success" : "error";
    let tradercolor =
      subelem.totalPnl - subelem.totalPnl >= 0 ? "success" : "error";
    let gpnlcolor = subelem.totalPnl >= 0 ? "success" : "error";
    let runninglotscolor =
      subelem.runninglots > 0
        ? "info"
        : subelem.runninglots < 0
        ? "error"
        : "dark";
    let runninglotsbgcolor = subelem.runninglots > 0 ? "#ffff00" : "";
    let traderbackgroundcolor = subelem.runninglots != 0 ? "white" : "#e0e1e5";

    totalGrossPnl += subelem.totalPnl;
    totalTransactionCost += subelem.brokerage;
    totalNoRunningLots += subelem.runninglots;
    totalLotsUsed += subelem.lotUsed;
    totalTrades += subelem.noOfTrade;
    totalTraders += 1;
    totalAbsRunningLots += subelem.absRunninglots;

    obj.traderName = (
      <MDTypography
        component="a"
        variant="caption"
        color={tradercolor}
        fontWeight="medium"
        backgroundColor={traderbackgroundcolor}
        padding="5px"
        borderRadius="5px"
      >
        {subelem?.name}
      </MDTypography>
    );

    obj.grossPnl = (
      <MDTypography
        component="a"
        variant="caption"
        color={gpnlcolor}
        fontWeight="medium"
      >
        {subelem.totalPnl >= 0.0
          ? "+₹" + subelem.totalPnl.toFixed(2)
          : "-₹" + (-subelem.totalPnl).toFixed(2)}
      </MDTypography>
    );

    obj.noOfTrade = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {subelem.noOfTrade}
      </MDTypography>
    );

    obj.runningLots = (
      <MDTypography
        component="a"
        variant="caption"
        color={runninglotscolor}
        backgroundColor={runninglotsbgcolor}
        fontWeight="medium"
      >
        {subelem.runninglots}
      </MDTypography>
    );

    obj.absRunningLots = (
      <MDTypography component="a" variant="caption" fontWeight="medium">
        {subelem.absRunninglots}
      </MDTypography>
    );

    obj.lotUsed = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {subelem.lotUsed}
      </MDTypography>
    );

    obj.brokerage = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {"₹" + subelem.brokerage.toFixed(2)}
      </MDTypography>
    );

    obj.netPnl = (
      <MDTypography
        component="a"
        variant="caption"
        color={npnlcolor}
        fontWeight="medium"
      >
        {subelem.totalPnl - subelem.brokerage >= 0.0
          ? "+₹" + (subelem.totalPnl - subelem.brokerage).toFixed(2)
          : "-₹" + (-(subelem.totalPnl - subelem.brokerage)).toFixed(2)}
      </MDTypography>
    );

    obj.email = (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {subelem?.email}
      </MDTypography>
    );

    obj.mobile = (
      <MDTypography component="a" variant="caption" fontWeight="medium">
        {subelem.mobile}
      </MDTypography>
    );

    rows.push(obj);
  });

  let obj = {};

  const totalGrossPnlcolor = totalGrossPnl >= 0 ? "success" : "error";
  const totalnetPnlcolor =
    totalGrossPnl - totalTransactionCost >= 0 ? "success" : "error";

  obj.traderName = (
    <MDTypography
      component="a"
      variant="caption"
      padding="5px"
      borderRadius="5px"
      backgroundColor="#e0e1e5"
      fontWeight="medium"
    >
      Traders : {totalTraders}
    </MDTypography>
  );

  obj.grossPnl = (
    <MDTypography
      component="a"
      variant="caption"
      color={totalGrossPnlcolor}
      padding="5px"
      borderRadius="5px"
      backgroundColor="#e0e1e5"
      fontWeight="medium"
    >
      {totalGrossPnl >= 0.0
        ? "+₹" + totalGrossPnl.toFixed(2)
        : "-₹" + (-totalGrossPnl).toFixed(2)}
    </MDTypography>
  );

  obj.noOfTrade = (
    <MDTypography
      component="a"
      variant="caption"
      padding="5px"
      borderRadius="5px"
      backgroundColor="#e0e1e5"
      fontWeight="medium"
    >
      {totalTrades}
    </MDTypography>
  );

  obj.runningLots = (
    <MDTypography
      component="a"
      variant="caption"
      color="dark"
      padding="5px"
      borderRadius="5px"
      backgroundColor="#e0e1e5"
      fontWeight="medium"
    >
      {totalNoRunningLots}
    </MDTypography>
  );

  obj.absRunningLots = (
    <MDTypography
      component="a"
      variant="caption"
      color="dark"
      padding="5px"
      borderRadius="5px"
      backgroundColor="#e0e1e5"
      fontWeight="medium"
    >
      {totalAbsRunningLots}
    </MDTypography>
  );

  obj.lotUsed = (
    <MDTypography
      component="a"
      variant="caption"
      color="dark"
      padding="5px"
      borderRadius="5px"
      backgroundColor="#e0e1e5"
      fontWeight="medium"
    >
      {totalLotsUsed}
    </MDTypography>
  );

  obj.brokerage = (
    <MDTypography
      component="a"
      variant="caption"
      color="dark"
      padding="5px"
      borderRadius="5px"
      backgroundColor="#e0e1e5"
      fontWeight="medium"
    >
      {"₹" + totalTransactionCost.toFixed(2)}
    </MDTypography>
  );

  obj.netPnl = (
    <MDTypography
      component="a"
      variant="caption"
      color={totalnetPnlcolor}
      padding="5px"
      borderRadius="5px"
      backgroundColor="#e0e1e5"
      fontWeight="medium"
    >
      {totalGrossPnl - totalTransactionCost >= 0.0
        ? "+₹" + (totalGrossPnl - totalTransactionCost).toFixed(2)
        : "-₹" + (-(totalGrossPnl - totalTransactionCost)).toFixed(2)}
    </MDTypography>
  );

  rows.push(obj);

  return (
    <Card>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={3}
      >
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Users' Live Trading Data
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* <MDBox sx={{display: 'flex', alignItems: 'center', marginLeft:'24px'}}>
        <MDTypography fontSize={15}>Select Batch</MDTypography>
        <TextField
                select
                label=""
                value={subscriptions[0]?.plan_name}
                minHeight="4em"
                //helperText="Please select the body condition"
                variant="outlined"
                sx={{margin: 1, padding: 1, width: "200px"}}
                onChange={(e)=>{setselectedSubscription(subscriptions.filter((item)=>item.plan_name == e.target.value)[0]._id)}}
        >
          {subscriptions?.map((option) => (
                <MenuItem key={option.plan_name} value={option.plan_name} minHeight="4em">
                  {option.plan_name}
                </MenuItem>
              ))}
        </TextField>          
      </MDBox> */}

      <MDBox>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
        />
      </MDBox>
    </Card>
  );
}
export default TraderwiseTraderPNL;
